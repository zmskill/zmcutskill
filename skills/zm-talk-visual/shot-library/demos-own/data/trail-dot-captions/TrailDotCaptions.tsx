// 绿点拖虚线 + 网格像素硬闪 → 1 帧块状马赛克 → 带角标框的逐词字幕接力（010-D，可首尾相接循环）
// 学的动作（来自 @amirdzm 010 四宫格右下格 0–4.33s，30fps 逐帧看过，逐元素时间表见 shot-lab/refs/010-D/逐元素时间表.md）：
//   绿点画笔的速度在"呼吸"：每个节拍（切场景 / 换句）前加速冲过去、之后减速，从来不停（最慢 2px/f@960）
//   场景一镜头拉远 + 1.0s 后叠加右平移；白色锯齿 / 实心 / 斜线 / 描边像素块对齐网格硬闪；"像素小蛇"逐格爬，引导视线
//   1.433s 只用 1 帧块状马赛克切到近黑的场景二；字幕一帧出一个词，新词先多空一点、下一帧收紧，出完往一个方向漂再定住，
//   退场 ease-in 左滑、最后 2 帧变暗、再一帧删掉；角标框先大再收紧
// 我们的内容（中性日常）：好习惯打卡。标签"好习惯 / 打卡 +3 章""+2 天"；字幕"这周你多读了 / 整整 3 章书"→"比上周多坚持了"→"两天的早睡"
//
// 时间表（30fps，共 130f = 4.333s，和原片同帧号；坐标按原格 ×2）
//   S1   0–42   拉远 1.0→0.815（前 0.6s 快）；30 起叠加右平移；点 28→4→12 px/f@960；3/4/5 帧标签 2 分三步搭出；
//               0–6 白块最密，之后变稀；33–42 小蛇 1 从标签 1 右缘长出；30 起 HUD 十字
//   S2   43     1 帧块状马赛克：新场景 + 旧场景几块（变暗、标签 2 半块左错 120px）；新绿点已在 (7%,25%)
//   S3  44–76   场景二（近黑、暗灰柔边矩形、细格 67px、镜头匀速推近 8.7%）；字幕 1 44–48 一帧一词；小蛇 2 爬到框右下角；
//               63 起左滑，69 起加速，75–76 变暗，77 删
//   S4  77–105  矩形同帧换布局；字幕 2 77–80 一帧一词；点过弧顶 28→5→13；90–105 小蛇 4 往左爬到字幕 3 起点；103–105 变暗
//   S5 106–129  矩形同帧换布局；字幕 3 106–108，前面两个描边格当光标；点沿右侧减速到 2px/f；120 起小蛇 5 往下爬；130 硬切回 0
// 毛病清单（自查表通用项 + 本镜头独有）：
//   - 独有 1：点的速度一定要按测量表"加速进 → 切 → 减速出"，不能匀速；虚线短划钉在路径上不滑动
//   - 独有 2：像素块整数帧硬开硬关、对齐网格；场景二不能做亮
//   - 独有 3：中文按词块出，没有空格，所以"多空一点"用 16px（原格 8px×2）的临时间距表现
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {mix} from '../../../kit/polish';

export const TRAIL_DOT_CAPTIONS_DURATION = 130;

const W = 1920;
const H = 1080;
const X = (p: number) => p * 19.2; // 画面百分比 → px
const Y = (p: number) => p * 10.8;
const SANS = '"PingFang SC", "Noto Sans CJK SC", "Noto Sans SC", "Helvetica Neue", sans-serif';
const MONO = '"SF Mono", "PingFang SC", Menlo, monospace';
const GREEN = '#78e1b1';
const CAP_GREEN: [number, number, number] = [123, 233, 194];

const hash = (a: number, b = 0, c = 0) => {
  const x = Math.sin(a * 127.1 + b * 311.7 + c * 74.7) * 43758.5453;
  return x - Math.floor(x);
};
const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const g = (l: number) => {
  const v = Math.round(clamp01(l) * 255);
  return `rgb(${v},${v},${v})`;
};

// ───────── 单调三次插值（Fritsch–Carlson）：关键帧之间平滑、不过冲；两端按端点斜率线性外推 ─────────
type K = [number, number][];
const mono = (keys: K) => {
  const n = keys.length;
  const xs = keys.map((k) => k[0]);
  const ys = keys.map((k) => k[1]);
  const d: number[] = [];
  for (let i = 0; i < n - 1; i++) d.push((ys[i + 1] - ys[i]) / (xs[i + 1] - xs[i]));
  const m: number[] = new Array(n).fill(0);
  m[0] = d[0];
  m[n - 1] = d[n - 2];
  for (let i = 1; i < n - 1; i++) {
    if (d[i - 1] * d[i] <= 0) m[i] = 0;
    else {
      const w1 = 2 * (xs[i + 1] - xs[i]) + (xs[i] - xs[i - 1]);
      const w2 = (xs[i + 1] - xs[i]) + 2 * (xs[i] - xs[i - 1]);
      m[i] = (w1 + w2) / (w1 / d[i - 1] + w2 / d[i]);
    }
  }
  return (t: number) => {
    if (t <= xs[0]) return ys[0] + m[0] * (t - xs[0]);
    if (t >= xs[n - 1]) return ys[n - 1] + m[n - 1] * (t - xs[n - 1]);
    let i = 0;
    while (t > xs[i + 1]) i++;
    const h = xs[i + 1] - xs[i];
    const s = (t - xs[i]) / h;
    const s2 = s * s, s3 = s2 * s;
    return (2 * s3 - 3 * s2 + 1) * ys[i] + (s3 - 2 * s2 + s) * h * m[i] + (-2 * s3 + 3 * s2) * ys[i + 1] + (s3 - s2) * h * m[i + 1];
  };
};
// 阶梯：取最后一个 ≤ f 的关键值（像素小蛇的头部格号）
const step = (keys: K) => (f: number) => {
  let v = keys[0][1];
  for (const [t, val] of keys) if (f >= t) v = val;
  return v;
};

