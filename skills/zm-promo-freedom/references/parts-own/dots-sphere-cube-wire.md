---
name: dots-sphere-cube-wire
中文名: 点云 → 点阵球 → 立方体 → 线框
用途: 过渡动作
时长: 2.6 秒（78 帧，30fps）
一句话: 点云聚成点阵球，变成点阵立方体，再变成白色线框立方体转到顶点朝前
来源镜头: dot-cube-logo（第 0–78 帧）
样片: demos-own/parts/dots-sphere-cube-wire/preview.mp4
样片图: demos-own/parts/dots-sphere-cube-wire/preview-sheet.jpg
---

## 动作
点云聚成点阵球，变成点阵立方体，再变成白色线框立方体转到顶点朝前

## 怎么进来
第一帧开始

## 怎么用
- 代码入口：`demos-own/parts/dots-sphere-cube-wire/DotsSphereCubeWire.tsx`（只播原镜头的这一段，时长常量 `DOTS_SPHERE_CUBE_WIRE_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/dot-cube-logo/DotCubeLogo.tsx`：先读原镜头的卡 `references/groups-own/dot-cube-logo.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 24 帧（sphere，合同）、第 48 帧（cube，合同）、第 60 帧（wire，合同）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
