// 【镜头组】palette-steps-list：硬切黑底，一根竖色条（几种品牌色上下叠）往两边长成金字塔台阶（越下面越宽），再一下铺满成一行行全宽色带，
//   每行左边色名、中间一个小三角箭头、右边色值三行小字 → 字淡掉，最上面那条深色往下撑满（014-B 一拍，转场 / 讲配色）
// 学的动作（Abstudiobrand · Neutron 4.3–6.4s，60fps 原片按 30fps 逐帧量过，2026-11-21）：
//   4.35 竖条 x 864–1056（宽 192），从上到下：青 0–399 / 薄荷 399–690 / 雾白 690–852 / 白 852–1044
//   4.45 顶上多出深绿一截，下面几层开始变宽；4.55 台阶：深绿 846–1074、青 822–1098、薄荷 777–1143、雾白 699–1221、白 477–1443（每层高 ≈180，底边贴画面底）
//   4.65 深绿 684–1236 / 青 540–1380 / 薄荷 384–1536 / 雾白 273–1647 / 白 165–1755；4.8 几乎铺满（33–1887），三角箭头从左边转着滑进来（x≈615）
//   5.0 定成六行全宽色带（每行 ≈180 高：黑 / 深绿 / 青 / 薄荷 / 雾白 / 白），色名在 x≈198（字号 ≈23），右边 x≈1554 三行小字色值
//   6.0–6.15 字淡掉；6.2–6.4 深绿那行往下撑满画面，接下一段
// 我们的内容：六个色名换成中文（炭黑 / 深林绿 / 柔和青 / 薄荷绿 / 雾白 / 纯白），色值照实写，右下角标"虚构 · 仅作演示"。
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {GroupContract, checkContract, checkInputs, outputDuration, planExtras, toSource} from '../../../assets/lib/helpers/groupClock';

const FPS = 30;
const S0 = 4.3;
const SANS = '"Inter","PingFang SC","Noto Sans CJK SC","Noto Sans SC",sans-serif';
const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const eo = (u: number) => 1 - Math.pow(1 - clamp(u), 3);
const lin = (t: number, K: number[][]) => {
  if (t <= K[0][0]) return K[0][1];
  for (let i = 1; i < K.length; i++) if (t <= K[i][0]) { const [a, va] = K[i - 1], [b, vb] = K[i]; return va + (vb - va) * (t - a) / (b - a); }
  return K[K.length - 1][1];
};
const COLS = [[0, 0, 0], [27, 46, 35], [11, 143, 142], [158, 255, 202], [213, 255, 237], [255, 255, 255]];
// 每层（深绿..白）半宽关键帧
const HW = [
  [[4.42, 96], [4.55, 114], [4.65, 276], [4.8, 777], [4.95, 960]],
  [[4.35, 96], [4.55, 138], [4.65, 420], [4.8, 828], [4.95, 960]],
  [[4.35, 96], [4.55, 183], [4.65, 576], [4.8, 867], [4.95, 960]],
  [[4.35, 96], [4.45, 108], [4.55, 261], [4.65, 687], [4.8, 894], [4.95, 960]],
  [[4.35, 96], [4.45, 144], [4.55, 483], [4.65, 795], [4.8, 927], [4.95, 960]],
];

export const PALETTE_STEPS_CONTRACT: GroupContract = {
  sourceDuration: 63 / 30,
  fps: 30,
  motion: [[0, 0.75], [1.7, 63 / 30]],
  holds: [{at: 1.2, maxExtra: 1.5}],
  landmarks: {bar: 0.05, steps: 0.25, full: 0.65, labels: 0.7, out: 1.9},
  sfx: [{at: 'steps', type: '轻tick', note: '一串 tick', tail: 0.4, volume: 0.3}, {at: 'full', type: '运镜', note: '展开 whoosh', volume: 0.3}],
  inputs: {names: {count: 6, maxChars: 4}},
};
export type PaletteStepsInputs = {names: string[]; note: string};
export const PALETTE_STEPS_DEFAULT_INPUTS: PaletteStepsInputs = {names: ['炭黑', '深林绿', '柔和青', '薄荷绿', '雾白', '纯白'], note: '虚构 · 仅作演示'};
export const checkPaletteStepsInputs = (x: PaletteStepsInputs) => checkInputs(PALETTE_STEPS_CONTRACT, {names: x.names});
export const planPaletteSteps = (sec: number) => planExtras(PALETTE_STEPS_CONTRACT, sec);
export const paletteStepsFrames = (extras: number[]) => Math.round(outputDuration(PALETTE_STEPS_CONTRACT, extras) * FPS);
export const PALETTE_STEPS_DURATION = 63;