// ───────── 镜头 ─────────
type Cam = {s: number; tx: number; cx: number; cy: number};
const toScreen = (c: Cam, x: number, y: number): [number, number] => [c.cx + (x - c.cx) * c.s + c.tx, c.cy + (y - c.cy) * c.s];
const toWorld = (c: Cam, x: number, y: number): [number, number] => [c.cx + (x - c.tx - c.cx) / c.s, c.cy + (y - c.cy) / c.s];
const camStyle = (c: Cam): React.CSSProperties => ({
  position: 'absolute', left: 0, top: 0, width: W, height: H,
  transformOrigin: `${c.cx}px ${c.cy}px`, transform: `translate(${c.tx.toFixed(3)}px,0px) scale(${c.s.toFixed(5)})`,
});

// S1：格子 81→66px（@960）换算成比例；30 起往右平移（内容往左走），越走越快
const A_S = mono([[0, 1], [1, 0.975], [2, 0.951], [3, 0.938], [6, 0.914], [9, 0.895], [12, 0.883], [15, 0.877], [20, 0.864], [30, 0.85], [36, 0.836], [42, 0.815], [44, 0.805]]);
const A_TX = mono([[0, 0], [29, 0], [33, -10], [37, -34], [40, -66], [42, -107], [44, -150]]);
const camA = (t: number): Cam => ({s: A_S(Math.max(0, t)), tx: A_TX(Math.max(0, t)), cx: 891, cy: 523});
// S3–S5：以 (50%,47%) 为中心匀速推近，43→130 放大 8.7%
const camB = (t: number): Cam => ({s: 1 + 0.087 * (Math.max(43, t) - 43) / 87, tx: 0, cx: 960, cy: 508});

// ───────── 绿点屏幕轨迹（逐帧测量值，%@960）─────────
const dotKeysA: [number, number, number][] = [
  [-7, 31.5, 30.5], [-5, 36.2, 37.2], [-3, 41.2, 44.6], [-1, 46.6, 53.2],
  [0, 49.5, 57.4], [1, 51.9, 60.7], [2, 53.8, 63], [3, 55.4, 64.9], [4, 56.9, 66.5], [5, 58.1, 67.6], [6, 59.2, 68.5],
  [7, 60.3, 69.3], [11, 63.5, 71], [12, 64.2, 71.1], [15, 65.9, 71.6], [18, 67.4, 71.9], [21, 68.8, 71.95],
  [24, 70.2, 71.7], [27, 71.5, 71.4], [30, 73.1, 71], [33, 74.8, 70.2], [38, 78.5, 67.4], [40, 80.5, 64.8], [42, 82.9, 61.5], [43, 84.2, 59.4],
];
const dotKeysB: [number, number, number][] = [
  [41, -9, 37.5], [42, -1.2, 31.5], [43, 7, 25.2], [44, 14.3, 20], [45, 18.3, 17.3], [46, 21, 15.6], [47, 23.2, 14.1], [48, 24.9, 13.1],
  [49, 26.5, 12.4], [52, 29.7, 10.7], [54, 31.3, 10.1], [57, 33.2, 9.3], [60, 34.8, 8.9], [63, 36.2, 8.45], [66, 37.7, 8.1],
  [69, 39.3, 7.8], [72, 41.6, 7.45], [74, 44.2, 7.25], [75, 45.8, 7.2], [76, 47.7, 7.3], [77, 50.2, 7.6], [78, 53.1, 8.1],
  [79, 56.4, 8.9], [80, 59.6, 10], [81, 62.4, 11.3], [84, 68.6, 15], [87, 71.8, 17.6], [90, 74.1, 19.6], [93, 75.7, 21.2],
  [96, 77.1, 22.7], [99, 78.8, 24.6], [100, 79.5, 25.4], [101, 80.3, 26.5], [102, 81.3, 27.8], [103, 82.3, 29.3],
  [104, 83.4, 31.3], [105, 84.7, 33.5], [106, 86, 35.9], [107, 87.2, 38.3], [108, 88.2, 40.6], [109, 89.1, 42.8],
  [111, 90.3, 46.4], [114, 91.8, 50.4], [117, 92.7, 53.5], [120, 93.4, 55.9], [123, 94.1, 58.1], [126, 94.55, 60.8], [129, 95, 63.5], [130, 95.15, 64.4],
];
const mkDot = (keys: [number, number, number][]) => {
  const fx = mono(keys.map((k) => [k[0], X(k[1])] as [number, number]));
  const fy = mono(keys.map((k) => [k[0], Y(k[2])] as [number, number]));
  return (t: number): [number, number] => [fx(t), fy(t)];
};
const dotA = mkDot(dotKeysA);
const dotB = mkDot(dotKeysB);

// 虚线轨迹：画笔每 1/4 帧在"当时镜头下"落一个世界坐标点；路径起点固定，所以短划钉在路径上、不会滑
const Trail: React.FC<{f: number; t0: number; dot: (t: number) => [number, number]; cam: (t: number) => Cam; color: string}> = ({f, t0, dot, cam, color}) => {
  const pts: [number, number][] = [];
  for (let t = t0; t < f; t += 0.25) {
    const [sx, sy] = dot(t);
    pts.push(toWorld(cam(t), sx, sy));
  }
  const [hx, hy] = dot(f);
  pts.push(toWorld(cam(f), hx, hy));
  const d = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(2)} ${p[1].toFixed(2)}`).join('');
  // 紧贴点后面约 40px（屏幕）是实线
  const s = cam(f).s;
  let acc = 0;
  let k = pts.length - 1;
  while (k > 0 && acc < 40 / s) {
    acc += Math.hypot(pts[k][0] - pts[k - 1][0], pts[k][1] - pts[k - 1][1]);
    k--;
  }
  const tail = pts.slice(k).map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(2)} ${p[1].toFixed(2)}`).join('');
  const sw = 2.2 / s;
  return (
    <g fill="none" strokeLinecap="butt">
      <path d={d} stroke={color} strokeWidth={sw} strokeDasharray="16 16" />
      <path d={tail} stroke={color} strokeWidth={sw} />
    </g>
  );
};

