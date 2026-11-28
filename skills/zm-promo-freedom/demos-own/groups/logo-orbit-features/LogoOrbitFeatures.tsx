// 【镜头组】logo-orbit-features：标志从小弹出、身后一圈淡淡的轨道；两句好处逐词 / 逐字出现；6 个功能小圆标沿轨道一个接一个冒出来，整圈慢慢顺时针转；最后整体变虚淡掉（023-F 一拍）
// 学的动作（baseTOP × Taskly 38.05–42.55s，60fps 逐帧看过；时间表 （内部拆片记录，未随项目提供））：
//   0.10s 标志从 0.4× 弹到 1×（带一点回弹、倾斜着），身后柔光晕；0.25s 起一圈很淡的细轨道；第一行逐词、第二行斜体品牌蓝逐字；
//   0.45s 起 6 个白色小圆标（图标 + 下面一行小字）按顺时针位置每隔 0.1s 原地冒一个（0.3× → 1×、淡入），间隔约 60°；
//   之后整圈每秒约 3° 顺时针慢转，标志轻轻晃；4.25s 起整体变虚、变淡、略放大，4.5s 只剩底色。
// 我们的内容：标志用「小周」的"勾 + 点"（和 logo-check-build-cta 同一个）；大字"全家要做的事，/ 都在一个地方。"；功能：待办 / 项目 / 日历 / 家人 / 目标 / 手机。
//
// 拍表（源秒，30fps）
//   拍 1 标志 + 字    0.10–1.00   标志 0.10、轨道 0.25、第一行 0.15、第二行 0.45
//   拍 2 小圆标       0.45–1.10   每 0.1s 一个
//   拍 3 慢转         1.10–4.25   （停留点 2.50：看全貌；转动按输出秒，停留时照样转）
//   拍 4 出口         4.22–4.50   变虚淡掉（ease-in）
// 毛病清单：
//   - 通用：画面永远不停（整圈按输出秒慢转、标志轻晃、背景漂）；--hq；确定性
//   - 独有 1：小圆标在原地冒出，不是从标志飞出去
//   - 独有 2：小圆标转的时候本身不跟着转（图标和字始终正着）
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {FONT, Grain, Vignette, mix} from '../../../assets/lib/helpers/polish';
import {GroupContract, checkContract, checkInputs, outputDuration, planExtras, toSource} from '../../../assets/lib/helpers/groupClock';

const FPS = 30;
const SANS = `"PingFang SC", "Noto Sans CJK SC", "Noto Sans SC", ${FONT.sans}`;
const INK = '#141826';
const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const sm = (x: number) => { const c = clamp(x); return c * c * (3 - 2 * c); };
const rp = (t: number, a: number, b: number) => sm((t - a) / (b - a));
const eo = (t: number, a: number, b: number) => { const c = clamp((t - a) / (b - a)); return 1 - Math.pow(1 - c, 3); };
const eob = (t: number, a: number, b: number) => { const c = clamp((t - a) / (b - a)); const k = 1.7; return 1 + (k + 1) * Math.pow(c - 1, 3) + k * Math.pow(c - 1, 2); };
const hex = (c: string) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
const mixc = (a: string, b: string, k: number) => { const A = hex(a), B = hex(b); return `rgb(${A.map((v, i) => Math.round(mix(v, B[i], clamp(k)))).join(',')})`; };
const fy = (p: number) => 540 + (p * 12 - 600) * 1.1;

