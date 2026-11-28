---
name: word-shrink-card-slam
中文名: 大字越缩越快 · 白卡片砸下来 · 界面显出
用途: 结果登场
时长: 2.3 秒（70 帧，30fps）
一句话: 大字先冲上来再越缩越快，一张白卡片砸下来、四边拉出参考线；一句话逐词出，卡片里从左上显出界面（先蓝后清）
来源镜头: smarter-card-board-tilt（第 0–70 帧）
样片: demos-own/parts/word-shrink-card-slam/preview.mp4
样片图: demos-own/parts/word-shrink-card-slam/preview-sheet.jpg
---

## 动作
大字先冲上来再越缩越快，一张白卡片砸下来、四边拉出参考线；一句话逐词出，卡片里从左上显出界面（先蓝后清）

## 怎么进来
第一帧开始

## 怎么用
- 代码入口：`demos-own/parts/word-shrink-card-slam/WordShrinkCardSlam.tsx`（只播原镜头的这一段，时长常量 `WORD_SHRINK_CARD_SLAM_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/smarter-card-board-tilt/SmarterCardBoardTilt.tsx`：先读原镜头的卡 `references/groups-own/smarter-card-board-tilt.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 8 帧（样片量的）、第 26 帧（card，合同）、第 40 帧（line，合同）、第 46 帧（样片量的）、第 60 帧（样片量的）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
