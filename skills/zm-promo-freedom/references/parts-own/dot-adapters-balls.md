---
name: dot-adapters-balls
中文名: 点云聚成四颗点阵球 · 各带名字
用途: 列举
时长: 4.2 秒（126 帧，30fps）
一句话: 点线卡片散成点云 → 聚成一大三小四颗转动的点阵球，球下面各有一个小图标 + 名字，左边一行大字；最后球又化成点云（033-C 一拍，枚举）
来源镜头: dot-adapters-balls（整个镜头）
样片: demos-own/parts/dot-adapters-balls/preview.mp4
样片图: demos-own/parts/dot-adapters-balls/preview-sheet.jpg
---

## 动作
点线卡片散成点云 → 聚成一大三小四颗转动的点阵球，球下面各有一个小图标 + 名字，左边一行大字；最后球又化成点云（033-C 一拍，枚举）

## 怎么进来
接点线卡片散开

## 注意
结尾球又化成点云，可以接别的点阵零件

## 怎么用
- 代码入口：`demos-own/parts/dot-adapters-balls/DotAdaptersBalls.tsx`（整个镜头，时长常量 `DOT_ADAPTERS_BALLS_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/dot-adapters-balls/DotAdaptersBalls.tsx`：先读原镜头的卡 `references/groups-own/dot-adapters-balls.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 28 帧（title，合同）、第 30 帧（balls，合同）、第 42 帧（labels，合同）、第 102 帧（out，合同）、第 120 帧（cloud，合同）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
