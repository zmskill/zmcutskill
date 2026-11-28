// 【镜头组】clock-check-card：上一镜鼓起的照片缩回来、四边从内凹变外鼓、换成一张海边灯塔、缩成一个圆 →
//   圆一下变成行程卡片里的"时钟"图标，镜头贴着它斜着、转着往后拉，露出整张卡片「奥森公园 / 6月8日 周六 · 1小时」→
//   时钟变绿、一晃变成绿色对勾（完成）→ 卡片带着很重的竖向动态模糊往上一甩，露出下一行，切走（021-I 一拍，行程确认）
// 学的动作（mnowakdesign · Roamly 23.367–25.767s，30fps 逐帧量过；时间表 （内部拆片记录，未随项目提供））：
//   23.33–23.60 照片外框逐帧量（四边凹 → 外鼓 → 圆，圆心 (640,352)，半径 245 → 290）；23.633 硬切成时钟圆（半径 298，同一个圆心）；
//   23.63–25.53 卡片平面四角逐帧 ECC 同形配准（track.ts，以 25.0s 帧 750 为准，再乘帧 750 本身的透视）：镜头起手转了约 60°、贴得很近，一路拉远摆正；
//   24.57–24.77 时钟变暗绿、发糊、缩一点；24.8 换成对勾（暗绿、略小），24.87 亮绿 rgb(13,198,63)；
//   25.57–25.73 整体往上甩（每帧 90 → 250px）、竖向糊，25.77 切 021-J。
// 我们的内容：021-C 表单规划出来的第一站。
//
// 拍表（源秒 = 原片秒 − 23.367，30fps，共 72 帧）
//   拍 1 照片缩成圆       0.00–0.30
//   拍 2 时钟、镜头拉远   0.30–1.37
//   拍 3 变对勾、停住     1.37–1.82   （停留点 1.835）
//   拍 4 往上甩走         1.85–2.40
// 毛病清单：
//   - 通用：画面永远不停（停留时整体极慢推近）；--hq 渲染；确定性
//   - 独有 1：拉远是真透视（matrix3d 四角逐帧量），卡片右边一直更远、更糊（景深）
//   - 独有 2：照片 → 圆 → 时钟是同一个圆心、同一个大小接上的，不是淡入淡出
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {FONT, Grain} from '../../../assets/lib/helpers/polish';
import {GroupContract, checkContract, checkInputs, outputDuration, planExtras, toSource} from '../../../assets/lib/helpers/groupClock';
import {CELLS, Scene} from '../photo-flash-bulge/PhotoFlashBulge';
import {I_F0, I_PLANE} from './track';

const FPS = 30;
const SANS = `"PingFang SC", "Noto Sans CJK SC", "Noto Sans SC", ${FONT.sans}`;
const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const mix = (a: number, b: number, k: number) => a + (b - a) * k;
const kfl = (t: number, K: number[][]) => { if (t <= K[0][0]) return K[0][1]; for (let i = 0; i < K.length - 1; i++) if (t <= K[i + 1][0]) return mix(K[i][1], K[i + 1][1], (t - K[i][0]) / (K[i + 1][0] - K[i][0])); return K[K.length - 1][1]; };
const T0 = 701 / 30;

export const CLOCK_CHECK_CARD_CONTRACT: GroupContract = {
  sourceDuration: 72 / 30,
  fps: 30,
  motion: [[0, 1.82], [1.85, 72 / 30]],
  holds: [{at: 1.835, maxExtra: 1.0}],
  landmarks: {shrink: 0, clock: 0.3, tint: 1.23, check: 1.433, settle: 1.6, scroll: 2.2, exit: 72 / 30},
  sfx: [
    {at: 'shrink', type: '吸入', note: '吸入 whoosh（照片缩成圆）', tail: 0.3, volume: 0.35},
    {at: 'clock', type: '运镜', note: '拉远 air whoosh', tail: 0.8, volume: 0.3},
    {at: 'check', type: '提示音', note: '完成 ding / pop', volume: 0.45},
    {at: 'scroll', type: '短甩', note: '快速 swipe', tail: 0.25, volume: 0.35},
  ],
  inputs: {title1: {maxChars: 5}, next1: {maxChars: 4}, date1: {maxChars: 9}, dur1: {maxChars: 4}, title2: {maxChars: 5}, date2: {maxChars: 9}, dur2: {maxChars: 4}},
};

