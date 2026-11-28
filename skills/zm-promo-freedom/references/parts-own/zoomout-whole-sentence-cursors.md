---
name: zoomout-whole-sentence-cursors
中文名: 猛拉远 · 整句变小 · 名字光标散在四周
用途: 过渡动作
时长: 2.7 秒（81 帧，30fps）
一句话: 镜头猛拉远，整句话缩成一小行，几个名字光标散在四周
来源镜头: rich-text-cursor-styles（第 429–510 帧）
样片: demos-own/parts/zoomout-whole-sentence-cursors/preview.mp4
样片图: demos-own/parts/zoomout-whole-sentence-cursors/preview-sheet.jpg
---

## 动作
镜头猛拉远，整句话缩成一小行，几个名字光标散在四周

## 怎么进来
接上一段

## 怎么用
- 代码入口：`demos-own/parts/zoomout-whole-sentence-cursors/ZoomoutWholeSentenceCursors.tsx`（只播原镜头的这一段，时长常量 `ZOOMOUT_WHOLE_SENTENCE_CURSORS_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/rich-text-cursor-styles/RichTextCursorStyles.tsx`：先读原镜头的卡 `references/groups-own/rich-text-cursor-styles.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 7 帧（样片量的）、第 11 帧（样片量的）、第 35 帧（wide，合同）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
