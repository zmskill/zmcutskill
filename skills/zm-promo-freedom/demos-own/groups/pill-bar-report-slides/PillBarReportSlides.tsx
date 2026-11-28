// 【镜头组】pill-bar-report-slides：米白底一个细线小胶囊撑大 → 蓝色圆从左边滚进来填成蓝胶囊 → 上下夹着两个标签词、整条压扁成一根进度条 →
//   硬切：进度条就是报告页第一根柱子，报告页从很近拉远、往上滚走，两边标签跟着上去 → 一个词居中、劈成两个、中间拉出一道橙线 →
//   橙线撑成一块渐变方块，一排卡片从左边猛甩进来再慢慢减速滑 → 硬切一张渐变大卡（041-E 一拍，产品三种输出）
// 学的动作（SkaleSolutions · ListenLabs 38.0–44.0s，30fps 逐帧量过，2026-11-21）：
//   38.0 胶囊 294×203 居中 → 38.15 761×405 → 38.4 1116×557 → 38.65 1364×669；38.1 起蓝圆（直径=胶囊高）从左边滚进来，被胶囊裁成月牙，38.65 整圆贴左
//   38.8 两个「Memos」（字高 ≈88）贴在上下 270/810，压在蓝胶囊后面；胶囊变扁变宽：38.9 1583×419 → 39.15 1723×249 → 39.4 1767×184 → 39.65 1784×70
//   蓝色占比 0.49 → 0.70 → 0.74 → 0.89；39.4–39.65 外框变成灰底轨道，标签往中间收到 324/748
//   39.75 硬切报告页：第一根柱子正好接住进度条（宽 1784，y≈540）；内容宽 1784 → 39.88 1472 → 40.3 1119 → 40.7 912 → 41.0 802 → 41.4 762（先快后慢拉远）
//   40.25 两边「Memos」（字高 ≈46）从画外滑进来，慢慢往里收；40.8 起整页加速往上滚，41.1 标签先滚出去，41.7 卡片底边滚出画面
//   41.7 「Slides」（≈68）居中；42.0–42.5 劈成两个往两边走（中心距 ±516），中间橙线从 230 拉到 380
//   42.6 橙线撑成渐变方块（宽 494，高 140→430→600 越来越高），两个词各自上下分成四角（x ±695，y ±201→±274），字缩到 ≈44
//   42.62 一排卡片（451×257，间距 459）从左边猛甩进来，每帧位移 143→41→18（42.65→43.45 一路减速）再到 43.72 又加速到 46，原片有拖影
//   43.73 硬切一张渐变大卡（1420×856，金→红→蓝紫），慢慢放大到 1600
//   画面上下边一直有一行很小的栏目名，跟着段落换：INSIGHTS / MEMOS / SLIDES / HIGHLIGHTS
// 我们的内容：虚构研究「年轻人怎么看 AI 助手」（接 041-B），栏目「洞察 / 纪要 / 幻灯片 / 精彩集锦」，工具名都用泛称不用真实品牌，右下角标"虚构 · 仅作演示"。
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {GroupContract, checkContract, checkInputs, outputDuration, planExtras, toSource} from '../../../assets/lib/helpers/groupClock';

const FPS = 30;
const S0 = 38.0;
const CREAM = '#fbf3e8';
const BLUE = '#0418c3';
const SANS = '"Inter","PingFang SC","Noto Sans CJK SC","Noto Sans SC",sans-serif';
const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const eo = (u: number) => 1 - Math.pow(1 - clamp(u), 3);
const lin = (t: number, K: number[][]) => {
  if (t <= K[0][0]) return K[0][1];
  for (let i = 1; i < K.length; i++) if (t <= K[i][0]) { const [a, va] = K[i - 1], [b, vb] = K[i]; return va + (vb - va) * (t - a) / (b - a); }
  return K[K.length - 1][1];
};
// 卡片每帧位移（原片 phaseCorrelate 量的，42.65 起每 1/30s 一个；第一个值按 42.62 卡片位置校过）
const DX = [30, 142.8, 109.2, 89.5, 76.2, 66.2, 58.6, 52.1, 47.0, 40.9, 37.3, 34.1, 31.7, 29.6, 27.4, 25.9, 24.2, 22.8, 21.3, 20.8, 19.9, 19.1, 18.9, 18.5, 18.4, 18.7, 19.1, 20.0, 21.1, 23.7, 26.9, 33.1, 45.7];
const carouselX = (s: number) => {
  let x = -712.5;
  for (let i = 0; i < DX.length; i++) { const t1 = 42.65 + i / 30, t0 = t1 - 1 / 30; if (s >= t1) x += DX[i]; else if (s > t0) x += DX[i] * (s - t0) * 30; }
  return x;
};
const carouselV = (s: number) => DX[clamp(Math.round((s - 42.65) * 30), 0, DX.length - 1)];

