---
name: rows-slide-multi-cursor-pick
中文名: 资料卡整排交错滑入 · 多个光标点选
用途: 列举
时长: 3.3 秒（99 帧，30fps）
一句话: 搜索框缩小被中间一排卡挤走，上排从右、下排从左"嗖"地滑进铺满，急停后慢漂；四个光标错开点选，有一个选了又退选
来源镜头: search-pick-shortlist（第 141–240 帧）
样片: demos-own/parts/rows-slide-multi-cursor-pick/preview.mp4
样片图: demos-own/parts/rows-slide-multi-cursor-pick/preview-sheet.jpg
---

## 动作
搜索框缩小被中间一排卡挤走，上排从右、下排从左"嗖"地滑进铺满，急停后慢漂；四个光标错开点选，有一个选了又退选

## 怎么进来
接上一拍的搜索框

## 注意
卡片是整排左右交错滑入，不能放射炸开

## 怎么用
- 代码入口：`demos-own/parts/rows-slide-multi-cursor-pick/RowsSlideMultiCursorPick.tsx`（只播原镜头的这一段，时长常量 `ROWS_SLIDE_MULTI_CURSOR_PICK_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/ui-entrance/search-pick-shortlist/SearchPickShortlist.tsx`：先读原镜头的卡 `references/shots-own/ui-entrance/search-pick-shortlist.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 52 帧（样片量的）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
