# 书桌风格用的字体（都可以免费商用、可以随 skill 分发）

| 文件夹 | 字体 | 许可 | 来源 |
|---|---|---|---|
| wenkai/ | LXGW WenKai 霞鹜文楷 Bold（按字符切成 97 个 woff2 子集） | SIL OFL 1.1（OFL.txt） | npm 包 lxgw-wenkai-webfont 1.7.0 |
| fraunces/ | Fraunces 600/900 正体和斜体（只有拉丁字符和数字） | SIL OFL 1.1（LICENSE） | npm 包 @fontsource/fraunces |

标题用的 Noto Serif CJK SC、字幕用的 Noto Sans CJK SC 是系统字体（Linux 一般预装 Noto CJK；Mac 没有时会退到系统宋体/苹方，样子会差一点，可以装 Noto CJK）。

渲染前要把这个文件夹放到 `remotion/public/fonts/desk/`：`scripts/workdir.sh`、`python3 scripts/setup.py remotion` 会自动复制。手动复制：
`mkdir -p remotion/public/fonts/desk && cp -r styles/desk/fonts/* remotion/public/fonts/desk/`
