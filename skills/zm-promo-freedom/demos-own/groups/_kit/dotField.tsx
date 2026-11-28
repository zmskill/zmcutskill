// 点阵粒子场（033 cube 点阵整条共用，2026-11-18 第28批）
// 一群点（默认 2200 个）在几种"阵型"之间变来变去：背景点阵 / 3D 球 / 几颗小球 / 点云 / 斜放的点线卡片 / 点阵字 / 点阵立方体。
// 每个阵型是一个函数，返回每个点的 {x, y, s 大小, a 透明度, c 紫色程度}；两阵型之间按点错开时间插值，中途加一点漂移（散开感）。
// 用 <canvas> 画（每帧同步画完）。
import React, {useLayoutEffect, useRef} from 'react';

export const N_DOTS = 2200;
export type Dot = {x: number; y: number; s: number; a: number; c: number};
export type Form = Dot[];
export const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
export const mix = (a: number, b: number, k: number) => a + (b - a) * k;
export const eio = (u: number) => { const x = clamp(u); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
export const eo = (u: number) => 1 - Math.pow(1 - clamp(u), 3);
export const hash = (n: number) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const HIDE: Dot = {x: 960, y: 540, s: 2, a: 0, c: 0};

// ── 阵型 ──
// 2026-11-19 原片的球是「经纬线」排的点（看得见一圈圈纬线、一列列经线），不是斐波那契螺旋的乱点；正面的点大而亮、边缘的点小而密
const UVS = (() => { const out: number[][] = []; const nLat = 42; for (let i = 0; i < nLat; i++) { const lat = -Math.PI / 2 + ((i + 0.5) / nLat) * Math.PI; const n = Math.max(3, Math.round(2 * nLat * Math.cos(lat) * 0.97)); for (let j = 0; j < n; j++) { const lon = (j / n) * Math.PI * 2 + i * 0.17; out.push([Math.cos(lat) * Math.cos(lon), Math.sin(lat), Math.cos(lat) * Math.sin(lon)]); } } return out; })();
const FIB = (() => { const g = Math.PI * (3 - Math.sqrt(5)); return Array.from({length: N_DOTS}, (_, i) => { const y = 1 - (i / (N_DOTS - 1)) * 2; const r = Math.sqrt(1 - y * y); return [Math.cos(g * i) * r, y, Math.sin(g * i) * r]; }); })();
const project = (X: number, Y: number, Z: number, cx: number, cy: number, R: number, persp = 0.25) => { const f = 1 / (1 - Z * persp); return {x: cx + R * X * f, y: cy + R * Y * f, z: Z}; };
/** 3D 球：rot 绕竖轴转角，tilt 前倾 */
export const sphere = (cx: number, cy: number, R: number, rot: number, tilt = 0.5, count = N_DOTS, offset = 0, sizeK = 1, roll = 0.62): Form => {
  const out: Form = [];
  const cr = Math.cos(rot), sr = Math.sin(rot), ct = Math.cos(tilt), st = Math.sin(tilt);
  for (let k = 0; k < N_DOTS; k++) {
    if (k >= count) { out.push(HIDE); continue; }
    const idx = Math.floor((k * N_DOTS) / count + offset) % N_DOTS;
    const p = FIB[idx]; // 原片是斐波那契球（局部看是规整的六边形格子）；UVS 经纬球留着备用
    let X = p[0] * cr + p[2] * sr, Z = -p[0] * sr + p[2] * cr, Y = p[1];
    const Y2 = Y * ct - Z * st; Z = Y * st + Z * ct; Y = Y2;
    // 原片球的极轴是斜的（纬线看起来是斜着的一排排），绕视线方向再转一下
    const X2 = X * Math.cos(roll) - Y * Math.sin(roll); Y = X * Math.sin(roll) + Y * Math.cos(roll); X = X2;
    const q = project(X, Y, Z, cx, cy, R);
    const d = (Z + 1) / 2;
    out.push({x: q.x, y: q.y, s: (2.0 + 9.0 * Math.pow(d, 2.2)) * sizeK, a: 0.32 + 0.68 * Math.pow(d, 1.2), c: 0});
  }
  return out;
};
/** 几颗小球：每颗分到一部分点 */
export const balls = (list: {x: number; y: number; r: number; a?: number; sx?: number; ang?: number}[], rot: number): Form => {
  // 2026-11-19：每颗球可以有 a（远近明暗，原片远的球是暗的）和 sx/ang（沿某方向拉长，原片球分裂时是被拉成长条的）
  const per = Math.floor(N_DOTS / list.length);
  const forms = list.map((b, i) => sphere(b.x, b.y, b.r, rot + i, 0.5, N_DOTS, 0, Math.max(0.38, Math.min(1, b.r / 170))));
  return Array.from({length: N_DOTS}, (_, k) => {
    const bi = Math.min(list.length - 1, Math.floor(k / per)); const j = (k - bi * per) * list.length; const src = forms[bi][j % N_DOTS]; const b = list[bi];
    let x = src.x, y = src.y;
    if (b.sx && b.sx !== 1) { const c = Math.cos(b.ang ?? 0), sn = Math.sin(b.ang ?? 0); const u = (x - b.x) * c + (y - b.y) * sn, v = -(x - b.x) * sn + (y - b.y) * c; x = b.x + u * b.sx * c - v * sn; y = b.y + u * b.sx * sn + v * c; }
    return {...src, x, y, a: src.a * (b.a ?? 1)};
  });
};
/** 点云（高斯） */
export const cloud = (cx: number, cy: number, rx: number, ry: number, t: number, seed = 0): Form =>
  Array.from({length: N_DOTS}, (_, k) => {
    const u = hash(k + seed), v = hash(k * 3.1 + seed + 7);
    const r = Math.sqrt(-2 * Math.log(Math.max(1e-4, u))) * 0.45, th = v * Math.PI * 2 + t * (0.3 + hash(k) * 0.4);
    return {x: cx + Math.cos(th) * r * rx, y: cy + Math.sin(th) * r * ry, s: 1.2 + hash(k * 7) * 1.8, a: 0.35 + hash(k * 11) * 0.5, c: 0};
  });
/** 背景点阵（错位网格） */
export const grid = (gap = 50, alpha = 0.4): Form => {
  const cols = Math.ceil(1920 / gap) + 1;
  return Array.from({length: N_DOTS}, (_, k) => { const r = Math.floor(k / cols), c = k % cols; const y = r * gap * 0.87; return y > 1100 ? HIDE : {x: c * gap + (r % 2) * gap / 2, y, s: 6, a: alpha, c: 0}; });
};
/** 屏外（往某个方向飞走） */
export const away = (dx: number, dy: number, from: Form): Form => from.map((d, k) => ({...d, x: d.x + dx * (0.6 + hash(k) * 0.8), y: d.y + dy * (0.6 + hash(k * 2) * 0.8), a: 0}));

// 点线卡片：一张卡 = 外框 + 左边 3×3 小点 + 两行点线；卡片在 3D 里斜放
export type CardSpec = {x: number; y: number; w: number; h: number};
const cardLocal = (w: number, h: number, gap = 17, orig = false) => {
  const pts: number[][] = [];
  const per = 2 * (w + h);
  const n = Math.floor(per / gap);
  for (let i = 0; i < n; i++) {
    let d = (i / n) * per, x = 0, y = 0;
    if (d < w) { x = d; y = 0; } else if ((d -= w) < h) { x = w; y = d; } else if ((d -= h) < w) { x = w - d; y = h; } else { d -= w; x = 0; y = h - d; }
    pts.push([x, y, 1]);
  }
  if (orig) { // 2026-11-19 按原片 8.6s 量的卡内布局：3×3 点在左上（间距 21），两行点线 0.27–0.78 / 0.28–0.58，在 0.355 / 0.66 高度
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) pts.push([w * 0.116 + c * 21, h * 0.15 + r * 20, 0.9]);
    for (let x = w * 0.273; x <= w * 0.78; x += 20) pts.push([x, h * 0.355, 0.85]);
    for (let x = w * 0.28; x <= w * 0.58; x += 20) pts.push([x, h * 0.66, 0.85]);
    return pts;
  }
  for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) pts.push([w * 0.07 + c * 10, h * 0.36 + r * 10, 0.9]);
  const L1 = w * 0.5, L2 = w * 0.3;
  for (let i = 0; i < L1 / 15; i++) pts.push([w * 0.2 + i * 15, h * 0.3, 0.8]);
  for (let i = 0; i < L2 / 15; i++) pts.push([w * 0.2 + i * 15, h * 0.62, 0.8]);
  return pts;
};
/** cards：rotZ 度、ry 是"左近右远"的透视量（0–1）；reveal 每张卡 0–1（从上往下扫出来）；jitter 0–1 散开 */
export const cards = (list: CardSpec[], rotZ: number, ry: number, reveal: number[] = [], t = 0): Form => {
  const all: Dot[] = [];
  const cr = Math.cos((rotZ * Math.PI) / 180), sr = Math.sin((rotZ * Math.PI) / 180);
  list.forEach((cd, ci) => {
    const rv = reveal[ci] ?? 1;
    cardLocal(cd.w, cd.h).forEach(([lx, ly, b], pi) => {
      const fy = 1 + ry * (0.5 - lx / cd.w) * 0.35; // 左边高、右边矮
      const X = lx, Y = (ly - cd.h / 2) * fy + cd.h / 2;
      const x = cd.x + X * cr - Y * sr, y = cd.y + X * sr + Y * cr;
      const shown = rv >= 1 ? 1 : clamp((rv * 1.3 - ly / cd.h) * 3);
      const jit = (1 - shown) * 60;
      all.push({x: x + Math.sin(pi * 3.7 + t * 6) * jit, y: y + 40 * (1 - shown) + Math.cos(pi * 2.3 + t * 5) * jit, s: 4.6, a: (0.7 + 0.3 * b) * (rv >= 1 ? 1 : Math.max(0.15, shown)), c: 0});
    });
  });
  return Array.from({length: N_DOTS}, (_, k) => (k < all.length ? all[k] : {...all[k % all.length], a: 0}));
};
/** 2026-11-19 四角卡片：按原片量到的四个角（左上、右上、右下、左下）摆点——原片的卡是透视的四边形（左边高、右边矮、左右边都是斜的），不是矩形转个角 */
export const quadCards = (quads: number[][][], reveal: number[] = [], t = 0, dotS = 6, pool?: number[]): Form => {
  const all: Dot[] = [];
  quads.forEach((Q, ci) => {
    const rv = reveal[ci] ?? 1;
    const w = Math.hypot(Q[1][0] - Q[0][0], Q[1][1] - Q[0][1]), h = Math.hypot(Q[3][0] - Q[0][0], Q[3][1] - Q[0][1]);
    cardLocal(w, h, 20, true).forEach(([lx, ly, b], pi) => {
      const u = lx / w, v = ly / h;
      const x = (1 - u) * (1 - v) * Q[0][0] + u * (1 - v) * Q[1][0] + u * v * Q[2][0] + (1 - u) * v * Q[3][0];
      const y = (1 - u) * (1 - v) * Q[0][1] + u * (1 - v) * Q[1][1] + u * v * Q[2][1] + (1 - u) * v * Q[3][1];
      const shown = rv >= 1 ? 1 : clamp((rv * 1.3 - v) * 3);
      if (pool) { // 还没扫出来的点躺在一片「点池」里（原片 reveal：卡片下面一大片亮的散点，扫到哪张卡就往上飞去拼哪张）
        const hk = ci * 1000 + pi;
        const px = pool[0] + hash(hk * 1.37) * (pool[2] - pool[0]) + Math.sin(t * 1.3 + hk) * 6, py = pool[1] + Math.pow(hash(hk * 2.71), 0.7) * (pool[3] - pool[1]) + Math.cos(t * 1.1 + hk) * 6;
        const e = shown * shown * (3 - 2 * shown);
        all.push({x: px + (x - px) * e, y: py + (y - py) * e, s: dotS * (0.75 + 0.25 * e), a: (0.75 + 0.25 * b) * (0.55 + 0.45 * e), c: 0});
        return;
      }
      const jit = (1 - shown) * 60;
      all.push({x: x + Math.sin(pi * 3.7 + t * 6) * jit, y: y + 40 * (1 - shown) + Math.cos(pi * 2.3 + t * 5) * jit, s: dotS, a: (0.75 + 0.25 * b) * (rv >= 1 ? 1 : Math.max(0.15, shown)), c: 0});
    });
  });
  return Array.from({length: N_DOTS}, (_, k) => (k < all.length ? all[k] : {...all[k % all.length], a: 0}));
};
/** 四边形整体变换：绕 (cx,cy) 转 deg、平移 */
export const moveQuads = (Qs: number[][][], dx: number, dy: number, deg = 0, cx = 1280, cy = 540): number[][][] => { const c = Math.cos(deg * Math.PI / 180), sn = Math.sin(deg * Math.PI / 180); return Qs.map((Q) => Q.map(([x, y]) => [cx + (x - cx) * c - (y - cy) * sn + dx, cy + (x - cx) * sn + (y - cy) * c + dy])); };
// 点阵字：用离屏 canvas 把字画出来、按网格取点（结果缓存）
const textCache = new Map<string, number[][]>();
export const textPts = (str: string, size: number, gap: number, font: string): number[][] => {
  const key = `${str}|${size}|${gap}|${font}`;
  if (textCache.has(key)) return textCache.get(key)!;
  const cv = document.createElement('canvas');
  const W = Math.ceil(size * Array.from(str).length * 1.1 + 40), H = Math.ceil(size * 1.4);
  cv.width = W; cv.height = H;
  const g = cv.getContext('2d')!;
  g.fillStyle = '#fff'; g.font = `${font}`.replace('{S}', String(size)); g.textBaseline = 'middle';
  g.fillText(str, 20, H / 2);
  const data = g.getImageData(0, 0, W, H).data;
  const pts: number[][] = [];
  let minX = 1e9, maxX = -1e9;
  for (let y = 0; y < H; y += gap) for (let x = 0; x < W; x += gap) if (data[(y * W + x) * 4 + 3] > 140) { pts.push([x, y - H / 2]); minX = Math.min(minX, x); maxX = Math.max(maxX, x); }
  const cxm = (minX + maxX) / 2;
  const res = pts.map(([x, y]) => [x - cxm, y, x]);
  textCache.set(key, res);
  return res;
};
/** 点阵字：tintFrom 起（按字符 x 位置）染紫 */
export const textForm = (str: string, cx: number, cy: number, size: number, rotZ = 0, gap = 16, tintFromX = 1e9, font = '600 {S}px "PingFang SC","Noto Sans CJK SC","Noto Sans SC",sans-serif'): Form => {
  const pts = textPts(str, size, gap, font);
  const cr = Math.cos((rotZ * Math.PI) / 180), sr = Math.sin((rotZ * Math.PI) / 180);
  const all = pts.map(([x, y, rawX]) => ({x: cx + x * cr - y * sr, y: cy + x * sr + y * cr, s: 5, a: 0.95, c: rawX >= tintFromX ? 1 : 0}));
  return Array.from({length: N_DOTS}, (_, k) => (k < all.length ? all[k] : {...all[k % Math.max(1, all.length)], a: 0}));
};
/** 逐字点阵：每个字固定占一段点（换某个字时，其他字的点不动）；tint[i]=1 的字染紫 */
export const wordForm = (chars: string[], cx: number, cy: number, size: number, rotZ = 0, gap = 15, tint: number[] = [], font = '600 {S}px "PingFang SC","Noto Sans CJK SC","Noto Sans SC",sans-serif'): Form => {
  const n = chars.length, slot = Math.floor(N_DOTS / n), adv = size * 1.02;
  const cr = Math.cos((rotZ * Math.PI) / 180), sr = Math.sin((rotZ * Math.PI) / 180);
  const out: Dot[] = [];
  for (let k = 0; k < N_DOTS; k++) {
    const ci = Math.min(n - 1, Math.floor(k / slot)), j = k - ci * slot;
    const pts = textPts(chars[ci], size, gap, font);
    const p = pts[j % Math.max(1, pts.length)] ?? [0, 0];
    const lx = (ci - (n - 1) / 2) * adv + p[0], ly = p[1];
    out.push({x: cx + lx * cr - ly * sr, y: cy + lx * sr + ly * cr, s: 5, a: j < pts.length ? 0.95 : 0, c: tint[ci] ?? 0});
  }
  return out;
};
/** 点阵立方体（棱 + 面上稀疏点） */
export const cubeForm = (cx: number, cy: number, S: number, ry: number, rx: number): Form => {
  const out: Dot[] = [];
  const cy_ = Math.cos(ry), sy = Math.sin(ry), cx_ = Math.cos(rx), sx = Math.sin(rx);
  for (let k = 0; k < N_DOTS; k++) {
    const f = Math.floor(hash(k) * 6), u = hash(k * 1.7) * 2 - 1, v = hash(k * 2.9) * 2 - 1;
    const p = [[1, u, v], [-1, u, v], [u, 1, v], [u, -1, v], [u, v, 1], [u, v, -1]][f];
    let X = p[0] * cy_ + p[2] * sy, Z = -p[0] * sy + p[2] * cy_, Y = p[1];
    const Y2 = Y * cx_ - Z * sx; Z = Y * sx + Z * cx_; Y = Y2;
    const q = project(X, Y, Z, cx, cy, S / 2, 0.06);
    out.push({x: q.x, y: q.y, s: 2 + (Z + 1) * 1.2, a: 0.45 + (Z + 1) * 0.27, c: 0});
  }
  return out;
};
/** 立方体 8 个顶点在屏幕上的位置（给线框用） */
export const cubeVerts = (cx: number, cy: number, S: number, ry: number, rx: number) => {
  const cy_ = Math.cos(ry), sy = Math.sin(ry), cx_ = Math.cos(rx), sx = Math.sin(rx);
  const V: {x: number; y: number; z: number}[] = [];
  for (const a of [-1, 1]) for (const b of [-1, 1]) for (const c of [-1, 1]) {
    let X = a * cy_ + c * sy, Z = -a * sy + c * cy_, Y = b;
    const Y2 = Y * cx_ - Z * sx; Z = Y * sx + Z * cx_; Y = Y2;
    V.push(project(X, Y, Z, cx, cy, S / 2, 0.06));
  }
  return V;
};
export const CUBE_EDGES = [[0, 1], [2, 3], [4, 5], [6, 7], [0, 2], [1, 3], [4, 6], [5, 7], [0, 4], [1, 5], [2, 6], [3, 7]];

