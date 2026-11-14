#!/bin/bash
# 渲染队列：一行一个 "<comp> <帧数> <输出目录>"，前一个跑完再跑下一个
cd "${REMOTION_ROOT:-$(cd "$(dirname "$0")/../.." && pwd)}"   # remotion 项目根目录
while true; do
  if [ -s out/queue.txt ]; then
    line=$(head -1 out/queue.txt); tail -n +2 out/queue.txt > out/queue.tmp && mv out/queue.tmp out/queue.txt   # 不用 sed -i：Mac 自带的 sed 写法不一样
    # 等别的渲染结束
    while pgrep -f "remotion render" >/dev/null; do sleep 5; done
    projects/_koubo-kit/rseg.sh $line
  else sleep 5; fi
  [ -f out/queue.stop ] && break
done
