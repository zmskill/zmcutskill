---
name: toggle-autopilot-cards
中文名: 大开关打开 · 卡片从四周飞来围着大字转
用途: 功能演示
时长: 3.5 秒（104 帧，30fps）
一句话: 一颗超大开关在白底上浮出、"啪"地打开变绿，十几张助手卡片从四周飞进来围住它；开关缩小右移，露出后面的大字"自动安排"；整团卡片绕着大字顺时针转，最后整团缩远
来源镜头: toggle-autopilot-cards（整个镜头）
样片: demos-own/parts/toggle-autopilot-cards/preview.mp4
样片图: demos-own/parts/toggle-autopilot-cards/preview-sheet.jpg
---

## 动作
一颗超大开关在白底上浮出、"啪"地打开变绿，十几张助手卡片从四周飞进来围住它；开关缩小右移，露出后面的大字"自动安排"；整团卡片绕着大字顺时针转，最后整团缩远

## 怎么进来
白底

## 注意
"一键开启"

## 怎么用
- 代码入口：`demos-own/parts/toggle-autopilot-cards/ToggleAutopilotCards.tsx`（整个镜头，时长常量 `TOGGLE_AUTOPILOT_CARDS_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/toggle-autopilot-cards/ToggleAutopilotCards.tsx`：先读原镜头的卡 `references/groups-own/toggle-autopilot-cards.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 4 帧（toggle，合同）、第 11 帧（flip，合同）、第 16 帧（样片量的）、第 20 帧（cards，合同）、第 23 帧（reveal，合同）、第 33 帧（settle，合同）、第 96 帧（zoomOut，合同）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
