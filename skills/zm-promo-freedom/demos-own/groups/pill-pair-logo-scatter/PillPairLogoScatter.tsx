// 【镜头组】pill-pair-logo-scatter：黑胶囊从右边滑进来逐字亮出第一个词，渐变胶囊跟进来亮出第二个词；
//   两颗胶囊往两边甩出画，中间长出标志；名字从标志后面往右抽出来，四周一张张界面截图弹进来又飞走；
//   最后标志和名字缩小让位，一颗小圆点长成渐变胶囊按钮（022-E 一拍，收尾落版）
// 学的动作（Magic Patterns · Screens 38.40–43.40s，60fps 逐帧看过；时间表 （内部拆片记录，未随项目提供））：
//   浅灰底；黑胶囊从右边高速滑进来、长尾巴减速，滑的过程中字一个个从灰变白；渐变胶囊从右边跟进来，字一个个从浅变黑；
//   停一下；两颗胶囊加速往左右两边甩出画，同时中间的标志从一个点弹大；标志往左挪，名字从标志后面往右抽出来；
//   四周 8 张界面截图错开弹进来、停一下、飞回画外；标志 + 名字整体缩到 0.53、往左让位，右边一颗小圆点弹大，再横着撑成胶囊，字从右边滚进来。
// 我们的内容：待办 App「小周」。胶囊"现在" / "就能用"；标志是「小周」的"勾 + 点"（和 023-I、023-F 同一个）；按钮"免费试用"。
//
// 拍表（源秒，30fps）
//   拍 1 两颗胶囊     0.07–0.90   黑胶囊 0.07–0.60（字 0.27 起）、渐变胶囊 0.43–1.10（字 0.62 起）（停留点 1.20：看两个词）
//   拍 2 甩开出标志   1.45–2.10   胶囊往两边甩 1.45–2.05、标志 1.82–2.10 弹大
//   拍 3 名字+截图    2.15–3.30   名字 2.20–2.90 抽出、截图 2.15–3.30 错开
//   拍 4 缩小+按钮    3.40–4.40   缩 3.40–3.75、圆点 3.62–3.90、撑开 3.90–4.20、字 3.95–4.35（停留点 4.70：品牌落版）
// 毛病清单：
//   - 通用：画面永远不停（停留时慢推）；动作叠着走；--hq 渲染；确定性
//   - 独有 1：胶囊滑的同时字在亮，不是滑停了再出字
//   - 独有 2：名字是从标志后面抽出来的（被标志挡着），不是淡入
//   - 独有 3：按钮先是一颗圆点，再横着撑开，字从右边滚进来
import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {FONT, Grain, mix} from '../../../assets/lib/helpers/polish';
import {GroupContract, checkContract, checkInputs, outputDuration, planExtras, toSource} from '../../../assets/lib/helpers/groupClock';

const FPS = 30;
const SANS = `"PingFang SC", "Noto Sans CJK SC", "Noto Sans SC", ${FONT.sans}`;
const INK = '#08191a';
const BG = '#f0f0f2';
const GRAD = 'linear-gradient(90deg, #cfa6e6 0%, #a3c6f2 38%, #8fd0d9 62%, #8be08a 100%)';

