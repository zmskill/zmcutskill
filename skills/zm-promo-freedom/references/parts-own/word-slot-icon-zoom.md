---
name: word-slot-icon-zoom
中文名: 像老虎机一样翻能力 · 图标放大铺满
用途: 列举
时长: 3.7 秒（110 帧，30fps）
一句话: 产品名退掉、半句话往左让，右边像老虎机一样一项项往上翻（图标 + 能做的事）越翻越快；停在最后一项，字从尾巴删掉，只剩图标滑到正中、变实心、猛地放大铺满
来源镜头: word-slot-icon-zoom（整个镜头）
样片: demos-own/parts/word-slot-icon-zoom/preview.mp4
样片图: demos-own/parts/word-slot-icon-zoom/preview-sheet.jpg
---

## 动作
产品名退掉、半句话往左让，右边像老虎机一样一项项往上翻（图标 + 能做的事）越翻越快；停在最后一项，字从尾巴删掉，只剩图标滑到正中、变实心、猛地放大铺满

## 怎么进来
接产品名

## 注意
结尾图标铺满，接下一镜

## 怎么用
- 代码入口：`demos-own/parts/word-slot-icon-zoom/WordSlotIconZoom.tsx`（整个镜头，时长常量 `WORD_SLOT_ICON_ZOOM_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/word-slot-icon-zoom/WordSlotIconZoom.tsx`：先读原镜头的卡 `references/groups-own/word-slot-icon-zoom.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 3 帧（fade，合同）、第 12 帧（slide，合同）、第 16 帧（item1，合同）、第 28 帧（spin，合同）、第 37 帧（样片量的）、第 43 帧（样片量的）、第 53 帧（last，合同）、第 61 帧（del，合同）、第 75 帧（center，合同）、第 79 帧（fill，合同）、第 88 帧（zoom，合同）、第 99 帧（样片量的）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
