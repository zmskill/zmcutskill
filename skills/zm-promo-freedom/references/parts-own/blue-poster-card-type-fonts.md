---
name: blue-poster-card-type-fonts
中文名: 蓝色海报卡 · 逐行打字换字体
用途: 字卡
时长: 4.9 秒（147 帧，30fps）
一句话: 推近到一张蓝色海报卡，卡里逐行打字，每行换一种字体和字号，数字特别大
来源镜头: condensed-lines-poster-card（第 108–255 帧）
样片: demos-own/parts/blue-poster-card-type-fonts/preview.mp4
样片图: demos-own/parts/blue-poster-card-type-fonts/preview-sheet.jpg
---

## 动作
推近到一张蓝色海报卡，卡里逐行打字，每行换一种字体和字号，数字特别大

## 怎么进来
推近接上一段

## 注意
用到素材库的艺术字体

## 怎么用
- 代码入口：`demos-own/parts/blue-poster-card-type-fonts/BluePosterCardTypeFonts.tsx`（只播原镜头的这一段，时长常量 `BLUE_POSTER_CARD_TYPE_FONTS_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/condensed-lines-poster-card/CondensedLinesPosterCard.tsx`：先读原镜头的卡 `references/groups-own/condensed-lines-poster-card.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 20 帧（push，合同）、第 27 帧（card，合同）、第 31 帧（样片量的）、第 52 帧（one，合同）、第 60 帧（line，合同）、第 77 帧（样片量的）、第 87 帧（hundred，合同）、第 94 帧（样片量的）、第 102 帧（worlds，合同）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
