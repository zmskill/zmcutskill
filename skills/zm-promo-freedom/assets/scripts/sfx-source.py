#!/usr/bin/env python3
"""从 Freesound 找音效、把预览 MP3 下载进片子工程，并记下来源、许可、哈希和测量值。
本地音效库（assets/sfx-library/）里没有合适的，才用它（见 references/sound-and-sfx.md）。

  search  在 Freesound 网页上搜，输出候选（只看公开网页，不用 API key、不登录）
  get     按 ID 下载到片子工程：下载前重新核对许可，写 audio-manifest.json 和 FREESOUND-CREDITS.md
  analyze 量一个音频文件：时长、峰值、整体 RMS、最响的 10 毫秒在哪、有声段从哪到哪（不是 LUFS / true peak）

只用 Python 标准库；get / analyze 还要 ffmpeg 和 ffprobe。
"""
import argparse
import array
import hashlib
import json
import math
import re
import shutil
import subprocess
import sys
import tempfile
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlencode, urljoin, urlparse
from urllib.request import Request, urlopen

SITE = "https://freesound.org"
MANIFEST = "audio-manifest.json"
CREDITS = "FREESOUND-CREDITS.md"
LIMIT_BYTES = 32 * 1024 * 1024
LOCK = ".freesound-download.lock"
NO_CLOSE = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"}
CC_HOSTS = {"creativecommons.org", "www.creativecommons.org"}
now = lambda: datetime.now(timezone.utc).isoformat()


# ── 网页解析：把 HTML 读成一棵简单的树 ──
class Node:
    def __init__(self, tag="root", attrs=()):
        self.tag, self.attrs, self.children = tag, dict(attrs), []

    def nodes(self):
        """自己和所有后代（深度优先）。"""
        stack = [self]
        while stack:
            node = stack.pop()
            yield node
            stack.extend(reversed([c for c in node.children if isinstance(c, Node)]))

    def text(self):
        return " ".join(c.text() if isinstance(c, Node) else c for c in self.children).strip()

    def has_class(self, name):
        return name in (self.attrs.get("class") or "").split()


class Document(HTMLParser):
    def __init__(self, html):
        super().__init__(convert_charrefs=True)
        self.root = Node()
        self._open = [self.root]
        self.feed(html)
        self.close()

    def handle_starttag(self, tag, attrs):
        node = Node(tag, attrs)
        self._open[-1].children.append(node)
        if tag not in NO_CLOSE:
            self._open.append(node)

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        if tag not in NO_CLOSE:
            self.handle_endtag(tag)

    def handle_endtag(self, tag):
        # 关到最近一个同名的标签；没配对的结束标签忽略
        for depth in range(len(self._open) - 1, 0, -1):
            if self._open[depth].tag == tag:
                del self._open[depth:]
                return

    def handle_data(self, data):
        self._open[-1].children.append(data)


# ── 网络 ──
def request(url):
    """下载一个地址，最多 32 MiB。返回（内容，最终地址，类型）。"""
    with urlopen(Request(url, headers={"User-Agent": "zm-promo/1.0 (sfx sourcing)"}), timeout=30) as resp:
        body = resp.read(LIMIT_BYTES + 1)
        if len(body) > LIMIT_BYTES:
            raise ValueError("返回内容超过 32 MiB：换一个短一点的音效，或手动下载原文件")
        return body, resp.geturl(), resp.headers.get_content_type()


def web_page(url):
    body, final, kind = request(url)
    if urlparse(final).hostname != "freesound.org" or kind != "text/html":
        raise ValueError("拿到的不是 Freesound 的网页")
    return Document(body.decode("utf-8")), final


# ── ID、许可 ──
def sound_id(value):
    value = value[3:] if value.startswith("fs:") else value
    if not re.fullmatch(r"[1-9]\d*", value):
        raise ValueError(f"Freesound ID 不对：{value!r}，写成 fs:12345")
    return value


