---
name: file-cards-swallow
中文名: 文件卡升起被圆吞掉
用途: 功能演示
时长: 2.7 秒（80 帧，30fps）
一句话: 资料库卡慢推，三张文件卡从底下升起、顶端渐隐，被上方的圆吞进去
来源镜头: orb-relay-explainer（第 283–363 帧）
样片: demos-own/parts/file-cards-swallow/preview.mp4
样片图: demos-own/parts/file-cards-swallow/preview-sheet.jpg
---

## 动作
资料库卡慢推，三张文件卡从底下升起、顶端渐隐，被上方的圆吞进去

## 怎么进来
硬切

## 怎么用
- 代码入口：`demos-own/parts/file-cards-swallow/FileCardsSwallow.tsx`（只播原镜头的这一段，时长常量 `FILE_CARDS_SWALLOW_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/opening/orb-relay-explainer/OrbRelayExplainer.tsx`：先读原镜头的卡 `references/shots-own/opening/orb-relay-explainer.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 46 帧（样片量的）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
