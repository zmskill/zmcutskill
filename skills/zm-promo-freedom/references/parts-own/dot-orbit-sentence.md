---
name: dot-orbit-sentence
中文名: 圆点滑过 · 一句话浮出 · 圆点绕着字跑
用途: 字卡
时长: 2.0 秒（60 帧，30fps）
一句话: 一颗紫色圆点滑过，一句话浮出来，圆点绕着字跑
来源镜头: dot-arc-card-stair（第 0–60 帧）
样片: demos-own/parts/dot-orbit-sentence/preview.mp4
样片图: demos-own/parts/dot-orbit-sentence/preview-sheet.jpg
---

## 动作
一颗紫色圆点滑过，一句话浮出来，圆点绕着字跑

## 怎么进来
第一帧开始

## 怎么用
- 代码入口：`demos-own/parts/dot-orbit-sentence/DotOrbitSentence.tsx`（只播原镜头的这一段，时长常量 `DOT_ORBIT_SENTENCE_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/dot-arc-card-stair/DotArcCardStair.tsx`：先读原镜头的卡 `references/groups-own/dot-arc-card-stair.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 12 帧（text，合同）、第 27 帧（样片量的）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
