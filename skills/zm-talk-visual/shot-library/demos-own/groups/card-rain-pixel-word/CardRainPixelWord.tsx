// 【镜头组】card-rain-pixel-word：一部斜着冲到镜头前的手机被抛起、落下 → 硬切成上百张小手机卡片从顶上洒下、堆满整屏 →
//   卡片一张张瞬间消失、白/蓝/黄故障像素块乱跳 → 几块白块原地停住、长成笔画，拼出一个大字（030-A 一串）
// 学的动作（ab_workss · Pulse 发布片 0–5.2s，30fps 逐帧看过；时间表 shot-lab/refs/030-A/逐元素时间表.md，看片助手另写）：
//   镜头 A（0–0.967）：手机从小、逆时针 26° 一帧冲到镜头前（3 帧完成 80%），框线（2 横 2 竖贯穿全屏 + 白交点）从大框收紧套住手机；
//     屏幕上一层蓝→紫粉色调从下往上刷走；0.53s 到最高点，然后像被抛起后落下，越落越快、顺时针越转越快，框线跟着一起掉。
//   1.000 硬切（切在下落最快的一帧）：同一列的画面顶上掉下一堆小手机 → 有重力、落地滑行、后来的盖在上面，堆成小山 → 两边 → 填满（2.5s）；
//     内缩 50px 的画框按 下→左→右→上 依次画出；2.233 很多卡同时换内容；2.7s 起画框慢慢外扩。
//   3.1–4.0：卡片一张张一帧消失（随机，中间略先）；白/蓝/黄实心矩形块冒出，每 2–3 帧瞬移或变形（低帧率故障）；3.37 背景变纯黑；
//     画框闪白、断成几段、出画；3.63 起第二波稀疏卡片一张张冒出、被镜头推近冲散、又一张张消失。
//   3.9–4.833：白块原地停住、长成笔画（多数往下长，有的往上长、横着长），大体从左到右、彼此重叠；整词以画面中心推近（4.0–4.4 ×1.33）；
//     最后一个部件 4.833 一帧出现，同时一块蓝块在第一个字后面每 2 帧往上跳一格扫过、消失；底部蓝辉光升起。
// 我们的内容：中性日常的"生活笔记"（早餐、绿植、海边、读书……），卡片画面是代码画的插画色块 + 中文小字，不用照片、不出现品牌；
//   大字「万千灵感」。汉字的笔画走向因字而异，所以"长笔画"做成每个字 3 段（左列往下 / 右上横着 / 右下往上或往右）按字形裁切显出，任意中文都能用。
//
// 拍表（源秒，30fps；结尾比原片多 0.9s 停在干净的大字卡上）
//   拍 1 手机冲到镜头前   0.00–0.30   PHONE_IN
//   拍 2 悬停（停留点 0.45）0.30–0.55
//   拍 3 抛落              0.55–1.00   DROP（1.000 硬切）
//   拍 4 卡片雨            1.00–2.60   RAIN（2.5 满屏）
//   拍 5 满屏（停留点 2.9） 2.60–3.10
//   拍 6 消失 + 故障块     3.10–3.63   GLITCH（3.37 背景变黑）
//   拍 7 第二波推近        3.63–4.00
//   拍 8 长笔画拼字        3.90–4.83   WORD
//   拍 9 蓝块扫过 → 干净字卡 4.83–6.10（停留点 5.8）
// 毛病清单：
//   - 通用：画面永远不停（停留区按输出秒慢推）；猛动作 ≤3 帧不回弹；文字推近用 --hq，字层单独成层；确定性（不用 Math.random）
//   - 独有 1：手机→卡片雨必须是硬切、切在手机下落最快的一帧；卡片从手机掉出的那一列先掉下来（动作接戏）
//   - 独有 2：卡片消失是"一帧整张没了"，不缩不淡；故障块是另外冒出来的实心直角块，2–3 帧一跳，不平滑
//   - 独有 3：笔画是"长出来"的（出现时 30%，第一帧涨最多），不是淡入；最后一块单独一帧冒出，再蓝块扫过
//   - 独有 4：卡片后掉的盖在先掉的上面；后掉的不会穿过已经堆好的卡（按堆的高度从下往上分配落点）
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {EASE, FONT, Grain, Vignette} from '../../../kit/polish';
import {GroupContract, checkContract, checkInputs, outputDuration, planExtras, toSource} from '../../../kit/groupClock';

const W = 1920, H = 1080, FPS = 30;
const SANS = `"PingFang SC", "Noto Sans CJK SC", "Noto Sans SC", ${FONT.sans}`;
const BLUE = '#235CFA', YELLOW = '#FAC84B';
const clamp = (x: number) => Math.max(0, Math.min(1, x));
const rs = (t: number, a: number, d: number, e: (x: number) => number = EASE.out) => e(clamp((t - a) / Math.max(1e-6, d)));
const hsh = (n: number) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const fr = (t: number) => Math.floor(t * FPS + 1e-6); // 源秒 → 帧号（故障块按帧跳）

// 单调三次样条：pts = [秒, 值]
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
export const CARD_RAIN_PIXEL_WORD_CONTRACT: GroupContract = {
  sourceDuration: 6.1,
  fps: 30,
  motion: [[0, 0.35], [0.55, 2.7], [3.1, 5.05]],
  holds: [
    {at: 0.45, maxExtra: 0.6}, // 手机悬停在最高点（看清手机屏幕）
    {at: 2.9, maxExtra: 1.0}, // 卡片堆满整屏（"看满"）
    {at: 5.8, maxExtra: 2.0}, // 结尾干净的大字卡
  ],
  landmarks: {phoneIn: 0, peak: 0.53, cut: 1.0, full: 2.5, swap: 2.233, vanish: 3.13, black: 3.367, wave2: 3.633, stroke1: 3.9, last: 4.833, clean: 5.033},
  sfx: [
    {at: 'phoneIn', type: '短促 whoosh-in（手机冲到镜头前）', volume: 0.4},
    {at: 'cut', type: '一堆手机落下的密集 clatter（持续到 2.5s 渐弱）', tail: 1.5, volume: 0.45},
    {at: 'vanish', type: '数字故障 glitch tick 串', tail: 0.5, volume: 0.35},
    {at: 'black', type: '低频 drop / 静一下', volume: 0.3},
    {at: 'stroke1', type: '极轻 tick × 若干（笔画长出）', volume: 0.25},
    {at: 'last', type: '清脆 blip（最后一块 + 蓝块扫过）', tail: 0.4, volume: 0.4},
  ],
  inputs: {
    word: {maxChars: 6},
    phoneTitle: {maxChars: 8},
    phoneNote: {maxChars: 14},
    notes: {count: 12, maxChars: 5},
  },
};

