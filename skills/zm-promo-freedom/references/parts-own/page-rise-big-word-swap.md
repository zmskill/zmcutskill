---
name: page-rise-big-word-swap
中文名: 整页升起 · 后面冒出大字 · 字和表一起换
用途: 结果登场
时长: 2.2 秒（65 帧，30fps）
一句话: 蓝底上一整页任务表升起，页面后面冒出巨大白字；大字一换，表格内容也换一批
来源镜头: page-tilt-scroll（第 0–65 帧）
样片: demos-own/parts/page-rise-big-word-swap/preview.mp4
样片图: demos-own/parts/page-rise-big-word-swap/preview-sheet.jpg
---

## 动作
蓝底上一整页任务表升起，页面后面冒出巨大白字；大字一换，表格内容也换一批

## 怎么进来
蓝底

## 怎么用
- 代码入口：`demos-own/parts/page-rise-big-word-swap/PageRiseBigWordSwap.tsx`（只播原镜头的这一段，时长常量 `PAGE_RISE_BIG_WORD_SWAP_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/page-tilt-scroll/PageTiltScroll.tsx`：先读原镜头的卡 `references/groups-own/page-tilt-scroll.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 11 帧（word，合同）、第 23 帧（样片量的）、第 50 帧（swap，合同）、第 56 帧（refill，合同）、第 60 帧（样片量的）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
