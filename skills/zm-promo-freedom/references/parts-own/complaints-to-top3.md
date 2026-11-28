---
name: complaints-to-top3
中文名: 挑中的展开 · 收成"最痛的 3 条"
用途: 痛点
时长: 5.8 秒（174 帧，30fps）
一句话: 没挑中的退成虚影，挑中的三条展开成证据卡，再缩成小条落进清单、扫光填字
来源镜头: complaint-wall-pick（第 158–332 帧）
样片: demos-own/parts/complaints-to-top3/preview.mp4
样片图: demos-own/parts/complaints-to-top3/preview-sheet.jpg
---

## 动作
没挑中的退成虚影，挑中的三条展开成证据卡，再缩成小条落进清单、扫光填字

## 怎么进来
接上一拍的墙

## 注意
5.8 秒，较长

## 怎么用
- 代码入口：`demos-own/parts/complaints-to-top3/ComplaintsToTop3.tsx`（只播原镜头的这一段，时长常量 `COMPLAINTS_TO_TOP3_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/ui-entrance/complaint-wall-pick/ComplaintWallPick.tsx`：先读原镜头的卡 `references/shots-own/ui-entrance/complaint-wall-pick.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 4 帧（样片量的）、第 33 帧（样片量的）、第 45 帧（样片量的）、第 57 帧（样片量的）、第 94 帧（样片量的）、第 120 帧（样片量的）、第 127 帧（样片量的）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
