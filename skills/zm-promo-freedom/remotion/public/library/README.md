# 素材与字体库（remotion/public/library）

本目录通过 Remotion `staticFile('library/...')` 供镜头组件加载。

## 一、关于占位图素材（`faces/`、`brands/`、`photos/`）

- 本开源发布包中的 **`faces/`（头像）、`brands/`（品牌图标）、`photos/`（实景照片）均为同名占位图**，仅用于保证 238 个镜头零件开箱可渲染不报错。
- **正式为产品制作宣传片时，请务必替换为目标产品自己的真实截图、官方图标或有合法授权的图片**，不要把占位图留在最终成片里。
- 原演示图片对应的免费图库（Unsplash / Pexels）与来源登记见同目录 `来源清单.md` / `来源清单.json`。

## 二、内置 10 款中文字体（`fonts/`，可直接使用）

全部采用 **SIL Open Font License 1.1（OFL-1.1）** 开源字体许可（可免费商用、可嵌入视频，不可单独售卖字体文件；各字体许可原文见 `fonts/licenses/`）。代码加载方式：`demos-own/groups/_kit/libFonts.ts` 的 `useLibFonts([...])`。

| 文件 | 字体 | 视觉性格与适用场景 | 来源 |
|---|---|---|---|
| `smiley-sans-oblique.ttf` | 得意黑 Smiley Sans | 窄长自带斜体，现代紧凑标题 | [GitHub atelier-anchor/smiley-sans](https://github.com/atelier-anchor/smiley-sans) |
| `zcool-qingke-huangyou.ttf` | 站酷庆科黄油体 | 方块超粗体，强冲击大字 / 描边字 | [Google Fonts](https://github.com/google/fonts/tree/main/ofl/zcoolqingkehuangyou) |
| `zcool-kuaile.ttf` | 站酷快乐体 | 圆润俏皮风格 | [Google Fonts](https://github.com/google/fonts/tree/main/ofl/zcoolkuaile) |
| `zcool-xiaowei.ttf` | 站酷小薇 LOGO 体 | 细衬线、粗细对比强，品牌标语 | [Google Fonts](https://github.com/google/fonts/tree/main/ofl/zcoolxiaowei) |
| `ma-shan-zheng.ttf` | 马善政毛笔楷书 | 毛笔书法质感 | [Google Fonts](https://github.com/google/fonts/tree/main/ofl/mashanzheng) |
| `zhi-mang-xing.ttf` | 志莽行书 | 行书飞白质感 | [Google Fonts](https://github.com/google/fonts/tree/main/ofl/zhimangxing) |
| `liu-jian-mao-cao.ttf` | 刘建毛草 | 草书花体，适合首字视觉强调 | [Google Fonts](https://github.com/google/fonts/tree/main/ofl/liujianmaocao) |
| `long-cang.ttf` | 龙藏体 | 轻盈手写体 | [Google Fonts](https://github.com/google/fonts/tree/main/ofl/longcang) |
| `lxgw-wenkai-bold.ttf` | 霞鹜文楷 粗 | 温润人文楷书，正文/金句 | [GitHub lxgw/LxgwWenKai](https://github.com/lxgw/LxgwWenKai) |
| `noto-serif-sc-vf.ttf` | 思源宋体 可变字重 200–900 | 细宋拉开字距到超粗宋全字重覆盖 | [Google Fonts](https://github.com/google/fonts/tree/main/ofl/notoserifsc) |
