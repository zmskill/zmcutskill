---
name: idea-card-role-pills
中文名: 想法卡升起 · 输入框弹出打一句话再缩回
用途: 输入
时长: 4.3 秒（128 帧，30fps）
一句话: 白→粉渐变底，一张「新想法」卡从下面升上来，输入框弹出来（比卡还宽）逐字打一句话、再缩回卡里 →
来源镜头: idea-card-role-pills（整个镜头）
样片: demos-own/parts/idea-card-role-pills/preview.mp4
样片图: demos-own/parts/idea-card-role-pills/preview-sheet.jpg
---

## 动作
白→粉渐变底，一张「新想法」卡从下面升上来，输入框弹出来（比卡还宽）逐字打一句话、再缩回卡里 →

## 怎么进来
第一帧开始

## 注意
后面可以接 pills-out-progress-dashboard

## 怎么用
- 代码入口：`demos-own/parts/idea-card-role-pills/IdeaCardRolePills.tsx`（整个镜头，时长常量 `IDEA_CARD_ROLE_PILLS_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/idea-card-role-pills/IdeaCardRolePills.tsx`：先读原镜头的卡 `references/groups-own/idea-card-role-pills.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 9 帧（type，合同）、第 42 帧（done，合同）、第 51 帧（cut，合同）、第 52 帧（p1，合同）、第 56 帧（样片量的）、第 61 帧（p2，合同）、第 74 帧（p3，合同）、第 82 帧（样片量的）、第 87 帧（p4，合同）、第 96 帧（样片量的）、第 111 帧（样片量的）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
