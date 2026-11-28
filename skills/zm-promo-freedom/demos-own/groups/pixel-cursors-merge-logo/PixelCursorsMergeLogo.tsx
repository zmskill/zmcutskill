// 【镜头组】pixel-cursors-merge-logo：浅灰底 + 淡字符画漩涡，七八个像素小光标（蓝 / 米色 / 黑白 / 带照片的）四处冒出来晃一会儿，
//   一起往中间收、互相叠成一个，最后只剩一个蓝色像素小图标停在正中，背景漩涡淡掉（031-E 一拍，收尾）
// 学的动作（stephenhaney · Paper 40.0–45.0s，原片 1080×1080，30fps 逐帧量过，按 x+420 放进 1920×1080，2026-11-21）：
//   40.6 光标位置（中心）：(486,243) (736,330) (310,391) (250,648) (680,790) (432,857) (864,567)，边长 ≈100
//   41.0 往中间收了一半：(472,202) (762,297) (297,378) (500,553) (418,891) (702,810)；41.6 只剩三个：(756,297) (540,540) (425,891)
//   42.0 全部叠进正中 (540,540)，42.3 只剩一个蓝色像素图标（边长 ≈108）；41.8–42.4 背景字符画淡掉，之后一直停到 45.0
// 我们的内容：像素小光标和最后的图标都是自己画的方块图案（不照搬原片 logo），右下角标"虚构 · 仅作演示"。
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {AsciiDonut} from '../_kit/asciiDonut';
import {GroupContract, checkContract, outputDuration, planExtras, toSource} from '../../../assets/lib/helpers/groupClock';

