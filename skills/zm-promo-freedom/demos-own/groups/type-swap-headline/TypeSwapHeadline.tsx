// 【镜头组】type-swap-headline：白底，一个巨大的字从左边开始打（蓝色光标），越打越小、越居中 →
//   新的词从右下方虚着、灰着冒出来往上落定，镜头往左平移，旧的那句从右往左一个字一个字删掉 → 第二个词同样落定 →
//   几个蓝色小短线在字周围漂，镜头慢慢拉远，右边亮起一团橙光（接 021-B）（021-A 单个镜头，开场标题）
// 学的动作（mnowakdesign · Roamly 0–2.93s，30fps 逐帧量过；时间表 （内部拆片记录，未随项目提供））：
//   打字时整体以 (1075,543) 为中心从 1.68 倍缩到 1（0.63 秒），每个字一出现就是实的；
//   换句时整块内容按每帧 42px 往左平移（720p 量的 28px × 1.5），新词和旧句的相对位置不变，新词只有竖直方向从 +82px 落到 0（0.33 秒，缓出），透明度和清晰度同步到位；
//   旧句从右往左删，0.5 秒删完；第二个词 0.5 秒后同样出现；2.0 秒后整体以 (930,548) 为中心慢慢拉远到 0.87（越拉越快）。
// 我们的内容："下个周末去哪" → "早就安排" + "好了。"
//
// 拍表（源秒，30fps，共 88 帧）
//   拍 1 打字        0.00–0.92   逐字打出、整体缩到 1（停留点 0.95）
//   拍 2 换句        0.98–2.30   新词落定、旧句删掉、第二个词落定（停留点 2.40）
//   拍 3 拉远        2.45–2.93   小短线漂、拉远、右边橙光亮起
// 毛病清单：
//   - 通用：画面永远不停（停留时整体极慢推近）；--hq 渲染；确定性
//   - 独有 1：新词不是从右边滑进来，而是跟着镜头一起走、只从下方往上落，同时由灰虚变黑实
//   - 独有 2：旧句是从右往左一个字一个字删（像退格），不是整句淡出
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {FONT, Grain} from '../../../assets/lib/helpers/polish';
import {GroupContract, checkContract, checkInputs, outputDuration, planExtras, toSource} from '../../../assets/lib/helpers/groupClock';

const FPS = 30;
const SANS = `"PingFang SC", "Noto Sans CJK SC", "Noto Sans SC", ${FONT.sans}`;
const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const mix = (a: number, b: number, k: number) => a + (b - a) * k;
const kfl = (t: number, K: number[][]) => { if (t <= K[0][0]) return K[0][1]; for (let i = 0; i < K.length - 1; i++) if (t <= K[i + 1][0]) return mix(K[i][1], K[i + 1][1], (t - K[i][0]) / (K[i + 1][0] - K[i][0])); return K[K.length - 1][1]; };

export const TYPE_SWAP_HEADLINE_CONTRACT: GroupContract = {
  sourceDuration: 88 / 30,
  fps: 30,
  motion: [[0, 0.92], [0.98, 2.3], [2.45, 88 / 30]],
  holds: [{at: 0.95, maxExtra: 1.2}, {at: 2.4, maxExtra: 1.5}],
  landmarks: {type: 0, settle: 0.63, swap: 1.1, gone: 1.5, second: 1.6, zoom: 2.0, glow: 2.75, exit: 88 / 30},
  sfx: [
    {at: 'type', type: '键盘', note: '键盘打字声（逐字）', tail: 0.7, volume: 0.3},
    {at: 'swap', type: '短甩', note: '轻 whoosh + 退格 tick', tail: 0.4, volume: 0.3},
    {at: 'swap', type: '键盘', note: '轻 whoosh + 退格 tick', tail: 0.4, volume: 0.3},
    {at: 'second', type: '弹出', note: '轻 pop', volume: 0.25},
    {at: 'glow', type: '闪光', note: '柔和 shimmer（接光线转场）', tail: 0.3, volume: 0.3},
  ],
  inputs: {line1: {maxChars: 7}, word2: {maxChars: 4}, word3: {maxChars: 4}},
};

