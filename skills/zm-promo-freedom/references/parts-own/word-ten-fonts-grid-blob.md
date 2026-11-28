---
name: word-ten-fonts-grid-blob
中文名: 同一个词十种字体铺满屏 · 像素团吞掉
用途: 列举
时长: 4.7 秒（141 帧，30fps）
一句话: 同一个词用十种字体一行行铺满整屏、各行横着滑，一行彩色字扫过，最后一团黑色像素从右边吞掉画面
来源镜头: word-stretch-style-grid（第 174–315 帧）
样片: demos-own/parts/word-ten-fonts-grid-blob/preview.mp4
样片图: demos-own/parts/word-ten-fonts-grid-blob/preview-sheet.jpg
---

## 动作
同一个词用十种字体一行行铺满整屏、各行横着滑，一行彩色字扫过，最后一团黑色像素从右边吞掉画面

## 怎么进来
接上一段

## 注意
结尾的像素团可以接下一镜

## 怎么用
- 代码入口：`demos-own/parts/word-ten-fonts-grid-blob/WordTenFontsGridBlob.tsx`（只播原镜头的这一段，时长常量 `WORD_TEN_FONTS_GRID_BLOB_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/word-stretch-style-grid/WordStretchStyleGrid.tsx`：先读原镜头的卡 `references/groups-own/word-stretch-style-grid.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 64 帧（sweep，合同）、第 126 帧（blob，合同）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
