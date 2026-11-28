---
name: swirl-turn-dot-flood
中文名: 漩涡卷走 · 转折句 · 蓝点吞满屏
用途: 转场
时长: 1.7 秒（52 帧，30fps）
一句话: 漩涡把小卡卷进中心、标题缩没，品牌色转折句斜着逐词浮出停一下；句心长出同色圆点，指数长大吞满屏
来源镜头: pain-swirl-dot-logo（第 115–167 帧）
样片: demos-own/parts/swirl-turn-dot-flood/preview.mp4
样片图: demos-own/parts/swirl-turn-dot-flood/preview-sheet.jpg
---

## 动作
漩涡把小卡卷进中心、标题缩没，品牌色转折句斜着逐词浮出停一下；句心长出同色圆点，指数长大吞满屏

## 怎么进来
接上一拍的痛点句

## 注意
纯色那两帧里硬切下一镜

## 怎么用
- 代码入口：`demos-own/parts/swirl-turn-dot-flood/SwirlTurnDotFlood.tsx`（只播原镜头的这一段，时长常量 `SWIRL_TURN_DOT_FLOOD_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/opening/pain-swirl-dot-logo/PainSwirlDotLogo.tsx`：先读原镜头的卡 `references/shots-own/opening/pain-swirl-dot-logo.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 1 帧（swirl，合同）、第 13 帧（turn，合同）、第 37 帧（dot，合同）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
