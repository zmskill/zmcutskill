// 操作台的值。外壳在 remotion/projects/_style-workbench/。说明见同目录 STYLE.md。
import type {StyleValues} from '../current';

// 外壳自己用的：软件界面的深灰、轨道色
export const DESK_UI = {bg: '#0f1115', panel: '#171a20', panel2: '#1d2128', line: '#2a2f38', text: '#e9ebef', dim: '#8b919c', faint: '#4a505b',
  v: '#4c8dff', t: '#f2c14e', a1: '#3ecf8e', a2: '#e8642a', red: '#ff5a4f', green: '#3ecf8e'};

// 镜头库的镜头放进操作台时读这一份：深色卡片、浅色字，舞台是节目监视器
export const WORKBENCH: StyleValues = {
  name: 'workbench',
  font: '"PingFang SC", "Noto Sans CJK SC", "Noto Sans SC", sans-serif',
  mono: 'Menlo, "DejaVu Sans Mono", monospace',
  ink: '#e9ebef', ink2: '#b4bac4', ink3: '#8b919c',
  accent: '#e8642a', hi: '#f2c14e', blue: '#4c8dff', red: '#ff5a4f', green: '#3ecf8e',
  surface: '#1d2128', surfaceRGB: '29,33,40', cardBorder: '#2a2f38', cardBg: 'linear-gradient(180deg, #252a33, #1b1f26)', cardEdge: 'inset 0 1px 0 rgba(255,255,255,0.08), 0 0 0 1px #2a2f38', shadow: '#000000',
  line: 'rgba(255,255,255,0.10)', sceneBg: '#0f1115',
  tints: ['#e8642a', '#4c8dff', '#3ecf8e', '#f2c14e', '#9b7bff', '#ff6b8a', '#3ab7c9'],
  stage: {w: 1040, h: 585},
};
