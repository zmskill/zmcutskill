// 简历风格（styles/resume/STYLE.md）的外壳和零件。竖屏 1080×1920。换片子不改这里，改 setup.ts、subs.json 和自己的段落文件。
// 锁死：纸色 + 藏青表格线 + 帽子橙强调；人只有 满屏 / 照片格 / 附件角 三种，整幅等比缩放；换栏目是翻页。
import React from 'react';
import {AbsoluteFill, Img, OffthreadVideo, continueRender, delayRender, staticFile, useCurrentFrame} from 'remotion';
import {EASE, mix, ramp} from '../../../shot-library/kit/polish';
import {fontCss} from '../_style-desk/fonts';
import SUBS_ from './subs.json';
import CHARS_ from './subs_chars.json';
import {VIDEO, EXTRA} from './setup';

export {EASE, mix};
export const SUBS = SUBS_ as [number, number, string][];
const CHARS = CHARS_ as number[][];
export {VIDEO};

export const P = {
  paper: '#F4F0E6', paper2: '#EAE4D6', navy: '#26325C', ink: '#1E2A4F', orange: '#E0763A', orangeSoft: 'rgba(224,118,58,0.16)',
  grey: '#cfc8b8', grey2: '#b9b2a2', line: 'rgba(38,50,92,0.85)', thin: 'rgba(38,50,92,0.35)',
  serif: '"Noto Serif CJK SC", "Noto Serif SC", serif', sans: '"Noto Sans CJK SC", "Noto Sans SC", sans-serif',
  hand: '"WenKaiB", serif', num: '"Fraunces", "Noto Serif CJK SC", serif',
};

// 说到哪个字（全片秒）：W('攒下来')，W('实习', 34) = 34 秒以后第一次出现的"实习"
export const W = (s: string, after = 0, k = 0): number => {
  const i = SUBS.findIndex((x) => x[0] >= after - 0.01 && x[2].includes(s));
  if (i < 0) throw new Error('字幕里没有：' + s);
  const l = SUBS[i], j = l[2].indexOf(s) + k, ct = CHARS[i];
  return ct && ct.length === l[2].length ? ct[j] : l[0] + (l[1] - l[0]) * (j / l[2].length);
};
export const c01 = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
export const mk = (t0: number, f: number) => ({f, t0, t: t0 + f / 30, R: (at: number, dur: number, e: (x: number) => number = EASE.snappy) => ramp(f, (at - t0) * 30, dur, e)});
export type Ctx = ReturnType<typeof mk>;
const nz = (i: number) => { const x = Math.sin(i * 91.7 + 3.1) * 43758.5453; return x - Math.floor(x); };
// 出现 → 消失 的可见度：入 dIn 帧、出 dOut 帧
export const life = (c: Ctx, a: number, b = 1e9, dIn = 10, dOut = 8) => ({p: c.R(a, dIn, EASE.snappy), q: c.R(b, dOut, EASE.exit), on: c.t >= a - 0.001 && c.t < b + dOut / 30});
export const shadow = (k = 1) => `0 ${6 * k}px ${18 * k}px rgba(38,50,92,${0.16 + 0.04 * k}), 0 ${1.5 * k}px ${4 * k}px rgba(38,50,92,0.14)`;

// ── 字体 ──
const Fonts: React.FC = () => {
  const [h] = React.useState(() => delayRender('fonts'));
  React.useState(() => {
    const st = document.createElement('style'); st.textContent = fontCss(); document.head.appendChild(st);
    const T = SUBS.map((s) => s[2]).join('') + EXTRA + '个人履历表姓名照片适合谁想说的现在附件工作经历时间单位岗位练出来的本事技能已处理示例内容均为虚构0123456789';
    Promise.all([document.fonts.load('700 60px WenKaiB', T), document.fonts.load('900 100px "Noto Serif CJK SC"', T), document.fonts.load('700 60px "Noto Serif CJK SC"', T), document.fonts.load('700 60px "Noto Sans CJK SC"', T), document.fonts.load('900 100px Fraunces', '0123456789%')])
      .then(() => continueRender(h)).catch(() => continueRender(h));
    return 0;
  });
  return null;
};