def license_code(url):
    """许可链接 → CC0-1.0 / CC-BY-x.x；别的（NC、SA、不是 creativecommons.org）一律 None。"""
    u = urlparse(url)
    if u.scheme not in ("http", "https") or u.hostname not in CC_HOSTS:
        return None
    p = u.path.rstrip("/")
    if p == "/publicdomain/zero/1.0":
        return "CC0-1.0"
    m = re.fullmatch(r"/licenses/by/(1\.0|2\.0|2\.5|3\.0|4\.0)", p)
    return f"CC-BY-{m.group(1)}" if m else None


def check_license(code, policy):
    ok = code == "CC0-1.0" or (policy == "by" and bool(code) and code.startswith("CC-BY-"))
    if not ok:
        raise ValueError(f"许可 {code or '不明'} 不在 --license {policy} 允许的范围里（要用 CC BY 得加 --license by）")


# ── 从网页里取音效信息 ──
def player_data(node, page_author=None):
    a = node.attrs
    sid = sound_id(a["data-sound-id"])
    title = a.get("data-title")
    author = page_author or a.get("data-username")
    dur = float(a["data-duration"])
    if not title or not author or not math.isfinite(dur) or dur <= 0:
        raise ValueError(f"fs:{sid} 的信息不全")
    mp3 = a.get("data-mp3", "")
    u = urlparse(mp3)
    if u.scheme != "https" or u.hostname != "cdn.freesound.org" or not re.fullmatch(rf"/previews/\d+/{sid}_\d+-(lq|hq)\.mp3", u.path):
        raise ValueError(f"fs:{sid} 的预览地址不对")
    return {"id": f"fs:{sid}", "title": title, "author": author, "duration_seconds": dur,
            "preview_url": mp3.replace("-lq.mp3", "-hq.mp3"), "downloads": int(a.get("data-num-downloads") or 0)}


def stats(nodes):
    """评分和评分人数，没有就是 None。"""
    rating = count = None
    for n in nodes:
        label = n.attrs.get("aria-label") or ""
        if label.startswith("Average rating of "):
            rating = float(label[len("Average rating of "):])
        if n.has_class("bw-rating__count"):
            m = re.search(r"\((\d+)(?: ratings?)?\)", n.text())
            if m:
                count = int(m.group(1))
    return {"rating": rating, "rating_count": count}


def parse_search(doc):
    rows = []
    for block in (n for n in doc.root.nodes() if n.has_class("bw-search__result")):
        inside = list(block.nodes())
        node = next((n for n in inside if n.attrs.get("data-sound-id")), None)
        if node is None:
            raise ValueError("Freesound 搜索页的结构变了：结果里找不到音效信息")
        row = player_data(node)
        sid = sound_id(row["id"])
        hrefs = [urljoin(SITE, n.attrs.get("href") or "") for n in inside if n.tag == "a"]
        row["page_url"] = next((h for h in hrefs if h.endswith(f"/sounds/{sid}/")), None)
        row["license_label"] = next((n.attrs["title"][len("License: "):] for n in inside if (n.attrs.get("title") or "").startswith("License: ")), "unknown")
        desc = next((n for n in inside if any(c.startswith("max-h-60px") for c in (n.attrs.get("class") or "").split())), None)
        row["description"] = " ".join((desc.attrs.get("title") or desc.text()).split()) if desc else ""
        row.update(stats(inside))
        rows.append(row)
    if not rows and not re.search(r"no (?:sounds|results)|0 sounds|couldn't find|did not match", doc.root.text(), re.I):
        raise ValueError("认不出搜索结果：Freesound 可能打不开，或者网页结构变了")
    return rows


