---
name: cube-invert-name-url
中文名: 圆撑开底色反转 · 立方体缩成标志 · 名字网址
用途: 品牌落版
时长: 5.4 秒（162 帧，30fps）
一句话: 一个浅色圆从中心撑开、底色反转（线变蓝），立方体缩小上移成标志，名字、网址、命令一行行出来，停住
来源镜头: dot-cube-logo（第 78–240 帧）
样片: demos-own/parts/cube-invert-name-url/preview.mp4
样片图: demos-own/parts/cube-invert-name-url/preview-sheet.jpg
---

## 动作
一个浅色圆从中心撑开、底色反转（线变蓝），立方体缩小上移成标志，名字、网址、命令一行行出来，停住

## 怎么进来
接上一段的线框立方体

## 注意
后半是停留

## 怎么用
- 代码入口：`demos-own/parts/cube-invert-name-url/CubeInvertNameUrl.tsx`（只播原镜头的这一段，时长常量 `CUBE_INVERT_NAME_URL_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/dot-cube-logo/DotCubeLogo.tsx`：先读原镜头的卡 `references/groups-own/dot-cube-logo.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 8 帧（样片量的）、第 18 帧（shrink，合同）、第 39 帧（word，合同）、第 49 帧（样片量的）、第 63 帧（url，合同）、第 84 帧（cmd，合同）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
