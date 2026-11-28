// 【镜头组】circle-morph-listen：米白底，一张圆形人像照片上长出两个蓝色大圆、挤成沙漏 → 合成一个写着「认识」的蓝圆、左右挤出一排椭圆 → 椭圆收掉只剩一个词 →
//   变成黑圆，外圈一圈圈涟漪往外扩，缩成一个小字标 → 字标放大 → 超大字横着滑过（几层叠着）→ 中间换词，一圈点围住词 → 点一圈圈往外扩成放射点阵 → 点变成一张张人脸（041-A 一串，核心）
// 学的动作（SkaleSolutions · ListenLabs 6.4–13s，30fps 逐帧量过）：
//   6.4 人像圆 d660（960,540）→ 6.55 上下两个蓝圆（d≈1100，上圆底边 y528、下圆顶边 y540）→ 6.8 上圆往左、下圆往右错开
//   7.05 中间蓝圆 d960 写字，左右各一个窄椭圆 → 7.3 椭圆变多变窄 → 7.55 一排圆从中间往两边越来越小 → 7.8 只剩黑字 120px
//   8.05 黑圆 d936 白字 → 8.3 圆缩到 360、外面 8 圈细线涟漪（半径 190→380）、两边各一个小标 → 8.55 圆 300、涟漪扩到 690 → 8.8 缩成小字标（24px）→ 9.3 放大到 330px
//   9.7–10.45 超大字（≈900px 高）三层错开往左滑过；10.55 / 10.8 / 11.05 中间换词（70px）；11.3 一圈 30 个点围住词（r228）→ 11.55–11.8 整体缩小
//   12.05 点一圈圈往外扩（最外 r600）→ 12.8 点变成人脸照片、镜头推近 → 13.0 顶上打出后半句
// 我们的内容：虚构产品「听见」（图标自己画），词：认识 / 听见 / 能和 / 成千 / 成千上万 / 的人聊天；人脸用素材库真人头像；右下角标"虚构 · 仅作演示"。
import React from 'react';
import {smoothKf} from '../_kit/smoothKey';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {GroupContract, checkContract, checkInputs, outputDuration, planExtras, toSource} from '../../../assets/lib/helpers/groupClock';

const FPS = 30;
const S0 = 6.4;
export const CIRCLE_MORPH_LISTEN_CONTRACT: GroupContract = {
  sourceDuration: 198 / 30,
  fps: 30,
  motion: [[0, 2.85], [2.95, 198 / 30]],
  holds: [{at: 2.9, maxExtra: 1.5}],
  landmarks: {split: 0.15, meet: 0.65, ovals: 0.9, word: 1.4, ripple: 1.9, mark: 2.4, giant: 3.3, words: 4.15, ring: 4.9, burst: 5.65, faces: 6.4},
  sfx: [
    {at: 'split', type: '弹出', note: '弹性 boing', volume: 0.4},
    {at: 'ovals', type: '弹出', note: '一串 pop', tail: 0.4, volume: 0.35},
    {at: 'ripple', type: '运镜', note: '涟漪 whoom', volume: 0.45},
    {at: 'giant', type: '运镜', note: '横滑 whoosh', volume: 0.45},
    {at: 'words', type: '短甩', note: '三下 tick', tail: 0.6, volume: 0.3},
    {at: 'burst', type: '闪光', note: '散开 sparkle', volume: 0.4},
  ],
  inputs: {meet: {maxChars: 3}, name: {maxChars: 3}},
};
export type ListenInputs = {meet: string; name: string; words: [string, string, string]; tail: string; note: string};
export const LISTEN_DEFAULT_INPUTS: ListenInputs = {meet: '认识', name: '听见', words: ['能和', '成千', '成千上万'], tail: '的人聊天', note: '虚构 · 仅作演示'};
export const checkListenInputs = (x: ListenInputs) => checkInputs(CIRCLE_MORPH_LISTEN_CONTRACT, {meet: x.meet, name: x.name});
export const planListen = (sec: number) => planExtras(CIRCLE_MORPH_LISTEN_CONTRACT, sec);
export const listenFrames = (extras: number[]) => Math.round(outputDuration(CIRCLE_MORPH_LISTEN_CONTRACT, extras) * FPS);
export const CIRCLE_MORPH_LISTEN_DURATION = 198;

