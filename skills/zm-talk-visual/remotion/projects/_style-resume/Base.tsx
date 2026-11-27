// 简历风格的通用零件：表头、下半张（一页页翻）、一张多栏的表、技能章、连线、附件、便签、弹出卡……
// 都只管"长什么样、怎么动"，写什么、什么时候写由段落文件传进来。坐标是竖屏 1080×1920。
import React from 'react';
import {AbsoluteFill, Freeze, OffthreadVideo, staticFile} from 'remotion';
import {Ctx, P, Hand, Print, Bar, HLine, VLine, CheckBox, Stamp, Clip, ImgCard, Pop as ImgPop, Underline, Ring, c01, mix, EASE, shadow} from './Kit';

export const PAST = -100;   // "早就写好了"：时刻写 PAST，一进段就是写完的样子
// 表的位置：左右 60–1020；表头 270–820（左边四行，右边照片格 700–1020）；下半张 820–1560
export const FX = {L: 60, R: 1020, T: 270, B: 1560, lab: 230, photoL: 700, head: 820, rows: [270, 407, 545, 682, 820]};
export const SW = FX.R - FX.L, SH = FX.B - FX.head;   // 下半张 960 × 740

// ── 表头骨架：标题 + 四行栏目名 + 照片格。labels 是四行的栏目名 ──
export const FormFrame: React.FC<{c: Ctx; at: number; title?: string; labels?: string[]}> = ({c, at, title = '个人履历表', labels = ['姓　名', '想说的', '适合谁', '现　在']}) => {
  const {L, R, T, B, lab, photoL, head, rows} = FX, s = (i: number) => at + i * 0.05;
  return (
    <>
      <Print c={c} at={s(0)} x={L} y={136} text={title} size={84} weight={900} ls="0.32em" />
      <HLine c={c} at={s(1)} x={L} y={246} w={R - L} t={6} col={P.navy} />
      <HLine c={c} at={s(1)} x={L} y={256} w={R - L} t={2} col={P.navy} />
      <HLine c={c} at={s(2)} x={L} y={T} w={R - L} t={4} />
      <VLine c={c} at={s(2)} x={L} y={T} h={B - T} t={4} />
      <VLine c={c} at={s(2)} x={R} y={T} h={B - T} t={4} />
      <HLine c={c} at={s(3)} x={L} y={B} w={R - L} t={4} />
      <VLine c={c} at={s(3)} x={lab} y={T} h={head - T} />
      <VLine c={c} at={s(3)} x={photoL} y={T} h={head - T} />
      {rows.slice(1, 4).map((y, i) => <HLine key={i} c={c} at={s(4 + i)} x={L} y={y} w={photoL - L} />)}
      <HLine c={c} at={s(6)} x={L} y={head} w={R - L} t={3} />
      {labels.map((t, i) => <Print key={i} c={c} at={s(5 + i)} x={L + 34} y={rows[i] + 48} text={t} size={42} />)}
    </>
  );
};

// ── 表头四行填什么。每一项 [文字, 写出来的时刻]；时刻不给 = 灰条（还没填）──
export type HeadCell = {text: string; at?: number; col?: string; size?: number};
export type HeadBox = {label: string; show?: number; tick?: number};   // 勾选框：show 出现，tick 勾上
export const HeadFill: React.FC<{c: Ctx; cells: (HeadCell | HeadBox[] | null)[]}> = ({c, cells}) => {
  const {lab, rows} = FX, x = lab + 26;
  return (
    <>
      {cells.map((cell, i) => {
        const y = rows[i];
        if (!cell) return null;
        if (Array.isArray(cell)) {
          const anyShown = cell.some((b) => b.show !== undefined && c.t >= b.show);
          return (
            <React.Fragment key={i}>
              {!anyShown && <Bar x={x + 4} y={y + 64} w={260} h={14} o={0.5} />}
              {cell.map((b, k) => b.show === undefined ? null : <CheckBox key={k} c={c} show={b.show} at={b.tick ?? 1e9} x={x - 4 + k * 226} y={y + 46} s={40} size={36} label={b.label} />)}
            </React.Fragment>
          );
        }
        const pend = cell.at === undefined || c.t < cell.at;
        return (
          <React.Fragment key={i}>
            {pend && <Bar x={x + 4} y={y + 64} w={260} h={14} o={0.5} />}
            {cell.at !== undefined && <Hand c={c} at={cell.at} x={x} y={y + (i === 0 ? 38 : 44)} text={cell.text} size={cell.size ?? (i === 0 ? 60 : 46)} col={cell.col ?? P.ink} />}
          </React.Fragment>
        );
      })}
    </>
  );
};

