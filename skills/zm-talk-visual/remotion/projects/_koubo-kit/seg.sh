#!/bin/bash
# 用法：seg.sh <composition> <t0> <输出目录> <列数> 全片秒数...   抽几帧拼成一张
# 给用户看关键帧时加 SUBS=<subs.json>：每格下面标上全片时间和那一刻说的话（停④要的就是这张）。
#   例：SUBS=../中间稿/subs.json bash projects/_koubo-kit/seg.sh seg1 0 out/k1 4 1.2 3.5 …
cd "${REMOTION_ROOT:-$(cd "$(dirname "$0")/../.." && pwd)}"   # remotion 项目根目录
CH=${CHROME:-$(ls /opt/pw-browsers/chromium_headless_shell-*/chrome-headless-shell-*/chrome-headless-shell ~/.cache/ms-playwright/chromium_headless_shell-*/chrome-headless-shell-*/chrome-headless-shell ~/Library/Caches/ms-playwright/chromium_headless_shell-*/chrome-headless-shell-*/chrome-headless-shell 2>/dev/null | head -1)}   # 先用已有的无头浏览器（CHROME 环境变量 / Playwright 装的）；都没有就不指定，Remotion 自己下载
comp=$1; t0=$2; out=$3; cols=$4; shift 4
B=/tmp/rb_${comp}_$$_$RANDOM
mkdir -p out; touch out/stills.lock; while pgrep -f 'remotion render' >/dev/null; do sleep 3; done   # 等正在渲染的那一块结束（两边同时跑会把内存撑爆）
npx remotion bundle src/index.ts --out-dir $B --log=error >/dev/null 2>&1 || { rm -f out/stills.lock; echo BUNDLE FAIL; npx tsc --noEmit -p . 2>&1 | grep -v node_modules | head -20; exit 1; }
mkdir -p $out
for t in "$@"; do fr=$(python3 -c "print(max(0, round(($t-$t0)*30)))"); npx remotion still $B $comp $out/f$(printf %05d $fr).jpg --frame=$fr --image-format=jpeg --jpeg-quality=82 ${CH:+--browser-executable=$CH} --log=error --scale=0.5 2>&1 | tail -3; done
python3 - "$out" "$cols" "$t0" "${SUBS:-}" <<'P'
import sys,glob,os,json
from PIL import Image, ImageDraw, ImageFont
d=sys.argv[1]; cols=int(sys.argv[2]); t0=float(sys.argv[3]); sp=sys.argv[4]; fs=sorted(glob.glob(d+'/f*.jpg')); ims=[Image.open(f) for f in fs]
tw=640; th=360; rows=(len(ims)+cols-1)//cols
if not sp:
    o=Image.new('RGB',(tw*cols,th*rows),'#333')
    for i,im in enumerate(ims): o.paste(im.resize((tw,th)),((i%cols)*tw,(i//cols)*th))
else:   # 每格下面一条：全片时间 + 那一刻的字幕
    subs=json.load(open(sp,encoding='utf-8')); lh=58
    font=None
    for f in ['/System/Library/Fonts/PingFang.ttc','/System/Library/Fonts/STHeiti Medium.ttc','/System/Library/Fonts/STHeiti Light.ttc','/System/Library/Fonts/Hiragino Sans GB.ttc',
              '/Library/Fonts/Arial Unicode.ttf','/System/Library/Fonts/Supplemental/Arial Unicode.ttf','C:/Windows/Fonts/msyh.ttc','C:/Windows/Fonts/simhei.ttf']+glob.glob('/usr/share/fonts/**/*CJK*',recursive=True)+glob.glob('/usr/share/fonts/**/wqy*',recursive=True):
        if os.path.exists(f):
            try: font=ImageFont.truetype(f,24); break
            except Exception: pass
    if font is None: print('没找到中文字体，只标时间'); font=ImageFont.load_default()
    o=Image.new('RGB',(tw*cols,(th+lh)*rows),'#222'); dr=ImageDraw.Draw(o)
    for i,(f,im) in enumerate(zip(fs,ims)):
        x,y=(i%cols)*tw,(i//cols)*(th+lh); o.paste(im.resize((tw,th)),(x,y))
        t=t0+int(os.path.basename(f)[1:6])/30; line=next((s[2] for s in subs if s[0]<=t<s[1]),'（停顿）')
        txt=f'{t:.1f}s  {line}' if font.getbbox('字')[2]>12 else f'{t:.1f}s'
        dr.text((x+12,y+th+14),txt,fill='#f2f2f2',font=font)
o.save(d+'/sheet.jpg',quality=84); print(o.size,len(ims),d+'/sheet.jpg')
P
rm -rf $B; rm -f out/stills.lock
