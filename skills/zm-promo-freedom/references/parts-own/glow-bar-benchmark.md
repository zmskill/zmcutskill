---
name: glow-bar-benchmark
中文名: 发光条伸出 · 灰条长出 · 对比图成形
用途: 证据
时长: 4.3 秒（128 帧，30fps）
一句话: 深色圆吞掉上一镜，一根发光青条伸出、镜头贴着推近；推到最近时灰条依次长出，镜头慢慢后退，名字、数值逐位、标题依次打出，成为一张完整的对比图
来源镜头: glow-bar-benchmark（整个镜头）
样片: demos-own/parts/glow-bar-benchmark/preview.mp4
样片图: demos-own/parts/glow-bar-benchmark/preview-sheet.jpg
---

## 动作
深色圆吞掉上一镜，一根发光青条伸出、镜头贴着推近；推到最近时灰条依次长出，镜头慢慢后退，名字、数值逐位、标题依次打出，成为一张完整的对比图

## 怎么进来
深色圆吞掉上一镜

## 注意
"比别家强多少"；数字要有出处

## 怎么用
- 代码入口：`demos-own/parts/glow-bar-benchmark/GlowBarBenchmark.tsx`（整个镜头，时长常量 `GLOW_BAR_BENCHMARK_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/glow-bar-benchmark/GlowBarBenchmark.tsx`：先读原镜头的卡 `references/groups-own/glow-bar-benchmark.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 2 帧（wipe，合同）、第 9 帧（bar，合同）、第 26 帧（rows，合同）、第 28 帧（peak，合同）、第 33 帧（labels，合同）、第 42 帧（title，合同）、第 51 帧（sub，合同）、第 57 帧（样片量的）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
