---
name: words-split-lock-replace
中文名: 词拉开插进一把锁 · 原位换词
用途: 字卡
时长: 4.1 秒（123 帧，30fps）
一句话: 白底打出一句话，词与词拉开、第一个词消失、中间插进一把锁；「锁 + 词」斜着往上让，下面浮出新一行；再在原位把词一个个换掉，浮出最后一行
来源镜头: words-split-lock-replace（整个镜头）
样片: demos-own/parts/words-split-lock-replace/preview.mp4
样片图: demos-own/parts/words-split-lock-replace/preview-sheet.jpg
---

## 动作
白底打出一句话，词与词拉开、第一个词消失、中间插进一把锁；「锁 + 词」斜着往上让，下面浮出新一行；再在原位把词一个个换掉，浮出最后一行

## 怎么进来
白底

## 注意
隐私 / 安全

## 怎么用
- 代码入口：`demos-own/parts/words-split-lock-replace/WordsSplitLockReplace.tsx`（整个镜头，时长常量 `WORDS_SPLIT_LOCK_REPLACE_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/words-split-lock-replace/WordsSplitLockReplace.tsx`：先读原镜头的卡 `references/groups-own/words-split-lock-replace.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 1 帧（type1，合同）、第 23 帧（type2，合同）、第 46 帧（split，合同）、第 58 帧（lock，合同）、第 64 帧（rise，合同）、第 78 帧（under，合同）、第 83 帧（样片量的）、第 88 帧（样片量的）、第 97 帧（swap，合同）、第 110 帧（device，合同）、第 116 帧（样片量的）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
