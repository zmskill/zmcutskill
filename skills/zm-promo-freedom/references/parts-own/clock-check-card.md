---
name: clock-check-card
中文名: 照片缩成时钟 · 一晃变对勾 · 卡片甩走
用途: 点击确认
时长: 2.4 秒（72 帧，30fps）
一句话: 鼓起的照片缩成一个圆，圆原地变成行程卡片里的时钟；镜头贴着它斜着、转着往后拉，露出整张卡片；时钟一晃变成绿对勾，卡片带动态模糊往上甩走
来源镜头: clock-check-card（整个镜头）
样片: demos-own/parts/clock-check-card/preview.mp4
样片图: demos-own/parts/clock-check-card/preview-sheet.jpg
---

## 动作
鼓起的照片缩成一个圆，圆原地变成行程卡片里的时钟；镜头贴着它斜着、转着往后拉，露出整张卡片；时钟一晃变成绿对勾，卡片带动态模糊往上甩走

## 怎么进来
接一张鼓起的照片

## 怎么用
- 代码入口：`demos-own/parts/clock-check-card/ClockCheckCard.tsx`（整个镜头，时长常量 `CLOCK_CHECK_CARD_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/clock-check-card/ClockCheckCard.tsx`：先读原镜头的卡 `references/groups-own/clock-check-card.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 5 帧（样片量的）、第 9 帧（clock，合同）、第 37 帧（tint，合同）、第 43 帧（check，合同）、第 48 帧（settle，合同）、第 66 帧（scroll，合同）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
