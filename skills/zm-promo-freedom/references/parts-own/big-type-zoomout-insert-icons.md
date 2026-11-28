---
name: big-type-zoomout-insert-icons
中文名: 大字打出 · 猛拉远 · 句子中间插进一排图标
用途: 钩子
时长: 2.4 秒（71 帧，30fps）
一句话: 大字逐字打出，猛拉远成一行小字，句子中间撑开、插进一排 AI 图标
来源镜头: type-icons-orbit-input（第 0–71 帧）
样片: demos-own/parts/big-type-zoomout-insert-icons/preview.mp4
样片图: demos-own/parts/big-type-zoomout-insert-icons/preview-sheet.jpg
---

## 动作
大字逐字打出，猛拉远成一行小字，句子中间撑开、插进一排 AI 图标

## 怎么进来
第一帧开始

## 怎么用
- 代码入口：`demos-own/parts/big-type-zoomout-insert-icons/BigTypeZoomoutInsertIcons.tsx`（只播原镜头的这一段，时长常量 `BIG_TYPE_ZOOMOUT_INSERT_ICONS_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/type-icons-orbit-input/TypeIconsOrbitInput.tsx`：先读原镜头的卡 `references/groups-own/type-icons-orbit-input.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 20 帧（zoomOut，合同）、第 45 帧（split，合同）、第 49 帧（icons，合同）、第 58 帧（样片量的）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
