---
name: line-unfold-card-corridor
中文名: 竖线展开成卡 · 走廊里一张张换到中间
用途: 列举
时长: 5.4 秒（162 帧，30fps）
一句话: 黑底蓝图风，一根竖线从右边滑进来在中间展开成一张霓虹像素卡，左右灰色卡从它背后滑出来排成走廊，之后右边的卡一张张飞到中间变彩色，整排一直慢慢往左漂
来源镜头: line-unfold-card-corridor（整个镜头）
样片: demos-own/parts/line-unfold-card-corridor/preview.mp4
样片图: demos-own/parts/line-unfold-card-corridor/preview-sheet.jpg
---

## 动作
黑底蓝图风，一根竖线从右边滑进来在中间展开成一张霓虹像素卡，左右灰色卡从它背后滑出来排成走廊，之后右边的卡一张张飞到中间变彩色，整排一直慢慢往左漂

## 怎么进来
黑底

## 注意
暗色蓝图风

## 怎么用
- 代码入口：`demos-own/parts/line-unfold-card-corridor/LineUnfoldCardCorridor.tsx`（整个镜头，时长常量 `LINE_UNFOLD_CARD_CORRIDOR_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/line-unfold-card-corridor/LineUnfoldCardCorridor.tsx`：先读原镜头的卡 `references/groups-own/line-unfold-card-corridor.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 9 帧（unfold，合同）、第 15 帧（sides，合同）、第 30 帧（swap1，合同）、第 34 帧（样片量的）、第 48 帧（swap2，合同）、第 52 帧（样片量的）、第 64 帧（swap3，合同）、第 69 帧（样片量的）、第 96 帧（swap4，合同）、第 100 帧（样片量的）、第 126 帧（swap5，合同）、第 130 帧（样片量的）、第 148 帧（swap6，合同）、第 153 帧（样片量的）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
