---
name: pills-out-progress-dashboard
中文名: 胶囊一条条甩出去 · 进度卡清单打勾
用途: 证据
时长: 3.8 秒（113 帧，30fps）
一句话: 上一拍的四条角色胶囊一条条往左甩出去 → 一张「项目进度」卡从右边滑到中间，清单一项项打勾、进度条往前涨 →
来源镜头: pills-out-progress-dashboard（整个镜头）
样片: demos-own/parts/pills-out-progress-dashboard/preview.mp4
样片图: demos-own/parts/pills-out-progress-dashboard/preview-sheet.jpg
---

## 动作
上一拍的四条角色胶囊一条条往左甩出去 → 一张「项目进度」卡从右边滑到中间，清单一项项打勾、进度条往前涨 →

## 怎么进来
接上一拍的四条胶囊

## 注意
前面接 idea-card-role-pills

## 怎么用
- 代码入口：`demos-own/parts/pills-out-progress-dashboard/PillsOutProgressDashboard.tsx`（整个镜头，时长常量 `PILLS_OUT_PROGRESS_DASHBOARD_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/pills-out-progress-dashboard/PillsOutProgressDashboard.tsx`：先读原镜头的卡 `references/groups-own/pills-out-progress-dashboard.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 2 帧（out，合同）、第 12 帧（card，合同）、第 17 帧（样片量的）、第 24 帧（tick1，合同）、第 34 帧（tick2，合同）、第 68 帧（page，合同）、第 73 帧（样片量的）、第 78 帧（样片量的）、第 100 帧（up，合同）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
