---
name: carousel-type-slots
中文名: 贴脸页面拉远成轮播 · 大字蹦进文字框
用途: 字卡
时长: 4.6 秒（137 帧，30fps）
一句话: 贴脸的斜放任务页猛地拉远摆正，变成横向轮播里的一张卡；轮播一下下往左甩，文字框里大字逐个蹦出"一眼看清 / 全家的"，再甩到第二框"大事 / 小事"
来源镜头: carousel-type-slots（整个镜头）
样片: demos-own/parts/carousel-type-slots/preview.mp4
样片图: demos-own/parts/carousel-type-slots/preview-sheet.jpg
---

## 动作
贴脸的斜放任务页猛地拉远摆正，变成横向轮播里的一张卡；轮播一下下往左甩，文字框里大字逐个蹦出"一眼看清 / 全家的"，再甩到第二框"大事 / 小事"

## 怎么进来
贴脸的页面

## 注意
结尾甩出去接 Logo

## 怎么用
- 代码入口：`demos-own/parts/carousel-type-slots/CarouselTypeSlots.tsx`（整个镜头，时长常量 `CAROUSEL_TYPE_SLOTS_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/carousel-type-slots/CarouselTypeSlots.tsx`：先读原镜头的卡 `references/groups-own/carousel-type-slots.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 14 帧（样片量的）、第 27 帧（swing1，合同）、第 45 帧（swing2，合同）、第 53 帧（word1，合同）、第 64 帧（small1，合同）、第 86 帧（swing3，合同）、第 100 帧（small2，合同）、第 111 帧（word2，合同）、第 129 帧（out，合同）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
