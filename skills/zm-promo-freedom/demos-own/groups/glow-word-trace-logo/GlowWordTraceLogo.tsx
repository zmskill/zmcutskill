// 【镜头组】glow-word-trace-logo：黑底中间一个渐变小字暗暗亮着 → 一束蓝光沿着标志的形状描一圈，小字随之淡掉 → 光描完变成实心白色字形标志，停住（013-H 单个镜头，收尾）
// 学的动作（mnowakdesign · 音乐 App 34.6–39.4s，30fps 逐帧量过，2026-11-21）：
//   34.9 中间一个渐变小字（粉→紫，字号 ≈100）慢慢亮起，一直很暗；36.1 蓝色光点从字中间偏上开始沿标志外形画弧（带蓝色辉光），小字同时淡掉
//   36.3–37.15 粗笔画一路描完（第二轮重量，原来记成 36.1–36.7 偏快），37.15–37.4 变纯白，37.7 辉光散掉，之后静止到 39.4
// 我们的内容：小字「绽放」（虚构 App 名），标志是自己画的「花苞」一笔画，右下角标"虚构 · 仅作演示"。
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {GroupContract, checkContract, checkInputs, outputDuration, planExtras, toSource} from '../../../assets/lib/helpers/groupClock';

const FPS = 30;
const S0 = 34.6;
const SANS = '"Inter","PingFang SC","Noto Sans CJK SC","Noto Sans SC",sans-serif';
const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const eio = (u: number) => { const x = clamp(u); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };

export const GLOW_TRACE_CONTRACT: GroupContract = {
  sourceDuration: 144 / 30,
  fps: 30,
  motion: [[0, 3.15]],
  holds: [{at: 3.5, maxExtra: 3}],
  landmarks: {word: 0.3, trace: 1.7, logo: 2.55},
  sfx: [{at: 'trace', type: '闪光', note: '光扫 shimmer', volume: 0.35}, {at: 'logo', type: '提示音', note: '品牌音 ding', volume: 0.4}],
  inputs: {word: {maxChars: 4}},
};
export type GlowTraceInputs = {word: string; note: string};
export const GLOW_TRACE_DEFAULT_INPUTS: GlowTraceInputs = {word: '绽放', note: '虚构 · 仅作演示'};
export const checkGlowTraceInputs = (x: GlowTraceInputs) => checkInputs(GLOW_TRACE_CONTRACT, {word: x.word});
export const planGlowTrace = (sec: number) => planExtras(GLOW_TRACE_CONTRACT, sec);
export const glowTraceFrames = (extras: number[]) => Math.round(outputDuration(GLOW_TRACE_CONTRACT, extras) * FPS);
export const GLOW_TRACE_DURATION = 144;

// 第二轮（2026-11-23 用户：13 系列光影质感没学到）：逐 0.25s 看原片 35.0–37.75——
//   ① 小字是"细体 + 跨字流动的多色渐变"（橙 → 品红 → 紫），不是每个字一个纯色；
//   ② 描标志的是一条很粗的圆头笔画：笔头是一颗白芯蓝光的"彗星头"（亮芯 + 蓝色辉光），身后的笔画是银灰金属渐变（上亮下暗），
//      整个标志外面还罩着一大团很淡的蓝色光晕；描完后笔画变成纯白、光晕散掉。以前是一条细蓝线 + 一点 drop-shadow，没有光的层次。
// 标志：自己画的"花苞"一笔画（外圈从右上往左包、绕到底、再往里卷成芯），不是原片的字母。
type P = [number, number];
const SEGS: [P, P, P, P][] = [
  [[34, 4], [34, -32], [-34, -36], [-34, 2]],
  [[-34, 2], [-34, 34], [8, 42], [26, 22]],
  [[26, 22], [40, 4], [20, -14], [2, -2]],
];
const PTS: P[] = (() => { const out: P[] = []; SEGS.forEach(([p0, p1, p2, p3], si) => { for (let i = si ? 1 : 0; i <= 60; i++) { const t = i / 60, u = 1 - t; out.push([u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0], u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1]]); } }); return out; })();
const CUM: number[] = PTS.reduce((acc: number[], p, i) => { acc.push(i ? acc[i - 1] + Math.hypot(p[0] - PTS[i - 1][0], p[1] - PTS[i - 1][1]) : 0); return acc; }, []);
const TOTAL = CUM[CUM.length - 1];
const SC = 2.1; // 1 个 viewBox 单位 = 2.1px

