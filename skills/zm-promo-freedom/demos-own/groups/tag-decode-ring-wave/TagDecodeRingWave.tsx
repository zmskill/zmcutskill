// 【镜头组】tag-decode-ring-wave：两个标签框在乱码里"解码"出词、相机绕着它们转 → 硬切成一个 3D 标签环（狂转、倒下、拉远、长出更多标签）→
//   俯冲穿过环、近景沿光带慢漂 → 以中心方块为锚换成射线图 → 白底面板从右推进来撞上方块、推着它走，面板上的声波柱流动 → 频闪冲进柱子（030-D 一串）
// 学的动作（ab_workss · Pulse 发布片 25.067–35.800s，30fps 逐帧看过；时间表 （内部拆片记录，未随项目提供），看片助手另写）：
//   拍 1–5（0–2.9s）：两个深蓝渐变框一前一后，框边延长成贯穿全屏的引导线（交点白方点），对应角连 4 条棱线；字在乱码里逐字"游走"后定住；
//     开场后拉、一帧跳机位、快速环绕、上仰落定、安静慢滑（中间已定的字再闪一下）、绕竖轴加速甩。
//   拍 6–13（2.9–7.0s）：硬切成 3D 环：侧立的窄环顺时针狂转（36°/帧）同时倒下、拉远，标签 2→20 个一帧冒几个；平躺慢转 → 俯冲 → 一帧翻转 → 近景沿光带慢漂 → 推近甩出。
//     中心方块屏幕尺寸恒定 82px，是整串的锚。
//   拍 14–19（7.0–10.77s）：一帧换成射线图（点状射线 + 彩色小方块往中心流 + 小编码）；白底面板从右硬推进来，撞上方块后推着它往左走（先减速到 2px/帧再加速）；
//     面板上一排 22px 短划先等高，再远端先涨高，波形每帧往右流一格、越远越稀；最后白底蓝柱 / 黑底白柱 1–3 帧交替频闪，相机猛推进柱子。
// 我们的内容：语音笔记。两个主词「今日待办」「随手灵感」，环上标签是会议、待办、灵感、提醒事项、买菜、读书摘抄；声波柱就是"一段录音"。不出现品牌。
//   中文的"乱码"：每个字的码位在 ±1 里游走（相邻汉字），和原片字母 ±1 游走同一个手法。
//
// 拍表（源秒，30fps，n = 帧）
//   拍 1–5 解码 + 环绕   0.000–2.900  n0–86   （停留点 2.133：字定住后的安静慢滑）
//   拍 6–8 环倒下平躺    2.900–4.200  n87–126 （停留点 3.900：平躺的环）
//   拍 9–13 俯冲/近景/甩 4.200–7.000  n126–210（停留点 6.000：近景沿光带慢漂）
//   拍 14–18 射线+面板   7.033–10.333 n211–310（停留点 8.733：面板慢漂、声波在流）
//   拍 19 频闪出口       10.367–10.767 n311–322
// 毛病清单：
//   - 通用：画面永远不停（停留区按输出秒慢推，声波按输出秒流）；猛动作一帧跳不缓动；--hq 渲染；确定性
//   - 独有 1：引导线是两个框的边延长出来的，跟着框走；交点白方点不旋转
//   - 独有 2：环上标签始终正对镜头（billboard）；中心方块屏幕尺寸不随推拉变
//   - 独有 3：声波柱的槽位钉在面板上，高度图案每帧右移一格；近方块处永远小（喇叭口）
//   - 独有 4：频闪是"白底蓝柱 / 黑底白柱"两套配色交替，不是反色
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {FONT, Grain, Vignette} from '../../../assets/lib/helpers/polish';
import {GroupContract, checkContract, checkInputs, outputDuration, planExtras, toSource} from '../../../assets/lib/helpers/groupClock';

const W = 1920, H = 1080, FPS = 30;
const SANS = `"PingFang SC", "Noto Sans CJK SC", "Noto Sans SC", ${FONT.sans}`;
const BLUE = '#2454ED';
const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const hsh = (n: number) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const lerp = (a: number, b: number, u: number) => a + (b - a) * u;

