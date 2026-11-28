---
name: search-type-click-customers
中文名: 搜索框打字点搜索 · 「你的客户正在搜」
用途: 钩子
时长: 4.0 秒（120 帧，30fps）
一句话: 暗底荧光绿，搜索框逐字打字、点搜索，结果列表滑出来，一句话点明客户正在搜
来源镜头: saas-ad-search-ai-cta（第 0–120 帧）
样片: demos-own/parts/search-type-click-customers/preview.mp4
样片图: demos-own/parts/search-type-click-customers/preview-sheet.jpg
---

## 动作
暗底荧光绿，搜索框逐字打字、点搜索，结果列表滑出来，一句话点明客户正在搜

## 怎么进来
第一帧开始

## 怎么用
- 代码入口：`demos-own/parts/search-type-click-customers/SearchTypeClickCustomers.tsx`（只播原镜头的这一段，时长常量 `SEARCH_TYPE_CLICK_CUSTOMERS_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/saas-ad-search-ai-cta/SaasAdSearchAiCta.tsx`：先读原镜头的卡 `references/groups-own/saas-ad-search-ai-cta.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 48 帧（click，合同）、第 66 帧（样片量的）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
