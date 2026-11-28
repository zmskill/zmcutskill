---
name: icons-orbit-input-type
中文名: 图标绕着输入框转 · 框里打字
用途: 输入
时长: 2.1 秒（63 帧，30fps）
一句话: 切到一个白色输入框，AI 图标绕着它转，框里逐字打一句话
来源镜头: type-icons-orbit-input（第 71–134 帧）
样片: demos-own/parts/icons-orbit-input-type/preview.mp4
样片图: demos-own/parts/icons-orbit-input-type/preview-sheet.jpg
---

## 动作
切到一个白色输入框，AI 图标绕着它转，框里逐字打一句话

## 怎么进来
硬切

## 怎么用
- 代码入口：`demos-own/parts/icons-orbit-input-type/IconsOrbitInputType.tsx`（只播原镜头的这一段，时长常量 `ICONS_ORBIT_INPUT_TYPE_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/type-icons-orbit-input/TypeIconsOrbitInput.tsx`：先读原镜头的卡 `references/groups-own/type-icons-orbit-input.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 15 帧（cut1，合同）、第 17 帧（orbit，合同）、第 59 帧（typed，合同）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
