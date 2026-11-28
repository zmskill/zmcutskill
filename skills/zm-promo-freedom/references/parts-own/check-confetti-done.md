---
name: check-confetti-done
中文名: 打勾 · 彩纸 · "已完成"胶囊
用途: 证据
时长: 2.5 秒（74 帧，30fps）
一句话: 滚词变蓝，光标按下变实心加彩纸，白勾写出、删除线划过，胶囊和计数跟着变，彩纸飘落淡出
来源镜头: task-card-three-verbs（第 296–370 帧）
样片: demos-own/parts/check-confetti-done/preview.mp4
样片图: demos-own/parts/check-confetti-done/preview-sheet.jpg
---

## 动作
滚词变蓝，光标按下变实心加彩纸，白勾写出、删除线划过，胶囊和计数跟着变，彩纸飘落淡出

## 怎么进来
接上一拍

## 注意
"搞定了"的那一下

## 怎么用
- 代码入口：`demos-own/parts/check-confetti-done/CheckConfettiDone.tsx`（只播原镜头的这一段，时长常量 `CHECK_CONFETTI_DONE_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/ui-entrance/task-card-three-verbs/TaskCardThreeVerbs.tsx`：先读原镜头的卡 `references/shots-own/ui-entrance/task-card-three-verbs.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 6 帧（样片量的）、第 20 帧（check，合同）、第 29 帧（done，合同）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
