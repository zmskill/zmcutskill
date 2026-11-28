---
name: comet-route-grid
中文名: 彗星线沿格子地图冲进来 · 拐到第一站
用途: 功能演示
时长: 2.4 秒（71 帧，30fps）
一句话: 斜俯视的格子地图上，蓝色彗星线沿格子冲进来、拐上去到第一个地点，身后的格子亮起来
来源镜头: grid-route-search（第 0–71 帧）
样片: demos-own/parts/comet-route-grid/preview.mp4
样片图: demos-own/parts/comet-route-grid/preview-sheet.jpg
---

## 动作
斜俯视的格子地图上，蓝色彗星线沿格子冲进来、拐上去到第一个地点，身后的格子亮起来

## 怎么进来
第一帧开始

## 怎么用
- 代码入口：`demos-own/parts/comet-route-grid/CometRouteGrid.tsx`（只播原镜头的这一段，时长常量 `COMET_ROUTE_GRID_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/grid-route-search/GridRouteSearch.tsx`：先读原镜头的卡 `references/groups-own/grid-route-search.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 50 帧（arrive1，合同）、第 61 帧（route2，合同）、第 70 帧（top，合同）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
