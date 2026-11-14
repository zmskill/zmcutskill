// 操作台的小件：按字幕找时间、打勾打叉、光标、代码面板、素材箱、弯曲轮播（眼睛耳朵是上一条片子用的，可以不用）
import React from 'react';
import {Img} from 'remotion';
import {Ctx, D, EASE, IMG, LEFT, MONO, Panel, RIGHT, c01, mix} from './Desk';
import {SUBS} from './content';

export const S = SUBS as [number, number, string][];
export const W = (s: string, after = 0) => { const l = S.find((x) => x[0] >= after - 0.01 && x[2].includes(s)); if (!l) throw new Error('字幕里没有：' + s); return l[0] + (l[1] - l[0]) * (l[2].indexOf(s) / l[2].length); };
export const chT = (lineHas: string, ch: string, n: number) => { const l = S.find((x) => x[2].includes(lineHas))!; let i = -1; for (let k = 0; k <= n; k++) i = l[2].indexOf(ch, i + 1); return l[0] + (l[1] - l[0]) * (i / l[2].length); };
export const big = (size: number, col = D.text): React.CSSProperties => ({fontSize: size, fontWeight: 900, color: col, whiteSpace: 'nowrap', lineHeight: 1.1});
export const on = (c: Ctx, a: number, b: number, d = 9) => c.R(a, d, EASE.out) * (1 - c.R(b, d, EASE.exit));
export const Tick: React.FC<{p: number; size?: number; col?: string}> = ({p, size = 30, col = D.green}) => p <= 0 ? null : (
  <span style={{width: size, height: size, borderRadius: size / 2, background: col, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none', transform: `scale(${p + 0.25 * Math.sin(Math.PI * c01(p))})`}}><svg width={size * 0.6} height={size * 0.6} viewBox="0 0 24 24"><path d="M4 12.5 L10 18 L20 6.5" fill="none" stroke="#fff" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
);
export const Cross: React.FC<{p: number; size?: number}> = ({p, size = 30}) => p <= 0 ? null : (
  <span style={{width: size, height: size, borderRadius: size / 2, background: D.red, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none', transform: `scale(${p})`}}><svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24"><path d="M5 5 L19 19 M19 5 L5 19" stroke="#fff" strokeWidth="3.6" strokeLinecap="round" /></svg></span>
);
export const Eye: React.FC<{p: number; size: number; col?: string}> = ({p, size, col = D.v}) => (
  <svg width={size} height={size * 0.6} viewBox="0 0 100 60" style={{flex: 'none'}}><g transform={`translate(0 ${30 * (1 - p)}) scale(1 ${Math.max(0.05, p)})`}><path d="M4 30 Q50 -14 96 30 Q50 74 4 30 Z" fill="none" stroke={col} strokeWidth={6} /><circle cx={50} cy={30} r={14} fill={col} /></g></svg>
);
export const Ear: React.FC<{p: number; size: number; col?: string}> = ({p, size, col = D.a2}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{flex: 'none'}}><path d="M30 40 C30 15 72 12 74 40 C76 58 58 60 58 74 C58 90 38 92 34 80" fill="none" stroke={col} strokeWidth={8} strokeLinecap="round" /><path d="M44 42 C44 32 60 32 60 42" fill="none" stroke={col} strokeWidth={7} strokeLinecap="round" />{p > 0 && <line x1={14} y1={88} x2={14 + 74 * p} y2={88 - 76 * p} stroke={D.red} strokeWidth={9} strokeLinecap="round" />}</svg>
);
export const Cursor: React.FC<{x: number; y: number; label: string; col: string; press?: number}> = ({x, y, label, col, press = 0}) => (
  <div style={{position: 'absolute', left: x, top: y, zIndex: 60, transform: `scale(${1 - 0.15 * press})`, transformOrigin: '0 0'}}>
    <svg width="34" height="40" viewBox="0 0 24 28"><path d="M2 2 L2 22 L8 17 L12 26 L16 24 L12 15.5 L20 15.5 Z" fill="#fff" stroke="#111" strokeWidth="1.6" strokeLinejoin="round" /></svg>
    <span style={{position: 'absolute', left: 26, top: 30, padding: '3px 10px', borderRadius: 6, background: col, color: '#fff', fontSize: 18, fontWeight: 800, whiteSpace: 'nowrap'}}>{label}</span>
  </div>
);

// 左边：代码面板（几行真代码，逐行打出）+ 素材 / 音乐库面板
export const CodePanel: React.FC<{c: Ctx; title: string; file: string; lines: [string, string][]; at: number; glow?: number; start?: number; children?: React.ReactNode}> = ({c, title, file, lines, at, glow = 0, start = 1, children}) => (
  <Panel r={[LEFT[0], LEFT[1], LEFT[2], 250]} title={title} right={<span style={{fontFamily: MONO}}>{file}</span>} glow={glow}>
    <div style={{position: 'absolute', left: 14, top: 12, right: 10, fontFamily: MONO, fontSize: 15.5, lineHeight: '28px'}}>
      {lines.map(([s, col], i) => { const n = Math.floor(s.length * c01((c.t - at - i * 0.16) / 0.2)); return <div key={i} style={{color: col, whiteSpace: 'pre', overflow: 'hidden'}}><span style={{color: D.faint, marginRight: 10}}>{i + start}</span>{s.slice(0, n)}{n > 0 && n < s.length ? '▍' : ''}</div>; })}
    </div>
    {children}
  </Panel>
);
export type BinItem = {img?: string; name: string; at?: number; icon?: React.ReactNode};
export const BinPanel: React.FC<{c: Ctx; title: string; items: BinItem[]; glow?: number; cols?: number; ih?: number; children?: React.ReactNode}> = ({c, title, items, glow = 0, cols = 2, ih = 56, children}) => (
  <Panel r={[LEFT[0], LEFT[1] + 262, LEFT[2], LEFT[3] - 262]} title={title} glow={glow}>
    {items.map((k, i) => {
      const used = k.at === undefined || c.t >= k.at, g = k.at !== undefined && c.t >= k.at ? Math.exp(-(c.t - k.at) * 2) : 0;
      const p = k.at !== undefined && k.at > c.t - 0.5 ? c.R(k.at, 9, EASE.overshoot) : 1;
      const w = (LEFT[2] - 24 - (cols - 1) * 10) / cols;
      return <div key={i} style={{position: 'absolute', left: 12 + (i % cols) * (w + 10), top: 10 + Math.floor(i / cols) * (ih + 7), width: w, height: ih, borderRadius: 6, overflow: 'hidden', background: D.panel2, border: `2px solid ${used ? D.v : D.line}`, boxShadow: g > 0.05 ? `0 0 ${24 * g}px ${D.v}` : undefined, transform: `scale(${(1 + 0.08 * g) * (k.at !== undefined && c.t < k.at ? 1 : p)})`, opacity: used ? 1 : 0.55, display: 'flex', alignItems: 'center', gap: 8}}>
        {k.img && <Img src={IMG(k.img)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover'}} />}
        {k.icon && <span style={{marginLeft: 10, display: 'flex'}}>{k.icon}</span>}
        <span style={{position: k.img ? 'absolute' : 'relative', left: k.img ? 5 : 0, bottom: k.img ? 3 : undefined, padding: '0 5px', borderRadius: 3, background: k.img ? 'rgba(15,17,21,0.75)' : 'transparent', fontSize: k.img ? 12 : 15, fontWeight: 700, color: D.text, whiteSpace: 'nowrap'}}>{k.name}</span>
      </div>;
    })}
    {children}
  </Panel>
);
export const NOTE = (col: string, s = 22) => <svg width={s} height={s} viewBox="0 0 24 24"><path d="M9 18 V5 L19 3 V16" fill="none" stroke={col} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" /><circle cx="6.5" cy="18" r="2.8" fill={col} /><circle cx="16.5" cy="16" r="2.8" fill={col} /></svg>;

// 弯曲轮播（镜头库 curved-carousel-reel 的做法）：一排卡贴着弯曲的墙从右往左滑，中间平、两边往里转、拖虚
export const Reel: React.FC<{c: Ctx; at: number; out: number; cards: string[]; cx: number; cy: number; cw: number; ch: number; gap?: number; speed?: number}> = ({c, at, out, cards, cx, cy, cw, ch, gap = 40, speed = 260}) => {
  const p = c.R(at, 18, EASE.out), q = c.R(out, 10, EASE.exit);
  if (p <= 0 || q >= 1) return null;
  const span = cards.length * (cw + gap), shift = (c.t - at) * speed + (1 - p) * -900;
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, perspective: 1400, opacity: c01(p * 2) * (1 - q), zIndex: 42}}>
      {Array.from({length: cards.length * 2}, (_, i) => {
        let x = ((i * (cw + gap) - shift) % (span * 2) + span * 2) % (span * 2) - span + cw / 2;
        const d = x / 900, ry = -Math.max(-1, Math.min(1, d)) * 38, z = -Math.abs(d) * 260, bl = Math.max(0, Math.abs(d) - 0.55) * 8;
        return <div key={i} style={{position: 'absolute', left: cx + x - cw / 2, top: cy - ch / 2, width: cw, height: ch, borderRadius: 16, overflow: 'hidden', transform: `translateZ(${z}px) rotateY(${ry}deg)`, filter: bl > 0 ? `blur(${bl}px)` : undefined, boxShadow: '0 20px 50px rgba(0,0,0,0.55)', border: `2px solid ${D.line}`}}><Img src={IMG(cards[i % cards.length])} style={{width: '100%', height: '100%', objectFit: 'cover'}} /></div>;
      })}
    </div>
  );
};
export {Panel, RIGHT, LEFT, mix, c01, EASE, D, IMG, MONO};
