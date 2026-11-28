---
name: success-card-avatars-pop
中文名: 成功卡 · 头像一个个弹出
用途: 证据
时长: 1.5 秒（45 帧，30fps）
一句话: 蓝勾从小点弹出，词逐个由浅变深，四个头像每 2 帧从小点弹出（过冲、互相压着），最后是"+21"
来源镜头: invite-wall-to-chat（第 283–328 帧）
样片: demos-own/parts/success-card-avatars-pop/preview.mp4
样片图: demos-own/parts/success-card-avatars-pop/preview-sheet.jpg
---

## 动作
蓝勾从小点弹出，词逐个由浅变深，四个头像每 2 帧从小点弹出（过冲、互相压着），最后是"+21"

## 怎么进来
加速推近硬切

## 注意
数量证据用

## 怎么用
- 代码入口：`demos-own/parts/success-card-avatars-pop/SuccessCardAvatarsPop.tsx`（只播原镜头的这一段，时长常量 `SUCCESS_CARD_AVATARS_POP_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/ui-entrance/invite-wall-to-chat/InviteWallToChat.tsx`：先读原镜头的卡 `references/shots-own/ui-entrance/invite-wall-to-chat.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：没量到：从原镜头代码里定。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