// ───────── 像素块：白实心 W（有淡渐变）/ 白锯齿 J / 斜线 H / 描边格 O ─────────
type BT = 'W' | 'J' | 'H' | 'O';
const NOTCH = [
  [[0.12, 0.58], [0.3, 0.68], [0.08, 0.5], [0.36, 0.72]],
  [[0.32, 0.7], [0.1, 0.52], [0.4, 0.74], [0.14, 0.56]],
  [[0.2, 0.62], [0.42, 0.78], [0.18, 0.6], [0.06, 0.46]],
];
const jagPoly = (v: number) => {
  const sides: [[number, number], [number, number], [number, number]][] = [
    [[0, 0], [1, 0], [0, 1]], [[1, 0], [1, 1], [-1, 0]], [[1, 1], [0, 1], [0, -1]], [[0, 1], [0, 0], [1, 0]],
  ];
  const out: string[] = [];
  sides.forEach(([a, b, n], si) => {
    out.push(`${a[0]},${a[1]}`);
    for (const u of NOTCH[v % 3][si]) {
      const w = 0.17, dep = 0.24;
      const p = (q: number) => [a[0] + (b[0] - a[0]) * q, a[1] + (b[1] - a[1]) * q];
      const p0 = p(u), p1 = p(u + w);
      out.push(`${p0[0]},${p0[1]}`, `${p1[0] + n[0] * dep},${p1[1] + n[1] * dep}`, `${p1[0]},${p1[1]}`);
    }
  });
  return out.join(' ');
};
const JAG = [0, 1, 2].map(jagPoly);

const Block: React.FC<{x: number; y: number; size: number; type: BT; lum?: number; alpha?: number; v?: number; hid: string; sw?: number}> = ({x, y, size, type, lum = 1, alpha = 1, v = 0, hid, sw = 2}) => {
  const h = size / 2;
  if (type === 'W') {
    return (
      <g opacity={alpha}>
        <rect x={x - h} y={y - h} width={size} height={size} fill={g(lum)} />
        <rect x={x - h} y={y - h} width={size} height={size} fill={`url(#${hid}-wg)`} opacity={0.1 * lum} />
      </g>
    );
  }
  if (type === 'J') {
    const rot = (v % 4) * 90;
    const flip = v % 2 ? -1 : 1;
    return (
      <polygon points={JAG[v % 3]} fill={g(lum)} opacity={alpha}
        transform={`translate(${x} ${y}) rotate(${rot}) scale(${flip * size} ${size}) translate(-0.5 -0.5)`} />
    );
  }
  if (type === 'H') {
    return <rect x={x - h} y={y - h} width={size} height={size} fill={`url(#${hid}-hatch)`} opacity={alpha * lum} />;
  }
  const c = 3.2 * sw;
  return (
    <g opacity={alpha}>
      <rect x={x - h} y={y - h} width={size} height={size} fill="none" stroke={g(lum)} strokeWidth={sw} />
      {[[-h, -h], [h, -h], [-h, h], [h, h]].map(([dx, dy], i) => (
        <rect key={i} x={x + dx - c / 2} y={y + dy - c / 2} width={c} height={c} fill={g(Math.min(1, lum * 1.25))} />
      ))}
    </g>
  );
};
const Defs: React.FC<{id: string; hatchGap: number; sw: number}> = ({id, hatchGap, sw}) => (
  <defs>
    <pattern id={`${id}-hatch`} patternUnits="userSpaceOnUse" width={hatchGap} height={hatchGap} patternTransform="rotate(45)">
      <line x1={0} y1={0} x2={0} y2={hatchGap} stroke="#a8a8a8" strokeWidth={sw} />
    </pattern>
    <linearGradient id={`${id}-wg`} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#000" stopOpacity={0} />
      <stop offset="1" stopColor="#000" stopOpacity={1} />
    </linearGradient>
  </defs>
);

// 像素小蛇：path 是格子中心，head(f) 是头所在格号；styles 从头往后
type SnakeCell = {type: BT; lum: number; alpha: number};
const snakeCells = (path: [number, number][], head: number, styles: SnakeCell[]) => {
  const out: {x: number; y: number; c: SnakeCell; k: number}[] = [];
  styles.forEach((c, k) => {
    const i = head - k;
    if (i >= 0 && i < path.length) out.push({x: path[i][0], y: path[i][1], c, k});
  });
  return out;
};

// ───────── 数据标签（直角、1px 描边、四角小方块）─────────
const LABEL_W = 570, LABEL_H = 140;
const Label: React.FC<{x: number; y: number; stage: number; boxScale: number; big: string; small: string; dim?: number}> = ({x, y, stage, boxScale, big, small, dim = 1}) => {
  const bw = LABEL_W * boxScale, bh = LABEL_H * boxScale;
  const bx = x + (LABEL_W - bw) / 2, by = y + (LABEL_H - bh) / 2;
  const corner = (cx: number, cy: number, i: number) => <div key={i} style={{position: 'absolute', left: cx - 3, top: cy - 3, width: 6, height: 6, background: '#5e5e5e'}} />;
  const br = (l: number, t: number, w: number, hh: number) => {
    const a = 9, s = '2px solid #7fae9a';
    return (
      <>
        <div style={{position: 'absolute', left: l, top: t, width: a, height: a, borderLeft: s, borderTop: s}} />
        <div style={{position: 'absolute', left: l + w - a, top: t, width: a, height: a, borderRight: s, borderTop: s}} />
        <div style={{position: 'absolute', left: l, top: t + hh - a, width: a, height: a, borderLeft: s, borderBottom: s}} />
        <div style={{position: 'absolute', left: l + w - a, top: t + hh - a, width: a, height: a, borderRight: s, borderBottom: s}} />
      </>
    );
  };
  return (
    <div style={{position: 'absolute', left: 0, top: 0, opacity: dim}}>
      <div style={{position: 'absolute', left: bx, top: by, width: bw, height: bh, boxSizing: 'border-box', border: '2px solid #2f2f2f', background: '#121412'}} />
      {[[bx, by], [bx + bw, by], [bx, by + bh], [bx + bw, by + bh]].map(([cx, cy], i) => corner(cx, cy, i))}
      {stage >= 1 && (
        <div style={{position: 'absolute', left: x + 22, top: y + 22, width: 104, height: 96}}>
          {br(0, 0, 104, 96)}
          <div style={{position: 'absolute', left: 0, width: 104, top: 12, textAlign: 'center', fontFamily: MONO, fontSize: 25, lineHeight: '36px', color: '#9fdcc4', letterSpacing: '0.04em'}}>
            好习惯<br />打卡
          </div>
        </div>
      )}
      {stage >= 2 && (
        <>
          <div style={{position: 'absolute', left: x + 156, top: y + 22, fontFamily: SANS, fontSize: 32, fontWeight: 500, color: '#99e0c6', whiteSpace: 'nowrap'}}>{big}</div>
          <div style={{position: 'absolute', left: x + 157, top: y + 78, fontFamily: SANS, fontSize: 22, color: '#a5a6a4', whiteSpace: 'nowrap'}}>{small}</div>
        </>
      )}
    </div>
  );
};

