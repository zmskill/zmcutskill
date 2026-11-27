// 书桌（日常分享，拿截图说话）的值。说明见同目录 STYLE.md。
// 颜色字体实际写在 remotion/projects/_style-desk/Kit.tsx 的 D；这里是给镜头库读的那份（styles/current.ts 的格式）。
import type {StyleValues} from '../current';

export const DESK: StyleValues = {
  name: 'desk',
  font: '"WenKaiB", "Noto Sans CJK SC", sans-serif',
  ink: '#2b211b', ink2: '#6f5d50', ink3: '#b3a08f',
  accent: '#d9502e', hi: '#f7da8c', blue: '#6f8fd6', red: '#d9502e', green: '#5c8a52',
  surface: '#fffdf8', surfaceRGB: '255,253,248', cardBg: '#fffdf8', cardBorder: '#ffffff', cardEdge: 'inset 0 1px 0 #fff', shadow: '#4a301a',
  line: 'rgba(58,42,34,0.12)', sceneBg: '#efe5d6',
  tints: ['#d9502e', '#fbe7a6', '#f6d4cf', '#d9e6f5', '#7d9a6f'],
  stage: {w: 1080, h: 1200},
};
// 桌面本身的颜色（外壳用）
export const DESK_BG = {desk: '#efe5d6', desk2: '#e6d8c4', paper: '#fffdf8', butter: 'rgba(255,214,102,0.62)'};