const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const eo = (t: number, a: number, b: number) => { const c = clamp((t - a) / (b - a)); return 1 - Math.pow(1 - c, 3); };
const ei = (t: number, a: number, b: number) => { const c = clamp((t - a) / (b - a)); return c * c * c; };
const eob = (t: number, a: number, b: number) => { const c = clamp((t - a) / (b - a)); const k = 1.6; return 1 + (k + 1) * Math.pow(c - 1, 3) + k * Math.pow(c - 1, 2); };
type P = [number, number][];
const trk = (t: number, pts: P) => {
  const n = pts.length;
  if (t <= pts[0][0]) return pts[0][1];
  if (t >= pts[n - 1][0]) return pts[n - 1][1];
  const d: number[] = [];
  for (let k = 0; k < n - 1; k++) d.push((pts[k + 1][1] - pts[k][1]) / (pts[k + 1][0] - pts[k][0]));
  const m: number[] = [d[0]];
  for (let k = 1; k < n - 1; k++) m.push(d[k - 1] * d[k] <= 0 ? 0 : (d[k - 1] + d[k]) / 2);
  m.push(d[n - 2]);
  for (let k = 0; k < n - 1; k++) {
    if (d[k] === 0) { m[k] = 0; m[k + 1] = 0; continue; }
    const a = m[k] / d[k], b = m[k + 1] / d[k], s = a * a + b * b;
    if (s > 9) { const tau = 3 / Math.sqrt(s); m[k] = tau * a * d[k]; m[k + 1] = tau * b * d[k]; }
  }
  let i = 0;
  while (t > pts[i + 1][0]) i++;
  const [x0, y0] = pts[i], [x1, y1] = pts[i + 1];
  const h = x1 - x0, u = (t - x0) / h, u2 = u * u, u3 = u2 * u;
  return (2 * u3 - 3 * u2 + 1) * y0 + (u3 - 2 * u2 + u) * h * m[i] + (-2 * u3 + 3 * u2) * y1 + (u3 - u2) * h * m[i + 1];
};
const cw = (c: string) => (/[\x00-\x7f]/.test(c) ? 0.58 : 1.0);
const textW = (s: string, f: number) => Array.from(s).reduce((a, c) => a + cw(c), 0) * f;

// ═════════ 合同 ═════════
export const PILL_PAIR_LOGO_SCATTER_CONTRACT: GroupContract = {
  sourceDuration: 5.0,
  fps: 30,
  motion: [[0, 1.0], [1.4, 4.5]],
  holds: [
    {at: 1.2, maxExtra: 1.0}, // 两颗胶囊停住看
    {at: 4.7, maxExtra: 3.0}, // 品牌落版
  ],
  landmarks: {pill1: 0.07, word1: 0.27, pill2: 0.43, word2: 0.62, split: 1.45, logo: 1.82, name: 2.2, thumbs: 2.15, shrink: 3.4, dot: 3.62, cta: 3.9, settle: 4.4, exit: 5.0},
  sfx: [
    {at: 'pill1', type: '短甩', note: '甩入 swish（黑胶囊）', tail: 0.3, volume: 0.3},
    {at: 'word1', type: '轻tick', note: '轻柔 tick 串（逐字）', tail: 0.3, volume: 0.2},
    {at: 'pill2', type: '短甩', note: '甩入 swish（渐变胶囊）', tail: 0.3, volume: 0.3},
    {at: 'split', offset: 0.2, type: '短甩', note: '分开 whoosh', tail: 0.4, volume: 0.35},
    {at: 'logo', type: '弹出', note: '标志弹出 pop', volume: 0.35},
    {at: 'name', type: '短甩', note: '轻滑 swipe（名字抽出）', tail: 0.4, volume: 0.25},
    {at: 'thumbs', type: '短甩', note: '一串轻 whoosh（截图飞过）', tail: 1.0, volume: 0.25},
    {at: 'dot', type: '弹出', note: '轻 pop（圆点）', volume: 0.25},
    {at: 'cta', type: '运镜', note: '柔和展开（按钮撑开）+ 完成音', tail: 0.6, volume: 0.35},
    {at: 'cta', type: '提示音', note: '柔和展开（按钮撑开）+ 完成音', tail: 0.6, volume: 0.35},
  ],
  inputs: {word1: {maxChars: 3}, word2: {maxChars: 3}, brand: {maxChars: 4}, cta: {maxChars: 6}},
};

export type ScatterInputs = {word1: string; word2: string; brand: string; cta: string; brandColor?: string};
export const SCATTER_DEFAULT_INPUTS: ScatterInputs = {word1: '现在', word2: '就能用', brand: '小周', cta: '免费试用'};
export const checkScatterInputs = (x: ScatterInputs) => checkInputs(PILL_PAIR_LOGO_SCATTER_CONTRACT, {word1: x.word1, word2: x.word2, brand: x.brand, cta: x.cta});
export const planScatter = (sec: number) => planExtras(PILL_PAIR_LOGO_SCATTER_CONTRACT, sec);
export const scatterFrames = (extras: number[]) => Math.round(outputDuration(PILL_PAIR_LOGO_SCATTER_CONTRACT, extras) * FPS);
export const PILL_PAIR_LOGO_SCATTER_DURATION = 150;

