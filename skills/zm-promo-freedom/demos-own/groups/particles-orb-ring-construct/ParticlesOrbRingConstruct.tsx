// 【镜头组】particles-orb-ring-construct：墨绿底，一串薄荷绿短线粒子从下往上飞、聚成一个圆盘图标，四周像磁场一样张开一圈圈椭圆轨道线 →
//   圆盘猛地扩满屏、中间一个黑圆反向撑开吞成黑底 → 黑底里一个白圆环，环里几道虚线椭圆在转，正中一行等宽小字 → 几个虚线圆交叠成图标并标出尺寸线（014-D 一串，产品登场 / 讲理念）
// 学的动作（Abstudiobrand · Neutron 12.8–18.0s，按 30fps 逐帧量过，2026-11-21）：
//   12.8–13.5 短线粒子从画面下方往上冲（13.3 在 x≈960、y 570–1080 一柱）；13.6 聚到中心，13.75 圆盘出现（直径 312，中心 960,540）
//   13.6–14.6 磁场线（一组过中心、越来越宽的椭圆）往外张开：14.3 横向 180–1740；圆盘 13.9 312 → 14.3 396 → 14.55 531，图标在里面转
//   14.6–14.75 圆盘扩到直径 ≈1470，中间一个黑圆从中心撑开（14.75 直径 444），15.0 黑色几乎占满（四角还露一点薄荷绿），中心一个小环（直径 258）
//   15.0–15.4 白色圆环长到直径 870，里面 4 道虚线椭圆慢转，中间一行等宽字（两头小三角），上下两个小三角；16.4–16.8 换成构造图：
//   4 个虚线圆（半径 ≈232，上下左右各偏 ≈155）交叠，中心是青色图标，上方「1x / 1,40」尺寸框、右边「1x」；17.6 图标加斜线填充，右边和下面画出青色尺寸线
// 我们的内容：中间那行字「为把一切连在一起而生」，图标是自己画的三瓣旋涡（不照搬原片 logo），右下角标"虚构 · 仅作演示"。
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {GroupContract, checkContract, checkInputs, outputDuration, planExtras, toSource} from '../../../assets/lib/helpers/groupClock';

