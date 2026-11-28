---
name: bookmark-tap-check
中文名: 按钮点下 · 光环 · 白勾写出
用途: 点击确认
时长: 2.3 秒（69 帧，30fps）
一句话: 特写里一个白色圆按钮上的描边书签被点下：按钮一缩、书签变实心渐变，光环外扩加整屏淡紫柔光一闪，按钮放大，渐变慢慢流动，白勾写出，柔光轻轻呼吸
来源镜头: itinerary-scroll-bookmark（整个镜头）
样片: demos-own/parts/bookmark-tap-check/preview.mp4
样片图: demos-own/parts/bookmark-tap-check/preview-sheet.jpg
---

## 动作
特写里一个白色圆按钮上的描边书签被点下：按钮一缩、书签变实心渐变，光环外扩加整屏淡紫柔光一闪，按钮放大，渐变慢慢流动，白勾写出，柔光轻轻呼吸

## 怎么进来
特写已经对着按钮

## 注意
组件名 BookmarkTap

## 怎么用
- 代码入口：`demos-own/parts/bookmark-tap-check/BookmarkTapCheck.tsx`（整个镜头，时长常量 `BOOKMARK_TAP_CHECK_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/itinerary-scroll-bookmark/ItineraryScrollBookmark.tsx`：先读原镜头的卡 `references/shots-own/interaction/bookmark-tap-check.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 28 帧（样片量的）、第 36 帧（样片量的）、第 40 帧（样片量的）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
