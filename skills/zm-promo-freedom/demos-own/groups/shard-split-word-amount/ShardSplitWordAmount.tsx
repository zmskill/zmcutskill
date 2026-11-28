// 【镜头组】shard-split-word-amount：白底一块蓝色“沙漏”色带越收越窄，两半个词从左右两边撞进来合成一个词 → 色带碎成几块斜色片绕着词转成一个“X”，
//   词和色片一起越放越大铺满屏 → 词又劈开往两边飞走，中间逐字打出一行白字，两边冒出乱码字框 → 蓝色一阶一阶往中间收、超大金额从右边甩进来（035-A 一拍，开场钩子）
// 学的动作（Varcyyyy · Venmo 0–2.0s，30fps 逐帧量过，2026-11-21）：
//   0–0.2 色带：上沿宽 1633 → 0.033 1010 → 0.067 709 → 0.1 595 → 0.133 531 → 0.167 358 → 0.2 335，腰宽约 0.73 倍；0.1 起上下两头变淡，0.15 顶上切出一截错开，0.2 中间一道亮缝
//   0.1 两半个词从两边进来（字号 ≈184，蓝色）：两半之间的空当 0.1 1550 → 0.15 1220 → 0.2 1007 → 0.3 265 → 0.4 154 → 0.55 合上；字号 0.3 150 → 0.4 100 → 0.55 128，0.25–0.5 变成深藏青
//   0.25–0.55 色带碎成斜色片：一块转到 ≈40°（左下到右上），一块近乎竖着，0.55 再出一块细的反斜；0.8 右边多一块横楔
//   0.55–1.2 词和色片一起放大：字号 128 → 0.8 157 → 0.95 250 → 1.1 375 → 1.2 390（越来越快）
//   1.17 词劈开往两边飞，1.33 飞出画面；1.2–1.33 中间逐词出白字（字号 ≈76，y 533）；整屏基本是蓝的，下方中间、左上留白三角
//   1.17 起两个乱码字框：右边一条（高 130，y 676–806，左沿 1469 → 1.5 1151 → 1.75 1125）；左上一条竖的（x 233–529，从顶上往下长到 470）
//   1.55 起蓝色从两边一阶一阶收：左右沿 1.5 (52,1920) → 1.75 (488,1516) → 1.85 (400,1086) → 1.9 (341,888) → 1.95 (276,702) → 2.0 (200,450)
//   1.85 超大金额（字高 ≈540）从右边甩进来：左沿 1.85 1825 → 1.9 1583 → 1.95 730 → 2.0 ≈330
// 汉字单字比英文半词窄，字号放大 1.3 倍补视觉分量；色片：两块平行错开的 /（各往外头淡，错开约 200px）+ 一块陡的 + 一条细的 \，0.62 起右边一块横楔。
// 我们的内容：「分」「账」→「分账」→ 白字「从没这么简单」→「¥347」，乱码用数字和符号，右下角标"虚构 · 仅作演示"。
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {GroupContract, checkContract, checkInputs, outputDuration, planExtras, toSource} from '../../../assets/lib/helpers/groupClock';

