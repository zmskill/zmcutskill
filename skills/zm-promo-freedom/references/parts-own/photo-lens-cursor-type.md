---
name: photo-lens-cursor-type
中文名: 满屏照片缩进透镜 · 缩成一根光标
用途: 转场
时长: 4.3 秒（129 帧，30fps）
一句话: 满屏照片缩进一个大玻璃透镜、一路缩成一根白色光标 → 光标往左滑到头，一道蓝色彗星光从左边追上来 →
来源镜头: photo-lens-cursor-type（整个镜头）
样片: demos-own/parts/photo-lens-cursor-type/preview.mp4
样片图: demos-own/parts/photo-lens-cursor-type/preview-sheet.jpg
---

## 动作
满屏照片缩进一个大玻璃透镜、一路缩成一根白色光标 → 光标往左滑到头，一道蓝色彗星光从左边追上来 →

## 怎么进来
第一帧开始

## 注意
从"很多东西"收到"开始输入"

## 怎么用
- 代码入口：`demos-own/parts/photo-lens-cursor-type/PhotoLensCursorType.tsx`（整个镜头，时长常量 `PHOTO_LENS_CURSOR_TYPE_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/photo-lens-cursor-type/PhotoLensCursorType.tsx`：先读原镜头的卡 `references/groups-own/photo-lens-cursor-type.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 1 帧（shrink，合同）、第 19 帧（cursor，合同）、第 33 帧（slide，合同）、第 47 帧（comet，合同）、第 57 帧（type，合同）、第 78 帧（done，合同）、第 114 帧（close，合同）、第 121 帧（样片量的）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
