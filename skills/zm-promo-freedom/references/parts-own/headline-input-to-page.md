---
name: headline-input-to-page
中文名: 发光大字横移 · 输入条长成网页
用途: 结果登场
时长: 4.0 秒（120 帧，30fps）
一句话: 巨大的发光字第 1 帧就在横移后退、揭出整句（新词先偏青发虚再变白）→ 变玻璃字上移 → 玻璃长条升起、身后撑开面板长成整个网页 → 网页缩小上移、标题反向下沉
来源镜头: headline-input-to-page（整个镜头）
样片: demos-own/parts/headline-input-to-page/preview.mp4
样片图: demos-own/parts/headline-input-to-page/preview-sheet.jpg
---

## 动作
巨大的发光字第 1 帧就在横移后退、揭出整句（新词先偏青发虚再变白）→ 变玻璃字上移 → 玻璃长条升起、身后撑开面板长成整个网页 → 网页缩小上移、标题反向下沉

## 怎么进来
第一帧就在动

## 怎么用
- 代码入口：`demos-own/parts/headline-input-to-page/HeadlineInputToPage.tsx`（整个镜头，时长常量 `HEADLINE_INPUT_TO_PAGE_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/opening/headline-input-to-page/HeadlineInputToPage.tsx`：先读原镜头的卡 `references/shots-own/opening/headline-input-to-page.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 31 帧（样片量的）、第 62 帧（样片量的）、第 72 帧（样片量的）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
