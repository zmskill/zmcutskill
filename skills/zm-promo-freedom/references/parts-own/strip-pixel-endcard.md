---
name: strip-pixel-endcard
中文名: 卡里打字变宽 · 变成横贯全屏的黑条
用途: 品牌落版
时长: 4.7 秒（140 帧，30fps）
一句话: 鲜艳渐变底 + 白色辅助线框住一张淡紫卡，卡里打一句话、卡跟着字变宽 → 一下变成横贯全屏的黑色长条，
来源镜头: strip-pixel-endcard（整个镜头）
样片: demos-own/parts/strip-pixel-endcard/preview.mp4
样片图: demos-own/parts/strip-pixel-endcard/preview-sheet.jpg
---

## 动作
鲜艳渐变底 + 白色辅助线框住一张淡紫卡，卡里打一句话、卡跟着字变宽 → 一下变成横贯全屏的黑色长条，

## 怎么进来
第一帧开始

## 怎么用
- 代码入口：`demos-own/parts/strip-pixel-endcard/StripPixelEndcard.tsx`（整个镜头，时长常量 `STRIP_PIXEL_ENDCARD_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/strip-pixel-endcard/StripPixelEndcard.tsx`：先读原镜头的卡 `references/groups-own/strip-pixel-endcard.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 3 帧（type，合同）、第 33 帧（strip，合同）、第 40 帧（样片量的）、第 44 帧（pixels，合同）、第 57 帧（card，合同）、第 75 帧（logo，合同）、第 92 帧（name，合同）、第 111 帧（fade，合同）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
