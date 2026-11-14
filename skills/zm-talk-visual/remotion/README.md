# remotion：口播成片的渲染工程

怎么用见 `../references/koubo-full-film.md` 第 1.5 步和第 4、5 步。这里只说文件夹里有什么。

| 位置 | 是什么 |
|---|---|
| `src/Root.tsx` | 登记所有 composition。新片子的每一段都要在这里 import 并加一行 `K('id', 组件, 帧数)` |
| `projects/_koubo-kit/` | "笔记本"风格的外壳和零件、8 个镜头的口播版（读当前风格的值）、抽帧和渲染脚本，见那里的 README |
| `projects/_style-workbench/` | "操作台"风格的模板：复制整个文件夹，只改 `content.ts`；`workbench-demo` 是不需要素材的示例 |
| `../styles/` | 风格库：每套的说明、值（`values.ts`）和样片；`current.ts` 让镜头读当前风格 |
| `public/` | 不在 skill 里，第一次自己建；放这条片子的口播初剪和素材 |
| `node_modules/` | 不在 skill 里，`npm install` 装 |

镜头代码从上一级的 `shot-library/` 引用，所以这个文件夹要放在 skill 根目录下。
