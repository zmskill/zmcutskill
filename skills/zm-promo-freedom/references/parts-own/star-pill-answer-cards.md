---
name: star-pill-answer-cards
中文名: 四角星长出输入胶囊 · 打一句提问 · 出答案卡
用途: 输入
时长: 4.7 秒（141 帧，30fps）
一句话: 一颗发光的蓝色四角星 → 外面长出一个圆、往左挪 → 右边撑开一条输入胶囊、逐字打一句提问 →
来源镜头: star-pill-answer-cards（整个镜头）
样片: demos-own/parts/star-pill-answer-cards/preview.mp4
样片图: demos-own/parts/star-pill-answer-cards/preview-sheet.jpg
---

## 动作
一颗发光的蓝色四角星 → 外面长出一个圆、往左挪 → 右边撑开一条输入胶囊、逐字打一句提问 →

## 怎么进来
第一帧开始

## 怎么用
- 代码入口：`demos-own/parts/star-pill-answer-cards/StarPillAnswerCards.tsx`（整个镜头，时长常量 `STAR_PILL_ANSWER_CARDS_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/star-pill-answer-cards/StarPillAnswerCards.tsx`：先读原镜头的卡 `references/groups-own/star-pill-answer-cards.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 9 帧（ring，合同）、第 34 帧（pill，合同）、第 44 帧（type，合同）、第 60 帧（pull，合同）、第 70 帧（cards，合同）、第 85 帧（样片量的）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