export type ClockInputs = {title1: string; next1: string; date1: string; dur1: string; title2: string; date2: string; dur2: string};
export const CLOCK_DEFAULT_INPUTS: ClockInputs = {title1: '奥森公园', next1: '颐和园', date1: '6月8日 周六', dur1: '1小时', title2: '古北水镇', date2: '6月9日 周日', dur2: '2小时'};
export const checkClockInputs = (x: ClockInputs) => checkInputs(CLOCK_CHECK_CARD_CONTRACT, x);
export const planClock = (sec: number) => planExtras(CLOCK_CHECK_CARD_CONTRACT, sec);
export const clockFrames = (extras: number[]) => Math.round(outputDuration(CLOCK_CHECK_CARD_CONTRACT, extras) * FPS);
export const CLOCK_CHECK_CARD_DURATION = 72;

// ---- 卡片平面 → 画面：同形矩阵 ----
const P = [[370, 120.4], [1395, 120.4], [1395, 607], [370, 607]];
const solve = (A: number[][], b: number[]) => {
  const n = b.length; const M = A.map((r, i) => [...r, b[i]]);
  for (let c = 0; c < n; c++) {
    let p = c; for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
    [M[c], M[p]] = [M[p], M[c]];
    for (let r = 0; r < n; r++) if (r !== c) { const f = M[r][c] / M[c][c]; for (let k = c; k <= n; k++) M[r][k] -= f * M[c][k]; }
  }
  return M.map((r, i) => r[n] / r[i]);
};
const homography = (dst: number[]) => {
  const A: number[][] = [], b: number[] = [];
  for (let i = 0; i < 4; i++) { const [x, y] = P[i], u = dst[i * 2], v = dst[i * 2 + 1]; A.push([x, y, 1, 0, 0, 0, -u * x, -u * y]); b.push(u); A.push([0, 0, 0, x, y, 1, -v * x, -v * y]); b.push(v); }
  const h = solve(A, b);
  return `matrix3d(${h[0]},${h[3]},0,${h[6]},${h[1]},${h[4]},0,${h[7]},0,0,1,0,${h[2]},${h[5]},0,1)`;
};
const planeAt = (n: number) => { const i = clamp(n - I_F0, 0, I_PLANE.length - 1), i0 = Math.floor(i), i1 = Math.min(I_PLANE.length - 1, i0 + 1); return I_PLANE[i0].map((v, j) => mix(v, I_PLANE[i1][j], i - i0)); };

// ---- 开头：照片外框（720p）帧号、左、右、上、下、上下边中点往里凹（px）、左右边中点往里凹（负 = 往外鼓）----
const SHAPE = [[700, 15, 1275, -5, 715, 80, 85], [701, 10, 1270, -5, 720, 80, 90], [702, 0, 1280, 0, 720, 80, 110], [703, -5, 1285, -10, 730, 75, 120], [704, 300, 1000, 130, 560, 20, -40], [705, 380, 860, 165, 535, 8, -30], [706, 470, 810, 160, 540, 0, -60]];
const CIRC = [[707, 635, 350, 245], [708, 640, 352, 290], [709, 640, 352, 296]];
// 甩走：在帧 766 的画面上整体平移（720p）
const SCROLL = [[766, 0, 0], [767, -16, -90], [768, -36, -296], [769, -50, -536], [770, -66, -776], [771, -80, -1020], [772, -95, -1270], [773, -110, -1520]];

