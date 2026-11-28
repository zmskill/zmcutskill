---
name: dive-spin-icon-wordmark
中文名: 扑向圆圈越转越快 · 变成图标 · 擦出品牌字
用途: 品牌落版
时长: 4.4 秒（131 帧，30fps）
一句话: 字淡掉，镜头扑向那个圈、越转越快，线缩回蓝团，蓝团变成 App 图标；图标往左让位，右边擦出品牌字，定格
来源镜头: route-hub-logo（第 66–197 帧）
样片: demos-own/parts/dive-spin-icon-wordmark/preview.mp4
样片图: demos-own/parts/dive-spin-icon-wordmark/preview-sheet.jpg
---

## 动作
字淡掉，镜头扑向那个圈、越转越快，线缩回蓝团，蓝团变成 App 图标；图标往左让位，右边擦出品牌字，定格

## 怎么进来
接上一拍的圈

## 怎么用
- 代码入口：`demos-own/parts/dive-spin-icon-wordmark/DiveSpinIconWordmark.tsx`（只播原镜头的这一段，时长常量 `DIVE_SPIN_ICON_WORDMARK_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/route-hub-logo/RouteHubLogo.tsx`：先读原镜头的卡 `references/groups-own/route-hub-logo.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 3 帧（dive，合同）、第 21 帧（spin，合同）、第 30 帧（merge，合同）、第 36 帧（样片量的）、第 42 帧（icon，合同）、第 58 帧（word，合同）、第 73 帧（样片量的）、第 81 帧（settle，合同）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