const FPS = 30;
const S0 = 0;
const BLUE = '#1296f2';
const NAVY = '#0b2a4f';
const SANS = '"Inter","PingFang SC","Noto Sans CJK SC","Noto Sans SC",sans-serif';
const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lin = (t: number, K: number[][]) => {
  if (t <= K[0][0]) return K[0][1];
  for (let i = 1; i < K.length; i++) if (t <= K[i][0]) { const [a, va] = K[i - 1], [b, vb] = K[i]; return va + (vb - va) * (t - a) / (b - a); }
  return K[K.length - 1][1];
};
const hash = (n: number) => { const v = Math.sin(n * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };
const mixHex = (a: string, b: string, k: number) => { const p = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)); const A = p(a), B = p(b); return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * clamp(k))).join(',')})`; };
const GLYPHS = '0123456789$%&<>*@#¥+=';

export const SHARD_SPLIT_CONTRACT: GroupContract = {
  sourceDuration: 60 / 30,
  fps: 30,
  motion: [[0, 1.45], [1.55, 2.0]],
  holds: [{at: 1.5, maxExtra: 1}],
  landmarks: {band: 0, halves: 0.1, merge: 0.55, zoom: 0.8, split: 1.17, line: 1.2, recede: 1.55, amount: 1.85},
  sfx: [
    {at: 'halves', type: '短甩', note: '甩动 whoosh', volume: 0.35},
    {at: 'merge', type: '点击', note: '合上 snap', volume: 0.4},
    {at: 'split', type: '短甩', note: '劈开 swish', volume: 0.4},
    {at: 'line', type: '键盘', note: '一串打字', tail: 0.15, volume: 0.25},
    {at: 'amount', type: '落版重击', note: '重击 hit', volume: 0.45},
  ],
  inputs: {a: {maxChars: 2}, b: {maxChars: 2}, line: {maxChars: 8}, amount: {maxChars: 5}},
};
export type ShardSplitInputs = {a: string; b: string; line: string; amount: string; note: string};
export const SHARD_SPLIT_DEFAULT_INPUTS: ShardSplitInputs = {a: '分', b: '账', line: '从没这么简单', amount: '¥347', note: '虚构 · 仅作演示'};
export const checkShardSplitInputs = (x: ShardSplitInputs) => checkInputs(SHARD_SPLIT_CONTRACT, {a: x.a, b: x.b, line: x.line, amount: x.amount});
export const planShardSplit = (sec: number) => planExtras(SHARD_SPLIT_CONTRACT, sec);
export const shardSplitFrames = (extras: number[]) => Math.round(outputDuration(SHARD_SPLIT_CONTRACT, extras) * FPS);
export const SHARD_SPLIT_DURATION = 60;

// 一块斜色片：中心、长、宽、角度，渐变从 0 端实色到 1 端淡掉
const Slab: React.FC<{cx: number; cy: number; L: number; W: number; ang: number; fadeTo?: number; o?: number}> = ({cx, cy, L, W, ang, fadeTo = 1, o = 1}) => (
  <div style={{position: 'absolute', left: cx - L / 2, top: cy - W / 2, width: L, height: W, transform: `rotate(${ang}deg)`, opacity: o, background: `linear-gradient(90deg, rgba(18,150,242,${1 - 0.95 * (1 - fadeTo)}) 0%, ${BLUE} 35%, ${BLUE} 60%, rgba(18,150,242,${fadeTo === 1 ? 0.05 : 1}) 100%)`}} />
);

const Glitch: React.FC<{s: number; n: number; fs: number; seed: number; vertical?: boolean}> = ({s, n, fs, seed, vertical}) => {
  const f = Math.floor(s * 30 / 2); // 两帧换一次
  const str = Array.from({length: n}, (_, i) => GLYPHS[Math.floor(hash(seed + i * 13 + f * 7) * GLYPHS.length)]).join('');
  return <div style={{fontFamily: SANS, fontSize: fs, fontWeight: 500, color: '#fff', letterSpacing: '-0.02em', whiteSpace: 'nowrap', lineHeight: 1, writingMode: vertical ? 'vertical-rl' : undefined, textShadow: '0 0 2px rgba(18,150,242,0.6)'}}>{str}</div>;
};

export const ShardSplitWordAmountGroup: React.FC<{inputs?: ShardSplitInputs; extras?: number[]}> = ({inputs: x = SHARD_SPLIT_DEFAULT_INPUTS, extras = [0]}) => {
  const tt = useCurrentFrame() / FPS;
  const s = toSource(tt, SHARD_SPLIT_CONTRACT, extras) + S0;
  const els: React.ReactNode[] = [];
  // 1) 沙漏色带
  if (s < 0.27) {
    const top = lin(s, [[0, 1633], [0.033, 1010], [0.067, 709], [0.1, 595], [0.133, 531], [0.167, 358], [0.2, 335], [0.27, 320]]);
    const waist = top * lin(s, [[0, 0.74], [0.15, 0.71], [0.2, 1]]);
    const a = (960 - top / 2), b = (960 - waist / 2), c = 960 + waist / 2, d = 960 + top / 2;
    const fade = clamp(s / 0.1);
    els.push(<div key="band" style={{position: 'absolute', inset: 0, clipPath: `polygon(${a}px 0, ${d}px 0, ${c}px 540px, ${d}px 1080px, ${a}px 1080px, ${b}px 540px)`, background: `linear-gradient(180deg, rgba(18,150,242,${1 - 0.75 * fade}) 0%, ${BLUE} ${12 + 18 * fade}%, ${BLUE} ${62 - 10 * fade}%, rgba(18,150,242,${1 - 0.6 * fade}) 100%)`, transform: s > 0.14 && s < 0.2 ? 'none' : undefined}} />);
    if (s > 0.14 && s < 0.2) els.push(<div key="cut" style={{position: 'absolute', left: 960 - top / 2 + 30, top: 0, width: top, height: 118, background: 'linear-gradient(180deg, #4fb0f5, #2c9ff3)'}} />);
    if (s > 0.18) els.push(<div key="slit" style={{position: 'absolute', left: 960 - 200, top: 535, width: 400, height: 6, borderRadius: 3, background: 'linear-gradient(90deg, rgba(255,255,255,0), #fff 30%, #fff 70%, rgba(255,255,255,0))', opacity: 1 - clamp((s - 0.24) / 0.03)}} />);
  }
  // 2) 碎成色片 + 放大
  const fsz = lin(s, [[0.1, 184], [0.2, 184], [0.3, 150], [0.4, 100], [0.55, 128], [0.8, 157], [0.95, 250], [1.1, 375], [1.2, 390], [1.3, 400]]);
  const Z = s < 0.55 ? 1 : fsz / 128;
  if (s >= 0.2 && s < 1.2) {
    const k = clamp((s - 0.22) / 0.33); // 从竖着转成斜的
    const cy = 545;
    const sl = (dx: number, dy: number, L: number, W: number, ang: number, f = 1, o = 1, key = '') => <Slab key={key} cx={960 + dx * Z} cy={cy + dy * Z} L={L * Z} W={W * Z} ang={ang} fadeTo={f} o={o} />;
    // A：/ 往右上淡；B：和 A 平行的 /，往左下淡；F：陡的一块往下淡；C：细的 \；D：右边横楔
    els.push(sl(lin(s, [[0.2, 0], [0.4, 60], [0.55, 50]]), lin(s, [[0.2, -260], [0.4, -150], [0.55, -110]]), lin(s, [[0.2, 560], [0.55, 600]]), lin(s, [[0.2, 335], [0.3, 200], [0.55, 150]]), lin(s, [[0.2, -90], [0.3, -80], [0.4, -50], [0.55, -42], [0.8, -40]]), 1, 1, 'A'));
    els.push(sl(lin(s, [[0.2, 0], [0.3, -100], [0.4, -210], [0.55, -230]]), lin(s, [[0.2, 260], [0.4, 170], [0.55, 150]]), lin(s, [[0.2, 560], [0.55, 600]]), lin(s, [[0.2, 335], [0.3, 180], [0.55, 135]]), lin(s, [[0.2, 90], [0.3, 100], [0.4, 125], [0.55, 134], [0.8, 138]]), 1, 1, 'B'));
    if (s > 0.4) els.push(sl(lin(s, [[0.4, 20], [0.55, -10]]), lin(s, [[0.4, 60], [0.55, 110]]), lin(s, [[0.4, 250], [0.55, 440]]), 110, lin(s, [[0.4, 95], [0.55, 102], [0.8, 98]]), 1, clamp((s - 0.4) / 0.06), 'F'));
    if (s > 0.5) els.push(sl(lin(s, [[0.5, 0], [0.65, 20]]), lin(s, [[0.5, 0], [0.65, 30]]), lin(s, [[0.5, 120], [0.65, 320]]), 34, lin(s, [[0.5, 30], [0.8, 38]]), 1, clamp((s - 0.5) / 0.08), 'C'));
    if (s > 0.62) els.push(sl(lin(s, [[0.62, 140], [0.8, 230]]), lin(s, [[0.62, -20], [0.8, -40]]), lin(s, [[0.62, 120], [0.8, 420]]), 100, -10, 1, clamp((s - 0.62) / 0.1), 'D'));
  }
  // 3) 整屏蓝（带白三角），往中间一阶一阶收
  if (s >= 1.13) {
    const L = lin(s, [[1.13, -100], [1.5, 52], [1.6, 80], [1.75, 488], [1.85, 400], [1.9, 341], [1.95, 276], [2.0, 200]]);
    const R = lin(s, [[1.13, 2020], [1.5, 1920], [1.6, 1920], [1.75, 1516], [1.85, 1086], [1.9, 888], [1.95, 702], [2.0, 450]]);
    const stepL = s > 1.6 ? Math.round(L / 40) * 40 : L, stepR = s > 1.6 ? Math.round(R / 40) * 40 : R; // 一阶一阶收
    const o = clamp((s - 1.13) / 0.06);
    els.push(<div key="sheet" style={{position: 'absolute', left: stepL, top: 0, width: Math.max(0, stepR - stepL), height: 1080, overflow: 'hidden', opacity: o}}>
      <div style={{position: 'absolute', left: -stepL, top: 0, width: 1920, height: 1080, clipPath: 'polygon(0 0, 0 0, 760px 220px, 1100px 0, 1920px 0, 1920px 1080px, 1300px 1080px, 1120px 850px, 940px 1080px, 0 1080px)', background: `linear-gradient(115deg, ${BLUE} 0%, ${BLUE} 55%, #4db0f6 80%, #9ad2fb 100%)`}} />
      {s < 1.55 && <div style={{position: 'absolute', left: -stepL, top: 0, width: 1920, height: 1080, background: 'linear-gradient(200deg, rgba(255,255,255,0.0) 40%, rgba(255,255,255,0.25) 70%, rgba(255,255,255,0) 90%)'}} />}
      {/* 白字：逐词出，只在蓝上看得见 */}
      {s > 1.19 && <div style={{position: 'absolute', left: 960 - stepL, top: 533, transform: 'translate(-50%,-50%)', fontFamily: SANS, fontSize: 76, fontWeight: 600, color: '#fff', whiteSpace: 'nowrap'}}>{Array.from(x.line).slice(0, Math.ceil(clamp((s - 1.19) / 0.15) * Array.from(x.line).length)).join('')}</div>}
      {/* 乱码字框 */}
      {s > 1.17 && <div style={{position: 'absolute', left: lin(s, [[1.17, 1469], [1.3, 1255], [1.5, 1151], [1.75, 1125]]) - stepL, top: 676, width: 900, height: 130, background: 'linear-gradient(90deg, rgba(255,255,255,0.92), rgba(255,255,255,0.55) 50%, rgba(255,255,255,0.25))', display: 'flex', alignItems: 'center', paddingLeft: 12, overflow: 'hidden'}}><Glitch s={s} n={12} fs={110} seed={3} /></div>}
      {s > 1.25 && <div style={{position: 'absolute', left: 233 - stepL + (s > 1.7 ? lin(s, [[1.7, 0], [1.9, 107], [2.0, 50]]) : 0), top: 0, width: 296 - (s > 1.85 ? 160 : 0), height: lin(s, [[1.25, 120], [1.3, 264], [1.5, 432], [1.85, 471]]), background: 'linear-gradient(180deg, rgba(255,255,255,0.85), rgba(255,255,255,0.35))', overflow: 'hidden', display: 'flex', justifyContent: 'center'}}><Glitch s={s + 0.3} n={6} fs={130} seed={11} vertical /></div>}
      {s > 1.45 && s < 1.6 && [[640, 810], [1110, 860], [1660, 790]].map(([px, py], i) => <div key={i} style={{position: 'absolute', left: px - stepL, top: py, width: 52, height: 52, background: '#fff'}} />)}
    </div>);
  }
  // 4) 两半个词 → 合成 → 劈开飞走
  if (s >= 0.08 && s < 1.36) {
    const half = s < 1.17 ? lin(s, [[0.08, 860], [0.1, 775], [0.15, 610], [0.2, 503], [0.3, 132], [0.4, 77], [0.5, 15], [0.55, 0]]) : lin(s, [[1.17, 0], [1.2, 120], [1.27, 560], [1.33, 1250]]);
    const col = mixHex('#1a7fd6', NAVY, (s - 0.25) / 0.25);
    const T: React.CSSProperties = {position: 'absolute', top: 545, fontFamily: SANS, fontSize: fsz * 1.3, fontWeight: 600, color: col, lineHeight: 1, whiteSpace: 'nowrap'};
    els.push(<div key="wa" style={{...T, right: 1920 - (960 - half), transform: 'translateY(-50%)'}}>{x.a}</div>);
    els.push(<div key="wb" style={{...T, left: 960 + half, transform: 'translateY(-50%)'}}>{x.b}</div>);
  }
  // 5) 超大金额从右边甩进来
  if (s >= 1.83) {
    const lx = lin(s, [[1.83, 1940], [1.85, 1825], [1.9, 1583], [1.95, 730], [2.0, 330]]);
    els.push(<div key="amt" style={{position: 'absolute', left: lx, top: 560, transform: 'translateY(-50%)', fontFamily: SANS, fontSize: 760, fontWeight: 500, color: BLUE, lineHeight: 1, letterSpacing: '-0.04em', whiteSpace: 'nowrap'}}>{x.amount}</div>);
  }
  return (
    <AbsoluteFill style={{background: '#fff', overflow: 'hidden'}}>
      {els}
      <div style={{position: 'absolute', right: 36, bottom: 26, fontFamily: SANS, fontSize: 20, color: 'rgba(30,60,100,0.4)', letterSpacing: '0.06em'}}>{x.note}</div>
    </AbsoluteFill>
  );
};

if (checkContract(SHARD_SPLIT_CONTRACT).length) throw new Error(checkContract(SHARD_SPLIT_CONTRACT).join('；'));
export const ShardSplitWordAmount: React.FC = () => <ShardSplitWordAmountGroup />;
