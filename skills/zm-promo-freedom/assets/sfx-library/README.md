# 本地音效库（277 个）

本目录随 Skill 附带 277 个预测量音效（均已量好时长、对齐点、响度与许可），做片时按 `references/sound-and-sfx.md` 与 `references/sfx-kinds.md`（22 类用途）优先挑选，录音优先于合成。

- **清单文件**：`音效库记录.json` 供程序读取，`音效库记录.md` 供人查阅。
- **使用回库**：制作完片子后可用 `tools/sfx_cue_page.py` 生成逐条试听页，用户反馈写回后用 `tools/sfx_library.py usage` 汇总回库。

## 许可说明（使用前请阅读）

- **219 个 Sonniss 音效**：选自 Sonniss GDC 2026 免费音效包（https://sonniss.com/gameaudiogdc ），完整协议原文见本目录 `Sonniss-GDC-License.pdf`。要点：免版税、可用于个人与商业音视频项目、无需署名；**不得将声音文件原样单独出售；不得用于训练或开发 AI 模型**；版权归各原作者所有。另附 `tools/sfx_rebuild.py` 供按原包重建。
- **58 个 CC0 音效**：公共领域（CC0，来自 Kenney、Freesound CC0 等，逐条来源见 `音效库记录.json`），可自由使用。
