// 【镜头组】button-press-rings：上一镜的字淡掉，一个超近、斜着的淡紫色按钮从画面外扫进来、镜头一路拉远摆正，露出整个按钮"规划行程 🔍" →
//   按下：一下变成深蓝、外面一圈圈淡紫光环往外荡开 → 缩一点、发光 → 松开变浅（021-G 一拍，行动按钮）
// 学的动作（mnowakdesign · Roamly 19.80–21.60s，30fps 逐帧量过；时间表 （内部拆片记录，未随项目提供））：
//   19.87–20.97 按钮四角逐帧 ECC 同形配准（track.ts，以 20.8s 那一帧为准）；21.0 一帧变深蓝 rgb(31,0,242)；
//   21.0–21.33 光环 4 圈往外荡开、淡掉；按钮 21.07–21.47 从 835×125 缩到 694×115；21.53 松开变 rgb(127,98,247)，21.6 硬切 021-H。
// 我们的内容：021-C 表单上的"规划行程"按钮。
//
// 拍表（源秒 = 原片秒 − 19.80，30fps，共 54 帧）
//   拍 1 扫进来拉远   0.00–1.15   （停留点 1.17）
//   拍 2 按下、光环   1.20–1.80
// 毛病清单：
//   - 通用：画面永远不停（停留时整体极慢推近）；--hq 渲染；确定性
//   - 独有 1：拉远是真透视（matrix3d 四角），按钮右边一直略大（离镜头近）
//   - 独有 2：按下是一帧变色 + 光环外荡，不是渐变
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {FONT, Grain} from '../../../assets/lib/helpers/polish';
import {GroupContract, checkContract, checkInputs, outputDuration, planExtras, toSource} from '../../../assets/lib/helpers/groupClock';
import {G_CORNERS, G_F0} from './track';

const FPS = 30;
const SANS = `"PingFang SC", "Noto Sans CJK SC", "Noto Sans SC", ${FONT.sans}`;
const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const mix = (a: number, b: number, k: number) => a + (b - a) * k;
const kfl = (t: number, K: number[][]) => { if (t <= K[0][0]) return K[0][1]; for (let i = 0; i < K.length - 1; i++) if (t <= K[i + 1][0]) return mix(K[i][1], K[i + 1][1], (t - K[i][0]) / (K[i + 1][0] - K[i][0])); return K[K.length - 1][1]; };
const T0 = 594 / 30;

export const BUTTON_PRESS_RINGS_CONTRACT: GroupContract = {
  sourceDuration: 54 / 30,
  fps: 30,
  motion: [[0, 1.15], [1.2, 54 / 30]],
  holds: [{at: 1.17, maxExtra: 1.0}],
  landmarks: {sweep: 0.07, settle: 1.13, press: 1.2, rings: 1.25, release: 1.73, exit: 54 / 30},
  sfx: [
    {at: 'sweep', type: '运镜', note: '拉远 whoosh', tail: 0.6, volume: 0.35},
    {at: 'press', type: '点击', note: '按键 click + 柔和 thump', volume: 0.45},
    {at: 'press', type: '轻落定', note: '按键 click + 柔和 thump', volume: 0.45},
    {at: 'rings', type: '闪光', note: '扩散 shimmer', tail: 0.4, volume: 0.3},
  ],
  inputs: {cta: {maxChars: 5}, fade: {maxChars: 3}},
};

export type PressInputs = {cta: string; fade: string};
export const PRESS_DEFAULT_INPUTS: PressInputs = {cta: '规划行程', fade: '出行。'};
export const checkPressInputs = (x: PressInputs) => checkInputs(BUTTON_PRESS_RINGS_CONTRACT, x);
export const planPress = (sec: number) => planExtras(BUTTON_PRESS_RINGS_CONTRACT, sec);
export const pressFrames = (extras: number[]) => Math.round(outputDuration(BUTTON_PRESS_RINGS_CONTRACT, extras) * FPS);
export const BUTTON_PRESS_RINGS_DURATION = 54;

const Q = [[0, 0], [900, 0], [900, 150], [0, 150]]; // 按钮排版尺寸 900×150（帧 624 的四角对应它）
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
const cornersAt = (n: number) => { const i = clamp(n - G_F0, 0, G_CORNERS.length - 1), i0 = Math.floor(i), i1 = Math.min(G_CORNERS.length - 1, i0 + 1); return G_CORNERS[i0].map((v, j) => mix(v, G_CORNERS[i1][j], i - i0)); };
// 按下后：按钮外框（720p 左、右、上、下）
const PRESSED = [[21.0, 222, 1080, 259, 446], [21.067, 234, 1069, 290, 415], [21.133, 242, 1059, 291, 414], [21.2, 250, 1051, 292, 413], [21.267, 256, 1043, 293, 412], [21.333, 273, 1029, 296, 409], [21.4, 294, 1009, 299, 405], [21.467, 303, 997, 295, 410], [21.533, 290, 1010, 290, 412], [21.6, 290, 1010, 290, 412]];

