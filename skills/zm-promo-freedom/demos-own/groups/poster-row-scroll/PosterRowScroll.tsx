// 【镜头组】poster-row-scroll：浅薄荷底，一排三张竖版品牌海报从下面错落升上来（中间先、右边、左边）→ 左边那张的图标边画边转、右边那张打出一句标语 →
//   整排往左滑过三张，换成第二组海报（图标在圆里 + 放射线 / 人像侧脸 / 磁场线和小点在转）→ 再往左滑回第一组，紧接着整排加速滑出画面（014-I 一拍，品牌延展 / 物料展示）
// 学的动作（Abstudiobrand · Neutron 37.4–43.2s，源 60fps，按时间逐帧量过，2026-11-22）：
//   海报 560×910，三张 x 40 / 680 / 1314（间距 ≈637），y 84–994；底色 #d5ffed，浅海报 #a0ffc8，深海报 #1c2e24
//   升起：中间 37.5–38.25，左右两张 37.65–38.35（从画面下方 → y 84，减速落位）
//   左海报大图标（宽 ≈476，中心 320,540）37.7–38.6 丝带线逐段画出、边画边转；右海报标语 38.0–38.6 逐字打出（▶ 开头，等宽字，左上 x≈1380 y≈130）
//   39.55–41.0 整排左滑 3 张（≈1911，39.9 已滑 690、40.2 滑 1650，后面慢慢靠拢）；42.2–42.6 再滑 3 张回第一组，42.55–42.85 加速滑出，之后只剩浅底
//   第二组：深海报（▶ 标语 + 圆里的小图标 + 往下散开的线和虚线椭圆）/ 绿色调人像侧脸 / 浅海报（中心黑点 + 磁场环线 + 小黑点沿环线走）
// 我们的内容：自己画的三瓣丝带图标、自己画的光团（不用别人的图）；人像暂用库里 sv25（侧脸，压成绿色调）——等能上网时换一张男性侧脸更贴原片；
//   标语「为把一切连在一起而生。」「从混乱，到清晰。」，页脚「中子科技」，右下角标"虚构 · 仅作演示"。
import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {GroupContract, checkContract, checkInputs, outputDuration, planExtras, toSource} from '../../../assets/lib/helpers/groupClock';

