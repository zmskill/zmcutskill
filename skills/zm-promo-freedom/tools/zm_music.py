#!/usr/bin/env python3
"""zm_music.py — 音乐画像：分析这首歌每小节多响、多密，哪里炸开、哪里安静；再定这条片子用哪一档剪法。

  python3 $SKILL/tools/zm_music.py <歌或剪好的音乐> --beats <beats.json> --feel "情绪判断依据" [--offset 秒] [--len 秒] [--out analysis/music_profile.json]

  --beats   beats.py / cut_song.py 出的拍点表（时间是这个音频文件里的秒）
  --mood    直接指定档位（燃 / 中 / 松）。一般不用：用 --feel 写上凭什么定的（用户说过的话、歌单里的情绪标签、产品的感觉），工具自己换算；不要去问用户
  --offset  片子从这个音频的第几秒开始；--len 片子多长（秒）。不给就画整首

出一张"音乐结构表"（贴进设计 spec 的 ## 音乐画像）和 music_profile.json（zm_check.py、zm_film_check.py 会读）。
每小节标：满 / 中 / 静（按比最响小节轻多少分贝）、底鼓强不强、碎拍密不密；标出炸开的小节和最强的几下。
只用 ffmpeg + numpy。数字只来自测量，不代表好不好听。
"""
import argparse, json, os, sys
import numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import zm_au as au

GEARS = {  # 每档剪法的数（单位都是拍，换什么速度的歌都一样用）；说明见 references/music-and-beats.md 第二节
    '燃': dict(格子=0.5, 满段镜头拍=[2, 4], 静段镜头拍=[4, 8], 满段每小节事件=4, 静段每小节事件=1, 满段单次停留拍=1, 静小节最多占比=0.25, 同步点每30秒=[6, 12]),
    '中': dict(格子=1.0, 满段镜头拍=[4, 8], 静段镜头拍=[4, 8], 满段每小节事件=2, 静段每小节事件=1, 满段单次停留拍=2, 静小节最多占比=0.4, 同步点每30秒=[4, 8]),
    '松': dict(格子=2.0, 满段镜头拍=[8, 16], 静段镜头拍=[8, 16], 满段每小节事件=1, 静段每小节事件=0, 满段单次停留拍=8, 静小节最多占比=1.0, 同步点每30秒=[2, 5]),
}

