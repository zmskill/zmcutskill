---
name: outline-word-to-heat-gradient
中文名: 描边大字 · 最后一个词热力渐变放大
用途: 字卡
时长: 3.1 秒（94 帧，30fps）
一句话: 描边大字套在大圆里，换成小字，最后一个词变成红粉渐变的大字、四周彩点闪
来源镜头: word-frames-limits（第 98–192 帧）
样片: demos-own/parts/outline-word-to-heat-gradient/preview.mp4
样片图: demos-own/parts/outline-word-to-heat-gradient/preview-sheet.jpg
---

## 动作
描边大字套在大圆里，换成小字，最后一个词变成红粉渐变的大字、四周彩点闪

## 怎么进来
接上一段

## 怎么用
- 代码入口：`demos-own/parts/outline-word-to-heat-gradient/OutlineWordToHeatGradient.tsx`（只播原镜头的这一段，时长常量 `OUTLINE_WORD_TO_HEAT_GRADIENT_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/word-frames-limits/WordFramesLimits.tsx`：先读原镜头的卡 `references/groups-own/word-frames-limits.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 31 帧（w5，合同）、第 52 帧（dots，合同）、第 64 帧（big，合同）、第 72 帧（样片量的）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
