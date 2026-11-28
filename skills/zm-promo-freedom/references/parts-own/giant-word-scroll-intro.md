---
name: giant-word-scroll-intro
中文名: 超宽大字甩进来刹住 · 再甩走
用途: 钩子
时长: 3.2 秒（96 帧，30fps）
一句话: 黑底暗红光斑，一行比屏幕还宽的超大白字从右边甩进来、刹住慢慢漂、再甩出去 →
来源镜头: giant-word-scroll-intro（整个镜头）
样片: demos-own/parts/giant-word-scroll-intro/preview.mp4
样片图: demos-own/parts/giant-word-scroll-intro/preview-sheet.jpg
---

## 动作
黑底暗红光斑，一行比屏幕还宽的超大白字从右边甩进来、刹住慢慢漂、再甩出去 →

## 怎么进来
第一帧就在动

## 怎么用
- 代码入口：`demos-own/parts/giant-word-scroll-intro/GiantWordScrollIntro.tsx`（整个镜头，时长常量 `GIANT_WORD_SCROLL_INTRO_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/giant-word-scroll-intro/GiantWordScrollIntro.tsx`：先读原镜头的卡 `references/groups-own/giant-word-scroll-intro.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 15 帧（whip1，合同）、第 39 帧（drift1，合同）、第 58 帧（whip2，合同）、第 60 帧（name，合同）、第 76 帧（drift2，合同）、第 90 帧（out，合同）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
