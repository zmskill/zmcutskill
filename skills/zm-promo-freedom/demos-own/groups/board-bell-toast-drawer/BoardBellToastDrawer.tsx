// 【镜头组】board-bell-toast-drawer：任务板从下面升上来 → 镜头猛推到右上角的铃铛和头像 → 铃铛亮红点、红点掉下来变成白色小胶囊、
//   往左撑开成一张通知卡 → 镜头拉回 → 表格上面插进来一组"待开始（1）"（先虚后实）→ 镜头斜着压过去看这一行 → 回正 →
//   右边滑出这条任务的详情、后面变暗 → 收回 → 表格横着往左滑、镜头微推（接 018-F）（018-E 一拍，功能演示）
// 学的动作（HSAji · Tonomo 20.50–29.60s，30fps 逐帧量过；时间表 （内部拆片记录，未随项目提供））：
//   镜头按"头像在画面上的位置 + 放大倍数"逐帧量（头像直径 39 → 107，放大 2.74 倍，0.47 秒推到位，指数缓出）；
//   通知卡在页面坐标里（跟着镜头走）：红点从铃铛右上角掉下 57px → 缩小变白 → 小胶囊往左撑开成 193×80 的卡片 → 0.2 秒后出字；
//   详情面板 0.43 秒从右滑到 x=932、停 1 秒、0.3 秒滑出；最后表格自己横滑（表头、筛选条不动），镜头同时推近 1.135 倍。
// 我们的内容：「小周」全家任务板，奶奶新加了一条"花家地小学 东门 校车站"接送任务。
//
// 拍表（源秒 = 原片秒 − 20.50，30fps，共 273 帧）
//   拍 1 升上来      0.00–0.60   整页从下往上升到位
//   拍 2 推到铃铛    0.60–1.20   镜头推近 2.74 倍
//   拍 3 通知        1.20–3.50   红点 → 掉落 → 小胶囊 → 卡片 → 出字（停留点 2.90）；3.40 字先淡
//   拍 4 拉回 + 插入 3.50–4.70   镜头拉回；4.25 下面让位，4.40 新的一组先虚后实（停留点 4.75）
//   拍 5 斜看这一行  4.95–6.25   斜着压近、停、回正
//   拍 6 详情        6.50–8.25   右边滑出详情，后面变暗（停留点 7.40）；滑回
//   拍 7 横滑        8.30–9.10   表格横滑、镜头微推，接下一镜
// 毛病清单：
//   - 通用：画面永远不停（停留时整体极慢推近）；--hq 渲染；确定性
//   - 独有 1：通知卡是"同一个东西变形"：红点 → 白点 → 胶囊 → 卡片，不是淡入
//   - 独有 2：最后横滑的是表格本身，表头上面的筛选条、标题不跟着滑
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Grain} from '../../../assets/lib/helpers/polish';
import {GroupContract, checkContract, checkInputs, outputDuration, planExtras, toSource} from '../../../assets/lib/helpers/groupClock';
import {HeroBg, HeroBoard, NEW_ROW, TaskDrawer, Toast} from '../_kit/familyBoard';
import {E_F0, E_TILT} from './tilt';

