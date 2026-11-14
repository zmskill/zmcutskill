// 【镜头组】itinerary-scroll-bookmark：胶囊特写拉出 → 沿行程列表扫下去 → 倾斜上色甩回页顶 → 冲进书签 → 点下打勾 → 拉回（026-B 一串，含 026-D）
// 学的动作（Michael Nowak · Muse 产品发布片 10.8–19.7s，30fps 逐帧看过；时间表 shot-lab/refs/026-B/逐元素时间表.md）：
//   整条是同一个 App 页面上的一个连续镜头，没有硬切：
//   灰色圆角方块虚着缩成胶囊，字一个个"显影"、胶囊跟着字变宽 → 镜头往后拉，右边标题从虚到实、上方照片横幅（紫色单色调、虚）出现 →
//   列表一张一张往上扫（慢—快—慢，约 1 秒一张；只有正中那张清楚，新卡先是骨架色块再填进内容）→
//   整页倾斜（绕 Z −6°、X 轴透视），照片紫色退掉露出原色 → 猛往上甩回页顶（运动模糊）→ 大标题从虚到实、颜色从紫蓝渐变走到深墨 →
//   镜头冲向右上角书签按钮 → 停住 → 点下：书签变实心渐变 + 光环外扩 + 整屏淡紫柔光（全片最亮一帧）→ 渐变流动、白勾写出 → 拉回页面，书签变深色已收藏。
// 我们的内容：中性日常的"杭州三日慢游"行程（不出现任何品牌）；照片换成代码画的扁平风景插画（湖 / 茶山 / 老街），保留"紫色单色调 → 原色"的上色手法。
//
// 拍表（源秒，30fps；结尾比原片多 0.7s 拉回落定）
//   拍 1 胶囊对焦      0.00–1.00   PILL
//   拍 2 拉出整张卡    1.00–1.60   PULL
//   拍 3 沿列表扫下去  1.60–4.07   SCROLL（2.2–2.55、3.25–3.6 两次快扫）
//   拍 4 倾斜上色甩上  4.07–4.80   WHIP
//   拍 5 页顶对焦      4.80–5.75   HEAD
//   拍 6 冲向书签      5.75–6.30   RUSH
//   拍 7 书签停住      6.30–6.95   （停留点 6.6）
//   拍 8 点下          6.95–7.30   TAP（7.10 最亮）
//   拍 9 打勾          7.30–8.10   CHECK
//   拍 10 拉回落定     8.10–9.60   BACK（停留点 9.4）
// 毛病清单：
//   - 通用：镜头一直在动（停留区也有慢推）；猛动作 ≤0.4s 不回弹；只有正中的卡清楚；文字不缩放栅格化抖动（--hq）
//   - 独有 1：胶囊宽度跟着字长，字是"显影"（灰虚 → 墨实），不是打字机
//   - 独有 2：新卡先骨架后内容；照片先紫色单色调，倾斜那一下才上色（从下往上一张张退紫）
//   - 独有 3：甩上去的 0.35s 必须有纵向运动模糊，到页顶时标题是虚的、紫蓝渐变色，0.9s 内才落成深墨
//   - 独有 4：点下的光环和整屏柔光只亮 3–4 帧（7.03–7.17），之后退回白底，按钮留在 1.2× 呼吸
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {EASE, FONT, Grain, SpeedBlur, Vignette, mix} from '../../../kit/polish';
import {GroupContract, checkContract, checkInputs, outputDuration, planExtras, toSource} from '../../../kit/groupClock';

