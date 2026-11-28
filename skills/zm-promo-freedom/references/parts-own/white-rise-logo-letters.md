---
name: white-rise-logo-letters
中文名: 从下往上淡成白 · Logo 逐字出
用途: 品牌落版
时长: 3.7 秒（110 帧，30fps）
一句话: 低角度慢漂的画面从下往上淡成白，同时 Logo 图形和名字逐字出，标语和底部小字跟上
来源镜头: tilted-dashboard-pan-logo（第 90–200 帧）
样片: demos-own/parts/white-rise-logo-letters/preview.mp4
样片图: demos-own/parts/white-rise-logo-letters/preview-sheet.jpg
---

## 动作
低角度慢漂的画面从下往上淡成白，同时 Logo 图形和名字逐字出，标语和底部小字跟上

## 怎么进来
接着慢漂

## 怎么用
- 代码入口：`demos-own/parts/white-rise-logo-letters/WhiteRiseLogoLetters.tsx`（只播原镜头的这一段，时长常量 `WHITE_RISE_LOGO_LETTERS_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/camera/tilted-dashboard-pan-logo/TiltedDashboardPanLogo.tsx`：先读原镜头的卡 `references/shots-own/camera/tilted-dashboard-pan-logo.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 16 帧（样片量的）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
