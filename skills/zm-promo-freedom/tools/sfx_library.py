#!/usr/bin/env python3
# 给一个音效库补齐记录：量时长／各个时间点／响度，按"它是什么"和"还能当什么用"整理描述，
# 并把各条片子的音效清单里的使用情况和评价汇总回来。
#
# 用法：
#   python3 sfx_library.py build  <音效库文件夹>              读 sounds.json + 草稿表，量每个文件，写出 音效库记录.json / .md
#   python3 sfx_library.py usage  <音效库文件夹> <清单.json>…  把片子的音效清单汇总进"用过的地方"
#
# 库里的子文件夹如果自带 sounds.json（比如后来补的「补缺」），build 会一起读进来：
#   每条要有 file；说明写在 scene 或 zh；variants 里的文件算同一组的变体；license 逐条记进「许可」。
#
# 只依赖 numpy 和 ffmpeg。音效文件留在原地，不复制、不改动。
import json, os, re, subprocess, sys, datetime, glob
import numpy as np
import os as _os, sys as _sys; _sys.path.insert(0, _os.path.dirname(_os.path.abspath(__file__))); from _ff import FFMPEG

SR = 48000

def decode(path):
    raw = subprocess.run([FFMPEG, '-v', 'error', '-i', path, '-f', 'f32le', '-ac', '2', '-ar', str(SR), '-'], capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32).reshape(-1, 2).astype(np.float64)

def k_weight(x):
    """ITU-R BS.1770 的 K 计权（48k 的两级滤波器），在频域里乘上去。"""
    n = len(x); w = np.exp(-2j * np.pi * np.fft.rfftfreq(n))
    def H(b, a): return (b[0] + b[1] * w + b[2] * w * w) / (a[0] + a[1] * w + a[2] * w * w)
    h = H([1.53512485958697, -2.69169618940638, 1.19839281085285], [1, -1.69065929318241, 0.73248077421585]) * H([1.0, -2.0, 1.0], [1, -1.99004745483398, 0.99007225036621])
    return np.fft.irfft(np.fft.rfft(x, axis=0) * h[:, None], n=n, axis=0)

def measure(path):
    x = decode(path); n = len(x)
    env = np.abs(x).max(1)
    win = max(1, int(0.005 * SR)); env = np.convolve(env, np.ones(win) / win, mode='same')
    pk = env.max() + 1e-12; ipk = int(env.argmax())
    def first(th): i = np.where(env > pk * th)[0]; return float(i[0]) / SR if len(i) else 0.0
    def last(th): i = np.where(env > pk * th)[0]; return float(i[-1]) / SR if len(i) else n / SR
    # 最响的 150 毫秒，K 计权
    y = k_weight(x); p = (y ** 2).sum(1); w = int(0.15 * SR)
    if n <= w: ms = p.mean()
    else:
        c = np.concatenate([[0], np.cumsum(p)]); ms = ((c[w:] - c[:-w]) / w).max()
    return {
        '时长': round(n / SR, 3),
        '听得见的开头': round(first(0.01), 3), '起音': round(first(0.1), 3), '最响处': round(ipk / SR, 3),
        '主体结束': round(last(0.1), 3), '听得见的结尾': round(last(0.01), 3),
        '响度': round(-0.691 + 10 * np.log10(ms + 1e-12), 1),
        '峰值': round(20 * np.log10(np.abs(x).max() + 1e-12), 1),
    }

def load_sources(lib):
    src = json.load(open(os.path.join(lib, 'sounds.json'), encoding='utf-8'))
    items = [dict(s, _lic='Sonniss') for s in src['sounds']]
    for p in sorted(glob.glob(os.path.join(lib, '*', 'sounds.json'))):
        sub = os.path.basename(os.path.dirname(p))
        for s in json.load(open(p, encoding='utf-8'))['sounds']:
            files = [s['file']] + list(s.get('variants', []))
            for i, f in enumerate(files):
                e = {'file': sub + '/' + f, 'type': s.get('type', 'one-shot'), 'scene': s.get('scene') or s.get('zh', ''), 'source': s.get('source', ''), '_lic': s.get('license', ''), '_sub': True}
                if len(files) > 1: e['of'] = sub + '/' + files[0]; e['segment'] = i + 1
                items.append(e)
    return src, items

