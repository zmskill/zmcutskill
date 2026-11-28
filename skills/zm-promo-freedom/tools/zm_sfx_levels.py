#!/usr/bin/env python3
"""zm_sfx_levels.py — 按"比这一刻的音乐高多少"给每个音效算音量（zm 追加）。AI 听不到声音，音量不能凭感觉写。

  python3 $SKILL/tools/zm_sfx_levels.py audio/音效清单.json --music audio/music.wav --music-vol 0.5 [--lib $SKILL/assets/sfx-library] [--write]

  --music      片子用的那段音乐（片子第 0 秒 = 这个文件的第 0 秒；不是的话加 --offset 秒）
  --music-vol  代码里给音乐的音量系数
  --write      把算出来的音量写回清单的「音量」，并加上「让音乐让开」（要不要压音乐、压几分贝）

每个音效：取它最响的那 0.25 秒，找它最强的频段，和同一时刻的音乐在这个频段比，算出让它高出目标值所需的音量系数。
目标（references/sound-and-sfx.md）：有分量 +8 dB，东西到了 / 真实动作 +5 dB，运镜转场 / 铺垫 +4 dB。
音乐很空的地方保底 0.3。系数超过 1.6（再大就会破）：先让音乐让开（最多 8 dB），还不够就写"换一个频段不同的声音"。只用 ffmpeg + numpy。
"""
import argparse, json, os, sys
import numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import zm_au as au
TARGET = {'有分量': 8, '东西到了': 5, '真实动作': 5, '运镜转场': 4, '铺垫': 4}

def main():
    ap = argparse.ArgumentParser(); ap.add_argument('cues'); ap.add_argument('--music', required=True); ap.add_argument('--music-vol', type=float, default=1.0)
    ap.add_argument('--offset', type=float, default=0); ap.add_argument('--lib', default=os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'assets/sfx-library'))
    ap.add_argument('--write', action='store_true'); a = ap.parse_args()
    J = json.load(open(a.cues, encoding='utf-8')); music = au.load(a.music) * a.music_vol
    rec = {}
    rp = os.path.join(a.lib, '音效库记录.json')
    if os.path.exists(rp): rec = {r['文件']: r for r in json.load(open(rp, encoding='utf-8'))['音效']}
    print('| 秒 | 画面 | 为什么配 | 最强频段 | 这一刻音乐 dB | 音量系数 | 让音乐让开 | |\n|---|---|---|---|---|---|---|---|')
    for c in J['音效']:
        f = c.get('文件', ''); path = f if os.path.isabs(f) else os.path.join(a.lib, f)
        if not os.path.exists(path): print(f"| {c['时间']} | {str(c.get('画面', ''))[:16]} | | | | | | 找不到文件 {f}，没算 |"); continue
        s = au.load(path); r = rec.get(f, {}); pk = (r.get('量出来的') or {}).get('最响处')
        if pk is None:
            e = np.convolve(s ** 2, np.ones(220) / 220, 'same'); pk = float(np.argmax(e)) / au.SR
        sb = au.band_db(au.seg(s, pk - 0.05, pk + 0.2)); j = int(np.argmax(sb)); t = float(c['时间']) + a.offset
        mb = au.band_db(au.seg(music, t - 0.05, t + 0.2)); want = TARGET.get(c.get('为什么配'), 4)
        gain_db = (mb[j] + want) - sb[j]; duck = 0.0; note = ''
        if gain_db > 4:                       # 系数要超过 1.6：先让音乐让开
            duck = min(8.0, np.ceil(gain_db - 4)); gain_db -= duck
            if gain_db > 4: note = '音乐让开 8 dB 还不够：换一个最强频段不在「' + au.BANDS[j][0] + '」的声音，或换到音乐空的位置'; gain_db = 4
        if c.get('为什么配') == '有分量' and duck < 6: duck = 6.0    # 大的那几声，音乐一律让开
        vol = max(0.3, round(float(10 ** (gain_db / 20)), 2))   # 音乐很空的地方照「比音乐高」会算出很小的数：保底 0.3，空的地方音效要顶上
        print(f"| {c['时间']} | {str(c.get('画面', ''))[:16]} | {c.get('为什么配', '')} | {au.BANDS[j][0]} | {mb[j]:.0f} | {vol} | {('%.0f dB' % duck) if duck else ''} | {note} |")
        if a.write:
            c['音量'] = vol
            if duck: c['让音乐让开'] = duck
            elif '让音乐让开' in c: del c['让音乐让开']
    if a.write:
        json.dump(J, open(a.cues, 'w', encoding='utf-8'), ensure_ascii=False, indent=1); print(f'\n写回了：{a.cues}（代码里的音量和 duck 表要和它一致）')

if __name__ == '__main__':
    main()