const FPS = 30;
const S0 = 40.0;
const OX = 420;
const SANS = '"Noto Sans CJK SC","PingFang SC",sans-serif';
const MONO = '"Noto Sans Mono CJK SC","DejaVu Sans Mono",monospace';
const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const eio = (u: number) => { const x = clamp(u); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
const hash = (n: number) => { const v = Math.sin(n * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };
const lin = (t: number, K: number[][]) => {
  if (t <= K[0][0]) return K[0][1];
  for (let i = 1; i < K.length; i++) if (t <= K[i][0]) { const [a, va] = K[i - 1], [b, vb] = K[i]; return va + (vb - va) * (t - a) / (b - a); }
  return K[K.length - 1][1];
};
// [x40.6, y40.6, x41.0, y41.0, 消失时刻, 配色]
const CUR = [[486, 243, 472, 202, 41.4, 0], [736, 330, 762, 297, 41.95, 1], [310, 391, 297, 378, 41.3, 2], [250, 648, 500, 553, 42.0, 0], [680, 790, 702, 810, 41.5, 3], [432, 857, 418, 891, 41.9, 0], [864, 567, 640, 560, 41.7, 2]];
const PAL = [['#5b8ff0', '#a9c3f7', '#2e5fcf'], ['#c9a272', '#e3cba6', '#9c7646'], ['#151515', '#ffffff', '#555555'], ['#3b3b5c', '#b9a089', '#6d6a8a']];

export const PIXEL_MERGE_CONTRACT: GroupContract = {
  sourceDuration: 150 / 30,
  fps: 30,
  motion: [[0, 2.45]],
  holds: [{at: 3.5, maxExtra: 3}],
  landmarks: {appear: 0.1, gather: 1.0, merge: 2.0, logo: 2.3},
  sfx: [
    {at: 'appear', type: '弹出', note: '一串 pop', tail: 0.3, volume: 0.25},
    {at: 'merge', type: '点击', note: '合上 snap', volume: 0.4},
    {at: 'logo', type: '提示音', note: '品牌音 ding', volume: 0.35},
  ],
  inputs: {},
};
export type PixelMergeInputs = {note: string};
export const PIXEL_MERGE_DEFAULT_INPUTS: PixelMergeInputs = {note: '虚构 · 仅作演示'};
export const planPixelMerge = (sec: number) => planExtras(PIXEL_MERGE_CONTRACT, sec);
export const pixelMergeFrames = (extras: number[]) => Math.round(outputDuration(PIXEL_MERGE_CONTRACT, extras) * FPS);
export const PIXEL_MERGE_DURATION = 150;

// 像素小光标：两个叠在一起的空心方块（照原片的样子，图案自己画）
const PIXM = ['111100', '122100', '122111', '111221', '000221', '000111'];
const Pix: React.FC<{cx: number; cy: number; size: number; pal: string[]; seed: number; o?: number}> = ({cx, cy, size, pal, seed, o = 1}) => (
  <div style={{position: 'absolute', left: cx - size / 2, top: cy - size / 2, width: size, height: size, display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', opacity: o, transform: `rotate(${Math.floor(hash(seed) * 4) * 90}deg)`}}>
    {PIXM.join('').split('').map((v, i) => <div key={i} style={{background: v === '1' ? pal[0] : v === '2' ? pal[1] : 'transparent'}} />)}
  </div>
);
const Logo: React.FC<{cx: number; cy: number; size: number}> = ({cx, cy, size}) => {
  const M = ['011110', '122221', '123321', '123321', '122221', '011110'];
  const C = ['transparent', '#5b8ff0', '#a9c3f7', '#ffffff'];
  return <div style={{position: 'absolute', left: cx - size / 2, top: cy - size / 2, width: size, height: size, display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)'}}>{M.join('').split('').map((v, i) => <div key={i} style={{background: C[+v]}} />)}</div>;
};
const AsciiSwirl: React.FC<{s: number; color: string; o: number}> = ({s, color, o}) => {
  const rows = 64, W = 'paperomgpaper*+=-:omgpaperpaperpg';
  const lines = Array.from({length: rows}, (_, r) => { const sh = Math.floor(s * 6 + r * 3) % W.length; return (W.slice(sh) + W + W + W + W + W + W).slice(0, 140); });
  const mask = `radial-gradient(ellipse 34% 40% at ${46 + Math.sin(s * 0.5) * 2}% 46%, transparent 38%, #000 40%, #000 52%, transparent 58%, transparent 66%, #000 70%, #000 78%, transparent 84%)`;
  return <div style={{position: 'absolute', inset: 0, opacity: o, WebkitMaskImage: mask, maskImage: mask}}>{lines.map((l, r) => <div key={r} style={{position: 'absolute', left: -20, top: r * 17, fontFamily: MONO, fontSize: 15, lineHeight: 1, color, whiteSpace: 'pre', opacity: 0.55 + 0.45 * hash(r)}}>{l}</div>)}</div>;
};

export const PixelCursorsMergeLogoGroup: React.FC<{inputs?: PixelMergeInputs; extras?: number[]}> = ({inputs: x = PIXEL_MERGE_DEFAULT_INPUTS, extras = [0]}) => {
  const tt = useCurrentFrame() / FPS;
  const s = toSource(tt, PIXEL_MERGE_CONTRACT, extras) + S0;
  const els: React.ReactNode[] = [];
  CUR.forEach(([x6, y6, x10, y10, gone, pal], i) => {
    const t0 = 40.1 + hash(i * 3) * 0.3;
    if (s < t0 || s > 42.05) return;
    const wob = (k: number) => Math.sin(s * 2.3 + i * 1.7) * 18 * k;
    const cx = lin(s, [[t0, x6 + 60 * (hash(i) - 0.5)], [40.6, x6], [41.0, x10], [gone, 540], [42.05, 540]]) + wob(1 - clamp((s - 41.0) / 0.5));
    const cy = lin(s, [[t0, y6 + 60 * (hash(i + 5) - 0.5)], [40.6, y6], [41.0, y10], [gone, 540], [42.05, 540]]) + wob(1 - clamp((s - 41.0) / 0.5)) * 0.6;
    const o = clamp((s - t0) / 0.08) * (s > gone ? 1 - clamp((s - gone) / 0.08) : 1);
    els.push(<Pix key={i} cx={cx + OX} cy={cy} size={100} pal={PAL[pal]} seed={i * 7} o={o} />);
  });
  const lk = eio((s - 42.0) / 0.3);
  if (s > 41.95) els.push(<div key="lg" style={{opacity: clamp((s - 41.95) / 0.1)}}><Logo cx={540 + OX} cy={540} size={100 + 8 * lk} /></div>);
  return (
    <AbsoluteFill style={{background: '#e6e6e6', overflow: 'hidden'}}>
      <AsciiDonut cx={1300} cy={560} size={1100} a={1.3 + (s - 40) * 0.32} b={0.7 + (s - 40) * 0.18} color="#a8a8a8" strong="#8a8a8a" o={0.5 * (1 - clamp((s - 41.8) / 0.6))} />
      {els}
      <div style={{position: 'absolute', right: 36, bottom: 26, fontFamily: SANS, fontSize: 20, color: 'rgba(60,60,60,0.4)', letterSpacing: '0.06em'}}>{x.note}</div>
    </AbsoluteFill>
  );
};

if (checkContract(PIXEL_MERGE_CONTRACT).length) throw new Error(checkContract(PIXEL_MERGE_CONTRACT).join('；'));
export const PixelCursorsMergeLogo: React.FC = () => <PixelCursorsMergeLogoGroup />;
