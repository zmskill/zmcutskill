// 【镜头组】project-card-kanban-drag：大字两行叠着打，"新建项目"胶囊被点一下撑成项目卡；项目卡缩到上方，三列看板从下面依次浮上来，
//   卡片被拖两次（待办 → 进行中 → 已完成），项目进度一路涨（023-D 一拍）
// 学的动作（baseTOP × Taskly 26.10–31.80s，60fps 逐帧看过；时间表 （内部拆片记录，未随项目提供））：
//   开头只有底和右下光标；胶囊从小长出；大字逐字从下浮上来、灰→墨、去虚，第二行在第一行没打完时就开始；
//   光标快速飞到胶囊（快段有拖影）→ 按下 0.93× → 水波圈 → 项目卡从胶囊处撑开（前几帧虚、上沿基本不动），长尾巴补完 → 真停看卡；
//   项目卡缩 0.73× 上移，三列看板错开 0.1s 从下面浮上来；进度从 0% 一路涨到 72%；
//   拖卡：拿起（放大 1.05、斜 4°、投影变重）→ 拿着停一下 → 快速横移（横糊）→ 悬停 → 落进新位置 → 角度回正 → 放下，计数同一帧变，原列剩下的卡往上补位；
//   第二次拖到"已完成"后长出绿勾；光标滑出画，看板停住。
// 我们的内容：待办 App「小周」（接 023-B、023-C）。大字"每个项目，/ 都有条不紊。"；项目"搬家准备"；三列待办 / 进行中 / 已完成。
//
// 拍表（源秒，30fps）
//   拍 1 打字 + 点胶囊  0.10–1.35   胶囊 0.10、大字 0.20 / 0.50、光标 0.20–0.75、按下 0.78、卡撑开 0.96–1.38（停留点 1.60：看卡）
//   拍 2 看板登场      1.95–2.70   卡缩上去、三列 2.15 / 2.25 / 2.35；进度 2.60–4.90 涨
//   拍 3 拖卡 ×2       3.00–4.70   拿起 3.00、放下 3.68；拿起 4.00、放下 4.45、绿勾 4.55
//   拍 4 停住          4.90–5.70   光标滑出（停留点 5.40：看完整看板）
// 毛病清单：
//   - 通用：画面永远不停（全程极慢推近，停留时多推一点）；动作叠着走；--hq 渲染；确定性
//   - 独有 1：项目卡是同一个容器（胶囊 → 大卡 → 缩小的卡），不是两张卡一出一进
//   - 独有 2：被拖的卡始终在最上层；光标钉在卡上一起走；计数和放下同一帧变
//   - 独有 3：原列剩下的卡往上补位晚放下 0.05s
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {FONT, Grain, Vignette, mix} from '../../../assets/lib/helpers/polish';
import {GroupContract, checkContract, checkInputs, outputDuration, planExtras, toSource} from '../../../assets/lib/helpers/groupClock';

const FPS = 30;
const SANS = `"PingFang SC", "Noto Sans CJK SC", "Noto Sans SC", ${FONT.sans}`;
const INK = '#141826';
const GRAY = '#8b8e9a';

const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const sm = (x: number) => { const c = clamp(x); return c * c * (3 - 2 * c); };
const rp = (t: number, a: number, b: number) => sm((t - a) / (b - a));
const eo = (t: number, a: number, b: number) => { const c = clamp((t - a) / (b - a)); return 1 - Math.pow(1 - c, 3); };
const eio = (t: number, a: number, b: number) => { const c = clamp((t - a) / (b - a)); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };
const hex = (c: string) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
const mixc = (a: string, b: string, k: number) => { const A = hex(a), B = hex(b); return `rgb(${A.map((v, i) => Math.round(mix(v, B[i], clamp(k)))).join(',')})`; };
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
// 原片 1400×1200 的百分比 → 1920×1080（与 023-B、023-C 同一套换算）
const fx = (p: number) => 960 + (p * 14 - 700) * 1.1;
const fy = (p: number) => 540 + (p * 12 - 600) * 1.1;

