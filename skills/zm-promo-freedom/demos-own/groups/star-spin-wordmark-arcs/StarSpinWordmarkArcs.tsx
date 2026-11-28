// 【镜头组】star-spin-wordmark-arcs：上一句话被一个内凹四角星「收」进去 → 星变小、变亮、往左走，转两下（转的时候鼓成圆角方块）→
//   右边名字由糊变清；顶上、左下、右下三颗星球的亮边同时扫进来框住标志，定住；最后整个画面微微往上抬，底下露出一块玻璃面板的上沿（028-C 一拍，产品名亮相）
// 学的动作（ArtemLysenko · DashSync 10.6–13.6s，30fps 逐帧量过，2026-11-21）：
//   10.6 内凹四角星遮罩（宽 702，中心 929,540）里还剩半句话，10.9 缩成 425 宽的暗蓝星（923,527），11.2 变亮发光、330 宽（902,500）
//   11.2–11.55 星顺时针转 90°、中途鼓成圆角方块（11.42–11.47 最方）；11.58–11.72 再转一次；同时往左走、变小（11.5 281 宽 → 12.0 220 宽，最后停在 476,513）
//   11.55 名字从右边糊着出来，11.7 清楚（x709–1351），之后慢慢往左挪到 669–1325、略放大 2%
//   11.75–12.2 三颗星球扫进来（缓出）：顶上那颗的下沿从画外落到 y220（R≈2070，圆心 x1066）；左下那颗（R≈2340）从左边滑进来；右下那颗（R≈900）从右边滑进来；
//       星球里面是亮的（顶上白、两边蓝），边上一圈亮线 + 一道暗缝 + 外面一圈淡光
//   12.2–13.6 顶上星球慢慢往上退（220 → 178），12.9 起整个画面往上抬（名字 y 526 → 456），13.15 起底下升上来一块玻璃面板（接 028-D）
// 我们的内容：上一拍的「你在亏钱」被星收进去，标志 = 我们自己画的四角星 + 虚构产品「数星」，右下角标"虚构 · 仅作演示"。
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {GroupContract, checkContract, checkInputs, outputDuration, planExtras, toSource} from '../../../assets/lib/helpers/groupClock';
import {MorphStar, NavyBg, SANS, clamp, eo, kf, mix} from '../_kit/blueArcKit';
import {GlowSpot} from '../_kit/light';

const FPS = 30;
const S0 = 10.6;
export const STAR_SPIN_WORDMARK_CONTRACT: GroupContract = {
  sourceDuration: 90 / 30,
  fps: 30,
  motion: [[0, 1.65], [1.75, 90 / 30]],
  holds: [{at: 1.7, maxExtra: 2.5}],
  landmarks: {collapse: 0, glow: 0.6, spin: 0.62, name: 0.95, arcs: 1.15, lift: 2.3},
  sfx: [
    {at: 'collapse', type: '吸入', note: '吸入 suck', volume: 0.4},
    {at: 'spin', type: '运镜', note: '转动 whoosh', volume: 0.35},
    {at: 'arcs', type: '上扬铺垫', note: '光扫 swell', tail: 1.2, volume: 0.45},
    {at: 'lift', type: '上扬铺垫', note: '上升 riser', volume: 0.3},
  ],
  inputs: {prev: {maxChars: 6}, name: {maxChars: 4}},
};
export type StarSpinInputs = {prev: string; name: string; note: string};
export const STAR_SPIN_DEFAULT_INPUTS: StarSpinInputs = {prev: '你在亏钱', name: '数星', note: '虚构 · 仅作演示'};
export const checkStarSpinInputs = (x: StarSpinInputs) => checkInputs(STAR_SPIN_WORDMARK_CONTRACT, {prev: x.prev, name: x.name});
export const planStarSpin = (sec: number) => planExtras(STAR_SPIN_WORDMARK_CONTRACT, sec);
export const starSpinFrames = (extras: number[]) => Math.round(outputDuration(STAR_SPIN_WORDMARK_CONTRACT, extras) * FPS);
export const STAR_SPIN_WORDMARK_DURATION = 90;