// ───────── 场景一 ─────────
const L1 = {x: 225, y: 134};
const L2 = {x: 1048, y: 467};
const CELL_A = 162;
const SNAKE1: [number, number][] = [[-1, 0], [0, 0], [1, 0], [2, 0], [3, 0], [4, 1], [5, 1]].map(([k, r]) => [795 + 138 * k + 69, 205 + 152 * r]);
const SNAKE1_HEAD = (f: number) => (f < 34 ? -1 : Math.floor((f - 34) / 2) + 1);
const A_SLOTS = mono([[0, 4], [3, 7], [6, 8], [10, 6.5], [13, 5], [16, 4], [20, 3.6], [26, 3.4], [30, 3.4], [36, 3.5], [43, 3.5]]);
const overlapsLabel = (x: number, y: number, r: number) =>
  [L1, L2].some((l) => x + r > l.x - 10 && x - r < l.x + LABEL_W + 10 && y + r > l.y - 10 && y - r < l.y + LABEL_H + 10);

const SceneA: React.FC<{f: number; hideDot?: boolean}> = ({f, hideDot}) => {
  const cam = camA(f);
  const [dx, dy] = dotA(f);
  // 网格硬闪块：固定"槽位"数（前 0.4s 最多），每个槽位按周期换一个格子（槽位之间错开帧），挤在左右两边
  const blocks: React.ReactNode[] = [];
  const nSlots = Math.round(A_SLOTS(f));
  const used = new Set<string>();
  for (let k = 0; k < nSlots; k++) {
    const per = f < 14 ? 2 : f < 30 ? 3 : 3;
    const ep = Math.floor((f + (k % per)) / per);
    for (let tr = 0; tr < 14; tr++) {
      const i = -7 + Math.floor(hash(k, ep, tr * 1.7 + 0.3) * 18);
      const j = -5 + Math.floor(hash(k, ep, tr * 2.3 + 5.1) * 11);
      const key = `${i}_${j}`;
      if (used.has(key)) continue;
      const wx = 891 + CELL_A * i, wy = 523 + CELL_A * j;
      const [sx, sy] = toScreen(cam, wx, wy);
      if (sx < -40 || sx > W + 40 || sy < -40 || sy > H + 40) continue;
      const xr = sx / W;
      const col = xr < 0.19 || xr > 0.81 ? 1 : xr < 0.3 || xr > 0.7 ? 0.25 : 0.04;
      if (overlapsLabel(wx, wy, 70)) continue;
      if (Math.hypot(sx - dx, sy - dy) < 230) continue;
      if (f >= 33 && wy > 60 && wy < 360 && wx > 760) continue; // 让出小蛇那一行
      if (hash(k, ep, tr + 9.9) > col) continue;
      used.add(key);
      const r = hash(k, ep, 19.3);
      const type: BT = f < 18 ? (r < 0.3 ? 'O' : r < 0.55 ? 'W' : r < 0.82 ? 'J' : 'H') : (r < 0.24 ? 'O' : r < 0.38 ? 'W' : r < 0.74 ? 'J' : 'H');
      const hs = hash(k, ep, 4.4);
      const sz = type === 'J' ? 138 * (f < 12 ? 0.85 + 0.15 * hs : 0.55 + 0.4 * hs) : type === 'H' ? 124 : 138;
      blocks.push(<Block key={key} x={wx} y={wy} size={sz} type={type} lum={type === 'O' ? 0.38 : type === 'H' ? 0.7 : 1} v={Math.floor(hash(k, ep, 7.7) * 12)} hid="a" sw={2} />);
      break;
    }
  }
  // 小蛇 1：从标签 1 右缘长出，每 2 帧前进一格，最后拐到下一行
  const head = SNAKE1_HEAD(f);
  const s1 = snakeCells(SNAKE1, head, [
    {type: 'J', lum: 1, alpha: 1}, {type: 'W', lum: 1, alpha: 1}, {type: 'O', lum: 0.42, alpha: 1}, {type: 'O', lum: 0.38, alpha: 1}, {type: 'O', lum: 0.34, alpha: 0.8},
  ]);
  // 标签 2：3 帧搭出来（空框大 11% → 左边词 → 右边数字和小字）
  const l2stage = f < 3 ? -1 : f < 4 ? 0 : f < 5 ? 1 : 2;
  const l2scale = f < 4 ? 1.11 : f < 5 ? 1.045 : f < 6 ? 1.016 : 1;
  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 85% 130% at 0% 100%, #101010 0%, #080808 45%, #020202 75%, #000 100%)'}} />
      <div style={camStyle(cam)}>
        <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
          <Defs id="a" hatchGap={13} sw={2.4} />
          {Array.from({length: 22}, (_, k) => {
            const gx = 891 - 81 + CELL_A * (k - 9);
            return <line key={`v${k}`} x1={gx} y1={-900} x2={gx} y2={2000} stroke="rgba(255,255,255,0.045)" strokeWidth={2 / cam.s} />;
          })}
          {Array.from({length: 14}, (_, k) => {
            const gy = 523 - 81 + CELL_A * (k - 6);
            return <line key={`h${k}`} x1={-1200} y1={gy} x2={3200} y2={gy} stroke="rgba(255,255,255,0.045)" strokeWidth={2 / cam.s} />;
          })}
          {blocks}
          {/* 标签 1 下方的描边格（34–41） */}
          {f >= 34 && f < 42 && <Block x={484} y={365} size={130} type="O" lum={0.4} hid="a" />}
        </svg>
        <Label x={L1.x} y={L1.y} stage={2} boxScale={1} big="+3 章" small="这周读书比上周多" />
        {l2stage >= 0 && <Label x={L2.x} y={L2.y} stage={l2stage} boxScale={l2scale} big="+2 天" small="早睡比上周多坚持" />}
        <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
          {/* 小蛇前兆：32–33 半透明灰锯齿块叠在标签 1 字上 */}
          {f === 32 && <Block x={640} y={205} size={120} type="J" lum={0.55} alpha={0.45} v={2} hid="a" />}
          {f === 33 && <Block x={726} y={205} size={130} type="J" lum={0.6} alpha={0.5} v={1} hid="a" />}
          {s1.map(({x, y, c, k}) => {
            const early = f < 37 && head - k === 0;
            return (
              <g key={`s${k}`}>
                {early ? (
                  <g>
                    <rect x={x - 64} y={y - 64} width={128} height={128} fill="#8a8a8a" opacity={0.5} />
                    <rect x={x - 64} y={y + 58} width={128} height={6} fill="#fff" />
                  </g>
                ) : (
                  <Block x={x} y={y} size={c.type === 'J' ? 112 : 128} type={c.type} lum={c.lum} alpha={c.alpha} v={head % 3} hid="a" />
                )}
              </g>
            );
          })}
          <Trail f={f} t0={-7} dot={dotA} cam={camA} color="rgb(112,160,140)" />
        </svg>
      </div>
      {!hideDot && <div style={{position: 'absolute', left: dx - 12, top: dy - 12, width: 24, height: 24, borderRadius: '50%', background: GREEN}} />}
    </AbsoluteFill>
  );
};