export const PILL_REPORT_SLIDES_CONTRACT: GroupContract = {
  sourceDuration: 180 / 30,
  fps: 30,
  motion: [[0, 3.68], [4.0, 5.72]],
  holds: [{at: 3.85, maxExtra: 1}, {at: 5.86, maxExtra: 2}],
  landmarks: {pill: 0, blue: 0.1, labels: 0.8, report: 1.75, side: 2.25, slides: 3.7, split: 4.0, cards: 4.62, highlight: 5.73},
  sfx: [
    {at: 'blue', type: '短甩', note: '滚入 roll', volume: 0.35},
    {at: 'report', type: '轻tick', note: '切换 cut tick', volume: 0.35},
    {at: 'slides', type: '轻tick', note: '轻点 tick', volume: 0.3},
    {at: 'split', type: '短甩', note: '拉开 swish', volume: 0.3},
    {at: 'cards', type: '短甩', note: '甩动 whoosh', volume: 0.45},
    {at: 'highlight', type: '落版重击', note: '切换 cut hit', volume: 0.4},
  ],
  inputs: {memo: {maxChars: 4}, slide: {maxChars: 4}, deckTitle: {maxChars: 22}, reel: {maxChars: 6}},
};
export type PillReportInputs = {
  caps: string[]; memo: string; slide: string; reel: string; deckTitle: string; deckSub: string; note: string;
  bullet: string; heading: string; lead: string; q1: string; rows1: [string, number][]; lead2: string; q2: string; rows2: [string, number][]; tail: string;
};
export const PILL_REPORT_DEFAULT_INPUTS: PillReportInputs = {
  caps: ['洞察', '纪要', '幻灯片', '精彩集锦'], memo: '纪要', slide: '幻灯片', reel: '精彩集锦',
  deckTitle: '年轻人与 AI 助手：理解新一代的人机关系', deckSub: '探索 16–24 岁人群的看法、情感联结与使用习惯',
  bullet: '访谈对象：我们用视频访谈了 407 位 16–24 岁的参与者。',
  heading: '使用习惯与常用工具',
  lead: '使用频率：用 AI 已成习惯，69% 的人说自己今天或昨天用过。最近一次使用的分布如下。',
  q1: '你最近一次用 AI 工具是什么时候？',
  rows1: [['今天', 86], ['昨天', 34], ['2–3 天前', 15], ['4–7 天前', 9], ['一周以前', 6]],
  lead2: '最常用的工具：通用聊天助手占绝大多数，其次是搜索类和办公类助手。详见下方：',
  q2: '过去一个月用过的 AI 工具',
  rows2: [['聊天助手', 391], ['搜索助手', 342], ['办公助手', 255], ['绘图工具', 148], ['写作助手', 131], ['编程助手', 109]],
  tail: '主要用途：学习辅导、生活建议、写作、创作项目和工作任务排在前列。',
  note: '虚构 · 仅作演示',
};
export const checkPillReportInputs = (x: PillReportInputs) => checkInputs(PILL_REPORT_SLIDES_CONTRACT, {memo: x.memo, slide: x.slide, deckTitle: x.deckTitle, reel: x.reel});
export const planPillReport = (sec: number) => planExtras(PILL_REPORT_SLIDES_CONTRACT, sec);
export const pillReportFrames = (extras: number[]) => Math.round(outputDuration(PILL_REPORT_SLIDES_CONTRACT, extras) * FPS);
export const PILL_REPORT_SLIDES_DURATION = 180;

