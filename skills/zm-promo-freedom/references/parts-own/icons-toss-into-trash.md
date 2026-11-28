---
name: icons-toss-into-trash
中文名: 图标被抛起 · 翻着掉进垃圾桶
用途: 痛点
时长: 2.2 秒（66 帧，30fps）
一句话: 硬切：图标被抛起、翻着掉进升上来的垃圾桶，上面一行行亮出字
来源镜头: search-trash-dock-buttons（第 105–171 帧）
样片: demos-own/parts/icons-toss-into-trash/preview.mp4
样片图: demos-own/parts/icons-toss-into-trash/preview-sheet.jpg
---

## 动作
硬切：图标被抛起、翻着掉进升上来的垃圾桶，上面一行行亮出字

## 怎么进来
硬切

## 注意
"装了一堆工具反而更累"

## 怎么用
- 代码入口：`demos-own/parts/icons-toss-into-trash/IconsTossIntoTrash.tsx`（只播原镜头的这一段，时长常量 `ICONS_TOSS_INTO_TRASH_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/search-trash-dock-buttons/SearchTrashDockButtons.tsx`：先读原镜头的卡 `references/groups-own/search-trash-dock-buttons.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 17 帧（cut，合同）、第 27 帧（trash，合同）、第 38 帧（drop，合同）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
