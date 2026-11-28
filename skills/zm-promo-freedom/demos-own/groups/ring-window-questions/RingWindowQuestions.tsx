// 【镜头组】ring-window-questions：黑底里一道蓝线画出圆环 → 圆环侧过来、往左滑，张开一束蓝光，像一扇窗把一团"没人回答的问题"露出来 →
//   圆环猛地往右甩，把问题挡回去、光收没 → 圆环自转 270° 回到正中，缩没（018-A 一拍，痛点开场）
// 学的动作（HSAji · Tonomo 0–5.80s，30fps 逐帧看过；时间表 （内部拆片记录，未随项目提供））：
//   圆环线宽约 8px、右亮左暗；顺时针画出（头快、尾在 12 点等头追上）；绕竖轴侧过来到 ~80°，往左滑 1014 → 446；
//   光锥从圆环最高 / 最低点往右张开约 15°；问题气泡团一直在那（整团慢慢往右漂 ~150px/s），只在光锥里和圆环开口里看得到——
//   圆环左滑把它们露出来，右甩（最快 ~2700px/s）把它们挡回去；之后圆环侧着漂到最右，自转 270°（4.47→5.30）到正中、最大，再加速缩小。
// 我们的内容：「小周」家庭待办 —— 一团没人回答的家务问题（谁去接孩子？水电费交了吗？……）。
//
// 拍表（源秒，30fps）
//   拍 1 画环        0.07–0.85   顺时针画出（停留点 0.87：完整圆环）
//   拍 2 开窗        0.88–2.00   侧转 + 左滑 + 光锥张开，气泡被露出来
//   拍 3 看问题      2.00–3.60   气泡慢漂（停留点 2.60）
//   拍 4 收窗        3.65–4.13   右甩、侧成一条线、光锥收没
//   拍 5 自转缩没    4.47–5.80   转 270° 到正中，缩小，接下一镜
// 毛病清单：
//   - 通用：画面永远不停（气泡漂移按输出秒算）；动作叠着走；--hq 渲染；确定性
//   - 独有 1：气泡不是飞出来的，是圆环当"窗"扫过时露出 / 挡住（裁切 = 圆环平面右边 ∪ 圆环开口）
//   - 独有 2：画环时头快尾慢，尾停在 12 点；自转是连续转 270°，中途有两次正面、一次侧面
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {FONT, Grain} from '../../../assets/lib/helpers/polish';
import {GroupContract, checkContract, checkInputs, outputDuration, planExtras, toSource} from '../../../assets/lib/helpers/groupClock';

const FPS = 30;
const SANS = `"PingFang SC", "Noto Sans CJK SC", "Noto Sans SC", ${FONT.sans}`;
const BG = 'rgb(3,8,12)';

const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
// 单调三次样条关键帧（Fritsch–Carlson）：位置 / 角度 / 大小都用它，段与段之间速度连续
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
    if (h > 9) { const s = 3 / Math.sqrt(h); m[i] = s * a * d[i]; m[i + 1] = s * b * d[i]; }
  }
  let i = 0; while (t > K[i + 1][0]) i++;
  const h = K[i + 1][0] - K[i][0], u = (t - K[i][0]) / h, u2 = u * u, u3 = u2 * u;
  return (2 * u3 - 3 * u2 + 1) * K[i][1] + (u3 - 2 * u2 + u) * h * m[i] + (-2 * u3 + 3 * u2) * K[i + 1][1] + (u3 - u2) * h * m[i + 1];
};

// ═════════ 合同 ═════════
export const RING_WINDOW_QUESTIONS_CONTRACT: GroupContract = {
  sourceDuration: 5.8,
  fps: 30,
  motion: [[0, 0.86], [0.88, 2.4], [2.8, 5.8]],
  holds: [
    {at: 0.87, maxExtra: 0.8}, // 完整圆环
    {at: 2.6, maxExtra: 2.5}, // 问题气泡在光里慢漂
  ],
  landmarks: {draw: 0.07, close: 0.85, open: 1.2, reveal: 2.0, sweep: 3.65, spin: 4.47, front: 5.3, exit: 5.8},
  sfx: [
    {at: 'draw', type: '电流', note: '细长的 whoosh / 电流划线声（画环）', tail: 0.8, volume: 0.3},
    {at: 'open', type: '上扬铺垫', note: '低频 swell + 嘈杂人声低语（问题露出来）', tail: 1.6, volume: 0.35},
    {at: 'open', type: '环境', note: '低频 swell + 嘈杂人声低语（问题露出来）', tail: 1.6, volume: 0.35},
    {at: 'sweep', type: '短甩', note: '快速 whoosh（甩走）', tail: 0.4, volume: 0.45},
    {at: 'spin', type: '旋转', note: '旋转 whoosh 渐强', tail: 0.8, volume: 0.35},
    {at: 'exit', type: '吸入', note: '吸入声（缩没，接下一镜硬切）', volume: 0.4},
  ],
  inputs: {questions: {count: 14, maxChars: 9}},
};

