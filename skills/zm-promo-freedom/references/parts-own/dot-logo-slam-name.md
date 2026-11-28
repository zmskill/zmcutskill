---
name: dot-logo-slam-name
中文名: 小字缩成点 · Logo 砸下来 · 名字滑进
用途: 品牌落版
时长: 2.6 秒（78 帧，30fps）
一句话: 小字加速缩成一个点，大 Logo 砸下来缩小、两块合拢；Logo 往左让，名字字母一个个滑进来，副标题跟上
来源镜头: giant-word-logo-lockup（第 48–126 帧）
样片: demos-own/parts/dot-logo-slam-name/preview.mp4
样片图: demos-own/parts/dot-logo-slam-name/preview-sheet.jpg
---

## 动作
小字加速缩成一个点，大 Logo 砸下来缩小、两块合拢；Logo 往左让，名字字母一个个滑进来，副标题跟上

## 怎么进来
接上一拍的小字

## 怎么用
- 代码入口：`demos-own/parts/dot-logo-slam-name/DotLogoSlamName.tsx`（只播原镜头的这一段，时长常量 `DOT_LOGO_SLAM_NAME_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/giant-word-logo-lockup/GiantWordLogoLockup.tsx`：先读原镜头的卡 `references/groups-own/giant-word-logo-lockup.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 10 帧（logo，合同）、第 14 帧（样片量的）、第 21 帧（样片量的）、第 34 帧（name，合同）、第 44 帧（样片量的）、第 56 帧（small，合同）、第 62 帧（sub，合同）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
