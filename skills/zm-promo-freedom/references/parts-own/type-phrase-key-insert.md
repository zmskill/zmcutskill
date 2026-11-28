---
name: type-phrase-key-insert
中文名: 打出短语 · 钥匙插到词前面
用途: 字卡
时长: 1.9 秒（56 帧，30fps）
一句话: 上一镜的图标缩掉，打出一个短语；前半句退掉，一把钥匙插到关键词前面
来源镜头: subscription-icons-absorb-url（第 0–56 帧）
样片: demos-own/parts/type-phrase-key-insert/preview.mp4
样片图: demos-own/parts/type-phrase-key-insert/preview-sheet.jpg
---

## 动作
上一镜的图标缩掉，打出一个短语；前半句退掉，一把钥匙插到关键词前面

## 怎么进来
接上一镜的图标

## 怎么用
- 代码入口：`demos-own/parts/type-phrase-key-insert/TypePhraseKeyInsert.tsx`（只播原镜头的这一段，时长常量 `TYPE_PHRASE_KEY_INSERT_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/subscription-icons-absorb-url/SubscriptionIconsAbsorbUrl.tsx`：先读原镜头的卡 `references/groups-own/subscription-icons-absorb-url.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 26 帧（words，合同）、第 37 帧（样片量的）、第 46 帧（key，合同）、第 50 帧（样片量的）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
