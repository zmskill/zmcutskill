---
name: pages-pop-fan-out
中文名: 页面从一个点弹出 · 散成四页
用途: 结果登场
时长: 3.2 秒（97 帧，30fps）
一句话: 首页从输入框的中心弹出，慢推；三张页面从身后抽出散开，静漂，再冲进去
来源镜头: prompt-pages-pill-reveal（第 125–222 帧）
样片: demos-own/parts/pages-pop-fan-out/preview.mp4
样片图: demos-own/parts/pages-pop-fan-out/preview-sheet.jpg
---

## 动作
首页从输入框的中心弹出，慢推；三张页面从身后抽出散开，静漂，再冲进去

## 怎么进来
接上一拍吸进去的点

## 怎么用
- 代码入口：`demos-own/parts/pages-pop-fan-out/PagesPopFanOut.tsx`（只播原镜头的这一段，时长常量 `PAGES_POP_FAN_OUT_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/opening/prompt-pages-pill-reveal/PromptPagesPillReveal.tsx`：先读原镜头的卡 `references/shots-own/opening/prompt-pages-pill-reveal.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 44 帧（spread，合同）、第 68 帧（样片量的）、第 85 帧（rush，合同）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
