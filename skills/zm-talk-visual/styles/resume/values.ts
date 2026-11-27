// 简历（讲本事是怎么攒出来的）的值。说明见同目录 STYLE.md。
// 颜色字体实际写在 remotion/projects/_style-resume/Kit.tsx 的 P；这里是给镜头库读的那份（styles/current.ts 的格式）。
import type {StyleValues} from '../current';

export const RESUME: StyleValues = {
  name: 'resume',
  font: '"WenKaiB", "Noto Serif CJK SC", serif',
  ink: '#1E2A4F', ink2: '#26325C', ink3: '#b9b2a2',
  accent: '#E0763A', hi: 'rgba(224,118,58,0.16)', blue: '#3d7cf0', red: '#E0763A', green: '#5c8a52',
  surface: '#fffdf8', surfaceRGB: '255,253,248', cardBg: '#fffdf8', cardBorder: '#26325C', cardEdge: 'inset 0 0 0 3px #26325C', shadow: '#26325C',
  line: 'rgba(38,50,92,0.35)', sceneBg: '#F4F0E6',
  tints: ['#E0763A', '#26325C', '#cfc8b8', '#d9e6f5', '#7d9a6f'],
  stage: {w: 1080, h: 1200},
};
