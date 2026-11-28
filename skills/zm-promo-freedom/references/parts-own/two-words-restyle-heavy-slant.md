---
name: two-words-restyle-heavy-slant
中文名: 连着两个词换字体：变厚重、变倾斜
用途: 功能演示
时长: 4.5 秒（135 帧，30fps）
一句话: 继续打字，两个词先后被选中，一个变厚重、一个变倾斜
来源镜头: rich-text-cursor-styles（第 294–429 帧）
样片: demos-own/parts/two-words-restyle-heavy-slant/preview.mp4
样片图: demos-own/parts/two-words-restyle-heavy-slant/preview-sheet.jpg
---

## 动作
继续打字，两个词先后被选中，一个变厚重、一个变倾斜

## 怎么进来
接上一段

## 怎么用
- 代码入口：`demos-own/parts/two-words-restyle-heavy-slant/TwoWordsRestyleHeavySlant.tsx`（只播原镜头的这一段，时长常量 `TWO_WORDS_RESTYLE_HEAVY_SLANT_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/rich-text-cursor-styles/RichTextCursorStyles.tsx`：先读原镜头的卡 `references/groups-own/rich-text-cursor-styles.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 8 帧（样片量的）、第 54 帧（sel3，合同）、第 66 帧（style3，合同）、第 80 帧（样片量的）、第 117 帧（sel4，合同）、第 126 帧（style4，合同）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
