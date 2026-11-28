---
name: cards-fly-into-app
中文名: 三张卡飘进应用界面落位
用途: 结果登场
时长: 2.5 秒（76 帧，30fps）
一句话: 硬切到聊天应用（先虚后实），三张卡成一串斜着飘进来、放平、散开、各自落位，扫光骨架变成真实消息
来源镜头: invite-wall-to-chat（第 400–476 帧）
样片: demos-own/parts/cards-fly-into-app/preview.mp4
样片图: demos-own/parts/cards-fly-into-app/preview-sheet.jpg
---

## 动作
硬切到聊天应用（先虚后实），三张卡成一串斜着飘进来、放平、散开、各自落位，扫光骨架变成真实消息

## 怎么进来
失焦硬切

## 怎么用
- 代码入口：`demos-own/parts/cards-fly-into-app/CardsFlyIntoApp.tsx`（只播原镜头的这一段，时长常量 `CARDS_FLY_INTO_APP_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/ui-entrance/invite-wall-to-chat/InviteWallToChat.tsx`：先读原镜头的卡 `references/shots-own/ui-entrance/invite-wall-to-chat.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 52 帧（样片量的）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
