---
name: form-card-build
中文名: 空卡片里表单一样样长出来
用途: 结果登场
时长: 1.4 秒（43 帧，30fps）
一句话: 白卡片在正中长大，按钮从小圆点撑开，表单内容一样样由虚到实填进去；卡片一直慢慢往后仰（上窄下宽），四周是一排排别的表单卡片（点阵按钮 + 淡字）
来源镜头: form-card-build（整个镜头）
样片: demos-own/parts/form-card-build/preview.mp4
样片图: demos-own/parts/form-card-build/preview-sheet.jpg
---

## 动作
白卡片在正中长大，按钮从小圆点撑开，表单内容一样样由虚到实填进去；卡片一直慢慢往后仰（上窄下宽），四周是一排排别的表单卡片（点阵按钮 + 淡字）

## 怎么进来
接一张白卡片

## 怎么用
- 代码入口：`demos-own/parts/form-card-build/FormCardBuild.tsx`（整个镜头，时长常量 `FORM_CARD_BUILD_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/form-card-build/FormCardBuild.tsx`：先读原镜头的卡 `references/groups-own/form-card-build.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 4 帧（label，合同）、第 8 帧（icons，合同）、第 12 帧（fields，合同）、第 16 帧（date，合同）、第 20 帧（tabA，合同）、第 24 帧（tabB，合同）、第 32 帧（push，合同）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
