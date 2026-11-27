// 书桌风格（styles/desk）的外壳和零件。来源：一条竖屏口播原片的代码，只把写死的内容换成从 content.ts 读。
// 不要在这里写片子的内容；内容全在 content.ts。颜色字体在本文件的 D 和 styles/desk/values.ts。
import React from 'react';
import {AbsoluteFill, Img, OffthreadVideo, continueRender, delayRender, staticFile, useCurrentFrame} from 'remotion';
import {EASE, mix, ramp} from '../../../shot-library/kit/polish';
import {useStyleValues} from '../../../styles/current';
import {DESK} from '../../../styles/desk/values';
import {fontCss} from './fonts';

export {EASE, mix};
// ── 这条片子的设置（content.ts 开头调用 configure）──
export const CFG = {video: '', subs: [] as [number, number, string][], chars: [] as number[][], extraText: ''};
export const configure = (c: Partial<typeof CFG>) => { Object.assign(CFG, c); };
// 图片地址：public 里的路径用 staticFile；data: / http(s): 开头的原样用（示例片用代码画的假截图，不用放素材）
export const srcOf = (s: string) => (/^(data:|https?:)/.test(s) ? s : staticFile(s));
// 说到哪个字（全片秒），用听写的逐字时间：w('几百')、w('押金', 53) 表示 53 秒以后第一次出现的"押金"
export const w = (s: string, after = 0): number => {
  const L = CFG.subs, i = L.findIndex((x) => x[0] >= after - 0.01 && x[2].includes(s));
  if (i < 0) throw new Error('字幕里没有：' + s);
  const l = L[i], k = l[2].indexOf(s), ct = CFG.chars[i];
  return ct && ct.length === l[2].length ? ct[k] : l[0] + (l[1] - l[0]) * (k / l[2].length);
};

export const D = {
  desk: '#efe5d6', desk2: '#e6d8c4', ink: '#2b211b', ink2: '#6f5d50', red: '#d9502e', butter: 'rgba(255,214,102,0.62)', paper: '#fffdf8',
  serif: '"Noto Serif CJK SC", "Noto Serif SC", serif',
  sans: '"Noto Sans CJK SC", "Noto Sans SC", sans-serif',
  hand: '"WenKaiB", serif',
  num: '"Fraunces", "Noto Serif CJK SC", serif',
};
export const c01 = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
export const mk = (t0: number, f: number) => ({f, t: t0 + f / 30, F: (t: number) => (t - t0) * 30, R: (at: number, dur: number, e: (x: number) => number = EASE.snappy) => ramp(f, (at - t0) * 30, dur, e)});
export type Ctx = ReturnType<typeof mk>;
const nz = (i: number) => { const x = Math.sin(i * 91.7 + 3.1) * 43758.5453; return x - Math.floor(x); };
// 桌上东西的影子：光从左上来
export const deskShadow = (lift = 1) => `${18 * lift}px ${26 * lift}px ${44 * lift}px rgba(74,48,26,${0.22 + 0.06 * lift}), ${4 * lift}px ${6 * lift}px ${10 * lift}px rgba(74,48,26,0.18)`;

// ── 物件：位置是物件中心（世界坐标），图片坐标换算到世界坐标用 at() ──
export type Obj = {x: number; y: number; w: number; iw: number; ih: number; rot: number; kind: 'phone' | 'print'};
export const sOf = (o: Obj) => o.w / o.iw;
export const hOf = (o: Obj) => o.ih * sOf(o);
export const at = (o: Obj, ix: number, iy: number): [number, number] => {
  const s = sOf(o), dx = (ix - o.iw / 2) * s, dy = (iy - o.ih / 2) * s, r = (o.rot * Math.PI) / 180;
  return [o.x + dx * Math.cos(r) - dy * Math.sin(r), o.y + dx * Math.sin(r) + dy * Math.cos(r)];
};

// ── 镜头：关键帧 [秒, 中心x, 中心y, 倍数, 旋转]，两帧之间 smooth 缓动 ──

