// 【镜头组】form-tilt-road：表单卡片斜着往后倒、镜头贴着最上面那条标签栏扎进去 → 标签栏转成竖着的一条"路"，
//   白色的选中块变成路中间的分道线，一段一段往前冲 → 路越走越宽、两边往外弯 → 路面填成浅蓝、越来越蓝，最后往上一收、白场（021-D 一拍，转场）
// 学的动作（mnowakdesign · Roamly 6.133–9.233s，30fps 逐帧量过；时间表 （内部拆片记录，未随项目提供））：
//   6.13–7.27 镜头用整图 ECC 同形配准逐帧量四角（track.ts，6.8 那一帧用速度外推做初值才接上）；
//   7.3 起"路"按逐帧量的左右边（y = 0/180/360/540/720 五个点）画；分道线三段，分别在 7.73 / 8.27 / 8.80 从下面冲上去（每段 0.27 秒）；
//   8.73–9.13 路面 灰 → 浅蓝 → 蓝，9.13–9.2 从下往上收掉，9.2 白场，接 021-E。
// 我们的内容：021-C 的出行表单（开车 / 公交）。
//
// 拍表（源秒 = 原片秒 − 6.133，30fps，共 93 帧）
//   拍 1 倾倒扎进去   0.00–1.17   卡片倒下、镜头贴着标签栏推进
//   拍 2 变成路       1.17–2.55   标签栏转成竖路、分道线冲上去（停留点 1.90：路走直的那一段）
//   拍 3 变蓝收掉     2.60–3.10   路面变蓝、往上收、白场
// 毛病清单：
//   - 通用：画面永远不停（停留时整体极慢推近）；--hq 渲染；确定性
//   - 独有 1：倾倒是真的透视（matrix3d 四角），不是 rotateX
//   - 独有 2：路是标签栏本身变的（同一个灰色长条），分道线是"开车"那个白色选中块变的
import React from 'react';
import {AbsoluteFill, Freeze, useCurrentFrame} from 'remotion';
import {Grain} from '../../../assets/lib/helpers/polish';
import {GroupContract, checkContract, checkInputs, outputDuration, planExtras, toSource} from '../../../assets/lib/helpers/groupClock';
import {FormCardBuildGroup, FormInputs, FORM_DEFAULT_INPUTS, FORM_CARD_BUILD_DURATION} from '../form-card-build/FormCardBuild';
import {D_CORNERS, D_F0} from './track';

const FPS = 30;
const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const mix = (a: number, b: number, k: number) => a + (b - a) * k;
const kfl = (t: number, K: number[][]) => { if (t <= K[0][0]) return K[0][1]; for (let i = 0; i < K.length - 1; i++) if (t <= K[i + 1][0]) return mix(K[i][1], K[i + 1][1], (t - K[i][0]) / (K[i + 1][0] - K[i][0])); return K[K.length - 1][1]; };
const T0 = 184 / 30;

export const FORM_TILT_ROAD_CONTRACT: GroupContract = {
  sourceDuration: 93 / 30,
  fps: 30,
  motion: [[0, 1.55], [2.0, 93 / 30]],
  holds: [{at: 1.9, maxExtra: 1.2}],
  landmarks: {tilt: 0, dive: 0.6, road: 1.17, dash1: 1.6, dash2: 2.13, dash3: 2.67, blue: 2.6, close: 3.0, exit: 93 / 30},
  sfx: [
    {at: 'dive', type: '运镜', note: '快速推镜 whoosh', tail: 0.5, volume: 0.4},
    {at: 'dash1', type: '短甩', note: '短促 swish（分道线掠过）', volume: 0.25},
    {at: 'dash2', type: '短甩', note: '短促 swish（分道线掠过）', volume: 0.25},
    {at: 'dash3', type: '短甩', note: '短促 swish（分道线掠过）', volume: 0.25},
    {at: 'close', type: '吸入', note: '吸入声 / 转场 whoosh', tail: 0.3, volume: 0.35},
  ],
  inputs: {},
};

export const checkTiltRoadInputs = () => checkInputs(FORM_TILT_ROAD_CONTRACT, {});
export const planTiltRoad = (sec: number) => planExtras(FORM_TILT_ROAD_CONTRACT, sec);
export const tiltRoadFrames = (extras: number[]) => Math.round(outputDuration(FORM_TILT_ROAD_CONTRACT, extras) * FPS);
export const FORM_TILT_ROAD_DURATION = 93;

