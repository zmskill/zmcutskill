// 公用零件：暗色界面一组（040 Aside 一组镜头共用：040-A…L）
// 照原片量的：底色 #262626、搜索栏 / 程序坞的浅一档灰、玻璃感 App 图标（圆角 22%、上亮下暗、底部投影）、白手套光标、I 形光标、玻璃垃圾桶。
// 图标：自己画的通用图形 + 国内产品官方图标（library/brands，App Store 1024 原图，2026-11-17 第2轮换上）。
import React from 'react';
import {Img, staticFile} from 'remotion';
import {FONT} from '../../../assets/lib/helpers/polish';

export const SANS = `"PingFang SC", "Noto Sans CJK SC", "Noto Sans SC", ${FONT.sans}`;
export const BG = '#262626';
export const BAR = '#313333';
export const CYAN = '#4fb3dc';
export const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
export const mix = (a: number, b: number, k: number) => a + (b - a) * k;
export const easeOut = (u: number) => 1 - Math.pow(1 - clamp(u), 3);
export const easeInOut = (u: number) => { const x = clamp(u); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };

/** 单调三次插值（Fritsch–Carlson）：关键帧之间顺滑、不过冲。K = [[t, v], ...] 按 t 递增。 */
export const mk = (t: number, K: number[][]) => {
  const n = K.length;
  if (t <= K[0][0]) return K[0][1];
  if (t >= K[n - 1][0]) return K[n - 1][1];
  const d: number[] = [], m: number[] = [];
  for (let i = 0; i < n - 1; i++) d.push((K[i + 1][1] - K[i][1]) / (K[i + 1][0] - K[i][0]));
  m.push(d[0]);
  for (let i = 1; i < n - 1; i++) m.push(d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2);
  m.push(d[n - 2]);
  for (let i = 0; i < n - 1; i++) {
    if (d[i] === 0) { m[i] = 0; m[i + 1] = 0; continue; }
    const a = m[i] / d[i], b = m[i + 1] / d[i], h = a * a + b * b;
    if (h > 9) { const k = 3 / Math.sqrt(h); m[i] = k * a * d[i]; m[i + 1] = k * b * d[i]; }
  }
  let i = 0; while (t > K[i + 1][0]) i++;
  const h = K[i + 1][0] - K[i][0], u = (t - K[i][0]) / h;
  const h00 = 2 * u ** 3 - 3 * u ** 2 + 1, h10 = u ** 3 - 2 * u ** 2 + u, h01 = -2 * u ** 3 + 3 * u ** 2, h11 = u ** 3 - u ** 2;
  return h00 * K[i][1] + h10 * h * m[i] + h01 * K[i + 1][1] + h11 * h * m[i + 1];
};
/** 多通道关键帧：K = [[t, a, b, c...]]，返回 [a, b, c...] */
export const mkv = (t: number, K: number[][]) => K[0].slice(1).map((_, j) => mk(t, K.map((r) => [r[0], r[j + 1]])));

// ── 产品色：竖条纹的蓝绿渐变（040-D 精灵效果撑满屏的那块；产品图标也用它）──
export const BRAND_GRAD = 'linear-gradient(180deg, #86c3d6 0%, #4a92b2 20%, #215f84 42%, #0b2c45 64%, #030a12 92%)';
export const BRAND_STREAKS = 'repeating-linear-gradient(90deg, rgba(255,255,255,0.0) 0px, rgba(255,255,255,0.06) 9px, rgba(0,0,0,0.05) 21px, rgba(255,255,255,0.03) 33px, rgba(0,0,0,0.0) 47px), repeating-linear-gradient(90deg, rgba(0,0,0,0) 0px, rgba(0,0,0,0.14) 70px, rgba(255,255,255,0.06) 130px, rgba(0,0,0,0) 190px)';