const hex = (c: number[]) => '#' + c.map((v) => v.toString(16).padStart(2, '0')).join('').toUpperCase();

export const PaletteStepsListGroup: React.FC<{inputs?: PaletteStepsInputs; extras?: number[]}> = ({inputs: x = PALETTE_STEPS_DEFAULT_INPUTS, extras = [0]}) => {
  const tt = useCurrentFrame() / FPS;
  const s = toSource(tt, PALETTE_STEPS_CONTRACT, extras) + S0;
  const els: React.ReactNode[] = [];
  const full = s >= 4.95;
  if (!full) {
    // 竖条 → 台阶：每层高 180，从下往上排（白在最底）
    const stepH = lin(s, [[4.35, 261], [4.45, 200], [4.55, 180]]);
    for (let i = 0; i < 5; i++) {
      const layer = i + 1; // 1=深绿 … 5=白
      if (layer === 1 && s < 4.42) continue;
      const hw = lin(s, HW[i]);
      const bottom = 1080 - (4 - i) * stepH;
      const drop = s < 4.42 ? (4.42 - s) * 900 : 0;
      els.push(<div key={'st' + i} style={{position: 'absolute', left: 960 - hw, top: bottom - stepH - drop, width: hw * 2, height: stepH + 1, background: `rgb(${COLS[layer].join(',')})`, borderRadius: '6px 6px 0 0'}} />);
    }
  } else {
    // 六行全宽色带
    const out = clamp((s - 6.2) / 0.2);
    const rowH = 180;
    COLS.forEach((c, i) => {
      let top = i * rowH, h = rowH;
      if (out > 0) { if (i === 1) { top = lin(out, [[0, 174], [1, 0]]); h = lin(out, [[0, 180], [1, 1080]]); } else if (i > 1) { top = i * rowH + out * 900; } else { top = -out * 180; } }
      const textC = i >= 3 ? '#1b2e23' : '#eef7f2';
      const tO = clamp((s - 4.9) / 0.15) * (1 - clamp((s - 6.0) / 0.15));
      const arr = eo((s - 4.75 - i * 0.03) / 0.25);
      els.push(<div key={'r' + i} style={{position: 'absolute', left: 0, top, width: 1920, height: h, background: `rgb(${c.join(',')})`, zIndex: i === 1 ? 2 : 1}}>
        <div style={{position: 'absolute', left: 198, top: rowH * 0.62, fontFamily: SANS, fontSize: 30, color: textC, opacity: tO}}>{x.names[i]}</div>
        <svg width={44} height={44} viewBox="0 0 24 24" style={{position: 'absolute', left: 615 + 40 * Math.sin(i) + (1 - arr) * -300, top: rowH * 0.3, transform: `rotate(${(1 - arr) * -120}deg)`, opacity: arr * (1 - clamp((s - 6.0) / 0.15))}}><path d="M4 2 Q 14 8 22 12 Q 14 16 4 22 Q 8 12 4 2 Z" fill={i >= 3 ? '#1b2e23' : '#9effca'} /></svg>
        <div style={{position: 'absolute', left: 1554, top: rowH * 0.42, fontFamily: SANS, fontSize: 14, lineHeight: 1.35, color: textC, opacity: tO, whiteSpace: 'pre'}}>{`RGB    (${c.join(', ')})\nHEX    ${hex(c)}`}</div>
      </div>);
    });
  }
  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      {els}
      <div style={{position: 'absolute', right: 36, bottom: 26, fontFamily: SANS, fontSize: 20, color: 'rgba(120,140,130,0.6)', letterSpacing: '0.06em', zIndex: 5}}>{x.note}</div>
    </AbsoluteFill>
  );
};

if (checkContract(PALETTE_STEPS_CONTRACT).length) throw new Error(checkContract(PALETTE_STEPS_CONTRACT).join('；'));
export const PaletteStepsList: React.FC = () => <PaletteStepsListGroup />;
