// 【镜头组】word-frames-limits：黑底一句话拆成几个词一个个出，每个词换一种外框：小字 → 两三圈彩色点阵环绕着转往里收 → 虚线圆 + 细方框 →
//   描边空心大字 + 虚线圆、两边大弧括号 → 小字旁冒出彩点、身后掠过一个巨大的描边残影 → 放大成渐变大字、四周彩点漂（013-G 一拍，口号前的情绪段）
// 学的动作（mnowakdesign · 音乐 App 28.2–34.6s，30fps 逐帧量过，2026-11-21）：
//   28.3 第一个词组（字号 ≈100，居中 y 534）；29.1 第二个词 + 三圈彩点环：29.3 外圈半径 ≈840 还在画外，29.9 收到 420 / 585 / 825（点径 12 / 18 / 27，粉橙紫渐变），一边转
//   30.45 第三个词 + 虚线圆（半径 378）+ 很淡的细方框（246–1671 × 180–900）；31.45 第四个词变成描边空心大字（x 450–1476，字高 ≈225）+ 虚线圆（半径 315）+ 方框 + 左右两道虚线大弧（半径 ≈816）
//   32.5 第五个词小字白色；33.2 旁边冒出彩点，身后掠过一个巨大的描边残影（右下角，往左上漂）；33.6 放大成渐变大字（x 540–1380，字高 ≈300，紫→粉→橙），彩点四周慢漂
// 我们的内容：「你所有的作品 / 汇聚一处 / 尽情创作 / 不设 / 上限」，右下角标"虚构 · 仅作演示"。
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {HeatText} from '../_kit/heatText';
import {GroupContract, checkContract, checkInputs, outputDuration, planExtras, toSource} from '../../../assets/lib/helpers/groupClock';

const FPS = 30;
const S0 = 28.2;
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
const mix = (a: number[], b: number[], k: number) => `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * k)).join(',')})`;

export const WORD_FRAMES_CONTRACT: GroupContract = {
  sourceDuration: 192 / 30,
  fps: 30,
  motion: [[0, 192 / 30]],
  holds: [],
  landmarks: {w1: 0.1, w2: 0.9, w3: 2.25, w4: 3.25, w5: 4.3, dots: 5.0, big: 5.4},
  sfx: [
    {at: 'w2', type: '旋转', note: '点阵 swirl', volume: 0.3},
    {at: 'w3', type: '轻tick', note: '轻 tick', volume: 0.25},
    {at: 'w4', type: '轻tick', note: '轻 tick', volume: 0.25},
    {at: 'big', type: '上扬铺垫', note: '放大 swell', volume: 0.4},
  ],
  inputs: {words: {count: 5, maxChars: 6}},
};
export type WordFramesInputs = {words: string[]; note: string};
export const WORD_FRAMES_DEFAULT_INPUTS: WordFramesInputs = {words: ['你所有的作品', '汇聚一处', '尽情创作', '不设', '上限'], note: '虚构 · 仅作演示'};
export const checkWordFramesInputs = (x: WordFramesInputs) => checkInputs(WORD_FRAMES_CONTRACT, {words: x.words});
export const planWordFrames = (sec: number) => planExtras(WORD_FRAMES_CONTRACT, sec);
export const wordFramesFrames = (extras: number[]) => Math.round(outputDuration(WORD_FRAMES_CONTRACT, extras) * FPS);
export const WORD_FRAMES_DURATION = 192;

const DottedRing: React.FC<{r: number; n: number; d: number; rot: number; o: number}> = ({r, n, d, rot, o}) => (
  <>{Array.from({length: n}, (_, i) => { const a = (i / n) * Math.PI * 2 + rot; const k = (Math.sin(a * 1.5 + rot) + 1) / 2; return <div key={i} style={{position: 'absolute', left: 960 + Math.cos(a) * r - d / 2, top: 540 + Math.sin(a) * r - d / 2, width: d, height: d, borderRadius: '50%', background: mix([255, 70, 140], [130, 60, 255], k), boxShadow: `inset ${-d * 0.2}px ${-d * 0.2}px ${d * 0.3}px rgba(255,150,60,0.6)`, opacity: o}} />; })}</>
);
const T: React.CSSProperties = {position: 'absolute', left: 0, right: 0, top: 540, transform: 'translateY(-50%)', textAlign: 'center', fontFamily: SANS, fontWeight: 600, color: '#f4f4f4', whiteSpace: 'nowrap', lineHeight: 1};