// ── 手机 ──
export const Phone: React.FC<{o: Obj; children: React.ReactNode; lift?: number}> = ({o, children, lift = 1}) => {
  const h = hOf(o), b = Math.round(o.w * 0.035), R = o.w * 0.12;
  return (
    <div style={{position: 'absolute', left: o.x - o.w / 2 - b, top: o.y - h / 2 - b, width: o.w + 2 * b, height: h + 2 * b, borderRadius: R + b, background: 'linear-gradient(145deg, #3a332e, #161210 60%)', transform: `rotate(${o.rot}deg)`, boxShadow: `${deskShadow(lift)}, inset 0 0 0 2px rgba(255,255,255,0.08)`}}>
      <div style={{position: 'absolute', left: b, top: b, width: o.w, height: h, borderRadius: R, overflow: 'hidden', background: '#000'}}>
        {children}
        <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(125deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 35%)', pointerEvents: 'none'}} />
      </div>
    </div>
  );
};
// ── 冲印出来的截图：白边、一点弧度的影子、胶带 ──
export const Print: React.FC<{o: Obj; src: string; lift?: number; tape?: boolean}> = ({o, src, lift = 1, tape = true}) => {
  const h = hOf(o), pad = Math.round(o.w * 0.035);
  return (
    <div style={{position: 'absolute', left: o.x - o.w / 2 - pad, top: o.y - h / 2 - pad, width: o.w + 2 * pad, height: h + 2 * pad, background: D.paper, borderRadius: 6, transform: `rotate(${o.rot}deg)`, boxShadow: deskShadow(lift)}}>
      <Img src={srcOf(src)} style={{position: 'absolute', left: pad, top: pad, width: o.w, height: h}} />
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(160deg, rgba(255,255,255,0.18), rgba(255,255,255,0) 40%, rgba(80,50,20,0.05))'}} />
      {tape && <div style={{position: 'absolute', left: o.w / 2 - 70, top: -24, width: 160, height: 52, background: 'rgba(240,226,190,0.82)', transform: 'rotate(-4deg)', boxShadow: '0 2px 4px rgba(80,50,20,0.12)'}} />}
    </div>
  );
};
export const ScreenImg: React.FC<{src: string; o: Obj}> = ({src, o}) => <Img src={srcOf(src)} style={{position: 'absolute', left: 0, top: 0, width: o.w, height: hOf(o)}} />;

// ── 马克笔圈（世界坐标，中心 + 宽高）──
export const Ring: React.FC<{x: number; y: number; w: number; h: number; p: number; rot?: number; col?: string; sw?: number; seed?: number}> = ({x, y, w, h, p, rot = 0, col = D.red, sw = 8, seed = 1}) => {
  if (p <= 0) return null;
  const rx = w / 2 + 10, ry = h / 2 + 10, n = 56, a0 = -2.3 + nz(seed) * 0.3, span = Math.PI * 2 * 1.1;
  let d = '';
  for (let i = 0; i <= n; i++) { const a = a0 + span * (i / n), k = 1 + 0.035 * Math.sin(i * 0.8 + seed) + 0.06 * (i / n); d += `${i ? 'L' : 'M'}${(rx * k * Math.cos(a)).toFixed(1)},${(ry * k * Math.sin(a)).toFixed(1)} `; }
  return (
    <svg style={{position: 'absolute', left: x, top: y, overflow: 'visible', transform: `rotate(${rot}deg)`}} width={1} height={1}>
      <path d={d} fill="none" stroke={col} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - c01(p)} opacity={0.9} style={{mixBlendMode: 'multiply'}} />
    </svg>
  );
};
// ── 荧光笔：压在一行字上，从左刷到右（世界坐标左上角）──
export const Highlight: React.FC<{x: number; y: number; w: number; h: number; p: number; rot?: number}> = ({x, y, w, h, p, rot = 0}) => p <= 0 ? null : (
  <div style={{position: 'absolute', left: x, top: y, width: w, height: h, background: D.butter, mixBlendMode: 'multiply', borderRadius: 4, transformOrigin: '0 50%', transform: `rotate(${rot}deg) scaleX(${c01(p)})`}} />
);

