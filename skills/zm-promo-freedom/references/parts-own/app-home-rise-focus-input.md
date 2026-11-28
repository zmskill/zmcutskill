---
name: app-home-rise-focus-input
中文名: App 首页一层层升起 · 只留输入框
用途: 结果登场
时长: 1.8 秒（55 帧，30fps）
一句话: 黑底，App 首页一层层升起，其余淡掉只留输入框
来源镜头: prompt-send-rings-card（第 0–55 帧）
样片: demos-own/parts/app-home-rise-focus-input/preview.mp4
样片图: demos-own/parts/app-home-rise-focus-input/preview-sheet.jpg
---

## 动作
黑底，App 首页一层层升起，其余淡掉只留输入框

## 怎么进来
白闪后进来

## 注意
第一帧是白底黑圆的转场帧

## 怎么用
- 代码入口：`demos-own/parts/app-home-rise-focus-input/AppHomeRiseFocusInput.tsx`（只播原镜头的这一段，时长常量 `APP_HOME_RISE_FOCUS_INPUT_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/prompt-send-rings-card/PromptSendRingsCard.tsx`：先读原镜头的卡 `references/groups-own/prompt-send-rings-card.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 3 帧（样片量的）、第 8 帧（home，合同）、第 23 帧（样片量的）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
