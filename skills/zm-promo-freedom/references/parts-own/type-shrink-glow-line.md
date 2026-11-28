---
name: type-shrink-glow-line
中文名: 大黑字打出 · 缩小变灰 · 彩字糊入
用途: 字卡
时长: 1.9 秒（57 帧，30fps）
一句话: 一行大黑字边打边滑上来，缩小、变灰、淡掉；第二句渐变彩字逐字糊入，带柔光、颜色流动
来源镜头: type-glow-list（第 0–57 帧）
样片: demos-own/parts/type-shrink-glow-line/preview.mp4
样片图: demos-own/parts/type-shrink-glow-line/preview-sheet.jpg
---

## 动作
一行大黑字边打边滑上来，缩小、变灰、淡掉；第二句渐变彩字逐字糊入，带柔光、颜色流动

## 怎么进来
白底

## 怎么用
- 代码入口：`demos-own/parts/type-shrink-glow-line/TypeShrinkGlowLine.tsx`（只播原镜头的这一段，时长常量 `TYPE_SHRINK_GLOW_LINE_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/type-glow-list/TypeGlowList.tsx`：先读原镜头的卡 `references/groups-own/type-glow-list.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 17 帧（样片量的）、第 24 帧（period，合同）、第 27 帧（shrink，合同）、第 40 帧（glow，合同）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
