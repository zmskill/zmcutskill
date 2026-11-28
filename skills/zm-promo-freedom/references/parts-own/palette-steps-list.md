---
name: palette-steps-list
中文名: 竖色条长成台阶 · 铺成一行行色带
用途: 列举
时长: 2.1 秒（63 帧，30fps）
一句话: 硬切黑底，一根竖色条（几种品牌色上下叠）往两边长成金字塔台阶（越下面越宽），再一下铺满成一行行全宽色带，
来源镜头: palette-steps-list（整个镜头）
样片: demos-own/parts/palette-steps-list/preview.mp4
样片图: demos-own/parts/palette-steps-list/preview-sheet.jpg
---

## 动作
硬切黑底，一根竖色条（几种品牌色上下叠）往两边长成金字塔台阶（越下面越宽），再一下铺满成一行行全宽色带，

## 怎么进来
硬切

## 怎么用
- 代码入口：`demos-own/parts/palette-steps-list/PaletteStepsList.tsx`（整个镜头，时长常量 `PALETTE_STEPS_LIST_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/palette-steps-list/PaletteStepsList.tsx`：先读原镜头的卡 `references/groups-own/palette-steps-list.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 2 帧（bar，合同）、第 8 帧（steps，合同）、第 16 帧（样片量的）、第 20 帧（full，合同）、第 21 帧（labels，合同）、第 57 帧（out，合同）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
