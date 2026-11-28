---
name: star-intro-name-lockup
中文名: "隆重介绍" · 冲进字缝 · 产品名升起
用途: 品牌落版
时长: 4.7 秒（140 帧，30fps）
一句话: 星纹从胶囊背后长出旋转，"隆重介绍"两帧一字打出，慢推后冲进字缝；产品名三帧一个字从底下升起，硬切到 Logo 落版
来源镜头: prompt-pages-pill-reveal（第 316–456 帧）
样片: demos-own/parts/star-intro-name-lockup/preview.mp4
样片图: demos-own/parts/star-intro-name-lockup/preview-sheet.jpg
---

## 动作
星纹从胶囊背后长出旋转，"隆重介绍"两帧一字打出，慢推后冲进字缝；产品名三帧一个字从底下升起，硬切到 Logo 落版

## 怎么进来
接上一拍缩回的胶囊

## 怎么用
- 代码入口：`demos-own/parts/star-intro-name-lockup/StarIntroNameLockup.tsx`（只播原镜头的这一段，时长常量 `STAR_INTRO_NAME_LOCKUP_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/opening/prompt-pages-pill-reveal/PromptPagesPillReveal.tsx`：先读原镜头的卡 `references/shots-own/opening/prompt-pages-pill-reveal.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 5 帧（intro，合同）、第 41 帧（dive，合同）、第 58 帧（name，合同）、第 76 帧（样片量的）、第 98 帧（cut，合同）、第 103 帧（样片量的）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
