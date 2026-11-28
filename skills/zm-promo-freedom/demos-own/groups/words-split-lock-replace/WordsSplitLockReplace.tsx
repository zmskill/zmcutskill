// 【镜头组】words-split-lock-replace：白底居中打字「所有数据 都 私密」→ 词与词之间拉开、第一个词消失，中间插进一把锁 →
//   「🔒私密」往上斜着让，「都」掉下去消失，下面浮出「由你掌控」→ 上一行退，下面一行的词原地一个个换成「数据 从不离开」，再浮出「你的设备」（040-J 一拍，讲隐私）
// 学的动作（SkaleSolutions · Aside 66.60–70.70s，29.97fps；网格大图逐点量过，时间表 （内部拆片记录，未随项目提供））：
//   66.62–67.0 逐字打第一个词（一直居中）；67.38–67.75 打后两个词；68.15–68.4 词间距拉开；68.42 第一个词消失、68.55 锁出现；
//   68.75–69.2「🔒 private」升到基线 450、「is」往下掉并消失；69.2 下一行浮出；69.7 上一行退、下一行沉到 580；69.82 起原地换词并升到 450；70.25 第三行从 660 浮到 590。
// 我们的内容：通用隐私文案。
//
// 拍表（源秒 = 原片秒 − 66.60，30fps，共 123 帧）
//   拍 1 打字                   0.00–1.25   （停留点 1.30）
//   拍 2 拉开 + 锁 + 由你掌控   1.35–2.92   （停留点 2.97）
//   拍 3 原地换词 + 你的设备    3.02–3.95   （停留点 4.00）
// 毛病清单：
//   - 通用：画面永远不停（停留时整体极慢推近）；--hq 渲染；确定性
//   - 独有：换句话时不清屏——词在原来的位置上一个个被换掉
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Grain} from '../../../assets/lib/helpers/polish';
import {GroupContract, checkContract, checkInputs, outputDuration, planExtras, toSource} from '../../../assets/lib/helpers/groupClock';
import {SANS, clamp, easeInOut, easeOut, mix, mk} from '../_kit/darkUiKit';

const FPS = 30;
const T0 = 66.6;

export const WORDS_SPLIT_LOCK_REPLACE_CONTRACT: GroupContract = {
  sourceDuration: 4.1,
  fps: 30,
  motion: [[0, 1.25], [1.35, 2.92], [3.02, 3.95]],
  holds: [{at: 1.3, maxExtra: 1.0}, {at: 2.97, maxExtra: 1.0}, {at: 4.0, maxExtra: 1.5}],
  landmarks: {type1: 0.02, type2: 0.78, split: 1.55, lock: 1.95, rise: 2.15, under: 2.6, swap: 3.22, device: 3.65},
  sfx: [
    {at: 'type1', type: '键盘', note: '键盘敲字', tail: 0.4, volume: 0.3},
    {at: 'type2', type: '键盘', note: '键盘敲字', tail: 0.4, volume: 0.3},
    {at: 'lock', type: '点击', note: '上锁 click', volume: 0.4},
    {at: 'under', type: '轻tick', note: 'soft tick', volume: 0.2},
    {at: 'swap', type: '轻tick', note: '换词 tick ×2', volume: 0.25},
    {at: 'device', type: '上扬铺垫', note: 'soft swell', volume: 0.2},
  ],
  inputs: {w1: {maxChars: 4}, w2: {maxChars: 2}, w3: {maxChars: 3}, ctrl1: {maxChars: 2}, ctrl2: {maxChars: 3}, data1: {maxChars: 2}, data2: {maxChars: 4}, device: {maxChars: 5}},
};

