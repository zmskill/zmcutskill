// "笔记本"风格（styles/notebook）的外壳和零件。每一段只写内容；外壳（背景、人物缩放、章节标签、字幕）和常用小件都在这里。
// 来源：一条 7 分钟口播的全片，整理成可换内容的零件。
// 换一条片子要改的：Shell 的 video（口播初剪在 public 里的路径）、R_WIN（人物缩成窗时的位置）。颜色字体在 styles/notebook/values.ts，不在这里改。
import React from 'react';
import {AbsoluteFill, Img, OffthreadVideo, staticFile, useCurrentFrame} from 'remotion';
import {EASE, Grain, mix, ramp, softShadow} from '../../../shot-library/kit/polish';

export {EASE, mix};
// 笔记本的值从风格卡来（styles/notebook/values.ts）。这套样子不要改成别的颜色；要别的样子就用别的风格。
import {NOTEBOOK_BG, NOTEBOOK as P} from '../../../styles/notebook/values';
import {useStyleValues} from '../../../styles/current';
export const LK = {...NOTEBOOK_BG, surface: P.surface, ink: P.ink, ink2: P.ink2, ink3: P.ink3, accent: P.accent, hi: P.hi, blue: P.blue, red: P.red, shadow: P.shadow, line: P.line};
export const c01 = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
export const rnd = (i: number) => { const x = Math.sin(i * 61.37 + 9.13) * 43758.5453; return x - Math.floor(x); };
export const SANS = P.font;
export const cardBg = P.cardBg;
export const cardShadow = (e = 14, s = 0.5) => `inset 0 1px 0 #fff, ${softShadow(e, {color: LK.shadow, strength: s})}`;
export const GREEN = P.green;
export const TINT = P.tints;
export type Rect = [number, number, number, number];
export const R_FULL: Rect = [0, 0, 1920, 1080], R_WIN: Rect = [56, 212, 1040, 585], R_MINI: Rect = [56, 640, 480, 270]; // R_MINI：演示录屏时人缩到左下角
export const lerpR = (a: Rect, b: Rect, p: number): Rect => [mix(a[0], b[0], p), mix(a[1], b[1], p), mix(a[2], b[2], p), mix(a[3], b[3], p)];
export const SX = 1130, SY = 168; // 右边舞台的左上角（740 × 660）

// 一段里的时间工具：t 全片时间；R(at, dur) 从全片第 at 秒开始、dur 帧走完的进度
export const mk = (t0: number, f: number) => ({f, t: t0 + f / 30, F: (t: number) => (t - t0) * 30, R: (at: number, dur: number, e: (x: number) => number = EASE.snappy) => ramp(f, (at - t0) * 30, dur, e)});
export type Ctx = ReturnType<typeof mk>;

