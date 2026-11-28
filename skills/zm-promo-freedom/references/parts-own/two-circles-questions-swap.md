---
name: two-circles-questions-swap
中文名: 两个蓝圆并排 · 里面的问题换两次
用途: 列举
时长: 2.0 秒（60 帧，30fps）
一句话: 两个蓝色大圆并排，圆里的问题换两次，最后收走
来源镜头: circle-train-ask-study（第 210–270 帧）
样片: demos-own/parts/two-circles-questions-swap/preview.mp4
样片图: demos-own/parts/two-circles-questions-swap/preview-sheet.jpg
---

## 动作
两个蓝色大圆并排，圆里的问题换两次，最后收走

## 怎么进来
接上一段

## 怎么用
- 代码入口：`demos-own/parts/two-circles-questions-swap/TwoCirclesQuestionsSwap.tsx`（只播原镜头的这一段，时长常量 `TWO_CIRCLES_QUESTIONS_SWAP_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/circle-train-ask-study/CircleTrainAskStudy.tsx`：先读原镜头的卡 `references/groups-own/circle-train-ask-study.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 4 帧（q2，合同）、第 17 帧（样片量的）、第 22 帧（q3，合同）、第 35 帧（样片量的）、第 52 帧（out，合同）、第 57 帧（样片量的）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
