---
name: quote-new-search-push
中文名: 金句 · 新搜索框冲上来再打一句
用途: 钩子
时长: 3.8 秒（114 帧，30fps）
一句话: 硬切白底，金句逐词上浮；新搜索框从下冲上来，打第二句同时慢推，冲近发送键按下，玻璃高光
来源镜头: search-pick-shortlist（第 461–575 帧）
样片: demos-own/parts/quote-new-search-push/preview.mp4
样片图: demos-own/parts/quote-new-search-push/preview-sheet.jpg
---

## 动作
硬切白底，金句逐词上浮；新搜索框从下冲上来，打第二句同时慢推，冲近发送键按下，玻璃高光

## 怎么进来
硬切

## 怎么用
- 代码入口：`demos-own/parts/quote-new-search-push/QuoteNewSearchPush.tsx`（只播原镜头的这一段，时长常量 `QUOTE_NEW_SEARCH_PUSH_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/ui-entrance/search-pick-shortlist/SearchPickShortlist.tsx`：先读原镜头的卡 `references/shots-own/ui-entrance/search-pick-shortlist.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 37 帧（样片量的）、第 87 帧（样片量的）、第 93 帧（样片量的）、第 105 帧（样片量的）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
