# _style-desk：书桌风格的模板

风格卡：`styles/desk/STYLE.md`（先读《好在哪》和《锁死的和要拧的》）。竖屏 1080×1920。

> **只填 content.ts 能出片，但会是模板的调调**（用同一套模板只填内容做的测试片，被说"太重复了，都是一个调调"）。每条片子的两三个高点要在自己项目这份 `Scenes.tsx` 里现做新的场，见 `styles/desk/STYLE.md`《锁死的和要拧的》。

## 现在的示例

`content.ts` 里是一条 24 秒的假示例（"开手账小店的第一个月"）：没有口播视频，手机里是灰色人形占位；截图是 `content.ts` 里 `fakeChat` 用代码画的假聊天。不用放任何素材就能渲染 `desk1`、`desk2`，用来看这套样子、看每种场怎么写。抽帧见 `styles/desk/样片/换了内容的示例.jpg`。

## 换一条片子只改这几样

1. 复制整个文件夹到 `remotion/projects/<片子名>/`。
2. `content.ts`：每一段（Segment）写 `from`/`to`（全片秒数，段的边界落在两句话之间）、人在哪（`person`）、这一段的各场（`items`）。时间一律用 `w('字幕里的几个字')`，坐标是竖屏 1080×1920。删掉示例里的 `fakeChat`。
3. `subs.json`、`subs_chars.json`：`scripts/align_script.py` 出的字幕和逐字时间，覆盖掉这里的。
4. `public/<片子名>/`：口播初剪 `src.mp4`、截图；`content.ts` 开头 `configure({video})` 写初剪的路径，截图写 `public` 里的路径（比如 `myfilm/img/a.png`）。`video` 留空时手机里放占位；`src` 写 `data:` 开头的图也能用。
5. 字体：`public/fonts/desk/`（`scripts/workdir.sh` / `setup.py remotion` 会从 `styles/desk/fonts/` 复制过来）。
6. `src/Root.tsx` 里把 import `_style-desk/Film` 的那行换成你这份的 `Film.tsx`。示例和你的片子不要同时登记：`configure` 是全局的，后 import 的那份会把前一份的字幕和视频盖掉。

`Kit.tsx`（零件）、`Scenes.tsx`（每种场怎么画）、`Film.tsx`（登记）一般不用改；高点要的新场加在你这份的 `Scenes.tsx` 里。

## 有哪些场（`Scenes.tsx` 的 `Item`）

| type | 是什么 | 原片里的例子 |
|---|---|---|
| shot | 一张证据（手机 phone / 冲印照片 print）从右边换上来放正中；`pops` 说到时把截图上那几条原样拿起来放大、底下退暗，可带红笔圈、荧光笔；`rings` 直接在截图上圈；`push` 落定后慢慢推近；`items` 跟着这张一起进出的字 | 粉丝聊天、后台、评论区 |
| fan | 一组截图一张张落在桌上排成扇形；`pop` 其中一张上拿起来的那条 | "这是聊天记录啊" |
| pop | 只拿起来一块，不放整张 | 后台的一小块数据 |
| headline / small / note / chip | 印在桌上的粗宋体 / 手写小字 / 便签 / 彩色小标签。headline 加 `num: true` 数字用 Fraunces 斜体；字的右边别超过 x=1032（超了渲染日志里有 `[desk]` 提醒）；chip 可写 `out` 退场（不写就一直留着，放在 card 里时跟着卡片走） | 各处 |
| tag | 纸价签，可划掉、可往下沉 | 25 → 19.9 → 9.9 |
| line | 手画一条线 | 两个价格之间的箭头 |
| split | 一张卡分成 2、4、8 张 | 裂变 |
| stamp | 大字砸下来 | "变了" |
| card | 横线索引卡，`on` 写什么时候亮、什么时候退暗；里面放 chip / small / headline | 以前 / 现在 |
| thought | 想法云，可写 `out` 退场 | "会不会被骗？" |
| swap | 一句被红笔划掉、换成一个大词 | 价格卷到底 → 服务 |
| checklist | 一张纸上的几点，每点配原话、讲完打勾 | 话术三点 |
| pages | 静止的整理卡（几页），方便观众截图 | 客服话术 3 页 |
| loop | 几个节点连成一个圈，最后闭环（4 个以内照原片的位置；5 个以上沿圈均分） | 商业闭环 |
| stairs | 台阶，一级比一级高 | 小生意 → 第一步 → 正反馈 |
| grid | 十个格子，前九个划掉，最后一个亮 | 失败十次 |
| quote | 引号卡 | "我想赚钱，但是不知道从哪里开始" |
| bookmark | 书签点一下（镜头库 BookmarkTap） | 话术放在最后 |
| rec | 录屏放进一部手机：换上来就开始播（`rate` 倍速），播完停在最后一帧（`still` 是录屏最后一帧的截图）；`rings` 按录屏像素圈 | 记账软件录屏、输入法演示 |

人（`person`）：`[时间, 位置]`，位置 `B` 开头大、`F` 几乎满屏（情绪最满的话、高点用）、`L` 左、`C` 中、`R` 右、`offL`/`offR` 移出画面，`hideL`/`showL` 整个滑出去 / 滑回来；`drift` 开头慢慢推近。

## 渲染

和别的风格一样：`bash projects/_koubo-kit/seg.sh desk1 0 out/k 4 1 3 5 …` 抽关键帧（竖屏会自动拼成 9:16 的格子），`bash projects/_koubo-kit/rseg.sh desk1 <帧数> out/desk1` 分块渲染。画面里同时有人和录屏时内存吃得多，`rseg.sh` 已把解码缓存限在 800 MB。
