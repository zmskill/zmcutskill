---
name: button-grow-sphere-spin
中文名: 按钮长成 3D 球 · 拖着转
用途: 功能演示
时长: 5.5 秒（164 帧，30fps）
一句话: 点按钮，图标淡掉，玻璃小球从按钮里冒出来边转边长大飞到输入框上方；光标拖着球横转、反转、斜翻
来源镜头: sticker-sphere-picker（第 22–186 帧）
样片: demos-own/parts/button-grow-sphere-spin/preview.mp4
样片图: demos-own/parts/button-grow-sphere-spin/preview-sheet.jpg
---

## 动作
点按钮，图标淡掉，玻璃小球从按钮里冒出来边转边长大飞到输入框上方；光标拖着球横转、反转、斜翻

## 怎么进来
光标已在按钮上

## 注意
弹出必须是"从按钮里长出来"，不能淡入

## 怎么用
- 代码入口：`demos-own/parts/button-grow-sphere-spin/ButtonGrowSphereSpin.tsx`（只播原镜头的这一段，时长常量 `BUTTON_GROW_SPHERE_SPIN_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/ui-entrance/sticker-sphere-picker/StickerSpherePicker.tsx`：先读原镜头的卡 `references/shots-own/ui-entrance/sticker-sphere-picker.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 26 帧（样片量的）、第 78 帧（样片量的）、第 101 帧（样片量的）、第 113 帧（样片量的）、第 142 帧（样片量的）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
