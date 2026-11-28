// 【镜头组】triptych-icon-morph：画面竖着分成三格（各 640 宽），中间那格颜色和两边相反、图标更大；三格同一帧一起换图标（压扁 → 弹开成新形状），
//   背景深浅也跟着翻：人 → 人在椭圆里 → 眼睛 → 对话气泡 → 放大镜 → 圆环 → 星 → 箭头（014-G 一拍，枚举功能一览）
// 学的动作（Abstudiobrand · Neutron 26.3–32.3s，按 30fps 逐帧量过，2026-11-21）：
//   三格 x 0–640 / 640–1280 / 1280–1920；两边图标宽 ≈280（中心 y≈640），中间 ≈400（中心 y≈520），实心粗线条带一层往下 5% 的“厚度”（开头的人从下面升上来）
//   换图标时刻（源是 60fps，按像素逐帧量）：27.2 / 27.3 / 28.3 / 29.72 / 30.73 / 30.83 / 31.63；每次 0.16s：先纵向压扁成一条线，再弹开成新图标（略过冲）
//   颜色翻转时刻：开头 26.43–26.7 快闪 4 下，然后 27.3 / 28.3 / 29.83 / 30.73 / 31.63（和换图标同一帧）（薄荷 #9effca ↔ 墨绿 #1c2e24，图标总是和自己那格底色相反）
//   29.83 / 30.73 / 31.63 后 0.1s 三格都是过渡色（深 #2f5240 / 浅 #88e8a8），图标带一点“厚度”（偏移一层深色）
//   结尾 31.7 起图标慢慢往下沉（加速，到 32.3 下沉 ≈200）；中间那格 32.05–32.35 顶边往下收（图标跟着往下）（露出下一段的墨绿底）
// 我们的内容：图标自己画（通用线性图标），右下角标"虚构 · 仅作演示"。
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {GroupContract, checkContract, outputDuration, planExtras, toSource} from '../../../assets/lib/helpers/groupClock';