const W = 1920, H = 1080, FPS = 30;
const SANS = `"PingFang SC", "Noto Sans CJK SC", "Noto Sans SC", ${FONT.sans}`;
const INK = '#23252f';
const clamp = (x: number) => Math.max(0, Math.min(1, x));
const rs = (t: number, a: number, d: number, e: (x: number) => number = EASE.out) => e(clamp((t - a) / Math.max(1e-6, d)));

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
export const ITINERARY_SCROLL_BOOKMARK_CONTRACT: GroupContract = {
  sourceDuration: 9.6,
  fps: 30,
  motion: [[0, 1.75], [2.2, 6.3], [6.95, 9.1]],
  holds: [
    {at: 2.0, maxExtra: 1.0}, // 第 1 张卡清楚地停着（读卡）
    {at: 6.6, maxExtra: 1.0}, // 书签按钮特写（点下之前）
    {at: 9.4, maxExtra: 2.0}, // 结尾：页顶 + 已收藏的书签
  ],
  landmarks: {pill: 0.3, pull: 1.1, scroll1: 2.2, scroll2: 3.25, tilt: 4.07, whip: 4.4, head: 4.8, rush: 5.75, tap: 7.03, check: 7.45, back: 8.6},
  sfx: [
    {at: 'pill', type: '极轻 tick × 3（字显影）', volume: 0.25},
    {at: 'pull', type: '轻 whoosh（拉出）', volume: 0.35},
    {at: 'scroll1', type: '短 swish（快扫）', volume: 0.35},
    {at: 'scroll2', type: '短 swish（快扫）', volume: 0.35},
    {at: 'whip', type: '快 whoosh-up（甩上去）', volume: 0.45},
    {at: 'rush', type: '推近 whoosh', volume: 0.45},
    {at: 'tap', type: '点击 + 柔和 bloom（全片最亮）', tail: 0.6},
    {at: 'check', type: '清脆 tick / 小 chime（打勾）', tail: 0.5},
    {at: 'back', type: '反向 whoosh（拉回）', volume: 0.35},
  ],
  inputs: {
    title: {maxChars: 8},
    subtitle: {maxChars: 26},
    dayTitle: {count: 3, maxChars: 7},
  },
};

export type Scene = 'lake' | 'tea' | 'street';
export type ItineraryInputs = {
  title: string; // 页顶大标题
  subtitle: string; // 两行副标题
  days: {title: string; scene: Scene}[]; // 3 天
  dayLabel?: (n: number) => string; // 胶囊文字，默认"第 n 天"
  accentA?: string; // 紫蓝渐变（照片单色调、标题渐变、书签）
  accentB?: string;
};
export const ITINERARY_DEFAULT_INPUTS: ItineraryInputs = {
  title: '杭州三日慢游',
  subtitle: '不赶路的三天：湖边早餐、山里茶园，傍晚坐船看老城。',
  days: [
    {title: '西湖与北山街', scene: 'lake'},
    {title: '龙井与九溪', scene: 'tea'},
    {title: '运河与小河直街', scene: 'street'},
  ],
};
export function checkItineraryInputs(x: ItineraryInputs): string[] {
  return checkInputs(ITINERARY_SCROLL_BOOKMARK_CONTRACT, {title: x.title, subtitle: x.subtitle, dayTitle: x.days.map((d) => d.title)});
}
export const planItinerary = (sec: number) => planExtras(ITINERARY_SCROLL_BOOKMARK_CONTRACT, sec);
export const itineraryFrames = (extras: number[]) => Math.round(outputDuration(ITINERARY_SCROLL_BOOKMARK_CONTRACT, extras) * FPS);

export const ITINERARY_SCROLL_BOOKMARK_DURATION = 288;
export const ITINERARY_BEATS = {
  pill: [0, 1.0], pull: [1.0, 1.6], scroll: [1.6, 4.07], whip: [4.07, 4.8], head: [4.8, 5.75],
  rush: [5.75, 6.3], tap: [6.3, 8.1], back: [8.1, 9.6],
} as const;

// ═════════ 页面布局（世界坐标）═════════
const PW = 1100;
const CARD_TOP = (i: number) => 330 + i * 400;
const BANNER = {x: 60, w: 980, h: 270, r: 26};
const ROW_Y = (i: number) => CARD_TOP(i) + 335; // 胶囊中线
const PILL_H = 60, PILL_FS = 32, PILL_PAD = 22;
const BM = {x: 1010, y: 74, r: 40};
const cw = (s: string, size: number) => Array.from(s).reduce((a, ch) => a + (/[⺀-￯]/.test(ch) ? size : /[0-9]/.test(ch) ? size * 0.58 : size * 0.6), 0);

