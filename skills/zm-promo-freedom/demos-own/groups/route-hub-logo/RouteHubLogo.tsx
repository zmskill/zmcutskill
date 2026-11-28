// 【镜头组】route-hub-logo：一行大字「一个应用，串起每一段路。」在一块斜着、慢慢转的平面上被打出来 →
//   四条彩色虚线（红、橙、绿、蓝）从画面外一路画进来，全都汇到句末那个圈「。」上（像地铁换乘站）→
//   字变灰淡掉，镜头扑向这个圈、越转越快，线变粗、变糊，圈变成一团蓝 → 线全部缩回这团蓝里 →
//   蓝团变成 App 图标（淡紫圆底）→ 往左让位，右边"由糊变清"地出现品牌字「小周出行」，停住（021-K 一拍，收 logo）
// 学的动作（mnowakdesign · Roamly 30.867–37.40s，30fps 逐帧量过；时间表 （内部拆片记录，未随项目提供））：
//   30.87–34.10 平面四角逐帧 ECC 同形配准（track.ts，以 32.8s 帧 984 为准）：字在平面上一直纹丝不动（量过：左边 x 110±2）；
//   打字：右边缘 30.9 → 32.43 一路推到 1335（平面 px），光标 32.73 消失；
//   画线（从远端往汇聚点，按弧长比例）：红 31.9–32.4、橙 32.3–32.67、绿 32.5–32.93、蓝 32.83–33.2；
//   32.93–33.07 字变灰、33.27 淡没，只留汇聚圈；33.33 圈变深藏青 rgb(7,0,65)，33.8 变亮蓝；33.6 起镜头自转越来越快（34.1 时每帧 30°）；
//   33.8–34.07 线变粗（9 → 26）、虚线缝变小、变糊；34.07–34.4 线缩回蓝团；34.47 变成图标；34.53 淡紫圆底（半径 61）；
//   34.9–35.53 图标从 x 631 滑到 425，35.0–35.33 品牌字"由糊变清"擦出（左边 = 图标中心 + 102），35.87 起完全停住到结尾。
// 我们的内容：小周家自己的出行 App（不用真品牌），图标是一个定位针。
//
// 拍表（源秒 = 原片秒 − 30.867，30fps，共 197 帧）
//   拍 1 打字 + 画线       0.00–2.17
//   拍 2 扑向汇聚圈、自转  2.17–3.20
//   拍 3 线缩回、变图标    3.20–3.73
//   拍 4 图标让位、出字    3.73–5.75   （停留点 5.80：品牌定格）
// 毛病清单：
//   - 通用：画面永远不停（停留时整体极慢推近）；--hq 渲染；确定性
//   - 独有 1：字和线在同一块透视平面上（matrix3d 四角逐帧量），近处（左边）糊、远处清楚
//   - 独有 2：线是从远端"画"向汇聚点的，缩回时也是往汇聚点缩；虚线花纹不能跟着爬
import React from 'react';
import {AbsoluteFill, Freeze, useCurrentFrame} from 'remotion';
import {TYPE_GLOW_LIST_DURATION, TypeGlowListGroup} from '../type-glow-list/TypeGlowList';
import {FONT, Grain} from '../../../assets/lib/helpers/polish';
import {GroupContract, checkContract, checkInputs, outputDuration, planExtras, toSource} from '../../../assets/lib/helpers/groupClock';
import {K_EXT, K_F0, K_PATHS, K_PLANE} from './track';

const FPS = 30;
const SANS = `"PingFang SC", "Noto Sans CJK SC", "Noto Sans SC", ${FONT.sans}`;
const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const mix = (a: number, b: number, k: number) => a + (b - a) * k;
const kfl = (t: number, K: number[][]) => { if (t <= K[0][0]) return K[0][1]; for (let i = 0; i < K.length - 1; i++) if (t <= K[i + 1][0]) return mix(K[i][1], K[i + 1][1], (t - K[i][0]) / (K[i + 1][0] - K[i][0])); return K[K.length - 1][1]; };
const easeOut = (x: number) => 1 - Math.pow(1 - clamp(x), 3);
const T0 = 926 / 30;

