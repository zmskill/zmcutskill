---
name: pills-split-logo-thumbs-cta
中文名: 胶囊甩开 · 标志弹出 · 截图弹进飞走 · 按钮
用途: 品牌落版
时长: 3.6 秒（108 帧，30fps）
一句话: 两颗胶囊往两边甩出画，标志从一个点弹大，名字从后面抽出来，四周界面截图错开弹进来又飞走；标志缩小让位，一颗圆点撑成按钮
来源镜头: pill-pair-logo-scatter（第 42–150 帧）
样片: demos-own/parts/pills-split-logo-thumbs-cta/preview.mp4
样片图: demos-own/parts/pills-split-logo-thumbs-cta/preview-sheet.jpg
---

## 动作
两颗胶囊往两边甩出画，标志从一个点弹大，名字从后面抽出来，四周界面截图错开弹进来又飞走；标志缩小让位，一颗圆点撑成按钮

## 怎么进来
接上一拍的两颗胶囊

## 怎么用
- 代码入口：`demos-own/parts/pills-split-logo-thumbs-cta/PillsSplitLogoThumbsCta.tsx`（只播原镜头的这一段，时长常量 `PILLS_SPLIT_LOGO_THUMBS_CTA_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/pill-pair-logo-scatter/PillPairLogoScatter.tsx`：先读原镜头的卡 `references/groups-own/pill-pair-logo-scatter.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 2 帧（split，合同）、第 13 帧（logo，合同）、第 22 帧（thumbs，合同）、第 24 帧（name，合同）、第 60 帧（shrink，合同）、第 67 帧（dot，合同）、第 75 帧（cta，合同）、第 90 帧（settle，合同）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
