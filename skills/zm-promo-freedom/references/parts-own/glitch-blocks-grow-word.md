---
name: glitch-blocks-grow-word
中文名: 卡片一张张消失 · 白块长成一个大字
用途: 字卡
时长: 3.0 秒（89 帧，30fps）
一句话: 卡片一张张一帧消失、故障色块乱跳，背景变纯黑；几块白块原地停住长成笔画，拼出一个大字，整词推近
来源镜头: card-rain-pixel-word（第 94–183 帧）
样片: demos-own/parts/glitch-blocks-grow-word/preview.mp4
样片图: demos-own/parts/glitch-blocks-grow-word/preview-sheet.jpg
---

## 动作
卡片一张张一帧消失、故障色块乱跳，背景变纯黑；几块白块原地停住长成笔画，拼出一个大字，整词推近

## 怎么进来
接上一拍堆满的卡片

## 怎么用
- 代码入口：`demos-own/parts/glitch-blocks-grow-word/GlitchBlocksGrowWord.tsx`（只播原镜头的这一段，时长常量 `GLITCH_BLOCKS_GROW_WORD_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/card-rain-pixel-word/CardRainPixelWord.tsx`：先读原镜头的卡 `references/groups-own/card-rain-pixel-word.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 7 帧（black，合同）、第 15 帧（wave2，合同）、第 23 帧（stroke1，合同）、第 27 帧（样片量的）、第 51 帧（last，合同）、第 57 帧（clean，合同）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
