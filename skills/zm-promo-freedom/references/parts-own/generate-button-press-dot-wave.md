---
name: generate-button-press-dot-wave
中文名: 「生成」按钮特写按下 · 点阵波纹
用途: 点击确认
时长: 2.9 秒（87 帧，30fps）
一句话: 切到「生成」按钮的特写，按下去，背景点阵一圈圈波纹荡开
来源镜头: code-flythrough-generate（第 123–210 帧）
样片: demos-own/parts/generate-button-press-dot-wave/preview.mp4
样片图: demos-own/parts/generate-button-press-dot-wave/preview-sheet.jpg
---

## 动作
切到「生成」按钮的特写，按下去，背景点阵一圈圈波纹荡开

## 怎么进来
硬切

## 怎么用
- 代码入口：`demos-own/parts/generate-button-press-dot-wave/GenerateButtonPressDotWave.tsx`（只播原镜头的这一段，时长常量 `GENERATE_BUTTON_PRESS_DOT_WAVE_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/code-flythrough-generate/CodeFlythroughGenerate.tsx`：先读原镜头的卡 `references/groups-own/code-flythrough-generate.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 27 帧（cut，合同）、第 30 帧（word，合同）、第 60 帧（dots，合同）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