const FPS = 30;
const S0 = 37.4;
const BG = '#d5ffed';
const MINT = '#a0ffc8';
const DARK = '#1c2e24';
const LINE = '#d8f5e4';
const MONO = '"Noto Sans Mono CJK SC","DejaVu Sans Mono",monospace';
const SANS = '"Noto Sans CJK SC","PingFang SC",sans-serif';
const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const eo = (u: number) => 1 - Math.pow(1 - clamp(u), 3);
const eio = (u: number) => { const x = clamp(u); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
const ei = (u: number) => Math.pow(clamp(u), 3);
const PW = 560, PH = 910, PY = 84, PITCH = 637;
const PX = [40, 680, 1314];

export const POSTER_ROW_CONTRACT: GroupContract = {
  sourceDuration: 174 / 30,
  fps: 30,
  motion: [[0, 1.3], [2.15, 2.95], [4.85, 5.8]],
  holds: [{at: 1.7, maxExtra: 2}, {at: 3.9, maxExtra: 2}],
  landmarks: {rise: 0.05, draw: 0.3, type: 0.6, slide1: 2.15, slide2: 4.85, out: 5.2},
  sfx: [
    {at: 'rise', type: '运镜', note: '轻 whoosh 一串', tail: 0.4, volume: 0.3},
    {at: 'type', type: '键盘', note: '一串打字', tail: 0.6, volume: 0.2},
    {at: 'slide1', type: '运镜', note: '滑动 whoosh', volume: 0.3},
    {at: 'slide2', type: '运镜', note: '滑动 whoosh', volume: 0.3},
  ],
  inputs: {tag1: {maxChars: 14}, tag2: {maxChars: 14}, foot: {maxChars: 8}},
};
export type PosterRowInputs = {tag1: string; tag2: string; foot: string; portrait: string; note: string};
export const POSTER_ROW_DEFAULT_INPUTS: PosterRowInputs = {tag1: '为把一切连在一起而生。', tag2: '从混乱，到清晰。', foot: '中子科技', portrait: 'library/photos/shortvideo/sv25.jpg', note: '虚构 · 仅作演示'};
export const checkPosterRowInputs = (x: PosterRowInputs) => checkInputs(POSTER_ROW_CONTRACT, {tag1: x.tag1, tag2: x.tag2, foot: x.foot});
export const planPosterRow = (sec: number) => planExtras(POSTER_ROW_CONTRACT, sec);
export const posterRowFrames = (extras: number[]) => Math.round(outputDuration(POSTER_ROW_CONTRACT, extras) * FPS);
export const POSTER_ROW_DURATION = 174;

// 三瓣丝带图标（和 014-H 同一个）
const PETAL = 'M0 -92 C 46 -92 70 -30 40 8 C 18 36 -18 36 -40 8 C -70 -30 -46 -92 0 -92 Z';
const Logo: React.FC<{size: number; color: string; prog?: number; rot?: number}> = ({size, color, prog = 1, rot = 0}) => (
  <svg width={size} height={size} viewBox="-100 -100 200 200" style={{overflow: 'visible'}}>
    <g transform={`rotate(${rot})`}>{[0, 120, 240].map((a, i) => <path key={a} transform={`rotate(${a})`} d={PETAL} fill="none" stroke={color} strokeWidth={20} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - clamp(prog * 3 - i)} />)}</g>
  </svg>
);
const Foot: React.FC<{t: string; c: string}> = ({t, c}) => <div style={{position: 'absolute', left: 0, right: 0, bottom: 26, textAlign: 'center', fontFamily: SANS, fontSize: 20, color: c}}>{t}</div>;
const Tag: React.FC<{t: string; n: number; c: string}> = ({t, n, c}) => (
  <div style={{position: 'absolute', left: 32, top: 40, right: 30, fontFamily: MONO, fontSize: 30, lineHeight: 1.25, color: c, display: 'flex', gap: 14}}>
    <span style={{fontSize: 22, marginTop: 4}}>▶</span><span>{Array.from(t).slice(0, n).join('')}</span>
  </div>
);