// ═════════ 插画（代替照片）═════════
const SceneArt: React.FC<{kind: Scene; w: number; h: number}> = ({kind, w, h}) => {
  if (kind === 'lake') return (
    <svg width={w} height={h} viewBox="0 0 980 270" preserveAspectRatio="none" style={{display: 'block'}}>
      <defs>
        <linearGradient id="lk-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7fb6ea" /><stop offset="1" stopColor="#d9ecf7" /></linearGradient>
        <linearGradient id="lk-w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#6fa9cf" /><stop offset="1" stopColor="#3f7fae" /></linearGradient>
      </defs>
      <rect width="980" height="270" fill="url(#lk-sky)" />
      <circle cx="770" cy="70" r="30" fill="#fff4cf" />
      <path d="M0 170 Q120 110 230 150 T470 130 T720 150 T980 125 V190 H0Z" fill="#8fb39a" />
      <path d="M0 185 Q160 150 320 175 T640 168 T980 160 V200 H0Z" fill="#6e9a7c" />
      <g fill="#5a4a46"><rect x="608" y="98" width="16" height="74" /><path d="M596 104 h40 l-8 -10 h-24z M598 124 h36 l-7 -9 h-22z M600 144 h32 l-6 -8 h-20z" /><path d="M612 84 l4 -14 l4 14z" /></g>
      <rect y="196" width="980" height="74" fill="url(#lk-w)" />
      <path d="M140 222 h120 M420 236 h160 M700 214 h90" stroke="#cfe6f5" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
      <path d="M300 232 q20 -14 40 0 z" fill="#3b3330" /><path d="M320 218 v14" stroke="#3b3330" strokeWidth="3" />
      <path d="M0 196 C40 150 70 140 90 196" fill="#4f7b5c" /><path d="M40 196 v-60" stroke="#4a3b30" strokeWidth="6" />
    </svg>
  );
  if (kind === 'tea') return (
    <svg width={w} height={h} viewBox="0 0 980 270" preserveAspectRatio="none" style={{display: 'block'}}>
      <defs><linearGradient id="te-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#a8cfe0" /><stop offset="1" stopColor="#eef4e6" /></linearGradient></defs>
      <rect width="980" height="270" fill="url(#te-sky)" />
      <path d="M0 120 Q200 50 420 110 T980 80 V270 H0Z" fill="#9cc48a" />
      <path d="M0 160 Q260 90 520 150 T980 130 V270 H0Z" fill="#7fb06a" />
      <path d="M0 205 Q300 140 620 200 T980 185 V270 H0Z" fill="#5f9651" />
      <g stroke="#4c7d40" strokeWidth="5" fill="none" opacity="0.75">
        <path d="M0 178 Q260 112 520 172 T980 152" /><path d="M0 198 Q260 132 520 192 T980 172" />
        <path d="M0 228 Q300 166 620 222 T980 208" /><path d="M0 250 Q300 188 620 244 T980 230" />
      </g>
      <rect x="0" y="96" width="980" height="26" fill="#ffffff" opacity="0.35" />
      <g fill="#6b4f3a"><rect x="700" y="128" width="64" height="30" /><path d="M690 130 L732 108 L774 130Z" fill="#3e3a3a" /></g>
    </svg>
  );
  return (
    <svg width={w} height={h} viewBox="0 0 980 270" preserveAspectRatio="none" style={{display: 'block'}}>
      <defs><linearGradient id="st-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f2b48a" /><stop offset="1" stopColor="#fbe3c4" /></linearGradient></defs>
      <rect width="980" height="270" fill="url(#st-sky)" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <g key={i} transform={`translate(${i * 165 - 10} 0)`}>
          <rect x="0" y={88 + (i % 2) * 14} width="150" height="130" fill={i % 2 ? '#efe6da' : '#f7f0e6'} />
          <path d={`M-10 ${92 + (i % 2) * 14} L75 ${50 + (i % 2) * 14} L160 ${92 + (i % 2) * 14}Z`} fill="#4b4646" />
          <rect x="22" y={130 + (i % 2) * 14} width="34" height="40" fill="#7a5a44" /><rect x="90" y={130 + (i % 2) * 14} width="34" height="40" fill="#7a5a44" />
          <ellipse cx="75" cy={118 + (i % 2) * 14} rx="10" ry="13" fill="#e2543f" />
        </g>
      ))}
      <rect y="214" width="980" height="56" fill="#5e8fa8" />
      <path d="M120 238 h140 M500 248 h120 M760 232 h110" stroke="#d6ebf3" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
      <path d="M560 240 q60 -22 120 0 z" fill="#3a2f2b" /><rect x="590" y="222" width="50" height="14" fill="#8a3b2e" />
    </svg>
  );
};

