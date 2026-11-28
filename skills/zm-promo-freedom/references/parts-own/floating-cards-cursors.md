---
name: floating-cards-cursors
中文名: 卡片变漂浮卡 · 几个光标逐张看
用途: 功能演示
时长: 2.7 秒（81 帧，30fps）
一句话: 硬切渐变底，三张卡变半透明漂浮卡，标题逐词被卡片揭开；镜头上漂、新卡进场，三个光标各看各的
来源镜头: agent-browse-match（第 221–302 帧）
样片: demos-own/parts/floating-cards-cursors/preview.mp4
样片图: demos-own/parts/floating-cards-cursors/preview-sheet.jpg
---

## 动作
硬切渐变底，三张卡变半透明漂浮卡，标题逐词被卡片揭开；镜头上漂、新卡进场，三个光标各看各的

## 怎么进来
硬切

## 怎么用
- 代码入口：`demos-own/parts/floating-cards-cursors/FloatingCardsCursors.tsx`（只播原镜头的这一段，时长常量 `FLOATING_CARDS_CURSORS_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/ui-entrance/agent-browse-match/AgentBrowseMatch.tsx`：先读原镜头的卡 `references/shots-own/ui-entrance/agent-browse-match.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 25 帧（样片量的）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