const lin = (u: number) => u;
/** 星球：圆心 (cx,cy)、半径 R，颜色按「离边多远」的表画（D 正 = 圆外）—— 表是原片 12.6s 吸管量的 */
const Planet: React.FC<{cx: number; cy: number; R: number; D: number[]; C: number[][]; o?: number}> = ({cx, cy, R, D, C, o = 1}) => {
  const E = R + D[D.length - 1] + 40;
  const st = D.map((d, j) => `rgba(${C[j].slice(0, 3).join(',')},${C[j][3] ?? 1}) ${(((R + d) / E) * 100).toFixed(3)}%`);
  return <div style={{position: 'absolute', left: cx - E, top: cy - E, width: E * 2, height: E * 2, borderRadius: '50%', opacity: o, background: `radial-gradient(circle closest-side, ${C[0].slice(0, 3).join(',') ? `rgb(${C[0].slice(0, 3).join(',')}) 0%, ` : ''}${st.join(', ')}, rgba(6,8,30,0) 100%)`}} />;
};
const TOP = {D: [-260, -150, -90, -60, -45, -30, -15, 0, 15, 30, 45, 60, 80], C: [[251, 250, 253], [217, 225, 254], [212, 223, 254], [244, 245, 253], [231, 237, 253], [126, 161, 251], [169, 193, 253], [122, 157, 253], [42, 81, 179], [23, 43, 100, 0.9], [12, 23, 56, 0.6], [7, 11, 28, 0.3], [6, 6, 17, 0]]};
const RIGHT = {D: [-400, -150, -90, -60, -30, 0, 30, 60, 90, 120, 150, 200], C: [[85, 131, 252], [96, 140, 253], [87, 133, 253], [61, 111, 240], [42, 77, 172], [20, 38, 88], [42, 80, 178], [49, 92, 201], [39, 77, 172, 0.85], [32, 61, 138, 0.6], [24, 48, 109, 0.35], [14, 31, 73, 0]]};
const LEFT = {D: [-300, -150, -60, -30, -12, 0, 14, 30, 50, 80, 130, 200, 260], C: [[30, 62, 160], [28, 56, 145], [40, 75, 190], [90, 130, 245], [190, 210, 255], [14, 26, 80], [70, 110, 230], [150, 180, 255], [40, 70, 170, 0.8], [22, 40, 115, 0.6], [15, 29, 94, 0.4], [11, 20, 68, 0.2], [8, 15, 55, 0]]}; /* 左边那颗的亮线在上半段很亮（白蓝双线），row700 那里是最暗的一段，按上半段取 */

const StarPath: React.FC<{size: number; fill: string}> = ({size, fill}) => (
  <svg width={size} height={size} viewBox="-70 -70 140 140" style={{display: 'block'}}>
    <path d="M0 -70 Q6.4 -6.4 70 0 Q6.4 6.4 0 70 Q-6.4 6.4 -70 0 Q-6.4 -6.4 0 -70 Z" fill={fill} />
  </svg>
);

