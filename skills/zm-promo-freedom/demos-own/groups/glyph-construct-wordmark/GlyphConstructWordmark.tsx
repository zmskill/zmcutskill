// 【镜头组】glyph-construct-wordmark：墨绿底 + 构造网格，品牌名一个字一个字“画”出来：先出虚线参考线和锚点、再描边、再填实，镜头推近一下又拉远换下一个字 →
//   最后整个字标一排出现：先是空心描边，逐个填实，最后整排变成统一的灰绿实心（014-C 一拍，产品登场 / 讲“精心打磨”）
// 学的动作（Abstudiobrand · Neutron 6.3–12.7s，按 30fps 逐帧量过，2026-11-21）：
//   每个字母约 0.75s：出现时字高 ≈390（6.5），推近到 ≈540（6.75），再拉远缩到 ≈285 并淡掉（7.0），中间一个十字锚点，下一个字母在正中出现
//   字的样子：浅灰绿填充 + 2px 薄荷绿描边 + 薄荷绿锚点圆点；上下两条虚线（顶线 / 基线）和左右竖虚线，旁边几个深色小标签
//   11.45 整个字标在 y 555–900 一排出现（几乎占满画宽）：先是空心描边，几个字母先填亮，11.9 全部填上，12.25 变成统一的灰绿实心带锚点，12.55 往下沉走
// 我们的内容：品牌名「中子科技」（虚构），每个字约 1.25s，汉字没有真实轮廓锚点，锚点按字框位置近似摆放，右下角标"虚构 · 仅作演示"。
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {GroupContract, checkContract, checkInputs, outputDuration, planExtras, toSource} from '../../../assets/lib/helpers/groupClock';

