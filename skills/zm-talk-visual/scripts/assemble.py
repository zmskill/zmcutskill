#!/usr/bin/env python3
"""最后一步：把渲染好的画面（一段或按顺序好几段）和混好的声音合成成片，响度统一压到 -16 LUFS，量一遍再交。
用法：python3 scripts/assemble.py --video 画面1.mp4 [画面2.mp4 …] --audio 混音.wav --out 成片.mp4
      [--lufs -16] [--tp -1.5] [--crf 22] [--hold 0] [--report 测量.json]
  --video   Remotion 渲染出的无声画面；好几段时按给的顺序首尾相接
  --audio   sfx_mix.py 混好的全片声音（人声 + 配乐 + 音效），从 0 秒开始
  --hold    片尾最后一帧再定几秒（画面里已经做了定格就不用）；声音会补静音到一样长
  --crf     x264 画质，21–25 之间，数字越小越清楚、文件越大
  --report  测量结果写到哪，默认和成片同一个文件夹的 <成片名>_测量.json
做的事：拼画面 → x264 压一遍 → 声音两遍 loudnorm（先量再按量出来的数精确压，不会忽大忽小）→ 合成 →
        再量一遍成片：响度、真峰值、时长、帧数、画面和声音差多少。哪项不对会打出"要看"。
交片只用它出的文件，不要自己另拼一套。"""
import argparse, json, os, re, subprocess, sys, tempfile
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _ff import FFMPEG, require

def ff(args, cap=True):
    r = subprocess.run([FFMPEG, '-hide_banner'] + args, capture_output=cap, text=True)
    if r.returncode != 0: raise SystemExit('ffmpeg 出错：\n' + (r.stderr or '')[-1500:])
    return r.stderr or ''

def dur(p):
    m = re.search(r'Duration: (\d+):(\d+):([\d.]+)', subprocess.run([FFMPEG, '-hide_banner', '-i', p], capture_output=True, text=True).stderr)
    return int(m[1]) * 3600 + int(m[2]) * 60 + float(m[3]) if m else None

def measure(p, lufs, tp, extra=None):
    err = ff((extra or []) + ['-i', p, '-vn', '-af', f'loudnorm=I={lufs}:TP={tp}:LRA=11:print_format=json', '-f', 'null', '-'])
    return json.loads(err[err.rindex('{'):err.rindex('}') + 1])

def main():
    ap = argparse.ArgumentParser(); ap.add_argument('--video', nargs='+', required=True); ap.add_argument('--audio', required=True)
    ap.add_argument('--out', required=True); ap.add_argument('--lufs', type=float, default=-16); ap.add_argument('--tp', type=float, default=-1.5)
    ap.add_argument('--crf', type=int, default=22); ap.add_argument('--hold', type=float, default=0); ap.add_argument('--report')
    a = ap.parse_args(); require()
    out = os.path.abspath(a.out); os.makedirs(os.path.dirname(out), exist_ok=True)
    rep = a.report or os.path.splitext(out)[0] + '_测量.json'
    with tempfile.TemporaryDirectory() as tmp:
        lst = os.path.join(tmp, 'list.txt')
        open(lst, 'w', encoding='utf-8').write(''.join("file '%s'\n" % os.path.abspath(v).replace("'", "'\\''") for v in a.video))
        vid = os.path.join(tmp, 'v.mp4'); vf = ['-vf', f'tpad=stop_mode=clone:stop_duration={a.hold}'] if a.hold > 0 else []
        print('1/4 拼画面、压片…', flush=True)
        ff(['-y', '-f', 'concat', '-safe', '0', '-i', lst, '-an'] + vf + ['-c:v', 'libx264', '-crf', str(a.crf), '-preset', 'medium', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', vid])
        vd = dur(vid); ad = dur(a.audio)
        print('2/4 量声音…', flush=True)
        m = measure(a.audio, a.lufs, a.tp)
        print('3/4 压响度、合成…', flush=True)
        ln = (f"loudnorm=I={a.lufs}:TP={a.tp}:LRA=11:measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}"
              f":measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true,aresample=48000,aformat=sample_fmts=fltp:channel_layouts=stereo,apad")
        ff(['-y', '-i', vid, '-i', a.audio, '-map', '0:v:0', '-map', '1:a:0', '-af', ln, '-c:v', 'copy', '-c:a', 'aac', '-b:a', '256k', '-ar', '48000', '-t', f'{vd:.3f}', '-movflags', '+faststart', out])
    print('4/4 量成片…', flush=True)
    f = measure(out, a.lufs, a.tp)
    # 数帧：-progress 的输出各版本 ffmpeg 都一样（frame=N），比读进度条可靠
    pr = subprocess.run([FFMPEG, '-hide_banner', '-v', 'error', '-progress', 'pipe:1', '-nostats', '-i', out, '-map', '0:v:0', '-c', 'copy', '-f', 'null', '-'], capture_output=True, text=True).stdout
    fr = re.findall(r'^frame=(\d+)', pr, re.M)
    od = dur(out)
    r = {'成片': out, '时长秒': od, '画面帧数': int(fr[-1]) if fr else None, '画面秒': round(vd, 3), '声音原长秒': round(ad or 0, 3),
         '响度LUFS': float(f['input_i']), '真峰值dBTP': float(f['input_tp']), '响度范围LU': float(f['input_lra']), '大小MB': round(os.path.getsize(out) / 1e6, 1),
         '目标': {'LUFS': a.lufs, '真峰值': a.tp, 'crf': a.crf}}
    warn = []
    if abs(r['响度LUFS'] - a.lufs) > 1: warn.append(f"响度 {r['响度LUFS']} 离目标 {a.lufs} 超过 1")
    if r['真峰值dBTP'] > a.tp + 0.5: warn.append(f"真峰值 {r['真峰值dBTP']} 比目标 {a.tp} 高出 0.5 以上")   # loudnorm 压完常会高出零点几，0.5 以内不算问题
    if not r['画面帧数']: warn.append('没量出帧数，用 ffprobe 或抽帧确认一下画面完整')
    gap = min(abs(ad - vd), abs(ad + a.hold - vd)) if ad else 0   # 声音可以已经含片尾定格那几秒，也可以不含（不含时由 apad 补静音），两种都算对
    if gap > 0.15: warn.append(f'声音 {ad:.2f} 秒和画面 {vd:.2f} 秒（含定格 {a.hold:g} 秒）差 {gap:.2f} 秒：看是不是少渲染了一段、声音时长写错了')
    if r['大小MB'] > 150: warn.append(f"文件 {r['大小MB']} MB，偏大，问用户要不要把 --crf 调大一点再出")
    r['要看'] = warn
    json.dump(r, open(rep, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(f"成片 → {out}\n  {od:.2f} 秒，{r['画面帧数']} 帧，{r['大小MB']} MB；响度 {r['响度LUFS']} LUFS，真峰值 {r['真峰值dBTP']} dBTP，响度范围 {r['响度范围LU']} LU\n  测量 → {rep}")
    for w in warn: print('  要看：' + w)
    return 1 if warn else 0

if __name__ == '__main__':
    sys.exit(main())
