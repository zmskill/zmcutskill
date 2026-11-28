---
name: comet-dots-card
中文名: 流星线把点串起来 · 变成白卡片
用途: 转场
时长: 1.8 秒（53 帧，30fps）
一句话: 几条彩色流星线沿着弯路径把散开的小点连起来，汇到中间变成一个小方块，方块撑成白卡片、按钮出现
来源镜头: comet-dots-card（整个镜头）
样片: demos-own/parts/comet-dots-card/preview.mp4
样片图: demos-own/parts/comet-dots-card/preview-sheet.jpg
---

## 动作
几条彩色流星线沿着弯路径把散开的小点连起来，汇到中间变成一个小方块，方块撑成白卡片、按钮出现

## 怎么进来
上一镜的字变虚散掉

## 注意
口号接产品界面

## 怎么用
- 代码入口：`demos-own/parts/comet-dots-card/CometDotsCard.tsx`（整个镜头，时长常量 `COMET_DOTS_CARD_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/comet-dots-card/CometDotsCard.tsx`：先读原镜头的卡 `references/groups-own/comet-dots-card.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 10 帧（corner，合同）、第 16 帧（rise，合同）、第 22 帧（square，合同）、第 25 帧（flash，合同）、第 28 帧（card，合同）、第 34 帧（样片量的）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
