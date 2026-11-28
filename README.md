<div align="center">

# zmcutskill

**逐梦的 AI 剪辑 Skill 合集 —— 不会 AE、没有动效和剪辑团队，也能让 AI 直接做出能发的成片**

[![Version](https://img.shields.io/badge/version-1.3.0-2563EB.svg?style=flat-square)](VERSION)
[![Skills](https://img.shields.io/badge/skills-3%20%E4%B8%AA-0EA5E9.svg?style=flat-square)](#有哪些-skill)
[![Engine](https://img.shields.io/badge/render-Remotion-7C3AED.svg?style=flat-square)](https://www.remotion.dev)
[![License](https://img.shields.io/badge/license-All%20Rights%20Reserved-16A34A.svg?style=flat-square)](LICENSE.md)

[快速开始](#快速开始) · [宣传片自由](#宣传片自由) · [口播内容视觉化](#口播内容视觉化) · [关于作者](#关于作者) · [常见问题](#常见问题)

</div>

<br/>

![宣传片自由实测效果预览](skills/zm-promo-freedom/assets/preview-cover.jpg)

<p align="center"><sub>▲ <b>宣传片自由</b> 实测成片抽帧：真实痛点开场 → 实机界面采集 → 3D 连续空间运镜 → 实测数据证据（全流程代码渲染，非套模板）</sub></p>

---

## zmcutskill 是什么

`zmcutskill` 是[逐梦](#关于作者)做的 AI 剪辑 Skill 合集。Skill 是一套写给 AI 的专业剪辑方法与资产库：装到能读写文件、跑命令的 AI（如 Claude 桌面版 Cowork、Claude Code、Codex）里后，你在对话里说一句话，AI 就照着这套流程帮你做出成片。

### 有哪些 Skill

| Skill | 一句话说明 | 核心资产与亮点 | 详细说明 |
| --- | --- | --- | --- |
| **[`/zm`](skills/zm/SKILL.md)**<br/>**总调度台** `入口` | 不知道用哪个时直接找它：自动分诊、新手引导、静默版本提醒与一键更新 | 记住这一个入口就够用 · 24 小时静默查新版 · 回复 `1` 一键更新 | [直接开始 ↓](#快速开始) |
| **[`/zm-promo-freedom`](skills/zm-promo-freedom/SKILL.md)**<br/>**宣传片自由** `NEW` | 给软件、Web、AI 产品或新功能做电影感卡点宣传片 | 238 个小零件镜头库 · 277 个本地音效 · 音乐总指挥 · 3D 连续运镜 · 十项量片 + 独立盲审 | [查看详情 ↓](#宣传片自由) |
| **[`/zm-talk-visual`](skills/zm-talk-visual/SKILL.md)**<br/>**口播内容视觉化** | 给录好剪完气口的口播逐句配画面、动效、字幕与音效 | 4 套视觉风格（横屏 + 竖屏）· 离线听写逐字对齐 · 209 个本地音效 · 分段确认交付 | [查看详情 ↓](#口播内容视觉化) |

> 更多剪辑类 Skill 陆续加入中。点右上角 **Star** 或 **Watch**，更新时第一时间看到。

---

## 快速开始

### 第 1 步：一行命令装齐全部 Skill

在终端运行：

```bash
npx -y skills add zmskill/zmcutskill -g --all
```

<details>
<summary>不会用终端？点这里复制一段话直接发给你的 AI，让它自己装</summary>

```text
请把 https://github.com/zmskill/zmcutskill 这个仓库里 skills/ 下面的文件夹，装进你能读取的 skills 目录，装好告诉我装在哪了。
```

</details>

### 第 2 步：在对话里直接开工

- **省心总入口（推荐，不用记具体名字）**：
  ```text
  /zm 我想剪一条视频
  ```
  > 直接把素材或想法发给 `/zm`，它会自动判断该派「宣传片自由」还是「口播内容视觉化」开工，并自动提醒新版本、支持回复 `1` 一键更新。

- **直接做产品宣传片**：
  ```text
  用 zm-promo-freedom 给我的产品 XX 做一条宣传片，BGM 用这首，想要轻松流畅一点的感觉
  ```
  > 开工时会一次性问清产品、BGM、发布渠道，以及你想**一路全自动做到交片**还是**关键三步先给你确认再继续**。

- **直接做口播成片**：
  ```text
  用 zm-talk-visual 把 ~/Desktop/我的口播 里的视频做成成片，素材在同一个文件夹
  ```
  > 首次做片时 AI 会自动体检环境（装好的不提，缺的东西装之前先问你）。想先了解玩法也可以直接说：`用 zm-talk-visual 新手入门`。

---

## 宣传片自由

> 不会 AE、没有动效团队也没关系，想给产品做几支宣传片就做几支：你是导演，镜头、卡点和音效是你的剧组。

**你要准备的**：
- **产品入口**：本地前端项目，或可打开登录的线上产品页面
- **一首有授权的 BGM**：本项目不带任何背景音乐，正规免费/付费找歌渠道见 [`去哪找歌.md`](skills/zm-promo-freedom/assets/audio/bgm/去哪找歌.md)
- **发布背景**：准备发在哪个平台、有没有品牌禁忌或不能说的话

**两种协作方式**（开工必问）：

| 做法 | 适合 |
| --- | --- |
| **全自动** | 想省事：AI 开工一次问清后，自己完成音乐分析、找真实痛点、采真实页面、排 3D 运镜、配音效、跑十项量片与独立盲审，一口气交片 |
| **共同创作** | 想自己把关：只在「痛点与故事」「3 张效果图拼图」「整片画面与节奏时间表」三个关键节点暂停给你确认，确认后它接着做完 |

**两种叙事结构**：讲一个功能（15–30 秒，五拍：钩子 → 问题 → 登场 → 证据 → 收尾）；介绍整个产品（30–45 秒，痛点开场 + 功能爬升 + 合影收尾）。

**核心资产与机制**：
- **238 个小零件镜头库**：将 120+ 个完整镜头按动作拆成 1–6 秒独立零件，按用途分 12 类（痛点、钩子、输入、点击确认、结果登场、功能演示、证据、列举、字卡、转场、过渡动作、品牌落版），每个配有代码入口、样片、12 格抽帧图与落点数据
- **277 个本地音效库**：按 22 类整理，预量好时长、对齐点与响度（录音优先），库里没有合适的支持代码现场合成或 Freesound 兜底
- **音乐总指挥 + 3D 连续运镜 + 丝滑运动模型**：波形实测拍点（画面早声音 1 帧）、3D 空间连续飞行带真实运动模糊、速度鼓包与速度接力硬切、零件原速播完不冻帧
- **三道质检 + 自动化工具链**：关口一（纸上强校验）→ 半尺寸小样量片自查 → 十项成片量片 + 全新独立盲审终检 + 关口二交付校验
- **素材与字体库**：人像、照片、品牌图标为同名占位图，开箱可直接渲染，做片时替换为目标产品真实素材（原来源见 `remotion/public/library/来源清单.md`）；另内置 10 款 SIL OFL 1.1 免费商用中文字体

**不适合**：口播视频、真人素材剪辑、带配音的宣传片、投放和账号运营。

---

## 口播内容视觉化

> 你录好口播、剪好气口，它逐句配上画面、动效、字幕和音效，交回能直接发的成片。说到哪句，就出现哪句的画面。

**你要准备的**：
- 一条已经剪好气口的口播初剪（横屏竖屏都行；竖屏目前用书桌或简历风格）
- 文案（没有也行，会按听写来，拿不准的字会问你）
- 一个素材文件夹：截图、录屏、照片，画面要用到的真实证据
- 要背景音乐的话，你自己挑好的歌（Skill 不替你挑歌）

**风格库里现有的四套**：

| 风格 | 方向 | 适合 |
| --- | --- | --- |
| **笔记本** | 横屏 | 讲经历、踩坑、步骤、成绩；手上有截图、照片、数字 |
| **操作台** | 横屏 | 讲一个工具怎么用、一样东西怎么做出来；手上有录屏 |
| **书桌** | 竖屏 | 日常分享、讲自己做成的一件事；手上有聊天记录、后台数据、评论区截图 |
| **简历** | 竖屏 | 讲经历和成长：一段段经历怎么攒出现在的本事；画面是一份正在填的简历 |

不想用现成的，可以让它按这条的内容设计一套新样子，或者给它一条你喜欢的参考视频。

**提问时附上这些，结果更好**：口播文件和素材在哪个文件夹；这条主要讲什么、给谁看；有没有特别想要或不想要的效果。

**不适合**：只加字幕或花字；多机位粗剪；数字人、配音；只有文案没有录音；只要通用空镜。

---

## 关于作者

我是逐梦，目前在研究 AI 剪辑。2024 年 2 月接触 AI 和自媒体，4 月做出第一篇百万爆款后转全职，7 月开始尝试 AI 跨境，一年赚到第一个百万，2025 年被电视台和《The World of Chinese》等媒体报道。下个目标是旅居办公。

- 抖音／小红书／公众号：**逐梦带你玩AI**
- 推特：**[@AmbitiousXU](https://x.com/AmbitiousXU)**

**遇到问题**：安装或使用卡住了，可以[提 Issue](https://github.com/zmskill/zmcutskill/issues)，或发邮件到 `zmxuskill@163.com`，附上是在哪个 AI 里用的、卡在哪一步、报错的原文。

**想有人带着做**：想让我本人带着装、带着做出第一条片，或者想聊怎么用 AI 做自媒体，可以看[付费答疑群说明](https://mp.weixin.qq.com/s/ffJH8QW-KP1KmYJtajc_9w)。

觉得有用的话，点一下右上角的 **Star**，我会更有动力继续更新，也欢迎指出问题。

---

## 能在哪些 AI 里用

不看是哪个 AI，看它**能不能读写你的文件、能不能跑命令**：能，就能做出成片；只能聊天的 AI（网页版、纯对话），只能帮你排方案，做不出成片。

实测过的：Claude 桌面版的 Cowork（体检、安装、渲染都跑通，依赖装在 AI 自己的工作区，不往你的文件夹里塞东西）、Claude Code。Codex、WorkBuddy 等其他能跑命令的 AI 欢迎试用反馈。

---

## 需要的环境

第一次做片时 AI 会自动体检，缺的问过你再装。用的工具是固定的，效果是在这套工具上调出来的，不会换成别的：

| 东西 | 用来做什么 | 怎么装 |
| --- | --- | --- |
| Node.js | 跑 Remotion 渲染 | 系统软件，AI 会告诉你怎么装（Mac 上 `brew install node`，或 nodejs.org 下载） |
| ffmpeg | 听写、混音、拼接、量片 | AI 帮你装（brew 或 pip，不需要管理员权限） |
| Python 3 + numpy、Pillow（口播另需 scipy） | 节拍分析、量音量、拼抽帧图 | AI 帮你装 |
| Remotion 依赖（版本锁定） | 渲染画面 | AI 帮你装，几分钟 |
| Remotion 自带的浏览器 | 渲染时用 | AI 帮你装，从 `remotion.media` 下载 |
| SenseVoice 离线听写模型（仅口播用，约 670 MB） | 把口播听写成逐字时间 | AI 帮你下载，断了能接着下；离线运行，不上传你的口播 |

- **宣传片自由**不需要听写模型；体检和安装为 `python3 tools/doctor.py`、`python3 tools/setup.py`，依赖装在 `~/zm-work/zm-promo-freedom`；截真实页面时会按需安装 puppeteer。
- 画面用 [Remotion](https://www.remotion.dev) 渲染。Remotion 个人和 3 人以内的公司免费（可商用），更大规模团队需按其[许可条款](https://www.remotion.dev/license)获取授权。

---

## 常见问题

<details>
<summary><b>装好后没看到命令怎么办？</b></summary>

先确认安装命令跑成功了，并且装到的是你正在用的 AI。也可以直接在对话里说「用 `zm-promo-freedom`」或「用 `zm-talk-visual`」。

</details>

<details>
<summary><b>提示某个网站连不上、装不上？</b></summary>

通常是 AI 的网络白名单没放行。Claude 桌面版：**设置 → Capabilities → Additional allowed domains** 加上被拦的域名（如 `remotion.media`），或改为 **All domains**；团队版由管理员在 **Organization settings → Capabilities** 修改。改完记得新开一个对话再跑 `doctor.py`。

</details>

<details>
<summary><b>装东西时被要求批准删除文件夹？</b></summary>

在 Cowork 里，依赖应该装在 AI 自己的独立工作区，不该装进你的文件夹。遇到这种情况，提醒 AI 先跑 `doctor.py`，按建议用 `setup.py` 装到工作区。

</details>

---

## 用 Claude Code 插件方式安装与更新

只用 Claude Code 的话，也可以装成插件（命令前加 `zm:`，例如 `/zm:zm-promo-freedom`、`/zm:zm-talk-visual`；`npx` 与插件方式选一种即可）：

```bash
# 安装插件
claude plugin marketplace add zmskill/zmcutskill
claude plugin install zm@zmcutskill

# 更新插件
claude plugin marketplace update zmcutskill
claude plugin update zm@zmcutskill
```

通过 `npx` 方式安装的，重新跑一次安装命令即可更新：

```bash
npx -y skills add zmskill/zmcutskill -g --all
```

---

## 音效与版权条款

- **音效**：口播内容视觉化自带 209 个音效（Sonniss 167 + CC0 42）；宣传片自由自带 277 个音效（Sonniss 219 + CC0 58）。Sonniss 音效来自 [GDC 2026 免费音效包](https://gdc.sonniss.com)，免版税、可商用、无需署名，**不得原样单独出售，也不得用于训练或开发 AI**。
- **版权与使用条款**：版权归逐梦所有，保留所有权利。可免费安装、使用，用来做自己的视频或给客户做视频赚钱都没问题；未经书面许可，不得转载、再分发、打包进其他产品/课程、出售、公开发布修改版或用于训练 AI。完整条款见 [LICENSE.md](LICENSE.md)。
- 申请书面许可、咨询条款或商务合作：`zmxuskill@163.com`
