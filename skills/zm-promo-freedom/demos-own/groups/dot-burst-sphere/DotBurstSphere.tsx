// 【镜头组】dot-burst-sphere：黑底一个大圆（灰→白）越缩越小成一个点，背景浮出点阵 → 点"炸开"迎面飞来、聚成右边一颗转动的点阵球，
//   左边两行字从下往上露出（第二行淡紫），一道紫光扫过球面，字往上收走（033-A 一拍，开场）
// 学的动作（dwhitedesign · cube 0–4.8s，60fps 逐帧量过）：
//   0.25 灰圆直径≈890（955,550）→ 0.5 变白 850 → 0.75 685 → 1.0 305 → 1.25 100（1010,535）→ 1.35 没了
//   0.45 起背景错位点阵淡入（间距≈50），1.1–1.45 几个灰色大虚点飘过；1.35–1.6 点迎面飞来（大、散）
//   1.75 球半径 600（1210,540）→ 2.0 480 → 2.25 435 → 2.5 400，最后稳在（1334,536）r395、慢慢转
//   字 130px 在 x=144：第一行 1.85 起从下往上露出，第二行（#a9b0ff）2.7 起；3.4–4.4 紫光从右往左扫过球；4.6 字往上收
// 我们的内容：四种动效。/ 不用调参。（产品是虚构的点阵动效库，最后一段落版标"虚构 · 仅作演示"）
import React from 'react';
import {smoothKf} from '../_kit/smoothKey';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {GroupContract, checkContract, checkInputs, outputDuration, planExtras, toSource} from '../../../assets/lib/helpers/groupClock';
import {DotCanvas, Form, clamp, eio, eo, grid, hash, mix, rimWave, sphere, timeline} from '../_kit/dotField';

const FPS = 30;
export const DOT_BURST_SPHERE_CONTRACT: GroupContract = {
  sourceDuration: 144 / 30,
  fps: 30,
  motion: [[0, 3.2], [3.3, 144 / 30]],
  holds: [{at: 3.25, maxExtra: 2}],
  landmarks: {circle: 0.2, dot: 1.25, burst: 1.35, sphere: 1.75, line1: 1.85, line2: 2.7, sweep: 3.4, exit: 4.6},
  sfx: [
    {at: 'circle', type: '上扬铺垫', note: '低频 swell', volume: 0.35},
    {at: 'burst', type: '运镜', note: '粒子炸开 whoosh', volume: 0.5},
    {at: 'line1', type: '轻tick', note: '轻 tick', volume: 0.25},
    {at: 'sweep', type: '闪光', note: '细光 shimmer', volume: 0.3},
  ],
  inputs: {l1: {maxChars: 7}, l2: {maxChars: 7}},
};
export type BurstInputs = {l1: string; l2: string};
export const BURST_DEFAULT_INPUTS: BurstInputs = {l1: '四种动效。', l2: '不用调参。'};
export const checkBurstInputs = (x: BurstInputs) => checkInputs(DOT_BURST_SPHERE_CONTRACT, {l1: x.l1, l2: x.l2});
export const planBurst = (sec: number) => planExtras(DOT_BURST_SPHERE_CONTRACT, sec);
export const burstFrames = (extras: number[]) => Math.round(outputDuration(DOT_BURST_SPHERE_CONTRACT, extras) * FPS);
export const DOT_BURST_SPHERE_DURATION = 144;
export const SANS_EN = '"Inter","PingFang SC","Noto Sans CJK SC","Noto Sans SC",sans-serif';
export const BG = '#1b1b1e';

