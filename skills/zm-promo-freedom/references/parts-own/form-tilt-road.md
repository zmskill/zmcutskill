---
name: form-tilt-road
中文名: 卡片往后倒 · 镜头扎进去变成一条路
用途: 转场
时长: 3.1 秒（93 帧，30fps）
一句话: 表单卡片往后倒下去、镜头贴着它冲过去，卡片变成一条往前延伸的路，"开车"选中块滑下来变成分道线，几段分道线从下往上冲过
来源镜头: form-tilt-road（整个镜头）
样片: demos-own/parts/form-tilt-road/preview.mp4
样片图: demos-own/parts/form-tilt-road/preview-sheet.jpg
---

## 动作
表单卡片往后倒下去、镜头贴着它冲过去，卡片变成一条往前延伸的路，"开车"选中块滑下来变成分道线，几段分道线从下往上冲过

## 怎么进来
接表单卡片

## 注意
结尾白场

## 怎么用
- 代码入口：`demos-own/parts/form-tilt-road/FormTiltRoad.tsx`（整个镜头，时长常量 `FORM_TILT_ROAD_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/form-tilt-road/FormTiltRoad.tsx`：先读原镜头的卡 `references/groups-own/form-tilt-road.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 18 帧（dive，合同）、第 35 帧（road，合同）、第 48 帧（dash1，合同）、第 64 帧（dash2，合同）、第 78 帧（blue，合同）、第 80 帧（dash3，合同）、第 90 帧（close，合同）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
