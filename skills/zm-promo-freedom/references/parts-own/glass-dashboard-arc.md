---
name: glass-dashboard-arc
中文名: 玻璃面板浮起 · 弧光升起 · 界面一层层显出
用途: 结果登场
时长: 5.9 秒（177 帧，30fps）
一句话: 一块空的玻璃面板浮起来、长高 → 下面升起一道蓝色弧光（行星边缘）→ 界面一层层显出来（顶栏、标题、AI 助手、柱状图、折线、环形图）→
来源镜头: glass-dashboard-arc（整个镜头）
样片: demos-own/parts/glass-dashboard-arc/preview.mp4
样片图: demos-own/parts/glass-dashboard-arc/preview-sheet.jpg
---

## 动作
一块空的玻璃面板浮起来、长高 → 下面升起一道蓝色弧光（行星边缘）→ 界面一层层显出来（顶栏、标题、AI 助手、柱状图、折线、环形图）→

## 怎么进来
第一帧开始

## 怎么用
- 代码入口：`demos-own/parts/glass-dashboard-arc/GlassDashboardArc.tsx`（整个镜头，时长常量 `GLASS_DASHBOARD_ARC_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/glass-dashboard-arc/GlassDashboardArc.tsx`：先读原镜头的卡 `references/groups-own/glass-dashboard-arc.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 3 帧（panel，合同）、第 14 帧（样片量的）、第 26 帧（arc，合同）、第 30 帧（fill，合同）、第 78 帧（pull，合同）、第 84 帧（title，合同）、第 89 帧（样片量的）、第 98 帧（样片量的）、第 172 帧（star，合同）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
