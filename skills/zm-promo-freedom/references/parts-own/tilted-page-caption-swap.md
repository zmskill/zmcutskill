---
name: tilted-page-caption-swap
中文名: 硬切斜放整页 · 上方换一句话 · 甩走
用途: 证据
时长: 2.5 秒（75 帧，30fps）
一句话: 硬切到斜放的整页，上方一句话、换一句，整页慢慢转过去、往左甩走
来源镜头: smarter-card-board-tilt（第 120–195 帧）
样片: demos-own/parts/tilted-page-caption-swap/preview.mp4
样片图: demos-own/parts/tilted-page-caption-swap/preview-sheet.jpg
---

## 动作
硬切到斜放的整页，上方一句话、换一句，整页慢慢转过去、往左甩走

## 怎么进来
硬切

## 怎么用
- 代码入口：`demos-own/parts/tilted-page-caption-swap/TiltedPageCaptionSwap.tsx`（只播原镜头的这一段，时长常量 `TILTED_PAGE_CAPTION_SWAP_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/smarter-card-board-tilt/SmarterCardBoardTilt.tsx`：先读原镜头的卡 `references/groups-own/smarter-card-board-tilt.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 2 帧（cap1，合同）、第 43 帧（cap2，合同）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
