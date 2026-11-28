---
name: ring-window-questions
中文名: 圆环像窗一样打开 · 露出一团问题气泡
用途: 痛点
时长: 5.8 秒（174 帧，30fps）
一句话: 黑底里一道蓝光画出圆环，圆环侧过来张开光锥，露出一团贴着球面在转的问题气泡；随后圆环甩回来把问题收走，转一圈缩没
来源镜头: ring-window-questions（整个镜头）
样片: demos-own/parts/ring-window-questions/preview.mp4
样片图: demos-own/parts/ring-window-questions/preview-sheet.jpg
---

## 动作
黑底里一道蓝光画出圆环，圆环侧过来张开光锥，露出一团贴着球面在转的问题气泡；随后圆环甩回来把问题收走，转一圈缩没

## 怎么进来
黑底

## 注意
结尾圆环缩没，硬切产品登场

## 怎么用
- 代码入口：`demos-own/parts/ring-window-questions/RingWindowQuestions.tsx`（整个镜头，时长常量 `RING_WINDOW_QUESTIONS_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/ring-window-questions/RingWindowQuestions.tsx`：先读原镜头的卡 `references/groups-own/ring-window-questions.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 2 帧（draw，合同）、第 26 帧（close，合同）、第 36 帧（open，合同）、第 60 帧（reveal，合同）、第 110 帧（sweep，合同）、第 123 帧（样片量的）、第 134 帧（spin，合同）、第 159 帧（front，合同）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
