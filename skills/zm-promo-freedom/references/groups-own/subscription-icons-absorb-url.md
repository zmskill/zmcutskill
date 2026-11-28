---
name: subscription-icons-absorb-url
一句话: 打出"自带订阅"，钥匙插到"订阅"前再换成火花；App 图标出现，一排 AI 服务图标往左走、一个个被吸进去；缩成标志后打出产品名和定位，最后"替你 干活"往两边退开、中间打出网址
讲法: 收尾（品牌 + 网址）
阶段: 自带订阅 → 钥匙 / 火花 → 图标被吸进 App → 标志 + 产品名 → 替你 干活 → 网址
数量: 一排 5 个图标（固定）
适用: 宣传片最后的品牌收尾
适用-口播:
时长: 原长 8.22s，最短 8.22s，最长 11.72s（30fps）
动作区: 0–1.82s, 1.92–5.07s, 5.17–8.12s（原速，永远不拉伸、不加速）
停留区: 1.87s 最多 +1s；5.12s 最多 +1s；8.17s 最多 +1.5s
落点: words@0.87, key@1.52, spark@2.1, app@2.47, absorb@2.9, logo@3.75, name@4.12, line2@4.72, work@6.07, url@6.52
输入: l1 三段 每段 ≤3字 | sub ≤3字 | brand ≤7 个字母 | tag ≤5字 | does ≤3字 | you ≤2字 | work ≤2字 | url ≤14 个字母
素材: 国内产品官方图标（remotion/public/library/brands，App Store 原图）；按画面内容选最贴的产品
布局: 横版（竖版未做）
进出: 开头接上一镜留下的图标；结尾停在网址上
接过: 040 Aside 整串（第 19 批）
能量: 中 → 低
含全画面冲击: 否
成熟度: 候选
来源: SkaleSolutions · Aside 浏览器宣传片 · 040_SkaleSolutions_Aside按钮复制与乱码解密/原视频.mp4 · 79.28–87.5s · 只学动作
样片: demos-own/groups/subscription-icons-absorb-url/preview.mp4 + preview-max.mp4（上限文案 + 停留拉满）
---

## 动作谱
1. 上一镜的图标缩掉，打出"自带订阅"
2. 前半句退，钥匙插到"订阅"前，再换成一个小火花
3. App 图标出现，右边一排 AI 服务图标往左走、一个个被吸进去
4. App 图标缩成标志，打出产品名和一句定位
5. 只剩"替你 干活"，两个词往两边退开变暗，中间打出网址

## 参数表
| 参数 | 典型值 | 调节手感 |
|------|--------|----------|
| 图标行 | 间距 235，约 400px/s | 命门：匀速走、碰到 App 图标才缩没 |
| split | 0.3s 退到两边、变暗 | 中间网址同时开始打 |

## 音效清单
和 `SUBSCRIPTION_ICONS_ABSORB_URL_CONTRACT.sfx` 一致。只写类别和具体是什么，不写死文件：做片时按类别去音效库挑（`references/sfx-kinds.md`），同一条片子里同类声音统一一个文件；用户看片认可后，才把文件写进合同的 `file`。位置和类别不改。

| 落点 | 偏移 | 类别 | 具体是什么 | 默认文件 | 尾音 |
|------|------|------|------------|----------|------|
| words | 0s | 轻tick | soft tick ×3 | （待用户认可） |  |
| key | 0s | 弹出 | soft pop | （待用户认可） |  |
| app | 0s | 运镜 | 出现 soft whoosh | （待用户认可） |  |
| absorb | 0s | 弹出 | 吸入 pop 连串 ×5 | （待用户认可） | 0.6s |
| name | 0s | 落版重击 | 落版 low hit | （待用户认可） | 0.6s |
| url | 0s | 键盘 | 键盘敲字 | （待用户认可） | 0.5s |

## 参考实现
demos-own/groups/subscription-icons-absorb-url/SubscriptionIconsAbsorbUrl.tsx（含 `SUBSCRIPTION_ICONS_ABSORB_URL_CONTRACT`）
