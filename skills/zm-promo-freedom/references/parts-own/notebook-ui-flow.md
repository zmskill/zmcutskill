---
name: notebook-ui-flow
中文名: Logo 一闪 · 硬切进笔记本界面
用途: 结果登场
时长: 4.7 秒（141 帧，30fps）
一句话: 发送后——软光渐变底上产品 Logo + 名字一闪 → 硬切进笔记本界面（玻璃边框大窗口，先略推远，
来源镜头: notebook-ui-flow（整个镜头）
样片: demos-own/parts/notebook-ui-flow/preview.mp4
样片图: demos-own/parts/notebook-ui-flow/preview-sheet.jpg
---

## 动作
发送后——软光渐变底上产品 Logo + 名字一闪 → 硬切进笔记本界面（玻璃边框大窗口，先略推远，

## 怎么进来
接在点发送之后

## 怎么用
- 代码入口：`demos-own/parts/notebook-ui-flow/NotebookUiFlow.tsx`（整个镜头，时长常量 `NOTEBOOK_UI_FLOW_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/notebook-ui-flow/NotebookUiFlow.tsx`：先读原镜头的卡 `references/groups-own/notebook-ui-flow.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 6 帧（word，合同）、第 20 帧（cut1，合同）、第 30 帧（swing，合同）、第 38 帧（files，合同）、第 42 帧（样片量的）、第 60 帧（cut2，合同）、第 64 帧（bubble，合同）、第 84 帧（think，合同）、第 94 帧（answer，合同）、第 98 帧（photos，合同）、第 111 帧（bubble2，合同）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
