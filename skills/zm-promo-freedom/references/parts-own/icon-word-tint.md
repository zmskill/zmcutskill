---
name: icon-word-tint
中文名: 图标飞进一个词 · 把它染成自己的颜色
用途: 列举
时长: 3.7 秒（110 帧，30fps）
一句话: 斜放的平面上打出一个短词，换成一整句，四周四个线条小图标弹出来；前半句往左甩走，最后一个词居中放大，图标一个个飞进去、词跟着换成图标的颜色
来源镜头: icon-word-tint（整个镜头）
样片: demos-own/parts/icon-word-tint/preview.mp4
样片图: demos-own/parts/icon-word-tint/preview-sheet.jpg
---

## 动作
斜放的平面上打出一个短词，换成一整句，四周四个线条小图标弹出来；前半句往左甩走，最后一个词居中放大，图标一个个飞进去、词跟着换成图标的颜色

## 怎么进来
第一帧开始

## 怎么用
- 代码入口：`demos-own/parts/icon-word-tint/IconWordTint.tsx`（整个镜头，时长常量 `ICON_WORD_TINT_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/icon-word-tint/IconWordTint.tsx`：先读原镜头的卡 `references/groups-own/icon-word-tint.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 4 帧（word，合同）、第 22 帧（line，合同）、第 32 帧（icon1，合同）、第 54 帧（icon4，合同）、第 60 帧（done，合同）、第 70 帧（sweep，合同）、第 86 帧（tint1，合同）、第 102 帧（tint4，合同）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
