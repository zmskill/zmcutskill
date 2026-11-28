// 【镜头组】decode-word-password-field：上一句散开，「🖴 本地，」挪到左边，右边冒出一串乱码、从左到右一个个解成「加密」→
//   换一句「Nimbo 不会让 AI」逐词打出，中间的词退掉、只剩「AI」→ 右边滑进一个大输入框「读取你的所有密码」，镜头跟着往右摇 →
//   手套光标点框尾的小眼睛：眼睛被划掉、字一下变成一串星号，镜头继续往右摇到眼睛居中（040-K 一拍，讲隐私）
// 学的动作（SkaleSolutions · Aside 73.40–79.28s，29.97fps；网格大图逐点量过，时间表 （内部拆片记录，未随项目提供））：
//   73.45–74.05「🖴 locally,」从 (1030,624) 挪到左边；74.05 乱码出现，74.15 起从左到右逐个解开，74.7 解完；74.85 整行退；
//   74.9–75.2 逐词打「Aside won't let AI」（左起 446）；75.4–75.65 中间词退、Aside 退；输入框左沿 2000 → 1850（75.75）→ 800（76.0）→ 624（76.5）→ 100（76.95）→ −144（77.75）→ −616（78.3）→ −680（79.15）；
//   77.1 手出现，77.55 点眼睛，77.62 眼睛划掉 + 星号；79.28 硬切。
// 我们的内容：通用隐私文案，产品名用虚构的 Nimbo。
//
// 拍表（源秒 = 原片秒 − 73.40，30fps，共 176 帧）
//   拍 1 本地 + 乱码解成「加密」   0.00–1.30   （停留点 1.35）
//   拍 2 Nimbo 不会让 AI          1.40–1.85   （停留点 1.90）
//   拍 3 输入框 + 点眼睛 + 星号   1.95–5.80   （停留点 5.85）
// 毛病清单：
//   - 通用：画面永远不停（停留时整体极慢推近）；--hq 渲染；确定性
//   - 独有：乱码是"从左到右一个个解开"，没解开的字每 0.05s 换一个；镜头摇是"快—慢—快—慢"四段，点眼睛那会儿几乎停住
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Grain} from '../../../assets/lib/helpers/polish';
import {GroupContract, checkContract, checkInputs, outputDuration, planExtras, toSource} from '../../../assets/lib/helpers/groupClock';
import {Hand, SANS, clamp, easeInOut, easeOut, mix, mk} from '../_kit/darkUiKit';

const FPS = 30;
const T0 = 73.4;

export const DECODE_WORD_PASSWORD_FIELD_CONTRACT: GroupContract = {
  sourceDuration: 5.88,
  fps: 30,
  motion: [[0, 1.3], [1.4, 1.85], [1.95, 5.8]],
  holds: [{at: 1.35, maxExtra: 1.0}, {at: 1.9, maxExtra: 1.0}, {at: 5.85, maxExtra: 1.0}],
  landmarks: {move: 0.05, scramble: 0.65, decoded: 1.3, type: 1.5, strip: 2.0, field: 2.3, click: 4.15, stars: 4.22},
  sfx: [
    {at: 'scramble', type: '故障', note: '乱码 glitch 连串', tail: 0.6, volume: 0.35},
    {at: 'decoded', type: '提示音', note: '解开 ding', volume: 0.3},
    {at: 'type', type: '键盘', note: '键盘敲字', tail: 0.3, volume: 0.3},
    {at: 'field', type: '运镜', note: '横移 whoosh', tail: 0.4, volume: 0.35},
    {at: 'click', type: '点击', note: '点击 click', volume: 0.4},
    {at: 'stars', type: '吸入', note: '遮住 soft swish', volume: 0.3},
  ],
  inputs: {lead1: {maxChars: 4}, lead2: {maxChars: 3}, local: {maxChars: 3}, secure: {maxChars: 3}, brand: {maxChars: 7}, mid: {maxChars: 4}, ai: {maxChars: 2}, field: {maxChars: 9}},
};

