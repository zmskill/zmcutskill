---
name: words-burst-whip-swap
中文名: 词各自冲到原位 · 甩出画换下一个词
用途: 字卡
时长: 2.1 秒（62 帧，30fps）
一句话: 每个词各自从很小冲到原位，停一下，整句被甩出画（横糊），第二个词从右边甩进来长尾巴停到正中
来源镜头: edit-flash-type-toolbar（第 0–62 帧）
样片: demos-own/parts/words-burst-whip-swap/preview.mp4
样片图: demos-own/parts/words-burst-whip-swap/preview-sheet.jpg
---

## 动作
每个词各自从很小冲到原位，停一下，整句被甩出画（横糊），第二个词从右边甩进来长尾巴停到正中

## 怎么进来
白底

## 怎么用
- 代码入口：`demos-own/parts/words-burst-whip-swap/WordsBurstWhipSwap.tsx`（只播原镜头的这一段，时长常量 `WORDS_BURST_WHIP_SWAP_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/edit-flash-type-toolbar/EditFlashTypeToolbar.tsx`：先读原镜头的卡 `references/groups-own/edit-flash-type-toolbar.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 11 帧（样片量的）、第 36 帧（whip1，合同）、第 52 帧（样片量的）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
