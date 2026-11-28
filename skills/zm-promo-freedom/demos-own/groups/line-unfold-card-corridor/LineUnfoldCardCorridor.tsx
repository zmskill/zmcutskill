// 【镜头组】line-unfold-card-corridor：黑底蓝图风。一根竖线从右边滑进来，在中间展开成一张霓虹像素卡；
//   左右两边的灰色卡从它背后滑出来排成一条"走廊"，线框跟着撑开；之后每隔 0.5–1 秒右边一张卡飞到中间盖住（变彩色），旧的退到左边变灰，中间一直慢慢往左漂（030-E 一拍）
// 学的动作（ab_workss · PulseIt 35.80–41.20s，30fps 逐帧看过；时间表 （内部拆片记录，未随项目提供））：
//   黑底 + 极淡网格 + 四周零星蓝 / 黄小方块 + 角落乱码小字；竖的双线从右边滑到中间，边滑边张开成卡（只横向展开，高度一开始就是满的）；
//   两边的卡从中间卡背后往外滑到位（近的 0.74 倍、远的 0.58 倍，灰度），线框（竖线 + 端点小方块 + 刻度数字 + 上下 V 形线）跟着撑开；
//   换卡：右边那张 0.12 秒飞到中间、压在旧卡上面，同时变彩色；之后整排慢慢往左漂，下一张再来；卡上的像素一直在闪。
// 我们的内容：待办 App「小周」的 6 个功能卡：待办 / 日历 / 家人 / 目标 / 提醒 / 清单。卡面是真 3D 霓虹渲染图（第4轮起，library/photos/neon）压成蓝紫色 + 像素点阵，上面叠功能名。
//
// 拍表（源秒，30fps）
//   拍 1 竖线滑入展开   0.00–0.60   线 0.00–0.60 滑到中间偏右、卡 0.28–0.60 横向展开
//   拍 2 两边卡滑出     0.50–0.88   两边卡、线框撑开（停留点 0.95：看整排）
//   拍 3 轮播 ×6        1.00–5.40   换卡 1.00 / 1.60 / 2.15 / 3.20 / 4.20 / 4.95，每次 0.12s；其余时间慢漂（停留点 5.30：停在最后一张）
// 毛病清单：
//   - 通用：画面永远不停（像素闪 + 停留时慢推）；动作叠着走；--hq 渲染；确定性
//   - 独有 1：卡是从线里"长"出来的（横向展开），不是淡入
//   - 独有 2：换卡快（0.12s）漂得慢（其余时间），不是匀速滚动
//   - 独有 3：只有中间那张是彩色的，离中间越远越灰、越小
import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {FONT, mix} from '../../../assets/lib/helpers/polish';
import {GroupContract, checkContract, checkInputs, outputDuration, planExtras, toSource} from '../../../assets/lib/helpers/groupClock';
import {mulberry32} from '../../../assets/lib/helpers/rand';

const FPS = 30;
const SANS = `"PingFang SC", "Noto Sans CJK SC", "Noto Sans SC", ${FONT.sans}`;
const MONO = `"JetBrains Mono", "SFMono-Regular", Menlo, monospace`;

const rand = (key: string) => { let h = 2166136261; for (let i = 0; i < key.length; i++) h = Math.imul(h ^ key.charCodeAt(i), 16777619); return mulberry32(h)(); }; // 确定性
const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const eo = (t: number, a: number, b: number) => { const c = clamp((t - a) / (b - a)); return 1 - Math.pow(1 - c, 3); };
const eio = (t: number, a: number, b: number) => { const c = clamp((t - a) / (b - a)); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };
type P = [number, number][];
const lerpP = (t: number, pts: P) => {
  if (t <= pts[0][0]) return pts[0][1];
  for (let i = 0; i < pts.length - 1; i++) if (t <= pts[i + 1][0]) { const u = (t - pts[i][0]) / (pts[i + 1][0] - pts[i][0]); return mix(pts[i][1], pts[i + 1][1], u); }
  return pts[pts.length - 1][1];
};

