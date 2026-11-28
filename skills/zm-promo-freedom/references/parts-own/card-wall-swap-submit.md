---
name: card-wall-swap-submit
中文名: 卡片墙到位 · 中心卡换稿 · 点提交
用途: 列举
时长: 2.6 秒（79 帧，30fps）
一句话: 卡片墙从纵深退后到位，中心卡被三层斜边色块连换几版，四周空位错开滑入补满；推近中心卡点"提交"，黑边同一帧压入
来源镜头: prompt-to-site-wall（第 276–355 帧）
样片: demos-own/parts/card-wall-swap-submit/preview.mp4
样片图: demos-own/parts/card-wall-swap-submit/preview-sheet.jpg
---

## 动作
卡片墙从纵深退后到位，中心卡被三层斜边色块连换几版，四周空位错开滑入补满；推近中心卡点"提交"，黑边同一帧压入

## 怎么进来
失焦爬坡硬切

## 注意
只要卡片墙取前 35 帧

## 怎么用
- 代码入口：`demos-own/parts/card-wall-swap-submit/CardWallSwapSubmit.tsx`（只播原镜头的这一段，时长常量 `CARD_WALL_SWAP_SUBMIT_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/ui-entrance/prompt-to-site-wall/PromptToSiteWall.tsx`：先读原镜头的卡 `references/shots-own/ui-entrance/prompt-to-site-wall.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 7 帧（样片量的）、第 28 帧（样片量的）、第 39 帧（样片量的）、第 43 帧（样片量的）、第 62 帧（样片量的）、第 69 帧（样片量的）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