export type CardRainInputs = {
  word: string; // 最后拼出的大字
  phoneTitle: string; // 开场手机上那条笔记的标题
  phoneNote: string; // 标题下一行小字
  phoneUser?: string; // 左下用户名
  notes: string[]; // 12 种小卡片的标题（卡片插画按顺序：早餐、绿植、海边、读书、咖啡、山路、晚霞、猫、花市、雪山、便当、夜跑）
};
export const CARD_RAIN_DEFAULT_INPUTS: CardRainInputs = {
  word: '万千灵感',
  phoneTitle: '周末的早餐桌',
  phoneNote: '煎蛋、吐司和一杯手冲',
  phoneUser: '@小满的厨房',
  notes: ['今天的早餐', '阳台绿萝', '海边散步', '读完一本', '手冲咖啡', '周末爬山', '傍晚的天', '楼下的猫', '花市一角', '雪山徒步', '带饭日记', '夜跑五公里'],
};
export function checkCardRainInputs(x: CardRainInputs): string[] {
  return checkInputs(CARD_RAIN_PIXEL_WORD_CONTRACT, {word: x.word, phoneTitle: x.phoneTitle, phoneNote: x.phoneNote, notes: x.notes});
}
export const planCardRain = (sec: number) => planExtras(CARD_RAIN_PIXEL_WORD_CONTRACT, sec);
export const cardRainFrames = (extras: number[]) => Math.round(outputDuration(CARD_RAIN_PIXEL_WORD_CONTRACT, extras) * FPS);

export const CARD_RAIN_PIXEL_WORD_DURATION = 183;

// ═════════ 星空 ═════════
const STARS = Array.from({length: 240}, (_, i) => ({x: hsh(i * 3.1) * W, y: hsh(i * 5.7 + 2) * H, r: 0.6 + hsh(i * 9.3) * 1.1, a: 0.25 + hsh(i * 2.9 + 7) * 0.45}));
const Stars: React.FC<{s: number; t: number}> = ({s, t}) => {
  // A：每帧 +2,−2；B：每帧 +3.5,+0.5；3.6 起从画面中心往外辐射（推近）
  const zoom = s < 3.6 ? 1 : 1 + 0.55 * Math.pow(clamp((s - 3.6) / 0.4), 2) + 0.2 * clamp((s - 4.0) / 2.1) + 0.006 * (t - s);
  return (
    <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
      {STARS.map((p, i) => {
        let x: number, y: number;
        if (s < 1.0) { x = p.x + 60 * t; y = p.y - 60 * t; } else { x = p.x + 105 * Math.min(t, 3.6) + 0 * t; y = p.y + 15 * Math.min(t, 3.6); }
        x = ((x % W) + W) % W; y = ((y % H) + H) % H;
        x = W / 2 + (x - W / 2) * zoom; y = H / 2 + (y - H / 2) * zoom;
        return <circle key={i} cx={x} cy={y} r={p.r} fill="#c8cbd8" opacity={p.a} />;
      })}
    </svg>
  );
};

// ═════════ 小卡片的插画（代替原片短视频画面）═════════
const NOTE_ART: {bg: [string, string]; draw: (k: number) => React.ReactNode; light?: boolean}[] = [
  {bg: ['#f1c48a', '#c9783e'], draw: (k) => (<><circle cx="50" cy="78" r="30" fill="#fff" /><circle cx="50" cy="78" r="12" fill="#f5b52e" /><rect x="14" y="112" width="40" height="22" rx="5" fill="#d99a5b" /><path d={`M70 ${54 - k * 3} q4 -6 0 -12`} stroke="#fff" strokeWidth="2" fill="none" opacity="0.8" /></>)}, // 早餐
  {bg: ['#9fcf96', '#3f7d47'], draw: (k) => (<><rect x="38" y="110" width="24" height="26" rx="4" fill="#c97a4a" /><path d={`M50 110 Q${30 + k * 2} 80 26 62 M50 110 Q${66 - k * 2} 78 74 58 M50 110 Q50 80 50 54`} stroke="#3f8a4a" strokeWidth="6" fill="none" strokeLinecap="round" /></>)}, // 绿植
  {bg: ['#ffc59a', '#ff8f7a'], draw: (k) => (<><circle cx="50" cy={70 + k * 2} r="18" fill="#fff1c2" /><rect x="0" y="96" width="100" height="44" fill="#4f7fc7" /><rect x="10" y="106" width="44" height="3" fill="#bcd3f5" /><rect x="50" y="118" width="36" height="3" fill="#bcd3f5" /></>)}, // 海边
  {bg: ['#c9b79c', '#7d6a52'], draw: () => (<><rect x="20" y="60" width="60" height="76" rx="3" fill="#2f6b5e" /><rect x="26" y="66" width="48" height="64" rx="2" fill="#f6f1e6" /><rect x="32" y="76" width="36" height="3" fill="#9a9182" /><rect x="32" y="84" width="30" height="3" fill="#9a9182" /><rect x="32" y="92" width="34" height="3" fill="#9a9182" /></>)}, // 读书
  {bg: ['#caa27c', '#7d5539'], draw: (k) => (<><rect x="30" y="80" width="40" height="44" rx="6" fill="#fff" /><rect x="34" y="84" width="32" height="12" rx="3" fill="#6b3f22" /><path d={`M44 ${70 - k * 2} q4 -6 0 -12 M56 ${70 - k * 2} q4 -6 0 -12`} stroke="#fff" strokeWidth="2" fill="none" opacity="0.8" /></>)}, // 咖啡
  {bg: ['#7fb8d8', '#2f6b55'], draw: () => (<><path d="M0 120 L36 70 L60 100 L80 76 L100 104 V180 H0Z" fill="#4c8a6a" /><path d="M36 70 L28 82 L44 82Z" fill="#fff" /><path d="M10 180 Q40 140 60 150 T90 130" stroke="#e8d7b0" strokeWidth="5" fill="none" /></>)}, // 山路
  {bg: ['#7d6bd6', '#f39ab8'], draw: (k) => (<><circle cx={64 - k * 2} cy="64" r="14" fill="#ffe2b8" /><rect x="8" y="104" width="16" height="40" fill="#3b3466" /><rect x="28" y="92" width="20" height="52" fill="#463d7a" /><rect x="52" y="110" width="14" height="34" fill="#3b3466" /><rect x="70" y="98" width="22" height="46" fill="#463d7a" /></>)}, // 晚霞
  {bg: ['#8a8f99', '#4a4f5a'], draw: (k) => (<><ellipse cx="50" cy="108" rx="26" ry="20" fill="#9a8f84" /><circle cx="50" cy="80" r="16" fill="#9a8f84" /><path d="M38 70 L40 58 L47 67Z M62 70 L60 58 L53 67Z" fill="#9a8f84" /><rect x={44 + k} y="78" width="3" height="3" fill="#2c2f3c" /><rect x={53 + k} y="78" width="3" height="3" fill="#2c2f3c" /></>)}, // 猫
  {bg: ['#fde3ea', '#f6b6c9'], draw: (k) => (<>{[0, 1, 2, 3, 4].map((j) => <circle key={j} cx={22 + j * 14} cy={84 + (j % 2) * 14 + k} r="9" fill={['#ff6f91', '#ffd166', '#ef476f', '#f78fb3', '#ffb3c6'][j]} />)}<rect x="20" y="110" width="60" height="28" rx="4" fill="#7fb069" /></>)}, // 花市
  {bg: ['#f7fbff', '#d7e7f7'], light: true, draw: () => (<><path d="M0 130 L30 76 L46 98 L66 62 L100 120 V180 H0Z" fill="#9db9d6" /><path d="M66 62 L56 80 L74 80Z M30 76 L24 88 L37 88Z" fill="#fff" /></>)}, // 雪山
  {bg: ['#e9a35b', '#b4602d'], draw: () => (<><rect x="16" y="66" width="68" height="64" rx="8" fill="#3b3f4a" /><rect x="22" y="72" width="28" height="52" rx="4" fill="#fff" /><circle cx="64" cy="86" r="10" fill="#ef6f4a" /><rect x="54" y="102" width="24" height="20" rx="4" fill="#7cc06b" /></>)}, // 便当
  {bg: ['#1f2a44', '#3b4f7a'], draw: (k) => (<><circle cx={30 + k * 4} cy="96" r="8" fill="#ffd166" /><path d="M0 150 L100 120" stroke="#e8edf5" strokeWidth="3" strokeDasharray="8 6" /><circle cx="76" cy="50" r="10" fill="#e8edf5" opacity="0.8" /></>)}, // 夜跑
];

