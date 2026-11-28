---
name: big-lines-slam-exit
中文名: 两行大字缩小落定 · 猛推出画
用途: 字卡
时长: 1.7 秒（50 帧，30fps）
一句话: 两行大字从 1.4 倍带长尾巴缩小落定，停住，再 2–3 帧猛推出画
来源镜头: orb-relay-explainer（第 783–833 帧）
样片: demos-own/parts/big-lines-slam-exit/preview.mp4
样片图: demos-own/parts/big-lines-slam-exit/preview-sheet.jpg
---

## 动作
两行大字从 1.4 倍带长尾巴缩小落定，停住，再 2–3 帧猛推出画

## 怎么进来
硬切

## 注意
出画那一下可以直接接下一镜

## 怎么用
- 代码入口：`demos-own/parts/big-lines-slam-exit/BigLinesSlamExit.tsx`（只播原镜头的这一段，时长常量 `BIG_LINES_SLAM_EXIT_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/opening/orb-relay-explainer/OrbRelayExplainer.tsx`：先读原镜头的卡 `references/shots-own/opening/orb-relay-explainer.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 5 帧（样片量的）、第 11 帧（样片量的）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
