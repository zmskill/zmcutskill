#!/usr/bin/env python3
"""把创作者挑好的歌做成能直接混进成片的配乐轨，顺带出给创作者听的试听和画面要用的数据。
用法：python3 scripts/bgm_prepare.py <配乐表.json>

配乐表（路径都相对配乐表所在的文件夹）：
{
  "人声": "../口播初剪.mp4",            口播初剪或人声 wav，从全片 0 秒开始
  "逐字时间": "听写/tokens.json",       transcribe.py 出的，用来判断哪里在说话
  "时长": 41.8,                         全片秒数（含片尾定格）
  "段": [                               一首歌一段；只在换章处换歌
    {"歌": "../Little Things.mp3", "名字": "Little Things", "进": 0, "出": 41.8, "从第几秒开始": 0.53,
     "说话时比人声低": 18, "停顿时比人声低": 8, "淡入": 0.3, "淡出": 2.0}
  ],
  "输出": "声音/配乐.wav",
  "试听": {"从": 0, "长": 15, "文件": "声音/配乐试听.mp3"},
  "画面数据": "声音/music.json"         可选：每帧 8 段频谱、重拍、歌名（操作台风格的 MUSIC 读它）
}
每段还可以写："停顿多久才抬"（秒，默认 1）、"跟随"（默认 true）、"让出人声频段"（分贝，默认 4，0 = 不让）、
"按哪里量响度"（全片秒数：前面很安静、后面才进来的歌，只量这一刻以后）。

做的事（道理见 references/bgm.md）：
  1. 整段拉到"说话时比人声低 N 分贝"；再每一刻量歌最近 2 秒有多响，随时补齐：温柔的前奏不会听不见，燃的副歌不会盖过人。
  2. 说话时把歌的 1–4 kHz 再让出几分贝（人声最要紧的频段）。
  3. 没人说话超过 1 秒才抬起来（抬到"停顿时比人声低"），说话一来 60 毫秒内压回去。
  4. 淡入淡出。最后量一遍：说话时歌比人声低多少（按 2 秒一段），打出来。
输出的配乐轨按全片时间铺好，在音效清单里写 {"文件": "配乐.wav", "已调好": true}，sfx_mix.py 会原样混进去。
AI 听不到：先把试听发给创作者，他说可以再往下做。"""
import json, os, subprocess, sys
import numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _ff import FFMPEG, require
from sfx_mix import dec, kw, loud, loud_gated, SR

def fit(x, n):
    return np.vstack([x, np.zeros((max(0, n - len(x)), 2))])[:n]