export type RingWindowInputs = {questions: string[]};
// 顺序对应下面 SLOTS 的前 14 个（大的放前面）
export const RING_WINDOW_DEFAULT_INPUTS: RingWindowInputs = {
  questions: ['谁去接孩子？', '水电费交了吗？', '这周谁做饭？', '外婆的药买了没？', '周六几点体检？', '快递谁去取？', '物业费交了吗？',
    '家长会几点开？', '猫粮还有吗？', '车险快到期了？', '作业谁检查？', '周末谁打扫？', '生日礼物买了吗？', '冰箱还有菜吗？'],
};
export const checkRingWindowInputs = (x: RingWindowInputs) => checkInputs(RING_WINDOW_QUESTIONS_CONTRACT, {questions: x.questions});
export const planRingWindow = (sec: number) => planExtras(RING_WINDOW_QUESTIONS_CONTRACT, sec);
export const ringWindowFrames = (extras: number[]) => Math.round(outputDuration(RING_WINDOW_QUESTIONS_CONTRACT, extras) * FPS);
export const RING_WINDOW_QUESTIONS_DURATION = 174;

// ═════════ 气泡位置（照原片 2.50s 那一帧量，1920×1080）═════════
// q: 第几句问题（-1 = 只有"?"）；r: 角度；m: 镜像（背面朝我们）；z 小的先画
type Slot = {x: number; y: number; d: number; r: number; q: number; m?: boolean};
const SLOTS: Slot[] = [
  {x: 905, y: 370, d: 130, r: 10, q: 11},
  {x: 550, y: 320, d: 160, r: 60, q: 12},
  {x: 770, y: 720, d: 120, r: 40, q: 13},
  {x: 510, y: 430, d: 150, r: -80, q: 9, m: true},
  {x: 520, y: 600, d: 150, r: 180, q: 8, m: true},
  {x: 390, y: 680, d: 150, r: -20, q: 10},
  {x: 680, y: 560, d: 190, r: -35, q: 6},
  {x: 610, y: 700, d: 190, r: 50, q: 7},
  {x: 765, y: 620, d: 140, r: -60, q: 5},
  {x: 380, y: 430, d: 300, r: 0, q: 2},
  {x: 905, y: 470, d: 200, r: -3, q: 3},
  {x: 700, y: 380, d: 290, r: 0, q: 1},
  {x: 1125, y: 540, d: 210, r: 30, q: 4},
  {x: 965, y: 680, d: 320, r: 3, q: 0},
  {x: 820, y: 355, d: 60, r: 20, q: -1},
  {x: 1093, y: 405, d: 60, r: -15, q: -1},
  {x: 745, y: 545, d: 50, r: 30, q: -1},
  {x: 1122, y: 700, d: 70, r: 10, q: -1},
  {x: 365, y: 520, d: 55, r: -25, q: -1},
];

// 中文按字宽折行：每行字数按圆片直径算，尽量 2–3 行、行长接近
const wrap = (s: string, perLine: number) => {
  const ch = Array.from(s);
  const n = Math.max(1, Math.ceil(ch.length / perLine));
  const per = Math.ceil(ch.length / n);
  const out: string[] = [];
  for (let i = 0; i < ch.length; i += per) out.push(ch.slice(i, i + per).join(''));
  // 行尾标点不单独成行（"？" 跟上一行走）
  while (out.length > 1 && /^[？?！!，。]+$/.test(out[out.length - 1])) { const last = out.pop()!; out[out.length - 1] += last; }
  return out;
};