export type TypeSwapInputs = {line1: string; word2: string; word3: string};
export const TYPE_SWAP_DEFAULT_INPUTS: TypeSwapInputs = {line1: '下个周末去哪', word2: '早就安排', word3: '好了。'};
export const checkTypeSwapInputs = (x: TypeSwapInputs) => checkInputs(TYPE_SWAP_HEADLINE_CONTRACT, x);
export const planTypeSwap = (sec: number) => planExtras(TYPE_SWAP_HEADLINE_CONTRACT, sec);
export const typeSwapFrames = (extras: number[]) => Math.round(outputDuration(TYPE_SWAP_HEADLINE_CONTRACT, extras) * FPS);
export const TYPE_SWAP_HEADLINE_DURATION = 88;

// ── 原片量的数（720p 坐标，渲染时 ×1.5）──
const ZOOM1 = [[0, 1.677], [0.2, 1.6], [0.267, 1.554], [0.333, 1.49], [0.4, 1.37], [0.467, 1.23], [0.5, 1.154], [0.567, 1.06], [0.633, 1.0]];
// 镜头平移：内容坐标 0 = 第一句左沿；屏幕 x = 内容 x + PAN
const PAN = [[0, 417], [1.0, 417], [1.033, 409], [1.067, 396], [1.1, 378], [1.133, 355], [1.167, 328], [1.2, 300], [1.233, 271], [1.267, 241], [1.3, 213], [1.333, 186], [1.367, 161], [1.4, 138], [1.433, 116], [1.467, 95], [1.5, 78], [1.533, 61], [1.567, 45], [1.6, 30], [1.633, 17], [1.667, 4], [1.7, -8], [1.733, -19], [1.767, -29], [1.8, -39], [1.833, -47], [1.867, -55], [1.9, -63], [1.933, -70], [1.967, -76], [2.0, -82], [2.033, -87], [2.067, -90], [2.167, -102], [2.267, -109], [2.367, -113], [2.467, -114]];
const ZOOM2 = [[2.0, 1], [2.267, 0.987], [2.467, 0.966], [2.667, 0.936], [2.867, 0.894], [2.933, 0.875]];
// 旧句还剩多少（可见宽度 / 全宽）
const KEEP1 = [[1.0, 1], [1.067, 1], [1.1, 0.9], [1.133, 0.87], [1.167, 0.81], [1.2, 0.73], [1.233, 0.72], [1.267, 0.66], [1.3, 0.57], [1.333, 0.48], [1.367, 0.36], [1.4, 0.29], [1.433, 0.2], [1.467, 0.13], [1.5, 0]];
// 新词落定：竖直偏移（px）、透明度
const DROP = [[0, 55], [0.033, 45], [0.067, 35], [0.1, 27], [0.133, 19], [0.167, 13], [0.2, 8], [0.233, 5], [0.267, 2], [0.3, 1], [0.333, 0]];
const OPAC = [[0, 0.23], [0.033, 0.33], [0.067, 0.45], [0.1, 0.57], [0.133, 0.69], [0.167, 0.78], [0.2, 0.84], [0.233, 0.89], [0.267, 0.93], [0.3, 0.96], [0.367, 1]];
// 蓝色小短线（内容坐标，720p），各自慢慢漂
const DOTS = [[535, 290, -0.6, 0.2], [808, 230, 0.4, -0.3], [899, 470, -0.3, 0.5], [1108, 306, 0.5, 0.1], [640, 525, 0.3, -0.2], [395, 335, -0.4, -0.3], [1010, 520, -0.2, 0.3]];

const FS = 77; // 720p 下第一句落定后的字号（字高 ≈ 原片大写高 65px）
const CW = (s: string) => Array.from(s).reduce((a, c) => a + (/[\x00-\x7f]/.test(c) ? 0.56 : 1) * FS, 0);

