---
name: pills-slide-words-light
中文名: 两颗胶囊滑进来 · 字逐个亮
用途: 字卡
时长: 1.4 秒（42 帧，30fps）
一句话: 黑胶囊从右边高速滑进来、长尾巴减速，字一个个从灰变白；渐变胶囊跟进来，字从浅变黑；两颗停住
来源镜头: pill-pair-logo-scatter（第 0–42 帧）
样片: demos-own/parts/pills-slide-words-light/preview.mp4
样片图: demos-own/parts/pills-slide-words-light/preview-sheet.jpg
---

## 动作
黑胶囊从右边高速滑进来、长尾巴减速，字一个个从灰变白；渐变胶囊跟进来，字从浅变黑；两颗停住

## 怎么进来
浅灰底

## 注意
两个词的口号

## 怎么用
- 代码入口：`demos-own/parts/pills-slide-words-light/PillsSlideWordsLight.tsx`（只播原镜头的这一段，时长常量 `PILLS_SLIDE_WORDS_LIGHT_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/pill-pair-logo-scatter/PillPairLogoScatter.tsx`：先读原镜头的卡 `references/groups-own/pill-pair-logo-scatter.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 2 帧（pill1，合同）、第 8 帧（word1，合同）、第 13 帧（pill2，合同）、第 19 帧（word2，合同）、第 27 帧（样片量的）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
