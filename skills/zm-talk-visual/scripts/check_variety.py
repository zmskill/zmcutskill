#!/usr/bin/env python3
# 查对照表里"一个调调"的地方（2026-11-27 加：书桌测试片用户"太重复了，都是一个调调"）。
# 道理见 references/picture-and-words.md《主题不变，变奏不停》。
#
# 用法：python3 scripts/check_variety.py <对照表.md>
#
# 对照表要有两栏：
#   旋钮：这一拍和上一拍比拧了哪几个，从六个里写：主体、大小、来法、节奏、人、声（可以加几个字说明，如"大小：只拿起一条"）。
#         一个都没拧写"无"。换了一张同类的截图不算拧"主体"——主体指种类（截图 / 数字 / 清单 / 对比 / 人脸 / 物件）。
#   高点：是高点的行写"★ 现做：<为这条片子新做的是什么>"；不是高点空着。
#
# 只把要看的地方列出来，不替人判断好不好看。下面三种算不通过（是流程没走，不是审美）：
#   没有"旋钮"或"高点"这一栏；一个高点都没标；标了高点但没写现做什么。
import re, sys

KNOBS = ['主体', '大小', '来法', '节奏', '人', '声']
EMPTY = {'', '无', '—', '-', '没', '没有', '不变'}

def knobs_of(v):
    v = re.sub(r'人物|人脸', '人', v)
    return [k for k in KNOBS if k in v]

def main(path):
    lines = open(path, encoding='utf-8').read().split('\n')
    hdr = None; rows = []; tables = 0
    for ln in lines:
        s = ln.strip()
        if not s.startswith('|'):
            if not s: hdr = None   # 空行结束一张表
            continue
        cells = [c.strip() for c in s.strip('|').split('|')]
        if hdr is None:
            if any('旋钮' in c for c in cells) or any('高点' in c for c in cells):
                hdr = {'knob': next((i for i, c in enumerate(cells) if '旋钮' in c), None),
                       'peak': next((i for i, c in enumerate(cells) if '高点' in c), None)}
                tables += 1; first = True
            continue
        if set(''.join(cells)) <= set('-: '): continue
        g = lambda k: cells[hdr[k]] if hdr[k] is not None and hdr[k] < len(cells) else None
        rows.append({'key': cells[0], 'words': cells[1] if len(cells) > 1 else '', 'knob': g('knob'), 'peak': g('peak'), 'first': first, 'tab': tables})
        first = False
    if not tables:
        print('不通过：没找到带"旋钮"和"高点"两栏的表。对照表加这两栏，写法见本脚本开头。'); return 1
    fail = []; look = []
    if any(r['knob'] is None for r in rows): fail.append('有的表没有"旋钮"这一栏')
    if any(r['peak'] is None for r in rows): fail.append('有的表没有"高点"这一栏')
    # 1. 没拧的
    still = [r for r in rows if r['knob'] is not None and not r['first'] and (r['knob'] in EMPTY or not knobs_of(r['knob']))]
    for r in still: look.append(f'没拧 · {r["key"]}「{r["words"][:16]}」：和上一拍一样，观众会觉得"又是这样"。是故意停住（写"节奏：停住"）还是忘了变？')
    # 2. 连着三拍以上只拧同一个
    run = []
    def flush():
        if len(run) >= 3: look.append(f'连着 {len(run)} 拍只拧了「{run[0][1]}」 · {run[0][0]} → {run[-1][0]}：其余五个都没动，整体还是一个调调。')
    for r in rows:
        ks = knobs_of(r['knob'] or '')
        sig = '、'.join(ks) if len(ks) == 1 else None
        if sig and run and run[-1][1] == sig: run.append((r['key'], sig))
        else:
            flush(); run[:] = [(r['key'], sig)] if sig else []
    flush()
    # 3. 高点
    peaks = [r for r in rows if r['peak'] and r['peak'] not in EMPTY]
    if rows and not peaks: fail.append('一个高点都没标。先找出结论、反转、最大的数字、情绪最满的话，在"高点"栏写"★ 现做：…"')
    for r in peaks:
        if '现做' not in r['peak'] or len(re.sub(r'[★\s:：]|现做', '', r['peak'])) < 4:
            fail.append(f'高点 {r["key"]}「{r["words"][:16]}」没写现做什么（要写清为这条片子新做的场 / 物件 / 动作）')
    print(f'{len(rows)} 拍，{len(peaks)} 个高点，{len(still)} 拍没拧。')
    if peaks:
        print('高点（看间隔是不是太远、最后一个是不是最大）：')
        for r in peaks: print(f'  ★ {r["key"]}「{r["words"][:16]}」 {r["peak"][:40]}')
    for x in look: print('  要看 · ' + x)
    for x in fail: print('  不通过 · ' + x)
    print('这个脚本只看表填得对不对、哪里可能重复；好不好看、惊不惊艳，看关键帧、给用户看。')
    return 1 if fail else 0

if __name__ == '__main__':
    if len(sys.argv) < 2: print(__doc__ or '用法：python3 scripts/check_variety.py <对照表.md>'); sys.exit(2)
    sys.exit(main(sys.argv[1]))