const FPS = 30;
const S0 = 6.3;
const BG = '#1c2e24';
const MINT = '#9effca';
const FILL = '#c9d9cd';
const SANS = '"Noto Sans CJK SC","PingFang SC",sans-serif';
const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const eo = (u: number) => 1 - Math.pow(1 - clamp(u), 3);
const eio = (u: number) => { const x = clamp(u); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
const hash = (n: number) => { const v = Math.sin(n * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };

export const GLYPH_CONSTRUCT_CONTRACT: GroupContract = {
  sourceDuration: 192 / 30,
  fps: 30,
  motion: [[0, 192 / 30]],
  holds: [],
  landmarks: {c1: 0.05, c2: 1.3, c3: 2.55, c4: 3.8, word: 5.15, solid: 5.95},
  sfx: [
    {at: 'c1', type: '电流', note: '描线 scribble', tail: 0.6, volume: 0.25},
    {at: 'c2', type: '电流', note: '描线 scribble', tail: 0.6, volume: 0.25},
    {at: 'c3', type: '电流', note: '描线 scribble', tail: 0.6, volume: 0.25},
    {at: 'c4', type: '电流', note: '描线 scribble', tail: 0.6, volume: 0.25},
    {at: 'word', type: '轻tick', note: '一串 tick', tail: 0.6, volume: 0.3},
  ],
  inputs: {name: {maxChars: 4}},
};
export type GlyphConstructInputs = {name: string; note: string};
export const GLYPH_CONSTRUCT_DEFAULT_INPUTS: GlyphConstructInputs = {name: '中子科技', note: '虚构 · 仅作演示'};
export const checkGlyphConstructInputs = (x: GlyphConstructInputs) => checkInputs(GLYPH_CONSTRUCT_CONTRACT, {name: x.name});
export const planGlyphConstruct = (sec: number) => planExtras(GLYPH_CONSTRUCT_CONTRACT, sec);
export const glyphConstructFrames = (extras: number[]) => Math.round(outputDuration(GLYPH_CONSTRUCT_CONTRACT, extras) * FPS);
export const GLYPH_CONSTRUCT_DURATION = 192;

// 一个字：参考线 + 描边 + 填充 + 锚点（viewBox 以字框为单位：0..100）
const Glyph: React.FC<{ch: string; draw: number; fill: number; guides: number; seed: number; solid?: number}> = ({ch, draw, fill, guides, seed, solid = 0}) => {
  const anchors = [[8, 12], [92, 12], [8, 88], [92, 88], [50, 6], [50, 94], [30, 50], [70, 50], [50, 50]].filter((_, i) => hash(seed * 7 + i) > 0.25);
  const L = 1600;
  return <svg viewBox="-30 -20 160 140" width="100%" height="100%" style={{overflow: 'visible'}}>
    <g opacity={guides}>
      {[0, 100].map((y) => <line key={'h' + y} x1={-30} x2={130} y1={y} y2={y} stroke="#6f8277" strokeWidth={0.4} strokeDasharray="2 2" />)}
      {[0, 100].map((xv) => <line key={'v' + xv} x1={xv} x2={xv} y1={-20} y2={120} stroke="#6f8277" strokeWidth={0.4} strokeDasharray="2 2" />)}
      <rect x={70} y={-12} width={14} height={5} rx={1} fill="#3a4d42" />
      <rect x={20} y={104} width={12} height={5} rx={1} fill="#3a4d42" />
    </g>
    <text x={50} y={88} textAnchor="middle" fontFamily={SANS} fontSize={100} fontWeight={500} fill={solid > 0 ? `rgb(${Math.round(201 - 60 * solid)},${Math.round(217 - 55 * solid)},${Math.round(205 - 58 * solid)})` : FILL} fillOpacity={fill} stroke={MINT} strokeWidth={0.8 * (1 - solid * 0.7)} strokeDasharray={`${L * draw} ${L}`} strokeLinejoin="round">{ch}</text>
    <g opacity={guides}>{anchors.map(([ax, ay], i) => <circle key={i} cx={ax} cy={ay} r={1.6} fill={MINT} opacity={clamp(draw * 3 - i * 0.15)} />)}</g>
  </svg>;
};

export const GlyphConstructWordmarkGroup: React.FC<{inputs?: GlyphConstructInputs; extras?: number[]}> = ({inputs: x = GLYPH_CONSTRUCT_DEFAULT_INPUTS, extras = []}) => {
  const tt = useCurrentFrame() / FPS;
  const s = toSource(tt, GLYPH_CONSTRUCT_CONTRACT, extras) + S0;
  const A = Array.from(x.name);
  const els: React.ReactNode[] = [];
  // 背景构造网格
  els.push(<div key="grid" style={{position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(120,150,135,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(120,150,135,0.08) 1px, transparent 1px)', backgroundSize: '48px 48px'}} />);
  const per = 1.25;
  A.forEach((ch, i) => {
    const t0 = 6.35 + i * per, u = s - t0;
    if (u < 0 || u > per + 0.05) return;
    const H = u < 0.6 ? 390 + 150 * eo((u - 0.3) / 0.3) : 540 - 255 * eio((u - 0.75) / 0.4);
    const draw = clamp(u / 0.35), fill = clamp((u - 0.3) / 0.25), out = clamp((u - 0.95) / 0.2);
    els.push(<div key={'g' + i} style={{position: 'absolute', left: 960 - H * 0.8, top: 540 - H * 0.6, width: H * 1.6, height: H * 1.4, opacity: (1 - out) * clamp(u / 0.08)}}><Glyph ch={ch} draw={draw} fill={fill} guides={clamp(u / 0.15)} seed={i} /></div>);
    if (u > 1.0) { const k = clamp((u - 1.0) / 0.2); els.push(<svg key={'x' + i} width={60} height={60} viewBox="-10 -10 20 20" style={{position: 'absolute', left: 930, top: 510, opacity: Math.sin(Math.PI * k)}}><path d="M-8 0 H8 M0 -8 V8" stroke="#8fa79a" strokeWidth={0.6} /><circle r={1.6} fill={MINT} /></svg>); }
  });
  // 整个字标
  if (s >= 11.4) {
    const H = 345, total = H * A.length * 1.05, left = 960 - total / 2;
    const sink = eio((s - 12.55) / 0.15);
    A.forEach((ch, i) => {
      const t0 = 11.4 + i * 0.1;
      const draw = clamp((s - t0) / 0.25), fill = clamp((s - 11.75 - (A.length - 1 - i) * 0.06) / 0.2), solid = clamp((s - 12.15) / 0.15);
      els.push(<div key={'w' + i} style={{position: 'absolute', left: left + i * H * 1.05 - H * 0.3, top: 727 - H * 0.6 + sink * 300, width: H * 1.6, height: H * 1.4, opacity: 1 - sink}}><Glyph ch={ch} draw={draw} fill={fill * (i % 2 === 0 && s < 11.9 ? 1 : 0.6 + 0.4 * solid)} guides={0.7 * (1 - solid * 0.4)} seed={i + 10} solid={solid} /></div>);
    });
  }
  return (
    <AbsoluteFill style={{background: BG, overflow: 'hidden'}}>
      {els}
      <div style={{position: 'absolute', right: 36, bottom: 26, fontFamily: SANS, fontSize: 20, color: 'rgba(180,210,195,0.45)', letterSpacing: '0.06em'}}>{x.note}</div>
    </AbsoluteFill>
  );
};

if (checkContract(GLYPH_CONSTRUCT_CONTRACT).length) throw new Error(checkContract(GLYPH_CONSTRUCT_CONTRACT).join('；'));
export const GlyphConstructWordmark: React.FC = () => <GlyphConstructWordmarkGroup />;
