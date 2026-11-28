// 【镜头组】grid-route-search：斜俯视的格子地图上，一道蓝色"彗星线"沿着格子从左边冲进来、拐弯往上到第一个地点，
//   身后的格子一格格亮起蓝色、留下一道细白线 → 镜头转正成俯视 → 换成紫粉色的彗星线从第一个地点往右、拐两个弯到第二个地点 →
//   镜头扎近，线头鼓成一个粉色长胶囊、变成白底紫边的搜索框，框里打出"搜索目的地…" → 搜索框缩小、往后一翻（021-E 一拍，功能演示）
// 学的动作（mnowakdesign · Roamly 9.267–16.133s，30fps 逐帧量过；时间表 （内部拆片记录，未随项目提供））：
//   地图是一个平面，镜头用逐帧整图 ECC 同形配准量四角（track.ts，平面坐标 = 原片 11.6s 正俯视那一帧）；
//   线头沿路线走的距离逐帧量（第一段 9.27–10.95，第二段 11.3–13.7），格子 77px；搜索框的四角逐帧量（14.2–16.13）。
// 我们的内容：「小周」周末出行：家（望京）→ 奥森公园 → 古北水镇；搜索框"搜索目的地…"。
//
// 拍表（源秒 = 原片秒 − 9.267，30fps，共 207 帧）
//   拍 1 蓝线进来     0.00–1.73   斜俯视、线冲进来拐上去
//   拍 2 转正、换线   1.73–4.43   镜头转正（停留点 2.35），紫粉线往右拐到第二个地点
//   拍 3 变搜索框     4.43–5.90   扎近、线头变搜索框、打字（停留点 6.00）
//   拍 4 翻走         6.10–6.867  缩小、往后翻
// 毛病清单：
//   - 通用：画面永远不停（停留时整体极慢推近）；--hq 渲染；确定性
//   - 独有 1：线、格子、地名牌都在地图平面上（跟着透视走），地名牌离线头越远越虚（景深）
//   - 独有 2：搜索框就是线头变的（同一个东西鼓起来），不是新冒出来的
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {FONT, Grain} from '../../../assets/lib/helpers/polish';
import {GroupContract, checkContract, checkInputs, outputDuration, planExtras, toSource} from '../../../assets/lib/helpers/groupClock';
import {E_CORNERS, E_F0} from './track';

const FPS = 30;
const SANS = `"PingFang SC", "Noto Sans CJK SC", "Noto Sans SC", ${FONT.sans}`;
const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const mix = (a: number, b: number, k: number) => a + (b - a) * k;
const kfl = (t: number, K: number[][]) => { if (t <= K[0][0]) return K[0][1]; for (let i = 0; i < K.length - 1; i++) if (t <= K[i + 1][0]) return mix(K[i][1], K[i + 1][1], (t - K[i][0]) / (K[i + 1][0] - K[i][0])); return K[K.length - 1][1]; };
const T0 = 278 / 30;

export const GRID_ROUTE_SEARCH_CONTRACT: GroupContract = {
  sourceDuration: 207 / 30,
  fps: 30,
  motion: [[0, 2.3], [2.4, 5.95], [6.05, 207 / 30]],
  holds: [{at: 2.35, maxExtra: 1.2}, {at: 6.0, maxExtra: 1.5}],
  landmarks: {route1: 0, arrive1: 1.68, top: 2.33, route2: 2.03, turn: 3.13, arrive2: 4.43, pill: 5.0, box: 5.27, type: 5.4, flip: 6.6, exit: 207 / 30},
  sfx: [
    {at: 'route1', type: '电流', note: '电流 / 划线 whoosh（蓝线冲进来）', tail: 0.6, volume: 0.35},
    {at: 'arrive1', type: '弹出', note: '轻 blip（到达）', volume: 0.3},
    {at: 'route2', type: '电流', note: '划线 whoosh', tail: 0.5, volume: 0.3},
    {at: 'arrive2', type: '弹出', note: '轻 blip（到达）', volume: 0.3},
    {at: 'box', type: '弹出', note: '柔和 pop（变成搜索框）', volume: 0.3},
    {at: 'type', type: '键盘', note: '打字 tick', tail: 0.5, volume: 0.25},
    {at: 'flip', type: '短甩', note: '轻 swoosh（翻走）', volume: 0.3},
  ],
  inputs: {home: {maxChars: 5}, stop1: {maxChars: 5}, stop2: {maxChars: 5}, search: {maxChars: 7}, other: {count: 3, maxChars: 5}},
};

