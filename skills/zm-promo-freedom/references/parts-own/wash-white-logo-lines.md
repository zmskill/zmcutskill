---
name: wash-white-logo-lines
中文名: 整屏洗白 · 标志和四行定位由灰变黑
用途: 字卡
时长: 2.3 秒（68 帧，30fps）
一句话: 整屏洗白，白底上标志和四行字由灰变黑，背后一条蓝线沿窗口边描出来
来源镜头: intro-genie-wordmark-browser（第 84–152 帧）
样片: demos-own/parts/wash-white-logo-lines/preview.mp4
样片图: demos-own/parts/wash-white-logo-lines/preview-sheet.jpg
---

## 动作
整屏洗白，白底上标志和四行字由灰变黑，背后一条蓝线沿窗口边描出来

## 怎么进来
接上一拍的满屏

## 怎么用
- 代码入口：`demos-own/parts/wash-white-logo-lines/WashWhiteLogoLines.tsx`（只播原镜头的这一段，时长常量 `WASH_WHITE_LOGO_LINES_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/intro-genie-wordmark-browser/IntroGenieWordmarkBrowser.tsx`：先读原镜头的卡 `references/groups-own/intro-genie-wordmark-browser.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 4 帧（wash，合同）、第 14 帧（样片量的）、第 18 帧（logo，合同）、第 33 帧（line，合同）、第 63 帧（样片量的）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
