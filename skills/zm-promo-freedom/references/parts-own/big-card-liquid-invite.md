---
name: big-card-liquid-invite
中文名: 大卡信息逐行变实 · 点"邀请"出光泡
用途: 点击确认
时长: 2.2 秒（66 帧，30fps）
一句话: 硬切到干净大卡，信息逐行由浅灰模糊变深；慢推，点"邀请"，液态光泡擦出"已邀请"
来源镜头: invite-wall-to-chat（第 102–168 帧）
样片: demos-own/parts/big-card-liquid-invite/preview.mp4
样片图: demos-own/parts/big-card-liquid-invite/preview-sheet.jpg
---

## 动作
硬切到干净大卡，信息逐行由浅灰模糊变深；慢推，点"邀请"，液态光泡擦出"已邀请"

## 怎么进来
急推硬切

## 怎么用
- 代码入口：`demos-own/parts/big-card-liquid-invite/BigCardLiquidInvite.tsx`（只播原镜头的这一段，时长常量 `BIG_CARD_LIQUID_INVITE_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/ui-entrance/invite-wall-to-chat/InviteWallToChat.tsx`：先读原镜头的卡 `references/shots-own/ui-entrance/invite-wall-to-chat.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 4 帧（样片量的）、第 14 帧（样片量的）、第 33 帧（样片量的）、第 41 帧（样片量的）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
