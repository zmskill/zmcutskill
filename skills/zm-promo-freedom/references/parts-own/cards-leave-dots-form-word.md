---
name: cards-leave-dots-form-word
中文名: 卡片离开 · 点聚成大字 · 字变形
用途: 字卡
时长: 5.6 秒（168 帧，30fps）
一句话: 卡片斜着离开，点聚成一个大词，函数名换掉，大词里的字一个个变形换掉
来源镜头: dot-motion-chapters（第 189–357 帧）
样片: demos-own/parts/cards-leave-dots-form-word/preview.mp4
样片图: demos-own/parts/cards-leave-dots-form-word/preview-sheet.jpg
---

## 动作
卡片斜着离开，点聚成一个大词，函数名换掉，大词里的字一个个变形换掉

## 怎么进来
接上一段

## 注意
5.6 秒

## 怎么用
- 代码入口：`demos-own/parts/cards-leave-dots-form-word/CardsLeaveDotsFormWord.tsx`（只播原镜头的这一段，时长常量 `CARDS_LEAVE_DOTS_FORM_WORD_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/dot-motion-chapters/DotMotionChapters.tsx`：先读原镜头的卡 `references/groups-own/dot-motion-chapters.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 15 帧（样片量的）、第 24 帧（leave，合同）、第 34 帧（样片量的）、第 54 帧（样片量的）、第 81 帧（word，合同）、第 111 帧（样片量的）、第 121 帧（morph，合同）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
