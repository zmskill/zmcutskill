// 【镜头组】pill-rows-slide-claims：硬切满屏五行蓝色胶囊（长胶囊写乱码货币符号、圆胶囊里一个箭头），一行往左一行往右猛滑再刹住，
//   中间三行各有一个胶囊写着卖点词；乱码一帧一变，箭头一格格乱转（035-C 一拍，卖点快闪）
// 学的动作（Varcyyyy · Venmo 6.2–6.97s，30fps 逐帧量过，2026-11-21）：
//   五行胶囊高 199、行距 213（上沿 15/227/442/654/869）；每行图案 = 长胶囊 576 + 空 42 + 圆 200 + 空 40，一格 858
//   6.3 时卖点胶囊左沿：第 2 行 516（第一个词）、第 3 行 918（第二个词）、第 4 行 582（第三个词）；第 1、5 行同位置是乱码胶囊（706 / 644）
//   每行每帧位移（相位相关量，正 = 往右）：第 1 行 142,67,40,27,18,14,10,8… 最后 3；第 2 行 -108,-51,-30…-2；第 3 行 -61,-29,-17…-1；第 4 行 57,27,16…1；第 5 行 -213,-100,-59…-4
//   乱码 6.2–6.47 每帧换一组，6.47 起定成一串货币符号；箭头每 2–3 帧转 45° 的整数倍
// 我们的内容：卖点「极速 / 简单 / 安全」，乱码用各国货币符号，右下角标"虚构 · 仅作演示"。
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {GroupContract, checkContract, checkInputs, outputDuration, planExtras, toSource} from '../../../assets/lib/helpers/groupClock';

const FPS = 30;
const S0 = 6.2;
const BLUE = '#1296f2';
const SANS = '"Inter","PingFang SC","Noto Sans CJK SC","Noto Sans SC",sans-serif';
const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const hash = (n: number) => { const v = Math.sin(n * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };
const TOPS = [15, 227, 442, 654, 869];
const DXS = [
  [142, 67, 40, 27, 18, 14, 10, 8, 7, 5, 5, 4, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
  [-108, -51, -30, -20, -14, -10, -8, -6, -5, -4, -3, -3, -3, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2],
  [-61, -29, -17, -11, -8, -6, -4, -4, -3, -2, -2, -2, -2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [57, 27, 16, 10, 7, 5, 4, 3, 3, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [-213, -100, -59, -39, -28, -20, -15, -12, -10, -8, -7, -6, -5, -5, -5, -4, -4, -4, -4, -4, -4, -5, -5],
];
const AT63 = [706, 516, 918, 582, 644]; // 6.3 时“中间那个长胶囊”的左沿
const PITCH = 858;
// 第 r 行在时刻 s 的偏移（相对 6.3）
const rowX = (r: number, s: number) => {
  const D = DXS[r]; let x = 0;
  const f = (s - 6.2) * 30; // 0 = 6.2
  for (let i = 0; i < D.length; i++) { const a = i, b = i + 1; if (f >= b) x += D[i]; else if (f > a) x += D[i] * (f - a); }
  const at63 = D[0] + D[1] + D[2];
  return x - at63;
};
const GLY = ['$', '€', '£', '₹', '₽', '¥', '₩', '₺', '₫', '₦', '฿', '₭', '₲', '₴', '%', '&', '*', '(', '@'];

export const PILL_ROWS_CONTRACT: GroupContract = {
  sourceDuration: 23 / 30,
  fps: 30,
  motion: [[0, 0.45], [0.5, 23 / 30]],
  holds: [{at: 0.47, maxExtra: 1}],
  landmarks: {cut: 0, settle: 0.3},
  sfx: [{at: 'cut', type: '短甩', note: '甩动 whoosh', volume: 0.4}],
  inputs: {claims: {count: 3, maxChars: 3}},
};
export type PillRowsInputs = {claims: string[]; settle: string; note: string};
export const PILL_ROWS_DEFAULT_INPUTS: PillRowsInputs = {claims: ['极速', '简单', '安全'], settle: '¥ $ € £ ₹', note: '虚构 · 仅作演示'};
export const checkPillRowsInputs = (x: PillRowsInputs) => checkInputs(PILL_ROWS_CONTRACT, {claims: x.claims});
export const planPillRows = (sec: number) => planExtras(PILL_ROWS_CONTRACT, sec);
export const pillRowsFrames = (extras: number[]) => Math.round(outputDuration(PILL_ROWS_CONTRACT, extras) * FPS);
export const PILL_ROWS_DURATION = 23;

const Arrow: React.FC<{ang: number}> = ({ang}) => (
  <svg width="96" height="96" viewBox="0 0 24 24" style={{transform: `rotate(${ang}deg)`}}><path d="M5 19 L19 5 M9 5 H19 V15" stroke="#fff" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
);

export const PillRowsSlideClaimsGroup: React.FC<{inputs?: PillRowsInputs; extras?: number[]}> = ({inputs: x = PILL_ROWS_DEFAULT_INPUTS, extras = [0]}) => {
  const tt = useCurrentFrame() / FPS;
  const s = toSource(tt, PILL_ROWS_CONTRACT, extras) + S0;
  const fr = Math.floor((s - 6.2) * 30);
  const glyph = (seed: number) => s >= 6.47 ? x.settle : Array.from({length: 4}, (_, i) => GLY[Math.floor(hash(seed * 31 + i * 7 + fr * 13) * GLY.length)]).join('  ');
  const els: React.ReactNode[] = [];
  TOPS.forEach((top, r) => {
    const base = AT63[r] + rowX(r, s);
    for (let k = -3; k <= 3; k++) {
      const px = base + k * PITCH;
      const claim = k === 0 && r >= 1 && r <= 3 ? x.claims[r - 1] : null;
      if (px > -700 && px < 1940) els.push(
        <div key={`p${r}_${k}`} style={{position: 'absolute', left: px, top, width: 576, height: 199, borderRadius: 100, background: BLUE, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: SANS, whiteSpace: 'nowrap', fontSize: claim ? 104 : 58, fontWeight: claim ? 500 : 400, letterSpacing: claim ? '-0.01em' : '0.08em'}}>{claim ?? glyph(r * 10 + k)}</div>,
      );
      const cx = px + 576 + 42;
      if (cx > -220 && cx < 1940) {
        const step = Math.floor((s - 6.2) * 12 + hash(r * 5 + k) * 3);
        const ang = -45 + 45 * Math.floor(hash(r * 17 + k * 3 + step * 5) * 8);
        els.push(<div key={`c${r}_${k}`} style={{position: 'absolute', left: cx, top, width: 200, height: 199, borderRadius: '50%', background: BLUE, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Arrow ang={ang} /></div>);
      }
    }
  });
  return (
    <AbsoluteFill style={{background: '#fff', overflow: 'hidden'}}>
      {els}
      <div style={{position: 'absolute', right: 36, bottom: 6, fontFamily: SANS, fontSize: 18, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.06em'}}>{x.note}</div>
    </AbsoluteFill>
  );
};

if (checkContract(PILL_ROWS_CONTRACT).length) throw new Error(checkContract(PILL_ROWS_CONTRACT).join('；'));
export const PillRowsSlideClaims: React.FC = () => <PillRowsSlideClaimsGroup />;