// ═════════ 合同 ═════════
const SW = [1.0, 1.6, 2.15, 3.2, 4.2, 4.95]; // 原片逐帧量的换卡时刻（不等距）
const SWAP0 = SW[0], SWAP_DUR = 0.12;
export const LINE_UNFOLD_CARD_CORRIDOR_CONTRACT: GroupContract = {
  sourceDuration: 162 / 30, // 5.4s
  fps: 30,
  motion: [[0, 0.9], [1.0, 5.25]],
  holds: [
    {at: 0.95, maxExtra: 1.5}, // 整排刚排好，停住看
    {at: 5.3, maxExtra: 2.0}, // 停在最后一张
  ],
  landmarks: {line: 0, unfold: 0.3, sides: 0.5, swap1: 1.0, swap2: 1.6, swap3: 2.15, swap4: 3.2, swap5: 4.2, swap6: 4.95, exit: 162 / 30},
  sfx: [
    {at: 'line', type: '电流', note: '细高频 sweep（线滑入）', tail: 0.3, volume: 0.25},
    {at: 'unfold', type: '运镜', note: '电子展开 whoosh（卡展开）', tail: 0.5, volume: 0.35},
    {at: 'sides', type: '短甩', note: '轻滑 ×2（两边卡滑出）', tail: 0.3, volume: 0.25},
    {at: 'swap1', type: '轻tick', note: '短促电子 tick（换卡）', volume: 0.25},
    {at: 'swap2', type: '轻tick', note: '短促电子 tick（换卡）', volume: 0.25},
    {at: 'swap3', type: '轻tick', note: '短促电子 tick（换卡）', volume: 0.25},
    {at: 'swap4', type: '轻tick', note: '短促电子 tick（换卡）', volume: 0.25},
    {at: 'swap5', type: '轻tick', note: '短促电子 tick（换卡）', volume: 0.25},
    {at: 'swap6', type: '轻tick', note: '短促电子 tick（换卡）', volume: 0.25},
  ],
  inputs: {items: {count: 6, maxChars: 3}},
};

export type CorridorInputs = {items: string[]};
export const CORRIDOR_DEFAULT_INPUTS: CorridorInputs = {items: ['待办', '日历', '家人', '目标', '提醒', '清单']};
export const checkCorridorInputs = (x: CorridorInputs) => checkInputs(LINE_UNFOLD_CARD_CORRIDOR_CONTRACT, {items: x.items});
export const planCorridor = (sec: number) => planExtras(LINE_UNFOLD_CARD_CORRIDOR_CONTRACT, sec);
export const corridorFrames = (extras: number[]) => Math.round(outputDuration(LINE_UNFOLD_CARD_CORRIDOR_CONTRACT, extras) * FPS);
export const LINE_UNFOLD_CARD_CORRIDOR_DURATION = 162;