// ───────── 场景二 ─────────
const CELL_B = 67;
const snapB = (t: number, xp: number, yp: number): [number, number] => {
  const [wx, wy] = toWorld(camB(t), X(xp), Y(yp));
  return [960 + CELL_B * (Math.floor((wx - 960) / CELL_B) + 0.5), 508 + CELL_B * (Math.floor((wy - 508) / CELL_B) + 0.5)];
};
// 暗灰柔边矩形（%，亮度 0–255），每次换句同一帧换布局
type R = [number, number, number, number, number];
const LAYOUT1: R[] = [[0, 0, 44, 17, 6], [0, 17, 55, 50, 12], [20, 50, 52, 66, 6], [48, 0, 58, 15, 6], [50, 50, 62, 56, 5]];
const LAYOUT2: R[] = [[22, 0, 79, 19, 10], [22, 19, 79, 47, 4], [80, 19, 86, 47, 9], [22, 47, 82, 56, 12], [25, 56, 78, 65, 6], [36, 74, 78, 84, 3]];
const LAYOUT3: R[] = [[44, 0, 90, 28, 3], [40, 28, 47, 47, 6], [40, 47, 100, 56, 12], [35, 56, 95, 65, 7], [36, 65, 90, 74, 3], [44, 74, 90, 92, 10], [92, 30, 100, 50, 6]];
const A_EDGE = mono([[43, 44], [45, 45.5], [48, 47.3], [51, 48], [68, 48.3], [71, 47.6], [73, 46.2], [75, 44.5], [76, 41]]);
const LOCATORS: [number, number][] = [[50, 18], [89.7, 47], [81, 53], [50, 77], [66.5, 77], [89.7, 77]];