/** 2026-11-19 球边缘的「紫光浪」：屏幕上某个方向 ang（弧度，0=右，逆时针为负）附近的边缘点往外鼓、染紫（原片 033 3.4–4.6 紫光绕着球边走、那一侧跟着鼓起来） */
export const rimWave = (F: Form, cx: number, cy: number, R: number, ang: number, str: number, push = 0.06): Form => {
  if (str <= 0.001) return F;
  return F.map((d) => {
    const dx = d.x - cx, dy = d.y - cy, r = Math.hypot(dx, dy) / R;
    let da = Math.atan2(dy, dx) - ang; da = Math.atan2(Math.sin(da), Math.cos(da));
    const w = str * Math.exp(-(da * da) / (2 * 0.55 * 0.55)) * clamp((r - 0.35) / 0.6);
    const k = 1 + push * w;
    return {...d, x: cx + dx * k, y: cy + dy * k, c: Math.max(d.c, w * 0.95), a: Math.min(1, d.a * (1 + 0.3 * w))};
  });
};
/** 2026-11-19 环境微动：每个点绕自己的位置极慢地画小圈（原片粒子从来不完全静止，速度曲线一直 >0） */
export const ambient = (F: Form, t: number, amp = 3): Form => F.map((d, k) => ({...d, x: d.x + Math.sin(t * (0.9 + hash(k) * 0.8) + k * 2.1) * amp, y: d.y + Math.cos(t * (0.8 + hash(k * 3) * 0.7) + k * 1.3) * amp}));
/** 2026-11-19 弹簧跟随（物理动效的常规做法：阻尼弹簧 / critically-damped spring，Framer Motion、React Spring、AE 惯性表达式都是这个）：
 *  每个点不是按插值直接摆到目标位置，而是被一根弹簧拉着追目标——速度永远连续，到点自然减速、略微过冲回弹，换目标时不会「一折一折」。
 *  原片的点阵就是这样「丝滑」的；我们以前是一个个造型之间直线 / 缓动插值，每到一个关键造型速度就突变，看起来一卡一卡。
 *  确定性：从 t0 开始以 1/120s 步长积分到 s（同一 id 的结果缓存，顺序渲染时只补算新的一段）。
 *  omega：弹簧角频率（越大跟得越紧），zeta：阻尼比（<1 会有一点回弹），spread：每个点弹簧松紧的随机差异（自然错开），lead：目标提前量（抵消弹簧滞后）
 */
