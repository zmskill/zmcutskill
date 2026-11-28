---
name: small-type-pixel-word-gradient
中文名: 小字接着打 · 一个词像素乱跳变渐变色
用途: 字卡
时长: 2.8 秒（83 帧，30fps）
一句话: 小字号接着打完一句，中间一个词像素乱跳、再变成渐变色
来源镜头: word-stretch-style-grid（第 0–83 帧）
样片: demos-own/parts/small-type-pixel-word-gradient/preview.mp4
样片图: demos-own/parts/small-type-pixel-word-gradient/preview-sheet.jpg
---

## 动作
小字号接着打完一句，中间一个词像素乱跳、再变成渐变色

## 怎么进来
第一帧开始

## 怎么用
- 代码入口：`demos-own/parts/small-type-pixel-word-gradient/SmallTypePixelWordGradient.tsx`（只播原镜头的这一段，时长常量 `SMALL_TYPE_PIXEL_WORD_GRADIENT_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/word-stretch-style-grid/WordStretchStyleGrid.tsx`：先读原镜头的卡 `references/groups-own/word-stretch-style-grid.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 30 帧（pixel，合同）、第 82 帧（push，合同）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
