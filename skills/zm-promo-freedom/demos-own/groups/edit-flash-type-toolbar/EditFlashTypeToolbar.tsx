// 【镜头组】edit-flash-type-toolbar：大字逐词从远处冲到眼前 → 甩镜头换成第二个词、整块高亮 → 删掉重新打一句 →
//   一条巨大的工具栏从左边盖过来，光标点一下"评论" → 镜头猛地拉远，原来工具栏贴在一张网页下面，评论栏从右边滑进来（022-C 一拍）
// 学的动作（Magic Patterns · Screens 22.90–29.60s，60fps 逐帧看过；时间表 （内部拆片记录，未随项目提供））：
//   白底；每个词各自从很小冲到原位（错开 0.06s，ease-out）；停一下，整句开始慢慢左移然后被甩出画（横糊），
//   第二个词从右边甩进来，长尾巴停到中间；整块蓝色高亮 + 字猛地放大 1.2 倍（同一帧）；
//   字删掉只剩光标，逐字打出第三句（始终居中）；工具栏从左边高速滑进来盖住字（工具栏在字上面），停下后镜头慢慢拉远一点；
//   手形光标从下面升上来停在评论按钮上，按下后按钮变蓝；镜头 0.2 秒内从 ×4.5 拉到 ×1：工具栏是网页下沿的工具条；
//   评论栏从右边滑进来，网页往左让位，编号评论点弹出来。
// 我们的内容：待办 App「小周」。大字"哪一页 都能改" → "立刻" → "留下评论"；网页是「小周」的"本周菜单"页（第4轮起卡片用真菜照片）。
//
// 拍表（源秒，30fps）
//   拍 1 逐词冲出     0.00–0.40   词 0.00 / 0.06 / 0.12（停留点 0.75：看句子）
//   拍 2 甩镜头+高亮  1.05–2.10   甩 1.20–1.50、第二个词 1.36–1.90 落定、高亮 2.07
//   拍 3 删掉重打     2.67–4.00   删 2.67、逐字 2.73–3.90
//   拍 4 工具栏+点击  4.10–5.50   工具栏 4.10–4.45、光标 4.45–4.72、按下 5.42、变蓝 5.47
//   拍 5 拉远+评论栏  5.95–6.60   拉远 5.95–6.16、评论栏 6.08–6.50、评论点 6.38 / 6.50（停留点 6.65：看页面）
// 毛病清单：
//   - 通用：画面永远不停（停留时慢推）；动作叠着走；--hq 渲染；确定性
//   - 独有 1：甩镜头是同一条"横带"在走，不是两个词各自淡入淡出；快段横糊
//   - 独有 2：高亮和放大同一帧发生，不做过渡
//   - 独有 3：工具栏在字上面盖过来（字不动）；工具栏和最后网页下沿的工具条是同一个东西
import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {FONT, Grain, mix} from '../../../assets/lib/helpers/polish';
import {GroupContract, checkContract, checkInputs, outputDuration, planExtras, toSource} from '../../../assets/lib/helpers/groupClock';

const FPS = 30;
const SANS = `"PingFang SC", "Noto Sans CJK SC", "Noto Sans SC", ${FONT.sans}`;
const INK = '#121317';
const ICON = '#5d5f66';
const BLUE = '#4a4fe0';

const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const eo = (t: number, a: number, b: number) => { const c = clamp((t - a) / (b - a)); return 1 - Math.pow(1 - c, 3); };
const eob = (t: number, a: number, b: number) => { const c = clamp((t - a) / (b - a)); const k = 1.7; return 1 + (k + 1) * Math.pow(c - 1, 3) + k * Math.pow(c - 1, 2); };
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

