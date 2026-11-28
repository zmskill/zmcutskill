---
name: glass-number-cards
中文名: 三张玻璃数字卡 · 数字滚着涨
用途: 证据
时长: 2.0 秒（60 帧，30fps）
一句话: 三张玻璃数字卡（营收 / 时长 / 点击）在画面里漂，数字一格格往上滚着涨，节奏错开（028-G 一拍，数据证明核心）
来源镜头: glass-number-cards（整个镜头）
样片: demos-own/parts/glass-number-cards/preview.mp4
样片图: demos-own/parts/glass-number-cards/preview-sheet.jpg
---

## 动作
三张玻璃数字卡（营收 / 时长 / 点击）在画面里漂，数字一格格往上滚着涨，节奏错开（028-G 一拍，数据证明核心）

## 怎么进来
第一帧开始

## 怎么用
- 代码入口：`demos-own/parts/glass-number-cards/GlassNumberCards.tsx`（整个镜头，时长常量 `GLASS_NUMBER_CARDS_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/glass-number-cards/GlassNumberCards.tsx`：先读原镜头的卡 `references/groups-own/glass-number-cards.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 2 帧（t1，合同）、第 12 帧（t2，合同）、第 24 帧（t3，合同）、第 30 帧（t4，合同）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