// ── 下半张：一页。flipAt 往上翻走；inAt 从下面翻回来盖住上一页 ──
export const Page: React.FC<{c: Ctx; flipAt?: number; inAt?: number; children: React.ReactNode; z?: number}> = ({c, flipAt = 1e9, inAt, children, z = 1}) => {
  const p = c.R(flipAt, 14, EASE.swift);
  const q = inAt === undefined ? 1 : c.R(inAt, 14, EASE.swift);
  if (p >= 1 || q <= 0) return null;
  const ang = p > 0 ? p * 88 : (1 - q) * -88;
  return (
    <div style={{position: 'absolute', left: FX.L, top: FX.head, width: SW, height: SH, perspective: 1600, zIndex: z}}>
      <div style={{position: 'absolute', inset: 0, background: P.paper, transformOrigin: p > 0 ? '50% 0%' : '50% 100%', transform: `rotateX(${ang}deg)`, boxShadow: ang !== 0 ? `0 30px 40px rgba(38,50,92,${0.25 * Math.abs(ang) / 88})` : 'none', overflow: 'hidden'}}>
        {children}
      </div>
    </div>
  );
};
export const SecHead: React.FC<{text: string; sub?: string}> = ({text, sub}) => (
  <div style={{position: 'absolute', left: 0, top: 0, right: 0, height: 80, background: 'rgba(38,50,92,0.08)', borderBottom: `3px solid ${P.line}`, display: 'flex', alignItems: 'center', paddingLeft: 34, fontFamily: P.serif, fontWeight: 900, fontSize: 44, color: P.navy, letterSpacing: '0.18em'}}>
    {text}{sub && <span style={{fontSize: 30, letterSpacing: '0.05em', marginLeft: 24, fontWeight: 700, opacity: 0.6}}>{sub}</span>}
  </div>
);

// ── 技能章：本事"盖"进栏里（全片同一个动作）。navy = 藏青（"没做到""门槛"这类）；glow 0–1 = 亮起来 ──
export const SkillTag: React.FC<{c: Ctx; at: number; x: number; y: number; text: string; size?: number; out?: number; navy?: boolean; glow?: number}> = ({c, at, x, y, text, size = 32, out = 1e9, navy, glow = 0}) => {
  const p = c.R(at, 7, EASE.snappy), q = c.R(out, 8, EASE.exit);
  if (c.t < at || q >= 1) return null;
  const col = navy ? P.navy : P.orange;
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `scale(${mix(1.8, 1, p) * (1 + 0.12 * glow)}) rotate(${-3 + (text.length % 3) * 2}deg)`, transformOrigin: '20% 50%', opacity: c01(p * 1.8) * (1 - q), filter: `blur(${(1 - p) * 4}px)`,
      padding: `${size * 0.18}px ${size * 0.45}px ${size * 0.24}px`, border: `${Math.max(3, size * 0.1)}px solid ${col}`, borderRadius: size * 0.22, fontFamily: P.serif, fontWeight: 900, fontSize: size, lineHeight: 1, color: col, whiteSpace: 'nowrap', mixBlendMode: 'multiply',
      background: glow > 0 ? `rgba(224,118,58,${0.06 + 0.22 * glow})` : 'rgba(224,118,58,0.06)', boxShadow: glow > 0 ? `0 0 ${30 * glow}px rgba(224,118,58,${0.5 * glow})` : 'none'}}>{text}</div>
  );
};

