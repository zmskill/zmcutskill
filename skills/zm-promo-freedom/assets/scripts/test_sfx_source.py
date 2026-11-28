"""sfx-source.py 的离线检查（不联网）：python3 -m unittest discover -s assets/scripts -p 'test_sfx_source.py'
用手写的小段网页代替 Freesound，检查：解析、许可把关、下载前核对、不覆盖别人的文件、部分失败也保存成功的、测量准不准。"""
import argparse
import importlib.util
import io
import json
import math
import shutil
import struct
import tempfile
import unittest
import wave
from contextlib import redirect_stdout
from pathlib import Path
from unittest.mock import patch

_spec = importlib.util.spec_from_file_location("sfx_source", Path(__file__).with_name("sfx-source.py"))
src = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(src)

CC0 = "https://creativecommons.org/publicdomain/zero/1.0/"


def card(sid="123", dur="0.5"):
    """搜索结果 / 详情页里的播放器标签。"""
    return (f'<div data-sound-id="{sid}" data-username="Recordist" data-title="Paper &amp; card" data-duration="{dur}" '
            f'data-num-downloads="42" data-mp3="https://cdn.freesound.org/previews/0/{sid}_5-lq.mp3"></div>')


def hit(sid="123", dur="0.5", lic="Creative Commons 0"):
    """一条完整的搜索结果。"""
    return (f'<div class="extra bw-search__result">{card(sid, dur)}<a href="/people/Recordist/sounds/{sid}/">Paper</a>'
            f'<div title="License: {lic}"></div><div aria-label="Average rating of 4.5"></div><span class="bw-rating__count">(12)</span>'
            '<div class="max-h-60px-md-50px"><b>Dry</b> paper recorded in a room.</div></div>')


def first_div(html):
    return next(n for n in src.Document(html).root.nodes() if n.tag == "div")


class ParseTests(unittest.TestCase):
    def test_search_row(self):
        row = src.parse_search(src.Document(hit()))[0]
        self.assertEqual(row["title"], "Paper & card")
        self.assertEqual((row["duration_seconds"], row["rating_count"]), (0.5, 12))
        self.assertIn("Dry paper", row["description"])
        self.assertTrue(row["preview_url"].endswith("-hq.mp3"))   # 换成高质量预览

    def test_ratings_optional(self):
        self.assertEqual(src.stats([]), {"rating": None, "rating_count": None})
        page = src.Document('<span class="bw-rating__count">Overall rating (21 ratings)</span>')
        self.assertEqual(src.stats(list(page.root.nodes()))["rating_count"], 21)

    def test_no_results_vs_broken_page(self):
        self.assertEqual(src.parse_search(src.Document("<p>No results found</p>")), [])
        for html in ("<p>Temporarily unavailable</p>", '<div class="bw-search__result">markup changed</div>'):
            with self.assertRaises(ValueError):
                src.parse_search(src.Document(html))

    def test_bad_ids_and_metadata(self):
        for bad in ("../x", "fs:-2", "https://example.com/123"):
            with self.assertRaises(ValueError):
                src.sound_id(bad)
        for html in (card().replace("cdn.freesound.org", "evil.example"), card(dur="nan")):
            with self.assertRaises(ValueError):
                src.player_data(first_div(html))


class SearchTests(unittest.TestCase):
    def test_local_filter_dedupe_and_order(self):
        # 124 太长、125 是 NC 许可、123 重复：只剩 123、126，顺序不变
        html = hit("123") + hit("124", "8") + hit("125", lic="Attribution NonCommercial") + hit("126") + hit("123")
        args = argparse.Namespace(query="paper", license="cc0", min_duration=0, max_duration=1, pages=1, limit=5, output=None)
        with patch.object(src, "web_page", return_value=(src.Document(html), src.SITE)), redirect_stdout(io.StringIO()) as out:
            self.assertEqual(src.search(args), 0)
        self.assertEqual([r["id"] for r in json.loads(out.getvalue())["results"]], ["fs:123", "fs:126"])


class LicenseTests(unittest.TestCase):
    def test_codes(self):
        self.assertEqual(src.license_code("http://creativecommons.org/licenses/by/3.0/"), "CC-BY-3.0")
        self.assertEqual(src.license_code(CC0), "CC0-1.0")
        for url in ("https://creativecommons.org/licenses/by-nc/4.0/", "https://example.com/licenses/by/4.0/", "",
                    "https://creativecommons.org/licenses/by-sa/4.0/"):
            self.assertIsNone(src.license_code(url))

    def test_policy(self):
        src.check_license("CC0-1.0", "cc0")
        src.check_license("CC-BY-4.0", "by")
        for code in (None, "CC-BY-4.0", "BY-NC"):
            with self.assertRaises(ValueError):
                src.check_license(code, "cc0")

    def test_detail_reads_real_license_and_author(self):
        url = "http://creativecommons.org/licenses/by/3.0/"
        page = src.Document(card().replace('data-username="Recordist"', 'data-username=""') + f'<a href="{url}">Attribution</a>')
        with patch.object(src, "web_page", return_value=(page, src.SITE + "/people/Recordist/sounds/123/")):
            row = src.detail("123")
        self.assertEqual((row["license"], row["license_url"], row["author"]), ("CC-BY-3.0", url, "Recordist"))


