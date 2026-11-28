---
name: code-flythrough-pill-type-name
中文名: 穿过漂浮的代码 · 输入条打字 · 拉远出产品名
用途: 钩子
时长: 4.1 秒（123 帧，30fps）
一句话: 镜头穿过漂浮的绿色代码关键词和霓虹四角星（有景深），中间浮出深色玻璃输入条逐字打一句提问，拉远出产品名
来源镜头: code-flythrough-generate（第 0–123 帧）
样片: demos-own/parts/code-flythrough-pill-type-name/preview.mp4
样片图: demos-own/parts/code-flythrough-pill-type-name/preview-sheet.jpg
---

## 动作
镜头穿过漂浮的绿色代码关键词和霓虹四角星（有景深），中间浮出深色玻璃输入条逐字打一句提问，拉远出产品名

## 怎么进来
第一帧就在动

## 怎么用
- 代码入口：`demos-own/parts/code-flythrough-pill-type-name/CodeFlythroughPillTypeName.tsx`（只播原镜头的这一段，时长常量 `CODE_FLYTHROUGH_PILL_TYPE_NAME_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/code-flythrough-generate/CodeFlythroughGenerate.tsx`：先读原镜头的卡 `references/groups-own/code-flythrough-generate.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 42 帧（pill，合同）、第 58 帧（type，合同）、第 102 帧（pull，合同）、第 111 帧（logo，合同）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
