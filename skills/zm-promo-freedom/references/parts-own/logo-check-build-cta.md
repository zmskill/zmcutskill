---
name: logo-check-build-cta
中文名: 标志一笔笔长出 · 名字 · 按钮被按下
用途: 品牌落版
时长: 5.4 秒（163 帧，30fps）
一句话: 白闪后硬切品牌色，毛玻璃方块里一笔笔"长"出标志（横条拉出 → 长成勾 → 一颗点落进来），图标缩小左移、名字从图标后面抽出，标语、按钮、网址依次出现；光标点一下按钮、两圈描边往外扩，品牌落版静看
来源镜头: logo-check-build-cta（整个镜头）
样片: demos-own/parts/logo-check-build-cta/preview.mp4
样片图: demos-own/parts/logo-check-build-cta/preview-sheet.jpg
---

## 动作
白闪后硬切品牌色，毛玻璃方块里一笔笔"长"出标志（横条拉出 → 长成勾 → 一颗点落进来），图标缩小左移、名字从图标后面抽出，标语、按钮、网址依次出现；光标点一下按钮、两圈描边往外扩，品牌落版静看

## 怎么进来
接一个白场

## 注意
最后 5 秒

## 怎么用
- 代码入口：`demos-own/parts/logo-check-build-cta/LogoCheckBuildCta.tsx`（整个镜头，时长常量 `LOGO_CHECK_BUILD_CTA_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/logo-check-build-cta/LogoCheckBuildCta.tsx`：先读原镜头的卡 `references/groups-own/logo-check-build-cta.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 3 帧（bar，合同）、第 9 帧（arm，合同）、第 18 帧（dot，合同）、第 22 帧（logo，合同）、第 30 帧（name，合同）、第 39 帧（tagline，合同）、第 46 帧（button，合同）、第 52 帧（url，合同）、第 66 帧（cursor，合同）、第 78 帧（press，合同）、第 80 帧（ring，合同）、第 111 帧（settle，合同）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
