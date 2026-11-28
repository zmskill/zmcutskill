---
name: page-tilt-dive-flicks
中文名: 页面斜过来 · 镜头扎进去 · 三下往下翻
用途: 功能演示
时长: 5.0 秒（150 帧，30fps）
一句话: 页面猛地斜过来、镜头扎进去，贴着斜放的表格三下往下翻
来源镜头: page-tilt-scroll（第 65–215 帧）
样片: demos-own/parts/page-tilt-dive-flicks/preview.mp4
样片图: demos-own/parts/page-tilt-dive-flicks/preview-sheet.jpg
---

## 动作
页面猛地斜过来、镜头扎进去，贴着斜放的表格三下往下翻

## 怎么进来
接上一拍的整页

## 注意
5 秒；"所有事都在一页里"

## 怎么用
- 代码入口：`demos-own/parts/page-tilt-dive-flicks/PageTiltDiveFlicks.tsx`（只播原镜头的这一段，时长常量 `PAGE_TILT_DIVE_FLICKS_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/page-tilt-scroll/PageTiltScroll.tsx`：先读原镜头的卡 `references/groups-own/page-tilt-scroll.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 1 帧（dive，合同）、第 26 帧（样片量的）、第 37 帧（flick1，合同）、第 63 帧（样片量的）、第 75 帧（flick2，合同）、第 94 帧（样片量的）、第 111 帧（flick3，合同）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
