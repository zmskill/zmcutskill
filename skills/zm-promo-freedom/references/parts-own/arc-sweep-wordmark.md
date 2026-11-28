---
name: arc-sweep-wordmark
中文名: 蓝色弧光扫过 · 星标和名字由糊变清
用途: 品牌落版
时长: 3.2 秒（96 帧，30fps）
一句话: 一道蓝色弧光从右上扫过去 → 顶上一条暗弧、底下一圈行星边缘的光 → 中间星标 + 名字从左往右由糊变清，定住（028-H 单个镜头，收尾）
来源镜头: arc-sweep-wordmark（整个镜头）
样片: demos-own/parts/arc-sweep-wordmark/preview.mp4
样片图: demos-own/parts/arc-sweep-wordmark/preview-sheet.jpg
---

## 动作
一道蓝色弧光从右上扫过去 → 顶上一条暗弧、底下一圈行星边缘的光 → 中间星标 + 名字从左往右由糊变清，定住（028-H 单个镜头，收尾）

## 怎么进来
第一帧开始

## 注意
暗色片子的收尾

## 怎么用
- 代码入口：`demos-own/parts/arc-sweep-wordmark/ArcSweepWordmark.tsx`（整个镜头，时长常量 `ARC_SWEEP_WORDMARK_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/arc-sweep-wordmark/ArcSweepWordmark.tsx`：先读原镜头的卡 `references/groups-own/arc-sweep-wordmark.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 9 帧（word，合同）、第 36 帧（lock，合同）、第 71 帧（样片量的）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