// 零散的暗块：[起帧, 止帧(不含), x%, y%, 类型, 亮度, 尺寸系数]
type Ev = [number, number, number, number, BT, number, number?];
const EVENTS: Ev[] = [
  [43, 45, 8, 85, 'J', 0.5], [44, 45, 11.5, 91, 'J', 0.25], [45, 46, 9.5, 83, 'J', 0.32], [45, 47, 6, 90, 'J', 0.5], [46, 47, 11.5, 79, 'J', 0.38],
  [47, 49, 8.6, 82, 'J', 0.3],
  [45, 47, 18.2, 17.5, 'H', 0.35], [47, 50, 20.8, 14.5, 'H', 0.45], [50, 54, 25.5, 12.5, 'H', 0.38],
  [54, 61, 92, 26, 'J', 0.3], [54, 60, 95.5, 26, 'J', 0.22], [63, 66, 68, 57, 'J', 0.3], [66, 72, 24, 61, 'H', 0.32],
  [76, 79, 63, 3, 'J', 0.25], [81, 83, 84, 75, 'H', 0.3], [82, 86, 37.6, 69, 'H', 0.3], [86, 90, 16, 81, 'J', 0.28], [88, 93, 21, 76, 'H', 0.26], [90, 94, 13, 84, 'J', 0.26],
  [102, 108, 73.5, 37.8, 'H', 0.36],
  [106, 107, 60, 1.5, 'J', 0.3], [107, 109, 73, 5, 'J', 0.42], [109, 110, 73, 1, 'W', 0.32], [109, 110, 73, 7, 'J', 0.42],
  [110, 114, 69.4, 6.5, 'W', 0.3], [110, 114, 69.4, 12.5, 'J', 0.38], [114, 119, 69.6, 13, 'O', 0.32],
  [111, 119, 91.5, 89, 'J', 0.36], [114, 122, 98, 37, 'J', 0.24],
  [120, 122, 73.8, 43, 'J', 1], [122, 123, 73.8, 43, 'J', 1, 0.55], [123, 130, 73.8, 43, 'J', 1],
  [122, 126, 55.7, 69.6, 'H', 0.3],
];
// 小蛇 2（左下 → 斜着爬到字幕 1 框的右下角）、3（底部一对暗块往右挪）、4（往左爬到字幕 3 起点当光标）、5（右侧往下爬）
const SNAKES: {path: [number, number][]; head: (f: number) => number; styles: SnakeCell[]; lum: (f: number) => number; from: number; to: number; v: number}[] = [
  {
    path: [[9.3, 75], [12.8, 75], [16.3, 75], [20.5, 69], [24, 63], [27.5, 57], [31, 57], [34.6, 50.7]].map(([x, y]) => snapB(48, x, y)),
    head: step([[47, 1], [49, 2], [51, 3], [53, 4], [54, 5], [56, 6], [58, 7], [60, 8], [63, 9], [66, 10], [68, 12]]),
    styles: [{type: 'J', lum: 1, alpha: 1}, {type: 'W', lum: 1, alpha: 1}, {type: 'O', lum: 0.45, alpha: 1}, {type: 'O', lum: 0.38, alpha: 0.8}],
    lum: mono([[47, 0.42], [50, 0.45], [51, 0.55], [52, 0.66], [53, 0.82], [54, 1], [60, 1], [63, 0.55], [66, 0.4]]),
    from: 47, to: 68, v: 0,
  },
  {
    path: [[61.2, 87], [64.7, 87], [68.2, 87], [71.7, 87], [75.2, 87], [78.7, 81], [82.2, 87]].map(([x, y]) => snapB(72, x, y)),
    head: step([[69, 1], [72, 2], [74, 3], [77, 4], [80, 5], [83, 6], [85, 7]]),
    styles: [{type: 'J', lum: 0.42, alpha: 1}, {type: 'W', lum: 0.3, alpha: 1}],
    lum: () => 1, from: 69, to: 86, v: 1,
  },
  {
    path: [[72.9, 63.5], [69.4, 57.4], [65.8, 57.4], [62.3, 57.4], [58.7, 57.4], [55.2, 57.4], [51.7, 63.9]].map(([x, y]) => snapB(100, x, y)),
    head: step([[90, 0], [92, 1], [93, 2], [96, 3], [98, 4], [99, 5], [101, 6], [103, 7], [105, 8], [106, 9], [107, 10], [109, 12]]),
    styles: [{type: 'J', lum: 1, alpha: 1}, {type: 'W', lum: 1, alpha: 1}, {type: 'O', lum: 0.48, alpha: 1}, {type: 'O', lum: 0.44, alpha: 1}, {type: 'O', lum: 0.4, alpha: 0.9}],
    lum: mono([[90, 0.7], [93, 1], [104, 1], [105, 0.75], [107, 0.7], [108, 0.35]]),
    from: 90, to: 109, v: 2,
  },
  {
    path: [[91.7, 63], [91.7, 69.5], [91.7, 76], [91.7, 82.6], [91.7, 89.2]].map(([x, y]) => snapB(124, x, y)),
    head: step([[120, 0], [122, 1], [123, 2], [125, 3], [127, 4]]),
    styles: [{type: 'J', lum: 1, alpha: 1}, {type: 'W', lum: 0.92, alpha: 1}, {type: 'O', lum: 0.48, alpha: 1}, {type: 'O', lum: 0.4, alpha: 0.85}],
    lum: () => 1, from: 120, to: 131, v: 1,
  },
];

const SoftRect: React.FC<{r: R; edge?: number}> = ({r, edge}) => {
  const [x0, y0, x1raw, y1, l] = r;
  const x1 = edge ?? x1raw;
  const left = X(x0) - 30, top = Y(y0) - 30, w = X(x1) - X(x0) + 60, h = Y(y1) - Y(y0) + 60;
  const fe = 46;
  const mx = `linear-gradient(to right, transparent 0px, #000 ${fe}px, #000 ${w - fe}px, transparent ${w}px)`;
  const my = `linear-gradient(to bottom, transparent 0px, #000 ${fe}px, #000 ${h - fe}px, transparent ${h}px)`;
  const gl = 'rgba(255,255,255,0.03)';
  const ox = (((960 - left) % CELL_B) + CELL_B) % CELL_B, oy = (((508 - top) % CELL_B) + CELL_B) % CELL_B;
  return (
    <div style={{
      position: 'absolute', left, top, width: w, height: h,
      backgroundColor: `rgb(${l},${l},${l})`,
      backgroundImage: `linear-gradient(to right, ${gl} 2px, transparent 2px), linear-gradient(to bottom, ${gl} 2px, transparent 2px)`,
      backgroundSize: `${CELL_B}px ${CELL_B}px`, backgroundPosition: `${ox}px ${oy}px`,
      WebkitMaskImage: `${mx}, ${my}`, WebkitMaskComposite: 'source-in', maskImage: `${mx}, ${my}`, maskComposite: 'intersect',
    } as React.CSSProperties} />
  );
};

const SceneB: React.FC<{f: number}> = ({f}) => {
  const cam = camB(f);
  const [dx, dy] = dotB(f);
  const layout = f < 77 ? LAYOUT1 : f < 106 ? LAYOUT2 : LAYOUT3;
  const evs = EVENTS.filter((e) => f >= e[0] && f < e[1]);
  const dotT = clamp01((f - 84) / 10);
  const dotCol = `rgb(${Math.round(mix(120, 106, dotT))},${Math.round(mix(225, 195, dotT))},${Math.round(mix(177, 155, dotT))})`;
  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      <div style={camStyle(cam)}>
        {layout.map((r, i) => <SoftRect key={`${f < 77 ? 1 : f < 106 ? 2 : 3}-${i}`} r={r} edge={f < 77 && i === 0 ? A_EDGE(f) : undefined} />)}
        <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
          <Defs id="b" hatchGap={10} sw={2} />
          {LOCATORS.map(([x, y], i) => <rect key={i} x={X(x) - 5.5} y={Y(y) - 5.5} width={11} height={11} fill="#686868" />)}
          {evs.map((e, i) => {
            const [wx, wy] = snapB(e[0], e[2], e[3]);
            return <Block key={`e${i}`} x={wx} y={wy} size={(e[4] === 'J' ? 52 : 56) * (e[6] ?? 1)} type={e[4]} lum={e[5]} v={Math.floor(hash(e[0], e[2]) * 12)} hid="b" />;
          })}
          {SNAKES.filter((s) => f >= s.from && f < s.to).map((s, si) =>
            snakeCells(s.path, s.head(f), s.styles).map(({x, y, c, k}) => (
              <Block key={`n${si}_${k}`} x={x} y={y} size={c.type === 'J' ? 52 : 56} type={c.type} lum={c.lum * s.lum(f)} alpha={c.alpha} v={s.v + k} hid="b" />
            )),
          )}
          <Trail f={f} t0={41} dot={dotB} cam={camB} color="rgb(88,128,112)" />
        </svg>
      </div>
      {/* 第三段左侧的大暗角 */}
      {f >= 106 && <AbsoluteFill style={{background: 'linear-gradient(to right, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.75) 22%, rgba(0,0,0,0) 40%)'}} />}
      <div style={{position: 'absolute', left: dx - 12, top: dy - 12, width: 24, height: 24, borderRadius: '50%', background: dotCol}} />
      <Captions f={f} />
    </AbsoluteFill>
  );
};