// 一张小卡片（竖着的小手机，100×180；屏幕插画 + 标题 + 右侧图标 + 用户名）
const CW = 100, CH = 180;
const NoteCard: React.FC<{d: number; title: string; k: number; id: string; ph?: number}> = ({d, title, k, id, ph = 0}) => {
  const a = NOTE_ART[d % NOTE_ART.length];
  const ink = a.light ? '#2c2f3c' : '#ffffff';
  return (
    <svg width={CW} height={CH} viewBox={`0 0 ${CW} ${CH}`} style={{display: 'block', overflow: 'visible'}}>
      <defs>
        <linearGradient id={`g${id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={a.bg[0]} /><stop offset="1" stopColor={a.bg[1]} /></linearGradient>
        <linearGradient id={`s${id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#000" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity={a.light ? 0.12 : 0.5} /></linearGradient>
        <clipPath id={`c${id}`}><rect x="3" y="3" width={CW - 6} height={CH - 6} rx="12" /></clipPath>
      </defs>
      <rect width={CW} height={CH} rx="15" fill="#0d0f16" />
      <g clipPath={`url(#c${id})`}>
        <rect width={CW} height={CH} fill={`url(#g${id})`} />
        <g transform={`translate(${(7 * Math.sin(ph * 3.1)).toFixed(2)} ${(5 * Math.cos(ph * 2.6)).toFixed(2)}) scale(1.1)`}>{a.draw(k)}</g>
        <rect y={CH * 0.55} width={CW} height={CH * 0.45} fill={`url(#s${id})`} />
        <text x="8" y={CH - 22} fontSize="10.5" fontWeight={600} fill={ink} fontFamily={SANS}>{title}</text>
        <circle cx="12" cy={CH - 11} r="4" fill={ink} opacity="0.85" />
        <rect x="19" y={CH - 13} width="30" height="3.5" rx="1.7" fill={ink} opacity="0.7" />
        <g fill="none" stroke={ink} strokeWidth="1.4" opacity="0.9">
          <path d={`M88 ${CH - 70} c-3 -4 -8 0 -4 4 l4 4 l4 -4 c4 -4 -1 -8 -4 -4z`} />
          <circle cx="88" cy={CH - 52} r="4" />
          <path d={`M84 ${CH - 36} l8 -4 l-2 8z`} />
        </g>
      </g>
      <rect x="35" y="8" width="30" height="9" rx="4.5" fill="#0d0f16" />
    </svg>
  );
};

// ═════════ 卡片雨（确定性"物理"：每张卡一个落点，按堆的高度从下往上分配出场顺序）═════════
type Card = {ts: number; x0: number; y0: number; vy0: number; T: number; xL: number; xR: number; yR: number; aF: number; aR: number; d: number; d2: number; swap: boolean; tv: number; settle: number};
const G = 5400; // px/s²（原片约 6px/帧²）
const CARDS: Card[] = (() => {
  const pts: {x: number; y: number; a: number; i: number}[] = [];
  const cols = 13, rows = 9; // 约 129 张：堆满后卡和卡之间还露一点黑缝（原片也是）
  let i = 0;
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const a = (hsh(i * 7.3) < 0.5 ? 90 : -90) + (hsh(i * 4.1 + 1) - 0.5) * 120 + (hsh(i * 8.7) < 0.12 ? 90 : 0);
    const rad = (a * Math.PI) / 180, hh = (CW * Math.abs(Math.sin(rad)) + CH * Math.abs(Math.cos(rad))) / 2;
    const x = 50 + ((c + 0.5 + (r % 2) * 0.5) / cols) * 1820 + (hsh(i * 3.3 + 5) - 0.5) * 70; // 隔行错半格，不留竖直的缝
    let y = 50 + ((r + 0.5) / rows) * 980 + (hsh(i * 6.1 + 9) - 0.5) * 60;
    if (r === rows - 1) y = 1030 - hh + 2;
    pts.push({x, y, a, i}); i++;
  }
  for (let j = 0; j < 12; j++) pts.push({x: 120 + hsh(j * 11.1) * 1680, y: 120 + hsh(j * 13.7) * 820, a: 90 + (hsh(j * 2.2) - 0.5) * 100, i: i++});
  // 出场顺序：先底下、先中间（堆成小山），再往两边、往上
  const key = (p: {x: number; y: number; i: number}) => (1030 - p.y) / 980 + 0.42 * Math.abs(p.x - 1015) / 960 + (hsh(p.i * 1.7 + 3) - 0.5) * 0.16;
  pts.sort((a, b) => key(a) - key(b));
  const N = pts.length;
  return pts.map((p, k) => {
    const ts = 0.78 + 1.68 * Math.pow(k / (N - 1), 1.05);
    const spread = 0.28 + 0.67 * clamp((ts - 0.95) / 0.95);
    const x0 = 1015 + (p.x - 1015) * spread + (hsh(k * 5.5) - 0.5) * 90;
    const y0 = -150 - hsh(k * 9.9) * 70;
    const vy0 = 300 + hsh(k * 4.4 + 2) * 2100;
    const dist = p.y - y0;
    const T = (-vy0 + Math.sqrt(vy0 * vy0 + 2 * G * dist)) / G;
    const bottom = p.y > 900;
    const dx = p.x - 1015; // 落地后往外滑：离中线越近滑得越少（否则中线会被让出一条缝）
    const slide = bottom ? Math.sign(dx) * Math.min(Math.abs(dx) * 0.5, 90 + hsh(k * 3.7) * 140) : Math.sign(dx) * Math.min(Math.abs(dx) * 0.25, hsh(k * 2.3) * 40);
    const xL = p.x - slide;
    const d = Math.floor(hsh(k * 12.9 + 4) * 12);
    const cx = (p.x - 960) / 960, cy = (p.y - 540) / 540;
    const edge = clamp(Math.max(Math.abs(cx), Math.abs(cy)));
    // 消失时刻：按原片逐 0.1s 的剩余量反推（3.2 剩 94%、3.3 84%、3.4 62%、3.5 34%、3.6 20%、3.7 10%），角上的略晚
    const q = clamp(0.8 * hsh(k * 15.3 + 1) + 0.2 * edge * edge);
    const tv = trk(q, [[0, 3.13], [0.08, 3.2], [0.2, 3.3], [0.45, 3.4], [0.7, 3.5], [0.84, 3.6], [0.92, 3.7], [0.98, 3.9], [1, 4.0]]);
    return {ts, x0, y0, vy0, T, xL, xR: p.x, yR: p.y, aF: p.a + (hsh(k * 6.6) - 0.5) * 70, aR: p.a, d, d2: (d + 5) % 12, swap: hsh(k * 17.7) < 0.55, tv, settle: ts > 1.7 ? (hsh(k * 19.3) < 0.5 ? 1 : 0.4) : 0};
  });
})();

const cardState = (c: Card, s: number) => {
  const u = s - c.ts;
  if (u < 0) return null;
  if (u < c.T) {
    const y = c.y0 + c.vy0 * u + 0.5 * G * u * u;
    const x = c.x0 + (c.xL - c.x0) * (u / c.T);
    return {x, y, a: c.aF, vy: c.vy0 + G * u};
  }
  const v = u - c.T;
  const x = c.xL + (c.xR - c.xL) * rs(v, 0, 0.35, EASE.out);
  const bounce = -9 * Math.sin(Math.PI * clamp(v / 0.13)) * (1 - clamp(v / 0.13));
  const a = c.aF + (c.aR - c.aF) * rs(v, 0, 0.16, EASE.out);
  const st = c.settle * EASE.smooth(clamp((s - 2.45) / 0.65)); // 堆满后慢慢沉降
  return {x: x + st * 4 * Math.sign(c.xR - 960), y: c.yR + bounce + st * 6, a: a + st * 2.2, vy: 0};
};

const CardRain: React.FC<{s: number; t: number; x: CardRainInputs}> = ({s, t, x}) => {
  const k = Math.floor(t * 6) % 3; // 卡里"视频在播"：插画里的小东西每 1/6 秒挪一下
  return (
    <>
      {CARDS.map((c, i) => {
        if (s >= c.tv) return null;
        const st = cardState(c, s);
        if (!st || st.y < -160) return null;
        const d = c.swap && s >= 2.233 ? c.d2 : c.d;
        const blur = Math.min(1.4, st.vy / 2400); // 只有掉得最快时一点点纵向虚（原片卡片基本是实的）
        return (
          <div key={i} style={{position: 'absolute', left: st.x - CW / 2, top: st.y - CH / 2, width: CW, height: CH, transform: `rotate(${st.a.toFixed(2)}deg)`, filter: blur > 0.4 ? `blur(${blur.toFixed(1)}px)` : undefined}}>
            <NoteCard d={d} title={x.notes[d % x.notes.length]} k={(k + i) % 3} id={`r${i}`} ph={t + i * 0.37} />
          </div>
        );
      })}
    </>
  );
};

// 第二波：稀疏散开的卡一张张冒出 → 被镜头推近冲散 → 一张张消失
const WAVE2 = Array.from({length: 28}, (_, i) => {
  const c = i % 7, r = Math.floor(i / 7);
  return {
    x: 150 + (c + 0.5) * (1620 / 7) + (hsh(i * 3.9) - 0.5) * 120,
    y: 130 + (r + 0.5) * (820 / 4) + (hsh(i * 7.7) - 0.5) * 90,
    a: (hsh(i * 2.1) - 0.5) * 120 + (hsh(i * 5.3) < 0.5 ? 90 : 0),
    on: 3.633 + Math.floor(hsh(i * 9.1) * 6) / FPS,
    off: 3.833 + Math.floor(hsh(i * 4.7) * 7) / FPS,
    d: Math.floor(hsh(i * 6.3) * 12),
  };
});
const Wave2: React.FC<{s: number; x: CardRainInputs}> = ({s, x}) => {
  if (s < 3.63 || s > 4.1) return null;
  const p = clamp((s - 3.633) / 0.4);
  const Z = 1 + 0.8 * Math.pow(p, 2.2); // 位置推开（加速）
  const S = 1.07 + 0.08 * p; // 卡片本身只大一点点（视差）
  return (
    <>
      {WAVE2.map((c, i) => {
        if (s < c.on || s >= c.off) return null;
        const px = W / 2 + (c.x - W / 2) * Z, py = H / 2 + (c.y - H / 2) * Z;
        return (
          <div key={i} style={{position: 'absolute', left: px - CW / 2, top: py - CH / 2, width: CW, height: CH, transform: `rotate(${c.a.toFixed(1)}deg) scale(${S.toFixed(3)})`}}>
            <NoteCard d={c.d} title={x.notes[c.d % x.notes.length]} k={0} id={`w${i}`} ph={s + i * 0.41} />
          </div>
        );
      })}
    </>
  );
};

// ═════════ 故障块（白 / 蓝 / 黄实心直角矩形，2–3 帧一跳）═════════
type Blk = {b: number; e: number; col: string; per: number; seed: number; avoid: boolean};
const BLOCKS: Blk[] = (() => {
  const out: Blk[] = [];
  // 3.1–3.9：主故障段，同屏 6–9 个
  for (let i = 0; i < 22; i++) {
    const b = 3.1 + (i / 22) * 0.8 + hsh(i * 2.7) * 0.05;
    const col = i === 0 ? BLUE : b > 3.73 && hsh(i * 5.1) < 0.3 ? YELLOW : hsh(i * 3.3) < 0.15 ? BLUE : '#ffffff';
    out.push({b, e: b + 0.18 + hsh(i * 4.9) * 0.32, col, per: hsh(i * 8.1) < 0.5 ? 2 : 3, seed: i * 13.1, avoid: b > 3.6});
  }
  // 4.0–4.6：字外四周零星几块，4.67 前清空
  for (let i = 0; i < 7; i++) {
    const b = 4.0 + i * 0.08;
    out.push({b, e: Math.min(4.66, b + 0.2 + hsh(i * 6.9) * 0.2), col: i === 3 ? YELLOW : i % 3 === 1 ? BLUE : '#ffffff', per: 3, seed: 400 + i * 7.7, avoid: true});
  }
  return out;
})();
const SHAPES: [number, number][] = [[7, 7], [20, 20], [24, 23], [56, 56], [64, 60], [102, 102], [330, 18], [119, 16], [107, 24], [92, 16], [290, 62], [436, 94], [17, 58], [26, 162], [37, 144], [75, 24], [36, 24]];
const blockAt = (k: Blk, s: number) => {
  if (s < k.b || s >= k.e) return null;
  const f0 = fr(k.b), f = fr(s);
  const step = Math.floor((f - f0) / k.per);
  // 每一步：跳位置 / 变形 / 原地漂移
  let sx = hsh(k.seed) * 1700 + 60, sy = hsh(k.seed + 1) * 900 + 60;
  let [w, h] = SHAPES[Math.floor(hsh(k.seed + 2) * SHAPES.length)];
  for (let j = 1; j <= step; j++) {
    const r = hsh(k.seed + j * 3.3);
    if (r < 0.42) { sx = hsh(k.seed + j * 5.1) * 1700 + 60; sy = hsh(k.seed + j * 7.9) * 900 + 60; }
    else if (r < 0.72) { const q = hsh(k.seed + j * 2.2); if (q < 0.5) w = Math.min(440, w * (2 + q * 4)); else h = Math.min(w < 40 ? 170 : 70, h * (1.6 + q * 2)); if (w > 300 && h > 60) h = 60; }
    else if (r < 0.85) { [w, h] = [h, w]; }
  }
  const drift = (f - f0 - step * k.per) * (hsh(k.seed + 9) - 0.5) * 18;
  let x = sx + drift, y = sy;
  if (k.avoid && x + w > 440 && x < 1480 && y + h > 360 && y < 730) y = y < 540 ? 360 - h - 20 : 750; // 不压在字上
  if (k.col === BLUE || s > 3.75) { w = Math.min(w, 120); h = Math.min(h, 80); } // 蓝块和后段的块都小（原片蓝块最大 112×60）
  return {x, y, w, h};
};
const Blocks: React.FC<{s: number}> = ({s}) => (
  <>
    {BLOCKS.map((k, i) => {
      const r = blockAt(k, s);
      return r ? <div key={i} style={{position: 'absolute', left: r.x, top: r.y, width: r.w, height: r.h, background: k.col}} /> : null;
    })}
  </>
);

// ═════════ 画框（镜头 B：内缩 50px，下→左→右→上依次画出；2.7 起外扩、3.37 闪白断开、出画）═════════
const FrameB: React.FC<{s: number}> = ({s}) => {
  if (s < 1.03 || s > 3.75) return null;
  const ex = Math.pow(clamp((s - 2.7) / 1.03), 2.4);
  const L = 50 - 52 * ex, R = 1869 + 53 * ex, T = 50 - 52 * ex, B = 1030 + 52 * ex;
  const flash = s >= 3.367;
  const col = flash ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.47)';
  const segs = (len: number, salt: number): [number, number][] => {
    if (!flash) return [[0, len]];
    const k = Math.floor(fr(s) / 2);
    const out: [number, number][] = [];
    let p = 0;
    while (p < len) { const seg = 200 + hsh(salt + k * 3.1 + p) * 500; out.push([p, Math.min(len, p + seg)]); p += seg + 25 + hsh(salt + k + p * 0.7) * 80; }
    return out;
  };
  const draw = (a: number, d: number) => rs(s, a, d, EASE.snappy);
  const pb = draw(1.033, 0.1), pl = draw(1.3, 0.167), pr = draw(1.5, 0.233), pt = draw(1.933, 0.2);
  const lines: React.ReactNode[] = [];
  // 下横：从右往左
  if (pb > 0) segs(W, 1).forEach(([a, b], j) => { const x0 = W - pb * W; const aa = Math.max(a, x0); if (b > aa) lines.push(<div key={`b${j}`} style={{position: 'absolute', left: aa, top: B, width: b - aa, height: 1.5, background: col}} />); });
  if (pl > 0) segs(H, 2).forEach(([a, b], j) => { const bb = Math.min(b, pl * H); if (bb > a) lines.push(<div key={`l${j}`} style={{position: 'absolute', left: L, top: a, width: 1.5, height: bb - a, background: col}} />); });
  if (pr > 0) segs(H, 3).forEach(([a, b], j) => { const y0 = H - pr * H; const aa = Math.max(a, y0); if (b > aa) lines.push(<div key={`r${j}`} style={{position: 'absolute', left: R, top: aa, width: 1.5, height: b - aa, background: col}} />); });
  if (pt > 0) segs(W, 4).forEach(([a, b], j) => { const bb = Math.min(b, pt * W); if (bb > a) lines.push(<div key={`t${j}`} style={{position: 'absolute', left: a, top: T, width: bb - a, height: 1.5, background: col}} />); });
  const dots: [number, number, boolean][] = [[L, B, pb > 0.97 && pl > 0.97], [R, B, pb > 0.97 && pr > 0.5], [L, T, pl > 0.2 && pt > 0.1], [R, T, pr > 0.97 && pt > 0.97]];
  return (
    <>
      {lines}
      {dots.map(([x, y, on], j) => on ? <div key={`d${j}`} style={{position: 'absolute', left: x - 1.5, top: y - 1.5, width: 4.5, height: 4.5, background: '#fff'}} /> : null)}
    </>
  );
};