// ── App 图标（通用图形，size = 外框边长）──
export type DrawnIcon = 'brand' | 'dawn' | 'bolt' | 'rings' | 'globe' | 'note' | 'spark' | 'chat' | 'cal' | 'card' | 'doc' | 'slides' | 'lock' | 'cloud' | 'music';
export type IconKind = DrawnIcon | BrandIcon;
const ICON_BG: Record<DrawnIcon, string> = {
  brand: BRAND_GRAD,
  dawn: 'linear-gradient(180deg,#ffffff,#eef0f6)',
  bolt: 'linear-gradient(180deg,#1e2f6e,#121c48)',
  rings: 'linear-gradient(180deg,#e9775b,#d4573f)',
  globe: 'linear-gradient(180deg,#2bc0a4,#138d7c)',
  note: 'linear-gradient(180deg,#ffd75e,#f3b82e)',
  spark: 'linear-gradient(180deg,#ffffff,#f1f1f5)',
  chat: 'linear-gradient(180deg,#43d16b,#1fae4c)',
  cal: 'linear-gradient(180deg,#ffffff,#f2f2f2)',
  card: 'linear-gradient(180deg,#6d5cff,#4a35e6)',
  doc: 'linear-gradient(180deg,#3d8bff,#1f65e0)',
  slides: 'linear-gradient(180deg,#ffb23f,#f28a1c)',
  lock: 'linear-gradient(180deg,#3b3f47,#23262c)',
  cloud: 'linear-gradient(180deg,#7fd3ff,#3aa3f0)',
  music: 'linear-gradient(180deg,#ff5f7e,#e83a5f)',
};
const Glyph: React.FC<{k: DrawnIcon}> = ({k}) => {
  switch (k) {
    case 'brand': return <div style={{width: '100%', height: '100%', background: BRAND_STREAKS, opacity: 0.8}} />;
    case 'dawn': return (<svg viewBox="0 0 100 100" width="100%" height="100%"><defs><linearGradient id="dg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3f7fe8" /><stop offset="0.45" stopColor="#bfe0f2" /><stop offset="0.62" stopColor="#ffe14d" /><stop offset="0.82" stopColor="#ff8a3d" /><stop offset="1" stopColor="#ff3d78" /></linearGradient></defs><path d="M18 74 C14 40 30 20 50 20 C70 20 86 40 82 74 C70 64 30 64 18 74 Z" fill="url(#dg)" /></svg>);
    case 'bolt': return (<svg viewBox="0 0 100 100" width="100%" height="100%"><defs><radialGradient id="bg1" cx="0.4" cy="0.35" r="0.7"><stop offset="0" stopColor="#8fc2ff" /><stop offset="0.6" stopColor="#2f6de0" /><stop offset="1" stopColor="#1b3fa8" /></radialGradient></defs><circle cx="50" cy="50" r="30" fill="url(#bg1)" /><path d="M54 24 L36 54 H50 L44 78 L66 44 H52 Z" fill="#fff" /></svg>);
    case 'rings': return (<svg viewBox="0 0 100 100" width="100%" height="100%" fill="none" stroke="#fde8de" strokeWidth="6"><circle cx="50" cy="50" r="10" fill="#fde8de" /><circle cx="50" cy="50" r="21" /><circle cx="50" cy="50" r="32" strokeWidth="5" opacity="0.8" /></svg>);
    case 'globe': return (<svg viewBox="0 0 100 100" width="100%" height="100%" fill="none" stroke="#eafff8" strokeWidth="4.5"><circle cx="50" cy="50" r="28" /><ellipse cx="50" cy="50" rx="12" ry="28" /><path d="M22 50 H78 M26 36 H74 M26 64 H74" /></svg>);
    case 'note': return (<svg viewBox="0 0 100 100" width="100%" height="100%"><rect x="24" y="22" width="52" height="58" rx="8" fill="#fffaf0" /><path d="M33 38 H67 M33 50 H67 M33 62 H55" stroke="#e0a21a" strokeWidth="5" strokeLinecap="round" /></svg>);
    case 'spark': return (<svg viewBox="0 0 100 100" width="100%" height="100%"><defs><linearGradient id="sg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ff5aa8" /><stop offset="0.5" stopColor="#7a5cff" /><stop offset="1" stopColor="#21c3ff" /></linearGradient></defs><path d="M50 16 C54 38 62 46 84 50 C62 54 54 62 50 84 C46 62 38 54 16 50 C38 46 46 38 50 16 Z" fill="url(#sg)" /></svg>);
    case 'chat': return (<svg viewBox="0 0 100 100" width="100%" height="100%"><path d="M50 24 C68 24 80 35 80 49 C80 63 68 74 50 74 C45 74 41 73 37 72 L24 78 L28 66 C22 61 20 55 20 49 C20 35 32 24 50 24 Z" fill="#fff" /></svg>);
    case 'cal': return (<svg viewBox="0 0 100 100" width="100%" height="100%"><text x="50" y="34" textAnchor="middle" fontSize="15" fontWeight="700" fill="#f04a3e" fontFamily="sans-serif">周三</text><text x="50" y="76" textAnchor="middle" fontSize="40" fontWeight="300" fill="#222" fontFamily="sans-serif">14</text></svg>);
    case 'card': return (<svg viewBox="0 0 100 100" width="100%" height="100%"><rect x="20" y="32" width="60" height="38" rx="7" fill="#fff" /><rect x="20" y="40" width="60" height="7" fill="#4a35e6" /><rect x="27" y="56" width="18" height="5" rx="2" fill="#4a35e6" opacity="0.6" /></svg>);
    case 'doc': return (<svg viewBox="0 0 100 100" width="100%" height="100%"><path d="M30 20 H60 L72 32 V80 H30 Z" fill="#fff" /><path d="M38 44 H64 M38 54 H64 M38 64 H56" stroke="#1f65e0" strokeWidth="4.5" strokeLinecap="round" /></svg>);
    case 'slides': return (<svg viewBox="0 0 100 100" width="100%" height="100%"><rect x="20" y="28" width="60" height="40" rx="5" fill="#fff" /><rect x="30" y="38" width="22" height="20" rx="3" fill="#f28a1c" /><path d="M58 42 H70 M58 52 H68" stroke="#f28a1c" strokeWidth="4" strokeLinecap="round" /><path d="M50 68 V78 M40 78 H60" stroke="#fff" strokeWidth="4" strokeLinecap="round" /></svg>);
    case 'lock': return (<svg viewBox="0 0 100 100" width="100%" height="100%" fill="none"><path d="M36 46 V36 C36 27 43 22 50 22 C57 22 64 27 64 36 V46" stroke="#e8e8e8" strokeWidth="6" /><rect x="28" y="44" width="44" height="34" rx="8" fill="#e8e8e8" /><circle cx="50" cy="60" r="5" fill="#2a2d33" /></svg>);
    case 'cloud': return (<svg viewBox="0 0 100 100" width="100%" height="100%"><path d="M32 70 C22 70 18 62 18 56 C18 48 25 43 32 44 C34 34 42 28 52 28 C63 28 71 36 72 46 C79 46 84 52 84 58 C84 65 78 70 72 70 Z" fill="#fff" /></svg>);
    case 'music': return (<svg viewBox="0 0 100 100" width="100%" height="100%"><path d="M42 28 L70 22 V62" stroke="#fff" strokeWidth="6" fill="none" /><circle cx="36" cy="68" r="9" fill="#fff" /><circle cx="64" cy="64" r="9" fill="#fff" /><path d="M42 28 V68" stroke="#fff" strokeWidth="6" /></svg>);
  }
};
// ── 国内产品官方图标（App Store 原图，铺满方形，这里按 iOS 圆角裁）──
export const BRAND_ICONS = ['wechat', 'alipay', 'meituan', 'amap', 'dingtalk', 'feishu', 'qqmail', 'xiaohongshu', 'doubao', 'kimi', 'deepseek', 'qianwen', 'quark', 'qqmusic', 'iqiyi', 'baidupan', 'wecom', 'qqbrowser', 'wenxin', 'dianping', 'yuanbao', 'mail163'] as const;
export type BrandIcon = typeof BRAND_ICONS[number];
const isBrand = (k: string): k is BrandIcon => (BRAND_ICONS as readonly string[]).includes(k);
export const brandSrc = (k: BrandIcon) => staticFile(`library/brands/${k}/app-icon_1024.png`);
export const AppIcon: React.FC<{kind: IconKind; size: number; style?: React.CSSProperties}> = ({kind, size, style}) => isBrand(kind) ? (
  <div style={{width: size, height: size, borderRadius: size * 0.225, position: 'relative', overflow: 'hidden', background: '#fff',
    boxShadow: `0 ${size * 0.04}px ${size * 0.1}px rgba(0,0,0,0.45), inset 0 0 0 ${Math.max(0.5, size * 0.006)}px rgba(0,0,0,0.08)`, ...style}}>
    <Img src={brandSrc(kind)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%'}} />
  </div>
) : AppIconDrawn({kind, size, style});
const AppIconDrawn = ({kind, size, style}: {kind: DrawnIcon; size: number; style?: React.CSSProperties}) => (
  <div style={{width: size, height: size, borderRadius: size * 0.225, background: ICON_BG[kind], position: 'relative', overflow: 'hidden',
    boxShadow: `0 ${size * 0.04}px ${size * 0.1}px rgba(0,0,0,0.45), inset 0 ${size * 0.012}px 0 rgba(255,255,255,0.45), inset 0 -${size * 0.02}px ${size * 0.04}px rgba(0,0,0,0.12)`, ...style}}>
    <div style={{position: 'absolute', inset: kind === 'dawn' ? '1%' : '8%'}}><Glyph k={kind} /></div>
    <div style={{position: 'absolute', left: 0, top: 0, right: 0, height: '45%', background: 'linear-gradient(180deg,rgba(255,255,255,0.22),rgba(255,255,255,0))'}} />
  </div>
);

// ── 光标 ──
/** 白手套（食指尖 = 定位点）。h = 高度 */
export const Hand: React.FC<{x: number; y: number; h?: number; opacity?: number; press?: number}> = ({x, y, h = 140, opacity = 1, press = 0}) => (
  <svg style={{position: 'absolute', left: x - h * 0.33, top: y - h * 0.04, opacity, transform: `scale(${1 - 0.08 * press})`, transformOrigin: '33% 4%', filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.45))'}} width={h * 0.78} height={h} viewBox="0 0 78 100">
    <path d="M26 6 C26 1 34 1 34 6 V40 C34 36 42 36 42 41 V44 C42 40 50 40 50 45 V48 C50 44 58 44 58 49 V70 C58 84 50 94 38 94 H32 C22 94 16 88 11 80 L3 64 C1 60 6 55 10 59 L18 68 V6 Z" transform="translate(4 2)" fill="#fff" stroke="#111" strokeWidth="3.4" strokeLinejoin="round" />
    <path d="M38 46 V64 M46 50 V66 M54 54 V68" stroke="#111" strokeWidth="2.6" strokeLinecap="round" transform="translate(-4 4)" />
  </svg>
);
/** I 形文字光标（中心 = 定位点），rot 度，h 高度；带落在地上的暗影（dx, dy） */
export const IBeam: React.FC<{x: number; y: number; h: number; rot?: number; opacity?: number; shadow?: [number, number]}> = ({x, y, h, rot = 0, opacity = 1, shadow}) => {
  const w = h * 0.36;
  const path = `M${-w / 2} ${-h / 2} Q0 ${-h / 2 + h * 0.06} 0 ${-h / 2 + h * 0.12} Q0 ${-h / 2 + h * 0.06} ${w / 2} ${-h / 2} M0 ${-h / 2 + h * 0.12} V${h / 2 - h * 0.12} M${-w / 2} ${h / 2} Q0 ${h / 2 - h * 0.06} 0 ${h / 2 - h * 0.12} Q0 ${h / 2 - h * 0.06} ${w / 2} ${h / 2} M${-w * 0.28} 0 H${w * 0.28}`;
  const one = (dx: number, dy: number, col: string, sw: number, blur: number, op: number) => (
    <svg style={{position: 'absolute', left: x + dx - h, top: y + dy - h, opacity: op, filter: blur ? `blur(${blur}px)` : undefined}} width={h * 2} height={h * 2} viewBox={`${-h} ${-h} ${h * 2} ${h * 2}`}>
      <path d={path} transform={`rotate(${rot})`} fill="none" stroke={col} strokeWidth={sw} strokeLinecap="round" />
    </svg>
  );
  return (<>{shadow && one(shadow[0], shadow[1], '#000', h * 0.07, h * 0.03, 0.35 * opacity)}{one(0, 0, '#111', h * 0.085, 0, opacity)}{one(0, 0, '#fff', h * 0.05, 0, opacity)}</>);
};

// ── 玻璃垃圾桶（w = 桶口宽；children 画在桶里，会被桶身半透明盖住）──
export const Trash: React.FC<{w: number; children?: React.ReactNode}> = ({w, children}) => {
  const h = w * 1.06, rim = w * 0.11;
  return (
    <div style={{position: 'relative', width: w, height: h}}>
      <div style={{position: 'absolute', left: 0, top: -h * 0.6, width: w, height: h * 0.6 + rim * 0.6, overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: 0, top: h * 0.6, width: w}}>{children}</div>
      </div>
      <div style={{position: 'absolute', left: w * 0.04, top: rim * 0.5, width: w * 0.92, height: h - rim * 0.5, clipPath: 'polygon(0 0,100% 0,94% 100%,6% 100%)', borderRadius: `0 0 ${w * 0.1}px ${w * 0.1}px`, overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: -w * 0.04, top: -rim * 0.5, width: w}}>{children}</div>
        <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(44,44,48,0.9), rgba(58,58,62,0.84) 30%, rgba(46,46,50,0.86) 62%, rgba(30,30,33,0.92))'}} />
        <div style={{position: 'absolute', left: '10%', top: '5%', width: '22%', height: '85%', background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.06), rgba(255,255,255,0))'}} />
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: '12%', background: 'linear-gradient(180deg, rgba(255,255,255,0), rgba(255,255,255,0.08))'}} />
      </div>
      <div style={{position: 'absolute', left: 0, top: 0, width: w, height: rim, borderRadius: rim / 2, border: `${Math.max(2, w * 0.016)}px solid rgba(205,205,210,0.8)`, boxSizing: 'border-box', background: 'rgba(30,30,32,0.35)'}} />
    </div>
  );
};
