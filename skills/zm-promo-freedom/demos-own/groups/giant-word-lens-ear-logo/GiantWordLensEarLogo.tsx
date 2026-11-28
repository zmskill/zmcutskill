// 【镜头组】giant-word-lens-ear-logo：超大字横着滑过，中间一个线描圆像透镜（圆里看不到字）、两边挤出椭圆 → 圆里出一句小字 → 收成一圈圈同心圆 →
//   蓝色大字两行打出来、往上让 → 网址出现，中间一个点阵耳朵画出来、描边、化开变成产品标志，停住（041-F 一拍，收尾）
// 学的动作（SkaleSolutions · ListenLabs 46.43–57.7s，30fps 逐帧量过）：
//   46.43 左边几张视频通话人像飘走，超大字（≈720px 高）往左滑；46.8 中间线描圆 d≈480（圆里挡住字）→ 47.3–47.8 圆两边挤出 2 个椭圆、跟着字一起抖
//   48.3 圆 d660、里面三行小字（36px），椭圆淡掉 → 49.3 圆缩到 d540 → 49.8 收成 7 圈同心圆（r 50–300）→ 50.3 缩小
//   50.3–51.05 蓝字两行（130px）逐字打出 → 51.8 往上移，下面出网址（20px）→ 52.3 点阵耳朵（d≈200）画出 → 52.8 描边耳朵 → 53.8 化成几团 → 54.3 变成标志（d≈220），上下各一行网址，停到 57.7
// 我们的内容：大字「突破」，圆里「突破，可能来自任何地方」，蓝字「前提是，／你在认真听」，网址用示例域名 tingjian.example，标志是虚构「听见」的；右下角标"虚构 · 仅作演示"。
import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {GroupContract, checkContract, outputDuration, planExtras, toSource} from '../../../assets/lib/helpers/groupClock';
import {BLUE, CREAM, EarMark, SANS, clamp, eio, eo, kf} from '../circle-morph-listen/CircleMorphListen';
import {EAR_HT} from './earHalftone';

const FPS = 30;
const S0 = 46.43;
export const GIANT_WORD_LENS_CONTRACT: GroupContract = {
  sourceDuration: 338 / 30,
  fps: 30,
  motion: [[0, 2.95], [3.05, 8.0], [8.1, 338 / 30]],
  holds: [{at: 3.0, maxExtra: 1.5}, {at: 8.05, maxExtra: 2}],
  landmarks: {scroll: 0, lens: 0.4, text: 1.9, rings: 3.1, blue: 3.9, url: 4.9, ear: 5.9, logo: 7.4},
  sfx: [
    {at: 'scroll', type: '运镜', note: '横滑 whoosh', volume: 0.45},
    {at: 'lens', type: '弹出', note: '弹性 boing', volume: 0.35},
    {at: 'rings', type: '吸入', note: '收拢 whoom', volume: 0.35},
    {at: 'blue', type: '键盘', note: '打字', tail: 0.5, volume: 0.3},
    {at: 'logo', type: '提示音', note: '落版 chime', volume: 0.45},
  ],
  inputs: {},
};
export const planLens = (sec: number) => planExtras(GIANT_WORD_LENS_CONTRACT, sec);
export const lensFrames = (extras: number[]) => Math.round(outputDuration(GIANT_WORD_LENS_CONTRACT, extras) * FPS);
export const GIANT_WORD_LENS_DURATION = 338;

const Ear: React.FC<{size: number; dotted?: number}> = ({size, dotted = 0}) => (
  <svg width={size} height={size} viewBox="0 0 24 24"><path d="M8 9a5 5 0 0 1 10 0c0 3-2.5 4-3.5 6S13 20 10.5 20 7 18 7 16" fill="none" stroke={BLUE} strokeWidth={1.6} strokeLinecap="round" strokeDasharray={dotted ? `0.6 ${1.2 * dotted}` : undefined} /><path d="M11 10a2 2 0 0 1 4 0c0 1.5-1.5 2-1.5 3" fill="none" stroke={BLUE} strokeWidth={1.4} strokeLinecap="round" strokeDasharray={dotted ? `0.6 ${1.2 * dotted}` : undefined} /></svg>
);

