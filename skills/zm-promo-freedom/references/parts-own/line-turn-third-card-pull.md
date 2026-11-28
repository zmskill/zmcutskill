---
name: line-turn-third-card-pull
中文名: 线拐上去接第三张卡 · 拉远擦掉
用途: 列举
时长: 3.4 秒（102 帧，30fps）
一句话: 镜头往右，线拐上去接到第三张卡，卡上出标记，最后拉远、整屏擦掉
来源镜头: activity-line-chain（第 123–225 帧）
样片: demos-own/parts/line-turn-third-card-pull/preview.mp4
样片图: demos-own/parts/line-turn-third-card-pull/preview-sheet.jpg
---

## 动作
镜头往右，线拐上去接到第三张卡，卡上出标记，最后拉远、整屏擦掉

## 怎么进来
接上一张卡

## 注意
结尾是整屏擦除，可以直接接下一镜

## 怎么用
- 代码入口：`demos-own/parts/line-turn-third-card-pull/LineTurnThirdCardPull.tsx`（只播原镜头的这一段，时长常量 `LINE_TURN_THIRD_CARD_PULL_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/activity-line-chain/ActivityLineChain.tsx`：先读原镜头的卡 `references/groups-own/activity-line-chain.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 9 帧（card3，合同）、第 16 帧（样片量的）、第 33 帧（loved，合同）、第 72 帧（pull，合同）、第 81 帧（样片量的）、第 95 帧（wipe，合同）、第 99 帧（样片量的）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
