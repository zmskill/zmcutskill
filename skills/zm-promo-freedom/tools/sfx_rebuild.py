#!/usr/bin/env python3
"""sfx_rebuild.py — 用你自己下载的 Sonniss GDC 2026 免费音效包，把本项目音效库里来自 Sonniss 的那部分重新做出来。

为什么要这一步：这些音效允许免费商用，但它的许可没有允许把声音文件放进别的项目里再分发，所以本项目不带它们，
只带了一份清单（assets/sfx-library/音效库记录.json）：每个音效取自哪个包的哪个文件、从第几秒开始、多长、音量调了多少。
这个脚本照着清单从原包里把它们切出来，放到清单里写的位置。做出来的文件只给你自己用，请不要再分发。

  1. 到 https://sonniss.com/gameaudiogdc 免费下载 GDC 2026 Game Audio Bundle（5 个压缩包，共约 7.5GB），解压到同一个文件夹。
  2. python3 tools/sfx_rebuild.py <那个文件夹>            # 里面应该有 Sonniss.com-GDC2026-GameAudioBundle1of5 … 5of5
     python3 tools/sfx_rebuild.py <那个文件夹> --check    # 只看能找到多少，不写文件

需要 ffmpeg。已经存在的文件不会覆盖（要重做加 --force）。
"""
import argparse, json, os, subprocess, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); LIB = os.path.join(ROOT, 'assets', 'sfx-library')

def main():
    ap = argparse.ArgumentParser(); ap.add_argument('bundle'); ap.add_argument('--check', action='store_true'); ap.add_argument('--force', action='store_true')
    ap.add_argument('--out', default=LIB); a = ap.parse_args()
    items = json.load(open(os.path.join(LIB, '音效库记录.json'), encoding='utf-8'))['音效']
    todo = [e for e in items if 'Sonniss' in (e.get('来源') or {}).get('原文件', '')]
    done = skip = 0; missing = []
    for e in todo:
        s = e['来源']; rel = s['原文件'].split('·', 1)[-1].strip(); src = os.path.join(a.bundle, rel); dst = os.path.join(a.out, e['文件'])
        if not os.path.exists(src) or os.path.isdir(src): missing.append(s['原文件']); continue
        if os.path.exists(dst) and not a.force: skip += 1; continue
        if a.check: done += 1; continue
        os.makedirs(os.path.dirname(dst), exist_ok=True)
        cmd = ['ffmpeg', '-v', 'error', '-y']
        if '原文件里从第几秒开始' in s: cmd += ['-ss', str(s['原文件里从第几秒开始']), '-t', str(e['量出来的']['时长'])]
        cmd += ['-i', src]
        if s.get('处理时调过的音量'): cmd += ['-af', f"volume={s['处理时调过的音量']}dB"]
        cmd += ['-ar', '48000', '-ac', '2', '-c:a', 'pcm_s24le', dst]
        r = subprocess.run(cmd, capture_output=True, text=True)
        if r.returncode != 0: missing.append(s['原文件'] + '（ffmpeg 出错：' + r.stderr.strip()[:80] + '）'); continue
        done += 1
    print(f'清单里来自 Sonniss 的音效 {len(todo)} 个：{"能做" if a.check else "做好"} {done} 个，已经有的 {skip} 个，原包里找不到的 {len(missing)} 个')
    for m in missing[:20]: print('  找不到：' + m)
    if missing: print('找不到的：确认 5 个压缩包都解压到了同一个文件夹，文件夹名没有改过。'); sys.exit(1)

if __name__ == '__main__':
    main()
