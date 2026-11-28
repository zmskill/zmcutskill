---
name: ui-closeup-fill-scroll
中文名: 硬切放大界面 · 表格一格格填好 · 往上滚
用途: 功能演示
时长: 1.7 秒（50 帧，30fps）
一句话: 硬切放大界面从右滑进，表格一格一格填好，再往上滚
来源镜头: smarter-card-board-tilt（第 70–120 帧）
样片: demos-own/parts/ui-closeup-fill-scroll/preview.mp4
样片图: demos-own/parts/ui-closeup-fill-scroll/preview-sheet.jpg
---

## 动作
硬切放大界面从右滑进，表格一格一格填好，再往上滚

## 怎么进来
硬切

## 怎么用
- 代码入口：`demos-own/parts/ui-closeup-fill-scroll/UiCloseupFillScroll.tsx`（只播原镜头的这一段，时长常量 `UI_CLOSEUP_FILL_SCROLL_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/smarter-card-board-tilt/SmarterCardBoardTilt.tsx`：先读原镜头的卡 `references/groups-own/smarter-card-board-tilt.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 9 帧（fill，合同）、第 28 帧（scroll，合同）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
