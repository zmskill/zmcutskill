---
name: phone-rush-toss
中文名: 手机冲到镜头前 · 抛起落下
用途: 钩子
时长: 1.0 秒（30 帧，30fps）
一句话: 斜着的小手机 3 帧内冲到镜头前转正，取景框收紧套住它，到最高点后越落越快掉出画面
来源镜头: card-rain-pixel-word（第 0–30 帧）
样片: demos-own/parts/phone-rush-toss/preview.mp4
样片图: demos-own/parts/phone-rush-toss/preview-sheet.jpg
---

## 动作
斜着的小手机 3 帧内冲到镜头前转正，取景框收紧套住它，到最高点后越落越快掉出画面

## 怎么进来
深蓝星空

## 注意
只有 1 秒；下落最快的一帧硬切

## 怎么用
- 代码入口：`demos-own/parts/phone-rush-toss/PhoneRushToss.tsx`（只播原镜头的这一段，时长常量 `PHONE_RUSH_TOSS_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/card-rain-pixel-word/CardRainPixelWord.tsx`：先读原镜头的卡 `references/groups-own/card-rain-pixel-word.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 12 帧（样片量的）、第 16 帧（peak，合同）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
