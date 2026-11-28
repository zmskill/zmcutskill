---
name: name-wipe-word-swap
中文名: 擦掉名字 · 原地换词停在转折词
用途: 字卡
时长: 1.5 秒（44 帧，30fps）
一句话: 从左擦掉名字，副标题居中，原地换词，最后换成一个转折词停住
来源镜头: giant-word-logo-lockup（第 126–170 帧）
样片: demos-own/parts/name-wipe-word-swap/preview.mp4
样片图: demos-own/parts/name-wipe-word-swap/preview-sheet.jpg
---

## 动作
从左擦掉名字，副标题居中，原地换词，最后换成一个转折词停住

## 怎么进来
接上一拍的落版

## 注意
接转折

## 怎么用
- 代码入口：`demos-own/parts/name-wipe-word-swap/NameWipeWordSwap.tsx`（只播原镜头的这一段，时长常量 `NAME_WIPE_WORD_SWAP_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/giant-word-logo-lockup/GiantWordLogoLockup.tsx`：先读原镜头的卡 `references/groups-own/giant-word-logo-lockup.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 11 帧（swap，合同）、第 26 帧（turn，合同）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
