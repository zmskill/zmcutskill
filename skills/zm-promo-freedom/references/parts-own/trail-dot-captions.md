---
name: trail-dot-captions
中文名: 绿点拖虚线前进 · 带角标的字幕接力
用途: 证据
时长: 4.3 秒（130 帧，30fps）
一句话: 黑底网格 HUD 上一颗绿点拖着虚线前进、镜头跟随（速度会"呼吸"但从不停），像素块硬闪、像素小蛇逐格爬，1 帧马赛克换场后，带四角角标框的字幕一帧一个词接力三句
来源镜头: trail-dot-captions（整个镜头）
样片: demos-own/parts/trail-dot-captions/preview.mp4
样片图: demos-own/parts/trail-dot-captions/preview-sheet.jpg
---

## 动作
黑底网格 HUD 上一颗绿点拖着虚线前进、镜头跟随（速度会"呼吸"但从不停），像素块硬闪、像素小蛇逐格爬，1 帧马赛克换场后，带四角角标框的字幕一帧一个词接力三句

## 怎么进来
第一帧开始

## 注意
首尾相接，可循环

## 怎么用
- 代码入口：`demos-own/parts/trail-dot-captions/TrailDotCaptions.tsx`（整个镜头，时长常量 `TRAIL_DOT_CAPTIONS_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/data/trail-dot-captions/TrailDotCaptions.tsx`：先读原镜头的卡 `references/shots-own/data/trail-dot-captions.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 45 帧（样片量的）、第 78 帧（样片量的）、第 107 帧（样片量的）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
