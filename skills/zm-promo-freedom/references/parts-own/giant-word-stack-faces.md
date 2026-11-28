---
name: giant-word-stack-faces
中文名: 撑满屏的大字滑过 · 第二个词两行挤进来
用途: 证据
时长: 4.8 秒（144 帧，30fps）
一句话: 米白底一个小圈 → 撑满整屏的超大字（带一点重影抖动）往左越滑越快地滑过去 → 第二个词两行错开从右边挤进来 →
来源镜头: giant-word-stack-faces（整个镜头）
样片: demos-own/parts/giant-word-stack-faces/preview.mp4
样片图: demos-own/parts/giant-word-stack-faces/preview-sheet.jpg
---

## 动作
米白底一个小圈 → 撑满整屏的超大字（带一点重影抖动）往左越滑越快地滑过去 → 第二个词两行错开从右边挤进来 →

## 怎么进来
第一帧开始

## 怎么用
- 代码入口：`demos-own/parts/giant-word-stack-faces/GiantWordStackFaces.tsx`（整个镜头，时长常量 `GIANT_WORD_STACK_FACES_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/giant-word-stack-faces/GiantWordStackFaces.tsx`：先读原镜头的卡 `references/groups-own/giant-word-stack-faces.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 9 帧（giant，合同）、第 21 帧（slide，合同）、第 48 帧（word2，合同）、第 63 帧（样片量的）、第 75 帧（word3，合同）、第 90 帧（stack，合同）、第 97 帧（样片量的）、第 116 帧（badges，合同）、第 136 帧（burst，合同）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
