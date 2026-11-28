---
name: words-float-photo-cloud
中文名: 词高低错落浮上来 · 照片云
用途: 钩子
时长: 4.5 秒（135 帧，30fps）
一句话: 粉白渐变底，一句话的词高低错落、带着糊从下面浮上来（两行接力）→ 一张糊掉的白卡从镜头前擦过 →
来源镜头: words-float-photo-cloud（整个镜头）
样片: demos-own/parts/words-float-photo-cloud/preview.mp4
样片图: demos-own/parts/words-float-photo-cloud/preview-sheet.jpg
---

## 动作
粉白渐变底，一句话的词高低错落、带着糊从下面浮上来（两行接力）→ 一张糊掉的白卡从镜头前擦过 →

## 怎么进来
第一帧开始

## 怎么用
- 代码入口：`demos-own/parts/words-float-photo-cloud/WordsFloatPhotoCloud.tsx`（整个镜头，时长常量 `WORDS_FLOAT_PHOTO_CLOUD_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/words-float-photo-cloud/WordsFloatPhotoCloud.tsx`：先读原镜头的卡 `references/groups-own/words-float-photo-cloud.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 3 帧（w1，合同）、第 30 帧（w2，合同）、第 66 帧（wipe，合同）、第 69 帧（cloud，合同）、第 78 帧（样片量的）、第 117 帧（gather，合同）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
