---
name: button-expand-create-card
中文名: 按钮撑开成新建卡 · 打字出标签
用途: 功能演示
时长: 5.8 秒（173 帧，30fps）
一句话: 大字逐字出，光标点按钮，按钮原地撑开成新建卡；输入一句话自动出三个标签，点确定后卡变成列表
来源镜头: task-card-three-verbs（第 0–173 帧）
样片: demos-own/parts/button-expand-create-card/preview.mp4
样片图: demos-own/parts/button-expand-create-card/preview-sheet.jpg
---

## 动作
大字逐字出，光标点按钮，按钮原地撑开成新建卡；输入一句话自动出三个标签，点确定后卡变成列表

## 怎么进来
第一帧开始

## 注意
5.8 秒，较长；只要"按钮撑开成卡"取 35–100 帧

## 怎么用
- 代码入口：`demos-own/parts/button-expand-create-card/ButtonExpandCreateCard.tsx`（只播原镜头的这一段，时长常量 `BUTTON_EXPAND_CREATE_CARD_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/ui-entrance/task-card-three-verbs/TaskCardThreeVerbs.tsx`：先读原镜头的卡 `references/shots-own/ui-entrance/task-card-three-verbs.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 8 帧（headline，合同）、第 35 帧（press，合同）、第 38 帧（card，合同）、第 46 帧（样片量的）、第 54 帧（typing，合同）、第 107 帧（tags，合同）、第 139 帧（add，合同）、第 145 帧（list，合同）、第 150 帧（样片量的）、第 160 帧（样片量的）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
