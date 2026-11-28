---
name: word-whip-chatbox-type
中文名: 一个词往左一甩 · 黑色对话框滑进来打字
用途: 痛点
时长: 2.2 秒（66 帧，30fps）
一句话: 一个词居中，往左一甩，黑色对话框滑进来，逐词打出一句话
来源镜头: stop-chat-drag-trash（第 0–66 帧）
样片: demos-own/parts/word-whip-chatbox-type/preview.mp4
样片图: demos-own/parts/word-whip-chatbox-type/preview-sheet.jpg
---

## 动作
一个词居中，往左一甩，黑色对话框滑进来，逐词打出一句话

## 怎么进来
第一帧开始

## 怎么用
- 代码入口：`demos-own/parts/word-whip-chatbox-type/WordWhipChatboxType.tsx`（只播原镜头的这一段，时长常量 `WORD_WHIP_CHATBOX_TYPE_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/stop-chat-drag-trash/StopChatDragTrash.tsx`：先读原镜头的卡 `references/groups-own/stop-chat-drag-trash.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 6 帧（word，合同）、第 36 帧（swing，合同）、第 46 帧（type，合同）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
