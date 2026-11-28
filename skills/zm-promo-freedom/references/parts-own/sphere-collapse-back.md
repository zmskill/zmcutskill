---
name: sphere-collapse-back
中文名: 球缩回按钮
用途: 过渡动作
时长: 1.9 秒（56 帧，30fps）
一句话: 按两次 Esc：搜索清空全部亮回，球缩小变玻璃飞回按钮，图标重现
来源镜头: sticker-sphere-picker（第 429–485 帧）
样片: demos-own/parts/sphere-collapse-back/preview.mp4
样片图: demos-own/parts/sphere-collapse-back/preview-sheet.jpg
---

## 动作
按两次 Esc：搜索清空全部亮回，球缩小变玻璃飞回按钮，图标重现

## 怎么进来
接上一拍的球

## 怎么用
- 代码入口：`demos-own/parts/sphere-collapse-back/SphereCollapseBack.tsx`（只播原镜头的这一段，时长常量 `SPHERE_COLLAPSE_BACK_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/ui-entrance/sticker-sphere-picker/StickerSpherePicker.tsx`：先读原镜头的卡 `references/shots-own/ui-entrance/sticker-sphere-picker.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 7 帧（样片量的）、第 49 帧（样片量的）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