// ── 小图标 ──
const IC: Record<string, (c: string) => React.ReactNode> = (() => {
  const P = (c: string) => ({fill: 'none', stroke: c, strokeWidth: 2.2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const});
  return {
    video: (c) => <><rect x="3" y="5" width="18" height="14" rx="3" {...P(c)} /><path d="M10 9 L15 12 L10 15 Z" fill={c} /></>,
    image: (c) => <><rect x="3" y="4" width="18" height="16" rx="3" {...P(c)} /><circle cx="9" cy="10" r="1.8" fill={c} /><path d="M5 18 L11 13 L14 15.5 L17 12.5 L21 16" {...P(c)} /></>,
    pen: (c) => <><path d="M5 19 L6 15 L16 5 L19 8 L9 18 Z" {...P(c)} /><path d="M13 21 H20" {...P(c)} /></>,
    cart: (c) => <><path d="M3 5 H6 L8.5 15 H18 L20 8 H7.2" {...P(c)} /><circle cx="10" cy="19" r="1.5" fill={c} /><circle cx="17" cy="19" r="1.5" fill={c} /></>,
    mic: (c) => <><rect x="9" y="3" width="6" height="11" rx="3" {...P(c)} /><path d="M6 11 a6 6 0 0 0 12 0 M12 17 V21" {...P(c)} /></>,
    code: (c) => <path d="M9 8 L5 12 L9 16 M15 8 L19 12 L15 16 M13 6 L11 18" {...P(c)} />,
    chat: (c) => <><path d="M4 6 h16 v10 h-9 l-4 4 v-4 h-3 z" {...P(c)} /><path d="M8 11 h8" {...P(c)} /></>,
    laptop: (c) => <><rect x="5" y="5" width="14" height="10" rx="1.5" {...P(c)} /><path d="M2.5 19 H21.5 L19.5 15 H4.5 Z" {...P(c)} /></>,
    cloud: (c) => <path d="M7 18 a4 4 0 0 1 -0.5 -8 a5.5 5.5 0 0 1 10.6 -1.2 a4.6 4.6 0 0 1 0.4 9.2 Z" {...P(c)} />,
    search: (c) => <><circle cx="11" cy="11" r="6" {...P(c)} /><path d="M16 16 L20.5 20.5" {...P(c)} /></>,
    heart: (c) => <path d="M12 20 C4 14 3 9.5 6 7 C8.5 5 11 6.5 12 8.5 C13 6.5 15.5 5 18 7 C21 9.5 20 14 12 20 Z" {...P(c)} />,
    coin: (c) => <><circle cx="12" cy="12" r="8.5" {...P(c)} /><path d="M9 9 L12 12.5 L15 9 M12 12.5 V17 M9.5 13 H14.5 M9.5 15.5 H14.5" {...P(c)} /></>,
    book: (c) => <><path d="M4 5 C7 4 10 4.5 12 6 C14 4.5 17 4 20 5 V19 C17 18 14 18.5 12 20 C10 18.5 7 18 4 19 Z M12 6 V20" {...P(c)} /></>,
    moon: (c) => <path d="M19 14.5 A8 8 0 1 1 10 4.5 A6.5 6.5 0 0 0 19 14.5 Z" {...P(c)} />,
    star: (c) => <path d="M12 3.5 L14.6 9 L20.5 9.7 L16.1 13.8 L17.3 19.7 L12 16.8 L6.7 19.7 L7.9 13.8 L3.5 9.7 L9.4 9 Z" {...P(c)} />,
    mail: (c) => <><rect x="3" y="5.5" width="18" height="13" rx="2.5" {...P(c)} /><path d="M4 7.5 L12 13 L20 7.5" {...P(c)} /></>,
    user: (c) => <><circle cx="12" cy="8.5" r="3.8" {...P(c)} /><path d="M4.5 20 a7.5 7.5 0 0 1 15 0" {...P(c)} /></>,
    bot: (c) => <><rect x="5" y="8" width="14" height="11" rx="3" {...P(c)} /><path d="M12 8 V4.5 M9 13 V14.5 M15 13 V14.5" {...P(c)} /><circle cx="12" cy="3.8" r="1" fill={c} /></>,
    bookmark: (c) => <path d="M6 3.5 h12 v17 l-6 -4.6 l-6 4.6 z" {...P(c)} />,
    flag: (c) => <><path d="M6 3 V21" {...P(c)} /><path d="M6 4 L19 8.5 L6 13 Z" fill={c} /></>,
    box: (c) => <><path d="M3.5 8 L12 4 L20.5 8 V16.5 L12 20.5 L3.5 16.5 Z M3.5 8 L12 12 L20.5 8 M12 12 V20.5" {...P(c)} /></>,
    brief: (c) => <><rect x="3.5" y="7.5" width="17" height="12" rx="2.5" {...P(c)} /><path d="M9 7.5 V5 H15 V7.5 M3.5 13 H20.5" {...P(c)} /></>,
    loop: (c) => <path d="M5 12 a7 7 0 0 1 12 -5 M19 4 V8 H15 M19 12 a7 7 0 0 1 -12 5 M5 20 V16 H9" {...P(c)} />,
    clock: (c) => <><circle cx="12" cy="12" r="8.5" {...P(c)} /><path d="M12 7 V12 L15.5 14" {...P(c)} /></>,
  };
})();
export const Ico: React.FC<{n: string; size: number; color?: string}> = ({n, size, color = LK.ink}) => <svg width={size} height={size} viewBox="0 0 24 24" style={{flex: 'none'}}>{(IC[n] ?? IC.star)(color)}</svg>;
export const GLY = ['video', 'image', 'pen', 'cart', 'mic', 'code', 'chat'];