const kf = (t: number, K: number[][], e: (u: number) => number = eio) => { if (K.length > 2 && K.every((k, j) => j === 0 || k[0] > K[j - 1][0])) return smoothKf(t, K); if (t <= K[0][0]) return K[0][1]; for (let i = 0; i < K.length - 1; i++) if (t <= K[i + 1][0]) return mix(K[i][1], K[i + 1][1], e((t - K[i][0]) / (K[i + 1][0] - K[i][0]))); return K[K.length - 1][1]; };
/** 从下往上露出 / 往上收走的一行字 */
export const MaskLine: React.FC<{text: string; x: number; y: number; size: number; color: string; inAt: number; outAt?: number; s: number; weight?: number}> = ({text, x, y, size, color, inAt, outAt = 1e9, s, weight = 500}) => {
  // 2026-11-19 按原片逐帧：一行字不是整行一起从下面冒上来，而是一个字一个字从基线下冒上来（每个错开 ≈0.04s），收走时也一个个往上缩进去
  const ch = Array.from(text);
  if (s < inAt || s > outAt + 0.3 + ch.length * 0.03) return null;
  return (
    <div style={{position: 'absolute', left: x, top: y - size * 0.75, height: size * 1.5, overflow: 'hidden', display: 'flex', fontFamily: SANS_EN, fontSize: size, fontWeight: weight, color, whiteSpace: 'pre', lineHeight: `${size * 1.5}px`, letterSpacing: '-0.01em'}}>
      {ch.map((c, i) => { const a = eo(clamp((s - inAt - i * 0.04) / 0.32)), b = eio(clamp((s - outAt - i * 0.03) / 0.22)); return <span key={i} style={{display: 'inline-block', transform: `translateY(${(1 - a) * size * 1.2 - b * size * 1.3}px) rotate(${(1 - a) * 7}deg)`, transformOrigin: '0% 100%'}}>{c}</span>; })}
    </div>
  );
};

