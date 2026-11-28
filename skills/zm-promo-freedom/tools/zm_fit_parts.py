#!/usr/bin/env python3
"""zm_fit_parts.py — 这首歌的速度下，每个小零件占几拍、哪个落点放在拍上最合适、起点该放在拍前几帧（zm 追加）。选零件时先跑它。

  python3 $SKILL/tools/zm_fit_parts.py --bpm 87.5 --mood 燃 [--fps 30] [--use 钩子,痛点] [--name 零件名]

零件一口气按原速播完，不停留、不慢放（motion-and-camera.md 第二节第 3 条）。对拍只靠挪起点：让一个"主落点"正好在拍上。
这个工具对每个零件试一遍"把哪个落点放在拍上"，挑其余落点也最靠近格点的那个，告诉你：主落点是零件第几帧、
起点帧 = onF(那一拍) − 主落点帧；其余落点里有几个自然就落在拍附近（±2 帧）。自然合拍多的零件和这首歌最搭。
落点来自 gallery/api/parts-landings.json："合同"是人定的，"样片"是机器从样片量的——用之前对照样片图确认。
"""
import argparse, json, os, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STEP = {'燃': 0.5, '中': 1.0, '松': 2.0}

def fit(frames, landings, step_f):
    """试每个落点当主落点（它在格点上），数其余落点离最近格点 ≤2 帧的有几个。返回 (主落点帧, 其余合拍数, 其余总数)。"""
    L = sorted(x for x in landings if 0 < x < frames)
    if not L: return None, 0, 0
    best = (L[0], -1)
    for m in L:
        n = sum(abs((x - m) / step_f - round((x - m) / step_f)) * step_f <= 2 for x in L if x != m)
        if n > best[1]: best = (m, n)
    return best[0], best[1], len(L) - 1

def main():
    ap = argparse.ArgumentParser(); ap.add_argument('--bpm', type=float, required=True); ap.add_argument('--mood', required=True, choices=list(STEP))
    ap.add_argument('--fps', type=float, default=30); ap.add_argument('--use', default=''); ap.add_argument('--name', default=''); a = ap.parse_args()
    parts = json.load(open(os.path.join(ROOT, 'gallery/api/parts-own.json'), encoding='utf-8'))['parts']
    land = json.load(open(os.path.join(ROOT, 'gallery/api/parts-landings.json'), encoding='utf-8'))['parts']
    beat_f = 60 / a.bpm * a.fps; step_f = beat_f * STEP[a.mood]; uses = set(filter(None, a.use.split(',')))
    print(f'{a.bpm} 拍/分，一拍 {beat_f:.1f} 帧；「{a.mood}」档一格 {step_f:.1f} 帧。帧号按 30 帧/秒的零件原帧算。\n')
    print('| 零件 | 用途 | 原长 拍 | 落点（零件帧） | 主落点（零件帧） | 起点放在拍前几帧 | 其余落点自然合拍 | |\n|---|---|---|---|---|---|---|---|')
    rows = []
    for p in parts:
        if uses and p['use'] not in uses: continue
        if a.name and p['name'] != a.name: continue
        d = land.get(p['name'], {}); L = [x['f'] * a.fps / 30 for x in d.get('landings', [])]; fr = p['frames'] * a.fps / 30
        m, n, tot = fit(fr, L, step_f)
        tag = '没有量到落点：从原镜头代码里定' if m is None else ('合拍' if tot == 0 or n == tot else ('' if n * 2 >= tot else '别的落点多数不在拍上：只当它是一个落点的零件用'))
        src = ''.join(sorted({x['from'][0] for x in d.get('landings', [])}))
        rows.append((p['use'], -(n / tot if tot else 1), f"| {p['name']} | {p['use']} | {fr / beat_f:.1f} | {' '.join(str(x['f']) for x in d.get('landings', []))}{'（' + src + '）' if src else ''} | {'' if m is None else round(m)} | {'' if m is None else round(m)} 帧（{0 if m is None else m / beat_f:.1f} 拍） | {'' if m is None else f'{n}/{tot}'} | {tag} |"))
    for _, _, r in sorted(rows, key=lambda r: (r[0], r[1])): print(r)
    print('\n（合 = 合同落点，样 = 样片量的。用法：起点帧 = onF(主落点要落的那一拍) − 主落点帧；零件一口气播完，不停留。）')

if __name__ == '__main__':
    main()
