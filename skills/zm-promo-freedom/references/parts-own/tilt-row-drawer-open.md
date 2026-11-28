---
name: tilt-row-drawer-open
中文名: 斜着压近看一行 · 右边滑出详情
用途: 功能演示
时长: 2.6 秒（79 帧，30fps）
一句话: 镜头斜着压过去看这一行再回正，右边滑出详情面板
来源镜头: board-bell-toast-drawer（第 143–222 帧）
样片: demos-own/parts/tilt-row-drawer-open/preview.mp4
样片图: demos-own/parts/tilt-row-drawer-open/preview-sheet.jpg
---

## 动作
镜头斜着压过去看这一行再回正，右边滑出详情面板

## 怎么进来
接上一拍的表格

## 注意
斜看是逐帧量的整屏变换，不许改成普通旋转

## 怎么用
- 代码入口：`demos-own/parts/tilt-row-drawer-open/TiltRowDrawerOpen.tsx`（只播原镜头的这一段，时长常量 `TILT_ROW_DRAWER_OPEN_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/board-bell-toast-drawer/BoardBellToastDrawer.tsx`：先读原镜头的卡 `references/groups-own/board-bell-toast-drawer.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 5 帧（tilt，合同）、第 17 帧（样片量的）、第 47 帧（样片量的）、第 52 帧（drawer，合同）、第 66 帧（样片量的）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
