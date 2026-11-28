---
name: photo-flash-bulge
中文名: 照片飞快地换 · 最后一张鼓起来撑满
用途: 转场
时长: 1.8 秒（53 帧，30fps）
一句话: 按钮拉成两道光带分开，中间冒出小照片，背景铺开像素格；照片一张接一张飞快地换、边换边变大、越来越霓虹，最后一张四边内凹、鼓起来撑满画面
来源镜头: photo-flash-bulge（整个镜头）
样片: demos-own/parts/photo-flash-bulge/preview.mp4
样片图: demos-own/parts/photo-flash-bulge/preview-sheet.jpg
---

## 动作
按钮拉成两道光带分开，中间冒出小照片，背景铺开像素格；照片一张接一张飞快地换、边换边变大、越来越霓虹，最后一张四边内凹、鼓起来撑满画面

## 怎么进来
接按下的按钮

## 怎么用
- 代码入口：`demos-own/parts/photo-flash-bulge/PhotoFlashBulge.tsx`（整个镜头，时长常量 `PHOTO_FLASH_BULGE_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/photo-flash-bulge/PhotoFlashBulge.tsx`：先读原镜头的卡 `references/groups-own/photo-flash-bulge.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 4 帧（first，合同）、第 11 帧（flick，合同）、第 18 帧（neon，合同）、第 42 帧（bulge，合同）、第 48 帧（fill，合同）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