// ── 同形变换（720p 四角 → 1080p matrix3d）──
const Q = [[442, 198], [838, 198], [838, 535], [442, 535]];
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
  for (let i = 0; i < 4; i++) { const [x, y] = Q[i], u = dst[i * 2], v = dst[i * 2 + 1]; A.push([x, y, 1, 0, 0, 0, -u * x, -u * y]); b.push(u); A.push([0, 0, 0, x, y, 1, -v * x, -v * y]); b.push(v); }
  const h = solve(A, b);
  return `matrix3d(${h[0]},${h[3]},0,${h[6]},${h[1]},${h[4]},0,${h[7]},0,0,1,0,${h[2]},${h[5]},0,1)`;
};
const cornersAt = (n: number) => { const i = clamp(n - D_F0, 0, D_CORNERS.length - 1), i0 = Math.floor(i), i1 = Math.min(D_CORNERS.length - 1, i0 + 1); return D_CORNERS[i0].map((v, j) => mix(v, D_CORNERS[i1][j], i - i0)); };

// ── 路（720p，原片秒）：左右边在 y = 0/180/360/540/720 ──
const ROAD: [number, number[], number[]][] = [
  [7.3, [600, 548, 500, 455, 420], [790, 775, 755, 735, 715]],
  [7.433, [572, 537, 502, 467, 436], [768, 760, 750, 741, 732]],
  [7.533, [555, 531, 506, 480, 457], [753, 751, 751, 752, 752]],
  [7.633, [549, 528, 508, 488, 470], [735, 743, 750, 757, 764]],
  [7.733, [545, 526, 510, 493, 478], [728, 738, 749, 759, 769]],
  [7.833, [514, 495, 474, 455, 438], [744, 761, 777, 793, 808]],
  [7.933, [479, 455, 430, 405, 382], [773, 795, 815, 836, 855]],
  [8.033, [456, 427, 397, 367, 339], [794, 817, 842, 867, 891]],
  [8.133, [441, 411, 380, 346, 312], [806, 831, 856, 884, 912]],
  [8.233, [436, 408, 377, 340, 302], [810, 832, 858, 888, 920]],
  [8.433, [428, 409, 379, 337, 287], [815, 830, 853, 889, 929]],
  [8.633, [414, 407, 380, 330, 265], [825, 829, 851, 891, 942]],
  [8.833, [409, 410, 388, 338, 274], [828, 827, 844, 884, 935]],
  [9.033, [417, 411, 392, 359, 317], [825, 829, 844, 871, 906]],
  [9.233, [413, 403, 388, 370, 350], [829, 836, 848, 860, 880]],
];
const roadAt = (t: number) => {
  let i = 0; while (i < ROAD.length - 2 && t > ROAD[i + 1][0]) i++;
  const k = clamp((t - ROAD[i][0]) / (ROAD[i + 1][0] - ROAD[i][0]));
  return {L: ROAD[i][1].map((v, j) => mix(v, ROAD[i + 1][1][j], k)), R: ROAD[i][2].map((v, j) => mix(v, ROAD[i + 1][2][j], k))};
};
// 路面颜色（rgb）
const FILL = [[8.7, 245, 245, 246], [8.733, 237, 240, 247], [8.833, 213, 231, 248], [8.933, 191, 227, 252], [9.033, 160, 213, 248], [9.133, 125, 200, 243]];
// 分道线（中心 y、长度）：第一段是"开车"选中块滑下来、停在下面再冲上去；之后两段从下面冲上去
const DASH0 = [[7.3, 290, 250], [7.4, 354, 228], [7.467, 478, 300], [7.533, 620, 200], [7.6, 634, 170], [7.733, 600, 245], [7.8, 412, 256], [7.867, 192, 232], [7.933, 44, 160], [7.98, -80, 120]];
const DASHN = [[0, 820, 100], [0.067, 622, 190], [0.133, 360, 416], [0.2, 88, 170], [0.25, -80, 120]];