export const GlowWordTraceLogoGroup: React.FC<{inputs?: GlowTraceInputs; extras?: number[]}> = ({inputs: x = GLOW_TRACE_DEFAULT_INPUTS, extras = [0]}) => {
  const tt = useCurrentFrame() / FPS;
  const s = toSource(tt, GLOW_TRACE_CONTRACT, extras) + S0;
  const wordO = clamp((s - 34.85) / 0.5) * (1 - clamp((s - 36.3) / 0.6));
  const tr = eio((s - 36.2) / 0.92);
  const white = clamp((s - 37.15) / 0.25), glow = clamp((s - 36.25) / 0.15) * (1 - clamp((s - 37.2) / 0.5));
  const L = tr * TOTAL;
  let n = CUM.findIndex((c) => c >= L); if (n < 0) n = PTS.length - 1;
  const drawn = PTS.slice(0, Math.max(1, n + 1));
  const head = drawn[drawn.length - 1];
  const hx = 960 + head[0] * SC, hy = 540 + head[1] * SC;
  const shimmer = (s - 34.6) * 40;
  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 540, transform: 'translateY(-50%)', textAlign: 'center', fontFamily: SANS, fontSize: 104, fontWeight: 300, lineHeight: 1.2, opacity: wordO}}>
        <span style={{backgroundImage: 'linear-gradient(90deg, #ff9a3c 0%, #ff4f7e 28%, #b24dff 52%, #6a4cff 64%, #ff5c8a 82%, #ff9a3c 100%)', backgroundSize: '300% 100%', backgroundPosition: `${shimmer}% 0`, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent'}}>{x.word}</span>
      </div>
      {glow > 0 && <div style={{position: 'absolute', left: 960 - 420, top: 540 - 420, width: 840, height: 840, borderRadius: '50%', background: 'radial-gradient(circle, rgba(40,90,230,0.16) 0%, rgba(30,60,180,0.07) 40%, rgba(0,0,0,0) 70%)', opacity: glow}} />}
      {s > 36.28 && <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <defs><linearGradient id="gwMetal" gradientUnits="userSpaceOnUse" x1="0" y1={540 - 90} x2="0" y2={540 + 90}><stop offset="0" stopColor="#f2f5ff" /><stop offset="0.55" stopColor="#c3c9d8" /><stop offset="1" stopColor="#7e869a" /></linearGradient></defs>
        <polyline points={drawn.map(([px, py]) => `${960 + px * SC},${540 + py * SC}`).join(' ')} fill="none" stroke="url(#gwMetal)" strokeWidth={14 * SC} strokeLinecap="round" strokeLinejoin="round" />
        {white > 0 && <polyline points={drawn.map(([px, py]) => `${960 + px * SC},${540 + py * SC}`).join(' ')} fill="none" stroke="#fff" strokeOpacity={white} strokeWidth={14 * SC} strokeLinecap="round" strokeLinejoin="round" />}
      </svg>}
      {glow > 0 && tr < 1.0 && <>
        <div style={{position: 'absolute', left: hx - 120, top: hy - 120, width: 240, height: 240, borderRadius: '50%', background: 'radial-gradient(circle, rgba(70,150,255,0.6) 0%, rgba(40,100,255,0.22) 30%, rgba(0,0,0,0) 70%)', mixBlendMode: 'screen', opacity: glow}} />
        <div style={{position: 'absolute', left: hx - 24, top: hy - 24, width: 48, height: 48, borderRadius: '50%', background: 'radial-gradient(circle, #ffffff 0%, #cfe2ff 35%, rgba(90,160,255,0.9) 60%, rgba(0,0,0,0) 100%)', opacity: glow}} />
      </>}
      <div style={{position: 'absolute', right: 36, bottom: 26, fontFamily: SANS, fontSize: 20, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.06em'}}>{x.note}</div>
    </AbsoluteFill>
  );
};

if (checkContract(GLOW_TRACE_CONTRACT).length) throw new Error(checkContract(GLOW_TRACE_CONTRACT).join('；'));
export const GlowWordTraceLogo: React.FC = () => <GlowWordTraceLogoGroup />;
