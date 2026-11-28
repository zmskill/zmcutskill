---
name: sentence-folder-tile
中文名: 一句话中间嵌一块文件夹砖
用途: 字卡
时长: 1.2 秒（35 帧，30fps）
一句话: 米色底，一块文件夹砖落定，左右各出一个词，拼成一句话
来源镜头: folder-type-dock（第 0–35 帧）
样片: demos-own/parts/sentence-folder-tile/preview.mp4
样片图: demos-own/parts/sentence-folder-tile/preview-sheet.jpg
---

## 动作
米色底，一块文件夹砖落定，左右各出一个词，拼成一句话

## 怎么进来
第一帧开始

## 怎么用
- 代码入口：`demos-own/parts/sentence-folder-tile/SentenceFolderTile.tsx`（只播原镜头的这一段，时长常量 `SENTENCE_FOLDER_TILE_DURATION`）。
- 要换内容（文字、截图、颜色），改的是原镜头的代码 `demos-own/groups/folder-type-dock/FolderTypeDock.tsx`：先读原镜头的卡 `references/groups-own/folder-type-dock.md` 里"怎么换内容"和"已知坑"，再读代码里这一段。
- 只借动作、节奏和调好的参数；画面里的界面和文案是演示内容，用到产品上要换成产品的真实画面。
- 缓动、时长配比、停顿不改。

## 落点（对拍用）
零件自己的帧号（0 = 零件第一帧，在原镜头里要加上起帧）：第 2 帧（word，合同）、第 19 帧（样片量的）。
"合同"是镜头组合同里人定的，"样片量的"是机器从样片的运动量量的：用之前对照样片图确认。怎么对拍见 `references/music-and-beats.md` 第四节。
