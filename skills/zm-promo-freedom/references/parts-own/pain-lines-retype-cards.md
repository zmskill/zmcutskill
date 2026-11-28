---
name: pain-lines-retype-cards
中文名: 痛点句重打三次 · 小卡围过来
用途: 痛点
时长: 3.8 秒（115 帧，30fps）
一句话: 浅色柔光底上痛点句逐词出现，八张琐碎小卡从四周滑进来各自漂；整行重打三次，旧句变灰上飘、新句逐词升上来
来源镜头: pain-swirl-dot-logo（第 0–115 帧）
样片: demos-own/parts/pain-lines-retype-cards/preview.mp4
样片图: demos-own/parts/pain-lines-retype-cards/preview-sheet.jpg
---

## 动作
浅色柔光底上痛点句逐词出现，八张琐碎小卡从四周滑进来各自漂；整行重打三次，旧句变灰上飘、新句逐词升上来

## 怎么进来
第一帧开始

## 注意
三句痛点用真实吐槽原话

## 怎么用
- 代码入口：`demos-own/parts/pain-lines-retype-cards/PainLinesRetypeCards.tsx`（只播原镜头的这一段，时长常量 `PAIN_LINES_RETYPE_CARDS_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/opening/pain-swirl-dot-logo/PainSwirlDotLogo.tsx`：先读原镜头的卡 `references/shots-own/opening/pain-swirl-dot-logo.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 8 帧（line1，合同）、第 13 帧（cards，合同）、第 52 帧（line2，合同）、第 91 帧（line3，合同）、第 98 帧（样片量的）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