export const ROUTE_HUB_LOGO_CONTRACT: GroupContract = {
  sourceDuration: 197 / 30,
  fps: 30,
  motion: [[0, 5.75], [5.85, 197 / 30]],
  holds: [{at: 5.8, maxExtra: 2.0}],
  landmarks: {type: 0, lines: 1.03, fade: 2.07, dive: 2.3, spin: 2.9, merge: 3.2, icon: 3.6, word: 4.13, settle: 4.9, exit: 197 / 30},
  sfx: [
    {at: 'type', type: '键盘', note: '键盘 tick 一串', tail: 1.5, volume: 0.3},
    {at: 'lines', type: '短甩', note: '轻快 whoosh × 4（画线）', tail: 1.0, volume: 0.3},
    {at: 'spin', type: '上扬铺垫', note: '旋转上扬 riser', tail: 0.4, volume: 0.4},
    {at: 'icon', type: '提示音', note: 'logo 落定 chime / pop', volume: 0.5},
    {at: 'word', type: '闪光', note: '柔和 shimmer', tail: 0.5, volume: 0.3},
  ],
  inputs: {line: {maxChars: 10}, brand: {maxChars: 4}},
};

export type HubInputs = {line: string; brand: string};
export const HUB_DEFAULT_INPUTS: HubInputs = {line: '一个应用，串起每段路', brand: '小周出行'};
export const checkHubInputs = (x: HubInputs) => checkInputs(ROUTE_HUB_LOGO_CONTRACT, x);
export const planHub = (sec: number) => planExtras(ROUTE_HUB_LOGO_CONTRACT, sec);
export const hubFrames = (extras: number[]) => Math.round(outputDuration(ROUTE_HUB_LOGO_CONTRACT, extras) * FPS);
export const ROUTE_HUB_LOGO_DURATION = 197;

// ---- 平面 → 画面 ----
const P = [[110, 425], [1336, 425], [1336, 500], [110, 500]];
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
const planeAt = (n: number) => { const i = clamp(n - K_F0, 0, K_PLANE.length - 1), i0 = Math.floor(i), i1 = Math.min(K_PLANE.length - 1, i0 + 1); return K_PLANE[i0].map((v, j) => mix(v, K_PLANE[i1][j], i - i0)); };

// ---- 打字：原片字的右边缘（平面 px）随帧 ----
const EDGE = [[926, 110], [927, 185], [929, 258], [931, 330], [934, 396], [935, 472], [937, 551], [943, 585], [948, 673], [950, 738], [951, 810], [953, 857], [954, 931], [958, 1006], [960, 1087], [962, 1172], [964, 1225], [966, 1297], [973, 1335]];
const FS = 92, X0 = 110, HUB = [1050, 470];
// ---- 画线（弧长比例）、缩回（剩下靠近汇聚点的长度）----
const HEAD: Record<string, number[][]> = {
  red: [[957, 0], [958, 0.09], [960, 0.25], [962, 0.43], [964, 0.55], [966, 0.68], [968, 0.85], [970, 0.96], [972, 1]],
  orange: [[969, 0], [970, 0.07], [972, 0.41], [974, 0.61], [976, 0.78], [978, 0.93], [980, 1]],
  green: [[975, 0], [976, 0.05], [978, 0.26], [980, 0.44], [982, 0.7], [984, 0.83], [986, 0.96], [988, 1]],
  blue: [[985, 0], [986, 0.04], [988, 0.27], [990, 0.48], [992, 0.82], [994, 0.89], [996, 1]],
};
const KEEP = [[1018, 99999], [1021, 420], [1022, 300], [1024, 180], [1026, 115], [1028, 90], [1030, 50], [1032, 0]];
const COL: Record<string, string> = {red: 'rgb(232,0,65)', orange: 'rgb(241,144,13)', green: 'rgb(22,231,134)', blue: 'rgb(14,106,243)'};
const LEN: Record<string, number[]> = Object.fromEntries(Object.entries(K_PATHS).map(([c, p]) => {
  const L = [0]; for (let i = 1; i < p.length; i++) L.push(L[i - 1] + Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]));
  return [c, L];
}));
const subPath = (c: string, a: number, b: number) => {
  const p = K_PATHS[c], L = LEN[c]; const pts: number[][] = [];
  const at = (s: number) => { let i = 0; while (i < L.length - 2 && L[i + 1] < s) i++; const k = clamp((s - L[i]) / Math.max(1e-6, L[i + 1] - L[i])); return [mix(p[i][0], p[i + 1][0], k), mix(p[i][1], p[i + 1][1], k)]; };
  pts.push(at(a)); for (let i = 0; i < p.length; i++) if (L[i] > a && L[i] < b) pts.push(p[i]); pts.push(at(b));
  return 'M ' + pts.map((q) => `${q[0].toFixed(1)} ${q[1].toFixed(1)}`).join(' L ');
};

