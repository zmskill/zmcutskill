---
name: pill-bar-report-slides
中文名: 胶囊压成进度条 · 报告页一张张出
用途: 证据
时长: 6.0 秒（180 帧，30fps）
一句话: 米白底一个细线小胶囊撑大 → 蓝色圆从左边滚进来填成蓝胶囊 → 上下夹着两个标签词、整条压扁成一根进度条 →
来源镜头: pill-bar-report-slides（整个镜头）
样片: demos-own/parts/pill-bar-report-slides/preview.mp4
样片图: demos-own/parts/pill-bar-report-slides/preview-sheet.jpg
---

## 动作
米白底一个细线小胶囊撑大 → 蓝色圆从左边滚进来填成蓝胶囊 → 上下夹着两个标签词、整条压扁成一根进度条 →

## 怎么进来
第一帧开始

## 注意
正好 6 秒

## 怎么用
- 代码入口：`demos-own/parts/pill-bar-report-slides/PillBarReportSlides.tsx`（整个镜头，时长常量 `PILL_BAR_REPORT_SLIDES_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/pill-bar-report-slides/PillBarReportSlides.tsx`：先读原镜头的卡 `references/groups-own/pill-bar-report-slides.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 3 帧（blue，合同）、第 24 帧（labels，合同）、第 36 帧（样片量的）、第 52 帧（report，合同）、第 68 帧（side，合同）、第 103 帧（样片量的）、第 111 帧（slides，合同）、第 120 帧（split，合同）、第 139 帧（cards，合同）、第 160 帧（样片量的）、第 172 帧（highlight，合同）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
