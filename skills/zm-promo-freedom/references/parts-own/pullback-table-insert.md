---
name: pullback-table-insert
中文名: 拉回 · 表格里插进新的一组
用途: 功能演示
时长: 1.9 秒（56 帧，30fps）
一句话: 镜头拉回，表格上插进新的一组（先虚后实）
来源镜头: board-bell-toast-drawer（第 87–143 帧）
样片: demos-own/parts/pullback-table-insert/preview.mp4
样片图: demos-own/parts/pullback-table-insert/preview-sheet.jpg
---

## 动作
镜头拉回，表格上插进新的一组（先虚后实）

## 怎么进来
接上一拍的特写

## 怎么用
- 代码入口：`demos-own/parts/pullback-table-insert/PullbackTableInsert.tsx`（只播原镜头的这一段，时长常量 `PULLBACK_TABLE_INSERT_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/board-bell-toast-drawer/BoardBellToastDrawer.tsx`：先读原镜头的卡 `references/groups-own/board-bell-toast-drawer.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 18 帧（pull，合同）、第 45 帧（insert，合同）、第 49 帧（样片量的）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
