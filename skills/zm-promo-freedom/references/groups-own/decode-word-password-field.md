---
name: decode-word-password-field
一句话: 「本地，」挪到左边、右边一串乱码从左到右解成「加密」；换一句"产品不会让 AI"，只留 AI，右边滑进大输入框"读取你的所有密码"；手点眼睛，眼睛划掉、字变星号，镜头摇到眼睛居中
讲法: 讲隐私（承诺 + 演示）
阶段: 本地 + 乱码解码 → 一句话 → 只留 AI → 输入框滑进 → 点眼睛 → 星号
数量: 固定
适用: 宣传片讲隐私 / 安全
适用-口播:
时长: 原长 5.88s，最短 5.88s，最长 8.88s（30fps）
动作区: 0–1.3s, 1.4–1.85s, 1.95–5.8s（原速，永远不拉伸、不加速）
停留区: 1.35s 最多 +1s；1.9s 最多 +1s；5.85s 最多 +1s
落点: move@0.05, scramble@0.65, decoded@1.3, type@1.5, strip@2.0, field@2.3, click@4.15, stars@4.22
输入: lead1 ≤4字 | lead2 ≤3字 | local ≤3字 | secure ≤3字 | brand ≤7 个字母 | mid ≤4字 | ai ≤2 个字母 | field ≤9字
素材: 不需要素材
布局: 横版（竖版未做）
进出: 开头接上一句散开的字；结尾停在划掉的眼睛上（硬切下一镜）
接过: 040 Aside 整串（第 19 批）
能量: 中
含全画面冲击: 否
成熟度: 候选
来源: SkaleSolutions · Aside 浏览器宣传片 · 040_SkaleSolutions_Aside按钮复制与乱码解密/原视频.mp4 · 73.4–79.28s · 只学动作
样片: demos-own/groups/decode-word-password-field/preview.mp4 + preview-max.mp4（上限文案 + 停留拉满）
---

## 动作谱
1. 「本地，」挪到左边，右边一串乱码从左到右解成「加密」
2. 换一句"产品不会让 AI"，中间的词退掉，只剩 AI
3. 右边滑进一个大输入框"读取你的所有密码"，镜头跟着往右摇
4. 手点框尾的眼睛：眼睛划掉，字变星号，镜头摇到眼睛居中

## 参数表
| 参数 | 典型值 | 调节手感 |
|------|--------|----------|
| 乱码 | 比正字多 2 个，0.5s 解完 | 命门：从左到右逐个解，没解的每 0.05s 换 |
| FIELD_X | 快—慢—快—慢 | 点眼睛时几乎停住 |

## 音效清单
和 `DECODE_WORD_PASSWORD_FIELD_CONTRACT.sfx` 一致。只写类别和具体是什么，不写死文件：做片时按类别去音效库挑（`references/sfx-kinds.md`），同一条片子里同类声音统一一个文件；用户看片认可后，才把文件写进合同的 `file`。位置和类别不改。

| 落点 | 偏移 | 类别 | 具体是什么 | 默认文件 | 尾音 |
|------|------|------|------------|----------|------|
| scramble | 0s | 故障 | 乱码 glitch 连串 | （待用户认可） | 0.6s |
| decoded | 0s | 提示音 | 解开 ding | （待用户认可） |  |
| type | 0s | 键盘 | 键盘敲字 | （待用户认可） | 0.3s |
| field | 0s | 运镜 | 横移 whoosh | （待用户认可） | 0.4s |
| click | 0s | 点击 | 点击 click | （待用户认可） |  |
| stars | 0s | 吸入 | 遮住 soft swish | （待用户认可） |  |

## 参考实现
demos-own/groups/decode-word-password-field/DecodeWordPasswordField.tsx（含 `DECODE_WORD_PASSWORD_FIELD_CONTRACT`）
