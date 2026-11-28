// 深蓝星空 + 蓝色弧光（行星边缘）风零件（028 数星整条共用，2026-11-18 第30批）
import React from 'react';
import {smoothKf} from './smoothKey';
import {AbsoluteFill} from 'remotion';

export const SANS = '"Inter","PingFang SC","Noto Sans CJK SC","Noto Sans SC",sans-serif';
export const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
export const mix = (a: number, b: number, k: number) => a + (b - a) * k;
export const eo = (u: number) => 1 - Math.pow(1 - clamp(u), 3);
export const eio = (u: number) => { const x = clamp(u); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
export const hash = (n: number) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
export const kf = (t: number, K: number[][], e: (u: number) => number = eio) => { if (K.length > 2 && K.every((k, j) => j === 0 || k[0] > K[j - 1][0])) return smoothKf(t, K); if (t <= K[0][0]) return K[0][1]; for (let i = 0; i < K.length - 1; i++) if (t <= K[i + 1][0]) return mix(K[i][1], K[i + 1][1], e((t - K[i][0]) / (K[i + 1][0] - K[i][0]))); return K[K.length - 1][1]; };

/** 深蓝底（2026-11-19 按原片吸管量重做）：原片的蓝偏「天蓝 / 钴蓝」（绿分量多），不是发紫的靛蓝；
 *  光是从一侧（gx,gy）大面积打进来的，另一侧压到接近黑；带一层细颗粒。glow 控制整体亮度 */
export const NavyBg: React.FC<{gx?: number; gy?: number; glow?: number; drift?: number; side?: number}> = ({gx = 50, gy = 55, glow = 1, drift = 0, side = 0.55}) => (
  <AbsoluteFill style={{background: '#020713', overflow: 'hidden'}}>
    <AbsoluteFill style={{background: `radial-gradient(ellipse 78% 85% at ${gx}% ${gy}%, rgba(26,82,205,${0.95 * glow}) 0%, rgba(16,56,160,${0.72 * glow}) 28%, rgba(8,30,95,${0.45 * glow}) 55%, rgba(2,7,19,0) 85%)`}} />
    <AbsoluteFill style={{background: `radial-gradient(ellipse 50% 75% at ${gx < 50 ? 0 : 100}% ${gy}%, rgba(22,72,190,${side * glow}) 0%, rgba(12,40,120,${side * 0.5 * glow}) 45%, rgba(2,7,19,0) 100%)`}} />
    <AbsoluteFill style={{backgroundImage: 'linear-gradient(rgba(120,160,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(120,160,255,0.03) 1px, transparent 1px)', backgroundSize: '96px 96px'}} />
    {Array.from({length: 60}, (_, i) => <div key={i} style={{position: 'absolute', left: (hash(i) * 1920 + drift * (10 + hash(i * 9) * 20)) % 1920, top: hash(i * 3.3) * 1080, width: 2 + hash(i * 5) * 2, height: 2 + hash(i * 5) * 2, borderRadius: 2, background: '#c4d8ff', opacity: 0.25 + hash(i * 7) * 0.5}} />)}
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, opacity: 0.08, mixBlendMode: 'overlay'}}><filter id="nvg"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" /><feColorMatrix type="saturate" values="0" /></filter><rect width="1920" height="1080" filter="url(#nvg)" /></svg>
  </AbsoluteFill>
);
/** 弧光：圆心 (cx,cy)、半径 R 的一条发光大圆边，里面一层渐暗 */
export const Arc: React.FC<{cx: number; cy: number; R: number; o?: number; w?: number; hair?: number}> = ({cx, cy, R, o = 1, w = 6, hair = 0.98}) => {
  // 2026-11-19 原片的星球边缘：顶上最亮、往两边越来越暗；一条白蓝细亮线 + 很宽一圈天蓝色大气光（外侧）+ 内侧一层亮蓝渐变
  // 外层留 P 的边距：外光晕要画在圆外面，遮罩层如果和圆一样大会把光晕切成一条硬的水平边（028-H 量出来的问题）
  const P = w * 45;
  const m = `linear-gradient(180deg, #000 0px, #000 ${P + R * 0.12}px, rgba(0,0,0,0.55) ${P + R * 0.35}px, rgba(0,0,0,0.12) ${P + R * 0.6}px, rgba(0,0,0,0) ${P + R * 0.85}px)`;
  return (
    <div style={{position: 'absolute', left: cx - R - P, top: cy - R - P, width: (R + P) * 2, height: (R + P) * 2, opacity: o, WebkitMaskImage: m, maskImage: m, pointerEvents: 'none'}}>
      {/* 大气光单独用径向渐变画（高斯衰减）：Chrome 对这么大的元素会把很大的 box-shadow 模糊丢掉，只剩 spread，出来一条硬边 */}
      <div style={{position: 'absolute', left: 0, top: 0, width: (R + P) * 2, height: (R + P) * 2, borderRadius: '50%',
        background: `radial-gradient(circle closest-side, ${Array.from({length: 13}, (_, i) => { const t = i / 12; const r = R + t * P * 0.9; return `rgba(34,100,245,${(0.5 * Math.exp(-5 * t * t)).toFixed(3)}) ${(r / (R + P) * 100).toFixed(2)}%`; }).join(', ')}, rgba(34,100,245,0) 100%)`}} />
      <div style={{position: 'absolute', left: P, top: P, width: R * 2, height: R * 2, borderRadius: '50%',
        boxShadow: `0 0 0 ${w * 0.45}px rgba(200,225,255,${hair}), 0 0 ${w * 2}px ${w * 0.8}px rgba(100,150,255,0.95), 0 0 ${w * 9}px ${w * 3}px rgba(40,120,255,0.7), inset 0 0 ${w * 4}px ${w}px rgba(120,180,255,0.75), inset 0 0 ${w * 28}px ${w * 5}px rgba(40,110,255,0.55)`,
        background: 'radial-gradient(circle closest-side, rgba(3,8,32,0.98) 80%, rgba(14,44,170,0.65) 95%, rgba(96,140,255,0.7) 100%)'}} />
    </div>
  );
};
/** 蓝色发光四角星（自己画的产品图标） */
export const Star4: React.FC<{size: number; o?: number; glow?: number; fat?: boolean}> = ({size, o = 1, glow = 1, fat = false}) => (
  <svg width={size} height={size} viewBox="-12 -12 24 24" style={{opacity: o, overflow: 'visible', filter: `drop-shadow(0 0 ${size * 0.06 * glow}px rgba(120,150,255,0.9)) drop-shadow(0 0 ${size * 0.2 * glow}px rgba(60,100,255,0.7))`}}>
    <defs><linearGradient id="st4" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#9fb6ff" /><stop offset="1" stopColor="#3a5cff" /></linearGradient></defs>
    <path d={fat ? "M0 -11 C2.4 -4.6 4.6 -2.4 11 0 C4.6 2.4 2.4 4.6 0 11 C-2.4 4.6 -4.6 2.4 -11 0 C-4.6 -2.4 -2.4 -4.6 0 -11 Z" : "M0 -11 C1.4 -3.2 3.2 -1.4 11 0 C3.2 1.4 1.4 3.2 0 11 C-1.4 3.2 -3.2 1.4 -11 0 C-3.2 -1.4 -1.4 -3.2 0 -11 Z"} fill="url(#st4)" />
  </svg>
);
/** 四角星 ⇄ 圆角方块：m=0 星（尖朝上下左右），m=1 方块（转 45°，角在对角线，边略内凹） */
export const MorphStar: React.FC<{x: number; y: number; size: number; m: number; rot: number; gid?: string}> = ({x, y, size, m, rot, gid = 'msG'}) => {
  const r1 = mix(70, 66, m), rc = mix(9, 22, m), a0 = (-90 + 45 * m + rot) * Math.PI / 180;
  const P = (r: number, a: number) => `${(r * Math.cos(a)).toFixed(2)} ${(r * Math.sin(a)).toFixed(2)}`;
  let d = `M${P(r1, a0)}`;
  for (let k = 0; k < 4; k++) { const a = a0 + k * Math.PI / 2; d += ` Q${P(rc, a + Math.PI / 4)} ${P(r1, a + Math.PI / 2)}`; }
  return (
    <svg width={160} height={160} viewBox="-80 -80 160 160" style={{position: 'absolute', left: x - 80, top: y - 80, overflow: 'visible', transform: `scale(${size})`, filter: 'drop-shadow(0 0 4px rgba(80,115,255,0.6)) drop-shadow(0 0 16px rgba(50,90,255,0.4))'}}>
      <defs><radialGradient id={gid} cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#6683ff" /><stop offset="0.6" stopColor="#4f6dff" /><stop offset="1" stopColor="#3d5bff" /></radialGradient></defs>
      <path d={d + ' Z'} fill={`url(#${gid})`} style={{filter: 'blur(0.6px)'}} />
    </svg>
  );
};
/** 玻璃卡的"走光"边框：一圈细边，上面有两团亮光沿着边绕着走（原片 028-G：亮的那段一会儿在右上、一会儿跑到左边、再绕到上边）
 *  ang = 亮光所在角度（0 上、90 右），a/b = 两团光（相对 180°）的亮度；外面再套一层模糊的同款当辉光（模糊要包在遮罩外面，否则被遮罩裁掉） */
