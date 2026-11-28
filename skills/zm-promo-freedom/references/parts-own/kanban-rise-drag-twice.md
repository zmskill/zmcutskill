---
name: kanban-rise-drag-twice
中文名: 看板浮上来 · 拖卡两次 · 绿勾
用途: 功能演示
时长: 3.8 秒（114 帧，30fps）
一句话: 项目卡缩小上移，三列看板错开浮上来，进度一路涨；卡片被拿起、横移、落下两次，落进"已完成"后长出绿勾
来源镜头: project-card-kanban-drag（第 57–171 帧）
样片: demos-own/parts/kanban-rise-drag-twice/preview.mp4
样片图: demos-own/parts/kanban-rise-drag-twice/preview-sheet.jpg
---

## 动作
项目卡缩小上移，三列看板错开浮上来，进度一路涨；卡片被拿起、横移、落下两次，落进"已完成"后长出绿勾

## 怎么进来
接上一拍的项目卡

## 注意
"建 → 管 → 推进"

## 怎么用
- 代码入口：`demos-own/parts/kanban-rise-drag-twice/KanbanRiseDragTwice.tsx`（只播原镜头的这一段，时长常量 `KANBAN_RISE_DRAG_TWICE_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/project-card-kanban-drag/ProjectCardKanbanDrag.tsx`：先读原镜头的卡 `references/groups-own/project-card-kanban-drag.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 1 帧（shrink，合同）、第 7 帧（board，合同）、第 17 帧（样片量的）、第 24 帧（boardLand，合同）、第 33 帧（pick1，合同）、第 43 帧（样片量的）、第 49 帧（样片量的）、第 53 帧（drop1，合同）、第 63 帧（pick2，合同）、第 72 帧（样片量的）、第 77 帧（drop2，合同）、第 79 帧（check，合同）、第 93 帧（cursorOut，合同）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