const FPS = 30;
const S0 = 26.3;
const MINT = '#9effca';
const DARK = '#1c2e24';
const SANS = '"Noto Sans CJK SC","PingFang SC",sans-serif';
const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const CHANGE = [27.2, 27.3, 28.3, 29.72, 30.73, 30.83, 31.63];
const FLIP = [26.43, 26.53, 26.63, 26.7, 27.3, 28.3, 29.83, 30.73, 31.63];
const eioT = (u: number) => { const x = clamp(u); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
const back = (u: number) => { const x = clamp(u), c = 1.8; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };

export const TRIPTYCH_CONTRACT: GroupContract = {
  sourceDuration: 180 / 30,
  fps: 30,
  motion: [[0, 6.0]],
  holds: [],
  landmarks: {in: 0, c1: 0.7, c2: 1.1, c3: 2.0, c4: 3.4, c5: 4.1, c6: 4.6, c7: 5.4},
  sfx: [{at: 'c1', type: '弹出', note: '变形 pop', volume: 0.3}, {at: 'c3', type: '弹出', note: '变形 pop', volume: 0.3}, {at: 'c4', type: '弹出', note: '变形 pop', volume: 0.3}, {at: 'c6', type: '弹出', note: '变形 pop', volume: 0.3}, {at: 'c7', type: '弹出', note: '变形 pop', volume: 0.3}],
  inputs: {},
};
export type TriptychInputs = {note: string};
export const TRIPTYCH_DEFAULT_INPUTS: TriptychInputs = {note: '虚构 · 仅作演示'};
export const planTriptych = (sec: number) => planExtras(TRIPTYCH_CONTRACT, sec);
export const triptychFrames = (extras: number[]) => Math.round(outputDuration(TRIPTYCH_CONTRACT, extras) * FPS);
export const TRIPTYCH_DURATION = 180;

const Shape: React.FC<{k: number; c: string}> = ({k, c}) => {
  const st = {stroke: c, strokeWidth: 13, fill: 'none', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const};
  switch (k) {
    case 0: return <g><circle cx="0" cy="-26" r="14" fill={c} /><path d="M-30 34 Q 0 -26 30 34 Z M-30 34 Q 0 24 30 34" {...st} /></g>;
    case 1: return <g><ellipse cx="0" cy="0" rx="44" ry="34" {...st} /><circle cx="0" cy="-12" r="8" fill={c} /><path d="M-12 18 L 0 -2 L 12 18 Z" fill={c} /></g>;
    case 2: return <g><path d="M-44 4 Q 0 -40 44 4 Q 0 46 -44 4 Z" {...st} /><circle cx="0" cy="4" r="12" fill={c} /><path d="M-12 -30 L 0 -48 L 12 -30" {...st} /></g>;
    case 3: return <g><path d="M-40 -6 Q -40 -36 0 -36 Q 40 -36 40 -6 Q 40 24 6 24 L 14 44 L -10 24 Q -40 24 -40 -6 Z" {...st} />{[-16, 0, 16].map((xx) => <circle key={xx} cx={xx} cy={-6} r="5.5" fill={c} />)}</g>;
    case 4: return <g><circle cx="8" cy="-8" r="28" {...st} /><path d="M-12 12 L -38 38" {...st} strokeWidth={14} /></g>;
    case 5: return <g><ellipse cx="0" cy="0" rx="38" ry="30" {...st} strokeWidth={14} /></g>;
    case 6: return <g><path d="M0 -44 Q 6 -10 36 -6 Q 6 -2 0 32 Q -6 -2 -36 -6 Q -6 -10 0 -44 Z" {...st} /><rect x="-6" y="38" width="12" height="10" fill={c} /></g>;
    default: return <g><path d="M0 -44 L 30 -4 L 12 -4 L 12 40 L -12 40 L -12 -4 L -30 -4 Z" {...st} /></g>;
  }
};

export const TriptychIconMorphGroup: React.FC<{inputs?: TriptychInputs; extras?: number[]}> = ({inputs: x = TRIPTYCH_DEFAULT_INPUTS, extras = []}) => {
  const tt = useCurrentFrame() / FPS;
  const s = toSource(tt, TRIPTYCH_CONTRACT, extras) + S0;
  let k = 0; CHANGE.forEach((t0, i) => { if (s >= t0) k = i + 1; });
  const tC = k > 0 ? CHANGE[k - 1] : 26.3;
  // 压扁 → 弹开
  const pre = CHANGE.find((t0) => s < t0 && s > t0 - 0.08);
  const sy = pre !== undefined ? clamp((pre - s) / 0.08) : back((s - tC) / 0.16);
  const flips = FLIP.filter((t0) => s >= t0).length;
  const sideDark = flips % 2 === 1;
  const dim = [29.83, 30.73, 31.63].some((f) => s >= f && s < f + 0.1) ? 1 : 0;
  const rise = (s < 27.05 ? (27.05 - s) * 600 : 0) + (s > 31.7 ? Math.pow(clamp((s - 31.7) / 0.6), 2) * 200 : 0);
  const midTop = s > 32.05 ? eioT((s - 32.05) / 0.3) * 860 : 0;
  const panels = [0, 1, 2].map((i) => {
    const dark = i === 1 ? !sideDark : sideDark;
    // 圆环那一下：深格调成 #2f5240、浅格调成 #88e8a8（量过）
    const bg = dim ? (dark ? '#2f5240' : '#88e8a8') : (dark ? DARK : MINT), fg = dark ? MINT : DARK;
    const size = i === 1 ? 600 : 430;
    const cy = i === 1 ? 520 : 640;
    const slide = s < 26.55 ? (i % 2 ? 1 : -1) * (26.55 - s) * 4000 : i === 1 ? midTop : 0;
    return <div key={i} style={{position: 'absolute', left: i * 640, top: slide, width: 641, height: 1080, background: bg, overflow: 'hidden', backgroundImage: `linear-gradient(${dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)'} 1px, transparent 1px), linear-gradient(90deg, ${dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)'} 1px, transparent 1px)`, backgroundSize: '40px 40px'}}>
      <svg width={size} height={size} viewBox="-60 -60 120 120" style={{position: 'absolute', left: 320 - size / 2, top: cy - size / 2 + rise, transform: `scaleY(${Math.max(0.02, sy)}) scaleX(${2 - Math.min(1.1, Math.max(0.9, sy))})`, overflow: 'visible'}}>
        <g transform="translate(0 5)"><Shape k={k} c={dark ? '#5fbf92' : '#0d1a13'} /></g>
        <Shape k={k} c={fg} />
      </svg>
    </div>;
  });
  return (
    <AbsoluteFill style={{background: s > 32.0 ? DARK : '#0f8f8e', overflow: 'hidden'}}>
      {panels}
      <div style={{position: 'absolute', right: 36, bottom: 26, fontFamily: SANS, fontSize: 20, color: 'rgba(120,150,135,0.7)', letterSpacing: '0.06em'}}>{x.note}</div>
    </AbsoluteFill>
  );
};

if (checkContract(TRIPTYCH_CONTRACT).length) throw new Error(checkContract(TRIPTYCH_CONTRACT).join('；'));
export const TriptychIconMorph: React.FC = () => <TriptychIconMorphGroup />;