ALIGN = {'I': '那一帧', 'A': '动作开始', 'R': '落点', 'M': '移动最快处', 'B': '铺底'}

def build(lib):
    src, items = load_sources(lib)
    draft = json.load(open(os.path.join(lib, '记录草稿.json'), encoding='utf-8'))
    old = {}
    p_old = os.path.join(lib, '音效库记录.json')
    if os.path.exists(p_old):
        for r in json.load(open(p_old, encoding='utf-8'))['音效']: old[r['文件']] = r
    out = []
    for s in items:
        f = s['file']; stem = os.path.basename(f)
        key = next((k for k in sorted(draft['按文件名开头'], key=len, reverse=True) if stem.startswith(k)), None)
        if key is None: raise SystemExit('草稿里没有：' + stem)
        row = draft['按文件名开头'][key]
        cat, mat, al, under, weight, dist = row[:6]
        scene = s['scene'].rstrip('。')
        if len(row) > 6:   # 草稿里写了"它是什么"：原说明当用途，去掉括号里的备注
            desc, uses = row[6], re.sub(r'（[^）]*）', '', scene).replace('：', '、')
        else: desc, _, uses = scene.partition('：')
        uses = [u.strip() for u in uses.replace('，', '、').split('、') if u.strip()]
        if len(row) > 6: uses = [u for u in uses if '秒' not in u and not u.startswith('「')]
        uses += [u for u in draft.get('补充用途', {}).get(key, []) if u not in uses]
        m = measure(os.path.join(lib, f))
        hit = m['最响处'] if m['最响处'] - m['起音'] < 0.3 else m['起音']  # 一下子的声音：对最响的那一下；余音很长、最响处很靠后的，对起音
        sync = {'I': hit, 'A': m['听得见的开头'], 'R': m['最响处'], 'M': m['最响处'], 'B': 0.0}[al]
        prev = old.get(f, {})
        out.append({
            '文件': f, '分类': cat, '材质': mat,
            '描述': desc, '还能当什么用': uses,
            '远近': dist, '轻重': weight,
            '类型': {'one-shot': '单个', 'segment': '同一段录音里切出的一下', 'loop': '可循环'}[s['type']],
            **({'同一组': s['of'], '第几个': s['segment']} if s.get('of') else {}),
            '对齐': {'对在哪': ALIGN[al], '对齐点': round(sync, 3), '说明': {
                'I': '最响的那一下对在画面那一帧', 'A': '声音一开始就对在动作开始的那一帧，跟着动作走', 'R': '最响的那一下对在落点或揭晓的那一帧，前面是铺垫',
                'M': '最响处对在移动最快的时刻', 'B': '当底子铺着，从哪里开始都行'}[al]},
            '量出来的': m,
            '压在说话下面': under,
            '来源': {'原文件': s['source'], **({'原文件里从第几秒开始': s['source_start'], '处理时调过的音量': round(s['gain_db'], 1)} if 'source_start' in s else {})},
            '许可': s['_lic'],
            '你的评价': prev.get('你的评价', {'结论': '', '备注': '', '日期': ''}),
            '用过的地方': prev.get('用过的地方', []),
        })
    rec = {
        '名称': src['name'], '格式': src['format'], '许可': src['license_note'],
        '更新': datetime.date.today().isoformat(),
        '怎么读': {
            '分类／材质': '按声源和材质分（参照 UCS 的思路，没有套它的官方代号）。不按用途分。',
            '描述': '它本身是什么：东西、动作、特征。',
            '还能当什么用': '搜索用的词：画面上什么时候可以拿它来用。一个音效可以有好几个用途。',
            '对齐': '开始播放的时间 = 画面那一刻 − 对齐点。',
            '量出来的': '时间都是从文件开头算的秒数。响度 = 最响的 150 毫秒（K 计权，LUFS），用来把不同音效拉平；峰值单位 dB。',
            '压在说话下面': '能 = 可以和说话重叠（压低后）；句间 = 低音、人声、带旋律或很吵的，只放在两句话之间。',
            '许可': '逐条记。Sonniss = 来自 Sonniss GDC 2026 免费包（免版税、可商用）；CC0 = 公共领域。两种都可以随 skill 一起发布（2026-11-20 逐梦确认）。',
            '你的评价': '只有逐梦能填：常用／可用／别用，加一句话。空着表示还没听过或没用过。',
            '用过的地方': '由 sfx_library.py usage 从各条片子的音效清单里汇总，别手改。',
        },
        '音效': out,
    }
    json.dump(rec, open(p_old, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    write_md(lib, rec)
    print(len(out), '个音效已记录')

def write_md(lib, rec):
    L = ['# ' + rec['名称'] + ' · 音效库记录', '', '更新：' + rec['更新'], '', rec['许可'], '',
         '完整数据在 `音效库记录.json`。这张表给人看：先看"还能当什么用"找候选，再看评价和用过的地方。', '']
    groups = {}
    for r in rec['音效']: groups.setdefault(os.path.dirname(r['文件']), []).append(r)
    for g, rs in groups.items():
        L += ['## ' + g, '', '| 文件 | 它是什么 | 还能当什么用 | 时长 | 对在哪 | 响度 | 说话下面 | 许可 | 你的评价 | 用过 |', '|---|---|---|---|---|---|---|---|---|---|']
        seen = {}
        for r in rs:
            k = r.get('同一组') or r['文件']
            seen.setdefault(k, []).append(r)
        for k, v in seen.items():
            r = v[0]; name = os.path.basename(r['文件'])
            if len(v) > 1: name += f'（同组 {len(v)} 个）'
            ev = '；'.join(sorted({x['你的评价']['结论'] for x in v if x['你的评价']['结论']})) or '—'
            used = sum(len(x['用过的地方']) for x in v)
            L.append(f"| {name} | {r['分类']}：{r['描述']} | {'、'.join(r['还能当什么用']) or '—'} | {r['量出来的']['时长']} 秒 | {r['对齐']['对在哪']} | {r['量出来的']['响度']} | {r['压在说话下面']} | {r.get('许可', '')} | {ev} | {used or '—'} |")
        L.append('')
    open(os.path.join(lib, '音效库记录.md'), 'w', encoding='utf-8').write('\n'.join(L))

def usage(lib, sheets):
    p = os.path.join(lib, '音效库记录.json'); rec = json.load(open(p, encoding='utf-8'))
    by = {r['文件']: r for r in rec['音效']}
    for r in rec['音效']: r['用过的地方'] = [u for u in r['用过的地方'] if u.get('清单') not in [os.path.basename(s) for s in sheets]]
    n = 0
    for sp in sheets:
        sh = json.load(open(sp, encoding='utf-8'))
        for c in sh['音效']:
            r = by.get(c['文件'])
            if not r: continue
            fb = c.get('用户反馈') or c.get('逐梦的反应', '')
            r['用过的地方'].append({'片子': sh['片子'], '清单': os.path.basename(sp), '时间': c['时间'], '画面': c['画面'], '为什么配': c['为什么配'], '反应': fb})
            n += 1
            v = fb
            if v and not r['你的评价']['结论']:
                r['你的评价'] = {'结论': '可用' if v.startswith('好') else ('别用' if v.startswith('不') else ''), '备注': f"{sh['片子']} {c['时间']} 秒：{v}", '日期': datetime.date.today().isoformat()}
    rec['更新'] = datetime.date.today().isoformat()
    json.dump(rec, open(p, 'w', encoding='utf-8'), ensure_ascii=False, indent=1); write_md(lib, rec)
    print('汇总了', n, '次使用')

if __name__ == '__main__':
    if len(sys.argv) >= 3 and sys.argv[1] == 'build': build(sys.argv[2])
    elif len(sys.argv) >= 4 and sys.argv[1] == 'usage': usage(sys.argv[2], sys.argv[3:])
    else: print(__doc__ or '用法见文件开头')
