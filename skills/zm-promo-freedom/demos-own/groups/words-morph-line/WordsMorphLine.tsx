// 【镜头组】words-morph-line：蓝底一句话（尾字从左往右淡入）→ 补上最后一个词、整行滑到正中 →
//   前后两个词从左往右溶掉、换成新词，中间不变的那个词一边变大一边挪到新位置 → 再补一个字、字距收拢 → 整行加速往上飘走（018-D 一拍，转折口号）
// 学的动作（HSAji · Tonomo 17.967–20.50s，30fps 逐帧量过；时间表 （内部拆片记录，未随项目提供））：
//   第一句字高 135（含下伸）、第二句 208（大约 1.5 倍）；"grow," 18.233 出现后整行 0.6 秒缓出到正中；
//   18.967 起旧词从左往右溶掉（0.13 秒），19.167 新句出现并从 0.81 倍长到 1（0.3 秒）；19.767 补 "too"，字距 0.27 秒收拢；
//   20.10 起整行往上，越来越快（最后一帧走 55px），20.50 硬切。
// 我们的内容："事情越来越多，" → "思路越来越清楚了"（"越来越"是不变的那个词）。
//
// 拍表（源秒 = 原片秒 − 17.967，30fps，共 76 帧）
//   拍 1 第一句      0.00–0.92   尾字淡入；0.267 补最后一个词、整行滑到正中（停留点 0.95）
//   拍 2 换句        0.98–2.00   旧词溶掉、新词长出来、不变的词变大挪位；1.80 补一个字（停留点 2.05）
//   拍 3 飘走        2.10–2.533  整行加速往上，接下一镜
// 毛病清单：
//   - 通用：画面永远不停（停留时整体极慢推近）；--hq 渲染；确定性
//   - 独有 1：中间不变的词全程不消失，只变大、挪位（换句不是整行淡出淡入）
//   - 独有 2：溶掉 / 长出都是逐字从左往右，带一点虚
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {FONT, Grain} from '../../../assets/lib/helpers/polish';
import {GroupContract, checkContract, checkInputs, outputDuration, planExtras, toSource} from '../../../assets/lib/helpers/groupClock';

const FPS = 30;
const SANS = `"PingFang SC", "Noto Sans CJK SC", "Noto Sans SC", ${FONT.sans}`;
const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const mix = (a: number, b: number, k: number) => a + (b - a) * k;
const eo = (t: number, a: number, b: number) => { const c = clamp((t - a) / (b - a)); return 1 - Math.pow(1 - c, 3); };
const cw = (c: string) => (/[\x00-\x7f]/.test(c) ? 0.56 : 1);
const tw = (s: string, fs: number) => Array.from(s).reduce((a, c) => a + cw(c) * fs, 0);

export const WORDS_MORPH_LINE_CONTRACT: GroupContract = {
  sourceDuration: 76 / 30,
  fps: 30,
  motion: [[0, 0.92], [0.98, 2.0], [2.1, 76 / 30]],
  holds: [{at: 0.95, maxExtra: 1.2}, {at: 2.05, maxExtra: 1.5}],
  landmarks: {line1: 0, tail: 0.267, morph: 1.0, line2: 1.17, extra: 1.8, rise: 2.1, exit: 76 / 30},
  sfx: [
    {at: 'tail', type: '弹出', note: '轻 pop（补词）', volume: 0.3},
    {at: 'morph', type: '闪光', note: '柔和 shimmer / 沙沙声（换词）', tail: 0.5, volume: 0.3},
    {at: 'extra', type: '轻tick', note: '轻 tick（补字）', volume: 0.25},
    {at: 'rise', type: '上升', note: '上升 whoosh', tail: 0.4, volume: 0.35},
  ],
  inputs: {a1: {maxChars: 3}, keep: {maxChars: 3}, b1: {maxChars: 3}, a2: {maxChars: 3}, b2: {maxChars: 3}, c: {maxChars: 1}},
};

// a1 + keep + b1 是第一句；a2 + keep + b2 + c 是第二句；keep 全程不变
export type MorphInputs = {a1: string; keep: string; b1: string; a2: string; b2: string; c: string};
export const MORPH_DEFAULT_INPUTS: MorphInputs = {a1: '事情', keep: '越来越', b1: '多，', a2: '思路', b2: '清楚', c: '了'};
export const checkMorphInputs = (x: MorphInputs) => checkInputs(WORDS_MORPH_LINE_CONTRACT, x);
export const planMorph = (sec: number) => planExtras(WORDS_MORPH_LINE_CONTRACT, sec);
export const morphFrames = (extras: number[]) => Math.round(outputDuration(WORDS_MORPH_LINE_CONTRACT, extras) * FPS);
export const WORDS_MORPH_LINE_DURATION = 76;

const RISE = [[2.1, 0], [2.133, -7], [2.2, -16], [2.267, -30], [2.333, -53], [2.4, -87], [2.467, -142], [2.533, -220]];
const kfl = (t: number, K: number[][]) => { if (t <= K[0][0]) return K[0][1]; for (let i = 0; i < K.length - 1; i++) if (t <= K[i + 1][0]) return mix(K[i][1], K[i + 1][1], (t - K[i][0]) / (K[i + 1][0] - K[i][0])); return K[K.length - 1][1]; };

