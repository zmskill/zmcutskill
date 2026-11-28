---
name: scatter-cards-lost-teams
中文名: 像素块闪掉上一句 · 词冒出 · 卡片散在四周
用途: 痛点
时长: 3.8 秒（115 帧，30fps）
一句话: 上一句被一片红 / 粉 / 灰的大方块像素闪掉 → 中间一个词一个词冒出「迷失在团队之间」，
来源镜头: scatter-cards-lost-teams（整个镜头）
样片: demos-own/parts/scatter-cards-lost-teams/preview.mp4
样片图: demos-own/parts/scatter-cards-lost-teams/preview-sheet.jpg
---

## 动作
上一句被一片红 / 粉 / 灰的大方块像素闪掉 → 中间一个词一个词冒出「迷失在团队之间」，

## 怎么进来
像素块闪切

## 怎么用
- 代码入口：`demos-own/parts/scatter-cards-lost-teams/ScatterCardsLostTeams.tsx`（整个镜头，时长常量 `SCATTER_CARDS_LOST_TEAMS_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/scatter-cards-lost-teams/ScatterCardsLostTeams.tsx`：先读原镜头的卡 `references/groups-own/scatter-cards-lost-teams.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 8 帧（w1，合同）、第 11 帧（cards，合同）、第 15 帧（样片量的）、第 27 帧（样片量的）、第 60 帧（样片量的）、第 89 帧（样片量的）、第 100 帧（drop，合同）、第 110 帧（flash，合同）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
