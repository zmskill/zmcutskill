---
name: star-spin-wordmark-arcs
中文名: 四角星收走上一句 · 转两下出字标
用途: 品牌落版
时长: 3.0 秒（90 帧，30fps）
一句话: 上一句话被一个内凹四角星「收」进去 → 星变小、变亮、往左走，转两下（转的时候鼓成圆角方块）→
来源镜头: star-spin-wordmark-arcs（整个镜头）
样片: demos-own/parts/star-spin-wordmark-arcs/preview.mp4
样片图: demos-own/parts/star-spin-wordmark-arcs/preview-sheet.jpg
---

## 动作
上一句话被一个内凹四角星「收」进去 → 星变小、变亮、往左走，转两下（转的时候鼓成圆角方块）→

## 怎么进来
接上一句话

## 怎么用
- 代码入口：`demos-own/parts/star-spin-wordmark-arcs/StarSpinWordmarkArcs.tsx`（整个镜头，时长常量 `STAR_SPIN_WORDMARK_ARCS_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/star-spin-wordmark-arcs/StarSpinWordmarkArcs.tsx`：先读原镜头的卡 `references/groups-own/star-spin-wordmark-arcs.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 18 帧（glow，合同）、第 19 帧（spin，合同）、第 28 帧（name，合同）、第 34 帧（arcs，合同）、第 47 帧（样片量的）、第 69 帧（lift，合同）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
