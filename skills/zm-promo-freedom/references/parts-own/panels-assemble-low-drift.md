---
name: panels-assemble-low-drift
中文名: 散开的面板拼回一整面 · 硬切低角度慢漂
用途: 结果登场
时长: 3.1 秒（94 帧，30fps）
一句话: 斜躺的仪表盘面板一开始是散开的，镜头一边移一边各自拼回一整面；硬切到低角度一直匀速慢漂
来源镜头: tilted-dashboard-pan-logo（第 0–94 帧）
样片: demos-own/parts/panels-assemble-low-drift/preview.mp4
样片图: demos-own/parts/panels-assemble-low-drift/preview-sheet.jpg
---

## 动作
斜躺的仪表盘面板一开始是散开的，镜头一边移一边各自拼回一整面；硬切到低角度一直匀速慢漂

## 怎么进来
第一帧开始

## 注意
面板贴图是烘焙好的图（textures/live/dash_*.png），换产品要换贴图

## 怎么用
- 代码入口：`demos-own/parts/panels-assemble-low-drift/PanelsAssembleLowDrift.tsx`（只播原镜头的这一段，时长常量 `PANELS_ASSEMBLE_LOW_DRIFT_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/camera/tilted-dashboard-pan-logo/TiltedDashboardPanLogo.tsx`：先读原镜头的卡 `references/shots-own/camera/tilted-dashboard-pan-logo.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 42 帧（样片量的）、第 50 帧（样片量的）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
