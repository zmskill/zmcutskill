#!/usr/bin/env bash
# 在工作区里搭一份能渲染的副本：依赖、素材、片子代码都放这里，skill 文件夹保持干净（Cowork 这类挂进来的文件夹一定要用）。
# 只复制代码，不复制镜头样片视频和音效；node_modules 装在工作区，不进用户的文件夹。重复跑会更新代码、保留已装的依赖。
# 用法：bash scripts/workdir.sh [工作区路径，默认 ~/zm-work/zm-talk-visual]
set -euo pipefail
SKILL="$(cd "$(dirname "$0")/.." && pwd)"
WORK="${1:-${ZM_WORK:-$HOME/zm-work/zm-talk-visual}}"
mkdir -p "$WORK"
cd "$SKILL"
# 重复跑会用 skill 里的代码覆盖工作区；Root.tsx 里登记了用户片子的各段，先存一份，复制完放回去
ROOT="$WORK/remotion/src/Root.tsx"; [ -f "$ROOT" ] && cp "$ROOT" "$WORK/.Root.tsx.keep"
tar --exclude='node_modules' --exclude='remotion/out' --exclude='remotion/public' --exclude='*.mp4' --exclude='__pycache__' --exclude='.DS_Store' \
    -cf - remotion shot-library styles scripts | (cd "$WORK" && tar xf -)
# 斜面板镜头的贴图放进 public，渲染时用得到
[ -f "$WORK/.Root.tsx.keep" ] && mv "$WORK/.Root.tsx.keep" "$ROOT"
mkdir -p "$WORK/remotion/public/textures/live"
cp shot-library/demos-own/camera/tilted-dashboard-pan-logo/textures/dash_*.png "$WORK/remotion/public/textures/live/" 2>/dev/null || true
# 风格自带的字体（比如书桌的文楷、Fraunces）放进 public/fonts/<风格>/，渲染时用 staticFile 读
for d in styles/*/fonts; do [ -d "$d" ] || continue; s=$(basename "$(dirname "$d")"); mkdir -p "$WORK/remotion/public/fonts/$s"; cp -R "$d"/. "$WORK/remotion/public/fonts/$s/"; done
echo "工作区：$WORK"
if [ -x "$WORK/remotion/node_modules/.bin/remotion" ]; then echo "依赖已经有了，不用再装"; else echo "下一步：cd \"$WORK/remotion\" && npm install（先问用户）"; fi
echo "片子的素材放 $WORK/remotion/public/<片子名>/，代码放 $WORK/remotion/projects/<片子名>/；成片写回用户指定的文件夹。"
