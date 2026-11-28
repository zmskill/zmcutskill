---
name: planet-glow-title-cut
中文名: 星球上沿亮起沉下去 · 标题逐词由糊变清
用途: 钩子
时长: 3.9 秒（117 帧，30fps）
一句话: 暗底下一颗星球的上沿亮起来、越来越白越来越大地沉下去，标题逐词由糊变清（最后一个词先蓝后白）→
来源镜头: planet-glow-title-cut（整个镜头）
样片: demos-own/parts/planet-glow-title-cut/preview.mp4
样片图: demos-own/parts/planet-glow-title-cut/preview-sheet.jpg
---

## 动作
暗底下一颗星球的上沿亮起来、越来越白越来越大地沉下去，标题逐词由糊变清（最后一个词先蓝后白）→

## 怎么进来
第一帧开始

## 怎么用
- 代码入口：`demos-own/parts/planet-glow-title-cut/PlanetGlowTitleCut.tsx`（整个镜头，时长常量 `PLANET_GLOW_TITLE_CUT_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/planet-glow-title-cut/PlanetGlowTitleCut.tsx`：先读原镜头的卡 `references/groups-own/planet-glow-title-cut.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 12 帧（w1，合同）、第 21 帧（w2，合同）、第 39 帧（w3，合同）、第 70 帧（样片量的）、第 81 帧（cut，合同）、第 84 帧（pop，合同）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