export const WordsMorphLineGroup: React.FC<{inputs?: MorphInputs; extras?: number[]}> = ({inputs = MORPH_DEFAULT_INPUTS, extras = [0, 0]}) => {
  const t = useCurrentFrame() / FPS;
  const s = toSource(t, WORDS_MORPH_LINE_CONTRACT, extras);
  const lag = t - s;
  const cam = 1 + 0.006 * lag;
  const {a1, keep, b1, a2, b2, c} = inputs;
  const F1 = 110, F2 = 160;
  const Y = 505 + kfl(s, RISE);

  // 第一句的位置
  const wA1 = tw(a1, F1), wK1 = tw(keep, F1), wB1 = tw(b1, F1);
  // 原片整行一直在挪：0–0.2 尾字淡入时中心 1095→991；补词后从偏右缓出到正中（约 180px）
  const W1 = wA1 + wK1 + wB1;
  const off = s < 0.267 ? wB1 / 2 + 75 + 100 * (1 - eo(s, 0, 0.2)) : (wB1 / 2 + 75) * (1 - eo(s, 0.267, 0.87));
  const left1 = 960 - W1 / 2 + off;
  // 第二句（整体从 0.81 倍长到 1）
  const g = mix(0.81, 1, eo(s, 1.17, 1.47)) * (1 + 0.02 * clamp((s - 1.47) / 0.6)); // 定住后还在极慢长大
  const wA2 = tw(a2, F2), wK2 = tw(keep, F2), wB2 = tw(b2, F2), wC = tw(c, F2);
  const gap = mix(48, 0, eo(s, 1.8, 2.07));
  const W2a = wA2 + wK2 + wB2, W2 = W2a + (c ? gap + wC : 0);
  const left2 = c && s >= 1.8 ? mix(960 - W2a / 2 - 57, 960 - W2 / 2, eo(s, 1.8, 2.07)) : 960 - W2a / 2 - 57 * eo(s, 1.6, 1.73);
  const toL2 = (x: number) => 960 + (x - 960) * g; // 第二句缩放以画面中线为中心

  const chars = (str: string, x0: number, fs: number, op: (i: number) => number, blur: (i: number) => number, key: string) =>
    Array.from(str).map((ch, i) => {
      const x = x0 + tw(Array.from(str).slice(0, i).join(''), fs);
      const o = op(i);
      if (o <= 0.001) return null;
      const b = blur(i);
      return <div key={key + i} style={{position: 'absolute', left: x, top: Y, transform: 'translateY(-50%)', fontSize: fs, fontWeight: 600, color: '#fff', lineHeight: 1, opacity: o, filter: b > 0.05 ? `blur(${b}px)` : undefined}}>{ch}</div>;
    });

  const els: React.ReactNode[] = [];
  // 旧词：尾字淡入（只在 keep 上）；1.00–1.15 从左往右溶掉
  const dissolve = (i: number, n: number) => 1 - clamp((s - (1.0 + (i / Math.max(1, n)) * 0.1)) / 0.08);
  if (s < 1.25) {
    els.push(...chars(a1, left1, F1, (i) => dissolve(i, Array.from(a1).length), (i) => 6 * (1 - dissolve(i, Array.from(a1).length)), 'a1'));
    els.push(...chars(b1, left1 + wA1 + wK1, F1, (i) => clamp((s - 0.267) / 0.07) * dissolve(i + 2, 4), (i) => 6 * (1 - dissolve(i + 2, 4)) + 4 * (1 - clamp((s - 0.267) / 0.07)), 'b1'));
  }
  // 不变的词：从第一句的位置、字号 → 第二句的位置、字号
  const m = eo(s, 1.1, 1.32);
  const kx = mix(left1 + wA1, toL2(left2 + wA2), m);
  const kfs = mix(F1, F2 * g, m);
  els.push(...chars(keep, kx, kfs, (i) => clamp((s + 0.05 - i * 0.04) / 0.1), () => 0, 'k'));
  // 新词：逐字从左往右长出来，带虚
  if (s >= 1.17) {
    const grow = (i: number, base: number) => clamp((s - (1.17 + base + i * 0.04)) / 0.12);
    els.push(...chars(a2, toL2(left2), F2 * g, (i) => grow(i, 0), (i) => 7 * (1 - grow(i, 0)), 'a2'));
    els.push(...chars(b2, toL2(left2 + wA2 + wK2), F2 * g, (i) => grow(i, 0.08), (i) => 7 * (1 - grow(i, 0.08)), 'b2'));
    if (c && s >= 1.8) els.push(...chars(c, toL2(left2 + W2a + gap), F2 * g, () => clamp((s - 1.8) / 0.08), () => 4 * (1 - clamp((s - 1.8) / 0.12)), 'c'));
  }

  return (
    <AbsoluteFill style={{overflow: 'hidden', fontFamily: SANS}}>
      {/* 蓝底：中间一大片深蓝圆顶，上沿中间偏亮，下面两角最亮（青白），照原片 x=960 / x=100 两列取色 */}
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgb(9,72,152) 0%, rgb(11,88,175) 40%, rgb(40,135,215) 62%, rgb(120,190,240) 80%, rgb(200,232,251) 100%)'}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 1150px 560px at 960px 400px, rgba(11,80,165,0.95) 0%, rgba(11,84,170,0.8) 55%, rgba(12,92,180,0.35) 80%, rgba(12,92,180,0) 100%)'}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 760px 380px at 960px -40px, rgba(18,122,226,0.95) 0%, rgba(18,122,226,0.4) 55%, rgba(18,122,226,0) 100%)'}} />
      <AbsoluteFill style={{transform: `scale(${cam})`}}>{els}</AbsoluteFill>
      <Grain opacity={0.03} blend="screen" />
    </AbsoluteFill>
  );
};

if (checkContract(WORDS_MORPH_LINE_CONTRACT).length) throw new Error(checkContract(WORDS_MORPH_LINE_CONTRACT).join('；'));
export const WordsMorphLine: React.FC = () => <WordsMorphLineGroup />;