// ═════════ 时钟 + 内容 ═════════
// sc = 当前镜头缩放；页面里的模糊一律按屏幕像素写，再除以 sc（世界里的 blur 会被镜头放大）
type Ctx = {s: number; t: number; x: ItineraryInputs; A: string; B: string; sc: number};
const bl = (c: Ctx, px: number) => (px / c.sc > 0.12 ? `blur(${(px / c.sc).toFixed(2)}px)` : undefined);

// 镜头关键帧（源秒）：cx, cy = 画面中心对准的世界坐标；sc = 缩放；rz = 绕 Z（度）；rx = 绕 X（度）
const PILL_C = {x: 60 + 64, y: ROW_Y(0)};
const CAM_X: P = [[0, 93], [0.6, 112], [1.0, 123], [1.1, 126], [1.4, 230], [1.7, 470], [2.0, 545], [2.2, 550], [2.55, 550], [3.25, 550], [3.6, 550], [4.07, 552], [4.4, 560], [4.75, 560], [4.8, 560], [5.75, 600], [5.95, 760], [6.15, 975], [6.3, BM.x], [6.95, BM.x - 8], [8.6, BM.x - 14], [8.85, 820], [9.1, 690], [9.6, 684]];
// CAM_Y 1.7–2.2s：拉出往上、列表往下，转向处放缓（2026-11-10 逐帧检查发现 2.0s 前后折返偏急）
const CAM_Y: P = [[0, PILL_C.y], [1.0, PILL_C.y], [1.1, PILL_C.y - 2], [1.4, PILL_C.y - 30], [1.7, 590], [1.85, 582], [2.0, 588], [2.2, 610], [2.55, 930], [2.9, 965], [3.25, 1010], [3.6, 1330], [4.07, 1375], [4.45, 1180], [4.68, 700], [4.83, 400], [4.9, 372], [5.75, 330], [5.95, 230], [6.15, 100], [6.3, BM.y], [6.95, BM.y + 5], [8.6, BM.y + 10], [8.85, 160], [9.1, 250], [9.6, 246]];
const CAM_S: P = [[0, 9.0], [1.0, 8.4], [1.1, 8.2], [1.4, 5.0], [1.7, 2.4], [2.0, 1.76], [2.2, 1.7], [2.55, 1.7], [3.25, 1.75], [3.6, 1.74], [4.07, 1.8], [4.45, 1.6], [4.83, 1.16], [4.9, 1.13], [5.75, 1.2], [5.95, 1.7], [6.15, 4.0], [6.3, 4.6], [6.95, 4.85], [8.6, 5.1], [8.85, 2.3], [9.1, 1.4], [9.6, 1.36]];
const CAM_RZ: P = [[0, 0], [4.07, 0], [4.2, -3], [4.4, -6], [4.8, -6.2], [5.75, -3.2], [6.15, -0.6], [6.3, 0], [9.6, 0]];
const CAM_RX: P = [[0, 0], [4.07, 0], [4.4, 18], [4.8, 18], [5.75, 9], [6.15, 2], [6.3, 0], [9.6, 0]];
const cam = (s: number) => ({x: trk(s, CAM_X), y: trk(s, CAM_Y), sc: trk(s, CAM_S), rz: trk(s, CAM_RZ), rx: trk(s, CAM_RX)});

