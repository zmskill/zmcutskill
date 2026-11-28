#!/usr/bin/env python3
"""zm_sfx_synth.py — 库里没有合适的声音时，用 numpy 合成（zm 追加）。每种声音只配它那一段动作。

用法（都输出 48k 单声道 wav）：
  python3 zm_sfx_synth.py ticks   --n 8 --f0 660 --step 2 --out audio/sfx/count      # 一串短音，一个比一个高 step 个半音：数数、逐个弹出、逐帧提示
  python3 zm_sfx_synth.py whoosh  --dur 0.6 --peak 0.55 --out audio/sfx/fly1.wav       # 镜头飞过去：dur = 飞的时长，peak = 最快那一刻在第几成（0–1）
  python3 zm_sfx_synth.py sub     --dur 0.9 --f0 70 --out audio/sfx/drop.wav           # 重击下沉的低音：大东西砸下、整个画面换掉
  python3 zm_sfx_synth.py riser   --dur 1.2 --out audio/sfx/rise.wav                   # 往上拱的铺垫：最大那一下之前
  python3 zm_sfx_synth.py shimmer --dur 1.4 --f0 1320 --out audio/sfx/end.wav          # 收尾的亮音：落版定住
  python3 zm_sfx_synth.py buzz    --dur 0.25 --out audio/sfx/no.wav                    # 低的蜂鸣：被拒绝、出错
  python3 zm_sfx_synth.py click   --out audio/sfx/click.wav                            # 干脆的一下：点击、卡拍硬切
"""
import argparse, os, wave
import numpy as np
SR = 48000
def save(path, y):
    y = np.asarray(y, np.float32); y = y / (np.abs(y).max() + 1e-9) * 0.89
    os.makedirs(os.path.dirname(os.path.abspath(path)) or '.', exist_ok=True)
    w = wave.open(path, 'wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((y * 32767).astype('<i2').tobytes()); w.close(); print('写好了：' + path)
def t_(dur): return np.arange(int(dur * SR)) / SR
def noise(n, seed=7): return np.random.default_rng(seed).standard_normal(n)
def lp(x, k): return np.convolve(x, np.ones(k) / k, 'same')
def tick(f, dur=0.09):
    t = t_(dur); return (np.sin(2 * np.pi * f * t) + 0.35 * np.sin(2 * np.pi * 2 * f * t) + 0.15 * np.sin(2 * np.pi * 3.01 * f * t)) * np.exp(-t * 55) * np.minimum(1, t * 900)
def main():
    ap = argparse.ArgumentParser(); ap.add_argument('kind', choices=['ticks', 'whoosh', 'sub', 'riser', 'shimmer', 'buzz', 'click'])
    ap.add_argument('--n', type=int, default=8); ap.add_argument('--f0', type=float, default=0); ap.add_argument('--step', type=float, default=2)
    ap.add_argument('--dur', type=float, default=0); ap.add_argument('--peak', type=float, default=0.55); ap.add_argument('--out', required=True); a = ap.parse_args()
    if a.kind == 'ticks':
        f0 = a.f0 or 660
        for i in range(a.n): save(f'{a.out}_{i + 1:02d}.wav', tick(f0 * 2 ** (a.step * i / 12)))
    elif a.kind == 'whoosh':
        d = a.dur or 0.6; t = t_(d); n = len(t); env = np.exp(-((t / d - a.peak) ** 2) / (2 * 0.16 ** 2)); x = noise(n)
        k = np.clip((60 - 52 * env).astype(int), 4, 60); c = np.cumsum(np.r_[0, x])            # 越快越亮：平滑窗随速度变短
        y = np.array([(c[min(n, i + k[i])] - c[max(0, i - k[i])]) / (2 * k[i]) for i in range(n)]); save(a.out, y * env ** 1.3)
    elif a.kind == 'sub':
        d = a.dur or 0.9; t = t_(d); f = (a.f0 or 70) * (1 + 1.6 * np.exp(-t * 28)); ph = 2 * np.pi * np.cumsum(f) / SR
        save(a.out, np.sin(ph) * np.exp(-t * 4.5) + 0.5 * lp(noise(len(t)), 6) * np.exp(-t * 60))
    elif a.kind == 'riser':
        d = a.dur or 1.2; t = t_(d); f = 180 * 2 ** (3.2 * (t / d) ** 1.6); ph = 2 * np.pi * np.cumsum(f) / SR
        save(a.out, (np.sin(ph) * 0.5 + lp(noise(len(t)), 5) * 0.6) * (t / d) ** 2.2)
    elif a.kind == 'shimmer':
        d = a.dur or 1.4; t = t_(d); f0 = a.f0 or 1320
        save(a.out, sum(np.sin(2 * np.pi * f0 * r * t + i) * np.exp(-t * (2.2 + i)) / (i + 1) for i, r in enumerate((1, 1.5, 2, 3.01))) * np.minimum(1, t * 300))
    elif a.kind == 'buzz':
        d = a.dur or 0.25; t = t_(d); save(a.out, np.sign(np.sin(2 * np.pi * (a.f0 or 110) * t)) * lp(np.ones(len(t)), 1) * np.minimum(1, t * 400) * np.minimum(1, (d - t) * 60))
    elif a.kind == 'click':
        t = t_(0.05); save(a.out, (lp(noise(len(t)), 2) * np.exp(-t * 220) + np.sin(2 * np.pi * 1800 * t) * np.exp(-t * 160)))
if __name__ == '__main__':
    main()