// 单调三次样条：pts = [x, y]
type P = [number, number][];
const trk = (t: number, pts: P) => {
  const n = pts.length;
  if (t <= pts[0][0]) return pts[0][1];
  if (t >= pts[n - 1][0]) return pts[n - 1][1];
  const d: number[] = [];
  for (let k = 0; k < n - 1; k++) d.push((pts[k + 1][1] - pts[k][1]) / (pts[k + 1][0] - pts[k][0]));
  const m: number[] = [d[0]];
  for (let k = 1; k < n - 1; k++) m.push(d[k - 1] * d[k] <= 0 ? 0 : (d[k - 1] + d[k]) / 2);
  m.push(d[n - 2]);
  for (let k = 0; k < n - 1; k++) {
    if (d[k] === 0) { m[k] = 0; m[k + 1] = 0; continue; }
    const a = m[k] / d[k], b = m[k + 1] / d[k], s = a * a + b * b;
    if (s > 9) { const tau = 3 / Math.sqrt(s); m[k] = tau * a * d[k]; m[k + 1] = tau * b * d[k]; }
  }
  let i = 0;
  while (t > pts[i + 1][0]) i++;
  const [x0, y0] = pts[i], [x1, y1] = pts[i + 1];
  const h = x1 - x0, u = (t - x0) / h, u2 = u * u, u3 = u2 * u;
  return (2 * u3 - 3 * u2 + 1) * y0 + (u3 - 2 * u2 + u) * h * m[i] + (-2 * u3 + 3 * u2) * y1 + (u3 - u2) * h * m[i + 1];
};

// ═════════ 合同 ═════════
export const TAG_DECODE_RING_WAVE_CONTRACT: GroupContract = {
  sourceDuration: 323 / 30,
  fps: 30,
  motion: [[0, 2.0], [2.3, 3.8], [4.0, 5.9], [6.1, 8.6], [8.85, 323 / 30]],
  holds: [
    {at: 2.133, maxExtra: 1.0}, // 两个词都定住、慢慢滑（读词）
    {at: 3.9, maxExtra: 1.0}, // 平躺的标签环（看全貌）
    {at: 6.0, maxExtra: 1.0}, // 近景：标签沿光带慢漂
    {at: 8.733, maxExtra: 1.5}, // 面板慢漂，声波在流
  ],
  landmarks: {in: 0, jump: 0.233, orbit: 0.733, decoded: 1.367, yaw: 2.3, ring: 2.9, flat: 3.467, dive: 4.167, flip: 4.767, quiet: 5.2, whip: 6.5, swap: 7.033, panel: 7.233, dock: 7.6, wave: 8.6, accel: 9.0, strobe: 10.367, exit: 323 / 30},
  sfx: [
    {at: 'in', type: '故障', note: '数据噪声 + 字符滚动 tick 串（解码）', tail: 1.3, volume: 0.35},
    {at: 'orbit', type: '旋转', note: '快速环绕 whoosh', volume: 0.4},
    {at: 'decoded', type: '提示音', note: '短促确认 blip（字定住）', volume: 0.35},
    {at: 'yaw', type: '运镜', note: '加速 whoosh，切在最快处', volume: 0.4},
    {at: 'ring', type: '旋转', note: '旋转 swirl + 一串细碎 pop（标签冒出）', tail: 0.6, volume: 0.4},
    {at: 'ring', type: '弹出', note: '旋转 swirl + 一串细碎 pop（标签冒出）', tail: 0.6, volume: 0.4},
    {at: 'flip', type: '短甩', note: '翻转 whoosh', volume: 0.4},
    {at: 'swap', type: '落版重击', note: '低频 thump（换成射线图）', volume: 0.35},
    {at: 'dock', type: '轻落定', note: '轻撞 tick（面板撞上方块）', volume: 0.3},
    {at: 'wave', type: '环境', note: '录音底噪 / 人声片段淡入（声波涨起来）', tail: 1.8, volume: 0.3},
    {at: 'strobe', type: '故障', note: '频闪 glitch + 冲刺 riser，切在最后一帧', tail: 0.4, volume: 0.5},
    {at: 'strobe', type: '上扬铺垫', note: '频闪 glitch + 冲刺 riser，切在最后一帧', tail: 0.4, volume: 0.5},
  ],
  inputs: {
    heroFront: {maxChars: 4},
    heroBack: {maxChars: 4},
    tags: {count: 6, maxChars: 4},
  },
};

export type TagRingInputs = {
  heroFront: string; // 前面的大框（第一个解码出来的词）
  heroBack: string; // 后面的框
  tags: string[]; // 环上 6 个标签（循环使用）
};
export const TAG_RING_DEFAULT_INPUTS: TagRingInputs = {
  heroFront: '今日待办',
  heroBack: '随手灵感',
  tags: ['会议', '待办', '灵感', '提醒事项', '买菜', '读书摘抄'],
};
export function checkTagRingInputs(x: TagRingInputs): string[] {
  return checkInputs(TAG_DECODE_RING_WAVE_CONTRACT, {heroFront: x.heroFront, heroBack: x.heroBack, tags: x.tags});
}
export const planTagRing = (sec: number) => planExtras(TAG_DECODE_RING_WAVE_CONTRACT, sec);
export const tagRingFrames = (extras: number[]) => Math.round(outputDuration(TAG_DECODE_RING_WAVE_CONTRACT, extras) * FPS);

