---
name: detail-drag-select-match
中文名: 详情页 · 拖选关键词 · 条件一条条对上
用途: 证据
时长: 3.0 秒（90 帧，30fps）
一句话: 硬切详情页，左边大字逐词出，光标从右往左拖选关键词（浅蓝变深蓝加选框），页面滚动和左边换词同一帧
来源镜头: agent-browse-match（第 302–392 帧）
样片: demos-own/parts/detail-drag-select-match/preview.mp4
样片图: demos-own/parts/detail-drag-select-match/preview-sheet.jpg
---

## 动作
硬切详情页，左边大字逐词出，光标从右往左拖选关键词（浅蓝变深蓝加选框），页面滚动和左边换词同一帧

## 怎么进来
硬切

## 注意
"它找到的真的符合你的要求"

## 怎么用
- 代码入口：`demos-own/parts/detail-drag-select-match/DetailDragSelectMatch.tsx`（只播原镜头的这一段，时长常量 `DETAIL_DRAG_SELECT_MATCH_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/ui-entrance/agent-browse-match/AgentBrowseMatch.tsx`：先读原镜头的卡 `references/shots-own/ui-entrance/agent-browse-match.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 4 帧（样片量的）、第 9 帧（样片量的）、第 47 帧（样片量的）、第 53 帧（样片量的）、第 61 帧（样片量的）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