const FPS = 30;
const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const mix = (a: number, b: number, k: number) => a + (b - a) * k;
const eo = (t: number, a: number, b: number) => { const c = clamp((t - a) / (b - a)); return 1 - Math.pow(1 - c, 3); };
const eio = (t: number, a: number, b: number) => { const c = clamp((t - a) / (b - a)); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };
const kf = (t: number, K: number[][]) => {
  const n = K.length;
  if (t <= K[0][0]) return K[0][1];
  if (t >= K[n - 1][0]) return K[n - 1][1];
  const d: number[] = [], m: number[] = [];
  for (let i = 0; i < n - 1; i++) d.push((K[i + 1][1] - K[i][1]) / (K[i + 1][0] - K[i][0]));
  m.push(d[0]);
  for (let i = 1; i < n - 1; i++) m.push(d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2);
  m.push(d[n - 2]);
  for (let i = 0; i < n - 1; i++) {
    if (d[i] === 0) { m[i] = 0; m[i + 1] = 0; continue; }
    const a = m[i] / d[i], b = m[i + 1] / d[i], h = a * a + b * b;
    if (h > 9) { const q = 3 / Math.sqrt(h); m[i] = q * a * d[i]; m[i + 1] = q * b * d[i]; }
  }
  let i = 0; while (t > K[i + 1][0]) i++;
  const h = K[i + 1][0] - K[i][0], u = (t - K[i][0]) / h, u2 = u * u, u3 = u2 * u;
  return (2 * u3 - 3 * u2 + 1) * K[i][1] + (u3 - 2 * u2 + u) * h * m[i] + (-2 * u3 + 3 * u2) * K[i + 1][1] + (u3 - u2) * h * m[i + 1];
};

export const BOARD_BELL_TOAST_DRAWER_CONTRACT: GroupContract = {
  sourceDuration: 273 / 30, // 9.1s
  fps: 30,
  motion: [[0, 2.85], [2.95, 4.7], [4.8, 7.35], [7.45, 273 / 30]],
  holds: [{at: 2.9, maxExtra: 1.5}, {at: 4.75, maxExtra: 1.2}, {at: 7.4, maxExtra: 2.0}],
  landmarks: {rise: 0, push: 0.6, badge: 1.2, drop: 1.7, toast: 2.1, pull: 3.5, insert: 4.4, tilt: 4.95, drawer: 6.5, close: 7.95, slide: 8.3, exit: 273 / 30},
  sfx: [
    {at: 'push', type: '运镜', note: '快速推镜 whoosh', tail: 0.3, volume: 0.35},
    {at: 'badge', type: '提示音', note: '通知提示音（叮）', volume: 0.45},
    {at: 'toast', type: '弹出', note: '柔和弹出 pop', volume: 0.3},
    {at: 'pull', type: '运镜', note: 'whoosh 拉回', volume: 0.3},
    {at: 'insert', type: '点击', note: '轻 click（插入一行）', volume: 0.3},
    {at: 'drawer', type: '短甩', note: '面板滑出 swoosh', tail: 0.3, volume: 0.35},
    {at: 'close', type: '短甩', note: '面板收回 swoosh（短）', volume: 0.3},
  ],
  inputs: {toastTitle: {maxChars: 8}, toastSub: {maxChars: 14}},
};

export type BellInputs = {toastTitle: string; toastSub: string};
export const BELL_DEFAULT_INPUTS: BellInputs = {toastTitle: '收到新任务', toastSub: '奶奶 · 任务 #06868'};
export const checkBellInputs = (x: BellInputs) => checkInputs(BOARD_BELL_TOAST_DRAWER_CONTRACT, x);
export const planBell = (sec: number) => planExtras(BOARD_BELL_TOAST_DRAWER_CONTRACT, sec);
export const bellFrames = (extras: number[]) => Math.round(outputDuration(BOARD_BELL_TOAST_DRAWER_CONTRACT, extras) * FPS);
export const BOARD_BELL_TOAST_DRAWER_DURATION = 273;

