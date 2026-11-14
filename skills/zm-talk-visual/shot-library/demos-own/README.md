# demos-own/ — 自己的镜头库代码

Remotion，30fps，1920×1080；
每个文件 `export const <文件名>: React.FC` 并导出 `<大写蛇形>_DURATION`；全部是帧的纯函数（不用 Math.random / Date）。

共用的小工具在 `../kit/`：`polish.tsx`（缓动、软阴影、颗粒、压边、运动模糊）、`paper.ts`（纸面配色）、`groupClock.ts`、`beatLand.ts`。

目录：`demos-own/<类>/<卡名>/<组件名>.tsx`，入库的样片放同目录 `preview.mp4`。
