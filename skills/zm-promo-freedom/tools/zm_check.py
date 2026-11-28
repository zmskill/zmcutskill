#!/usr/bin/env python3
"""zm_check.py — 两道关口：查设计 spec 和交付物里该有的东西有没有。只查"有没有"，不替代人看片。

  python3 $SKILL/tools/zm_check.py plan <设计spec.md> --profile <music_profile.json> --styleframe <styleframes.jpg> --fit <fit_parts.md> --phase <beat_phase.md>
      分镜放行前跑；不通过就不写正式镜头代码。
  python3 $SKILL/tools/zm_check.py deliver <设计spec.md> --video <成片.mp4> --review <终检报告.md> --notdone <没做清单.md> --filmcheck <量片报告.md> --draftcheck <小样量片.md> --project <video/src>
      交片前跑；不通过就不交。
"""
import json, math, os, re, sys

NAME_RE = r'[a-z][a-z0-9]+(?:-[a-z0-9]+)+'

def table(text):
    """把一节里的第一张 markdown 表读成 (表头, [行])；行是单元格列表。"""
    rows = [[c.strip() for c in l.strip().strip('|').split('|')] for l in text.splitlines() if l.strip().startswith('|')]
    rows = [r for r in rows if not all(re.fullmatch(r':?-{2,}:?', c or '--') for c in r)]
    return (rows[0], rows[1:]) if rows else ([], [])

def sections(path):
    s = open(path, encoding='utf-8').read(); out = {}; cur = None
    for line in s.splitlines():
        m = re.match(r'^##\s+(.+?)\s*$', line)
        if m: cur = m.group(1); out[cur] = []
        elif cur: out[cur].append(line)
    return {k: '\n'.join(v).strip() for k, v in out.items()}

def find(sec, key):
    for k, v in sec.items():
        if key in k: return v
    return None

