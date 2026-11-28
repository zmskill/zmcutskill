#!/usr/bin/env bash
# 在工作区里搭一份能渲染的副本：Remotion 依赖装在这里，skill 文件夹保持干净（Cowork 这类挂进来的文件夹一定要用）。
# 只复制 remotion/（代码、配置、贴图、素材库），不复制 node_modules；重复跑会更新代码、保留已装的依赖。
# 镜头代码（demos-own、assets/lib）还在 skill 里，渲染时直接引用，remotion.config.ts 让它们能找到这里的依赖。
# 用法：bash tools/workdir.sh [工作区路径，默认 ~/zm-work/zm-promo-freedom]
set -euo pipefail
SKILL="$(cd "$(dirname "$0")/.." && pwd)"
WORK="${1:-${ZM_PROMO_WORK:-$HOME/zm-work/zm-promo-freedom}}"
mkdir -p "$WORK"
cd "$SKILL"
tar --exclude='node_modules' --exclude='remotion/out' --exclude='__pycache__' --exclude='.DS_Store' --exclude='shotlab-root.tsx' \
    -cf - remotion | (cd "$WORK" && tar xf -)
echo "工作区：$WORK/remotion"
if [ -x "$WORK/remotion/node_modules/.bin/remotion" ]; then echo "依赖已经有了，不用再装"; else echo "下一步：python3 tools/setup.py remotion（先问用户）"; fi