def search(args):
    allowed = {"Creative Commons 0", "Attribution"} if args.license == "by" else {"Creative Commons 0"}
    lic = 'license:("Creative Commons 0" OR "Attribution")' if args.license == "by" else 'license:"Creative Commons 0"'
    top = "*" if args.max_duration is None else args.max_duration
    filt = f"{lic} duration:[{args.min_duration} TO {top}]"
    seen = {}
    for page in range(1, args.pages + 1):
        doc, _ = web_page(f"{SITE}/search/?" + urlencode({"q": args.query, "f": filt, "page": page, "s": "Automatic by relevance"}))
        for row in parse_search(doc):
            d = row["duration_seconds"]
            # 网站的筛选不全信，本地再筛一遍许可和时长
            if row["license_label"] in allowed and d >= args.min_duration and (args.max_duration is None or d <= args.max_duration):
                seen.setdefault(row["id"], row)
    emit({"provider": "freesound", "query": args.query, "license_policy": args.license,
          "ordering": "relevance; popularity is supporting evidence only", "results": list(seen.values())[:args.limit]}, args.output)
    return 0


def detail(sid):
    """打开音效详情页，拿到真实的作者和许可链接（下载前一定重新核对，不信搜索结果里的）。"""
    doc, final = web_page(f"{SITE}/s/{sid}/")
    nodes = list(doc.root.nodes())
    node = next((n for n in nodes if n.attrs.get("data-sound-id") == sid and n.attrs.get("data-mp3")), None)
    m = re.fullmatch(rf"/people/([^/]+)/sounds/{sid}/", urlparse(final).path)
    if node is None or m is None:
        raise ValueError(f"找不到 fs:{sid} 的正式页面")
    row = player_data(node, unquote(m.group(1)))   # 大播放器上没有作者名，从页面地址里取
    row["page_url"] = final
    links = {n.attrs["href"] for n in nodes if n.tag == "a" and urlparse(n.attrs.get("href") or "").hostname in CC_HOSTS}
    if len(links) != 1:
        raise ValueError(f"fs:{sid} 的许可找不到或不止一个")
    row["license_url"] = links.pop()
    row["license"] = license_code(row["license_url"])
    row["description"] = next((n.attrs.get("content") or "" for n in nodes if n.attrs.get("name") == "twitter:description"), "")
    row.update(stats(nodes))
    return row


# ── 测量 ──
def require_audio_tools():
    if not (shutil.which("ffmpeg") and shutil.which("ffprobe")):
        raise ValueError("get / analyze 需要 ffmpeg 和 ffprobe")


def analyze(path):
    """解码后按 10 毫秒一块量：整体 RMS、样本峰值、最响一块在哪、有声段（比最响一块低 40 dB 以内）从哪到哪。
    不先混成单声道：左右相位相反的声音混了会互相抵消，量不准。"""
    require_audio_tools()
    path = Path(path).resolve()
    info = json.loads(subprocess.run(["ffprobe", "-v", "error", "-select_streams", "a:0", "-show_entries",
                                      "stream=codec_name,sample_rate,channels:format=duration", "-of", "json", str(path)],
                                     capture_output=True, text=True, check=True).stdout)
    st = info["streams"][0]
    ch = int(st["channels"])
    if not 1 <= ch <= 8:
        raise ValueError("要 1–8 声道的音频")
    rate, win = 48000, 0.01
    chunk = int(rate * win) * ch * 4
    rms_blocks, peak, total_sq, n = [], 0.0, 0.0, 0
    with tempfile.TemporaryFile() as err:
        with subprocess.Popen(["ffmpeg", "-v", "error", "-i", str(path), "-map", "0:a:0", "-ar", str(rate),
                               "-f", "f32le", "-acodec", "pcm_f32le", "pipe:1"], stdout=subprocess.PIPE, stderr=err) as proc:
            while True:
                raw = proc.stdout.read(chunk)
                if not raw:
                    break
                vals = array.array("f")
                vals.frombytes(raw)
                if sys.byteorder != "little":
                    vals.byteswap()
                sq = sum(v * v for v in vals)
                rms_blocks.append(math.sqrt(sq / len(vals)))
                peak = max(peak, max(abs(v) for v in vals))
                total_sq += sq
                n += len(vals)
            if proc.wait() != 0:
                err.seek(0)
                raise ValueError(err.read().decode("utf-8", errors="replace"))
    if not n or not peak:
        raise ValueError("音频是空的或没有声音")
    top = max(rms_blocks)
    loud = [i for i, e in enumerate(rms_blocks) if e >= top * 0.01]
    dur = n / (rate * ch)
    return {"codec": st["codec_name"], "sample_rate": int(st["sample_rate"]), "channels": ch,
            "duration_seconds": round(dur, 6), "sample_peak_dbfs": round(20 * math.log10(peak), 3),
            "rms_dbfs": round(20 * math.log10(math.sqrt(total_sq / n)), 3), "energy_window_seconds": win,
            "energy_peak_seconds": round(min(dur, (rms_blocks.index(top) + 0.5) * win), 6),
            "active_start_seconds": round(loud[0] * win, 6), "active_end_seconds": round(min(dur, (loud[-1] + 1) * win), 6),
            "activity_threshold_db_below_peak_rms": -40}