def main(sheet_p):
    require()
    from scipy.signal import butter, sosfilt
    sh = json.load(open(sheet_p, encoding='utf-8')); base = os.path.dirname(os.path.abspath(sheet_p))
    P = lambda p: p if os.path.isabs(p) else os.path.join(base, p)
    DUR = float(sh['时长']); N = int(DUR * SR); S = lambda t: int(round(t * SR))
    voice = fit(dec(P(sh['人声']), t=DUR), N)
    v_l = loud_gated(voice)
    # 哪里在说话：逐字时间前 0.12 秒到后 0.32 秒
    tok = json.load(open(P(sh['逐字时间']), encoding='utf-8')); tt = np.array([float(x[1]) for x in tok])
    fr = np.arange(0, DUR, 0.01); speak = np.zeros(len(fr), bool)
    for t in tt: speak[(fr >= t - 0.12) & (fr <= t + 0.32)] = True
    bed = np.zeros((N, 2)); songs = []; beats = []
    for sg in sh['段']:
        a = float(sg.get('进', 0)); e = min(float(sg.get('出', DUR)), DUR); L = e - a; n = min(S(L), N - S(a))
        ss = float(sg.get('从第几秒开始', 0)); dsp = float(sg.get('说话时比人声低', 18)); dgap = float(sg.get('停顿时比人声低', 8))
        raw = dec(P(sg['歌']), ss=ss, t=L)
        if len(raw) < n - SR // 2: print(f'注意：{os.path.basename(sg["歌"])} 从 {ss} 秒起只剩 {len(raw) / SR:.1f} 秒，不够这一段的 {L:.1f} 秒，后面是空的')
        y = fit(raw, n)
        ref = sg.get('按哪里量响度')
        y *= 10 ** ((v_l - dsp - loud(y if ref is None else y[S(ref - a):])) / 20)
        if sg.get('跟随', True):   # 每 0.1 秒量一次最近 2 秒，补成"比人声低 dsp"；最多压 10、补 15 分贝；歌自己停下来的地方不硬拉
            pw = (kw(y) ** 2).sum(1); hop = int(0.1 * SR); win = 2 * SR
            cs = np.concatenate([[0], np.cumsum(pw)]); cen = np.arange(0, len(y), hop)
            lo = np.clip(cen - win // 2, 0, len(y)); hi = np.clip(cen + win // 2, 0, len(y))
            st = -0.691 + 10 * np.log10((cs[hi] - cs[lo]) / np.maximum(hi - lo, 1) + 1e-12)
            corr = np.clip((v_l - dsp) - st, -10, 15); corr[st < v_l - dsp - 18] = 0
            k = 10; corr = np.convolve(np.pad(corr, (k, k), 'edge'), np.ones(2 * k + 1) / (2 * k + 1), 'valid')
            y *= (10 ** (np.interp(np.arange(len(y)), cen, corr) / 20))[:, None]
        sp = np.interp(np.arange(len(y)) / SR + a, fr, speak.astype(float))
        dip = float(sg.get('让出人声频段', 4))
        if dip:
            spm = np.convolve(sp, np.ones(4800) / 4800, 'same')
            mid = sosfilt(butter(2, [1000, 4000], 'band', fs=SR, output='sos'), y, axis=0)
            y = y - mid * (1 - 10 ** (-dip / 20)) * spm[:, None]
        # 停顿：没人说话超过 X 秒才抬
        gap = ~speak.copy(); i = 0; need = float(sg.get('停顿多久才抬', 1.0))
        while i < len(gap):
            if gap[i]:
                j = i
                while j < len(gap) and gap[j]: j += 1
                if (j - i) * 0.01 < need: gap[i:j] = False
                i = j
            else: i += 1
        tgt = np.where(np.interp(np.arange(len(y)) / SR + a, fr, gap.astype(float)) > 0.5, dsp - dgap, 0.0)
        ds = 480; tg = tgt[::ds]; sm = np.zeros_like(tg); c = 0.0; up = 1 - np.exp(-ds / SR / 0.30); dn = 1 - np.exp(-ds / SR / 0.06)
        for q in range(len(tg)): c += (tg[q] - c) * (up if tg[q] > c else dn); sm[q] = c
        y *= (10 ** (np.interp(np.arange(len(y)), np.arange(0, len(y), ds)[:len(sm)], sm) / 20))[:, None]
        if sg.get('淡入'): m = S(sg['淡入']); y[:m] *= np.linspace(0, 1, m)[:, None]
        if sg.get('淡出'): m = S(sg['淡出']); y[-m:] *= np.linspace(1, 0, m)[:, None]
        bed[S(a):S(a) + len(y)] += y
        name = sg.get('名字') or os.path.splitext(os.path.basename(sg['歌']))[0]; songs.append([a, e, name])
        try:
            from bgm_analyze import analyze
            beats += [round(a + d - ss, 3) for d in analyze(P(sg['歌']))['downbeats'] if a <= a + d - ss < e]
        except Exception as ex:
            print('重拍没量出来（不影响配乐轨）：', ex)
    # 量：说话为主的每 2 秒，歌比人声低多少
    diffs = []
    for k in range(0, N - 2 * SR, SR):
        f0, f1 = k / SR, k / SR + 2
        if speak[(fr >= f0) & (fr < f1)].mean() < 0.6: continue
        mb = loud(bed[k:k + 2 * SR])
        if mb > -70: diffs.append(loud(voice[k:k + 2 * SR]) - mb)
    out = P(sh['输出']); os.makedirs(os.path.dirname(out) or '.', exist_ok=True)
    wr = lambda p, x, extra: subprocess.run([FFMPEG, '-v', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '2', '-i', '-'] + extra + [p], input=np.clip(x, -1, 1).astype(np.float32).tobytes(), check=True)
    wr(out, bed, ['-c:a', 'pcm_s24le'])
    msg = f'人声响度 {v_l:.1f}；{len(songs)} 段歌；配乐轨 → {out}'
    if diffs: msg += f'\n说话时歌比人声低：中位 {np.median(diffs):.1f} dB（最少 {min(diffs):.1f}，最多 {max(diffs):.1f}；共 {len(diffs)} 个 2 秒窗）。一般 17–20；少于 15 会盖人，多于 24 等于没有'
    if sh.get('试听'):
        pv = sh['试听']; s0 = float(pv.get('从', 0)); ln = float(pv.get('长', 15)); po = P(pv['文件']); os.makedirs(os.path.dirname(po) or '.', exist_ok=True)
        seg = (voice + bed)[S(s0):S(min(DUR, s0 + ln))]
        wr(po, seg, ['-b:a', '192k']); msg += f'\n试听（人声 + 配乐，{s0:.0f}–{s0 + ln:.0f} 秒）→ {po}：先发给创作者听，他说可以再往下做'
    if sh.get('画面数据'):
        bands = []; hop = SR // 30; edges = [40, 90, 180, 350, 700, 1400, 2800, 5600, 12000]; mono = bed.mean(1); f = np.fft.rfftfreq(2048, 1 / SR)
        for k in range(int(DUR * 30)):
            s = mono[k * hop:k * hop + 2048]; s = np.pad(s, (0, 2048 - len(s)))
            F = np.abs(np.fft.rfft(s * np.hanning(2048)))
            bands.append([round(float(np.clip((20 * np.log10(F[(f >= edges[i]) & (f < edges[i + 1])].mean() + 1e-9) + 10) / 45, 0, 1)), 2) for i in range(8)])
        po = P(sh['画面数据']); json.dump({'bands': bands, 'downbeats': sorted(beats), 'songs': songs}, open(po, 'w', encoding='utf-8'), ensure_ascii=False)
        msg += f'\n画面数据（{len(bands)} 帧频谱、{len(beats)} 个重拍）→ {po}'
    print(msg)

if __name__ == '__main__':
    if len(sys.argv) < 2: print(__doc__); sys.exit(2)
    main(sys.argv[1])
