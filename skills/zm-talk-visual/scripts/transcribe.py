#!/usr/bin/env python3
"""离线转写：VAD 分句（transcript.txt）+ 逐字时间戳（tokens.json）。

依赖 scripts/setup_asr.sh 下载的 sherpa-onnx + SenseVoice。
用法：transcribe.py 口播.mp4 项目文件/ [--asr-dir ~/.cache/zm-talk-visual/asr]
"""
from __future__ import annotations
import argparse, json, os, pathlib, re, subprocess, tempfile
import os as _os, sys as _sys; _sys.path.insert(0, _os.path.dirname(_os.path.abspath(__file__))); from _ff import FFMPEG

MODEL = "sherpa-onnx-sense-voice-zh-en-ja-ko-yue-int8-2024-07-17"


def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0: raise SystemExit(r.stderr[-2000:])
    return r.stdout + r.stderr


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("video", type=pathlib.Path); ap.add_argument("out", type=pathlib.Path)
    ap.add_argument("--asr-dir", type=pathlib.Path, default=pathlib.Path(os.environ.get("VK_ASR_DIR", pathlib.Path.home() / ".cache/zm-talk-visual/asr")))
    ap.add_argument("--window", type=float, default=28.0, help="单次识别最长秒数")
    ap.add_argument("--threads", type=int, default=2)
    a = ap.parse_args()
    d = a.asr_dir; bin_ = d / "runtime" / "bin"; m = d / MODEL
    if not (bin_ / "sherpa-onnx-offline").exists():
        raise SystemExit(f"未找到 ASR：{d}。先运行 scripts/setup_asr.sh（下载约 670 MB、装好占约 2.1 GB，先问用户）")
    a.out.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory() as tmp:
        wav = pathlib.Path(tmp) / "a.wav"
        run([FFMPEG, "-loglevel", "error", "-y", "-i", str(a.video), "-ac", "1", "-ar", "16000", str(wav)])
        # 1) VAD 分句
        out = run([str(bin_ / "sherpa-onnx-vad-with-offline-asr"), f"--silero-vad-model={d/'silero_vad.onnx'}",
                   "--silero-vad-min-silence-duration=0.3", "--silero-vad-max-speech-duration=8",
                   f"--sense-voice-model={m/'model.int8.onnx'}", "--sense-voice-use-itn=1", f"--tokens={m/'tokens.txt'}",
                   f"--num-threads={a.threads}", str(wav)])
        lines = [(float(x), float(y), t.strip()) for x, y, t in re.findall(r"^([\d.]+) -- ([\d.]+): (.+)$", out, re.M)]
        (a.out / "transcript.txt").write_text("\n".join(f"{x:.3f} -- {y:.3f}: {t}" for x, y, t in lines) + "\n", encoding="utf-8")
        # 2) 按静音点切窗口，逐字时间
        wins, cur = [], None
        for x, y, _ in lines:
            if cur is None: cur = [max(0, x - 0.1), y]
            elif y - cur[0] > a.window: wins.append(cur); cur = [max(0, x - 0.1), y]
            else: cur[1] = y
        if cur: wins.append(cur)
        toks = []
        for s, e in wins:
            seg = pathlib.Path(tmp) / "w.wav"
            run([FFMPEG, "-loglevel", "error", "-y", "-ss", f"{s:.3f}", "-to", f"{e + 0.2:.3f}", "-i", str(wav), str(seg)])
            o = run([str(bin_ / "sherpa-onnx-offline"), f"--sense-voice-model={m/'model.int8.onnx'}", f"--tokens={m/'tokens.txt'}",
                     "--sense-voice-use-itn=0", f"--num-threads={a.threads}", str(seg)])
            j = json.loads(next(l for l in o.splitlines() if l.startswith("{")))
            toks += [[tk, round(ts + s, 3)] for tk, ts in zip(j["tokens"], j["timestamps"])]
        (a.out / "tokens.json").write_text(json.dumps(toks, ensure_ascii=False), encoding="utf-8")
    print(f"{len(lines)} 句, {len(toks)} 字 -> {a.out}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
