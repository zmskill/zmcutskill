// 入口：做片子时在 Root.tsx 里登记这条片子的各段；试渲单个镜头用 tools/shot-lab/render_shot.py（它会临时生成 shotlab-root.tsx）。
import { registerRoot } from 'remotion';
import { Root } from './Root';

registerRoot(Root);