// 写实线描耳朵（100×150 单位）：外耳轮、对耳轮 + 分叉、耳甲、耳屏、耳垂内线；每段三次贝塞尔
const EAR_SEGS: number[][][] = [
  [[30, 45], [28, 18], [52, 4], [70, 12]], [[70, 12], [88, 21], [90, 50], [78, 66]], [[78, 66], [70, 77], [68, 88], [64, 104]], [[64, 104], [60, 120], [52, 138], [40, 136]], [[40, 136], [31, 134], [29, 124], [34, 117]],
  [[42, 44], [46, 30], [64, 26], [70, 40]], [[70, 40], [75, 52], [66, 64], [58, 76]], [[58, 76], [54, 82], [52, 90], [54, 98]],
  [[56, 33], [58, 41], [62, 47], [66, 51]],
  [[40, 62], [38, 74], [48, 84], [56, 78]], [[56, 78], [60, 74], [56, 66], [50, 68]],
  [[30, 70], [26, 78], [30, 88], [38, 88]],
  [[46, 104], [51, 109], [51, 116], [45, 121]],
];
const EAR_D = [[0, 5], [5, 8], [8, 9], [9, 11], [11, 12], [12, 13]].map(([a, b]) => `M${EAR_SEGS[a][0].join(' ')} ` + EAR_SEGS.slice(a, b).map((q) => `C${q[1].join(' ')} ${q[2].join(' ')} ${q[3].join(' ')}`).join(' '));
// 2026-11-21 orig ear: outer rim is a double line, the concha is a filled halftone patch
const EAR_D2 = 'M' + EAR_SEGS[0][0].map((v, c) => (c ? 75 + (v - 75) * 0.92 : 50 + (v - 50) * 0.86)).join(' ') + ' ' + EAR_SEGS.slice(0, 4).map((q) => 'C' + q.slice(1).map((pt) => [50 + (pt[0] - 50) * 0.86, 75 + (pt[1] - 75) * 0.92].join(' ')).join(' ')).join(' ');
const CONCHA = 'M38 62 C35 78 45 90 57 85 C66 79 65 61 54 56 C47 53 40 56 38 62 Z';
const EAR_LINE: number[][] = EAR_SEGS.flatMap((q) => { const L = Math.hypot(q[3][0] - q[0][0], q[3][1] - q[0][1]) + 1; const n = Math.max(3, Math.round(L / 1.7)); return Array.from({length: n}, (_, i) => { const t = i / n, u = 1 - t; return [0, 1].map((c) => u * u * u * q[0][c] + 3 * u * u * t * q[1][c] + 3 * u * t * t * q[2][c] + t * t * t * q[3][c]); }); });
const EAR_PTS: number[][] = [...EAR_LINE, ...Array.from({length: 80}, (_, n) => [37 + (n % 8) * 3.4, 55 + Math.floor(n / 8) * 3.4]).filter(([x, y]) => ((x - 51) / 13) ** 2 + ((y - 71) / 15) ** 2 < 1)]; // + filled concha
// 2026-11-21 orig ear is a HALFTONE picture whose dot grid changes resolution: 52.2 a few huge fused blobs -> finer and finer (52.8-53.0 finest) -> coarser again (53.6) -> blobs fly into the logo. That resolution sweep is the "little animation"; ours was a static line drawing.
const EAR_BOX = {x: 935 - EAR_HT.w / 2, y: 520 - EAR_HT.h / 2};
const earLevel = (s: number) => { const K: [number, number][] = [[52.18, 40], [52.26, 30], [52.33, 22], [52.41, 16], [52.49, 11], [52.6, 9], [52.68, 7], [52.78, 5], [53.06, 7], [53.14, 9], [53.22, 9], [53.29, 11], [53.38, 16], [53.47, 22], [53.56, 30]]; let g = 40; for (const [t, v] of K) if (s >= t) g = v; return g; };
const HalfEar: React.FC<{g: number; scale?: number; id: string}> = ({g, scale = 1, id}) => {
  const dots = EAR_HT.levels[String(g)];
  const goo = g >= 30;
  return <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
    {goo && <defs><filter id={id} x={0} y={0} width={1920} height={1080} filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB"><feGaussianBlur stdDeviation={g * 0.14} /><feColorMatrix type="matrix" values="0 0 0 0 0.04  0 0 0 0 0.12  0 0 0 0 0.77  0 0 0 26 -11" /></filter></defs>}
    <g filter={goo ? `url(#${id})` : undefined}>{dots.map(([x, y, r], i) => <circle key={i} cx={EAR_BOX.x + x} cy={EAR_BOX.y + y} r={r * scale} fill={goo ? '#fff' : BLUE} />)}</g>
  </svg>;
};
const hashE = (x: number) => { const v = Math.sin(x * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };
// 标志两块形状里的落点（EarMark 320px、中心 960,540：左边 D 形 x840–947 y460–660，右上方块 x973–1080 y420–527）
const LOGO_PTS: number[][] = [...Array.from({length: 24}, (_, i) => [810 + (i % 4) * 34, 450 + Math.floor(i / 4) * 38]), ...Array.from({length: 16}, (_, i) => [987 + (i % 4) * 33, 400 + Math.floor(i / 4) * 33])]; // EarMark 400px centred (960,540): D x810-943 y440-690, square x977-1110 y390-523

export const GiantWordLensGroup: React.FC<{extras?: number[]}> = ({extras = [0, 0]}) => {
  const tt = useCurrentFrame() / FPS;
  const s = toSource(tt, GIANT_WORD_LENS_CONTRACT, extras) + S0;
  const held = tt - (s - S0);
  const els: React.ReactNode[] = [];
  const word = '突破突破';
  if (s < 49.52) {
    // 2026-11-19 第二次逐帧（46.43–49.65）：
    //   · 开头没有视频通话人像（之前多画了）；透镜圆一开始就在（46.43 d≈210），46.7 起很快长大（46.8 405 → 47.2 596 → 48.3 720），49.3 缩回 648、49.5 373
    //   · 47.25 起圆其实是一个"竖轴转鼓"上的 4 张圆片：鼓往左转（跟大字同向）、47.7 转了 180°、48.0 冲过头到 225°，再弹回来 49.0 停在 180°（弹簧）；
    //     侧面的圆片看起来是椭圆（宽 = d·cos），转到边上就是一条细线——之前我们画的是两边固定的细椭圆，没有"转"的感觉
    //   · 小字写在下一张圆片上，47.8 起跟着那张片一起转到正面（被压扁再展开）
    const scroll = kf(s, [[46.43, 0], [46.65, 110], [46.85, 443], [47.05, 639], [47.25, 785], [47.45, 1150], [47.65, 1600], [47.85, 2000], [48.05, 2400], [48.25, 2800], [48.5, 3300]]) + held * 120; // 2026-11-20 camtrack：大字越滑越快（46.6 ≈550px/s → 47.5 后 ≈2000px/s），之前匀速 900
    const textO = 1 - clamp((s - 48.38) / 0.12);
    if (textO > 0) els.push(<div key="g" style={{position: 'absolute', left: 486 - scroll, top: 528, transform: 'translateY(-52%)', fontFamily: SANS, fontSize: 560, fontWeight: 500, color: '#111', whiteSpace: 'nowrap', letterSpacing: '-0.02em', opacity: textO}}>{word}</div>);
    const d = kf(s, [[46.43, 210], [46.5, 233], [46.6, 248], [46.7, 324], [46.8, 405], [46.9, 470], [47.0, 525], [47.2, 596], [47.35, 625], [47.5, 648], [47.7, 687], [48.0, 700], [48.3, 718], [49.0, 728], [49.3, 648], [49.5, 373], [49.62, 330]]);
    const th = kf(s, [[47.22, 0], [47.35, -53], [47.5, -128], [47.7, -180], [48.0, -225], [48.3, -200], [48.6, -186], [49.0, -180], [49.62, -180]]);
    const cx = 950, cy = 528;
    const discs = [0, 1, 2, 3].map((k) => { const ph = ((th + 90 * k) * Math.PI) / 180; return {k, x: Math.sin(ph) * d / 2, c: Math.cos(ph)}; }).filter((q) => q.c > 0.015).sort((a, b) => a.c - b.c);
    discs.forEach((q) => {
      const w = d * q.c;
      const txt = q.k === 2 ? clamp((s - 47.8) / 0.25) * (1 - clamp((s - 49.24) / 0.1)) : 0; // 2026-11-21 orig: text gone by 49.4 // 第 2 张：转到正面的那张（th = −180）
      els.push(<div key={`d${q.k}`} style={{position: 'absolute', left: cx + q.x - w / 2, top: cy - d / 2, width: w, height: d, borderRadius: '50%', background: CREAM, boxShadow: `0 0 0 ${q.c < 0.2 ? 1.2 : 1.6}px #8a8780`, overflow: 'hidden'}}>
        {txt > 0 && <div style={{position: 'absolute', left: '50%', top: '50%', width: d, transform: `translate(-50%, -50%) scaleX(${q.c})`, textAlign: 'center', fontFamily: SANS, fontSize: 46, lineHeight: 1.25, color: '#111', opacity: txt}}>突破，<br />可能来自<br />任何地方</div>}
      </div>);
    });
  } else if (s < 50.33) {
    // 2026-11-18 原片同心圆缩得慢：49.75 外圈 r≈365 → 50.17 235 → 50.34 195，50.45 才没（之前 50.3 就没了，缩得也太快）
    const R0 = kf(s, [[49.52, 200], [49.55, 325], [49.75, 365], [50.0, 325], [50.17, 235], [50.3, 195], [50.33, 188]]); // 2026-11-21 orig: lens shrinks to ~370 at 49.5, then the outer ring jumps out to r325 and rings pop from the center outward (49.55 only outer + innermost; 49.7 all 7)
    Array.from({length: 7}, (_, i) => { const ap = i === 0 ? 1 : eo(clamp((s - 49.53 - (6 - i) * 0.024) / 0.06)); if (ap <= 0) return; const r = R0 * (1 - i * 0.14) * (0.85 + 0.15 * ap); els.push(<div key={i} style={{position: 'absolute', left: 960 - r, top: 540 - r, width: r * 2, height: r * 2, borderRadius: '50%', boxShadow: '0 0 0 1.4px #6a655e'}} />); });
  } else if (s < 52.2) {
    const L1 = '前提是，', L2 = '你在认真听';
    const n = Math.floor(clamp((s - 50.33) / 0.62) * (L1.length + L2.length) + 0.001);
    const del = Math.floor(clamp((s - 51.8) / 0.2) * (L1.length + L2.length - 2) + 0.001); // 原片 51.8 起字从头往后删，只剩最后两个字再换成耳朵
    const up = kf(s, [[51.6, 0], [51.9, -40]]);
    const tot = L1.length + L2.length;
    const ch = (c: string, gi: number) => { const k = clamp((s - 50.33) / 0.62 * tot - gi); const gone = gi < del; return gone ? null : <span key={gi} style={{display: 'inline-block', opacity: k, filter: k < 1 ? `blur(${(1 - k) * 8}px)` : undefined, transform: `translateY(${(1 - k) * 18}px)`}}>{c}</span>; }; // 2026-11-20 光流：每个字整块蹦出来一帧跳很大，改成每个字 ≈1/ (速度) 秒里由糊变清、略往上浮
    const toDots = clamp((s - 52.04) / 0.08); // 2026-11-21 orig: 52.1 the last word collapses into a few fat dots, which become the pixel ear
    els.push(<div key="b" style={{opacity: 1 - toDots, position: 'absolute', left: 0, right: 0, top: 540 + up, transform: 'translateY(-55%)', textAlign: 'center', fontFamily: SANS, fontSize: 130, fontWeight: 500, color: BLUE, lineHeight: 1.15}}><div style={{minHeight: '1.15em'}}>{Array.from(L1).map((c, i) => ch(c, i))}</div><div>{Array.from(L2).map((c, i) => ch(c, i + L1.length))}</div></div>);
    if (s > 51.3) els.push(<div key="u" style={{position: 'absolute', left: 0, right: 0, top: 820, textAlign: 'center', fontFamily: SANS, fontSize: 22, color: BLUE, opacity: clamp((s - 51.3) / 0.15)}}>tingjian.example</div>);
    if (toDots > 0) els.push(<div key="td" style={{position: 'absolute', inset: 0}}><HalfEar g={40} scale={eo(toDots)} id="htd" /></div>);
  } else {

    // 2026-11-19 第二次逐帧（52.2–57.7）：原片的耳朵是一只写实的线描耳朵（外耳轮、对耳轮分叉、耳甲、耳屏、耳垂），不是一个问号形：
    //   52.2 先是一粒粒像素点闪着冒出来 → 52.5 变成实线 → 53.4 又碎回像素点 → 53.65 点变成一团团软球、往标志的两块形状挤、粘在一起（水滴融合）→ 54.05 成形；
    //   之后整个画面一直慢慢往里推（标志 54.3 → 56.5 放大到 1.26 倍、先快后慢），上下两行网址跟着往外散开——之前我们成形后是静止的
    const Z = kf(s, [[54.05, 0.97], [54.3, 1], [54.6, 1.098], [55.0, 1.162], [55.5, 1.213], [56.0, 1.243], [56.5, 1.26], [57.0, 1.264], [57.8, 1.266]]);
    const sub: React.ReactNode[] = [];
    const k = 2.35, kx = 2.75, ox = 960 - 50 * kx, oy = 562 - 75 * k; // 耳朵：100×150 单位；2026-11-21 orig ear ≈200×305, centre y≈562, and it is a LEFT ear (outer rim on the left) - ours was mirrored
    const P = EAR_PTS.map(([x, y]) => [ox + (100 - x) * kx, oy + y * k]);
    const pix = s < 52.5 ? 1 : s < 53.4 ? 0 : 1;
    if (s < 53.62) sub.push(<div key="ht" style={{position: 'absolute', inset: 0}}><HalfEar g={earLevel(s)} id="hte" /></div>);
    // 软球：53.62 起每粒点长成小球、往标志的两块形状里挤，用"模糊 + 阈值"让相邻的球粘起来
    const blob = clamp((s - 53.6) / 0.38), logo = eo(clamp((s - 53.96) / 0.12));
    if (blob > 0 && logo < 1) {
      const T = LOGO_PTS;
      sub.push(<svg key="blobs" width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, opacity: 1 - logo}}>
        <defs><filter id="earGoo" x={0} y={0} width={1920} height={1080} filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB"><feGaussianBlur stdDeviation={5} /><feColorMatrix type="matrix" values="0 0 0 0 0.05  0 0 0 0 0.12  0 0 0 0 0.8  0 0 0 30 -13" /></filter></defs>
        <g filter="url(#earGoo)">{EAR_HT.levels['30'].map(([x0, y0], j) => { const x = EAR_BOX.x + x0, y = EAR_BOX.y + y0; const [tx0, ty0] = T[j % T.length]; const tx = tx0 + (hashE(j * 7.1) - 0.5) * 22, ty = ty0 + (hashE(j * 3.7) - 0.5) * 22; const u = eio(clamp((blob - 0.25 - hashE(j * 2.3) * 0.2) / 0.5)); /* orig: 53.7 dots swell in place on the ear line, 53.85 gathered into two separate blobs */ return <circle key={j} cx={x + (tx - x) * u} cy={y + (ty - y) * u} r={11 + 3 * clamp(blob * 2.5) + 5 * clamp((blob - 0.5) * 2)} fill="#fff" />; })}</g>
      </svg>);
    }
    if (logo > 0) sub.push(<div key="l" style={{position: 'absolute', left: 960 - 200, top: 540 - 200, opacity: logo}}><EarMark size={400} color={BLUE} /></div>);
    sub.push(<div key="u1" style={{position: 'absolute', left: 0, right: 0, top: 820 + 50 * eio(clamp((s - 54.05) / 0.2)), textAlign: 'center', fontFamily: SANS, fontSize: 22, color: BLUE}}>tingjian.example</div>);
    if (s > 54.2) sub.push(<div key="u2" style={{position: 'absolute', left: 0, right: 0, top: 200, textAlign: 'center', fontFamily: SANS, fontSize: 22, color: BLUE, opacity: clamp((s - 54.2) / 0.2)}}>tingjian.example</div>);
    els.push(<div key="zoom" style={{position: 'absolute', inset: 0, transform: `scale(${s > 54.05 ? Z : 1})`, transformOrigin: '960px 540px'}}>{sub}</div>);
  }
  return (
    <AbsoluteFill style={{background: CREAM, overflow: 'hidden'}}>
      {els}
      <div style={{position: 'absolute', right: 36, bottom: 26, fontFamily: SANS, fontSize: 20, color: 'rgba(60,50,40,0.45)', letterSpacing: '0.06em'}}>虚构 · 仅作演示</div>
    </AbsoluteFill>
  );
};

if (checkContract(GIANT_WORD_LENS_CONTRACT).length) throw new Error(checkContract(GIANT_WORD_LENS_CONTRACT).join('；'));
export const GiantWordLensEarLogo: React.FC = () => <GiantWordLensGroup />;
