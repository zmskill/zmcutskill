---
name: message-ribbon-flow
中文名: 通知卡飞过 · 落到飘带上一直流
用途: 痛点
时长: 5.0 秒（150 帧，30fps）
一句话: 问句先出，一大片通知卡从镜头前飞过、落到一条弯曲的 3D 飘带上一直流动，最后中间亮起光点、整屏失焦过曝转场
来源镜头: message-ribbon-flow（整个镜头）
样片: demos-own/parts/message-ribbon-flow/preview.mp4
样片图: demos-own/parts/message-ribbon-flow/preview-sheet.jpg
---

## 动作
问句先出，一大片通知卡从镜头前飞过、落到一条弯曲的 3D 飘带上一直流动，最后中间亮起光点、整屏失焦过曝转场

## 怎么进来
第一帧开始

## 注意
结尾过曝到白，可以接 overexpose-focus-logo-podium

## 怎么用
- 代码入口：`demos-own/parts/message-ribbon-flow/MessageRibbonFlow.tsx`（整个镜头，时长常量 `MESSAGE_RIBBON_FLOW_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/opening/message-ribbon-flow/MessageRibbonFlow.tsx`：先读原镜头的卡 `references/shots-own/opening/message-ribbon-flow.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 133 帧（样片量的）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