// ── 通用小件 ──
// 一张白卡：p 进场（0→1），q 出场（0→1）；from 是进场时偏离的方向
export const Card: React.FC<{x: number; y: number; w: number; h: number; p: number; q?: number; from?: [number, number]; rot?: number; r?: number; ring?: string; style?: React.CSSProperties; children?: React.ReactNode}> = ({x, y, w, h, p, q = 0, from = [0, 50], rot = 0, r = 24, ring, style, children}) => {
  if (p <= 0 || q >= 1) return null;
  return (
    <div style={{position: 'absolute', left: x + (1 - p) * from[0] + q * from[0] * 1.2, top: y + (1 - p) * from[1] + q * from[1] * 1.2, width: w, height: h, borderRadius: r, overflow: 'hidden', background: cardBg, boxShadow: `${ring ? `0 0 0 5px ${ring}, ` : ''}${cardShadow(16, 0.55)}`, border: '1px solid rgba(255,255,255,0.9)', boxSizing: 'border-box', opacity: c01(p * 2) * (1 - q), filter: p < 1 ? `blur(${(1 - p) * 9}px)` : undefined, transform: rot ? `rotate(${rot}deg)` : undefined, ...style}}>{children}</div>
  );
};
// 一张截图卡：src 是 public 里的路径；整张图按宽铺满，oy 是往上滚了多少（像素，按原图宽 = 卡宽算）
export const Shot: React.FC<{src: string; x: number; y: number; w: number; h: number; p: number; q?: number; oy?: number; ox?: number; zoom?: number; from?: [number, number]; rot?: number; ring?: string; children?: React.ReactNode}> = ({src, oy = 0, ox = 0, zoom = 1, children, ...r}) => (
  <Card {...r} style={{background: '#fff'}}>
    <Img src={staticFile(src)} style={{position: 'absolute', left: -ox, top: -oy, width: r.w * zoom, maxWidth: 'none'}} />
    {children}
  </Card>
);
// 手画的圈
export const Ring: React.FC<{x: number; y: number; w: number; h: number; p: number; col?: string; sw?: number}> = ({x, y, w, h, p, col = LK.accent, sw = 6}) => p <= 0 ? null : (
  <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{position: 'absolute', left: x, top: y, overflow: 'visible'}}><ellipse cx={w / 2} cy={h / 2} rx={w / 2 - 4} ry={h / 2 - 4} fill="none" stroke={col} strokeWidth={sw} strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - p} transform={`rotate(-5 ${w / 2} ${h / 2})`} /></svg>
);
// 聊天气泡
export const Bubble: React.FC<{x: number; y: number; text: React.ReactNode; p: number; q?: number; me?: boolean; col?: string; size?: number; dim?: number}> = ({x, y, text, p, q = 0, me, col, size = 34, dim = 0}) => p <= 0 || q >= 1 ? null : (
  <div style={{position: 'absolute', left: x, top: y, padding: `${size * 0.36}px ${size * 0.66}px`, borderRadius: size * 0.7, borderBottomLeftRadius: me ? size * 0.7 : 6, borderBottomRightRadius: me ? 6 : size * 0.7, background: col ?? (me ? '#ffe9d9' : '#fff'), boxShadow: cardShadow(8, 0.45), fontSize: size, fontWeight: 700, color: LK.ink, whiteSpace: 'nowrap', opacity: c01(p * 2) * (1 - q) * (1 - 0.55 * dim), transform: `scale(${0.6 + 0.4 * p}) translateY(${(1 - p) * 16}px)`, transformOrigin: me ? '100% 100%' : '0 100%', filter: dim > 0 ? `saturate(${1 - dim})` : undefined}}>{text}</div>
);
export const Check: React.FC<{p: number; size?: number; col?: string}> = ({p, size = 40, col = LK.accent}) => (
  <div style={{width: size, height: size, borderRadius: '50%', flex: 'none', boxSizing: 'border-box', border: `3px solid ${p > 0.05 ? col : 'rgba(40,30,20,0.22)'}`, background: p > 0.05 ? col : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${1 + 0.25 * Math.sin(Math.PI * c01(p))})`}}>
    <svg width={size * 0.56} height={size * 0.56} viewBox="0 0 24 24"><path d="M4 12.5 L10 18 L20 6.5" fill="none" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="26" strokeDashoffset={26 * (1 - c01(p))} /></svg>
  </div>
);
// 弹一下出现的块（盖章、数字）
export const Pop: React.FC<{c: Ctx; at: number; style?: React.CSSProperties; hard?: boolean; children: React.ReactNode}> = ({c, at, style, hard, children}) => {
  const p = c.R(at, 11, EASE.overshoot), k = c.f - c.F(at);
  if (p <= 0) return null;
  return <div style={{display: 'inline-block', opacity: c01(p * 3), transform: `scale(${hard ? 1 + 0.8 * Math.exp(-Math.max(0, k) / 2.3) : 0.5 + 0.5 * p})`, ...style}}>{children}</div>;
};
// 一行淡入上移的字
export const Rise: React.FC<{c: Ctx; at: number; style?: React.CSSProperties; children: React.ReactNode; dy?: number}> = ({c, at, style, children, dy = 22}) => {
  const p = c.R(at, 12);
  return <div style={{opacity: c01(p * 2), transform: `translateY(${(1 - p) * dy}px)`, filter: p < 1 && p > 0 ? `blur(${(1 - p) * 6}px)` : undefined, ...style}}>{children}</div>;
};
// 胶囊标签
export const Pill: React.FC<{text: React.ReactNode; col?: string; size?: number; solid?: boolean; style?: React.CSSProperties}> = ({text, col = LK.accent, size = 30, solid, style}) => (
  <span style={{display: 'inline-flex', alignItems: 'center', gap: size * 0.35, padding: `${size * 0.22}px ${size * 0.6}px`, borderRadius: 999, background: solid ? col : 'rgba(255,253,249,0.96)', color: solid ? '#fff' : LK.ink, boxShadow: cardShadow(7, 0.42), fontSize: size, fontWeight: 800, whiteSpace: 'nowrap', ...style}}>{!solid && <span style={{width: size * 0.4, height: size * 0.4, borderRadius: '50%', background: col}} />}{text}</span>
);
// 人物满屏时两侧的卡
export const Side: React.FC<{x: number; y: number; w: number; h: number; ry: number; rz?: number; p: number; q?: number; from: number; children: React.ReactNode; bg?: string}> = ({x, y, w, h, ry, rz = 0, p, q = 0, from, children, bg}) => {
  if (p <= 0 || q >= 1) return null;
  return (
    <div style={{position: 'absolute', left: x + (1 - p) * from + q * from, top: y, width: w, height: h, perspective: 1600, opacity: c01(p * 2) * (1 - q * q), filter: p < 1 ? `blur(${(1 - p) * 10}px)` : undefined, zIndex: 40}}>
      <div style={{position: 'absolute', inset: 0, borderRadius: 24, overflow: 'hidden', background: bg ?? cardBg, boxShadow: cardShadow(22, 0.6), transform: `rotateY(${ry * (1 + (1 - p) * 1.4)}deg) rotateZ(${rz}deg)`, border: '1px solid rgba(255,255,255,0.9)'}}>{children}</div>
    </div>
  );
};
// 满屏时放在左右的位置（左卡 / 右卡），进出时间一写就行
export const SideL: React.FC<{c: Ctx; at: number; out: number; y?: number; w?: number; h: number; children: React.ReactNode; bg?: string}> = ({c, at, out, y = 250, w = 410, h, children, bg}) => <Side x={60} y={y} w={w} h={h} ry={14} rz={-1.5} p={c.R(at, 13)} q={c.R(out, 9, EASE.exit)} from={-440} bg={bg}>{children}</Side>;
export const SideR: React.FC<{c: Ctx; at: number; out: number; y?: number; w?: number; h: number; children: React.ReactNode; bg?: string}> = ({c, at, out, y = 250, w = 420, h, children, bg}) => <Side x={1920 - 56 - w} y={y} w={w} h={h} ry={-14} rz={1.5} p={c.R(at, 13)} q={c.R(out, 9, EASE.exit)} from={440} bg={bg}>{children}</Side>;

// ── 关卡地图 ──
export const road = (u: number): [number, number] => [56 + 630 * u, 590 - 262 * (u * u * (3 - 2 * u)) + 24 * Math.sin(u * Math.PI * 2)];
const ROAD_D = Array.from({length: 81}, (_, i) => road(i / 80)).map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
export const PITS = [0.34, 0.66];
export const MapPanel: React.FC<{tokenU: number; hop: number; done: [number, number]; alert?: number; alertPit?: number; glow?: number; glowFrom?: number; title?: React.ReactNode; labels?: number; lv?: string; who?: string; goal?: string}> = ({who = '小白', tokenU, hop, done, alert = 0, alertPit = 0, glow = 0, glowFrom = 0.36, title, labels = 1, lv = 'Lv.0', goal = '终点'}) => {
  const [tx, ty] = road(tokenU), [ex, ey] = road(1);
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: 740, height: 660}}>
      {title}
      <svg width="740" height="660" style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
        <path d={ROAD_D} fill="none" stroke="rgba(58,42,24,0.10)" strokeWidth="84" strokeLinecap="round" strokeLinejoin="round" transform="translate(0,10)" style={{filter: 'blur(8px)'}} />
        <path d={ROAD_D} fill="none" stroke="#fffdf9" strokeWidth="76" strokeLinecap="round" strokeLinejoin="round" />
        <path d={ROAD_D} fill="none" stroke="rgba(240,103,42,0.35)" strokeWidth="4" strokeLinecap="round" strokeDasharray="2 20" />
        {glow > 0 && <path d={ROAD_D} fill="none" stroke={LK.accent} strokeWidth="7" strokeLinecap="round" pathLength={1} strokeDasharray={`${(1 - glowFrom) * glow} 1`} strokeDashoffset={-glowFrom} opacity={0.9} />}
      </svg>
      <div style={{position: 'absolute', left: ex - 30, top: ey - 118}}>
        <svg width="40" height="96" viewBox="0 0 40 96"><path d="M6 4 V94" stroke={LK.ink} strokeWidth="5" strokeLinecap="round" /><path d="M8 6 L38 18 L8 32 Z" fill={LK.accent} /></svg>
        <div style={{position: 'absolute', left: -150, top: -54, padding: '8px 18px', borderRadius: 14, background: cardBg, boxShadow: cardShadow(10, 0.5), fontSize: 32, fontWeight: 800, color: LK.ink, whiteSpace: 'nowrap'}}>{goal}</div>
      </div>
      {PITS.map((u, i) => {
        const [x, y] = road(u), d = done[i], al = i === alertPit ? alert : 0;
        return (
          <React.Fragment key={i}>
            <div style={{position: 'absolute', left: x - 66, top: y - 29, width: 132, height: 60, borderRadius: '50%', background: 'radial-gradient(ellipse at 50% 30%, #15110d 0%, #2b2118 55%, #5a4634 100%)', boxShadow: `inset 0 6px 10px rgba(0,0,0,0.6), 0 0 0 ${4 + 10 * al}px rgba(229,67,45,${0.25 + 0.5 * al})`}} />
            {d > 0 && <div style={{position: 'absolute', left: x - 70, top: y - 32, width: 140, height: 66, borderRadius: '50%', background: 'linear-gradient(180deg,#fffdf9,#f3ead9)', boxShadow: `0 0 0 4px ${GREEN}, ${cardShadow(6, 0.4)}`, transform: `scale(${d})`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><svg width="44" height="44" viewBox="0 0 24 24"><path d="M4 12.5 L10 18 L20 6.5" fill="none" stroke={GREEN} strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" /></svg></div>}
            <div style={{position: 'absolute', left: x - 86, top: y + 54, padding: '9px 20px', borderRadius: 16, background: cardBg, boxShadow: cardShadow(10, 0.5), fontSize: 38, fontWeight: 900, color: LK.ink, whiteSpace: 'nowrap', opacity: labels}}>坑 {['①', '②'][i]} {d > 0.5 ? <span style={{color: GREEN}}>✓</span> : <span style={{color: LK.ink3}}>？</span>}</div>
          </React.Fragment>
        );
      })}
      <div style={{position: 'absolute', left: tx - 58, top: ty - 124 - hop}}>
        <div style={{width: 116, height: 116, borderRadius: '50%', background: '#fff', border: `6px solid ${LK.accent}`, boxSizing: 'border-box', boxShadow: cardShadow(12, 0.6), display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', lineHeight: 1.05}}>
          <span style={{fontSize: 36, fontWeight: 900, color: LK.ink}}>{who}</span>
          <span style={{fontSize: 21, fontWeight: 800, color: LK.accent}}>{lv}</span>
        </div>
        {alert > 0.02 && <div style={{position: 'absolute', left: 92, top: -30, width: 50, height: 50, borderRadius: '50%', background: LK.red, color: '#fff', fontSize: 36, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: cardShadow(8, 0.6), opacity: c01(alert * 3)}}>!</div>}
      </div>
      <div style={{position: 'absolute', left: tx - 30, top: ty - 6, width: 60, height: 14, borderRadius: '50%', background: 'rgba(58,42,24,0.22)', filter: 'blur(4px)', opacity: 1 - hop / 40}} />
    </div>
  );
};

// 章节开场：地图推近到某个坑 → 标题落下 → 缩到角上（和坑一同一套动作）
export const PitOpen: React.FC<{c: Ctx; at: number; titleAt: number; hiAt: number; demoteAt: number; pit: 0 | 1; tokenU: number; done: [number, number]; num: string; pre: string; hi: string; mapTitle?: React.ReactNode; to?: [number, number]}> = ({c, at, titleAt, hiAt, demoteAt, pit, tokenU, done, num, pre, hi, mapTitle, to = [430, 590]}) => {
  if (c.t > demoteAt + 0.6) return null;
  const zoomIn = c.R(at, 22, EASE.swift), titleIn = c.R(titleAt - 0.08, 13), hl = c.R(hiAt, 12, EASE.out), demote = c.R(demoteAt, 13, EASE.swift);
  const [px, py] = road(PITS[pit]);
  return (
    <div style={{position: 'absolute', left: SX, top: SY, width: 740, height: 660}}>
      {/* 推近以后只留舞台这一块，别让放大的路伸到字幕和人物窗下面 */}
      <div style={{position: 'absolute', left: -30, top: -30, width: 830, height: 720, overflow: 'hidden', borderRadius: 28}}>
        <div style={{position: 'absolute', left: 30, top: 30, width: 740, height: 660, transformOrigin: `${px}px ${py}px`, transform: `translate(${(to[0] - px) * zoomIn}px, ${(to[1] - py) * zoomIn}px) scale(${1 + 0.6 * zoomIn})`, opacity: 1 - demote}}>
          <MapPanel tokenU={tokenU} hop={0} done={done} alert={c.R(at - 0.2, 8, EASE.out) * (1 - zoomIn)} alertPit={pit} labels={1 - zoomIn} title={<div style={{opacity: 1 - c01(zoomIn * 3)}}>{mapTitle}</div>} />
        </div>
      </div>
      {titleIn > 0 && (
        <div style={{position: 'absolute', left: mix(10, -1074, demote), top: mix(8, -86, demote), transformOrigin: '0 0', transform: `scale(${mix(1, 0.36, demote)})`, opacity: 1 - c01((demote - 0.6) * 2.5)}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 18, opacity: c01(c.R(at + 0.35, 10, EASE.out) * 2)}}>
            <span style={{fontSize: 72, fontWeight: 900, color: LK.accent, lineHeight: 1}}>{num}</span>
            <span style={{height: 4, width: 150 * c.R(at + 0.45, 14, EASE.out), background: LK.accent, borderRadius: 2}} />
          </div>
          <div style={{marginTop: 20, fontSize: 84, fontWeight: 900, color: LK.ink, lineHeight: 1.1, whiteSpace: 'nowrap', opacity: c01(titleIn * 2), transform: `translateY(${(1 - titleIn) * 46}px)`, filter: titleIn < 1 ? `blur(${(1 - titleIn) * 10}px)` : undefined}}>
            {pre}<span style={{position: 'relative', display: 'inline-block'}}><span style={{position: 'absolute', left: -6, bottom: 6, height: 44, width: `calc(${hl * 100}% + ${12 * hl}px)`, background: LK.hi, borderRadius: 8}} /><span style={{position: 'relative'}}>{hi}</span></span>
          </div>
        </div>
      )}
    </div>
  );
};
// 一段结尾：回到地图，小白跳过一个坑
export const PitDone: React.FC<{c: Ctx; at: number; pit: 0 | 1; jumpAt: number; walkAt: number; from: number; over: number; to: number; done0?: number; glowFrom?: number; title: React.ReactNode}> = ({c, at, pit, jumpAt, walkAt, from, over, to, done0 = 0, glowFrom, title}) => {
  const mapIn = c.R(at, 14);
  if (mapIn <= 0) return null;
  const jump = c01((c.t - jumpAt) / 0.55), walk = c01((c.t - walkAt) / 0.8);
  const u = from + (over - from) * jump + (to - over) * EASE.swift(walk);
  const hop = jump > 0 && jump < 1 ? Math.sin(jump * Math.PI) * 74 : walk > 0 && walk < 1 ? Math.abs(Math.sin(walk * Math.PI * 3)) * 14 : 0;
  const d = c.R(jumpAt + 0.45, 11, EASE.overshoot);
  return (
    <div style={{position: 'absolute', left: SX + (1 - mapIn) * 120, top: SY, width: 740, height: 660, opacity: c01(mapIn * 2), filter: mapIn < 1 ? `blur(${(1 - mapIn) * 10}px)` : undefined}}>
      <MapPanel tokenU={u} hop={hop} done={pit === 0 ? [d, 0] : [done0 || 1, d]} glow={c.R(walkAt, 20, EASE.out)} glowFrom={glowFrom ?? PITS[pit] + 0.02} title={<div style={{position: 'absolute', left: 6, top: 6}}>{title}</div>} />
    </div>
  );
};

// ── 外壳：背景、舞台内容、人物、章节标签、人物上面的内容、字幕 ──
export const Subtitle: React.FC<{t: number; subs: [number, number, string][]}> = ({t, subs}) => {
  const s = subs.find((x) => t >= x[0] - 0.02 && t < x[1] + 0.06);
  if (!s) return null;
  const p = c01((t - s[0] + 0.02) / 0.1);
  return (
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 54, display: 'flex', justifyContent: 'center', zIndex: 200}}>
      <div style={{padding: '12px 30px 14px', borderRadius: 18, background: 'rgba(255,253,249,0.94)', boxShadow: cardShadow(10, 0.5), fontFamily: SANS, fontSize: 46, fontWeight: 700, color: LK.ink, letterSpacing: '0.01em', opacity: 0.4 + 0.6 * p, transform: `translateY(${(1 - p) * 6}px)`}}>{s[2]}</div>
    </div>
  );
};
// video：口播初剪在 public 里的路径；t0：这一段从全片第几秒开始；start：这一段开头人物是满屏还是窗；
// sw：[什么时候, 变成满屏？] 的列表；labels：[从什么时候起, 标签, 文字]；stage：人物缩成窗时右边放的内容；over：盖在人物上面的内容（满屏时两侧的卡）
// fit：原片四周有黑边或拉伸带时，把视频放大一点推出画面，例如 {left: -12, top: -13, width: 1944, height: 1093}
export const Shell: React.FC<{video: string; t0: number; subs: unknown; start: 'win' | 'full' | 'mini'; sw: [number, boolean | 'mini'][]; labels: [number, string, string][]; stage: (c: Ctx) => React.ReactNode; over?: (c: Ctx) => React.ReactNode; fit?: {left: number; top: number; width: number; height: number}; mini?: Rect}> = ({video, t0, subs, start, sw, labels, stage, over, fit = {left: 0, top: 0, width: 1920, height: 1080}, mini = R_MINI}) => {
  useStyleValues(P);   // 镜头库的镜头读到笔记本的值
  const f = useCurrentFrame(), c = mk(t0, f);
  // sw 里每一项：[秒, true=满屏 / false=窗 / 'mini'=小窗]。小窗默认在左下角；录屏的重点在左下角时，传 mini 换个角，比如右下 [1384, 640, 480, 270]，同时把录屏卡（Notebook 的 REC_BOX）挪开
  const RR = (k: boolean | 'mini' | 'win' | 'full'): Rect => (k === 'mini' ? mini : k === true || k === 'full' ? R_FULL : R_WIN);
  let rect: Rect = RR(start), prev = rect;
  for (const [at, full] of sw) { const p = c.R(at, 15, EASE.swift); if (p > 0) { rect = lerpR(prev, RR(full), p); prev = RR(full); } }
  const [px, py, pw, ph] = rect, small = c01((1920 - pw) / 800);
  const li = labels.reduce((m, l, i) => (c.t >= l[0] ? i : m), -1), lab = li >= 0 ? labels[li] : null;
  const lp = lab ? (li === 0 && lab[0] <= t0 ? 1 : c.R(lab[0], 10, EASE.out)) : 0;
  return (
    <AbsoluteFill style={{background: '#f3efe8', fontFamily: SANS, overflow: 'hidden'}}>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 70% 60% at 50% 45%, #ffffff 0%, #f3efe8 78%)'}}>
        <div style={{position: 'absolute', left: -200 + ((f + t0 * 30) * 0.25) % 600, top: -300, width: 2400, height: 1700, transform: 'rotate(-24deg)', opacity: 0.5, background: 'repeating-linear-gradient(90deg, rgba(255,255,255,0) 0 150px, rgba(255,255,255,0.9) 190px 300px, rgba(255,255,255,0) 340px 520px)', filter: 'blur(26px)'}} />
      </AbsoluteFill>
      {small > 0.02 && stage(c)}
      <div style={{position: 'absolute', left: px, top: py, width: pw, height: ph, borderRadius: 28 * small, overflow: 'hidden', boxShadow: small > 0.01 ? cardShadow(26 * small, 0.55) : undefined}}>
        <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transformOrigin: '0 0', transform: `scale(${pw / 1920})`}}>
          <OffthreadVideo src={staticFile(video)} startFrom={Math.round(t0 * 30)} muted style={{position: 'absolute', ...fit}} />
        </div>
      </div>
      {lab && lab[1] && (
        <div style={{position: 'absolute', left: 56, top: 86, display: 'flex', alignItems: 'center', gap: 14, padding: '12px 26px 12px 14px', borderRadius: 999, background: 'rgba(255,253,249,0.96)', boxShadow: cardShadow(10, 0.5), opacity: lp, transform: `translateY(${(1 - lp) * -14}px)`, zIndex: 50}}>
          <span style={{padding: '4px 16px', borderRadius: 999, background: LK.accent, color: '#fff', fontSize: 30, fontWeight: 900}}>{lab[1]}</span>
          <span style={{fontSize: 34, fontWeight: 800, color: LK.ink}}>{lab[2]}</span>
        </div>
      )}
      {over?.(c)}
      <Grain opacity={0.035} blend="overlay" />
      <Subtitle t={c.t} subs={subs as [number, number, string][]} />
    </AbsoluteFill>
  );
};
// 舞台：右边 740 × 660 的区域，at–out 之间显示
export const Stage: React.FC<{c: Ctx; at: number; out: number; children: React.ReactNode; slide?: boolean}> = ({c, at, out, children, slide = true}) => {
  if (c.t < at - 0.05 || c.t > out + 0.5) return null;
  const q = c.R(out, 9, EASE.exit);
  return <div style={{position: 'absolute', left: SX + (slide ? q * 420 : 0), top: SY, width: 740, height: 660, opacity: 1 - q}}>{children}</div>;
};

// 说到哪个词：在字幕里找到这几个字，返回说到它的秒数（全片秒）。
// 传了 chars（align_script.py 和 subs.json 一起出的 subs_chars.json）就用听写的逐字真实时间；没传才按它在那一行里的位置估，会早一点或晚一点。
// 用法：const W = mkW(SUBS, CHARS)
export const mkW = (subs: unknown, chars?: unknown) => (s: string, after = 0): number => {
  const L = subs as [number, number, string][], i = L.findIndex((x) => x[0] >= after - 0.01 && x[2].includes(s));
  if (i < 0) throw new Error('字幕里没有：' + s);
  const l = L[i], k = l[2].indexOf(s), ct = (chars as number[][] | undefined)?.[i];
  if (ct && ct.length === l[2].length) return ct[k];
  return l[0] + (l[1] - l[0]) * (k / Math.max(1, l[2].length));
};
