---
name: lines-keep-word-swap-brand
一句话: 暗底逐行打出三行字，最后一行带地球图标；其余的字退掉、只留「🌐 关键词」升到正中，在原位一下换成产品标志 + 产品名，再往上让、下面浮出一句话
讲法: 卖点收束（替换式点题）
阶段: 三行打出 → 留一个词 → 升到正中 → 换成产品 → 下面一句
数量: 三行（固定）
适用: 宣传片中段收束一句卖点、点出产品名
适用-口播:
时长: 原长 5.25s，最短 5.25s，最长 8.75s（30fps）
动作区: 0–1.7s, 1.8–3.7s, 3.8–5.15s（原速，永远不拉伸、不加速）
停留区: 1.75s 最多 +1s；3.75s 最多 +1s；5.2s 最多 +1.5s
落点: type@0.07, line2@0.3, line3@0.85, key@1.05, strip@1.85, rise@2.2, swap@3.23, tagline@4.2
输入: l1 ≤5字 | l2 ≤6字 | l3pre ≤2字 | key ≤4字 | brand ≤7 个字母 | tagline ≤7字
素材: 不需要素材
布局: 横版（竖版未做）
进出: 开头暗底空画面；结尾停在「产品名 + 一句话」上
接过: 040 Aside 整串（第 19 批）
能量: 中
含全画面冲击: 否
成熟度: 候选
来源: SkaleSolutions · Aside 浏览器宣传片 · 040_SkaleSolutions_Aside按钮复制与乱码解密/原视频.mp4 · 57.15–62.4s · 只学动作
样片: demos-own/groups/lines-keep-word-swap-brand/preview.mp4 + preview-max.mp4（上限文案 + 停留拉满）
---

## 动作谱
1. 逐行打出一句三行的话，最后一行带一个图标
2. 其余的字退掉，只留「图标 + 关键词」，升到正中
3. 图标一缩，关键词在原位换成产品标志 + 产品名
4. 产品名往上让，下面浮出一句话

## 参数表
| 参数 | 典型值 | 调节手感 |
|------|--------|----------|
| 行位置 | 1 行 580 / 2 行 476·620 / 3 行 450·590·720 | 新行出现时整块 0.1s 内往上让 |
| swap | 60.38，0.08s | 命门：同一位置、同一基线一下换掉 |

## 音效清单
和 `LINES_KEEP_WORD_SWAP_BRAND_CONTRACT.sfx` 一致。只写类别和具体是什么，不写死文件：做片时按类别去音效库挑（`references/sfx-kinds.md`），同一条片子里同类声音统一一个文件；用户看片认可后，才把文件写进合同的 `file`。位置和类别不改。

| 落点 | 偏移 | 类别 | 具体是什么 | 默认文件 | 尾音 |
|------|------|------|------------|----------|------|
| type | 0s | 键盘 | 键盘敲字 | （待用户认可） | 0.5s |
| line2 | 0s | 轻tick | soft tick ×2 | （待用户认可） |  |
| key | 0s | 弹出 | soft pop | （待用户认可） |  |
| strip | 0s | 短甩 | 退场 soft swish | （待用户认可） |  |
| swap | 0s | 点击 | 换品牌 click + shimmer | （待用户认可） | 0.4s |
| swap | 0s | 闪光 | 换品牌 click + shimmer | （待用户认可） | 0.4s |
| tagline | 0s | 上扬铺垫 | soft swell | （待用户认可） |  |

## 参考实现
demos-own/groups/lines-keep-word-swap-brand/LinesKeepWordSwapBrand.tsx（含 `LINES_KEEP_WORD_SWAP_BRAND_CONTRACT`）
