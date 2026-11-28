// 斜俯视方块阵，一圈圈蓝白翻色往里收（030-B 单个镜头）
// 学的动作（ab_workss · PulseIt 7.10–10.30s，30fps 逐帧看过；时间表 （内部拆片记录，未随项目提供））：
//   黑底；一个线框立方体在画面中间转（0–0.4s），面慢慢填成深蓝、再亮成品牌蓝，同时缩小；
//   镜头一下拉远：原来它在一片方块地板中间（16×16 一块、四周同样的图案铺开）——斜俯视（转 45°、俯 35°），中间 2×2 白方块，外面一圈圈蓝方块，中间隔着空格；
//   方块从里往外一圈圈冒出来，镜头继续拉远；1.5s、2.4s 各换一次"圈形"：从外往里一圈接一圈地落下、换色、再升起（白圈像在往里收）；
//   最后 0.3 秒镜头一边拉远一边转正成俯视，整块地板变小（接下一镜的闪光）。
// 我们的内容：纯图形（蓝 / 白方块），不放文字；颜色走 brand / accent 两个输入。
//
// 时间表（源秒，30fps，共 96 帧）
//   0.00–0.40  线框立方体转；0.40–0.55 面填深蓝；0.50–0.62 变品牌蓝 + 缩小
//   0.60–1.50  地板出现，方块从里往外冒（每圈晚 0.04s）；镜头 ×420 → ×165（每格像素）
//   1.50 / 2.40 换圈形：从外往里每圈晚 0.025s 落下再升起
//   2.90–3.20  镜头拉远到 ×85，同时转正成俯视
// 毛病清单：
//   - 通用：画面永远不停（镜头一直极慢拉远）；--hq 渲染；确定性
//   - 独有 1：换圈形是"从外往里一圈接一圈"，不是整块同时变
//   - 独有 2：方块之间留空，地板上有细网格线，不然就成了一整块
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {mix} from '../../../assets/lib/helpers/polish';

export const ISO_CUBE_RINGS_DURATION = 96;
const FPS = 30;

// 可替换
export const ISO_INPUTS = {brand: '#3f6cff', accent: '#ffffff'};

const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const eo = (t: number, a: number, b: number) => { const c = clamp((t - a) / (b - a)); return 1 - Math.pow(1 - c, 3); };
const eio = (t: number, a: number, b: number) => { const c = clamp((t - a) / (b - a)); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };
const eob = (t: number, a: number, b: number) => { const c = clamp((t - a) / (b - a)); const k = 1.4; return 1 + (k + 1) * Math.pow(c - 1, 3) + k * Math.pow(c - 1, 2); };
const hex = (c: string) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
const shade = (c: string, k: number) => `rgb(${hex(c).map((v) => Math.round(clamp(v * k, 0, 255))).join(',')})`;
const D2R = Math.PI / 180;

// 圈形（r = 0 中间 2×2 … 7 最外圈）：0 空 / 1 蓝 / 2 白
const STATES = [
  [2, 0, 1, 0, 1, 0, 1, 0], // 原片 8.1s：中间 2×2 白，隔一圈一圈蓝
  [0, 1, 0, 2, 0, 1, 0, 1], // 原片 8.9s：中间空，内圈蓝、第二圈白
  [2, 0, 1, 0, 1, 0, 2, 0], // 原片 9.8s：中间又白，里面三圈蓝，白圈在外面
];
const SWITCH = [1.5, 2.4];
const N = 16, C0 = (N - 1) / 2;

