// 【镜头组】search-trash-dock-buttons：暗底搜索栏，I 形光标翻着跟头飞进来 → 镜头分两下猛推、打字「我们删掉了」→ 三个 App 图标一个个滑进搜索栏、镜头横摇跟过去 →
//   硬切：三个小图标被抛起、翻转，掉进从下面升上来的玻璃垃圾桶；上面逐字亮出三行「它们 / 说好要替我们 / 把活干完」→
//   垃圾桶外长出程序坞底板、缩小，底板横向撑开，新图标一个个弹进来；手套光标在坞上滑、图标跟着放大 → 一点，程序坞变成「连接应用 +」按钮 →
//   按钮带运动模糊复制成一摞、满屏乱飞，再一下子收走，留下逐字浮上来的「按钮……」（040-A + 040-B，痛点钩子，一串）
// 学的动作（SkaleSolutions · Aside 0.00–9.90s，29.97fps；网格大图逐点量过，时间表 （内部拆片记录，未随项目提供））：
//   0.42–1.0 以搜索栏左端（335,540）为锚放大 1→2；1.2–1.8 再推 2→6.25（推的时候带运动模糊）；字逐个打出，新字先青色再变白；
//   1.88 / 2.45 / 3.0 三个图标从右边滑进来，镜头分三下往右摇（−266 / −594 / −1119 / −1449px）；4.07 硬切；
//   4.07–4.62 小图标先往上抛再回落、越转越歪，4.72–4.8 掉进桶；桶 4.4–4.85 从下往上升；
//   第一行 4.15 出，4.66–4.86 整块往上让 260px 让出两行；5.85 桶外长出底板，6.0–6.28 缩 0.62，6.32–6.62 撑成程序坞、图标从右往左弹进；
//   7.42 点下 → 坞变成按钮；7.85–8.9 复制、乱飞；8.93 起「按钮……」逐字从下面浮上来、由暗蓝变白。
// 我们的内容：讲「AI 工具越装越多、反而更累」的痛点开场（图标都是自己画的通用图形）。
//
// 拍表（源秒 = 原片秒，30fps 渲染，共 297 帧）
//   拍 1 搜索栏推近 + 打字 + 图标滑入   0.00–3.45   （停留点 3.50）
//   拍 2 图标掉进垃圾桶 + 三行字         3.55–5.65   （停留点 5.70）
//   拍 3 程序坞 → 按钮 → 复制 → 按钮……  5.75–9.70   （停留点 9.75）
// 毛病清单：
//   - 通用：画面永远不停（停留时整体极慢推近）；--hq 渲染；确定性
//   - 独有 1：推近是以搜索栏左端为锚的整体放大，字和栏一起变大，不是只把字放大
//   - 独有 2：复制出来的按钮要有拖影（运动模糊），停下来那几个是清楚的
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Grain} from '../../../assets/lib/helpers/polish';
import {GroupContract, checkContract, checkInputs, outputDuration, planExtras, toSource} from '../../../assets/lib/helpers/groupClock';
import {AppIcon, BAR, BG, CYAN, Hand, IBeam, IconKind, SANS, Trash, clamp, easeInOut, easeOut, mix, mk, mkv} from '../_kit/darkUiKit';

const FPS = 30;

