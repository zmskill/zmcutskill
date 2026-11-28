---
name: sky-logo-grow-name
中文名: 天空里长出 Logo · 名字抽出 · 标语
用途: 品牌落版
时长: 3.6 秒（109 帧，30fps）
一句话: 硬切深蓝天空，Logo 方块从小点边转边长出、三圈白线外扩；Logo 往左甩，名字从后面逐字抽出，标语逐词浮现，停住
来源镜头: pain-swirl-dot-logo（第 167–276 帧）
样片: demos-own/parts/sky-logo-grow-name/preview.mp4
样片图: demos-own/parts/sky-logo-grow-name/preview-sheet.jpg
---

## 动作
硬切深蓝天空，Logo 方块从小点边转边长出、三圈白线外扩；Logo 往左甩，名字从后面逐字抽出，标语逐词浮现，停住

## 怎么进来
纯色满屏后硬切

## 怎么用
- 代码入口：`demos-own/parts/sky-logo-grow-name/SkyLogoGrowName.tsx`（只播原镜头的这一段，时长常量 `SKY_LOGO_GROW_NAME_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/opening/pain-swirl-dot-logo/PainSwirlDotLogo.tsx`：先读原镜头的卡 `references/shots-own/opening/pain-swirl-dot-logo.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 3 帧（logo，合同）、第 38 帧（name，合同）、第 44 帧（样片量的）、第 51 帧（tagline，合同）、第 100 帧（flash，合同）、第 105 帧（样片量的）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
