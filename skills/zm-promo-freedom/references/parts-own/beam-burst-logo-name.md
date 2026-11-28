---
name: beam-burst-logo-name
中文名: 光束放射 · 亮成标志 · 名字
用途: 品牌落版
时长: 4.2 秒（125 帧，30fps）
一句话: 句子一甩淡掉，图标射出一圈绿色光束，光束里亮出标志，变白，下面出名字，落定
来源镜头: word-insert-beam-logo（第 75–200 帧）
样片: demos-own/parts/beam-burst-logo-name/preview.mp4
样片图: demos-own/parts/beam-burst-logo-name/preview-sheet.jpg
---

## 动作
句子一甩淡掉，图标射出一圈绿色光束，光束里亮出标志，变白，下面出名字，落定

## 怎么进来
接上一段的图标

## 注意
原镜头后面还有 2 秒停留，没切进来

## 怎么用
- 代码入口：`demos-own/parts/beam-burst-logo-name/BeamBurstLogoName.tsx`（只播原镜头的这一段，时长常量 `BEAM_BURST_LOGO_NAME_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/word-insert-beam-logo/WordInsertBeamLogo.tsx`：先读原镜头的卡 `references/groups-own/word-insert-beam-logo.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 13 帧（whip，合同）、第 18 帧（样片量的）、第 24 帧（beam，合同）、第 69 帧（white，合同）、第 77 帧（name，合同）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