export type RouteInputs = {home: string; stop1: string; stop2: string; search: string; other: string[]};
export const ROUTE_DEFAULT_INPUTS: RouteInputs = {home: '望京 · 家', stop1: '奥森公园', stop2: '古北水镇', search: '搜索目的地…', other: ['颐和园', '798园区', '后海']};
export const checkRouteInputs = (x: RouteInputs) => checkInputs(GRID_ROUTE_SEARCH_CONTRACT, {...x, home: x.home.replace(/[\s·]/g, '')});
export const planRoute = (sec: number) => planExtras(GRID_ROUTE_SEARCH_CONTRACT, sec);
export const routeFrames = (extras: number[]) => Math.round(outputDuration(GRID_ROUTE_SEARCH_CONTRACT, extras) * FPS);
export const GRID_ROUTE_SEARCH_DURATION = 207;

// ── 同形变换：平面四角 → 画面（720p）──
const Q = [[0, 0], [1280, 0], [1280, 720], [0, 720]];
const solve = (A: number[][], b: number[]) => {
  const n = b.length; const M = A.map((r, i) => [...r, b[i]]);
  for (let c = 0; c < n; c++) {
    let p = c; for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
    [M[c], M[p]] = [M[p], M[c]];
    for (let r = 0; r < n; r++) if (r !== c) { const f = M[r][c] / M[c][c]; for (let k = c; k <= n; k++) M[r][k] -= f * M[c][k]; }
  }
  return M.map((r, i) => r[n] / r[i]);
};
const homography = (src: number[][], dst: number[]) => {
  const A: number[][] = [], b: number[] = [];
  for (let i = 0; i < 4; i++) { const [x, y] = src[i], u = dst[i * 2], v = dst[i * 2 + 1]; A.push([x, y, 1, 0, 0, 0, -u * x, -u * y]); b.push(u); A.push([0, 0, 0, x, y, 1, -v * x, -v * y]); b.push(v); }
  const h = solve(A, b);
  return `matrix3d(${h[0]},${h[3]},0,${h[6]},${h[1]},${h[4]},0,${h[7]},0,0,1,0,${h[2]},${h[5]},0,1)`;
};
const cornersAt = (n: number) => { const i = clamp(n - E_F0, 0, E_CORNERS.length - 1), i0 = Math.floor(i), i1 = Math.min(E_CORNERS.length - 1, i0 + 1); return E_CORNERS[i0].map((v, j) => mix(v, E_CORNERS[i1][j], i - i0)); };

