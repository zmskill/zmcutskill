---
name: circle-to-button-ask-rings
中文名: 圆缩成按钮 · 输入框打问题 · 点发送起涟漪
用途: 输入
时长: 4.6 秒（138 帧，30fps）
一句话: 蓝圆缩成一个小按钮，旁边撑开输入框逐字打一个问题，点发送，按钮外面一圈圈涟漪，然后蓝圆又长大
来源镜头: circle-train-ask-study（第 72–210 帧）
样片: demos-own/parts/circle-to-button-ask-rings/preview.mp4
样片图: demos-own/parts/circle-to-button-ask-rings/preview-sheet.jpg
---

## 动作
蓝圆缩成一个小按钮，旁边撑开输入框逐字打一个问题，点发送，按钮外面一圈圈涟漪，然后蓝圆又长大

## 怎么进来
接上一段的蓝圆

## 怎么用
- 代码入口：`demos-own/parts/circle-to-button-ask-rings/CircleToButtonAskRings.tsx`（只播原镜头的这一段，时长常量 `CIRCLE_TO_BUTTON_ASK_RINGS_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/circle-train-ask-study/CircleTrainAskStudy.tsx`：先读原镜头的卡 `references/groups-own/circle-train-ask-study.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 8 帧（样片量的）、第 11 帧（样片量的）、第 18 帧（box，合同）、第 34 帧（type，合同）、第 66 帧（click，合同）、第 68 帧（rings，合同）、第 82 帧（样片量的）、第 85 帧（样片量的）、第 98 帧（grow，合同）、第 114 帧（样片量的）、第 120 帧（study，合同）、第 129 帧（样片量的）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
