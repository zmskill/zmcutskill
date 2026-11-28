---
name: words-in-dot-rings-frames
中文名: 一个词换一种外框：点阵环、虚线圆
用途: 字卡
时长: 3.3 秒（98 帧，30fps）
一句话: 黑底一句话拆成几个词一个个出，每个词换一种外框：小字、两三圈彩色点阵环绕着转往里收、虚线圆加细方框
来源镜头: word-frames-limits（第 0–98 帧）
样片: demos-own/parts/words-in-dot-rings-frames/preview.mp4
样片图: demos-own/parts/words-in-dot-rings-frames/preview-sheet.jpg
---

## 动作
黑底一句话拆成几个词一个个出，每个词换一种外框：小字、两三圈彩色点阵环绕着转往里收、虚线圆加细方框

## 怎么进来
第一帧开始

## 怎么用
- 代码入口：`demos-own/parts/words-in-dot-rings-frames/WordsInDotRingsFrames.tsx`（只播原镜头的这一段，时长常量 `WORDS_IN_DOT_RINGS_FRAMES_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/word-frames-limits/WordFramesLimits.tsx`：先读原镜头的卡 `references/groups-own/word-frames-limits.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 3 帧（w1，合同）、第 27 帧（w2，合同）、第 68 帧（w3，合同）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
