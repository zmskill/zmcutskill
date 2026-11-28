# remotion/ — 独立渲染底座

本目录提供做片子的最小 Remotion 渲染工程与共享公共资源。

- **环境体检与安装**：跑 `python3 tools/doctor.py` 查看缺失项，确认后跑 `python3 tools/setup.py`（依赖默认安装在独立工作区 `~/zm-work/zm-promo-freedom/remotion`，保持 skill 目录干净；版本锁定在 `package-lock.json`，请勿随意升级）。
- **新建片子工程**：跑 `python3 tools/new_video.py <片子文件夹>` 从这里复制配置、入口与公共素材，并将 `node_modules` 软链到工作区依赖。
- **`public/` 公共资源**（Remotion 中通过 `staticFile()` 访问）：
  - `textures/live/dash_*.png`：斜放仪表盘镜头的预烘焙贴图；
  - `library/`：10 款 SIL OFL 1.1 中文字体及占位图素材（见 `library/README.md` 与 `library/来源清单.md`）。
- **跨目录引用**：镜头代码位于 `demos-own/` 与 `assets/lib/helpers/`，`remotion.config.ts` 已自动配置模块解析路径。
