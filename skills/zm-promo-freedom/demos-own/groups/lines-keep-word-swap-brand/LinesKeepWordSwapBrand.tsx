// 【镜头组】lines-keep-word-swap-brand：暗底居中逐行打出三行字（第一行逐字打、后面的词从下面浮上来），最后一行带一个地球图标 →
//   其余的字退掉，只留「🌐 关键词」滑到正中 → 图标一缩、关键词一下换成产品标志 + 产品名 → 往上让，下面浮出一句「都能替你做」（040-H 单个镜头，卖点收束）
// 学的动作（SkaleSolutions · Aside 57.15–62.40s，29.97fps；网格大图逐点量过，时间表 （内部拆片记录，未随项目提供））：
//   57.22–57.7 第一行逐字打；57.45 / 57.7 第二行两段浮上来；58.0 / 58.2 第三行「in a」「🌐 browser」浮上来；行越多整块越往上（基线 580 → 476/620 → 450/590/720）；
//   59.0–59.15「in a」退、关键词滑到居中；59.2–59.3 上两行退；59.35–60.3 关键词升到基线 580；60.0–60.35 地球缩 120 → 96；60.38 换成标志 + 产品名；
//   61.2–61.5 产品名升到 450，61.35–61.85 下面一句从 680 浮到 590。
// 我们的内容：通用卖点句，产品名用虚构的 Nimbo。
//
// 拍表（源秒 = 原片秒 − 57.15，30fps，共 158 帧）
//   拍 1 三行打出            0.00–1.70   （停留点 1.75）
//   拍 2 留一个词 → 换品牌   1.80–3.70   （停留点 3.75）
//   拍 3 下面一句            3.80–5.15   （停留点 5.20）
// 毛病清单：
//   - 通用：画面永远不停（停留时整体极慢推近）；--hq 渲染；确定性
//   - 独有：关键词换品牌时位置不跳——图标先缩小、在同一个位置换成标志，字在同一条基线上换
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Grain} from '../../../assets/lib/helpers/polish';
import {GroupContract, checkContract, checkInputs, outputDuration, planExtras, toSource} from '../../../assets/lib/helpers/groupClock';
import {BG, SANS, clamp, easeInOut, easeOut, mix, mk} from '../_kit/darkUiKit';

const FPS = 30;
const T0 = 57.15;

export const LINES_KEEP_WORD_SWAP_BRAND_CONTRACT: GroupContract = {
  sourceDuration: 5.25,
  fps: 30,
  motion: [[0, 1.7], [1.8, 3.7], [3.8, 5.15]],
  holds: [{at: 1.75, maxExtra: 1.0}, {at: 3.75, maxExtra: 1.0}, {at: 5.2, maxExtra: 1.5}],
  landmarks: {type: 0.07, line2: 0.3, line3: 0.85, key: 1.05, strip: 1.85, rise: 2.2, swap: 3.23, tagline: 4.2},
  sfx: [
    {at: 'type', type: '键盘', note: '键盘敲字', tail: 0.5, volume: 0.3},
    {at: 'line2', type: '轻tick', note: 'soft tick ×2', volume: 0.2},
    {at: 'key', type: '弹出', note: 'soft pop', volume: 0.25},
    {at: 'strip', type: '短甩', note: '退场 soft swish', volume: 0.2},
    {at: 'swap', type: '点击', note: '换品牌 click + shimmer', tail: 0.4, volume: 0.4},
    {at: 'swap', type: '闪光', note: '换品牌 click + shimmer', tail: 0.4, volume: 0.4},
    {at: 'tagline', type: '上扬铺垫', note: 'soft swell', volume: 0.25},
  ],
  inputs: {l1: {maxChars: 5}, l2: {maxChars: 6}, l3pre: {maxChars: 2}, key: {maxChars: 4}, brand: {maxChars: 7}, tagline: {maxChars: 7}},
};