export type DwpfInputs = {lead1: string; lead2: string; local: string; secure: string; brand: string; mid: string; ai: string; field: string};
export const DWPF_DEFAULT_INPUTS: DwpfInputs = {lead1: '一切都在', lead2: '运行', local: '本地，', secure: '加密', brand: 'Nimbo', mid: '不会让', ai: 'AI', field: '读取你的所有密码'};
export const checkDwpfInputs = (x: DwpfInputs) => checkInputs(DECODE_WORD_PASSWORD_FIELD_CONTRACT, x);
export const planDwpf = (sec: number) => planExtras(DECODE_WORD_PASSWORD_FIELD_CONTRACT, sec);
export const dwpfFrames = (extras: number[]) => Math.round(outputDuration(DECODE_WORD_PASSWORD_FIELD_CONTRACT, extras) * FPS);
export const DECODE_WORD_PASSWORD_FIELD_DURATION = 176;

const FS = 124;
const GLYPHS = '9,:GRPB$T#%&@0Z7Q密钥码锁@#9:,';
const FIELD_X = [[75.62, 2000], [75.75, 1850], [76.0, 800], [76.5, 624], [76.95, 100], [77.3, -70], [77.55, -116], [77.75, -144], [78.3, -616], [79.15, -680], [79.3, -690]];
const AI_X = [[75.55, 1360], [75.75, 1324], [76.0, 580], [76.5, 436], [76.95, -90], [77.3, -260]];
const FIELD_W = 1760;

const Drive: React.FC<{size: number}> = ({size}) => (
  <svg width={size} height={size} viewBox="2 2 20 20" fill="none" stroke="#111" strokeWidth={1.9} strokeLinecap="round"><rect x="3" y="4.5" width="18" height="15" rx="3" /><path d="M3 12h18" /><circle cx="7" cy="8.3" r="0.6" fill="#111" /><circle cx="7" cy="15.8" r="0.6" fill="#111" /></svg>
);
const Eye: React.FC<{size: number; off: boolean}> = ({size, off}) => (
  <svg width={size} height={size} viewBox="1.5 1.5 21 21" fill="none" stroke="#7d7d7d" strokeWidth={1.6} strokeLinecap="round">
    <path d="M2.5 12s3.5-6.5 9.5-6.5S21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" /><circle cx="12" cy="12" r="3" />
    {off && <path d="M4 3.5l16 17" stroke="#7d7d7d" strokeWidth={2} />}
  </svg>
);

