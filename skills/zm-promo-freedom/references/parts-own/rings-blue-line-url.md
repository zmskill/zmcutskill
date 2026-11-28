---
name: rings-blue-line-url
中文名: 收成同心圆 · 蓝色一句话逐词出
用途: 字卡
时长: 2.9 秒（87 帧，30fps）
一句话: 椭圆收成一圈圈同心圆，同心圆淡掉，一句蓝色的话逐词出来，下面一行网址
来源镜头: giant-word-lens-ear-logo（第 90–177 帧）
样片: demos-own/parts/rings-blue-line-url/preview.mp4
样片图: demos-own/parts/rings-blue-line-url/preview-sheet.jpg
---

## 动作
椭圆收成一圈圈同心圆，同心圆淡掉，一句蓝色的话逐词出来，下面一行网址

## 怎么进来
接上一段的圆

## 怎么用
- 代码入口：`demos-own/parts/rings-blue-line-url/RingsBlueLineUrl.tsx`（只播原镜头的这一段，时长常量 `RINGS_BLUE_LINE_URL_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/giant-word-lens-ear-logo/GiantWordLensEarLogo.tsx`：先读原镜头的卡 `references/groups-own/giant-word-lens-ear-logo.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 3 帧（rings，合同）、第 9 帧（样片量的）、第 27 帧（blue，合同）、第 57 帧（url，合同）、第 79 帧（样片量的）、第 82 帧（样片量的）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
