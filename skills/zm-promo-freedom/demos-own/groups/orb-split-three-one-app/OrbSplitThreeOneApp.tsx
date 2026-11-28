// 【镜头组】orb-split-three-one-app：黑底一颗渐变小球 + 下面一个词，四周彩色小点漂 → 球往两边分出两颗、变成三个功能图标（各自换色、下面各有名字）→
//   三颗缩小淡掉 → 一行字先是虚线描边、很暗很虚，慢慢填实变白（013-E 一拍，产品登场 / 枚举）
// 学的动作（mnowakdesign · 音乐 App 19.6–23.9s，30fps 逐帧量过，2026-11-21）：
//   19.9 球出现（中心 960,516，直径 318，橙粉紫渐变），名字在 y≈759；20.2–20.5 后面左右各探出一颗（蓝 / 青绿），20.5 分成三颗：中心 x 564 / 960 / 1326，直径 ≈306，名字 y≈753
//   21.6–22.1 三颗缩小（直径 243、间距 315）后 22.1–22.2 淡掉；彩色小点（粉 / 蓝 / 青）一直在四周慢漂
//   22.2–23.4 中间一行字（字高 ≈135，x 660–1260）：白色虚线描边 + 聚光灯从左往右扫过、照到的字填颗粒灰渐变，整行从 2 倍推远到 1 倍，23.2 变实心白字（第二轮重量）
// 我们的内容：「音乐 / 语音 / 图片」→「一个 App」，图标自己画，右下角标"虚构 · 仅作演示"。
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {GroupContract, checkContract, checkInputs, outputDuration, planExtras, toSource} from '../../../assets/lib/helpers/groupClock';

