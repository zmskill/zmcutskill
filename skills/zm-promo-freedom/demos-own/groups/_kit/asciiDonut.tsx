// 会转的 3D 字符画甜甜圈（2026-11-23，031 系列背景）。
// 原片背景不是平面花纹，而是一个真的 3D 圆环在慢慢转、用字符的疏密表示明暗：最暗 → 最亮 是 ". : - * o m g" → 最亮处连成 "paperpaper"（加粗），
//   这就是经典的 donut.c 做法（Andy Sloane 2006：对圆环表面取点 → 透视投影 → 深度缓冲 → 按法线和光的点积挑字符）。
//   以前我们用遮罩挡出几道弧线，没有立体感，看不出是个在转的东西。
import React from 'react';

const RAMP = ['.', ':', '-', '*', 'o', 'm', 'g'];
const WORD = 'paper';

export type DonutOpts = {cx: number; cy: number; size: number; a: number; b: number; cols?: number; rows?: number; cw?: number; ch?: number; color: string; strong?: string; o?: number; font?: string};

export const AsciiDonut: React.FC<DonutOpts> = ({cx, cy, size, a, b, cols = 130, rows = 50, cw = 15, ch = 22, color, strong, o = 1, font = '"DejaVu Sans Mono","Noto Sans Mono CJK SC",monospace'}) => {
  const lum = new Float32Array(cols * rows).fill(-1), zb = new Float32Array(cols * rows);
  const cA = Math.cos(a), sA = Math.sin(a), cB = Math.cos(b), sB = Math.sin(b);
  const R1 = 1, R2 = 2, K2 = 6, K1 = size * K2 / (R1 + R2) / 2; // size = 圆环外径（px）
  for (let th = 0; th < 6.283; th += 0.05) {
    const ct = Math.cos(th), st = Math.sin(th);
    for (let ph = 0; ph < 6.283; ph += 0.016) {
      const cp = Math.cos(ph), sp = Math.sin(ph);
      const ox = R2 + R1 * ct, oy = R1 * st;
      const x = ox * (cB * cp + sA * sB * sp) - oy * cA * sB;
      const y = ox * (sB * cp - sA * cB * sp) + oy * cA * cB;
      const z = K2 + cA * ox * sp + oy * sA, iz = 1 / z;
      const px = cx + K1 * iz * x, py = cy - K1 * iz * y;
      const col = Math.floor(px / cw), row = Math.floor(py / ch);
      if (col < 0 || col >= cols || row < 0 || row >= rows) continue;
      const L = cp * ct * sB - cA * ct * sp - sA * st + cB * (cA * st - ct * sA * sp);
      const k = row * cols + col;
      if (iz > zb[k]) { zb[k] = iz; lum[k] = L; }
    }
  }
  const lines: React.ReactNode[] = [];
  for (let r = 0; r < rows; r++) {
    const runs: React.ReactNode[] = [];
    let buf = '', strongRun = false;
    const flush = (key: number) => { if (buf) runs.push(<span key={key} style={strongRun ? {fontWeight: 700, color: strong ?? color} : undefined}>{buf}</span>); buf = ''; };
    for (let c = 0; c < cols; c++) {
      const L = lum[r * cols + c];
      let chr = ' ', isStrong = false;
      if (L > -0.9) {
        const tn = Math.pow(Math.max(0, Math.min(1, (L + 1) / 2.4)), 1.35); // 偏暗：大部分是 . : - * ，只有受光面连成 paper
        const lv = tn * (RAMP.length + 1.6);
        if (lv >= RAMP.length) { chr = WORD[c % WORD.length]; isStrong = lv >= RAMP.length + 0.8; } else chr = RAMP[Math.floor(lv)];
      }
      if (isStrong !== strongRun) { flush(c); strongRun = isStrong; }
      buf += chr;
    }
    flush(cols);
    lines.push(<div key={r} style={{position: 'absolute', left: 0, top: r * ch, height: ch, whiteSpace: 'pre', lineHeight: `${ch}px`}}>{runs}</div>);
  }
  return <div style={{position: 'absolute', inset: 0, opacity: o, fontFamily: font, fontSize: cw / 0.602, color, letterSpacing: 0, pointerEvents: 'none'}}>{lines}</div>;
};