export type WslrInputs = {w1: string; w2: string; w3: string; ctrl1: string; ctrl2: string; data1: string; data2: string; device: string};
export const WSLR_DEFAULT_INPUTS: WslrInputs = {w1: '所有数据', w2: '都', w3: '私密', ctrl1: '由你', ctrl2: '掌控', data1: '数据', data2: '从不离开', device: '你的设备'};
export const checkWslrInputs = (x: WslrInputs) => checkInputs(WORDS_SPLIT_LOCK_REPLACE_CONTRACT, x);
export const planWslr = (sec: number) => planExtras(WORDS_SPLIT_LOCK_REPLACE_CONTRACT, sec);
export const wslrFrames = (extras: number[]) => Math.round(outputDuration(WORDS_SPLIT_LOCK_REPLACE_CONTRACT, extras) * FPS);
export const WORDS_SPLIT_LOCK_REPLACE_DURATION = 123;

const FS = 124;
const GAP = 34; // 词间距
const LOCK = 138;

const Lock: React.FC<{size: number}> = ({size}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth={2.1} strokeLinecap="round"><rect x="5" y="10.5" width="14" height="10" rx="2.6" /><path d="M8.2 10.5V7.6a3.8 3.8 0 0 1 7.6 0v2.9" /><path d="M12 14.6v2.2" /></svg>
);
const W = (x: string) => [...x].length * FS;