// ── 纸 ──
export const PaperBg: React.FC<{p?: number}> = ({p = 1}) => (
  <AbsoluteFill style={{transform: `translateY(${(1 - p) * 260}px)`}}>
    <AbsoluteFill style={{background: `radial-gradient(ellipse 120% 80% at 30% 10%, #f9f6ef 0%, ${P.paper} 55%, ${P.paper2} 100%)`}} />
    <AbsoluteFill style={{opacity: 0.55, backgroundImage: 'radial-gradient(rgba(38,50,92,0.05) 1.2px, transparent 1.3px)', backgroundSize: '14px 14px'}} />
  </AbsoluteFill>
);

// ── 字幕：表格里的一格 ──
const Subtitle: React.FC<{t: number}> = ({t}) => {
  const s = SUBS.find((x) => t >= x[0] - 0.02 && t < x[1] + 0.04);
  if (!s) return null;
  const n = s[2].length, fs = n > 15 ? 46 : n > 12 ? 50 : 54;
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: 1650, display: 'flex', justifyContent: 'center', zIndex: 300}}>
      <div style={{padding: '12px 30px 14px', background: 'rgba(255,253,248,0.96)', border: `3px solid ${P.navy}`, boxShadow: `6px 6px 0 rgba(38,50,92,0.18)`, fontFamily: P.sans, fontWeight: 700, fontSize: fs, color: P.navy, letterSpacing: '0.03em', whiteSpace: 'nowrap'}}>{s[2]}</div>
    </div>
  );
};

// ── 人：满屏 / 照片格 / 附件角。只做整幅等比缩放 ──
export type PState = 'full' | 'photo' | 'corner';
export const PHOTO = {x: 712, y: 282, w: 296};   // 照片格里面（高 = w*16/9 ≈ 526）
const RECT: Record<PState, {x: number; y: number; w: number}> = {full: {x: 0, y: 0, w: 1080}, photo: PHOTO, corner: {x: 812, y: 92, w: 212}};
export const personState = (c: Ctx, keys: [number, PState][]) => {
  let cur = RECT[keys[0][1]], prev = cur, full = keys[0][1] === 'full' ? 1 : 0, corner = keys[0][1] === 'corner' ? 1 : 0;
  for (const [t, k] of keys.slice(1)) {
    const p = c.R(t, 20, EASE.smooth);
    if (p > 0) {
      const n = RECT[k];
      cur = {x: mix(prev.x, n.x, p), y: mix(prev.y, n.y, p), w: mix(prev.w, n.w, p)};
      full = mix(full, k === 'full' ? 1 : 0, p); corner = mix(corner, k === 'corner' ? 1 : 0, p);
      prev = n;
    }
  }
  return {r: cur, full, corner};
};
export const Person: React.FC<{c: Ctx; keys: [number, PState][]}> = ({c, keys}) => {
  const {r, full, corner} = personState(c, keys);
  const h = (r.w * 16) / 9, b = 10 * corner, frame = 1 - full;
  return (
    <div style={{position: 'absolute', left: r.x - b, top: r.y - b, width: r.w + 2 * b, height: h + 2 * b, background: '#fffdf8', boxShadow: frame > 0.02 ? shadow(0.6 + corner) : 'none', transform: `rotate(${corner * 2.5}deg)`}}>
      <div style={{position: 'absolute', left: b, top: b, width: r.w, height: h, overflow: 'hidden', background: '#000'}}>
        <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, transformOrigin: '0 0', transform: `scale(${r.w / 1080})`}}>
          {VIDEO ? <OffthreadVideo src={staticFile(VIDEO)} startFrom={Math.round(c.t0 * 30)} muted style={{width: 1080, height: 1920}} /> : <Placeholder />}
        </div>
      </div>
      {corner > 0.05 && <Clip x={r.w / 2 + b - 22} y={-34} s={0.9} o={corner} />}
    </div>
  );
};