// ── 印在桌上的标题：宋体粗，从左往右"印"出来 ──
export const Headline: React.FC<{c: Ctx; at: number; out?: number; x: number; y: number; text: string; size: number; col?: string; rot?: number; font?: string; weight?: number; italic?: boolean; outline?: boolean}> = ({c, at: t, out = 1e9, x, y, text, size, col = D.ink, rot = 0, font = D.serif, weight = 900, italic, outline}) => {
  const p = c.R(t, 14, EASE.out), q = c.R(out, 10, EASE.exit);
  if (p <= 0 || q >= 1) return null;
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `rotate(${rot}deg) translateY(${(1 - p) * 26}px)`, opacity: c01(p * 1.4) * (1 - q), clipPath: `inset(-20% ${(1 - p) * 100}% -20% -5%)`, whiteSpace: 'nowrap',
      fontFamily: font, fontWeight: weight, fontStyle: italic ? 'italic' : 'normal', fontSize: size, lineHeight: 1, letterSpacing: '0.02em', color: outline ? 'transparent' : col, WebkitTextStroke: outline ? `${size / 40}px ${col}` : undefined, mixBlendMode: 'multiply'}}>{text}</div>
  );
};
// ── 便签：文楷手写 ──
export const Note: React.FC<{c: Ctx; at: number; out?: number; x: number; y: number; text: string; size?: number; bg?: string; rot?: number; w?: number}> = ({c, at: t, out = 1e9, x, y, text, size = 64, bg = '#fbe7a6', rot = -3, w}) => {
  const p = c.R(t, 14, EASE.overshoot), q = c.R(out, 9, EASE.exit);
  if (p <= 0 || q >= 1) return null;
  return (
    <div style={{position: 'absolute', left: x, top: y, padding: `${size * 0.42}px ${size * 0.5}px ${size * 0.5}px`, width: w, background: bg, borderRadius: 4, boxShadow: deskShadow(0.8),
      transform: `rotate(${rot + (1 - p) * 8}deg) scale(${0.85 + 0.15 * p}) translateY(${(1 - p) * 40}px)`, opacity: c01(p * 2) * (1 - q), fontFamily: D.hand, fontWeight: 700, fontSize: size, color: D.ink, lineHeight: 1.25, whiteSpace: 'pre'}}>
      {text}
    </div>
  );
};

const Fonts: React.FC = () => {
  const [h] = React.useState(() => delayRender('fonts'));
  React.useState(() => {
    const st = document.createElement('style'); st.textContent = fontCss(); document.head.appendChild(st);
    const FONT_TEXT = CFG.subs.map((s) => s[2]).join('') + CFG.extraText;
    Promise.all([document.fonts.load('700 60px WenKaiB', FONT_TEXT), document.fonts.load('900 100px "Noto Serif CJK SC"', FONT_TEXT), document.fonts.load('700 60px "Noto Sans CJK SC"', FONT_TEXT), document.fonts.load('italic 900 100px Fraunces', '0123456789.¥'), document.fonts.load('900 100px Fraunces', '0123456789.¥')])
      .then(() => continueRender(h)).catch(() => continueRender(h));
    return 0;
  });
  return null;
};
const DeskBg: React.FC<{t: number}> = ({t}) => (
  <>
    <AbsoluteFill style={{background: `radial-gradient(ellipse 90% 60% at 28% 18%, #fbf4e8 0%, ${D.desk} 50%, ${D.desk2} 100%)`}} />
    <AbsoluteFill style={{opacity: 0.5, backgroundImage: 'radial-gradient(rgba(110,80,50,0.08) 1.4px, transparent 1.5px)', backgroundSize: '18px 18px'}} />
    <div style={{position: 'absolute', left: -900, top: -900, width: 2900, height: 3700, transform: `rotate(-28deg) translateX(${Math.sin(t * 0.2) * 24}px)`, filter: 'blur(28px)', mixBlendMode: 'multiply',
      background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0) 0 180px, rgba(96,64,36,0.13) 200px 310px, rgba(0,0,0,0) 330px 350px)'}} />
    <AbsoluteFill style={{background: 'radial-gradient(ellipse 85% 70% at 50% 45%, rgba(0,0,0,0) 62%, rgba(70,42,20,0.18) 100%)'}} />
  </>
);
const Subtitle: React.FC<{t: number}> = ({t}) => {
  const s = CFG.subs.find((x) => t >= x[0] - 0.02 && t < x[1] + 0.04);
  if (!s) return null;
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: 1660, display: 'flex', justifyContent: 'center', zIndex: 300}}>
      <div style={{padding: '14px 34px 16px', borderRadius: 20, background: 'rgba(255,251,244,0.92)', boxShadow: '0 8px 28px rgba(74,48,26,0.16)', fontFamily: D.sans, fontWeight: 700, fontSize: s[2].length > 13 ? 50 : 54, color: D.ink, letterSpacing: '0.02em'}}>{s[2]}</div>
    </div>
  );
};
export const XShell: React.FC<{t0: number; children: (c: Ctx) => React.ReactNode}> = ({t0, children}) => {
  useStyleValues(DESK);
  const f = useCurrentFrame(), c = mk(t0, f);
  return (
    <AbsoluteFill style={{background: D.desk, overflow: 'hidden'}}>
      <Fonts />
      <DeskBg t={c.t} />
      {children(c)}
      <Subtitle t={c.t} />
    </AbsoluteFill>
  );
};

