// 【镜头组】headline-swap-dashboard-rise：一句话逐词打出，句尾的词在原地换三次（待办 → 日程 → 家务 → 一整周），
//   换完整块产品面板从下面升起；面板上的目标卡浮出一个放大分身、左下弹出"已完成"胶囊，停住看；
//   弹出收掉、字淡走，镜头推进右上角的"新建任务"按钮，最后一帧只剩这颗按钮（023-B 一拍，接 023-C）
// 学的动作（baseTOP × Taskly 9.10–13.60s，60fps 逐帧看过；时间表 （内部拆片记录，未随项目提供））：
//   第一行逐词出现在整行居中后的最终位置（灰、虚、略低 → 黑、实），间隔越往后越疏；
//   第二行换词周期 0.5s：新词从下方 0.6 行高处极淡出现，0.34s 长尾 ease-out 升上来、浅紫变品牌蓝；旧词 0.16s 往上退、变淡、轻虚；中间约 1 帧空；
//   最后一个词落定后第二行慢慢往下沉（两行间距被拉开、给面板让位）；
//   面板从画面下沿外升起，0.83× → 1×，上沿走单调长尾曲线，中段竖向运动模糊，落定不回弹；
//   目标卡长出放大分身（1.45 倍宽、左沿对齐、上沿在原卡中线、投影更重）；胶囊伸出面板左沿；停住；两个弹出原地淡掉（不飞回）；
//   字变虚变淡往上飘走；推镜：位置和缩放同一条进度曲线（慢起 → 最快 → 长尾慢停），总放大 2 倍，把按钮送到画面中心；推的时候面板糊、背景不糊；
//   一帧切：只剩按钮（位置、大小都不变）。
// 我们的内容：中文待办 App「小周」。大字"一个地方，管好你的 / 待办。日程。家务。一整周。"；今天的事和 023-C 的列表接得上；
//   出口按钮"新建任务"和 task-card-three-verbs 第 0 帧的按钮同位置（960, 580）、同大小（262×76），两组可以直接接。
//
// 拍表（源秒，30fps）
//   拍 1 逐词     0.10–0.40      第一行 4 个词
//   拍 2 换词     0.43–2.20      4 个词，周期 0.5s（停留点 2.20：整句读完）
//   拍 3 面板升起 2.30–2.85      + 第二行下沉 2.20–3.45
//   拍 4 弹出     2.90–3.40      目标卡分身 2.90、胶囊 3.00（停留点 3.36：看面板）
//   拍 5 推镜     3.40–4.45      弹出淡掉 3.40–3.62、字退 3.46–3.68、推镜 3.54–4.42（3.64 前只是轻轻起步）
//   拍 6 出口     4.45–4.60      只剩按钮
// 毛病清单：
//   - 通用：画面永远不停（停留时背景漂、字层和面板按输出秒慢推）；动作叠着走；--hq 渲染；确定性
//   - 独有 1：第一行的词出现在最终位置，整行不左右让
//   - 独有 2：换词时旧词往上退、新词从下面来，同一时刻最多一个词是实的
//   - 独有 3：出口按钮和 023-C 开场按钮像素级同位置同大小（推镜终点写死，不受停留时长影响）
//   - 独有 4：推镜时只糊面板，背景不糊
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {FONT, Grain, Vignette, mix} from '../../../assets/lib/helpers/polish';
import {GroupContract, checkContract, checkInputs, outputDuration, planExtras, toSource} from '../../../assets/lib/helpers/groupClock';

const FPS = 30;
const SANS = `"PingFang SC", "Noto Sans CJK SC", "Noto Sans SC", ${FONT.sans}`;
const INK = '#141826';
const GRAY = '#8b8e9a';
const LIME = '#d3f454';

const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const sm = (x: number) => { const c = clamp(x); return c * c * (3 - 2 * c); };
const rp = (t: number, a: number, b: number) => sm((t - a) / (b - a));
const eo = (t: number, a: number, b: number) => { const c = clamp((t - a) / (b - a)); return 1 - Math.pow(1 - c, 3); };
const ei = (t: number, a: number, b: number) => { const c = clamp((t - a) / (b - a)); return c * c; };
const hex = (c: string) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
const mixc = (a: string, b: string, k: number) => { const A = hex(a), B = hex(b); return `rgb(${A.map((v, i) => Math.round(mix(v, B[i], clamp(k)))).join(',')})`; };

// 单调三次样条：pts = [x, y]
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
// 原片 1400×1200 的百分比 → 1920×1080（与 task-card-three-verbs 同一套换算，两组接得上）
const fy = (p: number) => 540 + (p * 12 - 600) * 1.1;

