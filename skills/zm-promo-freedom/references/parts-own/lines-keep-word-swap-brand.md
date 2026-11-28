---
name: lines-keep-word-swap-brand
中文名: 三行字只留一个词 · 原位换成产品名
用途: 字卡
时长: 5.3 秒（158 帧，30fps）
一句话: 暗底逐行打出三行字，最后一行带地球图标；其余的字退掉、只留「🌐 关键词」升到正中，在原位一下换成产品标志 + 产品名，再往上让、下面浮出一句话
来源镜头: lines-keep-word-swap-brand（整个镜头）
样片: demos-own/parts/lines-keep-word-swap-brand/preview.mp4
样片图: demos-own/parts/lines-keep-word-swap-brand/preview-sheet.jpg
---

## 动作
暗底逐行打出三行字，最后一行带地球图标；其余的字退掉、只留「🌐 关键词」升到正中，在原位一下换成产品标志 + 产品名，再往上让、下面浮出一句话

## 怎么进来
暗底

## 注意
中段点出产品名

## 怎么用
- 代码入口：`demos-own/parts/lines-keep-word-swap-brand/LinesKeepWordSwapBrand.tsx`（整个镜头，时长常量 `LINES_KEEP_WORD_SWAP_BRAND_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/lines-keep-word-swap-brand/LinesKeepWordSwapBrand.tsx`：先读原镜头的卡 `references/groups-own/lines-keep-word-swap-brand.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 2 帧（type，合同）、第 9 帧（line2，合同）、第 14 帧（样片量的）、第 22 帧（样片量的）、第 26 帧（line3，合同）、第 32 帧（key，合同）、第 37 帧（样片量的）、第 56 帧（strip，合同）、第 60 帧（样片量的）、第 66 帧（rise，合同）、第 78 帧（样片量的）、第 97 帧（swap，合同）、第 104 帧（样片量的）、第 126 帧（tagline，合同）、第 134 帧（样片量的）、第 139 帧（样片量的）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
