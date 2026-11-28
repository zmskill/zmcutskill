---
name: type-lines-converge
中文名: 斜面上打一句话 · 四条彩色虚线汇过来
用途: 钩子
时长: 2.2 秒（66 帧，30fps）
一句话: 一行字在斜放的平面上被打出来，四条彩色虚线从画面外画进来，汇到句末的那个圈
来源镜头: route-hub-logo（第 0–66 帧）
样片: demos-own/parts/type-lines-converge/preview.mp4
样片图: demos-own/parts/type-lines-converge/preview-sheet.jpg
---

## 动作
一行字在斜放的平面上被打出来，四条彩色虚线从画面外画进来，汇到句末的那个圈

## 怎么进来
第一帧开始

## 怎么用
- 代码入口：`demos-own/parts/type-lines-converge/TypeLinesConverge.tsx`（只播原镜头的这一段，时长常量 `TYPE_LINES_CONVERGE_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/route-hub-logo/RouteHubLogo.tsx`：先读原镜头的卡 `references/groups-own/route-hub-logo.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 9 帧（样片量的）、第 31 帧（lines，合同）、第 62 帧（fade，合同）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
