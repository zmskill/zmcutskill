---
name: words-append-line
中文名: 逐词追加 · 整行一直居中
用途: 字卡
时长: 1.5 秒（45 帧，30fps）
一句话: 一行字一个词一个词往后加，整行始终居中，新词从远处深灰靠拢变白
来源镜头: orb-relay-explainer（第 238–283 帧）
样片: demos-own/parts/words-append-line/preview.mp4
样片图: demos-own/parts/words-append-line/preview-sheet.jpg
---

## 动作
一行字一个词一个词往后加，整行始终居中，新词从远处深灰靠拢变白

## 怎么进来
硬切

## 怎么用
- 代码入口：`demos-own/parts/words-append-line/WordsAppendLine.tsx`（只播原镜头的这一段，时长常量 `WORDS_APPEND_LINE_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/opening/orb-relay-explainer/OrbRelayExplainer.tsx`：先读原镜头的卡 `references/shots-own/opening/orb-relay-explainer.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 11 帧（样片量的）、第 18 帧（样片量的）、第 25 帧（样片量的）、第 33 帧（样片量的）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