// ═════════ 合同 ═════════
export const LOGO_ORBIT_FEATURES_CONTRACT: GroupContract = {
  sourceDuration: 135 / 30, // 4.5s
  fps: 30,
  motion: [[0, 1.2], [4.2, 135 / 30]],
  holds: [{at: 2.5, maxExtra: 2.5}],
  landmarks: {logo: 0.1, ring: 0.25, line1: 0.15, line2: 0.45, item1: 0.45, item6: 0.95, orbit: 1.1, out: 4.22, exit: 135 / 30},
  sfx: [
    {at: 'logo', type: '弹出', note: '轻 pop + 低频（标志弹出）', tail: 0.4, volume: 0.35},
    {at: 'logo', type: '落版重击', note: '轻 pop + 低频（标志弹出）', tail: 0.4, volume: 0.35},
    {at: 'line1', type: '轻tick', note: '轻柔 tick 串（逐词）', tail: 0.6, volume: 0.2},
    {at: 'item1', type: '弹出', note: '一串轻 pop（6 个小圆标依次冒出，间隔 0.1s）', tail: 0.6, volume: 0.3},
    {at: 'orbit', type: '闪光', note: '很轻的环境 shimmer（慢转）', tail: 2.5, volume: 0.15},
    {at: 'out', type: '运镜', note: '柔和 whoosh（变虚淡出）', volume: 0.3},
  ],
  inputs: {line1: {maxChars: 8}, line2: {maxChars: 8}, items: {count: 6, maxChars: 4}},
};
export type OrbitInputs = {
  line1: string[]; // 第一行按词切，合计 ≤8 字
  line2: string; // 第二行（逐字）≤8 字
  items: string[]; // 6 个功能名，顺时针从右上开始
  brandColor?: string;
  logo?: React.ReactNode; // 真标志（0–100 方框、白色）
};
export const ORBIT_DEFAULT_INPUTS: OrbitInputs = {line1: ['全家', '要做的事，'], line2: '都在一个地方。', items: ['待办', '项目', '日历', '家人', '目标', '手机']};
export function checkOrbitInputs(x: OrbitInputs): string[] {
  return checkInputs(LOGO_ORBIT_FEATURES_CONTRACT, {line1: x.line1.join(''), line2: x.line2, items: x.items});
}
export const planOrbit = (sec: number) => planExtras(LOGO_ORBIT_FEATURES_CONTRACT, sec);
export const orbitFrames = (extras: number[]) => Math.round(outputDuration(LOGO_ORBIT_FEATURES_CONTRACT, extras) * FPS);
export const LOGO_ORBIT_FEATURES_DURATION = 135;

const Backdrop: React.FC<{t: number}> = ({t}) => {
  const dr = t * 0.32;
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: 'linear-gradient(180deg, #e2e6fa 0%, #e6eafb 38%, #eef1fb 68%, #f5f7f6 100%)'}}>
      <AbsoluteFill style={{background: `radial-gradient(ellipse 34% 46% at ${78 - dr}% 9%, rgba(184,192,250,0.95) 0%, rgba(197,204,251,0) 100%)`}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 40% 42% at 10% 96%, rgba(226,243,190,0.95) 0%, rgba(233,244,205,0) 100%)'}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 38% 36% at 92% 96%, rgba(250,252,253,0.95) 0%, rgba(250,252,253,0) 100%)'}} />
      <Vignette strength={0.1} color="#3a3f6a" inner={0.5} />
      <Grain opacity={0.035} />
    </AbsoluteFill>
  );
};

// ═════════ 大字 ═════════
const HF = 96;
const tw = (s: string) => Array.from(s).reduce((a, c) => a + (/[\u0000-ÿ]/.test(c) ? 0.56 : 1) * HF, 0);
const Headline: React.FC<{s: number; x: OrbitInputs; blue: string}> = ({s, x, blue}) => {
  const ws = x.line1.map(tw);
  let acc = 960 - ws.reduce((a, b) => a + b, 0) / 2;
  const l2 = Array.from(x.line2);
  return (
    <>
      {x.line1.map((w, i) => {
        const left = acc; acc += ws[i];
        const t0 = 0.15 + i * (0.4 / Math.max(1, x.line1.length));
        if (s < t0) return null;
        const k = eo(s, t0, t0 + 0.11), ink = rp(s, t0 + 0.02, t0 + 0.14);
        return <span key={i} style={{position: 'absolute', left, top: 166 - HF * 0.66, fontSize: HF, lineHeight: `${HF * 1.32}px`, fontWeight: 600, fontFamily: SANS, whiteSpace: 'pre',
          color: mixc('#9ea2b4', INK, ink), opacity: 0.2 + 0.8 * clamp(k * 1.3), filter: k < 0.98 ? `blur(${(5 * (1 - k)).toFixed(2)}px)` : undefined, transform: `translateY(${(5 * (1 - k)).toFixed(2)}px)`}}>{w}</span>;
      })}
      <div style={{position: 'absolute', left: 0, right: 0, top: 280 - HF * 0.66, textAlign: 'center', fontSize: HF, lineHeight: `${HF * 1.32}px`, fontWeight: 600, fontFamily: SANS, whiteSpace: 'pre'}}>
        {l2.map((c, i) => {
          const t0 = 0.45 + i * (0.5 / Math.max(1, l2.length));
          const k = clamp((s - t0) / 0.1), e = 1 - Math.pow(1 - k, 3);
          return <span key={i} style={{display: 'inline-block', opacity: s < t0 ? 0 : 0.2 + 0.8 * e, color: mixc('#c4c7f6', blue, e), transform: `translateY(${(HF * 0.28 * (1 - e)).toFixed(2)}px) skewX(-9deg)`, filter: k < 0.98 ? `blur(${(4 * (1 - e)).toFixed(2)}px)` : undefined}}>{c}</span>;
        })}
      </div>
    </>
  );
};