// ═════════ 卡面：霓虹像素图标 ═════════
const ICON: string[][] = [
  ['M5 12.5l4.5 4.5L19 7.5'], // 待办
  ['M4 6h16v14H4z', 'M4 10h16', 'M9 3v4', 'M15 3v4'], // 日历
  ['M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z', 'M2.5 20a6.5 6.5 0 0 1 13 0', 'M16 4.5a3.5 3.5 0 0 1 0 6.5', 'M18.5 20a6 6 0 0 0-3-5'], // 家人
  ['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z', 'M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', 'M12 12.5a.5.5 0 1 0 0-1'], // 目标
  ['M6 16V11a6 6 0 0 1 12 0v5l2 2H4z', 'M10 21h4'], // 提醒
  ['M8 6h12', 'M8 12h12', 'M8 18h12', 'M4 6h.01', 'M4 12h.01', 'M4 18h.01'], // 清单
];
const SPARK = ['M12 2l1.6 6.4L20 10l-6.4 1.6L12 18l-1.6-6.4L4 10l6.4-1.6z'];
const HEART = ['M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z'];
const RING = ['M12 19a7 7 0 1 0 0-14 7 7 0 0 0 0 14z'];
const DOTMASK = 'radial-gradient(circle at 50% 50%, #000 58%, transparent 62%)';
const Neon: React.FC<{p: string[]; s: number; c: string; w?: number; fill?: boolean}> = ({p, s, c, w = 2.4, fill}) => (
  <div style={{width: s, height: s, WebkitMaskImage: DOTMASK, WebkitMaskSize: '7px 7px', maskImage: DOTMASK, maskSize: '7px 7px', filter: `drop-shadow(0 0 6px ${c}) drop-shadow(0 0 16px ${c})`}}>
    <svg width={s} height={s} viewBox="0 0 24 24">{p.map((d, i) => <path key={i} d={d} stroke={c} strokeWidth={w} fill={fill ? c : 'none'} strokeLinecap="round" strokeLinejoin="round" />)}</svg>
  </div>
);
const CW = 441, CH = 396;
const NEON_PHOTO = ['neon03', 'neon00', 'neon04', 'neon02', 'neon07', 'neon05', 'neon01', 'neon06'];
const Card: React.FC<{kind: number; title: string; frame: number}> = ({kind, title, frame}) => {
  const fl = (k: number) => 0.62 + 0.38 * rand(`fl${kind}-${k}-${frame}`); // 像素一直在闪（原片卡面每帧都在跳）
  const smalls = [[SPARK, 0.12, 0.62, 46, '#ff5fd0'], [HEART, 0.8, 0.2, 40, '#ff4fa8'], [RING, 0.78, 0.7, 52, '#6d8bff'], [SPARK, 0.86, 0.48, 30, '#c58bff'], [HEART, 0.1, 0.84, 30, '#7b6bff'], [SPARK, 0.6, 0.86, 26, '#ff7ad9']] as const;
  return (
    <div style={{position: 'relative', width: CW, height: CH, background: 'linear-gradient(160deg, #1a1560 0%, #221a78 45%, #130f45 100%)', overflow: 'hidden', border: '1px solid rgba(190,190,255,0.35)'}}>
      <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 50% at 50% 55%, rgba(120,80,255,0.35), rgba(0,0,0,0))'}} />
      {/* 第4轮：原片卡面是 3D 霓虹插画 → 真 3D 渲染图（library/photos/neon，Unsplash 免费授权），压成蓝紫色、加像素点阵 */}
      <div style={{position: 'absolute', inset: 0, opacity: 0.86 + 0.14 * fl(1), WebkitMaskImage: DOTMASK, WebkitMaskSize: '6px 6px', maskImage: DOTMASK, maskSize: '6px 6px'}}>
        <Img src={staticFile(`library/photos/neon/${NEON_PHOTO[kind % NEON_PHOTO.length]}.jpg`)} style={{position: 'absolute', left: 0, top: 0, width: CW, height: CH, objectFit: 'cover', filter: 'contrast(2.1) saturate(1.7) brightness(0.72)'}} />
        <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(160deg, #6d5cff 0%, #8a4cf0 50%, #3a2aa8 100%)', mixBlendMode: 'multiply'}} />
        <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 55% 45% at 50% 58%, rgba(255,95,208,0.35), rgba(0,0,0,0))', mixBlendMode: 'screen'}} />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 24, textAlign: 'center', fontFamily: SANS, fontSize: 70, fontWeight: 900, color: '#d4c6ff', zIndex: 2, letterSpacing: '0.04em', WebkitMaskImage: DOTMASK, WebkitMaskSize: '5px 5px', maskImage: DOTMASK, maskSize: '5px 5px', filter: 'drop-shadow(0 0 8px #8a6bff)', opacity: fl(0)}}>{title}</div>
      {smalls.slice(0, 3).map(([p, x, y, s, c], i) => <div key={i} style={{position: 'absolute', left: x * CW - s / 2, top: y * CH - s / 2, opacity: 0.8 * fl(2 + i)}}><Neon p={p as unknown as string[]} s={s * 0.8} c={c} w={2} fill={i % 2 === 1} /></div>)}
      {Array.from({length: 46}, (_, j) => {
        if (rand(`tw${kind}-${j}-${Math.floor(frame / 2)}`) < 0.45) return null;
        const px = rand(`px${kind}-${j}`) * (CW - 20) + 10, py = rand(`py${kind}-${j}`) * (CH - 120) + 110;
        const c = ['#ff5fd0', '#6d8bff', '#c58bff', '#ff8ae0'][j % 4];
        return <div key={`tw${j}`} style={{position: 'absolute', left: px, top: py, width: 6, height: 6, background: c, boxShadow: `0 0 8px ${c}`}} />;
      })}
      <div style={{position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: `${CW / 4}px ${CH}px, ${CW / 4}px ${CH}px`}} />
    </div>
  );
};

// ═════════ 走廊位置 ═════════
const GX: P = [[0, 0], [1, 207], [2, 412], [3, 590], [4, 740]];
const GS: P = [[0, 1], [1, 0.74], [2, 0.58], [3, 0.46], [4, 0.38]];
const ROW_X = 975; // 原片整排中心略偏右
// 轮播进度 c：换卡 0.12s 走 0.7 格，其余 0.38s 慢漂 0.3 格
const carousel = (s: number) => {
  if (s < SWAP0) return 0.15 * clamp((s - 0.8) / 0.2);
  let k = 0;
  while (k + 1 < SW.length && s >= SW[k + 1]) k++;
  const u = s - SW[k];
  const dur = (SW[k + 1] ?? SW[k] + 0.6) - SW[k];
  return k + 0.15 + 0.7 * eio(u, 0, SWAP_DUR) + 0.3 * clamp((u - SWAP_DUR) / (dur - SWAP_DUR)); // 新卡落在中线右边 0.15 格，再漂到左边 0.15 格
};

