---
name: words-fly-pill-open
中文名: 大字飞来 · 柔边擦掉 · 胶囊撑开一句话
用途: 字卡
时长: 3.6 秒（108 帧，30fps）
一句话: 三块大字先后从中心飞来减速停住，柔边擦除，胶囊从中线撑开、三组字浮起，停住读完，胶囊缩回
来源镜头: prompt-pages-pill-reveal（第 213–321 帧）
样片: demos-own/parts/words-fly-pill-open/preview.mp4
样片图: demos-own/parts/words-fly-pill-open/preview-sheet.jpg
---

## 动作
三块大字先后从中心飞来减速停住，柔边擦除，胶囊从中线撑开、三组字浮起，停住读完，胶囊缩回

## 怎么进来
接上一拍冲进去

## 怎么用
- 代码入口：`demos-own/parts/words-fly-pill-open/WordsFlyPillOpen.tsx`（只播原镜头的这一段，时长常量 `WORDS_FLY_PILL_OPEN_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/opening/prompt-pages-pill-reveal/PromptPagesPillReveal.tsx`：先读原镜头的卡 `references/shots-own/opening/prompt-pages-pill-reveal.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 10 帧（样片量的）、第 28 帧（样片量的）、第 32 帧（wipe，合同）、第 50 帧（pill，合同）、第 65 帧（样片量的）、第 103 帧（star，合同）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