type Cam = {k: number; yaw: number; pitch: number; cx: number; cy: number; roll: number; f?: number};
const YAW = 49, PITCH = 35, ROLL = 2.5; // 机位按原片 8.1s / 8.9s 两帧的轴线角度反算（竖轴往右倒约 7°、横轴往右下约 2.5°）
const F = 7000; // 焦距（px）：透视要有一点（近的方块比远的略大），原片是透视机位，不是正交
const camAt = (s: number): Cam => {
  // 原片：0.6s 贴得很近，一路拉远（先快后慢）；2.9s 起拉远转正
  const z4 = eio(s, 2.9, 3.2), z3 = clamp((s - 1.2) / 1.7);
  const KP: [number, number][] = [[0.6, 400], [0.75, 240], [0.85, 185], [1.0, 168], [1.5, 162]]; // 原片逐帧量的每格像素
  let k = KP[0][1];
  for (let q = 0; q < KP.length - 1; q++) if (s >= KP[q][0]) k = mix(KP[q][1], KP[q + 1][1], eo(s, KP[q][0], KP[q + 1][0]));
  if (s > 1.5) k = mix(162, 152, z3);
  k = mix(k, 88, z4);
  // 开头广角（外圈方块巨大），推近时焦距变长，透视变弱
  const f = F; // 不用广角：0.65s 外圈方块巨大是因为镜头近（每格 340px），中间 4 个白方块小是因为它们正在长出来
  return {k, f, yaw: mix(YAW, 2, z4), pitch: mix(PITCH, 55, z4), cx: 960 + 24 * z3 * (1 - z4), cy: mix(545, 560, z4), roll: mix(ROLL, 0, z4)};
};
// 透视投影：k = 目标点处每格像素；返回 [x, y, 近远（越大越近）]
const proj = (c: Cam, x: number, y: number, z: number): [number, number, number] => {
  const a = c.yaw * D2R, p = c.pitch * D2R;
  const u = x * Math.cos(a) - y * Math.sin(a), v = x * Math.sin(a) + y * Math.cos(a);
  const near = v * Math.cos(p) + z * Math.sin(p);
  const f = c.f ?? F;
  const Z = Math.max(0.5, f / c.k - near);
  const sx = (f * u) / Z, sy = (f * (v * Math.sin(p) - z * Math.cos(p))) / Z;
  const r = c.roll * D2R;
  return [c.cx + sx * Math.cos(r) - sy * Math.sin(r), c.cy + sx * Math.sin(r) + sy * Math.cos(r), near];
};

// 某圈某时刻的方块：颜色 + 高度（0–1）
const stateIdx = (s: number) => { let st = 0; while (st < SWITCH.length && s >= SWITCH[st] + 0.35) st++; return st; };
const cellAt = (r: number, s: number): {col: number; h: number} => {
  const st = stateIdx(s);
  const bt = r === 0 ? 0.6 : r <= 2 ? 0.55 : r <= 4 ? 0.92 : r <= 6 ? 1.05 : 1.15; // 原片：先只有中间两圈，镜头推近时外圈一圈圈弹出来
  const born = st === 0 ? (r === 0 ? eo(s, 0.62, 0.8) : eob(s, bt, bt + 0.14)) : 1; // 中间 4 个白方块慢慢长满（原片 0.65s 还很小）
  const cur = STATES[st], nxt = STATES[st + 1];
  if (!nxt) return {col: cur[r], h: born};
  const d = SWITCH[st] + (7 - r) * 0.025;
  if (s < d) return {col: cur[r], h: born};
  if (s < d + 0.09) return {col: cur[r], h: born * (1 - eio(s, d, d + 0.09))};
  return {col: nxt[r], h: eob(s, d + 0.09, d + 0.22)};
};

const GRADS = (
  <defs>
    <linearGradient id="bT" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#74a0ff" /><stop offset="1" stopColor="#2c66ff" /></linearGradient>
    <linearGradient id="bL" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#4a86ff" /><stop offset="0.45" stopColor="#2563ff" /><stop offset="1" stopColor="#1b52f2" /></linearGradient>
    <linearGradient id="bR" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#3a77ff" /><stop offset="0.45" stopColor="#1f5cff" /><stop offset="1" stopColor="#174ae6" /></linearGradient>
    <linearGradient id="wT" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ffffff" /><stop offset="1" stopColor="#e4ebff" /></linearGradient>
    <linearGradient id="wL" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ffffff" /><stop offset="1" stopColor="#c9d6ff" /></linearGradient>
    <linearGradient id="wR" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f4f7ff" /><stop offset="1" stopColor="#b9c9ff" /></linearGradient>
  </defs>
);
const area = (q: number[][]) => { let a = 0; for (let i = 0; i < q.length; i++) { const [x1, y1] = q[i], [x2, y2] = q[(i + 1) % q.length]; a += x1 * y2 - x2 * y1; } return a / 2; };

