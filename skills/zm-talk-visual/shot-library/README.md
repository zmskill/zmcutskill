# 镜头库

做口播画面时先来这里找镜头。按句子类型查的入口是 `index/koubo-fit.md`。

| 位置 | 是什么 |
|---|---|
| `own/cards/<类>/` | 镜头卡：每个镜头演什么、动效核心、参数、已知坑 |
| `own/groups/` | 镜头组：几个镜头连起来演完一段完整意思 |
| `demos-own/<类>/<卡名>/` | 镜头的 Remotion 代码和样片 `preview.mp4` |
| `kit/` | 共用小工具：`polish.tsx`（缓动、软阴影、颗粒、压边、运动模糊）、`paper.ts`（纸面配色）、`groupClock.ts`（镜头组时钟）、`beatLand.ts`（卡点） |
| `index/` | `koubo-fit.md`（按句子类型查）、`library-own.json`（机器读的索引）、`thumbs/`（缩略图） |

- 卡片和代码是给宣传片做的原版，口播专用的说明（适合口播里的什么句子、取哪一段）写在 `index/koubo-fit.md`，不写进卡片。8 个已经改成口播版的镜头在 `remotion/projects/_koubo-kit/KouboShots.tsx`。
- 代码是 Remotion 组件，需要 `remotion/` 工程才能渲染。
- 斜面板镜头（`camera/tilted-dashboard-pan-logo`）用的贴图在它自己的 `textures/` 里，渲染前复制到 `remotion/public/textures/live/`。
- 镜头里的示例品牌名、文案只是占位，用的时候换成自己的内容。
