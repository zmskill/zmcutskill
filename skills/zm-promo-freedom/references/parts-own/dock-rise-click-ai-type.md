---
name: dock-rise-click-ai-type
中文名: 程序坞升起 · 点中 AI 图标 · 输入条打字
用途: 输入
时长: 2.3 秒（69 帧，30fps）
一句话: 硬切白底：文件夹散在四周、底下程序坞升上来，光标点中一个 AI 图标，上方撑开输入条逐字打一句话
来源镜头: folder-type-dock（第 35–104 帧）
样片: demos-own/parts/dock-rise-click-ai-type/preview.mp4
样片图: demos-own/parts/dock-rise-click-ai-type/preview-sheet.jpg
---

## 动作
硬切白底：文件夹散在四周、底下程序坞升上来，光标点中一个 AI 图标，上方撑开输入条逐字打一句话

## 怎么进来
硬切

## 怎么用
- 代码入口：`demos-own/parts/dock-rise-click-ai-type/DockRiseClickAiType.tsx`（只播原镜头的这一段，时长常量 `DOCK_RISE_CLICK_AI_TYPE_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/folder-type-dock/FolderTypeDock.tsx`：先读原镜头的卡 `references/groups-own/folder-type-dock.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 1 帧（dock，合同）、第 6 帧（click，合同）、第 24 帧（bar，合同）、第 27 帧（type，合同）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
