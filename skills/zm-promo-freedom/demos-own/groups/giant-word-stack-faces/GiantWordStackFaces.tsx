// 【镜头组】giant-word-stack-faces：米白底一个小圈 → 撑满整屏的超大字（带一点重影抖动）往左越滑越快地滑过去 → 第二个词两行错开从右边挤进来 →
//   中间一个词、再补一个词，同一句一行行叠起来往上滚 → 收成一行小字，一圈打勾徽章顺时针画出来 → 炸开成一圈圈人脸（041-C 一拍，用户来源）
// 学的动作（SkaleSolutions · ListenLabs 23.6–28.4s，30fps 逐帧量过，2026-11-21）：
//   23.6–23.85 中间一个细线小圈；23.9 超大字（字高 ≈1000，左边贴着画面）出现，到 24.3 原地带一点重影抖动；24.3–25.2 往左越滑越快滑出去
//   25.2 第二个词（字高 ≈400）两行、上下错开半个字从右边挤进来往左走，25.9 走完；26.1 中间出一个词（字号 ≈270），26.3 后面补一个词
//   26.6–27.25 同一句复制成一叠、像手风琴拉开（先挤在一起错开几十像素，27.2 拉到行距 ≈480）；27.3 收成一行中号字（≈150）停一下，27.47–27.57 缩成小字（≈50）；27.45–27.75 一圈打勾徽章（直径 40，半径 ≈242）顺时针画出来
//   27.8–28.1 徽章圈停住，28.15 炸开成一圈圈人脸（越外圈越大），慢慢往外扩
// 我们的内容：「听见」→「招募」→「真实 用户」，人脸用素材库真人头像（和 041-A 一样的用法），右下角标"虚构 · 仅作演示"。
import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {GroupContract, checkContract, checkInputs, outputDuration, planExtras, toSource} from '../../../assets/lib/helpers/groupClock';