// 报告页：内容宽 1000 个单位，标题顶 = 0；第一根柱子中线 y 324（开头更粗 30，接住进度条后变细到 12）（对着前面的进度条）
const Report: React.FC<{x: PillReportInputs; th0?: number}> = ({x, th0 = 12}) => {
  const P = (top: number, fs: number, extra: React.CSSProperties = {}): React.CSSProperties => ({position: 'absolute', left: 0, top, width: 1000, fontSize: fs, lineHeight: 1.35, color: '#141414', ...extra});
  const Row = (top: number, label: string, v: number, max: number, pct: boolean, k: string, th = 12) => (
    <div key={k} style={{position: 'absolute', left: 0, top, width: 1000, height: 40}}>
      <div style={{position: 'absolute', left: 0, top: -2, fontSize: 18, color: '#222'}}>{label}</div>
      <div style={{position: 'absolute', right: 0, top: -2, fontSize: 18, color: BLUE}}>{v}{pct ? '%' : ''}{!pct && <span style={{display: 'inline-block', width: 11, height: 11, borderRadius: '50%', background: BLUE, marginLeft: 4, verticalAlign: -1}} />}</div>
      <div style={{position: 'absolute', left: 0, top: 28 - th / 2, width: 1000, height: th, borderRadius: th / 2, background: '#e4ded3'}} />
      <div style={{position: 'absolute', left: 0, top: 28 - th / 2, width: 1000 * v / max, height: th, borderRadius: th / 2, background: BLUE}} />
    </div>
  );
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: 1000, fontFamily: SANS}}>
      <div style={{position: 'absolute', left: -60, top: -520, width: 1120, height: 2074, border: '2px solid #2a2a2a', borderTop: 'none', borderRadius: '0 0 16px 16px', boxSizing: 'border-box', background: CREAM}} />
      <div style={P(-230, 22, {color: '#333'})}>· 研究方法：半结构化视频访谈，每人约 20 分钟，按年龄和城市分层抽样。</div>
      <div style={P(-121, 22)}>• {x.bullet}</div>
      <div style={P(-6, 40, {fontWeight: 500})}>{x.heading}</div>
      <div style={P(56, 24)}>{x.lead}</div>
      <div style={P(204, 22)}>{x.q1}</div>
      {x.rows1.map(([l, v], i) => Row(296 + i * 73, l, v, 100, true, 'a' + i, i === 0 ? th0 : 12))}
      <div style={P(706, 24)}>{x.lead2}</div>
      <div style={P(856, 20)}>{x.q2}</div>
      {x.rows2.map(([l, v], i) => Row(947 + i * 74, l, v, 410, false, 'b' + i))}
      <div style={P(1436, 20)}>{x.tail}</div>
    </div>
  );
};

const Card: React.FC<{x: PillReportInputs; left: number; op?: number}> = ({x, left, op = 1}) => (
  <div style={{position: 'absolute', left, top: 411, width: 451, height: 257, borderRadius: 14, border: '1.5px solid #3a3a3a', background: '#fcf4ec', overflow: 'hidden', boxSizing: 'border-box', opacity: op, fontFamily: SANS}}>
    <div style={{position: 'absolute', left: 0, top: 0, right: 0, height: 44, background: '#050505'}}>
      <div style={{position: 'absolute', left: 11, top: 11, height: 20, padding: '0 6px', border: '1px solid #ddd', borderRadius: 4, color: '#eee', fontSize: 12, lineHeight: '20px'}}>.pptx</div>
      <div style={{position: 'absolute', right: 12, top: 13, color: '#eee', fontSize: 12}}>2026.01.01</div>
    </div>
    <div style={{position: 'absolute', left: 23, top: 70, width: 400, fontSize: 26, lineHeight: 1.28, color: '#111'}}>{x.deckTitle}</div>
    <div style={{position: 'absolute', left: 23, top: 196, width: 400, fontSize: 16, lineHeight: 1.45, color: '#7a746c'}}>{x.deckSub}</div>
  </div>
);

