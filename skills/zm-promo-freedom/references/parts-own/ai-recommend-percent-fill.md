---
name: ai-recommend-percent-fill
中文名: AI 也推荐你 · 百分比涨到 100
用途: 证据
时长: 3.0 秒（90 帧，30fps）
一句话: AI 回答里出现你的名字并被高亮，切到一个大百分比数字一路涨到 100%、右边进度条填满
来源镜头: saas-ad-search-ai-cta（第 450–540 帧）
样片: demos-own/parts/ai-recommend-percent-fill/preview.mp4
样片图: demos-own/parts/ai-recommend-percent-fill/preview-sheet.jpg
---

## 动作
AI 回答里出现你的名字并被高亮，切到一个大百分比数字一路涨到 100%、右边进度条填满

## 怎么进来
硬切

## 怎么用
- 代码入口：`demos-own/parts/ai-recommend-percent-fill/AiRecommendPercentFill.tsx`（只播原镜头的这一段，时长常量 `AI_RECOMMEND_PERCENT_FILL_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/saas-ad-search-ai-cta/SaasAdSearchAiCta.tsx`：先读原镜头的卡 `references/groups-own/saas-ad-search-ai-cta.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 5 帧（样片量的）、第 45 帧（pct，合同）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