# ── 写文件 ──
def write_json(path, data):
    """先写临时文件再换名，写到一半出错也不会留下坏的 JSON。"""
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.NamedTemporaryFile("w", encoding="utf-8", dir=path.parent, delete=False) as tmp:
        json.dump(data, tmp, ensure_ascii=False, indent=2, allow_nan=False)
        tmp.write("\n")
    Path(tmp.name).replace(path)


def emit(data, output=None):
    if output:
        write_json(output, data)
    print(json.dumps(data, ensure_ascii=False, indent=2, allow_nan=False))


def digest(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def write_credits(out, rows):
    # 标题是上传者写的，放进代码块里，不让它变成 Markdown 链接
    lines = ["# Freesound audio credits", "", "Generated from audio-manifest.json; preserve with the video.", "",
             "CC BY entries require attribution in the published video's credits/description.", "",
             "Downloaded files are lossy MP3 previews, not uploader originals.", ""]
    for r in rows:
        edits = "; ".join(r.get("changes") or []) or "None recorded; update if edited."
        lines += ["~~~text", f"{r['file']} — {r['title']} by {r['author']}".replace("~", "\\~"), r["page_url"],
                  f"{r['license']}: {r['license_url']}", "Edits: " + edits, "~~~", ""]
    (out / CREDITS).write_text("\n".join(lines), encoding="utf-8")


# ── 下载 ──
def download_one(sid, out, policy, existing):
    row = detail(sid)
    check_license(row["license"], policy)          # 许可不合格，连音频都不去下
    target = out / f"fs-{sid}.mp3"
    old = next((r for r in existing if r["id"] == row["id"]), None)
    if target.exists():
        # 已经有这个文件：只认清单里记过、且没被改过的，否则不碰
        if old is None or old.get("file") != target.name or digest(target) != old.get("sha256"):
            raise ValueError(f"不覆盖清单里没有、或已经被改过的文件：{target}")
        return {**old, **row, "analysis": analyze(target), "license_checked_at": now()}
    body, final, kind = request(row["preview_url"])
    if urlparse(final).hostname != "cdn.freesound.org" or kind not in ("audio/mpeg", "audio/mp3", "application/octet-stream"):
        raise ValueError("下下来的不是 Freesound 的 MP3（可能是一张出错的网页）")
    with tempfile.NamedTemporaryFile(dir=out, suffix=".mp3", delete=False) as tmp:
        tmp.write(body)
        tmp_path = Path(tmp.name)
    try:
        measured = analyze(tmp_path)               # 能解码、确实是 MP3，才收下
        if measured["codec"] != "mp3":
            raise ValueError("预览不是 MP3")
        row.update({"provider": "freesound", "file": target.name, "sha256": digest(tmp_path), "download_url": final,
                    "download_kind": "mp3-preview-hq", "is_preview": True, "downloaded_at": now(),
                    "license_checked_at": now(), "changes": [], "analysis": measured})
        with target.open("xb") as f:               # 只新建，别人刚写的同名文件不会被覆盖
            f.write(body)
        return row
    finally:
        tmp_path.unlink(missing_ok=True)


def get(args):
    require_audio_tools()
    ids = list(dict.fromkeys(sound_id(v) for v in args.ids))
    out = Path(args.out_dir).resolve()
    out.mkdir(parents=True, exist_ok=True)
    lock = out / LOCK
    try:
        handle = lock.open("x")
    except FileExistsError:
        raise ValueError(f"{out} 里已经有一个下载在跑；确定上次是中途崩了，才删掉 {LOCK}")
    try:
        with handle:
            return _get(args, ids, out)
    finally:
        lock.unlink(missing_ok=True)


def _get(args, ids, out):
    mpath = out / MANIFEST
    manifest = json.loads(mpath.read_text(encoding="utf-8")) if mpath.exists() else {"version": 1, "assets": []}
    if manifest.get("version") != 1 or not isinstance(manifest.get("assets"), list):
        raise ValueError("清单格式不认识：换一个输出文件夹")
    before = manifest["assets"]

    def one(sid):
        try:
            return {"ok": True, "asset": download_one(sid, out, args.license, before)}
        except (OSError, ValueError, KeyError, IndexError, subprocess.SubprocessError) as e:
            return {"ok": False, "id": f"fs:{sid}", "error": str(e)}

    results = []
    with ThreadPoolExecutor(max_workers=args.workers) as pool:
        for res in pool.map(one, ids):
            results.append(res)
            if res["ok"]:   # 成功一个就存一个，后面失败了前面的也在
                a = res["asset"]
                manifest["assets"] = [r for r in manifest["assets"] if r["id"] != a["id"]] + [a]
                write_json(mpath, manifest)
                write_credits(out, manifest["assets"])
    emit({"out_dir": str(out), "results": results})
    return 0 if all(r["ok"] for r in results) else 1


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest="command", required=True)
    s = sub.add_parser("search", help="搜 Freesound，输出候选 JSON")
    s.add_argument("query")
    s.add_argument("--license", choices=("cc0", "by"), default="cc0", help="by = CC0 和 CC BY 都要")
    s.add_argument("--min-duration", type=float, default=0)
    s.add_argument("--max-duration", type=float)
    s.add_argument("--limit", type=int, default=8)
    s.add_argument("--pages", type=int, choices=range(1, 4), default=1)
    s.add_argument("--output", help="同时存到这个 JSON 文件")
    g = sub.add_parser("get", help="按 ID 下载，核对许可和音频，写清单和署名")
    g.add_argument("ids", nargs="+")
    g.add_argument("--out-dir", required=True, help="片子工程的 public/audio/sfx 文件夹")
    g.add_argument("--license", choices=("cc0", "by"), default="cc0")
    g.add_argument("--workers", type=int, choices=range(1, 5), default=3)
    a = sub.add_parser("analyze", help="量一个音频文件（10 毫秒 RMS 峰；不是 LUFS / true peak）")
    a.add_argument("file")
    a.add_argument("--output")
    args = ap.parse_args(argv)
    try:
        if args.command == "search":
            if not 1 <= args.limit <= 45 or not math.isfinite(args.min_duration) or args.min_duration < 0:
                raise ValueError("--limit 要在 1–45，--min-duration 不能是负数")
            if args.max_duration is not None and (not math.isfinite(args.max_duration) or args.max_duration <= args.min_duration):
                raise ValueError("--max-duration 要比 --min-duration 大")
            return search(args)
        if args.command == "get":
            return get(args)
        emit(analyze(args.file), args.output)
        return 0
    except (OSError, ValueError, KeyError, IndexError, subprocess.SubprocessError) as e:
        print(f"sfx-source: {e}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    sys.exit(main())
