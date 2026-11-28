# 宣传片自由（zm-promo-freedom）

> 不会 AE、没有动效团队也没关系，想给产品做几支宣传片就做几支：你是导演，镜头、卡点和音效是你的剧组。

![宣传片自由实测效果预览](assets/preview-cover.jpg)

面向软件、Web 与 AI 产品的宣传片制作 Skill（属于 [zmcutskill](https://github.com/zmskill/zmcutskill) 剪辑 Skill 合集，适用于 Claude 桌面版 Cowork、Claude Code、Codex 等能读写文件并执行命令的 AI 编程助手）。

片子基于 [Remotion](https://www.remotion.dev/) 用代码渲染，不是套模板：你告诉它做哪个产品、想要什么感觉、给它一首有授权的歌，它自己体检环境、分析音乐、找真实痛点、采真实页面、在 3D 空间里排运镜、选小零件、配音效、跑十项量片与独立终检，最后交给你一条成片。

---

## 核心内容

- **238 个小零件镜头库**：将 120+ 个完整镜头按动作拆成 1–6 秒独立零件，分 12 类用途（痛点、钩子、输入、点击确认、结果登场、功能演示、证据、列举、字卡、转场、过渡动作、品牌落版），每个零件配有代码入口、压缩样片、12 格抽帧图与落点数据（`references/parts-own/INDEX.md`）。
- **277 个本地音效库**：按 22 类用途整理，全部预量好时长、对齐点与响度，录音优先（`assets/sfx-library/`）；库里没有合适的支持 `tools/zm_sfx_synth.py` 现场合成，也可走 Freesound CC0 兜底。
- **音乐总指挥 + 3D 连续运镜 + 丝滑运动模型**：
  - 音乐先行：拍点检测 → 反拍校验 → 情绪三数画像 → 小节线剪歌 → 波形实测响点（`hitF` / `onF`，画面早声音 1 帧）；
  - 3D 连续空间运镜（`World` / `Stage` / `camMoves`），开真实运动模糊；转场只用"飞过去 / 速度接力硬切（`relay`）/ 同物接续"；
  - 速度鼓包曲线（`ramp`），零件按原速一口气播完不冻帧，告别"卡卡的、像 PPT"。
- **三道质检 + 自动化工具链**：
  - 开工体检与独立工作区安装（`tools/doctor.py`、`tools/setup.py`、`tools/new_video.py`，依赖装在 `~/zm-work/zm-promo-freedom` 保持 Skill 目录干净）；
  - 关口一（纸上检查 `zm_check.py plan`）→ 第二道（半尺寸小样量片）→ 第三道（十项自动化量片 `zm_film_check.py` + 全新独立盲审终检 + 关口二 `zm_check.py deliver`）。

---

## 快速开始

### 第 1 步：安装（通过 zmcutskill 合集一键安装）

在终端运行：

```bash
npx -y skills add zmskill/zmcutskill -g --all
```

不会用终端？把下面这段原样发给你的 AI，让它自己装：

```text
请把 https://github.com/zmskill/zmcutskill 这个仓库里 skills/ 下面的文件夹，装进你能读取的 skills 目录，装好告诉我装在哪了。
```

### 第 2 步：准备两样输入

1. **要做的产品**：本地可启动的前端项目，或可打开登录的线上产品页面。
2. **一首有授权的 BGM**：本项目不带任何背景音乐，正规找歌渠道见 [assets/audio/bgm/去哪找歌.md](assets/audio/bgm/去哪找歌.md)。

### 第 3 步：直接发指令给 AI

```text
用 zm-promo-freedom 给我的产品 XX 做一条宣传片，BGM 用这首，想要轻松流畅一点的感觉。
```

首次做片时 AI 会自动跑体检（`python3 tools/doctor.py`），缺的依赖（Node.js、ffmpeg、Python 包、Remotion 及渲染浏览器）问过你再装；开工时会一次性问清关键信息和协作方式（**一路全自动做完交片**，或**关键三步先给你确认再继续**）。

---

## 关于作者

我是逐梦，目前在研究 AI 剪辑。2024 年 2 月接触 AI 和自媒体，4 月做出第一篇百万爆款后转全职，7 月开始尝试 AI 跨境，一年赚到第一个百万，2025 年被电视台和《The World of Chinese》等媒体报道。下个目标是旅居办公。

- 抖音／小红书／公众号：逐梦带你玩AI
- 推特：[@AmbitiousXU](https://x.com/AmbitiousXU)

**遇到问题**：安装或使用卡住了，可以[提 Issue](https://github.com/zmskill/zmcutskill/issues)，或发邮件到 zmxuskill@163.com，附上是在哪个 AI 里用的、卡在哪一步、报错的原文。

**想有人带着做**：想让我本人带着装、带着做出第一条片，或者想聊怎么用 AI 做自媒体，可以看[付费答疑群说明](https://mp.weixin.qq.com/s/ffJH8QW-KP1KmYJtajc_9w)。

觉得有用的话，点一下 Star，我会更有动力继续更新，也欢迎指出问题。

---

## 说明与版权条款

- 素材库（`remotion/public/library/`）中的人像、照片、品牌图标为**占位图**，正式做片时替换为目标产品的真实素材；10 款中文字体采用 SIL OFL 1.1 许可（许可见 `remotion/public/library/fonts/licenses/`）。
- 音效库中 58 个为 CC0，219 个来自 Sonniss GDC 2026 免费音效包（按 Sonniss 协议使用，不得原样单独出售、不得用于训练 AI，原协议见 `assets/sfx-library/Sonniss-GDC-License.pdf`；另附 `tools/sfx_rebuild.py` 供按原包重建）。
- 镜头卡"来源"栏如实记录了参考学习动态语法的公开作品，仅学动作，画面、文案与代码均独立设计编写。
- 做出来的片子要公开发布，请自行确认所用背景音乐、图片与产品素材的授权；渲染引擎 Remotion 个人与 3 人以内公司免费，详见 [Remotion License](https://www.remotion.dev/license)。
- 本项目版权与使用条款见 [LICENSE.md](LICENSE.md)（版权所有 © 2026 逐梦，保留所有权利；与 `zmcutskill` 一致）。
