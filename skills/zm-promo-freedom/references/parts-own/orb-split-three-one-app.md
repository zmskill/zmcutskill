---
name: orb-split-three-one-app
中文名: 小球分成三个功能图标 · 再合成一个应用
用途: 列举
时长: 4.3 秒（129 帧，30fps）
一句话: 黑底一颗渐变小球 + 下面一个词，四周彩色小点漂 → 球往两边分出两颗、变成三个功能图标（各自换色、下面各有名字）→
来源镜头: orb-split-three-one-app（整个镜头）
样片: demos-own/parts/orb-split-three-one-app/preview.mp4
样片图: demos-own/parts/orb-split-three-one-app/preview-sheet.jpg
---

## 动作
黑底一颗渐变小球 + 下面一个词，四周彩色小点漂 → 球往两边分出两颗、变成三个功能图标（各自换色、下面各有名字）→

## 怎么进来
第一帧开始

## 怎么用
- 代码入口：`demos-own/parts/orb-split-three-one-app/OrbSplitThreeOneApp.tsx`（整个镜头，时长常量 `ORB_SPLIT_THREE_ONE_APP_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/orb-split-three-one-app/OrbSplitThreeOneApp.tsx`：先读原镜头的卡 `references/groups-own/orb-split-three-one-app.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 9 帧（orb，合同）、第 13 帧（样片量的）、第 18 帧（split，合同）、第 27 帧（three，合同）、第 60 帧（shrink，合同）、第 78 帧（text，合同）、第 114 帧（clear，合同）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