// ═════════ 标志：立体蓝色圆角方块 + 勾 + 点 ═════════
const Mark: React.FC = () => (
  <svg viewBox="0 0 100 100" width="100%" height="100%">
    <path d="M26 54 L42 70 L76 34" stroke="#fff" strokeWidth={15} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <circle cx={30} cy={28} r={8.5} fill="#fff" />
  </svg>
);
const LogoTile: React.FC<{size: number; blue: string; logo?: React.ReactNode}> = ({size, blue, logo}) => (
  <div style={{position: 'relative', width: size, height: size, borderRadius: size * 0.26, background: `linear-gradient(150deg, #5d6bff 0%, ${blue} 45%, #1b28b8 100%)`,
    boxShadow: `inset 0 ${size * 0.03}px ${size * 0.04}px rgba(255,255,255,0.45), inset 0 -${size * 0.05}px ${size * 0.08}px rgba(10,15,90,0.45), 0 ${size * 0.06}px 0 #1a24a0, 0 ${size * 0.16}px ${size * 0.3}px rgba(30,40,170,0.35)`}}>
    <div style={{position: 'absolute', left: '8%', top: '5%', width: '84%', height: '40%', borderRadius: size * 0.2, background: 'linear-gradient(180deg, rgba(255,255,255,0.28), rgba(255,255,255,0))'}} />
    <div style={{position: 'absolute', inset: '20%'}}>{logo ?? <Mark />}</div>
  </div>
);

// ═════════ 功能小图标 ═════════
const ICONS = [
  'M5 12.5l4.5 4.5L19 7.5', // 待办 勾
  'M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z', // 项目 文件夹
  'M4 6h16v14H4zM4 10h16M9 3v4M15 3v4', // 日历
  'M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 6.5M18.5 20a6 6 0 0 0-3-5', // 家人
  'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', // 目标
  'M8 3h8a1.5 1.5 0 0 1 1.5 1.5v15A1.5 1.5 0 0 1 16 21H8a1.5 1.5 0 0 1-1.5-1.5v-15A1.5 1.5 0 0 1 8 3zM11 18h2', // 手机
];
const ANG = [-46, 15, 74, 133, 193, 254]; // 度，屏幕坐标（y 向下），从右上开始顺时针
const ITEM_T = [0.45, 0.55, 0.65, 0.75, 0.85, 0.95];
const CX = 960, CY = fy(62), R = 256, LOGO = 196, DOT = 92; // 原片圆心在画高 65%；16:9 画面上下更窄，整组上移 3% 免得下面的字出画