export const SEARCH_TRASH_DOCK_BUTTONS_CONTRACT: GroupContract = {
  sourceDuration: 9.9,
  fps: 30,
  motion: [[0, 3.45], [3.55, 5.65], [5.75, 9.7]],
  holds: [{at: 3.5, maxExtra: 1.0}, {at: 5.7, maxExtra: 1.0}, {at: 9.75, maxExtra: 1.5}],
  landmarks: {cursorIn: 0.45, zoom1: 0.72, type: 1.22, zoom2: 1.3, icon1: 1.88, icon2: 2.45, icon3: 3.0, cut: 4.07, trash: 4.4, drop: 4.78, tile: 5.85, dock: 6.35, click: 7.42, dup: 7.85, collapse: 8.9, outro: 8.95},
  sfx: [
    {at: 'cursorIn', type: '短甩', note: '轻 whoosh', tail: 0.4, volume: 0.25},
    {at: 'zoom1', type: '运镜', note: '推近 whoosh', tail: 0.3, volume: 0.3},
    {at: 'type', type: '键盘', note: '键盘敲字（5 下）', tail: 0.4, volume: 0.35},
    {at: 'icon1', type: '弹出', note: '图标滑入 pop', volume: 0.35},
    {at: 'icon2', type: '弹出', note: '图标滑入 pop', volume: 0.35},
    {at: 'icon3', type: '弹出', note: '图标滑入 pop', volume: 0.35},
    {at: 'drop', type: '落下', note: '掉进垃圾桶 clunk', volume: 0.45},
    {at: 'dock', type: '弹出', note: '弹出 pop ×3', tail: 0.3, volume: 0.3},
    {at: 'click', type: '点击', note: '点击 click', volume: 0.45},
    {at: 'dup', type: '短甩', note: '快速复制 swish 连串', tail: 1.0, volume: 0.4},
    {at: 'outro', type: '轻tick', note: '字浮出 soft tick', volume: 0.25},
  ],
  inputs: {typed: {maxChars: 6}, lineA1: {maxChars: 4}, lineA2: {maxChars: 7}, lineA3: {maxChars: 6}, lineB1: {maxChars: 6}, lineB2: {maxChars: 6}, button: {maxChars: 5}, outro: {maxChars: 4}},
};

export type StdbInputs = {
  placeholder: string; typed: string;
  lineA1: string; lineA2: string; lineA3: string;
  lineB1: string; lineB2: string; button: string; outro: string;
  barIcons: [IconKind, IconKind, IconKind]; dockIcons: [IconKind, IconKind, IconKind];
};
export const STDB_DEFAULT_INPUTS: StdbInputs = {
  placeholder: '搜索或者问点什么…', typed: '我们删掉了',
  lineA1: '它们', lineA2: '说好要替我们', lineA3: '把活干完',
  lineB1: '结果，它们', lineB2: '把你埋进了', button: '连接应用', outro: '按钮……',
  barIcons: ['deepseek', 'kimi', 'qianwen'], dockIcons: ['qqbrowser', 'qqmail', 'yuanbao'],
};
export const checkStdbInputs = (x: StdbInputs) => checkInputs(SEARCH_TRASH_DOCK_BUTTONS_CONTRACT, {typed: x.typed, lineA1: x.lineA1, lineA2: x.lineA2, lineA3: x.lineA3, lineB1: x.lineB1, lineB2: x.lineB2, button: x.button, outro: x.outro});
export const planStdb = (sec: number) => planExtras(SEARCH_TRASH_DOCK_BUTTONS_CONTRACT, sec);
export const stdbFrames = (extras: number[]) => Math.round(outputDuration(SEARCH_TRASH_DOCK_BUTTONS_CONTRACT, extras) * FPS);
export const SEARCH_TRASH_DOCK_BUTTONS_DURATION = 297;

