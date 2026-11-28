---
name: card-hang-line-unfold
中文名: 动态卡吊在细线上展开
用途: 功能演示
时长: 1.7 秒（50 帧，30fps）
一句话: 白粉底，一张动态卡吊在一根从顶上垂下来的细线上展开
来源镜头: activity-line-chain（第 0–50 帧）
样片: demos-own/parts/card-hang-line-unfold/preview.mp4
样片图: demos-own/parts/card-hang-line-unfold/preview-sheet.jpg
---

## 动作
白粉底，一张动态卡吊在一根从顶上垂下来的细线上展开

## 怎么进来
第一帧开始

## 怎么用
- 代码入口：`demos-own/parts/card-hang-line-unfold/CardHangLineUnfold.tsx`（只播原镜头的这一段，时长常量 `CARD_HANG_LINE_UNFOLD_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/activity-line-chain/ActivityLineChain.tsx`：先读原镜头的卡 `references/groups-own/activity-line-chain.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 12 帧（样片量的）、第 42 帧（样片量的）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
