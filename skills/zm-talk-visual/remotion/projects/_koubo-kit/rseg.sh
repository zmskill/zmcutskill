#!/bin/bash
# 用法：rseg.sh <composition> <总帧数> <输出目录>   分块渲染（不带声音）再拼起来；每块失败会重试；抽帧时让路
# 能接着跑：已经渲染好的块会跳过。单条命令有时长上限的环境里，被打断就再跑同一条命令，直到 status 里出现 DONE。
# 改了画面要重渲某几块，用 rchunk.sh（它会覆盖）。
cd "${REMOTION_ROOT:-$(cd "$(dirname "$0")/../.." && pwd)}"   # remotion 项目根目录
CH=${CHROME:-$(ls /opt/pw-browsers/chromium_headless_shell-*/chrome-headless-shell-*/chrome-headless-shell ~/.cache/ms-playwright/chromium_headless_shell-*/chrome-headless-shell-*/chrome-headless-shell ~/Library/Caches/ms-playwright/chromium_headless_shell-*/chrome-headless-shell-*/chrome-headless-shell 2>/dev/null | head -1)}   # 先用已有的无头浏览器（CHROME 环境变量 / Playwright 装的）；都没有就不指定，Remotion 自己下载
comp=$1; n=$2; O=$3; mkdir -p $O; B=/tmp/rbr_${comp}_$$; rm -f $O/status
while [ -f out/stills.lock ]; do sleep 3; done
npx remotion bundle src/index.ts --out-dir $B --log=error >/dev/null 2>&1 || { echo "BUNDLE FAIL" >> $O/status; exit 1; }
i=0; a=0; : > $O/l.txt
while [ $a -lt $n ]; do
  b=$((a+329)); [ $b -ge $n ] && b=$((n-1)); ok=0
  if [ -s $O/c$i.mp4 ] && grep -q "^OK $i\$" $O/done.txt 2>/dev/null; then echo "file 'c$i.mp4'" >> $O/l.txt; i=$((i+1)); a=$((b+1)); continue; fi
  for try in 1 2 3; do
    while [ -f out/stills.lock ]; do sleep 3; done
    if npx remotion render $B $comp $O/c$i.mp4 --frames=$a-$b --muted --concurrency=2 ${CH:+--browser-executable=$CH} --log=error > $O/c$i.log 2>&1; then ok=1; echo "OK $i" >> $O/done.txt; break; fi
    sleep 5
  done
  [ $ok = 1 ] || echo "FAIL $a-$b" >> $O/status
  echo "file 'c$i.mp4'" >> $O/l.txt; i=$((i+1)); a=$((b+1))
done
${FFMPEG:-ffmpeg} -v error -y -f concat -safe 0 -i $O/l.txt -an -c copy $O/v.mp4 && echo DONE >> $O/status
rm -rf $B
