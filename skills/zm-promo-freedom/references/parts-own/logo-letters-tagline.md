---
name: logo-letters-tagline
中文名: Logo 一帧一字长出 · 标语
用途: 品牌落版
时长: 2.7 秒（80 帧，30fps）
一句话: 失焦硬切后 Logo 一帧一个字从左往右虚着长出，黑边撤掉、Logo 上移，标语逐词阶梯浮出，胶囊按钮先字后底，停住
来源镜头: prompt-to-site-wall（第 355–435 帧）
样片: demos-own/parts/logo-letters-tagline/preview.mp4
样片图: demos-own/parts/logo-letters-tagline/preview-sheet.jpg
---

## 动作
失焦硬切后 Logo 一帧一个字从左往右虚着长出，黑边撤掉、Logo 上移，标语逐词阶梯浮出，胶囊按钮先字后底，停住

## 怎么进来
失焦爬坡硬切

## 注意
后面还有 2.7 秒的收场（435–515 帧：一层层收掉、Logo 落到中心）

## 怎么用
- 代码入口：`demos-own/parts/logo-letters-tagline/LogoLettersTagline.tsx`（只播原镜头的这一段，时长常量 `LOGO_LETTERS_TAGLINE_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/ui-entrance/prompt-to-site-wall/PromptToSiteWall.tsx`：先读原镜头的卡 `references/shots-own/ui-entrance/prompt-to-site-wall.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 6 帧（样片量的）、第 29 帧（样片量的）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