// ═════════ 镜头 A：手机 ═════════
const PH_W = 253, PH_H = 483;
const phone = (s: number) => ({
  x: trk(s, [[0, 924], [0.5, 952], [0.967, 972], [1.0, 974]]),
  y: trk(s, [[0, 805], [0.033, 724], [0.067, 686], [0.1, 659], [0.133, 639], [0.167, 623], [0.2, 609], [0.267, 590], [0.333, 575], [0.4, 564], [0.5, 553], [0.533, 552], [0.6, 558], [0.667, 575], [0.733, 604], [0.8, 649], [0.867, 717], [0.933, 825], [0.967, 903], [1.0, 1000]]),
  w: trk(s, [[0, 152], [0.033, 203], [0.067, 226], [0.1, 238], [0.133, 244], [0.167, 247], [0.2, 249], [0.267, 251], [0.4, 252], [0.5, 253], [1, 253]]),
  a: trk(s, [[0, -26], [0.033, -17.7], [0.067, -13.3], [0.1, -10.1], [0.133, -7.6], [0.167, -5.5], [0.2, -3.8], [0.267, -0.9], [0.333, 1.4], [0.4, 3.3], [0.5, 6.1], [0.6, 8.5], [0.733, 11.5], [0.8, 13.5], [0.867, 15.9], [0.933, 19.2], [0.967, 22.3], [1.0, 26]]),
});
const frameA = (s: number) => ({
  L: trk(s, [[0, 355], [0.033, 579], [0.067, 637], [0.1, 674], [0.133, 700], [0.167, 720], [0.2, 735], [0.267, 754], [0.333, 766], [0.4, 772], [0.5, 776], [0.667, 776], [0.733, 774], [0.8, 773], [0.867, 770], [0.967, 765], [1, 764]]),
  R: trk(s, [[0, 1567], [0.033, 1343], [0.067, 1285], [0.1, 1248], [0.133, 1222], [0.167, 1202], [0.2, 1188], [0.267, 1168], [0.333, 1156], [0.4, 1150], [0.5, 1146], [0.6, 1146], [0.667, 1149], [0.733, 1153], [0.8, 1159], [0.867, 1168], [0.933, 1180], [0.967, 1188], [1, 1197]]),
  T: trk(s, [[0, 344], [0.033, 312], [0.067, 290], [0.1, 283], [0.133, 280], [0.2, 279], [0.5, 279], [0.567, 280], [0.6, 285], [0.667, 301], [0.733, 330], [0.8, 375], [0.867, 444], [0.933, 554], [0.967, 641], [1, 740]]),
  B: trk(s, [[0, 1037], [0.033, 925], [0.067, 901], [0.1, 885], [0.133, 873], [0.167, 864], [0.2, 856], [0.267, 846], [0.333, 839], [0.4, 834], [0.5, 830], [0.567, 831], [0.6, 835], [0.667, 852], [0.733, 881], [0.8, 927], [0.867, 998], [0.933, 1105], [0.967, 1192], [1, 1290]]),
});