// ───────── 字幕：一帧一个词块 + 四角角标框 ─────────
const FS = 60;
const textW = (s: string) => [...s].reduce((a, ch) => a + (/[0-9]/.test(ch) ? 0.6 : ch === ' ' ? 0.3 : /[A-Za-z+.]/.test(ch) ? 0.55 : 1), 0) * FS;
type Chunk = {t: string; at: number; green?: boolean};
type Cap = {
  from: number; to: number; lines: Chunk[][]; lineY: number[]; left: (f: number) => number; w: number;
  box: (f: number) => [number, number]; top: number; bottom: number; dim: (f: number) => [number, number, number];
};
const C1_LINES: Chunk[][] = [[{t: '这周', at: 44}, {t: '你', at: 45}, {t: '多读了', at: 46}], [{t: '整整', at: 47, green: true}, {t: ' 3 章书', at: 48, green: true}]];
const C1W = Math.max(textW('这周你多读了'), textW('整整 3 章书'));
const C1X = mono([[43, -50], [44, -38], [45, -27], [46, -18], [47, -12], [48, -8], [49, -4], [50, -2], [54, -0.6], [58, 0], [61, -1.5], [63, -3.5], [66, -6.5], [69, -12], [71, -19], [72, -27], [73, -37], [74, -47], [75, -60], [76, -96]]);
const C1EL = mono([[43, 169], [44, 102], [45, 61], [46, 36], [47, 23], [48, 10], [49, 2], [50, 0], [60, 0]]);
const C1ER = mono([[43, 40], [44, 29], [45, 21], [46, 13], [47, 8], [48, 4], [49, 0], [60, 0]]);
const C2_LINE: Chunk[] = [{t: '比', at: 77}, {t: '上周', at: 78}, {t: '多', at: 79}, {t: '坚持了', at: 80}];
const C2W = textW('比上周多坚持了');
const C2X = mono([[77, 33], [78, 23], [80, 13], [81, 10], [84, 4.5], [87, 2], [90, 0], [93, -1.8], [96, -4], [99, -10], [100, -12], [101, -14.5], [102, -19], [103, -24], [104, -33], [105, -46]]);
const C2PAD = mono([[77, 28], [78, 35], [80, 40], [84, 46], [90, 47], [105, 48]]);
const C3_LINE: Chunk[] = [{t: '两天', at: 106}, {t: '的', at: 107}, {t: '早睡', at: 108}];
const C3W = textW('两天的早睡');
const C3X = mono([[106, 24], [107, 16], [108, 10], [109, 5.5], [110, 3], [111, 1.5], [114, -1.5], [117, -3.5], [120, -5.5], [125, -8.5], [130, -11.5]]);
const C3E = mono([[106, 36], [107, 22], [108, 13], [109, 7], [110, 3], [111, 0], [130, 0]]);
const CAPS: Cap[] = [
  {
    from: 43, to: 77, lines: C1_LINES, lineY: [380, 462], left: (f) => 303 + C1X(f), w: C1W,
    box: (f) => [303 + C1X(f) - 77 - C1EL(f), 303 + C1X(f) + C1W + 77 + C1ER(f)], top: 320, bottom: 510,
    dim: (f) => (f >= 76 ? [0.6, 0.55, 0.4] : f >= 75 ? [0.75, 0.7, 0.7] : [1, 1, 1]),
  },
  {
    from: 77, to: 106, lines: [C2_LINE], lineY: [383], left: (f) => 960 - C2W / 2 + C2X(f), w: C2W,
    box: (f) => [960 - C2W / 2 + C2X(f) - C2PAD(f), 960 + C2W / 2 + C2X(f) + C2PAD(f)], top: 320, bottom: 443,
    dim: (f) => (f >= 105 ? [0.55, 0.55, 0.45] : f >= 104 ? [0.65, 0.65, 0.6] : f >= 103 ? [0.8, 0.8, 0.8] : [1, 1, 1]),
  },
  {
    from: 106, to: 131, lines: [C3_LINE], lineY: [686], left: (f) => 998 + C3X(f), w: C3W,
    box: (f) => [998 + C3X(f) - 62 - C3E(f), 998 + C3X(f) + C3W + 62 + C3E(f)], top: 620, bottom: 744,
    dim: () => [1, 1, 1],
  },
];
const Corners: React.FC<{l: number; r: number; t: number; b: number; col: string; colL: string}> = ({l, r, t, b, col, colL}) => {
  const a = 12, s = 2;
  const L = (x: number, y: number, sx: number, sy: number, c: string, k: string) => (
    <React.Fragment key={k}>
      <div style={{position: 'absolute', left: sx > 0 ? x : x - a, top: y - (sy > 0 ? 0 : s), width: a, height: s, background: c}} />
      <div style={{position: 'absolute', left: x - (sx > 0 ? 0 : s), top: sy > 0 ? y : y - a, width: s, height: a, background: c}} />
    </React.Fragment>
  );
  return <>{[L(l, t, 1, 1, colL, 'tl'), L(r, t, -1, 1, col, 'tr'), L(l, b, 1, -1, colL, 'bl'), L(r, b, -1, -1, col, 'br')]}</>;
};
const Captions: React.FC<{f: number}> = ({f}) => {
  const cap = CAPS.find((c) => f >= c.from && f < c.to);
  if (!cap) return null;
  const [dw, dg, dl] = cap.dim(f);
  const [bl, br] = cap.box(f);
  const white = g(dw);
  const green = `rgb(${CAP_GREEN.map((v) => Math.round(v * dg)).join(',')})`;
  const corner = g(0.74 * dw);
  return (
    <AbsoluteFill>
      <Corners l={bl} r={br} t={cap.top} b={cap.bottom} col={corner} colL={g(0.74 * dl)} />
      {cap.lines.map((line, li) => (
        <div key={li} style={{position: 'absolute', left: cap.left(f), top: cap.lineY[li] - FS * 0.7, height: FS * 1.4, lineHeight: `${FS * 1.4}px`, display: 'flex', whiteSpace: 'pre', fontFamily: SANS, fontSize: FS, fontWeight: 400, letterSpacing: '0.01em'}}>
          {line.filter((c) => f >= c.at).map((c, ci) => (
            <span key={ci} style={{marginLeft: ci > 0 && f === c.at ? 16 : 0, color: c.green ? green : white}}>{c.t}</span>
          ))}
        </div>
      ))}
    </AbsoluteFill>
  );
};

