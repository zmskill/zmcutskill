---
name: glow-flood-panel-reveal
中文名: 光晕胀满屏 · 面板从光里显出来
用途: 转场
时长: 2.9 秒（88 帧，30fps）
一句话: 一个词的光晕胀大到满屏变白，退光时面板从光里显影；面板换角度、里面的小球依次亮
来源镜头: orb-relay-explainer（第 150–238 帧）
样片: demos-own/parts/glow-flood-panel-reveal/preview.mp4
样片图: demos-own/parts/glow-flood-panel-reveal/preview-sheet.jpg
---

## 动作
一个词的光晕胀大到满屏变白，退光时面板从光里显影；面板换角度、里面的小球依次亮

## 怎么进来
接在上一个画面的亮点上

## 注意
只当转场用取前 27 帧（光晕胀满 → 退光）

## 怎么用
- 代码入口：`demos-own/parts/glow-flood-panel-reveal/GlowFloodPanelReveal.tsx`（只播原镜头的这一段，时长常量 `GLOW_FLOOD_PANEL_REVEAL_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/opening/orb-relay-explainer/OrbRelayExplainer.tsx`：先读原镜头的卡 `references/shots-own/opening/orb-relay-explainer.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 9 帧（样片量的）、第 12 帧（样片量的）、第 28 帧（样片量的）、第 60 帧（样片量的）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