export const WordFramesLimitsGroup: React.FC<{inputs?: WordFramesInputs; extras?: number[]}> = ({inputs: x = WORD_FRAMES_DEFAULT_INPUTS, extras = []}) => {
  const tt = useCurrentFrame() / FPS;
  const s = toSource(tt, WORD_FRAMES_CONTRACT, extras) + S0;
  const W = x.words;
  const els: React.ReactNode[] = [];
  if (s < 29.08) els.push(<div key="w1" style={{...T, fontSize: 100, opacity: clamp((s - 28.3) / 0.12)}}>{W[0]}</div>);
  else if (s < 30.42) {
    const k = eio((s - 29.1) / 0.8), rot = (s - 29.1) * 0.5;
    els.push(<DottedRing key="r1" r={lin(s, [[29.1, 700], [29.9, 420]])} n={46} d={18} rot={rot} o={clamp((s - 29.1) / 0.1)} />);
    els.push(<DottedRing key="r2" r={lin(s, [[29.1, 880], [29.9, 585]])} n={40} d={28} rot={-rot * 0.8} o={clamp((s - 29.1) / 0.1)} />);
    els.push(<DottedRing key="r3" r={lin(s, [[29.1, 1100], [29.9, 825]])} n={36} d={40} rot={rot * 0.6} o={clamp((s - 29.15) / 0.1) * (0.4 + 0.6 * k)} />);
    els.push(<div key="w2" style={{...T, fontSize: 100}}>{W[1]}</div>);
  } else if (s < 31.42) {
    const draw = eo((s - 30.45) / 0.4);
    els.push(<svg key="c" width={1920} height={1080} style={{position: 'absolute', inset: 0}}><rect x={246} y={180} width={1425} height={720} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={2} /><circle cx={960} cy={540} r={378} fill="none" stroke="#ddd" strokeWidth={3} strokeDasharray="14 12" strokeDashoffset={-s * 30} opacity={draw} /></svg>);
    els.push(<div key="w3" style={{...T, fontSize: 100}}>{W[2]}</div>);
  } else if (s < 32.45) {
    els.push(<svg key="c2" width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
      <rect x={369} y={240} width={1182} height={600} fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth={2} />
      <circle cx={960} cy={540} r={315} fill="none" stroke="#ddd" strokeWidth={3} strokeDasharray="12 10" />
      {[-1, 1].map((sd) => <path key={sd} d={`M ${960 + sd * 600} 0 A 816 816 0 0 ${sd > 0 ? 1 : 0} ${960 + sd * 600} 1080`} fill="none" stroke="#bbb" strokeWidth={3} strokeDasharray="14 12" opacity={0.8} />)}
      {[-1, 1].map((sd) => <path key={'b' + sd} d={`M ${960 + sd * 780} 200 A 600 600 0 0 ${sd > 0 ? 1 : 0} ${960 + sd * 780} 880`} fill="none" stroke="#777" strokeWidth={2} strokeDasharray="10 14" opacity={0.6} />)}
      <text x={960} y={620} textAnchor="middle" fontFamily={SANS} fontSize={300} fontWeight={300} fill="none" stroke="#e8e8e8" strokeWidth={2.5}>{W[3]}</text>
    </svg>);
  } else {
    const grow = eio((s - 33.38) / 0.32);
    const F = 100 + 200 * grow;
    if (s > 33.2) {
      // 彩点 + 巨大描边残影
      for (let i = 0; i < 14; i++) {
        const a = hash(i) * Math.PI * 2, r = 330 + hash(i + 4) * 280, drift = (s - 33.2) * 0.15 * (i % 2 ? 1 : -1);
        const d = 10 + hash(i + 9) * 22, col = ['#ff3d7a', '#4a8aff', '#3ad8a0', '#ff8a3d'][i % 4];
        els.push(<div key={'p' + i} style={{position: 'absolute', left: 960 + Math.cos(a + drift) * r * 1.3 - d / 2, top: 540 + Math.sin(a + drift) * r * 0.75 - d / 2, width: d, height: d, borderRadius: '50%', background: col, opacity: clamp((s - 33.2 - hash(i) * 0.3) / 0.15)}} />);
      }
      if (s < 33.9) { const g = clamp((s - 33.25) / 0.6); els.push(<svg key="ghost" width={1920} height={1080} style={{position: 'absolute', inset: 0, opacity: Math.sin(Math.PI * g) * 0.8}}><text x={1500 - g * 300} y={1060 - g * 120} textAnchor="middle" fontFamily={SANS} fontSize={560} fontWeight={300} fill="none" stroke="#666" strokeWidth={2}>{W[4]}</text></svg>); }
    }
    const grad = grow > 0.05;
    const chars = Array.from(W[4]);
    // 第二轮（2026-11-23）：放大后的「上限」改成原片那种热力渐变填字（边上蓝紫 → 品红 → 芯里橙，橙团在字里慢慢游走，细颗粒 + 粉色细描边），以前是两个纯色字
    if (grad) els.push(<HeatText key="w5h" text={W[4]} x={960} y={540 + F * 0.36} size={F} weight={900} family={SANS} id="limHeat" t={s - 33.5} o={clamp((grow - 0.05) / 0.25)} />);
    els.push(<div key="w5" style={{...T, fontSize: F, fontWeight: grad ? 900 : 600, opacity: grad ? 1 - clamp((grow - 0.05) / 0.25) : 1}}>{W[4]}{s > 33.15 && s < 33.6 && <span style={{display: 'inline-block', width: 22, height: 22, borderRadius: '50%', background: '#ff3d7a', marginLeft: 8}} />}</div>);
  }
  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      {els}
      <div style={{position: 'absolute', right: 36, bottom: 26, fontFamily: SANS, fontSize: 20, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.06em'}}>{x.note}</div>
    </AbsoluteFill>
  );
};

if (checkContract(WORD_FRAMES_CONTRACT).length) throw new Error(checkContract(WORD_FRAMES_CONTRACT).join('；'));
export const WordFramesLimits: React.FC = () => <WordFramesLimitsGroup />;
