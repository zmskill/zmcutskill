---
name: type-button-slides
中文名: 超大字逐字打 · 拉远成按钮 · 出幻灯片
用途: 功能演示
时长: 6.0 秒（179 帧，30fps）
一句话: 黑底超大字逐字打「直接看演示文稿」（镜头从一个字的特写一路拉远，刚打的字是紫色、过一会变白）→
来源镜头: type-button-slides（整个镜头）
样片: demos-own/parts/type-button-slides/preview.mp4
样片图: demos-own/parts/type-button-slides/preview-sheet.jpg
---

## 动作
黑底超大字逐字打「直接看演示文稿」（镜头从一个字的特写一路拉远，刚打的字是紫色、过一会变白）→

## 怎么进来
第一帧开始

## 注意
正好 6 秒

## 怎么用
- 代码入口：`demos-own/parts/type-button-slides/TypeButtonSlides.tsx`（整个镜头，时长常量 `TYPE_BUTTON_SLIDES_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/type-button-slides/TypeButtonSlides.tsx`：先读原镜头的卡 `references/groups-own/type-button-slides.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 1 帧（type，合同）、第 8 帧（样片量的）、第 14 帧（pull，合同）、第 44 帧（glitch，合同）、第 52 帧（cut，合同）、第 59 帧（press，合同）、第 74 帧（release，合同）、第 82 帧（样片量的）、第 97 帧（card，合同）、第 104 帧（flat，合同）、第 121 帧（s1，合同）、第 128 帧（s2，合同）、第 136 帧（s3，合同）、第 140 帧（样片量的）、第 151 帧（s4，合同）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