export const FormTiltRoadGroup: React.FC<{inputs?: FormInputs; extras?: number[]}> = ({inputs = FORM_DEFAULT_INPUTS, extras = [0]}) => {
  const t = useCurrentFrame() / FPS;
  const s = toSource(t, FORM_TILT_ROAD_CONTRACT, extras) + T0; // 原片秒
  const lag = t - (s - T0);
  const n = s * 30;
  const cam = 1 + 0.004 * lag;

  let body: React.ReactNode;
  if (s < 7.3) {
    const M = homography(cornersAt(n));
    const blur = clamp((s - 6.65) / 0.15) * (1 - clamp((s - 7.1) / 0.15)) * 6;
    // 1080p 容器：先把 720p 的同形变换套上（四角已是 720p），外面再乘 1.5
    body = (
      <div style={{position: 'absolute', left: 0, top: 0, width: 1280, height: 720, transform: 'scale(1.5)', transformOrigin: '0 0'}}>
        <div style={{position: 'absolute', left: 0, top: 0, width: 1280 * 4, height: 720 * 4, transformOrigin: '0 0', transform: `${M} scale(0.25)`, filter: blur > 0.3 ? `blur(${blur}px)` : undefined}}>
          {/* 卡片取 021-C 最后一帧（去掉它自己的慢推），按 4 倍排版防糊；只留卡片，四周长条在倾倒时已经出画 */}
          <div style={{zoom: 4 / 1.5, position: 'absolute', left: 0, top: 0, width: 1920, height: 1080}}>
            <div style={{position: 'absolute', inset: 0, transform: `scale(${1 / 1.06})`, transformOrigin: '960px 547.5px'}}>
              <Freeze frame={FORM_CARD_BUILD_DURATION - 1}><FormCardBuildGroup inputs={inputs} noTilt /></Freeze>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    const {L, R} = roadAt(s);
    const close = clamp((s - 9.133) / 0.07); // 9.13–9.2 从下往上收
    const bottom = mix(760, -40, close);
    const ys = [0, 180, 360, 540, 720];
    const yy = ys.map((y) => Math.min(y, bottom));
    const fc = kfl(s, FILL.map((f) => [f[0], f[1]])), fg = kfl(s, FILL.map((f) => [f[0], f[2]])), fb = kfl(s, FILL.map((f) => [f[0], f[3]]));
    // 平滑曲线（Catmull-Rom 经过 5 个点）
    const curve = (xs: number[], rev = false) => {
      const pts = xs.map((x, i) => [x, yy[i]]); if (rev) pts.reverse();
      let d = '';
      for (let i = 0; i < pts.length - 1; i++) {
        const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
        d += ` C ${p1[0] + (p2[0] - p0[0]) / 6} ${p1[1] + (p2[1] - p0[1]) / 6} ${p2[0] - (p3[0] - p1[0]) / 6} ${p2[1] - (p3[1] - p1[1]) / 6} ${p2[0]} ${p2[1]}`;
      }
      return d;
    };
    const path = `M ${L[0] - 2} -10 L ${L[0]} 0${curve(L)} L ${R[4]} ${yy[4]}${curve(R, true)} L ${R[0] + 2} -10 Z`;
    const dashes: number[][] = [];
    if (s < 7.98) dashes.push([kfl(s, DASH0.map((d) => [d[0], d[1]])), kfl(s, DASH0.map((d) => [d[0], d[2]]))]);
    for (const t0 of [8.27, 8.8]) if (s >= t0 && s < t0 + 0.25) dashes.push([kfl(s - t0, DASHN.map((d) => [d[0], d[1]])), kfl(s - t0, DASHN.map((d) => [d[0], d[2]]))]);
    const mid = (y: number) => { const j = clamp(y / 180, 0, 3.999), i = Math.floor(j); return (mix(L[i], L[i + 1], j - i) + mix(R[i], R[i + 1], j - i)) / 2; };
    const halfW = (y: number) => { const j = clamp(y / 180, 0, 3.999), i = Math.floor(j); return (mix(R[i], R[i + 1], j - i) - mix(L[i], L[i + 1], j - i)) / 2; };
    body = (
      <svg width={1920} height={1080} viewBox="0 0 1280 720" style={{position: 'absolute', left: 0, top: 0}}>
        <defs>
          <linearGradient id="ftr-fade" x1="0" y1="0" x2="0" y2="1"><stop offset="0.8" stopColor="#fff" /><stop offset="1" stopColor="#fff" stopOpacity={close > 0 ? 0 : 1} /></linearGradient>
          <mask id="ftr-m"><rect x="0" y="-20" width="1280" height={bottom + 20} fill="url(#ftr-fade)" /></mask>
          <filter id="ftr-soft"><feGaussianBlur stdDeviation={close > 0 ? 6 : 0.4} /></filter>
        </defs>
        <g mask="url(#ftr-m)" filter="url(#ftr-soft)">
          <path d={path} fill={`rgb(${fc},${fg},${fb})`} stroke={`rgba(${Math.round(fc * 0.88)},${Math.round(fg * 0.9)},${Math.round(fb * 0.94)},0.9)`} strokeWidth={1.4} />
          {dashes.map(([cy, len], i) => {
            const w = Math.max(10, halfW(cy) * 0.14);
            return <rect key={i} x={mid(cy) - w / 2} y={cy - len / 2} width={w} height={len} rx={w / 2} fill="#fff" fillOpacity={s > 8.7 ? 0.45 : 1} stroke="rgba(0,0,0,0.06)" strokeWidth={0.8} />;
          })}
        </g>
      </svg>
    );
  }
  return (
    <AbsoluteFill style={{background: '#fff', overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, transform: `scale(${cam})`, transformOrigin: '960px 540px'}}>{body}</div>
      <Grain opacity={0.02} blend="multiply" />
    </AbsoluteFill>
  );
};

if (checkContract(FORM_TILT_ROAD_CONTRACT).length) throw new Error(checkContract(FORM_TILT_ROAD_CONTRACT).join('；'));
export const FormTiltRoad: React.FC = () => <FormTiltRoadGroup />;
