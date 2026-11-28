// 像素跳舞小人（一男一女手拉手），2026-11-23 第三轮按 031-B 原片逐帧学的：
//   · 1-bit 像素画，一格 ≈ 字高的 1/14，整对 33 格宽 × 14 格高；
//   · 定格动画：每 5 帧（0.167s）换一个姿势、中间不插值，5 个姿势循环（原片 22.30 / 22.47 / 22.63 / 22.80 / 22.97 …换）；
//   · 出现时从缝里"长出来"：三帧里从下往上露出来。
// 姿势是照原片的动作重新摆的骨架（关节坐标），像素是我们自己栅格化画的，不是拷贝原片的像素图。
import React from 'react';

type J = [number, number];
type Man = {head: J; neck: J; hip: J; l: J[]; r: J[]; lf: J[]; rf: J[]};
type Woman = {head: J; neck: J; waist: J; l: J[]; r: J[]; hem: [number, number, number]};
// 每个姿势：男（左）、女（右）；手臂 / 腿都是从肩 / 胯出发的折线
const POSES: {m: Man; w: Woman}[] = [
  // 1 男：外侧手高举（先上后折）、拉着的手斜着往下伸，一腿斜蹬一腿直；女：外侧手先上再长长地平伸
  {m: {head: [6.5, 0], neck: [6.5, 3], hip: [6.5, 8], l: [[3, 4], [1.5, 1.5]], r: [[10, 6], [14.5, 9.5]], lf: [[4.5, 10.5], [2, 13]], rf: [[7.5, 10.5], [8, 13]]},
   w: {head: [20.5, 3], neck: [20.5, 6], waist: [20.5, 8], l: [[17.5, 9], [14.5, 9.5]], r: [[24, 3], [31, 2.5]], hem: [13, 16.5, 24.5]}},
  // 2 男：往左弓步、外侧手平伸、拉着的手平伸后往下折到女伴低处的手；女：外侧手往右上举
  {m: {head: [5.5, 0.5], neck: [5.5, 3.5], hip: [6.5, 8.5], l: [[3, 3.5], [0, 3.5]], r: [[11, 5], [16, 5], [17, 12]], lf: [[3, 10.5], [0, 12.5]], rf: [[8.5, 10.5], [8.5, 13]]},
   w: {head: [24, 3], neck: [24, 6], waist: [24, 8.5], l: [[21, 11], [18, 12]], r: [[27, 4], [30.5, 1.5]], hem: [13, 20.5, 27.5]}},
  // 3 男：侧身半蹲、外侧手平伸、后腿斜着蹬出去、拉着的手斜下；女：外侧手平举
  {m: {head: [7.5, 0.5], neck: [7.5, 3.5], hip: [7, 8.5], l: [[4, 2.5], [0, 2]], r: [[11, 6.5], [15.5, 10]], lf: [[4, 10.5], [2.5, 13]], rf: [[10, 10.5], [13, 13]]},
   w: {head: [24.5, 3], neck: [24.5, 6], waist: [24.5, 8.5], l: [[20, 9.5], [16, 10]], r: [[28, 2], [32, 1.5]], hem: [13, 20.5, 28.5]}},
  // 4 男：大字站、两手往上举、腿叉开；女：拉着男伴的手往上、外侧手平伸
  {m: {head: [8, 0], neck: [8, 3], hip: [8, 8.5], l: [[4, 4.5], [1.5, 3]], r: [[11, 4], [13.5, 1.5]], lf: [[5, 11], [2.5, 13]], rf: [[10, 11], [11, 13]]},
   w: {head: [21, 1.5], neck: [21, 4.5], waist: [21, 8], l: [[17.5, 2.5], [14, 1.5]], r: [[24.5, 6], [28, 6]], hem: [13, 18.5, 23.5]}},
  // 5 男：身子往右探、外侧手往左下平伸、拉着的手高举；女：外侧手平伸、拉着的手高举
  {m: {head: [9, 1], neck: [9.5, 4], hip: [9, 9], l: [[5, 6], [0, 6]], r: [[13, 2], [15.5, 0]], lf: [[7, 11], [5, 13]], rf: [[11.5, 11], [13, 13]]},
   w: {head: [21.5, 3], neck: [21.5, 6], waist: [21.5, 8.5], l: [[18.5, 3], [16, 0.5]], r: [[25, 5.5], [28.5, 5.5]], hem: [13, 18, 25.5]}},
];
const COLS = 33, ROWS = 14;
const raster = (pi: number) => {
  const g = new Uint8Array(COLS * ROWS);
  const set = (x: number, y: number) => { const cx = Math.floor(x), cy = Math.floor(y); if (cx >= 0 && cx < COLS && cy >= 0 && cy < ROWS) g[cy * COLS + cx] = 1; };
  const line = (a: J, b: J, th = 1) => { const n = Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) * 4) + 1; for (let i = 0; i <= n; i++) { const x = a[0] + (b[0] - a[0]) * i / n, y = a[1] + (b[1] - a[1]) * i / n; set(x, y); if (th > 1) { set(x + 0.8, y); set(x, y + 0.8); } if (th > 2) { set(x + 1.6, y); set(x + 0.8, y + 0.8); } } };
  const poly = (start: J, pts: J[], th = 1) => { let p = start; pts.forEach((q) => { line(p, q, th); p = q; }); };
  const block = (c: J, w: number, h: number) => { for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) set(c[0] - w / 2 + 0.5 + x, c[1] + y); };
  const {m, w} = POSES[pi];
  const plus = (c: J, eye: boolean) => { const [x, y] = c; [[0, 0], [-1, 1], [0, 1], [1, 1], [0, 2]].forEach(([dx, dy]) => set(x + dx, y + dy)); set(x - 1, y); set(x + 1, y); if (eye) g[Math.floor(y + 1) * COLS + Math.floor(x)] = 0; };
  plus(m.head, false); line([m.neck[0] - 0.4, m.neck[1]], [m.hip[0] - 0.4, m.hip[1]], 3); poly(m.neck, m.l, 2); poly(m.neck, m.r, 2); poly(m.hip, m.lf, 2); poly(m.hip, m.rf, 2);
  m.lf.slice(-1).forEach((f) => set(f[0] - 1, f[1] - 0.5)); m.rf.slice(-1).forEach((f) => set(f[0] + 1, f[1] - 0.5)); // 脚掌
  plus(w.head, true); line([w.neck[0] - 0.4, w.neck[1]], [w.waist[0] - 0.4, w.waist[1]], 3); poly(w.neck, w.l, 2); poly(w.neck, w.r, 2);
  const hy = w.hem[0], x0 = w.waist[0] - 4, x1 = w.waist[0] + 4.6; // 原片女伴是从腰往下张开的大 A 字裙（底边 ≈8 格宽）
  const wy = w.waist[1] - 1.5; for (let y = Math.floor(wy); y <= Math.floor(hy); y++) { const k = (y - wy) / (hy - wy); const a = w.waist[0] + (x0 - w.waist[0]) * k, b = w.waist[0] + 1 + (x1 - w.waist[0] - 1) * k; for (let x = Math.floor(a); x <= Math.floor(b); x++) set(x + 0.2, y + 0.2); }
  return g;
};
const CACHE = POSES.map((_, i) => raster(i));

/** h = 整对的高度（px）；t = 秒；born = 出现时刻（秒，从缝里长出来）；phase 让不同格子里的小人错开 */
export const PixelDancers: React.FC<{h: number; t: number; born?: number; phase?: number; color?: string}> = ({h, t, born = -99, phase = 0, color = '#151515'}) => {
  const cell = h / ROWS;
  const pi = ((Math.floor(t * 6 + phase) % POSES.length) + POSES.length) % POSES.length;
  const g = CACHE[pi];
  const show = Math.min(ROWS, Math.floor(Math.max(0, (t - born) * 30 + 1) * (ROWS / 3))); // 三帧长出来
  const rects: React.ReactNode[] = [];
  for (let y = ROWS - show; y < ROWS; y++) for (let x = 0; x < COLS; x++) if (g[y * COLS + x]) rects.push(<rect key={y * COLS + x} x={x} y={y} width={1.02} height={1.02} />);
  return <svg width={cell * COLS} height={h} viewBox={`0 0 ${COLS} ${ROWS}`} shapeRendering="crispEdges" style={{display: 'inline-block', verticalAlign: 'middle'}}><g fill={color}>{rects}</g></svg>;
};