export const DotBurstSphereGroup: React.FC<{inputs?: BurstInputs; extras?: number[]}> = ({inputs: x = BURST_DEFAULT_INPUTS, extras = [0]}) => {
  const tt = useCurrentFrame() / FPS;
  const s = toSource(tt, DOT_BURST_SPHERE_CONTRACT, extras);
  const held = tt - s;
  const rot = s * 0.55 + held * 0.55;
  const G = grid(76, 0.42);
  const gridA = clamp((s - 0.45) / 0.4);
  // 2026-11-19 炸开改成一整段连续运动（光流量过：原片 1.3 速度就到顶 140、之后 0.6s 慢慢减下来；之前我们 1.18 先慢慢起步、1.45 才到顶，
  //   而且 1.5 / 1.75 / 2.0 … 每个中间造型都是一段段直线插值，速度一折一折的）。球的位置 / 大小用平滑曲线连续变化，网格→球只做一次变形，用「先猛后缓」的缓动
  const SK = (k: number) => [[1.4, [1350, 540, 1650, 2.0][k]], [1.5, [1350, 540, 1075, 2.6][k]], [1.75, [1210, 540, 560, 1.5][k]], [2.0, [1262, 520, 450, 1.2][k]], [2.25, [1310, 540, 405, 1][k]], [2.5, [1330, 540, 375, 1][k]], [3.0, [1334, 536, 370, 1][k]], [4.55, [1334, 536, 368, 1][k]], [4.8, [1340, 540, 340, 0.95][k]]];
  const sph = () => sphere(kf(s, SK(0)), kf(s, SK(1)), kf(s, SK(2)), rot, 0.5, 2200, 0, kf(s, SK(3)));
  const gridF = G.map((d) => ({...d, a: d.a * gridA, x: d.x + s * 6}));
  let dots: Form;
  // 逐帧（1/15s）：原片网格不是散开，而是镜头往网格里推（点距 76 → 1.37 约 130、点也变大）——那片网格其实就是贴着镜头的巨大球面，1.4 起看到球的边，再一路缩小
  const gz = kf(s, [[1.18, 1], [1.26, 1.12], [1.32, 1.32], [1.38, 1.72]]);
  const gk = clamp((gz - 1) / 0.72); const zoomG = gridF.map((d) => ({...d, x: 1350 + (d.x - 1350) * gz, y: 540 + (d.y - 540) * gz, s: d.s * mix(1, 2.3, gk), a: Math.min(0.95, d.a * mix(1, 2.3, gk))})); // 推近时点越来越大越亮
  if (s < 1.18) dots = gridF;
  else if (s < 1.36) dots = zoomG;
  else { const u = clamp((s - 1.36) / 0.12); dots = u >= 1 ? sph() : timeline(u, [[0, () => zoomG, {stagger: 0.04, drift: 0, stop: true}], [1, () => sph()]]); }
  // 原片 4.65 起球开始散：点轻轻抖开、往外飘（接下一段的散开）
  if (s > 4.62) { const e = clamp((s - 4.62) / 0.2); dots = dots.map((d, k) => ({...d, x: d.x + (hash(k * 7.3) - 0.5) * 40 * e * e, y: d.y + (hash(k * 2.9) - 0.5) * 40 * e * e + 10 * e * hash(k)})); }
  // 紫光浪：3.4–4.6 绕着球边走（右上 → 上 → 左上 → 左下 → 左），亮的那一侧点往外鼓 6%
  const wAng = kf(s, [[3.3, 0.2], [3.55, -0.35], [3.8, -1.57], [4.05, -2.45], [4.3, -3.85], [4.55, -3.3], [4.7, -3.1]]);
  const wStr = kf(s, [[3.3, 0], [3.45, 0.9], [3.6, 1], [3.75, 0.35], [3.9, 0.7], [4.05, 1], [4.3, 1], [4.45, 0.55], [4.6, 0.25], [4.72, 0]]);
  const lit = s > 3.3 && s < 4.72 ? rimWave(dots, kf(s, SK(0)), kf(s, SK(1)), kf(s, SK(2)), wAng, wStr, 0.085) : dots;
  // 圆
  // 2026-11-18 按 1/15s 重新量：圆 0.03 就在了（先深灰、慢慢变亮），缩小是一条顺滑的加速—减速曲线，1.4 还剩 d≈50
  const cd = kf(s, [[0.03, 900], [0.27, 885], [0.47, 850], [0.6, 818], [0.73, 707], [0.87, 467], [1.0, 298], [1.13, 156], [1.27, 78], [1.4, 52], [1.47, 24]]);
  const ccx = kf(s, [[0.03, 958], [0.5, 960], [0.75, 975], [1.0, 985], [1.33, 1015]]);
  const ccy = kf(s, [[0.03, 548], [0.5, 540], [1.33, 535]]);
  const lum = kf(s, [[0.0, 27], [0.07, 85], [0.13, 140], [0.2, 178], [0.27, 205], [0.4, 228], [0.5, 242]]);
  const showC = s >= 0.0 && s < 1.48;
  // 灰色大虚点
  const bokeh = s > 1.05 && s < 1.5 ? Array.from({length: 9}, (_, i) => ({x: hash(i) * 1920 + (s - 1.05) * 300 * (hash(i + 9) - 0.5), y: hash(i * 3) * 1080, r: 20 + hash(i * 7) * 22, a: 0.28 * Math.sin(Math.PI * clamp((s - 1.05) / 0.45))})) : [];
  return (
    <AbsoluteFill style={{background: BG, overflow: 'hidden'}}>
      <DotCanvas dots={lit} />
      {bokeh.map((b, i) => <div key={i} style={{position: 'absolute', left: b.x - b.r, top: b.y - b.r, width: b.r * 2, height: b.r * 2, borderRadius: '50%', background: `rgba(200,200,210,${b.a})`, filter: 'blur(1.5px)'}} />)}
      {showC && <div style={{position: 'absolute', left: ccx - cd / 2, top: ccy - cd / 2, width: cd, height: cd, borderRadius: '50%', background: `rgb(${Math.round(lum)},${Math.round(lum - 1)},${Math.round(lum - 3)})`}} />}
      <MaskLine text={x.l1} x={144} y={480} size={124} color="#f2f2f4" inAt={1.85} outAt={4.6} s={s} />
      <MaskLine text={x.l2} x={144} y={622} size={124} color="#a9b0ff" inAt={2.7} outAt={4.62} s={s} />
    </AbsoluteFill>
  );
};

if (checkContract(DOT_BURST_SPHERE_CONTRACT).length) throw new Error(checkContract(DOT_BURST_SPHERE_CONTRACT).join('；'));
export const DotBurstSphere: React.FC = () => <DotBurstSphereGroup />;