// 手机屏幕：一条生活笔记（早餐插画 + 标题 + 右侧图标 + 左下用户名）
const PhoneScreen: React.FC<{x: CardRainInputs; s: number; v: number}> = ({x, v}) => {
  const s = v; // 屏幕里的"视频"按输出秒播（停留时视频继续播，手机本身停住）
  const k = s * 4; // 热气轻轻往上飘（"视频在播"）
  return (
    <svg width={PH_W - 8} height={PH_H - 8} viewBox="0 0 245 475" style={{display: 'block'}}>
      <defs>
        <linearGradient id="ph-bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f6efe6" /><stop offset="0.55" stopColor="#efd9bd" /><stop offset="1" stopColor="#c9a27a" /></linearGradient>
        <linearGradient id="ph-sh" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#000" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity="0.55" /></linearGradient>
      </defs>
      <rect width="245" height="475" fill="url(#ph-bg)" />
      <g transform={`translate(${(-6 * s + 3 * Math.sin(s * 9)).toFixed(2)} ${(2 * Math.sin(s * 7)).toFixed(2)}) scale(${(1 + 0.05 * s).toFixed(4)})`} style={{transformOrigin: '122px 280px'}}>
      <rect x="0" y="40" width="245" height="18" fill="#e9e1d6" />
      <rect x="150" y="62" width="60" height="70" rx="4" fill="#dfe9ef" stroke="#cdbfae" strokeWidth="3" />
      <ellipse cx="122" cy="300" rx="128" ry="54" fill="#b98a5e" />
      <circle cx="95" cy="282" r="44" fill="#fbfaf7" />
      <ellipse cx="95" cy="282" rx="26" ry="20" fill="#fff" stroke="#efe6d9" strokeWidth="2" />
      <circle cx="98" cy="280" r="10" fill="#f6b42a" />
      <rect x="148" y="250" width="52" height="38" rx="9" fill="#e6b06e" stroke="#c98f4c" strokeWidth="3" />
      <rect x="160" y="300" width="34" height="40" rx="6" fill="#fff" />
      <rect x="164" y="304" width="26" height="12" rx="3" fill="#6b3f22" />
      {[0, 1].map((j) => <path key={j} d={`M${170 + j * 12} ${290 - ((k + j * 0.5) % 1) * 18} q5 -8 0 -16`} stroke="#fff" strokeWidth="2.5" fill="none" opacity={0.8 - ((k + j * 0.5) % 1) * 0.6} />)}
      </g>
      <rect x="0" y="330" width="245" height="145" fill="url(#ph-sh)" />
      <text x="14" y="408" fontSize="19" fontWeight={700} fill="#fff" fontFamily={SANS}>{x.phoneTitle}</text>
      <text x="14" y="432" fontSize="12.5" fill="#fff" opacity={0.9} fontFamily={SANS}>{x.phoneNote}</text>
      <circle cx="24" cy="455" r="9" fill="#f2c48d" />
      <text x="24" y="459" fontSize="10" textAnchor="middle" fill="#7a4a1e" fontWeight={700} fontFamily={SANS}>满</text>
      <text x="40" y="459" fontSize="11" fill="#fff" opacity={0.9} fontFamily={SANS}>{x.phoneUser ?? ''}</text>
      <g fill="none" stroke="#fff" strokeWidth="2.2">
        <path d="M222 300 c-5 -7 -14 0 -7 7 l7 7 l7 -7 c7 -7 -2 -14 -7 -7z" />
        <circle cx="222" cy="342" r="8" />
        <path d="M214 380 l16 -7 l-4 16z" />
      </g>
      <g fill="#fff" fontSize="9" textAnchor="middle" fontFamily={SANS}><text x="222" y="326">2.1万</text><text x="222" y="364">386</text></g>
    </svg>
  );
};

