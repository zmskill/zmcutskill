---
name: words-morph-line
中文名: 同一句话里换几个字 · 整行飘走
用途: 字卡
时长: 2.5 秒（76 帧，30fps）
一句话: 一句话补上最后一个词滑到正中，前后的词逐字溶掉换成新词，中间不变的词变大挪位，补一个字后整行加速往上飘走
来源镜头: words-morph-line（整个镜头）
样片: demos-own/parts/words-morph-line/preview.mp4
样片图: demos-own/parts/words-morph-line/preview-sheet.jpg
---

## 动作
一句话补上最后一个词滑到正中，前后的词逐字溶掉换成新词，中间不变的词变大挪位，补一个字后整行加速往上飘走

## 怎么进来
第一帧开始

## 注意
"从乱到清楚"的转折

## 怎么用
- 代码入口：`demos-own/parts/words-morph-line/WordsMorphLine.tsx`（整个镜头，时长常量 `WORDS_MORPH_LINE_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/words-morph-line/WordsMorphLine.tsx`：先读原镜头的卡 `references/groups-own/words-morph-line.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 8 帧（tail，合同）、第 21 帧（样片量的）、第 30 帧（morph，合同）、第 35 帧（line2，合同）、第 43 帧（样片量的）、第 54 帧（extra，合同）、第 58 帧（样片量的）、第 63 帧（rise，合同）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
