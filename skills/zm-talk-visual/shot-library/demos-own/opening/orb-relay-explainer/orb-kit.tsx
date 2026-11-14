// OrbRelayExplainer 的共用件：时间工具（按"秒"写关键帧，直接对照逐元素时间表）、果冻光球、3D 纸箭头光标、颜色工具。
// 确定性渲染：不用 Math.random / Date。
import React from 'react';
import {EASE, FONT, mix} from '../../../kit/polish';

export {EASE, mix};
export type Ease = (t: number) => number;
export const FPS = 30;
export const SANS = `"PingFang SC", "Noto Sans CJK SC", "Noto Sans SC", ${FONT.sans}`;
export const clamp = (x: number, a = 0, b = 1) => (x < a ? a : x > b ? b : x);
export const hash = (i: number, n = 0) => { const x = Math.sin(i * 12.9898 + n * 78.233) * 43758.5453; return x - Math.floor(x); };
export const fx = (n: number, d = 2) => n.toFixed(d);
export const X = (pct: number) => (pct / 100) * 1920;
export const Y = (pct: number) => (pct / 100) * 1080;

// 区间进度（秒）
export const rp = (t: number, at: number, dur: number, e: Ease = EASE.out) => e(clamp((t - at) / Math.max(1e-6, dur)));

// 关键帧插值（秒）：[时间, 值, 进入这一段用的缓动]
export const kf = (t: number, keys: [number, number, Ease?][]) => {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    const [t1, v1, e] = keys[i];
    const [t0, v0] = keys[i - 1];
    if (t <= t1) return mix(v0, v1, (e ?? EASE.smooth)(clamp((t - t0) / (t1 - t0))));
  }
  return keys[keys.length - 1][1];
};

// 单调三次样条（Fritsch–Carlson）：按时间表的采样点连成一条不停顿、不过冲的曲线 —— 光球轨迹用它，速度连续
export const spl = (t: number, keys: [number, number][]) => {
  const n = keys.length;
  if (t <= keys[0][0]) return keys[0][1];
  if (t >= keys[n - 1][0]) return keys[n - 1][1];
  const d: number[] = [];
  for (let i = 0; i < n - 1; i++) d.push((keys[i + 1][1] - keys[i][1]) / (keys[i + 1][0] - keys[i][0]));
  const m: number[] = [d[0]];
  for (let i = 1; i < n - 1; i++) m.push(d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2);
  m.push(d[n - 2]);
  for (let i = 0; i < n - 1; i++) {
    if (d[i] === 0) { m[i] = 0; m[i + 1] = 0; continue; }
    const a = m[i] / d[i], b = m[i + 1] / d[i], s = a * a + b * b;
    if (s > 9) { const k = 3 / Math.sqrt(s); m[i] = k * a * d[i]; m[i + 1] = k * b * d[i]; }
  }
  let i = 0;
  while (t > keys[i + 1][0]) i++;
  const h = keys[i + 1][0] - keys[i][0], u = (t - keys[i][0]) / h;
  const h00 = 2 * u * u * u - 3 * u * u + 1, h10 = u * u * u - 2 * u * u + u, h01 = -2 * u * u * u + 3 * u * u, h11 = u * u * u - u * u;
  return h00 * keys[i][1] + h10 * h * m[i] + h01 * keys[i + 1][1] + h11 * h * m[i + 1];
};
// 二维路径：[时间, x%, y%] → 像素；顺带给出速度（px/帧）
export type P3 = [number, number, number];
export const path = (t: number, keys: P3[]) => ({x: X(spl(t, keys.map((k) => [k[0], k[1]]))), y: Y(spl(t, keys.map((k) => [k[0], k[2]])))});
export const pathV = (t: number, keys: P3[]) => {
  const a = path(t - 0.5 / FPS, keys), b = path(t + 0.5 / FPS, keys);
  return {vx: b.x - a.x, vy: b.y - a.y};
};