const PhoneShot: React.FC<{s: number; t: number; x: CardRainInputs}> = ({s, t, x}) => {
  const p = phone(s), f = frameA(s);
  const sc = p.w / PH_W;
  // 色调扫：0–0.13 整屏蓝→紫粉；0.15–0.27 正常色从下往上推；0.27–0.45 顶部剩一条天蓝→淡紫的光带褪掉
  const sweep = trk(s, [[0, 1.0], [0.15, 1.0], [0.2, 0.6], [0.233, 0.3], [0.267, 0.14], [0.45, 0]]); // 色调层占屏幕高度的比例（从上往下）
  const hue = trk(s, [[0, 0], [0.067, 0.35], [0.133, 1], [0.3, 1]]); // 0 蓝 → 1 紫粉
  const bandA = 1 - rs(s, 0.27, 0.18, EASE.linear);
  const tint = `linear-gradient(to bottom, rgba(${Math.round(80 + 110 * hue)},${Math.round(150 - 20 * hue)},${Math.round(240)},${(0.65 * (s < 0.27 ? 1 : bandA)).toFixed(3)}) 0%, rgba(${Math.round(70 + 130 * hue)},${Math.round(120 - 10 * hue)},${Math.round(235 - 20 * hue)},0.6) 85%, rgba(255,255,255,0) 100%)`;
  const line = 'rgba(200,204,222,0.62)';
  const vy = (phone(s + 1 / 60).y - phone(s - 1 / 60).y) / 2;
  const blur = Math.max(0, (Math.abs(vy) - 18) / 14); // 下落最后几帧才有纵向虚
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse 70% 45% at 18% 105%, #0a63c8 0%, rgba(4,82,180,0.55) 35%, rgba(0,20,60,0) 75%), radial-gradient(ellipse 50% 40% at 100% 85%, rgba(1,40,110,0.8) 0%, rgba(0,20,60,0) 70%), linear-gradient(to bottom, #00030e 0%, #000a26 55%, #02266b 100%)', overflow: 'hidden'}}>
      <Stars s={s} t={t} />
      {/* 框线：两横两竖贯穿全屏，交点白方点；手机在线前面 */}
      <div style={{position: 'absolute', left: 0, top: f.T, width: W, height: 1.5, background: line}} />
      <div style={{position: 'absolute', left: 0, top: f.B, width: W, height: 1.5, background: line}} />
      <div style={{position: 'absolute', left: f.L, top: 0, width: 1.5, height: H, background: line}} />
      <div style={{position: 'absolute', left: f.R, top: 0, width: 1.5, height: H, background: line}} />
      {[[f.L, f.T], [f.R, f.T], [f.L, f.B], [f.R, f.B]].map(([a, b], j) => <div key={j} style={{position: 'absolute', left: a - 4, top: b - 4, width: 8, height: 8, background: '#fff'}} />)}
      <div style={{position: 'absolute', left: p.x - PH_W / 2, top: p.y - PH_H / 2, width: PH_W, height: PH_H, transform: `perspective(1600px) rotateZ(${p.a.toFixed(2)}deg) rotateY(-11deg) scale(${sc.toFixed(4)})`, filter: blur > 0.3 ? `blur(${Math.min(4, blur).toFixed(1)}px)` : undefined, willChange: 'transform'}}>
        {/* 机身右侧的厚度（深蓝金属边） */}
        <div style={{position: 'absolute', inset: 0, borderRadius: 34, background: 'linear-gradient(90deg, #0b2a6b, #1a4aa8 60%, #0b2a6b)', transform: 'translateX(7px)'}} />
        <div style={{position: 'absolute', inset: 0, borderRadius: 34, background: '#06080e', padding: 4, boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.18)'}}>
          <div style={{position: 'relative', width: PH_W - 8, height: PH_H - 8, borderRadius: 30, overflow: 'hidden'}}>
            <PhoneScreen x={x} s={s} v={t} />
            {sweep > 0 && <div style={{position: 'absolute', left: 0, top: 0, width: '100%', height: `${(sweep * 100).toFixed(2)}%`, background: tint, mixBlendMode: 'color'}} />}
            {sweep > 0 && <div style={{position: 'absolute', left: 0, top: 0, width: '100%', height: `${(sweep * 100).toFixed(2)}%`, background: tint, mixBlendMode: 'soft-light', opacity: 0.8}} />}
            <div style={{position: 'absolute', left: (PH_W - 8) / 2 - 23, top: 14, width: 46, height: 14, borderRadius: 7, background: '#06080e'}} />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ═════════ 拼字：每个字 3 段按字形裁切"长出来"（左列往下 / 右上横着 / 右下往上或往右），最后一块单独一帧冒出 ═════════
const FS = 215, GAP = 0.05; // 字号、字距（em）
type Piece = {ci: number; x0: number; y0: number; x1: number; y1: number; dir: 'down' | 'up' | 'right' | 'left' | 'pop'; at: number};
export const wordPieces = (word: string): Piece[] => {
  const n = [...word].length;
  const raw: Omit<Piece, 'at'>[] = [];
  for (let ci = 0; ci < n; ci++) {
    raw.push({ci, x0: -0.08, y0: -0.12, x1: 0.46, y1: 1.12, dir: 'down'}); // 三段之间互相压 0.04em，长满后接缝在别的段里，看不到缝
    if (ci === n - 1) {
      raw.push({ci, x0: 0.4, y0: -0.12, x1: 0.77, y1: 0.49, dir: ci % 2 ? 'left' : 'right'});
    } else raw.push({ci, x0: 0.4, y0: -0.12, x1: 1.08, y1: 0.49, dir: ci % 2 ? 'left' : 'right'});
    raw.push({ci, x0: 0.4, y0: 0.44, x1: 1.08, y1: 1.12, dir: ci % 2 ? 'up' : 'right'});
  }
  const order = raw.map((p, i) => ({p, k: p.ci + (p.y0 > 0.3 ? 0.9 : p.x0 > 0.3 ? 0.55 : 0) + i * 1e-4})).sort((a, b) => a.k - b.k).map((o) => o.p);
  const K = order.length;
  const out: Piece[] = order.map((p, k) => ({...p, at: Math.round((3.9 + 0.6 * (k / Math.max(1, K - 1))) * FPS) / FPS}));
  out.push({ci: n - 1, x0: 0.74, y0: -0.12, x1: 1.08, y1: 0.49, dir: 'pop', at: 4.833}); // 最后一块（原片第二个 i 的点）
  return out;
};
const wordScale = (s: number) => trk(s, [[3.9, 0.63], [4.0, 0.7], [4.1, 0.81], [4.2, 0.89], [4.3, 0.935], [4.4, 0.96], [4.6, 0.985], [5.17, 1.0], [6.1, 1.035]]);
const Word: React.FC<{s: number; t: number; word: string}> = ({s, t, word}) => {
  if (fr(s) < fr(3.9)) return null;
  const chars = [...word];
  const n = chars.length;
  const cell = FS, gap = GAP * FS;
  const total = n * cell + (n - 1) * gap;
  const left0 = W / 2 - total / 2, top0 = 548 - cell / 2;
  const pieces = wordPieces(word);
  const sc = wordScale(s) * (1 + 0.006 * (t - s)); // 停留时按输出秒继续极慢推
  const glyph = (ch: string): React.CSSProperties => ({position: 'absolute', inset: 0, fontSize: FS, lineHeight: `${FS}px`, textAlign: 'center', color: '#fff', fontWeight: 500, fontFamily: SANS});
  // 蓝块：4.833 出现在第一个字后面，每 2 帧往上跳一格，5.033 消失
  const bi = s >= 4.833 && s < 5.033 ? Math.min(2, Math.floor((fr(s) - fr(4.833)) / 2)) : -1;
  const by = [0.62, 0.26, -0.2][Math.max(0, bi)] * cell;
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: W, height: H, transform: `scale(${sc.toFixed(5)})`, transformOrigin: '960px 540px', willChange: 'transform'}}>
      {bi >= 0 && <div style={{position: 'absolute', left: left0 + 0.18 * cell, top: top0 + by, width: 0.8 * cell, height: 0.375 * cell, background: '#2a60fd'}} />}
      {fr(s) >= fr(4.95) && chars.map((ch, ci) => (
        <div key={`w${ci}`} style={{position: 'absolute', left: left0 + ci * (cell + gap), top: top0, width: cell, height: cell}}><div style={glyph(ch)}>{ch}</div></div>
      ))}
      {fr(s) < fr(4.95) && pieces.map((p, i) => {
        if (fr(s) < fr(p.at)) return null;
        const g = p.dir === 'pop' ? 1 : 0.3 + 0.7 * rs(s, p.at, 0.42, EASE.snappy);
        const cx = left0 + p.ci * (cell + gap);
        let a = p.x0, b = p.x1, c = p.y0, d = p.y1;
        if (p.dir === 'down') d = c + (d - c) * g;
        if (p.dir === 'up') c = d - (d - c) * g;
        if (p.dir === 'right') b = a + (b - a) * g;
        if (p.dir === 'left') a = b - (b - a) * g;
        const clip = `inset(${(c * 100).toFixed(2)}% ${((1 - b) * 100).toFixed(2)}% ${((1 - d) * 100).toFixed(2)}% ${(a * 100).toFixed(2)}%)`;
        // 出现那 2 帧先是一块实心白块（故障块原地停住、变成笔画）
        const fresh = fr(s) - fr(p.at) < 2 && p.dir !== 'pop' && i < 4;
        return (
          <div key={i} style={{position: 'absolute', left: cx, top: top0, width: cell, height: cell}}>
            <div style={{...glyph(chars[p.ci]), clipPath: clip}}>{chars[p.ci]}</div>
            {fresh && <div style={{position: 'absolute', left: `${((a + 0.12 * (b - a)) * 100).toFixed(1)}%`, top: `${(Math.max(0.05, c) * 100).toFixed(1)}%`, width: 0.085 * cell, height: `${(Math.min(0.9, d - Math.max(0.05, c)) * 100).toFixed(1)}%`, background: '#fff'}} />}
          </div>
        );
      })}
    </div>
  );
};

