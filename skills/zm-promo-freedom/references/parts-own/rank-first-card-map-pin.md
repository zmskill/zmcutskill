---
name: rank-first-card-map-pin
中文名: 排第一的结果卡 · 地图上也找得到
用途: 证据
时长: 3.0 秒（90 帧，30fps）
一句话: 一张排名第一的搜索结果卡亮出来，下面一句话；切到地图定位点和地图结果列表
来源镜头: saas-ad-search-ai-cta（第 360–450 帧）
样片: demos-own/parts/rank-first-card-map-pin/preview.mp4
样片图: demos-own/parts/rank-first-card-map-pin/preview-sheet.jpg
---

## 动作
一张排名第一的搜索结果卡亮出来，下面一句话；切到地图定位点和地图结果列表

## 怎么进来
硬切

## 怎么用
- 代码入口：`demos-own/parts/rank-first-card-map-pin/RankFirstCardMapPin.tsx`（只播原镜头的这一段，时长常量 `RANK_FIRST_CARD_MAP_PIN_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/saas-ad-search-ai-cta/SaasAdSearchAiCta.tsx`：先读原镜头的卡 `references/groups-own/saas-ad-search-ai-cta.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 6 帧（样片量的）、第 45 帧（maps，合同）、第 51 帧（样片量的）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