export const TypeSwapHeadlineGroup: React.FC<{inputs?: TypeSwapInputs; extras?: number[]}> = ({inputs = TYPE_SWAP_DEFAULT_INPUTS, extras = [0, 0]}) => {
  const t = useCurrentFrame() / FPS;
  const s = toSource(t, TYPE_SWAP_HEADLINE_CONTRACT, extras);
  const lag = t - s;
  const l1 = Array.from(inputs.line1);
  const n1 = l1.length;
  // 打字：原片 11 个字母在 0–0.73s 出完；按字数均匀摊开
  const typed = s < 0.73 ? Math.floor((s / 0.73) * n1) + 1 : n1;
  const z1 = kfl(s, ZOOM1);
  const z2 = s < 2.0 ? 1 : kfl(s, ZOOM2);
  const pan = kfl(s, PAN);
  const W1 = CW(inputs.line1);
  const gap = 22;
  const x2 = W1 + gap, W2 = CW(inputs.word2), x3 = x2 + W2 + 14;
  const base = 393; // 基线 y（720p）
  const keep = s < 1.0 ? 1 : kfl(s, KEEP1);
  const cursorOn = s < 0.93 && (s < 0.73 || Math.floor(s * 4) % 2 === 0);

  const word = (txt: string, x0: number, t0: number, key: string) => {
    if (s < t0) return null;
    const u = s - t0;
    const dy = kfl(u, DROP), op = kfl(u, OPAC);
    const g = Math.round(mix(150, 0, clamp((op - 0.23) / 0.77)));
    return <div key={key} style={{position: 'absolute', left: x0, top: base - FS * 0.86 + dy, fontSize: FS, fontWeight: 700, letterSpacing: -1, whiteSpace: 'nowrap', color: `rgb(${g},${g},${g})`, opacity: op, filter: op < 0.95 ? `blur(${(1 - op) * 3.5}px)` : undefined, lineHeight: 1}}>{txt}</div>;
  };

  // 第一句：逐字；换句时从右往左删
  const chars1 = l1.map((c, i) => {
    if (i >= typed) return null;
    const right = (i + 1) / n1;
    if (right > keep + 1 / n1) return null;
    const fade = right > keep ? clamp(1 - (right - keep) * n1) : 1;
    if (fade <= 0.02) return null;
    const x = CW(l1.slice(0, i).join(''));
    return <span key={i} style={{position: 'absolute', left: x, top: base - FS * 0.86, fontSize: FS, fontWeight: 700, letterSpacing: -1, lineHeight: 1, color: '#000', opacity: fade < 1 ? 0.15 + 0.85 * fade : 1}}>{c}</span>;
  });
  const curX = CW(l1.slice(0, typed).join('')) + 6;

  const dots = s >= 1.03 ? DOTS.map(([x, y, vx, vy], i) => {
    const age = s - 1.03;
    const px = x + vx * 40 * age + Math.sin(t * 1.3 + i) * 6, py = y + vy * 40 * age + Math.cos(t * 1.1 + i * 2) * 5;
    return <div key={'d' + i} style={{position: 'absolute', left: px, top: py, width: 7, height: 4.5, borderRadius: 3, background: '#2a10e8', opacity: clamp(age * 5) * 0.9, transform: `rotate(${(i * 37) % 60 - 30}deg)`, boxShadow: '-6px 0 6px rgba(80,60,255,0.35)', filter: 'blur(0.6px)'}} />;
  }) : null;

  // 内容坐标 → 屏幕：先平移 PAN，再以 (1075,543)/(930,548)（1080p）为中心缩放
  const inner = (
    <div style={{position: 'absolute', left: 0, top: 0, width: 1280, height: 720, transform: `translateX(${pan}px)`}}>
      {chars1}
      {cursorOn && <div style={{position: 'absolute', left: curX, top: base - FS * 0.95, width: 6.5, height: FS * 1.2, background: '#1300f2'}} />}
      {word(inputs.word2, x2, 1.1, 'w2')}
      {word(inputs.word3, x3, 1.6, 'w3')}
      {dots}
    </div>
  );
  const glow = clamp((s - 2.75) / 0.18);
  const cam = 1 + 0.004 * lag;
  return (
    <AbsoluteFill style={{background: '#fff', overflow: 'hidden', fontFamily: SANS}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transform: `scale(${cam})`, transformOrigin: '960px 540px'}}>
        <div style={{position: 'absolute', left: 0, top: 0, width: 1280, height: 720, transform: `scale(1.5)`, transformOrigin: '0 0'}}>
          <div style={{position: 'absolute', inset: 0, transform: `scale(${z1})`, transformOrigin: '717px 362px'}}>
            <div style={{position: 'absolute', inset: 0, transform: `scale(${z2})`, transformOrigin: '620px 365px'}}>{inner}</div>
          </div>
          {glow > 0 && <div style={{position: 'absolute', left: 1043 - 90, top: 304 - 90, width: 180, height: 180, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,160,40,0.95) 0%, rgba(255,190,110,0.45) 25%, rgba(255,220,180,0.12) 60%, rgba(255,255,255,0) 100%)', opacity: glow}} />}
        </div>
      </div>
      <Grain opacity={0.02} blend="multiply" />
    </AbsoluteFill>
  );
};

if (checkContract(TYPE_SWAP_HEADLINE_CONTRACT).length) throw new Error(checkContract(TYPE_SWAP_HEADLINE_CONTRACT).join('；'));
export const TypeSwapHeadline: React.FC = () => <TypeSwapHeadlineGroup />;