export const StarSpinWordmarkGroup: React.FC<{inputs?: StarSpinInputs; extras?: number[]}> = ({inputs: x = STAR_SPIN_DEFAULT_INPUTS, extras = [0]}) => {
  const tt = useCurrentFrame() / FPS;
  const s = toSource(tt, STAR_SPIN_WORDMARK_CONTRACT, extras) + S0;
  const held = tt - (s - S0);
  // 名字宽度 → 整组标志的位置：原片「星 + 名字」整体中心在 x≈846；我们的字短，整组照这个中心摆，星的终点跟着变
  const N = Array.from(x.name), FS = 150, textW = N.length * FS * 1.02;
  const starEndX = 846 - (220 / 2 + 83 + textW) / 2 + 110;
  const textX0 = starEndX + 193; // 原片：名字左边 = 星中心 + 193
  const lift = kf(s, [[12.85, 0], [12.9, -2], [13.0, -7], [13.1, -13], [13.2, -20], [13.3, -28], [13.4, -39], [13.5, -54], [13.6, -70]], lin) - held * 1.5; // 原片名字 y 526 → 456
  // 星
  const sz = kf(s, [[10.6, 702], [10.75, 560], [10.9, 425], [11.05, 370], [11.2, 330], [11.5, 281], [11.75, 248], [12.0, 222], [12.4, 220]]);
  const sxT = kf(s, [[10.6, 929], [10.9, 923], [11.2, 902], [11.5, 688], [11.75, 524], [11.85, 508], [12.0, 483], [12.6, 476]]);
  const sx = 929 + (sxT - 929) * ((929 - starEndX) / (929 - 476));
  const sy = kf(s, [[10.6, 540], [10.9, 527], [11.2, 500], [11.5, 527], [11.75, 513], [12.6, 513]]) + lift;
  const rot = kf(s, [[11.2, 0], [11.42, 50], [11.55, 90], [11.58, 92], [11.68, 150], [11.78, 180]]);
  const m = kf(s, [[11.22, 0], [11.4, 0.85], [11.47, 0.9], [11.53, 0.15], [11.56, 0.2], [11.6, 0.9], [11.64, 0.75], [11.72, 0.1], [11.8, 0]]);
  const bright = clamp((s - 10.95) / 0.25);
  const mask = s < 10.95;
  // 名字
  const nk = eo(clamp((s - 11.52) / 0.2));
  const tx = kf(s, [[11.7, 40], [12.4, 0]]), tsc = 1 + 0.02 * clamp((s - 11.7) / 0.7);
  // 星球
  const topRim = kf(s, [[11.72, -260], [11.8, 72], [11.9, 148], [12.0, 190], [12.1, 212], [12.2, 220], [12.5, 218], [12.8, 213], [13.0, 207], [13.2, 196], [13.4, 178], [13.6, 160]], lin) - held * 1.2;
  const dxL = kf(s, [[11.78, -700], [11.8, -475], [11.9, -204], [12.0, -73], [12.1, -10], [12.2, 0]], lin);
  const dxR = kf(s, [[11.7, 520], [11.75, 410], [11.8, 339], [11.9, 174], [12.0, 75], [12.1, 21], [12.2, 0], [12.7, 6], [13.2, 26]], lin) + held * 2;
  const arcs = s > 11.68;
  const card = kf(s, [[13.12, 1100], [13.3, 1008], [13.45, 880], [13.55, 620], [13.6, 540]], lin); /* 原片面板升得很快：13.3 顶边 y1008 → 13.55 y610，宽约 1590 */
  return (
    <AbsoluteFill style={{overflow: 'hidden', fontFamily: SANS}}>
      <NavyBg gx={55} gy={95} glow={0.55} side={0.35} drift={s} />
      <GlowSpot x={960} y={1050} rx={1300} ry={420} rgb="28,62,170" a={0.35} />
      <div style={{position: 'absolute', inset: 0, transform: `translateY(${lift}px)`}}>
        {arcs && <>
          <Planet cx={1066} cy={topRim - 2071} R={2071} D={TOP.D} C={TOP.C} />
          <Planet cx={-1806 + dxL} cy={1582} R={2340} D={LEFT.D} C={LEFT.C} />
          <Planet cx={2145 + dxR} cy={1286} R={902} D={RIGHT.D} C={RIGHT.C} />
        </>}
      </div>
      {/* 星 / 遮罩 */}
      {mask ? (
        <div style={{position: 'absolute', left: sx - sz / 2, top: sy - sz / 2, width: sz, height: sz, WebkitMaskImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='-70 -70 140 140'><path d='M0 -70 Q6.4 -6.4 70 0 Q6.4 6.4 0 70 Q-6.4 6.4 -70 0 Q-6.4 -6.4 0 -70 Z'/></svg>")`, maskImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='-70 -70 140 140'><path d='M0 -70 Q6.4 -6.4 70 0 Q6.4 6.4 0 70 Q-6.4 6.4 -70 0 Q-6.4 -6.4 0 -70 Z'/></svg>")`, WebkitMaskSize: '100% 100%', maskSize: '100% 100%', background: 'radial-gradient(circle, rgba(46,66,160,0.95), rgba(34,52,140,0.9))'}}>
          <div style={{position: 'absolute', left: 960 - (sx - sz / 2) - 600, top: 540 - (sy - sz / 2) - 80, width: 1200, height: 160, display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 116, fontWeight: 500, color: '#c6d2ff', opacity: clamp((10.88 - s) / 0.2), textShadow: '0 0 16px rgba(120,150,255,0.6)'}}>{x.prev}</div>
        </div>
      ) : (
        <>
          <div style={{position: 'absolute', left: sx - sz / 2, top: sy - sz / 2, opacity: 1 - bright}}><StarPath size={sz} fill="rgb(42,62,152)" /></div>
          <div style={{opacity: bright}}><MorphStar x={sx} y={sy} size={sz / 140} m={m} rot={rot} gid="ssw" /></div>
          {bright > 0 && <GlowSpot x={sx} y={sy} rx={sz * 0.9} rgb="60,95,255" a={0.28 * bright} />}
        </>
      )}
      {nk > 0 && (
        <div style={{position: 'absolute', left: textX0 + tx, top: 513 + lift, transform: `translateY(-52%) scale(${tsc})`, transformOrigin: '0% 50%', display: 'flex', fontSize: FS, fontWeight: 600, color: '#eef1ff', letterSpacing: '0.02em', opacity: clamp(nk * 1.6), filter: nk < 1 ? `blur(${(1 - nk) * 14}px)` : undefined, textShadow: '0 0 10px rgba(180,200,255,0.55), 0 0 34px rgba(80,120,255,0.45)'}}>{x.name}</div>
      )}
      {s > 13.1 && <div style={{position: 'absolute', left: 960 - 795, top: card, width: 1590, height: 900, borderRadius: 64, border: '2px solid rgba(110,140,240,0.35)', borderTopColor: 'rgba(160,185,255,0.7)', background: 'linear-gradient(180deg, rgba(6,12,44,0.62), rgba(14,30,100,0.35) 40%, rgba(30,60,170,0.18))', boxShadow: 'inset 0 2px 0 rgba(190,205,255,0.35), 0 -10px 40px rgba(40,80,220,0.25)', backdropFilter: 'blur(10px)' /* 原片是一块偏暗的玻璃，顶边一条亮线 */}} />}
      <div style={{position: 'absolute', right: 36, bottom: 26, fontSize: 20, color: 'rgba(200,210,255,0.45)', letterSpacing: '0.06em', opacity: clamp((s - 11.6) / 0.3)}}>{x.note}</div>
    </AbsoluteFill>
  );
};

if (checkContract(STAR_SPIN_WORDMARK_CONTRACT).length) throw new Error(checkContract(STAR_SPIN_WORDMARK_CONTRACT).join('；'));
export const StarSpinWordmarkArcs: React.FC = () => <StarSpinWordmarkGroup />;
