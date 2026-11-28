---
name: connect-word-icon-reel
中文名: 固定大词 · 图标方块转轮换小词
用途: 列举
时长: 5.0 秒（150 帧，30fps）
一句话: 暗紫底，左边一个固定大词 + 下面一行小词轮换；右边一串紫色图标方块斜着排成转轮，
来源镜头: connect-word-icon-reel（整个镜头）
样片: demos-own/parts/connect-word-icon-reel/preview.mp4
样片图: demos-own/parts/connect-word-icon-reel/preview-sheet.jpg
---

## 动作
暗紫底，左边一个固定大词 + 下面一行小词轮换；右边一串紫色图标方块斜着排成转轮，

## 怎么进来
第一帧开始

## 怎么用
- 代码入口：`demos-own/parts/connect-word-icon-reel/ConnectWordIconReel.tsx`（整个镜头，时长常量 `CONNECT_WORD_ICON_REEL_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/connect-word-icon-reel/ConnectWordIconReel.tsx`：先读原镜头的卡 `references/groups-own/connect-word-icon-reel.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 16 帧（样片量的）、第 32 帧（w2，合同）、第 49 帧（样片量的）、第 70 帧（w3，合同）、第 88 帧（样片量的）、第 106 帧（w4，合同）、第 124 帧（样片量的）、第 139 帧（out，合同）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
