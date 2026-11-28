---
name: progress-tilt-editor
中文名: 进度条跳着涨 · 代码编辑器斜着升起
用途: 结果登场
时长: 4.9 秒（147 帧，30fps）
一句话: 产品图标 + 发光进度条跳着涨（几道绿色流光绕着飞）→ 一块霓虹描边的代码编辑器从画面底下斜着升起来、
来源镜头: progress-tilt-editor（整个镜头）
样片: demos-own/parts/progress-tilt-editor/preview.mp4
样片图: demos-own/parts/progress-tilt-editor/preview-sheet.jpg
---

## 动作
产品图标 + 发光进度条跳着涨（几道绿色流光绕着飞）→ 一块霓虹描边的代码编辑器从画面底下斜着升起来、

## 怎么进来
第一帧开始

## 怎么用
- 代码入口：`demos-own/parts/progress-tilt-editor/ProgressTiltEditor.tsx`（整个镜头，时长常量 `PROGRESS_TILT_EDITOR_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/progress-tilt-editor/ProgressTiltEditor.tsx`：先读原镜头的卡 `references/groups-own/progress-tilt-editor.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 39 帧（rise，合同）、第 56 帧（code，合同）、第 63 帧（样片量的）、第 138 帧（done，合同）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
