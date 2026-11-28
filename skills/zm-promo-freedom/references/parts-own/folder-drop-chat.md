---
name: folder-drop-chat
中文名: 玻璃文件夹拖进聊天面板 · 边拖边打字
用途: 功能演示
时长: 2.9 秒（88 帧，30fps）
一句话: 接上一拍拖着的玻璃文件夹——硬切米色底，聊天面板从右边滑进来接住它；边拖边打字（紫色），
来源镜头: folder-drop-chat（整个镜头）
样片: demos-own/parts/folder-drop-chat/preview.mp4
样片图: demos-own/parts/folder-drop-chat/preview-sheet.jpg
---

## 动作
接上一拍拖着的玻璃文件夹——硬切米色底，聊天面板从右边滑进来接住它；边拖边打字（紫色），

## 怎么进来
硬切，接上一拍拖着的文件夹

## 注意
前面可以接 dock-grab-folder-drag

## 怎么用
- 代码入口：`demos-own/parts/folder-drop-chat/FolderDropChat.tsx`（整个镜头，时长常量 `FOLDER_DROP_CHAT_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/folder-drop-chat/FolderDropChat.tsx`：先读原镜头的卡 `references/groups-own/folder-drop-chat.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 1 帧（panel，合同）、第 2 帧（type，合同）、第 25 帧（样片量的）、第 45 帧（type2，合同）、第 47 帧（drop，合同）、第 53 帧（样片量的）、第 58 帧（type3，合同）、第 74 帧（press，合同）、第 80 帧（ring，合同）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