const Corridor: React.FC<{s: number; frame: number; x: CorridorInputs; hd: number}> = ({s, frame, x, hd}) => {
  const lineX = lerpP(s, [[0, 1900], [0.12, 1824], [0.3, 1320], [0.42, 1140], [0.6, ROW_X]]);
  const unf = eo(s, 0.28, 0.6);
  const side = eo(s, 0.5, 0.88);
  const c = carousel(s) + hd * 0.02; // 停留时也极慢地漂
  const cards: {i: number; u: number}[] = [];
  for (let i = Math.floor(c) - 3; i <= Math.floor(c) + 4; i++) cards.push({i, u: i - c});
  cards.sort((a, b) => Math.abs(b.u) - Math.abs(a.u));
  const n = x.items.length;
  return (
    <>
      {cards.map(({i, u}) => {
        const au = Math.abs(u);
        if (au > 3.3) return null;
        const center = au < 0.6;
        const g = lerpP(au, GX) * Math.sign(u) * (center ? 1 : side);
        const sc = lerpP(au, GS) * (center ? 1 : mix(0.7, 1, side));
        const col = clamp(1 - au * 1.6);
        const kind = ((i % n) + n) % n;
        const cx = (s < 0.6 ? lineX : ROW_X) + g;
        const sx = au < 0.6 && s < 0.6 ? Math.max(0.02, unf) : 1;
        const op = center ? 1 : side * clamp(3.3 - au);
        if (op <= 0.01) return null;
        // 新卡飞进来压在旧卡上面：u 从正往 0 走的那张层级最高
        const z = Math.round(100 - au * 20 + (u > 0 ? 3 : 0));
        return (
          <div key={i} style={{position: 'absolute', left: cx - CW / 2, top: 540 - CH / 2, width: CW, height: CH, transform: `scale(${(sc * sx).toFixed(4)}, ${sc.toFixed(4)})`, zIndex: z, opacity: op,
            filter: col < 0.99 ? `grayscale(${(1 - col).toFixed(3)}) brightness(${mix(1, 1.9, 1 - col).toFixed(3)}) contrast(${mix(1, 1.5, 1 - col).toFixed(3)})` : undefined}}>
            <Card kind={kind} title={x.items[kind]} frame={frame} />
          </div>
        );
      })}
      <Wire s={s} lineX={lineX} unf={unf} side={side} />
    </>
  );
};

// ═════════ 线框 ═════════
const Sq: React.FC<{x: number; y: number; k?: number}> = ({x, y, k = 7}) => <rect x={x - k / 2} y={y - k / 2} width={k} height={k} fill="#fff" />;
const Wire: React.FC<{s: number; lineX: number; unf: number; side: number}> = ({s, lineX, unf, side}) => {
  const cx = s < 0.6 ? lineX : ROW_X;
  const half = Math.max(5, (CW / 2) * unf);
  const T = 540 - CH / 2, B = 540 + CH / 2;
  const cols: number[] = [cx - half, cx + half];
  const sideCols = [207, 412].flatMap((g, j) => { const w = (CW / 2) * [0.74, 0.58][j]; return [cx - g * side - w, cx + g * side + w]; });
  const outer = [cx - 560 * side, cx + 560 * side];
  const y0 = 150 + 70 * (1 - side), y1 = 930 - 70 * (1 - side);
  const lab = (x: number, y: number, i: number) => <text key={`l${i}`} x={x + 8} y={y + 4} fill="rgba(255,255,255,0.7)" fontSize={11} fontFamily={MONO}>{`${(Math.floor(rand(`lb${i}-${Math.floor(s * 6)}`) * 90) + 10)}${['<', '/', '.', ':'][i % 4]}`}</text>;
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, zIndex: 200}}>
      <g stroke="rgba(255,255,255,0.75)" strokeWidth={1.2} fill="none">
        {cols.map((x, i) => <line key={i} x1={x} y1={T - 120} x2={x} y2={B + 120} />)}
        {side > 0.02 && sideCols.map((x, i) => <line key={`s${i}`} x1={x} y1={y0 + 40} x2={x} y2={y1 - 40} opacity={side} />)}
        {side > 0.02 && outer.map((x, i) => <line key={`o${i}`} x1={x} y1={y0 + 60} x2={x} y2={y1 - 60} opacity={side} />)}
        {/* 上下 V 形线：从中间卡上下沿收到中线 */}
        <polyline points={`${cx - half},${T - 60} ${cx},${T - 120} ${cx + half},${T - 60}`} />
        <polyline points={`${cx - half},${B + 60} ${cx},${B + 120} ${cx + half},${B + 60}`} />
        {side > 0.02 && [-1, 1].map((d) => <polyline key={`d${d}`} opacity={side} points={`${cx + d * (half + 150 * side)},${y0 + 40} ${cx + d * 560 * side},${y0 + 60}`} />)}
        {side > 0.02 && [-1, 1].map((d) => <polyline key={`e${d}`} opacity={side} points={`${cx + d * (half + 150 * side)},${y1 - 40} ${cx + d * 560 * side},${y1 - 60}`} />)}
      </g>
      {cols.flatMap((x, i) => [<Sq key={`a${i}`} x={x} y={T} />, <Sq key={`b${i}`} x={x} y={B} />, <Sq key={`c${i}`} x={x} y={T - 120} k={6} />, <Sq key={`d${i}`} x={x} y={B + 120} k={6} />])}
      {side > 0.02 && sideCols.flatMap((x, i) => [<Sq key={`e${i}`} x={x} y={y0 + 40} k={6} />, <Sq key={`f${i}`} x={x} y={y1 - 40} k={6} />])}
      {side > 0.02 && outer.flatMap((x, i) => [<Sq key={`g${i}`} x={x} y={y0 + 60} k={6} />, <Sq key={`h${i}`} x={x} y={y1 - 60} k={6} />])}
      {side > 0.3 && [...sideCols, ...outer, ...cols].map((x, i) => lab(x, i % 2 ? y1 - 40 : y0 + 40, i))}
    </svg>
  );
};

