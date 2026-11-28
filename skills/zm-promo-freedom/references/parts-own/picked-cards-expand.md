---
name: picked-cards-expand
中文名: 没选中的退成虚影 · 选中的展开详情
用途: 功能演示
时长: 3.4 秒（102 帧，30fps）
一句话: 没选中的卡一层层退成背景虚影，倾斜归零；选中的三张摆正散开，字段每帧一行往下长，"高度匹配"错开弹出
来源镜头: search-pick-shortlist（第 237–339 帧）
样片: demos-own/parts/picked-cards-expand/preview.mp4
样片图: demos-own/parts/picked-cards-expand/preview-sheet.jpg
---

## 动作
没选中的卡一层层退成背景虚影，倾斜归零；选中的三张摆正散开，字段每帧一行往下长，"高度匹配"错开弹出

## 怎么进来
接上一拍的卡片墙

## 怎么用
- 代码入口：`demos-own/parts/picked-cards-expand/PickedCardsExpand.tsx`（只播原镜头的这一段，时长常量 `PICKED_CARDS_EXPAND_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/ui-entrance/search-pick-shortlist/SearchPickShortlist.tsx`：先读原镜头的卡 `references/shots-own/ui-entrance/search-pick-shortlist.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 33 帧（样片量的）、第 45 帧（样片量的）、第 58 帧（样片量的）、第 94 帧（样片量的）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