// ═════════ 合同 ═════════
export const PROJECT_CARD_KANBAN_DRAG_CONTRACT: GroupContract = {
  sourceDuration: 171 / 30, // 5.7s
  fps: 30,
  motion: [[0, 1.4], [1.9, 5.35]],
  holds: [
    {at: 1.6, maxExtra: 1.0}, // 项目卡撑开后停住看
    {at: 5.4, maxExtra: 2.0}, // 完整看板停住看
  ],
  landmarks: {pill: 0.1, type: 0.2, click: 0.78, card: 0.96, cardFull: 1.38, shrink: 1.95, board: 2.15, boardLand: 2.7, pick1: 3.0, drop1: 3.68, pick2: 4.0, drop2: 4.45, check: 4.55, cursorOut: 5.0, exit: 171 / 30},
  sfx: [
    {at: 'pill', type: '弹出', note: '轻 pop（胶囊长出）', volume: 0.25},
    {at: 'type', type: '轻tick', note: '轻柔 tick 串（逐字）', tail: 0.8, volume: 0.2},
    {at: 'click', type: '点击', note: '鼠标点击', volume: 0.35},
    {at: 'card', type: '运镜', note: '柔和展开 whoosh（卡撑开）', tail: 0.4, volume: 0.35},
    {at: 'board', offset: -0.1, type: '上升', note: '上升 whoosh（看板浮上来）', tail: 0.5, volume: 0.35},
    {at: 'pick1', type: '轻tick', note: '轻 tick（拿起）', volume: 0.25},
    {at: 'drop1', type: '轻落定', note: '轻落 thud（放下）', volume: 0.3},
    {at: 'pick2', type: '轻tick', note: '轻 tick（拿起）', volume: 0.25},
    {at: 'drop2', type: '轻落定', note: '轻落 thud（放下）', volume: 0.3},
    {at: 'check', type: '提示音', note: '完成提示音 ding', tail: 0.5, volume: 0.3},
  ],
  inputs: {
    line1: {maxChars: 8},
    line2: {maxChars: 8},
    button: {maxChars: 4},
    project: {maxChars: 6},
    meta: {maxChars: 20},
    columns: {count: 3, maxChars: 4},
    todo: {count: 2, maxChars: 9},
    doing: {count: 1, maxChars: 9},
    done: {count: 2, maxChars: 9},
  },
};

type Task = {title: string; sub: string};
export type KanbanInputs = {
  line1: string; line2: string; // 大字两行
  button: string; // 胶囊
  project: string; meta: string; // 项目卡标题、副标题
  columns: string[]; // 三列名
  todo: Task[]; doing: Task[]; done: Task[]; // 第 1 列 2 张（第 1 张被拖到第 2 列）；第 2 列 1 张（被拖到第 3 列）；第 3 列 2 张
  progressTo?: number; // 进度涨到多少（%），默认 72
  brandColor?: string;
};
export const KANBAN_DEFAULT_INPUTS: KanbanInputs = {
  line1: '每个项目，', line2: '都有条不紊。',
  button: '新建项目',
  project: '搬家准备', meta: '18/25 件 · 11月30日截止',
  columns: ['待办', '进行中', '已完成'],
  todo: [{title: '订搬家公司', sub: '搬家 · 周六上午'}, {title: '打包书和衣服', sub: '搬家 · 4 个箱子'}],
  doing: [{title: '整理旧家具', sub: '家里 · 送人或卖掉'}],
  done: [{title: '看房签约', sub: '搬家 · 已完成'}, {title: '买纸箱胶带', sub: '采购 · 已完成'}],
};
export function checkKanbanInputs(x: KanbanInputs): string[] {
  const t = (a: Task[]) => a.map((k) => k.title);
  return checkInputs(PROJECT_CARD_KANBAN_DRAG_CONTRACT, {line1: x.line1, line2: x.line2, button: x.button, project: x.project, meta: x.meta, columns: x.columns, todo: t(x.todo), doing: t(x.doing), done: t(x.done)});
}
export const planKanban = (sec: number) => planExtras(PROJECT_CARD_KANBAN_DRAG_CONTRACT, sec);
export const kanbanFrames = (extras: number[]) => Math.round(outputDuration(PROJECT_CARD_KANBAN_DRAG_CONTRACT, extras) * FPS);
export const PROJECT_CARD_KANBAN_DRAG_DURATION = 171;

