---
name: field-slide-eye-stars
中文名: 只留一个词 · 输入框滑入 · 点眼睛变星号
用途: 功能演示
时长: 4.5 秒（134 帧，30fps）
一句话: 换一句话，中间的词退掉只剩一个；右边滑进一个大输入框，镜头跟着往右摇；手点框尾的眼睛，眼睛划掉、字变星号
来源镜头: decode-word-password-field（第 42–176 帧）
样片: demos-own/parts/field-slide-eye-stars/preview.mp4
样片图: demos-own/parts/field-slide-eye-stars/preview-sheet.jpg
---

## 动作
换一句话，中间的词退掉只剩一个；右边滑进一个大输入框，镜头跟着往右摇；手点框尾的眼睛，眼睛划掉、字变星号

## 怎么进来
接上一拍的字

## 怎么用
- 代码入口：`demos-own/parts/field-slide-eye-stars/FieldSlideEyeStars.tsx`（只播原镜头的这一段，时长常量 `FIELD_SLIDE_EYE_STARS_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/decode-word-password-field/DecodeWordPasswordField.tsx`：先读原镜头的卡 `references/groups-own/decode-word-password-field.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 3 帧（type，合同）、第 18 帧（strip，合同）、第 27 帧（field，合同）、第 83 帧（click，合同）、第 85 帧（stars，合同）、第 106 帧（样片量的）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
