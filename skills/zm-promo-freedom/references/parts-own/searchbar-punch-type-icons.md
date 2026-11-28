---
name: searchbar-punch-type-icons
中文名: 搜索栏被点中 · 两下猛推打字 · 图标滑进来
用途: 痛点
时长: 3.5 秒（105 帧，30fps）
一句话: 搜索栏被光标点中，镜头分两下猛推，打出一句话；图标一个个滑进栏里，镜头一下一下往右摇
来源镜头: search-trash-dock-buttons（第 0–105 帧）
样片: demos-own/parts/searchbar-punch-type-icons/preview.mp4
样片图: demos-own/parts/searchbar-punch-type-icons/preview-sheet.jpg
---

## 动作
搜索栏被光标点中，镜头分两下猛推，打出一句话；图标一个个滑进栏里，镜头一下一下往右摇

## 怎么进来
第一帧开始

## 怎么用
- 代码入口：`demos-own/parts/searchbar-punch-type-icons/SearchbarPunchTypeIcons.tsx`（只播原镜头的这一段，时长常量 `SEARCHBAR_PUNCH_TYPE_ICONS_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/search-trash-dock-buttons/SearchTrashDockButtons.tsx`：先读原镜头的卡 `references/groups-own/search-trash-dock-buttons.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 14 帧（cursorIn，合同）、第 22 帧（zoom1，合同）、第 37 帧（type，合同）、第 39 帧（zoom2，合同）、第 56 帧（icon1，合同）、第 67 帧（样片量的）、第 74 帧（icon2，合同）、第 80 帧（样片量的）、第 90 帧（icon3，合同）、第 95 帧（样片量的）、第 98 帧（样片量的）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
