# _koubo-kit：口播成片的共用零件

来自一条 7 分钟口播的全片。怎么用见 `references/koubo-full-film.md`。

**注意：这里的外壳和颜色就是"笔记本"那套样子**（`styles/notebook`），不是中性零件。别的样子不要直接复制 `Kit.tsx` 的 `Shell` 和 `LK`；镜头（`KouboShots.tsx`）可以直接借：它读当前风格的值（`styles/current.ts`），放进哪套风格的外壳就长成哪套的样子。笔记本的颜色字体在 `styles/notebook/values.ts`。操作台的模板在 `remotion/projects/_style-workbench/`。

| 文件 | 是什么 |
|---|---|
| `Kit.tsx` | 外壳、舞台、卡片、截图卡、侧卡、画圈、气泡、图标、关卡地图。换片子要改 `LK`（样子）、`R_WIN`（人物窗的位置）。人物有三种位置：满屏 `R_FULL`、窗 `R_WIN`、左下角小窗 `R_MINI`；`Shell` 的 `sw` 里写 `[秒, true]` 满屏、`[秒, false]` 窗、`[秒, 'mini']` 小窗 |
| `Notebook.tsx` | 笔记本补的三样：`RecCard` 录屏卡（右边大白卡里放录屏或定格图，可推近）、`HRing` 手画圈（圈在录屏上说到的地方，带小标签）、`RouteMap` / `ChapterOpen` 章节路线图（几站走到终点，站名、终点、走的人都传进去）。配合 `Shell` 的 `'mini'`：演示录屏时人缩到左下角 |
| `NotebookTest.tsx` | 上面三样的样片（composition `nbtest`，300 帧，不需要素材） |
| `KouboShots.tsx` | 镜头库 8 个镜头的口播版：`OrbitCounter` 大数字环绕、`PickWall` 一墙里挑、`DMWall` 私信墙、`SceneCuts` 场景硬切、`TwoLines` 两句收尾、`QuestionWall` 提问墙、`CurvedReel` 弯曲轮播、`BookmarkTap` 书签 |
| `KShotsTest.tsx` | 上面 8 个的样片（composition `kshots`，1110 帧）。样片视频：`口播版镜头样片.mp4` |
| `Example.tsx`、`example_subs.json` | 一段的写法（composition `example`；要先在 `public/demo/` 放 `src.mp4` 和 `shot.png` 才能渲染） |
| `seg.sh` | 抽几帧拼成一张图：`seg.sh <composition> <这段起点秒> <输出目录> <列数> 秒数…` |
| `rseg.sh` | 把一段分块渲染再拼起来：`rseg.sh <composition> <总帧数> <输出目录>` |
| `rchunk.sh` | 只重渲染其中几块：`rchunk.sh <composition> <总帧数> <输出目录> 块号…`（每块 330 帧） |
| `q.sh` | 渲染队列：读 `out/queue.txt`，一行一个 `<composition> <帧数> <输出目录>` |

脚本默认 remotion 项目根目录是本文件夹往上两层；浏览器找不到时设 `CHROME=…`。渲染和抽帧不能同时跑，脚本之间用 `out/stills.lock` 让路。

新片子：把 `Kit.tsx`、`Notebook.tsx`、`KouboShots.tsx` 复制到自己的项目文件夹（`remotion/projects/<片子名>/`），在 `src/Root.tsx` 里登记各段。引用镜头库零件的路径是 `../../../shot-library/kit/polish`。

口播版现在有 8 个。别的镜头用到时现改，改完加进 `KouboShots.tsx`，并在 `shot-library/index/koubo-fit.md` 里登记。

## 两个可选参数

- `mkW(SUBS, CHARS)`：`CHARS` 是 `scripts/align_script.py` 和 `subs.json` 一起出的 `subs_chars.json`（每行每个字的秒数）。传了就按听写的逐字真实时间对到字；不传只能按字在那一行里的位置估。
- `Shell` 的 `mini`：人物小窗的位置，默认左下 `R_MINI`。录屏的重点在左下时换个角，比如右下 `[1384, 640, 480, 270]`，同时把 `Notebook.tsx` 的 `REC_BOX` 挪开。