const ClockIcon: React.FC<{f: number}> = ({f}) => {
  const k = clamp((f - 736.5) / 6);
  const chk = f >= 743.5;
  const blur = chk ? 0 : 2.6 * Math.sin(Math.PI * clamp((f - 738) / 5.5));
  const sc = chk ? mix(0.86, 1, clamp((f - 743.5) / 2.5)) : 1 - 0.08 * k;
  const g = chk ? clamp((f - 744) / 2) : 0;
  const draw = chk ? mix(0.82, 1, clamp((f - 743.5) / 2)) : 0;
  const col = chk ? `rgb(${mix(28, 13, g)},${mix(125, 198, g)},${mix(52, 63, g)})` : `rgb(${mix(22, 24, k)},${mix(22, 82, k)},${mix(22, 42, k)})`;
  return (
    <svg width={140} height={140} viewBox="-70 -70 140 140" style={{position: 'absolute', left: 538 - 70, top: 381 - 70, transform: `scale(${sc})`, filter: blur > 0.1 ? `blur(${blur}px)` : undefined, overflow: 'visible'}}>
      <circle r={48} fill="none" stroke={col} strokeWidth={9.5} />
      {chk ? <path d="M -17 3 L -3 16 L 20 -12" pathLength={1} strokeDasharray={`${draw} 1`} fill="none" stroke={col} strokeWidth={8.5} strokeLinecap="round" strokeLinejoin="round" />
        : <path d="M -1 0 L -1 -28 M -1 0 L 24 17" fill="none" stroke={col} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />}
    </svg>
  );
};

// 一行行程（平面坐标，cy = 图标圆心 y）
const Row: React.FC<{cy: number; title: string; next?: string; date: string; dur: string; icon: React.ReactNode}> = ({cy, title, next, date, dur, icon}) => (
  <>
    <div style={{position: 'absolute', left: 538 - 128, top: cy - 128, width: 256, height: 256, borderRadius: 128, background: '#f4f4f4', boxShadow: 'inset 0 0 0 2.5px #e3e3e3'}} />
    <div style={{position: 'absolute', left: 0, top: cy - 381}}>{icon}</div>
    <div style={{position: 'absolute', left: 752, top: cy - 104, fontSize: 88, lineHeight: 1, fontWeight: 600, color: '#121318', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 36}}>
      <span>{title}</span>
      {next !== undefined && <><span style={{display: 'inline-flex', gap: 14}}><span style={{width: 26, height: 6, borderRadius: 3, background: '#b9bcc4'}} /><span style={{width: 26, height: 6, borderRadius: 3, background: '#b9bcc4'}} /></span><span>{next}</span></>}
    </div>
    <div style={{position: 'absolute', left: 752, top: cy + 38, fontSize: 66, lineHeight: 1, fontWeight: 400, color: '#646a78', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 30}}>
      <span>{date}</span><span style={{width: 13, height: 13, borderRadius: 7, background: '#4a4f5c'}} /><span>{dur}</span>
    </div>
  </>
);

const GrayClock: React.FC = () => (
  <svg width={140} height={140} viewBox="-70 -70 140 140" style={{position: 'absolute', left: 538 - 70, top: 381 - 70}}>
    <circle r={48} fill="none" stroke="#3a3d45" strokeWidth={9.5} />
    <path d="M -1 0 L -1 -28 M -1 0 L 24 17" fill="none" stroke="#3a3d45" strokeWidth={9} strokeLinecap="round" />
  </svg>
);

const SS = 4;
const Card: React.FC<{f: number; inputs: ClockInputs}> = ({f, inputs}) => (
  <div style={{position: 'absolute', left: 0, top: 0, width: 2600, height: 1400}}>
    <div style={{position: 'absolute', left: 268, top: 120, width: 2400, height: 1000, borderRadius: 190, background: '#fdfdfd', boxShadow: 'inset 0 0 0 3px #e7e7e7, 0 14px 50px rgba(20,20,40,0.05)'}} />
    <div style={{position: 'absolute', left: 370, top: 605, width: 2200, height: 3.5, background: '#ebebeb'}} />
    <Row cy={381} title={inputs.title1} next={inputs.next1} date={inputs.date1} dur={inputs.dur1} icon={<ClockIcon f={f} />} />
    <Row cy={860} title={inputs.title2} date={inputs.date2} dur={inputs.dur2} icon={<GrayClock />} />
  </div>
);

