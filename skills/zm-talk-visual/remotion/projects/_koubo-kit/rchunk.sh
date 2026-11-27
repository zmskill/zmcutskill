#!/bin/bash
# 用法：rchunk.sh <composition> <总帧数> <输出目录> 块号...   只重渲染其中几块（每块 330 帧），再重新拼
# --offthreadvideo-cache-size-in-bytes：解码视频的缓存上限（默认 800 MB，OTV_CACHE 可改）。不设时 Remotion 会用掉一半内存，手机里放人 + 录屏同时解码会被系统杀掉（2026-11-27 书桌风格测试，8 GB 内存）
cd "${REMOTION_ROOT:-$(cd "$(dirname "$0")/../.." && pwd)}"   # remotion 项目根目录
CH=${CHROME:-$(ls /opt/pw-browsers/chromium_headless_shell-*/chrome-headless-shell-*/chrome-headless-shell ~/.cache/ms-playwright/chromium_headless_shell-*/chrome-headless-shell-*/chrome-headless-shell ~/Library/Caches/ms-playwright/chromium_headless_shell-*/chrome-headless-shell-*/chrome-headless-shell 2>/dev/null | head -1)}   # 先用已有的无头浏览器（CHROME 环境变量 / Playwright 装的）；都没有就不指定，Remotion 自己下载
comp=$1; n=$2; O=$3; shift 3; B=/tmp/rbc_${comp}_$$
while pgrep -f "remotion render" >/dev/null || [ -f out/stills.lock ]; do sleep 5; done
npx remotion bundle src/index.ts --out-dir $B --log=error >/dev/null 2>&1 || { echo BUNDLE FAIL; exit 1; }
for i in "$@"; do
  a=$((i*330)); b=$((a+329)); [ $b -ge $n ] && b=$((n-1))
  for try in 1 2 3; do npx remotion render $B $comp $O/c$i.mp4 --frames=$a-$b --muted --concurrency=2 --offthreadvideo-cache-size-in-bytes=${OTV_CACHE:-800000000} ${CH:+--browser-executable=$CH} --log=error > $O/c$i.log 2>&1 && break; sleep 5; done
done
${FFMPEG:-ffmpeg} -v error -y -f concat -safe 0 -i $O/l.txt -an -c copy $O/v.mp4 && echo "REDONE $*" >> $O/status
rm -rf $B
