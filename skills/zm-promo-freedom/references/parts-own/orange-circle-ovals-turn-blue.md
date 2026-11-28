---
name: orange-circle-ovals-turn-blue
中文名: 橙圆里冒字 · 挤出椭圆串变蓝
用途: 字卡
时长: 2.4 秒（72 帧，30fps）
一句话: 米白底，橙色大圆里一行行冒出字，圆往左让、右边挤出一串越来越窄的椭圆，颜色从右往左换成蓝
来源镜头: circle-train-ask-study（第 0–72 帧）
样片: demos-own/parts/orange-circle-ovals-turn-blue/preview.mp4
样片图: demos-own/parts/orange-circle-ovals-turn-blue/preview-sheet.jpg
---

## 动作
米白底，橙色大圆里一行行冒出字，圆往左让、右边挤出一串越来越窄的椭圆，颜色从右往左换成蓝

## 怎么进来
第一帧开始

## 怎么用
- 代码入口：`demos-own/parts/orange-circle-ovals-turn-blue/OrangeCircleOvalsTurnBlue.tsx`（只播原镜头的这一段，时长常量 `ORANGE_CIRCLE_OVALS_TURN_BLUE_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/circle-train-ask-study/CircleTrainAskStudy.tsx`：先读原镜头的卡 `references/groups-own/circle-train-ask-study.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 18 帧（train，合同）、第 34 帧（swap，合同）、第 48 帧（why，合同）、第 61 帧（样片量的）、第 69 帧（button，合同）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
