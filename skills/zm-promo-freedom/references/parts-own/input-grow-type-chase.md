---
name: input-grow-type-chase
中文名: 输入框长大 · 追着打字
用途: 输入
时长: 2.2 秒（66 帧，30fps）
一句话: 输入框虚着从中间长大，4 帧推到特写，逐字越打越快、镜头追着字走，最新几个字是浅色尾巴
来源镜头: prompt-to-site-wall（第 12–78 帧）
样片: demos-own/parts/input-grow-type-chase/preview.mp4
样片图: demos-own/parts/input-grow-type-chase/preview-sheet.jpg
---

## 动作
输入框虚着从中间长大，4 帧推到特写，逐字越打越快、镜头追着字走，最新几个字是浅色尾巴

## 怎么进来
失焦硬切后进来（第一帧就是虚的、已经在动）

## 怎么用
- 代码入口：`demos-own/parts/input-grow-type-chase/InputGrowTypeChase.tsx`（只播原镜头的这一段，时长常量 `INPUT_GROW_TYPE_CHASE_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/ui-entrance/prompt-to-site-wall/PromptToSiteWall.tsx`：先读原镜头的卡 `references/shots-own/ui-entrance/prompt-to-site-wall.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 5 帧（样片量的）、第 25 帧（样片量的）、第 62 帧（样片量的）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
