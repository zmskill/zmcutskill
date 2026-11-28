---
name: cards-dissolve-to-dots-back
中文名: 卡片化成点 · 再聚回来
用途: 过渡动作
时长: 2.3 秒（69 帧，30fps）
一句话: 卡片化成一片点散开，又聚回卡片
来源镜头: dot-motion-chapters（第 120–189 帧）
样片: demos-own/parts/cards-dissolve-to-dots-back/preview.mp4
样片图: demos-own/parts/cards-dissolve-to-dots-back/preview-sheet.jpg
---

## 动作
卡片化成一片点散开，又聚回卡片

## 怎么进来
接上一段

## 怎么用
- 代码入口：`demos-own/parts/cards-dissolve-to-dots-back/CardsDissolveToDotsBack.tsx`（只播原镜头的这一段，时长常量 `CARDS_DISSOLVE_TO_DOTS_BACK_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/dot-motion-chapters/DotMotionChapters.tsx`：先读原镜头的卡 `references/groups-own/dot-motion-chapters.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 30 帧（dissolve，合同）、第 41 帧（样片量的）、第 48 帧（back，合同）、第 62 帧（样片量的）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
