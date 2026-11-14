// "操作台"风格（styles/workbench）的外壳：整条片子是一个正在用的剪辑软件。
// 从一条讲配乐的口播里拆出来：样子留在这里，片子的内容全挪进 content.ts。
// 换片子：复制整个文件夹到 projects/<片子名>/，只改 content.ts 和各段；颜色字体在 styles/workbench/values.ts。
// 镜头在操作台上推拉：人"满屏" = 镜头推进监视器；"给你看" = 素材叠进监视器、人缩成监视器角上的小窗（整幅缩小，不裁脸）。
import React from 'react';
import {AbsoluteFill, Img, OffthreadVideo, staticFile, useCurrentFrame} from 'remotion';
import {EASE, Grain, mix, ramp} from '../../../shot-library/kit/polish';
import * as CT from './content';
import {CHAPTERS, DIR, FILE, KEYS, MUSIC, TL_LEN, VIDEO, BG_VIDEO, THUMBS, WAVE} from './content';
const STATUS: string = (CT as {STATUS?: string}).STATUS ?? 'AI 剪辑中';   // 顶栏文件名后面的状态字，content.ts 里可以改
import {DESK_UI, WORKBENCH} from '../../../styles/workbench/values';
import {useStyleValues} from '../../../styles/current';
export {CHAPTERS, TL_LEN};

export {EASE, mix};
export const c01 = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
export const IMG = (n: string) => staticFile(DIR + '/' + n);
export const SANS = WORKBENCH.font;
export const MONO = WORKBENCH.mono!;
// 颜色：剪辑软件的深灰；轨道色取自片子里的东西（屏幕蓝、窗帘橙）
export const D = DESK_UI;

export type Rect = [number, number, number, number];
export const MON: Rect = [440, 52, 1040, 585];          // 节目监视器
export const LEFT: Rect = [16, 52, 408, 585];           // 代码 + 素材
export const RIGHT: Rect = [1496, 52, 408, 585];        // AI 在看
export const TL = {y: 654, x0: 200, x1: 1904, rows: {ruler: [654, 20], v2: [678, 42], v1: [724, 42], t1: [770, 28], a1: [802, 44], a2: [850, 70]} as Record<string, [number, number]>};
export const DESK: Rect = [0, 0, 1920, 1080];

// ── 升级（学对标的做法，只取道理）：每一章一个颜色、画面有前后层次、顶栏能看到"正在放什么"和节拍、换章有章节卡、关键词在字幕里点亮 ──

const hex = (h: string) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
export const chAt = (t: number) => { let i = 0; CHAPTERS.forEach((c, k) => { if (t >= c.at) i = k; }); return i; };
// 当前章节色（换章时 0.6 秒内渐变），返回 [r,g,b]
export const chRGB = (t: number) => { const i = chAt(t), cur = hex(CHAPTERS[i].col); if (i === 0) return cur; const prev = hex(CHAPTERS[i - 1].col), p = c01((t - CHAPTERS[i].at) / 0.6); return cur.map((v, k) => Math.round(prev[k] + (v - prev[k]) * p)); };
export const rgba = (c: number[], a: number) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
const M = MUSIC ?? {bands: [] as number[][], downbeats: [] as number[], songs: [] as [number, number, string][]};
// 最近一个重拍过去了多久（秒）
export const sinceBeat = (t: number) => { let b = -99; for (const d of M.downbeats) { if (d <= t) b = d; else break; } return t - b; };
export const G = {t: 0};   // 当前片子时间（DeskShell 每帧写一次，面板读它做节拍呼吸）

export const mk = (f: number, t0 = 0) => ({f, t: t0 + f / 30, F: (t: number) => (t - t0) * 30, R: (at: number, dur: number, e: (x: number) => number = EASE.snappy) => ramp(f, (at - t0) * 30, dur, e)});
export type Ctx = ReturnType<typeof mk>;
const lerpR = (a: Rect, b: Rect, p: number): Rect => [mix(a[0], b[0], p), mix(a[1], b[1], p), mix(a[2], b[2], p), mix(a[3], b[3], p)];