const Pin: React.FC<{c?: string}> = ({c = '#2112e8'}) => (
  <svg width={46} height={58} viewBox="0 0 46 58"><path d="M23 2C11.4 2 3 10.6 3 21.6 3 35 23 56 23 56s20-21 20-34.4C43 10.6 34.6 2 23 2z" fill={c} /><circle cx="23" cy="21.5" r="7.5" fill="#fff" /><path d="M14.5 39.5c4 2.2 13 2.2 17 0" stroke="#fff" strokeWidth={3} strokeLinecap="round" fill="none" opacity={0.85} /></svg>
);

const SS = 3;
export const RouteHubLogoGroup: React.FC<{inputs?: HubInputs; extras?: number[]; prev?: React.ReactNode}> = ({inputs = HUB_DEFAULT_INPUTS, extras = [0], prev}) => {
  const t = useCurrentFrame() / FPS;
  const s = toSource(t, ROUTE_HUB_LOGO_CONTRACT, extras) + T0;
  const lag = t - (s - T0);
  const f = s * 30;
  const cam = 1 + 0.004 * lag;

  // 打字
  const chars = Array.from(inputs.line);
  const edge = kfl(f, EDGE);
  const pitch = (HUB[0] - 34 - X0) / chars.length; // 字均匀铺满到汇聚圈左边
  const shownN = chars.filter((_, i) => edge >= X0 + pitch * (i + 0.75)).length;
  const ringOn = edge >= 1080;
  const cursorX = ringOn ? HUB[0] + 54 : X0 + shownN * pitch + 14;
  const cursorOn = f < 981.5;
  const textGray = clamp((f - 988) / 4), textOp = 1 - clamp((f - 992) / 6);
  // 汇聚圈：黑 → 深藏青 → 亮蓝，环变粗 → 实心团
  const kNavy = clamp((f - 992) / 8), kBlue = clamp((f - 1006) / 8);
  const ringCol = `rgb(${mix(mix(16, 7, kNavy), 36, kBlue)},${mix(mix(16, 0, kNavy), 20, kBlue)},${mix(mix(20, 65, kNavy), 238, kBlue)})`;
  const ringR = kfl(f, [[990, 32], [1000, 34], [1010, 40], [1014, 46], [1020, 50], [1026, 50], [1030, 44], [1032, 40]]);
  const ringW = kfl(f, [[990, 16], [1000, 17], [1008, 20], [1014, 28], [1016, 60], [1020, 100]]);
  // 线
  const sw = kfl(f, [[1004, 9], [1008, 12], [1014, 18], [1020, 26], [1026, 30]]);
  const gap = kfl(f, [[1004, 30], [1014, 28], [1020, 28], [1026, 20]]);
  const dash = kfl(f, [[1004, 46], [1020, 62]]);
  const lineBlur = kfl(f, [[1008, 0], [1014, 1.5], [1020, 3], [1028, 5]]);
  const keep = kfl(f, KEEP);

  const planeOn = f < 1032.5;
  const n = Math.min(f, 1034);
  const M = homography(planeAt(n));
  const g = Math.round(mix(17, 140, textGray));

  const lines = Object.keys(K_PATHS).map((c) => {
    const L = LEN[c][LEN[c].length - 1];
    const fr = kfl(f, HEAD[c]);
    const head = fr > 0 ? K_EXT + fr * (L - K_EXT) : 0;
    const a = Math.max(0, L - keep);
    if (head <= a + 1) return null;
    return <path key={c} d={subPath(c, a, head)} fill="none" stroke={COL[c]} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={`${dash} ${gap}`} strokeDashoffset={a} />;
  });

  const planeContent = (
    <div style={{position: 'absolute', left: 0, top: 0, width: 2400, height: 1400}}>
      <svg width={3000} height={2200} viewBox="-1000 -800 3000 2200" style={{position: 'absolute', left: -1000, top: -800, overflow: 'visible', filter: lineBlur > 0.2 ? `blur(${lineBlur}px)` : undefined}}>{lines}</svg>
      {textOp > 0 && (
        <div style={{position: 'absolute', left: X0, top: 424, fontSize: FS, lineHeight: 1, fontWeight: 700, letterSpacing: pitch - FS, color: `rgb(${g},${g},${g + 2})`, whiteSpace: 'nowrap', opacity: textOp}}>
          {chars.slice(0, shownN).join('')}
        </div>
      )}
      {cursorOn && <div style={{position: 'absolute', left: cursorX, top: 390, width: 12, height: 134, background: '#2a17ee'}} />}
      {ringOn && (
        <div style={{position: 'absolute', left: HUB[0] - ringR, top: HUB[1] - ringR, width: 2 * ringR, height: 2 * ringR, borderRadius: f > 1016 ? `${mix(50, 42, clamp((f - 1016) / 6))}%` : '50%', boxShadow: `inset 0 0 0 ${Math.min(ringW, ringR)}px ${ringCol}`, filter: f > 1012 ? `blur(${kfl(f, [[1012, 0], [1020, 2.5], [1030, 3]])}px)` : undefined, transform: f > 1016 ? `rotate(${(f - 1016) * 9}deg) scale(${1 + 0.12 * Math.sin((f - 1016) * 0.7)}, 1)` : undefined}} />
      )}
    </div>
  );
  const plane = (blur: number, mask?: string) => (
    <div style={{position: 'absolute', left: 0, top: 0, width: 2400 * SS, height: 1400 * SS, transformOrigin: '0 0', transform: `${M} scale(${1 / SS})`, filter: blur > 0 ? `blur(${blur * SS}px)` : undefined, WebkitMaskImage: mask, maskImage: mask}}>
      <div style={{zoom: SS, position: 'absolute', left: 0, top: 0, width: 2400, height: 1400}}>{planeContent}</div>
    </div>
  );
  // 景深：平面左边（离镜头近）糊
  const dof = `linear-gradient(90deg, black ${260 * SS}px, transparent ${700 * SS}px)`;

  // 图标 + 品牌字（画面坐标）
  const iconCx = kfl(f, [[1032, 626], [1040, 631], [1046, 624], [1052, 597], [1055, 540], [1058, 478], [1064, 438], [1070, 427], [1076, 425]]);
  const iconCy = kfl(f, [[1032, 366], [1036, 364], [1040, 362], [1046, 360]]);
  const iconSc = kfl(f, [[1033, 1.45], [1036, 1.25], [1040, 1.08], [1046, 0.95], [1052, 1]]);
  const iconRot = kfl(f, [[1033, -22], [1036, -10], [1040, -2], [1044, 0]]);
  const disc = easeOut((f - 1034.5) / 5);
  const wordFront = (f - 1049) * 40; // 擦除前沿（px）
  const blob = f >= 1030.5 && f < 1033.5;

  return (
    <AbsoluteFill style={{background: '#fff', overflow: 'hidden', fontFamily: SANS}}>
      {prev && f < 934 && (
        <div style={{position: 'absolute', inset: 0, mixBlendMode: 'multiply', transform: `translateY(${kfl(f, [[925, 0], [926, -26], [927, -35], [928, -64], [929, -112], [930, -178], [931, -240], [932, -300], [933, -380], [934, -470]]) * 1.5}px) rotate(${kfl(f, [[925, 0], [932, -0.8]])}deg)`}}>{prev}</div>
      )}
      <div style={{position: 'absolute', inset: 0, transform: `scale(${cam})`, transformOrigin: '960px 540px'}}>
        <div style={{position: 'absolute', left: 0, top: 0, width: 1280, height: 720, transform: 'scale(1.5)', transformOrigin: '0 0'}}>
          {planeOn && plane(0)}
          {planeOn && f < 1000 && plane(5, dof)}
          {blob && <div style={{position: 'absolute', left: 626 - 36, top: 366 - 40, width: 72, height: 80, borderRadius: '48% 52% 46% 54%', background: '#2414ee', transform: `rotate(-25deg) scale(${kfl(f, [[1031, 1.2], [1033, 0.9]])})`, filter: 'blur(1.2px)'}} />}
          {f >= 1033.5 && (
            <>
              <div style={{position: 'absolute', left: iconCx - 61, top: iconCy - 61, width: 122, height: 122, borderRadius: 61, background: '#f2f0fd', opacity: disc, transform: `scale(${mix(1.35, 1, disc)})`, filter: disc < 0.9 ? `blur(${(1 - disc) * 8}px)` : undefined}} />
              <div style={{position: 'absolute', left: iconCx - 23, top: iconCy - 29, width: 46, height: 58, transform: `rotate(${iconRot}deg) scale(${iconSc * 0.9})`}}><Pin /></div>
              {wordFront > -20 && (
                <div style={{position: 'absolute', left: iconCx + 102, top: 324, fontSize: 82, lineHeight: 1, fontWeight: 700, letterSpacing: 1, whiteSpace: 'nowrap'}}>
                  <div style={{color: '#1e1e20', WebkitMaskImage: `linear-gradient(90deg, black ${wordFront - 70}px, transparent ${wordFront}px)`, maskImage: `linear-gradient(90deg, black ${wordFront - 70}px, transparent ${wordFront}px)`}}>{inputs.brand}</div>
                  <div style={{position: 'absolute', left: 0, top: 0, color: '#9a9aa2', filter: 'blur(5px)', WebkitMaskImage: `linear-gradient(90deg, transparent ${wordFront - 80}px, black ${wordFront - 20}px, black ${wordFront + 30}px, transparent ${wordFront + 110}px)`, maskImage: `linear-gradient(90deg, transparent ${wordFront - 80}px, black ${wordFront - 20}px, black ${wordFront + 30}px, transparent ${wordFront + 110}px)`}}>{inputs.brand}</div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <Grain opacity={0.02} blend="multiply" />
    </AbsoluteFill>
  );
};

if (checkContract(ROUTE_HUB_LOGO_CONTRACT).length) throw new Error(checkContract(ROUTE_HUB_LOGO_CONTRACT).join('；'));
// 预览：开头叠上上一镜（021-J 清单）最后一帧继续往上滑走（原片两镜在 30.87–31.1 是重叠的）
export const RouteHubLogo: React.FC = () => <RouteHubLogoGroup prev={<Freeze frame={TYPE_GLOW_LIST_DURATION - 1}><TypeGlowListGroup /></Freeze>} />;
