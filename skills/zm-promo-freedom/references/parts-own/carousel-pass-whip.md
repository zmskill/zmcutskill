---
name: carousel-pass-whip
中文名: 弯曲轮播匀速滑 · 甩一下
用途: 列举
时长: 6.0 秒（180 帧，30fps）
一句话: 一排卡贴在圆筒内壁上从右往左滑，中间平、两边拉高拖虚带色散，中途"甩一下"加速
来源镜头: curved-carousel-reel（第 300–480 帧）
样片: demos-own/parts/carousel-pass-whip/preview.mp4
样片图: demos-own/parts/carousel-pass-whip/preview-sheet.jpg
---

## 动作
一排卡贴在圆筒内壁上从右往左滑，中间平、两边拉高拖虚带色散，中途"甩一下"加速

## 怎么进来
已经在滑

## 注意
外框类：卡里放什么自己定，卡数减到 4–6 张；卡里的内容要在卡经过正中时演到高潮

## 怎么用
- 代码入口：`demos-own/parts/carousel-pass-whip/CarouselPassWhip.tsx`（只播原镜头的这一段，时长常量 `CAROUSEL_PASS_WHIP_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/transition/curved-carousel-reel/CurvedCarouselReel.tsx`：先读原镜头的卡 `references/shots-own/transition/curved-carousel-reel.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 109 帧（样片量的）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