// 镜头：看操作台上的哪一块（[什么时候开始移, 看哪块]，每次移 0.55 秒）
export const camAt = (t: number, keys: [number, Rect][]): Rect => {
  let r = keys[0][1];
  for (let i = 1; i < keys.length; i++) { const p = EASE.smooth(c01((t - keys[i][0]) / 0.55)); if (p > 0) r = lerpR(r, keys[i][1], p); }
  return r;
};
const camTf = ([x, y, w, h]: Rect) => { const s = Math.min(1920 / w, 1080 / h); return `translate(${(1920 - w * s) / 2 - x * s}px, ${(1080 - h * s) / 2 - y * s}px) scale(${s})`; };

// 面板外框
export const Panel: React.FC<{r: Rect; title: React.ReactNode; right?: React.ReactNode; children?: React.ReactNode; glow?: number}> = ({r, title, right, children, glow = 0}) => { const cc = chRGB(G.t), br = Math.exp(-sinceBeat(G.t) * 4) * 0.35; return (
  <div style={{position: 'absolute', left: r[0], top: r[1], width: r[2], height: r[3], borderRadius: 12, background: 'linear-gradient(180deg, rgba(28,31,38,0.9), rgba(18,20,25,0.92))', border: `1px solid ${glow > 0 ? rgba(cc, 0.35 + 0.65 * glow) : rgba(cc, 0.14 + br)}`, overflow: 'hidden', boxShadow: `${glow > 0 ? `0 0 ${34 * glow}px ${rgba(cc, 0.4 * glow)}, ` : ''}inset 0 1px 0 rgba(255,255,255,0.06), 0 18px 40px rgba(0,0,0,0.35)`}}>
    <div style={{height: 36, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 14px', borderBottom: `1px solid ${rgba(cc, 0.18)}`, background: `linear-gradient(90deg, ${rgba(cc, 0.16)}, rgba(29,33,40,0.6) 60%)`, fontSize: 17, fontWeight: 700, color: D.dim, letterSpacing: '0.04em'}}><span>{title}</span><span>{right}</span></div>
    <div style={{position: 'absolute', left: 0, top: 37, right: 0, bottom: 0}}>{children}</div>
  </div>
); };

// 时间线：x(t)。平时播放头固定在 30% 处、每秒 56 像素；zoom=1 时整条片子（content.ts 的 TL_LEN 秒）铺满
export const tlX = (t: number, now: number, zoom: number) => mix(TL.x0 + 0.3 * (TL.x1 - TL.x0) + (t - now) * 56, TL.x0 + 8 + t * ((TL.x1 - TL.x0 - 16) / TL_LEN), zoom);
const tc = (t: number) => { const m = Math.floor(t / 60), s = Math.floor(t % 60), fr = Math.floor((t * 30) % 30); return `00:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}:${String(fr).padStart(2, '0')}`; };

export type V2Clip = {from: number; to: number; img: string; name: string; born: number};
export type A2Clip = {from: number; to: number; name: string; born: number; arr: string; off: number};
export const Timeline: React.FC<{c: Ctx; zoom: number; subs: [number, number, string][]; v2: V2Clip[]; trans?: [number, number][]; ding?: {times: number[]; ghost: number; del?: number}; checks: Record<string, number>; hl: Record<string, number>; born: number; a2name?: string; a2?: A2Clip[]}> = ({c, zoom, subs, v2, trans = [], ding, checks, hl, born, a2name = 'AI 配乐', a2 = []}) => {
  const now = c.t, X = (t: number) => tlX(t, now, zoom), rows = TL.rows, W = WAVE as Record<string, number[]>;
  const vis = (a: number, b: number) => X(b) > TL.x0 - 40 && X(a) < TL.x1 + 40;
  const head = (k: string, name: string, col: string) => {
    const [y, h] = rows[k], ck = checks[k] ?? 0, g = hl[k] ?? 0;
    return (
      <div key={k} style={{position: 'absolute', left: 16, top: y, width: TL.x0 - 24, height: h, borderRadius: 6, background: g > 0 ? `rgba(${k === 'a2' ? '232,100,42' : '76,141,255'},${0.15 + 0.25 * g})` : D.panel2, border: `1px solid ${g > 0 ? col : D.line}`, display: 'flex', alignItems: 'center', gap: 8, padding: '0 10px', boxSizing: 'border-box', fontSize: 17, fontWeight: 800, color: D.text}}>
        <span style={{width: 8, height: h - 16, borderRadius: 3, background: col}} />{name}
        {ck > 0 && <span style={{marginLeft: 'auto', width: 24, height: 24, borderRadius: 12, background: D.green, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${0.4 + 0.6 * ck + 0.25 * Math.sin(Math.PI * ck)})`}}><svg width="15" height="15" viewBox="0 0 24 24"><path d="M4 12.5 L10 18 L20 6.5" fill="none" stroke="#fff" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" /></svg></span>}
      </div>
    );
  };
  const env = (arr: number[], y: number, h: number, col: string, from = 0, to = TL_LEN) => {
    const pts: string[] = [], step = zoom > 0.5 ? 6 : 2;
    const a = Math.max(from, now - (0.3 * 1704 + 40) / mix(56, 12.7, zoom)), b = Math.min(to, now + (0.7 * 1704 + 40) / mix(56, 12.7, zoom));
    for (let i = Math.floor(a * 30); i <= Math.min(arr.length - 1, Math.floor(b * 30)); i += step) pts.push(`${X(i / 30).toFixed(1)},${(y + h / 2 - arr[i] * h * 0.45).toFixed(1)}`);
    for (let i = Math.min(arr.length - 1, Math.floor(b * 30)); i >= Math.floor(a * 30); i -= step) pts.push(`${X(i / 30).toFixed(1)},${(y + h / 2 + arr[i] * h * 0.45).toFixed(1)}`);
    return pts.length > 2 ? <polygon points={pts.join(' ')} fill={col} opacity={0.85} /> : null;
  };
  const p = c.R(born, 16, EASE.out);
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, opacity: c01(p * 1.5), transform: `translateY(${(1 - p) * 60}px)`}}>
      <div style={{position: 'absolute', left: TL.x0 - 4, top: TL.y - 4, width: TL.x1 - TL.x0 + 4, height: 926 - TL.y, borderRadius: 10, background: 'linear-gradient(180deg, rgba(24,27,33,0.9), rgba(16,18,22,0.92))', border: `1px solid ${rgba(chRGB(now), 0.18)}`, boxShadow: '0 18px 40px rgba(0,0,0,0.35)'}} />
      {/* 刻度尺 */}
      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
        {Array.from({length: Math.ceil(TL_LEN) + 6}, (_, s) => s).filter((s) => zoom > 0.5 ? s % 10 === 0 : true).map((s) => { const x = X(s); if (x < TL.x0 || x > TL.x1) return null; const major = s % 5 === 0; return <g key={s}><line x1={x} y1={rows.ruler[0] + (major ? 4 : 12)} x2={x} y2={rows.ruler[0] + 20} stroke={D.faint} strokeWidth={1.5} />{major && <text x={x + 4} y={rows.ruler[0] + 14} fontSize={12} fill={D.dim} fontFamily={MONO}>{`${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`}</text>}</g>; })}
      </svg>
      <div style={{position: 'absolute', left: TL.x0, top: TL.y, width: TL.x1 - TL.x0, height: 926 - TL.y, overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: -TL.x0, top: -TL.y, width: 1920, height: 1080}}>
          {/* V1 口播：每 2 秒一格真画面 */}
          {Array.from({length: Math.ceil(TL_LEN / 2)}, (_, i) => vis(i * 2, i * 2 + 2) && <div key={i} style={{position: 'absolute', left: X(i * 2), top: rows.v1[0], width: X(i * 2 + 2) - X(i * 2) - 1, height: rows.v1[1], overflow: 'hidden', background: '#233', borderTop: `3px solid ${D.v}`}}>{THUMBS && <Img src={IMG(`${THUMBS}${String(i + 1).padStart(3, '0')}.jpg`)} style={{height: '100%', width: 'auto'}} />}</div>)}
          {/* V2 素材：AI 写一段，长一段 */}
          {v2.map((k, i) => { const q = c.R(k.born, 10, EASE.overshoot); if (q <= 0 || !vis(k.from, k.to)) return null; return <div key={i} style={{position: 'absolute', left: X(k.from), top: rows.v2[0] + (1 - q) * -30, width: Math.max(4, (X(k.to) - X(k.from)) - 2), height: rows.v2[1], borderRadius: 5, overflow: 'hidden', background: `url(${IMG(k.img)}) left center / auto 100% repeat-x`, border: `2px solid ${D.v}`, opacity: c01(q * 2), boxSizing: 'border-box'}}><span style={{position: 'absolute', left: 6, top: 4, padding: '1px 6px', borderRadius: 4, background: 'rgba(15,17,21,0.75)', fontSize: 13, fontWeight: 700, color: D.text, whiteSpace: 'nowrap'}}>{k.name}</span></div>; })}
          {trans.map(([at, born], i) => { const q = c.R(born, 10, EASE.overshoot); if (q <= 0) return null; return <div key={'tr' + i} style={{position: 'absolute', left: X(at) - 18, top: rows.v2[0] + 5, width: 36, height: 36, transform: `rotate(45deg) scale(${q})`, background: D.t, borderRadius: 6, boxShadow: `0 0 18px ${D.t}`}} />; })}
          {/* T1 字幕：真字幕，一句一段 */}
          {subs.map(([a, b, s], i) => vis(a, b) && <div key={i} style={{position: 'absolute', left: X(a), top: rows.t1[0], width: Math.max(2, X(b) - X(a) - 2), height: rows.t1[1], borderRadius: 4, background: now >= a && now < b ? D.t : 'rgba(242,193,78,0.28)', color: now >= a && now < b ? '#1b1405' : '#f2d999', fontSize: 13, fontWeight: 700, lineHeight: `${rows.t1[1]}px`, padding: '0 5px', overflow: 'hidden', whiteSpace: 'nowrap', boxSizing: 'border-box'}}>{zoom < 0.5 ? s : ''}</div>)}
          {/* A1 人声、A2 音乐：真波形 */}
          <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
            <rect x={0} y={rows.a1[0]} width={1920} height={rows.a1[1]} fill="rgba(62,207,142,0.06)" />
            {W.voice && env(W.voice, rows.a1[0], rows.a1[1], D.a1)}
            <rect x={0} y={rows.a2[0]} width={1920} height={rows.a2[1]} fill="rgba(232,100,42,0.06)" />
            <line x1={0} y1={rows.a2[0] + rows.a2[1] / 2} x2={1920} y2={rows.a2[1] / 2 + rows.a2[0]} stroke={D.faint} strokeWidth={2} strokeDasharray="4 10" />
            {/* 叮：一样高的块，一个"叮"一个；ghost>0 时从头铺到尾（"一个调从头响到尾"） */}
            {ding && (ding.del ?? 0) < 1 && ding.times.map((at, i) => { const q = c.R(at, 6, EASE.overshoot) * (1 - (ding.del ?? 0)); if (q <= 0) return null; const x = X(ding.times[0]) + i * 30 * (1 - zoom); const hit = Math.exp(-Math.max(0, now - at) * 6); return <rect key={i} x={x} y={rows.a2[0] + 14 - 6 * hit} width={Math.max(3, 16 * (1 - zoom) + 3)} height={(rows.a2[1] - 28 + 12 * hit) * q} rx={3} fill={D.a2} />; })}
            {ding && ding.ghost > 0 && Array.from({length: Math.ceil(TL_LEN / 0.8)}, (_, i) => { const t = 0.4 + i * 0.8; if (t > TL_LEN) return null; const q = c01(ding.ghost * 3 - (t / TL_LEN) * 2) * c01(1 - ((ding.del ?? 0) * 1.6 - (t / TL_LEN) * 0.6)); if (q <= 0) return null; return <rect key={'g' + i} x={X(t)} y={rows.a2[0] + 14} width={5} height={(rows.a2[1] - 28) * q} rx={1.5} fill={(ding.del ?? 0) > 0 ? D.red : D.a2} opacity={0.9} />; })}
            {/* 配乐片段：真歌的波形 */}
            {a2.map((k, i) => { const q = c.R(k.born, 12, EASE.overshoot); if (q <= 0 || !vis(k.from, k.to)) return null; const arr = (W as unknown as Record<string, number[]>)[k.arr]; const x0 = X(k.from), x1 = X(k.to), y = rows.a2[0] + 3, h = rows.a2[1] - 6; const pts: string[] = []; const step = Math.max(1, Math.round(4 / Math.max(0.2, (x1 - x0) / ((k.to - k.from) * 30)))); for (let j = 0; j <= (k.to - k.from) * 30; j += step) { const v = arr[Math.min(arr.length - 1, Math.floor(k.off * 30 + j))] ?? 0; pts.push(`${(x0 + (x1 - x0) * j / ((k.to - k.from) * 30)).toFixed(1)},${(y + h / 2 - v * h * 0.45 * q).toFixed(1)}`); } for (let j = Math.floor((k.to - k.from) * 30); j >= 0; j -= step) { const v = arr[Math.min(arr.length - 1, Math.floor(k.off * 30 + j))] ?? 0; pts.push(`${(x0 + (x1 - x0) * j / ((k.to - k.from) * 30)).toFixed(1)},${(y + h / 2 + v * h * 0.45 * q).toFixed(1)}`); } return <g key={'a2' + i} opacity={c01(q * 2)}><rect x={x0} y={y} width={Math.max(2, x1 - x0)} height={h} rx={5} fill="rgba(232,100,42,0.18)" stroke={D.a2} strokeWidth={2} /><polygon points={pts.join(' ')} fill={D.a2} /><text x={x0 + 8} y={y + 16} fontSize={14} fontWeight={800} fill="#fff">{k.name}</text></g>; })}
          </svg>
        </div>
      </div>
      {head('v2', '素材', D.v)}{head('v1', '口播', D.v)}{head('t1', '字幕', D.t)}{head('a1', '人声', D.a1)}{head('a2', a2name, D.a2)}
      {/* 播放头 */}
      <div style={{position: 'absolute', left: X(now) - 1.5, top: TL.y - 6, width: 3, height: 926 - TL.y + 2, background: '#fff', boxShadow: `0 0 14px ${rgba(chRGB(now), 0.9)}`}} />
      <div style={{position: 'absolute', left: X(now) - 52, top: TL.y - 4, width: 104, padding: '2px 0', borderRadius: 5, background: '#fff', color: D.bg, fontFamily: MONO, fontSize: 14, fontWeight: 700, textAlign: 'center'}}>{tc(now)}</div>
    </div>
  );
};

// 字幕：屏幕上固定在底下（不跟镜头走）
export const Subtitle: React.FC<{t: number; subs: [number, number, string][]}> = ({t, subs}) => {
  const s = subs.find((x) => t >= x[0] - 0.02 && t < x[1] + 0.06);
  if (!s) return null;
  const p = c01((t - s[0] + 0.02) / 0.1);
  return (
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 34, display: 'flex', justifyContent: 'center', zIndex: 200}}>
      <div style={{padding: '10px 28px 12px', borderRadius: 14, background: 'rgba(255,255,255,0.96)', boxShadow: '0 6px 24px rgba(0,0,0,0.35)', fontFamily: SANS, fontSize: 44, fontWeight: 700, color: '#15171c', opacity: 0.4 + 0.6 * p, transform: `translateY(${(1 - p) * 6}px)`}}>{(() => { const k = KEYS.filter((w) => s[2].includes(w)).sort((a, b) => b.length - a.length)[0]; if (!k) return s[2]; const i = s[2].indexOf(k), cc = chRGB(t); const darker = cc.map((v) => Math.round(v * 0.82)); return <>{s[2].slice(0, i)}<span style={{color: rgba(darker, 1), textShadow: `0 0 18px ${rgba(cc, 0.35)}`}}>{k}</span>{s[2].slice(i + k.length)}</>; })()}</div>
    </div>
  );
};

// 整个操作台：cam 镜头；mon 监视器位置；monInner 监视器里叠的内容；pip 人缩成小窗的程度
export const DeskShell: React.FC<{t0?: number; subs: unknown; cam: [number, Rect][]; monAt: (c: Ctx) => Rect; pip: (c: Ctx) => number; pipCorner?: 'br' | 'bl' | 'tr' | 'tl'; monInner: (c: Ctx) => React.ReactNode; left: (c: Ctx) => React.ReactNode; right: (c: Ctx) => React.ReactNode; tl: (c: Ctx) => React.ReactNode; top?: (c: Ctx) => React.ReactNode; flash?: (c: Ctx) => number; deskIn: number}> = ({t0 = 0, subs, cam, monAt, pip, pipCorner = 'br', monInner, left, right, tl, top, flash, deskIn}) => {
  const f = useCurrentFrame(), c = mk(f, t0), S = subs as [number, number, string][];
  useStyleValues(WORKBENCH);   // 镜头库的镜头放进来，读到操作台的值
  G.t = c.t; const cc = chRGB(c.t), bi = Math.min(M.bands.length - 1, Math.round(c.t * 30)), band = M.bands[bi] ?? [], beat = Math.exp(-sinceBeat(c.t) * 5);
  const song = M.songs.find((x) => c.t >= x[0] && c.t < x[1]);
  const [mx, my, mw, mh] = monAt(c), pp = pip(c), fl = flash ? flash(c) : 0;
  const ui = c.R(deskIn, 18, EASE.out);
  // 人：整幅等比缩小；pip 时缩到监视器的一角（默认右下；录屏的重点在右下时用 pipCorner 换角，别挡住）
  const pw = mix(mw, mw * 0.3, pp), ph = pw * 9 / 16, px = mix(0, pipCorner[1] === 'r' ? mw - pw - 18 : 18, pp), py = mix(0, pipCorner[0] === 'b' ? mh - ph - 18 : 18, pp);
  return (
    <AbsoluteFill style={{background: D.bg, fontFamily: SANS, overflow: 'hidden'}}>
      {/* 背后一层：这条片子自己的画面，放大、虚化、很淡；再加两团跟着章节变色的光，慢慢漂 */}
      <AbsoluteFill style={{opacity: 0.32}}>{BG_VIDEO && <OffthreadVideo src={IMG(BG_VIDEO)} startFrom={Math.round(t0 * 30)} muted style={{width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.15)', filter: 'blur(18px) saturate(1.2)'}} />}</AbsoluteFill>
      <AbsoluteFill style={{background: `radial-gradient(ellipse 50% 45% at ${30 + 8 * Math.sin(c.t * 0.21)}% ${35 + 6 * Math.cos(c.t * 0.17)}%, ${rgba(cc, 0.28 + 0.06 * beat)}, transparent 70%), radial-gradient(ellipse 45% 40% at ${72 + 6 * Math.cos(c.t * 0.19)}% ${70 + 5 * Math.sin(c.t * 0.23)}%, ${rgba(cc, 0.18)}, transparent 70%), radial-gradient(ellipse 120% 100% at 50% 50%, transparent 55%, rgba(5,6,8,0.75) 100%)`}} />
      <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transformOrigin: '0 0', transform: camTf(camAt(c.t, cam))}}>
        {/* 顶栏 */}
        <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 42, display: 'flex', alignItems: 'center', gap: 10, padding: '0 18px', boxSizing: 'border-box', opacity: ui, color: D.dim, fontSize: 16, fontWeight: 700, borderBottom: `1px solid ${D.line}`}}>
          {['#ff5f57', '#febc2e', '#28c840'].map((x) => <span key={x} style={{width: 12, height: 12, borderRadius: 6, background: x}} />)}
          <span style={{marginLeft: 14, color: D.text}}>{FILE}</span><span style={{display: 'inline-flex', alignItems: 'center', gap: 6}}>· <span style={{width: 9, height: 9, borderRadius: 5, background: D.red, opacity: 0.5 + 0.5 * Math.round((c.t * 1.5) % 1)}} />{STATUS}</span>
          {/* 章节标签：现在在哪一章 */}
          <span style={{position: 'absolute', left: 660, display: 'flex', gap: 6}}>{CHAPTERS.slice(1).map((ch, k) => { const on = chAt(c.t) === k + 1, done = chAt(c.t) > k + 1; return <span key={ch.n} style={{padding: '3px 12px', borderRadius: 999, fontSize: 14, fontWeight: 800, color: on ? '#0f1115' : done ? D.text : D.faint, background: on ? ch.col : 'transparent', border: `1px solid ${on ? ch.col : done ? D.line : 'transparent'}`}}>{ch.n} {ch.title}</span>; })}</span>
          {/* 正在播放：歌名 + 跟着真实配乐跳的 8 根频谱条 */}
          <span style={{marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 10, padding: '3px 12px', borderRadius: 999, background: rgba(cc, 0.12), border: `1px solid ${rgba(cc, 0.3 + 0.4 * beat)}`, color: D.text}}>
            <span style={{display: 'inline-flex', alignItems: 'flex-end', gap: 2, height: 18}}>{band.map((v, k) => <span key={k} style={{width: 3, height: 3 + 15 * v, borderRadius: 1, background: rgba(cc, 0.95)}} />)}</span>
            <span style={{fontSize: 14}}>{song ? `正在播放 · ${song[2]}` : '配乐 · 停'}</span>
          </span>
          <span style={{fontFamily: MONO, marginLeft: 12}}>30 fps</span>
        </div>
        <div style={{opacity: ui, transform: `translateX(${(1 - ui) * -80}px)`}}>{left(c)}</div>
        <div style={{opacity: ui, transform: `translateX(${(1 - ui) * 80}px)`}}>{right(c)}</div>
        {tl(c)}
        {/* 节目监视器 */}
        <div style={{position: 'absolute', left: mx, top: my, width: mw, height: mh, borderRadius: 8 * ui, overflow: 'hidden', background: '#000', boxShadow: ui > 0 ? `0 0 0 ${2 * ui}px ${rgba(cc, 0.35 + 0.25 * beat)}, 0 0 ${40 * ui}px ${rgba(cc, 0.25)}` : undefined, zIndex: 20}}>
          {monInner(c)}
          <div style={{position: 'absolute', left: px, top: py, width: pw, height: ph, borderRadius: 10 * pp, overflow: 'hidden', boxShadow: pp > 0.05 ? `0 0 0 3px #fff, 0 10px 30px rgba(0,0,0,0.5)` : undefined, zIndex: 5}}>
            <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transformOrigin: '0 0', transform: `scale(${pw / 1920})`}}>
              {VIDEO ? <OffthreadVideo src={IMG(VIDEO)} startFrom={Math.round(t0 * 30)} muted style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080}} /> : <div style={{position: 'absolute', inset: 0, background: '#3a3f48', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8b919c', fontSize: 90, fontWeight: 800}}>人物画面（content.ts 的 VIDEO）</div>}
            </div>
          </div>
          {fl > 0 && <div style={{position: 'absolute', inset: 0, background: '#fff', opacity: fl, zIndex: 30}} />}
          {ui > 0.02 && <div style={{position: 'absolute', left: 14, top: 12, display: 'flex', alignItems: 'center', gap: 8, padding: '3px 10px', borderRadius: 5, background: 'rgba(15,17,21,0.7)', color: D.text, fontSize: 15, fontWeight: 700, opacity: ui, zIndex: 31}}><span style={{width: 8, height: 8, borderRadius: 4, background: D.red}} />节目监视器</div>}
        </div>
        {top?.(c)}
      </div>
      <ChapterCard t={c.t} />
      <Grain opacity={0.04} blend="overlay" />
      <Subtitle t={c.t} subs={S} />
    </AbsoluteFill>
  );
};

// 换章卡：大号章节数字 + 标题，从左边滑进来、停 1 秒、缩成顶栏里的标签（屏幕坐标，不跟镜头走）
const ChapterCard: React.FC<{t: number}> = ({t}) => {
  const i = chAt(t); if (i === 0) return null;
  const ch = CHAPTERS[i], u = t - ch.at; if (u < 0 || u > 1.6) return null;
  const pin = c01(u / 0.35), out = c01((u - 1.15) / 0.4), e = 1 - Math.pow(1 - pin, 3), q = out * out;
  const col = hex(ch.col);
  return (
    <div style={{position: 'absolute', left: 70 - 40 * (1 - e) + 520 * q, top: 96 - 60 * q, zIndex: 150, opacity: (1 - q) * Math.min(1, pin * 2), transform: `scale(${1 - 0.55 * q})`, transformOrigin: '0 0', display: 'flex', alignItems: 'center', gap: 22, padding: '14px 30px 14px 20px', borderRadius: 18, background: 'rgba(12,13,17,0.82)', border: `2px solid ${rgba(col, 0.8)}`, boxShadow: `0 0 50px ${rgba(col, 0.35)}, 0 20px 50px rgba(0,0,0,0.5)`}}>
      <span style={{fontFamily: MONO, fontSize: 96, fontWeight: 900, lineHeight: 1, color: 'transparent', WebkitTextStroke: `3px ${ch.col}`, textShadow: `0 0 24px ${rgba(col, 0.6)}`}}>{ch.n}</span>
      <span style={{display: 'flex', flexDirection: 'column', gap: 6}}><span style={{fontFamily: MONO, fontSize: 18, fontWeight: 800, letterSpacing: '0.2em', color: ch.col}}>CHAPTER {ch.n}</span><span style={{fontSize: 46, fontWeight: 900, color: '#fff', whiteSpace: 'nowrap'}}>{ch.title}</span></span>
    </div>
  );
};
