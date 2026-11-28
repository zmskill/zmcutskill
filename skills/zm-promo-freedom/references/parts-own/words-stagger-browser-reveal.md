---
name: words-stagger-browser-reveal
中文名: 三个带图标的词错落滑进 · 浏览器显出来
用途: 结果登场
时长: 3.0 秒（90 帧，30fps）
一句话: "横跨"加三个带图标的词错落滑进，淡出后浏览器界面显出
来源镜头: intro-genie-wordmark-browser（第 152–242 帧）
样片: demos-own/parts/words-stagger-browser-reveal/preview.mp4
样片图: demos-own/parts/words-stagger-browser-reveal/preview-sheet.jpg
---

## 动作
"横跨"加三个带图标的词错落滑进，淡出后浏览器界面显出

## 怎么进来
接上一拍的白底

## 怎么用
- 代码入口：`demos-own/parts/words-stagger-browser-reveal/WordsStaggerBrowserReveal.tsx`（只播原镜头的这一段，时长常量 `WORDS_STAGGER_BROWSER_REVEAL_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/intro-genie-wordmark-browser/IntroGenieWordmarkBrowser.tsx`：先读原镜头的卡 `references/groups-own/intro-genie-wordmark-browser.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 2 帧（fade，合同）、第 8 帧（across，合同）、第 31 帧（items，合同）、第 41 帧（样片量的）、第 46 帧（样片量的）、第 68 帧（ui，合同）、第 80 帧（样片量的）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