// ───────── HUD：画面边缘的十字和 ▱▱▱▱（片子自己的设计）─────────
const Para: React.FC<{cx: number; cy: number; mode: 'o' | 'w' | 'h'}> = ({cx, cy, mode}) => {
  const w = 19, h = 15, sk = 6, gap = 26;
  return (
    <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
      <defs>
        <pattern id="hudh" patternUnits="userSpaceOnUse" width={6} height={6} patternTransform="rotate(45)">
          <line x1={0} y1={0} x2={0} y2={6} stroke="#9a9a9a" strokeWidth={2} />
        </pattern>
      </defs>
      {[0, 1, 2, 3].map((i) => {
        const x = cx - 2 * gap + i * gap + 3;
        const pts = `${x + sk},${cy - h / 2} ${x + w + sk},${cy - h / 2} ${x + w},${cy + h / 2} ${x},${cy + h / 2}`;
        return <polygon key={i} points={pts} fill={mode === 'w' ? '#fff' : mode === 'h' ? 'url(#hudh)' : 'none'} stroke={mode === 'w' ? '#fff' : '#808080'} strokeWidth={2} />;
      })}
    </svg>
  );
};
const Cross: React.FC<{x: number; y: number}> = ({x, y}) => (
  <>
    <div style={{position: 'absolute', left: X(x) - 8, top: Y(y) - 1, width: 16, height: 2, background: '#6e6e6e'}} />
    <div style={{position: 'absolute', left: X(x) - 1, top: Y(y) - 8, width: 2, height: 16, background: '#6e6e6e'}} />
  </>
);
const Hud: React.FC<{f: number}> = ({f}) => {
  const items: React.ReactNode[] = [];
  const crosses: [number, number][] = [];
  if (f < 43) {
    if (f >= 30) crosses.push([98.8, 50]);
    if (f >= 33) crosses.push([97.5, 3.5], [97.5, 96.5]);
    if (f >= 36) crosses.push([1.2, 50]);
    if (f >= 40) crosses.push([1.2, 96.5]);
    const bot = f === 9 || f >= 11 ? 'o' : null;
    if (bot) items.push(<Para key="b" cx={960} cy={Y(98.6)} mode={bot as 'o' | 'h'} />);
    if (f >= 18 && f < 21) items.push(<Para key="b2" cx={960} cy={Y(96.7)} mode="o" />);
    if (f >= 21 && f < 32) items.push(<Para key="bw" cx={960} cy={Y(96.5)} mode="w" />);
    if (f >= 32) items.push(<Para key="t" cx={960} cy={Y(1.6)} mode={f < 34 ? 'h' : 'o'} />);
  } else {
    crosses.push([1.2, 50], [98.6, 50], [1.2, 96.6], [98.6, 96.6], [98.6, 3.4]);
    items.push(<Para key="t" cx={960} cy={Y(1.8)} mode="o" />, <Para key="b" cx={960} cy={Y(98.2)} mode="o" />);
    if (f >= 113) items.push(<Para key="t2" cx={960} cy={Y(3.7)} mode="o" />);
  }
  return (
    <AbsoluteFill>
      {crosses.map(([x, y], i) => <Cross key={i} x={x} y={y} />)}
      {items}
    </AbsoluteFill>
  );
};

// ───────── 1 帧块状马赛克（f43）：新场景打底，旧场景按网格对齐的几块矩形压上去（变暗、个别错位）─────────
const MOSAIC_OLD: [number, number, number, number, number, number][] = [
  // [x0%, y0%, x1%, y1%, 亮度, 横向错位px]
  [0, 13, 44, 40, 0.6, -115],
  [44, 13, 66.7, 40, 0.55, 0],
  [40, 40, 66.7, 57, 0.45, -120],
  [33.3, 57, 100, 100, 0.65, 0],
  [0, 57, 33.3, 100, 0.7, 0],
];
const Mosaic: React.FC = () => (
  <AbsoluteFill>
    <SceneB f={43} />
    {MOSAIC_OLD.map(([x0, y0, x1, y1, b, off], i) => (
      <div key={i} style={{position: 'absolute', left: X(x0), top: Y(y0), width: X(x1 - x0), height: Y(y1 - y0), overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: -X(x0) + off, top: -Y(y0), width: W, height: H, filter: `brightness(${b})`}}>
          <SceneA f={43} hideDot />
        </div>
      </div>
    ))}
    {/* 新场景的绿点压在最上面（正好落在标签 1 上） */}
    <div style={{position: 'absolute', left: X(7) - 12, top: Y(25.2) - 12, width: 24, height: 24, borderRadius: '50%', background: GREEN}} />
  </AbsoluteFill>
);

export const TrailDotCaptions: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {f < 43 ? <SceneA f={f} /> : f === 43 ? <Mosaic /> : <SceneB f={f} />}
      <Hud f={f} />
    </AbsoluteFill>
  );
};

