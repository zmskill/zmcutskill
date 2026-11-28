---
name: orb-toggle-pop
中文名: 句中开关 · 句尾光球弹出
用途: 钩子
时长: 2.7 秒（81 帧，30fps）
一句话: 一句话中间嵌一个开关，句尾弹出一颗光球（过冲再回落），3D 光标过来点亮开关
来源镜头: orb-relay-explainer（第 0–81 帧）
样片: demos-own/parts/orb-toggle-pop/preview.mp4
样片图: demos-own/parts/orb-toggle-pop/preview-sheet.jpg
---

## 动作
一句话中间嵌一个开关，句尾弹出一颗光球（过冲再回落），3D 光标过来点亮开关

## 怎么进来
第一帧开始

## 怎么用
- 代码入口：`demos-own/parts/orb-toggle-pop/OrbTogglePop.tsx`（只播原镜头的这一段，时长常量 `ORB_TOGGLE_POP_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/opening/orb-relay-explainer/OrbRelayExplainer.tsx`：先读原镜头的卡 `references/shots-own/opening/orb-relay-explainer.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：没量到：从原镜头代码里定。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
