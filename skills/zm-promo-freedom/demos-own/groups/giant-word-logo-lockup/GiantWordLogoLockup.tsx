// 【镜头组】giant-word-logo-lockup：白底超大字只露出下半截、越甩越快 → 硬切蓝底小字一行（最后一个词擦出）→ 小字加速缩成一点 →
//   大 logo "砸"下来缩小、两块合拢 → logo 往左让、名字一个字一个字滑进来 → 整组缩小、副标题跟上 → 从左擦掉名字、副标题居中 →
//   原地换一句 → 换成"但是"（018-B 一串，产品登场）
// 学的动作（HSAji · Tonomo 5.80–11.47s，30fps 逐帧量过；时间表 （内部拆片记录，未随项目提供））：
//   每一句都是"静 → 越缩越快 → 硬换下一句"；大字横移最后一帧走 200px；logo 高 632 → 122（指数缓出，0.47 秒）；
//   名字落定后整组 2 帧缩到 0.57、再缓缓上升；擦除的边从左往右扫，副标题同时往左走到正中。
// 我们的内容：「小周」—— 认识一下全新的「小周」，家庭待办；换一句"全家共用的清单"；然后"但是"（接 018-C"更聪明"）。
//
// 拍表（源秒 = 原片秒 − 5.80，30fps）
//   拍 1 大字        0.00–1.067   白底超大字横移加速（停留点 0.30）
//   拍 2 小字一行    1.067–1.93   蓝底，最后一个词擦出，加速缩没（停留点 1.56）
//   拍 3 logo 合拢   1.933–2.47   大 logo 缩小合拢
//   拍 4 名字        2.47–3.40    logo 左让、名字滑进（停留点 3.25）
//   拍 5 副标题      3.40–4.20    整组缩小上移，副标题两段出（停留点 4.10）
//   拍 6 换词        4.20–5.067   擦掉名字、副标题居中、原地换一句（停留点 4.80）
//   拍 7 但是        5.067–5.667  加速缩小，接下一镜
// 毛病清单：
//   - 通用：画面永远不停（停留时整体极慢推近，按输出秒算）；--hq 渲染；确定性
//   - 独有 1：大字是白字压白底，只有落在蓝光里的下半截看得到（不是半透明）
//   - 独有 2：每次换句前都是"加速缩小"，不是淡出；logo 是 2 块从两边合拢（我们的 logo：方点 + 勾）
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {FONT, Grain} from '../../../assets/lib/helpers/polish';
import {GroupContract, checkContract, checkInputs, outputDuration, planExtras, toSource} from '../../../assets/lib/helpers/groupClock';

const FPS = 30;
const SANS = `"PingFang SC", "Noto Sans CJK SC", "Noto Sans SC", ${FONT.sans}`;

const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const mix = (a: number, b: number, k: number) => a + (b - a) * k;
const eo = (t: number, a: number, b: number) => { const c = clamp((t - a) / (b - a)); return 1 - Math.pow(1 - c, 3); };
const kf = (t: number, K: number[][]) => {
  const n = K.length;
  if (t <= K[0][0]) return K[0][1];
  if (t >= K[n - 1][0]) return K[n - 1][1];
  const d: number[] = [], m: number[] = [];
  for (let i = 0; i < n - 1; i++) d.push((K[i + 1][1] - K[i][1]) / (K[i + 1][0] - K[i][0]));
  m.push(d[0]);
  for (let i = 1; i < n - 1; i++) m.push(d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2);
  m.push(d[n - 2]);
  for (let i = 0; i < n - 1; i++) {
    if (d[i] === 0) { m[i] = 0; m[i + 1] = 0; continue; }
    const a = m[i] / d[i], b = m[i + 1] / d[i], h = a * a + b * b;
    if (h > 9) { const q = 3 / Math.sqrt(h); m[i] = q * a * d[i]; m[i + 1] = q * b * d[i]; }
  }
  let i = 0; while (t > K[i + 1][0]) i++;
  const h = K[i + 1][0] - K[i][0], u = (t - K[i][0]) / h, u2 = u * u, u3 = u2 * u;
  return (2 * u3 - 3 * u2 + 1) * K[i][1] + (u3 - 2 * u2 + u) * h * m[i] + (-2 * u3 + 3 * u2) * K[i + 1][1] + (u3 - u2) * h * m[i + 1];
};
const cw = (c: string) => (/[\x00-\x7f]/.test(c) ? 0.56 : 1);
const textW = (s: string, fs: number) => Array.from(s).reduce((a, c) => a + cw(c) * fs, 0);

