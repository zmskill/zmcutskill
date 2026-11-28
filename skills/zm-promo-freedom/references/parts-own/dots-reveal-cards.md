---
name: dots-reveal-cards
中文名: 点里显出卡片 · 函数名收走
用途: 结果登场
时长: 3.2 秒（96 帧，30fps）
一句话: 函数名打出来，点里显出三张线框卡片，最后只剩一对括号
来源镜头: dot-motion-chapters（第 444–540 帧）
样片: demos-own/parts/dots-reveal-cards/preview.mp4
样片图: demos-own/parts/dots-reveal-cards/preview-sheet.jpg
---

## 动作
函数名打出来，点里显出三张线框卡片，最后只剩一对括号

## 怎么进来
接上一段

## 怎么用
- 代码入口：`demos-own/parts/dots-reveal-cards/DotsRevealCards.tsx`（只播原镜头的这一段，时长常量 `DOTS_REVEAL_CARDS_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/dot-motion-chapters/DotMotionChapters.tsx`：先读原镜头的卡 `references/groups-own/dot-motion-chapters.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 15 帧（样片量的）、第 76 帧（样片量的）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
