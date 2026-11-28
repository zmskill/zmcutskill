---
name: input-closeup-send-drop
中文名: 输入框特写 · 打字 · 横冲点发送
用途: 输入
时长: 1.9 秒（58 帧，30fps）
一句话: 硬切输入框特写，光标指上、转身、打字，横冲向发送键停 0.25 秒按下，输入框从光标下面掉走
来源镜头: agent-browse-match（第 38–96 帧）
样片: demos-own/parts/input-closeup-send-drop/preview.mp4
样片图: demos-own/parts/input-closeup-send-drop/preview-sheet.jpg
---

## 动作
硬切输入框特写，光标指上、转身、打字，横冲向发送键停 0.25 秒按下，输入框从光标下面掉走

## 怎么进来
硬切

## 怎么用
- 代码入口：`demos-own/parts/input-closeup-send-drop/InputCloseupSendDrop.tsx`（只播原镜头的这一段，时长常量 `INPUT_CLOSEUP_SEND_DROP_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/ui-entrance/agent-browse-match/AgentBrowseMatch.tsx`：先读原镜头的卡 `references/shots-own/ui-entrance/agent-browse-match.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：没量到：从原镜头代码里定。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