type SimState = {t: number; x: Float64Array; y: Float64Array; vx: Float64Array; vy: Float64Array; sz: Float64Array; al: Float64Array; cc: Float64Array};
const SIM = new Map<string, SimState>();
export const springForm = (id: string, s: number, t0: number, target: (t: number) => Form, o: {omega?: number; zeta?: number; spread?: number; lead?: number} = {}): Form => {
  const omega = o.omega ?? 11, zeta = o.zeta ?? 0.82, spread = o.spread ?? 0.5, lead = o.lead ?? 0.1, dt = 1 / 120;
  const tgt = (t: number) => target(Math.min(t + lead, 1e9));
  let st = SIM.get(id);
  if (!st || st.t > s + 1e-9 || st.t < t0 - 1e-9) {
    const F = tgt(t0); const n = F.length;
    st = {t: t0, x: new Float64Array(n), y: new Float64Array(n), vx: new Float64Array(n), vy: new Float64Array(n), sz: new Float64Array(n), al: new Float64Array(n), cc: new Float64Array(n)};
    F.forEach((d, k) => { st!.x[k] = d.x; st!.y[k] = d.y; st!.sz[k] = d.s; st!.al[k] = d.a; st!.cc[k] = d.c; });
    SIM.set(id, st);
  }
  const n = st.x.length;
  const w = new Float64Array(n); for (let k = 0; k < n; k++) w[k] = omega * (1 - spread / 2 + spread * hash(k * 9.7 + 1.3));
  while (st.t + dt <= s + 1e-9) {
    const T = tgt(st.t + dt);
    for (let k = 0; k < n; k++) {
      const d = T[k], wk = w[k];
      if (d.a < 0.02 && st.al[k] < 0.04) { st.x[k] = d.x; st.y[k] = d.y; st.vx[k] = 0; st.vy[k] = 0; } // 看不见的点直接瞬移到目标（原片常见：一团点原地消失、另一处冒出新的一团）
      const ax = wk * wk * (d.x - st.x[k]) - 2 * zeta * wk * st.vx[k];
      const ay = wk * wk * (d.y - st.y[k]) - 2 * zeta * wk * st.vy[k];
      st.vx[k] += ax * dt; st.vy[k] += ay * dt; st.x[k] += st.vx[k] * dt; st.y[k] += st.vy[k] * dt;
      const e = 1 - Math.exp(-wk * 0.9 * dt);
      st.sz[k] += (d.s - st.sz[k]) * e; st.al[k] += (d.a - st.al[k]) * e; st.cc[k] += (d.c - st.cc[k]) * e;
    }
    st.t += dt;
  }
  return Array.from({length: n}, (_, k) => ({x: st!.x[k], y: st!.y[k], s: st!.sz[k], a: st!.al[k], c: st!.cc[k]}));
};
/** 两阵型之间插值：u 0–1；stagger 点之间错开比例；drift 中途漂移像素 */
export const blend = (A: Form, B: Form, u: number, stagger = 0.35, drift = 80, t = 0, ease = eio): Form =>
  A.map((a, k) => {
    const b = B[k];
    const d = hash(k * 5.3) * stagger;
    const w = ease(clamp((u - d) / (1 - stagger)));
    const bump = Math.sin(Math.PI * w) * drift * Math.min(1, Math.pow(Math.hypot(b.x - a.x, b.y - a.y) / 80, 2)); // 平方：几乎不动的点不加乱跳（变形时没变的字就不会糊）
    return {x: mix(a.x, b.x, w) + Math.sin(k * 1.37 + t * 2) * bump, y: mix(a.y, b.y, w) + Math.cos(k * 0.91 + t * 2.3) * bump, s: mix(a.s, b.s, w), a: mix(a.a, b.a, w), c: mix(a.c, b.c, w)};
  });
