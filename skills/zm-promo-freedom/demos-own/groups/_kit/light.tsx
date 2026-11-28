// 光影零件（2026-11-19）
// 对照原片量出来的问题：我们的光一律「太暗、太硬、太细」。这里按合成 / 灯光的常规做法做几样通用零件：
//  1. GlowSpot：高斯衰减的光斑（真实的光是 e^-(r²) 那样慢慢衰减，CSS 默认的两三个色标是线性的，边缘发硬、中间发闷）
//  2. hotText / hotBox：「白热的芯 + 有颜色的内光晕 + 很大一圈外光晕」三层叠出来的发光（文字 / 线条 / 进度条）
//  3. Streak：两头尖、中间粗的月牙形流光（白芯 + 绿色辉光），不是一条等粗的细弧线
//  4. 颜色都从原片「吸管」量出来（qa/colgrid.py），不凭感觉调
import React from 'react';

const gaussStops = (rgb: string, a: number, n = 10) => Array.from({length: n + 1}, (_, i) => { const t = i / n; return `rgba(${rgb},${(a * Math.exp(-4.5 * t * t)).toFixed(3)}) ${(t * 100).toFixed(0)}%`; }).join(', ');

/** 高斯光斑：中心 (x,y)、半径 rx/ry（到这里几乎完全衰减）、颜色 'r,g,b'、强度 a；add=true 用相加混合（光叠光会更亮） */
export const GlowSpot: React.FC<{x: number; y: number; rx: number; ry?: number; rgb: string; a?: number; add?: boolean; rot?: number}> = ({x, y, rx, ry = rx, rgb, a = 1, add = true, rot = 0}) => (
  <div style={{position: 'absolute', left: x - rx, top: y - ry, width: rx * 2, height: ry * 2, borderRadius: '50%', background: `radial-gradient(ellipse closest-side, ${gaussStops(rgb, a)})`, mixBlendMode: add ? 'plus-lighter' : undefined, transform: rot ? `rotate(${rot}deg)` : undefined, pointerEvents: 'none'}} />
);

/** 发光字：白芯 + 内光晕 + 外光晕 */
export const hotText = (rgb: string, k = 1): React.CSSProperties => ({
  textShadow: `0 0 ${2 * k}px rgba(255,255,255,0.9), 0 0 ${8 * k}px rgba(${rgb},0.9), 0 0 ${22 * k}px rgba(${rgb},0.6), 0 0 ${50 * k}px rgba(${rgb},0.35)`,
});
/** 发光块 / 线（进度条、边框）：同样三层 */
export const hotBox = (rgb: string, k = 1): string => `0 0 ${3 * k}px rgba(255,255,255,0.8), 0 0 ${12 * k}px ${3 * k}px rgba(${rgb},0.75), 0 0 ${40 * k}px ${10 * k}px rgba(${rgb},0.45), 0 0 ${110 * k}px ${30 * k}px rgba(${rgb},0.22)`;

/** 月牙流光：长 len、最粗 th；白芯 + 颜色辉光 */
export const Streak: React.FC<{x: number; y: number; len: number; th: number; angle: number; rgb?: string; o?: number; bend?: number}> = ({x, y, len, th, angle, rgb = '95,245,176', o = 1, bend = 0.35}) => {
  const L = len / 2, B = len * bend;
  const d = `M ${-L} 0 Q 0 ${-B - th} ${L} 0 Q 0 ${-B + th} ${-L} 0 Z`;
  return (
    <svg width={len * 2} height={len * 2} viewBox={`${-len} ${-len} ${len * 2} ${len * 2}`} style={{position: 'absolute', left: x - len, top: y - len, transform: `rotate(${angle}deg)`, opacity: o, overflow: 'visible', mixBlendMode: 'plus-lighter', filter: `drop-shadow(0 0 ${th * 0.6}px rgba(${rgb},0.95)) drop-shadow(0 0 ${th * 2.2}px rgba(${rgb},0.6))`}}>
      <defs><linearGradient id={`sk${Math.round(len)}${Math.round(th)}`} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor={`rgb(${rgb})`} stopOpacity="0" /><stop offset="0.45" stopColor="#ffffff" /><stop offset="1" stopColor={`rgb(${rgb})`} stopOpacity="0.2" /></linearGradient></defs>
      <path d={d} fill={`url(#sk${Math.round(len)}${Math.round(th)})`} />
    </svg>
  );
};

/** 胶片颗粒：原片的渐变上都有细颗粒，干净的渐变看起来像 CG */
export const FilmGrain: React.FC<{o?: number; seed?: number}> = ({o = 0.06, seed = 0}) => (
  <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, opacity: o, mixBlendMode: 'overlay', pointerEvents: 'none'}}>
    <filter id={`fg${seed}`}><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={seed} stitchTiles="stitch" /><feColorMatrix type="saturate" values="0" /></filter>
    <rect width="1920" height="1080" filter={`url(#fg${seed})`} />
  </svg>
);
