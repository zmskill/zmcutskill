# 装东西时带用户解决问题

体检（`scripts/doctor.py`）或安装（`scripts/setup.py`）卡住时，照这里一步一步带用户。用大白话，不甩术语，一次只让用户做一件事，做完再体检一次。

**工具是固定的，不换**：Remotion 和它自带的浏览器、SenseVoice 听写模型、ffmpeg。装不上就把路打通，不改用别的工具，也不假装已经装好。

## 网站被拦了

体检里某个网站"连不上"，说明当前 AI 的网络设置没放行它。先这样跟用户说：

> 我要从 **〈网站〉** 下载 **〈东西〉**（用来〈做什么〉），但你现在的网络设置不允许连这个网站。放行一下就能继续，只需要做一次。

再按用户用的 AI 带他放行：

**Claude 桌面版（Cowork）**

1. 打开 Claude 桌面版的 **设置（Settings）→ Capabilities**。
2. 找到网络访问的设置（Allow network egress / Domain allowlist）：
   - 如果是 **Package managers only**（只允许常用的包管理站），在 **Additional allowed domains** 里加上被拦的网站，比如 `remotion.media`。
   - 也可以把 Domain allowlist 改成 **All domains**（所有网站都能连）。
3. 团队版、企业版的账号，这个设置由管理员在 **Organization settings → Capabilities** 里统一管。用户自己改不了时，请他把要放行的网站发给管理员。
4. 改完**新开一个任务**再试：设置对已经在跑的任务不生效，在原来的任务里怎么重试都还是被拦。新任务里跑 `python3 scripts/doctor.py`。
5. 新任务里还是连不上：设置生效可能要等一会儿（实测过改完马上试还被拦、过一阵再开新任务就通了），隔几分钟再开一个新任务试。还不行，请管理员确认改的是用户正在用的那个组织、点了保存。

**其他 AI（Codex、WorkBuddy 等）**：在它的设置里找"网络访问""沙盒""允许的域名"一类的选项，把网站加进去。找不到就请用户截图设置页面，再一起找。

**公司网络拦的**（在自己终端里也连不上）：请用户把网站发给公司 IT。

会用到的网站：

| 网站 | 用来下载什么 |
|---|---|
| `registry.npmjs.org` | Remotion 依赖 |
| `remotion.media` | Remotion 渲染用的浏览器 |
| `github.com` | 听写模型 |
| `pypi.org` | Python 小包、ffmpeg（imageio-ffmpeg） |

## 装 Node.js

Node.js 是系统软件，`setup.py` 不替用户装。先问用户，同意后：

- **Mac**：有 Homebrew（终端里 `brew -v` 有版本号）就 `brew install node`；没有就请用户打开 nodejs.org，下载 LTS 版安装包，双击装好。
- **Windows**：请用户打开 nodejs.org，下载 LTS 版安装包装好。
- **Cowork 这类环境**：环境里一般已经有 Node，体检会显示；没有就告诉用户当前环境缺 Node，换一个有 Node 的环境。

装好后重新体检。

## 不能删文件、命令有时长上限（Cowork 这类环境）

- 依赖装在 AI 自己的工作区（`setup.py` 会自动用 `scripts/workdir.sh` 搭），不装进用户的文件夹，所以不需要用户批准删除。
- 不要让用户为了装依赖去批准删除他的文件夹。
- 下载和渲染被单条命令的时长上限打断，就再跑同一条命令，会接着来。不要放后台（这类环境里命令一结束，后台进程就被停掉）。