/** 按关键帧序列取当前点位：K = [[t, formFn, {stagger, drift}]]（t 升序；在两帧之间插值） */
export type Key = [number, (t: number) => Form, {stagger?: number; drift?: number; hold?: number; stop?: boolean; ease?: (u: number) => number}?];
// 2026-11-18 修"一卡一卡"：原来每一段都缓入缓出，点阵在每个中间造型都停一下。现在只有"停点"（第一帧、最后一帧、有 hold、或写了 stop）才缓停；
//   其他中间造型是"路过点"，进出速度不归零，点直接流过去。hold 期间也不冻住：整团点绕重心极慢地胀开 1.5%，跟原片一样一直在呼吸。
const eIn = (u: number) => { const x = clamp(u); return 2 * x * x - x * x * x; };      // 起步缓、到点不停
const eOut = (u: number) => { const x = clamp(u); return x + x * x - x * x * x; };     // 出发不停、到点缓停
const breathe = (F: Form, k: number): Form => { if (k <= 0) return F; let cx = 0, cy = 0; for (const p of F) { cx += p.x; cy += p.y; } cx /= F.length; cy /= F.length; const sc = 1 + 0.006 * k; return F.map((p) => ({...p, x: cx + (p.x - cx) * sc, y: cy + (p.y - cy) * sc})); };
export const timeline = (s: number, K: Key[]): Form => {
  const isStop = (j: number) => j === 0 || j === K.length - 1 || !!K[j][2]?.hold || !!K[j][2]?.stop;
  const holdK = (j: number, at: number) => { const h = K[j][2]?.hold ?? 0; return h > 0 ? clamp((at - K[j][0]) / h) : 0; };
  if (s <= K[0][0]) return K[0][1](s);
  for (let i = 0; i < K.length - 1; i++) {
    const [t0, f0, o0] = K[i], [t1, f1] = K[i + 1];
    const hold = o0?.hold ?? 0; // t0 之后先停在 f0 多久（期间轻微呼吸）
    if (s < t1) {
      if (s < t0 + hold) return breathe(f0(s), holdK(i, s));
      const u = (s - t0 - hold) / Math.max(0.001, t1 - t0 - hold);
      const a = isStop(i), b = isStop(i + 1);
      const ease = o0?.ease ?? (a && b ? eio : a ? eIn : b ? eOut : (x: number) => clamp(x)); // 2026-11-19 可以指定缓动（炸开要「先猛后缓」）
      return blend(breathe(f0(s), hold > 0 ? 1 : 0), f1(s), u, o0?.stagger ?? 0.35, o0?.drift ?? 80, s, ease);
    }
  }
  return K[K.length - 1][1](s);
};

