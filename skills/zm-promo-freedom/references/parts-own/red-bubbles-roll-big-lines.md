---
name: red-bubbles-roll-big-lines
中文名: 红气泡交错弹出 · 像滚轮一样滚 · 大字压上
用途: 痛点
时长: 5.1 秒（152 帧，30fps）
一句话: 一串红色聊天气泡左右交错地一个个弹出来、带着未读数，整串像滚轮一样连续往上滚，大字一句句压在上面
来源镜头: red-bubble-stack-pain（第 41–193 帧）
样片: demos-own/parts/red-bubbles-roll-big-lines/preview.mp4
样片图: demos-own/parts/red-bubbles-roll-big-lines/preview-sheet.jpg
---

## 动作
一串红色聊天气泡左右交错地一个个弹出来、带着未读数，整串像滚轮一样连续往上滚，大字一句句压在上面

## 怎么进来
接上一段的小字

## 注意
5.1 秒

## 怎么用
- 代码入口：`demos-own/parts/red-bubbles-roll-big-lines/RedBubblesRollBigLines.tsx`（只播原镜头的这一段，时长常量 `RED_BUBBLES_ROLL_BIG_LINES_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/red-bubble-stack-pain/RedBubbleStackPain.tsx`：先读原镜头的卡 `references/groups-own/red-bubble-stack-pain.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 1 帧（bubbles，合同）、第 33 帧（whip，合同）、第 46 帧（l1，合同）、第 81 帧（样片量的）、第 94 帧（l2，合同）、第 105 帧（样片量的）、第 124 帧（drop，合同）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