export const ClockCheckCardGroup: React.FC<{inputs?: ClockInputs; extras?: number[]}> = ({inputs = CLOCK_DEFAULT_INPUTS, extras = [0]}) => {
  const t = useCurrentFrame() / FPS;
  const s = toSource(t, CLOCK_CHECK_CARD_CONTRACT, extras) + T0;
  const lag = t - (s - T0);
  const f = s * 30;
  const cam = 1 + 0.004 * lag;

  let body: React.ReactNode;
  if (f < 706.5) {
    // 照片外框：四边内凹 → 外鼓
    const [L, R, T, B, mT, mS] = [1, 2, 3, 4, 5, 6].map((j) => kfl(f, SHAPE.map((r) => [r[0], r[j]])));
    const w = R - L, h = B - T;
    const clip = `path('M 200 200 Q ${200 + w / 2} ${200 + 2 * mT} ${200 + w} 200 Q ${200 + w - 2 * mS} ${200 + h / 2} ${200 + w} ${200 + h} Q ${200 + w / 2} ${200 + h - 2 * mT} 200 ${200 + h} Q ${200 + 2 * mS} ${200 + h / 2} 200 200 Z')`;
    const idx = f < 701.5 ? 12 : 4; // 第4轮：接上一镜的港口真照片 → 海边灯塔（travel01）
    const red = clamp((f - 702.5) / 1);
    const wash = clamp((f - 703.5) / 1);
    body = (
      <div style={{position: 'absolute', left: L - 200, top: T - 200, width: w + 400, height: h + 400, clipPath: clip, filter: wash > 0 ? `blur(${1.8 * wash}px)` : undefined, opacity: 1 - 0.12 * wash}}>
        <div style={{position: 'absolute', inset: 0, filter: 'blur(0.6px) saturate(2.6) contrast(1.2) hue-rotate(-25deg)'}}><Scene i={idx} w={w + 400} h={h + 400} /></div>
        <div style={{position: 'absolute', inset: 0, background: red > 0.5 ? 'linear-gradient(160deg, #ff3b2f, #ff2d6a 60%, #ff8a2a)' : 'linear-gradient(135deg, #3a4dff, #7a3cff 55%, #ff2d95)', mixBlendMode: 'color', opacity: 0.8 - 0.25 * wash}} />
        <div style={{position: 'absolute', inset: 0, background: `linear-gradient(135deg, rgba(255,30,150,${0.6 * (1 - red)}), rgba(50,80,255,${0.55 * (1 - red)}))`, mixBlendMode: 'screen'}} />
        <div style={{position: 'absolute', inset: 0, background: `linear-gradient(160deg, rgba(255,40,60,${0.6 * red}), rgba(255,110,40,${0.5 * red}))`, mixBlendMode: 'screen'}} />
        <div style={{position: 'absolute', inset: 0, opacity: 0.8, backgroundImage: 'repeating-linear-gradient(90deg, rgba(0,0,0,0.5) 0 1px, transparent 1px 4px), repeating-linear-gradient(0deg, rgba(0,0,0,0.5) 0 1px, transparent 1px 4px)', mixBlendMode: 'multiply'}} />
        <div style={{position: 'absolute', left: 200, top: 200, width: w, height: h, boxShadow: `inset 0 0 ${30 + 20 * wash}px rgba(255,255,255,${0.55 + 0.2 * wash})`}} />
      </div>
    );
  } else if (f < 708.5) {
    // 灯塔照片缩成的圆（淡、偏灰，底下带一点粉紫）
    const [cx, cy, r] = [1, 2, 3].map((j) => kfl(f, CIRC.map((c) => [c[0], c[j]])));
    body = (
      <div style={{position: 'absolute', left: cx - r, top: cy - r, width: 2 * r, height: 2 * r, borderRadius: '50%', overflow: 'hidden', filter: 'blur(1.6px)', opacity: 0.9}}>
        <div style={{position: 'absolute', left: -r * 0.3, top: -r * 0.1, filter: 'saturate(0.45) brightness(1.05)'}}><Scene i={4} w={2.6 * r} h={2.2 * r} /></div>
        <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(190,180,255,0.45), rgba(255,255,255,0) 45%, rgba(255,60,140,0.45))', mixBlendMode: 'screen'}} />
        <div style={{position: 'absolute', inset: 0, opacity: 0.5, backgroundImage: 'linear-gradient(90deg, rgba(0,0,0,0.25) 1px, transparent 1px)', backgroundSize: '4px 4px', mixBlendMode: 'multiply'}} />
      </div>
    );
  } else {
    const n = Math.min(f, 766);
    const M = homography(planeAt(n));
    const [dx, dy] = [1, 2].map((j) => kfl(f, SCROLL.map((c) => [c[0], c[j]])));
    const v = Math.abs(kfl(f + 0.5, SCROLL.map((c) => [c[0], c[2]])) - kfl(f - 0.5, SCROLL.map((c) => [c[0], c[2]])));
    const vb = v * 0.06;
    const plane = (blur: number, mask?: string) => (
      <div style={{position: 'absolute', left: 0, top: 0, width: 2600 * SS, height: 1400 * SS, transformOrigin: '0 0', transform: `${M} scale(${1 / SS})`, filter: blur > 0 ? `blur(${blur * SS}px)` : undefined, WebkitMaskImage: mask, maskImage: mask}}>
        <div style={{zoom: SS, position: 'absolute', left: 0, top: 0, width: 2600, height: 1400}}><Card f={f} inputs={inputs} /></div>
      </div>
    );
    // 景深：图标附近清楚，越往右、越往外越糊（平面坐标里的径向遮罩）
    const dof = `radial-gradient(circle at ${600 * SS}px ${381 * SS}px, transparent ${mix(200, 330, clamp((f - 715) / 30)) * SS}px, black ${mix(460, 620, clamp((f - 715) / 30)) * SS}px)`;
    body = (
      <div style={{position: 'absolute', inset: 0, transform: `translate(${dx}px, ${dy}px)`, filter: vb > 0.5 ? `url(#iVBlur${Math.round(vb)})` : undefined}}>
        {plane(0)}
        {plane(5, dof)}
      </div>
    );
  }
  const vbs = Array.from({length: 40}, (_, i) => i + 1);
  const grid = 1 - clamp((f - 704) / 4.5);
  return (
    <AbsoluteFill style={{background: '#fff', overflow: 'hidden', fontFamily: SANS}}>
      <svg width={0} height={0} style={{position: 'absolute'}}>
        <defs>{vbs.map((b) => <filter key={b} id={`iVBlur${b}`} filterUnits="userSpaceOnUse" x={-3000} y={-3000} width={8000} height={8000}><feGaussianBlur stdDeviation={`${b * 0.12} ${b}`} /></filter>)}</defs>
      </svg>
      <div style={{position: 'absolute', inset: 0, transform: `scale(${cam})`, transformOrigin: '960px 540px'}}>
        <div style={{position: 'absolute', left: 0, top: 0, width: 1280, height: 720, transform: 'scale(1.5)', transformOrigin: '0 0'}}>
          {grid > 0 && (
            <svg width={1280} height={720} style={{position: 'absolute', left: 0, top: 0, opacity: grid * (f < 703.5 ? 1 : 0.55), filter: 'blur(1px)', transform: `scale(${1.18 + 0.03 * (f - 701)})`, transformOrigin: '640px 360px'}}>
              {CELLS.map(([x, y, c], i) => <rect key={i} x={x} y={y} width={16} height={16} rx={2} fill="rgba(228,230,246,0.9)" stroke={c} strokeWidth={1} />)}
            </svg>
          )}
          {body}
        </div>
      </div>
      <Grain opacity={0.02} blend="multiply" />
    </AbsoluteFill>
  );
};

if (checkContract(CLOCK_CHECK_CARD_CONTRACT).length) throw new Error(checkContract(CLOCK_CHECK_CARD_CONTRACT).join('；'));
export const ClockCheckCard: React.FC = () => <ClockCheckCardGroup />;
