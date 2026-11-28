---
name: title-reply-cards-fly
中文名: 三词标题 · 三张回复卡飞入
用途: 字卡
时长: 2.4 秒（72 帧，30fps）
一句话: 硬切暖白底，三词标题逐词先虚后实、整行居中；标题上移，三张回复卡从右下依次 3D 飞入，各自倾斜不同
来源镜头: invite-wall-to-chat（第 328–400 帧）
样片: demos-own/parts/title-reply-cards-fly/preview.mp4
样片图: demos-own/parts/title-reply-cards-fly/preview-sheet.jpg
---

## 动作
硬切暖白底，三词标题逐词先虚后实、整行居中；标题上移，三张回复卡从右下依次 3D 飞入，各自倾斜不同

## 怎么进来
硬切

## 怎么用
- 代码入口：`demos-own/parts/title-reply-cards-fly/TitleReplyCardsFly.tsx`（只播原镜头的这一段，时长常量 `TITLE_REPLY_CARDS_FLY_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/ui-entrance/invite-wall-to-chat/InviteWallToChat.tsx`：先读原镜头的卡 `references/shots-own/ui-entrance/invite-wall-to-chat.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 40 帧（样片量的）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
