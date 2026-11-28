---
name: trash-to-dock-button-swarm
中文名: 桶长成程序坞 · 点一下变按钮 · 按钮满屏飞
用途: 钩子
时长: 4.2 秒（126 帧，30fps）
一句话: 桶外长出底板、撑开成程序坞，新图标一个个弹进来；一点，坞变成一个按钮，按钮复制成一摞满屏乱飞，再一下子收走
来源镜头: search-trash-dock-buttons（第 171–297 帧）
样片: demos-own/parts/trash-to-dock-button-swarm/preview.mp4
样片图: demos-own/parts/trash-to-dock-button-swarm/preview-sheet.jpg
---

## 动作
桶外长出底板、撑开成程序坞，新图标一个个弹进来；一点，坞变成一个按钮，按钮复制成一摞满屏乱飞，再一下子收走

## 怎么进来
接上一拍的垃圾桶

## 怎么用
- 代码入口：`demos-own/parts/trash-to-dock-button-swarm/TrashToDockButtonSwarm.tsx`（只播原镜头的这一段，时长常量 `TRASH_TO_DOCK_BUTTON_SWARM_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/search-trash-dock-buttons/SearchTrashDockButtons.tsx`：先读原镜头的卡 `references/groups-own/search-trash-dock-buttons.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 5 帧（tile，合同）、第 19 帧（dock，合同）、第 44 帧（样片量的）、第 52 帧（click，合同）、第 65 帧（dup，合同）、第 96 帧（collapse，合同）、第 97 帧（outro，合同）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
