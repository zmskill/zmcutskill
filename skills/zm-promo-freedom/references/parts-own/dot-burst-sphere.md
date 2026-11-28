---
name: dot-burst-sphere
中文名: 大圆缩成点 · 点阵迎面炸开聚成球
用途: 钩子
时长: 4.8 秒（144 帧，30fps）
一句话: 黑底一个大圆（灰→白）越缩越小成一个点，背景浮出点阵 → 点"炸开"迎面飞来、聚成右边一颗转动的点阵球，
来源镜头: dot-burst-sphere（整个镜头）
样片: demos-own/parts/dot-burst-sphere/preview.mp4
样片图: demos-own/parts/dot-burst-sphere/preview-sheet.jpg
---

## 动作
黑底一个大圆（灰→白）越缩越小成一个点，背景浮出点阵 → 点"炸开"迎面飞来、聚成右边一颗转动的点阵球，

## 怎么进来
第一帧开始

## 怎么用
- 代码入口：`demos-own/parts/dot-burst-sphere/DotBurstSphere.tsx`（整个镜头，时长常量 `DOT_BURST_SPHERE_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/dot-burst-sphere/DotBurstSphere.tsx`：先读原镜头的卡 `references/groups-own/dot-burst-sphere.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 6 帧（circle，合同）、第 32 帧（样片量的）、第 38 帧（dot，合同）、第 40 帧（burst，合同）、第 52 帧（sphere，合同）、第 56 帧（line1，合同）、第 66 帧（样片量的）、第 81 帧（line2，合同）、第 102 帧（sweep，合同）、第 138 帧（exit，合同）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
