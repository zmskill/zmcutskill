// 【镜头组】circle-train-ask-study：米白底，橙色大圆里一行行冒出字 → 圆往左让、右边挤出一串越来越窄的椭圆，颜色从右往左换成蓝 →
//   蓝圆「以及为什么」→ 圆缩成一个箭头按钮，左边浮出输入框，逐字打一个问题，鼠标点发送，一圈圈胶囊涟漪往外扩 →
//   按钮长成蓝圆、右边挤出椭圆 → 两个蓝圆：左边是调研名，右边是问题卡，问题卡一张张往上换（041-B 一串，产品演示）
// 学的动作（SkaleSolutions · ListenLabs 13.8–22.8s，30fps 逐帧量过，2026-11-21）：
//   13.8 橙圆 d984 在中间，三行白字 13.8 / 13.9 / 14.0 依次出（字号 ≈105）；14.4–14.85 圆往左挪到 x48–1032，右边挤出椭圆（宽 471 / 234 / 90 / 一条蓝细线）
//   14.95–15.3 颜色从右往左换成蓝、字没了；15.3 变成左边四个椭圆 + 右边蓝圆「以及为什么」（15.6 圆心 1447，837×981；左椭圆宽 207 / 294 / 459）
//   15.6–15.9 左边椭圆收掉；16.0「以及」淡掉只剩「为什么」；16.1–16.5 圆缩成右边的黑色箭头按钮（d90，在 x1620），左边浮出占位字
//   16.8–17.1 输入框描边画一圈（135–1746 × 411–651）；17.33–18.1 逐字打问题；18.1 鼠标从下面进来、18.4 点按钮
//   18.45–19.2 胶囊外面 8 圈细线往外扩，输入框变高、字变小（像镜头拉远）；19.3 字淡掉，只剩按钮小点
//   19.45–19.75 小点长成蓝圆（d≈820，圆心 1270），右边挤出细椭圆；20.2–20.5 变成两个蓝圆（左 105–936、右 939–1764），左圆逐字打调研名
//   右圆是问题卡（小字：第几部分、Q 几、问题）；20.95–21.25、21.55–21.85 右圆往上滑走、下一张从下面滑上来；22.55 两个圆一起往上滑走
// 我们的内容：虚构产品「听见」的调研演示（中文问题），右下角标"虚构 · 仅作演示"。
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {GroupContract, checkContract, checkInputs, outputDuration, planExtras, toSource} from '../../../assets/lib/helpers/groupClock';