// ═════════ 标志 ═════════
const Mark: React.FC<{size: number; blue: string}> = ({size, blue}) => (
  <div style={{position: 'relative', width: size, height: size, borderRadius: size * 0.26, background: `linear-gradient(150deg, #6b78ff 0%, ${blue} 50%, #1d2bc0 100%)`, boxShadow: `inset 0 ${size * 0.03}px ${size * 0.04}px rgba(255,255,255,0.4), 0 ${size * 0.1}px ${size * 0.22}px rgba(30,40,170,0.25)`}}>
    <svg viewBox="0 0 100 100" width="100%" height="100%" style={{position: 'absolute', inset: 0, padding: '20%', boxSizing: 'border-box'}}>
      <path d="M26 54 L42 70 L76 34" stroke="#fff" strokeWidth={15} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx={30} cy={28} r={8.5} fill="#fff" />
    </svg>
  </div>
);

// ═════════ 拍 1–2：两颗胶囊 ═════════
const PF = 190, PH = 288, PPAD = 104, PGAP = 48;
// 原片逐帧量的中心位移（相对最终位置）
const P1X: P = [[0.07, 1600], [0.13, 1300], [0.17, 950], [0.2, 590], [0.27, 373], [0.3, 304], [0.37, 202], [0.4, 160], [0.6, 38], [0.9, 7], [1.4, -8]];
const P2X: P = [[0.43, 1250], [0.5, 650], [0.6, 456], [0.75, 310], [1.1, 254], [1.4, 240]];
const SPLIT1: P = [[1.4, 0], [1.6, -42], [1.67, -71], [1.73, -105], [1.8, -169], [1.87, -244], [1.93, -334], [2.0, -560], [2.06, -900]];
const SPLIT2: P = [[1.4, 0], [1.6, 46], [1.67, 81], [1.73, 122], [1.8, 186], [1.87, 284], [1.93, 400], [2.0, 620], [2.06, 980]];
const Pills: React.FC<{s: number; x: ScatterInputs}> = ({s, x}) => {
  if (s < 0.07 || s > 2.1) return null;
  const w1 = textW(x.word1, PF) + PPAD * 2, w2 = textW(x.word2, PF) + PPAD * 1.4 * 2;
  const L = 960 - (w1 + PGAP + w2) / 2;
  const c1 = L + w1 / 2 + trk(s, P1X) * (1 + 0) + trk(s, SPLIT1) - 240 * 0; // 黑胶囊
  const c2 = L + w1 + PGAP + w2 / 2 + trk(s, P2X) - 240 + trk(s, SPLIT2) + 240 * eo(s, 0.43, 1.2) * 0;
  const ch1 = Array.from(x.word1), ch2 = Array.from(x.word2);
  const v1 = Math.abs(trk(s + 1 / 60, P1X) + trk(s + 1 / 60, SPLIT1) - trk(s - 1 / 60, P1X) - trk(s - 1 / 60, SPLIT1)) * 30;
  const v2 = Math.abs(trk(s + 1 / 60, P2X) + trk(s + 1 / 60, SPLIT2) - trk(s - 1 / 60, P2X) - trk(s - 1 / 60, SPLIT2)) * 30;
  const bl = (v: number) => (v / 30 > 120 ? `blur(${Math.min(4, (v / 30 - 120) * 0.02).toFixed(2)}px)` : undefined); // v 是 px/秒；原片滑入几乎不糊，只有最快的两三帧（>120px/帧）
  return (
    <>
      <div style={{position: 'absolute', left: c1 - w1 / 2, top: 540 - PH / 2, width: w1, height: PH, borderRadius: PH / 2, background: INK, display: 'flex', alignItems: 'center', justifyContent: 'center', filter: bl(v1)}}>
        {ch1.map((c, i) => { const k = eo(s, 0.27 + i * 0.08, 0.27 + i * 0.08 + 0.12); return <span key={i} style={{display: 'inline-block', width: cw(c) * PF, textAlign: 'center', fontSize: PF, fontWeight: 600, color: `rgba(255,255,255,${(0.15 + 0.85 * k).toFixed(3)})`, transform: `translateY(${(PF * 0.12 * (1 - k)).toFixed(2)}px)`, lineHeight: 1}}>{c}</span>; })}
      </div>
      {s >= 0.43 && (
        <div style={{position: 'absolute', left: c2 - w2 / 2, top: 540 - PH / 2, width: w2, height: PH, borderRadius: PH / 2, background: GRAD, display: 'flex', alignItems: 'center', justifyContent: 'center', filter: bl(v2)}}>
          {ch2.map((c, i) => { const k = eo(s, 0.62 + i * 0.075, 0.62 + i * 0.075 + 0.12); return <span key={i} style={{display: 'inline-block', width: cw(c) * PF, textAlign: 'center', fontSize: PF, fontWeight: 600, color: INK, opacity: 0.1 + 0.9 * k, transform: `translateY(${(PF * 0.12 * (1 - k)).toFixed(2)}px)`, lineHeight: 1}}>{c}</span>; })}
        </div>
      )}
    </>
  );
};