// ═════════ 合同 ═════════
export const EDIT_FLASH_TYPE_TOOLBAR_CONTRACT: GroupContract = {
  sourceDuration: 201 / 30, // 6.7s
  fps: 30,
  motion: [[0, 0.6], [0.9, 6.6]],
  holds: [
    {at: 0.75, maxExtra: 1.0}, // 第一句停住看
    {at: 6.65, maxExtra: 2.0}, // 网页 + 评论栏停住看
  ],
  landmarks: {words: 0, whip1: 1.2, flash: 2.07, erase: 2.67, type: 2.73, toolbar: 4.1, cursor: 4.45, click: 5.42, zoomOut: 5.95, panel: 6.08, pin1: 6.38, pin2: 6.5, exit: 201 / 30},
  sfx: [
    {at: 'words', type: '短甩', note: '短促 whoosh（词冲到眼前）', tail: 0.3, volume: 0.3},
    {at: 'whip1', type: '短甩', note: '甩镜头 swish', tail: 0.4, volume: 0.35},
    {at: 'flash', type: '点击', note: '轻 click（全选高亮）', volume: 0.3},
    {at: 'erase', type: '键盘', note: '删除 tick', volume: 0.25},
    {at: 'type', type: '键盘', note: '键盘 tick 串（逐字）', tail: 1.2, volume: 0.22},
    {at: 'toolbar', type: '短甩', note: '甩镜头 swish', tail: 0.4, volume: 0.35},
    {at: 'click', type: '点击', note: '鼠标点击', volume: 0.35},
    {at: 'zoomOut', offset: -0.03, type: '运镜', note: '拉远 whoosh', tail: 0.4, volume: 0.4},
    {at: 'panel', type: '短甩', note: '轻滑 swipe（评论栏）', tail: 0.3, volume: 0.25},
    {at: 'pin1', type: '弹出', note: '轻 pop ×2（评论点）', volume: 0.25},
  ],
  inputs: {line1: {maxChars: 8}, flash: {maxChars: 4}, typed: {maxChars: 6}, pageTitle: {maxChars: 6}, cards: {count: 3, maxChars: 8}, comments: {count: 2, maxChars: 14}},
};

export type EditInputs = {line1: string[]; flash: string; typed: string; pageTitle: string; cards: string[]; comments: string[]};
export const EDIT_DEFAULT_INPUTS: EditInputs = {
  line1: ['哪一页', '都能改'], flash: '立刻', typed: '留下评论', pageTitle: '本周菜单',
  cards: ['糖醋里脊', '红烧排骨', '家常小炒'], comments: ['周六这道我来做', '排骨记得提前焯水'],
};
export function checkEditInputs(x: EditInputs): string[] {
  const errs = checkInputs(EDIT_FLASH_TYPE_TOOLBAR_CONTRACT, {line1: x.line1.join(''), flash: x.flash, typed: x.typed, pageTitle: x.pageTitle, cards: x.cards, comments: x.comments});
  if (x.line1.length < 2 || x.line1.length > 3) errs.push(`line1 要分成 2–3 个词（逐词冲出），给了 ${x.line1.length} 个：换组`);
  return errs;
}
export const planEdit = (sec: number) => planExtras(EDIT_FLASH_TYPE_TOOLBAR_CONTRACT, sec);
export const editFrames = (extras: number[]) => Math.round(outputDuration(EDIT_FLASH_TYPE_TOOLBAR_CONTRACT, extras) * FPS);
export const EDIT_FLASH_TYPE_TOOLBAR_DURATION = 201;