export const DecodeWordPasswordFieldGroup: React.FC<{inputs?: DwpfInputs; extras?: number[]}> = ({inputs = DWPF_DEFAULT_INPUTS, extras = [0, 0, 0]}) => {
  const t = useCurrentFrame() / FPS;
  const s = toSource(t, DECODE_WORD_PASSWORD_FIELD_CONTRACT, extras);
  const lag = t - s;
  const T = s + T0;
  const cam = 1 + 0.004 * lag;
  const txt: React.CSSProperties = {position: 'absolute', fontSize: FS, fontWeight: 600, lineHeight: `${FS * 1.2}px`, color: '#111', whiteSpace: 'pre'};
  const W = (x: string) => [...x].length * FS;
  const els: React.ReactNode[] = [];

  // ── 拍 1：本地 + 乱码 ──
  if (T < 74.95) {
    const fadeOld = 1 - clamp((T - 73.4) / 0.1);
    if (fadeOld > 0) {
      els.push(<div key="l1" style={{...txt, left: 456, top: 570 - FS * 0.92, opacity: fadeOld}}>{inputs.lead1}</div>);
      els.push(<div key="l2" style={{...txt, left: 340, top: 720 - FS * 0.92, opacity: fadeOld}}>{inputs.lead2}</div>);
    }
    const iconS = 118, gap1 = 30, gap2 = 40;
    const secW = W(inputs.secure);
    const finalW = iconS + gap1 + W(inputs.local) + gap2 + secW;
    const fx = 960 - finalW / 2;
    const mv = easeInOut((T - 73.45) / 0.6);
    const x = mix(1030, fx, mv), b = mix(mk(T, [[73.35, 720], [73.5, 624]]), 580, mv);
    const lineOp = 1 - clamp((T - 74.85) / 0.08);
    els.push(<div key="ic" style={{position: 'absolute', left: x, top: b - FS * 0.82, opacity: lineOp}}><Drive size={iconS} /></div>);
    els.push(<div key="lo" style={{...txt, left: x + iconS + gap1, top: b - FS * 0.92, opacity: lineOp}}>{inputs.local}</div>);
    if (T >= 74.05) {
      const sec = [...inputs.secure];
      // 乱码比正字多两个，先整串乱码，再从左到右解开、多余的收掉
      const extra = 2;
      const total = sec.length + extra;
      const shown = Array.from({length: total}, (_, i) => {
        const solveAt = 74.15 + i * (0.5 / total);
        if (i < sec.length && T >= solveAt + 0.05) return sec[i];
        if (i >= sec.length && T >= 74.62) return '';
        const k = Math.floor((T - 74.05) / 0.05) * 7 + i * 13;
        return GLYPHS[k % GLYPHS.length];
      }).join('');
      els.push(<div key="sc" style={{...txt, left: x + iconS + gap1 + W(inputs.local) + gap2, top: b - FS * 0.92, opacity: lineOp, fontFamily: `${SANS}`}}>{shown}</div>);
    }
  }
  // ── 拍 2：Nimbo 不会让 AI ──
  if (T >= 74.9 && T < 77.4) {
    const words = [inputs.brand, inputs.mid, inputs.ai];
    const starts = [74.9, 75.02, 75.14];
    const gap = 40;
    let x = 446;
    const brandW = [...inputs.brand].length * FS * 0.6;
    const ws = [brandW, W(inputs.mid), [...inputs.ai].length * FS * 0.62];
    const midOp = 1 - clamp((T - 75.4) / 0.1);
    const brandOp = 1 - clamp((T - 75.55) / 0.1);
    const brandShift = -46 * easeInOut((T - 75.4) / 0.15);
    words.forEach((w, i) => {
      const u = T - starts[i];
      if (u < 0) { x += ws[i] + gap; return; }
      const op = clamp(u / 0.05) * (i === 0 ? brandOp : i === 1 ? midOp : 1);
      const xx = i === 2 && T >= 75.55 ? mk(T, AI_X) : x + (i === 0 ? brandShift : 0);
      if (op > 0) els.push(<div key={`w${i}`} style={{...txt, left: xx, top: 590 - FS * 0.92, opacity: op, letterSpacing: i === 0 ? -2 : 0}}>{w}</div>);
      x += ws[i] + gap;
    });
  }
  // ── 拍 3：输入框 ──
  if (T >= 75.62) {
    const fx = mk(T, FIELD_X);
    const clicked = T >= 77.62;
    const stars = '＊'.repeat(14); // 星号个数固定，保证停在眼睛左边
    els.push(
      <div key="fd" style={{position: 'absolute', left: fx, top: 440, width: FIELD_W, height: 196, borderRadius: 42, background: '#fff', boxShadow: '0 0 0 1.5px #ececec, 0 40px 80px rgba(0,0,0,0.07), 0 12px 24px rgba(0,0,0,0.04)'}}>
        <div style={{position: 'absolute', left: 44, top: 98 - FS * 0.6, fontSize: clicked ? FS * 0.66 : FS * 1.04, lineHeight: `${FS * 1.2}px`, color: '#7f7f7f', whiteSpace: 'pre', letterSpacing: clicked ? FS * 0.16 : 0, marginTop: clicked ? FS * 0.08 : 0}}>{clicked ? stars : inputs.field}</div>
        <div style={{position: 'absolute', left: 1650 - 62, top: 98 - 62}}><Eye size={124} off={clicked} /></div>
      </div>
    );
    if (T >= 77.1 && T < 78.05) {
      const hx = mk(T, [[77.1, 1600], [77.3, 1570], [77.55, 1534], [77.75, 1540], [78.05, 1480]]);
      const hy = mk(T, [[77.1, 860], [77.3, 780], [77.55, 545], [77.75, 560], [78.05, 640]]);
      els.push(<Hand key="hd" x={hx} y={hy} h={220} opacity={clamp((T - 77.1) / 0.08) * (1 - clamp((T - 77.85) / 0.15))} press={T > 77.5 && T < 77.66 ? 1 : 0} />);
    }
  }

  return (
    <AbsoluteFill style={{background: '#fff', overflow: 'hidden', fontFamily: SANS}}>
      <div style={{position: 'absolute', inset: 0, transform: `scale(${cam})`, transformOrigin: '960px 540px'}}>{els}</div>
      <Grain opacity={0.015} blend="multiply" />
    </AbsoluteFill>
  );
};

if (checkContract(DECODE_WORD_PASSWORD_FIELD_CONTRACT).length) throw new Error(checkContract(DECODE_WORD_PASSWORD_FIELD_CONTRACT).join('；'));
export const DecodeWordPasswordField: React.FC = () => <DecodeWordPasswordFieldGroup />;
