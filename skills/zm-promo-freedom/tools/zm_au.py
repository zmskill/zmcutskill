"""zm_au.py — 几个量声音、量画面的小函数（zm 追加；只用 ffmpeg + numpy）。给 zm_music.py / zm_film_check.py / zm_sfx_levels.py 共用。"""
import subprocess
import numpy as np
SR = 22050
BANDS = [('低', 0, 150), ('中低', 150, 1000), ('中高', 1000, 4000), ('高', 4000, 11025)]

def load(path, start=0.0, dur=0.0, sr=SR):
    cmd = ['ffmpeg', '-v', 'error'] + (['-ss', str(start)] if start else []) + (['-t', str(dur)] if dur else []) + ['-i', path, '-vn', '-ac', '1', '-ar', str(sr), '-f', 's16le', '-']
    return np.frombuffer(subprocess.run(cmd, capture_output=True, check=True).stdout, '<i2').astype(np.float32) / 32768

def db(x):
    return float(20 * np.log10(np.sqrt(np.mean(np.square(x))) + 1e-7)) if len(x) else -140.0

def seg(x, a, b, sr=SR):
    return x[max(0, int(a * sr)):max(0, int(b * sr))]

def band_db(x, sr=SR):
    """一小段声音在四个频段里各有多响（dB）。"""
    if len(x) < 64: return [-140.0] * len(BANDS)
    n = len(x); X = np.abs(np.fft.rfft(x * np.hanning(n))) ** 2; f = np.fft.rfftfreq(n, 1 / sr)
    return [float(10 * np.log10(X[(f >= lo) & (f < hi)].sum() / n / n * 4 + 1e-14)) for _, lo, hi in BANDS]

def onsets(x, sr=SR, lo=None, hi=None):
    """起音强度曲线（每 256 采样一格）。lo/hi 限定频段。返回 (每格的时间, 强度)。"""
    hop, win = 256, 1024
    fr = np.lib.stride_tricks.sliding_window_view(x, win)[::hop] * np.hanning(win)
    S = np.log1p(np.abs(np.fft.rfft(fr, axis=1)) * 10); f = np.fft.rfftfreq(win, 1 / sr)
    m = np.ones(len(f), bool)
    if lo is not None: m &= f >= lo
    if hi is not None: m &= f < hi
    flux = np.r_[0, np.maximum(0, np.diff(S[:, m], axis=0)).sum(1)]
    return np.arange(len(flux)) * hop / sr, flux

def peaks(v, thr, gap):
    out = []
    for i in range(1, len(v) - 1):
        if v[i] >= thr and v[i] >= v[i - 1] and v[i] > v[i + 1] and (not out or i - out[-1] >= gap): out.append(i)
    return out

def motion(path, fps=30, w=160, h=90):
    """画面每一帧相对上一帧变了多少（统一抽成 30 帧/秒、160×90 灰度再量，不同帧率的片子可以互相比）。"""
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-an', '-vf', f'fps={fps},scale={w}:{h},format=gray', '-f', 'rawvideo', '-'], capture_output=True, check=True).stdout
    f = np.frombuffer(raw, np.uint8).reshape(-1, h, w).astype(np.float32)
    return np.r_[0, np.abs(np.diff(f, axis=0)).mean((1, 2))]

def grid_from(beats_json):
    """beats.json（beats.py / cut_song.py / beat_data.json 都行）→ (第 0 拍的秒, 一拍几秒)。时间要是成片里的秒。"""
    import json
    B = json.load(open(beats_json, encoding='utf-8'))
    if 'beats' in B and len(B['beats']) > 3:
        b = np.array([x['t'] if isinstance(x, dict) else x for x in B['beats']], float); k = np.arange(len(b))
        T, t0 = np.polyfit(k, b, 1); return float(t0), float(T)
    return float(B['t0']), float(B['T'])

def content_box(path, fps=5, w=320, h=180):
    """每 1/fps 秒量一次"画面里有内容的区域"：按边缘（相邻像素差）找出有东西的像素，取它们的包围框。
    返回 (时间, 包围框占画面的比例, 有内容像素占画面的比例)。纯色底、渐变底上只有一小块东西时，包围框就小。"""
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-an', '-vf', f'fps={fps},scale={w}:{h},format=gray', '-f', 'rawvideo', '-'], capture_output=True, check=True).stdout
    f = np.frombuffer(raw, np.uint8).reshape(-1, h, w).astype(np.float32); out = []
    for i, g in enumerate(f):
        e = np.zeros_like(g); e[:, 1:] += np.abs(np.diff(g, axis=1)); e[1:, :] += np.abs(np.diff(g, axis=0))
        m = e > 22; n = int(m.sum())
        if n < 0.002 * w * h: out.append((i / fps, 0.0, n / (w * h))); continue
        ys, xs = np.nonzero(m); x0, x1 = np.percentile(xs, [3, 97]); y0, y1 = np.percentile(ys, [3, 97])
        out.append((i / fps, float((x1 - x0) * (y1 - y0) / (w * h)), n / (w * h)))
    return out
