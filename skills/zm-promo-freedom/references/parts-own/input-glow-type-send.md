---
name: input-glow-type-send
中文名: 推近输入框 · 发光打字 · 点发送
用途: 输入
时长: 3.2 秒（95 帧，30fps）
一句话: 推近输入框逐字打一句话（新字先紫色发虚再变清楚，框上沿一道紫橙光），镜头跟到发送键，点下去
来源镜头: prompt-send-rings-card（第 55–150 帧）
样片: demos-own/parts/input-glow-type-send/preview.mp4
样片图: demos-own/parts/input-glow-type-send/preview-sheet.jpg
---

## 动作
推近输入框逐字打一句话（新字先紫色发虚再变清楚，框上沿一道紫橙光），镜头跟到发送键，点下去

## 怎么进来
接上一段

## 怎么用
- 代码入口：`demos-own/parts/input-glow-type-send/InputGlowTypeSend.tsx`（只播原镜头的这一段，时长常量 `INPUT_GLOW_TYPE_SEND_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/prompt-send-rings-card/PromptSendRingsCard.tsx`：先读原镜头的卡 `references/groups-own/prompt-send-rings-card.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 1 帧（focus，合同）、第 20 帧（type，合同）、第 77 帧（send，合同）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