// ═════════ 背景：网格 + 零星小方块 + 角落乱码 ═════════
const DOTS = [[310, 40, '#2f5bff'], [390, 75, '#ffc93c'], [350, 280, '#2f5bff'], [350, 320, '#ffc93c'], [1240, 110, '#2f5bff'], [1180, 560, '#ffc93c'], [1860, 230, '#ffc93c'], [1700, 640, '#2f5bff'], [90, 1030, '#ffc93c'], [80, 640, '#2f5bff'], [560, 1000, '#ffc93c'], [1540, 990, '#2f5bff'], [1880, 880, '#2f5bff'], [720, 180, '#ffc93c']] as const;
const garble = (seed: string, n: number) => Array.from({length: n}, (_, i) => 'abcdeopqrstuvwxyz'[Math.floor(rand(seed + i) * 17)]).join('');
const Backdrop: React.FC<{s: number; t: number}> = ({s, t}) => {
  const q = Math.floor(s * 10);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <AbsoluteFill style={{backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)', backgroundSize: '96px 96px'}} />
      {DOTS.map(([x, y, c], i) => <div key={i} style={{position: 'absolute', left: x + Math.sin(t * 0.7 + i) * 6, top: y + Math.cos(t * 0.6 + i * 1.3) * 5, width: 9, height: 9, background: c}} />)}
      <div style={{position: 'absolute', left: 900, top: 18, fontFamily: MONO, fontSize: 12, color: 'rgba(255,255,255,0.8)'}}>{`{"${garble('a' + q, 6)}":"${garble('b' + q, 4)}"}`}</div>
      <div style={{position: 'absolute', right: 60, bottom: 40, fontFamily: MONO, fontSize: 12, color: 'rgba(255,255,255,0.8)', lineHeight: 1.4, textAlign: 'left'}}>{`{"${garble('c' + q, 5)}":"${garble('d' + q, 5)}"`}<br />{`"${garble('e' + q, 6)}":"${garble('f' + q, 5)}"}`}</div>
    </AbsoluteFill>
  );
};

// ═════════ 整组 ═════════
export type CorridorProps = {inputs?: CorridorInputs; extras?: number[]};
export const LineUnfoldCardCorridorGroup: React.FC<CorridorProps> = ({inputs = CORRIDOR_DEFAULT_INPUTS, extras = [0, 0]}) => {
  const C = LINE_UNFOLD_CARD_CORRIDOR_CONTRACT;
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const s = toSource(t, C, extras);
  const hd = Math.max(0, t - s);
  const push = 1 + 0.012 * hd;
  return (
    <AbsoluteFill style={{overflow: 'hidden', fontFamily: SANS}}>
      <Backdrop s={s + hd} t={t} />
      <AbsoluteFill style={{transform: `scale(${push.toFixed(5)})`}}>
        <Corridor s={s} frame={frame} x={inputs} hd={hd} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
export const LineUnfoldCardCorridor: React.FC = () => <LineUnfoldCardCorridorGroup />;

if (checkContract(LINE_UNFOLD_CARD_CORRIDOR_CONTRACT).length) throw new Error(checkContract(LINE_UNFOLD_CARD_CORRIDOR_CONTRACT).join('; '));