// ═════════ 合同 ═════════
export const GIANT_WORD_LOGO_LOCKUP_CONTRACT: GroupContract = {
  sourceDuration: 170 / 30, // 5.667s
  fps: 30,
  motion: [[0, 0.25], [0.35, 1.5], [1.6, 3.2], [3.3, 4.05], [4.15, 4.75], [4.85, 5.667]],
  holds: [
    {at: 0.3, maxExtra: 1.0}, // 大字（还在极慢横移）
    {at: 1.56, maxExtra: 1.0}, // 小字一行读完
    {at: 3.25, maxExtra: 1.5}, // logo + 名字
    {at: 4.1, maxExtra: 1.5}, // 名字 + 副标题
    {at: 4.8, maxExtra: 1.2}, // 换的那一句
  ],
  landmarks: {giant: 0, cut: 1.067, wipe: 1.1, shrink: 1.6, logo: 1.933, name: 2.73, small: 3.47, sub: 3.667, erase: 4.2, swap: 4.567, turn: 5.067, exit: 170 / 30},
  sfx: [
    {at: 'giant', type: '上扬铺垫', note: '低频 swell，越来越快（大字甩出去）', tail: 1.0, volume: 0.35},
    {at: 'cut', type: '点击', note: '轻 click（硬切小字）', volume: 0.3},
    {at: 'logo', type: '落版重击', note: '低沉 impact（logo 砸下来）', tail: 0.6, volume: 0.5},
    {at: 'name', type: '轻tick', note: '一串轻 tick（名字逐字滑进）', tail: 0.3, volume: 0.3},
    {at: 'small', type: '短甩', note: 'whoosh 短（整组缩小）', volume: 0.3},
    {at: 'swap', type: '点击', note: 'click（换句）', volume: 0.3},
    {at: 'turn', type: '弹出', note: '轻 pop（但是）', volume: 0.35},
  ],
  inputs: {hook: {maxChars: 4}, tail: {maxChars: 4}, name: {maxChars: 3}, sub: {maxChars: 6}, swap: {maxChars: 9}, turn: {maxChars: 3}},
};

export type LockupInputs = {hook: string; tail: string; name: string; sub: string; swap: string; turn: string};
export const LOCKUP_DEFAULT_INPUTS: LockupInputs = {hook: '认识一下', tail: '全新的', name: '小周', sub: '家庭待办', swap: '全家共用的清单', turn: '但是'};
export const checkLockupInputs = (x: LockupInputs) => checkInputs(GIANT_WORD_LOGO_LOCKUP_CONTRACT, x);
export const planLockup = (sec: number) => planExtras(GIANT_WORD_LOGO_LOCKUP_CONTRACT, sec);
export const lockupFrames = (extras: number[]) => Math.round(outputDuration(GIANT_WORD_LOGO_LOCKUP_CONTRACT, extras) * FPS);
export const GIANT_WORD_LOGO_LOCKUP_DURATION = 170;

