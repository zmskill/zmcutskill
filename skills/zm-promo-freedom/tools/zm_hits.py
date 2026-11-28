#!/usr/bin/env python3
"""zm_hits.py — 从波形里实测每一拍真正"响起来"的时刻（zm 追加；只用 ffmpeg + numpy）。

算出来的拍子格子是等间隔的，真实的鼓点常常比格子早或晚几十毫秒（一帧 = 33 毫秒）。卡点要对实测的时刻，不是对格子。

用法：
  python3 zm_hits.py <剪好的 music.wav> --beats <beats.json> [--offset 片子从歌里第几秒开始] [--out analysis/hits.json]

输出 analysis/hits.json 和 analysis/hits.ts：
  HIT[k]  = 第 k 拍实测的帧号（小数）。这一拍有清楚的鼓点就是实测值；没有就用"格子 + 全曲偏差的中位数"。
  STRONG  = 全曲最重的那些拍（放大变化、连打用）。
工程里：import {HIT, STRONG, hitF, onF} from './hits';  画面上的事用 onF(拍号)（比声音早 1 帧），音效用 hitF(拍号)；不要用等间隔格子。
"""
import argparse, json, os, sys
import numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import zm_au as au

def rise(x, lo, hi):
    sr = au.SR; X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / sr); X[(f < lo) | (f >= hi)] = 0; y = np.fft.irfft(X, len(x))
    e = np.sqrt(np.convolve(y * y, np.ones(256) / 256, 'same'))[::32]; t = np.arange(len(e)) * 32 / sr
    return t, np.maximum(0, np.diff(e, prepend=0))

def main():
    ap = argparse.ArgumentParser(); ap.add_argument('song'); ap.add_argument('--beats', required=True); ap.add_argument('--offset', type=float, default=0)
    ap.add_argument('--out', default='analysis/hits.json'); ap.add_argument('--fps', type=float, default=30); a = ap.parse_args()
    x = au.load(a.song); dur = len(x) / au.SR; t0, T = au.grid_from(a.beats); t0 -= a.offset
    B = json.load(open(a.beats, encoding='utf-8')).get('beats') or []
    grid = [(b['t'] if isinstance(b, dict) else b) - a.offset for b in B] if len(B) > 3 else [t0 + k * T for k in range(int((dur - t0) / T) + 1)]
    grid = [g for g in grid if -T / 2 <= g < dur]
    t, d1 = rise(x, 40, 150); _, d2 = rise(x, 1500, 4000); d = d1 / (np.percentile(d1, 99) + 1e-9) + d2 / (np.percentile(d2, 99) + 1e-9)
    floor = np.percentile(d, 90); rows = []
    for k, g in enumerate(grid):
        m = (t >= g - T / 4) & (t <= g + T / 4)
        if not m.any(): rows.append(dict(拍=k, 格子秒=round(g, 4), 实测秒=None, 力度=0.0)); continue
        i = int(np.argmax(d[m])); v = float(d[m][i]); tt = float(t[m][i])
        j = int(np.searchsorted(t, tt)); thr = v * 0.25
        while j > 0 and d[j - 1] > thr: j -= 1          # 往回找到这一下刚开始冒头的地方
        rows.append(dict(拍=k, 格子秒=round(g, 4), 实测秒=round(float(t[j]), 4) if v > floor * 1.5 else None, 力度=round(v, 2)))
    offs = [r['实测秒'] - r['格子秒'] for r in rows if r['实测秒'] is not None]
    med = float(np.median(offs)) if offs else 0.0
    for r in rows:
        r['用这个秒'] = r['实测秒'] if r['实测秒'] is not None and abs(r['实测秒'] - r['格子秒'] - med) < 0.06 else round(r['格子秒'] + med, 4)
        r['帧'] = round(r['用这个秒'] * a.fps, 2)
    pw = sorted((r for r in rows if r['实测秒'] is not None), key=lambda r: -r['力度']); strong = sorted(r['拍'] for r in pw[:max(4, len(rows) // 6)])
    out = dict(歌=os.path.basename(a.song), 一拍秒=round(T, 5), 实测比格子晚_毫秒_中位=round(med * 1000, 1), 实测到的拍数=len(offs), 总拍数=len(rows), 最重的拍=strong, 拍=rows)
    os.makedirs(os.path.dirname(os.path.abspath(a.out)), exist_ok=True); json.dump(out, open(a.out, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    ts = ('// 由 zm_hits.py 生成：每一拍实测的帧号。卡点用 hitF(拍号)，不要用等间隔的格子。\n'
          f'export const HIT: number[] = {json.dumps([r["帧"] for r in rows])};\n'
          f'export const STRONG: number[] = {json.dumps(strong)};   // 全曲最重的拍\n'
          '// 画面上的事（切点、镜头最快的一刻、进场的顶点）用 onF：比声音早 1 帧。剪辑的老经验：切点放在拍子前 1–2 帧才"感觉"在拍上，晚一帧就显得拖。音效仍然用 hitF。\n'
          'export const onF = (beat: number): number => Math.round(hitF(beat)) - 1;\n'
          'export const hitF = (beat: number): number => { const i = Math.floor(beat), n = HIT.length; if (i < 0) return HIT[0] + beat * (HIT[1] - HIT[0]); if (i >= n - 1) return HIT[n - 1] + (beat - (n - 1)) * (HIT[n - 1] - HIT[n - 2]); return HIT[i] + (beat - i) * (HIT[i + 1] - HIT[i]); };\n')
    open(os.path.splitext(a.out)[0] + '.ts', 'w', encoding='utf-8').write(ts)
    print(f'实测到 {len(offs)}/{len(rows)} 拍；真实鼓点比格子{"晚" if med >= 0 else "早"} {abs(med) * 1000:.0f} 毫秒（{abs(med) * a.fps:.1f} 帧，中位）。最重的拍：{strong}')
    if len(offs) < len(rows) * 0.3: print('⚠ 实测到的拍不到三成：这首歌鼓点不清楚（安静的歌常见）。卡点改对"旋律换句、和弦换的地方"，请用户听一遍确认。')
    print(f'写好了：{a.out}、{os.path.splitext(a.out)[0]}.ts')

if __name__ == '__main__':
    main()