// ═════════ 镜头 B 背景 ═════════
const BackB: React.FC<{s: number; t: number}> = ({s, t}) => {
  const black = s >= 3.367;
  const glow = trk(s, [[4.0, 0], [4.1, 0.03], [4.2, 0.12], [4.33, 0.28], [4.67, 0.55], [5.0, 0.8], [5.6, 0.95], [6.1, 1]]);
  return (
    <>
      <AbsoluteFill style={{background: black ? '#030303' : '#02030e'}} />
      {!black && <AbsoluteFill style={{background: 'radial-gradient(circle 1900px at -300px 2561px, rgba(120,150,195,1) 0, rgba(100,135,185,0.95) 1450px, rgba(60,95,145,0.75) 1600px, rgba(29,63,105,0.45) 1684px, rgba(10,30,60,0.12) 1760px, rgba(2,3,14,0) 1860px)', WebkitMaskImage: 'radial-gradient(ellipse 1150px 640px at 0px 1080px, #000 0%, rgba(0,0,0,0.65) 40%, rgba(0,0,0,0) 100%)', maskImage: 'radial-gradient(ellipse 1150px 640px at 0px 1080px, #000 0%, rgba(0,0,0,0.65) 40%, rgba(0,0,0,0) 100%)'}} />}
      {glow > 0 && <AbsoluteFill style={{opacity: glow * (1 + 0.07 * Math.sin(t * 5.2)), background: 'radial-gradient(ellipse 980px 600px at 960px 1180px, rgba(46,116,232,1) 0%, rgba(26,85,180,0.75) 35%, rgba(10,40,100,0.35) 68%, rgba(3,3,3,0) 100%)'}} />}
    </>
  );
};