export type LkwsInputs = {l1: string; l2: string; l3pre: string; key: string; brand: string; tagline: string};
export const LKWS_DEFAULT_INPUTS: LkwsInputs = {l1: '任何你能', l2: '亲手做的事', l3pre: '在', key: '浏览器里', brand: 'Nimbo', tagline: '都能替你做'};
export const checkLkwsInputs = (x: LkwsInputs) => checkInputs(LINES_KEEP_WORD_SWAP_BRAND_CONTRACT, x);
export const planLkws = (sec: number) => planExtras(LINES_KEEP_WORD_SWAP_BRAND_CONTRACT, sec);
export const lkwsFrames = (extras: number[]) => Math.round(outputDuration(LINES_KEEP_WORD_SWAP_BRAND_CONTRACT, extras) * FPS);
export const LINES_KEEP_WORD_SWAP_BRAND_DURATION = 158;

const FS = 132;
const Globe: React.FC<{size: number}> = ({size}) => (
  <svg width={size} height={size} viewBox="1.5 1.5 21 21" fill="none" stroke="#fff" strokeWidth={1.9}><circle cx="12" cy="12" r="9.6" /><ellipse cx="12" cy="12" rx="4.3" ry="9.6" /><path d="M2.4 12h19.2" /></svg>
);
const Logo: React.FC<{size: number}> = ({size}) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke="#fff" strokeWidth={3.6} strokeLinecap="round">
    <circle cx="24" cy="24" r="20" /><path d="M10 38 L38 10" />
    <path d="M24 14 C25 21 27 23 34 24 C27 25 25 27 24 34 C23 27 21 25 14 24 C21 23 23 21 24 14 Z" fill="#fff" stroke="none" />
  </svg>
);

/** 词从下面浮上来（u = 出现后的秒数） */
const rise = (u: number) => ({op: clamp(u / 0.12), dy: 46 * (1 - easeOut(u / 0.22))});