export const PillBarReportSlidesGroup: React.FC<{inputs?: PillReportInputs; extras?: number[]}> = ({inputs: x = PILL_REPORT_DEFAULT_INPUTS, extras = [0, 0]}) => {
  const tt = useCurrentFrame() / FPS;
  const s = toSource(tt, PILL_REPORT_SLIDES_CONTRACT, extras) + S0;
  const held = tt - (s - S0);
  const els: React.ReactNode[] = [];
  const L = (fs: number, extra: React.CSSProperties = {}): React.CSSProperties => ({position: 'absolute', fontFamily: SANS, fontSize: fs, fontWeight: 500, color: '#0b0b0b', whiteSpace: 'nowrap', lineHeight: 1, transform: 'translate(-50%,-50%)', ...extra});
  const cap = s < 38.8 ? x.caps[0] : s < 41.7 ? x.caps[1] : s < 43.733 ? x.caps[2] : x.caps[3];

  if (s < 39.75) {
    // 胶囊 → 进度条
    const w = lin(s, [[38.0, 294], [38.15, 761], [38.4, 1116], [38.65, 1364], [38.9, 1583], [39.15, 1723], [39.4, 1767], [39.65, 1784]]);
    const h = lin(s, [[38.0, 203], [38.15, 405], [38.4, 557], [38.65, 669], [38.9, 419], [39.15, 249], [39.4, 184], [39.65, 70]]);
    const first = x.rows1[0][1] / 100;
    if (s >= 38.8) {
      const yt = lin(s, [[38.8, 272], [39.4, 262], [39.65, 316], [39.75, 326]]), yb = lin(s, [[38.8, 805], [39.4, 818], [39.65, 759], [39.75, 746]]);
      els.push(<div key="mt" style={L(88, {left: 960, top: yt})}>{x.memo}</div>);
      els.push(<div key="mb" style={L(88, {left: 960, top: yb})}>{x.memo}</div>);
    }
    const track = clamp((s - 39.4) / 0.22);
    let blue: React.ReactNode = null;
    if (s >= 38.1 && s < 38.65) {
      const v = lin(s, [[38.1, 0], [38.15, 0.15], [38.4, 0.79], [38.65, 1]]);
      blue = <div style={{position: 'absolute', left: -h + v * h, top: 0, width: h, height: h, borderRadius: '50%', background: BLUE}} />;
    } else if (s >= 38.65) {
      const fr = lin(s, [[38.65, 669 / 1364], [38.9, 0.70], [39.15, 0.73], [39.4, 0.74], [39.65, first], [39.75, first]]);
      blue = <div style={{position: 'absolute', left: 0, top: 0, width: fr * w, height: h, borderRadius: h / 2, background: BLUE}} />;
    }
    els.push(
      <div key="pill" style={{position: 'absolute', left: 960 - w / 2, top: 538 - h / 2, width: w, height: h, borderRadius: h / 2, overflow: 'hidden', background: `rgba(228,222,211,${track})`, boxShadow: `inset 0 0 0 1.5px rgba(70,70,70,${0.9 * (1 - track)})`}}>{blue}</div>,
    );
  } else if (s < 41.75) {
    // 报告页：拉远 + 往上滚
    const sc = lin(s, [[39.75, 1.784], [39.78, 1.64], [39.82, 1.576], [39.85, 1.516], [39.88, 1.472], [40.0, 1.345], [40.2, 1.212], [40.3, 1.119], [40.4, 1.045], [40.5, 0.993], [40.7, 0.912], [40.8, 0.849], [40.9, 0.82], [41.0, 0.80], [41.4, 0.762], [41.75, 0.75]]);
    const hy = lin(s, [[39.75, -38], [39.78, 17], [39.82, 32], [39.85, 48], [39.88, 60], [40.0, 98], [40.2, 115], [40.4, 136], [40.5, 132], [40.6, 123], [40.7, 98], [40.8, 52], [40.9, -22], [41.0, -100], [41.1, -230], [41.2, -370], [41.3, -490], [41.4, -580], [41.5, -740], [41.6, -957], [41.75, -1330]]);
    els.push(<div key="rep" style={{position: 'absolute', left: 960 - 500 * sc, top: hy, width: 1000, transform: `scale(${sc})`, transformOrigin: '0 0'}}><Report x={x} th0={lin(s, [[39.75, 30], [39.9, 26], [40.3, 12]])} /></div>);
    if (s >= 40.22) {
      const lx = lin(s, [[40.22, -160], [40.45, 80], [40.7, 133], [41.0, 224], [41.2, 270]]);
      const ly = lin(s, [[40.22, 610], [40.6, 542], [40.7, 484], [40.9, 328], [41.0, 240], [41.1, 86], [41.25, -80]]);
      els.push(<div key="sl" style={L(46, {left: lx + 66, top: ly})}>{x.memo}</div>);
      els.push(<div key="sr" style={L(46, {left: 1920 - lx - 66, top: ly})}>{x.memo}</div>);
    }
  } else if (s < 43.733) {
    // 幻灯片：一个词 → 劈开 → 四角 + 渐变方块 + 卡片甩进来
    const corner = clamp((s - 42.56) / 0.14);
    const hx = s < 42.0 ? 0 : s < 42.56 ? lin(s, [[42.0, 0], [42.1, 131], [42.2, 290], [42.3, 392], [42.4, 461], [42.5, 516], [42.56, 530]]) : lin(s, [[42.56, 530], [42.62, 640], [42.7, 695]]);
    const vy = s < 42.56 ? 0 : lin(s, [[42.56, 0], [42.62, 60], [42.7, 124], [42.8, 164], [42.95, 201], [43.2, 238], [43.57, 274], [43.733, 282]]);
    const fs = 68 - 24 * eo(corner);
    const cy = s < 42.56 ? 553 : 540;
    if (s >= 42.56) {
      const rw = lin(s, [[42.56, 380], [42.65, 494]]), rh = lin(s, [[42.56, 12], [42.617, 140], [42.65, 200], [42.7, 230], [42.8, 390], [42.95, 430], [43.57, 584], [43.733, 600]]);
      els.push(<div key="rect" style={{position: 'absolute', left: 960 - rw / 2, top: 540 - rh / 2, width: rw, height: rh, background: 'linear-gradient(150deg, #d8761a 0%, #c4400c 45%, #b8260a 70%, #7a1f4a 100%)'}} />);
    } else if (s >= 42.15) {
      const lw = lin(s, [[42.15, 120], [42.2, 231], [42.3, 306], [42.4, 346], [42.5, 375], [42.56, 380]]);
      els.push(<div key="line" style={{position: 'absolute', left: 960 - lw / 2, top: 547, width: lw, height: 12, background: 'linear-gradient(90deg, #c94a10, #c0300c)'}} />);
    }
    if (s >= 42.6) {
      const X = carouselX(s), v = s < 43.733 ? carouselV(s) : 0;
      const row = (off: number, op: number, k: string) => Array.from({length: 11}, (_, i) => {
        const left = 266 + 459 * (2 - i) + X + off;
        return left > 1930 || left < -470 ? null : <Card key={k + i} x={x} left={left} op={op} />;
      });
      els.push(...row(0, 1, 'c'));
      if (v > 60) { els.push(...row(-v * 0.33, 0.28, 'g1')); els.push(...row(-v * 0.66, 0.16, 'g2')); } // 原片拖影：字和边框叠两层淡的
    }
    if (s < 42.0) els.push(<div key="w0" style={L(68, {left: 960, top: 553})}>{x.slide}</div>);
    else if (s < 42.56) { els.push(<div key="w1" style={L(fs, {left: 960 - hx, top: cy})}>{x.slide}</div>); els.push(<div key="w2" style={L(fs, {left: 960 + hx, top: cy})}>{x.slide}</div>); }
    else [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sy], i) => els.push(<div key={'q' + i} style={L(fs, {left: 960 + sx * hx, top: cy + sy * vy})}>{x.slide}</div>));
  } else {
    // 精彩集锦大卡
    const w = lin(s, [[43.733, 1420], [44.0, 1600]]) + held * 30, h = w * 0.603;
    els.push(
      <div key="hl" style={{position: 'absolute', left: 958 - w / 2, top: 536 - h / 2, width: w, height: h, background: 'linear-gradient(152deg, #d8961f 0%, #d38a1d 22%, #c4400e 48%, #a8290f 62%, #8a2232 78%, #2a1aa6 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{fontFamily: SANS, fontSize: 24, color: '#fff', letterSpacing: '0.04em'}}>{x.reel}</div>
      </div>,
    );
  }
  const capS: React.CSSProperties = {position: 'absolute', left: 0, right: 0, textAlign: 'center', fontFamily: SANS, fontSize: 13, letterSpacing: '0.18em', color: '#1a1a1a'};
  return (
    <AbsoluteFill style={{background: CREAM, overflow: 'hidden'}}>
      <div style={{...capS, top: 46}}>{cap}</div>
      <div style={{...capS, top: 1018}}>{cap}</div>
      {els}
      <div style={{position: 'absolute', right: 36, bottom: 26, fontFamily: SANS, fontSize: 20, color: 'rgba(60,50,40,0.45)', letterSpacing: '0.06em'}}>{x.note}</div>
    </AbsoluteFill>
  );
};

if (checkContract(PILL_REPORT_SLIDES_CONTRACT).length) throw new Error(checkContract(PILL_REPORT_SLIDES_CONTRACT).join('；'));
export const PillBarReportSlides: React.FC = () => <PillBarReportSlidesGroup />;