// 镜头：头像在画面上的位置 + 放大倍数（原片逐帧量）
const AV_X = [[0, 1584], [0.5, 1583], [0.6, 1574], [0.7, 1548], [0.733, 1529], [0.767, 1496], [0.8, 1447], [0.833, 1379], [0.867, 1305], [0.9, 1233], [0.933, 1169], [0.967, 1114], [1.0, 1068], [1.033, 1033], [1.067, 1006], [1.1, 988], [1.133, 979], [1.167, 975], [3.5, 975], [3.567, 1001], [3.633, 1037], [3.7, 1093], [3.767, 1177], [3.833, 1311], [3.9, 1477], [3.967, 1532], [4.033, 1554], [4.1, 1566], [4.167, 1573], [4.233, 1578], [4.3, 1582], [4.433, 1586], [8.3, 1585], [8.433, 1586], [8.567, 1591], [8.7, 1604], [8.833, 1616], [9.033, 1634], [9.1, 1641]];
const AV_Y = [[0, 444], [0.1, 321], [0.2, 233], [0.3, 180], [0.4, 149], [0.5, 134], [0.6, 130], [0.7, 143], [0.733, 153], [0.767, 168], [0.8, 192], [0.833, 224], [0.867, 257], [0.9, 290], [0.933, 318], [0.967, 343], [1.0, 359], [1.033, 378], [1.067, 386], [1.1, 397], [1.133, 401], [1.167, 403], [1.2, 401], [3.5, 401], [3.567, 391], [3.633, 376], [3.7, 353], [3.767, 317], [3.833, 258], [3.9, 182], [3.967, 154], [4.033, 145], [4.1, 139], [4.167, 134], [4.233, 131], [4.3, 129], [4.433, 127], [8.3, 122], [8.433, 120], [8.567, 117], [8.7, 108], [8.833, 99], [9.033, 88], [9.1, 84]];
const ZOOM = [[0, 1], [0.5, 1], [0.6, 1.05], [0.7, 1.154], [0.733, 1.23], [0.767, 1.41], [0.8, 1.59], [0.833, 1.79], [0.867, 2.0], [0.9, 2.18], [0.933, 2.33], [0.967, 2.49], [1.0, 2.59], [1.033, 2.67], [1.067, 2.7], [1.1, 2.74], [3.5, 2.74], [3.567, 2.73], [3.633, 2.67], [3.7, 2.51], [3.767, 2.36], [3.833, 1.97], [3.9, 1.46], [3.967, 1.26], [4.033, 1.13], [4.1, 1.08], [4.167, 1.03], [4.233, 1.01], [4.3, 1.0], [8.3, 1.0], [8.567, 1.03], [8.7, 1.06], [8.833, 1.08], [9.033, 1.135], [9.1, 1.15]];
const DRAWER_X = [[6.5, 1920], [6.667, 1120], [6.8, 1000], [6.933, 932], [7.95, 932], [8.0, 990], [8.083, 1210], [8.167, 1560], [8.25, 1920]];
const TABLE_X = [[8.8, 0], [8.9, -60], [9.0, -250], [9.1, -520]];


// ── 同形变换（整屏四角 → 画面四角）──
const Q4 = [[0, 0], [1920, 0], [1920, 1080], [0, 1080]];
const solve8 = (A: number[][], b: number[]) => {
  const n = b.length; const M = A.map((r, i) => [...r, b[i]]);
  for (let c = 0; c < n; c++) {
    let p = c; for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
    [M[c], M[p]] = [M[p], M[c]];
    for (let r = 0; r < n; r++) if (r !== c) { const f = M[r][c] / M[c][c]; for (let k2 = c; k2 <= n; k2++) M[r][k2] -= f * M[c][k2]; }
  }
  return M.map((r, i) => r[n] / r[i]);
};
const homography = (dst: number[]) => {
  const A: number[][] = [], b: number[] = [];
  for (let i = 0; i < 4; i++) { const [x, y] = Q4[i], u = dst[i * 2], v = dst[i * 2 + 1]; A.push([x, y, 1, 0, 0, 0, -u * x, -u * y]); b.push(u); A.push([0, 0, 0, x, y, 1, -v * x, -v * y]); b.push(v); }
  const h = solve8(A, b);
  return `matrix3d(${h[0]},${h[3]},0,${h[6]},${h[1]},${h[4]},0,${h[7]},0,0,1,0,${h[2]},${h[5]},0,1)`;
};
const tiltAt = (n: number) => { const i = clamp(n - E_F0, 0, E_TILT.length - 1), i0 = Math.floor(i), i1 = Math.min(E_TILT.length - 1, i0 + 1); return E_TILT[i0].map((v, j) => mix(v, E_TILT[i1][j], i - i0)); };

