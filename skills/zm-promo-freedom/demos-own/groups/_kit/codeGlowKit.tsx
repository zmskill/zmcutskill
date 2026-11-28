// 暗青底 + 绿色霓虹代码风零件（036 码匣整条共用，2026-11-18 第29批）
import React from 'react';
import {smoothKf} from './smoothKey';
import {AbsoluteFill} from 'remotion';

export const MONO = '"JetBrains Mono","SF Mono","Fira Code",Menlo,monospace';
export const SANS = '"Inter","PingFang SC","Noto Sans CJK SC","Noto Sans SC",sans-serif';
export const GREEN = '#43f08a';
export const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
export const mix = (a: number, b: number, k: number) => a + (b - a) * k;
export const eo = (u: number) => 1 - Math.pow(1 - clamp(u), 3);
export const eio = (u: number) => { const x = clamp(u); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
export const hash = (n: number) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
export const kf = (t: number, K: number[][], e: (u: number) => number = eio) => { if (K.length > 2 && K.every((k, j) => j === 0 || k[0] > K[j - 1][0])) return smoothKf(t, K); if (t <= K[0][0]) return K[0][1]; for (let i = 0; i < K.length - 1; i++) if (t <= K[i + 1][0]) return mix(K[i][1], K[i + 1][1], e((t - K[i][0]) / (K[i + 1][0] - K[i][0]))); return K[K.length - 1][1]; };

/** 暗青渐变底：中间偏右上一团青光 */
export const TealBg: React.FC<{gx?: number; gy?: number; glow?: number}> = ({gx = 62, gy = 30, glow = 1}) => (
  <AbsoluteFill style={{background: '#040b0b'}}>
    <AbsoluteFill style={{background: `radial-gradient(ellipse 60% 70% at ${gx}% ${gy}%, rgba(22,96,96,${0.85 * glow}) 0%, rgba(8,40,42,${0.6 * glow}) 45%, rgba(4,11,11,0) 100%)`}} />
  </AbsoluteFill>
);
/** 自己画的产品图标：方框里一对花括号（虚构产品「码匣」） */
export const BoxLogo: React.FC<{size: number; color?: string; stroke?: number}> = ({size, color = '#fff', stroke = 2.2}) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path d="M4 7.5 L12 3 L20 7.5 V16.5 L12 21 L4 16.5 Z" fill="none" stroke={color} strokeWidth={stroke} strokeLinejoin="round" />
    <path d="M10.2 9 C9 9 9 9.6 9 10.6 C9 11.6 8.6 12 8 12 C8.6 12 9 12.4 9 13.4 C9 14.4 9 15 10.2 15 M13.8 9 C15 9 15 9.6 15 10.6 C15 11.6 15.4 12 16 12 C15.4 12 15 12.4 15 13.4 C15 14.4 15 15 13.8 15" fill="none" stroke={color} strokeWidth={stroke * 0.7} strokeLinecap="round" />
  </svg>
);
/** 绿色霓虹四角星（玻璃描边） */
export const NeonStar: React.FC<{size: number; rot?: number; o?: number; blur?: number}> = ({size, rot = 0, o = 1, blur = 0}) => {
  // 2026-11-19 原片的星星是有厚度的玻璃霓虹（在 3D 里翻转，侧面看得到厚度，边缘一圈亮绿辉光），不是一张平的线稿
  const P = "M0 -11 C1.2 -3 3 -1.2 11 0 C3 1.2 1.2 3 0 11 C-1.2 3 -3 1.2 -11 0 C-3 -1.2 -1.2 -3 0 -11 Z";
  const ry = Math.sin((rot * Math.PI) / 180) * 55, rx = Math.cos((rot * Math.PI) / 137) * 35;
  return (
    <div style={{width: size, height: size, opacity: o, transform: `perspective(${size * 4}px) rotateY(${ry}deg) rotateX(${rx}deg) rotate(${rot * 0.4}deg)`, filter: `${blur ? `blur(${blur}px) ` : ''}drop-shadow(0 0 ${size * 0.03}px rgba(200,255,225,0.9)) drop-shadow(0 0 ${size * 0.1}px rgba(67,240,138,0.75)) drop-shadow(0 0 ${size * 0.25}px rgba(40,200,110,0.35))`}}>
      <svg width={size} height={size} viewBox="-12 -12 24 24" style={{overflow: 'visible'}}>
        {[3, 2, 1].map((k) => <path key={k} d={P} transform={`translate(${k * 0.45} ${k * 0.45})`} fill="rgba(10,60,40,0.55)" stroke="rgba(40,170,100,0.7)" strokeWidth={0.7} strokeLinejoin="round" />)}
        <path d={P} fill="rgba(40,150,100,0.28)" stroke="#7dffc0" strokeWidth={1.3} strokeLinejoin="round" />
        <path d="M0 -7 C0.8 -2 2 -0.8 7 0 C2 0.8 0.8 2 0 7 C-0.8 2 -2 0.8 -7 0 C-2 -0.8 -0.8 -2 0 -7 Z" fill="none" stroke="rgba(200,255,225,0.6)" strokeWidth={0.5} />
      </svg>
    </div>
  );
};
/** 深色玻璃输入条 */
export const GlassPill: React.FC<{w: number; h: number; text: React.ReactNode; send?: number}> = ({w, h, text, send = 0}) => {
  const fs = h * 0.36;
  return (
    <div style={{width: w, height: h, borderRadius: h / 2, background: 'linear-gradient(180deg, rgba(34,40,40,0.92), rgba(16,20,20,0.95))', boxShadow: '0 0 0 1.5px rgba(255,255,255,0.08), inset 0 1px 0 rgba(255,255,255,0.08), 0 12px 40px rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', padding: `0 ${h * 0.12}px 0 ${h * 0.3}px`, boxSizing: 'border-box', fontFamily: SANS}}>
      <svg width={fs * 1.1} height={fs * 1.1} viewBox="0 0 24 24" style={{flex: 'none'}}><path d="M16 7 L8.5 14.5 a2.5 2.5 0 0 0 3.5 3.5 L19 11 a4.5 4.5 0 0 0-6.4-6.4 L5.5 11.7 a6.5 6.5 0 0 0 9.2 9.2 L19 16.6" fill="none" stroke="#d8dede" strokeWidth={1.7} strokeLinecap="round" /></svg>
      <div style={{flex: 1, marginLeft: h * 0.2, fontSize: fs, color: '#e9eeee', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center'}}>{text}</div>
      <svg width={fs} height={fs} viewBox="0 0 24 24" style={{marginRight: h * 0.25}}><path d="M6 9l6 6 6-6" fill="none" stroke="#d8dede" strokeWidth={2} strokeLinecap="round" /></svg>
      <div style={{width: h * 0.68, height: h * 0.68, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${1 - send * 0.1})`, flex: 'none'}}>
        <svg width={h * 0.32} height={h * 0.32} viewBox="0 0 24 24"><path d="M12 19V5M6 11l6-6 6 6" fill="none" stroke="#111" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" /></svg>
      </div>
    </div>
  );
};
/** 漂浮的代码关键词场：camZ 越大越往前飞；fade 整体透明 */
const WORDS = ['const', 'function', 'import', 'return', 'await', 'async', 'try', 'for', 'if', 'export', 'class', '{', ';', '}', 'function', 'return', 'import', 'await'];
export const CodeField: React.FC<{camZ: number; fade?: number; focus?: number; n?: number; stars?: boolean; panX?: number; panY?: number; roll?: number; t?: number; sizeK?: number; dim?: boolean}> = ({camZ, fade = 1, focus = 3, n = 62, stars = true, panX = 0, panY = 0, roll = 0, t, sizeK = 1, dim = false}) => {
  // 2026-11-21 逐帧跟踪原片（特征点 + RANSAC）：镜头几乎不往前推（缩放≈1），而是整片字一路往下漂（3.6s 漂了约 950px）、同时顺时针转约 20°；之前做成了往前猛推 6 倍。
  // panX/panY 是对焦那一层的位移，近的层按视差走得更快；roll 绕画面中心转。字本身在 3D 里有各自的倾斜（原片看得到斜体一样的透视）
  // 2026-11-19 原片的字铺满整个画面（近的大而糊、远的小），不是挤在中间一团：按「屏幕上均匀」来撒，远处的字不再全缩到中心
  const items = Array.from({length: n}, (_, i) => { const z = 1.0 + hash(i * 7.1) * 4.6; return {w: WORDS[i % WORDS.length], x: (hash(i) - 0.5) * 4400 * z / 1.6, y: (hash(i * 3.3) - 0.5) * 2600 * z / 1.6, z, star: stars && (i === 5 || i === 37 || i === 61)}; }); // 2026-11-19 原片同时只看得到一两颗大星，不是满屏都是星
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}><AbsoluteFill style={{transform: `rotate(${roll}deg) scale(${1 + Math.abs(roll) / 220})`, transformOrigin: '960px 540px'}}>
      {items.map((it, i) => {
        let z = it.z - camZ; while (z < 0.4) z += 4.6; // 飞过去的再从远处补上
        const f = 1.6 / z, par = focus / z;
        const wrap = (v: number, lo: number, span: number) => lo + ((((v - lo) % span) + span) % span);
        const x = wrap(960 + it.x * f * 0.5 + panX * par, -500, 2920), y = wrap(540 + it.y * f * 0.5 + panY * par, -400, 1880);
        if (x < -400 || x > 2320 || y < -200 || y > 1280) return null;
        const blur = z < 1.5 ? Math.min(16, (1.5 - z) * 14) : Math.min(8, Math.max(0, Math.abs(z - focus) - 0.8) * 1.6); // 中间一大层是清楚的；贴近镜头的字糊得厉害、远处稍糊
        const o = (dim ? clamp(1.3 - z / 4.6) : clamp(1.4 - z / 12)) * fade * clamp((z - 0.4) / 0.6);
        if (o <= 0.02) return null;
        if (it.star) return <div key={i} style={{position: 'absolute', left: x, top: y, transform: 'translate(-50%,-50%)'}}><NeonStar size={150 * f * 1.4 * (t !== undefined ? 1.9 : 1)} rot={(i * 37 + (t !== undefined ? t * 70 : camZ * 40)) % 360} o={o} blur={blur * 0.6} /></div>;
        const ty = (hash(i * 5.7) - 0.5) * 70, tx = (hash(i * 9.1) - 0.5) * 40; /* 每个字自己的 3D 朝向 */
        return <div key={i} style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) perspective(900px) rotateY(${ty}deg) rotateX(${tx}deg)`, fontFamily: MONO, fontWeight: 700, fontSize: 68 * f * 1.4 * sizeK, color: z < 2.4 ? '#d6ffc9' : z < 6 ? '#86ff6e' : '#3cc95c', /* 原片是偏黄的荧光绿、更亮 */ opacity: o, filter: `blur(${blur}px)`, textShadow: '0 0 4px rgba(200,255,220,0.6), 0 0 14px rgba(67,240,138,0.6), 0 0 34px rgba(40,200,110,0.3)', whiteSpace: 'nowrap'}}>{it.w}</div>;
      })}
    </AbsoluteFill></AbsoluteFill>
  );
};