// ═════════ 拍 2–4：标志 + 名字 + 按钮 ═════════
const LOGO = 250, NF = 170, NGAP = 46;
const LOGO_X: P = [[2.2, 0], [2.3, -15], [2.4, -70], [2.47, -129], [2.53, -262], [2.6, -383], [2.67, -441], [2.73, -475], [2.8, -498], [2.9, -508]];
const Brand: React.FC<{s: number; x: ScatterInputs; blue: string; hd: number}> = ({s, x, blue, hd}) => {
  if (s < 1.82) return null;
  const nw = textW(x.brand, NF);
  const big = LOGO + NGAP + nw; // 大号整体宽
  const reveal = clamp((trk(s, LOGO_X) / -508)); // 0→1 名字抽出进度
  // 大号阶段：标志中心从 960 移到 960 - big/2 + LOGO/2
  const logoCxBig = 960 + (LOGO / 2 - big / 2) * reveal;
  // 缩小 + 按钮
  const sh = eo(s, 3.42, 3.8);
  const k = mix(1, 0.53, sh);
  const ctaF = 76, ctaH = 112, ctaPad = 40;
  const ctaW = textW(x.cta, ctaF) + ctaPad * 2;
  const dotK = eob(s, 3.62, 3.9);
  const widen = eo(s, 3.9, 4.2);
  const ctaCur = s < 3.62 ? 0 : mix(ctaH * dotK, ctaW, widen);
  const small = LOGO * k + NGAP * k + nw * k + 40 + ctaCur;
  const left = mix(960 - big / 2, 960 - small / 2, s < 3.4 ? 0 : clamp(sh * 1.0 + 0 * widen));
  const leftFinal = 960 - (LOGO * 0.53 + NGAP * 0.53 + nw * 0.53 + 40 + ctaW) / 2;
  const groupL = s < 3.4 ? null : s < 3.9 ? left : mix(left, leftFinal, widen);
  const pop = eob(s, 1.82, 2.1);
  const logoSize = LOGO * k * (s < 2.1 ? pop : 1);
  const logoCx = groupL === null ? logoCxBig : groupL + (LOGO * k) / 2;
  const nameL = groupL === null ? logoCx + LOGO / 2 - nw + (NGAP + nw) * reveal : groupL + LOGO * k + NGAP * k; // 名字右沿从标志右沿开始往右抽
  const clipL = logoCx + (LOGO * k) / 2 - 6; // 标志右沿左边的部分被挡住
  const tilt = s < 2.4 ? -8 * (1 - eo(s, 1.82, 2.4)) : 0;
  return (
    <>
      <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, clipPath: `inset(0 0 0 ${clipL.toFixed(1)}px)`}}>
        <div style={{position: 'absolute', left: nameL, top: 540, transform: `translateY(-50%)`, fontSize: NF * k, fontWeight: 700, color: INK, whiteSpace: 'nowrap', lineHeight: 1, letterSpacing: '0.02em'}}>{x.brand}</div>
      </div>
      <div style={{position: 'absolute', left: logoCx - logoSize / 2, top: 540 - logoSize / 2, transform: `rotate(${tilt.toFixed(2)}deg)`}}><Mark size={logoSize} blue={blue} /></div>
      {s >= 3.62 && (
        <div style={{position: 'absolute', left: (groupL ?? 0) + LOGO * k + NGAP * k + nw * k + 40, top: 540 - (ctaH * Math.min(1, dotK)) / 2, width: ctaCur, height: ctaH * Math.min(1, dotK), borderRadius: ctaH, background: GRAD, backgroundSize: '160% 100%', backgroundPosition: `${(50 + 45 * Math.sin(s * 1.3 + hd * 1.3)).toFixed(2)}% 50%`, overflow: 'hidden'}}>
          <div style={{position: 'absolute', left: ctaPad + (1 - eo(s, 3.95, 4.35)) * ctaW * 0.8, top: ctaH / 2, transform: 'translateY(-50%)', fontSize: ctaF, fontWeight: 600, color: INK, whiteSpace: 'nowrap', lineHeight: 1, opacity: clamp((s - 3.95) / 0.12)}}>{x.cta}</div>
        </div>
      )}
    </>
  );
};

