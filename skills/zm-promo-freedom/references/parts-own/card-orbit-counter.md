---
name: card-orbit-counter
中文名: 卡片绕大数字转 · 数字滚到终值
用途: 证据
时长: 3.8 秒（114 帧，30fps）
一句话: 一圈 3D 场景卡片贴在圆筒上绕着中间的大数字转（前景卡往左上变大、远景卡往右上变小、前景卡会擦过把数字挡住），数字线性滚到终值的那一刻正好镜头甩得最快，长尾减速后所有卡收进文件夹
来源镜头: card-orbit-counter（整个镜头）
样片: demos-own/parts/card-orbit-counter/preview.mp4
样片图: demos-own/parts/card-orbit-counter/preview-sheet.jpg
---

## 动作
一圈 3D 场景卡片贴在圆筒上绕着中间的大数字转（前景卡往左上变大、远景卡往右上变小、前景卡会擦过把数字挡住），数字线性滚到终值的那一刻正好镜头甩得最快，长尾减速后所有卡收进文件夹

## 怎么进来
第一帧开始

## 注意
数量感的证据

## 怎么用
- 代码入口：`demos-own/parts/card-orbit-counter/CardOrbitCounter.tsx`（整个镜头，时长常量 `CARD_ORBIT_COUNTER_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/data/card-orbit-counter/CardOrbitCounter.tsx`：先读原镜头的卡 `references/shots-own/data/card-orbit-counter.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 87 帧（样片量的）、第 104 帧（样片量的）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
