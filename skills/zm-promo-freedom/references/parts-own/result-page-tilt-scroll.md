---
name: result-page-tilt-scroll
中文名: 结果页斜着进来 · 页内滚动
用途: 结果登场
时长: 3.2 秒（97 帧，30fps）
一句话: 失焦硬切，结果页斜着虚着进来 0.32 秒摆正（图片先马赛克再变清楚），推近的同时页内滚到底再滚回
来源镜头: prompt-to-site-wall（第 123–220 帧）
样片: demos-own/parts/result-page-tilt-scroll/preview.mp4
样片图: demos-own/parts/result-page-tilt-scroll/preview-sheet.jpg
---

## 动作
失焦硬切，结果页斜着虚着进来 0.32 秒摆正（图片先马赛克再变清楚），推近的同时页内滚到底再滚回

## 怎么进来
失焦爬坡硬切

## 注意
只要"斜入摆正"取前 27 帧；滚动转折点不能停，左边栏不跟滚

## 怎么用
- 代码入口：`demos-own/parts/result-page-tilt-scroll/ResultPageTiltScroll.tsx`（只播原镜头的这一段，时长常量 `RESULT_PAGE_TILT_SCROLL_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/ui-entrance/prompt-to-site-wall/PromptToSiteWall.tsx`：先读原镜头的卡 `references/shots-own/ui-entrance/prompt-to-site-wall.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 10 帧（样片量的）、第 61 帧（样片量的）、第 81 帧（样片量的）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
