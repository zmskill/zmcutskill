---
name: glyphs-drawn-one-by-one
中文名: 参考线 → 描边 → 填实，逐字画出
用途: 字卡
时长: 3.8 秒（114 帧，30fps）
一句话: 墨绿底 + 构造网格，品牌名一个字一个字"画"出来：先出虚线参考线和锚点、再描边、再填实，镜头推近一下又拉远换下一个字（前三个字）
来源镜头: glyph-construct-wordmark（第 0–114 帧）
样片: demos-own/parts/glyphs-drawn-one-by-one/preview.mp4
样片图: demos-own/parts/glyphs-drawn-one-by-one/preview-sheet.jpg
---

## 动作
墨绿底 + 构造网格，品牌名一个字一个字"画"出来：先出虚线参考线和锚点、再描边、再填实，镜头推近一下又拉远换下一个字（前三个字）

## 怎么进来
第一帧开始

## 注意
每个字约 1.25 秒

## 怎么用
- 代码入口：`demos-own/parts/glyphs-drawn-one-by-one/GlyphsDrawnOneByOne.tsx`（只播原镜头的这一段，时长常量 `GLYPHS_DRAWN_ONE_BY_ONE_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/glyph-construct-wordmark/GlyphConstructWordmark.tsx`：先读原镜头的卡 `references/groups-own/glyph-construct-wordmark.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 2 帧（c1，合同）、第 19 帧（样片量的）、第 33 帧（样片量的）、第 39 帧（c2，合同）、第 57 帧（样片量的）、第 71 帧（样片量的）、第 76 帧（c3，合同）、第 94 帧（样片量的）、第 108 帧（样片量的）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