// 没有口播视频时（示例）：灰色人形占位，和真人一样整幅缩放
const Placeholder: React.FC = () => (
  <AbsoluteFill style={{background: 'linear-gradient(180deg, #d9d6cf 0%, #c8c4bb 100%)'}}>
    <svg width={1080} height={1920} style={{position: 'absolute'}}>
      <circle cx={540} cy={640} r={230} fill="#a9a59c" />
      <path d="M90 1920 Q90 1060 540 1040 Q990 1060 990 1920 Z" fill="#a9a59c" />
    </svg>
    <div style={{position: 'absolute', left: 0, right: 0, top: 160, textAlign: 'center', fontFamily: P.sans, fontWeight: 700, fontSize: 64, color: '#8d897f'}}>口播画面</div>
  </AbsoluteFill>
);

// ── 外壳：纸 → 表（under）→ 人 → 浮在上面的（over）→ 字幕 ──
export const Shell: React.FC<{t0: number; keys: [number, PState][]; under?: (c: Ctx) => React.ReactNode; over?: (c: Ctx) => React.ReactNode; paperAlways?: boolean}> = ({t0, keys, under, over}) => {
  const f = useCurrentFrame(), c = mk(t0, f);
  const {full} = personState(c, keys);
  return (
    <AbsoluteFill style={{background: P.paper, overflow: 'hidden'}}>
      <Fonts />
      {full < 0.999 && <PaperBg p={1 - full} />}
      <AbsoluteFill style={{zIndex: 0}}>{full < 0.999 && under && under(c)}</AbsoluteFill>
      <AbsoluteFill style={{zIndex: 1}}><Person c={c} keys={keys} /></AbsoluteFill>
      <AbsoluteFill style={{zIndex: 2}}>{over && over(c)}</AbsoluteFill>
      <Subtitle t={c.t} />
    </AbsoluteFill>
  );
};

// ── 回形针 ──
export const Clip: React.FC<{x: number; y: number; s?: number; o?: number; rot?: number}> = ({x, y, s = 1, o = 1, rot = 8}) => (
  <svg style={{position: 'absolute', left: x, top: y, overflow: 'visible', opacity: o, transform: `rotate(${rot}deg) scale(${s})`, filter: 'drop-shadow(1px 2px 1.5px rgba(38,50,92,0.35))'}} width={44} height={110}>
    <path d="M30 18 L30 84 Q30 102 16 102 Q2 102 2 84 L2 14 Q2 2 13 2 Q24 2 24 14 L24 76 Q24 84 16 84 Q9 84 9 76 L9 24" fill="none" stroke="#8a93a8" strokeWidth={4.5} strokeLinecap="round" />
  </svg>
);

