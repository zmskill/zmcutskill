---
name: bead-ring-picker
中文名: 串珠成环 · 光标挨个悬停选一个
用途: 功能演示
时长: 5.5 秒（166 帧，30fps）
一句话: 小球冒出串成一圈珠子，3D 光标翻转着挨个悬停，选中一个，环先撑大再吸回卡片
来源镜头: orb-relay-explainer（第 617–783 帧）
样片: demos-own/parts/bead-ring-picker/preview.mp4
样片图: demos-own/parts/bead-ring-picker/preview-sheet.jpg
---

## 动作
小球冒出串成一圈珠子，3D 光标翻转着挨个悬停，选中一个，环先撑大再吸回卡片

## 怎么进来
接上一拍的卡片

## 注意
5.5 秒，较长；适合"选一个风格 / 语气"

## 怎么用
- 代码入口：`demos-own/parts/bead-ring-picker/BeadRingPicker.tsx`（只播原镜头的这一段，时长常量 `BEAD_RING_PICKER_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/opening/orb-relay-explainer/OrbRelayExplainer.tsx`：先读原镜头的卡 `references/shots-own/opening/orb-relay-explainer.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 39 帧（样片量的）、第 51 帧（样片量的）、第 56 帧（样片量的）、第 92 帧（样片量的）、第 116 帧（样片量的）、第 151 帧（样片量的）、第 163 帧（样片量的）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
