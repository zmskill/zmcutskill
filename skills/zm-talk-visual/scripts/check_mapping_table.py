#!/usr/bin/env python3
# 检查对照表里的"镜头库"一栏：每一行都要写清楚用了库里的哪个镜头，或者为什么不用。
# 这一栏没填完，不许开始做画面。（2026-11-12：全片第 1 版 68 秒以后跳过了查库，一个镜头都没用上。）
#
# 用法：python3 scripts/check_mapping_table.py <对照表.md> [skill 根目录]
# 通过只说明表填全了、用户确认过，不说明画面做得好。
#
# 一行算合格：
#   - 写了现成的口播版组件名（koubo-fit.md 里加粗的英文名），并写上"取哪一段、怎么放"；
#   - 或者写了镜头卡的名字（还没有口播版），并写明"照卡现做：取卡里的哪个动作"；脚本会列出开做前必须读的卡；
#   - 或者以"不用："开头，后面必须点名查过库里的哪个镜头（至少一个名字），再写为什么不合适。
#     "人物满屏""真素材"也一样要这么写：比如"不用：人物满屏。查过 DMWall、PickWall，这句是在讲道理，没有东西可摆"。
#     只写"人物满屏""真素材""不合适"不算查过。（第一版后半段没用镜头库，就是这样一行行"人物满屏"混过去的。）
# 表的末尾要有一行"用户确认：<日期> <他怎么说的>"，空着不通过。
# 另外会报出没用镜头的行占多少；超过一半时要在对照表末尾加一段"为什么这么少"，写给用户看。
import glob, json, os, re, sys

def shot_names(root):
    # 只读文字索引，不翻代码：镜头卡的名字（library-own.json）+ koubo-fit.md 里加粗的口播版名字
    names = set()
    js = os.path.join(root, 'shot-library', 'index', 'library-own.json')
    if os.path.exists(js): names |= {c['name'] for c in json.load(open(js, encoding='utf-8'))['cards']}
    for d in ('cards', 'groups'):
        for f in glob.glob(os.path.join(root, 'shot-library', 'own', d, '**', '*.md'), recursive=True):
            n = os.path.splitext(os.path.basename(f))[0]
            if n not in ('README', 'TEMPLATE'): names.add(n)
    fit = os.path.join(root, 'shot-library', 'index', 'koubo-fit.md')
    if os.path.exists(fit): names |= set(re.findall(r'\*\*([A-Z][A-Za-z]+)\*\*', open(fit, encoding='utf-8').read()))
    return {n for n in names if len(n) > 3 and not n.startswith('_')}

def koubo_names(root):   # 已经改好、放进舞台就能用的口播版组件（koubo-fit.md 里加粗的英文名）
    fit = os.path.join(root, 'shot-library', 'index', 'koubo-fit.md')
    return set(re.findall(r'\*\*([A-Z][A-Za-z]+)\*\*', open(fit, encoding='utf-8').read())) if os.path.exists(fit) else set()

def card_path(root, n):
    g = glob.glob(os.path.join(root, 'shot-library', 'own', '*', '**', n + '.md'), recursive=True)
    return os.path.relpath(g[0], root) if g else n

def rest(v, named):   # 去掉镜头名和"不用"后，还剩多少字（取哪一段 / 为什么不用）
    for n in named: v = v.replace(n, '')
    return len(re.sub(r'[\s:：，,、。；;（）()\-—"“”]|^不用', '', v))

def main(path, root):
    names = shot_names(root); koubo = koubo_names(root); to_read = []; ok_k = []; ok_c = []
    lines = open(path, encoding='utf-8').read().split('\n')
    col = None; rows = []; bad = []
    for ln in lines:
        if not ln.strip().startswith('|'): col = None if not ln.strip() else col; continue
        cells = [c.strip() for c in ln.strip().strip('|').split('|')]
        if col is None:
            hit = [i for i, c in enumerate(cells) if '镜头库' in c]
            if hit: col = hit[0]
            continue
        if set(''.join(cells)) <= set('-: '): continue
        if col >= len(cells): bad.append((cells[0], '这一行没有"镜头库"这一格')); continue
        v = cells[col]; rows.append((cells[0], v))
        named = [n for n in names if n in v]
        if named and not v.startswith('不用'):                              # 用了库里的镜头：还要写取哪一段、怎么放
            if any(n in koubo for n in named):                             # 现成的口播版组件
                if rest(v, named) >= 4: ok_k.append(cells[0]); continue
                bad.append((cells[0], f'写了镜头名，没写取哪一段、怎么放：「{v[:30]}」')); continue
            # 只写了镜头卡的名字：库里没有现成的口播版，要照卡现做，先读卡
            if ('照卡现做' in v or '现做' in v) and rest(v, named) >= 8:
                to_read += [n for n in named if n not in to_read]; ok_c.append(cells[0]); continue
            bad.append((cells[0], f'「{named[0]}」没有现成的口播版组件。要用就照卡现做：先读卡（{card_path(root, named[0])}），这一格写"照卡现做：取卡里的哪个动作、怎么放"；只是借个意思就写"不用"并说明：「{v[:30]}」')); continue
        if v.startswith('不用') and named and rest(v, named) >= 8: continue  # 不用，但点名查过哪个、写了理由
        if v.startswith('不用') and named: bad.append((cells[0], f'写了不用、点了名，但没说为什么不合适（至少一句话）：「{v[:30]}」')); continue
        bad.append((cells[0], '空着' if not v or v in '—-' else (f'写了不用，但没点名查过库里的哪个镜头：「{v[:30]}」' if v.startswith('不用') or '人物满屏' in v or '真素材' in v else f'看不出查过库：「{v[:30]}」')))
    if not rows and not bad:
        print('没找到带"镜头库"一栏的表。对照表的表头里要有一栏叫"镜头库"。'); return 1
    used_rows = ok_k + ok_c
    print(f'{len(rows)} 行：{len(ok_k)} 行用现成的口播版组件，{len(ok_c)} 行照卡现做，{len(rows) - len(used_rows) - len(bad)} 行写了"不用"并点名查过哪个，{len(bad)} 行不合格。')
    for k, why in bad: print(f'  不合格 · {k}：{why}')
    if to_read: print('照卡现做的，开做前先读这几张卡（动效核心、参数表、已知坑），动作和参数照卡来：\n' + '\n'.join('  - ' + card_path(root, n) for n in to_read))
    text = '\n'.join(lines)
    if rows and len(used_rows) * 2 < len(rows) and '为什么这么少' not in text:
        print(f'不合格 · 用了镜头的行不到一半（{len(used_rows)}/{len(rows)}）。在对照表末尾加一节"## 为什么这么少"，向用户说明：是这条片子讲道理的话多、库里确实没有，还是别的原因。')
        return 1
    m = re.search(r'(用户)确认[:：][ \t]*([^\n|]*)', text)
    if not m or not m.group(2).strip().strip('_＿ '):
        print('还没确认：把对照表发给用户，等他回复，再在表的末尾写一行"用户确认：<日期> <他怎么说的>"。没确认不许开始做画面。用户只对样子、选歌说过"你自己定"也一样要发表、等他回；他明确说过全程直接做完的，写"用户确认：<日期> 他说全程直接做（原话：……）"。')
        return 1
    return 1 if bad else 0

if __name__ == '__main__':
    if len(sys.argv) < 2: print(__doc__ or '用法见文件开头'); sys.exit(2)
    sys.exit(main(sys.argv[1], sys.argv[2] if len(sys.argv) > 2 else os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
