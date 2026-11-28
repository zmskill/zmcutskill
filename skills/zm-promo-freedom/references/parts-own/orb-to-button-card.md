---
name: orb-to-button-card
中文名: 光球变按钮再变卡片
用途: 结果登场
时长: 2.0 秒（59 帧，30fps）
一句话: 玻璃球从底部升起，投影光晕、冲击光环，变成圆角方块再变按钮，冷却成卡片、长出输入框打字
来源镜头: orb-relay-explainer（第 558–617 帧）
样片: demos-own/parts/orb-to-button-card/preview.mp4
样片图: demos-own/parts/orb-to-button-card/preview-sheet.jpg
---

## 动作
玻璃球从底部升起，投影光晕、冲击光环，变成圆角方块再变按钮，冷却成卡片、长出输入框打字

## 怎么进来
接在全黑帧后

## 怎么用
- 代码入口：`demos-own/parts/orb-to-button-card/OrbToButtonCard.tsx`（只播原镜头的这一段，时长常量 `ORB_TO_BUTTON_CARD_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/opening/orb-relay-explainer/OrbRelayExplainer.tsx`：先读原镜头的卡 `references/shots-own/opening/orb-relay-explainer.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 8 帧（样片量的）、第 26 帧（样片量的）、第 31 帧（样片量的）、第 42 帧（样片量的）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
