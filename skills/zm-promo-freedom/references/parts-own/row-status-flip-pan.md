---
name: row-status-flip-pan
中文名: 贴脸看一行 · 横滑 · 状态格整格换色
用途: 功能演示
时长: 5.8 秒（174 帧，30fps）
一句话: 贴脸看任务表的一行，整条横着滑到最右，费用、状态两格整格换色；快滑回左边看人，再滑回来状态变"已完成"，整个画面往上走
来源镜头: row-status-flip-pan（整个镜头）
样片: demos-own/parts/row-status-flip-pan/preview.mp4
样片图: demos-own/parts/row-status-flip-pan/preview-sheet.jpg
---

## 动作
贴脸看任务表的一行，整条横着滑到最右，费用、状态两格整格换色；快滑回左边看人，再滑回来状态变"已完成"，整个画面往上走

## 怎么进来
贴脸的表格

## 注意
"进度一目了然"

## 怎么用
- 代码入口：`demos-own/parts/row-status-flip-pan/RowStatusFlipPan.tsx`（整个镜头，时长常量 `ROW_STATUS_FLIP_PAN_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/row-status-flip-pan/RowStatusFlipPan.tsx`：先读原镜头的卡 `references/groups-own/row-status-flip-pan.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 14 帧（样片量的）、第 22 帧（样片量的）、第 30 帧（pay，合同）、第 37 帧（status，合同）、第 43 帧（样片量的）、第 51 帧（back，合同）、第 63 帧（样片量的）、第 73 帧（样片量的）、第 120 帧（forth，合同）、第 134 帧（样片量的）、第 145 帧（done，合同）、第 158 帧（rise，合同）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