class DownloadTests(unittest.TestCase):
    ROW = {"id": "fs:123", "license": "CC0-1.0", "preview_url": "https://cdn.freesound.org/previews/0/123_5-hq.mp3"}

    def test_wrong_license_never_downloads(self):
        with tempfile.TemporaryDirectory() as d, patch.object(src, "detail", return_value={"license": "CC-BY-3.0"}), \
                patch.object(src, "request") as req:
            with self.assertRaises(ValueError):
                src.download_one("123", Path(d), "cc0", [])
            req.assert_not_called()

    def test_records_provenance_and_protects_edits(self):
        with tempfile.TemporaryDirectory() as d, patch.object(src, "detail", return_value=dict(self.ROW)), \
                patch.object(src, "analyze", return_value={"codec": "mp3"}), \
                patch.object(src, "request", return_value=(b"audio", self.ROW["preview_url"], "audio/mpeg")):
            out = Path(d)
            rec = src.download_one("123", out, "cc0", [])
            self.assertTrue(rec["is_preview"])
            self.assertEqual(rec["sha256"], src.digest(out / rec["file"]))
            (out / rec["file"]).write_bytes(b"user edit")      # 用户改过这个文件
            with self.assertRaises(ValueError):
                src.download_one("123", out, "cc0", [rec])
            self.assertEqual((out / rec["file"]).read_bytes(), b"user edit")

    def test_html_error_page_is_not_saved(self):
        with tempfile.TemporaryDirectory() as d, patch.object(src, "detail", return_value=dict(self.ROW)), \
                patch.object(src, "request", return_value=(b"<html>Error</html>", self.ROW["preview_url"], "text/html")):
            with self.assertRaises(ValueError):
                src.download_one("123", Path(d), "cc0", [])
            self.assertFalse((Path(d) / "fs-123.mp3").exists())

    def test_partial_failure_keeps_successes(self):
        rec = {"id": "fs:123", "file": "fs-123.mp3", "title": "Paper", "author": "Recordist",
               "page_url": "https://freesound.org/s/123/", "license": "CC0-1.0", "license_url": CC0}

        def fake(sid, *_):
            if sid == "124":
                raise ValueError("license unavailable")
            return rec
        with tempfile.TemporaryDirectory() as d, patch.object(src, "require_audio_tools"), \
                patch.object(src, "download_one", side_effect=fake), redirect_stdout(io.StringIO()):
            self.assertEqual(src.get(argparse.Namespace(ids=["123", "124", "123"], out_dir=d, license="cc0", workers=1)), 1)
            self.assertEqual(json.loads((Path(d) / src.MANIFEST).read_text())["assets"], [rec])
            self.assertIn(CC0, (Path(d) / src.CREDITS).read_text())
            self.assertFalse((Path(d) / src.LOCK).exists())

    def test_second_download_in_same_folder_is_refused(self):
        with tempfile.TemporaryDirectory() as d, patch.object(src, "require_audio_tools"):
            lock = Path(d) / src.LOCK
            lock.touch()
            with self.assertRaises(ValueError):
                src.get(argparse.Namespace(ids=["123"], out_dir=d))
            self.assertTrue(lock.exists())


@unittest.skipUnless(shutil.which("ffmpeg") and shutil.which("ffprobe"), "需要 ffmpeg / ffprobe")
class MeasureTests(unittest.TestCase):
    def test_stereo_burst_in_opposite_phase(self):
        # 1 秒的立体声，0.25–0.35 秒有一段左右相位相反的 1 kHz：混成单声道会抵消成静音，这里不能
        with tempfile.TemporaryDirectory() as d:
            p = Path(d) / "burst.wav"
            with wave.open(str(p), "wb") as w:
                w.setparams((2, 2, 48000, 0, "NONE", "not compressed"))
                frames = []
                for i in range(48000):
                    v = int(16384 * math.sin(2 * math.pi * 1000 * i / 48000)) if 12000 <= i < 16800 else 0
                    frames.append(struct.pack("<hh", v, -v))
                w.writeframes(b"".join(frames))
            m = src.analyze(p)
            self.assertAlmostEqual(m["duration_seconds"], 1)
            self.assertAlmostEqual(m["sample_peak_dbfs"], -6.021, places=2)
            self.assertTrue(0.25 <= m["energy_peak_seconds"] <= 0.35)
            self.assertAlmostEqual(m["active_start_seconds"], 0.25)
            self.assertAlmostEqual(m["active_end_seconds"], 0.35)


if __name__ == "__main__":
    unittest.main()