// ── 换上来（从右滑进）/ 拿走（往左滑走）──
export const Layer: React.FC<{c: Ctx; inAt: number; outAt: number; from?: 'right' | 'top' | 'bottom'; children: React.ReactNode}> = ({c, inAt, outAt, from = 'right', children}) => {
  const p = c.R(inAt, 15, EASE.snappy), q = c.R(outAt, 12, EASE.swift);
  if (p <= 0 || q >= 1) return null;
  const dx = from === 'right' ? (1 - p) * 760 : 0, dy = from === 'top' ? -(1 - p) * 900 : from === 'bottom' ? (1 - p) * 1000 : 0;
  return <div style={{position: 'absolute', inset: 0, transform: `translate(${dx - q * 900}px, ${dy}px) scale(${0.96 + 0.04 * p - 0.04 * q})`, opacity: c01(p * 2.5) * (1 - c01(q * 1.6))}}>{children}</div>;
};
// ── 落下来（从上方落到桌上，略微过冲）──
export const Drop: React.FC<{c: Ctx; inAt: number; outAt: number; x: number; y: number; children: React.ReactNode; rot?: number}> = ({c, inAt, outAt, x, y, children, rot = 0}) => {
  const p = c.R(inAt, 13, EASE.overshoot), q = c.R(outAt, 12, EASE.swift);
  if (p <= 0 || q >= 1) return null;
  return <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, transformOrigin: `${x}px ${y}px`, transform: `translateY(${(1 - p) * -140}px) scale(${1.1 - 0.1 * p}) translateX(${-q * 900}px) rotate(${rot * (1 - p)}deg)`, opacity: c01(p * 2) * (1 - c01(q * 1.6))}}>{children}</div>;
};

// ── 证据跳出来：截图上说到的那几条原样拿起来放大，底下退暗 ──
export const PopOut: React.FC<{c: Ctx; o: Obj; src: string; box: [number, number, number, number]; at: number; to: [number, number]; k: number; out?: number; dim?: boolean; children?: (s: number) => React.ReactNode}> = ({c, o, src, box, at: t, to, k, out = 1e9, dim = true, children}) => {
  const p = c.R(t, 16, EASE.overshoot), q = c.R(out, 10, EASE.exit);
  if (p <= 0 || q >= 1) return null;
  const s = o.w / o.iw, [x0, y0, x1, y1] = box, w = (x1 - x0) * s, h = (y1 - y0) * s;
  const [cx, cy] = at(o, (x0 + x1) / 2, (y0 + y1) / 2), x = mix(cx, to[0], c01(p)), y = mix(cy, to[1], c01(p)), sc = mix(1, k, p), rot = mix(o.rot, -1.2, c01(p));
  return (
    <>
      {dim && <div style={{position: 'absolute', inset: -400, background: 'rgba(239,229,214,0.62)', opacity: c01(p) * (1 - q)}} />}
      <div style={{position: 'absolute', left: x - w / 2, top: y - h / 2, width: w, height: h, transform: `rotate(${rot}deg) scale(${sc})`, opacity: 1 - q, borderRadius: 10,
        boxShadow: `0 ${30 * c01(p)}px ${60 * c01(p)}px rgba(74,48,26,${0.35 * c01(p)}), 0 4px 10px rgba(74,48,26,${0.2 * c01(p)})`}}>
        <div style={{position: 'absolute', inset: 0, borderRadius: 10, overflow: 'hidden', background: '#fff'}}>
          <Img src={srcOf(src)} style={{position: 'absolute', left: -x0 * s, top: -y0 * s, width: o.iw * s, height: o.ih * s}} />
        </div>
        {children?.(s)}
      </div>
    </>
  );
};
export const Small: React.FC<{c: Ctx; at: number; out: number; x: number; y: number; text: string; size?: number; col?: string; rot?: number}> = ({c, at: t, out, x, y, text, size = 54, col = D.ink2, rot = 0}) => {
  const p = c.R(t, 12, EASE.out), q = c.R(out, 8, EASE.exit);
  return p <= 0 || q >= 1 ? null : <div style={{position: 'absolute', left: x, top: y, fontFamily: D.hand, fontWeight: 700, fontSize: size, color: col, opacity: p * (1 - q), transform: `translateY(${(1 - p) * 14}px) rotate(${rot}deg)`, whiteSpace: 'nowrap'}}>{text}</div>;
};

