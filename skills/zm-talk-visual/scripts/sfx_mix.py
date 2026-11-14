#!/usr/bin/env python3
# 按一张"音效清单"把人声、音乐、音效混成一条声音，打印量出来的音量，并生成一个可以逐条试听的页面。
#
# 用法：python3 sfx_mix.py <音效清单.json> <音效库文件夹> <输出.wav> [试听页.html]
#
# 清单里可以写「起点」（这一段从全片第几秒开始），音效的时间一律按全片写。
#
# 规则（见 references/sound-library.md）：
#   开始播放的时间 = 画面那一刻 − 对齐点（对齐点来自音效库记录；变速时除以倍率）
#   音量：先按音效库记录里的"响度"（最响的 150 毫秒）拉平，再按"档"定到人声平均响度的上下若干分贝
#   音乐：压到人声平均响度下面指定的分贝数；清单里列出的时刻前后再压一点
import json, os, subprocess, sys, base64, html
import numpy as np
import os as _os, sys as _sys; _sys.path.insert(0, _os.path.dirname(_os.path.abspath(__file__))); from _ff import FFMPEG
SR = 48000
TIER = {'质感': -13, '辅助': -8, '标记': -4, '重音': 2}   # 相对人声平均响度，单位 dB

def dec(path, ss=None, t=None, rate=1.0):
    cmd = [FFMPEG, '-v', 'error'] + (['-ss', str(ss)] if ss else []) + (['-t', str(t)] if t else []) + ['-i', path]
    if rate != 1.0: cmd += ['-af', f'asetrate={int(SR * rate)},aresample={SR}']
    raw = subprocess.run(cmd + ['-f', 'f32le', '-ac', '2', '-ar', str(SR), '-'], capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32).reshape(-1, 2).astype(np.float64)

def kw(x):
    n = len(x); w = np.exp(-2j * np.pi * np.fft.rfftfreq(n))
    H = lambda b, a: (b[0] + b[1] * w + b[2] * w * w) / (a[0] + a[1] * w + a[2] * w * w)
    h = H([1.53512485958697, -2.69169618940638, 1.19839281085285], [1, -1.69065929318241, 0.73248077421585]) * H([1.0, -2.0, 1.0], [1, -1.99004745483398, 0.99007225036621])
    return np.fft.irfft(np.fft.rfft(x, axis=0) * h[:, None], n=n, axis=0)

def loud(x):  # 整段的平均响度（不做门限，够用来比较）
    return -0.691 + 10 * np.log10((kw(x) ** 2).sum(1).mean() + 1e-12)

