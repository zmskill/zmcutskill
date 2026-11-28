---
name: pixel-cursors-merge-logo
中文名: 像素小光标四处冒 · 合成标志
用途: 品牌落版
时长: 5.0 秒（150 帧，30fps）
一句话: 浅灰底 + 淡字符画漩涡，七八个像素小光标（蓝 / 米色 / 黑白 / 带照片的）四处冒出来晃一会儿，
来源镜头: pixel-cursors-merge-logo（整个镜头）
样片: demos-own/parts/pixel-cursors-merge-logo/preview.mp4
样片图: demos-own/parts/pixel-cursors-merge-logo/preview-sheet.jpg
---

## 动作
浅灰底 + 淡字符画漩涡，七八个像素小光标（蓝 / 米色 / 黑白 / 带照片的）四处冒出来晃一会儿，

## 怎么进来
第一帧开始

## 怎么用
- 代码入口：`demos-own/parts/pixel-cursors-merge-logo/PixelCursorsMergeLogo.tsx`（整个镜头，时长常量 `PIXEL_CURSORS_MERGE_LOGO_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/pixel-cursors-merge-logo/PixelCursorsMergeLogo.tsx`：先读原镜头的卡 `references/groups-own/pixel-cursors-merge-logo.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 3 帧（appear，合同）、第 30 帧（gather，合同）、第 60 帧（merge，合同）、第 69 帧（logo，合同）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