export const LinesKeepWordSwapBrandGroup: React.FC<{inputs?: LkwsInputs; extras?: number[]}> = ({inputs = LKWS_DEFAULT_INPUTS, extras = [0, 0, 0]}) => {
  const t = useCurrentFrame() / FPS;
  const s = toSource(t, LINES_KEEP_WORD_SWAP_BRAND_CONTRACT, extras);
  const lag = t - s;
  const T = s + T0;
  const cam = 1 + 0.004 * lag;

  const cw = FS; // 中文一个字宽
  const l1 = [...inputs.l1], l2 = [...inputs.l2];
  const icon0 = 120, iconGap = 36;
  const keyW = icon0 + iconGap + [...inputs.key].length * cw;
  const preW = [...inputs.l3pre].length * cw + 40;

  // 行数决定整块的位置
  const n2 = easeOut((T - 57.4) / 0.1), n3 = easeOut((T - 57.95) / 0.1);
  const b1 = mix(mix(580, 476, n2), 450, n3);
  const b2 = mix(620, 590, n3);
  const b3 = 720;
  const topFade = 1 - clamp((T - 59.2) / 0.12);

  // 第一行：逐字打
  const typedN = Math.floor(clamp((T - 57.22) / 0.45) * l1.length + (T >= 57.22 ? 1 : 0));
  const line1 = T < 59.35 && (
    <div style={{position: 'absolute', left: 0, width: 1920, top: b1 - FS * 0.92, textAlign: 'center', fontSize: FS, fontWeight: 600, lineHeight: `${FS * 1.2}px`, color: '#f6f6f6', opacity: topFade, whiteSpace: 'pre'}}>
      {l1.map((c, i) => <span key={i} style={{opacity: i < typedN ? 1 : 0}}>{c}</span>)}
    </div>
  );
  // 第二行：两段浮上来（前一半、后一半）
  const half = Math.ceil(l2.length / 2);
  const line2 = T >= 57.45 && T < 59.35 && (
    <div style={{position: 'absolute', left: 0, width: 1920, top: b2 - FS * 0.92, textAlign: 'center', fontSize: FS, fontWeight: 600, lineHeight: `${FS * 1.2}px`, color: '#f6f6f6', opacity: topFade, whiteSpace: 'pre'}}>
      {l2.map((c, i) => { const r = rise(T - (i < half ? 57.45 : 57.7)); return <span key={i} style={{display: 'inline-block', opacity: r.op, transform: `translateY(${r.dy}px)`}}>{c}</span>; })}
    </div>
  );

  // 第三行：前缀 + 关键词（图标 + 字）
  const strip = easeInOut((T - 59.0) / 0.15);
  const lineW3 = preW + keyW;
  const keyX0 = 960 - lineW3 / 2 + preW;
  const keyXc = 960 - keyW / 2;
  const up = easeInOut((T - 59.3) / 0.5);
  const keyBase = mix(mix(b3, 730, strip), 580, up);
  const swapK = clamp((T - 60.36) / 0.08);
  const iconSz = mix(icon0, 96, easeInOut((T - 60.0) / 0.35));
  let line3: React.ReactNode = null;
  if (T >= 58.0 && T < 60.45) {
    const rp = rise(T - 58.0), rk = rise(T - 58.2);
    const kx = mix(keyX0, keyXc, strip);
    line3 = (
      <>
        <div style={{position: 'absolute', left: 960 - lineW3 / 2, top: b3 - FS * 0.92 + rp.dy, fontSize: FS, fontWeight: 600, lineHeight: `${FS * 1.2}px`, color: '#f6f6f6', opacity: rp.op * (1 - strip), whiteSpace: 'pre'}}>{inputs.l3pre}</div>
        <div style={{position: 'absolute', left: kx, top: keyBase - FS * 0.92 + rk.dy, height: FS * 1.2, display: 'flex', alignItems: 'center', opacity: rk.op * (1 - swapK), whiteSpace: 'pre'}}>
          <div style={{width: icon0, display: 'flex', justifyContent: 'center', marginRight: iconGap, marginTop: FS * 0.12}}><Globe size={iconSz} /></div>
          <span style={{fontSize: FS, fontWeight: 600, color: '#f6f6f6'}}>{inputs.key}</span>
        </div>
      </>
    );
  }
  // 产品名
  let brand: React.ReactNode = null;
  if (T >= 60.36) {
    const brandW = 128 + 50 + [...inputs.brand].length * FS * 0.6;
    const lift = easeInOut((T - 61.2) / 0.3);
    const by = mix(590, 450, lift);
    const pop = 1 + 0.06 * Math.sin(clamp((T - 60.36) / 0.2) * Math.PI);
    const tg = rise(T - 61.35);
    brand = (
      <>
        <div style={{position: 'absolute', left: 960 - brandW / 2, top: by - FS * 0.92, height: FS * 1.2, display: 'flex', alignItems: 'center', opacity: swapK, transform: `scale(${pop})`, transformOrigin: '50% 60%'}}>
          <div style={{marginRight: 50, marginTop: FS * 0.12}}><Logo size={128} /></div>
          <span style={{fontSize: FS * 1.02, fontWeight: 600, color: '#f6f6f6', letterSpacing: -2}}>{inputs.brand}</span>
        </div>
        {T >= 61.35 && <div style={{position: 'absolute', left: 0, width: 1920, top: mix(680, 590, easeOut((T - 61.35) / 0.5)) - FS * 0.92, textAlign: 'center', fontSize: FS, fontWeight: 600, lineHeight: `${FS * 1.2}px`, color: '#f6f6f6', opacity: tg.op, whiteSpace: 'pre'}}>{inputs.tagline}</div>}
      </>
    );
  }

  return (
    <AbsoluteFill style={{background: BG, overflow: 'hidden', fontFamily: SANS}}>
      <div style={{position: 'absolute', inset: 0, transform: `scale(${cam})`, transformOrigin: '960px 540px'}}>
        {line1}
        {line2}
        {line3}
        {brand}
      </div>
      <Grain opacity={0.025} />
    </AbsoluteFill>
  );
};

if (checkContract(LINES_KEEP_WORD_SWAP_BRAND_CONTRACT).length) throw new Error(checkContract(LINES_KEEP_WORD_SWAP_BRAND_CONTRACT).join('；'));
export const LinesKeepWordSwapBrand: React.FC = () => <LinesKeepWordSwapBrandGroup />;
