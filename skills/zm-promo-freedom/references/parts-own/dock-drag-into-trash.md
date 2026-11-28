---
name: dock-drag-into-trash
中文名: 程序坞升起 · 把图标连对话一起拖进垃圾桶
用途: 痛点
时长: 2.8 秒（84 帧，30fps）
一句话: 整块往上让，下面升起程序坞；光标把图标拖出来，对话框缩成细条、那串回复像尾巴一样跟着甩过去，一起被吸进垃圾桶
来源镜头: stop-chat-drag-trash（第 152–236 帧）
样片: demos-own/parts/dock-drag-into-trash/preview.mp4
样片图: demos-own/parts/dock-drag-into-trash/preview-sheet.jpg
---

## 动作
整块往上让，下面升起程序坞；光标把图标拖出来，对话框缩成细条、那串回复像尾巴一样跟着甩过去，一起被吸进垃圾桶

## 怎么进来
接上一拍的回复

## 怎么用
- 代码入口：`demos-own/parts/dock-drag-into-trash/DockDragIntoTrash.tsx`（只播原镜头的这一段，时长常量 `DOCK_DRAG_INTO_TRASH_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/stop-chat-drag-trash/StopChatDragTrash.tsx`：先读原镜头的卡 `references/groups-own/stop-chat-drag-trash.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 10 帧（dock，合同）、第 16 帧（样片量的）、第 32 帧（grab，合同）、第 42 帧（lift，合同）、第 50 帧（suck，合同）、第 64 帧（drop，合同）、第 78 帧（gone，合同）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
