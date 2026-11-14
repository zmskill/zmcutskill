// 风格卡的值：外壳和镜头库的镜头都读这里，换一套风格，镜头跟着变样子。
// 用法：外壳在每一帧开头调用 useStyleValues(某套)；镜头里读 SV（当前这套）。
// 和操作台里 G.t 一样是"每帧写一次"的做法：Remotion 每一帧从外壳往里渲染，外壳先写、镜头后读。
export type StyleValues = {
  name: string; font: string; mono?: string;
  ink: string; ink2: string; ink3: string;
  accent: string; hi: string; blue: string; red: string; green: string;
  surface: string; surfaceRGB: string; cardBg: string; cardBorder: string; cardEdge: string; shadow: string; line: string; sceneBg: string;
  tints: string[];
  stage: {w: number; h: number};   // 镜头放进去的那块舞台有多大
};
import {NOTEBOOK} from './notebook/values';

const now = {v: NOTEBOOK};
export const useStyleValues = (v: StyleValues) => { now.v = v; };
// SV.xxx 永远读当前这套
export const SV: StyleValues = new Proxy({} as StyleValues, {get: (_, k) => (now.v as unknown as Record<string | symbol, unknown>)[k]});
