// 【镜头组】amount-split-pill-tags：白底超大金额 → 亮黄方块一格格铺满、数字一边缩小一边拉开 → 黄底褪成浅黄再褪白 →
//   四个绿色金额胶囊（带头像圆）带着虚焦落进数字缝里，像素光标点一下其中一个、再滑到右下那个上悬停发光（035-B 一拍，数据 / 场景演示）
// 学的动作（Varcyyyy · Venmo 2.0–3.72s，30fps 逐帧量过，2026-11-21）：
//   各位数字中心 x（$/3/4/7）和字高（大写高度）：2.1 450/885/1280/1660 · 540 → 2.25 383/803/1215/1583 · 525 → 2.33 285/780/1240/1650 · 480
//   → 2.4 240/742/1237/1687 · 330 → 2.55 300/757/1207/1627 · 225 → 2.7 345/772/1185/1582 · 195 → 2.85 397/787/1170/1537 · 180 → 2.95 480/817/1147/1465 · 160 → 3.2 510/832/1140/1440 · 150 → 3.72 525/832/1140/1432 · 140
//   2.3–2.55 亮黄方块（480 宽一格）一格格冒出来铺满，2.6 起褪成浅黄，2.9 褪白；2.1–2.2 左边还留着上一拍的一截蓝条
//   胶囊 2.73 / 2.75 / 2.77 / 2.8 一个个落下来（先大、虚焦，0.15s 落定变清楚），落定中心 (592,382) (1087,403) (847,661) (1404,642)，高 105、宽 345
//   2.8 像素光标从左上进来，2.95 点在左下那个胶囊上（按一下），3.1 滑到右下那个上，悬停时那个胶囊变大一点，3.55 起外面一圈绿光
// 我们的内容：「¥347」拆开，胶囊写「¥87.00」，头像按原片要求换成图形（彩色圆 + 字母），右下角标"虚构 · 仅作演示"。
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {GroupContract, checkContract, checkInputs, outputDuration, planExtras, toSource} from '../../../assets/lib/helpers/groupClock';

