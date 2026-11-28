---
name: giant-word-dot-rings-faces
中文名: 超大字 · 小词轮换 · 点阵环炸开成人脸
用途: 证据
时长: 3.7 秒（111 帧，30fps）
一句话: 名字猛放大成撑满屏的超大字，换成一个个小词，小词外面长出一圈圈点阵环，最后炸开成一大片人脸圆点
来源镜头: circle-morph-listen（第 87–198 帧）
样片: demos-own/parts/giant-word-dot-rings-faces/preview.mp4
样片图: demos-own/parts/giant-word-dot-rings-faces/preview-sheet.jpg
---

## 动作
名字猛放大成撑满屏的超大字，换成一个个小词，小词外面长出一圈圈点阵环，最后炸开成一大片人脸圆点

## 怎么进来
接上一段的标志

## 注意
数量感：很多人

## 怎么用
- 代码入口：`demos-own/parts/giant-word-dot-rings-faces/GiantWordDotRingsFaces.tsx`（只播原镜头的这一段，时长常量 `GIANT_WORD_DOT_RINGS_FACES_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/circle-morph-listen/CircleMorphListen.tsx`：先读原镜头的卡 `references/groups-own/circle-morph-listen.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 12 帧（giant，合同）、第 32 帧（样片量的）、第 38 帧（words，合同）、第 60 帧（ring，合同）、第 83 帧（burst，合同）、第 92 帧（样片量的）、第 105 帧（faces，合同）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