// ═════════ 页面组件 ═════════
const Pill: React.FC<{c: Ctx; i: number}> = ({c, i}) => {
  const label = (c.x.dayLabel ?? ((n: number) => `第${n}天`))(i + 1);
  const chars = Array.from(label);
  // 卡 0 的胶囊演"方块缩成胶囊、字一个个显影"；其他卡直接是成品
  const at = i === 0 ? chars.map((_, k) => [0.3, 0.5, 0.88, 1.05][Math.min(k, 3)] + Math.max(0, k - 3) * 0.12) : chars.map(() => -10);
  const fullW = PILL_PAD * 2 + cw(label, PILL_FS);
  let w = fullW, h = PILL_H, rad = PILL_H / 2, blur = 0;
  if (i === 0) {
    const shown = chars.reduce((a, ch, k) => a + cw(ch, PILL_FS) * rs(c.s, at[k], 0.22, EASE.out), 0);
    const sq = 1 - rs(c.s, 0, 0.25, EASE.out); // 0 → 方块（64）缩成圆（50）
    w = Math.max(PILL_H + 14 * sq, PILL_PAD * 2 + shown);
    h = PILL_H + 14 * sq;
    rad = mix(h / 2, 18, sq);
    blur = 10 * (1 - rs(c.s, 0, 0.35, EASE.out));
  }
  return (
    <div style={{position: 'absolute', left: 60, top: ROW_Y(i) - h / 2, width: w, height: h, borderRadius: rad, background: '#f4f4f6',
      boxShadow: 'inset 0 0 0 2px #e6e6ea', filter: bl(c, blur), overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: PILL_PAD, top: 0, height: h, display: 'flex', alignItems: 'center', whiteSpace: 'pre', fontFamily: SANS, fontSize: PILL_FS, fontWeight: 600}}>
        {chars.map((ch, k) => {
          const p = rs(c.s, at[k], 0.22, EASE.out);
          if (p <= 0) return null;
          return <span key={k} style={{opacity: 0.2 + 0.8 * p, color: `rgb(${Math.round(mix(160, 35, p))},${Math.round(mix(162, 37, p))},${Math.round(mix(170, 47, p))})`,
            filter: p < 0.97 ? bl(c, 26 * (1 - p)) : undefined}}>{ch}</span>;
        })}
      </div>
    </div>
  );
};