// ═════════ 合同 ═════════
export const HEADLINE_SWAP_DASHBOARD_RISE_CONTRACT: GroupContract = {
  sourceDuration: 138 / 30, // 4.6s
  fps: 30,
  motion: [[0, 2.2], [2.22, 3.34], [3.38, 138 / 30]],
  holds: [
    {at: 2.2, maxExtra: 1.0}, // 整句读完（最后一个词刚落定）
    {at: 3.36, maxExtra: 1.5}, // 面板 + 两个弹出停住看
  ],
  landmarks: {lead: 0.1, word1: 0.433, word2: 0.933, word3: 1.433, word4: 1.933, panel: 2.3, panelLand: 2.88, pop: 2.9, toast: 3.0, retract: 3.4, push: 3.64, pushPeak: 3.92, settle: 4.3, cut: 4.45, exit: 138 / 30},
  sfx: [
    {at: 'lead', type: '轻tick', note: '轻柔 tick 串（逐词）', tail: 0.3, volume: 0.25},
    {at: 'word2', type: '上升', note: '向上的短 whoosh（换词）', volume: 0.25},
    {at: 'word3', type: '上升', note: '向上的短 whoosh（换词）', volume: 0.25},
    {at: 'word4', type: '上升', note: '向上的短 whoosh（换词，稍重）', volume: 0.3},
    {at: 'panel', offset: 0.1, type: '上升', note: '上升 whoosh（面板升起，最响在落点后 0.25s）', tail: 0.5, volume: 0.4},
    {at: 'pop', type: '弹出', note: '轻 pop（卡片浮出）', volume: 0.35},
    {at: 'toast', type: '提示音', note: '完成提示音 ding', tail: 0.6, volume: 0.35},
    {at: 'push', offset: 0.1, type: '运镜', note: '推进 whoosh（最响在 pushPeak）', tail: 0.4, volume: 0.45},
    {at: 'cut', type: '点击', note: '短促 click（只剩按钮）', volume: 0.3},
  ],
  inputs: {
    lead: {maxChars: 10},
    words: {count: 4, maxChars: 5},
    appName: {maxChars: 4},
    userName: {maxChars: 3},
    button: {maxChars: 4},
    toast: {maxChars: 6},
    goalLabel: {maxChars: 4},
    goalValue: {maxChars: 4},
    goalNote: {maxChars: 6},
    today: {count: 4, maxChars: 10},
  },
};

export type DashRiseInputs = {
  lead: string[]; // 第一行，按词切（逐词出现），合起来 ≤10 字
  words: string[]; // 第二行轮换的 4 个词，最后一个停住
  appName: string; // 面板左上角的产品名
  userName: string; // "早上好，xx"
  button: string; // 出口按钮（接 023-C 时必须和它的按钮一致）
  toast: string; // 左下胶囊
  goalLabel: string; goalValue: string; goalNote: string; // 目标卡
  today: string[]; // 今天的 4 件事（第 4 件显示为已完成）
  brandColor?: string; // 品牌蓝（第二行、按钮、目标卡、柱子）；冷色为宜
};
export const DASH_RISE_DEFAULT_INPUTS: DashRiseInputs = {
  lead: ['一个', '地方，', '管好', '你的'],
  words: ['待办。', '日程。', '家务。', '一整周。'],
  appName: '小周',
  userName: '林夏',
  button: '新建任务',
  toast: '任务已完成',
  goalLabel: '本周目标', goalValue: '86%', goalNote: '还差 4 件',
  today: ['给房东转房租', '买一袋猫粮', '取干洗的衣服', '周会PPT改第二版'],
};
export function checkDashRiseInputs(x: DashRiseInputs): string[] {
  return checkInputs(HEADLINE_SWAP_DASHBOARD_RISE_CONTRACT, {
    lead: x.lead.join(''), words: x.words, appName: x.appName, userName: x.userName, button: x.button, toast: x.toast,
    goalLabel: x.goalLabel, goalValue: x.goalValue, goalNote: x.goalNote, today: x.today,
  });
}
export const planDashRise = (sec: number) => planExtras(HEADLINE_SWAP_DASHBOARD_RISE_CONTRACT, sec);
export const dashRiseFrames = (extras: number[]) => Math.round(outputDuration(HEADLINE_SWAP_DASHBOARD_RISE_CONTRACT, extras) * FPS);
export const HEADLINE_SWAP_DASHBOARD_RISE_DURATION = 138;

// ═════════ 方向模糊（SVG，x / y 两个方向）═════════
const DBlur: React.FC<{sx: number; sy?: number; children: React.ReactNode}> = ({sx, sy = 0, children}) => {
  const id = 'hb' + React.useId().replace(/[^a-zA-Z0-9]/g, '');
  const on = sx + sy > 0.3;
  return (
    <div style={{position: 'absolute', inset: 0}}>
      {on && (
        <svg width={0} height={0} style={{position: 'absolute'}} aria-hidden>
          <filter id={id} x="-20%" y="-30%" width="140%" height="160%" colorInterpolationFilters="sRGB">
            <feGaussianBlur stdDeviation={`${sx.toFixed(2)} ${sy.toFixed(2)}`} />
          </filter>
        </svg>
      )}
      <div style={{position: 'absolute', inset: 0, filter: on ? `url(#${id})` : undefined}}>{children}</div>
    </div>
  );
};

// ═════════ 背景：浅紫蓝渐变 + 右上紫光团 + 左下青柠雾（和 023-C 同一张底），按输出秒极慢漂 ═════════
const Backdrop: React.FC<{t: number}> = ({t}) => {
  const dr = t * 0.32; // %/s；原长结束时（4.6s）正好等于 023-C 第 0 帧的背景
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: 'linear-gradient(180deg, #e2e6fa 0%, #e6eafb 38%, #eef1fb 68%, #f5f7f6 100%)'}}>
      <AbsoluteFill style={{background: `radial-gradient(ellipse 34% 46% at ${83.47 - dr}% 9%, rgba(184,192,250,0.95) 0%, rgba(197,204,251,0.55) 45%, rgba(197,204,251,0) 100%)`}} />
      <AbsoluteFill style={{background: `radial-gradient(ellipse 22% 30% at ${5.41 + dr * 0.4}% 14%, rgba(206,210,248,0.7) 0%, rgba(206,210,248,0) 100%)`}} />
      <AbsoluteFill style={{background: `radial-gradient(ellipse 40% 42% at 10% 96%, rgba(226,243,190,0.95) 0%, rgba(233,244,205,0.55) 45%, rgba(233,244,205,0) 100%)`}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 38% 36% at 92% 96%, rgba(250,252,253,0.95) 0%, rgba(250,252,253,0) 100%)'}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 50% 40% at 50% 48%, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 100%)'}} />
      <Vignette strength={0.1} color="#3a3f6a" inner={0.5} />
      <Grain opacity={0.035} />
    </AbsoluteFill>
  );
};

