---
name: photo-cards-arc-stair
中文名: 照片卡沿弧线一张张排成台阶
用途: 列举
时长: 4.9 秒（147 帧，30fps）
一句话: 字往右让开，照片卡从左下角开始沿一道弧线一张张排上去，像台阶，每排一张下面换一个名字
来源镜头: dot-arc-card-stair（第 60–207 帧）
样片: demos-own/parts/photo-cards-arc-stair/preview.mp4
样片图: demos-own/parts/photo-cards-arc-stair/preview-sheet.jpg
---

## 动作
字往右让开，照片卡从左下角开始沿一道弧线一张张排上去，像台阶，每排一张下面换一个名字

## 怎么进来
接上一段的那句话

## 注意
六张，一拍一张

## 怎么用
- 代码入口：`demos-own/parts/photo-cards-arc-stair/PhotoCardsArcStair.tsx`（只播原镜头的这一段，时长常量 `PHOTO_CARDS_ARC_STAIR_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/dot-arc-card-stair/DotArcCardStair.tsx`：先读原镜头的卡 `references/groups-own/dot-arc-card-stair.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 6 帧（slide，合同）、第 18 帧（s1，合同）、第 42 帧（s2，合同）、第 66 帧（s3，合同）、第 90 帧（s4，合同）、第 114 帧（s5，合同）、第 138 帧（s6，合同）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
