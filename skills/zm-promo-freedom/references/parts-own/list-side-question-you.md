---
name: list-side-question-you
中文名: 名单推到一边 · 「那你呢？」
用途: 痛点
时长: 2.5 秒（75 帧，30fps）
一句话: 名单推到左边变暗，右边出一句斜体的反问
来源镜头: saas-ad-search-ai-cta（第 285–360 帧）
样片: demos-own/parts/list-side-question-you/preview.mp4
样片图: demos-own/parts/list-side-question-you/preview-sheet.jpg
---

## 动作
名单推到左边变暗，右边出一句斜体的反问

## 怎么进来
接上一段

## 怎么用
- 代码入口：`demos-own/parts/list-side-question-you/ListSideQuestionYou.tsx`（只播原镜头的这一段，时长常量 `LIST_SIDE_QUESTION_YOU_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/saas-ad-search-ai-cta/SaasAdSearchAiCta.tsx`：先读原镜头的卡 `references/groups-own/saas-ad-search-ai-cta.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 6 帧（样片量的）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
