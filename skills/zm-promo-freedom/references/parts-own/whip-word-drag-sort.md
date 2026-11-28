---
name: whip-word-drag-sort
中文名: 甩糊换词 · 拖一行到顶
用途: 功能演示
时长: 2.0 秒（61 帧，30fps）
一句话: 大字甩糊换成下一个词，光标拿起列表第三行拖到顶放下
来源镜头: task-card-three-verbs（第 173–234 帧）
样片: demos-own/parts/whip-word-drag-sort/preview.mp4
样片图: demos-own/parts/whip-word-drag-sort/preview-sheet.jpg
---

## 动作
大字甩糊换成下一个词，光标拿起列表第三行拖到顶放下

## 怎么进来
甩糊（自带）

## 怎么用
- 代码入口：`demos-own/parts/whip-word-drag-sort/WhipWordDragSort.tsx`（只播原镜头的这一段，时长常量 `WHIP_WORD_DRAG_SORT_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/ui-entrance/task-card-three-verbs/TaskCardThreeVerbs.tsx`：先读原镜头的卡 `references/shots-own/ui-entrance/task-card-three-verbs.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 13 帧（样片量的）、第 18 帧（样片量的）、第 24 帧（pick，合同）、第 47 帧（样片量的）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
