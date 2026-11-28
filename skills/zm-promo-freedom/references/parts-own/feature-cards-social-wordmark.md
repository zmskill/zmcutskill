---
name: feature-cards-social-wordmark
中文名: 功能小卡一张张顶上来 · 收成字标
用途: 品牌落版
时长: 3.3 秒（98 帧，30fps）
一句话: 照片条往上推走，四张白色功能小卡从下面一张张顶上来铺满蓝底（数字一直在跳、滑块在走）→
来源镜头: feature-cards-social-wordmark（整个镜头）
样片: demos-own/parts/feature-cards-social-wordmark/preview.mp4
样片图: demos-own/parts/feature-cards-social-wordmark/preview-sheet.jpg
---

## 动作
照片条往上推走，四张白色功能小卡从下面一张张顶上来铺满蓝底（数字一直在跳、滑块在走）→

## 怎么进来
接上一拍的照片条

## 怎么用
- 代码入口：`demos-own/parts/feature-cards-social-wordmark/FeatureCardsSocialWordmark.tsx`（整个镜头，时长常量 `FEATURE_CARDS_SOCIAL_WORDMARK_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/feature-cards-social-wordmark/FeatureCardsSocialWordmark.tsx`：先读原镜头的卡 `references/groups-own/feature-cards-social-wordmark.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 9 帧（样片量的）、第 15 帧（tagline，合同）、第 28 帧（face，合同）、第 39 帧（cut，合同）、第 44 帧（mark，合同）、第 56 帧（rest，合同）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