const FPS = 30;
const S0 = 23.6;
const CREAM = '#f7f2e8';
const SANS = '"Inter","PingFang SC","Noto Sans CJK SC","Noto Sans SC",sans-serif';
const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const eo = (u: number) => 1 - Math.pow(1 - clamp(u), 3);
const ei = (u: number) => Math.pow(clamp(u), 2.6);
const eio = (u: number) => { const x = clamp(u); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
const lin = (t: number, K: number[][]) => { if (t <= K[0][0]) return K[0][1]; for (let i = 1; i < K.length; i++) if (t <= K[i][0]) { const [a, va] = K[i - 1], [b, vb] = K[i]; return va + (vb - va) * (t - a) / (b - a); } return K[K.length - 1][1]; };
const hash = (n: number) => { const v = Math.sin(n * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };
const FACES = [...Array.from({length: 21}, (_, i) => `f${String(i + 1).padStart(2, '0')}`), ...Array.from({length: 18}, (_, i) => `m${String(i + 1).padStart(2, '0')}`)];
export const GIANT_STACK_FACES_CONTRACT: GroupContract = {
  sourceDuration: 144 / 30,
  fps: 30,
  motion: [[0, 3.65], [3.75, 4.5], [4.6, 144 / 30]],
  holds: [{at: 3.7, maxExtra: 1}, {at: 4.55, maxExtra: 1.5}],
  landmarks: {ring: 0, giant: 0.3, slide: 0.7, word2: 1.6, word3: 2.5, stack: 3.0, badges: 3.85, burst: 4.55},
  sfx: [
    {at: 'giant', type: '落版重击', note: '重击 hit', volume: 0.45},
    {at: 'slide', type: '短甩', note: '甩动 whoosh', volume: 0.4},
    {at: 'word2', type: '短甩', note: '甩动 whoosh', volume: 0.35},
    {at: 'stack', type: '轻tick', note: '滚动 tick 一串', tail: 0.6, volume: 0.3},
    {at: 'badges', type: '轻tick', note: '打勾 tick 一串', tail: 0.3, volume: 0.3},
    {at: 'burst', type: '上扬铺垫', note: '扩散 swell', volume: 0.4},
  ],
  inputs: {big: {maxChars: 3}, mid: {maxChars: 3}, a: {maxChars: 3}, b: {maxChars: 3}},
};
export type GiantStackInputs = {big: string; mid: string; a: string; b: string; note: string};
export const GIANT_STACK_DEFAULT_INPUTS: GiantStackInputs = {big: '听见', mid: '招募', a: '真实', b: '用户', note: '虚构 · 仅作演示'};
export const checkGiantStackInputs = (x: GiantStackInputs) => checkInputs(GIANT_STACK_FACES_CONTRACT, {big: x.big, mid: x.mid, a: x.a, b: x.b});
export const planGiantStack = (sec: number) => planExtras(GIANT_STACK_FACES_CONTRACT, sec);
export const giantStackFrames = (extras: number[]) => Math.round(outputDuration(GIANT_STACK_FACES_CONTRACT, extras) * FPS);
export const GIANT_STACK_FACES_DURATION = 144;

export const GiantWordStackFacesGroup: React.FC<{inputs?: GiantStackInputs; extras?: number[]}> = ({inputs: x = GIANT_STACK_DEFAULT_INPUTS, extras = [0, 0]}) => {
  const tt = useCurrentFrame() / FPS;
  const s = toSource(tt, GIANT_STACK_FACES_CONTRACT, extras) + S0;
  const held = tt - (s - S0);
  const f = Math.round(tt * FPS);
  const T = (fs: number): React.CSSProperties => ({position: 'absolute', fontFamily: SANS, fontSize: fs, fontWeight: 500, color: '#0b0b0b', whiteSpace: 'nowrap', lineHeight: 1});
  const els: React.ReactNode[] = [];
  if (s < 23.88) els.push(<div key="r" style={{position: 'absolute', left: 960 - 130, top: 540 - 130, width: 260, height: 260, borderRadius: '50%', border: '2px solid #999'}} />);
  if (s >= 23.88 && s < 25.4) {
    const BIG = 1080, slide = s < 24.3 ? 0 : -lin(s, [[24.3, 0], [24.45, 140], [24.6, 450], [24.85, 880], [25.1, 1380], [25.4, 2300]]); /* 对同帧：原片 24.6 词走了约 21%，25.1 走了约 64%（词宽按比例换算） */
    const jit = s < 24.3 ? (hash(f) - 0.5) * 30 : 0;
    els.push(<div key="b" style={{...T(BIG), left: -40 + slide + jit, top: 540, transform: 'translateY(-52%)'}}>{x.big}</div>);
    if (s < 24.9) els.push(<div key="bg" style={{...T(BIG), left: -40 + slide + 24 + jit * -0.6, top: 540, transform: 'translateY(-52%)', opacity: 1}}>{x.big}</div>); // 原片重影是同样黑的字错开一点叠在一起（不是灰影子）
  }
  if (s >= 25.15 && s < 26.05) {
    const MID = 560, k = eo((s - 25.15) / 0.75);
    const xx = 1950 - k * 1880;
    els.push(<div key="m1" style={{...T(MID), left: xx, top: 310, transform: 'translateY(-50%)'}}>{x.mid}</div>);
    els.push(<div key="m2" style={{...T(MID), left: xx - 60 + 40 * k, top: 720, transform: 'translateY(-50%)'}}>{x.mid}</div>);
    if (s > 25.8) { const o = clamp((s - 25.8) / 0.25); els.push(<div key="m3" style={{position: 'absolute', inset: 0, background: CREAM, opacity: o}} />); }
  }
  if (s >= 26.05 && s < 27.3) {
    const FS = 270;
    const w2 = s >= 26.3;
    const stack = s >= 26.6 && s < 27.3;
    if (!stack) els.push(<div key="v" style={{...T(FS), left: 0, right: 0, top: 560, transform: 'translateY(-50%)', textAlign: 'center', opacity: clamp((s - 26.08) / 0.08)}}>{x.a}{w2 ? ` ${x.b}` : ''}</div>);
    else {
      // 原片是同一句复制成一叠、像手风琴一样拉开：先挤在一起错开几十像素，再拉到行距 ≈480
      const sp = lin(s, [[26.6, 0], [26.65, 12], [26.73, 28], [26.8, 161], [26.93, 172], [27.0, 270], [27.13, 356], [27.2, 483], [27.25, 490]]);
      for (let i = -2; i <= 2; i++) { const y = 560 + i * sp; if (y < -200 || y > 1280) continue; els.push(<div key={'s' + i} style={{...T(FS), left: 0, right: 0, top: y, transform: 'translateY(-50%)', textAlign: 'center'}}>{x.a} {x.b}</div>); }
    }
  }
  if (s >= 27.3) {
    const fs = s < 27.3 ? 270 : lin(s, [[27.3, 150], [27.47, 150], [27.57, 50]]); /* 原片 27.33–27.47 先停在中号字，再缩成小字 */
    const burst = clamp((s - 28.15) / 0.3);
    els.push(<div key="sm" style={{...T(fs), left: 0, right: 0, top: 548, transform: 'translateY(-50%)', textAlign: 'center'}}>{x.a}{x.b}</div>);
    const draw = clamp((s - 27.45) / 0.3);
    if (s > 27.45 && burst < 1) {
      const N = 24;
      for (let i = 0; i < N; i++) {
        if (i / N > draw) continue;
        const a = -Math.PI * 0.62 + (i / N) * Math.PI * 2, r = 242 + burst * 120;
        els.push(<div key={'c' + i} style={{position: 'absolute', left: 960 + Math.cos(a) * r - 20, top: 548 + Math.sin(a) * r - 20, width: 40, height: 40, borderRadius: '50%', background: '#111', color: '#fff', fontSize: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 1 - burst}}>✓</div>);
      }
    }
    if (burst > 0) {
      const grow = 1 + (s - 28.15) * 0.25 + held * 0.03;
      const RINGS = [{r: 300, n: 24, d: 40}, {r: 390, n: 26, d: 58}, {r: 495, n: 28, d: 78}, {r: 615, n: 30, d: 100}, {r: 750, n: 32, d: 122}, {r: 900, n: 34, d: 142}, {r: 1060, n: 36, d: 160}]; /* 原片外圈的人脸更大更挤 */
      let k = 0;
      RINGS.forEach((R, ri) => {
        for (let i = 0; i < R.n; i++) {
          const a = (i / R.n) * Math.PI * 2 + ri * 0.21;
          const rr = R.r * grow * (0.6 + 0.4 * eo(burst));
          const px = 960 + Math.cos(a) * rr, py = 548 + Math.sin(a) * rr;
          k++;
          if (px < -150 || px > 2070 || py < -150 || py > 1230) continue;
          const d = R.d * (0.92 + hash(k) * 0.16);
          els.push(<div key={'f' + ri + '_' + i} style={{position: 'absolute', left: px - d / 2, top: py - d / 2, width: d, height: d, borderRadius: '50%', overflow: 'hidden', opacity: clamp(burst * 3 - ri * 0.25), background: '#e9e2d6'}}><Img src={staticFile(`library/faces/${FACES[(k * 7) % FACES.length]}.jpg`)} style={{width: '100%', height: '100%', objectFit: 'cover'}} /></div>);
        }
      });
    }
  }
  return (
    <AbsoluteFill style={{background: CREAM, overflow: 'hidden'}}>
      {els}
      <div style={{position: 'absolute', right: 36, bottom: 26, fontFamily: SANS, fontSize: 20, color: 'rgba(60,50,40,0.45)', letterSpacing: '0.06em'}}>{x.note}</div>
    </AbsoluteFill>
  );
};

if (checkContract(GIANT_STACK_FACES_CONTRACT).length) throw new Error(checkContract(GIANT_STACK_FACES_CONTRACT).join('；'));
export const GiantWordStackFaces: React.FC = () => <GiantWordStackFacesGroup />;
