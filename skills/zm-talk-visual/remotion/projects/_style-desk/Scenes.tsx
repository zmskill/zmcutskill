// 书桌风格的"一场一场"：content.ts 里每一项写 type 和参数，这里负责画出来。
// 每种 type 都来自原片成片里认可过的做法（见 styles/desk/STYLE.md《好在哪》），动作和参数照原片代码，不要随手改。
import React from 'react';
import {Img, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {BookmarkTap} from '../_koubo-kit/KouboShots';
import {Ctx as KCtx} from '../_koubo-kit/Kit';
import {Chip, Ctx, D, EASE, Headline, Highlight, Note, Obj, PaperCard, Person, Phone, PopOut, Print, PriceTag, Ring, ScreenImg, Small, XShell, at, c01, hOf, mix, srcOf} from './Kit';

type Box = [number, number, number, number];
type PopSpec = {box: Box; at: number; to: [number, number]; k: number; out?: number; dim?: boolean;
  ring?: {x: number; y: number; w: number; h: number; at: number; sw?: number; seed?: number};          // 圈：在拿起来的那块里，按原图像素写
  highlight?: {x: number; y: number; w: number; h: number; at: number}};                                // 荧光笔：同上
type RingSpec = {ix: number; iy: number; w: number; h: number; at: number; sw?: number; seed?: number; rot?: number}; // 圈：中心按原图像素，宽高按屏幕像素
export type Item =
  | {type: 'headline'; at: number; out?: number; x: number; y: number; text: string; size: number; col?: string; rot?: number; hand?: boolean; outline?: boolean; num?: boolean}   // num：数字用 Fraunces 斜体（价格、后台数字）；字的右边别超过 x=1032
  | {type: 'small'; at: number; out?: number; x: number; y: number; text: string; size?: number; col?: string; rot?: number}
  | {type: 'note'; at: number; out?: number; x: number; y: number; text: string; size?: number; rot?: number; bg?: string}
  // 一张证据：手机（phone）或冲印照片（print），从右边换上来，放正中；pops = 说到时把哪几条拿起来
  | {type: 'shot'; kind: 'phone' | 'print'; src: string; iw: number; ih: number; x: number; y: number; w: number; rot?: number; in: number; out: number; from?: 'right' | 'bottom'; tape?: boolean;
      pops?: PopSpec[]; rings?: RingSpec[]; push?: {focus?: [number, number]; from: number; to: number; k: number}; items?: Item[]}
  // 一组截图落在桌上（扇形）；pop = 其中一张上拿起来的那条（画在所有截图上面）
  | {type: 'fan'; cards: {src: string; iw: number; ih: number; x: number; y: number; w: number; rot: number; at: number; tape?: boolean}[]; out: number; dur?: number; pop?: PopSpec & {card: number}}
  // 只拿起来一块，不放整张（比如后台的一小块数据）
  | {type: 'pop'; src: string; o: Obj; spec: PopSpec}
  | {type: 'tag'; at: number; out: number; x: number; y: number; price: string; label: string; crossAt?: number; big?: boolean; rot?: number; red?: boolean; sink?: {at: number; dy: number}}
  | {type: 'line'; at: number; out: number; d: string; col?: string}                                     // 手画的一条线 / 箭头身
  | {type: 'split'; at: number; out: number; label?: string}                                              // 一张卡分成 2、4、8 张
  | {type: 'stamp'; at: number; out: number; x: number; y: number; text: string; size: number; col?: string}  // 大字砸下来
  | {type: 'card'; at: number; out: number; y: number; title: string; tint: string; on: [number, number, number, number][]; items: Item[]}  // 索引卡；on = [亮起, 退暗, 亮起用时, 退暗用时]
  | {type: 'chip'; at: number; text: string; x: number; y: number; bg?: string; rot?: number; size?: number; out?: number}
  | {type: 'thought'; x: number; y: number; w: number; lines: {text: string; at: number; col?: string; size?: number}[]; dots: [number, number]; dotsAt: number; out?: number}
  | {type: 'swap'; a: {text: string; at: number}; strikeAt: number; lead: {text: string; at: number}; b: {text: string; at: number}; out: number}  // "价格卷到底" 划掉 → "服务"
  | {type: 'checklist'; in: number; out: number; title: string; titleRed: string; points: {at: number; n: string; title: string; quote: string; quote2?: {text: string; at: number}; checkAt: number; y: number}[]}
  | {type: 'pages'; title: string; pages: {at: number; out: number; step: string; rows: [string, string][]}[]; badge?: {at: number; out: number; text: string}}
  | {type: 'loop'; at: number; out: number; nodes: {at: number; label: string}[]; closeAt: number}
  | {type: 'stairs'; out: number; steps: {at: number; label: string}[]}
  | {type: 'grid'; at: number; crossAt: number; winAt: number; n?: number; win: string}
  | {type: 'quote'; in: number; out: number; lines: {text: string; at: number; size: number}[]; by: {text: string; at: number}}
  | {type: 'bookmark'; at: number; tapAt: number; out: number; x: number; y: number; size?: number}
  // 录屏放进一部手机：in 时换上来并开始播，rate 倍速，播完停在最后一帧（still = 录屏最后一帧的截图）；rings 按录屏像素（中心）+ 屏幕宽高
  | {type: 'rec'; src: string; still: string; iw: number; ih: number; dur: number; x: number; y: number; w: number; rot?: number; in: number; out: number; rate?: number; from?: 'right' | 'bottom';
      rings?: {ix: number; iy: number; w: number; h: number; at: number; seed?: number; sw?: number}[]};

export type Segment = {id: string; from: number; to: number; person: [number, string][]; drift?: {k: number; dur: number; until: number}; items: Item[]};

// ── 换上来 / 拿走（和 Kit 的 Layer 一样，多一个落定后慢慢推近）──
const Slide: React.FC<{c: Ctx; inAt: number; outAt: number; from?: 'right' | 'bottom'; push?: {focus?: [number, number]; from: number; to: number; k: number}; children: React.ReactNode}> = ({c, inAt, outAt, from = 'right', push, children}) => {
  const p = c.R(inAt, 15, EASE.snappy), q = c.R(outAt, 12, EASE.swift);
  if (p <= 0 || q >= 1) return null;
  const dx = from === 'right' ? (1 - p) * 760 : 0, dy = from === 'bottom' ? (1 - p) * 1000 : 0;
  const pk = push ? 1 + (push.k - 1) * EASE.smooth(c01((c.t - push.from) / (push.to - push.from))) : 1, fo = push?.focus ?? [540, 860];
  return <div style={{position: 'absolute', inset: 0, transformOrigin: `${fo[0]}px ${fo[1]}px`, transform: `translate(${dx - q * 900}px, ${dy}px) scale(${(0.96 + 0.04 * p - 0.04 * q) * pk})`, opacity: c01(p * 2.5) * (1 - c01(q * 1.6))}}>{children}</div>;
};
const Pop: React.FC<{c: Ctx; o: Obj; src: string; s: PopSpec}> = ({c, o, src, s}) => (
  <PopOut c={c} o={o} src={src} box={s.box} at={s.at} to={s.to} k={s.k} out={s.out} dim={s.dim ?? true}>
    {(sc) => <>
      {s.highlight && <div style={{position: 'absolute', left: (s.highlight.x - s.box[0]) * sc, top: (s.highlight.y - s.box[1]) * sc, width: s.highlight.w * sc, height: s.highlight.h * sc, background: D.butter, mixBlendMode: 'multiply', transformOrigin: '0 50%', transform: `scaleX(${c.R(s.highlight.at, 14, EASE.out)})`}} />}
      {s.ring && <Ring x={(s.ring.x - s.box[0]) * sc} y={(s.ring.y - s.box[1]) * sc} w={s.ring.w * sc} h={s.ring.h * sc} p={c.R(s.ring.at, 12, EASE.out)} seed={s.ring.seed ?? 4} sw={s.ring.sw ?? 5} />}
    </>}
  </PopOut>
);

const Split: React.FC<{c: Ctx; at: number; out: number; label: string}> = ({c, at: t, out, label}) => {
  const q = c.R(out, 12, EASE.swift);
  if (c.t < t - 0.1 || q >= 1) return null;
  const rows = [1, 2, 4, 8], X0 = 560, X1 = 1040, ys = [520, 760, 990, 1210], ws = [240, 200, 116, 56];
  const pos = (r: number, i: number) => [X0 + ((i + 0.5) / rows[r]) * (X1 - X0), ys[r]];
  return (
    <div style={{position: 'absolute', inset: 0, opacity: 1 - c01(q * 1.6), transform: `translateX(${-q * 900}px)`}}>
      <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={1} height={1}>
        {rows.slice(1).map((n, r) => Array.from({length: n}).map((_, i) => { const [x, y] = pos(r + 1, i), [px, py] = pos(r, Math.floor(i / 2)), k = c.R(t + (r + 1) * 0.3 - 0.05, 10, EASE.out);
          return <path key={`${r}-${i}`} d={`M${px},${py + 30} L${x},${y - 30}`} stroke="rgba(58,42,34,0.35)" strokeWidth={4} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - k} />; }))}
      </svg>
      {rows.map((n, r) => Array.from({length: n}).map((_, i) => {
        const k = c.R(t + r * 0.3, 11, EASE.overshoot);
        if (k <= 0) return null;
        const [x, y] = pos(r, i), w = ws[r], h = w * 0.58;
        return <div key={`${r}-${i}`} style={{position: 'absolute', left: x - w / 2, top: y - h / 2, width: w, height: h, background: r === 0 ? '#fbe7a6' : D.paper, borderRadius: 8, boxShadow: '5px 8px 14px rgba(74,48,26,0.2)',
          transform: `scale(${0.4 + 0.6 * k}) rotate(${((i % 3) - 1) * 3}deg)`, opacity: c01(k * 2), display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: D.hand, fontWeight: 700, fontSize: w * 0.2, color: D.ink}}>{w > 100 ? label : ''}</div>;
      }))}
    </div>
  );
};

