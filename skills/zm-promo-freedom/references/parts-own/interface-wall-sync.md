---
name: interface-wall-sync
中文名: 界面墙斜着浮出 · 两句好处 · 过曝到白
用途: 列举
时长: 4.5 秒（135 帧，30fps）
一句话: 一整面斜铺的产品界面墙从虚里浮出来、往左上滑、一路减速慢漂，上方两句好处逐词出现；最后整个画面猛地变虚过曝到白
来源镜头: interface-wall-sync（整个镜头）
样片: demos-own/parts/interface-wall-sync/preview.mp4
样片图: demos-own/parts/interface-wall-sync/preview-sheet.jpg
---

## 动作
一整面斜铺的产品界面墙从虚里浮出来、往左上滑、一路减速慢漂，上方两句好处逐词出现；最后整个画面猛地变虚过曝到白

## 怎么进来
浅色底

## 注意
结尾纯白，接品牌落版

## 怎么用
- 代码入口：`demos-own/parts/interface-wall-sync/InterfaceWallSync.tsx`（整个镜头，时长常量 `INTERFACE_WALL_SYNC_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/interface-wall-sync/InterfaceWallSync.tsx`：先读原镜头的卡 `references/groups-own/interface-wall-sync.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 2 帧（wall，合同）、第 8 帧（line1，合同）、第 16 帧（line2，合同）、第 27 帧（read，合同）、第 48 帧（样片量的）、第 126 帧（flash，合同）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
