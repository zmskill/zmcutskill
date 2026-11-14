// 笔记本风格补的三样零件（从一条讲剪辑工具的口播里拆出来，改成可换内容）：
//   RecCard   录屏卡：右边一张大白卡里放录屏或定格图，可按时间推近；配合 Shell 的 'mini' 状态（人缩到左下角）用
//   HRing     手画圈：圈在录屏上说到的那个地方，可带一个小标签。坐标是录屏自己的像素坐标
//   RouteMap / ChapterOpen  章节路线图：从起点经过几站走到终点，"我"走到哪一站就是第几章。站名、终点、走的人都由片子传进来
// 人物进出小窗：Shell 的 sw 里写 [秒, 'mini']，回到窗写 [秒, false]，满屏写 [秒, true]。
import React from 'react';
import {Img, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {Ctx, EASE, GREEN, LK, c01, cardBg, cardShadow, mix} from './Kit';

const big = (size: number, col: string = LK.ink): React.CSSProperties => ({fontSize: size, fontWeight: 900, color: col, whiteSpace: 'nowrap', lineHeight: 1.15});

// ── 录屏卡 ──
// clips：这张卡里依次放什么。from/to 是成片里的秒；放视频就写 rec（从录屏第几秒开始）和 rate，放定格图就写 img（public 里的路径）
// zoom：推近的关键帧 [从第几秒开始, 录屏里的中心 x, 中心 y, 放大倍数]，每次过渡 0.6 秒
// 录屏自带推近、模糊转场时，拿它当证据的句子用定格图（img）更稳。
export type Clip = {from: number; to: number; rec?: number; rate?: number; img?: string};
export type ZK = [number, number, number, number];
export const REC_BOX: [number, number, number, number] = [580, 112, 1284, 800]; // 卡在屏幕上的位置，避开左下角的人物小窗
const zoomAt = (t: number, keys: ZK[]) => {
  let z = keys[0].slice(1) as number[];
  for (let i = 1; i < keys.length; i++) { const p = EASE.smooth(c01((t - keys[i][0]) / 0.6)); if (p > 0) z = z.map((v, k) => mix(v, keys[i][k + 1], p)); }
  return z;
};
export const RecCard: React.FC<{
  c: Ctx; t0: number; src: string; recW?: number; recH?: number; clips: Clip[]; zoom: ZK[]; at: number; out: number;
  box?: [number, number, number, number]; children?: React.ReactNode;
}> = ({c, t0, src, recW = 1920, recH = 1080, clips, zoom, at, out, box = REC_BOX, children}) => {
  const p = c.R(at, 14, EASE.out), q = c.R(out, 10, EASE.exit);
  if (p <= 0 || q >= 1) return null;
  const [bx, by, bw, bh] = box, pad = 14, w = bw - pad * 2, h = bh - pad * 2;
  const [cx, cy, s] = zoomAt(c.t, zoom), sc = (w / recW) * s;
  const tx = Math.min(0, Math.max(w - recW * sc, w / 2 - cx * sc)), ty = Math.min(0, Math.max(h - recH * sc, h / 2 - cy * sc));
  const f = (t: number) => Math.round((t - t0) * 30);
  const full = {position: 'absolute' as const, left: 0, top: 0, width: recW, height: recH};
  return (
    <div style={{position: 'absolute', left: bx + (1 - p) * 120 + q * 160, top: by, width: bw, height: bh, borderRadius: 30, background: cardBg, boxShadow: cardShadow(24, 0.6), opacity: c01(p * 2) * (1 - q), filter: p < 1 ? `blur(${(1 - p) * 8}px)` : undefined, transform: `rotate(${(1 - p) * 2}deg)`}}>
      <div style={{position: 'absolute', left: pad, top: pad, width: w, height: h, borderRadius: 18, overflow: 'hidden', background: '#e9edf3'}}>
        <div style={{...full, transformOrigin: '0 0', transform: `translate(${tx}px, ${ty}px) scale(${sc})`}}>
          {clips.map((k, i) => (
            <Sequence key={i} from={f(k.from)} durationInFrames={Math.max(1, f(k.to) - f(k.from))} layout="none">
              {k.img ? <Img src={staticFile(k.img)} style={full} />
                : <OffthreadVideo src={staticFile(src)} startFrom={Math.round((k.rec ?? 0) * 30)} playbackRate={k.rate ?? 1} muted style={full} />}
            </Sequence>
          ))}
          {children}
        </div>
      </div>
    </div>
  );
};

// ── 手画圈 ──（放在 RecCard 里面，r 是录屏像素坐标 [x, y, 宽, 高]）
export const HRing: React.FC<{c: Ctx; at: number; out: number; r: [number, number, number, number]; label?: string; sw?: number; lx?: number}> = ({c, at, out, r, label, sw = 7, lx}) => {
  const p = c.R(at, 12, EASE.out), q = c.R(out, 8, EASE.exit);
  if (p <= 0 || q >= 1) return null;
  const [x, y, w, h] = r, W2 = w + 50, H2 = h + 36;
  return (
    <div style={{position: 'absolute', left: x - 25, top: y - 18, width: W2, height: H2, opacity: 1 - q}}>
      <svg width={W2} height={H2} viewBox={`0 0 ${W2} ${H2}`} style={{overflow: 'visible'}}><ellipse cx={W2 / 2} cy={H2 / 2} rx={W2 / 2 - 4} ry={H2 / 2 - 4} fill="rgba(255,220,122,0.18)" stroke={LK.accent} strokeWidth={sw} strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - p} transform={`rotate(-3 ${W2 / 2} ${H2 / 2})`} /></svg>
      {label && <div style={{position: 'absolute', left: lx ?? W2 - 30, top: -46, padding: '6px 18px', borderRadius: 14, background: LK.accent, ...big(30, '#fff'), transform: `rotate(-4deg) scale(${c.R(at + 0.25, 10, EASE.overshoot)})`, transformOrigin: '0 100%', boxShadow: cardShadow(8, 0.4)}}>{label}</div>}
    </div>
  );
};

