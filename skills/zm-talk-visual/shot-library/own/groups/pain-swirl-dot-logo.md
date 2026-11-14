---
name: pain-swirl-dot-logo
一句话: 痛点句整行重打三次、四周琐碎小卡被漩涡卷走，转折句冒出后长出蓝点吞满屏，硬切到天空里长出 Logo、名字和标语
讲法: 钩子 → 痛点 → 产品登场
阶段: 痛点（三句重打 + 八张小卡）→ 收走（漩涡 + 转折句）→ 登场（蓝点 → 天空 → Logo → 名字 → 标语）（必须按顺序走完；没有转折句或没有 Logo 就换组）
数量: 痛点句=3（固定，每句 3 个词）；小卡=8（固定）；转折句=2 个词；标语=2+2 个词（数量对不上就换组，不凑不删）
适用: 宣传片开场，一条串完"痛点钩子 → 产品登场"；前 5 秒不出产品名，满足 SKILL"痛点钩子"要求
适用-口播:
时长: 原长 9.2s，最短 9.2s，最长 14.2s（30fps）
动作区: 0–2.2s, 2.95–3.5s, 3.85–7.95s, 8.9–9.2s（原速，永远不拉伸、不加速）
停留区: 2.2s 最多 +1.0s（第二句读字）；3.5s 最多 +1.0s（第三句读字）；8.0s 最多 +3.0s（品牌海报）
落点: line1@0.267, cards@0.43, line2@1.717, line3@3.033, swirl@3.85, turn@4.283, dot@5.067, cut@5.567, logo@5.667, name@6.833, tagline@7.25, flash@8.9（源秒；做片时用 landmarkAt 换算）
输入: painLines[3] 每句 3 词、≤10 字、三句等长(实测) | cards[8] main ≤12 字、sub ≤12 字(实测) | turnLine 2 词 ≤6 字(实测) | brandName ≤6 字(实测) | taglineA / taglineB 各 2 词 ≤9 字(实测) | brandColor 冷色 | accent | logo（0–100 方框里的 SVG）
素材: 不需要截图；要产品 Logo（SVG）
布局: 横版（竖版未做）
进出: 可独立开场（浅色空底起）；结尾刷白到浅色柔光底，适合接浅底的功能镜头
接过:
能量: 前 4 秒低而密 → 5.1s 起爆（蓝点、硬切、圆圈外扩）→ 品牌海报静看；读—爆—读
含全画面冲击: 是（蓝点吞屏 + 硬切天空算 1 处，占 R4 全片 3 处名额）
成熟度: 候选
来源: baseTOP × Taskly 宣传片 · 023_baseTOP_Taskly痛点开场与三词界面联动/原视频.mp4 · 0:00–0:09.2 · 只学动作
用户裁决: 2026-11-06 · 镜头卡版入库 · "这三个先入库吧"；2026-11-10 改成镜头组，合同验证待看
样片: demos-own/groups/pain-swirl-dot-logo/preview.mp4（正常文案）+ preview-max.mp4（上限文案 + 停留拉满）+ preview-long.mp4（正常文案撑到 13s）
---

## 动作谱
1. 空的柔光浅底静 0.27s → 第一句逐词显影，八张小卡按顺时针方位从画外滑进来、落定后各自小幅漂浮
2. 换句 = 整行重打：旧句变灰上飘退场，新句从第一个词起逐词升上来，新旧叠 8 帧（首词双影）；共三句
3. 漩涡把卡片卷进中心、标题原地缩没；碎卡还没走完，品牌色转折句斜着逐词浮出 → 真停 0.32s
4. 句心长出同色圆点，每帧约 ×1.3 指数长大吞满屏 → 纯色 2 帧里硬切到深蓝天空，中心细白圈接住"点"
5. Logo 方块从小点边转边长出，三圈白线外扩；星星闪 → Logo 往左甩，名字从 Logo 后面逐字抽出 → 标语逐词浮现
6. 品牌海报静看（只有云漂、天空慢推）→ 横向拖影刷白到浅色底
7. 声音：词 tick、卡片 swish、换句 whoosh、漩涡吸气、蓝点蓄力"嗡"、硬切 shimmer、Logo chime、刷白反向 whoosh
8. 开始是一屏杂乱的痛点 → 杂乱被收走、答案从同一个位置冒出 → 结果是天空里的产品 Logo 和一句好处

## 意图
先用"每天 X 太 Y"三连重打把观众拉进熟悉的烦躁，小卡把烦躁具体化；漩涡收走杂物、转折句从同一个中心出现；
"点"贯穿到底：蓝点 → 白圈 → Logo → 名字。前 5 秒不出产品名。

## 怎么用（做片时，按这个顺序）
```ts
import {PainSwirlDotLogoGroup, checkPainSwirlInputs, planPainSwirl, painSwirlFrames, PAIN_SWIRL_DOT_LOGO_CONTRACT as C} from '.../PainSwirlDotLogoGroup';
import {landmarkAt, sfxCues} from '.../groupClock';
const problems = checkPainSwirlInputs(inputs);   // 非空 → 精简文案或换组，不硬塞
const extras = planPainSwirl(12);                // 目标秒 → 三个停留点各加多少；<9.2 或 >14.2 会报错
<Composition component={PainSwirlDotLogoGroup} durationInFrames={painSwirlFrames(extras)} defaultProps={{inputs, extras}} … />
sfxCues(C, extras);                              // 音效钉点（输出秒）
landmarkAt('cut', C, extras);                    // 对节拍：硬切点
```

