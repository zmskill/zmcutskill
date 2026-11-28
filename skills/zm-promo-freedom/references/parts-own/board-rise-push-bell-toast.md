---
name: board-rise-push-bell-toast
中文名: 任务板升起 · 猛推到铃铛 · 红点变成通知卡
用途: 功能演示
时长: 2.9 秒（87 帧，30fps）
一句话: 任务板升上来，镜头猛推到铃铛，红点掉下来变白、撑开成斜着的通知卡
来源镜头: board-bell-toast-drawer（第 0–87 帧）
样片: demos-own/parts/board-rise-push-bell-toast/preview.mp4
样片图: demos-own/parts/board-rise-push-bell-toast/preview-sheet.jpg
---

## 动作
任务板升上来，镜头猛推到铃铛，红点掉下来变白、撑开成斜着的通知卡

## 怎么进来
第一帧开始

## 注意
"有新事进来"

## 怎么用
- 代码入口：`demos-own/parts/board-rise-push-bell-toast/BoardRisePushBellToast.tsx`（只播原镜头的这一段，时长常量 `BOARD_RISE_PUSH_BELL_TOAST_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/board-bell-toast-drawer/BoardBellToastDrawer.tsx`：先读原镜头的卡 `references/groups-own/board-bell-toast-drawer.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 14 帧（样片量的）、第 18 帧（push，合同）、第 29 帧（样片量的）、第 36 帧（badge，合同）、第 51 帧（drop，合同）、第 63 帧（toast，合同）、第 69 帧（样片量的）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
