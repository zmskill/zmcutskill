---
name: big-type-zoomout-send
中文名: 大字拉远成输入框 · 点发送被吸进去
用途: 输入
时长: 4.3 秒（128 帧，30fps）
一句话: 一句需求从 4.5 倍大字开始打，拉远成输入框，字流式冒出变实；发送钮点亮，手形光标按下，输入框往中心吸进去
来源镜头: prompt-pages-pill-reveal（第 0–128 帧）
样片: demos-own/parts/big-type-zoomout-send/preview.mp4
样片图: demos-own/parts/big-type-zoomout-send/preview-sheet.jpg
---

## 动作
一句需求从 4.5 倍大字开始打，拉远成输入框，字流式冒出变实；发送钮点亮，手形光标按下，输入框往中心吸进去

## 怎么进来
第一帧开始

## 怎么用
- 代码入口：`demos-own/parts/big-type-zoomout-send/BigTypeZoomoutSend.tsx`（只播原镜头的这一段，时长常量 `BIG_TYPE_ZOOMOUT_SEND_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/opening/prompt-pages-pill-reveal/PromptPagesPillReveal.tsx`：先读原镜头的卡 `references/shots-own/opening/prompt-pages-pill-reveal.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 5 帧（type，合同）、第 27 帧（zoom，合同）、第 54 帧（样片量的）、第 58 帧（glow，合同）、第 112 帧（click，合同）、第 116 帧（suck，合同）、第 125 帧（pages，合同）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