// ── 人在手机里：L 左边 / C 中间 / off 不在 ──
// F：几乎满屏（情绪最满的那句、高点用；960 宽，没超过原片 1080）。2026-11-27 书桌风格测试 加
const POS: Record<string, {x: number; y: number; w: number; rot: number}> = {
  B: {x: 540, y: 860, w: 700, rot: 0}, F: {x: 540, y: 880, w: 960, rot: 0}, L: {x: 300, y: 930, w: 450, rot: -2}, C: {x: 540, y: 880, w: 640, rot: 0}, R: {x: 780, y: 930, w: 450, rot: 2}, offL: {x: -420, y: 930, w: 450, rot: -2}, offR: {x: 1500, y: 930, w: 450, rot: 2},
};
// keys：[时间, 位置]。位置 B 开头大 / L 左 / C 中 / R 右 / offL offR 移出画面（整幅缩放着移过去）；
// hideL / showL：保持位置，整个往左滑出去 / 滑回来（原片段 1 的做法，比 offL 更干脆）。drift：开头那几秒慢慢推近一点。
export const Person: React.FC<{c: Ctx; keys: [number, string][]; drift?: {k: number; dur: number; until: number}}> = ({c, keys, drift}) => {
  let cur = POS[keys[0][1]], prev = cur, dx = 0, op = 1;
  for (const [t, k] of keys.slice(1)) {
    if (k === 'hideL') { const a = c.R(t, 12, EASE.swift); dx -= a * 900; op -= a * 1.6; continue; }
    if (k === 'showL') { const b = c.R(t, 16, EASE.snappy); dx += b * 900; op += b * 1.6; continue; }
    const p = c.R(t, 16, EASE.swift); if (p > 0) { const n = POS[k]; cur = {x: mix(prev.x, n.x, p), y: mix(prev.y, n.y, p), w: mix(prev.w, n.w, p), rot: mix(prev.rot, n.rot, p)}; prev = n; }
  }
  op = c01(op);
  if (cur.x < -300 || cur.x > 1400 || op <= 0) return null;
  const sc = drift && c.t < drift.until ? 1 + drift.k * c01(c.t / drift.dur) : 1;
  const h = cur.w * 1920 / 1080, b = Math.round(cur.w * 0.035), R = cur.w * 0.12;
  return (
    <div style={{position: 'absolute', inset: 0, transform: `translateX(${dx}px) scale(${sc})`, transformOrigin: '540px 860px', opacity: op}}>
      <div style={{position: 'absolute', left: cur.x - cur.w / 2 - b, top: cur.y - h / 2 - b, width: cur.w + 2 * b, height: h + 2 * b, borderRadius: R + b, background: 'linear-gradient(145deg, #3a332e, #161210 60%)', transform: `rotate(${cur.rot}deg)`, boxShadow: `${deskShadow(1.2)}, inset 0 0 0 2px rgba(255,255,255,0.08)`}}>
        <div style={{position: 'absolute', left: b, top: b, width: cur.w, height: h, borderRadius: R, overflow: 'hidden', background: '#000'}}>
          <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, transformOrigin: '0 0', transform: `scale(${cur.w / 1080})`}}>
            {CFG.video
              ? <OffthreadVideo src={staticFile(CFG.video)} startFrom={Math.round((c.t - c.f / 30) * 30)} muted style={{width: 1080, height: 1920}} />
              : <NoVideo />}
          </div>
          <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(125deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 35%)'}} />
        </div>
      </div>
    </div>
  );
};