const FPS = 30;
const S0 = 12.8;
const BG = '#1c2e24';
const MINT = '#9effca';
const TEAL = '#1aa5a0';
const MONO = '"Noto Sans Mono CJK SC","DejaVu Sans Mono",monospace';
const SANS = '"Noto Sans CJK SC","PingFang SC",sans-serif';
const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const eo = (u: number) => 1 - Math.pow(1 - clamp(u), 3);
const eio = (u: number) => { const x = clamp(u); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
const hash = (n: number) => { const v = Math.sin(n * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };
const lin = (t: number, K: number[][]) => {
  if (t <= K[0][0]) return K[0][1];
  for (let i = 1; i < K.length; i++) if (t <= K[i][0]) { const [a, va] = K[i - 1], [b, vb] = K[i]; return va + (vb - va) * (t - a) / (b - a); }
  return K[K.length - 1][1];
};

export const ORB_RING_CONTRACT: GroupContract = {
  sourceDuration: 156 / 30,
  fps: 30,
  motion: [[0, 3.6], [4.0, 156 / 30]],
  holds: [{at: 3.8, maxExtra: 1.5}],
  landmarks: {particles: 0, orb: 0.95, field: 0.8, burst: 1.8, ring: 2.2, construct: 4.0, dims: 4.8},
  sfx: [
    {at: 'particles', type: '运镜', note: '粒子 rush', tail: 0.8, volume: 0.3},
    {at: 'orb', type: '弹出', note: '聚合 pop', volume: 0.35},
    {at: 'burst', type: '落版重击', note: '扩散 boom', volume: 0.45},
    {at: 'construct', type: '轻tick', note: '轻 tick 一串', tail: 0.6, volume: 0.25},
  ],
  inputs: {line: {maxChars: 12}},
};
export type OrbRingInputs = {line: string; note: string};
export const ORB_RING_DEFAULT_INPUTS: OrbRingInputs = {line: '为把一切连在一起而生', note: '虚构 · 仅作演示'};
export const checkOrbRingInputs = (x: OrbRingInputs) => checkInputs(ORB_RING_CONTRACT, {line: x.line});
export const planOrbRing = (sec: number) => planExtras(ORB_RING_CONTRACT, sec);
export const orbRingFrames = (extras: number[]) => Math.round(outputDuration(ORB_RING_CONTRACT, extras) * FPS);
export const ORB_RING_DURATION = 156;

// 自己画的图标：三瓣旋涡
const Icon: React.FC<{size: number; color: string; rot?: number; hatch?: number}> = ({size, color, rot = 0, hatch = 0}) => (
  <svg width={size} height={size} viewBox="-50 -50 100 100" style={{transform: `rotate(${rot}deg)`}}>
    <defs><pattern id="ht" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="6" height="6" fill={color} /><line x1="0" y1="0" x2="0" y2="6" stroke="#0a4a48" strokeWidth={2.2 * hatch} /></pattern></defs>
    {[0, 120, 240].map((a) => <path key={a} transform={`rotate(${a})`} d="M0 -38 C 22 -38 34 -18 26 2 C 20 -10 8 -16 -6 -14 C -2 -24 -2 -32 0 -38 Z" fill={hatch > 0 ? 'url(#ht)' : color} />)}
    <circle r="7" fill={color} />
  </svg>
);

export const ParticlesOrbRingConstructGroup: React.FC<{inputs?: OrbRingInputs; extras?: number[]}> = ({inputs: x = ORB_RING_DEFAULT_INPUTS, extras = [0]}) => {
  const tt = useCurrentFrame() / FPS;
  const s = toSource(tt, ORB_RING_CONTRACT, extras) + S0;
  const els: React.ReactNode[] = [];
  let bg = BG;
  if (s < 14.75) {
    // 粒子
    if (s < 14.2) for (let i = 0; i < 46; i++) {
      const t0 = 12.8 + hash(i) * 0.6, u = (s - t0) / 0.9;
      if (u < 0 || u > 1.2) continue;
      const k = eio(u);
      const x0 = 300 + hash(i + 3) * 1300, y0 = 1150, conv = clamp((s - 13.4) / 0.4);
      const px = x0 + (960 + (hash(i + 5) - 0.5) * 160 - x0) * Math.max(k, conv * 0.9), py = y0 + (540 + (hash(i + 7) - 0.5) * 300 - y0) * k;
      const ang = Math.atan2(540 - y0, 960 - x0) * 180 / Math.PI;
      els.push(<div key={'p' + i} style={{position: 'absolute', left: px, top: py, width: 26, height: 5, borderRadius: 3, background: MINT, transform: `rotate(${ang}deg)`, opacity: clamp(u / 0.1) * (1 - clamp((u - 1) / 0.2))}} />);
    }
    // 磁场线
    if (s > 13.55) {
      const sp = eo((s - 13.55) / 1.0), fade = 1 - clamp((s - 14.6) / 0.15);
      els.push(<svg key="field" width={1920} height={1080} style={{position: 'absolute', inset: 0, opacity: fade}}>
        {[0.12, 0.22, 0.34, 0.48, 0.66, 0.9, 1.2].map((k, i) => <ellipse key={i} cx={960} cy={540} rx={(60 + k * 760) * sp} ry={140 + 230 * sp} fill="none" stroke="rgba(170,220,195,0.45)" strokeWidth={1.4} />)}
        {Array.from({length: 10}, (_, i) => { const a = hash(i) * Math.PI * 2 + s * (0.6 + hash(i + 2)), rx = (200 + hash(i + 4) * 560) * sp, ry = 140 + 230 * sp; return <circle key={'o' + i} cx={960 + Math.cos(a) * rx} cy={540 + Math.sin(a) * ry} r={5 + hash(i) * 6} fill={MINT} />; })}
      </svg>);
    }
    // 圆盘 + 图标
    if (s > 13.7) {
      const d = lin(s, [[13.7, 120], [13.85, 312], [14.3, 396], [14.55, 531], [14.75, 1470]]);
      const icon = lin(s, [[13.75, 110], [14.3, 200], [14.55, 70]]) * (1 - clamp((s - 14.6) / 0.08));
      els.push(<div key="orb" style={{position: 'absolute', left: 960 - d / 2, top: 540 - d / 2, width: d, height: d, borderRadius: '50%', background: MINT, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{icon > 1 && <Icon size={icon} color="#14231b" rot={(s - 13.75) * 160} />}</div>);
      if (s > 14.62) { const bd = lin(s, [[14.62, 0], [14.75, 444]]); els.push(<div key="hole" style={{position: 'absolute', left: 960 - bd / 2, top: 540 - bd / 2, width: bd, height: bd, borderRadius: '50%', background: '#000'}} />); }
    }
  } else {
    bg = '#000';
    // 薄荷绿四角退场
    if (s < 15.15) { const r = lin(s, [[14.75, 740], [15.0, 1050], [15.15, 1300]]); els.push(<div key="corner" style={{position: 'absolute', inset: 0, background: MINT, WebkitMaskImage: `radial-gradient(circle ${r}px at 50% 50%, transparent 99%, #000 100%)`, maskImage: `radial-gradient(circle ${r}px at 50% 50%, transparent 99%, #000 100%)`}} />); }
    if (s < 16.6) {
      const R = lin(s, [[14.75, 129], [15.0, 129], [15.4, 435], [16.4, 450], [16.6, 300]]), o = 1 - clamp((s - 16.45) / 0.15);
      const textO = clamp((s - 15.05) / 0.2);
      els.push(<svg key="ring" width={1920} height={1080} style={{position: 'absolute', inset: 0, opacity: o}}>
        <circle cx={960} cy={540} r={R} fill="none" stroke="#f2f2f2" strokeWidth={3} />
        {[0, 45, 90, 135].map((a, i) => <ellipse key={i} cx={960} cy={540} rx={R * 0.95} ry={R * 0.38} fill="none" stroke="#bbb" strokeWidth={1.6} strokeDasharray="22 16" transform={`rotate(${a + (s - 15) * 18} 960 540)`} />)}
        <path d={`M ${960 - 10} ${540 - R + 24} L ${960 + 10} ${540 - R + 24} L 960 ${540 - R + 8} Z`} fill="#f2f2f2" />
        <path d={`M ${960 - 10} ${540 + R - 24} L ${960 + 10} ${540 + R - 24} L 960 ${540 + R - 8} Z`} fill="#f2f2f2" />
        <g opacity={textO}><path d={`M ${960 - R + 30} 540 l 18 -12 v 24 Z`} fill="#f2f2f2" /><path d={`M ${960 + R - 30} 540 l -18 -12 v 24 Z`} fill="#f2f2f2" /></g>
      </svg>);
      els.push(<div key="txt" style={{position: 'absolute', left: 0, right: 0, top: 540, transform: 'translateY(-50%)', textAlign: 'center', fontFamily: MONO, fontSize: Math.max(10, R * 0.07), letterSpacing: '0.3em', color: '#eee', opacity: textO * o}}>{x.line}</div>);
    }
    if (s >= 16.45) {
      // 构造图
      const k = eo((s - 16.45) / 0.35), hatch = clamp((s - 17.4) / 0.25), dims = clamp((s - 17.3) / 0.3);
      els.push(<svg key="cons" width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        {[[0, -155], [0, 155], [-155, 0], [155, 0]].map(([dx, dy], i) => <circle key={i} cx={960 + dx * k} cy={540 + dy * k} r={232} fill="none" stroke="#ddd" strokeWidth={2} strokeDasharray="8 7" opacity={k} />)}
        <circle cx={960} cy={540} r={155} fill="none" stroke="#888" strokeWidth={1.5} opacity={k} />
        <rect x={960 - 165} y={50} width={330} height={60} fill="none" stroke={TEAL} strokeWidth={2} opacity={k} />
        <text x={960} y={40} textAnchor="middle" fontFamily={SANS} fontSize={22} fill="#ccc" opacity={k}>1x / 1,40</text>
        <text x={1320} y={548} fontFamily={SANS} fontSize={22} fill="#ccc" opacity={k}>1x</text>
        <g opacity={dims}><line x1={1500} y1={300} x2={1500} y2={780} stroke={TEAL} strokeWidth={2.5} /><line x1={680} y1={1025} x2={1240} y2={1025} stroke={TEAL} strokeWidth={2.5} /><text x={1520} y={548} fontFamily={SANS} fontSize={22} fill="#ccc">1x</text><text x={960} y={1060} textAnchor="middle" fontFamily={SANS} fontSize={22} fill="#ccc">1x</text></g>
      </svg>);
      els.push(<div key="ic" style={{position: 'absolute', left: 960 - 160, top: 540 - 160, opacity: k}}><Icon size={320} color={TEAL} rot={(1 - k) * -40} hatch={hatch} /></div>);
    }
  }
  return (
    <AbsoluteFill style={{background: bg, overflow: 'hidden'}}>
      {els}
      <div style={{position: 'absolute', right: 36, bottom: 26, fontFamily: SANS, fontSize: 20, color: 'rgba(180,210,195,0.45)', letterSpacing: '0.06em'}}>{x.note}</div>
    </AbsoluteFill>
  );
};

if (checkContract(ORB_RING_CONTRACT).length) throw new Error(checkContract(ORB_RING_CONTRACT).join('；'));
export const ParticlesOrbRingConstruct: React.FC = () => <ParticlesOrbRingConstructGroup />;
