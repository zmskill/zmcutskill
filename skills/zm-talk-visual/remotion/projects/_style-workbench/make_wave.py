# 时间线上的真波形：每秒 30 个 0–1 的数（响度包络）。用法：python3 make_wave.py <初剪.mp4 或音频> wave.json [键名，默认 voice]
# 已有 wave.json 时只更新这个键（比如再加一首证据歌：python3 make_wave.py 歌.mp3 wave.json song1）。
import json, os, subprocess, sys
import numpy as np
import os as _os, sys as _sys; _sys.path.insert(0, _os.path.join(_os.path.dirname(_os.path.abspath(__file__)), '../../../scripts')); from _ff import FFMPEG
src, out = sys.argv[1], sys.argv[2]; key = sys.argv[3] if len(sys.argv) > 3 else 'voice'
SR = 16000
x = np.frombuffer(subprocess.run([FFMPEG, '-v', 'error', '-i', src, '-f', 'f32le', '-ac', '1', '-ar', str(SR), '-'], capture_output=True, check=True).stdout, np.float32)
hop = SR // 30
r = np.array([np.sqrt((x[i:i + hop] ** 2).mean() + 1e-12) for i in range(0, len(x) - hop + 1, hop)])
db = 20 * np.log10(r + 1e-9); top = np.percentile(db, 99)
v = np.clip((db - (top - 40)) / 40, 0, 1)            # 最响处往下 40 分贝铺成 0–1
d = json.load(open(out)) if os.path.exists(out) else {}
d[key] = [round(float(a), 3) for a in v]
json.dump(d, open(out, 'w'))
print(key, len(v), '帧')
