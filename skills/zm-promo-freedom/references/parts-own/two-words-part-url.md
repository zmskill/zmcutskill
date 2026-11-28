---
name: two-words-part-url
中文名: 两个词往两边退开 · 中间打出网址
用途: 品牌落版
时长: 3.1 秒（93 帧，30fps）
一句话: 只剩两个词，往两边退开变暗，中间打出网址
来源镜头: subscription-icons-absorb-url（第 154–247 帧）
样片: demos-own/parts/two-words-part-url/preview.mp4
样片图: demos-own/parts/two-words-part-url/preview-sheet.jpg
---

## 动作
只剩两个词，往两边退开变暗，中间打出网址

## 怎么进来
接上一拍的落版

## 注意
全片最后

## 怎么用
- 代码入口：`demos-own/parts/two-words-part-url/TwoWordsPartUrl.tsx`（只播原镜头的这一段，时长常量 `TWO_WORDS_PART_URL_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/subscription-icons-absorb-url/SubscriptionIconsAbsorbUrl.tsx`：先读原镜头的卡 `references/groups-own/subscription-icons-absorb-url.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 19 帧（样片量的）、第 28 帧（work，合同）、第 33 帧（样片量的）、第 42 帧（url，合同）、第 48 帧（样片量的）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