// ── 路线（平面坐标）：直线 + 四分之一圆弧 ──
type Seg = {a: number[]; b: number[]} | {c: number[]; r: number; a0: number; a1: number};
const mkPath = (segs: Seg[]) => {
  const len = segs.map((s) => ('a' in s ? Math.hypot(s.b[0] - s.a[0], s.b[1] - s.a[1]) : Math.abs(s.a1 - s.a0) * s.r));
  const total = len.reduce((x, y) => x + y, 0);
  const at = (d: number) => {
    let dd = clamp(d, 0, total), i = 0;
    while (i < segs.length - 1 && dd > len[i]) { dd -= len[i]; i++; }
    const s = segs[i], k = len[i] ? dd / len[i] : 0;
    if ('a' in s) return [mix(s.a[0], s.b[0], k), mix(s.a[1], s.b[1], k)];
    const ang = mix(s.a0, s.a1, k); return [s.c[0] + s.r * Math.cos(ang), s.c[1] + s.r * Math.sin(ang)];
  };
  return {at, total};
};
const P1 = mkPath([{a: [-80, 551], b: [453, 551]}, {c: [453, 513], r: 38, a0: Math.PI / 2, a1: 0}, {a: [491, 513], b: [491, 290]}, {c: [536, 290], r: 45, a0: Math.PI, a1: Math.PI * 1.5}, {a: [536, 245], b: [548, 245]}]);
const P2 = mkPath([{a: [630, 243], b: [950, 243]}, {c: [950, 203], r: 40, a0: Math.PI / 2, a1: 0}, {a: [990, 203], b: [990, 152]}, {c: [1030, 152], r: 40, a0: Math.PI, a1: Math.PI * 1.5}, {a: [1030, 112], b: [1121, 112]}]);
// 线头走的距离（原片秒）
// 路线头弧长（平面 px）：逐帧把原片青色路线头的尖反投影回平面量（尖正好落在 y=551 的路线上，说明镜头对了）
const D1 = [[9.27, 80], [9.5, 219], [9.6, 266], [9.7, 313], [9.8, 359], [9.9, 407], [10.0, 461], [10.067, 494], [10.133, 528], [10.2, 592], [10.267, 622], [10.333, 656], [10.4, 687], [10.467, 717], [10.533, 751], [10.6, 777], [10.667, 808], [10.733, 841], [10.8, 878], [10.87, 895]];
const D2 = [[11.0, 0], [11.27, 85], [11.5, 147], [11.6, 174], [11.8, 228], [12.0, 277], [12.2, 324], [12.4, 383], [12.6, 426], [12.8, 474], [13.0, 500], [13.1, 516], [13.3, 547], [13.5, 570], [13.7, 588]];
const C2 = [[11.0, 170, 135, 245], [11.5, 180, 120, 240], [12.4, 205, 60, 212], [13.0, 210, 40, 200], [13.6, 225, 15, 190]];
// 亮起的格子（平面左上角）与对应线头距离
const CELLS1 = [[68, 512, 150], [145, 512, 230], [222, 512, 300], [299, 512, 370], [376, 512, 430], [453, 512, 480], [453, 435, 560], [453, 358, 630], [453, 282, 700], [453, 205, 750]];
const CELLS2 = [[530, 205, 150], [607, 205, 200], [684, 205, 260], [761, 205, 320], [838, 205, 370], [915, 205, 400], [915, 128, 450], [992, 51, 520], [1069, 51, 575]];
// 地名牌（平面中心）
const LABELS = (inp: RouteInputs) => [
  {x: 222, y: 370, t: inp.home, glow: 'rgba(240,120,170,0.35)'}, {x: 573, y: 236, t: inp.stop1, glow: 'rgba(170,120,255,0.35)'}, {x: 990, y: 47, t: inp.stop2, glow: 'rgba(240,120,170,0.35)'},
  {x: 455, y: 58, t: inp.other[0] ?? '', glow: 'rgba(240,120,170,0.3)'}, {x: 925, y: 587, t: inp.other[1] ?? '', glow: 'rgba(240,120,170,0.3)'}, {x: 1215, y: 463, t: inp.other[2] ?? '', glow: 'rgba(240,120,170,0.3)'},
];
// 搜索框（画面 720p）：左、右、上、下；最后 5 帧单独给四角（往后翻）
const BOX = [[14.2, 436, 472, 320, 344], [14.267, 420, 545, 312, 355], [14.333, 330, 721, 306, 378], [14.4, 267, 853, 307, 387], [14.467, 242, 945, 304, 395], [14.533, 220, 1005, 302, 403], [14.6, 200, 1049, 302, 409], [14.667, 188, 1079, 300, 415], [14.733, 182, 1101, 298, 420], [14.8, 174, 1113, 297, 425], [14.867, 168, 1119, 296, 427], [14.933, 168, 1119, 298, 429], [15.0, 170, 1113, 300, 431], [15.067, 176, 1103, 302, 431], [15.133, 190, 1083, 306, 429], [15.2, 212, 1053, 310, 425], [15.267, 246, 1015, 314, 421], [15.333, 276, 983, 318, 416], [15.4, 298, 960, 322, 413], [15.467, 312, 945, 323, 411], [15.533, 322, 933, 324, 409], [15.6, 329, 926, 326, 407], [15.667, 334, 920, 326, 407], [15.733, 336, 915, 325, 408], [15.8, 338, 910, 324, 409], [15.867, 340, 906, 323, 411]];
const FLIP = [[15.867, 344, 323, 906, 323, 906, 411, 344, 411], [15.933, 345, 335, 902, 322, 902, 400, 345, 410], [16.0, 345, 350, 899, 322, 899, 376, 345, 405], [16.067, 344, 365, 893, 328, 893, 367, 344, 404], [16.133, 344, 383, 890, 338, 890, 355, 344, 402]];