def main():
    if len(sys.argv) < 3 or sys.argv[1] not in ('plan', 'deliver'): sys.exit(__doc__)
    mode, spec = sys.argv[1], sys.argv[2]
    opt = {sys.argv[i]: sys.argv[i + 1] for i in range(3, len(sys.argv) - 1, 2)}
    sec = sections(spec); bad = []; ok = []
    skill = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    names = {c['name'] for c in json.load(open(os.path.join(skill, 'gallery/api/library-own.json'), encoding='utf-8'))['cards']}
    pj = os.path.join(skill, 'gallery/api/parts-own.json')
    part_sec = {c['name']: c['seconds'] for c in json.load(open(pj, encoding='utf-8'))['parts']} if os.path.exists(pj) else {}
    parts = set(part_sec)
    long_shots = names - parts if parts else set()   # 零件的原镜头：不直接选
    names |= parts

    def need(key, why=''):
        v = find(sec, key)
        if not v: bad.append(f'缺「## {key}」这一节{("：" + why) if why else ""}')
        return v or ''

    v = need('真实吐槽', '至少 3 条原话 + 出处')
    quotes = [l for l in v.splitlines() if re.match(r'^\s*([-*]|\d+[.、])', l) or l.strip().startswith('|')]
    sourced = [l for l in quotes if re.search(r'https?://|出处|来源', l)]
    if v and len(sourced) < 3: bad.append(f'「真实吐槽」里带出处的只有 {len(sourced)} 条，要至少 3 条（每条写链接或"出处：…"）')
    for k in ('选中的痛点', '魔法瞬间', '证据'): need(k)
    v = need('全片骨架')
    if v and not re.search(r'five-beats|energy-arc|五拍|能量', v): bad.append('「全片骨架」没写用的是哪一条（zm-single-feature-five-beats / zm-promo-energy-arc）')
    total = None
    if parts and v:
        m = re.search(r'片长\s*[：:]\s*(\d+(?:\.\d+)?)\s*秒', v)
        if m: total = float(m.group(1))
        else: bad.append('「全片骨架」里要写一行"片长：NN 秒"（用来算至少要用几个小零件）')
    v = need('功能到镜头', '表格，含首选、备选、秒三列')
    used = set()
    first_parts = set()
    if v:
        if '首选' not in v or '备选' not in v: bad.append('「功能到镜头」表里要有"首选"和"备选"两列')
        used = {w for w in re.findall(r'[a-z][a-z0-9]+(?:-[a-z0-9]+)+', v)}
        unknown = sorted(w for w in used if w not in names and not w.startswith('zm-'))
        if unknown: bad.append('「功能到镜头」里这些名字镜头总表里没有（写错了，或者是现写的要写"现写"）：' + '、'.join(unknown))
        used &= names
        if not used and '现写' not in v: bad.append('「功能到镜头」里没有认出任何镜头名')
        if parts:
            head, rows = table(v)
            ci = lambda key: next((i for i, h in enumerate(head) if key in h), None)
            i_first, i_sec = ci('首选'), ci('秒')
            if i_sec is None: bad.append('「功能到镜头」表里要有"秒"一列（这个镜头在片子里占几秒）')
            for r in rows:
                line = ' | '.join(r); why = bool(re.search(r'理由\s*[：:]\s*\S', line))
                first = set(re.findall(NAME_RE, r[i_first])) if i_first is not None and i_first < len(r) else set()
                first_parts |= first & parts
                lng = sorted(first & long_shots)
                if lng and not why: bad.append('首选直接用了长镜头（它是零件的原镜头，十几秒的整段演出）：' + '、'.join(lng) + '。改用它拆出来的小零件（parts-own/INDEX.md），确实要整段用就在这一行写"理由：…"')
                if i_sec is not None and i_sec < len(r):
                    m = re.search(r'\d+(?:\.\d+)?', r[i_sec])
                    if m and float(m.group()) > 6 and not why: bad.append(f'这一行的镜头有 {m.group()} 秒，超过 6 秒：拆成几个小零件，确实需要这么长就在这一行写"理由：…"（{line[:40]}…）')
                    if not m and line.strip(): bad.append(f'这一行的"秒"没填数字：{line[:40]}…')
                    if m and len(first & parts) == 1:
                        own = part_sec[next(iter(first & parts))]; extra = float(m.group()) - own
                        if extra > own * 0.5 + 0.1: bad.append(f'这一行写了 {m.group()} 秒，但零件原长只有 {own} 秒，多出来的超过原长一半：不要靠拉长凑时间，加一个零件（{line[:40]}…）')
                        elif extra > 1.2: bad.append(f'这一行写了 {m.group()} 秒，比零件原长 {own} 秒多了 1 秒以上：零件不停留、不慢放，播完后最多让镜头再慢推 1 秒左右；时间不够就加零件（{line[:40]}…）')
            if total:
                need_n = max(4, math.ceil(total * 8 / 30))
                if len(first_parts) < need_n: bad.append(f'首选里用到的小零件只有 {len(first_parts)} 个，片长 {total:g} 秒至少要 {need_n} 个（30 秒 8 个，同比例）。一拍一个零件，不要用一两个长镜头或全靠现写撑满全片')
            ok.append(f'首选里的小零件 {len(first_parts)} 个')
    v = need('看过的样片图', '首选和备选的样片图都要打开看过')
    if v is not None and used:
        seen = set(re.findall(r'[a-z][a-z0-9]+(?:-[a-z0-9]+)+', v)); miss = sorted(used - seen)
        if miss: bad.append('这些选中的镜头没在「看过的样片图」里（先打开它的 preview-sheet.jpg 看过再定）：' + '、'.join(miss))
    need('只读大字', '把全片大字按顺序连起来写一遍')
    need('脚本关口', 'story-and-copy.md 第四节 8 条逐条写')
    if parts:
        v = need('镜头怎么接', '一行一个接缝，写关系、锚点和接法（motion-and-camera.md）')
        seams = [l for l in v.splitlines() if re.match(r'^\s*([-*]|\d+[.、])', l) or (l.strip().startswith('|') and not re.fullmatch(r'[|\s:-]+', l.strip()))]
        if v and len(seams) < 3: bad.append(f'「镜头怎么接」里只写了 {len(seams)} 个接缝：每个接缝一行，写"上一镜 → 下一镜｜关系：…｜锚点：…｜接法：…｜落在第几拍"')

    v = need('全片一套皮', '底色、字体、主色（visual-and-parts.md）')
    for k in ('底色', '字体', '主色'):
        if v and k not in v: bad.append(f'「全片一套皮」里没写{k}')
    v = need('成果特写', '哪一镜、占画面百分之多少、停几秒（visual-and-parts.md）')
    if v:
        pct = [int(x) for x in re.findall(r'(\d{2,3})\s*%', v)]
        if not pct: bad.append('「成果特写」里要写真实成果占画面百分之多少（要 ≥60%）')
        elif max(pct) < 60: bad.append(f'「成果特写」写的是 {max(pct)}%，不到 60%：把真实成果放大到能读清')

    v = need('音乐画像', '贴 zm_music.py 的音乐结构表（music-and-beats.md）')
    d0 = os.path.dirname(os.path.abspath(spec)); prof = None
    for c in [opt.get('--profile'), os.path.join(d0, 'analysis/music_profile.json'), os.path.join(d0, '../analysis/music_profile.json'), os.path.join(d0, 'music_profile.json')]:
        if c and os.path.exists(c): prof = json.load(open(c, encoding='utf-8')); break
    if not prof: bad.append('找不到 music_profile.json：先跑 zm_music.py，再用 --profile <路径> 告诉我它在哪')
    else:
        g = prof['档位']; mood = prof['情绪']; nbar = len(prof['小节'])
        if v and mood not in v: bad.append(f'「音乐画像」里没写情绪档位（music_profile.json 里是「{mood}」）')
        if prof.get('情绪来源', '').startswith('量出来') and v and '猜' not in v: bad.append('情绪是按数猜的：在「音乐画像」里写明判断依据')
        head = next((i for i, r in enumerate(prof['小节']) if r['档'] == '满'), nbar); q = head / nbar
        if q > g['静小节最多占比']:
            bad.append(f'音乐满起来之前的小节占 {head}/{nbar}（{q:.0%}），超过「{mood}」档上限 {g["静小节最多占比"]:.0%}：用 cut_song.py 剪歌后重新画像（music-and-beats.md）；交片前量成片时这一条也会查')
        v = need('总谱', '一行一个画面事件：小节、拍、帧、音乐这里是什么、画面事件、镜头 / 零件、接、音效、同时几层（music-and-beats.md）')
        if v:
            head, rows = table(v); ci = lambda key: next((i for i, h in enumerate(head) if key in h), None)
            i_bar, i_beat, i_pic, i_lay = ci('小节'), ci('拍'), ci('画面'), ci('层')
            miss = [k for k, i in (('小节', i_bar), ('拍', i_beat), ('画面事件', i_pic), ('音效', ci('音效')), ('接', ci('接')), ('音乐', ci('音乐'))) if i is None]
            if miss: bad.append('「总谱」表里缺这几列：' + '、'.join(miss))
            else:
                cell = lambda r, i: r[i] if i is not None and i < len(r) else ''
                num = lambda t: (float(re.search(r'-?\d+(?:\.\d+)?', t).group()) if re.search(r'-?\d+(?:\.\d+)?', t) else None)
                cnt = {}; outro = set(); beats = []; over = []
                for r in rows:
                    b = num(cell(r, i_bar)); pic = cell(r, i_pic).strip()
                    if b is None: continue
                    if pic and pic not in ('—', '-', '无'): cnt[int(b)] = cnt.get(int(b), 0) + 1
                    if '落版' in ' '.join(r): outro.add(int(b))
                    x = num(cell(r, i_beat))
                    if x is not None: beats.append(x)
                    lay = num(cell(r, i_lay)) if i_lay is not None else None
                    if lay is not None and lay > 2.5: over.append(f'第 {int(b)} 小节第 {cell(r, i_beat)} 拍（{lay:g} 层）')
                thin = []
                for br in prof['小节']:
                    k = br['小节']; want = g['满段每小节事件'] if br['档'] == '满' else (g['静段每小节事件'] if br['档'] == '静' else max(1, g['静段每小节事件']))
                    if k in outro: want = min(want, 1)
                    if cnt.get(k, 0) < want: thin.append(f'第 {k} 小节（{br["档"]}）{cnt.get(k, 0)}/{want}')
                if thin: bad.append(f'「总谱」里这些小节的画面事件不够（「{mood}」档：满的小节每小节至少 {g["满段每小节事件"]} 个；音乐满的时候画面要有东西在动）：' + '、'.join(thin))
                syn = [r for r in rows if '同步点' in ' '.join(r) or '★' in ' '.join(r)]; i_sfx = ci('音效')
                lo, hi = g.get('同步点每30秒', [4, 8]); L = float(prof.get('片长秒', 30)); lo, hi = max(2, round(lo * L / 30)), max(3, round(hi * L / 30))
                if not (lo <= len(syn) <= hi): bad.append(f'「总谱」里标了"★同步点"的有 {len(syn)} 行，这条片子按「{mood}」应有 {lo}–{hi} 个：同步点是全片最突出的几下，钉在炸开和最强的几下上（core-principles.md）')
                dry = [cell(r, i_beat) for r in syn if cell(r, i_sfx).strip() in ('', '—', '-', '无')]
                if dry: bad.append('这些同步点没配音效（同步点要有一个有分量的声音，音乐让开）：第 ' + '、'.join(dry) + ' 拍')
                if not beats: bad.append('「总谱」的"拍"一列没有数字')
                if '魔法瞬间' not in v: bad.append('「总谱」里要有一行写"魔法瞬间"（钉在炸开的第一拍或最强的几下）')
                if over: bad.append('「总谱」里同时超过两层半的地方：' + '、'.join(over[:6]) + '（删一个音效，或错开半拍）')
                ok.append(f'总谱 {len(rows)} 行')

    v = need('一个主意', '三个不同的视觉主意各一句话，选了哪个、为什么（core-principles.md）')
    if mode == 'plan':
        sf = opt.get('--styleframe')
        if not sf or not os.path.exists(sf) or os.path.getsize(sf) < 20000: bad.append('没给定调静帧（--styleframe <三个主意各一张静帧拼成的图>）：写代码之前先渲出来看，不是事后用成片截图补')
        fitf = opt.get('--fit')
        if not fitf or not os.path.exists(fitf) or not re.search('对拍后|主落点', open(fitf, encoding='utf-8', errors='ignore').read()): bad.append('没给 zm_fit_parts.py 的输出（--fit analysis/fit_parts.md）：选零件前先跑它，把输出存下来')
    v = need('用到的零件和落点', '一行一个首选零件：名字 + 落点帧号（抄零件卡"落点"一节）')
    lp = os.path.join(skill, 'gallery/api/parts-landings.json')
    if v and os.path.exists(lp) and used:
        LD = json.load(open(lp, encoding='utf-8'))['parts']; miss = []
        firsts = first_parts if first_parts else (used & parts)
        for nme in sorted(firsts):
            fr = {str(x['f']) for x in LD.get(nme, {}).get('landings', [])}
            line = next((l for l in v.splitlines() if nme in l), None)
            if line is None or (fr and not (fr & set(re.findall(r'\d+', line)))): miss.append(nme)
        if miss: bad.append('「用到的零件和落点」里这些零件没写、或者落点帧号和零件卡对不上（先读零件卡的"落点"一节再抄）：' + '、'.join(miss))
    v = find(sec, '镜头怎么接')
    if v:
        lines = [l for l in v.splitlines() if re.match(r'^\s*([-*]|\d+[.、])', l) or (l.strip().startswith('|') and not re.fullmatch(r'[|\s:-]+', l.strip()))]
        norel = [l.strip()[:30] for l in lines if '→' in l and not ('关系' in l and ('锚点' in l or '硬切' in l))]
        if norel: bad.append(f'「镜头怎么接」里 {len(norel)} 个接缝没写"关系"和"锚点"（先回答两个画面是什么关系，motion-and-camera.md）：' + '；'.join(norel[:4]))

    stamp = os.path.join(os.path.dirname(os.path.abspath(spec)), '.关口一通过.json')
    if mode == 'plan':
        pf = opt.get('--profile')
        if pf and os.path.exists(pf) and not (json.load(open(pf, encoding='utf-8')).get('情绪依据') or '').strip():
            bad.append('音乐画像里没写这首歌的感觉是凭什么定的：重跑 zm_music.py --feel "…"（用户说过的话、歌名风格、产品的感觉，原文照写）。不要拿"燃、中、松"去问用户')
        ph = opt.get('--phase')
        if not ph or not os.path.exists(ph): bad.append('没给拍子格子核对的结果（--phase analysis/beat_phase.md，tools/zm_beat_phase.py 出的）')
        elif '**格子歪了。**' in open(ph, encoding='utf-8').read(): bad.append('拍子格子是歪的：按 beat_phase.md 说的挪好、重跑到通过，再排时间线')
        v = need('片中说的每句话', '表格：这句话｜出现在哪｜依据')
        if v:
            head, rows = table(v); i_ev = next((i for i, h in enumerate(head) if '依据' in h), None)
            if i_ev is None: bad.append('「片中说的每句话」表里要有"依据"一列')
            else:
                empty = [r[0][:20] for r in rows if i_ev >= len(r) or not r[i_ev].strip() or r[i_ev].strip() in ('—', '-', '无', '没有')]
                if empty: bad.append(f'「片中说的每句话」里 {len(empty)} 句没有依据（没有依据的不能上片）：' + '；'.join(empty[:4]))
                if not rows: bad.append('「片中说的每句话」是空的：大字、字幕、行动句都要列')
        v = find(sec, '功能到镜头')
        if v and parts:
            head, rows = table(v)
            for r in rows:
                line = ' | '.join(r)
                if '现写' in line:
                    seen = set(re.findall(NAME_RE, line.split('看过', 1)[1])) & parts if '看过' in line else set()
                    if len(seen) < 2: bad.append(f'这一行是现写的，要写"看过：零件甲、零件乙"（至少两个真实的零件名）和为什么不行——INDEX.md 十二类都看过了吗（{line[:30]}…）')
        need('镜头路线', '全片分成几段连续的空间；每段里哪几个画面、各摆在哪、镜头怎么飞（motion-and-camera.md）')
        need('每段的展示手法', '每一段用什么手法，同一种不出现两次（motion-and-camera.md）')
        v = find(sec, '镜头怎么接')
        if v:
            ls_ = [l for l in v.splitlines() if '→' in l and '接法' in l]; kinds = [m.group(1) for l in ls_ for m in [re.search(r'接法\s*[：:]\s*\**\s*(飞过去|卡拍硬切|同物接续|糊着换)', l)] if m]
            if len(kinds) < len([l for l in v.splitlines() if '→' in l and re.match(r'^\s*([-*|]|\d+[.、])', l)]): bad.append('「镜头怎么接」每一行的接法只能写这四种之一：飞过去 / 卡拍硬切 / 同物接续 / 糊着换（motion-and-camera.md）')
            if kinds.count('糊着换') > 1: bad.append(f'"糊着换"全片最多 1 次，现在 {kinds.count("糊着换")} 次（失焦、甩糊、急推带模糊、光扫、淡入淡出都算）')
            if kinds and ('飞过去' not in kinds or '卡拍硬切' not in kinds): bad.append('一条片子里"飞过去"和"卡拍硬切"都要有')
        v = find(sec, '总谱')
        if v and '连打' not in v: bad.append('总谱里没有标"连打"：全片至少一段，连续 4 下以上（安静的歌 3 下）间隔相等的大变化，那几行写"连打"（motion-and-camera.md）')

    if mode == 'deliver':
        v = need('读过的文档', '每份写"全文"或"部分 + 原因"')
        for doc in ('core-principles.md', 'motion-and-camera.md', 'music-and-beats.md', 'story-and-copy.md', 'visual-and-parts.md', 'sound-and-sfx.md', 'capture-and-build.md', 'workflow-and-review.md'):
            if v and doc not in v: bad.append(f'「读过的文档」里没有 {doc}（没读就照实写"没读"和原因）')
        if v:
            for doc in ('motion-and-camera.md', 'music-and-beats.md', 'sound-and-sfx.md'):
                line = next((l for l in v.splitlines() if doc in l), '')
                if line and '全文' not in line: bad.append(f'{doc} 必须读全文（「读过的文档」里这一行没写"全文"）')
        if not os.path.exists(stamp): bad.append('没有关口一通过的记录：先跑 zm_check.py plan 并通过（它会在设计 spec 旁边留一个记录）')
        dc = opt.get('--draftcheck'); video = opt.get('--video')
        if not dc or not os.path.exists(dc): bad.append('没给小样量片报告（--draftcheck reviews/小样量片.md：全尺寸渲染之前，先用半大的小样量一遍）')
        else:
            if '**通过。**' not in open(dc, encoding='utf-8').read(): bad.append('小样量片没有通过')
            if os.path.exists(stamp) and os.path.getmtime(dc) < os.path.getmtime(stamp) - 60: bad.append('小样量片比关口一通过的时间还早：顺序反了，应该先过关口一，再写代码、渲小样')
        nd = opt.get('--notdone')
        if nd and os.path.exists(nd) and '用时' not in open(nd, encoding='utf-8').read(): bad.append('没做清单里没有"## 用时"一节（每一步几点到几点、卡在哪）')
        if nd and os.path.exists(nd) and '各是哪一步该做对的' not in open(nd, encoding='utf-8').read(): bad.append('没做清单里没有"## 终检提的问题，各是哪一步该做对的"一节（终检第一轮就过、没有必须改的，也写一句"第一轮通过，没有"）')
        rv = opt.get('--review')
        if rv and os.path.exists(rv) and '第一眼' not in open(rv, encoding='utf-8').read(): bad.append('终检报告里没有"第一眼"（审片人先只看成片写第一眼，再看方案）')

        pj_ = opt.get('--project'); src_ = ''
        if not pj_ or not os.path.isdir(pj_): bad.append('没给片子工程的 src 目录（--project <目录>）')
        else:
            for d_, _, fs_ in os.walk(pj_):
                if 'node_modules' in d_: continue
                for f_ in fs_:
                    if f_.endswith(('.ts', '.tsx')): src_ += open(os.path.join(d_, f_), encoding='utf-8', errors='ignore').read()
            if not re.search(r'<World\b', src_): bad.append('工程代码里没有用 World / Stage：镜头要在一个连续的空间里飞（motion-and-camera.md）')
            top = ''.join(open(os.path.join(pj_, f_), encoding='utf-8', errors='ignore').read() for f_ in os.listdir(pj_) if f_.endswith(('.ts', '.tsx')))
            if re.search(r'holds=\{(?!\s*\[\s*\]\s*\})', top) or 'fitPart(' in top: bad.append('工程代码里还在用 holds / fitPart 让零件停留：零件一口气按原速播完，对拍靠挪起点、镜头和切点（motion-and-camera.md）')
            if not re.search(r'\b(camMoves|ramp|relay)\(', top): bad.append('工程代码里没有用 camMoves / ramp / relay：动作的速度要是鼓包、切镜头要速度接力（motion-and-camera.md）')
            if re.search(r'blur=\{0\}', top): bad.append('World 的运动模糊被关掉了（blur={0}）：成片要开着')
            if not re.search(r'\b(hitF|onF)\(', src_): bad.append('工程代码里没有用 hitF() / onF()：卡点用 zm_hits.py 实测的拍点（motion-and-camera.md）')
            if not re.search(r'<PartPlay\b', src_): bad.append('工程代码里没有用 PartPlay：零件用它取一段、按原速一口气播完（visual-and-parts.md）')

        fc = opt.get('--filmcheck')
        if not fc or not os.path.exists(fc): bad.append('没给量片报告（--filmcheck <reviews/量片报告.md>，zm_film_check.py 出的）')
        else:
            if '**通过。**' not in open(fc, encoding='utf-8').read(): bad.append('量片报告没有通过：照报告里的"不通过"逐条改，重渲后再量')
            if video and os.path.exists(video) and os.path.getmtime(fc) < os.path.getmtime(video): bad.append('量片报告比成片旧：最后这一版成片没有量过')

        review, notdone = opt.get('--review'), opt.get('--notdone')
        for label, p in (('成片', video), ('终检报告', review), ('没做清单', notdone)):
            if not p or not os.path.exists(p) or os.path.getsize(p) == 0: bad.append(f'{label}没给或找不到（--{ {"成片":"video","终检报告":"review","没做清单":"notdone"}[label] } <路径>）')
        if video and review and os.path.exists(video) and os.path.exists(review) and os.path.getmtime(review) < os.path.getmtime(video):
            bad.append('终检报告比成片旧：最后这一版成片没有被独立审查过。改完重渲后要再审一次。')
        if review and os.path.exists(review):
            r = open(review, encoding='utf-8').read()
            if '画面先查' not in r: bad.append('终检报告里没有「## 画面先查」一节（审查者开工先做 workflow-and-review.md 的画面八条）')
            else:
                for k in ('慢放', '一套皮', '成果特写', '演示残留', '黑边'):
                    if k not in r: bad.append(f'终检报告「画面先查」里没有"{k}"这一条')
        if notdone and os.path.exists(notdone) and '演示残留' not in open(notdone, encoding='utf-8').read():
            bad.append('没做清单里没有"演示残留"一节（逐镜头对照零件样片图；没有就写"逐镜头对照过，没有"）')

    print(f'关口：{"分镜放行前" if mode == "plan" else "交片前"}　spec：{spec}')
    if bad:
        print(f'不通过，{len(bad)} 处：'); [print('  ✗ ' + b) for b in bad]; sys.exit(1)
    if mode == 'plan' and not os.path.exists(stamp):
        import time; json.dump({'关口一通过': time.strftime('%Y-%m-%d %H:%M:%S')}, open(stamp, 'w', encoding='utf-8'), ensure_ascii=False)
    print('通过。' + ('（' + '；'.join(ok) + '）' if ok else '')); sys.exit(0)

if __name__ == '__main__':
    main()
