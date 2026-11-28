---
name: three-words-title
中文名: 三词标题逐词浮现
用途: 字卡
时长: 1.7 秒（50 帧，30fps）
一句话: "找到。看懂。约上。"三个词逐个浮现，停住极慢后拉，再加速后拉切走
来源镜头: search-pick-shortlist（第 411–461 帧）
样片: demos-own/parts/three-words-title/preview.mp4
样片图: demos-own/parts/three-words-title/preview-sheet.jpg
---

## 动作
"找到。看懂。约上。"三个词逐个浮现，停住极慢后拉，再加速后拉切走

## 怎么进来
接上一拍

## 怎么用
- 代码入口：`demos-own/parts/three-words-title/ThreeWordsTitle.tsx`（只播原镜头的这一段，时长常量 `THREE_WORDS_TITLE_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/ui-entrance/search-pick-shortlist/SearchPickShortlist.tsx`：先读原镜头的卡 `references/shots-own/ui-entrance/search-pick-shortlist.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 16 帧（样片量的）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