// ═════════ 小件 ═════════
const DBlur: React.FC<{sx: number; sy?: number; children: React.ReactNode}> = ({sx, sy = 0, children}) => {
  const id = 'kb' + React.useId().replace(/[^a-zA-Z0-9]/g, '');
  const on = sx + sy > 0.3;
  return (
    <div style={{position: 'absolute', inset: 0}}>
      {on && (
        <svg width={0} height={0} style={{position: 'absolute'}} aria-hidden>
          <filter id={id} x="-20%" y="-30%" width="140%" height="160%" colorInterpolationFilters="sRGB"><feGaussianBlur stdDeviation={`${sx.toFixed(2)} ${sy.toFixed(2)}`} /></filter>
        </svg>
      )}
      <div style={{position: 'absolute', inset: 0, filter: on ? `url(#${id})` : undefined}}>{children}</div>
    </div>
  );
};
const Backdrop: React.FC<{t: number}> = ({t}) => {
  const dr = t * 0.32;
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: 'linear-gradient(180deg, #e2e6fa 0%, #e6eafb 38%, #eef1fb 68%, #f5f7f6 100%)'}}>
      <AbsoluteFill style={{background: `radial-gradient(ellipse 34% 46% at ${80 - dr}% 9%, rgba(184,192,250,0.95) 0%, rgba(197,204,251,0.55) 45%, rgba(197,204,251,0) 100%)`}} />
      <AbsoluteFill style={{background: `radial-gradient(ellipse 22% 30% at ${8 + dr * 0.4}% 14%, rgba(206,210,248,0.7) 0%, rgba(206,210,248,0) 100%)`}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 40% 42% at 10% 96%, rgba(226,243,190,0.95) 0%, rgba(233,244,205,0.55) 45%, rgba(233,244,205,0) 100%)'}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 38% 36% at 92% 96%, rgba(250,252,253,0.95) 0%, rgba(250,252,253,0) 100%)'}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 50% 40% at 50% 48%, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 100%)'}} />
      <Vignette strength={0.1} color="#3a3f6a" inner={0.5} />
      <Grain opacity={0.035} />
    </AbsoluteFill>
  );
};
const Icon: React.FC<{d: string; c?: string; s?: number; w?: number}> = ({d, c = INK, s = 20, w = 2}) => (
  <svg width={s} height={s} viewBox="0 0 24 24" style={{flex: 'none'}}><path d={d} stroke={c} strokeWidth={w} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
const FOLDER = 'M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z';
const CHECK = 'M5 12.5l4.5 4.5L19 7.5';
const Arrow: React.FC<{x: number; y: number; op?: number}> = ({x, y, op = 1}) => (
  <svg width="40" height="56" viewBox="-2 -2 30 42" style={{position: 'absolute', left: x - 2.7, top: y - 2.7, opacity: op, overflow: 'visible', filter: op > 0.5 ? 'drop-shadow(0 3px 4px rgba(20,24,60,0.3))' : undefined}}>
    <path d="M0 0 L0 30 L7.2 23.4 L12 34.2 L16.6 32.2 L11.9 21.6 L21.6 21.6 Z" fill="#111" stroke="#fff" strokeWidth="2" strokeLinejoin="round" />
  </svg>
);
const Ripple: React.FC<{s: number; x: number; y: number; t0: number}> = ({s, x, y, t0}) => {
  const u = (s - t0) / 0.42;
  if (u < 0 || u > 1) return null;
  const d = mix(40, 104, 1 - Math.pow(1 - u, 2.4));
  const op = 0.55 * clamp(u / 0.12) * (1 - sm((u - 0.35) / 0.65));
  return <div style={{position: 'absolute', left: x - d / 2, top: y - d / 2, width: d, height: d, borderRadius: d, border: `1.6px solid rgba(70,84,236,${op.toFixed(3)})`, background: `rgba(120,132,250,${(op * 0.08).toFixed(3)})`}} />;
};

// ═════════ 大字：逐字从下浮上来，两行叠着打 ═════════
const HF = 104;
const Headline: React.FC<{s: number; x: KanbanInputs; blue: string}> = ({s, x, blue}) => {
  const l1 = Array.from(x.line1), l2 = Array.from(x.line2);
  const ct = (li: number, i: number) => (li === 0 ? 0.2 + (i * 0.6) / Math.max(1, l1.length) : 0.5 + (i * 0.5) / Math.max(1, l2.length));
  const line = (chars: string[], li: number, cy: number, col: string, italic: boolean) => (
    <div style={{position: 'absolute', left: 0, right: 0, top: cy - HF * 0.66, textAlign: 'center', fontSize: HF, lineHeight: `${HF * 1.32}px`, fontWeight: 600, fontFamily: SANS, letterSpacing: '-0.01em', whiteSpace: 'pre'}}>
      {chars.map((ch, i) => {
        const t0 = ct(li, i);
        const k = clamp((s - t0) / 0.1);
        const e = 1 - Math.pow(1 - k, 3);
        return (
          <span key={i} style={{display: 'inline-block', opacity: s < t0 ? 0 : 0.2 + 0.8 * e, transform: `translateY(${(HF * 0.3 * (1 - e)).toFixed(2)}px)${italic ? ' skewX(-9deg)' : ''}`,
            color: mixc('#c4c8dc', col, e), filter: k < 0.98 ? `blur(${(4.5 * (1 - e)).toFixed(2)}px)` : undefined}}>{ch}</span>
        );
      })}
    </div>
  );
  return <>{line(l1, 0, 164, INK, false)}{line(l2, 1, 278, blue, true)}</>;
};

// ═════════ 项目卡（同一个容器：胶囊 → 大卡 → 缩小）═════════
const PILL = {cx: 960, cy: fy(52), w: 290, h: 72};
const CARD_A = {cx: 960, top: fy(51), w: 832, h: 276};
const CARD_SCALE_B = 0.726;
const CARD_B = {cx: 960, top: fy(40)};
const progressAt = (s: number, to: number) => to * trk(s, [[2.6, 0], [2.9, 0.06], [3.3, 0.24], [3.8, 0.5], [4.3, 0.78], [4.7, 0.95], [4.9, 1]]);

const ProjectCard: React.FC<{s: number; x: KanbanInputs; blue: string}> = ({s, x, blue}) => {
  if (s < 0.1) return null;
  // 胶囊
  const pillIn = eo(s, 0.1, 0.22);
  const press = trk(s, [[0.78, 1], [0.82, 0.93], [0.86, 0.96], [0.9, 1]]);
  const pillOp = clamp((s - 0.1) / 0.08) * (1 - rp(s, 0.97, 1.06));
  // 卡撑开：上沿基本不动，往左右和下方长
  const g = trk(s, [[0.96, 0], [0.99, 0.3], [1.02, 0.62], [1.06, 0.85], [1.09, 0.92], [1.19, 0.97], [1.38, 1]]);
  const shrink = eo(s, 1.95, 2.55);
  const w = mix(PILL.w, CARD_A.w, g), h = mix(PILL.h, CARD_A.h, g);
  const top0 = mix(PILL.cy - PILL.h / 2, CARD_A.top, g);
  const sc = mix(1, CARD_SCALE_B, shrink);
  const top = mix(top0, CARD_B.top, shrink);
  const cardOp = clamp((s - 0.96) / 0.06);
  const blur = s < 1.09 ? 6 * (1 - clamp((s - 0.96) / 0.13)) : 0;
  const pct = Math.round(progressAt(s, x.progressTo ?? 72));
  return (
    <>
      {pillOp > 0.003 && (
        <div style={{position: 'absolute', left: PILL.cx - PILL.w / 2, top: PILL.cy - PILL.h / 2, width: PILL.w, height: PILL.h, borderRadius: PILL.h, background: '#fff', opacity: pillOp,
          transform: `scale(${(mix(0.55, 1, pillIn) * press).toFixed(4)})`, boxShadow: '0 1px 0 rgba(255,255,255,0.9) inset, 0 3px 8px rgba(50,60,150,0.08), 0 14px 30px rgba(60,70,160,0.12)',
          border: '1px solid #e9ebf3', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, fontFamily: SANS, fontSize: 26, fontWeight: 600, color: INK, whiteSpace: 'pre'}}>
          <Icon d={FOLDER} s={24} />{x.button}
        </div>
      )}
      {cardOp > 0.003 && (
        <div style={{position: 'absolute', left: CARD_A.cx - w / 2, top, width: w, height: h, borderRadius: 26, background: '#fff', opacity: cardOp, overflow: 'hidden',
          transform: `scale(${sc.toFixed(4)})`, transformOrigin: '50% 0%', filter: blur > 0.2 ? `blur(${blur.toFixed(2)}px)` : undefined,
          boxShadow: '0 1px 0 rgba(255,255,255,0.9) inset, 0 3px 8px rgba(50,60,150,0.06), 0 26px 52px rgba(60,70,160,0.13)', fontFamily: SANS}}>
          <div style={{position: 'absolute', left: (w - CARD_A.w) / 2, top: 0, width: CARD_A.w, height: CARD_A.h}}>
            <div style={{position: 'absolute', left: 38, top: 36, display: 'flex', alignItems: 'center', gap: 14, fontSize: 32, fontWeight: 700, color: INK, whiteSpace: 'pre'}}>
              <span style={{width: 12, height: 12, borderRadius: 12, background: blue}} />{x.project}
            </div>
            <div style={{position: 'absolute', right: 38, top: 38, display: 'flex'}}>
              {[['林', '#e5e8ff', blue], ['周', '#eef7d4', '#5f7a0e'], ['陈', '#fde8f1', '#c2417c'], ['王', '#fff1e3', '#c46a12']].map(([n, bg, fg], i) => (
                <div key={i} style={{width: 36, height: 36, borderRadius: 36, background: bg, color: fg, fontSize: 15, fontWeight: 600, border: '2.5px solid #fff', marginLeft: i ? -9 : 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{n}</div>
              ))}
            </div>
            <div style={{position: 'absolute', left: 64, top: 90, fontSize: 19, color: GRAY, whiteSpace: 'pre'}}>{x.meta}</div>
            <div style={{position: 'absolute', left: 38, right: 38, top: 178, display: 'flex', fontSize: 18, color: GRAY}}>
              进度<span style={{marginLeft: 'auto', color: INK, fontWeight: 700, fontSize: 20}}>{pct}%</span>
            </div>
            <div style={{position: 'absolute', left: 38, right: 38, top: 216, height: 10, borderRadius: 10, background: '#eef0f6'}}>
              <div style={{width: `${pct}%`, height: '100%', borderRadius: 10, background: blue}} />
            </div>
          </div>
        </div>
      )}
      <Ripple s={s} x={fx(53.6)} y={fy(54.2)} t0={0.8} />
    </>
  );
};

// ═════════ 看板 ═════════
const COLS = [[11.4, 35.6], [38, 62], [64.4, 88.4]].map(([a, b]) => ({l: fx(a), r: fx(b)}));
const COL_TOP = fy(57.7), COL_BOT = fy(87.6), HEAD_Y = fy(60.3);
const ROW_Y = (r: number) => fy(65.7 + r * 8.18);
const CARD_H = 84, INSET = 26;
const colCx = (c: number) => (COLS[c].l + COLS[c].r) / 2;
const CARD_W = COLS[0].r - COLS[0].l - INSET * 2;
const TASK_COLORS = ['#835ff4', '#2a42f4', '#9dc031', '#f39a3c', '#2a42f4'];

const TaskCard: React.FC<{task: Task; cx: number; cy: number; color: string; check?: number; rot?: number; scale?: number; lift?: number; blurX?: number}> = ({task, cx, cy, color, check = 0, rot = 0, scale = 1, lift = 0, blurX = 0}) => (
  <div style={{position: 'absolute', left: cx - CARD_W / 2, top: cy - CARD_H / 2, width: CARD_W, height: CARD_H, borderRadius: 14, background: '#fff', transform: `rotate(${rot.toFixed(3)}deg) scale(${scale.toFixed(4)})`,
    boxShadow: `0 1px 2px rgba(40,50,120,0.05), 0 ${(4 + 18 * lift).toFixed(1)}px ${(10 + 30 * lift).toFixed(1)}px rgba(40,50,140,${(0.06 + 0.14 * lift).toFixed(3)})`,
    filter: blurX > 0.3 ? `blur(${Math.min(5, blurX * 0.35).toFixed(2)}px)` : undefined, fontFamily: SANS}}>
    <div style={{position: 'absolute', left: 18, top: 18, width: 4, height: CARD_H - 36, borderRadius: 4, background: color}} />
    <div style={{position: 'absolute', left: 36, top: 15, fontSize: 21, fontWeight: 600, color: INK, whiteSpace: 'pre'}}>{task.title}</div>
    <div style={{position: 'absolute', left: 36, top: 48, fontSize: 14, color: GRAY, whiteSpace: 'pre'}}>{task.sub}</div>
    {check > 0.01 && (
      <div style={{position: 'absolute', right: 18, top: CARD_H / 2 - 14, width: 28, height: 28, borderRadius: 28, background: '#2fb36b', transform: `scale(${eo(check, 0, 1).toFixed(3)})`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <Icon d={CHECK} c="#fff" s={18} w={2.8} />
      </div>
    )}
  </div>
);

// 被拖的卡：中心坐标（%）、角度、放大、投影
type Drag = {x: number; y: number; rot: number; sc: number; lift: number; vx: number};
const dragAt = (s: number, which: 1 | 2): Drag => {
  const K1x: P = [[3.0, 24.6], [3.05, 25.2], [3.16, 25.4], [3.21, 34], [3.26, 44], [3.43, 46.5], [3.5, 50], [3.68, 50]];
  const K1y: P = [[3.0, 65.7], [3.05, 65.0], [3.16, 64.9], [3.26, 65.0], [3.43, 65.2], [3.47, 70.5], [3.5, 73.9], [3.68, 73.88]];
  const K2x: P = [[4.0, 50], [4.05, 50.6], [4.1, 50.9], [4.17, 63], [4.25, 74.5], [4.45, 76.4]];
  const K2y: P = [[4.0, 65.7], [4.05, 65.0], [4.1, 65.1], [4.17, 73.5], [4.25, 81.2], [4.45, 82.06]];
  const [kx, ky, t0, t1] = which === 1 ? [K1x, K1y, 3.0, 3.68] : [K2x, K2y, 4.0, 4.45];
  const x = trk(s, kx), y = trk(s, ky);
  const vx = Math.abs(fx(trk(s + 0.017, kx)) - fx(trk(s - 0.017, kx))) / 1.0; // px / 帧
  const up = eo(s, t0, t0 + 0.06) * (1 - rp(s, t1 - 0.08, t1));
  const rot = -4 * eo(s, t0, t0 + 0.06) * (1 - rp(s, which === 1 ? 3.5 : 4.27, which === 1 ? 3.65 : 4.42));
  return {x, y, rot, sc: 1 + 0.05 * up, lift: up, vx};
};

const Board: React.FC<{s: number; x: KanbanInputs; blue: string}> = ({s, x, blue}) => {
  if (s < 2.1) return null;
  const colIn = (c: number) => eo(s, 2.15 + 0.1 * c, 2.5 + 0.1 * c);
  const n0 = s < 3.68 ? 2 : 1, n1 = s < 3.68 ? 1 : s < 4.45 ? 2 : 1, n2 = s < 4.45 ? 2 : 3;
  const counts = [n0, n1, n2];
  // 补位
  const fill0 = eo(s, 3.73, 3.82); // 第 1 列第 2 张 → 第 1 行
  const fill1 = eo(s, 4.6, 4.7); // 第 2 列第 2 张（刚拖进来的）→ 第 1 行
  const cards: React.ReactNode[] = [];
  const colShift = (c: number) => ({op: colIn(c), dy: 46 * (1 - colIn(c))});
  // 静止的卡
  const put = (key: string, task: Task, c: number, r: number, color: string, check = 0) => {
    const {op, dy} = colShift(c);
    cards.push(<div key={key} style={{position: 'absolute', inset: 0, opacity: op, transform: `translateY(${dy.toFixed(2)}px)`}}><TaskCard task={task} cx={colCx(c)} cy={r + 0} color={color} check={check} /></div>);
  };
  put('t1', x.todo[1], 0, mix(ROW_Y(1), ROW_Y(0), fill0), TASK_COLORS[1]);
  if (s < 3.0) put('t0', x.todo[0], 0, ROW_Y(0), TASK_COLORS[0]);
  if (s < 4.0) put('d0', x.doing[0], 1, ROW_Y(0), TASK_COLORS[2]);
  if (s >= 3.68) put('t0b', x.todo[0], 1, mix(ROW_Y(1), ROW_Y(0), fill1), TASK_COLORS[0]);
  put('n0', x.done[0], 2, ROW_Y(0), TASK_COLORS[3], 1);
  put('n1', x.done[1], 2, ROW_Y(1), TASK_COLORS[4], 1);
  if (s >= 4.45) put('d0b', x.doing[0], 2, ROW_Y(2), TASK_COLORS[2], clamp((s - 4.55) / 0.12));
  // 被拖的卡（最上层）
  let dragged: React.ReactNode = null;
  if (s >= 3.0 && s < 3.68) { const d = dragAt(s, 1); dragged = <TaskCard task={x.todo[0]} cx={fx(d.x)} cy={fy(d.y)} color={TASK_COLORS[0]} rot={d.rot} scale={d.sc} lift={d.lift} blurX={d.vx} />; }
  if (s >= 4.0 && s < 4.45) { const d = dragAt(s, 2); dragged = <TaskCard task={x.doing[0]} cx={fx(d.x)} cy={fy(d.y)} color={TASK_COLORS[2]} rot={d.rot} scale={d.sc} lift={d.lift} blurX={d.vx} />; }
  return (
    <>
      {COLS.map((c, i) => {
        const {op, dy} = colShift(i);
        return (
          <div key={i} style={{position: 'absolute', left: c.l, top: COL_TOP + dy, width: c.r - c.l, height: COL_BOT - COL_TOP, borderRadius: 18, opacity: op,
            background: 'rgba(243,244,250,0.92)', border: '1px solid rgba(232,234,244,0.9)', fontFamily: SANS}}>
            <div style={{position: 'absolute', left: INSET, top: HEAD_Y - COL_TOP - 14, display: 'flex', alignItems: 'center', gap: 10, fontSize: 20, fontWeight: 700, color: INK, whiteSpace: 'pre'}}>
              {x.columns[i]}<span style={{fontSize: 15, fontWeight: 500, color: GRAY}}>{counts[i]}</span>
            </div>
          </div>
        );
      })}
      {cards}
      {dragged}
    </>
  );
};

// ═════════ 光标（%）═════════
const CUR: [number, number, number][] = [
  [0, 83, 98], [0.1, 84, 98], [0.2, 82, 98], [0.3, 78, 91], [0.4, 66, 73], [0.5, 56, 59], [0.6, 53.6, 55.2], [0.72, 53.4, 54], [0.9, 53.4, 54.1], [1.1, 52.6, 54.6],
  [1.4, 51, 55.4], [1.6, 49.4, 56.4], [1.8, 43, 60], [2.0, 33.6, 65], [2.2, 29, 67], [2.4, 26.6, 69], [2.6, 26, 69], [3.0, 26, 69],
];
const CUR_B: [number, number, number][] = [[3.68, 52, 77.2], [3.75, 52.2, 74], [3.85, 52, 70], [3.95, 52, 69], [4.0, 52, 69]];
const CUR_C: [number, number, number][] = [[4.45, 78.4, 85.4], [4.75, 79, 85.6], [4.9, 81, 88], [5.0, 82, 90], [5.1, 85, 95], [5.2, 90, 99], [5.35, 95, 106]];
const pick3 = (arr: [number, number, number][], s: number): [number, number] => [trk(s, arr.map((p) => [p[0], p[1]] as [number, number])), trk(s, arr.map((p) => [p[0], p[2]] as [number, number]))];
const cursorPct = (s: number): [number, number] => {
  if (s < 3.0) return pick3(CUR, s);
  if (s < 3.68) { const d = dragAt(s, 1); return [d.x + 1.4, d.y + 3.3]; }
  if (s < 4.0) return pick3(CUR_B, s);
  if (s < 4.45) { const d = dragAt(s, 2); return [d.x + 2.0, d.y + 3.3]; }
  return pick3(CUR_C, s);
};
const Cursor: React.FC<{s: number}> = ({s}) => {
  const [px, py] = cursorPct(s);
  const x = fx(px), y = fy(py);
  if (y > 1100) return null;
  const [qx, qy] = cursorPct(s - 1 / 30);
  const ox = fx(qx), oy = fy(qy);
  const sp = Math.hypot(x - ox, y - oy);
  const ghosts = sp > 18 ? 5 : 0;
  return (
    <>
      {Array.from({length: ghosts}, (_, k) => { const f = (k + 1) / (ghosts + 1); return <Arrow key={k} x={mix(x, ox, f)} y={mix(y, oy, f)} op={0.22 * (1 - f) * clamp((sp - 18) / 30)} />; })}
      <Arrow x={x} y={y} />
    </>
  );
};

// ═════════ 整组 ═════════
export type KanbanProps = {inputs?: KanbanInputs; extras?: number[]};
export const ProjectCardKanbanDragGroup: React.FC<KanbanProps> = ({inputs = KANBAN_DEFAULT_INPUTS, extras = [0, 0]}) => {
  const C = PROJECT_CARD_KANBAN_DRAG_CONTRACT;
  const fo = useCurrentFrame();
  const t = fo / FPS;
  const s = toSource(t, C, extras);
  const hd = Math.max(0, t - s);
  const blue = inputs.brandColor ?? '#2a42f4';
  const push = 1 + 0.004 * s + 0.01 * hd; // 全程极慢推近，停留时多推一点（R7）；推近中心放在看板上方，写满停满时第 3 列最后一张也不出画
  return (
    <AbsoluteFill style={{overflow: 'hidden', fontFamily: SANS}}>
      <Backdrop t={t} />
      <AbsoluteFill style={{transform: `scale(${push.toFixed(5)})`, transformOrigin: '960px 700px'}}>
        <Headline s={s} x={inputs} blue={blue} />
        <ProjectCard s={s} x={inputs} blue={blue} />
        <Board s={s} x={inputs} blue={blue} />
        <Cursor s={s} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
export const ProjectCardKanbanDrag: React.FC = () => <ProjectCardKanbanDragGroup />;

if (checkContract(PROJECT_CARD_KANBAN_DRAG_CONTRACT).length) throw new Error(checkContract(PROJECT_CARD_KANBAN_DRAG_CONTRACT).join('; '));