const FPS = 30;
const S0 = 2.0;
const BLUE = '#1296f2';
const SANS = '"Inter","PingFang SC","Noto Sans CJK SC","Noto Sans SC",sans-serif';
const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const eo = (u: number) => 1 - Math.pow(1 - clamp(u), 3);
const lin = (t: number, K: number[][], j = 1) => {
  if (t <= K[0][0]) return K[0][j];
  for (let i = 1; i < K.length; i++) if (t <= K[i][0]) { const a = K[i - 1], b = K[i]; return a[j] + (b[j] - a[j]) * (t - a[0]) / (b[0] - a[0]); }
  return K[K.length - 1][j];
};
const hash = (n: number) => { const v = Math.sin(n * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };
// t, $, 3, 4, 7, 字高
const DIG = [[2.0, 470, 905, 1300, 1680, 548], [2.1, 450, 885, 1280, 1660, 540], [2.25, 383, 803, 1215, 1583, 525], [2.33, 285, 780, 1240, 1650, 480], [2.4, 240, 742, 1237, 1687, 330], [2.55, 300, 757, 1207, 1627, 225], [2.7, 345, 772, 1185, 1582, 195], [2.85, 397, 787, 1170, 1537, 180], [2.95, 480, 817, 1147, 1465, 160], [3.2, 510, 832, 1140, 1440, 150], [3.72, 525, 832, 1140, 1432, 140]];
const PILLS = [{at: 2.73, x: 592, y: 382, x0: 480, y0: 338}, {at: 2.77, x: 1087, y: 403, x0: 1110, y0: 360}, {at: 2.75, x: 847, y: 661, x0: 802, y0: 690}, {at: 2.8, x: 1404, y: 642, x0: 1500, y0: 668}];

export const AMOUNT_PILLS_CONTRACT: GroupContract = {
  sourceDuration: 52 / 30,
  fps: 30,
  motion: [[0, 1.2], [1.3, 1.72]],
  holds: [{at: 1.25, maxExtra: 1.5}],
  landmarks: {amount: 0, yellow: 0.3, pale: 0.6, pills: 0.73, click: 0.95, hover: 1.1, glow: 1.55},
  sfx: [
    {at: 'yellow', type: '轻tick', note: '方块 tick 一串', tail: 0.25, volume: 0.3},
    {at: 'pills', type: '弹出', note: '弹出 pop 一串', tail: 0.1, volume: 0.35},
    {at: 'click', type: '点击', note: '点击 click', volume: 0.4},
  ],
  inputs: {amount: {maxChars: 4}, tag: {maxChars: 7}},
};
export type AmountPillsInputs = {amount: string; tag: string; initials: string[]; note: string};
export const AMOUNT_PILLS_DEFAULT_INPUTS: AmountPillsInputs = {amount: '¥347', tag: '¥87.00', initials: ['L', 'W', 'Z', 'C'], note: '虚构 · 仅作演示'};
export const checkAmountPillsInputs = (x: AmountPillsInputs) => checkInputs(AMOUNT_PILLS_CONTRACT, {amount: x.amount, tag: x.tag});
export const planAmountPills = (sec: number) => planExtras(AMOUNT_PILLS_CONTRACT, sec);
export const amountPillsFrames = (extras: number[]) => Math.round(outputDuration(AMOUNT_PILLS_CONTRACT, extras) * FPS);
export const AMOUNT_PILLS_DURATION = 52;

const AV_COL = ['#ff8a3d', '#7a5cff', '#22b8a7', '#ff5c8a'];

export const AmountSplitPillTagsGroup: React.FC<{inputs?: AmountPillsInputs; extras?: number[]}> = ({inputs: x = AMOUNT_PILLS_DEFAULT_INPUTS, extras = [0]}) => {
  const tt = useCurrentFrame() / FPS;
  const s = toSource(tt, AMOUNT_PILLS_CONTRACT, extras) + S0;
  const held = tt - (s - S0);
  const els: React.ReactNode[] = [];
  // 背景：亮黄方块一格格铺满 → 浅黄 → 白
  const pale = clamp((s - 2.58) / 0.06), white = clamp((s - 2.75) / 0.17);
  if (s > 2.3 && white < 1) {
    for (let c = 0; c < 4; c++) for (let r = 0; r < 4; r++) {
      const at = 2.31 + hash(c * 7 + r * 3 + 1) * 0.22;
      if (s < at && pale <= 0) continue;
      els.push(<div key={`y${c}_${r}`} style={{position: 'absolute', left: c * 480, top: r * 270, width: 481, height: 271, background: pale > 0 ? `rgba(${250 + 3 * pale},${250 + 3 * pale},${20 + 205 * pale},${1 - white})` : '#fafa14'}} />);
    }
  }
  if (s < 2.22) els.push(<div key="bar" style={{position: 'absolute', left: 105, top: 375 + (s - 2.0) * 300, width: 129, height: 800, background: 'linear-gradient(180deg, #1296f2, #5ab6f6)', opacity: 1 - clamp((s - 2.15) / 0.07)}} />);
  // 数字
  const chars = Array.from(x.amount);
  const cap = lin(s, DIG, 5) * (1 - held * 0.01);
  chars.slice(0, 4).forEach((ch, i) => {
    const cx = lin(s, DIG, i + 1);
    els.push(<div key={'d' + i} style={{position: 'absolute', left: cx, top: lin(s, [[2.0, 540], [2.33, 525], [2.6, 535], [2.8, 540], [3.72, 515]]), transform: 'translate(-50%,-50%)', fontFamily: SANS, fontSize: cap / 0.72, fontWeight: 500, color: BLUE, lineHeight: 1, whiteSpace: 'nowrap'}}>{ch}</div>);
  });
  // 胶囊
  const hoverK = clamp((s - 3.1) / 0.12), glow = clamp((s - 3.55) / 0.15);
  PILLS.forEach((p, i) => {
    const u = clamp((s - p.at) / 0.2);
    if (s < p.at) return;
    const k = eo(u);
    const pressed = i === 2 && s > 2.92 && s < 3.02 ? 1.06 : 1;
    const hov = i === 3 ? 1 + 0.08 * hoverK : 1;
    const sc = (1.3 - 0.3 * k) * pressed * hov * lin(s, [[2.85, 1.3], [2.95, 1], [3.72, 0.98]]) / 1.0;
    const W = 345, H = 105;
    const cx = p.x0 + (p.x - p.x0) * eo((s - p.at) / 0.3), cy = p.y0 + (p.y - p.y0) * eo((s - p.at) / 0.3);
    els.push(
      <div key={'p' + i} style={{position: 'absolute', left: cx - W / 2, top: cy - H / 2, width: W, height: H, borderRadius: H / 2, transform: `scale(${sc * (s < p.at + 0.05 ? 0.5 + 10 * (s - p.at) : 1)})`, background: 'linear-gradient(100deg, #7cf28a 0%, #a8f257 55%, #d3f53a 100%)', boxShadow: i === 3 && glow > 0 ? `0 0 0 ${18 * glow}px rgba(170,245,120,${0.35 * glow}), 0 0 40px rgba(150,240,100,${0.5 * glow})` : '0 6px 18px rgba(120,200,60,0.25)', filter: u < 1 ? `blur(${10 * (1 - u)}px)` : undefined, display: 'flex', alignItems: 'center', gap: 18, paddingLeft: 18, boxSizing: 'border-box'}}>
        <div style={{width: 70, height: 70, borderRadius: '50%', background: AV_COL[i % 4], border: '3px solid #fff', boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: SANS, fontSize: 30, fontWeight: 700}}>{x.initials[i % x.initials.length]}</div>
        <div style={{fontFamily: SANS, fontSize: 50, fontWeight: 500, color: "#111", letterSpacing: '-0.01em'}}>{x.tag}</div>
      </div>,
    );
  });
  // 光标：2.8 像素光标从左上进来 → 2.95 点左下胶囊 → 3.1 滑到右下胶囊
  if (s > 2.8) {
    const mx = lin(s, [[2.8, 160], [2.85, 230], [2.95, 850], [3.02, 860], [3.15, 1440], [3.72, 1452]]);
    const my = lin(s, [[2.8, 40], [2.85, 110], [2.95, 650], [3.02, 655], [3.15, 690], [3.72, 700]]);
    const pix = s < 2.9;
    els.push(<svg key="cur" width={pix ? 96 : 72} height={pix ? 110 : 90} viewBox="0 0 24 30" style={{position: 'absolute', left: mx, top: my, transform: `scale(${s > 2.93 && s < 2.99 ? 0.85 : 1})`, transformOrigin: '0 0', shapeRendering: pix ? 'crispEdges' : undefined}}>
      {pix ? <path d="M2 2 H4 V4 H6 V6 H8 V8 H10 V10 H12 V12 H14 V14 H16 V16 H10 V18 H12 V22 H14 V26 H10 V22 H8 V18 H6 V20 H4 V22 H2 Z" fill="#fff" stroke="#111" strokeWidth={1.2} /> : <path d="M2 2 L2 24 L8 18 L12 28 L16 26 L12 17 L20 17 Z" fill="#fff" stroke="#111" strokeWidth={1.4} strokeLinejoin="round" />}
    </svg>);
  }
  return (
    <AbsoluteFill style={{background: '#fff', overflow: 'hidden'}}>
      {els}
      <div style={{position: 'absolute', right: 36, bottom: 26, fontFamily: SANS, fontSize: 20, color: 'rgba(30,60,100,0.4)', letterSpacing: '0.06em'}}>{x.note}</div>
    </AbsoluteFill>
  );
};

if (checkContract(AMOUNT_PILLS_CONTRACT).length) throw new Error(checkContract(AMOUNT_PILLS_CONTRACT).join('；'));
export const AmountSplitPillTags: React.FC = () => <AmountSplitPillTagsGroup />;
