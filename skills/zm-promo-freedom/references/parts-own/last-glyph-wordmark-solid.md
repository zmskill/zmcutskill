---
name: last-glyph-wordmark-solid
中文名: 画完最后一个字 · 拉远成整个字标填实
用途: 品牌落版
时长: 2.6 秒（78 帧，30fps）
一句话: 画出最后一个字，镜头拉远，四个字排成字标，一起填实
来源镜头: glyph-construct-wordmark（第 114–192 帧）
样片: demos-own/parts/last-glyph-wordmark-solid/preview.mp4
样片图: demos-own/parts/last-glyph-wordmark-solid/preview-sheet.jpg
---

## 动作
画出最后一个字，镜头拉远，四个字排成字标，一起填实

## 怎么进来
接上一段

## 怎么用
- 代码入口：`demos-own/parts/last-glyph-wordmark-solid/LastGlyphWordmarkSolid.tsx`（只播原镜头的这一段，时长常量 `LAST_GLYPH_WORDMARK_SOLID_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/glyph-construct-wordmark/GlyphConstructWordmark.tsx`：先读原镜头的卡 `references/groups-own/glyph-construct-wordmark.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 18 帧（样片量的）、第 32 帧（样片量的）、第 40 帧（word，合同）、第 60 帧（样片量的）、第 64 帧（solid，合同）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
