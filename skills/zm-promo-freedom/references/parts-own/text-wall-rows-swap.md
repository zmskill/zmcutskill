---
name: text-wall-rows-swap
中文名: 满屏一行行大字墙 · 中间一行换词
用途: 痛点
时长: 2.0 秒（59 帧，30fps）
一句话: 输入框收掉，切到满屏一行行横着滚的大字墙，中间一行的词换一次
来源镜头: type-icons-orbit-input（第 134–193 帧）
样片: demos-own/parts/text-wall-rows-swap/preview.mp4
样片图: demos-own/parts/text-wall-rows-swap/preview-sheet.jpg
---

## 动作
输入框收掉，切到满屏一行行横着滚的大字墙，中间一行的词换一次

## 怎么进来
硬切

## 注意
"到处都是"的感觉

## 怎么用
- 代码入口：`demos-own/parts/text-wall-rows-swap/TextWallRowsSwap.tsx`（只播原镜头的这一段，时长常量 `TEXT_WALL_ROWS_SWAP_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/type-icons-orbit-input/TypeIconsOrbitInput.tsx`：先读原镜头的卡 `references/groups-own/type-icons-orbit-input.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 1 帧（collapse，合同）、第 10 帧（cut2，合同）、第 42 帧（swap，合同）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