const FILL_AT = [1.45, 2.38, 3.42]; // 骨架 → 内容
const TITLE_AT = [1.25, 2.62, 3.62]; // 标题从左到右显出
const UNTINT_AT = [4.3, 4.2, 4.1]; // 紫色退掉（从下往上）
const Card: React.FC<{c: Ctx; i: number; focusBlur: number}> = ({c, i, focusBlur}) => {
  const top = CARD_TOP(i);
  const fill = rs(c.s, FILL_AT[i], 0.3, EASE.out);
  const tint = 1 - rs(c.s, UNTINT_AT[i], 0.32, EASE.smooth);
  const tp = rs(c.s, TITLE_AT[i], 0.42, EASE.out);
  const cardOp = i === 0 ? rs(c.s, 1.0, 0.25, EASE.linear) : 1;
  const chev = rs(c.s, TITLE_AT[i] + 0.25, 0.3, EASE.out);
  return (
    <div style={{position: 'absolute', left: 36, top, width: PW - 72, height: 380}}>
      <div style={{position: 'absolute', inset: 0, opacity: cardOp, borderRadius: 34, background: '#fff', boxShadow: '0 1px 2px rgba(20,22,40,0.04), 0 10px 30px rgba(20,22,40,0.05)'}} />
      {/* 照片横幅：骨架色块 → 插画；紫色单色调 → 原色 */}
      <div style={{position: 'absolute', left: BANNER.x - 36, top: 20, width: BANNER.w, height: BANNER.h, borderRadius: BANNER.r, overflow: 'hidden', opacity: cardOp,
        filter: bl(c, focusBlur + (1 - fill) * 16)}}>
        <div style={{position: 'absolute', inset: 0, opacity: fill}}><SceneArt kind={c.x.days[i].scene} w={BANNER.w} h={BANNER.h} /></div>
        <div style={{position: 'absolute', inset: 0, background: `linear-gradient(110deg, ${c.A}, ${c.B})`, mixBlendMode: 'color', opacity: tint * fill}} />
        <div style={{position: 'absolute', inset: 0, background: `linear-gradient(110deg, ${c.A}, ${c.B})`, opacity: 0.18 * tint * fill + (1 - fill) * 0.22, mixBlendMode: 'screen'}} />
        <div style={{position: 'absolute', inset: 0, background: '#ece9f8', opacity: 1 - fill}} />
      </div>
      {/* 下面一行：胶囊 + 标题 + ⌄ */}
      <div style={{position: 'absolute', left: -36, top: -top, filter: bl(c, focusBlur)}}>
        <Pill c={c} i={i} />
        {(() => {
          const lw = PILL_PAD * 2 + cw((c.x.dayLabel ?? ((n: number) => `第${n}天`))(i + 1), PILL_FS);
          const sweep = mix(-20, 120, tp);
          return (
            <div style={{position: 'absolute', left: 60 + lw + 22, top: ROW_Y(i) - 26, fontFamily: SANS, fontSize: 44, fontWeight: 600, color: INK, whiteSpace: 'pre', lineHeight: '52px',
              opacity: tp > 0 ? 1 : 0, filter: tp < 0.98 ? bl(c, 14 * (1 - tp)) : undefined,
              WebkitMaskImage: `linear-gradient(90deg, #000 ${sweep}%, rgba(0,0,0,0) ${sweep + 30}%)`, maskImage: `linear-gradient(90deg, #000 ${sweep}%, rgba(0,0,0,0) ${sweep + 30}%)`}}>
              {c.x.days[i].title}
            </div>
          );
        })()}
        <svg width="34" height="34" viewBox="0 0 24 24" style={{position: 'absolute', left: 990, top: ROW_Y(i) - 17, opacity: chev * cardOp}}>
          <path d="M6 9l6 6 6-6" fill="none" stroke="#3a3c48" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
};

// 页顶：返回箭头 + 大标题（紫蓝渐变 → 深墨，从左往右）+ 副标题 + 书签按钮
const Header: React.FC<{c: Ctx}> = ({c}) => {
  const b = 10 * (1 - rs(c.s, 4.78, 0.5, EASE.out));
  const ink = rs(c.s, 5.2, 0.45, EASE.smooth);
  const sb = 6 * (1 - rs(c.s, 4.85, 0.55, EASE.out));
  const sweep = mix(-30, 130, ink);
  return (
    <>
      <svg width="40" height="40" viewBox="0 0 24 24" style={{position: 'absolute', left: 50, top: 22}}>
        <path d="M15 5l-7 7 7 7" fill="none" stroke="#3a3c48" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div style={{position: 'absolute', left: 60, top: 92, fontFamily: SANS, fontSize: 76, fontWeight: 700, letterSpacing: '-0.01em', whiteSpace: 'pre', lineHeight: '96px',
        filter: bl(c, b * 1.3),
        backgroundImage: `linear-gradient(90deg, ${INK} 0%, ${INK} ${sweep}%, ${c.A} ${sweep + 18}%, ${c.B} ${sweep + 60}%)`, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent'}}>
        {c.x.title}
      </div>
      <div style={{position: 'absolute', left: 62, top: 202, width: 780, fontFamily: SANS, fontSize: 30, lineHeight: '44px', color: '#8a8c98',
        filter: bl(c, sb * 1.3)}}>{c.x.subtitle}</div>
    </>
  );
};

// 书签图形（描边 / 实心渐变 / 已收藏深色），0–24 坐标
const BM_PATH = 'M7 3.5h10a1.5 1.5 0 0 1 1.5 1.5v15.2l-6.5-4.4-6.5 4.4V5A1.5 1.5 0 0 1 7 3.5z';
const Bookmark: React.FC<{c: Ctx; size: number}> = ({c, size}) => {
  const filled = rs(c.s, 7.03, 0.05, EASE.linear);
  const flow = c.s; // 渐变流动
  const ang = 120 + 120 * Math.sin((flow - 7.0) * 1.6); // 渐变慢慢流，不要快闪
  const settle = rs(c.s, 8.62, 0.4, EASE.smooth); // 拉回时变深色已收藏
  const chk = rs(c.s, 7.45, 0.22, EASE.out);
  const id = 'bmg';
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{display: 'block', overflow: 'visible'}}>
      <defs>
        <linearGradient id={id} gradientTransform={`rotate(${ang.toFixed(1)} 0.5 0.5)`}>
          <stop offset="0" stopColor={c.B} /><stop offset="0.55" stopColor={c.A} /><stop offset="1" stopColor="#9fc0ff" />
        </linearGradient>
      </defs>
      {filled < 1 && <path d={BM_PATH} fill="none" stroke="#1d1f27" strokeWidth="2" strokeLinejoin="round" opacity={1 - filled} />}
      {filled > 0 && <path d={BM_PATH} fill={`url(#${id})`} opacity={filled * (1 - settle)} />}
      {settle > 0 && <path d={BM_PATH} fill="#5d6178" opacity={settle} />}
      {chk > 0 && <path d="M8.6 10.6l2.4 2.4 4.6-4.8" fill="none" stroke="#fff" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"
        strokeDasharray="12" strokeDashoffset={(12 * (1 - chk)).toFixed(2)} />}
    </svg>
  );
};
// 按钮可以画在页面里（cx/cy = 世界坐标，u = 1），也可以画在屏幕上（cx/cy = 屏幕坐标，u = 镜头缩放）。
// 特写段（6.3–8.6s）画在屏幕上：在世界里画再被 CSS 放大 4–5 倍，每帧重新采样，边缘和书签会一跳一跳（用户 2026-11-10："我们这个有点抖"）
const BookmarkButton: React.FC<{c: Ctx; cx?: number; cy?: number; u?: number}> = ({c, cx = BM.x, cy = BM.y, u = 1}) => {
  const press = c.s < 7.03 ? 1 - 0.05 * rs(c.s, 6.95, 0.07, EASE.out) : trk(c.s, [[7.03, 0.95], [7.12, 1.18], [7.22, 1.28], [7.5, 1.2], [8.1, 1.18], [8.6, 1.1], [9.0, 1.0]]);
  // 柔光只做很慢、很浅的呼吸（原片按钮本身不动，只有柔光微变）
  const glow = trk(c.s, [[7.0, 0], [7.06, 1], [7.4, 0.75], [8.0, 0.62], [8.6, 0.4], [9.0, 0]]) * (1 + 0.06 * Math.sin((c.t - 7) * 2.2));
  const op = rs(c.s, 5.05, 0.35, EASE.out);
  const r = BM.r * press * u;
  const px = (v: number) => (v * u).toFixed(2);
  // 柔光用径向渐变画，不用大半径 box-shadow：Chrome 渲大模糊阴影会分块，2 倍渲染时看得到方格（2026-11-10 逐帧检查 7.2–7.4s 发现）
  const G = r * 3.2;
  return (
    <>
      {glow > 0.005 && <div style={{position: 'absolute', left: cx - G, top: cy - G, width: G * 2, height: G * 2, borderRadius: '50%', opacity: op,
        background: `radial-gradient(circle, rgba(200,180,255,${(0.55 * glow).toFixed(3)}) ${(r / G * 100).toFixed(1)}%, rgba(186,160,255,${(0.28 * glow).toFixed(3)}) ${(r / G * 100 + 14).toFixed(1)}%, rgba(176,140,255,${(0.08 * glow).toFixed(3)}) 70%, rgba(176,140,255,0) 100%)`}} />}
      <div style={{position: 'absolute', left: cx - r, top: cy - r, width: r * 2, height: r * 2, borderRadius: '50%', background: '#fff', opacity: op,
        boxShadow: `0 ${px(2)}px ${px(8)}px rgba(20,22,40,0.07)`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <Bookmark c={c} size={r * 1.12} />
      </div>
    </>
  );
};

// 点下的光环 + 整屏柔光（屏幕空间，围着书签的屏幕位置）
const TapBloom: React.FC<{c: Ctx; bx: number; by: number}> = ({c, bx, by}) => {
  const q = c.s - 7.03;
  if (q < -0.01 || q > 0.6) return null;
  const flash = trk(c.s, [[7.03, 0], [7.07, 0.55], [7.1, 1], [7.14, 0.75], [7.2, 0.35], [7.32, 0.12], [7.6, 0]]);
  const rings = [0, 0.035, 0.07].map((d, k) => {
    const p = clamp((q - d) / 0.32);
    if (p <= 0 || p >= 1) return null;
    const R = 120 + 520 * EASE.out(p);
    const a = (1 - p) * 0.55;
    // 软光环用径向渐变（不用 border + blur 滤镜，大面积滤镜会分块）
    const wd = 10 + 14 * (1 - p) + 16 * p, edge = R + 40;
    const at = (v: number) => ((v / edge) * 100).toFixed(2);
    return <div key={k} style={{position: 'absolute', left: bx - edge, top: by - edge, width: edge * 2, height: edge * 2, borderRadius: '50%',
      background: `radial-gradient(circle, rgba(160,130,255,0) ${at(R - wd)}%, rgba(160,130,255,${a.toFixed(3)}) ${at(R)}%, rgba(160,130,255,0) ${at(R + wd)}%)`}} />;
  });
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <AbsoluteFill style={{opacity: flash, background: `radial-gradient(circle at ${bx}px ${by}px, rgba(255,255,255,0) 0, rgba(255,255,255,0) ${(BM.r * c.sc * 1.05).toFixed(0)}px, rgba(238,232,255,0.85) ${(BM.r * c.sc * 1.4).toFixed(0)}px, rgba(${c.A === '#7b5cff' ? '196,170,255' : '210,190,255'},0.75) 520px, rgba(170,190,255,0.7) 900px, rgba(196,168,255,0.8) 1400px)`}} />
      {rings}
    </AbsoluteFill>
  );
};

// ═════════ 整组 ═════════
export type ItineraryProps = {inputs?: ItineraryInputs; extras?: number[]; startAt?: number};
export const ItineraryScrollBookmarkGroup: React.FC<ItineraryProps> = ({inputs = ITINERARY_DEFAULT_INPUTS, extras = [0, 0, 0], startAt = 0}) => {
  const C = ITINERARY_SCROLL_BOOKMARK_CONTRACT;
  const t = useCurrentFrame() / FPS + startAt;
  const s = toSource(t, C, extras);
  // 停留时信息停住，镜头按输出秒慢推（≈1.2%/秒）+ 慢漂（R7）
  const held = t - s;
  const k = cam(s);
  const sc = k.sc * (1 + 0.012 * held);
  const c: Ctx = {s, t, x: inputs, A: inputs.accentA ?? '#7b5cff', B: inputs.accentB ?? '#c04dff', sc};
  const dx = 6 * Math.sin(held * 0.9), dy = 4 * Math.sin(held * 0.7 + 1);
  // 运动模糊：按相机的屏幕速度
  const k2 = cam(s + 1 / 60), k1 = cam(s - 1 / 60);
  const vx = -(k2.x - k1.x) * k.sc, vy = -(k2.y - k1.y) * k.sc;
  // 景深：离画面中心越远的卡越虚（只在列表段）
  const listPhase = 1 - rs(s, 4.07, 0.3, EASE.linear);
  const focus = (i: number) => {
    const sy = (CARD_TOP(i) + 190 - k.y) * k.sc;
    return listPhase * 8 * clamp((Math.abs(sy) - 230) / 380) + (1 - listPhase) * 0;
  };
  const tf = `translate(${W / 2 + dx}px, ${H / 2 + dy}px) perspective(2200px) rotateX(${k.rx.toFixed(3)}deg) rotateZ(${k.rz.toFixed(3)}deg) scale(${sc.toFixed(5)}) translate(${(-k.x).toFixed(3)}px, ${(-k.y).toFixed(3)}px)`;
  // 书签在屏幕上的位置（给点下的光环用；那时相机已回正，只算平移缩放）
  const bx = W / 2 + dx + (BM.x - k.x) * sc, by = H / 2 + dy + (BM.y - k.y) * sc;
  const closeUp = s >= 6.3 && s <= 8.6; // 这段相机已回正（rz = rx = 0），屏幕位置和页面里完全对得上
  return (
    <AbsoluteFill style={{background: '#ffffff', overflow: 'hidden', fontFamily: SANS}}>
      <SpeedBlur vx={vx} vy={vy} amount={0.14} max={16}>
        <div style={{position: 'absolute', left: 0, top: 0, width: PW, height: 1600, transformOrigin: '0 0', transform: tf, willChange: 'transform'}}>
          <div style={{position: 'absolute', left: -400, top: -400, width: PW + 800, height: 2400, background: '#fff'}} />
          <Header c={c} />
          {[0, 1, 2].map((i) => <Card key={i} c={c} i={i} focusBlur={focus(i)} />)}
          {!closeUp && <BookmarkButton c={c} />}
        </div>
      </SpeedBlur>
      {closeUp && <BookmarkButton c={c} cx={bx} cy={by} u={sc} />}
      <TapBloom c={c} bx={bx} by={by} />
      <Vignette strength={0.05} color="#50506a" inner={0.62} />
      <Grain opacity={0.025} step={100000} blend="overlay" />
    </AbsoluteFill>
  );
};

// 版本导出（render_shot.py 用）：默认内容、原长
export const ItineraryScrollBookmark: React.FC = () => <ItineraryScrollBookmarkGroup />;
// 单拿 026-D"点书签"：从 6.3s 开始的 1.8s（69 帧）
export const BOOKMARK_TAP_DURATION = 69;
export const BookmarkTap: React.FC<{inputs?: ItineraryInputs}> = ({inputs}) => <ItineraryScrollBookmarkGroup inputs={inputs} startAt={6.3} />;

if (checkContract(ITINERARY_SCROLL_BOOKMARK_CONTRACT).length) throw new Error(checkContract(ITINERARY_SCROLL_BOOKMARK_CONTRACT).join('; '));
