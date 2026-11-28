---
name: carousel-settle-logo
中文名: 轮播减速 · Logo 卡停在正中
用途: 品牌落版
时长: 6.0 秒（180 帧，30fps）
一句话: 轮播减速，最后一张 Logo 卡停在正中，停住
来源镜头: curved-carousel-reel（第 1200–1380 帧）
样片: demos-own/parts/carousel-settle-logo/preview.mp4
样片图: demos-own/parts/carousel-settle-logo/preview-sheet.jpg
---

## 动作
轮播减速，最后一张 Logo 卡停在正中，停住

## 怎么进来
接着轮播

## 怎么用
- 代码入口：`demos-own/parts/carousel-settle-logo/CarouselSettleLogo.tsx`（只播原镜头的这一段，时长常量 `CAROUSEL_SETTLE_LOGO_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/transition/curved-carousel-reel/CurvedCarouselReel.tsx`：先读原镜头的卡 `references/shots-own/transition/curved-carousel-reel.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 62 帧（样片量的）、第 74 帧（样片量的）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