def main():
    ap = argparse.ArgumentParser(); ap.add_argument('song'); ap.add_argument('--beats', required=True)
    ap.add_argument('--mood', default=''); ap.add_argument('--mood-said', default=''); ap.add_argument('--feel', default='', help='凭什么定的情绪：用户说过的话、歌单里的情绪标签、产品的感觉（原文照写）'); ap.add_argument('--offset', type=float, default=0); ap.add_argument('--len', type=float, default=0)
    ap.add_argument('--out', default='analysis/music_profile.json'); a = ap.parse_args()
    t0, T = au.grid_from(a.beats); x = au.load(a.song); dur = len(x) / au.SR
    B = json.load(open(a.beats, encoding='utf-8')); downs = B.get('downbeats')
    if downs: first = float(downs[0])
    elif B.get('bars'): first = float(B['bars'][0]['t'])
    else: first = t0
    # 小节线：从第一小节往两头铺满
    k0 = int(np.floor((0 - first) / (4 * T))); bars = []
    k = k0
    while first + (k + 1) * 4 * T <= dur + 1e-3:
        s = first + k * 4 * T
        if s >= -1e-3: bars.append(s)
        k += 1
    end = a.offset + a.len if a.len else dur
    bars = [s for s in bars if s + 4 * T > a.offset + 1e-3 and s < end - 1e-3]
    if len(bars) < 2: sys.exit('小节太少：检查 --beats 和 --offset / --len')
    tt, kick = au.onsets(x, lo=40, hi=160); _, hat = au.onsets(x, lo=6000); _, allo = au.onsets(x)
    kthr = np.percentile(kick, 90); hthr = np.percentile(hat, 85); gap = int(0.09 * au.SR / 256)
    kp = np.array(au.peaks(kick, kthr, gap)); hp = np.array(au.peaks(hat, hthr, gap))
    rows = []
    for i, s in enumerate(bars):
        e = s + 4 * T; lv = au.db(au.seg(x, s, e))
        nk = int(((tt[kp] >= s) & (tt[kp] < e)).sum()) if len(kp) else 0; nh = int(((tt[hp] >= s) & (tt[hp] < e)).sum()) if len(hp) else 0
        rows.append(dict(小节=i + 1, 片内秒=round(s - a.offset, 3), 歌里秒=round(s, 3), 响度=round(lv, 1), 底鼓=nk, 碎拍=nh))
    top = max(r['响度'] for r in rows)
    for r in rows:
        d = top - r['响度']; r['档'] = '满' if d <= 4 else ('静' if d >= 8 else '中')
    for i, r in enumerate(rows):
        r['炸开'] = bool(r['档'] == '满' and i > 0 and rows[i - 1]['档'] != '满' and r['响度'] - rows[i - 1]['响度'] >= 3)
    # 最强的几下（整首里起音最猛的时刻，落在片子范围内的）
    hits = [float(tt[i]) for i in sorted(au.peaks(allo, np.percentile(allo, 97), int(0.5 * au.SR / 256)), key=lambda i: -allo[i])]
    hits = [round(h - a.offset, 3) for h in hits if a.offset <= h < end][:6]
    n = len(rows); full = sum(r['档'] == '满' for r in rows); quiet = sum(r['档'] == '静' for r in rows)
    head = next((i for i, r in enumerate(rows) if r['档'] == '满'), len(rows))   # 开头到第一个满小节之前有几小节：只有这一段算"开头太空"；片尾歌自己收住的小节是放落版的好地方，不算
    bpm = 60 / T; dens = float(np.mean([r['底鼓'] + r['碎拍'] for r in rows if r['档'] == '满'] or [0])) / (4 * T)
    # 情绪三个维度（0–1）：音乐和画面靠情绪搭桥，画面的参数从这三个数推出来（references/core-principles.md 第 1 条）
    f = np.fft.rfftfreq(2048, 1 / au.SR); fr = np.lib.stride_tricks.sliding_window_view(au.seg(x, a.offset, end), 2048)[::4096]
    S = np.abs(np.fft.rfft(fr * np.hanning(2048), axis=1)).mean(0) if len(fr) else np.ones(len(f)); cen = float((S * f).sum() / (S.sum() + 1e-9))
    arousal = round(float(np.clip(0.6 * dens / 12 + 0.4 * (bpm - 60) / 110, 0, 1)), 2)      # 兴奋度：起音密不密、速度快不快
    fullness = round(full / n, 2)                                                            # 满空：满的小节占多少
    bright = round(float(np.clip((cen - 800) / 2600, 0, 1)), 2)                              # 明暗：声音的重心高不高
    guess = '燃' if arousal >= 0.6 else ('松' if arousal < 0.33 else '中')
    feel = (a.feel or a.mood_said).strip(); from_feel = ''
    KW = (('松', '温柔 安静 舒缓 舒服 轻柔 柔和 慢 治愈 抒情 平静 温暖 温馨 放松 钢琴 文艺 走心 感人 calm soft gentle warm'),
          ('燃', '燃 炸 热血 激动 激烈 酷 劲 动感 嗨 有力 猛 震撼 大片 史诗 epic hype'),
          ('中', '明亮 积极 轻快 俏皮 活泼 欢快 清新 科技 干净 简洁 阳光 开心 bright upbeat'))
    hit = {g: sum(feel.lower().count(w) for w in ws.split()) for g, ws in KW}
    if feel and max(hit.values()) > 0: from_feel = max(hit, key=hit.get)
    mood = a.mood or from_feel or guess
    if mood not in GEARS: sys.exit('--mood 只能是 燃 / 中 / 松')
    g = GEARS[mood]
    advice = []
    if head / n > g['静小节最多占比']:
        advice.append(f'音乐满起来之前的小节占 {head}/{n}（{head / n:.0%}），超过「{mood}」档的上限 {g["静小节最多占比"]:.0%}：用 cut_song.py 把安静段剪到 1–2 小节，或换一段起点（music-and-beats.md 第三节）')
    if mood == '燃' and full / n < 0.5: advice.append(f'满的小节只有 {full}/{n}：这一段撑不起"燃"，换一段更满的，或和用户确认档位')
    if not any(r['炸开'] for r in rows) and mood != '松': advice.append('这一段里没有量出"炸开"：魔法瞬间改钉在"最强的几下"里，或换一段')
    prof = dict(歌=os.path.basename(a.song), bpm=round(bpm, 2), 一拍秒=round(T, 5), 第0拍歌里秒=round(t0, 4), 片子从歌里第几秒开始=a.offset, 片长秒=round(end - a.offset, 3),
                情绪=mood, 情绪来源=((f'凭这个定的：「{feel}」' + ('' if a.mood or from_feel else '（这句话里没认出感觉，档位是按数猜的；自己再判断，用 --mood 指定）')) if feel else ('做片的人直接指定的，没写凭什么' if a.mood else '只按数猜的，不可靠（用 --feel 写上凭什么定）')), 情绪依据=feel, 用户原话=feel, 量出来猜的档=guess, 档位=g, 小节=rows, 最强的几下_片内秒=hits,
                情绪维度=dict(兴奋度=arousal, 满空=fullness, 明暗=bright), 满小节数=full, 静小节数=quiet, 满之前的小节数=head, 满段每秒起音=round(dens, 1), 建议=advice)
    os.makedirs(os.path.dirname(os.path.abspath(a.out)), exist_ok=True); json.dump(prof, open(a.out, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(f'## 音乐画像\n\n- 歌：{prof["歌"]}，{bpm:.1f} 拍/分，一拍 {T:.3f} 秒，一小节 {4 * T:.2f} 秒；片子从歌里 {a.offset:.3f} 秒开始，长 {prof["片长秒"]:.1f} 秒')
    print(f'- 情绪：**{mood}**（{prof["情绪来源"]}）；量出来满段每秒 {dens:.1f} 下起音，按数猜是「{guess}」')
    if not a.mood: print('- ⚠ 情绪是按数猜的，这个猜法不可靠（安静的钢琴曲、吉他曲音符密，也常被猜成"燃"）：不要拿"燃、中、松"去问用户；自己凭用户说过的话、歌单里的情绪标签、产品的感觉来定，用 --feel 写上')
    lo, hi = g['同步点每30秒']; durf = prof['片长秒']
    print(f'- 情绪三个数（0–1）：兴奋度 {arousal}、满空 {fullness}、明暗 {bright}。画面跟着走：兴奋度高 → 动作快、幅度大、硬；低 → 慢、小、软。满 → 画面丰富、层次多；空 → 简洁、留白。明 → 亮底、轻；暗 → 深底、重。')
    print(f'- 同步点：这条片子 {max(2, round(lo * durf / 30))}–{max(3, round(hi * durf / 30))} 个（全片最突出的几下，钉在"最强的几下"和炸开上）')
    print(f'- 这一档的剪法：格子 {g["格子"]} 拍；满段一个镜头 {g["满段镜头拍"][0]}–{g["满段镜头拍"][1]} 拍、每小节至少 {g["满段每小节事件"]} 个画面事件；静段一个镜头 {g["静段镜头拍"][0]}–{g["静段镜头拍"][1]} 拍')
    print('\n| 小节 | 片内秒 | 响度 dB | 档 | 底鼓 | 碎拍 | |\n|---|---|---|---|---|---|---|')
    for r in rows: print(f"| {r['小节']} | {r['片内秒']:.2f} | {r['响度']:.1f} | {r['档']} | {r['底鼓']} | {r['碎拍']} | {'← 炸开' if r['炸开'] else ''} |")
    print(f'\n- 最强的几下（片内秒）：{hits}')
    for s in advice: print(f'- ⚠ {s}')
    print(f'\n写好了：{a.out}')

if __name__ == '__main__':
    main()
