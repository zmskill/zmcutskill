---
name: iso-cube-rings
中文名: 线框立方体 · 拉远成方块地板换色
用途: 转场
时长: 3.2 秒（96 帧，30fps）
一句话: 黑底上一个线框立方体转着填色、缩小，镜头一下拉远成斜俯视的方块地板，一圈圈蓝白方块从外往里换色，最后拉远转正成俯视
来源镜头: iso-cube-rings（整个镜头）
样片: demos-own/parts/iso-cube-rings/preview.mp4
样片图: demos-own/parts/iso-cube-rings/preview-sheet.jpg
---

## 动作
黑底上一个线框立方体转着填色、缩小，镜头一下拉远成斜俯视的方块地板，一圈圈蓝白方块从外往里换色，最后拉远转正成俯视

## 怎么进来
硬切

## 注意
暗色、科技感

## 怎么用
- 代码入口：`demos-own/parts/iso-cube-rings/IsoCubeRings.tsx`（整个镜头，时长常量 `ISO_CUBE_RINGS_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/transition/iso-cube-rings/IsoCubeRings.tsx`：先读原镜头的卡 `references/shots-own/transition/iso-cube-rings.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 35 帧（样片量的）、第 54 帧（样片量的）、第 80 帧（样片量的）、第 84 帧（样片量的）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
