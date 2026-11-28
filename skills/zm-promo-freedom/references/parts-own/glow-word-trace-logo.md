---
name: glow-word-trace-logo
中文名: 蓝光沿标志描一圈 · 变成实心标志
用途: 品牌落版
时长: 4.8 秒（144 帧，30fps）
一句话: 黑底中间一个渐变小字暗暗亮着 → 一束蓝光沿着标志的形状描一圈，小字随之淡掉 → 光描完变成实心白色字形标志，停住（013-H 单个镜头，收尾）
来源镜头: glow-word-trace-logo（整个镜头）
样片: demos-own/parts/glow-word-trace-logo/preview.mp4
样片图: demos-own/parts/glow-word-trace-logo/preview-sheet.jpg
---

## 动作
黑底中间一个渐变小字暗暗亮着 → 一束蓝光沿着标志的形状描一圈，小字随之淡掉 → 光描完变成实心白色字形标志，停住（013-H 单个镜头，收尾）

## 怎么进来
第一帧开始

## 注意
暗色片子的收尾

## 怎么用
- 代码入口：`demos-own/parts/glow-word-trace-logo/GlowWordTraceLogo.tsx`（整个镜头，时长常量 `GLOW_WORD_TRACE_LOGO_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/glow-word-trace-logo/GlowWordTraceLogo.tsx`：先读原镜头的卡 `references/groups-own/glow-word-trace-logo.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 9 帧（word，合同）、第 51 帧（trace，合同）、第 76 帧（logo，合同）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