export const PosterRowScrollGroup: React.FC<{inputs?: PosterRowInputs; extras?: number[]}> = ({inputs: x = POSTER_ROW_DEFAULT_INPUTS, extras = [0, 0]}) => {
  const tt = useCurrentFrame() / FPS;
  const s = toSource(tt, POSTER_ROW_CONTRACT, extras) + S0;
  const lin = (t: number, K: number[][]) => { if (t <= K[0][0]) return K[0][1]; for (let i = 1; i < K.length; i++) if (t <= K[i][0]) { const [a, va] = K[i - 1], [b, vb] = K[i]; return va + (vb - va) * (t - a) / (b - a); } return K[K.length - 1][1]; };
  const scroll = lin(s, [[39.55, 0], [39.7, 180], [39.9, 690], [40.2, 1650], [40.5, 1870], [41.0, 1911]]) + eio((s - 42.2) / 0.4) * 3 * PITCH + ei((s - 42.55) / 0.3) * 2300;
  const riseT = [[37.65, 0.7], [37.5, 0.75], [37.65, 0.7]];
  const tag1N = Math.round(clamp((s - 38.0) / 0.6) * Array.from(x.tag1).length);
  const tag2N = Math.round(clamp((s - 40.2) / 0.5) * Array.from(x.tag2).length);
  const logoProg = eio((s - 37.7) / 0.9), logoRot = (1 - eo((s - 37.7) / 1.0)) * -60;
  const orbitT = s * 0.9;
  // 一组 = 3 张；第三组是第一组重复（第二次滑回来时图标重画）
  const posterA = (i: number, redraw: number) => {
    const lp = redraw > 0 ? eio((s - redraw) / 0.6) : logoProg, lr = redraw > 0 ? (1 - eo((s - redraw) / 0.7)) * -60 : logoRot;
    if (i === 0) return <div style={{width: PW, height: PH, background: MINT, position: 'relative'}}><div style={{position: 'absolute', left: 0, top: 176}}><Logo size={560} color={DARK} prog={lp} rot={lr} /></div><Foot t={x.foot} c={DARK} /></div>;
    if (i === 1) return <div style={{width: PW, height: PH, position: 'relative', overflow: 'hidden', background: 'radial-gradient(ellipse 70% 55% at 52% 42%, #ffffff 0%, #d8fff6 12%, #74e6e0 30%, #2b9c9a 52%, #0e3b3a 78%, #071a19 100%)'}}>
      <svg width={PW} height={PH} style={{position: 'absolute', inset: 0, mixBlendMode: 'screen'}}>
        <defs><filter id="prs-b"><feGaussianBlur stdDeviation="3" /></filter></defs>
        {Array.from({length: 22}).map((_, k) => { const a = k * 16.3 + s * 6; return <ellipse key={k} cx={290} cy={380} rx={60 + (k % 6) * 38} ry={220 + (k % 4) * 40} transform={`rotate(${a} 290 380)`} fill="none" stroke={k % 3 ? '#c8fff0' : '#e9ff9a'} strokeOpacity={0.18 + (k % 5) * 0.05} strokeWidth={1.5} filter="url(#prs-b)" />; })}
        <circle cx={290} cy={380} r={70} fill="#fff" opacity={0.85} filter="url(#prs-b)" />
        {[[215, 330], [410, 210]].map(([a, b], k) => <line key={k} x1={290 - a} y1={380 - b} x2={290 + a} y2={380 + b} stroke="#fff" strokeOpacity={0.5} strokeWidth={2} filter="url(#prs-b)" />)}
      </svg>
      <div style={{position: 'absolute', left: 258, bottom: 22}}><Logo size={44} color={LINE} /></div>
    </div>;
    return <div style={{width: PW, height: PH, background: DARK, position: 'relative'}}>
      <Tag t={x.tag1} n={redraw > 0 ? 99 : tag1N} c={LINE} />
      <svg width={PW} height={PH} style={{position: 'absolute', inset: 0}}>
        <circle cx={283} cy={470} r={235} fill="none" stroke={LINE} strokeWidth={2} />
        <ellipse cx={283} cy={470} rx={235} ry={64} fill="none" stroke={LINE} strokeWidth={2} />
        <ellipse cx={283} cy={470} rx={64} ry={235} fill="none" stroke={LINE} strokeWidth={2} />
        {[35, -35].map((r) => <ellipse key={r} cx={283} cy={470} rx={235} ry={90} transform={`rotate(${r} 283 470)`} fill="none" stroke={LINE} strokeWidth={2} strokeDasharray="2 7" />)}
        {[0, 1.7, 3.3, 4.6].map((p, k) => { const a = orbitT + p; return <circle key={k} cx={283 + 235 * Math.cos(a)} cy={470 + (k % 2 ? 235 * Math.sin(a) : 64 * Math.sin(a))} r={4.5} fill={LINE} />; })}
      </svg>
      <Foot t={x.foot} c={LINE} />
    </div>;
  };
  const posterB = (i: number) => {
    if (i === 0) return <div style={{width: PW, height: PH, background: DARK, position: 'relative'}}>
      <Tag t={x.tag2} n={tag2N} c={LINE} />
      <svg width={PW} height={PH} style={{position: 'absolute', inset: 0}}>
        <circle cx={284} cy={460} r={76} fill="none" stroke={LINE} strokeWidth={2} />
        {[-6, -4, -2, 0, 2, 4, 6].map((k) => <path key={k} d={`M ${284 + k * 6} 536 Q ${284 + k * 22} 700 ${284 + k * 48} ${PH}`} fill="none" stroke={LINE} strokeWidth={1.5} />)}
        <ellipse cx={284} cy={600} rx={160} ry={40} fill="none" stroke={LINE} strokeWidth={2} strokeDasharray="2 8" />
        <ellipse cx={284} cy={760} rx={250} ry={70} fill="none" stroke={LINE} strokeWidth={2} strokeDasharray="2 8" />
        {[-6, -2, 2, 6].map((k, j) => { const u = ((orbitT * 0.25 + j * 0.27) % 1); return <circle key={k} cx={284 + k * (6 + 42 * u)} cy={536 + (PH - 536) * u} r={5} fill={LINE} />; })}
      </svg>
      <div style={{position: 'absolute', left: 284 - 50, top: 460 - 50}}><Logo size={100} color={LINE} rot={(1 - eo((s - 40.0) / 1.0)) * -90} prog={eio((s - 39.9) / 0.6)} /></div>
    </div>;
    if (i === 1) return <div style={{width: PW, height: PH, position: 'relative', overflow: 'hidden', background: '#5fbf86'}}>
      <Img src={staticFile(x.portrait)} style={{position: 'absolute', left: -40, top: -30, width: PW + 80, height: PH + 60, objectFit: 'cover', filter: 'grayscale(1) contrast(1.25) brightness(0.85)', mixBlendMode: 'multiply'}} />
      <div style={{position: 'absolute', inset: 0, background: '#7dd6a0', mixBlendMode: 'screen', opacity: 0.25}} />
      <div style={{position: 'absolute', left: 258, bottom: 22}}><Logo size={44} color={LINE} /></div>
    </div>;
    return <div style={{width: PW, height: PH, background: MINT, position: 'relative'}}>
      <Tag t={x.tag1} n={99} c={DARK} />
      <svg width={PW} height={PH} style={{position: 'absolute', inset: 0}}>
        {[60, 110, 170, 240].map((rx, k) => [-1, 1].map((sd) => <ellipse key={k + '' + sd} cx={280 + sd * rx * 0.9} cy={570} rx={rx} ry={210} fill="none" stroke={DARK} strokeOpacity={0.6} strokeWidth={1.2} />))}
        <circle cx={280} cy={570} r={26} fill={DARK} />
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((k) => { const rx = [60, 110, 170, 240][k % 4], sd = k % 2 ? 1 : -1, a = orbitT * (0.7 + (k % 3) * 0.2) + k * 1.3; return <ellipse key={k} cx={280 + sd * rx * 0.9 + rx * Math.cos(a)} cy={570 + 210 * Math.sin(a)} rx={7} ry={9} transform={`rotate(${(a * 57) % 360} ${280 + sd * rx * 0.9 + rx * Math.cos(a)} ${570 + 210 * Math.sin(a)})`} fill={DARK} />; })}
      </svg>
      <Foot t={x.foot} c={DARK} />
    </div>;
  };
  const cards: React.ReactNode[] = [];
  for (let g = 0; g < 3; g++) for (let i = 0; i < 3; i++) {
    const left = PX[i] + g * 3 * PITCH - scroll;
    if (left > 1920 || left < -PW) continue;
    let top = PY;
    if (g === 0) { const [t0, d] = riseT[i]; top = 1100 + (PY - 1100) * eo((s - t0) / d); }
    cards.push(<div key={g + '-' + i} style={{position: 'absolute', left, top}}>{g === 1 ? posterB(i) : posterA(i, g === 2 ? 42.35 : 0)}</div>);
  }
  return (
    <AbsoluteFill style={{background: BG, overflow: 'hidden'}}>
      {cards}
      <div style={{position: 'absolute', right: 36, bottom: 26, fontFamily: SANS, fontSize: 20, color: 'rgba(30,60,50,0.45)', letterSpacing: '0.06em'}}>{x.note}</div>
    </AbsoluteFill>
  );
};

if (checkContract(POSTER_ROW_CONTRACT).length) throw new Error(checkContract(POSTER_ROW_CONTRACT).join('；'));
export const PosterRowScroll: React.FC = () => <PosterRowScrollGroup />;
