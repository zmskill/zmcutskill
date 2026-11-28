---
name: push-select-word-stretch-crowd
中文名: 猛推到一个词框选 · 字被拖出好多个 · 冒出像素小人
用途: 功能演示
时长: 3.0 秒（91 帧，30fps）
一句话: 镜头猛推到最后一个词、框选，一个字被拖出好多个挤成一排，缝里冒出像素小人
来源镜头: word-stretch-style-grid（第 83–174 帧）
样片: demos-own/parts/push-select-word-stretch-crowd/preview.mp4
样片图: demos-own/parts/push-select-word-stretch-crowd/preview-sheet.jpg
---

## 动作
镜头猛推到最后一个词、框选，一个字被拖出好多个挤成一排，缝里冒出像素小人

## 怎么进来
接上一段

## 怎么用
- 代码入口：`demos-own/parts/push-select-word-stretch-crowd/PushSelectWordStretchCrowd.tsx`（只播原镜头的这一段，时长常量 `PUSH_SELECT_WORD_STRETCH_CROWD_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/word-stretch-style-grid/WordStretchStyleGrid.tsx`：先读原镜头的卡 `references/groups-own/word-stretch-style-grid.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 8 帧（样片量的）、第 19 帧（crowd，合同）、第 29 帧（stretch，合同）、第 49 帧（样片量的）、第 59 帧（split，合同）、第 66 帧（样片量的）、第 70 帧（样片量的）、第 76 帧（out，合同）、第 83 帧（样片量的）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