export const TAG_DECODE_RING_WAVE_DURATION = 323;

// ═════════ 乱码解码：每个字的码位在 ±1 里游走，最后落到目标上 ═════════
const shiftChar = (ch: string, off: number) => (off === 0 ? ch : String.fromCodePoint((ch.codePointAt(0) ?? 0x4e00) + off));
// 生成 [from, to] 帧的偏移表；to 帧全部归零；firstWobble: 第 1 个字在 to 前 4 帧先对、再跑一格、再回来（原片 Demand→Cemand→Demand）
const walk = (len: number, from: number, to: number, seed: number, start: 'random' | 'zero', firstWobble: boolean) => {
  const rows: number[][] = [];
  let cur = Array.from({length: len}, (_, j) => (start === 'zero' ? 0 : (hsh(seed + j * 3.7) < 0.5 ? -1 : 1) * (2 + Math.floor(hsh(seed + j * 5.1) * 3))));
  for (let f = from; f <= to; f++) {
    if (f > from) {
      const left = to - f;
      cur = cur.map((o, j) => {
        const change = hsh(seed + f * 7.13 + j * 1.91) < 0.42;
        if (!change && Math.abs(o) <= left) return o;
        if (Math.abs(o) >= left) return o - Math.sign(o); // 来不及了：只往回走
        const toward = hsh(seed + f * 2.3 + j * 9.7) < 0.62;
        const step = o === 0 ? (hsh(seed + f + j) < 0.5 ? -1 : 1) : toward ? -Math.sign(o) : Math.sign(o);
        return clamp(o + step, -4, 4);
      });
    }
    rows.push([...cur]);
  }
  rows[rows.length - 1] = rows[rows.length - 1].map(() => 0);
  if (firstWobble && rows.length > 5) { const L = rows.length; rows[L - 5][0] = 0; rows[L - 4][0] = -1; rows[L - 3][0] = -1; rows[L - 2][0] = -1; }
  return rows;
};
const decodeFront = (word: string, n: number) => {
  const cs = [...word];
  if (n >= 41) return word;
  const rows = walk(cs.length, 0, 41, 11.3, 'random', true);
  return cs.map((c, j) => shiftChar(c, rows[Math.max(0, n)][j])).join('');
};
const decodeBack = (word: string, n: number) => {
  const cs = [...word];
  if (n < 20 || (n >= 34 && n < 58) || n >= 62) return word;
  if (n >= 58) return cs.map((c, j) => shiftChar(c, j === 0 ? 1 : j === 1 && n >= 59 ? 1 : 0)).join(''); // 已定住的字再闪一下
  const rows = walk(cs.length, 20, 34, 27.9, 'zero', false);
  return cs.map((c, j) => shiftChar(c, rows[n - 20][j])).join('');
};