export const WordsSplitLockReplaceGroup: React.FC<{inputs?: WslrInputs; extras?: number[]}> = ({inputs = WSLR_DEFAULT_INPUTS, extras = [0, 0, 0]}) => {
  const t = useCurrentFrame() / FPS;
  const s = toSource(t, WORDS_SPLIT_LOCK_REPLACE_CONTRACT, extras);
  const lag = t - s;
  const T = s + T0;
  const cam = 1 + 0.004 * lag + 0.007 * t; // 原片整段字一直在动，不留死帧：加一点极慢推近
  const txt: React.CSSProperties = {position: 'absolute', fontSize: FS, fontWeight: 600, lineHeight: `${FS * 1.2}px`, color: '#111', whiteSpace: 'pre'};
  const at = (x: number, base: number) => ({left: x, top: base - FS * 0.92});

  const els: React.ReactNode[] = [];
  // ── 第一句：打字 → 拉开 → 第一个词消失 + 锁 ──
  if (T < 69.25) {
    const c1 = [...inputs.w1];
    const n1 = Math.min(c1.length, Math.floor(clamp((T - 66.62) / 0.38) * c1.length + (T >= 66.62 ? 1 : 0)));
    const tail = [...(inputs.w2 + inputs.w3)];
    const n2 = T < 67.38 ? 0 : Math.min(tail.length, Math.floor(clamp((T - 67.38) / 0.37) * tail.length + 1));
    const w2n = Math.min([...inputs.w2].length, n2), w3n = Math.max(0, n2 - [...inputs.w2].length);
    const spread = easeInOut((T - 68.15) / 0.25) * 60;
    const w1Op = 1 - clamp((T - 68.4) / 0.06);
    const lockK = easeOut((T - 68.52) / 0.12);
    const lockW = (LOCK + 16) * lockK;
    // 宽度：第一个词（消失后收为 0）+ 词间距 + 第二个 + 锁 + 第三个
    const gone = easeInOut((T - 68.42) / 0.14);
    const w1w = W(inputs.w1.slice(0, n1)) * (1 - gone);
    const w2w = W([...inputs.w2].slice(0, w2n).join(''));
    const w3w = W([...inputs.w3].slice(0, w3n).join(''));
    const g1 = n2 > 0 ? (GAP + spread) * (1 - gone) : 0;
    const g2 = w3n > 0 ? GAP + spread * 0.6 : 0;
    const total = w1w + g1 + w2w + g2 + lockW + w3w;
    let x = 960 - total / 2;
    // 68.75 起：「🔒 + 第三个词」往上斜着让到居中，第二个词往下掉、消失
    const rise = easeInOut((T - 68.75) / 0.45);
    const isDrop = clamp((T - 69.05) / 0.15);
    const b = 580;
    if (w1Op > 0 && n1 > 0) els.push(<div key="w1" style={{...txt, ...at(x, b), opacity: w1Op}}>{c1.slice(0, n1).join('')}</div>);
    x += w1w + g1;
    if (w2n > 0) els.push(<div key="w2" style={{...txt, ...at(x - 10 * rise, b + mix(0, -40, rise) + 20 * isDrop), opacity: 1 - isDrop}}>{[...inputs.w2].slice(0, w2n).join('')}</div>);
    x += w2w + g2;
    const pairW = lockW + w3w;
    const pairX = mix(x, 960 - (LOCK + 16 + W(inputs.w3)) / 2, rise);
    const pairB = mix(b, 450, rise);
    if (lockK > 0) els.push(<div key="lk" style={{position: 'absolute', left: pairX, top: pairB - FS * 0.92, transform: `scale(${lockK})`, transformOrigin: '50% 80%'}}><Lock size={LOCK} /></div>);
    if (w3n > 0) els.push(<div key="w3" style={{...txt, ...at(pairX + lockW, pairB)}}>{[...inputs.w3].slice(0, w3n).join('')}</div>);
    void pairW;
  }
  // ── 🔒私密（第一行）+ 由你掌控（第二行）──
  if (T >= 69.2 && T < 70.8) {
    const l1Op = 1 - clamp((T - 69.7) / 0.1);
    const lw = LOCK + 16 + W(inputs.w3);
    if (T >= 69.25 && l1Op > 0) {
      els.push(<div key="lk2" style={{position: 'absolute', left: 960 - lw / 2, top: 450 - FS * 0.92, opacity: l1Op}}><Lock size={LOCK} /></div>);
      els.push(<div key="w32" style={{...txt, ...at(960 - lw / 2 + LOCK + 16, 450), opacity: l1Op}}>{inputs.w3}</div>);
    }
    // 第二行：两个词，先浮上来，后来原地换词
    const sw1 = T >= 69.82, sw2 = T >= 69.95;
    const a = sw1 ? inputs.data1 : inputs.ctrl1;
    const d2c = [...inputs.data2];
    const d2n = Math.min(d2c.length, Math.floor(clamp((T - 69.95) / 0.25) * d2c.length + 1));
    const bWord = sw2 ? d2c.slice(0, d2n).join('') : T >= 69.45 ? inputs.ctrl2 : '';
    const r1 = easeOut((T - 69.2) / 0.18), r2 = easeOut((T - 69.45) / 0.15);
    const lineW = W(a) + (bWord ? GAP + W(bWord) : 0);
    const base = T < 69.7 ? 600 : mk(T, [[69.7, 600], [69.85, 580], [70.0, 450]]);
    const lx = 960 - lineW / 2;
    els.push(<div key="c1" style={{...txt, ...at(lx, base + 40 * (1 - r1)), opacity: r1}}>{a}</div>);
    if (bWord) els.push(<div key="c2" style={{...txt, ...at(lx + W(a) + GAP, base + (sw2 ? 0 : 30 * (1 - r2))), opacity: sw2 ? 1 : r2}}>{bWord}</div>);
    // 第三行
    if (T >= 70.25) {
      const r3 = easeOut((T - 70.25) / 0.3);
      els.push(<div key="dv" style={{...txt, left: 0, width: 1920, textAlign: 'center', top: mix(660, 590, r3) - FS * 0.92, opacity: clamp((T - 70.25) / 0.1)}}>{inputs.device}</div>);
    }
  }

  return (
    <AbsoluteFill style={{background: '#fff', overflow: 'hidden', fontFamily: SANS}}>
      <div style={{position: 'absolute', inset: 0, transform: `scale(${cam})`, transformOrigin: '960px 540px'}}>{els}</div>
      <Grain opacity={0.015} blend="multiply" />
    </AbsoluteFill>
  );
};

if (checkContract(WORDS_SPLIT_LOCK_REPLACE_CONTRACT).length) throw new Error(checkContract(WORDS_SPLIT_LOCK_REPLACE_CONTRACT).join('；'));
export const WordsSplitLockReplace: React.FC = () => <WordsSplitLockReplaceGroup />;