export type OrbitProps = {inputs?: OrbitInputs; extras?: number[]};
export const LogoOrbitFeaturesGroup: React.FC<OrbitProps> = ({inputs = ORBIT_DEFAULT_INPUTS, extras = [0]}) => {
  const C = LOGO_ORBIT_FEATURES_CONTRACT;
  const t = useCurrentFrame() / FPS;
  const s = toSource(t, C, extras);
  const blue = inputs.brandColor ?? '#2a42f4';
  const out = Math.pow(clamp((s - 4.22) / 0.28), 2); // 越到最后越快
  const pop = eob(s, 0.1, 0.42);
  const logoOp = clamp((s - 0.1) / 0.06);
  const wob = Math.sin(t * 2.1) * 3.5; // 轻晃（按输出秒）
  const spin = Math.max(0, t - 0.45) * 4; // 整圈慢转（按输出秒，度）
  const ring = rp(s, 0.25, 0.6);
  return (
    <AbsoluteFill style={{overflow: 'hidden', fontFamily: SANS}}>
      <Backdrop t={t} />
      <AbsoluteFill style={{opacity: 1 - out, filter: out > 0.01 ? `blur(${(34 * out).toFixed(2)}px)` : undefined, transform: `scale(${(1 + 0.008 * t + 0.09 * out).toFixed(5)})`, transformOrigin: '960px 560px'}}>
        <Headline s={s} x={inputs} blue={blue} />
        {/* 光晕 + 轨道 */}
        <div style={{position: 'absolute', left: CX - 260, top: CY - 260, width: 520, height: 520, borderRadius: 520, opacity: logoOp, background: 'radial-gradient(circle, rgba(255,255,255,0.55) 0%, rgba(220,226,255,0.25) 40%, rgba(220,226,255,0) 70%)'}} />
        <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, opacity: ring * 0.55}}>
          <circle cx={CX} cy={CY} r={R} fill="none" stroke="rgba(120,130,220,0.35)" strokeWidth={1.5} />
        </svg>
        {/* 标志 */}
        {s >= 0.1 && (
          <div style={{position: 'absolute', left: CX - LOGO / 2, top: CY - LOGO / 2, width: LOGO, height: LOGO, opacity: logoOp,
            transform: `scale(${mix(0.4, 1, pop).toFixed(4)}) rotate(${(-14 + wob + 10 * (1 - pop)).toFixed(2)}deg)`}}>
            <LogoTile size={LOGO} blue={blue} logo={inputs.logo} />
          </div>
        )}
        {/* 小圆标 */}
        {inputs.items.map((name, i) => {
          const t0 = ITEM_T[i];
          if (s < t0) return null;
          const k = eob(s, t0, t0 + 0.18), op = clamp((s - t0) / 0.08);
          const a = ((ANG[i] + spin) * Math.PI) / 180;
          const x = CX + R * Math.cos(a), y = CY + R * Math.sin(a);
          return (
            <div key={i} style={{position: 'absolute', left: x - DOT / 2, top: y - DOT / 2, width: DOT, opacity: op, transform: `scale(${mix(0.3, 1, k).toFixed(4)})`}}>
              <div style={{width: DOT, height: DOT, borderRadius: DOT, background: '#fff', boxShadow: '0 1px 0 rgba(255,255,255,0.9) inset, 0 6px 16px rgba(50,60,150,0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <svg width={40} height={40} viewBox="0 0 24 24"><path d={ICONS[i]} stroke={blue} strokeWidth={1.8} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
              <div style={{position: 'absolute', left: -40, right: -40, top: DOT + 8, textAlign: 'center', fontSize: 22, fontWeight: 600, color: INK, whiteSpace: 'pre'}}>{name}</div>
            </div>
          );
        })}
        {/* 一颗小亮点沿轨道走 */}
        {s > 1.0 && (() => { const a = ((-80 + t * 24) * Math.PI) / 180; return <div style={{position: 'absolute', left: CX + R * Math.cos(a) - 5, top: CY + R * Math.sin(a) - 5, width: 10, height: 10, borderRadius: 10, background: blue, opacity: 0.6 * clamp((s - 1.0) / 0.3)}} />; })()}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
export const LogoOrbitFeatures: React.FC = () => <LogoOrbitFeaturesGroup />;

if (checkContract(LOGO_ORBIT_FEATURES_CONTRACT).length) throw new Error(checkContract(LOGO_ORBIT_FEATURES_CONTRACT).join('; '));
