---
name: dock-grab-folder-drag
中文名: 抓起文件夹拖走
用途: 过渡动作
时长: 3.0 秒（91 帧，30fps）
一句话: 光标抓起一个文件夹（变成玻璃质感），拖着往右走出画面
来源镜头: folder-type-dock（第 104–195 帧）
样片: demos-own/parts/dock-grab-folder-drag/preview.mp4
样片图: demos-own/parts/dock-grab-folder-drag/preview-sheet.jpg
---

## 动作
光标抓起一个文件夹（变成玻璃质感），拖着往右走出画面

## 怎么进来
接上一段

## 注意
后面接 folder-drop-chat

## 怎么用
- 代码入口：`demos-own/parts/dock-grab-folder-drag/DockGrabFolderDrag.tsx`（只播原镜头的这一段，时长常量 `DOCK_GRAB_FOLDER_DRAG_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/folder-type-dock/FolderTypeDock.tsx`：先读原镜头的卡 `references/groups-own/folder-type-dock.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 32 帧（grab，合同）、第 62 帧（drag，合同）、第 90 帧（exit，合同）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