// ═════════ 原片量的曲线（源秒）═════════
const PAN = [[0, 22], [0.133, 0], [0.2, -4], [0.4, -8], [0.533, -14], [0.6, -24], [0.667, -39], [0.733, -66], [0.8, -108], [0.867, -178], [0.933, -292], [1.0, -492], [1.067, -760]];
const GSCALE = [[0, 0.92], [0.067, 0.944], [0.2, 1.0], [0.73, 1.014], [1.067, 1.02]];
const LINE_SCALE = [[1.067, 1.0], [1.53, 0.99], [1.6, 0.98], [1.667, 0.913], [1.733, 0.79], [1.8, 0.575], [1.833, 0.43], [1.867, 0.26], [1.9, 0.23], [1.933, 0.2]];
const MARK_SCALE = [[1.933, 5.18], [1.967, 4.21], [2.0, 3.49], [2.033, 2.94], [2.067, 2.5], [2.1, 2.16], [2.133, 1.87], [2.167, 1.65], [2.2, 1.47], [2.233, 1.32], [2.267, 1.21], [2.3, 1.13], [2.333, 1.066], [2.367, 1.033], [2.4, 1.016], [2.467, 1.0]];
const MARK_GO = [[2.4, 0], [2.467, 0.028], [2.533, 0.067], [2.6, 0.128], [2.667, 0.223], [2.733, 0.397], [2.8, 0.696], [2.867, 0.874], [2.933, 0.95], [3.0, 0.983], [3.067, 0.997], [3.133, 1]]; // logo 左让的进度（原片 950 → 592）
const RISE = [[3.533, 568], [3.6, 553], [3.667, 543], [3.8, 538], [3.867, 532], [3.933, 528], [4.0, 526], [4.067, 525]];
const ERASE_GO = [[4.2, 0], [4.267, 0.045], [4.333, 0.128], [4.4, 0.283], [4.467, 0.52], [4.533, 0.725], [4.6, 0.83], [4.667, 0.9], [4.733, 0.95], [4.8, 0.985], [4.867, 1]];
const SWAP_SCALE = [[4.567, 1], [4.867, 0.99], [4.933, 0.95], [5.0, 0.87], [5.067, 0.8]];
const TURN_SCALE = [[5.067, 1], [5.133, 0.924], [5.2, 0.9], [5.267, 0.884], [5.333, 0.876], [5.4, 0.855], [5.467, 0.82], [5.533, 0.747], [5.6, 0.659], [5.667, 0.55]];