export const CREAM = '#f7f2e8';
export const BLUE = '#0a1fc4';
export const SANS = '"Inter","PingFang SC","Noto Sans CJK SC","Noto Sans SC",sans-serif';
export const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
export const mix = (a: number, b: number, k: number) => a + (b - a) * k;
export const eo = (u: number) => 1 - Math.pow(1 - clamp(u), 3);
export const eio = (u: number) => { const x = clamp(u); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
export const kf = (t: number, K: number[][], e: (u: number) => number = eio) => { if (K.length > 2 && K.every((k, j) => j === 0 || k[0] > K[j - 1][0])) return smoothKf(t, K); if (t <= K[0][0]) return K[0][1]; for (let i = 0; i < K.length - 1; i++) if (t <= K[i + 1][0]) return mix(K[i][1], K[i + 1][1], e((t - K[i][0]) / (K[i + 1][0] - K[i][0]))); return K[K.length - 1][1]; };
export const FACES = [...Array.from({length: 21}, (_, i) => `f${String(i + 1).padStart(2, '0')}`), ...Array.from({length: 18}, (_, i) => `m${String(i + 1).padStart(2, '0')}`)];
/** 自己画的产品小标：一个缺了右上角的盾形 + 一个小方块 */
export const EarMark: React.FC<{size: number; color?: string}> = ({size, color = '#111'}) => (
  <svg width={size} height={size} viewBox="0 0 24 24"><path d="M3 6 H11 V13 C11 17 8.5 19.5 5.5 21 L3 21 Z" fill={color} /><rect x={13} y={3} width={8} height={8} rx={1.5} fill={color} /></svg>
);
const Circ: React.FC<{cx: number; cy: number; w: number; h: number; bg: string; children?: React.ReactNode}> = ({cx, cy, w, h, bg, children}) => (
  <div style={{position: 'absolute', left: cx - w / 2, top: cy - h / 2, width: w, height: h, borderRadius: '50%', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'}}>{children}</div>
);

export const CircleMorphListenGroup: React.FC<{inputs?: ListenInputs; extras?: number[]}> = ({inputs: x = LISTEN_DEFAULT_INPUTS, extras = [0]}) => {
  const tt = useCurrentFrame() / FPS;
  const s = toSource(tt, CIRCLE_MORPH_LISTEN_CONTRACT, extras) + S0;
  const held = tt - (s - S0);
  const W = (t: string, fs: number, c = '#111', w = 500) => <span style={{fontFamily: SANS, fontSize: fs, color: c, fontWeight: w, whiteSpace: 'nowrap'}}>{t}</span>;
  const els: React.ReactNode[] = [];
  if (s < 6.43) { // 原片 6.433 切到两块蓝半圆
    els.push(<Circ key="p" cx={960} cy={540} w={660} h={660} bg="#ccc"><Img src={staticFile('library/faces/m04.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover'}} /></Circ>);
  } else if (s < 7.0) {
    const k = eio(clamp((s - 6.45) / 0.4));
    const d = mix(700, 1080, eo(clamp((s - 6.45) / 0.12)));
    // 2026-11-18 逐帧：6.85 起两块半圆往上下甩出去，中间「认识」圆从 d≈560 长到 980（7.0），左上 / 右下各蹦一颗小圆；之前要等到 7.0 才一下出来
    const out = Math.max(0, s - 6.85) * 4200;
    if (s < 6.93) els.push(<Circ key="a" cx={960 - k * 135} cy={528 - d / 2 - out} w={d} h={d} bg={BLUE} />, <Circ key="b" cx={960 + k * 135} cy={540 + d / 2 + out} w={d} h={d} bg={BLUE} />);
    if (s > 6.85) {
      const md = kf(s, [[6.85, 560], [6.93, 820], [7.0, 980]]);
      const bub = clamp((7.02 - s) / 0.05);
      els.push(<Circ key="m" cx={960} cy={540} w={md} h={md} bg={BLUE}>{W(x.meet, 72, '#fff')}</Circ>);
      els.push(<div key="bb" style={{opacity: bub}}><Circ cx={960 - md * 0.33} cy={540 - md * 0.57} w={md * 0.19} h={md * 0.19} bg={BLUE} /><Circ cx={960 + md * 0.33} cy={540 + md * 0.56} w={md * 0.21} h={md * 0.21} bg={BLUE} /></div>);
    }
  } else if (s < 7.64) {
    const k = clamp((s - 7.0) / 0.7);
    const cw = kf(s, [[7.0, 1000], [7.05, 960], [7.12, 620], [7.25, 550], [7.4, 540], [7.55, 540]]), ch = kf(s, [[7.0, 1000], [7.05, 960], [7.25, 1000], [7.4, 920], [7.55, 720]]);
    if (s < 7.6) els.push(<Circ key="c" cx={960} cy={540} w={cw} h={ch} bg={BLUE}>{W(x.meet, 72, '#fff')}</Circ>); // 原片 7.6 中间圆先没、7.64 两边也没（硬切，不是淡出）
    // 两边椭圆：7.05 一个宽椭圆 → 7.3 四个细高椭圆 → 7.55 一排越来越小的圆
    // 2026-11-19 逐帧重量：7.1–7.2 每边只有一个宽椭圆（中心距 640、330×960），7.233 最外边才冒出一条细的，7.4 每边三个、越往外越小越矮
    const S1 = [{o: 620, w: 540, h: 1000}, {o: 880, w: 0, h: 900}, {o: 960, w: 0, h: 860}, {o: 1020, w: 0, h: 820}];
    const S2 = [{o: 438, w: 300, h: 600}, {o: 696, w: 168, h: 480}, {o: 846, w: 100, h: 400}, {o: 960, w: 40, h: 300}];
    const S3 = [{o: 432, w: 360, h: 360}, {o: 696, w: 168, h: 168}, {o: 846, w: 132, h: 132}, {o: 950, w: 96, h: 96}];
    const a = eio(clamp((s - 7.18) / 0.22)), b = eio(clamp((s - 7.4) / 0.15));
    const fade = 1;
    S1.forEach((p1, i) => {
      const o = mix(mix(p1.o, S2[i].o, a), S3[i].o, b), w = mix(mix(p1.w, S2[i].w, a), S3[i].w, b), h = mix(mix(p1.h, S2[i].h, a), S3[i].h, b);
      if (w > 1 && s >= 7.07) for (const sd of [-1, 1]) els.push(<div key={`${i}${sd}`} style={{opacity: fade}}><Circ cx={960 + sd * o} cy={540} w={w} h={h} bg={BLUE} /></div>);
    });
    void k;
  } else if (s < 8.75) {
    if (s < 7.85) els.push(<div key="w" style={{position: 'absolute', left: 0, right: 0, top: 540, transform: 'translateY(-50%)', textAlign: 'center'}}>{W(x.name, 120)}</div>);
    else {
      const d = kf(s, [[7.85, 120], [7.9, 430], [7.933, 650], [7.967, 780], [8.0, 860], [8.05, 936], // 按原片每帧暗面积反推：黑圆 7.85 从小点长出来
         [8.3, 360], [8.55, 300], [8.75, 140]]);
      const rr = kf(s, [[8.2, 250], [8.3, 380], [8.55, 690], [8.75, 900]], (u) => u); // 2026-11-19 量原片 8.3：最外圈 r≈380、12 圈、圈距 ≈14
      const ro = clamp((s - 8.15) / 0.1) * (1 - clamp((s - 8.6) / 0.15));
      els.push(<div key="r" style={{opacity: ro}}>{Array.from({length: 12}, (_, i) => { const r = rr - i * 14; return <div key={i} style={{position: 'absolute', left: 960 - r, top: 540 - r, width: r * 2, height: r * 2, borderRadius: '50%', boxShadow: '0 0 0 1.5px #222'}} />; })}</div>);
      els.push(<Circ key="b" cx={960} cy={540} w={d} h={d} bg="#111">{W(x.name, d * 0.13, '#fff')}</Circ>);
      if (s > 8.0) for (const sd of [-1, 1]) els.push(<div key={`m${sd}`} style={{position: 'absolute', left: 960 + sd * kf(s, [[8.0, 590], [8.3, 530], [8.55, 600]]) - 28, top: 512, opacity: 1 - clamp((s - 8.6) / 0.12)}}><EarMark size={56} /></div>); // 原片两侧小标在 ±530~600 基本不动、≈56px，黑圆一出来就在
    }
  } else if (s < 9.7) {
    const fs = s < 9.05 ? 24 : kf(s, [[9.05, 330], [9.7, 352]], (u) => u) * (1 + 0.1 * (1 - eo(clamp((s - 9.05) / 0.3)))); /* 切过来后还有一点点回落（帧差：9.1 起 13 → 6.5 衰减） */ // 2026-11-19 逐帧：原片 9.0→9.067 是硬切放大（小字标直接跳成大字标），不是 0.25s 放大
    els.push(<div key="wm" style={{position: 'absolute', left: 960, top: 540, transform: `translate(-50%,-50%) translateX(${-(s - 9.3) * 60}px)`, display: 'flex', alignItems: 'center', gap: fs * 0.35}}><EarMark size={fs * 1.0} />{W(x.name, fs)}</div>);
  } else if (s < 10.333) {
    // 2026-11-19 逐帧（帧差）：超大字是一串同样的词首尾相接（字高 ≈860px），往左滑、越滑越快，10.333 硬切到下一个词；
    //   词与词之间按整词宽度排开，不会叠在一起（之前三层错开 820px，中文会叠成重影）
    const dt = s - 9.7;
    const xx = 430 - 1800 * dt - 9500 * dt * dt;
    const ww = Array.from(x.name).length * 1000 + 240;
    [0, 1, 2, 3].forEach((i) => els.push(<div key={`g${i}`} style={{position: 'absolute', left: xx + i * ww, top: 540, transform: 'translateY(-52%)'}}>{W(x.name, 1000, '#111', 500)}</div>));
  } else {
    // 换词 + 点圈 + 放射点阵 + 人脸
    const word = s < 10.78 ? x.words[0] : s < 11.03 ? x.words[1] : x.words[2];
    // 2026-11-19 逐帧量原片：只有中间的字在缩（11.3→12.05），点圈本身不缩：
    //   11.3 一圈 30 个点 r≈230 → 11.7 圈变成两层 → 11.95 放射点阵（64 条辐射线 × 10 圈，内圈 r≈165、外圈 r≈440）→ 12.15 外圈 r≈600
    //   12.6–12.75 点变大、内 8 圈变人脸、最外两圈是大黑点（越往外越大）→ 12.9 镜头推近、中心往下移（字到 y≈944）→ 13.0 再推，顶上出后半句
    const tsc = kf(s, [[11.3, 1], [11.55, 0.72], [11.8, 0.55], [12.05, 0.42]]) + held * 0.006;
    const ring = clamp((s - 11.25) / 0.12);
    const field = clamp((s - 11.78) / 0.12);
    const faceK = clamp((s - 12.6) / 0.25);
    const cam = kf(s, [[12.75, 1], [12.9, 1.38], [13.0, 1.9], [13.3, 2.05]]) + held * 0.008;
    const cy = kf(s, [[12.75, 540], [12.9, 920], [13.0, 1450], [13.3, 1520]]);
    const Rin = kf(s, [[11.78, 215], [11.95, 165], [12.4, 145]]), Rout = kf(s, [[11.78, 300], [11.95, 440], [12.15, 600], [12.4, 612]]);
    const NR = 10, NS = 64;
    const dots: React.ReactNode[] = [];
    if (field < 1) for (let j = 0; j < 30; j++) { const a = (j / 30) * Math.PI * 2; dots.push(<div key={`r${j}`} style={{position: 'absolute', left: Math.cos(a) * 228 - 6, top: Math.sin(a) * 228 - 6, width: 12, height: 12, borderRadius: '50%', background: '#111', opacity: ring * (1 - field)}} />); const a2 = a + Math.PI / 30, k2 = clamp((s - 11.55) / 0.12), r2 = mix(228, 182, k2); if (k2 > 0) dots.push(<div key={`q${j}`} style={{position: 'absolute', left: Math.cos(a2) * r2 - 5, top: Math.sin(a2) * r2 - 5, width: 10, height: 10, borderRadius: '50%', background: '#111', opacity: k2 * (1 - field)}} />); } // 原片 11.6 起圈里再长出一圈错开的点（两层）
    if (field > 0) for (let ri = 0; ri < NR; ri++) {
      const r = mix(Rin, Rout, ri / (NR - 1));
      const face = ri < NR - 2;
      const sz = mix(10, face ? mix(28, 36, ri / (NR - 1)) : 34 + 4 * (ri - (NR - 2)), faceK);
      const ns = Math.min(NS, 32 * Math.pow(2, Math.floor(Math.log2(Math.max(1, r / Math.max(1, Rin)) + 1e-6)))); // 原片辐射线往外一分为二：内圈 32 个点、往外 64、最外 128
      for (let j = 0; j < ns; j++) {
        const a = (j / ns) * Math.PI * 2;
        const fi = (ri * 17 + j * 5) % FACES.length; void NS;
        dots.push(<div key={`${ri}-${j}`} style={{position: 'absolute', left: Math.cos(a) * r - sz / 2, top: Math.sin(a) * r - sz / 2, width: sz, height: sz, borderRadius: '50%', background: '#111', overflow: 'hidden', opacity: field}}>
          {face && faceK > 0 && <Img src={staticFile(`library/faces/${FACES[fi]}.jpg`)} style={{width: '100%', height: '100%', objectFit: 'cover', opacity: faceK}} />}
        </div>);
      }
    }
    els.push(
      <div key="g" style={{position: 'absolute', left: 960, top: cy, transform: `scale(${cam})`}}>
        {dots}
        <div style={{position: 'absolute', left: 0, top: 0, transform: `translate(-50%,-50%) scale(${tsc})`}}>{W(word, 72)}</div>
      </div>,
    );
    if (s > 12.85) els.push(<div key="tail" style={{position: 'absolute', left: 0, right: 0, top: 268, textAlign: 'center'}}>{W(Array.from(x.tail).slice(0, Math.floor(clamp((s - 12.85) / 0.4) * x.tail.length + 0.001)).join(''), 64)}</div>);
  }
  return (
    <AbsoluteFill style={{background: CREAM, overflow: 'hidden'}}>
      {els}
      <div style={{position: 'absolute', left: 958, top: 46, width: 4, height: 2, background: '#999'}} />
      <div style={{position: 'absolute', right: 36, bottom: 26, fontFamily: SANS, fontSize: 20, color: 'rgba(60,50,40,0.45)', letterSpacing: '0.06em'}}>{x.note}</div>
    </AbsoluteFill>
  );
};

if (checkContract(CIRCLE_MORPH_LISTEN_CONTRACT).length) throw new Error(checkContract(CIRCLE_MORPH_LISTEN_CONTRACT).join('；'));
export const CircleMorphListen: React.FC = () => <CircleMorphListenGroup />;
