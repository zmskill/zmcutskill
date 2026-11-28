---
name: task-list-ticker
中文名: 任务短句转盘
用途: 列举
时长: 2.1 秒（64 帧，30fps）
一句话: 白底上一圈很大的任务短句像转盘一样转，每行左沿排在一条往右弯的弧上，每 0.28 秒往上转一行，正中那行变黑、左边一颗发光蓝球，长句被画面右沿裁掉
来源镜头: task-list-ticker（整个镜头）
样片: demos-own/parts/task-list-ticker/preview.mp4
样片图: demos-own/parts/task-list-ticker/preview-sheet.jpg
---

## 动作
白底上一圈很大的任务短句像转盘一样转，每行左沿排在一条往右弯的弧上，每 0.28 秒往上转一行，正中那行变黑、左边一颗发光蓝球，长句被画面右沿裁掉

## 怎么进来
第一帧开始

## 注意
可循环

## 怎么用
- 代码入口：`demos-own/parts/task-list-ticker/TaskListTicker.tsx`（整个镜头，时长常量 `TASK_LIST_TICKER_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/typography/task-list-ticker/TaskListTicker.tsx`：先读原镜头的卡 `references/shots-own/typography/task-list-ticker.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 5 帧（样片量的）、第 14 帧（样片量的）、第 22 帧（样片量的）、第 30 帧（样片量的）、第 39 帧（样片量的）、第 47 帧（样片量的）、第 56 帧（样片量的）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
