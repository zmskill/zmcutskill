#!/usr/bin/env python3
"""zm_film_check.py — 量成片十项底线。交片前必跑，报告交给用户和独立终检。只量得出来的底线，不代表片子好看。

  python3 $SKILL/tools/zm_film_check.py --film 成片.mp4 --nobgm 成片_无BGM.mp4 --beats <beats.json> --offset <片子第 0 秒 = 拍点表里第几秒>
          --mood 燃|中|松 --cues audio/音效清单.json --cuts 105,156,248 [--out reviews/量片报告.md]

  --cues  音效清单；是同步点的那几条写 "同步点": true
  --cuts  每个切镜头的帧号（30 帧/秒），逗号隔开

量十样（都是底线，见 references/core-principles.md 与 references/motion-and-camera.md）：
  1. 音乐满的时候画面有没有在动      不动的拍子占多少；逐帧算最长连着多久不动
  2. 音乐满起来之前占多少            开头太空 = 剪歌
  3. 同步点                          数量对不对；每个同步点画面有没有大变化、音效够不够重；其余音效听不听得清
  4. 切点两边动没动                  静止画面切静止画面 = 翻页
  5. 主体够不够大                    画面里有内容的区域占画面多大（中位 ≥45%，不连续 2 秒低于 25%）
  6. 开头 2 秒                       有没有大的东西在动
  7. 破音                            峰值与响度底线
  8. 卡点分量与连打                  同步点画面变化量 & 等间隔连打段
  9. 糊着换次数                      清晰度骤降切点统计
 10. 顿不顿                          单帧突现弹出 & 运动急停顿挫检测
只用 ffmpeg + numpy。AI 听不到声音，好不好听、惊不惊艳由用户判断。
"""
import subprocess
import argparse, json, os, sys
import numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import zm_au as au
from zm_music import GEARS
STILL = 0.8   # 一拍的平均画面变化量低于它 = 这一拍几乎不动（160×90 灰度、30 帧/秒；对照片运动段 5–17）

