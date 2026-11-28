---
name: rays-panel-wave-strobe
中文名: 射线图 · 面板推进来 · 声波柱流动 · 频闪
用途: 结果登场
时长: 3.7 秒（111 帧，30fps）
一句话: 一帧换成射线图，彩色小方块沿射线往中心流；白底面板从右推进来，面板上的短划涨成波形往右流，最后频闪冲出
来源镜头: tag-decode-ring-wave（第 212–323 帧）
样片: demos-own/parts/rays-panel-wave-strobe/preview.mp4
样片图: demos-own/parts/rays-panel-wave-strobe/preview-sheet.jpg
---

## 动作
一帧换成射线图，彩色小方块沿射线往中心流；白底面板从右推进来，面板上的短划涨成波形往右流，最后频闪冲出

## 怎么进来
一帧切

## 注意
"零散信息收拢成一段可用的东西"

## 怎么用
- 代码入口：`demos-own/parts/rays-panel-wave-strobe/RaysPanelWaveStrobe.tsx`（只播原镜头的这一段，时长常量 `RAYS_PANEL_WAVE_STROBE_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/tag-decode-ring-wave/TagDecodeRingWave.tsx`：先读原镜头的卡 `references/groups-own/tag-decode-ring-wave.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 5 帧（panel，合同）、第 16 帧（dock，合同）、第 46 帧（wave，合同）、第 58 帧（accel，合同）、第 99 帧（strobe，合同）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
