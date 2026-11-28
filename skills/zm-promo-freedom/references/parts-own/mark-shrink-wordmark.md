---
name: mark-shrink-wordmark
中文名: 大标志猛缩 · 名字逐字浮出
用途: 品牌落版
时长: 3.5 秒（105 帧，30fps）
一句话: 深藏青底上一个超大白色标志猛地缩小，名字的字从它右边一个个浮出、字距收拢，下面淡入一行小字标语，静止落版
来源镜头: mark-shrink-wordmark（整个镜头）
样片: demos-own/parts/mark-shrink-wordmark/preview.mp4
样片图: demos-own/parts/mark-shrink-wordmark/preview-sheet.jpg
---

## 动作
深藏青底上一个超大白色标志猛地缩小，名字的字从它右边一个个浮出、字距收拢，下面淡入一行小字标语，静止落版

## 怎么进来
硬切

## 注意
暗色片子的最后一镜

## 怎么用
- 代码入口：`demos-own/parts/mark-shrink-wordmark/MarkShrinkWordmark.tsx`（整个镜头，时长常量 `MARK_SHRINK_WORDMARK_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/outro/mark-shrink-wordmark/MarkShrinkWordmark.tsx`：先读原镜头的卡 `references/shots-own/outro/mark-shrink-wordmark.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 3 帧（样片量的）、第 41 帧（样片量的）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
