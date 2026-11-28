---
name: benefit-lines-word-by-word
中文名: 两句好处逐词出 · 拖影退场
用途: 字卡
时长: 2.9 秒（86 帧，30fps）
一句话: 第一句逐词出（浅灰带虚滑进来再变墨、整行一直居中），虚掉退场；第二句逐词出，往左拖影退场
来源镜头: benefit-lines-to-logo（第 0–86 帧）
样片: demos-own/parts/benefit-lines-word-by-word/preview.mp4
样片图: demos-own/parts/benefit-lines-word-by-word/preview-sheet.jpg
---

## 动作
第一句逐词出（浅灰带虚滑进来再变墨、整行一直居中），虚掉退场；第二句逐词出，往左拖影退场

## 怎么进来
第一帧开始

## 注意
两句写成对比式的好处

## 怎么用
- 代码入口：`demos-own/parts/benefit-lines-word-by-word/BenefitLinesWordByWord.tsx`（只播原镜头的这一段，时长常量 `BENEFIT_LINES_WORD_BY_WORD_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/outro/benefit-lines-to-logo/BenefitLinesToLogo.tsx`：先读原镜头的卡 `references/shots-own/outro/benefit-lines-to-logo.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 13 帧（样片量的）、第 28 帧（样片量的）、第 69 帧（样片量的）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
