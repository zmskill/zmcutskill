---
name: overexpose-focus-logo-podium
中文名: 过曝退去对焦 · Logo 落到石台回弹
用途: 品牌落版
时长: 3.7 秒（112 帧，30fps）
一句话: 全白停住，过曝退去、整场从虚里对焦出来；Logo 由灰变墨落到圆台上回弹一次，两行字逐词出，停住时光影还在晃
来源镜头: ribbon-podium-intro（第 146–258 帧）
样片: demos-own/parts/overexpose-focus-logo-podium/preview.mp4
样片图: demos-own/parts/overexpose-focus-logo-podium/preview-sheet.jpg
---

## 动作
全白停住，过曝退去、整场从虚里对焦出来；Logo 由灰变墨落到圆台上回弹一次，两行字逐词出，停住时光影还在晃

## 怎么进来
接在一个过曝到白的镜头后面

## 注意
前面 0–150 帧就是 message-ribbon-flow

## 怎么用
- 代码入口：`demos-own/parts/overexpose-focus-logo-podium/OverexposeFocusLogoPodium.tsx`（只播原镜头的这一段，时长常量 `OVEREXPOSE_FOCUS_LOGO_PODIUM_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/opening/ribbon-podium-intro/RibbonPodiumIntro.tsx`：先读原镜头的卡 `references/shots-own/opening/ribbon-podium-intro.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 11 帧（样片量的）、第 33 帧（样片量的）、第 56 帧（样片量的）、第 70 帧（样片量的）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