// ── 章节路线图 ──
// stops：每一站 {u: 在路上的位置 0–1, n: 编号, s: 站名（几个字）}；goal：终点小旗上的字；who：走的人（默认"我"）
// 和 Kit.tsx 的关卡地图（MapPanel，讲"坑"）是同一招的另一种讲法：这里讲"几步走到终点"。
export type Stop = {u: number; n: string; s: string};
export const routePoint = (u: number): [number, number] => [60 + 620 * u, 560 - 250 * (u * u * (3 - 2 * u)) + 22 * Math.sin(u * Math.PI * 2)];
const ROUTE_D = Array.from({length: 81}, (_, i) => routePoint(i / 80)).map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
export const RouteMap: React.FC<{stops: Stop[]; goal: string; who?: string; tokenU: number; hop?: number; done: number[]; cur?: number; glow?: number; title?: React.ReactNode; flagHit?: number}> = ({stops, goal, who = '我', tokenU, hop = 0, done, cur = -1, glow = 0, title, flagHit = 0}) => {
  const [tx, ty] = routePoint(tokenU), [ex, ey] = routePoint(1);
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: 740, height: 660}}>
      {title}
      <svg width="740" height="660" style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
        <path d={ROUTE_D} fill="none" stroke="rgba(58,42,24,0.10)" strokeWidth="84" strokeLinecap="round" transform="translate(0,10)" style={{filter: 'blur(8px)'}} />
        <path d={ROUTE_D} fill="none" stroke="#fffdf9" strokeWidth="76" strokeLinecap="round" />
        <path d={ROUTE_D} fill="none" stroke="rgba(240,103,42,0.35)" strokeWidth="4" strokeLinecap="round" strokeDasharray="2 20" />
        {glow > 0 && <path d={ROUTE_D} fill="none" stroke={LK.accent} strokeWidth="7" strokeLinecap="round" pathLength={1} strokeDasharray={`${glow} 1`} opacity={0.9} />}
      </svg>
      <div style={{position: 'absolute', left: ex - 30, top: ey - 118, transform: `scale(${1 + 0.25 * Math.sin(Math.PI * c01(flagHit))})`, transformOrigin: '6px 94px'}}>
        <svg width="40" height="96" viewBox="0 0 40 96"><path d="M6 4 V94" stroke={LK.ink} strokeWidth="5" strokeLinecap="round" /><path d="M8 6 L38 18 L8 32 Z" fill={flagHit > 0.3 ? GREEN : LK.accent} /></svg>
        <div style={{position: 'absolute', left: -120, top: -54, padding: '8px 18px', borderRadius: 14, background: cardBg, boxShadow: cardShadow(10, 0.5), ...big(32)}}>{goal}</div>
      </div>
      {stops.map((st, i) => { const [x, y] = routePoint(st.u), d = done[i] ?? 0, isCur = i === cur; return (
        <React.Fragment key={i}>
          <div style={{position: 'absolute', left: x - 34, top: y - 34, width: 68, height: 68, borderRadius: '50%', background: d > 0.5 ? GREEN : '#fff', border: `5px solid ${d > 0.5 ? GREEN : isCur ? LK.accent : 'rgba(40,30,20,0.18)'}`, boxSizing: 'border-box', boxShadow: `${isCur ? `0 0 0 10px rgba(240,103,42,0.18), ` : ''}${cardShadow(8, 0.4)}`, display: 'flex', alignItems: 'center', justifyContent: 'center', ...big(26, d > 0.5 ? '#fff' : LK.ink)}}>{d > 0.5 ? '✓' : st.n}</div>
          <div style={{position: 'absolute', left: x - 70, top: y + 44, width: 140, textAlign: 'center', ...big(30, isCur ? LK.accent : LK.ink)}}>{st.s}</div>
        </React.Fragment>); })}
      <div style={{position: 'absolute', left: tx - 50, top: ty - 112 - hop}}>
        <div style={{width: 100, height: 100, borderRadius: '50%', background: '#fff', border: `6px solid ${LK.accent}`, boxSizing: 'border-box', boxShadow: cardShadow(12, 0.6), display: 'flex', alignItems: 'center', justifyContent: 'center', ...big(36)}}>{who}</div>
      </div>
      <div style={{position: 'absolute', left: tx - 28, top: ty - 6, width: 56, height: 14, borderRadius: '50%', background: 'rgba(58,42,24,0.22)', filter: 'blur(4px)', opacity: 1 - hop / 40}} />
    </div>
  );
};

