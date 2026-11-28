---
name: scramble-decode-word
中文名: 词挪开 · 乱码从左到右解成一个词
用途: 字卡
时长: 1.4 秒（42 帧，30fps）
一句话: 一个词挪到左边，右边一串乱码从左到右解码成另一个词
来源镜头: decode-word-password-field（第 0–42 帧）
样片: demos-own/parts/scramble-decode-word/preview.mp4
样片图: demos-own/parts/scramble-decode-word/preview-sheet.jpg
---

## 动作
一个词挪到左边，右边一串乱码从左到右解码成另一个词

## 怎么进来
白底

## 注意
隐私 / 安全

## 怎么用
- 代码入口：`demos-own/parts/scramble-decode-word/ScrambleDecodeWord.tsx`（只播原镜头的这一段，时长常量 `SCRAMBLE_DECODE_WORD_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/decode-word-password-field/DecodeWordPasswordField.tsx`：先读原镜头的卡 `references/groups-own/decode-word-password-field.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 2 帧（move，合同）、第 20 帧（scramble，合同）、第 39 帧（decoded，合同）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