export const ButtonPressRingsGroup: React.FC<{inputs?: PressInputs; extras?: number[]}> = ({inputs = PRESS_DEFAULT_INPUTS, extras = [0]}) => {
  const t = useCurrentFrame() / FPS;
  const s = toSource(t, BUTTON_PRESS_RINGS_CONTRACT, extras) + T0;
  const lag = t - (s - T0);
  const n = s * 30;
  const cam = 1 + 0.004 * lag;
  const pressed = s >= 21.0;
  const released = s >= 21.52;
  const appear = clamp((s - 19.84) / 0.12);
  // 原片起手很糊、很淡（离焦），0.5s 内变清；外层是 4 倍排版再 scale(0.25)，所以糊的半径要乘 4
  const blur = 14 * Math.pow(Math.max(0, 1 - (s - 19.87) / 0.85), 1.6) * 4;
  const edge = clamp((s - 20.1) / 0.6); // 深蓝描边跟着对焦慢慢出来（原片起手整颗按钮很淡）

  let btn: React.ReactNode;
  if (!pressed) {
    const M = homography(cornersAt(Math.max(n, 596)));
    btn = (
      <div style={{position: 'absolute', left: 0, top: 0, width: 900 * 4, height: 150 * 4, transformOrigin: '0 0', transform: `${M} scale(0.25)`, opacity: appear, filter: blur > 0.2 ? `blur(${blur}px)` : undefined}}>
        <div style={{zoom: 4, position: 'absolute', left: -62, top: 0, width: 1024, height: 150, borderRadius: 75, background: 'linear-gradient(90deg, #d3c7fb, #c3b5f8 60%, #bba9f7)', boxShadow: `inset 0 0 0 3.5px rgba(42,18,240,${mix(0.15, 1, edge)}), 0 0 0 1.5px rgba(240,80,220,${0.6 * edge}), 0 20px 50px rgba(110,80,240,0.18)`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 26}}>
          <div style={{position: 'absolute', inset: 0, borderRadius: 75, background: '#fff', opacity: 0.55 * (1 - edge)}} />
          <span style={{position: 'relative', fontSize: 52, fontWeight: 700, color: 'transparent', WebkitTextStroke: `2.4px rgba(36,16,232,${mix(0.35, 1, edge)})`, letterSpacing: 1}}>{inputs.cta}</span>
          <svg style={{position: 'relative'}} width={56} height={56} viewBox="0 0 24 24" fill="none" stroke="#2410e8" strokeWidth={2.6} strokeLinecap="round"><circle cx="11" cy="11" r="6.5" /><path d="M20 20l-4.3-4.3" /></svg>
        </div>
      </div>
    );
  } else {
    const k = [1, 2, 3, 4].map((j) => kfl(s, PRESSED.map((p) => [p[0], p[j]])));
    const [L, R, T, B] = k, h = B - T;
    const col = released ? 'rgb(127,98,247)' : 'rgb(31,0,242)';
    const rings = [0, 1, 2, 3, 4, 5].map((i) => {
      const u = clamp((s - 21.0 - i * 0.015) / 0.38);
      if (u <= 0 || u >= 1) return null;
      const g = 12 + i * 8 + u * (70 + i * 22);
      return <div key={i} style={{position: 'absolute', left: L - g, top: T - g, width: R - L + 2 * g, height: h + 2 * g, borderRadius: (h + 2 * g) / 2, boxShadow: `inset 0 0 0 4.5px rgba(${i % 2 ? '235,150,235' : '160,140,250'},${0.85 * (1 - u * u)}), 0 0 14px rgba(170,150,255,${0.5 * (1 - u)})`, filter: 'blur(1.8px)'}} />;
    });
    btn = (
      <>
        {rings}
        <div style={{position: 'absolute', left: L, top: T, width: R - L, height: h, borderRadius: h / 2, background: `linear-gradient(100deg, ${col} 0%, ${col} 62%, rgba(120,80,255,1) 80%, ${col} 100%)`, boxShadow: `0 0 0 ${released ? 6 : 10}px rgba(150,120,250,0.45), 0 0 40px rgba(${released ? '130,110,255' : '230,60,220'},0.55), 0 22px 70px rgba(60,20,240,${s > 21.3 ? 0.65 : 0.3})`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: h * 0.14, color: '#fff', fontSize: h * 0.3, letterSpacing: 1}}>
          {inputs.cta}
          <svg width={h * 0.32} height={h * 0.32} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={1.8} strokeLinecap="round"><circle cx="11" cy="11" r="6.5" /><path d="M20 20l-4.3-4.3" /></svg>
        </div>
      </>
    );
  }
  const fadeOld = 1 - clamp((s - 19.8) / 0.1);
  return (
    <AbsoluteFill style={{background: '#fff', overflow: 'hidden', fontFamily: SANS}}>
      <div style={{position: 'absolute', inset: 0, transform: `scale(${cam})`, transformOrigin: '960px 540px'}}>
        <div style={{position: 'absolute', left: 0, top: 0, width: 1280, height: 720, transform: 'scale(1.5)', transformOrigin: '0 0'}}>
          {/* 背景一层很淡的紫色光（原片按钮四周 rgb(245,243,251)） */}
          <div style={{position: 'absolute', left: 140, top: 180, width: 1000, height: 330, borderRadius: 200, background: 'radial-gradient(ellipse at center, rgba(225,218,252,0.7), rgba(255,255,255,0) 70%)'}} />
          {fadeOld > 0 && <div style={{position: 'absolute', left: 0, width: 1280, top: 393 - 75, textAlign: 'center', fontSize: 85, fontWeight: 600, color: '#d79ee8', opacity: fadeOld * 0.6, filter: 'blur(3px)'}}>{inputs.fade}</div>}
          {btn}
        </div>
      </div>
      <Grain opacity={0.02} blend="multiply" />
    </AbsoluteFill>
  );
};

if (checkContract(BUTTON_PRESS_RINGS_CONTRACT).length) throw new Error(checkContract(BUTTON_PRESS_RINGS_CONTRACT).join('；'));
export const ButtonPressRings: React.FC = () => <ButtonPressRingsGroup />;
