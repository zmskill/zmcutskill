---
name: headline-swap-dashboard-rise
中文名: 一句话换词四次 · 产品面板升起
用途: 结果登场
时长: 4.6 秒（138 帧，30fps）
一句话: 一句话逐词打出、句尾的词在原地换三次，换完产品面板从下面升起，目标卡浮出放大分身、左下弹出"已完成"，停住看；弹出收掉、字淡走，镜头推进右上角的"新建任务"按钮，最后只剩这颗按钮
来源镜头: headline-swap-dashboard-rise（整个镜头）
样片: demos-own/parts/headline-swap-dashboard-rise/preview.mp4
样片图: demos-own/parts/headline-swap-dashboard-rise/preview-sheet.jpg
---

## 动作
一句话逐词打出、句尾的词在原地换三次，换完产品面板从下面升起，目标卡浮出放大分身、左下弹出"已完成"，停住看；弹出收掉、字淡走，镜头推进右上角的"新建任务"按钮，最后只剩这颗按钮

## 怎么进来
浅色底

## 注意
结尾推进一个按钮，一帧切

## 怎么用
- 代码入口：`demos-own/parts/headline-swap-dashboard-rise/HeadlineSwapDashboardRise.tsx`（整个镜头，时长常量 `HEADLINE_SWAP_DASHBOARD_RISE_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/headline-swap-dashboard-rise/HeadlineSwapDashboardRise.tsx`：先读原镜头的卡 `references/groups-own/headline-swap-dashboard-rise.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 3 帧（lead，合同）、第 13 帧（word1，合同）、第 28 帧（word2，合同）、第 43 帧（word3，合同）、第 58 帧（word4，合同）、第 69 帧（panel，合同）、第 86 帧（panelLand，合同）、第 87 帧（pop，合同）、第 90 帧（toast，合同）、第 95 帧（样片量的）、第 102 帧（retract，合同）、第 109 帧（push，合同）、第 118 帧（pushPeak，合同）、第 125 帧（样片量的）、第 129 帧（settle，合同）、第 134 帧（cut，合同）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
