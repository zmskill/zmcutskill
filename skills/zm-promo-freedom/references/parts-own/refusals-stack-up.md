---
name: refusals-stack-up
中文名: 问一句 · 拒绝回复一条条越堆越高
用途: 痛点
时长: 2.9 秒（86 帧，30fps）
一句话: 字退掉，框收成输入栏；用户问一句，左边一条条冒出拒绝回复，越堆越高
来源镜头: stop-chat-drag-trash（第 66–152 帧）
样片: demos-own/parts/refusals-stack-up/preview.mp4
样片图: demos-own/parts/refusals-stack-up/preview-sheet.jpg
---

## 动作
字退掉，框收成输入栏；用户问一句，左边一条条冒出拒绝回复，越堆越高

## 怎么进来
接上一拍的对话框

## 注意
"现有工具一到关键就不行"

## 怎么用
- 代码入口：`demos-own/parts/refusals-stack-up/RefusalsStackUp.tsx`（只播原镜头的这一段，时长常量 `REFUSALS_STACK_UP_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/stop-chat-drag-trash/StopChatDragTrash.tsx`：先读原镜头的卡 `references/groups-own/stop-chat-drag-trash.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 20 帧（shrink，合同）、第 31 帧（样片量的）、第 40 帧（ask，合同）、第 59 帧（reply1，合同）、第 66 帧（reply2，合同）、第 70 帧（样片量的）、第 74 帧（reply3，合同）、第 81 帧（reply4，合同）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
