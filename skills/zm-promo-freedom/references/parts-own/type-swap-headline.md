---
name: type-swap-headline
中文名: 大字打出一个问题 · 原地改写成回答
用途: 钩子
时长: 2.9 秒（88 帧，30fps）
一句话: 白底上一行大黑字打出来，镜头推近、平移，前半句掉下去淡掉，只留后半个词，再换成两个词「早就安排 / 好了。」，四周散开几颗彩色小点
来源镜头: type-swap-headline（整个镜头）
样片: demos-own/parts/type-swap-headline/preview.mp4
样片图: demos-own/parts/type-swap-headline/preview-sheet.jpg
---

## 动作
白底上一行大黑字打出来，镜头推近、平移，前半句掉下去淡掉，只留后半个词，再换成两个词「早就安排 / 好了。」，四周散开几颗彩色小点

## 怎么进来
白底

## 怎么用
- 代码入口：`demos-own/parts/type-swap-headline/TypeSwapHeadline.tsx`（整个镜头，时长常量 `TYPE_SWAP_HEADLINE_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/type-swap-headline/TypeSwapHeadline.tsx`：先读原镜头的卡 `references/groups-own/type-swap-headline.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 19 帧（settle，合同）、第 33 帧（swap，合同）、第 45 帧（gone，合同）、第 48 帧（second，合同）、第 60 帧（zoom，合同）、第 82 帧（glow，合同）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
