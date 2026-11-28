---
name: pill-rows-slide-claims
中文名: 五行蓝胶囊左右猛滑再刹住
用途: 转场
时长: 0.8 秒（23 帧，30fps）
一句话: 硬切满屏五行蓝色胶囊（长胶囊写乱码货币符号、圆胶囊里一个箭头），一行往左一行往右猛滑再刹住，
来源镜头: pill-rows-slide-claims（整个镜头）
样片: demos-own/parts/pill-rows-slide-claims/preview.mp4
样片图: demos-own/parts/pill-rows-slide-claims/preview-sheet.jpg
---

## 动作
硬切满屏五行蓝色胶囊（长胶囊写乱码货币符号、圆胶囊里一个箭头），一行往左一行往右猛滑再刹住，

## 怎么进来
硬切

## 注意
不到 1 秒，当一下冲击用

## 怎么用
- 代码入口：`demos-own/parts/pill-rows-slide-claims/PillRowsSlideClaims.tsx`（整个镜头，时长常量 `PILL_ROWS_SLIDE_CLAIMS_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/pill-rows-slide-claims/PillRowsSlideClaims.tsx`：先读原镜头的卡 `references/groups-own/pill-rows-slide-claims.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 9 帧（settle，合同）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
