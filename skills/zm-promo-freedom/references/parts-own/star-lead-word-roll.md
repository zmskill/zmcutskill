---
name: star-lead-word-roll
中文名: 小蓝星引着引导词 · 右边词槽竖着滚
用途: 列举
时长: 4.9 秒（147 帧，30fps）
一句话: 小蓝星一边转一边往右靠、引导词往左靠，两者靠拢成一组 → 整组往左让位，右边一个词槽竖着滚：
来源镜头: star-lead-word-roll（整个镜头）
样片: demos-own/parts/star-lead-word-roll/preview.mp4
样片图: demos-own/parts/star-lead-word-roll/preview-sheet.jpg
---

## 动作
小蓝星一边转一边往右靠、引导词往左靠，两者靠拢成一组 → 整组往左让位，右边一个词槽竖着滚：

## 怎么进来
第一帧开始

## 怎么用
- 代码入口：`demos-own/parts/star-lead-word-roll/StarLeadWordRoll.tsx`（整个镜头，时长常量 `STAR_LEAD_WORD_ROLL_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/star-lead-word-roll/StarLeadWordRoll.tsx`：先读原镜头的卡 `references/groups-own/star-lead-word-roll.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 3 帧（cut，合同）、第 18 帧（join，合同）、第 33 帧（w1，合同）、第 41 帧（样片量的）、第 54 帧（w2，合同）、第 58 帧（样片量的）、第 74 帧（w3，合同）、第 79 帧（样片量的）、第 94 帧（w4，合同）、第 99 帧（样片量的）、第 112 帧（w5，合同）、第 134 帧（w6，合同）、第 134 帧（drop，合同）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
