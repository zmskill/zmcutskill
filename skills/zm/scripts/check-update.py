#!/usr/bin/env python3
"""check-update.py — zmcutskill 24 小时静默版本检查（跨平台，仅依赖标准库）。

用法：
  python3 check-update.py <本地版本号> [--force] [--url <自定义UPDATE.json地址>]

规则：
- 24 小时内只请求一次网络（时间戳保存在 ~/.zmcutskill/update_check_at）。
- 网络不通、超时或解析失败时静默退出（退出码 0，无任何输出），绝不影响正常做片。
- 仅当远端版本号高于本地版本号时，输出一行更新提醒。
"""
import argparse
import json
import os
import re
import time
import urllib.request

DEFAULT_URL = "https://raw.githubusercontent.com/zmskill/zmcutskill/main/UPDATE.json"
CACHE_DIR = os.path.expanduser("~/.zmcutskill")
STAMP_FILE = os.path.join(CACHE_DIR, "update_check_at")
INTERVAL_SEC = 24 * 3600


def parse_ver(s: str):
    nums = [int(x) for x in re.findall(r"\d+", s or "")]
    return tuple(nums[:3]) if nums else (0, 0, 0)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("local_version", nargs="?", default="1.3.0")
    ap.add_argument("--force", action="store_true")
    ap.add_argument("--url", default=DEFAULT_URL)
    args = ap.parse_args()

    now = time.time()
    if not args.force and os.path.exists(STAMP_FILE):
        try:
            last = float(open(STAMP_FILE, encoding="utf-8").read().strip())
            if now - last < INTERVAL_SEC:
                return
        except Exception:
            pass

    try:
        req = urllib.request.Request(args.url, headers={"User-Agent": "zmcutskill-update-check/1.0"})
        with urllib.request.urlopen(req, timeout=3) as resp:
            data = json.loads(resp.read().decode("utf-8"))
    except Exception:
        return

    try:
        os.makedirs(CACHE_DIR, exist_ok=True)
        with open(STAMP_FILE, "w", encoding="utf-8") as f:
            f.write(str(int(now)))
    except Exception:
        pass

    remote_ver = str(data.get("version", "")).strip()
    if parse_ver(remote_ver) > parse_ver(args.local_version):
        highlights = str(data.get("highlights", "")).strip()
        msg = f"发现 zmcutskill 新版本 {remote_ver}"
        if highlights:
            msg += f"（{highlights}）"
        msg += "，回复 1 即可一键更新。"
        print(msg)


if __name__ == "__main__":
    main()