const FPS = 30;
const S0 = 19.6;
const SANS = '"Inter","PingFang SC","Noto Sans CJK SC","Noto Sans SC",sans-serif';
const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const eo = (u: number) => 1 - Math.pow(1 - clamp(u), 3);
const eio = (u: number) => { const x = clamp(u); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
const hash = (n: number) => { const v = Math.sin(n * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };
const lin = (t: number, K: number[][]) => {
  if (t <= K[0][0]) return K[0][1];
  for (let i = 1; i < K.length; i++) if (t <= K[i][0]) { const [a, va] = K[i - 1], [b, vb] = K[i]; return va + (vb - va) * (t - a) / (b - a); }
  return K[K.length - 1][1];
};
// 第二轮（2026-11-23 用户：13 系列字的光影 / 质感没学到）：三颗球原片是「颗粒噪点渐变」——渐变上压一层很粗的单色噪点（像磨砂 / 网点），
//   亮边那侧颗粒最明显；以前是干净的径向渐变，看起来像 CG 按钮
const GR = ['radial-gradient(circle at 28% 72%, #b4d6ff 0%, #5a86e8 30%, #2c48c0 62%, #1a2378 100%)', 'linear-gradient(205deg, #ff8a2a 0%, #f4563a 40%, #dc3a7c 75%, #a62ad2 100%)', 'radial-gradient(circle at 72% 62%, #a8ffd8 0%, #36dca0 32%, #129a86 64%, #0c4a62 100%)'];
/** 球上的颗粒：单色 fractalNoise 用 overlay 叠上去，再用一层径向遮罩让亮边更粗 */
const Grain: React.FC<{d: number; id: string; o?: number}> = ({d, id, o = 0.75}) => (
  <svg width={d} height={d} style={{position: 'absolute', left: 0, top: 0, mixBlendMode: 'overlay', opacity: o, pointerEvents: 'none'}}>
    <filter id={id} x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="2" seed={7} stitchTiles="stitch" /><feColorMatrix type="matrix" values="1 0 0 0 0  1 0 0 0 0  1 0 0 0 0  0 0 0 0 1" /><feComponentTransfer><feFuncR type="linear" slope="3" intercept="-1" /><feFuncG type="linear" slope="3" intercept="-1" /><feFuncB type="linear" slope="3" intercept="-1" /></feComponentTransfer></filter>
    <rect width={d} height={d} filter={`url(#${id})`} />
  </svg>
);

export const ORB_SPLIT_CONTRACT: GroupContract = {
  sourceDuration: 129 / 30,
  fps: 30,
  motion: [[0, 3.85]],
  holds: [{at: 4.1, maxExtra: 2}],
  landmarks: {orb: 0.3, split: 0.6, three: 0.9, shrink: 2.0, text: 2.6, clear: 3.8},
  sfx: [
    {at: 'orb', type: '弹出', note: '弹出 pop', volume: 0.35},
    {at: 'split', type: '运镜', note: '分裂 whoosh', volume: 0.35},
    {at: 'text', type: '闪光', note: '显影 shimmer', tail: 1.2, volume: 0.3},
  ],
  inputs: {labels: {count: 3, maxChars: 3}, title: {maxChars: 8}},
};
export type OrbSplitInputs = {labels: string[]; title: string; note: string};
export const ORB_SPLIT_DEFAULT_INPUTS: OrbSplitInputs = {labels: ['音乐', '语音', '图片'], title: '一个 App', note: '虚构 · 仅作演示'};
export const checkOrbSplitInputs = (x: OrbSplitInputs) => checkInputs(ORB_SPLIT_CONTRACT, {labels: x.labels, title: x.title});
export const planOrbSplit = (sec: number) => planExtras(ORB_SPLIT_CONTRACT, sec);
export const orbSplitFrames = (extras: number[]) => Math.round(outputDuration(ORB_SPLIT_CONTRACT, extras) * FPS);
export const ORB_SPLIT_DURATION = 129;

const Icon: React.FC<{k: number; d: number}> = ({k, d}) => {
  const W = '#fff', sz = d * 0.38;
  if (k === 0) return <svg width={sz} height={sz} viewBox="0 0 24 24"><path d="M9 18 V5 L20 3 V16" stroke={W} strokeWidth="2.4" fill="none" /><circle cx="6.5" cy="18" r="2.8" fill={W} /><circle cx="17.5" cy="16" r="2.8" fill={W} /></svg>;
  if (k === 1) return <svg width={sz} height={sz} viewBox="0 0 24 24">{[3, 7, 11, 15].map((x0, i) => <rect key={i} x={x0} y={12 - [3, 6, 8, 4][i]} width="2" height={[6, 12, 16, 8][i]} rx="1" fill={W} />)}<circle cx="19.5" cy="15" r="2.2" fill={W} /><path d="M16 21 C16 18.5 23 18.5 23 21" fill={W} /></svg>;
  return <svg width={sz} height={sz} viewBox="0 0 24 24"><rect x="4" y="5" width="16" height="14" rx="3" stroke={W} strokeWidth="2.2" fill="none" /><circle cx="9" cy="10" r="1.8" fill={W} /><path d="M5 17 L10 12 L14 16 L16 14 L20 18" stroke={W} strokeWidth="2" fill="none" /></svg>;
};

export const OrbSplitThreeOneAppGroup: React.FC<{inputs?: OrbSplitInputs; extras?: number[]}> = ({inputs: x = ORB_SPLIT_DEFAULT_INPUTS, extras = [0]}) => {
  const tt = useCurrentFrame() / FPS;
  const s = toSource(tt, ORB_SPLIT_CONTRACT, extras) + S0;
  const els: React.ReactNode[] = [];
  // 彩色小点
  if (s < 22.25) {
    const fade = 1 - clamp((s - 22.05) / 0.2);
    for (let i = 0; i < 16; i++) {
      const a0 = hash(i) * Math.PI * 2, r0 = 260 + hash(i + 3) * 380;
      const a = a0 + (s - 19.6) * (0.12 + hash(i + 7) * 0.1) * (i % 2 ? 1 : -1);
      const cx = 960 + Math.cos(a) * r0 * 1.45, cy = 520 + Math.sin(a) * r0 * 0.55;
      const d = 8 + hash(i + 11) * 22, col = ['radial-gradient(circle at 35% 30%, #ff7a5a, #e0308a 70%)', 'radial-gradient(circle at 35% 30%, #7ab8ff, #3a5ad8 70%)', 'radial-gradient(circle at 35% 30%, #7affc8, #20a08a 70%)', 'radial-gradient(circle at 35% 30%, #ffffff, #9a9aa8 70%)'][i % 4]; // 原片小点是带高光的双色小球
      els.push(<div key={'d' + i} style={{position: 'absolute', left: cx - d / 2, top: cy - d / 2, width: d, height: d, borderRadius: '50%', background: col, opacity: clamp((s - 19.8 - hash(i) * 0.3) / 0.2) * fade * (i % 4 === 3 ? 0.6 : 1)}} />);
    }
  }
  // 球 → 三颗
  if (s >= 19.85 && s < 22.25) {
    const pop = eo((s - 19.85) / 0.1), split = eio((s - 20.15) / 0.4), shrink = eio((s - 21.6) / 0.5), fade = 1 - clamp((s - 22.08) / 0.15);
    const d = lin(s, [[19.85, 220], [20.0, 318], [20.5, 306], [21.6, 306], [22.1, 243]]) * pop;
    const gap = lin(s, [[20.15, 0], [20.55, 381], [21.6, 381], [22.1, 315]]);
    [0, 2, 1].forEach((k) => {
      const off = (k - 1) * gap * (k === 1 ? 0 : 1);
      if (k !== 1 && split <= 0) return;
      const cx = 960 + off, cy = 516 + shrink * 3;
      els.push(<div key={'o' + k} style={{position: 'absolute', left: cx - d / 2, top: cy - d / 2, width: d, height: d, borderRadius: '50%', overflow: 'hidden', background: GR[k === 1 && s < 20.2 ? 1 : k], display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: fade, boxShadow: `0 0 40px rgba(0,0,0,0.4)`}}>
        <Grain d={d} id={`og${k}`} o={k === 1 ? 0.4 : 0.75} />
        <div style={{position: 'relative', display: 'flex'}}>{(k === 1 || split > 0.8) && <Icon k={k} d={d} />}</div>
      </div>);
      const lab = x.labels[k], shown = k === 1 ? Array.from(lab).slice(0, Math.ceil(clamp((s - 19.95) / 0.35) * Array.from(lab).length)).join('') : lab;
      els.push(<div key={'l' + k} style={{position: 'absolute', left: cx - 200, width: 400, top: lin(s, [[20.0, 759], [20.5, 753], [21.6, 753], [22.1, 705]]), transform: 'translateY(-50%)', textAlign: 'center', fontFamily: SANS, fontSize: lin(s, [[21.6, 50], [22.1, 40]]), color: '#f2f2f2', opacity: fade * (k === 1 ? 1 : clamp((s - 20.6) / 0.2))}}>{shown}</div>);
    });
  }
  // 一行字（第二轮，逐 0.1s 看原片 22.15–23.25）：
  //   ① 白色细虚线描边（1.5px，短划 + 大间隔），整行一开始放大到 ≈2 倍、慢慢推远到 1 倍；
  //   ② 一盏「聚光灯」从左往右扫过：被照到的字填上一层带颗粒的灰色渐变（中间亮、边上暗），灯走过去后那几个字又暗回只剩虚线；
  //   ③ 23.0 起虚线越连越密变成细实线描边，23.2 一下变成实心白字。
  if (s >= 22.15) {
    const zoom = lin(s, [[22.15, 2.5], [22.6, 1.8], [23.0, 1.25], [23.3, 1.03], [23.5, 1]]); // 原片 22.6 还有 1.8 倍
    const dashK = clamp((s - 22.85) / 0.25); // 0 虚线 → 1 实线
    const spot = lin(s, [[22.25, 600], [23.15, 1340]]); // 聚光灯中心 x（推远前的坐标，1920 宽）
    const spotA = clamp((s - 22.25) / 0.12) * (1 - clamp((s - 23.12) / 0.08));
    const solid = clamp((s - 23.17) / 0.06);
    const outA = (0.95 - 0.35 * dashK) * (1 - solid);
    els.push(<svg key="t" width={1920} height={1080} style={{position: 'absolute', inset: 0, transform: `scale(${zoom})`, transformOrigin: '960px 540px'}}>
      <defs>
        <radialGradient id="tspot" gradientUnits="userSpaceOnUse" cx={spot} cy={530} r={230} fx={spot - 40} fy={490}>
          <stop offset="0" stopColor="#9a9a9a" stopOpacity={spotA} /><stop offset="0.45" stopColor="#5c5c5c" stopOpacity={spotA} /><stop offset="0.8" stopColor="#262626" stopOpacity={0.7 * spotA} /><stop offset="1" stopColor="#111" stopOpacity="0" />
        </radialGradient>
        <filter id="tgrain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.95" numOctaves="2" seed={3} result="n" /><feColorMatrix in="n" type="saturate" values="0" result="g" /><feComposite in="g" in2="SourceAlpha" operator="in" result="gi" /><feBlend in="SourceGraphic" in2="gi" mode="overlay" result="bl" /><feComposite in="bl" in2="SourceGraphic" operator="in" /></filter>
      </defs>
      <text x={960} y={590} textAnchor="middle" fontFamily={SANS} fontSize={160} fontWeight={700} fill="url(#tspot)" filter="url(#tgrain)">{x.title}</text>
      <text x={960} y={590} textAnchor="middle" fontFamily={SANS} fontSize={160} fontWeight={700} fill="none" stroke="#fff" strokeOpacity={outA} strokeWidth={1.6 / zoom} strokeDasharray={dashK >= 1 ? undefined : `${5 + 25 * dashK} ${9 * (1 - dashK) + 0.5}`}>{x.title}</text>
      {solid > 0 && <text x={960} y={590} textAnchor="middle" fontFamily={SANS} fontSize={160} fontWeight={700} fill="#fff" fillOpacity={solid}>{x.title}</text>}
    </svg>);
  }
  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      {els}
      <div style={{position: 'absolute', right: 36, bottom: 26, fontFamily: SANS, fontSize: 20, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.06em'}}>{x.note}</div>
    </AbsoluteFill>
  );
};

if (checkContract(ORB_SPLIT_CONTRACT).length) throw new Error(checkContract(ORB_SPLIT_CONTRACT).join('；'));
export const OrbSplitThreeOneApp: React.FC = () => <OrbSplitThreeOneAppGroup />;