// 章节开场：路线图出现 → "我"从上一站走到第 i 站 → 编号和大标题落下（hi 那几个字带黄色高亮）→ 收走。放在右边舞台，人物在左边窗里。
export const ChapterOpen: React.FC<{c: Ctx; at: number; out: number; i: number; stops: Stop[]; goal: string; who?: string; title: string; hi: string; done: number[]}> = ({c, at, out, i, stops, goal, who, title, hi, done}) => {
  const p = c.R(at, 14, EASE.out), q = c.R(out, 10, EASE.exit);
  if (p <= 0 || q >= 1) return null;
  const from = i === 0 ? 0.02 : stops[i - 1].u, walk = EASE.smooth(c01((c.t - at - 0.15) / 0.7)), u = mix(from, stops[i].u, walk);
  const hop = walk > 0 && walk < 1 ? Math.abs(Math.sin(walk * Math.PI * 3)) * 16 : 0, ti = c.R(at + 0.75, 12, EASE.out), hl = c.R(at + 1.0, 12, EASE.out);
  return (
    <div style={{position: 'absolute', left: 1130 + q * 200, top: 168, width: 740, height: 660, opacity: c01(p * 2) * (1 - q)}}>
      <div style={{position: 'absolute', left: 0, top: 120, width: 740, height: 540, transformOrigin: '50% 100%', transform: `scale(${0.9 + 0.1 * p})`}}>
        <div style={{position: 'absolute', left: 0, top: -120, width: 740, height: 660, transform: 'scale(0.92)', transformOrigin: '50% 60%'}}>
          <RouteMap stops={stops} goal={goal} who={who} tokenU={u} hop={hop} done={done} cur={i} glow={u} />
        </div>
      </div>
      {ti > 0 && <div style={{position: 'absolute', left: 10, top: 0, opacity: c01(ti * 2), transform: `translateY(${(1 - ti) * 40}px)`, filter: ti < 1 ? `blur(${(1 - ti) * 8}px)` : undefined}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 16}}><span style={big(60, LK.accent)}>{stops[i].n}</span><span style={{height: 4, width: 130 * ti, background: LK.accent, borderRadius: 2}} /></div>
        <div style={{marginTop: 10, ...big(76)}}>{title}<span style={{position: 'relative', display: 'inline-block'}}><span style={{position: 'absolute', left: -6, bottom: 6, height: 40, width: `calc(${hl * 100}% + ${12 * hl}px)`, background: LK.hi, borderRadius: 8}} /><span style={{position: 'relative'}}>{hi}</span></span></div>
      </div>}
    </div>
  );
};