def loud_gated(x):  # 只算有声音的 400 毫秒块，接近"人在说话时有多响"
    p = (kw(x) ** 2).sum(1); w = int(0.4 * SR); b = p[:len(p) // w * w].reshape(-1, w).mean(1)
    l = -0.691 + 10 * np.log10(b + 1e-12); g = b[l > l.max() - 20]
    return -0.691 + 10 * np.log10(g.mean() + 1e-12)

def main(sheet_p, lib, out_wav, page=None):
    sh = json.load(open(sheet_p, encoding='utf-8'))
    rec = {r['文件']: r for r in json.load(open(os.path.join(lib, '音效库记录.json'), encoding='utf-8'))['音效']}
    base = os.path.dirname(os.path.abspath(sheet_p))
    P = lambda p: p if os.path.isabs(p) else os.path.join(base, p)
    dur = sh['时长']; n = int(dur * SR); t = np.arange(n) / SR
    t0 = sh.get('起点', 0)   # 这一段从全片的第几秒开始；清单里的时间都按全片写
    voice = dec(P(sh['人声']), ss=t0, t=dur)[:n]
    if len(voice) < n: voice = np.vstack([voice, np.zeros((n - len(voice), 2))])   # 人声比写的时长短一点点时补零
    v_l = loud_gated(voice)
    # 音乐：可以是一段，也可以是好几段（列表）。每段写：文件、从第几秒开始（歌里的位置）、进 / 出（全片时间，不写就是整段）、
    # 比人声低、压平（起伏大的歌用）、淡入、淡出、撤掉 [[从, 到], …]（这几句不要音乐）、压低 [[从, 到, 分贝], …]、这些时刻再压一点（给重音让位）
    music = np.zeros((n, 2)); info = []
    for mu in (sh['音乐'] if isinstance(sh['音乐'], list) else [sh['音乐']]):
        a = mu.get('进', t0) - t0; b = min(mu.get('出', t0 + dur) - t0, dur); m = int((b - a) * SR)
        x = dec(P(mu['文件']), ss=mu.get('从第几秒开始', 0), t=b - a)[:m]; tt = np.arange(len(x)) / SR + a   # tt：这一段每个采样在本段片子里的时间
        if mu.get('已调好'):   # bgm_prepare.py 出的配乐轨：音量已经跟着人声调好了，原样放，下面的压平、压低都不再做
            x = dec(P(mu['文件']), ss=a + t0, t=b - a)[:m]   # 配乐轨按全片时间铺好，从这一段在全片里的位置取
            music[int(a * SR):int(a * SR) + len(x)] += x; info.append(f"{os.path.basename(mu['文件'])[:24]}（已调好）"); continue
        env = np.full(len(x), 10 ** ((v_l - mu['比人声低'] - loud(x)) / 20))
        if mu.get('压平') is not None:   # 起伏大的歌：比整段平均响出「压平」分贝以上的地方，压回去（按 2 秒的平均音量慢慢跟）
            w = 2 * SR; p2 = (x ** 2).sum(1); cs = np.concatenate([[0], np.cumsum(p2)]); i0 = np.clip(np.arange(len(x)) - w // 2, 0, len(x)); i1 = np.clip(np.arange(len(x)) + w // 2, 0, len(x))
            loc = 10 * np.log10((cs[i1] - cs[i0]) / np.maximum(1, i1 - i0) + 1e-12); avg = 10 * np.log10(p2.mean() + 1e-12)
            env *= 10 ** (np.minimum(0, avg + mu['压平'] - loc) / 20)
        if mu.get('开头先响一点'): env *= 1 + (mu['开头先响一点'] - 1) * np.clip(1 - (tt - a - 0.05) / 0.3, 0, 1)
        for d in mu.get('这些时刻再压一点', []): env *= 1 - 0.45 * np.exp(-(((tt - (d - t0) - 0.1) / 0.3) ** 2))
        if mu.get('淡入'): env *= np.clip((tt - a) / mu['淡入'], 0, 1)
        if mu.get('淡出'): env *= np.clip((b - tt) / mu['淡出'], 0, 1)
        for c0, c1 in mu.get('撤掉', []):   # 半秒淡出，半秒淡回
            env *= 1 - np.clip((tt - (c0 - t0)) / 0.5, 0, 1) * np.clip(((c1 - t0) - tt) / 0.5 + 1, 0, 1)
        for c0, c1, db in mu.get('压低', []):
            env *= 10 ** (-db / 20 * np.clip((tt - (c0 - t0)) / 0.4, 0, 1) * np.clip(((c1 - t0) - tt) / 0.4, 0, 1))
        k = int(a * SR); music[k:k + len(x)] += x * env[:, None]
        info.append(f"{os.path.basename(mu['文件'])[:24]} {a + t0:.1f}–{b + t0:.1f} 秒")
    fx = np.zeros((n, 2)); rows = []
    for i, c in enumerate(sh['音效']):
        r = rec[c['文件']]; rate = c.get('变速', 1.0)
        x = dec(os.path.join(lib, c['文件']), rate=rate)
        if c.get('截到'):
            m = int(c['截到'] * SR); x = x[:m]; f = min(len(x), int(c.get('淡出', 0.08) * SR)); x[-f:] *= np.linspace(1, 0, f)[:, None]
        target = v_l + TIER[c['档']] + c.get('微调', 0)
        gain = 10 ** ((target - r['量出来的']['响度']) / 20)
        st = max(0.0, c['时间'] - t0 - r['对齐']['对齐点'] / rate)
        a = int(st * SR); b = min(n, a + len(x)); fx[a:b] += x[:b - a] * gain
        rows.append((i + 1, c, st, 20 * np.log10(gain), target))
    mix = voice + music + fx
    db = lambda x: 20 * np.log10(np.sqrt((x ** 2).mean()) + 1e-12)
    info_s = '；'.join(info)   # 先拼好：f 字符串里套同种引号要 Python 3.12，Mac 自带的 python3 不行
    print(f'{len(rows)} 个音效 | 人声响度 {v_l:.1f} | 音乐 {info_s} | 音效最高峰值 {20*np.log10(np.abs(fx).max()+1e-12):.1f} dB | 混合峰值 {20*np.log10(np.abs(mix).max()):.1f} dB')
    wr = lambda p, x: subprocess.run([FFMPEG, '-v', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '2', '-i', '-', p], input=np.clip(x, -1, 1).astype(np.float32).tobytes(), check=True)
    wr(out_wav, mix)
    if not page: return
    def clip(x, a, b):
        seg = np.clip(x[int(max(0, a) * SR):int(min(dur, b) * SR)] * 3.0, -1, 1).astype(np.float32).tobytes()
        o = subprocess.run([FFMPEG, '-v', 'error', '-f', 'f32le', '-ar', str(SR), '-ac', '2', '-i', '-', '-ac', '1', '-b:a', '64k', '-f', 'mp3', '-'], input=seg, capture_output=True, check=True).stdout
        return 'data:audio/mpeg;base64,' + base64.b64encode(o).decode()
    H = ['<!doctype html><html lang=zh><meta charset=utf-8><meta name=viewport content="width=device-width,initial-scale=1"><title>音效逐条试听</title>',
         '<style>body{margin:0;background:#f7f5f0;color:#1d212b;font:15px/1.6 -apple-system,"PingFang SC",sans-serif}main{max-width:860px;margin:0 auto;padding:24px 16px 80px}h1{font-size:22px;margin:0 0 4px}p.l{color:#6b6a66;margin:0 0 18px}.c{background:#fff;border:1px solid #e6e1d6;border-radius:12px;padding:12px 14px;margin:10px 0}.t{font-weight:700}.t b{color:#f0672a;font-variant-numeric:tabular-nums}.m{color:#6b6a66;font-size:13px;word-break:break-all}.r{display:flex;gap:14px;flex-wrap:wrap;margin-top:8px;align-items:center}.r span{font-size:13px;color:#6b6a66}audio{height:32px}@media(prefers-color-scheme:dark){body{background:#161615;color:#ecebe7}.c{background:#1f1f1e;border-color:#2e2d2b}.m,.r span,p.l{color:#9a9893}}</style><main>',
         f'<h1>{html.escape(sh["片子"])} · 音效逐条试听</h1><p class=l>每条两段：只有音效（放大了，方便听清音色）、成片里的样子（人声加音乐加音效）。哪条不对，告诉我编号就行。</p>']
    for i, c, st, gd, target in rows:
        H.append(f'<div class=c><div class=t><b>{i:02d} · {c["时间"]:.2f} 秒</b>　{html.escape(c["画面"])}</div><div class=m>说到"{html.escape(c.get("对着",""))}" · 为什么配：{c["为什么配"]} · {c["档"]} · {html.escape(os.path.basename(c["文件"]))}{" · 变速 "+str(c["变速"]) if c.get("变速") else ""}{" · "+html.escape(c["备注"]) if c.get("备注") else ""}</div>'
                 f'<div class=r><span>只有音效</span><audio controls preload=none src="{clip(fx, c["时间"]-t0-0.5, c["时间"]-t0+1.3)}"></audio><span>成片里</span><audio controls preload=none src="{clip(mix/3.0*2.2, c["时间"]-t0-1.0, c["时间"]-t0+1.6)}"></audio></div></div>')
    open(page, 'w', encoding='utf-8').write(''.join(H) + '</main></html>')

if __name__ == '__main__':
    if len(sys.argv) < 4: print(__doc__ or '用法见文件开头'); sys.exit(1)
    main(*sys.argv[1:5])
