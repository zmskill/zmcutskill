---
name: zm-promo-freedom
description: 宣传片自由（zm-promo-freedom）：用真实产品页面、238 个小零件镜头库、277 个本地音效库、3D 空间连续运镜和 Remotion 制作卡点丝滑的产品宣传片。支持从真实痛点到成片交付的全流程制作、单镜头动效制作，以及为已有视频/镜头配音、换音与音画对齐。Create cinematic, beat-synced product promo videos from web/software products using Remotion, real UI captures, 238 modular motion parts, 3D continuous camera movement, and a local 277-SFX library.
---

# 宣传片自由（zm-promo-freedom）

**版本：1.0.0** · 面向软件、Web 与 AI 产品的电影感宣传片制作 Skill（Remotion 代码渲染，非套模板）。

> **沟通铁律**：只对用户说大白话；只问用户答得上来的事（做什么产品、想强调什么、发在哪、喜欢哪首歌）。剪辑节奏、运镜、转场、音色与技术参数全部由你定夺，不要拿内部术语去问用户。

---

## 一、先判断任务范围与模式

- **只处理已有视频或镜头的音效**：直接读 `references/sound-and-sfx.md`，进入选音、合成、对齐或音量计算，不走整片创作流程。
- **只做单个镜头 / 单段动效**：从 `references/parts-own/INDEX.md` 挑零件，读 `references/visual-and-parts.md` 与对应零件卡、原镜头代码，替换成目标产品内容并渲染。
- **制作完整宣传片**：支持两种协作模式——**全自动推进**（问清需求后一路做到终检交片）与**共同创作**（在「痛点与故事」「3 张效果图拼图」「整片画面与节奏时间表」三处先给用户确认再继续）。**如果用户开工没提前说明要哪种模式，必须在第一步"一次问清"里明确询问，等用户选定再开工**（跟用户沟通一律用大白话，不说"定调静帧""分镜总谱"等行话）。

---

## 二、开工前先体检环境

首次使用或换新环境时，先跑只读体检：

```bash
python3 $SKILL/tools/doctor.py
```

缺依赖时先征得用户同意，再按提示运行 `python3 $SKILL/tools/setup.py`（遇到网络放行或系统安装问题见 `references/setup-help.md`）。新片子用 `python3 $SKILL/tools/new_video.py <片子目录>` 初始化 `video/` 工程，复用已装好的 Remotion 依赖，不在用户目录里重复装包。

---

## 三、必做的七步流程（前一步关口没过，不进后一步）

1. **开工一次问清 + 音乐画像**（`references/workflow-and-review.md`、`references/music-and-beats.md`）
   - 一次问清产品/功能、是否需人工登录、BGM 与大致片长、发布平台与禁忌话术；若用户未提前指定协作方式，顺带问清「一路全自动做完交片，还是关键三步先给你确认再继续」。
   - **本项目不带任何音乐**：请用户提供有授权的歌；若没有，把 `assets/audio/bgm/去哪找歌.md` 中的正规渠道发给用户挑选。绝不私自下载或使用无授权歌曲。
   - 由你自主判断这首歌的剪辑气质（内部对应燃 / 中 / 松三档），用一句大白话告知用户你的剪法，写进 `--feel`。
   - 依次运行 `tools/beats.py` → `tools/zm_beat_phase.py`（校验反拍）→ `tools/zm_music.py`（输出情绪三数、音乐结构表、同步点数量）；开头安静段超限就用 `tools/cut_song.py` 在小节线上剪歌；剪好歌后跑 `tools/zm_hits.py` 实测每拍真正响起的时刻（生成 `hits.ts`，画面用 `onF()`、音效用 `hitF()`）。

2. **真实痛点、实测与故事**（`references/story-and-copy.md`、`references/capture-and-build.md`）
   - 收集 ≥3 条真实用户吐槽（带出处）→ 选出最痛的一个当钩子 → 定全片唯一的"魔法瞬间"与一个直观"证据"。
   - **真实使用一次产品**，拿到真实结果、实测数字与页面截图（有源码用 `capture-template.mjs`，线上需登录产品由用户本人登录后用 `capture-live.mjs`）。
   - 选叙事骨架（单功能用 `sequences/zm-single-feature-five-beats.md`，全产品用 `sequences/zm-promo-energy-arc.md`），建立 `## 片中说的每句话` 实测依据表。

3. **一个主意 + 定调静帧**（`references/core-principles.md`、`references/visual-and-parts.md`）
   - 从产品自身生长出 3 个不同视觉主意，各出 1 张定调静帧拼图（问题段 / 魔法瞬间 / 落版），选 1 个贯穿全片。
   - 确立全片一套皮（最多 2 种底色且只换 1 次、统一光影质感与字重），保证主体够大、开头 2 秒有强动态、魔法瞬间后有真实成果特写（占屏 ≥60%、清晰可读 ≥1 秒）。

4. **声音先行：钉同步点与连打**（`references/motion-and-camera.md`、`references/sound-and-sfx.md`）
   - 先把音乐和少数几个核心同步点钉死在时间线上，再排画面。
   - 拍子上放的是**镜头最快的那一刻、速度接力的切点、进场鼓包的顶点**，严禁放"2 帧弹出就定住"的顿挫动作；全片至少一段等间隔连着来（连打）。
   - 每个同步点配齐预备、夸张、跟随、重音效与音乐让开（`duck()`）；同时响不超过 2.5 层。