// ═════════ 拍 3：四周界面截图 ═════════
type Th = {kind: number; x: number; y: number; w: number; t0: number; dx: number; dy: number};
const THUMBS: Th[] = [
  {kind: 0, x: 1330, y: 70, w: 520, t0: 2.15, dx: 0, dy: -1},
  {kind: 1, x: 300, y: 960, w: 560, t0: 2.28, dx: -1, dy: 0},
  {kind: 2, x: 1700, y: 900, w: 540, t0: 2.4, dx: 1, dy: 0},
  {kind: 3, x: 430, y: 110, w: 480, t0: 2.5, dx: 0, dy: -1},
  {kind: 4, x: 940, y: 1010, w: 460, t0: 2.62, dx: 0, dy: 1},
  {kind: 5, x: 1780, y: 300, w: 500, t0: 2.72, dx: 1, dy: 0},
  {kind: 6, x: 120, y: 330, w: 460, t0: 2.86, dx: -1, dy: 0},
  {kind: 7, x: 1300, y: 1020, w: 520, t0: 3.0, dx: 0, dy: 1},
];
const Thumb: React.FC<{kind: number; w: number; blue: string}> = ({kind, w, blue}) => {
  const h = w * 0.56;
  const dark = kind === 0 || kind === 5;
  const bg = dark ? '#16181d' : kind === 4 ? '#eef5ec' : '#fbf8f1';
  const line = (l: number, t: number, ww: number, c = dark ? 'rgba(255,255,255,0.35)' : 'rgba(20,20,30,0.22)', hh = 5) => <div style={{position: 'absolute', left: l * w, top: t * h, width: ww * w, height: hh, borderRadius: 3, background: c}} />;
  return (
    <div style={{position: 'relative', width: w, height: h, background: bg, borderRadius: 4, overflow: 'hidden', boxShadow: '0 6px 20px rgba(20,22,40,0.10)'}}>
      {line(0.05, 0.07, 0.12, dark ? 'rgba(255,255,255,0.6)' : 'rgba(20,20,30,0.5)')}{line(0.6, 0.07, 0.3)}
      {kind === 0 && (<>
        <div style={{position: 'absolute', left: 0.05 * w, top: 0.18 * h, fontSize: w * 0.1, fontWeight: 800, color: '#6d74ff', letterSpacing: '0.04em'}}>本周进度</div>
        {[0.55, 0.8, 0.4, 0.95, 0.7, 0.6].map((v, i) => <div key={i} style={{position: 'absolute', left: (0.55 + i * 0.07) * w, bottom: 0.12 * h, width: 0.045 * w, height: v * 0.5 * h, borderRadius: 3, background: i === 3 ? '#6d74ff' : 'rgba(255,255,255,0.25)'}} />)}
        {line(0.05, 0.62, 0.38)}{line(0.05, 0.7, 0.3)}{line(0.05, 0.78, 0.34)}
      </>)}
      {kind === 1 && (<>
        {/* 第4轮：原片这张是带真照片的首屏 → 真室内照片（library/photos/interior） */}
        <Img src={staticFile('library/photos/interior/interior04.jpg')} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover'}} />
        <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0) 35%, rgba(0,0,0,0.5))'}} />
        <div style={{position: 'absolute', left: 0.06 * w, bottom: 0.14 * h, fontSize: w * 0.075, fontWeight: 600, color: '#fff', lineHeight: 1.2}}>全家的周末<br />一起安排</div>
        <div style={{position: 'absolute', right: 0.08 * w, bottom: 0.12 * h, width: 0.3 * w, height: 0.45 * h, borderRadius: 8, background: 'rgba(255,255,255,0.85)'}} />
      </>)}
      {kind === 2 && [0, 1, 2, 3].map((r) => (
        <div key={r} style={{position: 'absolute', left: 0.06 * w, top: (0.22 + r * 0.17) * h, width: 0.88 * w, height: 0.12 * h, borderRadius: 6, background: '#fff', border: '1px solid #ece6d8', display: 'flex', alignItems: 'center', gap: 0.02 * w, paddingLeft: 0.02 * w}}>
          <div style={{width: 0.035 * w, height: 0.035 * w, borderRadius: 4, border: `2px solid ${r < 2 ? blue : '#c9c4b8'}`, background: r < 2 ? blue : 'transparent'}} /><div style={{width: (0.3 + 0.1 * (r % 2)) * w, height: 5, borderRadius: 3, background: 'rgba(20,20,30,0.25)'}} />
        </div>
      ))}
      {kind === 3 && Array.from({length: 21}, (_, i) => <div key={i} style={{position: 'absolute', left: (0.06 + (i % 7) * 0.126) * w, top: (0.22 + Math.floor(i / 7) * 0.24) * h, width: 0.11 * w, height: 0.2 * h, borderRadius: 4, background: [3, 9, 16].includes(i) ? '#dfe3ff' : '#f1ece0'}}>{[3, 9, 16].includes(i) && <div style={{margin: 4, height: 5, borderRadius: 3, background: blue}} />}</div>)}
      {kind === 4 && (<>
        <svg width={w} height={h} style={{position: 'absolute', inset: 0}}><path d={`M${0.1 * w} ${0.8 * h} C ${0.35 * w} ${0.3 * h}, ${0.55 * w} ${0.9 * h}, ${0.9 * w} ${0.25 * h}`} stroke={blue} strokeWidth={4} fill="none" strokeDasharray="10 8" /></svg>
        <Img src={staticFile('library/photos/interior/interior00.jpg')} style={{position: 'absolute', left: 0.06 * w, top: 0.18 * h, width: 0.3 * w, height: 0.6 * h, borderRadius: 6, objectFit: 'cover'}} />
      </>)}
      {kind === 5 && (<>
        {[0, 1].map((c) => <div key={c} style={{position: 'absolute', left: (0.05 + c * 0.47) * w, top: 0.22 * h, width: 0.43 * w, height: 0.68 * h, borderRadius: 6, background: 'rgba(255,255,255,0.06)'}} />)}
        {line(0.08, 0.3, 0.2, 'rgba(255,255,255,0.7)')}{line(0.55, 0.3, 0.2, 'rgba(255,255,255,0.7)')}{line(0.08, 0.42, 0.32)}{line(0.55, 0.42, 0.32)}{line(0.08, 0.5, 0.28)}{line(0.55, 0.5, 0.26)}
      </>)}
      {kind === 6 && [0, 1, 2].map((c) => (
        <div key={c} style={{position: 'absolute', left: (0.05 + c * 0.31) * w, top: 0.2 * h, width: 0.28 * w, height: 0.72 * h, borderRadius: 6, background: '#f1ece0'}}>
          {[0, 1, 2 - (c % 2)].map((r) => <div key={r} style={{margin: '8px 7px', height: 0.14 * h, borderRadius: 5, background: '#fff', borderLeft: `3px solid ${['#f59e5b', blue, '#5fae6a'][c]}`}} />)}
        </div>
      ))}
      {kind === 7 && (<>
        {[0, 1, 2].map((i) => <Img key={i} src={staticFile(`library/photos/food/${['food01', 'food09', 'food08'][i]}.jpg`)} style={{position: 'absolute', left: (0.05 + i * 0.31) * w, top: 0.22 * h, width: 0.28 * w, height: 0.42 * h, borderRadius: 6, objectFit: 'cover'}} />)}
        {line(0.05, 0.72, 0.2)}{line(0.36, 0.72, 0.18)}{line(0.67, 0.72, 0.22)}
      </>)}
    </div>
  );
};
const Thumbs: React.FC<{s: number; blue: string}> = ({s, blue}) => (
  <>
    {THUMBS.map((th, i) => {
      if (s < th.t0 || s > th.t0 + 0.95) return null;
      const h = th.w * 0.56;
      const far = 900;
      const inK = 1 - eo(s, th.t0, th.t0 + 0.24);
      const outK = ei(s, th.t0 + 0.62, th.t0 + 0.92);
      const drift = (s - th.t0) * 240; // 停着的时候也一直往外漂（原片截图从没停住过）
      const off = far * (inK + outK) + drift;
      const x = th.x + th.dx * off, y = th.y + th.dy * off;
      const v = far * Math.max(Math.abs(eo(s + 1 / 60, th.t0, th.t0 + 0.24) - eo(s - 1 / 60, th.t0, th.t0 + 0.24)), Math.abs(ei(s + 1 / 60, th.t0 + 0.62, th.t0 + 0.92) - ei(s - 1 / 60, th.t0 + 0.62, th.t0 + 0.92))) * 30;
      const b = v / 30 > 60 ? Math.min(4, (v / 30 - 60) * 0.03) : 0; // v 是 px/秒
      return <div key={i} style={{position: 'absolute', left: x - th.w / 2, top: y - h / 2, filter: b > 0.3 ? `blur(${b.toFixed(2)}px)` : undefined}}><Thumb kind={th.kind} w={th.w} blue={blue} /></div>;
    })}
  </>
);