def main():
    ap = argparse.ArgumentParser(); ap.add_argument('--film', required=True); ap.add_argument('--nobgm'); ap.add_argument('--beats', required=True)
    ap.add_argument('--offset', type=float, default=0); ap.add_argument('--mood', required=True, choices=list(GEARS)); ap.add_argument('--cues'); ap.add_argument('--cuts', default=''); ap.add_argument('--out')
    a = ap.parse_args(); g = GEARS[a.mood]; out = []; bad = []; P = out.append
    t0, T = au.grid_from(a.beats); t0 -= a.offset
    x = au.load(a.film); dur = len(x) / au.SR; mot = au.motion(a.film); fps = 30; med = float(np.median(mot[mot > 0.05])) if (mot > 0.05).any() else 0.1
    B = json.load(open(a.beats, encoding='utf-8')); downs = B.get('downbeats') or ([b['t'] for b in B['bars']] if B.get('bars') else [t0 + a.offset])
    first = float(downs[0]) - a.offset; first -= np.floor(first / (4 * T)) * 4 * T
    bars = [first + k * 4 * T for k in range(int((dur - first) / (4 * T)))]
    if first > 2 * T: bars = [first - 4 * T] + bars
    rows = []
    for s in bars:
        e = min(dur, s + 4 * T); s2 = max(0, s); rows.append(dict(s=s2, db=au.db(au.seg(x, s2, e)), mot=float(mot[int(s2 * fps):int(e * fps)].mean())))
    top = max(r['db'] for r in rows)
    for r in rows: r['档'] = '满' if top - r['db'] <= 4 else ('静' if top - r['db'] >= 8 else '中')
    P(f'# 量片报告\n\n成片：{os.path.basename(a.film)}，{dur:.1f} 秒；{60 / T:.1f} 拍/分；档位：{a.mood}\n')
    # 1
    P('## 1. 音乐满的时候画面有没有在动\n\n| 小节 | 片内秒 | 响度 dB | 档 | 画面变化量 |\n|---|---|---|---|---|')
    for i, r in enumerate(rows): P(f"| {i + 1} | {r['s']:.2f} | {r['db']:.1f} | {r['档']} | {r['mot']:.1f} |")
    b0 = t0 if t0 >= 0 else t0 + np.ceil(-t0 / T) * T; nb = int((dur - b0) / T)
    bm = [float(mot[int((b0 + k * T) * fps):int((b0 + (k + 1) * T) * fps)].mean()) for k in range(nb)]; bd = [au.db(au.seg(x, b0 + k * T, b0 + (k + 1) * T)) for k in range(nb)]
    ref = float(np.percentile(bd, 90)); full = [k for k in range(nb) if ref - bd[k] <= 5]; still = [k for k in full if bm[k] < STILL]
    share = len(still) / max(1, len(full))
    run = mx = 0; where = 0; end = int((dur - 1.5) * fps)        # 逐帧算；片尾最后 1.5 秒（落版停住）不算
    for i in range(min(end, len(mot))):
        run = run + 1 if mot[i] < 0.25 else 0
        if run > mx: mx = run; where = (i - run + 1) / fps
    lim_share, lim_run = {'燃': (0.35, 1.7), '中': (0.5, 2.5), '松': (1.0, 1e9)}[a.mood]
    ok = share <= lim_share and mx / fps <= lim_run
    P(f'\n音乐满的拍子 {len(full)} 拍，画面几乎不动的 {len(still)} 拍（{share:.0%}，上限 {lim_share:.0%}）；逐帧算连着不动最长 {mx / fps:.1f} 秒（从第 {where:.1f} 秒起，上限 {lim_run:.1f} 秒；片尾 1.5 秒不算）。**{"过" if ok else "不过"}**')
    P('（对照片：28%、1.5 秒。）')
    if not ok: bad.append('音乐满的时候画面不动的太多 / 太久：音乐有多满，画面就要有多丰富（core-principles.md 第 3、4 条）')
    # 2
    head = next((i for i, r in enumerate(rows) if r['档'] == '满'), len(rows)); q = head / len(rows); ok = q <= g['静小节最多占比']
    P(f'\n## 2. 音乐满起来之前占多少\n\n开头 {head} 小节音乐还没满，占全片 {q:.0%}（上限 {g["静小节最多占比"]:.0%}；片尾收住的小节不算）。**{"过" if ok else "不过"}**')
    if not ok: bad.append('音乐满起来之前太长：剪歌，把开头的安静段留 1–2 小节')
    sync_pk = []
    # 3
    if a.cues and a.nobgm:
        s = au.load(a.nobgm); n = min(len(s), len(x)); music = x[:n] - s[:n]; cues = json.load(open(a.cues, encoding='utf-8'))['音效']
        P('\n## 3. 同步点\n\n| 秒 | 画面 | 类别 | 同步点 | 比音乐高 dB | 这一下画面变化 | |\n|---|---|---|---|---|---|---|')
        weak = 0; sync = [c for c in cues if c.get('同步点')]; sbad = []; sync_pk = []
        for c in cues:
            t = float(c['时间']); sb_ = au.band_db(au.seg(s, t - 0.05, t + 0.2)); mb = au.band_db(au.seg(music, t - 0.05, t + 0.2)); d = max(sb_[k] - mb[k] for k in range(len(sb_)))
            i = int(round(t * fps)); pk = float(mot[max(0, i - 2):i + 3].max()) if i < len(mot) else 0; is_sync = bool(c.get('同步点')); note = ''
            if is_sync:
                sync_pk.append(pk)
                if d < 6: note += ' 音效不够重'
                if pk < max(6.0, 3 * med): note += ' 画面没有硬的一下'
                if note: sbad.append(f"{t:.2f}s {str(c.get('画面', ''))[:12]}：{note.strip()}")
            elif d < 3: weak += 1; note = ' 不够清楚'
            P(f"| {t:.2f} | {str(c.get('画面', ''))[:18]} | {c.get('类别', '')} | {'★' if is_sync else ''} | {d:+.1f} | {pk:.1f} | {note.strip()} |")
        lo, hi = g['同步点每30秒']; lo, hi = max(2, round(lo * dur / 30)), max(3, round(hi * dur / 30)); others = max(1, len(cues) - len(sync))
        okn = lo <= len(sync) <= hi; oks = not sbad; okw = weak / others <= 0.2
        P(f'\n同步点 {len(sync)} 个（这条片子按「{a.mood}」应有 {lo}–{hi} 个）**{"过" if okn else "不过"}**；每个同步点要音效比音乐高 6 dB 以上、画面在 ±2 帧内有硬的一下（单帧变化 ≥ {max(6.0, 3 * med):.1f}）**{"过" if oks else "不过"}**；其余 {others} 个音效不够清楚的 {weak} 个（上限 20%）**{"过" if okw else "不过"}**')
        if not okn: bad.append(f'同步点数量不对（{len(sync)} 个，应有 {lo}–{hi} 个）：同步点是全片最突出的几下，太多就都不突出，太少就不"卡"；在音效清单里给它们标 "同步点": true')
        if not oks: bad.append('这些同步点没做到位：' + '；'.join(sbad) + '。同步点要预备、夸张、跟随，音效要重、音乐让开（core-principles.md 第 4 条）')
        if not okw: bad.append('其余音效不够清楚的太多：用 zm_sfx_levels.py 重算音量')
    else:
        P('\n## 3. 同步点\n\n没给 --cues 和 --nobgm，没量。**不过**'); bad.append('没给音效清单和无 BGM 版，同步点没法量')
    # 4
    cuts = [int(c) for c in a.cuts.split(',') if c.strip()]; okoff = set()
    if cuts:
        P('\n## 4. 切点两边动没动\n\n| 切点 帧 | 切前 3 帧 | 切后 3 帧 | |\n|---|---|---|---|'); dead = []
        for c in cuts:
            lo_, hi_ = max(4, c - 2), min(len(mot) - 4, c + 3)
            if lo_ >= hi_: continue
            j = lo_ + int(np.argmax(mot[lo_:hi_])); pre = float(mot[j - 3:j].mean()); post = float(mot[j + 1:j + 4].mean()); tag = ''
            if pre < 1.0 and post < 1.0: tag = '静止切静止'; dead.append(c)
            elif pre < 1.0: tag = '切出去的一边不动'
            P(f'| {c} | {pre:.1f} | {post:.1f} | {tag} |')
        ok = len(dead) == 0 if a.mood != '松' else len(dead) <= len(cuts) // 2
        st = 0.5 if a.mood == '燃' else 1.0   # 燃的歌切点可以落在半拍上
        offb = [(c, round(abs((c / fps - t0) / (T * st) - round((c / fps - t0) / (T * st))) * T * st * fps, 1)) for c in cuts]; offb = [(c, d) for c, d in offb if d > 2 and c not in okoff]
        P(f'\n{len(cuts)} 个切点，静止画面切静止画面的 {len(dead)} 个。**{"过" if ok else "不过"}**（切点藏在运动里；松的歌用叠化的地方可以例外）')
        if a.mood != '松':
            P(f'（只提示，不算关口）切点离最近的拍超过 2 帧的：{[f"帧 {c}，差 {d} 帧" for c, d in offb] or "没有"}。有的话对一下总谱：切点应该在小节或乐句开头，不要切在乐句中间（core-principles.md 第 3 条）。')
        if not ok: bad.append(f'静止画面切静止画面（帧 {dead}）：这是翻页，不是转场。上一镜带着速度出去，下一镜带着速度进来；两个画面没关系就在动作里硬切（core-principles.md 第 5 条）')
    else:
        P('\n## 4. 切点两边动没动\n\n没给 --cuts，没量。**不过**'); bad.append('没给切点帧号（--cuts）')
    # 5, 6
    cb = au.content_box(a.film); bx = np.array([c[1] for c in cb]); secs = [float(bx[i:i + 5].mean()) for i in range(0, max(1, len(bx) - 4), 5)]
    small = [i for i, v in enumerate(secs) if v < 0.25]; consec = any(small[k + 1] == small[k] + 1 for k in range(len(small) - 1))
    ok = float(np.median(bx)) >= 0.45 and len(small) / max(1, len(secs)) <= 0.1 and not consec
    P(f'\n## 5. 主体够不够大\n\n有内容的区域占画面：中位 {np.median(bx):.0%}（要 ≥45%）；低于 25% 的有 {len(small)} 秒（第 {small} 秒；上限全片 10%，且不能连着 2 秒）。**{"过" if ok else "不过"}**\n（对照片：中位 66%，没有一秒低于 25%。）')
    if not ok: bad.append('主体太小、画面太空：把主体放大到占住画面，或者让空的地方有东西（光、层次、辅助元素）；一个时刻只让观众看一样东西，而且要够大（core-principles.md 第 3 条）')
    o_box = float(bx[:10].mean()) if len(bx) >= 10 else 0; o_mot = float(mot[:60].mean()); ok = o_box >= 0.3 and o_mot >= 4
    P(f'\n## 6. 开头 2 秒\n\n有内容的区域占画面 {o_box:.0%}（要 ≥30%），画面变化量 {o_mot:.1f}（要 ≥4）。**{"过" if ok else "不过"}**\n（对照片：58%、13.4。）')
    if not ok: bad.append('开头 2 秒太弱：要有一个大的东西在动，不是小框小字（core-principles.md 第 3 条）')
    # 7
    clip = int((np.abs(x) >= 0.99).sum()); ok = clip == 0
    P(f'\n## 7. 破音\n\n最大采样 {np.abs(x).max():.3f}，≥0.99 的采样 {clip} 个。**{"过" if ok else "不过"}**')
    if not ok: bad.append('声音破了：把总音量降下来，或者大声处让音乐让开')
    if os.path.exists(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'references/motion-and-camera.md')):
        soft = a.mood == '松'
        # 8 卡点有没有分量、有没有连着打
        big = 10 if soft else 20; n_big = sum(v >= big for v in sync_pk); ok1 = bool(sync_pk) and n_big * 2 >= len(sync_pk)
        thr = 8 if soft else 15; st = T * fps / 2
        pk8 = [i for i in range(3, len(mot) - 3) if mot[i] >= thr and mot[i] == mot[i - 3:i + 4].max()]
        on = sorted({int(round((i / fps - t0) / (T / 2))) for i in pk8 if abs((i / fps - t0) / (T / 2) - round((i / fps - t0) / (T / 2))) * st <= 2.5}); best = []; bstep = 0
        for stp in ((2, 4, 8, 16, 32) if soft else (1, 2, 4, 8)):
            for h0 in on:
                run = [h0]
                while run[-1] + stp in on: run.append(run[-1] + stp)
                if len(run) > len(best): best, bstep = run, stp
        need = 3 if soft else 4; ok2 = len(best) >= need
        P(f'\n## 8. 卡点有没有分量、有没有连着打\n\n同步点 {len(sync_pk)} 个，那一下画面变化 ≥{big} 的有 {n_big} 个（要至少一半；"字落定、数到头"这种收尾量出来只有 10 上下；卡拍硬切、镜头飞到最快是 30 以上）。**{"过" if ok1 else "不过"}**')
        P(f'落在拍上的大变化（≥{thr}）里，间隔相等、连着打的最长一串：{len(best)} 下，每 {bstep / 2:g} 拍一下，从第 {best[0] / 2:g} 拍起（要至少 {need} 下）。**{"过" if ok2 else "不过"}**' if best else f'落在拍上的大变化一个都没有。**不过**')
        if not ok1: bad.append('同步点太轻：拍子上发生的是"停稳"不是"打一下"。把拍子上的事改成速度接力的硬切、镜头飞的最快一刻、进场鼓包的顶点（motion-and-camera.md 第二、三节）')
        if not ok2: bad.append(f'没有连着打的节奏：全片至少一段，连续 {need} 拍（或隔拍、每小节）每一下都有一个落在拍上的大变化（motion-and-camera.md 第三节）')
        # 9 糊着换
        if cuts:
            raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', a.film, '-an', '-vf', 'fps=30,scale=320:180,format=gray', '-f', 'rawvideo', '-'], capture_output=True, check=True).stdout
            F = np.frombuffer(raw, np.uint8).reshape(-1, 180, 320).astype(np.float32)
            sh = np.array([np.abs(q[1:-1, 1:-1] * 4 - q[:-2, 1:-1] - q[2:, 1:-1] - q[1:-1, :-2] - q[1:-1, 2:]).mean() for q in F]); blurry = []
            for c in cuts:
                if c < 9 or c > len(sh) - 9: continue
                ra = np.median(sh[max(0, c - 50):c - 8]); rb = np.median(sh[c + 8:c + 50])
                if sh[c - 4:c].min() < 0.5 * ra or sh[c:c + 4].min() < 0.5 * rb: blurry.append(c)
            ok = len(blurry) <= 2
            P(f'\n## 9. 糊着换\n\n{len(cuts)} 个切点里，切的前后画面是糊的（清晰度掉到这一镜平时的一半以下）有 {len(blurry)} 个：帧 {blurry}（最多 2 个）。**{"过" if ok else "不过"}**\n（上一条片子 8 个切点里 7 个是这样；用户满意的片子 19 个里 4 个。镜头飞得快带出来的运动模糊也会被算进来，被算进来的自己看一眼是哪种。）')
            if not ok: bad.append(f'糊着换太多（帧 {blurry}）：失焦、甩糊、急推带模糊、光扫，看起来都是同一招"糊一下就换"。改成镜头连续飞过去，或者两个都在动的画面卡着拍子干脆地切（motion-and-camera.md 第一节）')
    if '鼓包' in (open(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'references/motion-and-camera.md'), encoding='utf-8').read() if os.path.exists(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'references/motion-and-camera.md')) else ''):
        # 10 顿不顿：一帧内猛地弹起来、三帧内又掉回去（不是切点）；动着突然定住
        N = len(mot) - int(1.5 * fps)
        pops = [i for i in range(3, N - 4) if mot[i] < 60 and mot[i] >= 2.2 * max(mot[i - 1], mot[i - 2]) + 4 and mot[i + 3] <= 0.6 * mot[i] and mot[i - 1] >= 1.5 and not any(abs(i - c) <= 2 for c in cuts)]
        stops = [i for i in range(4, N - 4) if mot[i - 3:i].mean() > 4 and mot[i:i + 3].mean() < 1 and mot[i - 1] < 60]
        runp = 1; bestp = 1
        for k in range(2, len(pops)):
            if abs((pops[k] - pops[k - 1]) - (pops[k - 1] - pops[k - 2])) <= 2: runp += 1; bestp = max(bestp, runp + 1)
            else: runp = 1
        per = lambda n_: n_ / max(1, N / fps) * 10; ok = per(len(pops)) <= 1.5 and bestp < 3 and per(len(stops)) <= 3
        P(f'\n## 10. 顿不顿\n\n一帧内弹起来、马上又掉回去的地方 {len(pops)} 处（每 10 秒 {per(len(pops)):.1f}，上限 1.5）：帧 {pops[:16]}；其中间隔相等连着来的最长 {bestp if bestp >= 3 else 0} 下（3 下以上就是"一顿一顿"）。'
          f'动着突然定住 {len(stops)} 处（每 10 秒 {per(len(stops)):.1f}，上限 3）：帧 {stops[:12]}。**{"过" if ok else "不过"}**\n（上一条：弹 10 处、其中 8 处每拍一下连着来。用户满意的两条：每 10 秒 1.0 和 1.4，没有连着来的。）')
        if not ok: bad.append('画面顿：有东西 1–3 帧弹出来就定住，或者动着突然停。每个动作都要有加速（≥6 帧）和减速（至少是加速的 2 倍），卡在拍上的是最快的那一刻；零件不冻、不停（motion-and-camera.md 第二节）')
    P('\n## 结论\n\n' + ('**通过。**（这只说明没有量得出来的毛病，不说明片子好看。）' if not bad else '**不通过：**\n' + '\n'.join(f'- {b}' for b in bad)))
    txt = '\n'.join(out) + '\n'
    if a.out:
        os.makedirs(os.path.dirname(os.path.abspath(a.out)), exist_ok=True); open(a.out, 'w', encoding='utf-8').write(txt)
    print(txt); sys.exit(1 if bad else 0)

if __name__ == '__main__':
    main()
