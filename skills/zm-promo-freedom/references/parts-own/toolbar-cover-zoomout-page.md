---
name: toolbar-cover-zoomout-page
中文名: 巨大工具栏盖进来 · 点一下 · 猛拉远原来是网页
用途: 结果登场
时长: 2.6 秒（78 帧，30fps）
一句话: 巨大的工具栏从左边滑进来盖住字，光标点"评论"；镜头 0.2 秒从 4.5 倍拉到 1 倍，工具栏原来是网页下沿的工具条，评论栏从右边滑进来
来源镜头: edit-flash-type-toolbar（第 123–201 帧）
样片: demos-own/parts/toolbar-cover-zoomout-page/preview.mp4
样片图: demos-own/parts/toolbar-cover-zoomout-page/preview-sheet.jpg
---

## 动作
巨大的工具栏从左边滑进来盖住字，光标点"评论"；镜头 0.2 秒从 4.5 倍拉到 1 倍，工具栏原来是网页下沿的工具条，评论栏从右边滑进来

## 怎么进来
接上一拍的字

## 怎么用
- 代码入口：`demos-own/parts/toolbar-cover-zoomout-page/ToolbarCoverZoomoutPage.tsx`（只播原镜头的这一段，时长常量 `TOOLBAR_COVER_ZOOMOUT_PAGE_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/edit-flash-type-toolbar/EditFlashTypeToolbar.tsx`：先读原镜头的卡 `references/groups-own/edit-flash-type-toolbar.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 11 帧（cursor，合同）、第 19 帧（样片量的）、第 40 帧（click，合同）、第 44 帧（样片量的）、第 55 帧（zoomOut，合同）、第 59 帧（panel，合同）、第 63 帧（样片量的）、第 68 帧（pin1，合同）、第 72 帧（pin2，合同）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