// ═════════ 小件 ═════════
const HBlur: React.FC<{sx: number; children: React.ReactNode}> = ({sx, children}) => {
  const id = 'eb' + React.useId().replace(/[^a-zA-Z0-9]/g, '');
  const on = sx > 0.3;
  return (
    <div style={{position: 'absolute', inset: 0}}>
      {on && (
        <svg width={0} height={0} style={{position: 'absolute'}} aria-hidden>
          <filter id={id} x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB"><feGaussianBlur stdDeviation={`${sx.toFixed(2)} 0`} /></filter>
        </svg>
      )}
      <div style={{position: 'absolute', inset: 0, filter: on ? `url(#${id})` : undefined}}>{children}</div>
    </div>
  );
};
const Ico: React.FC<{p: string[]; s: number; c?: string; w?: number; fill?: string}> = ({p, s, c = ICON, w = 1.6, fill = 'none'}) => (
  <svg width={s} height={s} viewBox="0 0 24 24" style={{display: 'block'}}>{p.map((d, i) => <path key={i} d={d} stroke={c} strokeWidth={w} fill={fill} strokeLinecap="round" strokeLinejoin="round" />)}</svg>
);
const I = {
  arrow: ['M5 4l6.5 16 2.3-6.9L20.5 11z'],
  hand: ['M18 11V6a2 2 0 0 0-4 0', 'M14 10V4a2 2 0 0 0-4 0v2', 'M10 10.5V6a2 2 0 0 0-4 0v8', 'M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-6-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15'],
  text: ['M5 6.5V4h14v2.5', 'M9.5 20h5', 'M12 4v16'],
  frame: ['M5 4h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z', 'M3 9h18'],
  bubble: ['M7.9 20A9 9 0 1 0 4 16.1L2.5 21.5z'],
  undo: ['M4 8v5h5', 'M20 17a8 8 0 0 0-14.4-4.6L4 13'],
  redo: ['M20 8v5h-5', 'M4 17a8 8 0 0 1 14.4-4.6L20 13'],
  search: ['M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14z', 'M20 20l-4-4'],
  home: ['M4 11l8-7 8 7', 'M6 10v9h12v-9'],
  cart: ['M3 4h2.5l2.2 10.5h10.6L20.5 7H7', 'M9.5 19.5a1 1 0 1 0 0-.01', 'M17 19.5a1 1 0 1 0 0-.01'],
  music: ['M9 18V5l11-2v13', 'M6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6z', 'M17 19a3 3 0 1 0 0-6 3 3 0 0 0 0 6z'],
  back: ['M15 5l-7 7 7 7'],
};
const POINTER = ['M22 14a8 8 0 0 1-8 8', 'M18 11v-1a2 2 0 0 0-4 0', 'M14 10V9a2 2 0 0 0-4 0v1', 'M10 9.5V4a2 2 0 0 0-4 0v10', 'M18 11a2 2 0 1 1 4 0v3a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-6-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15'];

