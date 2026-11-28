---
name: line-avatars-roles-zoom
中文名: 白线接着走 · 头像角色冒出 · 推近进度
用途: 功能演示
时长: 3.9 秒（118 帧，30fps）
一句话: 白线继续往右：协调人小卡、三个头像冒出来，角色标签出现，线接到项目卡，最后推近
来源镜头: card-line-flow（第 101–219 帧）
样片: demos-own/parts/line-avatars-roles-zoom/preview.mp4
样片图: demos-own/parts/line-avatars-roles-zoom/preview-sheet.jpg
---

## 动作
白线继续往右：协调人小卡、三个头像冒出来，角色标签出现，线接到项目卡，最后推近

## 怎么进来
接上一段的白线

## 怎么用
- 代码入口：`demos-own/parts/line-avatars-roles-zoom/LineAvatarsRolesZoom.tsx`（只播原镜头的这一段，时长常量 `LINE_AVATARS_ROLES_ZOOM_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/card-line-flow/CardLineFlow.tsx`：先读原镜头的卡 `references/groups-own/card-line-flow.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 22 帧（roles，合同）、第 40 帧（line4，合同）、第 55 帧（project，合同）、第 60 帧（样片量的）、第 71 帧（样片量的）、第 103 帧（zoom，合同）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
