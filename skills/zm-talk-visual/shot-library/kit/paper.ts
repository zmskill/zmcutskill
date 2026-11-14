// paper.ts：暖白纸面配色（提问墙 complaint-wall-pick 用）。
export {alpha} from './polish';
export type Palette = {
  name: string; dark: boolean; bg: [string, string, string]; light: string;
  surface: string; surface2: string; line: string; ink: string; ink2: string; ink3: string;
  accent: string; accent2: string; onAccent: string; shadow: string;
};
// 暖白纸、墨色字、朱红强调
export const PAPER: Palette = {
  name: 'paper', dark: false,
  bg: ['#f6f2ea', '#f0ebe1', '#e7e0d3'], light: '#fffaf0',
  surface: '#fffdf8', surface2: '#f4efe5', line: 'rgba(40,30,20,0.12)',
  ink: '#17130f', ink2: '#5e554b', ink3: '#9b9184',
  accent: '#e5432d', accent2: '#1f5c4a', onAccent: '#fffaf3', shadow: '#2a1d10',
};
