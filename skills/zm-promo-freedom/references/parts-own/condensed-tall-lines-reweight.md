---
name: condensed-tall-lines-reweight
中文名: 三行超窄高字打出 · 选中换粗细
用途: 字卡
时长: 3.6 秒（108 帧，30fps）
一句话: 黑底一团字符画漩涡，三行超窄超细的高字一行行打出来，被选中后变宽、变粗、变成满版齐行
来源镜头: condensed-lines-poster-card（第 0–108 帧）
样片: demos-own/parts/condensed-tall-lines-reweight/preview.mp4
样片图: demos-own/parts/condensed-tall-lines-reweight/preview-sheet.jpg
---

## 动作
黑底一团字符画漩涡，三行超窄超细的高字一行行打出来，被选中后变宽、变粗、变成满版齐行

## 怎么进来
第一帧开始

## 注意
用到素材库的艺术字体

## 怎么用
- 代码入口：`demos-own/parts/condensed-tall-lines-reweight/CondensedTallLinesReweight.tsx`（只播原镜头的这一段，时长常量 `CONDENSED_TALL_LINES_REWEIGHT_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/condensed-lines-poster-card/CondensedLinesPosterCard.tsx`：先读原镜头的卡 `references/groups-own/condensed-lines-poster-card.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 15 帧（l1，合同）、第 30 帧（l2，合同）、第 48 帧（l3，合同）、第 66 帧（widen，合同）、第 73 帧（样片量的）、第 78 帧（bold，合同）、第 89 帧（样片量的）、第 96 帧（heavy，合同）、第 104 帧（样片量的）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