// ═════════ 拍 1–5：两个框（屏幕空间矩形，按帧给中心和高度）═════════
type Box = {cx: number; cy: number; h: number};
const STEP_A: Record<number, [number, number, number]> = {22: [700, 640, 480], 23: [540, 560, 470], 24: [600, 330, 430], 25: [560, 250, 400], 26: [1300, 260, 420], 27: [1450, 300, 430], 28: [1200, 330, 440], 29: [1350, 280, 450], 84: [700, 800, 420], 85: [620, 620, 430], 86: [560, 420, 440]};
const STEP_B: Record<number, [number, number, number]> = {22: [1500, 250, 220], 23: [1420, 430, 200], 24: [1250, 640, 210], 25: [1500, 900, 200], 26: [900, 860, 200], 27: [700, 800, 200], 28: [520, 760, 200], 29: [600, 800, 210], 84: [1400, 300, 260], 85: [1360, 520, 250], 86: [1300, 780, 240]};
// 绕竖轴加速：每帧位移（n69–83）
const YAW = [4, 5, 7, 8, 10, 12, 15, 19, 23, 28, 35, 44, 56, 74, 100];
const yawSum = (n: number) => { let s = 0; for (let k = 69; k <= Math.min(n, 83); k++) s += YAW[k - 69]; return s; };
const boxA = (n: number): Box => {
  if (STEP_A[n]) { const [cx, cy, h] = STEP_A[n]; return {cx, cy, h}; }
  if (n <= 6) return {cx: trk(n, [[0, 960], [6, 951]]), cy: trk(n, [[0, 540], [2, 548], [6, 553]]), h: trk(n, [[0, 561], [1, 500], [2, 462], [3, 437], [6, 410]])};
  if (n <= 21) return {cx: trk(n, [[7, 905], [8, 884], [9, 875], [11, 866], [14, 857], [21, 850]]), cy: trk(n, [[7, 640], [8, 662], [9, 672], [11, 684], [14, 697], [21, 700]]), h: 400};
  if (n <= 46) return {cx: trk(n, [[30, 1350], [38, 1252], [46, 1247]]), cy: trk(n, [[30, 1330], [31, 1156], [32, 1029], [33, 939], [34, 873], [35, 824], [36, 786], [37, 756], [38, 732], [39, 747], [40, 760], [41, 771], [42, 780], [43, 788], [46, 790]]), h: trk(n, [[30, 560], [38, 410], [46, 397]])};
  const slide = -3 * (Math.min(n, 68) - 46) - yawSum(n);
  return {cx: 1247 + slide, cy: n >= 47 && n <= 61 ? 808 : 790, h: 397};
};
const boxB = (n: number): Box | null => {
  if (n < 7) return null;
  if (STEP_B[n]) { const [cx, cy, h] = STEP_B[n]; return {cx, cy, h}; }
  if (n <= 21) return {cx: trk(n, [[7, 1109], [14, 1133], [21, 1133]]), cy: trk(n, [[7, 384], [14, 387], [21, 387]]), h: trk(n, [[7, 173], [14, 222], [21, 222]])};
  if (n <= 46) return {cx: trk(n, [[30, 520], [38, 495], [46, 499]]), cy: trk(n, [[30, 700], [31, 526], [32, 399], [33, 309], [34, 243], [35, 194], [36, 156], [37, 126], [38, 102], [39, 117], [40, 130], [41, 141], [42, 150], [43, 158], [46, 160]]), h: trk(n, [[30, 300], [38, 245], [46, 238]])};
  const big = n >= 47 ? 1.18 : 1;
  const slide = 3 * (Math.min(n, 68) - 46) + yawSum(n);
  return {cx: 505 + slide, cy: 190, h: 238 * big};
};
const boxW = (word: string, h: number) => [...word].length * 0.6 * h * 1.0 + 0.36 * h;
// 亮角方向（CSS 角度）：右上 → 转的时候挪到左上、左下
const glowAngA = (n: number) => trk(n, [[0, 45], [68, 45], [76, 10], [83, -45], [86, -135]]);
const glowAngB = (n: number) => trk(n, [[7, 45], [30, 45], [46, 225], [68, 225], [83, 300], [86, 330]]);