// 通知卡四角（原片画面坐标，帧 688/692/696/700；之后不变）：源秒, TLx, TLy, TRx, TRy, BRx, BRy, BLx, BLy
const TOAST_Q = [
  [2.433, 343, 519, 869, 509, 851, 735, 333, 718],
  [2.567, 345, 524, 869, 510, 868, 735, 342, 725],
  [2.7, 345, 511, 870, 512, 870, 735, 344, 711],
  [2.833, 345, 507, 870, 512, 872, 735, 345, 708],
];
const kfl = (t: number, K: number[][]) => { if (t <= K[0][0]) return K[0][1]; for (let i = 0; i < K.length - 1; i++) if (t <= K[i + 1][0]) return mix(K[i][1], K[i + 1][1], (t - K[i][0]) / (K[i + 1][0] - K[i][0])); return K[K.length - 1][1]; };
// 任意四边形 src → dst 的同形变换（CSS matrix3d，作用在 transformOrigin 0 0 的容器上）
const homographyQ = (src: number[], dst: number[]) => {
  const A: number[][] = [], b: number[] = [];
  for (let i = 0; i < 4; i++) { const x = src[i * 2], y = src[i * 2 + 1], u = dst[i * 2], v = dst[i * 2 + 1]; A.push([x, y, 1, 0, 0, 0, -u * x, -u * y]); b.push(u); A.push([0, 0, 0, x, y, 1, -v * x, -v * y]); b.push(v); }
  const h = solve8(A, b);
  return `matrix3d(${h[0]},${h[3]},0,${h[6]},${h[1]},${h[4]},0,${h[7]},0,0,1,0,${h[2]},${h[5]},0,1)`;
};

