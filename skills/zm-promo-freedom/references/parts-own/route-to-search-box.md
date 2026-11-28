---
name: route-to-search-box
中文名: 第二条线走到第二站 · 线头变成搜索框打字
用途: 结果登场
时长: 4.5 秒（136 帧，30fps）
一句话: 镜头转正成俯视，紫粉线拐两个弯到第二个地点；镜头扎近，线头鼓成胶囊、变成搜索框，框里打字；搜索框缩小往后一翻
来源镜头: grid-route-search（第 71–207 帧）
样片: demos-own/parts/route-to-search-box/preview.mp4
样片图: demos-own/parts/route-to-search-box/preview-sheet.jpg
---

## 动作
镜头转正成俯视，紫粉线拐两个弯到第二个地点；镜头扎近，线头鼓成胶囊、变成搜索框，框里打字；搜索框缩小往后一翻

## 怎么进来
接上一拍的地图

## 怎么用
- 代码入口：`demos-own/parts/route-to-search-box/RouteToSearchBox.tsx`（只播原镜头的这一段，时长常量 `ROUTE_TO_SEARCH_BOX_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/grid-route-search/GridRouteSearch.tsx`：先读原镜头的卡 `references/groups-own/grid-route-search.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 23 帧（turn，合同）、第 62 帧（arrive2，合同）、第 79 帧（pill，合同）、第 87 帧（box，合同）、第 91 帧（type，合同）、第 96 帧（样片量的）、第 116 帧（样片量的）、第 127 帧（flip，合同）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