// ═════════ 拍 1–3：大字横带 ═════════
const F1 = 148, F2 = 172, F3 = 168;
const W2X = 3097; // 第二个词在横带上的位置（相对第一句中心）
const SHIFT: P = [[1.04, 0], [1.10, 21], [1.16, 168], [1.23, 364], [1.26, 525], [1.30, 824], [1.33, 1297], [1.36, 1777], [1.40, 2200], [1.43, 2600], [1.50, 2930], [1.60, 3040], [1.75, 3088], [1.92, W2X]];
const Strip: React.FC<{s: number; x: EditInputs}> = ({s, x}) => {
  const sh = trk(s, SHIFT);
  const v = Math.abs(trk(s + 1 / 60, SHIFT) - trk(s - 1 / 60, SHIFT)) * 30; // px / 秒；原片甩镜头几乎不糊，只在最快几帧（>250px/帧）轻糊
  const grow = 1 + 0.035 * eo(s, 0.25, 1.2);
  const flash = s >= 2.07 && s < 2.67;
  const fk = s >= 2.07 ? 1.2 + 0.03 * eo(s, 2.1, 2.67) : 1; // 高亮同一帧放大；之后极慢再推一点
  const chars = Array.from(x.typed);
  const per = 1.1 / Math.max(1, chars.length - 1); // 最后一个字落在 3.83（原片打完的时刻），字少时每个字更慢
  const n = s < 2.73 ? 0 : Math.max(0, Math.min(chars.length, Math.floor((s - 2.73) / per) + 1));
  const cw = (c: string) => (/[\x00-\x7f]/.test(c) ? 0.56 : 1.02) * F3; // 估字宽：整句始终居中，新字出来时整句平滑让位
  const wAt = (k: number) => chars.slice(0, k).reduce((a, c) => a + cw(c), 0);
  const nf = s < 2.73 ? 0 : Math.min(chars.length, (s - 2.73) / per + 1);
  const wSmooth = wAt(Math.floor(nf)) + (Math.floor(nf) < chars.length ? cw(chars[Math.floor(nf)]) * eo(nf % 1, 0, 0.95) : 0);
  const typing = s >= 2.67 && s < 4.45;
  const caretOn = typing && (s < 3.95 || Math.floor((s - 3.95) / 0.27) % 2 === 1);
  const fadeT = 1 - eo(s, 4.28, 4.42);
  return (
    <HBlur sx={Math.min(5, Math.max(0, v / 30 - 250) * 0.03)}>
      {s < 1.6 && (
        <div style={{position: 'absolute', left: 960 - sh, top: 540, transform: `translate(-50%,-50%) scale(${grow.toFixed(4)})`, display: 'flex', gap: F1 * 0.28, whiteSpace: 'nowrap'}}>
          {x.line1.map((w, i) => { const k = eo(s, 0.06 * i, 0.06 * i + 0.34); return <span key={i} style={{display: 'inline-block', fontSize: F1, fontWeight: 500, color: INK, letterSpacing: '0.01em', transform: `scale(${(0.05 + 0.95 * k).toFixed(4)})`, opacity: clamp(k * 4)}}>{w}</span>; })}
        </div>
      )}
      {s >= 1.3 && s < 2.67 && (
        <div style={{position: 'absolute', left: 960 + W2X - sh, top: 540, transform: `translate(-50%,-50%) scale(${fk})`, whiteSpace: 'nowrap'}}>
          <span style={{fontSize: F2, fontWeight: 500, color: INK, padding: '0 10px', background: flash ? '#64a6f2' : 'transparent', lineHeight: 1.15, display: 'inline-block'}}>{x.flash}</span>
        </div>
      )}
      {typing && (
        <div style={{position: 'absolute', left: 960 - (wSmooth + 15) / 2, top: 540, transform: 'translateY(-50%)', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', opacity: fadeT}}>
          {chars.slice(0, n).map((c, i) => { const k = eo(s, 2.73 + i * per, 2.73 + i * per + 0.1); return <span key={i} style={{display: 'inline-block', width: cw(c), fontSize: F3, fontWeight: 500, color: INK, opacity: 0.3 + 0.7 * k, transform: `translateY(${(10 * (1 - k)).toFixed(2)}px)`}}>{c}</span>; })}
          <span style={{width: 7, height: F3 * 0.95, marginLeft: 8, background: INK, opacity: caretOn ? 1 : 0}} />
        </div>
      )}
    </HBlur>
  );
};

// ═════════ 拍 4–5：工具栏 + 网页（世界坐标 = 最后的页面视图）═════════
const SP = 64; // 工具栏按钮间距（世界）
const TB = {cx: 960, cy: 975, h: 70, l: -4.6, r: 2.95}; // 以"评论"按钮为 0，单位 SP
const BTN_X = TB.cx - ((TB.l + TB.r) / 2) * SP; // "评论"按钮世界 x
const BTNS: [string[], number][] = [[I.arrow, -4], [I.hand, -3], [I.text, -2], [I.frame, -1], [I.bubble, 0], [I.undo, 1.35], [I.redo, 2.35]];
// 工具栏右沿在屏幕上的位置（拍 4，原片逐帧量）
const EDGE: P = [[4.06, -700], [4.10, -260], [4.13, 127], [4.20, 386], [4.23, 715], [4.26, 1107], [4.30, 1407], [4.33, 1562], [4.36, 1655], [4.39, 1723], [4.43, 1763], [4.6, 1788], [5.2, 1800], [5.9, 1805]];
const ZOOM: P = [[4.06, 5.1], [4.45, 5.0], [5.9, 4.53], [5.95, 4.5]];
const ZOOM_OUT: P = [[5.95, Math.log(4.5)], [5.99, Math.log(3.1)], [6.02, Math.log(1.35)], [6.06, Math.log(1.15)], [6.10, Math.log(1.04)], [6.17, 0]];
type Cam = {z: number; bx: number; by: number}; // 按钮的屏幕位置
const camAt = (s: number, hd: number): Cam => {
  if (s < 5.95) {
    const z = trk(s, ZOOM);
    return {z, bx: trk(s, EDGE) - TB.r * SP * z, by: 540};
  }
  const z = Math.exp(trk(s, ZOOM_OUT));
  const k = 1 - (z - 1) / 3.5; // 0→1：按钮从屏幕中间回到它在页面里的位置
  const pan = eo(s, 6.08, 6.5) * 240; // 评论栏进来，页面往左让
  const push = 1 + 0.01 * clamp(s - 6.2, 0, 0.5) + 0.014 * hd; // 页面落定后一直慢推，停留时推得多一点
  const bxEnd = BTN_X - pan, byEnd = TB.cy;
  return {z: z * push, bx: mix(951, 960 + (bxEnd - 960) * push, clamp(k)), by: mix(540, 540 + (byEnd - 540) * push, clamp(k))};
};

const Toolbar: React.FC<{s: number}> = ({s}) => {
  const on = s >= 5.47;
  const pr = s >= 5.42 && s < 5.52 ? 0.93 : 1;
  const pop = on ? eob(s, 5.47, 5.62) : 0;
  return (
    <div style={{position: 'absolute', left: BTN_X + TB.l * SP, top: TB.cy - TB.h / 2, width: (TB.r - TB.l) * SP, height: TB.h, background: '#fff', borderRadius: 14, border: '1.5px solid #e3e4e8', boxShadow: '0 3px 10px rgba(20,22,40,0.06)'}}>
      <div style={{position: 'absolute', left: (0.675 - TB.l) * SP, top: 16, width: 1.2, height: TB.h - 32, background: '#e1e2e6'}} />
      {BTNS.map(([p, u], i) => {
        const cx = (u - TB.l) * SP;
        const act = u === 0;
        return (
          <div key={i} style={{position: 'absolute', left: cx - 22, top: TB.h / 2 - 22, width: 44, height: 44, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: act ? `scale(${(pr * (0.9 + 0.1 * pop)).toFixed(3)})` : undefined, background: act && on ? BLUE : 'transparent'}}>
            <Ico p={p} s={26} c={act && on ? '#fff' : ICON} w={1.5} />
          </div>
        );
      })}
    </div>
  );
};

// 2026-11-17 第4轮：原片是菜谱页、卡片是真菜照片 → 「小周」的"本周菜单"页，卡片用真照片（library/photos/food，Unsplash 免费授权）
const CARD_PHOTO = ['food01', 'food09', 'food08'];
const ROW2_PHOTO = ['food00', 'food03', 'food10'];
const PAGE = {l: 444, t: 134, w: 1032, h: 692};
const Page: React.FC<{x: EditInputs; s: number}> = ({x, s}) => {
  const chips = ['全部', '早餐', '午餐', '晚餐', '甜点', '快手菜'];
  const pin = (t0: number, n: number, px: number, py: number) => {
    const k = eob(s, t0, t0 + 0.16);
    if (s < t0) return null;
    return <div style={{position: 'absolute', left: px - 13, top: py - 13, width: 26, height: 26, borderRadius: 13, border: `2px solid ${BLUE}`, background: '#fff', color: BLUE, fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${k.toFixed(3)})`, boxShadow: '0 2px 6px rgba(60,70,200,0.2)'}}>{n}</div>;
  };
  return (
    <div style={{position: 'absolute', left: PAGE.l, top: PAGE.t, width: PAGE.w, height: PAGE.h, background: '#fffaf0', borderRadius: 6, boxShadow: '0 4px 18px rgba(20,22,40,0.07)', overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 36, top: 24, fontSize: 15, fontWeight: 700, color: INK}}>小周<span style={{color: '#e4572e'}}>·家</span></div>
      <div style={{position: 'absolute', right: 70, top: 26, display: 'flex', gap: 26, fontSize: 12, color: '#55575e'}}><span>首页</span><span style={{color: '#e4572e'}}>菜单</span><span>日历</span></div>
      <div style={{position: 'absolute', right: 34, top: 22}}><Ico p={I.search} s={18} /></div>
      <div style={{position: 'absolute', left: 36, top: 74, fontSize: 30, fontWeight: 700, color: INK}}>{x.pageTitle}</div>
      <div style={{position: 'absolute', left: 36, top: 128, width: 560, height: 32, borderRadius: 7, background: '#f3eee2', display: 'flex', alignItems: 'center', gap: 8, paddingLeft: 12, fontSize: 11, color: '#a09a8c'}}><Ico p={I.search} s={13} c="#a09a8c" />搜索菜名、食材…</div>
      <div style={{position: 'absolute', right: 36, top: 132, fontSize: 11, color: '#55575e'}}>最近更新 ▾</div>
      <div style={{position: 'absolute', left: 36, top: 180, display: 'flex', gap: 10}}>
        {chips.map((c, i) => <div key={i} style={{padding: '5px 14px', borderRadius: 14, fontSize: 11, background: i === 0 ? '#e4572e' : 'transparent', color: i === 0 ? '#fff' : '#55575e', border: i === 0 ? 'none' : '1px solid #e8e1d2'}}>{c}</div>)}
      </div>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{position: 'absolute', left: 36 + i * 326, top: 226, width: 304}}>
          <Img src={staticFile(`library/photos/food/${CARD_PHOTO[i]}.jpg`)} style={{width: 304, height: 178, borderRadius: 8, objectFit: 'cover', display: 'block'}} />
          <div style={{marginTop: 12, fontSize: 11, color: '#e4572e'}}>● 本周 · {['周六', '周日', '周三'][i]}</div>
          <div style={{marginTop: 4, fontSize: 15, fontWeight: 600, color: INK}}>{x.cards[i]}</div>
          <div style={{marginTop: 6, fontSize: 11, color: '#8d8f96'}}>{['20 分钟 · 妈妈', '45 分钟 · 爸爸', '15 分钟 · 全家'][i]}</div>
        </div>
      ))}
      {[0, 1, 2].map((i) => <Img key={'r' + i} src={staticFile(`library/photos/food/${ROW2_PHOTO[i]}.jpg`)} style={{position: 'absolute', left: 36 + i * 326, top: 520, width: 304, height: 178, borderRadius: 8, objectFit: 'cover'}} />)}
      {pin(6.38, 1, 30, 92)}
      {pin(6.5, 2, 36 + 326 + 304, 236)}
    </div>
  );
};

const Panel: React.FC<{s: number; x: EditInputs; hd: number}> = ({s, x, hd}) => {
  const e = eo(s, 6.08, 6.5);
  if (e <= 0) return null;
  const W = 445;
  const item = (t0: number, i: number) => {
    const k = eo(s, t0, t0 + 0.25);
    return (
      <div key={i} style={{display: 'flex', gap: 12, marginTop: 22, opacity: k, transform: `translateY(${(10 * (1 - k)).toFixed(2)}px)`}}>
        <div style={{width: 30, height: 30, borderRadius: 15, background: ['#f59e5b', '#6d74e8'][i], color: '#fff', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none'}}>{['妈', '雨'][i]}</div>
        <div>
          <div style={{fontSize: 13, fontWeight: 600, color: INK}}>{['妈妈', '小雨'][i]} <span style={{fontWeight: 400, color: '#9a9ca3', fontSize: 11, marginLeft: 6}}>{['刚刚', '1 分钟前'][i]}</span></div>
          <div style={{fontSize: 13, color: '#3d3f45', marginTop: 4, whiteSpace: 'nowrap'}}>{x.comments[i]}</div>
        </div>
        <div style={{marginLeft: 'auto', width: 22, height: 22, borderRadius: 11, border: `1.5px solid ${BLUE}`, color: BLUE, fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none'}}>{i + 1}</div>
      </div>
    );
  };
  return (
    <div style={{position: 'absolute', left: 1920 - W * e + hd * 0, top: 0, width: W, height: 1080, background: '#fff', borderLeft: '1px solid #e6e7ea', padding: '30px 34px', boxSizing: 'border-box'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 10}}><Ico p={I.back} s={18} c={INK} w={2} /><span style={{fontSize: 16, fontWeight: 700, color: INK}}>评论</span><span style={{marginLeft: 'auto', fontSize: 11, color: '#6b6d74', border: '1px solid #e3e4e8', borderRadius: 10, padding: '3px 10px'}}>全部 ▾</span></div>
      <div style={{fontSize: 11, color: '#9a9ca3', marginTop: 18}}>版本 1 · 今天</div>
      {s >= 6.36 && item(6.36, 0)}
      {s >= 6.5 && item(6.5, 1)}
    </div>
  );
};

const PointerCursor: React.FC<{s: number; cam: Cam}> = ({s, cam}) => {
  if (s < 4.45 || s >= 5.97) return null;
  const rise = eo(s, 4.45, 4.75);
  const press = s >= 5.42 && s < 5.52 ? 0.92 : 1;
  const sz = 42 * cam.z * 0.95;
  const x = cam.bx + 0.05 * sz + Math.sin(s * 3) * 4;
  const y = cam.by + 0.18 * sz + (1 - rise) * 620 + Math.cos(s * 2.4) * 3;
  return (
    <div style={{position: 'absolute', left: x - sz * 0.33, top: y - sz * 0.05, width: sz, height: sz, transform: `scale(${press})`, transformOrigin: '33% 10%', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.18))'}}>
      <Ico p={POINTER} s={sz} c="#111" w={1.7} fill="#fff" />
    </div>
  );
};

// ═════════ 整组 ═════════
export type EditProps = {inputs?: EditInputs; extras?: number[]};
export const EditFlashTypeToolbarGroup: React.FC<EditProps> = ({inputs = EDIT_DEFAULT_INPUTS, extras = [0, 0]}) => {
  const C = EDIT_FLASH_TYPE_TOOLBAR_CONTRACT;
  const t = useCurrentFrame() / FPS;
  const s = toSource(t, C, extras);
  const hd = Math.max(0, t - s);
  const hold1 = s < 1 ? hd : 0, hold2 = s > 6.6 ? hd : 0;
  const cam = camAt(s, hold2);
  const panelPush = 1 + 0.01 * clamp(s - 6.2, 0, 0.5) + 0.014 * hold2;
  const pageOn = clamp((s - 5.97) / 0.04);
  const vz = s >= 5.95 && s < 6.12 ? Math.abs(Math.log(camAt(s + 1 / 60, 0).z) - Math.log(camAt(s - 1 / 60, 0).z)) * 30 : 0;
  return (
    <AbsoluteFill style={{overflow: 'hidden', fontFamily: SANS, background: '#fdfdfd'}}>
      <AbsoluteFill style={{background: '#eeeef1', opacity: pageOn}} />
      {s < 4.5 && <AbsoluteFill style={{transform: `scale(${(1 + 0.012 * hold1).toFixed(5)})`}}><Strip s={s} x={inputs} /></AbsoluteFill>}
      {s >= 4.04 && (
        <AbsoluteFill style={{filter: vz > 0.4 ? `blur(${Math.min(6, vz * 1.4).toFixed(2)}px)` : undefined}}>
          <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transformOrigin: '0 0', transform: `translate(${(cam.bx - BTN_X * cam.z).toFixed(2)}px, ${(cam.by - TB.cy * cam.z).toFixed(2)}px) scale(${cam.z.toFixed(5)})`}}>
            {pageOn > 0 && <div style={{opacity: pageOn}}><Page x={inputs} s={s} /></div>}
            <Toolbar s={s} />
          </div>
        </AbsoluteFill>
      )}
      <AbsoluteFill style={{transform: `scale(${panelPush.toFixed(5)})`, transformOrigin: '960px 540px'}}><Panel s={s} x={inputs} hd={hold2} /></AbsoluteFill>
      <PointerCursor s={s} cam={cam} />
      <Grain opacity={0.018} />
    </AbsoluteFill>
  );
};
export const EditFlashTypeToolbar: React.FC = () => <EditFlashTypeToolbarGroup />;

if (checkContract(EDIT_FLASH_TYPE_TOOLBAR_CONTRACT).length) throw new Error(checkContract(EDIT_FLASH_TYPE_TOOLBAR_CONTRACT).join('; '));
