# 音效库（跟着 skill 走）

skill 配音效时从这里选。以后补音效补到这里，再跑 `python3 scripts/sfx_library.py build assets/sfx-library` 重建记录。

- 277 个音效（`补缺/20_…`–`33_…` 是后补的 68 个：短甩、运镜气流、上升下滑、吸入、上扬铺垫、闪光、落版重击、轻 tick、chime、故障、旋转、电流、落下、彩纸）。`音效库记录.json` 给程序读，`音效库记录.md` 给人看，`记录草稿.json` 是分类和对齐方式的草稿（改它再重跑 build）。怎么记、怎么选、怎么配：`references/sound-library.md`。`试听.html` 可以在浏览器里逐个试听（只有最早的 209 个）。
- **来源和许可**：219 个来自 Sonniss GDC 2026 免费音效包：免版税、可商用、无需注明出处，详见 Sonniss 官网（https://gdc.sonniss.com）和原包里的许可协议。58 个是 CC0（公共领域；Kenney、Wyzowl sfx-kit 合成、Freesound CC0 等，见每条的"来源"）。记录里每条都有"许可"一栏。
- 记录里分类、对齐方式是按文件名和原有说明起草的，没有逐个听过；用到哪个先看波形。
- 每条的"你的评价"空着：用户听过、用过之后说哪条好、哪条不对，填进去。