## 参数表
| 参数 | 典型值 | 调节手感 |
|------|--------|----------|
| 痛点句字号 | 104px | 命门：不缩字号；装不下就精简文案 |
| 三句等长 | 原内容都是 7 字 | 命门：不等长整行重打会跳宽，`checkPainSwirlInputs` 直接拒绝 |
| 逐词进场 / 末词变墨 | 0.1s / 0.3–0.36s | 命门 |
| 卡片位置、进场时刻、方向 | 8 个固定位 | 命门：只换字和颜色 |
| 漩涡 | 0.5s、缩到 0.35× | 命门 |
| 蓝点倍率 | 每帧 ×1.3，纯色 ≥2 帧 | 命门：用 ease-out 就软了 |
| 名字逐字 | 每字 2 帧 | 命门 |
| 停留区加时 | 2.2s / 3.5s 各 ≤1s，8.0s ≤3s | 只在这里加；停住时文字不动，卡片漂 / 云漂照常（R7） |

## 音效清单
和 `PAIN_SWIRL_DOT_LOGO_CONTRACT.sfx` 一致。默认文件还没选（要跑 `sfx-source.py search` 选 Freesound 录音），选定后填文件名；**位置和类型不改**。

| 落点 | 偏移 | 类型 | 默认文件 | 尾音 |
|------|------|------|----------|------|
| line1 | 0 | 轻 tick（词入场） | 待选 | — |
| cards | 0 | 轻 swish × 8（0.43–1.65s 错开） | 待选 | — |
| line2 | −0.07s | 短 whoosh-up（换句） | 待选 | — |
| line3 | −0.07s | 短 whoosh-up（换句） | 待选 | — |
| swirl | 0 | 升调吸气（卷没时截断） | 待选 | 0.5s |
| dot | 0 | 低频蓄力 → 满屏"嗡" | 待选 | 0.5s |
| cut | 0 | 亮 shimmer（硬切天空） | 待选 | 0.8s |
| logo | 0 | 上扬玻璃 chime | 待选 | 1.0s |
| flash | 0 | 反向 whoosh（刷白） | 待选 | 0.4s |

## 已知坑
- 继承镜头卡版的全部已知坑（`shot-library/own/cards/opening/pain-swirl-dot-logo.md`）
- 天空是固定的蓝色渐变：brandColor 只接冷色（蓝 / 靛 / 紫），暖色转折句 + 蓝点硬切到蓝天会断
- 字数按字符数数；英文 / 数字比汉字窄（约 2 个字母 = 1 个汉字），排版已按真实字宽估算居中，但上限仍按字符数，偏保守
- 停留点 2.2s / 3.5s 只有卡片微漂（≈0.5%/秒），没有镜头慢推：这是原片的读字段，镜头卡版说过"不要补动"；加满 1s 后会不会显得停太久，待用户看 preview-max 判断
- 4.75–5.07s 的真停没有开放成停留区（原片刻意的"静 → 爆"，加长会泄气）

## 参考实现
demos-own/groups/pain-swirl-dot-logo/PainSwirlDotLogoGroup.tsx（含 `PAIN_SWIRL_DOT_LOGO_CONTRACT`、`checkPainSwirlInputs`、`planPainSwirl`）
动作代码与 demos-own/opening/pain-swirl-dot-logo/PainSwirlDotLogo.tsx 相同；默认内容 + extras 全 0 时逐像素一致（2026-11-10 九个帧对比，差值 0）
逐元素时间表：shot-lab/refs/023-A/逐元素时间表.md

## 合同验证记录（2026-11-10，第 3.5 步）
| 项 | 结果 |
|---|---|
| 合同自检 checkContract | 通过（停留点不在动作区里、音效都指向存在的落点） |
| 改造前后一致 | 默认内容、原长：9 个帧（20/60/100/125/145/160/200/230/250）和镜头卡版逐像素相同 |
| 正常文案（虚构产品「听记」） | checkInputs 通过；见 preview.mp4 |
| 上限文案 + 停留拉满（14.2s） | checkInputs 通过；落点帧：10 字痛点句两端离左右卡片约 30px，12 字卡不出画，6 字名字整组居中 |
| 撑到 13s | planExtras → 23 / 23 / 68 帧；和 9.2s 版同一动作时刻逐帧比，动作区差值 0.01–0.34（满分 255），只在三个停留点加时 |
| 停留时冻没冻 | 三个停留段每帧平均变化 0.14–0.15，无一帧完全静止（原片读字段约 0.1） |
| 顺手修 | planExtras 原先给出非整帧延长（0.76s = 22.8 帧），停留后的动作错开半帧；已改成取整到整帧，groupClock 单测 8/8 |
| 故意装不下 | 第一句 12 字 / 三句 12·10·7 不等长 / 只给 7 张卡 / 名字 8 字 → 全部被拒，报错写明"精简文案 / 换组" |
| 目标 16s、7s | 分别报错"超过全部停留上限 5s：拆段或换组""短于原长：动作区不能压缩" |