export const BoardBellToastDrawerGroup: React.FC<{inputs?: BellInputs; extras?: number[]}> = ({inputs = BELL_DEFAULT_INPUTS, extras = [0, 0, 0]}) => {
  const t = useCurrentFrame() / FPS;
  const s = toSource(t, BOARD_BELL_TOAST_DRAWER_CONTRACT, extras);
  const lag = t - s;
  const z = kf(s, ZOOM) * (1 + 0.004 * lag);
  const ax = kf(s, AV_X), ay = kf(s, AV_Y);
  const tx = ax - 1587 * z, ty = ay - 255 * z; // 头像在页面里的位置 (1587, 255)

  // 铃铛红点 → 掉落 → 变白 → 小胶囊 → 卡片
  const badge = s >= 1.2 && s < 1.72;
  const drop = eio(s, 1.7, 1.82);
  const dotY = mix(244, 301, drop);
  const dotR = s < 1.82 ? 6 : mix(6, 3, clamp((s - 1.82) / 0.1));
  const white = clamp((s - 1.85) / 0.1);
  const dotOn = s >= 1.7 && s < 2.1;
  const grow = eo(s, 2.08, 2.4); // 胶囊往左撑开
  const toastOn = s >= 2.05 && s < 3.62;
  const tw = mix(28, 193, grow), th = mix(10, 80, eo(s, 2.08, 2.3));
  const tRight = 1549;
  const textOp = clamp((s - 2.38) / 0.12) * (1 - clamp((s - 3.38) / 0.1));
  const fadeOut = 1 - clamp((s - 3.48) / 0.12);
  // 通知卡一直是斜着的（左边远、右边近）：原片 2.43–3.43s 逐帧量卡片四角（画面坐标），换算到页面坐标后做同形变换
  const tq = TOAST_Q.map((k) => k[0]);
  const toastCorners = [0, 1, 2, 3, 4, 5, 6, 7].map((j) => kfl(s, TOAST_Q.map((k) => [k[0], (k[1 + j] + (j % 2 ? 297.7 : 3373.4)) / 2.74])));
  const toastM = tq.length ? homographyQ([1356, 296, 1549, 296, 1549, 376, 1356, 376], toastCorners) : undefined;

  // 插入新的一组
  const insert = eo(s, 4.25, 4.36);
  const newBlur = s < 4.4 ? 1 : 1 - eo(s, 4.4, 4.6);
  const counts = s < 4.6 ? [6, 4, 3, 480] : [7, 4, 3, 480];

  // 斜看这一行：斜着压近 → 停 → 回正
  const tn = 615 + s * 30; // 原片帧号
  const tiltM = tn > E_F0 && tn < E_F0 + E_TILT.length - 1 ? homography(tiltAt(tn)) : undefined;
  // 详情
  const dx = kf(s, DRAWER_X);
  const dim = clamp((1920 - dx) / 988) * 0.45;

  const board = (
    <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transform: `translate(${tx}px, ${ty}px) scale(${z})`, transformOrigin: '0 0'}}>
      <HeroBoard insertNew={insert} newBlur={s >= 4.25 ? newBlur : 0} counts={counts} bellDot={badge ? clamp((s - 1.2) / 0.06) : 0} tableX={kf(s, TABLE_X)} newRow={NEW_ROW} />
      {dotOn && <div style={{position: 'absolute', left: 1532 - dotR, top: dotY - dotR, width: dotR * 2, height: dotR * 2, borderRadius: 12, background: `rgb(${Math.round(mix(229, 255, white))},${Math.round(mix(50, 255, white))},${Math.round(mix(62, 255, white))})`}} />}
      {toastOn && (
        <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transformOrigin: '0 0', transform: toastM, opacity: fadeOut}}><div style={{position: 'absolute', left: tRight - tw, top: 296 + (80 - th) * 0.2}}>
          <Toast w={tw} h={th} text={textOp} title={inputs.toastTitle} sub={inputs.toastSub} />
        </div></div>
      )}
    </div>
  );

  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <HeroBg />
      {/* 推近到铃铛时原片背景是另一层：整片 #ddeeff，左下一块深蓝、边界斜 35°、边上一道亮边（照原片 22.83s 逐点取色）；按放大倍数淡入 */}
      <AbsoluteFill style={{opacity: clamp((kf(s, ZOOM) - 1) / 1.5), background: 'linear-gradient(215deg, #ddeeff 0%, #ddeeff 52%, #d3e8fd 57%, #a6cff8 62%, #5aa4f1 67%, #1d84ea 72%, #0b78e7 78%, #0c79e6 100%)'}} />
      {/* 斜看那一下：直接用原片逐帧量出来的整屏同形变换（四角），不再凑旋转角；按 2 倍排版防糊 */}
      <div style={{position: 'absolute', left: 0, top: 0, width: 1920 * 2, height: 1080 * 2, transformOrigin: '0 0', transform: `${tiltM ?? ''} scale(0.5)`}}>
        <div style={{zoom: 2, position: 'absolute', left: 0, top: 0, width: 1920, height: 1080}}>{board}</div>
      </div>
      {dim > 0.001 && <AbsoluteFill style={{background: `rgba(6,24,60,${dim})`}} />}
      {dx < 1919 && <div style={{position: 'absolute', left: dx - 24, top: 0}}><TaskDrawer row={NEW_ROW} /></div>}
      <Grain opacity={0.03} blend="multiply" />
    </AbsoluteFill>
  );
};

if (checkContract(BOARD_BELL_TOAST_DRAWER_CONTRACT).length) throw new Error(checkContract(BOARD_BELL_TOAST_DRAWER_CONTRACT).join('；'));
export const BoardBellToastDrawer: React.FC = () => <BoardBellToastDrawerGroup />;
