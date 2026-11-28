// 【镜头组】giant-word-scroll-intro：黑底暗红光斑，一行比屏幕还宽的超大白字从右边甩进来、刹住慢慢漂、再甩出去 →
//   紧接着产品名同样甩进来、刹住慢慢漂、甩出去接下一拍（038-C 单个镜头，产品登场）
// 学的动作（NoorMalik · Teamflow 15.0–18.2s，30fps 逐帧量过，2026-11-21）：
//   逐帧用相位相关量字的横向速度（px/帧，1920 宽）：15.5 第一个字母从右边进来，加速到 15.77 最快（400 px/帧）→ 刹车，16.3–16.4 只剩 17 px/帧慢慢漂 →
//   又加速甩出去（16.9 最快 530 px/帧）；产品名 17.0 从 x1362 进来、17.03 最快 389 → 17.57 慢到 10 px/帧 → 18.0 起再加速，接 038-D
//   字高约 434px（含上下伸），第一行中心 y≈490、产品名 y≈518；背景是黑底上一团暗红光（红 ≈45），中心从 (1060,425) 慢慢漂到 (1220,515)
// 我们的内容：「现在为你介绍」+ 虚构产品「协流工作台」（字数照原片的总宽度配：英文两行各宽 ≈2700 / 2850px），右下角标"虚构 · 仅作演示"。
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {GroupContract, checkContract, checkInputs, outputDuration, planExtras, toSource} from '../../../assets/lib/helpers/groupClock';
import {GlowSpot} from '../_kit/light';

const FPS = 30;
const S0 = 15.0;
const SANS = '"PingFang SC","Noto Sans CJK SC","Noto Sans SC",sans-serif';
// 从 15.5s 起每帧的累计位移（原片量的）
const CUM = [0,-48,-107,-182,-277,-404,-583,-855,-1255,-1616,-1851,-2012,-2131,-2224,-2299,-2361,-2413,-2457,-2495,-2527,-2555,-2579,-2600,-2618,-2635,-2652,-2669,-2686,-2705,-2728,-2755,-2788,-2827,-2874,-2930,-2997,-3079,-3180,-3308,-3477,-3714,-4075,-4605,-5074,-5241,-5501,-5890,-6240,-6464,-6614,-6723,-6806,-6871,-6923,-6966,-7001,-7030,-7054,-7074,-7091,-7105,-7116,-7126,-7137,-7148,-7159,-7171,-7183,-7195,-7208,-7221,-7234,-7249,-7266,-7287,-7311,-7340,-7373,-7412,-7459,-7515,-7583,-7669,-7780];
const scrollAt = (s: number) => {
  const f = (s - 15.5) * 30;
  if (f <= 0) return 0;
  const i = Math.floor(f), u = f - i;
  if (i >= CUM.length - 1) { const v = CUM[CUM.length - 1] - CUM[CUM.length - 2]; return CUM[CUM.length - 1] + v * (f - (CUM.length - 1)) * 1.15; }
  return CUM[i] + (CUM[i + 1] - CUM[i]) * u;
};
export const GIANT_WORD_SCROLL_CONTRACT: GroupContract = {
  sourceDuration: 96 / 30,
  fps: 30,
  motion: [[0, 1.3], [1.45, 2.5], [2.65, 96 / 30]],
  holds: [{at: 1.38, maxExtra: 1.2}, {at: 2.58, maxExtra: 1.5}],
  landmarks: {whip1: 0.5, drift1: 1.3, whip2: 1.95, name: 2.0, drift2: 2.55, out: 3.0},
  sfx: [
    {at: 'whip1', type: '短甩', note: '甩入 whoosh', volume: 0.45},
    {at: 'whip2', type: '短甩', note: '甩入 whoosh', volume: 0.45},
    {at: 'out', type: '短甩', note: '甩出 whoosh', volume: 0.35},
  ],
  inputs: {line: {maxChars: 7}, name: {maxChars: 6}},
};
export type GiantScrollInputs = {line: string; name: string; note: string};
export const GIANT_SCROLL_DEFAULT_INPUTS: GiantScrollInputs = {line: '现在为你介绍', name: '协流工作台', note: '虚构 · 仅作演示'};
export const checkGiantScrollInputs = (x: GiantScrollInputs) => checkInputs(GIANT_WORD_SCROLL_CONTRACT, {line: x.line, name: x.name});
export const planGiantScroll = (sec: number) => planExtras(GIANT_WORD_SCROLL_CONTRACT, sec);
export const giantScrollFrames = (extras: number[]) => Math.round(outputDuration(GIANT_WORD_SCROLL_CONTRACT, extras) * FPS);
export const GIANT_WORD_SCROLL_DURATION = 96;

export const GiantWordScrollIntroGroup: React.FC<{inputs?: GiantScrollInputs; extras?: number[]}> = ({inputs: x = GIANT_SCROLL_DEFAULT_INPUTS, extras = [0, 0]}) => {
  const tt = useCurrentFrame() / FPS;
  const s = toSource(tt, GIANT_WORD_SCROLL_CONTRACT, extras) + S0;
  const held = tt - (s - S0);
  const FS = 480;
  const sc = scrollAt(s) - held * 17 * 30 * 0.6; // 停留时继续慢慢漂（原片慢漂 ≈ 17 px/帧）
  const x1 = 1868 + sc, x2 = 1868 + 4995 + sc; // 产品名在原片 17.0 时左边在 x1362
  const T: React.CSSProperties = {position: 'absolute', fontFamily: SANS, fontSize: FS, fontWeight: 700, color: '#ffffff', whiteSpace: 'nowrap', lineHeight: 1, letterSpacing: '-0.01em', textShadow: '0 0 40px rgba(150,0,0,0.35)'};
  const gx = 1060 + 160 * Math.min(1, Math.max(0, (s - 15) / 3)), gy = 425 + 90 * Math.min(1, Math.max(0, (s - 15) / 3));
  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      <GlowSpot x={gx} y={gy} rx={520} ry={420} rgb="120,0,0" a={0.42} />
      <GlowSpot x={gx - 700} y={gy + 120} rx={420} ry={360} rgb="90,0,0" a={0.22} />
      <GlowSpot x={gx + 760} y={gy - 260} rx={380} ry={320} rgb="90,0,0" a={0.2} />
      {s >= 15.48 && <div style={{...T, left: x1, top: 490, transform: 'translateY(-50%)'}}>{x.line}</div>}
      {s >= 16.96 && <div style={{...T, left: x2, top: 518, transform: 'translateY(-50%)'}}>{x.name}</div>}
      <div style={{position: 'absolute', right: 36, bottom: 26, fontFamily: SANS, fontSize: 20, color: 'rgba(255,220,220,0.4)', letterSpacing: '0.06em'}}>{x.note}</div>
    </AbsoluteFill>
  );
};

if (checkContract(GIANT_WORD_SCROLL_CONTRACT).length) throw new Error(checkContract(GIANT_WORD_SCROLL_CONTRACT).join('；'));
export const GiantWordScrollIntro: React.FC = () => <GiantWordScrollIntroGroup />;
