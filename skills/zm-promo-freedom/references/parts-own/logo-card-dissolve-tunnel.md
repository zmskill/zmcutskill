---
name: logo-card-dissolve-tunnel
中文名: Logo 卡转正溶掉 · 色块擦出标语 · 卡片飞进隧道
用途: 钩子
时长: 4.0 秒（120 帧，30fps）
一句话: 带厚边的 Logo 卡转正缩小后溶掉，渐变色块从左往右把品牌名擦掉、把标语擦出来；热成像色卡片从画外飞上方形隧道四壁、逐张褪回原色
来源镜头: card-tunnel-tagline（第 0–120 帧）
样片: demos-own/parts/logo-card-dissolve-tunnel/preview.mp4
样片图: demos-own/parts/logo-card-dissolve-tunnel/preview-sheet.jpg
---

## 动作
带厚边的 Logo 卡转正缩小后溶掉，渐变色块从左往右把品牌名擦掉、把标语擦出来；热成像色卡片从画外飞上方形隧道四壁、逐张褪回原色

## 怎么进来
第一帧开始

## 注意
后面 120–207 帧是隧道匀速后退，可以当背景接着用

## 怎么用
- 代码入口：`demos-own/parts/logo-card-dissolve-tunnel/LogoCardDissolveTunnel.tsx`（只播原镜头的这一段，时长常量 `LOGO_CARD_DISSOLVE_TUNNEL_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/opening/card-tunnel-tagline/CardTunnelTagline.tsx`：先读原镜头的卡 `references/shots-own/opening/card-tunnel-tagline.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 49 帧（样片量的）、第 61 帧（样片量的）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