// ═════════ 圆环轨迹（全部照逐帧量的数）═════════
const RING_X = [[0, 925], [0.5, 964], [0.6, 983], [0.7, 1017], [0.8, 1036], [0.9, 1039], [1.0, 1051], [1.1, 1060], [1.2, 1015], [1.3, 938], [1.4, 829], [1.5, 710], [1.6, 610], [1.7, 536], [1.8, 485], [1.9, 451], [2.0, 430], [2.1, 417], [2.2, 413], [3.0, 414], [3.1, 406], [3.2, 381], [3.3, 355], [3.4, 335], [3.5, 327], [3.6, 341], [3.7, 434], [3.8, 636], [3.9, 922], [4.0, 1187], [4.1, 1375], [4.2, 1491], [4.3, 1555], [4.4, 1580], [4.467, 1581], [4.533, 1577], [4.6, 1569], [4.667, 1555], [4.733, 1530], [4.8, 1484], [4.867, 1399], [4.933, 1275], [5.0, 1174], [5.067, 1116], [5.133, 1053], [5.2, 999], [5.267, 970], [5.333, 962], [5.4, 961]];
const RING_R = [[0, 311], [0.8, 311], [1.1, 315], [1.5, 315.5], [4.8, 314], [4.867, 314], [4.9, 316.5], [4.933, 321], [4.967, 326.5], [5.0, 333.5], [5.033, 339.5], [5.067, 343.5], [5.133, 351], [5.2, 356.5], [5.3, 363.5], [5.4, 364.5], [5.5, 348.5], [5.6, 305.5], [5.7, 213.5], [5.733, 165], [5.767, 97], [5.8, 30]];
// 偏转角（度）：0 / 180 / 360 = 正面；90 / 270 = 侧成一条线。圆环有亮的半边（环自己的 +x 半边），
// cos(偏转角) > 0 时亮边在右、< 0 时在左——原片 1.35s 前亮边在右、1.35–5.05 在左、5.05 后又在右，正好是穿过 90° 和 270° 的时刻
const RING_YAW = [[0, 28.6], [0.86, 28.6], [0.9, 46.6], [1.0, 63], [1.1, 75], [1.2, 81.6], [1.35, 90], [1.5, 98.6], [1.6, 101], [1.8, 103], [2.0, 104.3], [3.0, 104.5], [3.3, 106], [3.6, 106], [3.7, 105.3], [3.8, 103], [3.9, 98.2], [4.0, 93], [4.1, 92], [4.2, 94], [4.4, 96], [4.467, 96.4], [4.5, 96.9], [4.567, 101], [4.633, 108.4], [4.7, 120.3], [4.767, 138], [4.833, 163], [4.883, 180], [4.933, 208], [4.967, 230], [5.0, 253], [5.033, 263], [5.05, 270], [5.1, 315], [5.133, 329], [5.167, 340], [5.2, 347.5], [5.267, 360]];
// 画环：头 / 尾角度（顺时针，12 点 = 0°）
const HEAD = [[0.07, 200], [0.1, 240], [0.2, 360], [0.3, 420], [0.4, 480], [0.5, 540], [0.6, 600], [0.7, 645], [0.8, 705], [0.85, 722]];
const TAIL = [[0.07, 195], [0.1, 198], [0.2, 240], [0.3, 270], [0.4, 285], [0.5, 298], [0.6, 305], [0.7, 352], [0.75, 360]];

// 球的转动：经度（弧度）从左往右走，每个球速度不同；整体还在慢慢自转（度/秒，正负交替）——照原片 2.0–3.6s 几个大球的字量的：
// "Who's handling…" 1.2 秒从左边缘转到正中（约 65°/秒），"Who's responsible…" 约 27°/秒、同时顺时针自转约 20°/秒，"How far…" 逆时针自转约 12°/秒
const LON_SPEED = [0.55, 0.47, 0.8, 0.6, 0.5, 0.9, 0.7, 0.62, 0.75, 1.1, 0.5, 0.47, 0.66, 0.45];
const LON_AT_HOLD = [-0.05, 0.1, -0.15, 0.2, 0.05, -0.2, 0.1, -0.1, 0.15, 0.0, -0.05, 0.05, 0.1, 0.02];
const lonAt = (i: number, t: number) => LON_AT_HOLD[i % LON_AT_HOLD.length] + LON_SPEED[i % LON_SPEED.length] * (t - 2.9);
const spinRate = (i: number) => [12, -10, 8, -14, 10, -8, 14, -12, 9, 6, -12, 20, -9, -12][i % 14];