// 还没有口播初剪时（configure 没给 video），手机里放一个灰色的人形占位
const NoVideo: React.FC = () => (
  <div style={{width: 1080, height: 1920, background: 'linear-gradient(170deg, #8d8178, #5a504a)', position: 'relative'}}>
    <div style={{position: 'absolute', left: 340, top: 520, width: 400, height: 460, borderRadius: '50%', background: 'rgba(255,255,255,0.28)'}} />
    <div style={{position: 'absolute', left: 140, top: 1050, width: 800, height: 900, borderRadius: '400px 400px 0 0', background: 'rgba(255,255,255,0.22)'}} />
    <div style={{position: 'absolute', left: 0, right: 0, top: 260, textAlign: 'center', fontFamily: D.sans, fontWeight: 700, fontSize: 64, color: 'rgba(255,255,255,0.7)'}}>口播画面</div>
  </div>
);

// ── 价签：纸价签 + 绳孔；crossed 时红笔划掉 ──
export const PriceTag: React.FC<{c: Ctx; at: number; out: number; x: number; y: number; price: string; label: string; crossAt?: number; big?: boolean; rot?: number; red?: boolean}> = ({c, at: t, out, x, y, price, label, crossAt = 1e9, big, rot = -4, red}) => {
  const p = c.R(t, 13, EASE.overshoot), q = c.R(out, 10, EASE.swift), cr = c.R(crossAt, 9, EASE.out);
  if (p <= 0 || q >= 1) return null;
  const w = big ? 520 : 380, h = big ? 285 : 210;
  return (
    <div style={{position: 'absolute', left: x - w / 2, top: y - h / 2, width: w, height: h, transform: `translateY(${(1 - p) * -160}px) rotate(${rot + (1 - p) * 10}deg) translateX(${-q * 900}px)`, opacity: c01(p * 2) * (1 - c01(q * 1.6))}}>
      <div style={{position: 'absolute', inset: 0, background: D.paper, borderRadius: '18px 18px 18px 18px', clipPath: 'polygon(14% 0, 100% 0, 100% 100%, 14% 100%, 0 50%)', boxShadow: deskShadow(0.9)}} />
      <div style={{position: 'absolute', left: w * 0.06, top: h / 2 - 11, width: 22, height: 22, borderRadius: '50%', background: D.desk2, boxShadow: 'inset 0 2px 3px rgba(0,0,0,0.25)'}} />
      <div style={{position: 'absolute', left: w * 0.2, top: h * 0.08, fontFamily: D.num, fontWeight: 900, fontStyle: 'italic', fontSize: big ? 180 : 130, color: red ? D.red : D.ink, lineHeight: 1}}>{price}</div>
      <div style={{position: 'absolute', left: w * 0.21, bottom: h * 0.09, fontFamily: D.hand, fontWeight: 700, fontSize: big ? 50 : 40, color: D.ink2}}>{label}</div>
      {cr > 0 && <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={w} height={h}><path d={`M${w * 0.16},${h * 0.62} L${w * 0.96},${h * 0.3}`} stroke={D.red} strokeWidth={10} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - cr} style={{mixBlendMode: 'multiply'}} /></svg>}
    </div>
  );
};

// ── 纸卡片（索引卡）──
export const PaperCard: React.FC<{x: number; y: number; w: number; h: number; rot?: number; children?: React.ReactNode; bg?: string; lines?: boolean}> = ({x, y, w, h, rot = 0, children, bg = D.paper, lines}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w, height: h, background: bg, borderRadius: 8, transform: `rotate(${rot}deg)`, boxShadow: deskShadow(1),
    backgroundImage: lines ? 'repeating-linear-gradient(0deg, rgba(0,0,0,0) 0 63px, rgba(120,150,190,0.22) 63px 65px)' : undefined}}>{children}</div>
);
// 小标签（手写在一块彩色纸上）
export const Chip: React.FC<{c: Ctx; at: number; text: string; x: number; y: number; bg?: string; size?: number; rot?: number; dim?: number}> = ({c, at: t, text, x, y, bg = '#fbe7a6', size = 60, rot = -2, dim = 0}) => {
  const p = c.R(t, 12, EASE.overshoot);
  if (p <= 0) return null;
  return <div style={{position: 'absolute', left: x, top: y, padding: `${size * 0.22}px ${size * 0.42}px`, background: bg, borderRadius: 8, fontFamily: D.hand, fontWeight: 700, fontSize: size, color: D.ink, whiteSpace: 'nowrap', boxShadow: '4px 6px 12px rgba(74,48,26,0.18)',
    transform: `rotate(${rot}deg) scale(${0.6 + 0.4 * p})`, transformOrigin: 'left center', opacity: c01(p * 2) * (1 - dim * 0.55)}}>{text}</div>;
};