const FPS = 30;
const S0 = 13.8;
const CREAM = '#f7f2e8', BLUE = '#0a1fc4', ORANGE = '#d99a22';
const SANS = '"Inter","PingFang SC","Noto Sans CJK SC","Noto Sans SC",sans-serif';
const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const mix = (a: number, b: number, k: number) => a + (b - a) * k;
const eo = (u: number) => 1 - Math.pow(1 - clamp(u), 3);
const ei = (u: number) => Math.pow(clamp(u), 2.2);
const eio = (u: number) => { const x = clamp(u); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
const kf = (t: number, K: number[][], e: (u: number) => number = eio) => {
  if (t <= K[0][0]) return K[0][1];
  for (let i = 1; i < K.length; i++) if (t <= K[i][0]) { const [a, va] = K[i - 1], [b, vb] = K[i]; return va + (vb - va) * e((t - a) / (b - a)); }
  return K[K.length - 1][1];
};
const mixC = (a: string, b: string, k: number) => { const p = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)); const A = p(a), B = p(b); return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * clamp(k))).join(',')})`; };
export const CIRCLE_TRAIN_ASK_CONTRACT: GroupContract = {
  sourceDuration: 270 / 30,
  fps: 30,
  motion: [[0, 0.5], [0.6, 2.25], [2.45, 6.95], [7.05, 7.6], [7.7, 270 / 30]],
  holds: [{at: 0.55, maxExtra: 1}, {at: 2.35, maxExtra: 1}, {at: 7.0, maxExtra: 1}, {at: 7.65, maxExtra: 1}],
  landmarks: {lines: 0, train: 0.6, swap: 1.15, why: 1.6, button: 2.3, box: 3.0, type: 3.53, click: 4.6, rings: 4.65, grow: 5.65, study: 6.4, q2: 7.15, q3: 7.75, out: 8.75},
  sfx: [
    {at: 'train', type: '短甩', note: '挤压 swoosh', volume: 0.35},
    {at: 'button', type: '弹出', note: '收缩 pop', volume: 0.3},
    {at: 'type', type: '键盘', note: '一串打字', tail: 0.8, volume: 0.3},
    {at: 'click', type: '点击', note: '点击 click', volume: 0.45},
    {at: 'rings', type: '闪光', note: '扩散 ripple', volume: 0.35},
    {at: 'q2', type: '翻页', note: '翻页 swish', volume: 0.3}, {at: 'q3', type: '翻页', note: '翻页 swish', volume: 0.3},
  ],
  inputs: {ask: {maxChars: 16}, study: {maxChars: 10}},
};
export type CircleAskInputs = {lines: string[]; why: [string, string]; placeholder: string; ask: string; study: string; section: string; qs: string[]; note: string};
export const CIRCLE_ASK_DEFAULT_INPUTS: CircleAskInputs = {lines: ['还会告诉你', '想要', '他们想要什么'], why: ['以及', '为什么'], placeholder: '输入你的问题…', ask: '年轻人怎么看 AI 助手？', study: '年轻人 AI 使用调研', section: '第 1 部分 · AI 使用背景', qs: ['回想你上一次用 AI 工具，当时想做什么？', '你最常用 AI 做哪类事？为什么？', '你怎么形容自己和 AI 助手的情感联系？'], note: '虚构 · 仅作演示'};
export const checkCircleAskInputs = (x: CircleAskInputs) => checkInputs(CIRCLE_TRAIN_ASK_CONTRACT, {ask: x.ask, study: x.study});
export const planCircleAsk = (sec: number) => planExtras(CIRCLE_TRAIN_ASK_CONTRACT, sec);
export const circleAskFrames = (extras: number[]) => Math.round(outputDuration(CIRCLE_TRAIN_ASK_CONTRACT, extras) * FPS);
export const CIRCLE_TRAIN_ASK_DURATION = 270;

const E: React.FC<{cx: number; cy: number; w: number; h: number; bg: string; children?: React.ReactNode}> = ({cx, cy, w, h, bg, children}) => w < 1 ? null : (
  <div style={{position: 'absolute', left: cx - w / 2, top: cy - h / 2, width: w, height: h, borderRadius: '50%', background: bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', color: '#fff', fontFamily: SANS, textAlign: 'center'}}>{children}</div>
);

export const CircleTrainAskStudyGroup: React.FC<{inputs?: CircleAskInputs; extras?: number[]}> = ({inputs: x = CIRCLE_ASK_DEFAULT_INPUTS, extras = [0, 0, 0, 0]}) => {
  const tt = useCurrentFrame() / FPS;
  const s = toSource(tt, CIRCLE_TRAIN_ASK_CONTRACT, extras) + S0;
  const els: React.ReactNode[] = [];
  const D = 984;
  if (s < 15.3) {
    // 橙圆 + 右边挤出的椭圆串
    const shift = eio((s - 14.4) / 0.45);
    const cx = mix(960, 540, shift) + kf(s, [[14.95, 0], [15.15, -11]]);
    const sw = clamp((s - 14.95) / 0.35); // 颜色从右往左换
    const lw = [kf(s, [[14.45, 0], [14.7, 471], [15.15, 480]]), kf(s, [[14.55, 0], [14.8, 234], [15.15, 204]]), kf(s, [[14.65, 0], [14.85, 90], [15.15, 144]]), kf(s, [[14.75, 0], [14.85, 10], [15.15, 48]])];
    let edge = cx + D / 2;
    const cols = [0.75, 0.5, 0.25, 0].map((th) => clamp((sw - th) / 0.25));
    const txt = s < 15.05 ? 1 : 0;
    els.push(<E key="c" cx={cx} cy={540} w={D} h={D} bg={mixC(ORANGE, BLUE, clamp((sw - 0.98) * 50))}>
      {txt > 0 && x.lines.map((l, i) => <div key={i} style={{fontSize: 104, lineHeight: 1.1, fontWeight: i === 1 && s > 14.02 && Math.floor(s * 12) % 2 === 0 ? 700 : 500, opacity: s >= 13.8 + i * 0.1 ? 1 : 0}}>{l}</div>)}
      {s >= 15.05 && s < 15.15 && <div style={{fontSize: 104}}>{x.lines[2]}</div>}
    </E>);
    lw.forEach((w, i) => { if (w > 1) { els.push(<E key={'e' + i} cx={edge + w / 2 + 3} cy={540} w={w} h={D} bg={i === 3 ? BLUE : mixC(ORANGE, BLUE, cols[i])} />); edge += w + 6; } });
  } else if (s < 16.75) {
    // 蓝圆「以及为什么」+ 左边椭圆收掉 → 圆缩成按钮
    const L = [kf(s, [[15.3, 220], [15.6, 207], [15.9, 0]]), kf(s, [[15.3, 220], [15.6, 294], [15.85, 0]]), kf(s, [[15.3, 200], [15.6, 459], [15.8, 0]])];
    const ccx = kf(s, [[15.3, 1560], [15.6, 1447], [16.0, 1395], [16.25, 1395], [16.35, 1430], [16.5, 1560], [16.7, 1620]]);
    const cw = kf(s, [[15.3, 300], [15.45, 760], [15.6, 837], [16.0, 940], [16.25, 940], [16.35, 820], [16.45, 360], [16.55, 180], [16.7, 90]]);
    const ch = kf(s, [[15.3, 981], [15.6, 981], [16.0, 940], [16.25, 940], [16.35, 820], [16.45, 360], [16.55, 180], [16.7, 90]]); /* 对同帧：16.25 还是大圆「为什么」，16.35 才开始缩 */
    let edge = ccx - cw / 2 - 6;
    [2, 1, 0].forEach((i) => { const w = L[i]; if (w > 1) { els.push(<E key={'l' + i} cx={edge - w / 2} cy={540} w={w} h={981} bg={i === 0 && s < 15.45 ? mixC('#5a3a8a', BLUE, (s - 15.3) / 0.15) : BLUE} />); edge -= w + 6; } });
    const btn = clamp((s - 16.5) / 0.2);
    els.push(<E key="w" cx={ccx} cy={540} w={cw} h={ch} bg={mixC('#0a1fc4', '#111111', btn)}>
      {s < 16.38 && <div style={{fontSize: 110, whiteSpace: 'nowrap'}}><span style={{opacity: 1 - clamp((s - 15.9) / 0.12)}}>{x.why[0]}</span> <span style={{fontWeight: s > 15.62 ? 700 : 500, opacity: s > 16.0 ? mix(0.45, 0.06, clamp((s - 16.0) / 0.3)) : 1}}>{x.why[1]}</span></div>}
      {s > 16.48 && <div style={{fontSize: 56, color: '#fff', opacity: clamp((s - 16.48) / 0.08)}}>→</div>} {/* 原片 16.6 箭头已经清楚 */}
    </E>);
    if (s > 16.35) els.push(<div key="ph" style={{position: 'absolute', left: 230, top: 540, transform: 'translateY(-50%)', fontFamily: SANS, fontSize: 64, color: '#222', opacity: clamp((s - 16.35) / 0.2)}}>{x.placeholder}</div>);
  } else if (s < 19.33) {
    // 输入框
    const draw = clamp((s - 16.8) / 0.3);
    const A = Array.from(x.ask), n = Math.floor(clamp((s - 17.27) / 0.6) * A.length + 0.001);
    const zoom = eo((s - 18.45) / 0.75); // 点了之后像镜头拉远：框变高、字变小
    const fs = mix(64, 42, zoom) * (s > 19.05 ? mix(1, 0.9, clamp((s - 19.05) / 0.3)) : 1);
    const pw = s < 18.42 ? 1611 : kf(s, [[18.42, 1611], [18.5, 1525], [18.6, 1550], [18.7, 1600], [18.8, 1650], [18.9, 1825]]), ph = s < 18.42 ? 240 : kf(s, [[18.42, 240], [18.5, 300], [18.6, 440], [18.7, 785], [18.8, 815], [18.9, 935], [19.33, 960]]), pl = 945 - pw / 2; /* 对同帧：点了以后框一下子变很高（18.7 已经 785），涟漪被挤出画面 */
    const fade = 1 - clamp((s - 19.1) / 0.13);
    const lineO = 1 - clamp((s - 18.9) / 0.1);
    // 描边按周长画出来
    const per = 2 * (pw - ph) + Math.PI * ph;
    els.push(<svg key="box" width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
      <rect x={pl} y={540 - ph / 2} width={pw} height={ph} rx={ph / 2} fill="none" stroke="#111" strokeWidth={3} strokeDasharray={`${per * draw} ${per}`} opacity={lineO} />
      {s > 18.45 && Array.from({length: 8}, (_, i) => { const gap = (i + 1) * 27 * eo((s - 18.42 - i * 0.012) / 0.12); const a = (1 - clamp((s - 18.85) / 0.15)); return <rect key={i} x={pl - gap} y={540 - ph / 2 - gap} width={pw + gap * 2} height={ph + gap * 2} rx={ph / 2 + gap} fill="none" stroke="#111" strokeWidth={2} opacity={a * clamp((s - 18.45 - i * 0.02) / 0.06)} />; })}
    </svg>);
    const txtX = s < 18.42 ? pl + 70 : kf(s, [[18.42, pl + 70], [18.6, 375], [18.9, 525], [19.2, 560]]);
    els.push(<div key="tx" style={{position: 'absolute', left: txtX, top: 540, transform: 'translateY(-50%)', fontFamily: SANS, fontSize: fs, color: s < 17.33 ? `rgba(34,34,34,${1 - clamp((s - 17.1) / 0.2)})` : '#111', whiteSpace: 'nowrap', opacity: fade, display: 'flex', alignItems: 'center'}}>
      {s < 17.33 ? x.placeholder : A.slice(0, n).join('')}{s >= 17.33 && s < 18.4 && <span style={{width: 4, height: fs * 1.05, background: '#1d2fd0', marginLeft: 3}} />}
    </div>);
    const bx = kf(s, [[18.42, 1620], [18.6, 1495], [18.9, 1350], [19.2, 1330]]), bd = kf(s, [[18.42, 90], [18.6, 70], [18.9, 50]]);
    els.push(<div key="bt" style={{position: 'absolute', left: bx - bd / 2, top: 540 - bd / 2, width: bd, height: bd, borderRadius: '50%', background: '#111', color: '#fff', fontSize: bd * 0.6, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>→</div>);
    if (s > 18.05 && s < 19.0) { // 鼠标
      const mx = kf(s, [[18.05, 1780], [18.35, 1640]]), my = kf(s, [[18.05, 900], [18.35, 590]]);
      const press = s > 18.38 && s < 18.48 ? 0.85 : 1;
      els.push(<svg key="ms" width={70} height={90} viewBox="0 0 24 30" style={{position: 'absolute', left: mx, top: my, transform: `scale(${press})`}}><path d="M2 2 L2 24 L8 18 L12 28 L16 26 L12 17 L20 17 Z" fill="#fff" stroke="#111" strokeWidth={1.4} strokeLinejoin="round" /></svg>);
    }
  } else {
    // 按钮长成蓝圆 → 两个蓝圆 + 问题卡
    const d1 = kf(s, [[19.33, 50], [19.4, 90], [19.47, 190], [19.53, 390], [19.6, 635], [19.67, 770], [19.73, 820], [20.53, 830]]);
    const c1x = kf(s, [[19.33, 1330], [19.6, 1355], [19.67, 1360], [19.73, 1330], [19.8, 1170], [19.87, 790], [19.93, 590], [20.0, 525], [20.53, 520]]);
    const W1 = kf(s, [[19.73, 0], [19.8, 85], [19.87, 280], [19.93, 370], [20.0, 410], [20.33, 410], [20.4, 615], [20.47, 810], [20.53, 825]]);
    const up = -ei((s - 22.42) / 0.3) * 1300;
    const cy = 528 + up;
    els.push(<E key="c1" cx={c1x} cy={cy} w={d1} h={d1 * 1.0} bg={s < 19.36 ? '#111111' : s < 19.47 ? mixC('#0a1a80', BLUE, (s - 19.4) / 0.07) : BLUE}>{s > 20.2 && <div style={{fontSize: 62, whiteSpace: 'nowrap'}}>{Array.from(x.study).slice(0, Math.floor(clamp((s - 20.2) / 0.32) * Array.from(x.study).length + 0.001)).join('')}</div>}</E>);
    if (s > 19.73 && s < 20.47) { // 右边一串越来越窄的椭圆（每个约是前一个的一半），第一个之后长成问题圆
      let edge = c1x + d1 / 2 + 8 + W1 + 8;
      const k = 1 - clamp((s - 20.3) / 0.12);
      for (let i = 1; i < 7; i++) { const w = W1 * Math.pow(0.47, i) * k; if (w > 1) { els.push(<E key={'t' + i} cx={edge + w / 2} cy={cy} w={w} h={830} bg={BLUE} />); edge += w + 8; } }
      if (s < 20.2) els.push(<E key="t0" cx={c1x + d1 / 2 + 8 + W1 / 2} cy={cy} w={W1} h={830} bg={BLUE} />);
    }
    if (s >= 20.2) {
      const QT = [20.2, 21.0, 21.6];
      x.qs.forEach((q, i) => {
        const inK = i === 0 ? 1 : eio((s - QT[i]) / 0.45);
        const outK = i < 2 ? eio((s - QT[i + 1]) / 0.45) : 0;
        if (inK <= 0 || outK >= 1) return;
        const qy = i === 0 ? cy : mix(1500, cy, inK);
        const qx = i === 0 && s < 20.53 ? c1x + d1 / 2 + 8 + W1 / 2 : 1351;
        const y2 = mix(qy, -500, outK);
        const w = i === 0 && s < 20.53 ? W1 : 825;
        els.push(<E key={'q' + i} cx={qx} cy={y2} w={w} h={i === 0 ? mix(830, 825, inK) : 825} bg={BLUE}>
          <div style={{opacity: clamp((s - QT[i] - 0.25) / 0.2), fontSize: 22, width: 560}}>
            <div style={{opacity: 0.85}}>{x.section.replace('1', String(i + 1))}</div>
            <div style={{display: 'inline-block', margin: '18px 0', padding: '4px 16px', borderRadius: 14, background: '#fff', color: BLUE, fontSize: 20, fontWeight: 700}}>Q{i + 1}</div>
            <div style={{fontSize: 30, lineHeight: 1.45}}>{q}</div>
          </div>
        </E>);
      });
    }
  }
  return (
    <AbsoluteFill style={{background: CREAM, overflow: 'hidden'}}>
      {els}
      <div style={{position: 'absolute', right: 36, bottom: 26, fontFamily: SANS, fontSize: 20, color: 'rgba(60,50,40,0.45)', letterSpacing: '0.06em'}}>{x.note}</div>
    </AbsoluteFill>
  );
};

if (checkContract(CIRCLE_TRAIN_ASK_CONTRACT).length) throw new Error(checkContract(CIRCLE_TRAIN_ASK_CONTRACT).join('；'));
export const CircleTrainAskStudy: React.FC = () => <CircleTrainAskStudyGroup />;