// ── 一张多栏的表（工作经历、项目经历、要点……）。放在 Page 里，坐标相对下半张 ──
// cols：每栏的标题和宽度；rows：每行每栏写什么、什么时候写（[文字, 时刻]，时刻不给 = 灰条）；最后一栏可以是章
export type Col = {title: string; w: number};
export type Cell = [string, number?, string?];          // [文字, 写出来的时刻, 颜色]
export type Row = {cells: Cell[]; tags?: [string, number, boolean?][]};   // tags：[章上的字, 盖下来的时刻, 藏青?]
export const TABLE = {top: 80, head: 70, rowH: 140};
export const colX = (cols: Col[], i: number) => cols.slice(0, i).reduce((a, b) => a + b.w, 0);
export const tagPos = (cols: Col[], ri: number, k: number): [number, number] => [colX(cols, cols.length - 1) + 20, TABLE.top + TABLE.head + ri * TABLE.rowH + 14 + k * 62];
export const RowTable: React.FC<{c: Ctx; title: string; sub?: string; cols: Col[]; rows: Row[]; hl?: [number, number, number][]; glow?: number}> = ({c, title, sub, cols, rows, hl = [], glow = 0}) => {
  const {top, head, rowH} = TABLE, y0 = top + head;
  return (
    <>
      <SecHead text={title} sub={sub} />
      {cols.map((cl, i) => <div key={i} style={{position: 'absolute', left: colX(cols, i) + 22, top: top + 18, fontFamily: P.serif, fontWeight: 700, fontSize: 32, color: P.navy, whiteSpace: 'nowrap'}}>{cl.title}</div>)}
      {Array.from({length: Math.floor((SH - y0) / rowH) + 1}).map((_, i) => <div key={i} style={{position: 'absolute', left: 0, right: 0, top: y0 + i * rowH, height: 2, background: i === 0 ? P.line : P.thin}} />)}
      {cols.slice(1).map((_, i) => <div key={i} style={{position: 'absolute', left: colX(cols, i + 1), top, width: 2, bottom: 0, background: P.thin}} />)}
      {hl.map(([ri, a, b], i) => { const p = c.R(a, 8, EASE.out) * (1 - c.R(b, 8, EASE.out)); return p > 0 ? <div key={i} style={{position: 'absolute', left: 0, right: 0, top: y0 + ri * rowH + 2, height: rowH - 2, background: P.orange, opacity: 0.16 * p}} /> : null; })}
      {rows.map((r, ri) => {
        const y = y0 + ri * rowH;
        return (
          <React.Fragment key={ri}>
            {r.cells.map(([text, at, col], ci) => {
              const x = colX(cols, ci), w = cols[ci].w, size = Math.min(44, Math.floor((w - 36) / Math.max(1, text.length)));
              return (
                <React.Fragment key={ci}>
                  {(at === undefined || c.t < at) && <Bar x={x + 22} y={y + rowH / 2 - 7} w={Math.min(w - 50, 160)} h={14} o={0.5} />}
                  {at !== undefined && <Hand c={c} at={at} x={x + 18} y={y + rowH / 2 - size * 0.62} text={text} size={size} col={col ?? P.ink} />}
                </React.Fragment>
              );
            })}
            {(r.tags ?? []).map(([s, at, navy], k) => { const [x, yy] = tagPos(cols, ri, k); return <SkillTag key={k} c={c} at={at} x={x} y={yy} text={s} size={34} navy={navy} glow={navy ? 0 : glow} />; })}
          </React.Fragment>
        );
      })}
    </>
  );
};

// ── 连线：几个点各拉一根橙线到同一个目标（"这些经历全用上了"）。坐标是整屏坐标 ──
export const Connect: React.FC<{c: Ctx; at: number; from: [number, number][]; to: [number, number]; step?: number; out?: number}> = ({c, at, from, to, step = 0.18, out = 1e9}) => {
  const fade = 1 - c.R(out, 8, EASE.exit);
  if (fade <= 0 || c.t < at) return null;
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: fade, pointerEvents: 'none'}}>
      {from.map(([x0, y0], i) => {
        const p = c.R(at + i * step, 14, EASE.out);
        const d = `M${x0} ${y0} C ${x0 - 220} ${y0 - 200}, ${to[0] + 120} ${to[1] + 260}, ${to[0]} ${to[1] + 20}`;
        return p > 0 ? <g key={i}><path d={d} fill="none" stroke={P.orange} strokeWidth={7} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} /><circle cx={x0} cy={y0} r={11} fill={P.orange} /></g> : null;
      })}
    </svg>
  );
};