// ═════════ 大字 ═════════
const HF = 104; // 字号（两行一样，和 023-C 大字同号）
const L1Y = fy(21.7); // 第一行中线 ≈ 166
const L2Y0 = fy(31.2); // 第二行落定 ≈ 292（两行间距 1.2 倍字高，和原片同比例）
const LEAD_T = [0.1, 0.133, 0.2, 0.3, 0.37, 0.43]; // 每个词出现（超过 4 个词时往后排）
const WORD_IN = (k: number) => 0.433 + 0.5 * k;
const WORD_OUT = (k: number) => 0.77 + 0.5 * k; // 第 4 个词不退
// 第二行下沉（2.20 → 3.45，减速）
const l2Sink = (s: number) => trk(s, [[2.2, 0], [2.5, 1.0], [2.8, 2.5], [3.0, 3.8], [3.1, 4.3], [3.45, 5.0]]);
const textWidth = (s: string, px: number) => Array.from(s).reduce((a, c) => a + (/[\u0000-ÿ]/.test(c) ? 0.56 : 1) * px, 0);

const Headline: React.FC<{s: number; x: DashRiseInputs; blue: string}> = ({s, x, blue}) => {
  // 退场（3.50–3.70）：变虚、变淡、往上飘约 2%
  const out = rp(s, 3.46, 3.68);
  if (out >= 0.999) return null;
  const lift = -22 * eo(s, 3.46, 3.72);
  const blurOut = 9 * out;
  const lefts: number[] = [];
  const widths = x.lead.map((w) => textWidth(w, HF));
  const total = widths.reduce((a, b) => a + b, 0);
  let acc = 960 - total / 2;
  widths.forEach((w) => { lefts.push(acc); acc += w; });
  const l2y = fy(31.2 + l2Sink(s));
  return (
    <div style={{position: 'absolute', inset: 0, opacity: 1 - out, transform: `translateY(${lift.toFixed(2)}px)`, filter: blurOut > 0.2 ? `blur(${blurOut.toFixed(2)}px)` : undefined}}>
      {x.lead.map((w, i) => {
        const t0 = LEAD_T[Math.min(i, LEAD_T.length - 1)] + (i >= LEAD_T.length ? 0.06 * (i - LEAD_T.length + 1) : 0);
        if (s < t0) return null;
        const k = eo(s, t0, t0 + 0.11);
        const ink = rp(s, t0 + 0.02, t0 + 0.14);
        return (
          <span key={i} style={{position: 'absolute', left: lefts[i], top: L1Y - HF * 0.66, fontSize: HF, lineHeight: `${HF * 1.32}px`, fontWeight: 600, fontFamily: SANS,
            letterSpacing: '-0.01em', whiteSpace: 'pre', color: mixc('#9ea2b4', INK, ink), opacity: 0.2 + 0.8 * clamp(k * 1.3),
            filter: k < 0.98 ? `blur(${(5 * (1 - k)).toFixed(2)}px)` : undefined, transform: `translateY(${(5 * (1 - k)).toFixed(2)}px)`}}>{w}</span>
        );
      })}
      {x.words.map((w, k) => {
        const tin = WORD_IN(k), tout = k < x.words.length - 1 ? WORD_OUT(k) : 99;
        if (s < tin || s > tout + 0.17) return null;
        const up = eo(s, tin, tin + 0.34); // 0 → 1：从下方 0.6 行高升到位
        const col = rp(s, tin + 0.03, tin + 0.3);
        const ex = ei(s, tout, tout + 0.16); // 退：往上、变淡
        const dy = HF * 0.62 * (1 - up) - HF * 0.5 * ex;
        const op = clamp(up * 1.6) * (1 - ex);
        const bl = 4 * (1 - up) + 3 * ex;
        return (
          <div key={k} style={{position: 'absolute', left: 0, right: 0, top: l2y - HF * 0.66 + dy, textAlign: 'center', fontSize: HF, lineHeight: `${HF * 1.32}px`, fontWeight: 600,
            fontFamily: SANS, whiteSpace: 'pre', color: mixc('#c4c7f6', blue, col * (1 - ex * 0.8)), opacity: op, filter: bl > 0.2 ? `blur(${bl.toFixed(2)}px)` : undefined}}>
            <span style={{display: 'inline-block', transform: 'skewX(-9deg)'}}>{w}</span>
          </div>
        );
      })}
    </div>
  );
};

// ═════════ 面板（设计尺寸 1160×800，1× 时上沿 y=466、水平居中）═════════
const PW = 1160, PH = 800;
const PANEL_L = 960 - PW / 2;
const PANEL_TOP = Math.round(fy(44.4)); // 466
const BTN = {cx: 1066.5, cy: 46, w: 131, h: 38}; // 面板坐标；推到 2× 时 = 262×76
const ZOOM = 2;
const BTN_FINAL = {x: 960, y: fy(53)}; // 023-C 按钮中心