// ── 量出来的节奏（原片秒）──
const ZOOM = [[0, 1], [0.42, 1], [0.5, 1.03], [0.6, 1.09], [0.7, 1.2], [0.8, 1.78], [0.9, 1.94], [1.0, 2.0], [1.15, 2.05], [1.2, 2.17], [1.3, 2.8], [1.4, 3.5], [1.5, 4.6], [1.6, 5.5], [1.8, 6.1], [2.0, 6.25]];
const PAN = [[1.9, 0], [1.94, -10], [1.98, -26], [2.02, -100], [2.06, -226], [2.1, -287], [2.14, -304], [2.22, -321], [2.34, -333], [2.38, -347], [2.42, -414], [2.46, -486], [2.5, -613], [2.54, -858], [2.58, -1008], [2.62, -1086], [2.66, -1106], [2.74, -1130], [2.86, -1148], [2.94, -1158], [2.98, -1170], [3.02, -1241], [3.06, -1359], [3.1, -1414], [3.14, -1434], [3.22, -1458], [3.34, -1464], [3.42, -1465]]; // 相位相关逐帧量（measure_motion.py）
const DRIFT_Y = [[3.58, 0], [3.62, -1], [3.7, -4], [3.78, -9], [3.82, -18], [3.9, -34], [3.98, -60], [4.06, -86]];
const AX = 335, AY = 540; // 放大锚点：搜索栏左端
const IBEAM = [[0.45, 830, 770, -52, 66], [0.55, 760, 690, -45, 80], [0.7, 726, 640, -40, 96], [0.85, 600, 585, -30, 170], [1.0, 568, 555, -6, 205], [1.15, 566, 550, 0, 210]];
// 小图标：中心 x、y、旋转、边长
const TOSS = [
  [[4.07, 642, 517, 0, 184], [4.2, 643, 340, -4, 188], [4.4, 643, 276, -8, 205], [4.62, 653, 318, -15, 209], [4.72, 780, 470, -18, 195], [4.8, 905, 640, -12, 190]],
  [[4.07, 958, 517, 0, 188], [4.2, 958, 330, -2, 188], [4.4, 958, 252, -4, 190], [4.62, 958, 300, -6, 190], [4.72, 975, 460, 0, 180], [4.8, 1000, 625, 8, 170]],
  [[4.07, 1274, 517, 6, 186], [4.2, 1275, 345, 12, 190], [4.4, 1274, 281, 28, 212], [4.62, 1268, 318, 40, 212], [4.72, 1150, 470, 30, 190], [4.8, 1055, 640, 16, 170]],
];
const TRASH_TOP = [[4.3, 1180], [4.4, 1058], [4.65, 637], [4.85, 605], [5.6, 600]];
const LINE_A = [[4.15, 575], [4.66, 570], [4.76, 330], [4.86, 313], [5.6, 290], [6.4, 280]];
const HAND = [[6.58, 640, 600], [6.68, 690, 660], [6.8, 702, 691], [7.0, 770, 724], [7.12, 1000, 780], [7.25, 1061, 821], [7.42, 1072, 852], [7.5, 1074, 864], [7.75, 1074, 864], [7.95, 1015, 832], [8.15, 845, 626], [8.45, 745, 562], [8.8, 1277, 432], [8.93, 1280, 280], [9.05, 1300, 190]];
const DUP_T = [[1600, 110], [1080, 256], [510, 450], [1640, 596], [640, 709], [1250, 380], [300, 250], [1500, 820]];
const DUP_U = [[600, 300], [1110, 30], [1410, 165], [1470, 375], [540, 480], [1380, 555], [360, 645], [510, 1000]];
const DUP_S = [1.04, 1.0, 1.08, 0.97, 1.05, 1.02, 0.95, 1.06];

/** 新字的颜色：灰 → 青 → 白（u = 出现后的秒数） */
const charStyle = (lineU: number, u: number): React.CSSProperties | null => {
  if (lineU < 0) return null;
  if (u < 0) return {color: `rgba(150,150,150,${Math.min(0.55, 0.15 + 6 * lineU)})`};
  if (u < 0.12) return {color: CYAN};
  const k = clamp((u - 0.12) / 0.2);
  return {color: `rgb(${mix(79, 245, k)},${mix(179, 245, k)},${mix(220, 245, k)})`};
};
/** 退场：变暗蓝再消失（u = 开始退场后的秒数） */
const fadeStyle = (u: number): React.CSSProperties => (u <= 0 ? {} : {color: `rgba(${mix(245, 80, clamp(u / 0.1))},${mix(245, 110, clamp(u / 0.1))},${mix(245, 130, clamp(u / 0.1))},${1 - clamp((u - 0.06) / 0.14)})`});

const Line: React.FC<{text: string; y: number; size: number; start: number; step: number; s: number; lead?: number; whole?: boolean; fadeAt?: number; fadeStep?: number; fadeOffset?: number}> = ({text, y, size, start, step, s, lead = 0.08, whole = true, fadeAt, fadeStep = 0.03, fadeOffset = 0}) => (
  <div style={{position: 'absolute', left: 0, width: 1920, top: y - size * 0.92, height: size * 1.2, textAlign: 'center', fontSize: size, fontWeight: 600, letterSpacing: size * 0.01, whiteSpace: 'pre', lineHeight: `${size * 1.2}px`}}>
    {[...text].map((ch, i) => {
      const st = charStyle(whole ? s - start : s - start - i * step, s - start - lead - i * step);
      const fs = fadeAt !== undefined ? fadeStyle(s - fadeAt - (fadeOffset + i) * fadeStep) : {};
      return <span key={i} style={{...(st ?? {color: 'transparent'}), ...fs}}>{ch}</span>;
    })}
  </div>
);

