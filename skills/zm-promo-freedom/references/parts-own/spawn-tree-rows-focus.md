---
name: spawn-tree-rows-focus
中文名: 线扫过标题 · 分出三行子任务 · 推近第一行
用途: 功能演示
时长: 4.6 秒（138 帧，30fps）
一句话: 镜头跟着一根细线横扫过大标题，标题右端伸出花括号、线拐弯往下，蓝点领着跑出三行子任务；推近第一行，字从两头消掉，只剩两个图标靠拢
来源镜头: spawn-tree-rows-focus（整个镜头）
样片: demos-own/parts/spawn-tree-rows-focus/preview.mp4
样片图: demos-own/parts/spawn-tree-rows-focus/preview-sheet.jpg
---

## 动作
镜头跟着一根细线横扫过大标题，标题右端伸出花括号、线拐弯往下，蓝点领着跑出三行子任务；推近第一行，字从两头消掉，只剩两个图标靠拢

## 怎么进来
第一帧开始

## 注意
"同时派几个助手"

## 怎么用
- 代码入口：`demos-own/parts/spawn-tree-rows-focus/SpawnTreeRowsFocus.tsx`（整个镜头，时长常量 `SPAWN_TREE_ROWS_FOCUS_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/spawn-tree-rows-focus/SpawnTreeRowsFocus.tsx`：先读原镜头的卡 `references/groups-own/spawn-tree-rows-focus.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 2 帧（line，合同）、第 15 帧（sweep，合同）、第 45 帧（brace，合同）、第 56 帧（down，合同）、第 75 帧（row1，合同）、第 78 帧（row2，合同）、第 81 帧（row3，合同）、第 88 帧（样片量的）、第 92 帧（push，合同）、第 105 帧（dissolve，合同）、第 112 帧（样片量的）、第 117 帧（gather，合同）、第 130 帧（push2，合同）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