const Board: React.FC<{s: number}> = ({s}) => {
  const c = camAt(s);
  const polys: {z: number; el: React.ReactNode}[] = [];
  const cs = 0.67; // 方块占格子的比例（原片量：圈里相邻方块之间只留一条缝）
  const outerOp = 1 - eio(s, 2.9, 3.12); // 拉远转正时只留中间这一块
  const pts = (q: number[][]) => q.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
  for (let i = -N; i < 2 * N; i++) for (let j = -N; j < 2 * N; j++) {
    const li = ((i % N) + N) % N, lj = ((j % N) + N) % N;
    const outer = i < 0 || j < 0 || i >= N || j >= N;
    if (outer && outerOp <= 0.01) continue;
    if (outer && s < 1.15) continue;
    const r = Math.round(Math.max(Math.abs(li - C0), Math.abs(lj - C0)) - 0.5);
    const {col, h} = cellAt(r, s);
    if (!col || h <= 0.02) continue;
    const pc = proj(c, i - C0, j - C0, 0);
    if (pc[0] < -260 || pc[0] > 2180 || pc[1] < -300 || pc[1] > 1380) continue;
    const cz = r === 0 && s < 0.85 ? cs * clamp(h) : cs; // 中间 4 个白方块是整个长大（不只是长高）
    const x0 = i - C0 - cz / 2, y0 = j - C0 - cz / 2, x1 = x0 + cz, y1 = y0 + cz, zt = cz * (r === 0 && s < 0.85 ? 1 : h);
    const P = (x: number, y: number, z: number) => proj(c, x, y, z);
    const V = [P(x0, y0, 0), P(x1, y0, 0), P(x1, y1, 0), P(x0, y1, 0), P(x0, y0, zt), P(x1, y0, zt), P(x1, y1, zt), P(x0, y1, zt)];
    const FACES: [number[], string][] = [[[4, 5, 6, 7], 'T'], [[1, 2, 6, 5], 'L'], [[3, 0, 4, 7], 'L'], [[2, 3, 7, 6], 'R'], [[0, 1, 5, 4], 'R']];
    const EDGES = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]];
    const vis = FACES.filter(([f]) => area(f.map((k) => V[k])) > 0);
    const front = new Set<string>();
    vis.forEach(([f]) => f.forEach((k, n) => { const a = k, b = f[(n + 1) % 4]; front.add(`${Math.min(a, b)}-${Math.max(a, b)}`); }));
    const pre = col === 1 ? 'b' : 'w';
    polys.push({z: pc[2], el: (
      <g key={`${i}-${j}`} opacity={outer ? outerOp * clamp((s - 1.15) / 0.12) : 1}>
        {/* 背后的棱：面是半透明的，原片能隐约看到 */}
        <g stroke="rgba(235,242,255,0.35)" strokeWidth={1}>{EDGES.filter(([a, b]) => !front.has(`${a}-${b}`)).map(([a, b], n) => <line key={n} x1={V[a][0]} y1={V[a][1]} x2={V[b][0]} y2={V[b][1]} />)}</g>
        {vis.map(([f, t], n) => <polygon key={n} points={pts(f.map((k) => V[k]))} fill={`url(#${pre}${t})`} fillOpacity={pre === "w" ? 1 : 0.92} />)}
        <g stroke="rgba(240,245,255,0.95)" strokeWidth={1.6} strokeLinejoin="round">{EDGES.filter(([a, b]) => front.has(`${a}-${b}`)).map(([a, b], n) => <line key={n} x1={V[a][0]} y1={V[a][1]} x2={V[b][0]} y2={V[b][1]} />)}</g>
      </g>
    )});
  }
  polys.sort((a, b) => a.z - b.z);
  // 地板线：走在"空着的那几圈"正中（原片线跟着圈形换），交点有小白点；每块图案中心发出 8 条放射线
  const st = stateIdx(s);
  const emptyOdd = STATES[Math.min(st, STATES.length - 1)][1] === 0; // r=1 空 → 线在 ±1.5、±3.5…
  const offs = emptyOdd ? [1.5, 3.5, 5.5, 7.5] : [0.5, 2.5, 4.5, 6.5];
  const vals: number[] = [];
  for (const tile of (s < 1.15 ? [0] : [-N, 0, N])) for (const o of offs) { vals.push(tile + o); vals.push(tile - o); }
  const E = s < 1.15 ? N / 2 : N * 1.5; // 外面的图案出来之前，线只画在这一块里（不然广角下会拉出一条地平线）
  const lines: React.ReactNode[] = [];
  const dots: React.ReactNode[] = [];
  vals.forEach((g, n) => {
    const a1 = proj(c, g, -E, 0), a2 = proj(c, g, E, 0), b1 = proj(c, -E, g, 0), b2 = proj(c, E, g, 0);
    const inBoard = Math.abs(g) < N / 2;
    const op = inBoard ? 1 : outerOp;
    if (op > 0.01) lines.push(<line key={`x${n}`} x1={a1[0]} y1={a1[1]} x2={a2[0]} y2={a2[1]} opacity={op} />, <line key={`y${n}`} x1={b1[0]} y1={b1[1]} x2={b2[0]} y2={b2[1]} opacity={op} />);
  });
  for (const gx of vals) for (const gy of vals) {
    const p = proj(c, gx, gy, 0);
    if (p[0] < -10 || p[0] > 1930 || p[1] < -10 || p[1] > 1090) continue;
    dots.push(<circle key={`d${gx}_${gy}`} cx={p[0]} cy={p[1]} r={5.5} fill="#fff" />);
  }
  for (const tx of [-N, 0, N]) for (const ty of [-N, 0, N]) for (let q = 0; q < 8; q++) {
    if ((tx || ty) && outerOp <= 0.01) continue;
    const ang = q * Math.PI / 4, o = proj(c, tx, ty, 0), e = proj(c, tx + Math.cos(ang) * 8, ty + Math.sin(ang) * 8, 0);
    lines.push(<line key={`r${tx}_${ty}_${q}`} x1={o[0]} y1={o[1]} x2={e[0]} y2={e[1]} />);
  }
  const show = clamp((s - 0.58) / 0.06);
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, opacity: show}}>
      {GRADS}
      <g stroke="rgba(255,255,255,0.95)" strokeWidth={2.1}>{lines}</g>
      {dots}
      {polys.map((p) => p.el)}
    </svg>
  );
};

