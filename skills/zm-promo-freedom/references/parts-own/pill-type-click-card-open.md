---
name: pill-type-click-card-open
中文名: 胶囊长出 · 大字两行打 · 点一下撑成项目卡
用途: 结果登场
时长: 1.9 秒（57 帧，30fps）
一句话: 白胶囊从小长出，大字两行叠着从下浮上来；光标飞过去按下、水波圈，项目卡从胶囊处撑开，停住看卡
来源镜头: project-card-kanban-drag（第 0–57 帧）
样片: demos-own/parts/pill-type-click-card-open/preview.mp4
样片图: demos-own/parts/pill-type-click-card-open/preview-sheet.jpg
---

## 动作
白胶囊从小长出，大字两行叠着从下浮上来；光标飞过去按下、水波圈，项目卡从胶囊处撑开，停住看卡

## 怎么进来
浅色底

## 怎么用
- 代码入口：`demos-own/parts/pill-type-click-card-open/PillTypeClickCardOpen.tsx`（只播原镜头的这一段，时长常量 `PILL_TYPE_CLICK_CARD_OPEN_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/project-card-kanban-drag/ProjectCardKanbanDrag.tsx`：先读原镜头的卡 `references/groups-own/project-card-kanban-drag.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 3 帧（pill，合同）、第 6 帧（type，合同）、第 23 帧（click，合同）、第 29 帧（card，合同）、第 34 帧（样片量的）、第 41 帧（cardFull，合同）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