// ───────── 颜色 ─────────
const hex3 = (h: string) => { const s = h.replace('#', ''); const n = parseInt(s.length === 3 ? s.split('').map((c) => c + c).join('') : s, 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
export const lerpC = (a: string, b: string, k: number) => { const A = hex3(a), B = hex3(b); const r = A.map((v, i) => Math.round(mix(v, B[i], clamp(k)))); return '#' + r.map((v) => v.toString(16).padStart(2, '0')).join(''); };
export const rgba = (h: string, a: number) => { const c = hex3(h); return `rgba(${c[0]},${c[1]},${c[2]},${fx(clamp(a), 3)})`; };

// ───────── 果冻光球 ─────────
// 调色：top 迎光顶部 / body 主体 / bottom 底部 / core 拖在运动反方向的深色"核" / glow 外发光 / rim 边光
export type Pal = {top: string; body: string; bottom: string; core: string; glow: string; rim: string};
export const PAL: Record<string, Pal> = {
  bright: {top: '#3d7bff', body: '#2a6bff', bottom: '#2160f4', core: '#1a4ee0', glow: '#2a6bff', rim: '#8fb8ff'},
  cyan: {top: '#4cc2ff', body: '#36b6fd', bottom: '#1f7dff', core: '#1d55e0', glow: '#2b8fff', rim: '#a6e4ff'},
  cyanDeep: {top: '#1a4ad0', body: '#2a86f4', bottom: '#36c0ff', core: '#1236c8', glow: '#2a6bff', rim: '#7ad0ff'},
  deep: {top: '#1a4ee0', body: '#1d58e8', bottom: '#3aa8ff', core: '#0f2fb8', glow: '#2a5aff', rim: '#7ab8ff'},
  lilac: {top: '#3b68fb', body: '#9ab0fd', bottom: '#6e9bfe', core: '#4a72fc', glow: '#4a6aff', rim: '#d8e2ff'},
  glass: {top: '#1a2ad0', body: '#1a2ad0', bottom: '#2238d8', core: '#101c9a', glow: '#3a5cff', rim: '#3a5cff'},
};
export const mixPal = (a: Pal, b: Pal, k: number): Pal => ({
  top: lerpC(a.top, b.top, k), body: lerpC(a.body, b.body, k), bottom: lerpC(a.bottom, b.bottom, k),
  core: lerpC(a.core, b.core, k), glow: lerpC(a.glow, b.glow, k), rim: lerpC(a.rim, b.rim, k),
});
// 一串调色板按时间接力
export const palAt = (t: number, keys: [number, Pal][]) => {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) if (t <= keys[i][0]) return mixPal(keys[i - 1][1], keys[i][1], EASE.smooth(clamp((t - keys[i - 1][0]) / (keys[i][0] - keys[i - 1][0]))));
  return keys[keys.length - 1][1];
};

// 速度 → 挤压拉伸：沿运动方向拉长、横截面变细（近似体积守恒）
export const stretchOf = (vx: number, vy: number, d: number, gain = 1) => {
  const sp = Math.hypot(vx, vy);
  const k = Math.min(0.8, (sp / Math.max(60, d)) * 0.95 * gain);
  return {k, ang: Math.atan2(vy, vx) * 180 / Math.PI};
};

export const Orb: React.FC<{
  x: number; y: number; d: number; pal: Pal;
  vx?: number; vy?: number; // 当前速度（px/帧）→ 挤压拉伸
  cvx?: number; cvy?: number; // 稍滞后的速度 → 深色核往反方向晃
  sx?: number; sy?: number; // 额外的手动缩放（弧顶压扁、变方块前的横向压扁）
  opacity?: number; glow?: number; soft?: number; radius?: string; z?: number; sgain?: number; children?: React.ReactNode;
}> = ({x, y, d, pal, vx = 0, vy = 0, cvx, cvy, sx = 1, sy = 1, opacity = 1, glow = 1, soft = 0.6, radius = '50%', z, sgain = 1, children}) => {
  if (opacity <= 0.003 || d < 0.5) return null;
  const {k, ang} = stretchOf(vx, vy, d, sgain);
  const len = 1 + k, thin = 1 - 0.22 * k;
  const cx0 = cvx ?? vx, cy0 = cvy ?? vy;
  const csp = Math.hypot(cx0, cy0);
  const cm = Math.min(1, csp / Math.max(30, d * 0.4));
  // 核：静止时在下半偏中（像液体沉底），运动时拖到反方向
  const ux = csp > 0.01 ? -cx0 / csp : 0, uy = csp > 0.01 ? -cy0 / csp : 1;
  const coreX = 50 + ux * 22 * cm, coreY = 50 + mix(16, uy * 24, cm);
  const st = `rotate(${fx(ang)}deg) scale(${fx(len, 3)}, ${fx(thin, 3)}) rotate(${fx(-ang)}deg) scale(${fx(sx, 3)}, ${fx(sy, 3)})`;
  return (
    <div style={{position: 'absolute', left: x - d / 2, top: y - d / 2, width: d, height: d, transform: st, opacity, zIndex: z}}>
      {/* 外发光 */}
      <div style={{position: 'absolute', inset: -d * 0.35, borderRadius: radius, background: `radial-gradient(circle at 50% 52%, ${rgba(pal.glow, 0.42 * glow)} 0%, ${rgba(pal.glow, 0.16 * glow)} 42%, ${rgba(pal.glow, 0)} 70%)`}} />
      <div style={{position: 'absolute', inset: 0, borderRadius: radius, overflow: 'hidden', filter: soft > 0 ? `blur(${fx(soft * d / 160)}px)` : undefined,
        background: `linear-gradient(180deg, ${pal.top} 0%, ${pal.body} 46%, ${pal.bottom} 100%)`,
        boxShadow: `inset 0 ${fx(-d * 0.05)}px ${fx(d * 0.09)}px ${rgba(pal.rim, 0.55)}, inset 0 0 ${fx(d * 0.03)}px ${rgba(pal.rim, 0.35)}, 0 0 ${fx(d * 0.12)}px ${rgba(pal.glow, 0.45 * glow)}`}}>
        {/* 深色核（惯性） */}
        <div style={{position: 'absolute', left: `${fx(coreX - 30)}%`, top: `${fx(coreY - 26)}%`, width: '60%', height: '52%', borderRadius: '50%', background: `radial-gradient(circle, ${rgba(pal.core, 0.95)} 0%, ${rgba(pal.core, 0.55)} 45%, ${rgba(pal.core, 0)} 72%)`, filter: `blur(${fx(d * 0.06)}px)`}} />
        {/* 顶部柔高光 + 暗色小反光点 */}
        <div style={{position: 'absolute', left: '22%', top: '6%', width: '56%', height: '30%', borderRadius: '50%', background: `radial-gradient(ellipse, rgba(255,255,255,0.32) 0%, rgba(255,255,255,0) 70%)`, filter: `blur(${fx(d * 0.03)}px)`}} />
        <div style={{position: 'absolute', left: '40%', top: '14%', width: '16%', height: '10%', borderRadius: '50%', background: rgba(pal.core, 0.45), filter: `blur(${fx(d * 0.025)}px)`}} />
        {/* 边缘压暗（体积感） */}
        <div style={{position: 'absolute', inset: 0, borderRadius: radius, background: `radial-gradient(circle at 50% 42%, rgba(0,0,0,0) 58%, ${rgba(pal.core, 0.35)} 100%)`}} />
      </div>
      {children}
    </div>
  );
};

// 运动的光球：给一条路径和时间，自动算速度与滞后速度
export const orbMotion = (t: number, keys: P3[], lag = 0.09) => {
  const p = path(t, keys), v = pathV(t, keys), c = pathV(t - lag, keys);
  return {x: p.x, y: p.y, vx: v.vx, vy: v.vy, cvx: c.vx, cvy: c.vy};
};

// ───────── 3D 纸箭头光标：尖在 (x,y)；rot = 2D 朝向（0 = 尖朝左上的标准指针）；flip = 绕自身长轴翻转（0 正面 / 1 侧面竖条） ─────────
export const Cursor3D: React.FC<{x: number; y: number; size?: number; rot?: number; flip?: number; press?: number; opacity?: number; vx?: number; vy?: number}> = ({x, y, size = 84, rot = 0, flip = 0, press = 0, opacity = 1, vx = 0, vy = 0}) => {
  if (opacity <= 0.01) return null;
  const s = size * (1 - press * 0.15);
  const sp = Math.hypot(vx, vy);
  const str = Math.min(1.8, sp / 40); // 快飞时沿运动方向被拉长
  const ang = Math.atan2(vy, vx) * 180 / Math.PI;
  const w = Math.max(0.12, Math.abs(Math.cos(flip * Math.PI / 2)));
  return (
    <div style={{position: 'absolute', left: x, top: y, width: 0, height: 0, opacity, transform: str > 0.05 ? `rotate(${fx(ang)}deg) scale(${fx(1 + str, 3)}, ${fx(1 - str * 0.25, 3)}) rotate(${fx(-ang)}deg)` : undefined, filter: str > 0.3 ? `blur(${fx(str * 2.5)}px)` : undefined}}>
      <svg width={s} height={s * 1.15} viewBox="0 0 100 115" style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', transformOrigin: '0 0', transform: `rotate(${fx(rot)}deg) rotate(57deg) scale(1, ${fx(w, 3)}) rotate(-57deg)`, filter: `drop-shadow(4px 10px 10px rgba(10,20,90,0.55))`}}>
        <defs>
          <linearGradient id="cl" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#e2e8ff" /><stop offset="1" stopColor="#a9b8ff" /></linearGradient>
          <linearGradient id="cr" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#9aaeff" /><stop offset="1" stopColor="#5c72f0" /></linearGradient>
        </defs>
        {/* 折纸箭头：左半亮、右半暗，中间一道折痕 */}
        <path d="M0 0 L22 100 L40 64 Z" fill="url(#cl)" />
        <path d="M0 0 L40 64 L86 70 Z" fill="url(#cr)" />
        <path d="M0 0 L40 64" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" />
      </svg>
    </div>
  );
};

// 逐词点亮的一个词：浅灰、低一点、半透明 → 白色到位
export const wordStyle = (t: number, at: number, opts: {dy?: number; dx?: number; from?: string; dur?: number} = {}): React.CSSProperties => {
  const p = rp(t, at, opts.dur ?? 0.2, EASE.out);
  const w = rp(t, at + 0.03, (opts.dur ?? 0.2) + 0.08, EASE.smooth);
  return {
    opacity: t < at ? 0 : mix(0.35, 1, p),
    color: lerpC(opts.from ?? '#9a9cb0', '#ffffff', w),
    transform: `translate(${fx((1 - p) * (opts.dx ?? 0))}px, ${fx((1 - p) * (opts.dy ?? 16))}px)`,
    filter: p < 0.97 ? `blur(${fx((1 - p) * 3)}px)` : undefined,
  };
};
