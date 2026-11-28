---
name: icons-absorbed-logo-name
中文名: 一排图标被吸进去 · 缩成标志 · 产品名
用途: 品牌落版
时长: 3.3 秒（98 帧，30fps）
一句话: 钥匙换成小火花，App 图标出现，右边一排图标往左走、一个个被吸进去；App 图标缩成标志，打出产品名和一句定位
来源镜头: subscription-icons-absorb-url（第 56–154 帧）
样片: demos-own/parts/icons-absorbed-logo-name/preview.mp4
样片图: demos-own/parts/icons-absorbed-logo-name/preview-sheet.jpg
---

## 动作
钥匙换成小火花，App 图标出现，右边一排图标往左走、一个个被吸进去；App 图标缩成标志，打出产品名和一句定位

## 怎么进来
接上一拍的钥匙

## 怎么用
- 代码入口：`demos-own/parts/icons-absorbed-logo-name/IconsAbsorbedLogoName.tsx`（只播原镜头的这一段，时长常量 `ICONS_ABSORBED_LOGO_NAME_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/subscription-icons-absorb-url/SubscriptionIconsAbsorbUrl.tsx`：先读原镜头的卡 `references/groups-own/subscription-icons-absorb-url.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 7 帧（spark，合同）、第 18 帧（app，合同）、第 23 帧（样片量的）、第 31 帧（absorb，合同）、第 49 帧（样片量的）、第 56 帧（logo，合同）、第 68 帧（name，合同）、第 72 帧（样片量的）、第 86 帧（line2，合同）、第 91 帧（样片量的）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
