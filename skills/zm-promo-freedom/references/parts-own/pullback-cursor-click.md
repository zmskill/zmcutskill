---
name: pullback-cursor-click
中文名: 拉回 · 鼠标冲过来点发送
用途: 点击确认
时长: 1.5 秒（46 帧，30fps）
一句话: 镜头慢起步拉回全景，带拖影的鼠标 3 帧冲到发送键，点下去冒一团光，停一拍
来源镜头: prompt-to-site-wall（第 77–123 帧）
样片: demos-own/parts/pullback-cursor-click/preview.mp4
样片图: demos-own/parts/pullback-cursor-click/preview-sheet.jpg
---

## 动作
镜头慢起步拉回全景，带拖影的鼠标 3 帧冲到发送键，点下去冒一团光，停一拍

## 怎么进来
接在打字特写后面

## 注意
推近只有 4 帧、拉回 0.9 秒且起步极慢，做成对称就机械

## 怎么用
- 代码入口：`demos-own/parts/pullback-cursor-click/PullbackCursorClick.tsx`（只播原镜头的这一段，时长常量 `PULLBACK_CURSOR_CLICK_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/ui-entrance/prompt-to-site-wall/PromptToSiteWall.tsx`：先读原镜头的卡 `references/shots-own/ui-entrance/prompt-to-site-wall.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 20 帧（样片量的）、第 26 帧（样片量的）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
