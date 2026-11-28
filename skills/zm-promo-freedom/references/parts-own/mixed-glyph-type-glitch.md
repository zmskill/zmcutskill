---
name: mixed-glyph-type-glitch
中文名: 逐字打字 · 每个字不停换字体
用途: 字卡
时长: 4.0 秒（120 帧，30fps）
一句话: 浅灰底 + 淡淡的字符画漩涡，一句话一个字一个字打出来、每个字都在不停换字体（花体 / 超粗 / 描边 / 键帽框 / 等宽）、框选着 →
来源镜头: mixed-glyph-type-glitch（整个镜头）
样片: demos-own/parts/mixed-glyph-type-glitch/preview.mp4
样片图: demos-own/parts/mixed-glyph-type-glitch/preview-sheet.jpg
---

## 动作
浅灰底 + 淡淡的字符画漩涡，一句话一个字一个字打出来、每个字都在不停换字体（花体 / 超粗 / 描边 / 键帽框 / 等宽）、框选着 →

## 怎么进来
第一帧开始

## 注意
用到素材库的艺术字体

## 怎么用
- 代码入口：`demos-own/parts/mixed-glyph-type-glitch/MixedGlyphTypeGlitch.tsx`（整个镜头，时长常量 `MIXED_GLYPH_TYPE_GLITCH_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/mixed-glyph-type-glitch/MixedGlyphTypeGlitch.tsx`：先读原镜头的卡 `references/groups-own/mixed-glyph-type-glitch.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 2 帧（line1，合同）、第 30 帧（pan，合同）、第 58 帧（mono，合同）、第 72 帧（line2，合同）、第 96 帧（settle，合同）、第 112 帧（big，合同）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