export const SearchTrashDockButtonsGroup: React.FC<{inputs?: StdbInputs; extras?: number[]}> = ({inputs = STDB_DEFAULT_INPUTS, extras = [0, 0, 0]}) => {
  const t = useCurrentFrame() / FPS;
  const s = toSource(t, SEARCH_TRASH_DOCK_BUTTONS_CONTRACT, extras);
  const lag = t - s;
  const cam = 1 + 0.004 * lag;

  // ═════ 拍 1：搜索栏（世界坐标 = 原片 0 秒那一帧的像素）═════
  let beat1: React.ReactNode = null;
  if (s < 4.07) {
    const z = mk(s, ZOOM);
    const zr = Math.abs(mk(s + 0.02, ZOOM) - mk(s - 0.02, ZOOM)) / 0.04 / z; // 相对放大速度
    const n = [...inputs.typed].length;
    const typedW = n * 30;
    const iconX0 = 376 + typedW + 25;
    const panAdj = -(typedW - 134) * 6.25 * easeOut((s - 1.9) / 0.5); // 原片字宽 134，字数不同时摇镜目标跟着图标走
    const px = mk(s, PAN) + (s > 1.9 ? panAdj : 0);
    const py = mk(s, DRIFT_Y);
    const blur = Math.min(3, 0.35 * zr);
    const typeStart = 1.22, typeStep = n > 1 ? 0.38 / (n - 1) : 0;
    const placeholderOn = s < 1.2;
    const chars = [...inputs.typed].map((ch, i) => {
      const st = s >= typeStart + i * typeStep ? (() => { const u = s - typeStart - i * typeStep; const k = clamp((u - 0.05) / 0.2); return {color: `rgb(${mix(95, 248, k)},${mix(184, 248, k)},${mix(214, 248, k)})`}; })() : null;
      return <span key={i} style={st ?? {color: 'transparent'}}>{ch}</span>;
    });
    const icons = inputs.barIcons.map((k, i) => {
      const t0 = [1.85, 2.38, 2.95][i];
      const u = easeOut((s - t0) / 0.3);
      if (s < t0) return null;
      return <div key={i} style={{position: 'absolute', left: iconX0 + i * 92 + 60 * (1 - u), top: 501, opacity: clamp((s - t0) / 0.08)}}><AppIcon kind={k} size={76} /></div>;
    });
    const ib = s >= 0.45 && s < 1.22 ? mkv(s, IBEAM) : null;
    beat1 = (
      <>
        <div style={{position: 'absolute', inset: 0, transform: `translate(${px}px,${py}px) translate(${AX}px,${AY}px) scale(${z}) translate(${-AX}px,${-AY}px)`, transformOrigin: '0 0', filter: blur > 0.3 ? `blur(${blur}px)` : undefined}}>
          {/* 搜索栏：337–1582 × 496–585，圆角 22，外面一圈很淡的蓝光 */}
          <div style={{position: 'absolute', left: 337, top: 496, width: Math.max(1245, iconX0 + 3 * 92 + 60 - 337), height: 89, borderRadius: 22, background: BAR, boxShadow: '0 0 0 1px rgba(255,255,255,0.09), 0 0 30px rgba(70,140,190,0.22), 0 6px 22px rgba(0,0,0,0.35)'}} />
          {placeholderOn && <div style={{position: 'absolute', left: 376, top: 540 - 15, fontSize: 24, lineHeight: '30px', color: '#9b9b9b', whiteSpace: 'pre'}}>{inputs.placeholder}</div>}
          <div style={{position: 'absolute', left: 1316, top: 521, width: 124, height: 38, borderRadius: 10, background: '#2a2b2b', color: '#a5a5a5', fontSize: 20, lineHeight: '38px', textAlign: 'center'}}>搜索</div>
          <div style={{position: 'absolute', left: 1442, top: 521, width: 118, height: 38, borderRadius: 10, background: '#1d1e1e', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.12)', color: '#f2f2f2', fontSize: 20, lineHeight: '38px', textAlign: 'center'}}>问 AI</div>
          <div style={{position: 'absolute', left: 376, top: 540 - 21, fontSize: 30, lineHeight: '42px', fontWeight: 500, whiteSpace: 'pre'}}>{chars}</div>
          {icons}
        </div>
        {ib && <IBeam x={ib[0]} y={ib[1]} rot={ib[2]} h={ib[3]} opacity={clamp((s - 0.45) / 0.06) * (1 - clamp((s - 1.17) / 0.05))} shadow={[130, 130]} />}
      </>
    );
  }

  // ═════ 拍 2–3：硬切之后（屏幕坐标）═════
  let beat2: React.ReactNode = null;
  if (s >= 4.07) {
    const trashTop = mk(s, TRASH_TOP);
    // 底板 / 程序坞的框：中心 x、中心 y、宽、高
    let tile = {cx: 960, cy: 762, w: 534, h: 465, op: 0};
    let trash = {cx: 959, top: trashTop, sc: 1};
    if (s >= 5.85) {
      const a = easeOut((s - 5.85) / 0.12);
      tile = {cx: 960, cy: 762, w: 534 * mix(0.85, 1, a), h: 465 * mix(0.85, 1, a), op: a};
    }
    if (s >= 6.0) {
      const b = easeOut((s - 6.0) / 0.28);
      tile = {cx: mix(960, 958, b), cy: mix(762, 767, b), w: mix(534, 374, b), h: mix(465, 302, b), op: 1};
      trash = {cx: mix(959, 958, b), top: mix(600, 600 + (767 - 770) + 170 * (1 - 0.62) - 0, b), sc: mix(1, 0.62, b)};
    }
    if (s >= 6.32) {
      const c = easeOut((s - 6.32) / 0.3);
      tile = {cx: mix(958, 947, c), cy: mix(767, 766, c), w: mix(374, 1182, c), h: mix(302, 292, c), op: 1};
      trash = {cx: mix(958, 1371, c), top: mix(600 + 64.6 - 3, 659, c), sc: mix(0.62, 0.6, c)};
    }
    const morph = clamp((s - 7.42) / 0.14), mE = easeOut(morph);
    const btn = {x: 440, y: 622, w: 1040, h: 285};
    const box = {x: mix(tile.cx - tile.w / 2, btn.x, mE), y: mix(tile.cy - tile.h / 2, btn.y, mE), w: mix(tile.w, btn.w, mE), h: mix(tile.h, btn.h, mE)};
    const dockFade = 1 - clamp((s - 7.42) / 0.08);
    const hand = s >= 6.58 && s < 9.05 ? mkv(s, HAND) : null;
    const hx = hand ? hand[0] : -999;
    const slotX = [497, 771, 1045];
    const mag = (cx: number) => (hand && s < 7.42 && hand[1] > 600 ? 1 + 0.22 * Math.exp(-Math.pow((hx - cx) / 150, 2)) : 1);

    // 小图标：抛起 → 掉进桶
    const pile = [[106, 35, -12, 190], [201, 20, 8, 170], [256, 35, 16, 170]]; // 桶口左上为原点
    const inBin = s >= 4.76;
    const tossed = !inBin ? inputs.barIcons.map((k, i) => {
      const [x, y, r, sz] = mkv(s, TOSS[i]);
      return <div key={i} style={{position: 'absolute', left: x - sz / 2, top: y - sz / 2, transform: `rotate(${r}deg)`}}><AppIcon kind={k} size={sz} /></div>;
    }) : null;
    const binKids = inBin ? inputs.barIcons.map((k, i) => {
      const [x, y, r, sz] = s < 4.8 ? mkv(s, TOSS[i]) : [799 + pile[i][0], 605 + pile[i][1], pile[i][2], pile[i][3]];
      const bob = s < 4.95 ? 6 * Math.sin((s - 4.8) * 30) * (1 - clamp((s - 4.8) / 0.15)) : 0;
      return <div key={i} style={{position: 'absolute', left: x - 799 - sz / 2, top: y - 605 - sz / 2 + bob, transform: `rotate(${r}deg)`}}><AppIcon kind={k} size={sz} /></div>;
    }) : null;
    const binOrder = [1, 2, 0]; // 深色那个在后面
    const trashEl = (
      <div style={{position: 'absolute', left: trash.cx - 160, top: trash.top, width: 320, transform: `scale(${trash.sc})`, transformOrigin: '50% 0', opacity: dockFade}}>
        <Trash w={320}>{binKids && binOrder.map((i) => binKids[i])}</Trash>
      </div>
    );

    const dockIcons = inputs.dockIcons.map((k, i) => {
      const t0 = [6.5, 6.44, 6.38][i];
      const u = clamp((s - t0) / 0.15);
      if (u <= 0) return null;
      const pop = u < 1 ? easeOut(u) * (1 + 0.08 * Math.sin(u * Math.PI)) : 1;
      const m = mag(slotX[i]);
      const sz = 218 * pop * m;
      return <div key={i} style={{position: 'absolute', left: slotX[i] - sz / 2, top: 765 - sz / 2 - (m - 1) * 90, opacity: dockFade, filter: morph > 0 ? `blur(${6 * morph}px)` : undefined}}><AppIcon kind={k} size={sz} /></div>;
    });

    // 复制出来的按钮
    const dupPos = (k: number, tt: number): [number, number, number] => {
      const st = 7.85 + k * 0.03;
      if (tt < st) return [958, 763, 0];
      const casc: [number, number] = [958 - 48 * (k + 1), 763 - 52 * (k + 1)];
      let x: number, y: number;
      if (tt < 8.08) { const u = easeOut((tt - st) / (8.08 - st)); x = mix(958, casc[0], u); y = mix(763, casc[1], u); }
      else if (tt < 8.15) { const u = (tt - 8.08) / 0.07; x = mix(casc[0], casc[0] + 330, u); y = mix(casc[1], casc[1] - 120, u); }
      else if (tt < 8.5) { const u = easeInOut((tt - 8.15) / 0.35); x = mix(casc[0] + 330, DUP_T[k][0], u); y = mix(casc[1] - 120, DUP_T[k][1], u); }
      else if (tt < 8.86) { const u = (tt - 8.5) / 0.36; x = mix(DUP_T[k][0], DUP_U[k][0], u); y = mix(DUP_T[k][1], DUP_U[k][1], u); }
      else { const u = clamp((tt - 8.86) / 0.08); x = mix(DUP_U[k][0], 958, u * u); y = mix(DUP_U[k][1], 560, u * u); }
      return [x, y, 1 - clamp((tt - 8.88) / 0.06)];
    };
    const Btn: React.FC<{cx: number; cy: number; sc?: number; op?: number; blur?: number}> = ({cx, cy, sc = 1, op = 1, blur = 0}) => (
      <div style={{position: 'absolute', left: cx - btn.w / 2, top: cy - btn.h / 2, width: btn.w, height: btn.h, transform: `scale(${sc})`, opacity: op, borderRadius: 66, background: 'rgba(44,44,44,0.92)', boxShadow: 'inset 0 0 0 1.5px rgba(255,255,255,0.06), 0 10px 40px rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 80, color: '#f6f6f6', fontSize: 118, fontWeight: 600, filter: blur > 0.3 ? `blur(${blur}px)` : undefined}}>
        <span>{inputs.button}</span><span style={{fontWeight: 400, fontSize: 120}}>+</span>
      </div>
    );
    const dups: React.ReactNode[] = [];
    if (s >= 7.85 && s < 8.95) {
      for (let k = DUP_T.length - 1; k >= 0; k--) {
        const [x, y, op] = dupPos(k, s);
        const [x2, y2] = dupPos(k, s - 0.02);
        const v = Math.hypot(x - x2, y - y2) / 0.02; // px/s
        const forced = (tt: number) => (tt < 8.15 ? (k === 0 ? 0 : 11) : tt < 8.86 && k % 3 === 1 ? 9 : 0);
        const bl = Math.max(forced(s), Math.min(14, v / 220));
        const ghosts = [];
        if (v > 400) for (let g = 5; g >= 1; g--) { const [gx, gy] = dupPos(k, s - g * 0.016); ghosts.push(<Btn key={`g${g}`} cx={gx} cy={gy} sc={DUP_S[k]} op={op * 0.26 * (1 - g / 6)} blur={6 + 1.5 * g} />); }
        dups.push(<React.Fragment key={k}>{ghosts}<Btn cx={x} cy={y} sc={DUP_S[k]} op={op} blur={bl} /></React.Fragment>);
      }
    }

    beat2 = (
      <>
        {/* 第一组三行（退场 0.4 秒内退完）*/}
        <Line text={inputs.lineA1} y={mk(s, LINE_A)} size={116} start={4.15} step={0.05} s={s} fadeAt={5.98} fadeStep={0.4 / ([...inputs.lineA1].length + [...inputs.lineA2].length + [...inputs.lineA3].length)} fadeOffset={0} />
        <Line text={inputs.lineA2} y={mk(s, LINE_A) + 150} size={116} start={4.72} step={0.06} s={s} fadeAt={5.98} fadeStep={0.4 / ([...inputs.lineA1].length + [...inputs.lineA2].length + [...inputs.lineA3].length)} fadeOffset={[...inputs.lineA1].length} />
        <Line text={inputs.lineA3} y={mk(s, LINE_A) + 296} size={116} start={5.06} step={0.06} s={s} fadeAt={5.98} fadeStep={0.4 / ([...inputs.lineA1].length + [...inputs.lineA2].length + [...inputs.lineA3].length)} fadeOffset={[...inputs.lineA1].length + [...inputs.lineA2].length} />
        {/* 底板 / 程序坞 / 按钮 */}
        {tile.op > 0 && s < 7.85 + 0.5 && (
          <div style={{position: 'absolute', left: box.x, top: box.y, width: box.w, height: box.h, borderRadius: mix(Math.min(80, box.h * 0.24), 66, mE), background: `rgba(${mix(46, 44, mE)},${mix(46, 44, mE)},${mix(48, 44, mE)},${0.75 * tile.op})`, boxShadow: `inset 0 0 0 1.5px rgba(255,255,255,${0.07 * tile.op}), 0 14px 50px rgba(0,0,0,${0.3 * tile.op})`, opacity: s >= 8.9 ? 1 - clamp((s - 8.9) / 0.05) : 1}} />
        )}
        {s >= 6.45 && s < 7.5 && <div style={{position: 'absolute', left: 1216 - 1, top: 668, width: 2, height: 196, background: 'rgba(255,255,255,0.12)', opacity: clamp((s - 6.45) / 0.15) * dockFade}} />}
        {s < 7.5 && trashEl}
        {tossed}
        {dockIcons}
        {/* 第二组两行 */}
        <Line text={inputs.lineB1} y={389} size={116} start={6.3} step={0.07} s={s} whole={false} fadeAt={7.7} fadeStep={0.07} />
        <Line text={inputs.lineB2} y={522} size={116} start={6.48} step={0.08} s={s} whole={false} fadeAt={7.7} fadeStep={0.07} fadeOffset={[...inputs.lineB1].length} />
        {dups}
        {s >= 7.48 && s < 8.95 && <Btn cx={958} cy={763} op={clamp((s - 7.48) / 0.08) * (1 - clamp((s - 8.88) / 0.06))} />}
        {/* 结尾一个词：逐字从下面浮上来 */}
        {s >= 8.9 && (
          <div style={{position: 'absolute', left: 0, width: 1920, top: 590 - 126 * 0.92, textAlign: 'center', fontSize: 126, fontWeight: 600, lineHeight: '151px', whiteSpace: 'pre'}}>
            {[...inputs.outro].map((ch, i) => {
              const u = clamp((s - 8.93 - i * 0.12) / 0.32), e = easeOut(u);
              return <span key={i} style={{display: 'inline-block', transform: `translateY(${70 * (1 - e)}px)`, opacity: clamp(u * 3), color: `rgb(${mix(60, 248, e)},${mix(86, 248, e)},${mix(104, 248, e)})`}}>{ch}</span>;
            })}
          </div>
        )}
        {hand && <Hand x={hand[0]} y={hand[1]} h={190} opacity={clamp((s - 6.58) / 0.08) * (1 - clamp((s - 8.95) / 0.08))} press={s > 7.38 && s < 7.5 ? 1 : 0} />}
      </>
    );
  }

  return (
    <AbsoluteFill style={{background: BG, overflow: 'hidden', fontFamily: SANS}}>
      <div style={{position: 'absolute', inset: 0, transform: `scale(${cam})`, transformOrigin: '960px 540px'}}>
        {beat1}
        {beat2}
      </div>
      <Grain opacity={0.025} />
    </AbsoluteFill>
  );
};

if (checkContract(SEARCH_TRASH_DOCK_BUTTONS_CONTRACT).length) throw new Error(checkContract(SEARCH_TRASH_DOCK_BUTTONS_CONTRACT).join('；'));
export const SearchTrashDockButtons: React.FC = () => <SearchTrashDockButtonsGroup />;