const HeroBox: React.FC<{b: Box; word: string; ang: number; z: number}> = ({b, word, ang, z}) => {
  const w = boxW(word, b.h);
  return (
    <div style={{position: 'absolute', left: b.cx - w / 2, top: b.cy - b.h / 2, width: w, height: b.h, zIndex: z, background: `linear-gradient(${ang.toFixed(1)}deg, #02030A 0%, #040B33 40%, #0C2080 70%, #1D45C9 88%, #4a80ff 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'}}>
      <span style={{fontFamily: SANS, fontWeight: 500, fontSize: 0.6 * b.h, lineHeight: 1, color: '#fff', whiteSpace: 'pre', letterSpacing: 0}}>{word}</span>
    </div>
  );
};

const GridShot: React.FC<{n: number; x: TagRingInputs}> = ({n, x}) => {
  const A = boxA(n), B = boxB(n);
  const wa = boxW(x.heroFront, A.h);
  const ra = {l: A.cx - wa / 2, r: A.cx + wa / 2, t: A.cy - A.h / 2, b: A.cy + A.h / 2};
  const rb = B ? (() => { const wb = boxW(x.heroBack, B.h); return {l: B.cx - wb / 2, r: B.cx + wb / 2, t: B.cy - B.h / 2, b: B.cy + B.h / 2}; })() : null;
  const xs = [ra.l, ra.r, ...(rb ? [rb.l, rb.r] : [])];
  const ys = [ra.t, ra.b, ...(rb ? [rb.t, rb.b] : [])];
  const corners = (r: {l: number; r: number; t: number; b: number}) => [[r.l, r.t], [r.r, r.t], [r.l, r.b], [r.r, r.b]];
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <svg width={W} height={H} style={{position: 'absolute', inset: 0, zIndex: 5}}>
        {xs.map((v, i) => <line key={`v${i}`} x1={v} y1={0} x2={v} y2={H} stroke="#fff" strokeWidth={1.1} opacity={0.9} />)}
        {ys.map((v, i) => <line key={`h${i}`} x1={0} y1={v} x2={W} y2={v} stroke="#fff" strokeWidth={1.1} opacity={0.9} />)}
        {rb && corners(ra).map(([x1, y1], i) => { const [x2, y2] = corners(rb)[i]; return <line key={`e${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#fff" strokeWidth={1.1} opacity={0.9} />; })}
      </svg>
      {B && rb && <HeroBox b={B} word={decodeBack(x.heroBack, n)} ang={glowAngB(n)} z={2} />}
      <HeroBox b={A} word={decodeFront(x.heroFront, n)} ang={glowAngA(n)} z={3} />
      <svg width={W} height={H} style={{position: 'absolute', inset: 0, zIndex: 6}}>
        {xs.flatMap((vx, i) => ys.map((vy, j) => <rect key={`d${i}-${j}`} x={vx - 4} y={vy - 4} width={8} height={8} fill="#F4F7FF" />))}
      </svg>
    </AbsoluteFill>
  );
};

// ═════════ 拍 6–13：3D 标签环 ═════════
const LABEL_N = 20;
const LABEL_ON = (k: number) => (k < 2 ? 87 : [93, 94, 95, 96, 96, 97, 98, 98, 98, 99, 100, 101, 101, 102, 102, 103, 105, 107][k - 2]);
const ringParams = (n: number, t: number) => {
  const spin = trk(n, [[87, 90], [88, 135], [89, 180], [90, 225], [92, 270], [96, 315], [97, 325], [98, 335], [100, 342], [104, 360], [124, 362], [126, 364], [134, 378], [139, 400], [142, 430], [142.99, 430], [143, 600], [155, 607], [196, 611], [210, 620]]);
  const lean = trk(n, [[87, 84], [92, 80], [96, 76], [104, 72], [124, 71], [126, 71], [142, 82], [142.99, 82], [143, 75], [210, 75]]);
  const R = trk(n, [[87, 360], [90, 330], [92, 300], [96, 330], [100, 480], [104, 600], [110, 680], [119, 700], [126, 700], [134, 680], [142, 640], [142.99, 640], [143, 600], [155, 560], [196, 550], [203, 640], [210, 1000]]);
  const Hl = trk(n, [[87, 320], [90, 220], [92, 160], [96, 100], [100, 72], [104, 64], [126, 64], [134, 66], [142, 70], [142.99, 70], [143, 92], [155, 84], [196, 84], [203, 100], [210, 170]]);
  const dist = trk(n, [[87, 2.2], [100, 2.0], [110, 1.75], [142, 1.75], [143, 1.55], [210, 1.5]]);
  const cx = trk(n, [[87, 1058], [90, 904], [93, 868], [96, 906], [100, 950], [105, 972], [119, 994], [126, 996], [134, 1010], [142, 1044], [142.99, 1044], [143, 963], [147, 900], [155, 880], [196, 874], [203, 878], [206, 882], [208, 888], [210, 900], [211, 920]]);
  const cy = trk(n, [[87, 556], [90, 620], [93, 510], [96, 458], [100, 442], [119, 446], [126, 448], [134, 480], [139, 540], [142, 640], [142.99, 591], [143, 636], [147, 614], [155, 596], [196, 584], [210, 574]]);
  // 环在自己平面里的转角（弧度）：平躺后前排往左走、先快后慢；近景慢转让标签往上漂
  const rot = trk(n, [[87, 0], [104, 0], [108, 0.32], [112, 0.5], [118, 0.6], [124, 0.62], [126, 0.62], [134, 0.66], [142, 0.85], [143, 0.75], [147, 0.83], [155, 0.88], [196, 1.12], [203, 1.2], [210, 1.36]]) + 0.004 * (t - n / FPS);
  return {spin: (spin * Math.PI) / 180, lean: (lean * Math.PI) / 180, R, Hl, cx, cy, rot, dist};
};
const project = (p: ReturnType<typeof ringParams>, theta: number, rScale = 1) => {
  const r = p.R * rScale;
  const xl = r * Math.cos(theta), yl = r * Math.sin(theta);
  const yy = yl * Math.cos(p.lean), z = -yl * Math.sin(p.lean); // 下半圈离镜头近
  const s = (p.dist * p.R) / (p.dist * p.R + z);
  const cs = Math.cos(p.spin), sn = Math.sin(p.spin);
  return {X: p.cx + s * (xl * cs - yy * sn), Y: p.cy + s * (xl * sn + yy * cs), s, z};
};
const labelWord = (x: TagRingInputs, k: number) => (k === 0 ? x.heroFront : k === 1 ? x.heroBack : x.tags[(k - 2) % x.tags.length]);
// 20 个槽位均匀分布：两个主词在正上 / 正下（0、π），其余 18 个打散顺序填进剩下的槽，冒出来时不扎堆
const SLOTS = [3, 14, 7, 18, 1, 12, 5, 16, 9, 2, 13, 6, 17, 11, 4, 15, 8, 19];
const labelTheta = (k: number) => (k === 0 ? Math.PI : k === 1 ? 0 : (SLOTS[(k - 2) % 18] * Math.PI * 2) / 20 + (hsh(k * 4.1) - 0.5) * 0.12);

const RingShot: React.FC<{n: number; t: number; x: TagRingInputs}> = ({n, t, x}) => {
  const p = ringParams(n, t);
  const path = (rs: number) => Array.from({length: 97}, (_, i) => project(p, (i / 96) * Math.PI * 2, rs)).map((q, i) => `${i ? 'L' : 'M'}${q.X.toFixed(1)} ${q.Y.toFixed(1)}`).join(' ') + 'Z';
  const near = n >= 143;
  const labels = Array.from({length: LABEL_N}, (_, k) => k).filter((k) => n >= LABEL_ON(k)).map((k) => {
    const q = project(p, labelTheta(k) + p.rot);
    const h = p.Hl * q.s * (k < 2 && n < 100 ? 1 : 0.85 + 0.3 * hsh(k * 2.7));
    return {k, ...q, h, word: labelWord(x, k)};
  }).sort((a, b) => b.z - a.z);
  const bandW = Math.max(18, p.R * 0.16);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {near && <AbsoluteFill style={{background: 'radial-gradient(ellipse 700px 420px at 0px 1080px, rgba(0,10,80,0.9) 0%, rgba(0,3,23,0.5) 40%, rgba(0,0,0,0) 100%)'}} />}
      <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
        <defs>
          <filter id="bandblur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation={(bandW * 0.35).toFixed(1)} /></filter>
        </defs>
        <path d={path(1)} fill="none" stroke="#0A2A9A" strokeWidth={bandW} opacity={0.75} filter="url(#bandblur)" />
        <path d={path(1.04)} fill="none" stroke="#3F85FF" strokeWidth={Math.max(2, bandW * 0.12)} opacity={0.85} filter="url(#bandblur)" />
        <path d={path(1.025)} fill="none" stroke="#5B95FF" strokeWidth={1.5} opacity={0.6} />
        {[1.18, 1.34, 1.5].map((rs, i) => <path key={i} d={path(rs)} fill="none" stroke="#555" strokeWidth={1.2} strokeDasharray="12 10" opacity={0.7} />)}
        {labels.map((l) => <line key={`c${l.k}`} x1={p.cx} y1={p.cy} x2={l.X} y2={l.Y} stroke="#A0A0A8" strokeWidth={1} opacity={0.6} />)}
      </svg>
      {labels.map((l) => {
        const w = [...l.word].length * 0.58 * l.h + 0.34 * l.h;
        const cq = Math.max(4, l.h * 0.12);
        return (
          <div key={l.k} style={{position: 'absolute', left: l.X - w / 2, top: l.Y - l.h / 2, width: w, height: l.h, background: 'linear-gradient(240deg, rgba(2,3,10,0.82) 0%, rgba(4,11,51,0.82) 50%, rgba(30,63,192,0.85) 100%)', border: '1px solid rgba(138,138,144,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <span style={{fontFamily: SANS, fontWeight: 500, fontSize: 0.56 * l.h, lineHeight: 1, color: '#fff', whiteSpace: 'pre'}}>{l.word}</span>
            {[[0, 0], [1, 0], [0, 1], [1, 1]].map(([a, b], i) => <div key={i} style={{position: 'absolute', left: a * w - cq / 2 - 1, top: b * l.h - cq / 2 - 1, width: cq, height: cq, background: '#fff'}} />)}
          </div>
        );
      })}
      {n < 211 && <CenterSquare x={p.cx} y={p.cy} size={82} />}{/* 换场帧只留射线图那一个方块（锚点不能出现两个） */}
    </AbsoluteFill>
  );
};

const CenterSquare: React.FC<{x: number; y: number; size: number}> = ({x, y, size}) => (
  <div style={{position: 'absolute', left: x - size / 2, top: y - size / 2, width: size, height: size, background: '#2158FD', padding: size * 0.19, boxSizing: 'border-box', zIndex: 20}}>
    <div style={{width: '100%', height: '100%', background: '#fff'}} />
  </div>
);

// ═════════ 拍 14–19：射线 + 白底面板 + 声波柱 ═════════
const RAY_ANG = [-58, -45, -32, -20, -8, 4, 16, 28, 41, 55].map((a) => (a * Math.PI) / 180);
const CODE_CH = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const sqPos = (n: number) => ({
  x: n <= 233 ? trk(n, [[211, 970], [212, 1012], [213, 1048], [216, 1112], [217, 1126], [221, 1162], [224, 1166], [225, 1172], [226, 1170], [228, 1156], [229, 1146], [230, 1122], [233, 1014]]) : panelEdge(n),
  y: trk(n, [[211, 560], [216, 548], [225, 544], [240, 541]]),
  s: trk(n, [[211, 108], [212, 96], [213, 82], [216, 66], [217, 62], [221, 52], [225, 46], [226, 44], [240, 42]]),
});
const PE: P = [[217, 1830], [218, 1728], [219, 1618], [220, 1504], [221, 1396], [222, 1318], [223, 1270], [224, 1240], [225, 1220], [226, 1204], [227, 1190], [228, 1174], [229, 1156], [230, 1128], [231, 1092], [232, 1050], [233, 1014], [234, 984], [237, 924], [241, 876], [249, 816], [257, 780], [262, 770], [270, 752], [283, 690], [290, 630], [297, 520], [302, 400], [306, 230], [310, 68], [311, 0], [322, -200]];
const panelEdge = (n: number) => (n < 217 ? 99999 : trk(n, PE));
// 射线上的小方块：沿射线往中心流，越近越快；到了就从远处重来
const raySquares = (n: number) => {
  const out: {ray: number; d: number; col: string; code: number; seed: number}[] = [];
  for (let r = 0; r < RAY_ANG.length; r++) for (let j = 0; j < 2; j++) {
    const seed = r * 10 + j;
    let d = 140 + hsh(seed * 3.3) * 760;
    for (let f = 212; f <= n; f++) { d -= 6 + 1500 / (d + 60); if (d < 36) d = 820 + hsh(seed + f) * 300; }
    const c = hsh(seed * 7.7);
    out.push({ray: r, d, col: c < 0.4 ? '#FAC84A' : c < 0.75 ? '#2258FB' : '#FFFFFF', code: hsh(seed * 5.5) < 0.55 ? 1 : 0, seed});
  }
  return out;
};
const codeAt = (seed: number, n: number) => Array.from({length: 4}, (_, i) => {
  const base = Math.floor(hsh(seed * 9.1 + i) * CODE_CH.length);
  let o = 0;
  for (let f = 211; f <= n; f += 2) o += hsh(seed + i * 3.1 + f * 0.7) < 0.5 ? -1 : 1;
  return CODE_CH[(((base + o) % CODE_CH.length) + CODE_CH.length) % CODE_CH.length];
}).join('');

const RayShot: React.FC<{n: number}> = ({n}) => {
  const q = sqPos(n);
  return (
    <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
      {RAY_ANG.map((a, i) => <line key={i} x1={q.x - Math.cos(a) * 30} y1={q.y + Math.sin(a) * 30} x2={q.x - Math.cos(a) * 2600} y2={q.y + Math.sin(a) * 2600} stroke="#B9B5D6" strokeWidth={2.4} strokeDasharray="0 12" strokeLinecap="round" opacity={0.85} />)}
      {raySquares(n).map((s, i) => {
        const a = RAY_ANG[s.ray];
        const x = q.x - Math.cos(a) * s.d, y = q.y + Math.sin(a) * s.d;
        const deg = (-a * 180) / Math.PI;
        return (
          <g key={i} transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${deg.toFixed(1)})`}>
            <rect x={-6} y={-6} width={12} height={12} fill={s.col} />
            {s.code ? <text x={-10} y={-10} fontSize={10} fill={s.col} fontFamily="monospace" transform="rotate(180)">{codeAt(s.seed, n)}</text> : null}
          </g>
        );
      })}
    </svg>
  );
};

// 声波柱：槽位钉在面板上，越往右越稀；高度图案每帧右移一格（按输出秒流，停留时也在流）
const WaveShot: React.FC<{n: number; t: number}> = ({n, t}) => {
  const edge = panelEdge(n);
  if (edge > W) return null;
  const K = trk(n, [[217, 0.03], [258, 0.1], [283, 0.18], [298, 0.4], [308, 0.9], [322, 1.2]]);
  const amp = trk(n, [[217, 22], [236, 22], [238, 26], [243, 50], [248, 110], [255, 260], [258, 400], [278, 490], [300, 520], [322, 540]]);
  const phase = t * FPS;
  const strobePat = 'WBBBWWWBWBBW';
  const dark = n >= 311 && strobePat[Math.min(11, n - 311)] === 'B';
  const S = n >= 311 ? trk(n, [[311, 1], [314, 1.6], [316, 2.6], [318, 4.4], [319, 5.6], [320, 9], [321, 18], [322, 30]]) : 1;
  const sy = Math.min(3.6, Math.pow(S, 0.75)); // 柱子变高但不变粗（原片推进时柱子始终是细线）
  const piv = 1350; // 推进的中心在右边高柱那一段（原片是冲进最高的柱子里）
  const tx = (x: number) => piv + (x - piv) * S;
  const ty = (y: number) => 541 + (y - 541) * sy;
  const bars: React.ReactNode[] = [];
  let x = edge + 30;
  for (let i = 0; i < 160 && x < W + 400; i++) {
    const env = Math.pow(clamp(i / 26), 1.4);
    const u = i - phase;
    const w = 0.5 + 0.28 * Math.sin(u * 0.43) + 0.17 * Math.sin(u * 0.17 + 1.3) + 0.1 * Math.sin(u * 1.13 + 0.4);
    const small = 12 + 18 * (0.5 + 0.5 * Math.sin(u * 0.9));
    const hb = n < 236 ? 22 : lerp(n < 238 ? 22 : small, amp * clamp(w, 0.05, 1), env);
    const X = tx(x), bw = 8.5 * Math.min(1.6, Math.pow(S, 0.15));
    if (X > -bw && X < W + bw) bars.push(<rect key={i} x={X - bw / 2} y={ty(541 - hb / 2)} width={bw} height={hb * sy} fill={dark ? '#EDEDED' : BLUE} />);
    x += 22 * (1 + K * Math.pow(i / 40, 2));
  }
  const grid: React.ReactNode[] = [];
  for (let gx = edge + 119; gx < W + 2000; gx += 120) { const X = tx(gx); if (X > -2 && X < W + 2) grid.push(<line key={`gx${gx}`} x1={X} y1={0} x2={X} y2={H} stroke={dark ? '#2a2a2a' : '#6f6f6f'} strokeWidth={1} strokeDasharray="3 4" />); }
  for (let gy = 123; gy < H; gy += 120) { const Y = ty(gy); if (Y > -2 && Y < H + 2) grid.push(<line key={`gy${gy}`} x1={Math.max(0, tx(edge))} y1={Y} x2={W} y2={Y} stroke={dark ? '#2a2a2a' : '#6f6f6f'} strokeWidth={1} strokeDasharray="3 4" />); }
  return (
    <>
      <div style={{position: 'absolute', left: Math.max(0, tx(edge)), top: 0, right: 0, bottom: 0, background: dark ? '#030303' : '#fff'}} />
      <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>{grid}{bars}</svg>
    </>
  );
};

const PanelShot: React.FC<{n: number; t: number}> = ({n, t}) => {
  const q = sqPos(n);
  return (
    <AbsoluteFill style={{background: n === 211 ? 'transparent' : '#000'}}>
      {n < 311 && <RayShot n={n} />}
      <WaveShot n={n} t={t} />
      {n < 311 && q.x > -60 && <CenterSquare x={q.x} y={q.y} size={q.s} />}
    </AbsoluteFill>
  );
};

// ═════════ 整组 ═════════
export type TagRingProps = {inputs?: TagRingInputs; extras?: number[]};
export const TagDecodeRingWaveGroup: React.FC<TagRingProps> = ({inputs = TAG_RING_DEFAULT_INPUTS, extras = [0, 0, 0, 0]}) => {
  const C = TAG_DECODE_RING_WAVE_CONTRACT;
  const t = useCurrentFrame() / FPS;
  const s = toSource(t, C, extras);
  const n = Math.round(s * FPS * 1000) / 1000;
  const ni = Math.round(n);
  const held = t - s;
  const drift = held > 0 ? `scale(${(1 + 0.015 * held).toFixed(5)}) translate(${(8 * Math.sin(held * 0.9)).toFixed(2)}px, ${(5 * Math.sin(held * 0.7 + 1)).toFixed(2)}px)` : undefined;
  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: drift, transformOrigin: '960px 540px'}}>
        {ni <= 86 && <GridShot n={ni} x={inputs} />}
        {ni >= 87 && ni <= 211 && <RingShot n={n} t={t} x={inputs} />}
        {ni >= 211 && <PanelShot n={ni} t={t} />}
      </AbsoluteFill>
      {ni < 217 && <Vignette strength={0.1} color="#000208" inner={0.6} />}
      <Grain opacity={0.04} step={2} blend="soft-light" />
    </AbsoluteFill>
  );
};

export const TagDecodeRingWave: React.FC = () => <TagDecodeRingWaveGroup />;

if (checkContract(TAG_DECODE_RING_WAVE_CONTRACT).length) throw new Error(checkContract(TAG_DECODE_RING_WAVE_CONTRACT).join('; '));
