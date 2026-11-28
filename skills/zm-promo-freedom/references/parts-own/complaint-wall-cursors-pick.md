---
name: complaint-wall-cursors-pick
中文名: 吐槽墙整排滑入 · 三个光标各挑一条
用途: 痛点
时长: 3.3 秒（99 帧，30fps）
一句话: 评论卡整排左右交错滑进来铺满斜墙，三个带名字的彩色光标各挑中一条吐槽
来源镜头: complaint-wall-pick（第 62–161 帧）
样片: demos-own/parts/complaint-wall-cursors-pick/preview.mp4
样片图: demos-own/parts/complaint-wall-cursors-pick/preview-sheet.jpg
---

## 动作
评论卡整排左右交错滑进来铺满斜墙，三个带名字的彩色光标各挑中一条吐槽

## 怎么进来
接在搜索框后面

## 注意
痛点开场：把真实吐槽原话放进卡里

## 怎么用
- 代码入口：`demos-own/parts/complaint-wall-cursors-pick/ComplaintWallCursorsPick.tsx`（只播原镜头的这一段，时长常量 `COMPLAINT_WALL_CURSORS_PICK_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/ui-entrance/complaint-wall-pick/ComplaintWallPick.tsx`：先读原镜头的卡 `references/shots-own/ui-entrance/complaint-wall-pick.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 52 帧（样片量的）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