const Check: React.FC<{p: number; x: number; y: number}> = ({p, x, y}) => p <= 0 ? null : (
  <svg style={{position: 'absolute', left: x, top: y, overflow: 'visible'}} width={70} height={70} viewBox="0 0 40 40"><path d="M5 21 L16 32 L36 7" fill="none" stroke={D.red} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - c01(p)} /></svg>
);

export const Items: React.FC<{c: Ctx; items: Item[]}> = ({c, items}) => <>{items.map((it, i) => <One key={i} c={c} it={it} />)}</>;

const One: React.FC<{c: Ctx; it: Item}> = ({c, it}) => {
  switch (it.type) {
    case 'headline': {
      // 竖屏右边留白：字的右边超过 1032 像素会贴边（两轮盲审都挑出来过）。按字数估一下，超了在渲染日志里提醒
      const wEst = [...it.text].reduce((a, ch) => a + (/[\u0000-\u00ff]/.test(ch) ? 0.58 : 1.02), 0) * it.size;
      if (it.x + wEst > 1032 && c.f === Math.round(c.F(it.at))) console.warn(`[desk] headline「${it.text}」右边约到 ${Math.round(it.x + wEst)}px，超过 1032`);
      return <Headline c={c} at={it.at} out={it.out} x={it.x} y={it.y} text={it.text} size={it.size} col={it.col} rot={it.rot} outline={it.outline} font={it.hand ? D.hand : it.num ? D.num : undefined} weight={it.hand ? 700 : undefined} italic={it.num} />;
    }
    case 'small': return <Small c={c} at={it.at} out={it.out ?? 1e9} x={it.x} y={it.y} text={it.text} size={it.size} col={it.col} rot={it.rot} />;
    case 'note': return <Note c={c} at={it.at} out={it.out} x={it.x} y={it.y} text={it.text} size={it.size} rot={it.rot} bg={it.bg} />;
    case 'chip': {
      const chip = <Chip c={c} at={it.at} text={it.text} x={it.x} y={it.y} bg={it.bg} rot={it.rot} size={it.size} />;
      if (it.out === undefined) return chip;   // 不写 out 就一直留着（卡片里的标签跟着卡片走）
      const q = c.R(it.out, 9, EASE.exit);
      return q >= 1 ? null : <div style={{position: 'absolute', inset: 0, opacity: 1 - q, transform: `translateY(${q * 30}px)`}}>{chip}</div>;
    }
    case 'shot': {
      const o: Obj = {x: it.x, y: it.y, w: it.w, iw: it.iw, ih: it.ih, rot: it.rot ?? 0, kind: it.kind};
      return (
        <Slide c={c} inAt={it.in} outAt={it.out} from={it.from} push={it.push}>
          {it.kind === 'phone' ? <Phone o={o}><ScreenImg src={it.src} o={o} /></Phone> : <Print o={o} src={it.src} tape={it.tape ?? true} />}
          {(it.rings ?? []).map((r, k) => { const [x, y] = at(o, r.ix, r.iy); return <Ring key={k} x={x} y={y} w={r.w} h={r.h} p={c.R(r.at, 12, EASE.out)} rot={r.rot ?? o.rot} seed={r.seed ?? k + 3} sw={r.sw ?? 9} />; })}
          {(it.pops ?? []).map((s, k) => <Pop key={k} c={c} o={o} src={it.src} s={s} />)}
          {it.items && <Items c={c} items={it.items} />}
        </Slide>
      );
    }
    case 'rec': {
      const o: Obj = {x: it.x, y: it.y, w: it.w, iw: it.iw, ih: it.ih, rot: it.rot ?? 0, kind: 'phone'};
      const rate = it.rate ?? 1, f0 = Math.round(c.F(it.in)), playF = Math.floor((it.dur / rate) * 30) - 1, s = it.w / it.iw;
      return (
        <Slide c={c} inAt={it.in} outAt={it.out} from={it.from}>
          <Phone o={o}>
            {c.f - f0 < playF
              ? <Sequence from={f0} layout="none"><OffthreadVideo src={srcOf(it.src)} playbackRate={rate} muted style={{position: 'absolute', left: 0, top: 0, width: it.w, height: hOf(o)}} /></Sequence>
              : <Img src={srcOf(it.still)} style={{position: 'absolute', left: 0, top: 0, width: it.w, height: hOf(o)}} />}
          </Phone>
          {(it.rings ?? []).map((r, k) => <Ring key={k} x={it.x + (r.ix - it.iw / 2) * s} y={it.y + (r.iy - it.ih / 2) * s} w={r.w} h={r.h} p={c.R(r.at, 12, EASE.out)} seed={r.seed ?? 21 + k} sw={r.sw ?? 6} rot={it.rot ?? 0} />)}
        </Slide>
      );
    }
    case 'fan': {
      const dur = it.dur ?? 12;
      return (
        <>
          {it.cards.map((cd, i) => {
            const p = c.R(cd.at, dur, EASE.overshoot), q = c.R(it.out, 12, EASE.swift);
            if (p <= 0 || q >= 1) return null;
            const o: Obj = {x: cd.x, y: cd.y, w: cd.w, iw: cd.iw, ih: cd.ih, rot: cd.rot, kind: 'print'};
            return <div key={i} style={{position: 'absolute', inset: 0, transform: `translateY(${(1 - p) * -120}px) scale(${1.08 - 0.08 * p}) translateX(${-q * 900}px)`, opacity: c01(p * 2) * (1 - c01(q * 1.6)), transformOrigin: `${cd.x}px ${cd.y}px`}}>
              <Print o={o} src={cd.src} tape={cd.tape ?? false} />
            </div>;
          })}
          {it.pop && (() => { const cd = it.cards[it.pop.card]; const o: Obj = {x: cd.x, y: cd.y, w: cd.w, iw: cd.iw, ih: cd.ih, rot: cd.rot, kind: 'print'}; return <Pop c={c} o={o} src={cd.src} s={it.pop} />; })()}
        </>
      );
    }
    case 'pop': return <Pop c={c} o={it.o} src={it.src} s={it.spec} />;
    case 'tag': {
      const sink = it.sink ? c.R(it.sink.at, 40, EASE.smooth) : 0;
      const tag = <PriceTag c={c} at={it.at} out={it.out} x={it.x} y={it.y} price={it.price} label={it.label} crossAt={it.crossAt} big={it.big} rot={it.rot} red={it.red} />;
      return it.sink ? <div style={{position: 'absolute', inset: 0, transform: `translateY(${sink * it.sink.dy}px)`, opacity: 1 - 0.5 * sink}}>{tag}</div> : tag;
    }
    case 'line': {
      if (c.t < it.at || c.t > it.out) return null;
      const p = c.R(it.at + 0.1, 12, EASE.out);
      return <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: 1 - c.R(it.out - 0.15, 8)}} width={1} height={1}><path d={it.d} fill="none" stroke={it.col ?? D.ink} strokeWidth={6} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} /></svg>;
    }
    case 'split': return <Split c={c} at={it.at} out={it.out} label={it.label ?? '邀请码'} />;
    case 'stamp': {
      const p = c.R(it.at, 9, EASE.overshoot), q = c.R(it.out, 8, EASE.exit);
      return p > 0 && q < 1 ? <div style={{position: 'absolute', left: it.x, top: it.y, whiteSpace: 'nowrap', fontFamily: D.serif, fontWeight: 900, fontSize: it.size, color: it.col ?? D.red, lineHeight: 1, transform: `scale(${1.6 - 0.6 * p}) rotate(-4deg)`, transformOrigin: 'left center', opacity: c01(p * 2) * (1 - q), mixBlendMode: 'multiply'}}>{it.text}</div> : null;
    }
    case 'card': {
      const p = c.R(it.at, 15, EASE.snappy), q = c.R(it.out, 12, EASE.swift);
      if (p <= 0 || q >= 1) return null;
      const a = Math.min(1, it.on.reduce((m, [x, y, r, f]) => m + c01((c.t - x) / r) * (1 - c01((c.t - y) / f)), 0));
      return (
        <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, transform: `translateX(${(1 - p) * 800 - q * 900}px)`, opacity: c01(p * 2.5) * (1 - c01(q * 1.6))}}>
          <div style={{position: 'absolute', inset: 0, opacity: 0.45 + 0.55 * a, filter: a < 0.5 ? `saturate(${0.5 + a})` : undefined, transform: `scale(${0.97 + 0.03 * a})`, transformOrigin: `540px ${it.y + 330}px`}}>
            <PaperCard x={70} y={it.y} w={940} h={660} rot={it.y < 600 ? -1.2 : 1} lines />
            <div style={{position: 'absolute', left: 110, top: it.y - 30, padding: '10px 30px', background: it.tint, borderRadius: 8, fontFamily: D.serif, fontWeight: 900, fontSize: 68, color: '#fff', transform: 'rotate(-3deg)', boxShadow: '4px 6px 12px rgba(74,48,26,0.2)'}}>{it.title}</div>
            <Items c={c} items={it.items} />
          </div>
        </div>
      );
    }
    case 'thought': {
      const p = c.R(it.lines[0].at - 0.2, 14, EASE.overshoot), qo = it.out !== undefined ? c.R(it.out, 10, EASE.exit) : 0;
      if (p <= 0 || qo >= 1) return null;
      const dots = [0, 1, 2].map((i) => c.R(it.dotsAt + i * 0.08, 8, EASE.out));
      return (
        <div style={{position: 'absolute', inset: 0, opacity: 1 - qo}}>
          {dots.map((d, i) => <div key={i} style={{position: 'absolute', left: it.dots[0] + i * 40, top: it.dots[1] - i * 45, width: 24 + i * 12, height: 24 + i * 12, borderRadius: '50%', background: '#fffdf8', boxShadow: '4px 6px 12px rgba(74,48,26,0.2)', opacity: d, transform: `scale(${d})`}} />)}
          <div style={{position: 'absolute', left: it.x, top: it.y, width: it.w, padding: '42px 44px', background: '#fffdf8', borderRadius: 120, boxShadow: '10px 16px 34px rgba(74,48,26,0.22)', transform: `scale(${0.7 + 0.3 * p})`, transformOrigin: '10% 100%', opacity: c01(p * 2),
            fontFamily: D.hand, fontWeight: 700, fontSize: 56, color: D.ink, lineHeight: 1.35, textAlign: 'center'}}>
            {it.lines.map((l, k) => <React.Fragment key={k}>{k > 0 && <br />}<span style={{color: l.col, fontSize: l.size, opacity: c.R(l.at, 8)}}>{l.text}</span></React.Fragment>)}
          </div>
        </div>
      );
    }
    case 'swap': {
      if (c.t >= it.out + 0.65) return null;
      const sp = c.R(it.strikeAt, 14, EASE.swift);
      return (
        <>
          <div style={{position: 'absolute', left: 90, top: 380 - 200 * sp, transform: `scale(${1 - 0.45 * sp})`, transformOrigin: 'left top', opacity: 1 - c.R(it.out, 8)}}>
            <Headline c={c} at={it.a.at} x={0} y={0} text={it.a.text} size={150} />
            {sp > 0 && <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={1} height={1}><path d="M-10,90 L770,70" stroke={D.red} strokeWidth={12} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - sp} /></svg>}
          </div>
          <Small c={c} at={it.lead.at} out={it.out} x={100} y={380} text={it.lead.text} size={64} />
          <Headline c={c} at={it.b.at} out={it.out} x={90} y={470} text={it.b.text} size={300} col={D.red} />
        </>
      );
    }
    case 'checklist': {
      const p = c.R(it.in, 15, EASE.snappy), q = c.R(it.out, 12, EASE.swift);
      if (p <= 0 || q >= 1) return null;
      return (
        <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, transform: `translateY(${(1 - p) * 1100}px) translateX(${-q * 900}px)`, opacity: 1 - c01(q * 1.6)}}>
          <PaperCard x={60} y={110} w={960} h={1480} rot={-0.8} lines />
          <div style={{position: 'absolute', left: 120, top: 150, fontFamily: D.serif, fontWeight: 900, fontSize: 80, color: D.ink}}>{it.title}<span style={{color: D.red}}>{it.titleRed}</span></div>
          {it.points.map((pt, k) => {
            const pp = c.R(pt.at, 12, EASE.out);
            if (pp <= 0) return null;
            return (
              <div key={k} style={{position: 'absolute', left: 120, top: pt.y, width: 840, opacity: pp, transform: `translateY(${(1 - pp) * 20}px)`}}>
                <div style={{display: 'flex', alignItems: 'baseline', gap: 18}}>
                  <span style={{fontFamily: D.num, fontWeight: 900, fontStyle: 'italic', fontSize: 76, color: D.red}}>{pt.n}</span>
                  <span style={{fontFamily: D.serif, fontWeight: 900, fontSize: 54, color: D.ink, whiteSpace: 'nowrap'}}>{pt.title}</span>
                </div>
                <div style={{marginTop: 10, marginLeft: 70, padding: '14px 22px', borderLeft: `6px solid ${D.red}`, background: 'rgba(251,231,166,0.45)', fontFamily: D.hand, fontWeight: 700, fontSize: 40, color: D.ink2, lineHeight: 1.4, opacity: c.R(pt.at + 0.25, 12)}}>
                  {pt.quote}{pt.quote2 && <><br /><span style={{opacity: c.R(pt.quote2.at, 10)}}>{pt.quote2.text}</span></>}
                </div>
                <Check p={c.R(pt.checkAt, 10, EASE.out)} x={800} y={60} />
              </div>
            );
          })}
        </div>
      );
    }
    case 'pages': return (
      <>
        {it.pages.map((pg, i) => {
          const p = c.R(pg.at, 14, EASE.snappy), q = c.R(pg.out, 12, EASE.swift);
          if (p <= 0 || q >= 1) return null;
          return (
            <div key={i} style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, transform: `translateX(${(1 - p) * 900 - q * 60}px) rotate(${(1 - p) * 4}deg)`, transformOrigin: '540px 1700px', opacity: c01(p * 3)}}>
              <PaperCard x={50} y={110} w={980} h={1500} rot={i % 2 ? 0.6 : -0.6} />
              <div style={{position: 'absolute', left: 100, top: 150, right: 100, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
                <span style={{fontFamily: D.serif, fontWeight: 900, fontSize: 64, color: D.ink}}>{it.title}</span>
                <span style={{fontFamily: D.hand, fontWeight: 700, fontSize: 38, color: D.ink2}}>{pg.step}　<span style={{fontFamily: D.num, fontStyle: 'italic', fontWeight: 900, color: D.red}}>{i + 1}/{it.pages.length}</span></span>
              </div>
              <div style={{position: 'absolute', left: 100, top: 260, width: 880, height: 2, background: 'rgba(58,42,34,0.15)'}} />
              <div style={{position: 'absolute', left: 100, top: 290, width: 880, display: 'flex', flexDirection: 'column', gap: 30}}>
                {pg.rows.map(([tag, txt], k) => (
                  <div key={k}>
                    <span style={{display: 'inline-block', padding: '4px 16px', background: k % 2 ? '#f6d4cf' : '#fbe7a6', borderRadius: 6, fontFamily: D.sans, fontWeight: 700, fontSize: 30, color: D.ink}}>{tag}</span>
                    <div style={{marginTop: 8, fontFamily: D.hand, fontWeight: 700, fontSize: 37, lineHeight: 1.42, color: D.ink}}>{txt}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        {it.badge && (() => { const b = it.badge, p = c.R(b.at, 10, EASE.overshoot), q = c.R(b.out, 8); return p > 0 && q < 1 ? (
          <div style={{position: 'absolute', right: 70, top: 1520, padding: '12px 26px', background: D.red, color: '#fff', borderRadius: 999, fontFamily: D.sans, fontWeight: 700, fontSize: 38, transform: `scale(${p}) rotate(-3deg)`, opacity: 1 - q}}>{b.text}</div>) : null; })()}
      </>
    );
    case 'loop': {
      const q = c.R(it.out, 12, EASE.swift);
      if (c.t < it.at - 0.3 || q >= 1) return null;
      const cx = 540, cy = 1000, rx = 330, ry = 400, draw = c.R(it.at, 30, EASE.smooth), close = c.R(it.closeAt, 14, EASE.out);
      const n = it.nodes.length, angs = n <= 4 ? [-90, 0, 90, 180] : it.nodes.map((_, i) => -90 + (360 / n) * i);   // 4 个以内照原片；5 个以上沿圈均分
      return (
        <div style={{position: 'absolute', inset: 0, opacity: 1 - c01(q * 1.6), transform: `translateX(${-q * 900}px)`}}>
          <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={1080} height={1920}>
            <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none" stroke="rgba(58,42,34,0.35)" strokeWidth={6} strokeDasharray="18 16" pathLength={1000} opacity={draw} />
            {close > 0 && <path d={`M${n <= 4 ? cx - rx : cx + rx * Math.cos((angs[n - 1] * Math.PI) / 180)},${n <= 4 ? cy : cy + ry * Math.sin((angs[n - 1] * Math.PI) / 180)} A${rx},${ry} 0 0 1 ${cx},${cy - ry}`} fill="none" stroke={D.red} strokeWidth={10} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - close} />}
            {close > 0.9 && <path d={`M${cx - 30},${cy - ry - 26} L${cx + 6},${cy - ry} L${cx - 30},${cy - ry + 26}`} fill="none" stroke={D.red} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />}
          </svg>
          {it.nodes.map((nd, i) => {
            const p = c.R(nd.at - 0.05, 12, EASE.overshoot);
            if (p <= 0) return null;
            const last = i === it.nodes.length - 1, a = (angs[i % angs.length] * Math.PI) / 180, x = cx + rx * Math.cos(a), y = cy + ry * Math.sin(a), on = last ? 1 : 1 - 0.4 * c01((c.t - (it.nodes[i + 1]?.at ?? 1e9)) / 0.3);
            return <div key={i} style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) scale(${(0.6 + 0.4 * p) * (0.92 + 0.08 * on)}) rotate(${(i % 2 ? 3 : -3)}deg)`, padding: '20px 30px', background: last ? D.red : ['#fbe7a6', '#f6d4cf', '#d9e6f5'][i % 3], color: last ? '#fff' : D.ink,
              borderRadius: 10, fontFamily: D.hand, fontWeight: 700, fontSize: 56, whiteSpace: 'nowrap', boxShadow: '8px 12px 22px rgba(74,48,26,0.22)', opacity: c01(p * 2) * (0.55 + 0.45 * on)}}>
              <span style={{fontFamily: D.num, fontStyle: 'italic', fontWeight: 900, marginRight: 12, opacity: 0.7}}>{i + 1}</span>{nd.label}</div>;
          })}
        </div>
      );
    }
    case 'stairs': {
      const q = c.R(it.out, 12, EASE.swift);
      if (c.t < it.steps[0].at - 0.2 || q >= 1) return null;
      return (
        <div style={{position: 'absolute', inset: 0, opacity: 1 - c01(q * 1.6), transform: `translateX(${-q * 900}px)`}}>
          {it.steps.map((st, i) => {
            const p = c.R(st.at, 13, EASE.overshoot);
            if (p <= 0) return null;
            const last = i === it.steps.length - 1, w = 300, h = 220 + i * 230, x = 90 + i * 310, y = 1540 - h;
            return <div key={i} style={{position: 'absolute', left: x, top: y + (1 - p) * 200, width: w, height: h, background: last ? D.red : D.paper, borderRadius: 10, boxShadow: '10px 14px 26px rgba(74,48,26,0.2)', opacity: c01(p * 2),
              display: 'flex', justifyContent: 'center', paddingTop: 34, fontFamily: D.serif, fontWeight: 900, fontSize: 64, color: last ? '#fff' : D.ink}}>{st.label}</div>;
          })}
        </div>
      );
    }
    case 'grid': {
      if (c.t < it.at - 0.2) return null;
      const n = it.n ?? 10;
      return (
        <>
          {Array.from({length: n}).map((_, i) => {
            const p = c.R(it.at + i * 0.04, 10, EASE.overshoot), x = 110 + (i % 5) * 176, y = 640 + Math.floor(i / 5) * 200;
            const cr = i < n - 1 ? c.R(it.crossAt + i * 0.13, 7, EASE.out) : 0, win = i === n - 1 ? c.R(it.winAt, 14, EASE.overshoot) : 0;
            return (
              <div key={i} style={{position: 'absolute', left: x, top: y, width: 150, height: 150, borderRadius: 14, background: win > 0 ? `rgba(217,80,46,${win})` : D.paper, boxShadow: `6px 10px 18px rgba(74,48,26,${0.18 + win * 0.2})`,
                transform: `scale(${(0.5 + 0.5 * p) * (1 + 0.12 * win)})`, opacity: c01(p * 2)}}>
                {cr > 0 && <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={150} height={150}>
                  <path d="M30,30 L120,120" stroke={D.ink} strokeWidth={10} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - c01(cr * 2)} opacity={0.75} />
                  <path d="M120,30 L30,120" stroke={D.ink} strokeWidth={10} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - c01(cr * 2 - 1)} opacity={0.75} /></svg>}
                {win > 0 && <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: D.serif, fontWeight: 900, fontSize: 52, color: '#fff', opacity: win}}>{it.win}</div>}
                <div style={{position: 'absolute', left: 10, top: 6, fontFamily: D.num, fontStyle: 'italic', fontWeight: 900, fontSize: 30, color: win > 0 ? '#fff' : D.ink2, opacity: 0.6}}>{i + 1}</div>
              </div>
            );
          })}
        </>
      );
    }
    case 'quote': {
      const p = c.R(it.in, 14, EASE.snappy), q = c.R(it.out, 12, EASE.swift);
      if (p <= 0 || q >= 1) return null;
      let y = 640;
      return (
        <div style={{position: 'absolute', inset: 0, transform: `translateX(${(1 - p) * 800 - q * 900}px)`, opacity: c01(p * 2.5) * (1 - c01(q * 1.6))}}>
          <PaperCard x={90} y={420} w={900} h={720} rot={-1.5} />
          <div style={{position: 'absolute', left: 130, top: 360, fontFamily: D.serif, fontWeight: 900, fontSize: 300, color: D.red, opacity: 0.85, lineHeight: 1}}>“</div>
          {it.lines.map((l, k) => { const top = y; y += l.size * 1.3 * l.text.split('\n').length + 20; return <div key={k} style={{position: 'absolute', left: 170, top, fontFamily: D.serif, fontWeight: 900, fontSize: l.size, color: D.ink, lineHeight: 1.3, whiteSpace: 'pre', opacity: c.R(l.at, 10)}}>{l.text}</div>; })}
          <div style={{position: 'absolute', left: 170, top: 1180, fontFamily: D.hand, fontWeight: 700, fontSize: 52, color: D.ink2, opacity: c.R(it.by.at, 10)}}>{it.by.text}</div>
        </div>
      );
    }
    case 'bookmark':
      return c.t > it.at - 0.3 && c.t < it.out + 0.3 ? <div style={{position: 'absolute', left: it.x, top: it.y, opacity: 1 - c.R(it.out, 6)}}><BookmarkTap c={c as unknown as KCtx} at={it.at} tapAt={it.tapAt} size={it.size ?? 120} /></div> : null;
  }
  return null;
};

// 一段：桌面 + 人 + 这一段的各场 + 字幕
export const SegmentView: React.FC<{seg: Segment}> = ({seg}) => (
  <XShell t0={seg.from}>{(c) => <><Person c={c} keys={seg.person} drift={seg.drift} /><Items c={c} items={seg.items} /></>}</XShell>
);
void Img; void staticFile; void hOf; void Highlight; void mix;
