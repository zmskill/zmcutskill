---
name: intro-genie-wordmark-browser
一句话: 程序坞上打出「隆重介绍」，手点开产品图标，图标像精灵一样喷开撑满全屏、产品名逐字母浮出变大；整屏洗白，标志 + 四行定位由灰变黑（蓝线沿窗口边描出），再错落滑进三个带图标的词，最后显出产品界面
讲法: 产品登场
阶段: 隆重介绍 → 精灵展开 → 产品名 → 洗白 → 四行定位 → 横跨 + 三个词 → 产品界面
数量: 定位 4 行、列表 3 项（固定）
适用: 宣传片从痛点转到产品登场的那一下
适用-口播:
时长: 原长 8.05s，最短 8.05s，最长 12.95s（30fps）
动作区: 0–2.75s, 2.85–5.0s, 5.1–7.25s, 7.35–7.95s（原速，永远不拉伸、不加速）
停留区: 2.8s 最多 +1s；5.05s 最多 +1.2s；7.3s 最多 +1.2s；8.0s 最多 +1.5s
落点: type@0.02, click@0.8, genie@0.85, name@1.25, wash@2.95, logo@3.4, line@3.9, fade@5.15, across@5.35, items@6.1, ui@7.35
输入: intro ≤5字 | name ≤6 个字母 | lines 4 行 每行 ≤6字 | across ≤3字 | items 3 项 每项 ≤4字 | dockIcons 3 个（第 1 个是产品图标）
素材: 国内产品官方图标（remotion/public/library/brands，App Store 原图）；按画面内容选最贴的产品
布局: 横版（竖版未做）
进出: 开头接 stop-chat-drag-trash 留下的程序坞；结尾停在产品界面（接功能演示）
接过: 040 Aside 整串（第 19 批）
能量: 中 → 高（精灵展开 + 产品名）→ 中
含全画面冲击: 是（精灵撑满全屏）
成熟度: 候选
来源: SkaleSolutions · Aside 浏览器宣传片 · 040_SkaleSolutions_Aside按钮复制与乱码解密/原视频.mp4 · 17.95–26.0s · 只学动作
样片: demos-own/groups/intro-genie-wordmark-browser/preview.mp4 + preview-max.mp4（上限文案 + 停留拉满）
---

## 动作谱
1. 坞上方打出「隆重介绍」，手点开产品图标
2. 图标像精灵一样从坞里往上喷开、撑满全屏
3. 产品名逐字母浮出、慢慢变大，整屏洗白
4. 白底上标志 + 四行字由灰变黑，背后一条蓝线沿窗口边描出来
5. 「横跨」+ 三个带图标的词错落滑进，淡出后浏览器界面显出

## 意图
产品登场用"点开 App"的动作完成：精灵效果把一个小图标变成满屏品牌色，再洗白进入产品自己的世界；定位语和能力清单都压在产品窗口的轮廓上，最后窗口里的界面浮出来，自然接功能演示。

## 参数表
| 参数 | 典型值 | 调节手感 |
|------|--------|----------|
| GENIE | 5 个关键形状（上沿 / 下沿 / 两侧弧） | 命门：下沿贴着图标、两边往里凹，0.3s 撑满 |
| NAME_H | 字高 70 → 290 | 产品名一直在慢慢变大，不停 |
| LINE_DOT | 左边往上 → 上边往右 | 蓝线先快后慢，24.0 停住 |
| itemX | 三个词从两边滑进 0.6s | 错落：上下两个从右、中间从左 |

## 音效清单
和 `INTRO_GENIE_WORDMARK_BROWSER_CONTRACT.sfx` 一致。只写类别和具体是什么，不写死文件：做片时按类别去音效库挑（`references/sfx-kinds.md`），同一条片子里同类声音统一一个文件；用户看片认可后，才把文件写进合同的 `file`。位置和类别不改。

| 落点 | 偏移 | 类别 | 具体是什么 | 默认文件 | 尾音 |
|------|------|------|------------|----------|------|
| type | 0s | 键盘 | 键盘敲字（4 下） | （待用户认可） | 0.4s |
| click | 0s | 点击 | 点击 click | （待用户认可） |  |
| genie | 0s | 上升 | 精灵展开 whoosh（上扬） | （待用户认可） | 0.5s |
| name | 0s | 落版重击 | 低频 boom + 闪光 shimmer | （待用户认可） | 1.2s |
| name | 0s | 闪光 | 低频 boom + 闪光 shimmer | （待用户认可） | 1.2s |
| wash | 0s | 上扬铺垫 | 亮起 swell | （待用户认可） | 0.4s |
| line | 0s | 轻tick | 细线 tick | （待用户认可） |  |
| items | 0s | 短甩 | 三下 swish | （待用户认可） | 0.3s |
| ui | 0s | 运镜 | 界面出现 soft whoosh | （待用户认可） |  |

## 已知坑
- 精灵用 SVG clipPath + foreignObject 裁渐变；渐变的竖条纹是两层 repeating-linear-gradient 叠出来的
- 四行字的标志位置要单独跟着关键帧走（只有一行时在字的左上方），不能直接按整块居中算

## 参考实现
demos-own/groups/intro-genie-wordmark-browser/IntroGenieWordmarkBrowser.tsx（含 `INTRO_GENIE_WORDMARK_BROWSER_CONTRACT` 常量）；零件 demos-own/groups/_kit/darkUiKit.tsx