// 开头的线框立方体
const Wire: React.FC<{s: number}> = ({s}) => {
  if (s > 0.74) return null;
  const sz = mix(980, 520, eo(s, 0, 0.5)) * mix(1, 0.32, eio(s, 0.5, 0.64));
  const c: Cam = {k: sz, yaw: mix(25, 112, eo(s, 0, 0.62)), pitch: mix(30, 33, eo(s, 0, 0.6)), cx: mix(1010, 960, eo(s, 0, 0.5)), cy: 540, roll: mix(-38, -8, eo(s, 0, 0.62))};
  const V = [[-0.5, -0.5, -0.5], [0.5, -0.5, -0.5], [0.5, 0.5, -0.5], [-0.5, 0.5, -0.5], [-0.5, -0.5, 0.5], [0.5, -0.5, 0.5], [0.5, 0.5, 0.5], [-0.5, 0.5, 0.5]].map(([x, y, z]) => proj(c, x, y, z));
  const E = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]];
  const F = [[4, 5, 6, 7], [0, 1, 5, 4], [1, 2, 6, 5], [2, 3, 7, 6], [3, 0, 4, 7]];
  const fill = clamp((s - 0.3) / 0.12), blue = clamp((s - 0.5) / 0.12);
  const fc = (k: number) => `rgba(${Math.round(mix(10, 63 * k, blue))},${Math.round(mix(20, 108 * k, blue))},${Math.round(mix(60, 255 * k, blue))},${(0.92 * fill).toFixed(3)})`;
  const facesSorted = F.map((f, i) => ({f, i, z: f.reduce((a, v) => a + V[v][2], 0) / 4})).sort((a, b) => a.z - b.z);
  const op = 1 - clamp((s - 0.68) / 0.06); // 原片 0.65s 中间还看得到这颗蓝方块，四个白方块围着它长出来
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, opacity: op}}>
      {/* 从角上拉出去的长线（地板网格的透视线） */}
      <g stroke="rgba(255,255,255,0.35)" strokeWidth={1}>
        {[0, 1, 2, 3].map((q) => { const p = V[q]; const dx = p[0] - c.cx, dy = p[1] - c.cy; return <line key={q} x1={p[0]} y1={p[1]} x2={p[0] + dx * 3} y2={p[1] + dy * 3} />; })}
      </g>
      {fill > 0 && facesSorted.map(({f, i}) => <polygon key={i} points={f.map((v) => `${V[v][0].toFixed(1)},${V[v][1].toFixed(1)}`).join(' ')} fill={fc([1, 0.8, 0.65, 0.7, 0.85][i])} />)}
      <g stroke="rgba(255,255,255,0.85)" strokeWidth={1.4}>{E.map(([a, b], i) => <line key={i} x1={V[a][0]} y1={V[a][1]} x2={V[b][0]} y2={V[b][1]} />)}</g>
    </svg>
  );
};

export const IsoCubeRings: React.FC = () => {
  const s = useCurrentFrame() / FPS;
  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      <Board s={s} />
      <Wire s={s} />
    </AbsoluteFill>
  );
};
