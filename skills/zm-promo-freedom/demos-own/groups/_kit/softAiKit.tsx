// 软光 AI 风零件（039 NotebookLM 整条共用，2026-11-18 第27批）
// 米白底 + 一团蓝光 + 一团粉紫光（慢慢漂）+ 底部粉色雾；白色圆角图标砖 / 白色圆形图标；输入框；光标
import React from 'react';
import {smoothKf} from './smoothKey';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {FONT} from '../../../assets/lib/helpers/polish';

export const SANS = `"PingFang SC", "Noto Sans CJK SC", "Noto Sans SC", ${FONT.sans}`;
export const INK = '#2a2830';
export const PAPER = '#efebe7';
export const PURPLE = '#a94be8';
export const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
export const mix = (a: number, b: number, k: number) => a + (b - a) * k;
export const eo = (u: number) => 1 - Math.pow(1 - clamp(u), 3);
export const eio = (u: number) => { const x = clamp(u); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
export const back = (u: number, k = 1.7) => { const x = clamp(u) - 1; return 1 + (k + 1) * x * x * x + k * x * x; };
/** 关键帧插值：K = [[t, v], ...]，线性；ease 可选（每段内） */
export const kf = (t: number, K: number[][], ease: (u: number) => number = (u) => u) => { if (K.length > 2 && K.every((k, j) => j === 0 || k[0] > K[j - 1][0])) return smoothKf(t, K);
  if (t <= K[0][0]) return K[0][1];
  for (let i = 0; i < K.length - 1; i++) if (t <= K[i + 1][0]) return mix(K[i][1], K[i + 1][1], ease((t - K[i][0]) / (K[i + 1][0] - K[i][0])));
  return K[K.length - 1][1];
};
export const rs = (s: number, a: number, d: number, e: (u: number) => number = eo) => e(clamp((s - a) / d));

export const brand = (k: string) => staticFile(`library/brands/${k}/app-icon_1024.png`);

// 背景：两团光的位置 / 大小按关键帧给（单位 = 画面 %）
export type Blob = {x: number; y: number; r: number; c: string; a?: number};
export const SoftBg: React.FC<{blue: Blob; pink: Blob; haze?: number; paper?: string}> = ({blue, pink, haze = 1, paper = PAPER}) => (
  <AbsoluteFill style={{background: paper, overflow: 'hidden'}}>
    <AbsoluteFill style={{background: `radial-gradient(circle at ${blue.x}% ${blue.y}%, ${blue.c} 0%, rgba(160,200,255,0) ${blue.r}%)`, opacity: blue.a ?? 1}} />
    <AbsoluteFill style={{background: `radial-gradient(ellipse ${pink.r * 1.3}% ${pink.r}% at ${pink.x}% ${pink.y}%, ${pink.c} 0%, rgba(220,140,240,0) 100%)`, opacity: pink.a ?? 1}} />
    {haze > 0 && <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 360, background: 'linear-gradient(180deg, rgba(240,210,246,0) 0%, rgba(238,206,246,0.75) 55%, rgba(236,200,246,0.95) 100%)', opacity: haze}} />}
  </AbsoluteFill>
);

// 白色圆角图标砖（行内）
export const Tile: React.FC<{k: string; size: number; glow?: number; style?: React.CSSProperties}> = ({k, size, glow = 0, style}) => (
  <div style={{width: size, height: size, borderRadius: size * 0.26, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none',
    boxShadow: `0 ${size * 0.06}px ${size * 0.18}px rgba(90,70,140,0.16), 0 0 0 ${Math.max(1, size * 0.02)}px rgba(200,190,240,${0.5 + glow * 0.4})${glow > 0 ? `, 0 0 ${size * 0.4}px rgba(170,150,255,${0.45 * glow})` : ''}`, ...style}}>
    <Img src={brand(k)} style={{width: size * 0.62, height: size * 0.62, borderRadius: size * 0.14}} />
  </div>
);
// 白色圆形图标（环绕 / 嵌在字里）
export const Disc: React.FC<{k: string; size: number; style?: React.CSSProperties}> = ({k, size, style}) => (
  <div style={{width: size, height: size, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none',
    boxShadow: `0 ${size * 0.08}px ${size * 0.25}px rgba(120,80,170,0.18), 0 0 ${size * 0.3}px rgba(255,255,255,0.9)`, ...style}}>
    <Img src={brand(k)} style={{width: size * 0.56, height: size * 0.56, borderRadius: size * 0.13}} />
  </div>
);

// 鼠标箭头（深色，白描边）
export const Arrow: React.FC<{x: number; y: number; s?: number; o?: number; press?: number}> = ({x, y, s = 1, o = 1, press = 0}) => (
  <svg width={46 * s} height={54 * s} viewBox="0 0 22 26" style={{position: 'absolute', left: x, top: y, opacity: o, transform: `scale(${1 - press * 0.15})`, transformOrigin: '0 0', filter: 'drop-shadow(0 3px 5px rgba(0,0,0,0.25))', overflow: 'visible'}}>
    <path d="M2 2 L2 20 L7 15.5 L10.5 23 L13.5 21.6 L10 14.3 L17 14 Z" fill="#1d1c22" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" />
  </svg>
);

// 白色胶囊输入框
export const InputPill: React.FC<{w: number; h: number; text: React.ReactNode; model?: string; caret?: boolean; send?: number; style?: React.CSSProperties}> = ({w, h, text, model = '快速', caret, send = 0, style}) => {
  const fs = h * 0.26;
  return (
    <div style={{position: 'absolute', width: w, height: h, borderRadius: h / 2, background: '#fff', fontFamily: SANS, boxShadow: '0 12px 40px rgba(150,110,200,0.14), 0 0 0 8px rgba(255,255,255,0.45), 0 2px 6px rgba(80,60,120,0.06)', display: 'flex', alignItems: 'center', boxSizing: 'border-box', padding: `0 ${h * 0.22}px 0 ${h * 0.34}px`, ...style}}>
      <span style={{fontSize: fs * 1.3, color: INK, marginRight: h * 0.14, lineHeight: 1}}>+</span>
      <div style={{flex: 1, fontSize: fs, color: INK, whiteSpace: 'nowrap', overflow: 'hidden', display: 'flex', alignItems: 'center'}}>
        {text}{caret && <span style={{display: 'inline-block', width: Math.max(1.5, fs * 0.07), height: fs * 1.15, background: INK, marginLeft: 2}} />}
      </div>
      <span style={{fontSize: fs * 0.95, color: INK, marginRight: h * 0.2, whiteSpace: 'nowrap'}}>{model} <span style={{fontSize: fs * 0.7}}>⌄</span></span>
      <svg width={fs * 1.1} height={fs * 1.1} viewBox="0 0 24 24" style={{marginRight: h * 0.18}}><path d="M12 3a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V6a3 3 0 0 1 3-3zM5 11a7 7 0 0 0 14 0M12 18v3" fill="none" stroke={INK} strokeWidth="1.8" strokeLinecap="round" /></svg>
      <div style={{width: h * 0.5, height: h * 0.5, borderRadius: '50%', background: '#16151a', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${1 - send * 0.12})`, flex: 'none'}}>
        <svg width={h * 0.26} height={h * 0.26} viewBox="0 0 24 24"><path d="M12 19V5M5 12l7-7 7 7" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </div>
    </div>
  );
};
