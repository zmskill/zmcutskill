---
name: highlight-erase-retype
中文名: 整块高亮 · 删掉重打一句
用途: 功能演示
时长: 2.0 秒（61 帧，30fps）
一句话: 整块蓝色高亮、字同一帧放大；字删掉只剩光标，逐字打出新的一句，整句始终居中
来源镜头: edit-flash-type-toolbar（第 62–123 帧）
样片: demos-own/parts/highlight-erase-retype/preview.mp4
样片图: demos-own/parts/highlight-erase-retype/preview-sheet.jpg
---

## 动作
整块蓝色高亮、字同一帧放大；字删掉只剩光标，逐字打出新的一句，整句始终居中

## 怎么进来
接上一拍的词

## 注意
"编辑"的画面

## 怎么用
- 代码入口：`demos-own/parts/highlight-erase-retype/HighlightEraseRetype.tsx`（只播原镜头的这一段，时长常量 `HIGHLIGHT_ERASE_RETYPE_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/edit-flash-type-toolbar/EditFlashTypeToolbar.tsx`：先读原镜头的卡 `references/groups-own/edit-flash-type-toolbar.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 18 帧（erase，合同）、第 20 帧（type，合同）、第 27 帧（样片量的）、第 38 帧（样片量的）、第 49 帧（样片量的）、第 56 帧（样片量的）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