export const RingWindowQuestionsGroup: React.FC<{inputs?: RingWindowInputs; extras?: number[]}> = ({inputs = RING_WINDOW_DEFAULT_INPUTS, extras = [0, 0]}) => {
  const t = useCurrentFrame() / FPS;
  const C = RING_WINDOW_QUESTIONS_CONTRACT;
  const s = toSource(t, C, extras);
  const tAfter = t - (s >= 2.6 ? extras[0] + extras[1] : s >= 0.87 ? extras[0] : 0); // 停留之后，镜头时钟和源时钟对齐
  const cx = kf(s, RING_X), cy = 540, R = kf(s, RING_R);
  const yaw = (kf(s, RING_YAW) * Math.PI) / 180;
  const cosY = Math.cos(yaw);
  const rx = Math.max(1.5, R * Math.abs(cosY));
  const drawn = s >= 0.07;
  const closed = s >= 0.85;
  const head = kf(s, HEAD), tail = kf(s, TAIL);
  const arcLen = closed ? 360 : clamp(head - tail, 0, 360);
  const dashOff = -(tail - 90); // SVG 椭圆从 3 点开始顺时针；12 点 = −90°

  // 光锥：1.2 出现、1.8 完整；3.9–4.13 收没
  const cone = clamp((s - 1.18) / 0.6) * (1 - clamp((s - 3.95) / 0.18));
  const flare = Math.tan((15 * Math.PI) / 180) * (0.4 + 0.6 * clamp((s - 1.2) / 0.6)) * (1 - clamp((s - 3.8) / 0.3));
  const grow = Math.pow(clamp((s - 1.2) / 1.0), 1.3);
  const L = 1000 * grow * (1 - clamp((s - 3.95) / 0.2)); // 光锥长度（1.2 起慢慢长出来，2.2 长满）
  const coneDir = Math.sign(cosY) >= 0 ? 1 : 1; // 原片光锥一直朝右
  const top0 = cy - R, bot0 = cy + R;
  const conePts = `${cx},${top0} ${cx + coneDir * L},${top0 - L * flare} ${cx + coneDir * L},${bot0 + L * flare} ${cx},${bot0}`;

  // 气泡：整团一直在漂（按镜头时钟），2.0、3.5 两次轻推
  const drift = 150 * (t - 2.5);
  const push = 1 + 0.015 * clamp((tAfter - 1.6) / 2);
  const bubblesOn = s > 1.1 && s < 4.25;

  const qs = inputs.questions;
  // 半个椭圆：从顶点经右 / 左到底点
  const halfPath = (side: 'left' | 'right') => `M ${cx} ${cy - R} A ${rx} ${R} 0 0 ${side === 'right' ? 1 : 0} ${cx} ${cy + R}`;
  const Ring: React.FC<{half: 'all' | 'left' | 'right'}> = ({half}) => {
    if (half === 'all') {
      const dash = {pathLength: 360, strokeDasharray: `${arcLen} ${360 - arcLen + 0.01}`, strokeDashoffset: dashOff};
      return (
        <g>
          <ellipse cx={cx} cy={cy} rx={rx} ry={R} fill="none" stroke="rgb(30,70,255)" strokeOpacity={0.3} strokeWidth={14} filter="url(#rwq-ringglow)" {...dash} />
          <ellipse cx={cx} cy={cy} rx={rx} ry={R} fill="none" stroke="url(#rwq-ring)" strokeWidth={7.5} strokeLinecap="round" {...dash} />
        </g>
      );
    }
    const d = halfPath(half);
    return (
      <g>
        <path d={d} fill="none" stroke="rgb(30,70,255)" strokeOpacity={0.3} strokeWidth={14} filter="url(#rwq-ringglow)" />
        <path d={d} fill="none" stroke="url(#rwq-ring)" strokeWidth={7.5} strokeLinecap="round" />
      </g>
    );
  };
  return (
    <AbsoluteFill style={{background: BG, overflow: 'hidden'}}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}}>
        <defs>
          <radialGradient id="rwq-ball" cx="38%" cy="30%" r="75%">
            <stop offset="0%" stopColor="rgb(30,38,58)" />
            <stop offset="55%" stopColor="rgb(15,20,35)" />
            <stop offset="100%" stopColor="rgb(8,11,21)" />
          </radialGradient>
          <filter id="rwq-shadow" x="-30%" y="-30%" width="160%" height="170%">
            <feDropShadow dx="0" dy="12" stdDeviation="16" floodColor="#000" floodOpacity="0.55" />
          </filter>
          {/* 亮边跟着环转：cos>0 亮在右，cos<0 亮在左（实测亮边蓝 ≈235，暗边 ≈175） */}
          <linearGradient id="rwq-ring" x1={cx - rx - 8} x2={cx + rx + 8} y1="0" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={cosY >= 0 ? 'rgb(12,42,170)' : 'rgb(30,66,240)'} />
            <stop offset="50%" stopColor="rgb(22,54,205)" />
            <stop offset="100%" stopColor={cosY >= 0 ? 'rgb(30,66,240)' : 'rgb(12,42,170)'} />
          </linearGradient>
          {/* 光锥衰减照原片量：亮边离圆环 150px 剩一半、400px 剩一成；颜色偏青 rgb(20,110,245) */}
          <linearGradient id="rwq-cone" x1={cx - rx} x2={cx + 900} y1="0" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="rgb(30,95,220)" stopOpacity={0.34 * cone} />
            <stop offset="22%" stopColor="rgb(25,85,200)" stopOpacity={0.14 * cone} />
            <stop offset="55%" stopColor="rgb(20,80,190)" stopOpacity={0.05 * cone} />
            <stop offset="100%" stopColor="rgb(20,80,190)" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="rwq-edge" x1={cx} x2={cx + 620} y1="0" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="rgb(18,128,255)" stopOpacity={1 * cone} />
            <stop offset="20%" stopColor="rgb(24,124,240)" stopOpacity={0.52 * cone} />
            <stop offset="42%" stopColor="rgb(22,105,235)" stopOpacity={0.22 * cone} />
            <stop offset="66%" stopColor="rgb(22,100,230)" stopOpacity={0.08 * cone} />
            <stop offset="100%" stopColor="rgb(22,100,230)" stopOpacity="0" />
          </linearGradient>
          <filter id="rwq-blur14" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="14" /></filter>
          <filter id="rwq-blur4" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="3.5" /></filter>
          <filter id="rwq-ringglow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="6" /></filter>
          {/* 气泡只在"圆环平面右边 ∪ 圆环开口"里看得到：圆环扫过去就露出 / 挡住 */}
          <mask id="rwq-window" maskUnits="userSpaceOnUse" x="0" y="0" width="1920" height="1080">
            <rect x="0" y="0" width="1920" height="1080" fill="black" />
            <rect x={cx} y={0} width={Math.max(0, 1920 - cx)} height={1080} fill="white" />
            <ellipse cx={cx} cy={cy} rx={Math.max(0, rx - 3)} ry={R - 3} fill="white" />
          </mask>
        </defs>

        {/* 光锥填充 + 上下两条亮边 */}
        {cone > 0.001 && (
          <g>
            {/* 光锥 + 圆环开口左半边是同一块蓝雾（一条路径，不叠两层，不会在圆环中线出硬边） */}
            <path d={`M ${cx} ${top0} A ${rx} ${R} 0 0 0 ${cx} ${bot0} L ${cx + L} ${bot0 + L * flare} L ${cx + L} ${top0 - L * flare} Z`} fill="url(#rwq-cone)" />
            <g filter="url(#rwq-blur14)">
              <line x1={cx} y1={top0} x2={cx + L} y2={top0 - L * flare} stroke="url(#rwq-edge)" strokeWidth={30} />
              <line x1={cx} y1={bot0} x2={cx + L} y2={bot0 + L * flare} stroke="url(#rwq-edge)" strokeWidth={30} />
            </g>
            <g filter="url(#rwq-blur4)">
              <line x1={cx} y1={top0} x2={cx + L} y2={top0 - L * flare} stroke="url(#rwq-edge)" strokeWidth={8} />
              <line x1={cx} y1={bot0} x2={cx + L} y2={bot0 + L * flare} stroke="url(#rwq-edge)" strokeWidth={8} />
            </g>
          </g>
        )}

        {/* 画环阶段：整圈一条（虚线露出一段弧）；闭合后右半边（后半边）先画，被气泡挡住 */}
        {drawn && !closed && <Ring half="all" />}
        {drawn && closed && <Ring half="right" />}

        {/* 问题气泡 */}
        {bubblesOn && (
          <g mask="url(#rwq-window)">
            <g transform={`translate(${drift + 760},540) scale(${push}) translate(-760,-540)`}>
              {SLOTS.map((b, i) => {
                const float = Math.sin(t * 1.3 + i * 1.7) * 3;
                const txt = b.q >= 0 ? qs[b.q] ?? '' : '？';
                const fs = b.q >= 0 ? b.d * (b.d > 250 ? 0.2 : 0.19) : b.d * 0.5; // 原片字几乎铺满球（约 0.85 倍直径）
                const lines = b.q >= 0 ? wrap(txt, Math.max(3, Math.floor((b.d * 0.84) / fs))) : [txt];
                const lh = fs * 1.18;
                return (
                  <g key={i} transform={`translate(${b.x},${b.y + float})`}>
                    <clipPath id={`rwq-ball-clip-${i}`}><circle r={b.d / 2 - 1} /></clipPath>
                    <circle r={b.d / 2} fill="url(#rwq-ball)" filter="url(#rwq-shadow)" />
                    {/* 字贴在球面上：每个字按经纬度放，球一直在转（经度往右走、整体慢慢自转），越靠边越扁，转到背面看不见 */}
                    <g clipPath={`url(#rwq-ball-clip-${i})`}>
                      <g transform={`rotate(${b.r + spinRate(i) * (t - 2.6)}) scale(${b.m ? -1 : 1},1)`}>
                        {lines.map((ln, k) => {
                          const R0 = b.d / 2;
                          const yl = (k - (lines.length - 1) / 2) * lh;
                          const phi = Math.asin(clamp(yl / R0, -0.95, 0.95));
                          const rLat = R0 * Math.cos(phi);
                          const chs = Array.from(ln);
                          const wOf = (c: string) => (/[\x00-\x7f]/.test(c) ? 0.56 : 1) * fs;
                          const total = chs.reduce((a, c) => a + wOf(c), 0);
                          let acc = -total / 2;
                          const lam0 = lonAt(i, t);
                          return chs.map((c, j) => {
                            const w = wOf(c); const mid = acc + w / 2; acc += w;
                            const lam = lam0 + mid / rLat; // 弧长 → 经度
                            const cz = Math.cos(lam);
                            if (cz < 0.04) return null;
                            const px = rLat * Math.sin(lam);
                            return <text key={k + '-' + j} x={0} y={0} transform={`translate(${px},${yl}) scale(${cz},${Math.cos(phi) * 0.15 + 0.85})`} dy={fs * 0.36} textAnchor="middle" fontFamily={SANS} fontWeight={700} fontSize={fs} fill="#fff" fillOpacity={clamp(cz * 2.2)} textRendering="geometricPrecision">{c}</text>;
                          });
                        })}
                      </g>
                    </g>
                  </g>
                );
              })}
            </g>
          </g>
        )}

        {/* 开口里的气泡隔着一层蓝光 */}
        {bubblesOn && cone > 0.001 && <ellipse cx={cx} cy={cy} rx={Math.max(0, rx - 2)} ry={R - 2} fill="rgb(40,110,255)" fillOpacity={0.07 * cone} />}
        {/* 圆环前半边（屏幕左半）：压在气泡上面 */}
        {drawn && closed && <Ring half="left" />}
      </svg>
      {/* 原片暗底上有极淡的噪点在动（停住的那几帧也不是死的） */}
      <Grain opacity={0.035} blend="screen" />
    </AbsoluteFill>
  );
};

if (checkContract(RING_WINDOW_QUESTIONS_CONTRACT).length) throw new Error(checkContract(RING_WINDOW_QUESTIONS_CONTRACT).join('；'));
export const RingWindowQuestions: React.FC = () => <RingWindowQuestionsGroup />;