// ═════════ 整组 ═════════
export type ScatterProps = {inputs?: ScatterInputs; extras?: number[]};
export const PillPairLogoScatterGroup: React.FC<ScatterProps> = ({inputs = SCATTER_DEFAULT_INPUTS, extras = [0, 0]}) => {
  const C = PILL_PAIR_LOGO_SCATTER_CONTRACT;
  const t = useCurrentFrame() / FPS;
  const s = toSource(t, C, extras);
  const hd = Math.max(0, t - s);
  const blue = inputs.brandColor ?? '#2a42f4';
  const push = 1 + 0.025 * hd + 0.006 * clamp(s - 4.0, 0, 1); // 停留时慢推（R7）
  return (
    <AbsoluteFill style={{overflow: 'hidden', fontFamily: SANS, background: BG}}>
      <AbsoluteFill style={{transform: `scale(${push.toFixed(5)})`}}>
        <Thumbs s={s} blue={blue} />
        <Pills s={s} x={inputs} />
        <Brand s={s} x={inputs} blue={blue} hd={hd} />
      </AbsoluteFill>
      <Grain opacity={0.018} />
    </AbsoluteFill>
  );
};
export const PillPairLogoScatter: React.FC = () => <PillPairLogoScatterGroup />;

if (checkContract(PILL_PAIR_LOGO_SCATTER_CONTRACT).length) throw new Error(checkContract(PILL_PAIR_LOGO_SCATTER_CONTRACT).join('; '));
