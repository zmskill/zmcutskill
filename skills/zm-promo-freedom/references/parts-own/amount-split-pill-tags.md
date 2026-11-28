---
name: amount-split-pill-tags
中文名: 超大金额 · 黄块铺满 · 数字拉开
用途: 证据
时长: 1.7 秒（52 帧，30fps）
一句话: 白底超大金额 → 亮黄方块一格格铺满、数字一边缩小一边拉开 → 黄底褪成浅黄再褪白 →
来源镜头: amount-split-pill-tags（整个镜头）
样片: demos-own/parts/amount-split-pill-tags/preview.mp4
样片图: demos-own/parts/amount-split-pill-tags/preview-sheet.jpg
---

## 动作
白底超大金额 → 亮黄方块一格格铺满、数字一边缩小一边拉开 → 黄底褪成浅黄再褪白 →

## 怎么进来
第一帧开始

## 怎么用
- 代码入口：`demos-own/parts/amount-split-pill-tags/AmountSplitPillTags.tsx`（整个镜头，时长常量 `AMOUNT_SPLIT_PILL_TAGS_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/amount-split-pill-tags/AmountSplitPillTags.tsx`：先读原镜头的卡 `references/groups-own/amount-split-pill-tags.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 9 帧（yellow，合同）、第 18 帧（pale，合同）、第 22 帧（pills，合同）、第 28 帧（click，合同）、第 33 帧（hover，合同）、第 46 帧（glow，合同）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