// ── 弹出卡：一张白卡从下面升上来（盖在下半张上，坐标相对它的容器）──
export const Pop: React.FC<{c: Ctx; at: number; out?: number; x: number; y: number; w: number; h: number; rot?: number; children?: React.ReactNode}> = ({c, at, out = 1e9, x, y, w, h, rot = 0, children}) => {
  const p = c.R(at, 12, EASE.snappy), q = c.R(out, 9, EASE.exit);
  if (c.t < at || q >= 1) return null;
  return <div style={{position: 'absolute', left: x, top: y, width: w, height: h, background: '#fffdf8', border: `3px solid ${P.navy}`, boxShadow: shadow(1.4), transform: `translateY(${(1 - p) * 240 + q * 300}px) rotate(${rot}deg)`, opacity: c01(p * 2) * (1 - q)}}>{children}</div>;
};
// ── 对比条（只画长短，不写数）──
export const BarPair: React.FC<{c: Ctx; x: number; y: number; rows: [string, number, number, string?][]; w?: number}> = ({c, x, y, rows, w = 520}) => (
  <>
    {rows.map(([label, frac, at, col], i) => {
      const p = c.R(at, 16, EASE.out);
      if (c.t < at) return null;
      return (
        <div key={i} style={{position: 'absolute', left: x, top: y + i * 120, opacity: c01(p * 3)}}>
          <div style={{fontFamily: P.hand, fontWeight: 700, fontSize: 40, color: P.ink, whiteSpace: 'nowrap'}}>{label}</div>
          <div style={{marginTop: 8, width: w * frac * p, height: 34, borderRadius: 6, background: col ?? P.navy}} />
        </div>
      );
    })}
  </>
);
// ── 想法云 ──
export const Thought: React.FC<{c: Ctx; at: number; out: number; x: number; y: number; text: string; w?: number; size?: number}> = ({c, at, out, x, y, text, w = 640, size = 48}) => {
  const p = c.R(at, 12, EASE.overshoot), q = c.R(out, 8, EASE.exit);
  if (c.t < at || q >= 1) return null;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, transform: `scale(${0.7 + 0.3 * p})`, transformOrigin: '10% 100%', opacity: c01(p * 2) * (1 - q)}}>
      <div style={{padding: '30px 40px 34px', background: '#fffdf8', border: `3px solid ${P.navy}`, borderRadius: 70, boxShadow: shadow(1.1), fontFamily: P.hand, fontWeight: 700, fontSize: size, color: P.ink, lineHeight: 1.3, textAlign: 'center'}}>{text}</div>
      <div style={{position: 'absolute', left: 70, bottom: -40, width: 34, height: 34, borderRadius: 17, background: '#fffdf8', border: `3px solid ${P.navy}`}} />
      <div style={{position: 'absolute', left: 40, bottom: -78, width: 20, height: 20, borderRadius: 10, background: '#fffdf8', border: `3px solid ${P.navy}`}} />
    </div>
  );
};
// ── 便签（人满屏时贴在下方，手写一两句）──
export const Note: React.FC<{c: Ctx; at: number; out: number; x: number; y: number; lines: [string, number, string?][]; w?: number; rot?: number; size?: number}> = ({c, at, out, x, y, lines, w = 620, rot = -2, size = 58}) => {
  const p = c.R(at, 12, EASE.snappy), q = c.R(out, 9, EASE.exit);
  if (c.t < at || q >= 1) return null;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, padding: '26px 34px 30px', background: '#fffdf8', border: `3px solid ${P.navy}`, boxShadow: shadow(1.3), transform: `translateY(${(1 - p) * 320 + q * 360}px) rotate(${rot}deg)`, opacity: c01(p * 2) * (1 - q)}}>
      <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 16, background: P.orange, opacity: 0.85}} />
      {lines.map(([t, a, col], i) => <div key={i} style={{position: 'relative', height: size * 1.25}}><Hand c={c} at={a} x={14} y={0} text={t} size={size} col={col ?? P.ink} /></div>)}
    </div>
  );
};
// ── 满屏时贴在下方的一格小表：[栏目名 | 手写的值] ──
export const Field: React.FC<{c: Ctx; at: number; out: number; x: number; y: number; label: string; value: string; vAt?: number; w?: number}> = ({c, at, out, x, y, label, value, vAt, w = 600}) => {
  const p = c.R(at, 12, EASE.snappy), q = c.R(out, 8, EASE.exit);
  if (c.t < at || q >= 1) return null;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: 130, background: '#fffdf8', border: `3px solid ${P.navy}`, boxShadow: shadow(1.2), transform: `translateY(${(1 - p) * 300}px) rotate(-1.5deg)`, opacity: c01(p * 2) * (1 - q)}}>
      <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 170, borderRight: `2px solid ${P.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: P.serif, fontWeight: 900, fontSize: 44, color: P.navy}}>{label}</div>
      <Hand c={c} at={vAt ?? at + 0.3} x={200} y={32} text={value} size={62} col={P.orange} />
    </div>
  );
};
// ── 附件（截图）：回形针别上来，后面的表退成纸色（不压暗）。pops 把截图上的一块原样拿起来放大 ──
export const Att: React.FC<{c: Ctx; src: string; iw: number; ih: number; x: number; y: number; w: number; inAt: number; outAt: number; rot?: number; pops?: ImgPop[]; from?: 'bottom' | 'right'; children?: (s: number) => React.ReactNode; fade?: boolean}> = ({c, src, iw, ih, x, y, w, inAt, outAt, rot = 0, pops = [], from = 'bottom', children, fade = true}) => (
  <>
    {fade && <AbsoluteFill style={{background: P.paper, opacity: 0.72 * c.R(inAt, 10, EASE.out) * (1 - c.R(outAt, 10, EASE.out)), pointerEvents: 'none'}} />}
    <ImgCard c={c} src={src} iw={iw} ih={ih} x={x} y={y} w={w} inAt={inAt} outAt={outAt} rot={rot} pops={pops} from={from}>{children ? (s) => <div style={{position: 'absolute', left: 0, top: 0, zIndex: 9}}>{children(s)}</div> : undefined}</ImgCard>
  </>
);
// ── 附件里放一段录屏：播一遍停在倒数第 8 帧（最后几帧常是滚动中的糊帧）──
export const VidAtt: React.FC<{c: Ctx; src: string; vw: number; vh: number; x: number; y: number; w: number; inAt: number; outAt: number; rot?: number; dur: number; rate?: number}> = ({c, src, vw, vh, x, y, w, inAt, outAt, rot = 0, dur, rate = 1}) => {
  const p = c.R(inAt, 16, EASE.snappy), q = c.R(outAt, 12, EASE.exit);
  if (c.t < inAt || q >= 1) return null;
  const h = (vh * w) / vw, pad = 14, local = Math.round((c.t - inAt) * 30), lastF = Math.floor(dur * 30) - 8;
  return (
    <>
      <AbsoluteFill style={{background: P.paper, opacity: 0.72 * p * (1 - q), pointerEvents: 'none'}} />
      <div style={{position: 'absolute', left: x, top: y + (1 - p) * 1300 + q * 1300, transform: `rotate(${rot}deg)`, opacity: c01(p * 2)}}>
        <div style={{position: 'absolute', left: -pad, top: -pad, width: w + 2 * pad, height: h + 2 * pad, background: '#fffdf8', boxShadow: shadow(1.4)}} />
        <div style={{position: 'absolute', left: 0, top: 0, width: w, height: h, overflow: 'hidden', background: '#eee'}}>
          {/* 用 Freeze 定到录屏的第几帧：OffthreadVideo 的 startFrom 逐帧算会错位 */}
          <Freeze frame={Math.min(lastF, Math.max(0, Math.round(local * rate)))}><OffthreadVideo src={staticFile(src)} muted style={{width: w, height: h}} /></Freeze>
        </div>
        <Clip x={w * 0.5 - 20} y={-62} s={1.1} />
      </div>
    </>
  );
};
// ── 线描小人 ──
export const Guy: React.FC<{x: number; y: number; s?: number; col?: string; label?: string; o?: number; fill?: string}> = ({x, y, s = 1, col = P.navy, label, o = 1, fill = '#fffdf8'}) => (
  <div style={{position: 'absolute', left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${s})`}}>
    <svg width={120} height={150} style={{overflow: 'visible'}}>
      <circle cx={60} cy={38} r={30} fill={fill} stroke={col} strokeWidth={6} />
      <path d="M8 146 Q8 82 60 82 Q112 82 112 146 Z" fill={fill} stroke={col} strokeWidth={6} strokeLinejoin="round" />
    </svg>
    {label && <div style={{position: 'absolute', left: 60, top: 160, transform: 'translateX(-50%)', fontFamily: P.hand, fontWeight: 700, fontSize: 36, color: col, whiteSpace: 'nowrap'}}>{label}</div>}
  </div>
);

export {Underline, Ring, Stamp, Hand, Print, Bar, CheckBox, Clip};
