---
name: word-card-rise
中文名: 逐词字卡 · 词浮上来变实
用途: 字卡
时长: 1.9 秒（56 帧，30fps）
一句话: 缩小失焦硬切到字卡：词一个个偏低、发虚、竖向拉伸着浮上来变实，重点词底下一块高亮从左擦出，最后失焦切走
来源镜头: prompt-to-site-wall（第 220–276 帧）
样片: demos-own/parts/word-card-rise/preview.mp4
样片图: demos-own/parts/word-card-rise/preview-sheet.jpg
---

## 动作
缩小失焦硬切到字卡：词一个个偏低、发虚、竖向拉伸着浮上来变实，重点词底下一块高亮从左擦出，最后失焦切走

## 怎么进来
失焦爬坡硬切

## 注意
放一句"功能名 + 好处"；两头自带失焦转场

## 怎么用
- 代码入口：`demos-own/parts/word-card-rise/WordCardRise.tsx`（只播原镜头的这一段，时长常量 `WORD_CARD_RISE_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/ui-entrance/prompt-to-site-wall/PromptToSiteWall.tsx`：先读原镜头的卡 `references/shots-own/ui-entrance/prompt-to-site-wall.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 6 帧（样片量的）、第 19 帧（样片量的）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
