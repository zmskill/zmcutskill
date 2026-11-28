---
name: portrait-circles-squeeze-word
中文名: 人像圆长出蓝圆挤成沙漏 · 收成一个词
用途: 钩子
时长: 2.9 秒（87 帧，30fps）
一句话: 米白底，圆形人像照片上长出两个蓝色大圆、挤成沙漏，合成一个带字的蓝圆、左右挤出一排椭圆，椭圆收掉只剩一个词，再缩成黑圆、出标志和名字
来源镜头: circle-morph-listen（第 0–87 帧）
样片: demos-own/parts/portrait-circles-squeeze-word/preview.mp4
样片图: demos-own/parts/portrait-circles-squeeze-word/preview-sheet.jpg
---

## 动作
米白底，圆形人像照片上长出两个蓝色大圆、挤成沙漏，合成一个带字的蓝圆、左右挤出一排椭圆，椭圆收掉只剩一个词，再缩成黑圆、出标志和名字

## 怎么进来
第一帧开始

## 怎么用
- 代码入口：`demos-own/parts/portrait-circles-squeeze-word/PortraitCirclesSqueezeWord.tsx`（只播原镜头的这一段，时长常量 `PORTRAIT_CIRCLES_SQUEEZE_WORD_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/circle-morph-listen/CircleMorphListen.tsx`：先读原镜头的卡 `references/groups-own/circle-morph-listen.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 4 帧（split，合同）、第 20 帧（meet，合同）、第 27 帧（ovals，合同）、第 42 帧（word，合同）、第 57 帧（ripple，合同）、第 72 帧（mark，合同）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