// 我们的 logo：方点 + 勾，两块（从两边合拢）
const Mark: React.FC<{h: number; sep: number}> = ({h, sep}) => (
  <svg width={h} height={h} viewBox="-20 -20 140 140" style={{display: 'block', overflow: 'visible'}}>
    <rect x={8 - sep} y={8 - sep} width={26} height={26} rx={4} fill="#fff" />
    <path d={`M${20 + sep} ${58 + sep} L${42 + sep} ${80 + sep} L${90 + sep} ${30 + sep}`} stroke="#fff" strokeWidth={19} strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

export const GiantWordLogoLockupGroup: React.FC<{inputs?: LockupInputs; extras?: number[]}> = ({inputs = LOCKUP_DEFAULT_INPUTS, extras = [0, 0, 0, 0, 0]}) => {
  const t = useCurrentFrame() / FPS;
  const C = GIANT_WORD_LOGO_LOCKUP_CONTRACT;
  const s = toSource(t, C, extras);
  const lag = t - s; // 停留累计的秒数
  const cam = 1 + 0.006 * lag; // 停留时极慢推近（画面不冻住）
  const {hook, tail, name, sub, swap, turn} = inputs;

  // ── 第 1 镜：白底大字 ──
  if (s < 1.067) {
    const G_FS = 455, base = 804; // 字的下沿压在原片 MEET 的基线 y≈804
    const blob = clamp(s / 1.067);
    const rx = mix(1700, 2000, blob), ry = mix(980, 1200, blob); // 蓝光椭圆长大（照原片底角 / 中线取色反推）
    const sc = kf(s, GSCALE) * cam;
    return (
      <AbsoluteFill style={{background: '#fff', overflow: 'hidden', fontFamily: SANS}}>
        <AbsoluteFill style={{background: `radial-gradient(ellipse ${rx}px ${ry}px at 960px 1320px, rgb(12,100,200) 0%, rgb(16,108,208) 32%, rgb(30,118,215) 46%, rgba(60,140,225,0.88) 58%, rgba(150,195,240,0.5) 71%, rgba(255,255,255,0) 84%)`}} />
        <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transform: `scale(${sc})`, transformOrigin: '960px 804px'}}>
          <div style={{position: 'absolute', left: 60 + kf(s, PAN), top: base - G_FS * 1.02, fontSize: G_FS, fontWeight: 600, lineHeight: 1, color: '#fff', whiteSpace: 'nowrap', letterSpacing: '0.01em'}}>
            {hook}<span style={{marginLeft: G_FS * 0.45}}>{tail}</span>
          </div>
        </div>
      </AbsoluteFill>
    );
  }

  // ── 蓝底（第 2 镜起）──
  const fog = s < 2.6 ? kf(s, [[1.067, 1], [1.27, 0.62], [1.6, 0.22], [2.2, 0.03], [2.6, 0]]) : 0;
  const bg = (
    <>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 1080px 720px at 960px 780px, rgb(14,114,215) 0%, rgb(12,100,196) 38%, rgb(10,84,170) 70%, rgb(8,68,146) 100%)'}} />
      <AbsoluteFill style={{background: 'radial-gradient(circle 620px at 0px 0px, rgba(40,140,215,0.75), rgba(40,140,215,0) 100%), radial-gradient(circle 620px at 1920px 0px, rgba(40,140,215,0.75), rgba(40,140,215,0) 100%)'}} />
      {fog > 0.002 && <AbsoluteFill style={{background: `radial-gradient(ellipse 1500px 720px at 960px -160px, rgba(215,238,255,${fog}) 0%, rgba(130,190,245,${fog * 0.85}) 45%, rgba(90,160,235,0) 100%)`}} />}
    </>
  );

  const wrap = (child: React.ReactNode) => (
    <AbsoluteFill style={{overflow: 'hidden', fontFamily: SANS}}>
      {bg}
      <AbsoluteFill style={{transform: `scale(${cam})`}}>{child}</AbsoluteFill>
      <Grain opacity={0.03} blend="screen" />
    </AbsoluteFill>
  );

  // ── 第 2 镜：小字一行，最后一个词擦出，加速缩小 ──
  if (s < 1.933) {
    const FS = 72;
    const full = textW(hook, FS) + FS * 0.35 + textW(tail, FS);
    const off = 81 * (1 - eo(s, 1.067, 1.53));
    const sc = kf(s, LINE_SCALE);
    const wipe = clamp((s - 1.1) / 0.25); // 尾词从左往右软边擦出
    const tailW = textW(tail, FS);
    const edge = wipe * (tailW + 60) - 30;
    return wrap(
      <div style={{position: 'absolute', left: 960 - full / 2 + off, top: 540, transform: `translateY(-50%) scale(${sc})`, transformOrigin: `${full / 2 - off}px 50%`, whiteSpace: 'nowrap', fontSize: FS, fontWeight: 500, color: '#fff', lineHeight: 1}}>
        {hook}
        <span style={{marginLeft: FS * 0.35, display: 'inline-block', WebkitMaskImage: `linear-gradient(90deg, #000 ${edge}px, transparent ${edge + 60}px)`, maskImage: `linear-gradient(90deg, #000 ${edge}px, transparent ${edge + 60}px)`}}>{tail}</span>
      </div>,
    );
  }

  // ── 第 3–6 镜：logo / 名字 / 副标题 ──
  const MARK = 122, GAP = 77, NAME_FS = 130;
  const nameW = textW(name, NAME_FS);
  const bigLeft = 960 - (MARK + GAP + nameW) / 2;
  const bigMarkCx = bigLeft + MARK / 2;
  // 小一号的一行：logo、名字缩到 0.57，后面接副标题
  const K = 0.57, SUB_FS = 60, GAP2 = 40;
  const subW = textW(sub, SUB_FS);
  const smallW = (MARK + GAP + nameW) * K + GAP2 + subW;
  const smallLeft = 960 - smallW / 2;
  const subLeft0 = smallLeft + (MARK + GAP + nameW) * K + GAP2;
  const subCenter0 = subLeft0 + subW / 2;

  if (s < 5.067) {
    const ms = s < 2.467 ? kf(s, MARK_SCALE) : 1;
    const sep = 10 * clamp((ms - 1) / 4.2);
    const go = kf(s, MARK_GO);
    const shrink = eo(s, 3.467, 3.533); // 2 帧缩到 0.57
    const lift = -23 * eo(s, 3.4, 3.467);
    const yC = s < 3.467 ? 540 + lift : s < 3.533 ? mix(517, 568, shrink) : kf(s, RISE);
    const scale = mix(1, K, shrink);
    // 大组合时的位置 → 小一行时的位置
    const markCxBig = mix(960, bigMarkCx, go);
    const markCxSmall = smallLeft + (MARK * K) / 2;
    const nameLeftBig = bigLeft + MARK + GAP;
    const nameLeftSmall = smallLeft + (MARK + GAP) * K;
    const erase = kf(s, ERASE_GO);
    const shift = (960 - subCenter0) * erase; // 擦除时整行左移，副标题走到正中
    const markCx = mix(markCxBig, markCxSmall, shrink) + shift;
    const nameLeft = mix(nameLeftBig, nameLeftSmall, shrink) + shift;
    const blur = s > 3.45 && s < 3.56 ? 3 * Math.sin(Math.PI * clamp((s - 3.45) / 0.11)) : 0;
    // 擦除边：从这一行左边扫到副标题左边（软边 40px）
    const eraseEdge = s < 4.2 ? -1000 : mix(smallLeft - 30 + shift, subLeft0 + shift - 24, eo(s, 4.2, 4.5));
    const masked = s >= 4.2;
    const maskCss = masked ? {WebkitMaskImage: `linear-gradient(90deg, transparent ${eraseEdge}px, #000 ${eraseEdge + 40}px)`, maskImage: `linear-gradient(90deg, transparent ${eraseEdge}px, #000 ${eraseEdge + 40}px)`} : {};
    const showSwap = s >= 4.567;
    const subCx = subCenter0 + shift;
    return wrap(
      <>
        <div style={{position: 'absolute', inset: 0, filter: blur > 0.05 ? `blur(${blur}px)` : undefined, ...maskCss}}>
          {/* logo */}
          <div style={{position: 'absolute', left: markCx - (MARK * ms * scale) / 2, top: yC - (MARK * ms * scale) / 2}}>
            <Mark h={MARK * ms * scale} sep={sep} />
          </div>
          {/* 名字：一个字一个字从右边滑进 */}
          <div style={{position: 'absolute', left: nameLeft, top: yC, transform: `translateY(-52%) scale(${scale})`, transformOrigin: '0 50%', display: 'flex', whiteSpace: 'nowrap'}}>
            {Array.from(name).map((c, i) => {
              const a = 2.73 + i * 0.08;
              const k = eo(s, a, a + 0.4);
              return <span key={i} style={{display: 'inline-block', fontSize: NAME_FS, fontWeight: 800, color: '#fff', lineHeight: 1, opacity: clamp((s - a) / 0.1), transform: `translateX(${(1 - k) * 140}px)`, letterSpacing: '0.02em'}}>{c}</span>;
            })}
          </div>
        </div>
        {/* 副标题：两段依次出；4.567 原地换成另一句 */}
        {!showSwap && s >= 3.6 && (
          <div style={{position: 'absolute', left: subLeft0 + shift, top: yC, transform: 'translateY(-50%)', whiteSpace: 'nowrap', fontSize: SUB_FS, fontWeight: 400, color: '#fff', lineHeight: 1}}>
            {[Array.from(sub).slice(0, Math.ceil(Array.from(sub).length / 2)).join(''), Array.from(sub).slice(Math.ceil(Array.from(sub).length / 2)).join('')].map((w, i) => {
              const a = 3.667 + i * 0.067;
              return <span key={i} style={{display: 'inline-block', opacity: clamp((s - a) / 0.08), transform: `translateX(${(1 - eo(s, a, a + 0.25)) * 26}px)`}}>{w}</span>;
            })}
          </div>
        )}
        {showSwap && (
          <div style={{position: 'absolute', left: subCx, top: yC, transform: `translate(-50%,-50%) scale(${kf(s, SWAP_SCALE)})`, whiteSpace: 'nowrap', fontSize: SUB_FS, fontWeight: 400, color: '#fff', lineHeight: 1}}>{swap}</div>
        )}
      </>,
    );
  }

  // ── 第 8 镜：但是 ──
  return wrap(
    <div style={{position: 'absolute', left: 960, top: 524, transform: `translate(-50%,-50%) scale(${kf(s, TURN_SCALE)})`, whiteSpace: 'nowrap', fontSize: 120, fontWeight: 500, color: '#fff', lineHeight: 1}}>{turn}</div>,
  );
};

if (checkContract(GIANT_WORD_LOGO_LOCKUP_CONTRACT).length) throw new Error(checkContract(GIANT_WORD_LOGO_LOCKUP_CONTRACT).join('；'));
export const GiantWordLogoLockup: React.FC = () => <GiantWordLogoLockupGroup />;