/** 画布：bg 底色，dots 点，tint 紫色 */
export const DotCanvas: React.FC<{dots: Form; bg?: string; color?: [number, number, number]; tint?: [number, number, number]; scale?: number}> = ({dots, bg = '#1b1b1e', color = [236, 236, 242], tint = [170, 166, 255], scale = 1}) => {
  const ref = useRef<HTMLCanvasElement>(null);
  useLayoutEffect(() => {
    const cv = ref.current; if (!cv) return;
    const g = cv.getContext('2d')!;
    g.setTransform(1, 0, 0, 1, 0, 0);
    if (bg === 'transparent') g.clearRect(0, 0, 1920, 1080); else { g.fillStyle = bg; g.fillRect(0, 0, 1920, 1080); }
    for (const d of dots) {
      if (d.a <= 0.01 || d.x < -20 || d.x > 1940 || d.y < -20 || d.y > 1100) continue;
      const r = Math.round(mix(color[0], tint[0], d.c)), gg = Math.round(mix(color[1], tint[1], d.c)), b = Math.round(mix(color[2], tint[2], d.c));
      g.fillStyle = `rgba(${r},${gg},${b},${clamp(d.a)})`;
      const s = d.s * scale;
      if (s < 2.2) g.fillRect(d.x - s / 2, d.y - s / 2, s, s);
      else { g.beginPath(); g.arc(d.x, d.y, s / 2, 0, Math.PI * 2); g.fill(); }
    }
  });
  return <canvas ref={ref} width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080}} />;
};
