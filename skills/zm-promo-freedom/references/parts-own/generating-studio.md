---
name: generating-studio
中文名: 「生成中」大按钮 · 流光一呼一吸
用途: 过渡动作
时长: 2.7 秒（81 帧，30fps）
一句话: 软光底中间一个渐变描边的大按钮「✧ 生成中···」（字带紫色流光逐个显出、外圈发光一呼一吸）→
来源镜头: generating-studio（整个镜头）
样片: demos-own/parts/generating-studio/preview.mp4
样片图: demos-own/parts/generating-studio/preview-sheet.jpg
---

## 动作
软光底中间一个渐变描边的大按钮「✧ 生成中···」（字带紫色流光逐个显出、外圈发光一呼一吸）→

## 怎么进来
第一帧开始

## 注意
等结果的那一拍

## 怎么用
- 代码入口：`demos-own/parts/generating-studio/GeneratingStudio.tsx`（整个镜头，时长常量 `GENERATING_STUDIO_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/generating-studio/GeneratingStudio.tsx`：先读原镜头的卡 `references/groups-own/generating-studio.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 27 帧（cut，合同）、第 46 帧（settle，合同）、第 48 帧（push，合同）、第 60 帧（reveal，合同）、第 75 帧（样片量的）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