export const RimLight: React.FC<{w: number; h: number; r?: number; ang: number; a?: number; b?: number; th?: number}> = ({w, h, r = 34, ang, a = 1, b = 0.6, th = 3}) => {
  const L = (k: number) => `rgba(170,200,255,${k})`;
  const bg = `conic-gradient(from ${ang - 60}deg at 50% 50%, ${L(0)} 0deg, ${L(0.55 * a)} 35deg, ${L(a)} 60deg, ${L(0.55 * a)} 85deg, ${L(0)} 130deg, ${L(0)} 180deg, ${L(0.55 * b)} 215deg, ${L(b)} 240deg, ${L(0.55 * b)} 265deg, ${L(0)} 310deg, ${L(0)} 360deg)`;
  const ring = (extra: React.CSSProperties) => <div style={{position: 'absolute', inset: 0, borderRadius: r, padding: th, background: bg, WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude', ...extra} as React.CSSProperties} />;
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: w, height: h, pointerEvents: 'none', mixBlendMode: 'screen'}}>
      <div style={{position: 'absolute', inset: -14, filter: 'blur(22px)'}}><div style={{position: 'absolute', inset: 14}}>{ring({padding: th + 12, inset: -10})}</div></div>
      <div style={{position: 'absolute', inset: 0, filter: 'blur(8px)'}}>{ring({padding: th + 4})}</div>
      <div style={{position: 'absolute', inset: 0, filter: 'blur(2px)'}}>{ring({})}</div>
      {ring({})}
    </div>
  );
};
/** 玻璃卡（深蓝半透明 + 亮蓝细边） */
export const GlassCard: React.FC<{w: number; h: number; children?: React.ReactNode; edge?: number; lit?: number; style?: React.CSSProperties}> = ({w, h, children, edge = 1, lit = 0, style}) => (
  // 2026-11-19 原片玻璃卡：亮蓝粗边（左下最亮）+ 外面一圈蓝辉光 + 卡内从左下透进来的蓝光
  <div style={{position: 'relative', width: w, height: h, borderRadius: 34, background: lit ? `linear-gradient(180deg, rgba(8,18,70,${0.55 + 0.1 * lit}) 0%, rgba(14,40,140,${0.55 * lit}) 55%, rgba(36,96,235,${0.75 * lit}) 100%), radial-gradient(ellipse 90% 80% at 15% 100%, rgba(40,100,240,0.38), rgba(10,24,90,0.55) 55%, rgba(5,10,48,0.72) 100%)` : 'radial-gradient(ellipse 90% 80% at 15% 100%, rgba(40,100,240,0.38), rgba(10,24,90,0.55) 55%, rgba(5,10,48,0.72) 100%)', boxShadow: `0 0 0 3px rgba(120,170,255,${0.95 * edge}), 0 0 10px 2px rgba(120,175,255,${0.7 * edge}), 0 0 40px 8px rgba(50,115,255,${0.5 * edge}), 0 0 110px 20px rgba(40,90,255,${0.22 * edge}), inset 0 0 30px rgba(90,140,255,0.35), inset 6px -6px 24px rgba(110,170,255,0.3)`, overflow: 'hidden', fontFamily: SANS, ...style}}>{children}</div>
);
