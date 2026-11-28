---
name: logo-orbit-features
中文名: 图标弹出 · 六个功能小圆绕着转
用途: 列举
时长: 4.5 秒（135 帧，30fps）
一句话: App 图标斜着弹出、带光晕轻晃，两行大字逐词出现；6 颗功能小圆在图标四周的轨道上顺时针依次弹出，整圈慢慢转，最后整画面变虚淡掉
来源镜头: logo-orbit-features（整个镜头）
样片: demos-own/parts/logo-orbit-features/preview.mp4
样片图: demos-own/parts/logo-orbit-features/preview-sheet.jpg
---

## 动作
App 图标斜着弹出、带光晕轻晃，两行大字逐词出现；6 颗功能小圆在图标四周的轨道上顺时针依次弹出，整圈慢慢转，最后整画面变虚淡掉

## 怎么进来
浅色底

## 注意
收尾前的功能全家福

## 怎么用
- 代码入口：`demos-own/parts/logo-orbit-features/LogoOrbitFeatures.tsx`（整个镜头，时长常量 `LOGO_ORBIT_FEATURES_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/logo-orbit-features/LogoOrbitFeatures.tsx`：先读原镜头的卡 `references/groups-own/logo-orbit-features.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 3 帧（logo，合同）、第 4 帧（line1，合同）、第 8 帧（ring，合同）、第 14 帧（line2，合同）、第 14 帧（item1，合同）、第 28 帧（item6，合同）、第 33 帧（orbit，合同）、第 127 帧（out，合同）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