5. **画镜头路线、选零件、写总谱 → 过关口一**（`references/motion-and-camera.md`、`references/visual-and-parts.md`、`references/workflow-and-review.md`）
   - 先把全片分成 2–4 段连续 3D 空间（`## 镜头路线`），定每段不重复的展示手法（`## 每段的展示手法`）；转场只用**飞过去 / 卡拍硬切（速度接力）/ 同物接续**，"糊着换"全片最多 1 次。
   - 浏览 `references/parts-own/INDEX.md` 全部 12 类并查看候选的 `preview-sheet.jpg`；先跑 `tools/zm_fit_parts.py` 存盘；30 秒至少 8 个小零件、单镜 ≤6 秒、同源零件不超过全片 1/3；确需现写的须写明看过哪至少两个零件及原因。
   - 零件一口气按原速播完，**不冻帧、不停留、不慢放**；对拍靠挪起点（对主落点）、镜头移动和切点。
   - 写完整设计 spec（含九列总谱、每个接缝的关系与锚点、只读大字、脚本关口），运行关口一：
     `python3 $SKILL/tools/zm_check.py plan <设计spec.md> --profile ... --styleframe ... --fit ... --phase ...`
   - **关口一未通过之前，不写正式镜头代码。**

6. **写代码、渲半尺寸小样、量片自查 → 渲全尺寸成片**（`references/motion-and-camera.md`、`references/capture-and-build.md`）
   - 全片大部分时间在 `World` / `Stage` 中用 `camMoves` 连续飞行并开启真实运动模糊；切镜头用 `relay()` 速度接力；进场用 `ramp()` 或 `land()`；时间点全从 `onF()` / `hitF()` 计算；音效音量用 `tools/zm_sfx_levels.py` 算；库里没有的音色用 `tools/zm_sfx_synth.py` 合成。
   - **第二道查（小样）**：先以 `--scale=0.5 --crf=30` 渲小样，跑 `tools/zm_film_check.py`（十项底线）并按 0.1s/帧出缩略图逐格自查，改到全过再渲全尺寸（局部改动只渲 `--frames=起-止`）。
   - 全尺寸整条只渲一次（同时导出带 BGM 与不带 BGM 两版），过 `ffmpeg loudnorm=I=-14:TP=-1.5:LRA=11` 响度标准化，跑正式量片报告与音画同步回测。

7. **独立终检 → 过关口二交片**（`references/workflow-and-review.md`）
   - 每一轮派全新无上下文审片人：先只看成片写"第一眼"，再查画面八条与转场/卡点/运镜/丝滑四项，一次提完（分"必须改/建议"）；修改前先写修改计划；审到"可以交付"为止，不为省时间降标准。
   - 生成音效试听页（`tools/sfx_cue_page.py`）与《没做清单》（含演示残留、用时、终检问题归因），跑关口二：
     `python3 $SKILL/tools/zm_check.py deliver <设计spec.md> --video ... --review ... --notdone ... --filmcheck ... --project ... --draftcheck ...`

---

## 四、资产与文档速查

| 资产 | 位置 | 说明 |
|---|---|---|
| 238 个小零件镜头库 | `references/parts-own/INDEX.md`、`demos-own/parts/`、`gallery/api/parts-own.json` & `parts-landings.json` | 12 类用途，1–6 秒独立动作；`shots-own/`、`groups-own/` 仅换内容时查阅 |
| 277 个本地音效库 | `assets/sfx-library/`、`references/sfx-kinds.md` | 219 Sonniss GDC 2026 + 58 CC0，预量好时长/对齐点/响度，录音优先 |
| 渲染底座与字体素材 | `remotion/`、`remotion/public/library/`、`remotion/public/textures/` | 独立 Remotion 工程、10 款 SIL OFL 1.1 中文字体、占位素材与来源清单 |
| 核心代码组件 | `assets/lib/helpers/` | `world.tsx`、`partPlay.tsx`、`mix.ts`、`beatLand.ts`、`polish.tsx`、`groupClock.ts`、`plane.ts`、`rand.ts` |
| 自动化工具链 | `tools/`、`assets/scripts/` | 体检安装、节拍实测、剪歌、合拍、音量计算、合成音效、十项量片、两道关口、双入口采集 |

| 当前环节 | 必读文档（职责互斥，按需通读） |
|---|---|
| 开工总纲与核心防呆 | `references/core-principles.md`、`references/motion-and-camera.md` |
| 环境安装排障 | `references/setup-help.md` |
| 拿到 BGM、剪歌、排总谱 | `references/music-and-beats.md` |
| 找痛点、写故事、定文案 | `references/story-and-copy.md` + 选中的 `references/sequences/zm-*.md` |
| 定风格、一套皮、挑零件 | `references/visual-and-parts.md` → `references/parts-own/INDEX.md` |
| 配音效、合成、混音对齐 | `references/sound-and-sfx.md`、`references/sfx-kinds.md` |
| 实机采集、脱敏与工程搭建 | `references/capture-and-build.md` |
| 三道查、两道关口、独立终检 | `references/workflow-and-review.md` |
