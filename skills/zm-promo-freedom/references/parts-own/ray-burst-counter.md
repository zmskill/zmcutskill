---
name: ray-burst-counter
中文名: 蓝圆炸成放射线 · 数字跳三次
用途: 证据
时长: 5.9 秒（177 帧，30fps）
一句话: 米白底中间一个蓝圆，两边小字说明 → 蓝圆缩小、外面围一圈点（几颗是人脸）→ 点连成放射线、炸开成一圈长短不一的线，右边数字 340→363→380 跳 →
来源镜头: ray-burst-counter（整个镜头）
样片: demos-own/parts/ray-burst-counter/preview.mp4
样片图: demos-own/parts/ray-burst-counter/preview-sheet.jpg
---

## 动作
米白底中间一个蓝圆，两边小字说明 → 蓝圆缩小、外面围一圈点（几颗是人脸）→ 点连成放射线、炸开成一圈长短不一的线，右边数字 340→363→380 跳 →

## 怎么进来
第一帧开始

## 怎么用
- 代码入口：`demos-own/parts/ray-burst-counter/RayBurstCounter.tsx`（整个镜头，时长常量 `RAY_BURST_COUNTER_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/ray-burst-counter/RayBurstCounter.tsx`：先读原镜头的卡 `references/groups-own/ray-burst-counter.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 12 帧（dots，合同）、第 16 帧（样片量的）、第 24 帧（rays，合同）、第 33 帧（burst，合同）、第 60 帧（n1，合同）、第 69 帧（n2，合同）、第 78 帧（n3，合同）、第 102 帧（word，合同）、第 126 帧（cards，合同）、第 168 帧（ring，合同）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
