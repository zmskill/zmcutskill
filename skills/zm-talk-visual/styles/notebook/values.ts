// 笔记本的值。外壳在 remotion/projects/_koubo-kit/Kit.tsx。说明见同目录 STYLE.md。
import type {StyleValues} from '../current';

export const NOTEBOOK: StyleValues = {
  name: 'notebook',
  font: '"PingFang SC", "Noto Sans CJK SC", "Noto Sans SC", sans-serif',
  ink: '#1d212b', ink2: '#5b5f6b', ink3: '#9c9a98',
  accent: '#f0672a', hi: '#ffdc7a', blue: '#2f6db5', red: '#e5432d', green: '#2f9e6b',
  surface: '#fffdf9', surfaceRGB: '255,253,249', cardBorder: 'rgba(255,255,255,0.9)', cardBg: 'linear-gradient(180deg, #fffefb, #faf5ec)', cardEdge: 'inset 0 1px 0 #fff', shadow: '#3a2a18',
  line: 'rgba(40,30,20,0.10)', sceneBg: '#f3efe8',
  tints: ['#f0672a', '#2f6db5', '#2f9e6b', '#c9892b', '#8a5bd1', '#d1456d', '#3a8fa3'],
  stage: {w: 740, h: 660},
};
// 笔记本外壳自己用的底色
export const NOTEBOOK_BG = {bg0: '#fdfaf5', bg1: '#f6f0e6', bg2: '#efe6d8'};
