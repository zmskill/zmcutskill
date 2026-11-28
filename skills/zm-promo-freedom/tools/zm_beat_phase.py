#!/usr/bin/env python3
"""zm_beat_phase.py — 查拍子格子有没有认歪、认到反拍上（zm 追加；只用 ffmpeg + numpy）。

beats.py 有时会把格子锁到反拍（两拍中间的开镲）上，这样全片每个卡点都会晚或早小半拍，而且量片时看不出来
（量片用的是同一套格子）。所以拿到 beats.json 后、剪歌和排时间线之前，先跑这个。

用法：
  python3 zm_beat_phase.py <歌或剪好的 music.wav> --beats <beats.json> [--offset 片子从歌里第几秒开始 --len 片长]（只量片子要用的那一段，最准） [--out analysis/beat_phase.md]

做法：看底鼓、中频、拍手这几样声音"冒出来"的时刻落在一拍里的哪个位置。落在格子上 = 对的；
差 1/8 拍以上 = 格子歪了，按它给的数把每一拍的时间挪过去后重跑，直到通过。
退出码：0 = 对的；1 = 歪了；2 = 这首歌起音太弱，量不出来（安静的歌常见，照实写进没做清单，请用户听一下卡点）。
"""
import argparse, os, sys
import numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import zm_au as au

def phase(x, lo, hi, t0, T, beats=None):
    """这个频段的声音"冒出来"的时刻落在一拍里的哪个位置。返回 (离格子差几秒，-T/2…T/2；对得有多清楚 = 最高的位置比中位高几倍)。"""
    sr = au.SR; X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / sr); X[(f < lo) | (f >= hi)] = 0; y = np.fft.irfft(X, len(x))
    e = np.sqrt(np.convolve(y * y, np.ones(256) / 256, 'same'))[::64]; t = np.arange(len(e)) * 64 / sr
    d = np.maximum(0, np.diff(np.log(e + 1e-4), prepend=0)) * e            # 上升得多、本身又响的地方
    pos = np.interp(t, beats, np.arange(len(beats))) if beats is not None else (t - t0) / T   # 有逐拍时间就按逐拍算（歌的速度会飘）
    if beats is not None: d = d * ((t >= beats[0]) & (t <= beats[-1]))
    h, _ = np.histogram(pos % 1, bins=48, range=(0, 1), weights=d)
    h = np.convolve(np.r_[h[-1], h, h[0]], [0.25, 0.5, 0.25], 'valid'); i = int(h.argmax()); ph = (i + 0.5) / 48
    if ph >= 0.5: ph -= 1
    return ph * T, float(h[i] / (np.median(h) + 1e-12))

def main():
    ap = argparse.ArgumentParser(); ap.add_argument('song'); ap.add_argument('--beats', required=True)
    ap.add_argument('--offset', type=float, default=0); ap.add_argument('--len', type=float, default=0); ap.add_argument('--out', default='analysis/beat_phase.md'); a = ap.parse_args()
    x = au.load(a.song, a.offset, a.len); t0, T = au.grid_from(a.beats); t0 -= a.offset
    import json; B = json.load(open(a.beats, encoding='utf-8')).get('beats') or []
    beats = np.array([b['t'] if isinstance(b, dict) else b for b in B], float) - a.offset if len(B) > 3 else None
    out = [f'# 拍子格子核对\n\n- 歌：{os.path.basename(a.song)}，一拍 {T:.4f} 秒（{60 / T:.1f} 拍/分）\n',
           '| 用什么量 | 它落在格子的 | 合多少拍 | 对得清不清楚 |', '|---|---|---|---|']
    res = {}
    for name, lo, hi in (('底鼓（40–150 Hz）', 40, 150), ('中频（150–1000 Hz）', 150, 1000), ('拍手、军鼓（1.5–4 kHz）', 1500, 4000), ('镲（6 kHz 以上，只作参考）', 6000, 11000)):
        s, c = phase(x, lo, hi, t0, T, beats); res[name[:2]] = (s, c)
        out.append(f'| {name} | {"后" if s > 0 else "前"} {abs(s) * 1000:.0f} 毫秒 | {s / T:+.2f} | {c:.1f} 倍 |')
    cand = [(n, *res[n]) for n in ('底鼓', '中频', '拍手') if res[n][1] >= 3]      # 镲常常打在反拍上，不拿它定
    if not cand:
        out.append('\n**量不出来。** 这一段里鼓点的位置不集中：可能是安静的歌，也可能是量的这段太长、中间有停顿或速度在飘。只量片子要用的那一段（--offset、--len）再试；还是量不出来，就照实写进没做清单，请用户听一下卡点在不在拍上。'); code = 2
    else:
        n, s, c = cand[0]; off = [k for k in cand if abs(k[1]) > T / 8]
        if abs(s) > T / 8:
            out.append(f'\n**格子歪了。** 「{n}」落在格子{"后" if s > 0 else "前"} {abs(s) * 1000:.0f} 毫秒（{s / T:+.2f} 拍）；'
                       + ('差了差不多半拍，是认到反拍上了。' if abs(abs(s) - T / 2) < T / 6 else '')
                       + f'把 beats.json 里每一拍的时间（或 t0）加上 {s:+.3f} 秒，重跑这个工具，直到通过；通过前不要剪歌、不要排时间线。'); code = 1
        else:
            out.append(f'\n**通过。** 「{n}」和格子差 {abs(s) * 1000:.0f} 毫秒（{abs(s) * 30:.1f} 帧），在 1/8 拍以内。'
                       + (f'（注意：{"、".join(k[0] for k in off)} 不在格子上，这首歌可能有切分；拿不准就请用户听一下。）' if off else '')); code = 0
    txt = '\n'.join(out) + '\n'; print(txt)
    os.makedirs(os.path.dirname(os.path.abspath(a.out)), exist_ok=True); open(a.out, 'w', encoding='utf-8').write(txt); sys.exit(code)

if __name__ == '__main__':
    main()