export const GridRouteSearchGroup: React.FC<{inputs?: RouteInputs; extras?: number[]}> = ({inputs = ROUTE_DEFAULT_INPUTS, extras = [0, 0]}) => {
  const t = useCurrentFrame() / FPS;
  const s = toSource(t, GRID_ROUTE_SEARCH_CONTRACT, extras) + T0; // 原片秒
  const lag = t - (s - T0);
  const n = s * 30;
  const cam = 1 + 0.004 * lag;

  // ── 地图平面 ──
  const mapOp = 1 - clamp((s - 14.45) / 0.4);
  const M = homography(Q, cornersAt(Math.min(n, 428 + (n - 428) * 0.3)));
  // 原片推得很近时网格线还是细的：按镜头放大倍数把线宽收回来
  const cz = cornersAt(Math.min(n, 428 + (n - 428) * 0.3));
  const zoomK = Math.hypot(cz[2] - cz[0], cz[3] - cz[1]) / 1280;
  const gridW = 1.2 / Math.max(1, Math.pow(zoomK, 0.85));
  const whip = s > 9.5 && s < 9.95 ? Math.sin(Math.PI * clamp((s - 9.5) / 0.45)) * 3 : 0;
  const d1 = kfl(s, D1), d2 = kfl(s, D2);
  const head1 = P1.at(d1), head2 = P2.at(d2);
  const focus = s < 11.0 ? head1 : head2;
  const lines: React.ReactNode[] = [];
  for (let k = -14; k < 34; k++) { const x = 68 + 77 * k; lines.push(<line key={'x' + k} x1={x} y1={-900} x2={x} y2={1700} />); }
  for (let k = -12; k < 22; k++) { const y = 51 + 77 * k; lines.push(<line key={'y' + k} x1={-1100} y1={y} x2={2600} y2={y} />); }
  const comet = (P: ReturnType<typeof mkPath>, d: number, tail: number, rgb: number[], w: number, key: string) => {
    if (d <= 0 || tail <= 0) return null;
    const N = 30, segs: React.ReactNode[] = [];
    for (let k = 0; k < N; k++) {
      const a = P.at(d - tail + (tail * k) / N), b = P.at(d - tail + (tail * (k + 1)) / N);
      segs.push(<line key={k} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={`rgb(${rgb.join(',')})`} strokeOpacity={0.15 + 0.85 * ((k + 1) / N)} strokeWidth={w} strokeLinecap="round" />);
    }
    const h = P.at(d), h0 = P.at(d - 3), ang = (Math.atan2(h[1] - h0[1], h[0] - h0[0]) * 180) / Math.PI;
    return (
      <g key={key}>
        <g filter="url(#grs-glow)" opacity={0.7}>{segs}</g>
        {segs}
        <rect x={-14} y={-9} width={28} height={18} rx={9} fill={`rgb(${rgb.map((v) => Math.round(v * 0.85)).join(',')})`} transform={`translate(${h[0]},${h[1]}) rotate(${ang})`} />
      </g>
    );
  };
  const tail1 = s < 10.85 ? 210 : 210 * (1 - clamp((s - 10.85) / 0.25));
  const tail2 = s < 13.7 ? 150 : mix(150, 70, clamp((s - 13.7) / 0.5));
  const c2 = [1, 2, 3].map((j) => kfl(s, C2.map((c) => [c[0], c[j]])));
  // lag：原片的蓝格子比路线头晚才亮起（第一段约 140px，第二段约 60px，都是路线头离开那一格之后）
  const cell = (x: number, y: number, dPass0: number, d: number, tPass: number, key: string, lag = 0) => {
    const dPass = dPass0 + lag;
    const lifeK = 0.8;
    if (d < dPass) return null;
    const age = s - tPass;
    const op = clamp((d - dPass) / 60) * (age > lifeK ? Math.max(0, 1 - (age - lifeK) / 0.5) : 1);
    if (op <= 0.01) return null;
    const fresh = clamp(1 - (d - dPass) / 200);
    return <rect key={key} x={x} y={y} width={77} height={77} fill={`rgb(${Math.round(mix(205, 140, fresh))},${Math.round(mix(220, 175, fresh))},${Math.round(mix(250, 245, fresh))})`} opacity={op} />;
  };
  // 每个格子被经过的时刻（反查 D1/D2）
  const tOf = (D: number[][], dd: number) => { for (let i = 0; i < D.length - 1; i++) if (dd <= D[i + 1][1]) return mix(D[i][0], D[i + 1][0], (dd - D[i][1]) / (D[i + 1][1] - D[i][1])); return D[D.length - 1][0]; };
  const trail = (P: ReturnType<typeof mkPath>, from: number, to: number) => { const pts: string[] = []; for (let k = 0; k <= 40; k++) { const p = P.at(mix(from, to, k / 40)); pts.push(`${p[0]},${p[1]}`); } return pts.join(' '); };

  const labels = LABELS(inputs).map((L, i) => {
    const dist = Math.hypot(L.x - focus[0], L.y - focus[1]);
    const blur = clamp((dist - 220) / 400) * 3.2;
    const show = i === 1 ? clamp((d1 - 600) / 120) : i === 2 ? clamp((s - 11.9) / 0.4) : clamp((s - 9.7) / 0.5);
    const fs = 21;
    const w = Array.from(L.t).reduce((a, c) => a + (/[\x00-\x7f]/.test(c) ? 0.56 : 1) * fs, 0) + 34;
    return <div key={i} style={{position: 'absolute', left: L.x - w / 2, top: L.y - 22, width: w, height: 44, borderRadius: 22, background: '#fff', boxShadow: `0 0 0 1px rgba(235,235,240,0.9), 0 6px 24px ${L.glow}, 0 0 40px ${L.glow}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: fs, color: '#3d3f47', whiteSpace: 'nowrap', opacity: show, filter: blur > 0.2 ? `blur(${blur}px)` : undefined}}>{L.t}</div>;
  });

  const map = mapOp > 0 && (
    <div style={{position: 'absolute', left: 0, top: 0, width: 1280 * 3, height: 720 * 3, transformOrigin: '0 0', transform: `${M} scale(${1 / 3})`, opacity: mapOp, filter: whip > 0.2 ? `blur(${whip}px)` : undefined}}>
      <div style={{zoom: 3, position: 'absolute', left: 0, top: 0, width: 1280, height: 720}}>
        <svg width={1280} height={720} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
          <defs><filter id="grs-glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="9" /></filter></defs>
          {CELLS1.map(([x, y, dp], i) => cell(x, y, dp, d1, tOf(D1, dp + 140), 'a' + i, 140))}
          {s > 11.0 && CELLS2.map(([x, y, dp], i) => cell(x, y, dp, d2, tOf(D2, dp + 60), 'b' + i, 60))}
          <g stroke="#e3e3e8" strokeWidth={gridW}>{lines}</g>
          {[0, 1, 2, 3, 4].map((i) => [0, 1, 2].map((j) => <circle key={i + '-' + j} cx={170 + 260 * i} cy={262 + 258 * j} r={2} fill="#c9c9d0" />))}
          {/* 走过之后留下的细白线 */}
          {d1 > 240 && <polyline points={trail(P1, 0, d1 - 200)} fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" opacity={1 - clamp((s - 12.2) / 0.4)} />}
          {d2 > 200 && <polyline points={trail(P2, 0, d2 - 140)} fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" />}
          {s < 11.1 && comet(P1, d1, tail1, [100, 200, 246], 11, 'c1')}
          {s >= 11.0 && s < 14.27 && comet(P2, d2, tail2, c2, 9, 'c2')}
        </svg>
        {labels}
      </div>
    </div>
  );

  // ── 线头 → 胶囊 → 搜索框（画面坐标）──
  let box: React.ReactNode = null;
  if (s >= 14.2) {
    const k = [1, 2, 3, 4].map((j) => kfl(s, BOX.map((b) => [b[0], b[j]])));
    let corners = [k[0], k[2], k[1], k[2], k[1], k[3], k[0], k[3]];
    if (s > 15.867) corners = [1, 2, 3, 4, 5, 6, 7, 8].map((j) => kfl(s, FLIP.map((f) => [f[0], f[j]])));
    const W = 900, Hh = 100; // 框按固定尺寸排版，再用同形变换贴到量出来的四角
    const Mb = homography([[0, 0], [W, 0], [W, Hh], [0, Hh]], corners);
    const white = clamp((s - 14.4) / 0.13), border = clamp((s - 14.38) / 0.1);
    const fade = 1 - clamp((s - 16.08) / 0.05);
    const chars = Array.from(inputs.search);
    const nTyped = Math.floor(clamp((s - 14.63) / 0.75) * chars.length);
    const textBlur = clamp(1 - (s - 14.63) / 0.6) * 3;
    box = (
      <div style={{position: 'absolute', left: 0, top: 0, width: W, height: Hh, transformOrigin: '0 0', transform: Mb, opacity: fade}}>
        <div style={{position: 'absolute', inset: 0, borderRadius: Hh / 2, background: `rgb(${Math.round(mix(238, 254, white))},${Math.round(mix(150, 252, white))},${Math.round(mix(215, 255, white))})`, boxShadow: `inset 0 0 0 ${mix(0, 5, border)}px rgba(120,95,230,${border}), 0 0 ${mix(30, 10, white)}px rgba(230,120,210,${0.5 * (1 - white)})`}} />
        {s > 14.6 && (
          <div style={{position: 'absolute', left: 52, top: 0, height: Hh, display: 'flex', alignItems: 'center', gap: 20, fontFamily: SANS, fontSize: 40, color: '#8a8d96', filter: textBlur > 0.2 ? `blur(${textBlur}px)` : undefined}}>
            <svg width={38} height={38} viewBox="0 0 24 24" fill="none" stroke="#777" strokeWidth={2.2} strokeLinecap="round"><circle cx="11" cy="11" r="6" /><path d="M20 20l-4.5-4.5" /></svg>
            <span style={{display: 'inline-block', width: 3, height: 44, background: '#333', opacity: Math.floor(s * 4) % 2 ? 1 : 0.2}} />
            <span>{chars.slice(0, nTyped).join('')}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <AbsoluteFill style={{background: '#fff', overflow: 'hidden', fontFamily: SANS}}>
      <div style={{position: 'absolute', inset: 0, transform: `scale(${cam})`, transformOrigin: '960px 540px'}}>
        <div style={{position: 'absolute', left: 0, top: 0, width: 1280, height: 720, transform: 'scale(1.5)', transformOrigin: '0 0'}}>
          {map}
          {box}
        </div>
      </div>
      <Grain opacity={0.02} blend="multiply" />
    </AbsoluteFill>
  );
};

if (checkContract(GRID_ROUTE_SEARCH_CONTRACT).length) throw new Error(checkContract(GRID_ROUTE_SEARCH_CONTRACT).join('；'));
export const GridRouteSearch: React.FC = () => <GridRouteSearchGroup />;