// ── 章：橙色，双框，砸下来 ──
export const Stamp: React.FC<{c: Ctx; at: number; out?: number; x: number; y: number; text: string; size?: number; rot?: number; col?: string; sub?: string}> = ({c, at, out = 1e9, x, y, text, size = 96, rot = -12, col = P.orange, sub}) => {
  const p = c.R(at, 7, EASE.snappy), q = c.R(out, 8, EASE.exit);
  if (c.t < at || q >= 1) return null;
  const sc = mix(1.9, 1, p), blur = (1 - p) * 6, shake = p < 1 && p > 0.6 ? 0 : 0;
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${sc})`, opacity: c01(p * 1.6) * (1 - q) * 0.92, filter: `blur(${blur}px)`, mixBlendMode: 'multiply', marginLeft: shake}}>
      <div style={{border: `${size * 0.07}px solid ${col}`, padding: size * 0.06, borderRadius: size * 0.1}}>
        <div style={{border: `${size * 0.03}px solid ${col}`, borderRadius: size * 0.06, padding: `${size * 0.1}px ${size * 0.28}px ${size * 0.14}px`, fontFamily: P.serif, fontWeight: 900, fontSize: size, lineHeight: 1, color: col, letterSpacing: '0.08em', whiteSpace: 'nowrap', textAlign: 'center',
          WebkitMaskImage: 'radial-gradient(circle at 30% 40%, #000 55%, rgba(0,0,0,0.78) 70%, #000 85%)'}}>
          {text}{sub && <div style={{fontSize: size * 0.28, letterSpacing: '0.2em', marginTop: size * 0.08}}>{sub}</div>}
        </div>
      </div>
    </div>
  );
};

// ── 手写：文楷一笔写出来（从左往右露出）──
export const Hand: React.FC<{c: Ctx; at: number; out?: number; x: number; y: number; text: string; size?: number; col?: string; dur?: number; rot?: number; weight?: number}> = ({c, at, out = 1e9, x, y, text, size = 60, col = P.ink, dur, rot = 0}) => {
  const d = dur ?? Math.max(8, text.length * 2.6), p = c.R(at, d, EASE.linear), q = c.R(out, 8, EASE.exit);
  if (c.t < at || q >= 1) return null;
  return <div style={{position: 'absolute', left: x, top: y, transform: `rotate(${rot}deg)`, fontFamily: P.hand, fontWeight: 700, fontSize: size, lineHeight: 1.15, color: col, whiteSpace: 'nowrap', clipPath: `inset(-30% ${(1 - p) * 100}% -30% -2%)`, opacity: 1 - q}}>{text}</div>;
};
// ── 印刷字（表头、栏目名）：由虚到实 ──
export const Print: React.FC<{c: Ctx; at: number; x: number; y: number; text: string; size?: number; col?: string; weight?: number; ls?: string; font?: string; out?: number}> = ({c, at, x, y, text, size = 40, col = P.navy, weight = 700, ls = '0.04em', font = P.serif, out = 1e9}) => {
  const p = c.R(at, 12, EASE.out), q = c.R(out, 8, EASE.exit);
  if (c.t < at || q >= 1) return null;
  return <div style={{position: 'absolute', left: x, top: y, fontFamily: font, fontWeight: weight, fontSize: size, lineHeight: 1, color: col, letterSpacing: ls, whiteSpace: 'nowrap', opacity: p * (1 - q), filter: `blur(${(1 - p) * 8}px)`}}>{text}</div>;
};
// ── 灰条（口播没说的地方，不编字）──
export const Bar: React.FC<{x: number; y: number; w: number; h?: number; o?: number}> = ({x, y, w, h = 16, o = 1}) => <div style={{position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: h / 2, background: P.grey, opacity: o}} />;

// ── 马克笔圈 / 下划线 / 勾 / 叉（坐标是屏幕坐标）──
export const Ring: React.FC<{x: number; y: number; w: number; h: number; p: number; col?: string; sw?: number; seed?: number}> = ({x, y, w, h, p, col = P.orange, sw = 9, seed = 1}) => {
  if (p <= 0) return null;
  const rx = w / 2 + 12, ry = h / 2 + 12, n = 60, a0 = -2.3 + nz(seed) * 0.3, span = Math.PI * 2 * 1.08;
  let d = '';
  for (let i = 0; i <= n; i++) { const a = a0 + span * (i / n), k = 1 + 0.03 * Math.sin(i * 0.8 + seed) + 0.05 * (i / n); d += `${i ? 'L' : 'M'}${(rx * k * Math.cos(a)).toFixed(1)},${(ry * k * Math.sin(a)).toFixed(1)} `; }
  return <svg style={{position: 'absolute', left: x + w / 2, top: y + h / 2, overflow: 'visible'}} width={1} height={1}><path d={d} fill="none" stroke={col} strokeWidth={sw} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - c01(p)} style={{mixBlendMode: 'multiply'}} /></svg>;
};
export const Underline: React.FC<{x: number; y: number; w: number; p: number; col?: string; sw?: number}> = ({x, y, w, p, col = P.orange, sw = 9}) => p <= 0 ? null : (
  <svg style={{position: 'absolute', left: x, top: y - 12, overflow: 'visible'}} width={w} height={24}><path d={`M0 14 Q ${w * 0.3} 6 ${w * 0.55} 12 T ${w} 9`} fill="none" stroke={col} strokeWidth={sw} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - c01(p)} style={{mixBlendMode: 'multiply'}} /></svg>
);
export const Tick: React.FC<{x: number; y: number; s: number; p: number; col?: string; sw?: number}> = ({x, y, s, p, col = P.orange, sw}) => p <= 0 ? null : (
  <svg style={{position: 'absolute', left: x, top: y, overflow: 'visible'}} width={s} height={s}><path d={`M${s * 0.12} ${s * 0.52} L${s * 0.4} ${s * 0.8} L${s * 0.92} ${s * 0.12}`} fill="none" stroke={col} strokeWidth={sw ?? s * 0.14} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - c01(p)} /></svg>
);
// 勾选框：点一下（框一缩）→ 橙勾写出 → 一圈光（借 bookmark-tap-check 的因果顺序，按这里的样子重做）
export const CheckBox: React.FC<{c: Ctx; at: number; x: number; y: number; s?: number; label?: string; show?: number; size?: number}> = ({c, at, x, y, s = 54, label, show = -1e9, size = 50}) => {
  const vis = c.R(show, 10, EASE.out);
  if (vis <= 0) return null;
  const press = c.t >= at && c.t < at + 2 / 30 ? 0.92 : 1, tick = c.R(at + 2 / 30, 7, EASE.out), ring = c.R(at + 2 / 30, 12, EASE.out);
  return (
    <div style={{position: 'absolute', left: x, top: y, opacity: vis}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: s, height: s, border: `4px solid ${P.navy}`, borderRadius: 6, transform: `scale(${press})`, background: tick > 0 ? P.orangeSoft : 'transparent'}} />
      {ring > 0 && ring < 1 && <div style={{position: 'absolute', left: s / 2, top: s / 2, width: s * (1 + ring * 1.4), height: s * (1 + ring * 1.4), transform: 'translate(-50%,-50%)', borderRadius: '50%', border: `3px solid ${P.orange}`, opacity: 1 - ring}} />}
      <Tick x={-s * 0.05} y={-s * 0.25} s={s * 1.15} p={tick} />
      {label && <div style={{position: 'absolute', left: s + 18, top: (s - size) / 2 - 2, fontFamily: P.hand, fontWeight: 700, fontSize: size, color: P.ink, whiteSpace: 'nowrap'}}>{label}</div>}
    </div>
  );
};

// ── 截图卡（附件）：白边 + 回形针；pops 把截图上的一块原样拿起来放大，其余退淡（不压暗，退成纸色）──
export type Pop = {at: number; out?: number; box: [number, number, number, number]; k?: number; dy?: number};
export const ImgCard: React.FC<{c: Ctx; src: string; iw: number; ih: number; x: number; y: number; w: number; inAt: number; outAt?: number; rot?: number; pops?: Pop[]; from?: 'bottom' | 'right'; children?: (s: number, ox: number, oy: number) => React.ReactNode; push?: {at: number; k: number; cx: number; cy: number}}> = ({c, src, iw, ih, x, y, w, inAt, outAt = 1e9, rot = 0, pops = [], from = 'bottom', children, push}) => {
  const p = c.R(inAt, 16, EASE.snappy), q = c.R(outAt, 12, EASE.exit);
  if (c.t < inAt || q >= 1) return null;
  const s = w / iw, h = ih * s, pad = 14;
  const dx = from === 'right' ? (1 - p) * 900 : 0, dy = from === 'bottom' ? (1 - p) * 1300 : 0;
  const pk = push ? 1 + (push.k - 1) * c.R(push.at, 26, EASE.smooth) : 1;
  const active = pops.filter((o) => c.t >= o.at && c.t < (o.out ?? 1e9) + 0.3);
  const dim = Math.max(0, ...pops.map((o) => c.R(o.at, 8, EASE.out) * (1 - c.R(o.out ?? 1e9, 8, EASE.out))));
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, transform: `translate(${dx}px, ${dy + q * 1300}px)`, opacity: c01(p * 2)}}>
      <div style={{position: 'absolute', left: x, top: y, transformOrigin: push ? `${push.cx * s}px ${push.cy * s}px` : '50% 50%', transform: `rotate(${rot}deg) scale(${pk})`}}>
        <div style={{position: 'absolute', left: -pad, top: -pad, width: w + 2 * pad, height: h + 2 * pad, background: '#fffdf8', boxShadow: shadow(1.4)}} />
        <Img src={staticFile(src)} style={{position: 'absolute', left: 0, top: 0, width: w, height: h}} />
        <div style={{position: 'absolute', left: 0, top: 0, width: w, height: h, background: P.paper, opacity: dim * 0.62}} />
        {active.map((o, i) => {
          const a = c.R(o.at, 9, EASE.overshoot), b = c.R(o.out ?? 1e9, 8, EASE.exit), k = mix(1, o.k ?? 1.12, a), [bx, by, bw, bh] = o.box;
          return (
            <div key={i} style={{position: 'absolute', left: bx * s, top: by * s, width: bw * s, height: bh * s, overflow: 'hidden', transform: `translateY(${-(o.dy ?? 10) * a}px) scale(${k})`, boxShadow: a > 0 ? shadow(1.2 * a) : 'none', borderRadius: 18 * s * 1.2, opacity: 1 - b, zIndex: 5}}>
              <Img src={staticFile(src)} style={{position: 'absolute', left: -bx * s, top: -by * s, width: w, height: h}} />
            </div>
          );
        })}
        {children && children(s, 0, 0)}
        <Clip x={w * 0.5 - 20} y={-62} s={1.1} />
      </div>
    </div>
  );
};

// ── 一张表格单据（"小豆邀请码"之类）──
export const Slip: React.FC<{title: string; w: number; h: number; rows?: number}> = ({title, w, h, rows = 3}) => (
  <div style={{position: 'absolute', left: -w / 2, top: -h / 2, width: w, height: h, background: '#fffdf8', border: `3px solid ${P.navy}`, boxShadow: shadow(1.2)}}>
    <div style={{height: h * 0.34, borderBottom: `3px solid ${P.navy}`, display: 'flex', alignItems: 'center', paddingLeft: 30, fontFamily: P.serif, fontWeight: 900, fontSize: h * 0.17, color: P.navy, letterSpacing: '0.06em'}}>{title}</div>
    {Array.from({length: rows}).map((_, i) => (
      <div key={i} style={{position: 'absolute', left: 0, right: 0, top: h * 0.34 + ((h * 0.66) / rows) * i, height: (h * 0.66) / rows, borderBottom: i < rows - 1 ? `1.5px solid ${P.thin}` : 'none'}}>
        <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: w * 0.26, borderRight: `1.5px solid ${P.thin}`}} />
        <Bar x={24} y={((h * 0.66) / rows) / 2 - 7} w={w * 0.16} h={14} />
        <Bar x={w * 0.26 + 26} y={((h * 0.66) / rows) / 2 - 7} w={w * (0.3 + 0.12 * ((i * 7) % 3))} h={14} />
      </div>
    ))}
  </div>
);

// 表格的线：从左往右画出来
export const HLine: React.FC<{c: Ctx; at: number; x: number; y: number; w: number; t?: number; col?: string; out?: number}> = ({c, at, x, y, w, t = 2, col = P.line, out = 1e9}) => {
  const p = c.R(at, 12, EASE.out), q = c.R(out, 8, EASE.exit);
  if (p <= 0 || q >= 1) return null;
  return <div style={{position: 'absolute', left: x, top: y - t / 2, width: w * p, height: t, background: col, opacity: 1 - q}} />;
};
export const VLine: React.FC<{c: Ctx; at: number; x: number; y: number; h: number; t?: number; col?: string; out?: number}> = ({c, at, x, y, h, t = 2, col = P.line, out = 1e9}) => {
  const p = c.R(at, 12, EASE.out), q = c.R(out, 8, EASE.exit);
  if (p <= 0 || q >= 1) return null;
  return <div style={{position: 'absolute', left: x - t / 2, top: y, width: t, height: h * p, background: col, opacity: 1 - q}} />;
};