const Chip: React.FC<{c: string; s?: number}> = ({c, s = 8}) => <span style={{display: 'inline-block', width: s, height: s, borderRadius: s, background: c, flex: 'none'}} />;
const Icon: React.FC<{d: string; c?: string; s?: number}> = ({d, c = '#7b7f92', s = 13}) => (
  <svg width={s} height={s} viewBox="0 0 24 24" style={{flex: 'none'}}><path d={d} stroke={c} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
const IC = {
  home: 'M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z',
  check: 'M4 12l5 5L20 6',
  folder: 'M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
  cal: 'M4 6h16v14H4zM4 10h16M9 3v4M15 3v4',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0',
  gear: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19 12l2-1-1-3-2 .3-1.5-1.5L17 4l-3-1-1 2h-2L10 3 7 4l.5 2.8L6 8.3 4 8 3 11l2 1v0l-2 1 1 3 2-.3 1.5 1.5L7 20l3 1 1-2h2l1 2 3-1-.5-2.8 1.5-1.5 2 .3 1-3z',
  search: 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM21 21l-5-5',
  bell: 'M6 16V11a6 6 0 1 1 12 0v5l2 2H4zM10 20a2 2 0 0 0 4 0',
  plus: 'M12 5v14M5 12h14',
  bolt: 'M13 3L4 14h7l-1 7 9-11h-7z',
  flag: 'M5 21V4h11l-2 4 2 4H5',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2',
};

const card: React.CSSProperties = {position: 'absolute', background: '#fff', borderRadius: 14, border: '1px solid #eef0f6', boxShadow: '0 1px 2px rgba(40,50,120,0.04)'};

const Sidebar: React.FC<{x: DashRiseInputs; blue: string}> = ({x, blue}) => {
  const nav = [['首页', IC.home, true], ['待办', IC.check, false], ['项目', IC.folder, false], ['日历', IC.cal, false], ['成员', IC.user, false], ['设置', IC.gear, false]] as const;
  const projects = [['搬家准备', blue], ['读书计划', '#9dc031'], ['健身打卡', '#f06ba8'], ['五一旅行', '#f39a3c']] as const;
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: 200, height: PH, background: '#f7f8fc', borderRight: '1px solid #eceef5', fontFamily: SANS}}>
      <div style={{position: 'absolute', left: 20, top: 20, display: 'flex', alignItems: 'center', gap: 8}}>
        <div style={{width: 24, height: 24, borderRadius: 7, background: `linear-gradient(135deg, ${blue}, #5a6cff)`, boxShadow: '0 2px 6px rgba(42,66,244,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <Icon d={IC.check} c="#fff" s={13} />
        </div>
        <span style={{fontSize: 15, fontWeight: 700, color: INK}}>{x.appName}</span>
      </div>
      <div style={{position: 'absolute', left: 14, right: 14, top: 58, height: 38, borderRadius: 10, background: '#fff', border: '1px solid #eceef5', display: 'flex', alignItems: 'center', gap: 8, padding: '0 8px'}}>
        <div style={{width: 22, height: 22, borderRadius: 6, background: LIME, fontSize: 11, fontWeight: 700, color: '#3d4a0a', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{Array.from(x.userName)[0]}</div>
        <div style={{lineHeight: 1.2}}>
          <div style={{fontSize: 8.5, color: GRAY}}>我的空间</div>
          <div style={{fontSize: 10.5, fontWeight: 600, color: INK}}>{x.userName}的待办</div>
        </div>
      </div>
      <div style={{position: 'absolute', left: 14, right: 14, top: 106, height: 28, borderRadius: 8, background: '#eff1f7', display: 'flex', alignItems: 'center', gap: 6, padding: '0 9px', fontSize: 10, color: '#a3a6b5'}}>
        <Icon d={IC.search} c="#a3a6b5" s={11} />搜索<span style={{marginLeft: 'auto', fontSize: 8.5}}>⌘K</span>
      </div>
      <div style={{position: 'absolute', left: 22, top: 148, fontSize: 8.5, color: '#a3a6b5', letterSpacing: '0.08em'}}>菜单</div>
      {nav.map(([n, d, act], i) => (
        <div key={n} style={{position: 'absolute', left: 12, right: 12, top: 164 + i * 28, height: 25, borderRadius: 7, background: act ? '#fff' : 'transparent', boxShadow: act ? '0 1px 3px rgba(40,50,120,0.08)' : undefined,
          display: 'flex', alignItems: 'center', gap: 8, padding: '0 10px', fontSize: 10.5, color: act ? INK : '#5c6070', fontWeight: act ? 600 : 400}}>
          <Icon d={d} c={act ? blue : '#8a8ea0'} s={12} />{n}
          {n === '待办' && <span style={{marginLeft: 'auto', fontSize: 8.5, color: GRAY}}>12</span>}
        </div>
      ))}
      <div style={{position: 'absolute', left: 22, top: 342, fontSize: 8.5, color: '#a3a6b5', letterSpacing: '0.08em'}}>项目</div>
      {projects.map(([n, c], i) => (
        <div key={n} style={{position: 'absolute', left: 22, top: 360 + i * 24, display: 'flex', alignItems: 'center', gap: 8, fontSize: 10.5, color: '#5c6070'}}><Chip c={c} s={7} />{n}</div>
      ))}
      <div style={{position: 'absolute', left: 14, right: 14, top: 478, height: 112, borderRadius: 12, background: '#15171f', padding: 12, color: '#fff'}}>
        <div style={{width: 22, height: 22, borderRadius: 6, background: LIME, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Icon d={IC.bolt} c="#1d2405" s={12} /></div>
        <div style={{fontSize: 11, fontWeight: 600, marginTop: 8}}>升级专业版</div>
        <div style={{fontSize: 8.5, color: '#9ca0b0', marginTop: 3, lineHeight: 1.4}}>无限项目、自动提醒、家人共享</div>
        <div style={{marginTop: 8, height: 22, borderRadius: 22, background: LIME, color: '#1d2405', fontSize: 9.5, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>立即升级</div>
      </div>
    </div>
  );
};

const AddBtn: React.FC<{x: DashRiseInputs; blue: string}> = ({x, blue}) => (
  <div style={{position: 'absolute', left: BTN.cx - BTN.w / 2, top: BTN.cy - BTN.h / 2, width: BTN.w, height: BTN.h, borderRadius: BTN.h, background: blue,
    boxShadow: `0 4px 10px rgba(42,67,247,0.35), inset 0 0.5px 0 rgba(255,255,255,0.25)`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
    color: '#fff', fontFamily: SANS, fontSize: 14, fontWeight: 600, whiteSpace: 'pre'}}>
    <svg width="13" height="13" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" /></svg>
    {x.button}
  </div>
);

const STAT_Y = 100, STAT_H = 96, COL0 = 228, STAT_W = 215.5, GAP = 14;
const statX = (i: number) => COL0 + i * (STAT_W + GAP);
const GOAL = {x: statX(3), y: STAT_Y, w: STAT_W, h: STAT_H};

const goalPct = (v: string) => { const n = parseFloat(v); return Number.isFinite(n) ? Math.max(4, Math.min(100, n)) : 86; }; // 进度条跟着目标值走
const GoalBody: React.FC<{x: DashRiseInputs; big?: boolean}> = ({x, big}) => (
  <>
    <div style={{display: 'flex', alignItems: 'center', gap: 7, fontSize: big ? 13 : 10, color: 'rgba(255,255,255,0.85)'}}>
      {!big && <div style={{width: 20, height: 20, borderRadius: 6, background: LIME, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Icon d={IC.flag} c="#1d2405" s={11} /></div>}
      {x.goalLabel}
      {!big && <span style={{marginLeft: 'auto', fontSize: 9}}>24 / 28</span>}
    </div>
    <div style={{display: 'flex', alignItems: 'baseline', gap: 7, marginTop: big ? 4 : 10}}>
      <span style={{fontSize: big ? 38 : 26, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em'}}>{x.goalValue}</span>
      <span style={{fontSize: big ? 11 : 9, color: 'rgba(255,255,255,0.75)'}}>{x.goalNote}</span>
    </div>
    <div style={{marginTop: big ? 8 : 8, height: big ? 6 : 4, borderRadius: 6, background: 'rgba(255,255,255,0.25)'}}>
      <div style={{width: `${goalPct(x.goalValue)}%`, height: '100%', borderRadius: 6, background: LIME}} />
    </div>
  </>
);

const Main: React.FC<{x: DashRiseInputs; blue: string}> = ({x, blue}) => {
  const stats = [['今天到期', '3', '1 件逾期', '#e2545c', IC.clock], ['本周完成', '24', '比上周 +6', '#3aa76d', IC.check], ['进行中', '9', '分在 4 个项目', '#f39a3c', IC.bolt]] as const;
  const tags = [['账单', '#835ff4'], ['家里', '#8fb52a'], ['生活', blue], ['工作', '#f39a3c']] as const;
  const times = ['周五 20:00', '周五 18:30', '周六 10:00', '今天 11:00'];
  const bars = [0.55, 0.72, 0.48, 0.9, 0.62, 0.22, 0.14];
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: PW, height: PH, fontFamily: SANS, color: INK}}>
      <div style={{position: 'absolute', left: COL0, top: 18, fontSize: 8.5, color: '#a3a6b5'}}>工作台 / 首页</div>
      <div style={{position: 'absolute', left: COL0, top: 32, fontSize: 19, fontWeight: 700}}>早上好，{x.userName}</div>
      <div style={{position: 'absolute', left: COL0, top: 60, fontSize: 9.5, color: GRAY}}>11 月 12 日 周四 · 今天有 4 件事要做，1 个会</div>
      {/* 顶栏右侧 */}
      <div style={{position: 'absolute', left: 770, top: 35, width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <Icon d={IC.bell} s={14} /><span style={{position: 'absolute', right: 3, top: 3, width: 5, height: 5, borderRadius: 5, background: '#e2545c'}} />
      </div>
      <div style={{position: 'absolute', left: 800, top: 35, display: 'flex'}}>
        {[['林', '#e5e8ff', blue], ['周', '#eef7d4', '#5f7a0e'], ['陈', '#fde8f1', '#c2417c'], ['+2', '#f1f2f6', '#7b7f92']].map(([n, bg, fg], i) => (
          <div key={i} style={{width: 22, height: 22, borderRadius: 22, background: bg, color: fg, fontSize: 8.5, fontWeight: 600, border: '1.5px solid #fff', marginLeft: i ? -6 : 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{n}</div>
        ))}
      </div>
      <div style={{position: 'absolute', left: BTN.cx - BTN.w / 2 - 12 - 100, top: BTN.cy - 16, width: 100, height: 32, borderRadius: 32, border: '1px solid #e3e5ee', background: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, fontSize: 11, fontWeight: 600, color: INK}}><Icon d={IC.folder} c={INK} s={11} />新建项目</div>
      {/* 统计行 */}
      {stats.map(([l, v, n, c, d], i) => (
        <div key={l} style={{...card, left: statX(i), top: STAT_Y, width: STAT_W, height: STAT_H, padding: '12px 14px'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 7, fontSize: 10, color: '#5c6070'}}>
            <div style={{width: 20, height: 20, borderRadius: 6, background: '#f4f5fa', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Icon d={d} c={c} s={11} /></div>{l}
            <span style={{marginLeft: 'auto', color: '#b5b8c5'}}>···</span>
          </div>
          <div style={{display: 'flex', alignItems: 'baseline', gap: 7, marginTop: 12}}>
            <span style={{fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em'}}>{v}</span>
            <span style={{fontSize: 9, color: c}}>{n}</span>
          </div>
        </div>
      ))}
      <div style={{...card, left: GOAL.x, top: GOAL.y, width: GOAL.w, height: GOAL.h, padding: '12px 14px', background: blue, border: 'none', boxShadow: '0 8px 18px rgba(42,66,244,0.25)'}}>
        <GoalBody x={x} />
      </div>
      {/* 今天 */}
      <div style={{...card, left: COL0, top: 214, width: 652, height: 214}}>
        <div style={{position: 'absolute', left: 16, top: 13, fontSize: 12, fontWeight: 700}}>今天 <span style={{fontSize: 9, color: GRAY, fontWeight: 400}}>4</span></div>
        <div style={{position: 'absolute', right: 16, top: 11, display: 'flex', gap: 6, fontSize: 9}}>
          {['列表', '看板', '日历', '筛选'].map((n, i) => <span key={n} style={{padding: '3px 8px', borderRadius: 6, background: i === 0 ? '#f1f2f7' : 'transparent', color: i === 0 ? INK : GRAY}}>{n}</span>)}
        </div>
        {x.today.map((n, i) => {
          const done = i === 3;
          return (
            <div key={i} style={{position: 'absolute', left: 12, right: 12, top: 40 + i * 36, height: 32, borderRadius: 8, background: done ? '#f6f7fb' : 'transparent', display: 'flex', alignItems: 'center', gap: 10, padding: '0 6px', fontSize: 10.5}}>
              <div style={{width: 14, height: 14, borderRadius: 14, border: done ? 'none' : '1.5px solid #c9ccd8', background: done ? blue : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                {done && <Icon d={IC.check} c="#fff" s={9} />}
              </div>
              <span style={{color: done ? '#a3a6b5' : INK, textDecoration: done ? 'line-through' : undefined, width: 210, whiteSpace: 'pre'}}>{n}</span>
              <span style={{display: 'flex', alignItems: 'center', gap: 5, fontSize: 9, color: '#5c6070', padding: '2px 7px', borderRadius: 10, background: '#f4f5fa'}}><Chip c={tags[i][1]} s={6} />{tags[i][0]}</span>
              <span style={{marginLeft: 'auto', fontSize: 9, color: GRAY, display: 'flex', alignItems: 'center', gap: 4}}><Icon d={IC.clock} c="#a3a6b5" s={10} />{times[i]}</span>
              <span style={{fontSize: 9, color: i === 0 ? '#e2545c' : '#f39a3c', display: 'flex', alignItems: 'center', gap: 3, width: 34}}><Icon d={IC.flag} c={i === 0 ? '#e2545c' : '#f39a3c'} s={10} />{i === 0 ? '紧急' : '普通'}</span>
              <div style={{width: 18, height: 18, borderRadius: 18, background: '#e5e8ff', color: blue, fontSize: 8, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{Array.from(x.userName)[0]}</div>
            </div>
          );
        })}
        <div style={{position: 'absolute', left: 22, top: 188, fontSize: 9.5, color: '#b5b8c5', display: 'flex', alignItems: 'center', gap: 6}}><Icon d={IC.plus} c="#b5b8c5" s={10} />添加一件事，比如"周六上午取快递"</div>
      </div>
      {/* 本周进度 */}
      <div style={{...card, left: statX(3) - 20, top: 214, width: STAT_W + 20, height: 214}}>
        <div style={{position: 'absolute', left: 14, top: 13, fontSize: 12, fontWeight: 700}}>本周进度</div>
        <div style={{position: 'absolute', left: 14, top: 31, fontSize: 8.5, color: GRAY}}>每天完成的事</div>
        <div style={{position: 'absolute', right: 12, top: 13, fontSize: 8.5, color: '#3aa76d', background: '#e9f7ef', padding: '2px 6px', borderRadius: 8}}>↗ +18%</div>
        {bars.map((b, i) => (
          <div key={i} style={{position: 'absolute', left: 18 + i * 29, bottom: 42, width: 18, height: 110, borderRadius: 5, background: '#f0f1f6'}}>
            <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 110 * b, borderRadius: 5, background: i === 2 ? LIME : blue}} />
          </div>
        ))}
        {['一', '二', '三', '四', '五', '六', '日'].map((d, i) => <div key={d} style={{position: 'absolute', left: 18 + i * 29, width: 18, bottom: 26, textAlign: 'center', fontSize: 8, color: i === 3 ? INK : '#a3a6b5'}}>{d}</div>)}
      </div>
      {/* 即将开始 */}
      <div style={{...card, left: COL0, top: 446, width: 652, height: 122}}>
        <div style={{position: 'absolute', left: 16, top: 13, fontSize: 12, fontWeight: 700}}>即将开始</div>
        <div style={{position: 'absolute', right: 16, top: 14, fontSize: 9, color: GRAY}}>查看日历</div>
        {[['周五', '13', '团队周会', '10:00–11:00 · 线上'], ['周六', '14', '取干洗的衣服', '10:00 · 楼下干洗店']].map(([w, d, n, sub], i) => (
          <div key={i} style={{position: 'absolute', left: 16 + i * 316, top: 42, width: 300, height: 62, borderRadius: 10, border: '1px solid #eef0f6', padding: 10, display: 'flex', gap: 10}}>
            <div style={{width: 36, height: 40, borderRadius: 8, background: i === 0 ? blue : '#f4f5fa', color: i === 0 ? '#fff' : INK, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', lineHeight: 1.1}}>
              <span style={{fontSize: 7.5, opacity: 0.8}}>{w}</span><span style={{fontSize: 14, fontWeight: 700}}>{d}</span>
            </div>
            <div><div style={{fontSize: 10.5, fontWeight: 600}}>{n}</div><div style={{fontSize: 8.5, color: GRAY, marginTop: 4}}>{sub}</div></div>
          </div>
        ))}
      </div>
      <div style={{...card, left: statX(3) - 20, top: 446, width: STAT_W + 20, height: 200}}>
        <div style={{position: 'absolute', left: 14, top: 13, fontSize: 12, fontWeight: 700}}>项目</div>
        {[['搬家准备', 0.72, blue], ['读书计划', 0.45, '#9dc031'], ['健身打卡', 0.3, '#f06ba8'], ['五一旅行', 0.88, '#f39a3c']].map(([n, p, c], i) => (
          <div key={i} style={{position: 'absolute', left: 14, right: 14, top: 40 + i * 36}}>
            <div style={{display: 'flex', fontSize: 9.5, color: '#5c6070'}}>{n as string}<span style={{marginLeft: 'auto', color: GRAY}}>{Math.round((p as number) * 100)}%</span></div>
            <div style={{marginTop: 5, height: 4, borderRadius: 4, background: '#f0f1f6'}}><div style={{width: `${(p as number) * 100}%`, height: '100%', borderRadius: 4, background: c as string}} /></div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 两个弹出（面板坐标）
const Popouts: React.FC<{s: number; x: DashRiseInputs; blue: string}> = ({s, x, blue}) => {
  const fade = 1 - rp(s, 3.4, 3.62);
  if (s < 2.9 || fade <= 0.001) return null;
  // 目标卡分身：从原卡长出，往右下浮到位
  const g = eo(s, 2.9, 3.08);
  const go = clamp((s - 2.9) / 0.12) * fade;
  const pw = GOAL.w * 1.45, ph = 108;
  const px = GOAL.x + 6 * (1 - g), py = mix(GOAL.y + 8, GOAL.y + GOAL.h / 2, g);
  const sc = mix(0.72, 1, g) * mix(0.97, 1, fade);
  // 胶囊
  const k = eo(s, 3.0, 3.16);
  const ko = clamp((s - 3.0) / 0.12) * fade;
  return (
    <>
      <div style={{position: 'absolute', left: px, top: py, width: pw, height: ph, borderRadius: 16, background: blue, padding: '16px 20px', opacity: go, transform: `scale(${sc})`, transformOrigin: '0% 0%',
        boxShadow: `0 18px 40px rgba(30,40,160,${(0.32 * go).toFixed(3)}), 0 4px 10px rgba(30,40,160,${(0.18 * go).toFixed(3)})`, fontFamily: SANS}}>
        <GoalBody x={x} big />
      </div>
      <div style={{position: 'absolute', left: -30, top: 510, height: 56, padding: '0 26px 0 12px', borderRadius: 56, background: LIME, opacity: ko, transform: `scale(${mix(0.85, 1, k)}) translateX(${(8 * (1 - k)).toFixed(2)}px)`, transformOrigin: '0% 50%',
        display: 'flex', alignItems: 'center', gap: 12, fontFamily: SANS, fontSize: 21, fontWeight: 600, color: '#1d2405', whiteSpace: 'pre', boxShadow: `0 14px 30px rgba(90,120,10,${(0.28 * ko).toFixed(3)}), 0 3px 8px rgba(60,80,10,${(0.15 * ko).toFixed(3)})`}}>
        <div style={{width: 32, height: 32, borderRadius: 32, background: '#15171f', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Icon d={IC.check} c="#fff" s={17} /></div>
        {x.toast}
      </div>
    </>
  );
};

// ═════════ 面板相机 ═════════
// 升起：上沿 y（原片画高 %）和宽度比例；落定后极慢上漂
const riseTopPct = (s: number) => trk(s, [[2.3, 100], [2.35, 97.2], [2.4, 94], [2.45, 90], [2.5, 85], [2.55, 74.6], [2.6, 64], [2.65, 56.3], [2.7, 52.0], [2.75, 49.5], [2.8, 46.9], [2.85, 45.3], [2.9, 44.6], [2.95, 44.4], [3.65, 43.6]]);
const riseScale = (s: number) => trk(s, [[2.3, 0.83], [2.45, 0.83], [2.5, 0.845], [2.55, 0.9], [2.6, 0.92], [2.65, 0.935], [2.7, 0.955], [2.75, 0.975], [2.8, 0.99], [2.88, 1]]);
// 推镜进度（位置、缩放同一条）
const pushP = (s: number) => trk(s, [[3.54, 0], [3.64, 0.025], [3.72, 0.07], [3.77, 0.12], [3.82, 0.2], [3.87, 0.3], [3.92, 0.48], [3.97, 0.62], [4.02, 0.75], [4.07, 0.84], [4.12, 0.89], [4.17, 0.925], [4.22, 0.955], [4.27, 0.975], [4.32, 0.988], [4.42, 1]]);

// 原片画面更高（1400×1200），面板在 97% 处就露头；我们 16:9 按"落定位置 → 画面下沿外"线性换算，露头时刻和原片一致
const riseY = (pct: number) => PANEL_TOP + ((pct - 44.4) / (100 - 44.4)) * (1085 - PANEL_TOP);
type Cam = {X: number; Y: number; S: number; blurY: number; blur: number};
// hd = 已经停留了多少秒（t - s）：停留时面板按输出秒慢漂，推镜终点不受影响
const restCam = (s: number, hd: number): Cam => {
  const S = riseScale(s) * (1 + 0.008 * hd);
  const top = riseY(riseTopPct(s)) - 9 * hd;
  return {X: 960 - (PW / 2) * S, Y: top, S, blurY: 0, blur: 0};
};
const camAt = (s: number, hd: number): Cam => {
  if (s < 3.54) {
    const c = restCam(s, hd);
    const v = (riseY(riseTopPct(s - 0.017)) - riseY(riseTopPct(s + 0.017))) / 0.034; // px/s
    return {...c, blurY: clamp(v / 900, 0, 10)};
  }
  const r = restCam(3.54, hd);
  const p = pushP(s);
  const A0 = {x: r.X + r.S * BTN.cx, y: r.Y + r.S * BTN.cy};
  const ax = mix(A0.x, BTN_FINAL.x, p), ay = mix(A0.y, BTN_FINAL.y, p);
  const S = mix(r.S, ZOOM, p);
  const dp = (pushP(s + 0.017) - pushP(s - 0.017)) / 0.034; // 1/s
  return {X: ax - S * BTN.cx, Y: ay - S * BTN.cy, S, blurY: 0, blur: clamp(dp * 0.85, 0, 3.5)};
};

const Panel: React.FC<{s: number; hd: number; x: DashRiseInputs; blue: string}> = ({s, hd, x, blue}) => {
  if (s < 2.3) return null;
  const c = camAt(s, hd);
  const only = s >= 4.45; // 一帧切：只剩按钮
  const body = (
    <div style={{position: 'absolute', left: 0, top: 0, width: PW, height: PH, transform: `translate(${c.X.toFixed(2)}px, ${c.Y.toFixed(2)}px) scale(${c.S.toFixed(5)})`, transformOrigin: '0 0'}}>
      {!only && (
        <div style={{position: 'absolute', inset: 0, borderRadius: 22, background: '#fcfcfe', overflow: 'hidden',
          boxShadow: '0 1px 0 rgba(255,255,255,0.9) inset, 0 2px 6px rgba(50,60,150,0.05), 0 30px 60px rgba(60,70,160,0.13)'}}>
          <Sidebar x={x} blue={blue} />
          <Main x={x} blue={blue} />
        </div>
      )}
      {!only && <Popouts s={s} x={x} blue={blue} />}
      <AddBtn x={x} blue={blue} />
    </div>
  );
  const sx = c.blur * 1.0, sy = c.blurY + c.blur * 0.8;
  return <DBlur sx={sx} sy={sy}>{body}</DBlur>;
};

// ═════════ 整组 ═════════
export type DashRiseProps = {inputs?: DashRiseInputs; extras?: number[]};
export const HeadlineSwapDashboardRiseGroup: React.FC<DashRiseProps> = ({inputs = DASH_RISE_DEFAULT_INPUTS, extras = [0, 0]}) => {
  const C = HEADLINE_SWAP_DASHBOARD_RISE_CONTRACT;
  const fo = useCurrentFrame();
  const t = fo / FPS;
  const s = toSource(t, C, extras);
  const hd = Math.max(0, t - s); // 已停留秒数
  const blue = inputs.brandColor ?? '#2a42f4';
  const push = 1 + 0.004 * t + 0.022 * hd; // 字层：全程极慢推近，停留时多推一点（R7）
  return (
    <AbsoluteFill style={{overflow: 'hidden', fontFamily: SANS}}>
      <Backdrop t={t} />
      <AbsoluteFill style={{transform: `scale(${push.toFixed(5)})`, transformOrigin: '50% 30%'}}>
        <Headline s={s} x={inputs} blue={blue} />
      </AbsoluteFill>
      <Panel s={s} hd={hd} x={inputs} blue={blue} />
    </AbsoluteFill>
  );
};

// 兼容 render_shot.py / 冒烟测试：默认内容、原长
export const HeadlineSwapDashboardRise: React.FC = () => <HeadlineSwapDashboardRiseGroup />;

if (checkContract(HEADLINE_SWAP_DASHBOARD_RISE_CONTRACT).length) throw new Error(checkContract(HEADLINE_SWAP_DASHBOARD_RISE_CONTRACT).join('; '));
