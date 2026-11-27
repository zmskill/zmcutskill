# zmcutskill

[![Version](https://img.shields.io/badge/version-1.0.0-2563EB.svg?style=flat-square)](VERSION)
[![License](https://img.shields.io/badge/license-All%20Rights%20Reserved-16A34A.svg?style=flat-square)](LICENSE.md)

## zmcutskill 是什么

zmcutskill 是[逐梦](#关于作者)做的剪辑 Skill 合集。Skill 是一套写给 AI 的做事方法：装到能干活的 AI（比如 Claude 桌面版的 Cowork、Claude Code、Codex）里之后，你在对话里说一句，AI 就照着这套方法帮你剪。

现在有：

- **口播内容视觉化**：你录好口播、剪好气口，它逐句配上画面、动效、字幕和音效，交回能直接发的成片。说到哪句，就出现哪句的画面。

更多剪辑类 Skill（产品宣传片等）陆续加入。

## 快速开始

**第 1 步：安装**

在终端运行：

```bash
npx -y skills add zmskill/zmcutskill -g --all
```

不会用终端：把下面这段原样发给你的 AI，让它自己装：

```text
请把 https://github.com/zmskill/zmcutskill 这个仓库里 skills/ 下面的文件夹，装进你能读取的 skills 目录，装好告诉我装在哪了。
```

**第 2 步：新手入门**

在对话里说：

```text
用 zm-talk-visual 新手入门
```

它会讲清楚能做什么、要准备什么。收到你的素材后，它会查一遍环境：装好的不提，缺的东西装之前先问你。

**第 3 步：开始做片**

```text
用 zm-talk-visual 把 ~/Desktop/我的口播 里的视频做成成片，素材在同一个文件夹
```

它会先问你两件事：这条的样子从哪来（按内容设计 / 从风格库挑 / 照参考视频），要不要背景音乐。然后排一张对照表给你看，你确认后一段一段做，每做完一段发给你看。

## 关于作者

我是逐梦，目前在研究 AI 剪辑。2024 年 2 月接触 AI 和自媒体，4 月做出第一篇百万爆款后转全职，7 月开始尝试 AI 跨境，一年赚到第一个百万，2025 年被电视台和《The World of Chinese》等媒体报道。下个目标是旅居办公。

- 抖音／小红书／公众号：逐梦带你玩AI
- 推特：[@AmbitiousXU](https://x.com/AmbitiousXU)

**新风格**：「舞台」（字和特效跟人互动）等风格正在调试。点右上角的 Star 或 Watch，更新时第一时间能看到。

**遇到问题**：安装或使用卡住了，可以[提 Issue](https://github.com/zmskill/zmcutskill/issues)，或发邮件到 zmxuskill@163.com，附上是在哪个 AI 里用的、卡在哪一步、报错的原文。

**想有人带着做**：想让我本人带着装、带着做出第一条片，或者想聊怎么用 AI 做自媒体，可以看[付费答疑群说明](https://mp.weixin.qq.com/s/ffJH8QW-KP1KmYJtajc_9w)。

觉得有用的话，点一下 Star，我会更有动力继续更新，也欢迎指出问题。

## 有哪些 Skill

| 命令 | 用途 |
| --- | --- |
| [`/zm-talk-visual`](skills/zm-talk-visual/SKILL.md) | 口播内容视觉化：给录好的口播逐句配上画面、动效、字幕和音效，交回能直接发的成片 |

## 口播内容视觉化

**你要准备的**：

- 一条已经剪好气口的口播初剪（横屏竖屏都行；竖屏目前用书桌风格）
- 文案（没有也行，会按听写来，拿不准的字会问你）
- 一个素材文件夹：截图、录屏、照片，画面要用到的真实证据
- 要背景音乐的话，你自己挑好的歌（Skill 不替你挑歌）

**风格库里现有的三套**：

| 风格 | 适合 |
| --- | --- |
| 笔记本（讲自己的经历和成果） | 讲经历、踩坑、步骤、成绩；手上有截图、照片、数字 |
| 操作台（讲软件怎么用） | 讲一个工具怎么用、一样东西怎么做出来；手上有录屏 |
| 书桌（日常分享，拿截图说话） | 竖屏的日常分享、讲自己做成的一件事；手上有聊天记录、后台数据、评论区截图 |

不想用现成的，可以让它按这条的内容设计一套新样子，或者给它一条你喜欢的参考视频。

**提问时附上这些，结果更好**：口播文件和素材在哪个文件夹；这条主要讲什么、给谁看；有没有特别想要或不想要的效果。

**不适合**：只加字幕或花字；多机位粗剪；数字人、配音；只有文案没有录音；只要通用空镜。

## 能在哪些 AI 里用

不看是哪个 AI，看它**能不能读写你的文件、能不能跑命令**：能，就能做出成片；只能聊天的 AI（网页版、纯对话），只能帮你排方案，做不出成片。

实测过的：Claude 桌面版的 Cowork（体检、安装、听写都跑通，依赖装在 AI 自己的工作区，不往你的文件夹里塞东西）、Claude Code。Codex、WorkBuddy 等其他能跑命令的 AI 没实测过，欢迎反馈。

## 需要的环境

第一次做片时 AI 会自己体检（`python3 scripts/doctor.py`），缺的问过你再装（`python3 scripts/setup.py`）。用的工具是固定的，效果是在这套工具上调出来的，不会换成别的：

| 东西 | 用来做什么 | 怎么装 |
| --- | --- | --- |
| Node.js | 跑 Remotion 渲染 | 系统软件，AI 会告诉你怎么装（Mac 上 `brew install node`，或 nodejs.org 下载） |
| ffmpeg | 听写、混音、拼接 | AI 帮你装（brew 或 pip，不需要管理员权限） |
| Python 3 + numpy、Pillow、scipy | 量音量、拼抽帧图 | AI 帮你装 |
| Remotion 依赖（版本锁定） | 渲染画面 | AI 帮你装，几分钟 |
| Remotion 自带的浏览器 | 渲染时用 | AI 帮你装，从 remotion.media 下载 |
| SenseVoice 离线听写模型（下载约 670 MB，装好占约 2.1 GB） | 把口播听写成逐字时间，画面靠它对准每个字 | AI 帮你下载，断了能接着下；离线运行，不上传你的口播 |

画面用 [Remotion](https://www.remotion.dev) 渲染。Remotion 不是开源软件：个人和 3 人以内的公司免费（商用也可以），更大的公司要买公司授权，使用前请看它的[许可条款](https://www.remotion.dev/license)。

## 常见问题

**装好后没看到命令**：先确认安装命令跑成功了，并且装到的是你正在用的 AI。直接在对话里说"用 zm-talk-visual"也可以。

**说某个网站连不上、装不上**：是 AI 的网络设置没放行。Claude 桌面版：设置 → Capabilities，在 Additional allowed domains 里加上那个网站（比如 `remotion.media`），或者把 Domain allowlist 改成 All domains；团队版由管理员在 Organization settings → Capabilities 里改。AI 会一步一步带你做。

**装东西被要求批准删除文件**：在 Cowork 里，依赖应该装在 AI 自己的工作区，不该装进你的文件夹。遇到这种情况，提醒它先跑 `doctor.py`，按建议用 `setup.py` 装。

## 用 Claude Code 插件方式安装

只用 Claude Code 的话，也可以装成插件。在终端运行：

```bash
claude plugin marketplace add zmskill/zmcutskill
claude plugin install zm@zmcutskill
```

插件方式下命令前面要加 `zm:`，例如 `/zm:zm-talk-visual`。上面的 `npx` 方式和插件方式装一种就够，两种都装会多出一份。

## 更新

重新运行一次安装命令就是更新：

```bash
npx -y skills add zmskill/zmcutskill -g --all
```

插件方式装的，这样更新：

```bash
claude plugin marketplace update zmcutskill
claude plugin update zm@zmcutskill
```

更新后第一次做片，AI 体检时会发现工作区里的代码比新版旧，问过你之后换成新的。已经装好的依赖、听写模型和你做过的片子都不受影响。

遇到问题或有建议，发邮件到 zmxuskill@163.com，附上是在哪个 AI 里用的、卡在哪一步、报错的原文。

## 音效

Skill 自带 209 个音效：167 个来自 [Sonniss GDC 2026 免费音效包](https://gdc.sonniss.com)（免版税、可商用、无需注明出处），42 个是 CC0（公共领域）。

## 版权与使用条款

版权归逐梦所有，保留所有权利。可以免费安装、使用，用来做自己的视频或给客户做视频都可以，做出来的视频拿去赚钱也没问题。

没有书面许可，不得转载、再分发、打包进其他产品或课程、出售、公开发布修改版，也不得用于训练 AI。分享本仓库链接不受限制。完整条款见 [LICENSE.md](LICENSE.md)。

申请书面许可、咨询条款或商务合作：zmxuskill@163.com