// ═════════ 整组 ═════════
export type CardRainProps = {inputs?: CardRainInputs; extras?: number[]};
export const CardRainPixelWordGroup: React.FC<CardRainProps> = ({inputs = CARD_RAIN_DEFAULT_INPUTS, extras = [0, 0, 0]}) => {
  const C = CARD_RAIN_PIXEL_WORD_CONTRACT;
  const t = useCurrentFrame() / FPS;
  const s = toSource(t, C, extras);
  const held = t - s;
  // 停留时信息停住，整个画面按输出秒慢推（≈1%/秒）+ 慢漂（R7）
  const drift = held > 0 ? `scale(${(1 + 0.02 * held).toFixed(5)}) translate(${(10 * Math.sin(held * 0.9)).toFixed(2)}px, ${(6 * Math.sin(held * 0.7 + 1)).toFixed(2)}px)` : undefined;
  return (
    <AbsoluteFill style={{background: '#02030e', overflow: 'hidden', fontFamily: SANS}}>
      <AbsoluteFill style={{transform: drift, transformOrigin: '960px 540px'}}>
        {s < 1.0 ? (
          <PhoneShot s={s} t={t} x={inputs} />
        ) : (
          <>
            <BackB s={s} t={t} />
            <Stars s={s} t={t} />
            <FrameB s={s} />
            <div style={{position: 'absolute', inset: 0, filter: 'brightness(0.86) saturate(0.95)'}}>
              <CardRain s={s} t={t} x={inputs} />
              <Wave2 s={s} x={inputs} />
            </div>
            <Word s={s} t={t} word={inputs.word} />
            <Blocks s={s} />
          </>
        )}
      </AbsoluteFill>
      <Vignette strength={0.12} color="#000208" inner={0.6} />
      <Grain opacity={0.05} step={2} blend="soft-light" />
    </AbsoluteFill>
  );
};

// 版本导出（render_shot.py 用）：默认内容、原长
export const CardRainPixelWord: React.FC = () => <CardRainPixelWordGroup />;

if (checkContract(CARD_RAIN_PIXEL_WORD_CONTRACT).length) throw new Error(checkContract(CARD_RAIN_PIXEL_WORD_CONTRACT).join('; '));
