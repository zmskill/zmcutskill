// 一句话打进输入框 → 点发送、网页从框心弹出、四页散开 → 冲进去"看见每一个页面"→ 柔边擦掉、胶囊从中线撑开"一次全部看完"
// → 胶囊缩回、星纹长出、"隆重介绍"打出 → 冲进"重""介"之间的白缝 → 产品名逐字从底下升起 → 加速缩小切到 Logo 落版
// （022-A：Magic Patterns × Screens 开场一串，原片 0–14.2s，60fps 逐帧看过）
//
// 学的动作：
//   - 每个衔接都是"同一个点"接过去：框往中心吸 ↔ 网页从同一点弹出（交叉 2 帧）；擦除扫到中线 ↔ 胶囊从中线一根竖线撑开；
//     胶囊缩回中心 ↔ 星纹从中心长出、"隆重介绍"同时开打；冲进字缝 ↔ 产品名从底下升起（叠 2 帧）；名字加速缩小 ↔ 落版减速缩小（切点速度连续）
//   - 开头不是字飞进框：整张输入框（含字）从 4.5 倍拉远，锚点在文字左上角；前 5 个字机械打字（4 帧/字），光标消失后其余字流式冒出、浅灰→墨渐变
//   - "看见每一个页面"三块各在不同深度，先后从正中远处飞来（"页面"追上来时和"每一个"挤在一起）；之后字原地不动，被一道 30% 宽的柔边从左往右擦掉
//   - 胶囊是"窗口"：字固定在屏幕上，胶囊长开时两头露出、缩回时两头被切掉（同一个组件正放、倒放）
//   - 动作一次比一次猛：拉远 → 网页散开+冲 → 冲字缝（指数加速，约 40 倍）；真停只有 2.0–3.1s（等点击）和 9.3–10.2s（读胶囊）
//   - 一条渐变母题（靛紫 → 天青 → 薄荷 → 嫩绿）出现三次：发送钮、胶囊、产品名，发送钮和产品名里的渐变都在转
//   - 放大很多倍的字一律 SVG 矢量（不用 CSS 缩放）；输入框 4.5 倍拉远用字号插值
//
// 拍表（30fps，t = f/30，所有轨道按原片测量点做单调三次样条；每拍是单独的子组件，带自己的起止帧常量）
//   拍 1  PromptBeat      0–128   0–21 打"帮我做一个"；27–60 拉远 4.5×→1×（最快 42–50）；32–57 流式冒字、到 83 全变墨；
//                                57–75 发送钮点亮；60–93 静停；93–116 手形光标进来、112 按下；116–128 框往中心吸进去
//   拍 2  PagesBeat       125–222 125–132 首页从框心弹出；132–169 慢推；171/175/180 摊位 / 地图 / 报名三页从身后抽出散开；186–210 静漂；210–222 冲进去，四页飞出画面
//   拍 3  PillBeat        213–326 213–216 三块字先后从中心飞来；222–246 减速尾巴；245–268 柔边擦除；263–276 胶囊从中线撑开；269/272/275 三组字浮起；
//                                279–306 静停读胶囊；306–326 胶囊缩回、裁掉字
//   拍 4  NameBeat        316–456 316–323 星纹从胶囊背后长出旋转；321–327 "隆重介绍" 2 帧/字打出；332–357 慢推；357–376 冲进"重""介"白缝；
//                                374–392 产品名 5 个字 3 帧一个从底下升起；378–413 渐变转半圈；399–413 加速缩小；414 硬切到 Logo 落版，1.4×→1× 减速，停到 456
//   主组件按上表串起来；单拿一拍时用 <XxxBeat t={frame / 30} />，帧号在该拍区间内即可
//
// 毛病清单（自查表通用项 + 本镜头独有）：
//   - 独有 1：框缩进去和网页弹出必须是同一个点、网页在框前面，中间不能有一帧空白
//   - 独有 2：擦除是遮罩不是淡出，字不许动；胶囊必须从竖线撑开（不是淡入），渐变窄时只露中段
//   - 独有 3：胶囊里的字用屏幕坐标固定，胶囊缩回时字两头被切掉，字只轻微缩小
//   - 独有 4：冲字缝落点必须是白缝，黑字被推出画面；产品名在黑字前面升起，不弹跳
//   - 独有 5：大字一律 SVG / 字号插值，不能 CSS 放大（会糊）
import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {FONT, Grain, Vignette, bezier, mix} from '../../../assets/lib/helpers/polish';

export const PROMPT_PAGES_PILL_REVEAL_DURATION = 456;

// 品牌位（换品牌只改这里）
export const BRAND_NAME = '逐梦的剪辑';
const ACCENT = '#5b5cf0';
const INK = '#16151c';

// 每拍起止帧
export const BEAT_PROMPT = {from: 0, to: 128};
export const BEAT_PAGES = {from: 125, to: 222};
export const BEAT_PILL = {from: 213, to: 326};
export const BEAT_NAME = {from: 316, to: 456};

const W = 1920, H = 1080;
const SANS = `"PingFang SC", "Noto Sans CJK SC", "Noto Sans SC", ${FONT.sans}`;
const SERIF = `"Songti SC", "Noto Serif CJK SC", "STSong", serif`;
const BG = '#fdfdfc';

// 渐变母题（左 → 右）
const GRAD: [number, string][] = [[0, '#8d86f2'], [0.16, '#b29df2'], [0.34, '#a5c5ee'], [0.52, '#90dbc8'], [0.72, '#84dd92'], [0.86, '#a4ee9a'], [1, '#c6f8a6']];
const gradCss = (deg: number) => `linear-gradient(${deg.toFixed(1)}deg, ${GRAD.map(([o, c]) => `${c} ${o * 100}%`).join(', ')})`;
const GradStops: React.FC = () => <>{GRAD.map(([o, c]) => <stop key={o} offset={o} stopColor={c} />)}</>;

// ───────── 工具 ─────────
const clamp = (x: number) => Math.max(0, Math.min(1, x));
const eo = (t: number, a: number, b: number, p = 3) => 1 - Math.pow(1 - clamp((t - a) / (b - a)), p);
const lin = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
type P = [number, number][];
const trk = (t: number, pts: P) => {
  const n = pts.length;
  if (t <= pts[0][0]) return pts[0][1];
  if (t >= pts[n - 1][0]) return pts[n - 1][1];
  const d: number[] = [];
  for (let k = 0; k < n - 1; k++) d.push((pts[k + 1][1] - pts[k][1]) / (pts[k + 1][0] - pts[k][0]));
  const m: number[] = [d[0]];
  for (let k = 1; k < n - 1; k++) m.push(d[k - 1] * d[k] <= 0 ? 0 : (d[k - 1] + d[k]) / 2);
  m.push(d[n - 2]);
  for (let k = 0; k < n - 1; k++) {
    if (d[k] === 0) { m[k] = 0; m[k + 1] = 0; continue; }
    const a = m[k] / d[k], b = m[k + 1] / d[k], s = a * a + b * b;
    if (s > 9) { const tau = 3 / Math.sqrt(s); m[k] = tau * a * d[k]; m[k + 1] = tau * b * d[k]; }
  }
  let i = 0;
  while (t > pts[i + 1][0]) i++;
  const [x0, y0] = pts[i], [x1, y1] = pts[i + 1];
  const h = x1 - x0, u = (t - x0) / h, u2 = u * u, u3 = u2 * u;
  return (2 * u3 - 3 * u2 + 1) * y0 + (u3 - 2 * u2 + u) * h * m[i] + (-2 * u3 + 3 * u2) * y1 + (u3 - u2) * h * m[i + 1];
};
const grey = (v: number) => { const c = Math.round(v); return `rgb(${c},${c},${Math.min(255, c + 4)})`; };

// ───────── Logo ─────────
const STAR = 'M0 -24 C3 -6 6 -3 24 0 C6 3 3 6 0 24 C-3 6 -6 3 -24 0 C-6 -3 -3 -6 0 -24 Z';
const MarkG: React.FC<{x: number; y: number; size: number}> = ({x, y, size}) => (
  <g transform={`translate(${x} ${y}) scale(${size / 100})`}>
    <circle cx={0} cy={0} r={41} fill="none" stroke={INK} strokeWidth={8.5} />
    <path d={STAR} fill={ACCENT} />
  </g>
);

// ═════════════════════ 拍 1：字 → 输入框 → 点发送 ═════════════════════
// 输入框 1× 时的版式（屏幕 px）
const IB = {L: 363, R: 1557, T: 318, B: 699, rad: 42, tx: 428, l1: 410, l2: 472, fs: 40, row: 618, sx: 1461, sy: 621, sd: 112};
const LINE1 = '帮我做一个周末市集的活动网站，';
const LINE2 = '要有首页、摊位、地图和报名……';
const TYPED = 5;
const typeAt = (i: number) => (5 + i * 4) / 30;
const streamAt = (k: number) => 1.07 + k / 28;
const CHARS = [...Array.from(LINE1).map((c, i) => ({c, line: 0, col: i})), ...Array.from(LINE2).map((c, i) => ({c, line: 1, col: i}))];

// 拉远（锚点 = 文字左上角）：C 字高 / 36 的实测倍数
const ZOOM_OUT: P = [[0.9, 4.5], [1.0, 4.44], [1.1, 4.36], [1.2, 4.19], [1.3, 3.94], [1.4, 3.5], [1.467, 3.06], [1.5, 2.78], [1.533, 2.47], [1.6, 1.94], [1.7, 1.42], [1.8, 1.17], [1.9, 1.06], [1.967, 1.03], [2.0, 1.0]];
// 点击后往中心吸（锚点 = 框中心）
const SUCK: P = [[3.87, 1], [3.9, 0.995], [4.0, 0.97], [4.067, 0.94], [4.1, 0.89], [4.133, 0.84], [4.167, 0.78], [4.183, 0.73], [4.2, 0.62], [4.217, 0.49], [4.233, 0.35], [4.25, 0.24]];

const Hand: React.FC<{tipX: number; tipY: number; press: number; op: number; fade: number}> = ({tipX, tipY, press, op, fade}) => {
  const w = 112, sc = w / 100;
  const shapes = (
    <>
      <rect x={34} y={4} width={20} height={64} rx={10} />
      <rect x={52} y={40} width={18} height={36} rx={9} />
      <rect x={68} y={46} width={17} height={32} rx={8.5} />
      <rect x={82} y={54} width={14} height={28} rx={7} />
      <rect x={24} y={58} width={72} height={50} rx={20} />
      <ellipse cx={24} cy={72} rx={9} ry={20} transform="rotate(-38 24 72)" />
      <rect x={32} y={100} width={56} height={18} rx={4} />
    </>
  );
  const line = mix(0, 150, fade);
  const stroke = `rgb(${line},${line},${line + 4})`;
  return (
    <svg width={w} height={w * 1.22} viewBox="0 0 100 122" style={{position: 'absolute', left: tipX - 44 * sc, top: tipY - 4 * sc, opacity: op, overflow: 'visible',
      transform: `translateY(${(press * 10).toFixed(1)}px) scale(${(1 - press * 0.08).toFixed(3)})`, transformOrigin: `${44 * sc}px ${4 * sc}px`,
      filter: 'drop-shadow(0 6px 10px rgba(20,20,30,0.18))'}}>
      <g fill={stroke} stroke={stroke} strokeWidth={9} strokeLinejoin="round">{shapes}</g>
      <g fill="#ffffff">{shapes}</g>
      <g stroke={stroke} strokeWidth={3.6} strokeLinecap="round" fill="none">
        <path d="M52 50 V64 M68 56 V68 M82 62 V72 M32 101 H88" />
        <path d="M48 80 V94 M59 80 V94 M70 80 V94" />
      </g>
    </svg>
  );
};

export const PromptBeat: React.FC<{t: number}> = ({t}) => {
  if (t > 4.27) return null;
  const sucking = t >= 3.87;
  const s = sucking ? trk(t, SUCK) : trk(t, ZOOM_OUT);
  const ax = sucking ? 960 : 392, ay = sucking ? 508 : 381;
  const X = (x: number) => ax + (x - ax) * s;
  const Y = (y: number) => ay + (y - ay) * s;
  const frameOp = lin(t, 0.85, 1.0);
  const fs = IB.fs * s;
  // 发送钮
  const lit = trk(t, [[1.95, 0], [2.0, 0.12], [2.067, 0.35], [2.17, 0.7], [2.27, 0.92], [2.45, 1]]);
  const btnS = 1 + 0.08 * eo(t, 2.08, 2.2);
  const ang = 135 + (t - 2.0) * 100;
  const sd = IB.sd * s * btnS;
  // 文字光标
  const typed = Array.from({length: TYPED}).filter((_, i) => t >= typeAt(i)).length;
  const showCaret = t < 1.067;
  // 手形光标
  const tipX = trk(t, [[3.1, 91], [3.2, 79.5], [3.3, 78.6], [3.4, 77.5], [3.55, 77.2], [3.7, 77.0], [3.9, 77.2], [4.0, 80], [4.1, 85.5], [4.2, 93], [4.27, 98]]) / 100 * W;
  const tipY = trk(t, [[3.1, 88], [3.2, 85], [3.3, 82], [3.4, 78], [3.55, 66], [3.7, 61.5], [3.9, 62.5], [4.0, 66], [4.1, 64], [4.2, 60.5], [4.27, 58]]) / 100 * H;
  const press = trk(t, [[3.72, 0], [3.75, 1], [3.8, 0.7], [3.85, 0]]);
  const handOp = t < 3.1 ? 0 : 1 - lin(t, 4.0, 4.22);
  const handFade = lin(t, 3.96, 4.15);
  return (
    <>
      <div style={{position: 'absolute', left: X(IB.L), top: Y(IB.T), width: (IB.R - IB.L) * s, height: (IB.B - IB.T) * s, borderRadius: IB.rad * s,
        background: '#fbfbfb', border: `${Math.max(1, 1.1 * s).toFixed(2)}px solid rgba(214,214,220,${(frameOp * 0.9).toFixed(3)})`,
        boxShadow: `0 ${(10 * s).toFixed(1)}px ${(36 * s).toFixed(1)}px rgba(30,30,50,${(0.05 * frameOp).toFixed(3)}), 0 ${(1 * s).toFixed(1)}px ${(3 * s).toFixed(1)}px rgba(30,30,50,${(0.04 * frameOp).toFixed(3)})`}} />
      {/* 字 */}
      {CHARS.map((ch, k) => {
        const isTyped = k < TYPED;
        const at = isTyped ? typeAt(k) : streamAt(k - TYPED);
        if (t < at) return null;
        const v = isTyped ? 22 : mix(224, 22, lin(t, at, at + 0.85));
        const cx = IB.tx + ch.col * IB.fs;
        const cy = ch.line === 0 ? IB.l1 : IB.l2;
        return <div key={k} style={{position: 'absolute', left: X(cx), top: Y(cy) - fs * 0.6, height: fs * 1.2, lineHeight: `${(fs * 1.2).toFixed(2)}px`, fontSize: fs, fontFamily: SANS, color: grey(v), whiteSpace: 'pre'}}>{ch.c}</div>;
      })}
      {showCaret && (
        <div style={{position: 'absolute', left: X(IB.tx + typed * IB.fs) + 2 * s, top: Y(IB.l1) - fs * 0.6, width: Math.max(2, 3.8 * s), height: fs * 1.2, background: '#0d0d10'}} />
      )}
      {/* 底排：+ / 标签胶囊 */}
      <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: frameOp}} width={W} height={H}>
        <g stroke="#1c1d24" strokeWidth={2.2 * s} strokeLinecap="round">
          <path d={`M${X(IB.tx + 2)} ${Y(IB.row)} h${24 * s} M${X(IB.tx + 14)} ${Y(IB.row - 12)} v${24 * s}`} />
          <path d={`M${X(IB.tx + 76)} ${Y(IB.row + 12)} l${12 * s} ${-24 * s}`} />
        </g>
      </svg>
      <div style={{position: 'absolute', left: X(568), top: Y(IB.row - 22), height: 44 * s, display: 'flex', borderRadius: 22 * s, overflow: 'hidden', border: `${Math.max(1, s).toFixed(2)}px solid #dfe2f6`, opacity: frameOp, fontFamily: SANS, fontSize: 19 * s, color: '#24252e'}}>
        <div style={{background: '#edf0fb', padding: `0 ${18 * s}px`, display: 'flex', alignItems: 'center'}}>多页面</div>
        <div style={{background: '#f6f7fe', padding: `0 ${20 * s}px`, display: 'flex', alignItems: 'center', borderLeft: `${Math.max(1, s).toFixed(2)}px solid #dfe2f6`}}>实拍照片</div>
      </div>
      {/* 发送钮 */}
      <div style={{position: 'absolute', left: X(IB.sx) - sd / 2, top: Y(IB.sy) - sd / 2, width: sd, height: sd, borderRadius: '50%', background: '#ececf2', overflow: 'hidden', opacity: frameOp}}>
        <div style={{position: 'absolute', inset: 0, background: gradCss(ang), opacity: lit}} />
        <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 50%, rgba(240,246,246,0.55) 0%, rgba(240,246,246,0) 55%)', opacity: lit}} />
        <svg width={sd} height={sd} viewBox="0 0 100 100" style={{position: 'absolute', inset: 0}}>
          <path d="M50 72 V30 M33 46 L50 29 L67 46" fill="none" stroke={`rgba(${Math.round(mix(168, 255, lit))},${Math.round(mix(168, 255, lit))},${Math.round(mix(184, 255, lit))},1)`} strokeWidth={4.2} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      {handOp > 0.01 && <Hand tipX={tipX} tipY={tipY} press={press} op={handOp} fade={handFade} />}
    </>
  );
};

// ═════════════════════ 拍 2：网页铺开 ═════════════════════
const PW = 1500, PH = 1000; // 网页本地尺寸
const TERRA = '#c8613a', MUST = '#efbd4f', SAGE = '#9fbf8c', TEAL = '#2f5d62', CREAM = '#fbf8ef', DARK = '#2b2620', MUTE = '#7d7366';

const Nav: React.FC<{active: number}> = ({active}) => (
  <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 84, borderBottom: '1.5px solid rgba(43,38,32,0.09)', display: 'flex', alignItems: 'center', padding: '0 56px', fontFamily: SANS}}>
    <div style={{width: 30, height: 30, borderRadius: 15, background: TERRA, marginRight: 14, position: 'relative'}}>
      <div style={{position: 'absolute', left: 8, top: 8, width: 14, height: 14, borderRadius: 7, background: MUST}} />
    </div>
    <div style={{fontFamily: SERIF, fontWeight: 700, fontSize: 30, color: DARK}}>周末小市集</div>
    <div style={{marginLeft: 'auto', display: 'flex', gap: 44, fontSize: 22, color: MUTE}}>
      {['首页', '摊位', '地图', '报名'].map((n, i) => <span key={n} style={{color: i === active ? TERRA : MUTE, fontWeight: i === active ? 700 : 400}}>{n}</span>)}
    </div>
    <div style={{marginLeft: 44, width: 22, height: 22, borderRadius: 11, border: `2.5px solid ${MUTE}`}} />
  </div>
);

const Tent: React.FC<{x: number; y: number; w: number; c: string}> = ({x, y, w, c}) => {
  const h = w * 0.62;
  const stripes = 5;
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={-w * 0.42} y={h * 0.45} width={w * 0.84} height={h * 0.55} fill="#fffaf0" />
      <rect x={-w * 0.12} y={h * 0.6} width={w * 0.24} height={h * 0.4} fill={DARK} opacity={0.85} />
      <path d={`M0 0 L${w / 2} ${h * 0.5} L${-w / 2} ${h * 0.5} Z`} fill={c} />
      {Array.from({length: stripes}).map((_, i) => i % 2 === 1 && (
        <path key={i} d={`M0 0 L${-w / 2 + (w / stripes) * (i + 1)} ${h * 0.5} L${-w / 2 + (w / stripes) * i} ${h * 0.5} Z`} fill="#fffaf0" opacity={0.85} />
      ))}
      <path d={`M${-w / 2} ${h * 0.5} ${Array.from({length: 6}).map((_, i) => `q${w / 12} ${h * 0.12} ${w / 6} 0`).join(' ')}`} fill={c} />
    </g>
  );
};

const PageHome: React.FC = () => (
  <>
    <Nav active={0} />
    <div style={{position: 'absolute', left: 80, top: 150, fontSize: 24, color: MUTE, fontFamily: SANS, letterSpacing: '0.04em'}}>11 月 16–17 日 · 河边老仓库</div>
    <div style={{position: 'absolute', left: 76, top: 196, fontFamily: SERIF, fontWeight: 700, fontSize: 96, lineHeight: '118px', color: DARK}}>周末，<br /><span style={{color: TERRA}}>来市集走走。</span></div>
    <div style={{position: 'absolute', left: 80, top: 456, fontFamily: SANS, fontSize: 26, lineHeight: '42px', color: '#5e564c'}}>咖啡、鲜果、点心和现场音乐，<br />两天一百多个摊位，带上朋友一起来。</div>
    <div style={{position: 'absolute', left: 80, top: 572, width: 196, height: 64, borderRadius: 32, background: DARK, color: '#fff', fontFamily: SANS, fontSize: 25, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>立即报名</div>
    <div style={{position: 'absolute', left: 296, top: 572, width: 196, height: 64, borderRadius: 32, border: `2px solid ${DARK}`, color: DARK, fontFamily: SANS, fontSize: 25, display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box'}}>查看地图</div>
    {/* 2026-11-17 第4轮：原片网页里是真照片 → 市集实拍（library/photos/market、food、coffee、concert，Unsplash 免费授权） */}
    <Img src={staticFile('library/photos/market/market05.jpg')} style={{position: 'absolute', left: 810, top: 130, width: 620, height: 520, borderRadius: 18, objectFit: 'cover'}} />
    <div style={{position: 'absolute', left: 80, top: 712, fontFamily: SERIF, fontWeight: 700, fontSize: 34, color: DARK}}>这周推荐</div>
    <div style={{position: 'absolute', left: 80, top: 772, display: 'flex', gap: 16, fontFamily: SANS, fontSize: 22, color: DARK}}>
      {[['手冲咖啡', TERRA], ['新鲜水果', TEAL], ['现场音乐', MUST], ['烘焙点心', SAGE]].map(([n, c]) => (
        <div key={n} style={{padding: '10px 22px', borderRadius: 24, background: '#f1ece0', display: 'flex', alignItems: 'center', gap: 10}}><span style={{width: 12, height: 12, borderRadius: 6, background: c}} />{n}</div>
      ))}
    </div>
    {['coffee/coffee10', 'market/market06', 'concert/concert02', 'food/food13'].map((ph, i) => <Img key={i} src={staticFile(`library/photos/${ph}.jpg`)} style={{position: 'absolute', left: 80 + i * 345, top: 850, width: 325, height: 200, borderRadius: 16, objectFit: 'cover'}} />)}
  </>
);

const BOOTHS: [string, string, string, number][] = [
  ['手冲咖啡', 'A 区 · 03 号', 'coffee/coffee11', 0], ['新鲜水果', 'A 区 · 11 号', 'market/market02', 1], ['现烤玉米', 'B 区 · 06 号', 'market/market03', 2],
  ['蔬菜小铺', 'B 区 · 14 号', 'market/market00', 3], ['烘焙点心', 'C 区 · 02 号', 'food/food13', 0], ['现场音乐', 'C 区 · 09 号', 'concert/concert03', 1],
];
// 第4轮：摊位卡换成实拍照片（第三项是 library/photos 下的路径）
const BoothArt: React.FC<{c: string; k: number}> = ({c}) => (
  <Img src={staticFile(`library/photos/${c}.jpg`)} style={{width: 410, height: 200, objectFit: 'cover', display: 'block'}} />
);
const PageBooths: React.FC = () => (
  <>
    <Nav active={1} />
    <div style={{position: 'absolute', left: 0, right: 0, top: 128, textAlign: 'center', fontFamily: SERIF, fontWeight: 700, fontSize: 64, color: DARK}}>摊位一览</div>
    <div style={{position: 'absolute', left: PW / 2 - 34, top: 222, width: 68, height: 5, borderRadius: 3, background: TERRA}} />
    <div style={{position: 'absolute', left: 0, right: 0, top: 262, display: 'flex', justifyContent: 'center', gap: 14, fontFamily: SANS, fontSize: 22}}>
      {['全部', '吃喝', '鲜果', '烘焙', '音乐'].map((n, i) => <div key={n} style={{padding: '9px 26px', borderRadius: 24, background: i === 0 ? TERRA : '#f1ece0', color: i === 0 ? '#fff' : DARK}}>{n}</div>)}
    </div>
    {BOOTHS.map(([n, m, c, k], i) => (
      <div key={n} style={{position: 'absolute', left: 95 + (i % 3) * 445, top: 350 + Math.floor(i / 3) * 330, width: 410, borderRadius: 16, overflow: 'hidden', background: '#fff', boxShadow: '0 2px 10px rgba(43,38,32,0.08)'}}>
        <BoothArt c={c} k={k} />
        <div style={{padding: '18px 22px', fontFamily: SANS}}>
          <div style={{fontSize: 27, fontWeight: 700, color: DARK}}>{n}</div>
          <div style={{fontSize: 20, color: MUTE, marginTop: 6}}>{m}</div>
        </div>
      </div>
    ))}
  </>
);

const PageMap: React.FC = () => (
  <>
    <Nav active={2} />
    <div style={{position: 'absolute', left: 80, top: 124, fontFamily: SERIF, fontWeight: 700, fontSize: 58, color: DARK}}>场地地图</div>
    <div style={{position: 'absolute', left: 80, top: 214, fontFamily: SANS, fontSize: 25, color: '#5e564c'}}>从北门进，沿着河边一路逛到老仓库，大约 20 分钟。</div>
    <div style={{position: 'absolute', left: 80, top: 272, display: 'flex', gap: 40, fontFamily: SANS, fontSize: 21, color: DARK}}>
      {[['北门入口', TERRA], ['休息区', SAGE], ['停车场', TEAL], ['洗手间', MUST]].map(([n, c]) => <div key={n} style={{display: 'flex', alignItems: 'center', gap: 10}}><span style={{width: 18, height: 18, borderRadius: 4, background: c}} />{n}</div>)}
    </div>
    <svg width={1380} height={640} style={{position: 'absolute', left: 60, top: 340, borderRadius: 18}}>
      <rect width={1380} height={640} fill="#cfdcb9" />
      <path d="M-20 520 C300 420 520 640 860 520 S1240 380 1400 450 V700 H-20 Z" fill="#8fc3d1" />
      <path d="M-20 545 C300 445 520 665 860 545 S1240 405 1400 475" fill="none" stroke="#e9f4f6" strokeWidth={5} opacity={0.7} />
      <path d="M120 0 V300 Q120 360 200 380 H1180 Q1250 380 1250 320 V0" fill="none" stroke={CREAM} strokeWidth={30} />
      <path d="M640 0 V380 M400 120 H980" fill="none" stroke={CREAM} strokeWidth={22} />
      {Array.from({length: 18}).map((_, i) => {
        const c = [TERRA, MUST, TEAL, '#e07b6a', '#b9824f', '#5d6b8a'][i % 6];
        const x = 190 + (i % 9) * 110, y = i < 9 ? 160 : 260;
        return <rect key={i} x={x} y={y} width={80} height={62} rx={8} fill={c} opacity={0.92} />;
      })}
      <rect x={1060} y={420} width={250} height={130} rx={14} fill="#e8dcc6" />
      {[[300, 140, '咖啡角'], [740, 240, '旧书区'], [1180, 400, '舞台']].map(([x, y, n]) => (
        <g key={n as string} transform={`translate(${x} ${y})`}>
          <path d="M0 0 C-22 -24 -22 -52 0 -52 C22 -52 22 -24 0 0 Z" fill={DARK} />
          <circle cx={0} cy={-34} r={8} fill="#fff" />
          <rect x={16} y={-58} width={(n as string).length * 26 + 24} height={40} rx={20} fill="#fff" />
          <text x={28} y={-30} fontFamily={SANS} fontSize={22} fill={DARK}>{n}</text>
        </g>
      ))}
    </svg>
  </>
);

const PageSignup: React.FC = () => (
  <>
    <Nav active={3} />
    <div style={{position: 'absolute', left: 80, top: 130, fontFamily: SERIF, fontWeight: 700, fontSize: 62, color: DARK}}>报名参加</div>
    <div style={{position: 'absolute', left: 80, top: 222, fontFamily: SANS, fontSize: 25, color: '#5e564c'}}>摆摊还是来逛，都先留个名字。</div>
    {['姓名', '手机号'].map((n, i) => (
      <div key={n} style={{position: 'absolute', left: 80, top: 296 + i * 128, fontFamily: SANS}}>
        <div style={{fontSize: 21, color: MUTE}}>{n}</div>
        <div style={{marginTop: 10, width: 580, height: 62, borderRadius: 12, border: '2px solid #e3dccd', background: '#fff', fontSize: 23, color: '#a69c8e', display: 'flex', alignItems: 'center', paddingLeft: 20, boxSizing: 'border-box'}}>{i === 0 ? '林小满' : '138 0000 0000'}</div>
      </div>
    ))}
    <div style={{position: 'absolute', left: 80, top: 552, fontFamily: SANS, fontSize: 21, color: MUTE}}>想来做什么</div>
    <div style={{position: 'absolute', left: 80, top: 590, display: 'flex', gap: 14, fontFamily: SANS, fontSize: 23}}>
      {['摆摊', '来逛逛', '当志愿者'].map((n, i) => <div key={n} style={{padding: '12px 30px', borderRadius: 30, background: i === 0 ? DARK : '#f1ece0', color: i === 0 ? '#fff' : DARK}}>{n}</div>)}
    </div>
    <div style={{position: 'absolute', left: 80, top: 700, width: 580, height: 72, borderRadius: 36, background: TERRA, color: '#fff', fontFamily: SANS, fontSize: 27, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>提交报名</div>
    <Img src={staticFile('library/photos/market/market08.jpg')} style={{position: 'absolute', left: 740, top: 124, width: 700, height: 840, borderRadius: 18, objectFit: 'cover'}} />
    <svg width={700} height={840} style={{position: 'absolute', left: 740, top: 124, borderRadius: 18}}>
      <rect width={700} height={840} fill="#1d3b40" opacity={0.35} />
      <g transform="translate(120 300) rotate(-6)">
        <path d="M0 0 H460 V90 A30 30 0 0 0 460 150 V240 H0 V150 A30 30 0 0 0 0 90 Z" fill={MUST} />
        <path d="M120 10 V230" stroke={TEAL} strokeWidth={4} strokeDasharray="12 10" />
        <text x={160} y={115} fontFamily={SERIF} fontWeight={700} fontSize={60} fill={DARK}>名额有限</text>
        <text x={162} y={170} fontFamily={SANS} fontSize={28} fill={DARK}>还剩 36 个摊位</text>
        <circle cx={60} cy={120} r={28} fill={TERRA} />
      </g>
    </svg>
  </>
);

const PAGES = [PageHome, PageBooths, PageMap, PageSignup];
type K = [number, number, number, number]; // t, cx%, cy%, w%
const kt = (t: number, ks: K[], i: number) => trk(t, ks.map((k) => [k[0], k[i]] as [number, number]));
const PAGE_KEYS: K[][] = [
  // 首页：从框心弹出 → 慢推 → 往下让开 → 左下
  [[4.167, 50, 53, 3], [4.183, 50, 52.6, 6], [4.2, 50, 52.2, 9], [4.217, 50, 51.6, 12], [4.233, 50, 51, 16.5], [4.25, 50, 50.6, 20], [4.267, 50, 50.4, 24.3], [4.3, 49.9, 50.2, 30.6],
    [4.333, 49.8, 50.1, 34.6], [4.367, 49.8, 50, 37.1], [4.4, 49.7, 50, 39], [4.5, 49.7, 50.1, 42.2], [4.6, 49.7, 50.3, 44.7], [4.8, 49.7, 50.4, 46.8], [5.0, 49.7, 50.4, 48.2], [5.2, 49.7, 50.5, 49.7],
    [5.4, 49.7, 50.5, 51.3], [5.6, 49.7, 50.5, 52.3], [5.633, 50.4, 51.5, 52.5], [5.7, 52.5, 70.4, 53], [5.767, 54, 88.8, 52.5], [5.833, 54, 107.8, 53], [5.9, 53.5, 117.4, 53], [6.0, 50, 120, 53],
    [6.2, 36, 124.8, 52.5], [6.4, 25, 118, 52.5], [7.0, 20, 121, 53.5]],
  // 摊位：首页身后往右上抽出，再回落到右中
  [[5.7, 58.5, 39.2, 29], [5.733, 63.5, 26.7, 35], [5.767, 67.5, 28.1, 39], [5.8, 70, 25.9, 42], [5.867, 74.5, 26.7, 45], [5.9, 77, 25.3, 46], [5.967, 79, 27.3, 46], [6.0, 80, 30.3, 46],
    [6.1, 81.5, 43.3, 46], [6.2, 82, 52.3, 46], [6.4, 82.5, 63.3, 46], [7.0, 84.5, 66, 47]],
  // 地图：摊位身后往左上抽出，只留下面的地图在顶边
  [[5.833, 48, 48, 3], [5.867, 45, 45, 14], [5.9, 45.5, 36.8, 25], [5.933, 41, 24.8, 30], [5.967, 40, 21.9, 34], [6.0, 39, 13, 36], [6.1, 46, 0, 44], [6.2, 50.5, -7.7, 45], [6.4, 56.5, -11.8, 47], [7.0, 63, -13.5, 48.5]],
  // 报名：最后、在最下层，往左上散开
  [[6.0, 46, 51, 6], [6.033, 44.5, 52, 15], [6.067, 39, 53, 26], [6.1, 26.5, 51.5, 37], [6.15, 19, 48, 40], [6.2, 14, 43.5, 43], [6.4, 4, 27.7, 46], [7.0, 0, 24, 47.5]],
];
const PAGE_BORN = [4.167, 5.7, 5.833, 6.0];
// 远处的幽灵页（很淡、很虚），世界坐标 cx, cy, w
const GHOSTS: [number, number, number][] = [[38, 30, 14], [60, 72, 12], [44, 80, 10], [30, 62, 9], [66, 22, 10], [52, 40, 8], [22, 38, 7], [74, 48, 8]];

// 相机：6.2 起慢推近（页面各自继续往外漂），7.0 起加速冲进去
const camZ = (t: number) => trk(t, [[6.2, 1], [7.0, 1.1], [7.1, 1.37], [7.2, 1.71], [7.3, 2.15], [7.367, 2.97], [7.4, 3.68], [7.45, 5.1]]);

export const PagesBeat: React.FC<{t: number}> = ({t}) => {
  if (t < 4.16 || t > 7.46) return null;
  const Z = camZ(t);
  const scr = (cx: number, cy: number, w: number) => ({cx: 50 + (cx - 50) * Z, cy: 50 + (cy - 50) * Z, w: w * Z});
  const ghostOp = lin(t, 5.95, 6.3) * 0.055;
  return (
    <>
      {ghostOp > 0.002 && GHOSTS.map(([gx, gy, gw], i) => {
        const g = scr(gx, gy, gw * (1 + (t - 6) * 0.03));
        const wpx = g.w / 100 * W;
        return <div key={i} style={{position: 'absolute', left: g.cx / 100 * W - wpx / 2, top: g.cy / 100 * H - wpx / 3, width: wpx, height: wpx / 1.5, border: '2px solid #9a9aa0', background: 'rgba(150,150,160,0.25)', opacity: ghostOp, filter: 'blur(5px)'}} />;
      })}
      {[3, 2, 1, 0].map((i) => {
        if (t < PAGE_BORN[i]) return null;
        const ks = PAGE_KEYS[i];
        const p = scr(kt(t, ks, 1), kt(t, ks, 2), kt(t, ks, 3));
        const wpx = p.w / 100 * W;
        const sc = wpx / PW;
        const Pg = PAGES[i];
        const left = p.cx / 100 * W - wpx / 2, top = p.cy / 100 * H - (PH * sc) / 2;
        if (left > W || top > H || left + wpx < 0 || top + PH * sc < 0) return null;
        return (
          <div key={i} style={{position: 'absolute', left, top, width: PW, height: PH, transform: `scale(${sc.toFixed(5)})`, transformOrigin: '0 0',
            background: CREAM, overflow: 'hidden', boxShadow: '0 0 0 1.5px rgba(40,36,30,0.08), 0 8px 30px rgba(40,36,30,0.10)'}}>
            <Pg />
          </div>
        );
      })}
    </>
  );
};

// ═════════════════════ 拍 3：看见每一个页面 → 擦除 → 胶囊 ═════════════════════
const F1 = 166; // 第一行终态字号
const LINE_BLOCKS = [{s: '看见', c0: 0, at: 7.1}, {s: '每一个', c0: 2, at: 7.15}, {s: '页面', c0: 5, at: 7.2}];
const LINE_N = 7;
const F_PILL = 142;
const PILL_GROUPS = [{s: '一次', c0: 0, at: 8.967}, {s: '全部', c0: 2, at: 9.067}, {s: '看完', c0: 4, at: 9.167}];
const PILL_N = 6;
const PILL_W: P = [[8.767, 1.5], [8.8, 6.6], [8.833, 11], [8.867, 16.3], [8.9, 23.2], [8.933, 30.7], [8.967, 36.6], [9.0, 42], [9.1, 48], [9.2, 50.7], [9.5, 53.3], [10.2, 54.3],
  [10.25, 53.9], [10.3, 52.9], [10.35, 51.4], [10.4, 48.7], [10.467, 42.8], [10.5, 31], [10.533, 16.6], [10.567, 11.4], [10.6, 8], [10.633, 5.2], [10.667, 4.5], [10.7, 3], [10.733, 2.4], [10.767, 1.6], [10.833, 0.8], [10.867, 0]];
const PILL_H: P = [[8.767, 20.4], [9.2, 21.6], [10.2, 23], [10.4, 20.6], [10.467, 17], [10.5, 13], [10.533, 7.4], [10.567, 5], [10.6, 3.6], [10.7, 2.2], [10.867, 1]];

export const PillBeat: React.FC<{t: number}> = ({t}) => {
  if (t < 7.09 || t > 10.9) return null;
  // 第一行：三块各在不同深度，先后从中心飞来；之后长尾巴减速
  const L = trk(t, [[7.4, 0.9], [7.5, 0.94], [7.6, 0.965], [7.8, 0.985], [8.2, 1.0], [9.2, 1.004]]);
  const wipeX = mix(-14, 86, lin(t, 8.17, 8.93));
  const lineLeft = W / 2 - (LINE_N * F1) / 2;
  // 胶囊
  const showPill = t >= 8.767 && t < 10.867;
  const pw = trk(t, PILL_W) / 100 * W, ph = trk(t, PILL_H) / 100 * H;
  const finalW = 0.543 * W;
  const bgW = Math.max(pw, finalW * 0.82);
  const ts = trk(t, [[10.2, 1], [10.4, 0.975], [10.5, 0.86], [10.567, 0.72], [10.633, 0.58], [10.7, 0.48], [10.867, 0.4]]);
  const fp = F_PILL * ts;
  const pillLeft = W / 2 - (PILL_N * F_PILL) / 2;
  return (
    <svg width={W} height={H} style={{position: 'absolute', inset: 0}} textRendering="geometricPrecision">
      <defs>
        <linearGradient id="wipeG" gradientUnits="userSpaceOnUse" x1={wipeX / 100 * W} y1={0} x2={(wipeX + 30) / 100 * W} y2={0}>
          <stop offset={0} stopColor="#000" /><stop offset={1} stopColor="#fff" />
        </linearGradient>
        <mask id="wipeM" maskUnits="userSpaceOnUse" x={0} y={0} width={W} height={H}><rect width={W} height={H} fill="url(#wipeG)" /></mask>
        <linearGradient id="pillG" gradientUnits="userSpaceOnUse" x1={W / 2 - bgW / 2} y1={0} x2={W / 2 + bgW / 2} y2={0}><GradStops /></linearGradient>
        <radialGradient id="pillGlowL" gradientUnits="userSpaceOnUse" cx={W / 2 - pw / 2} cy={H / 2} r={ph * 0.9}>
          <stop offset={0} stopColor="#7d74ee" stopOpacity={0.55} /><stop offset={1} stopColor="#7d74ee" stopOpacity={0} />
        </radialGradient>
        <clipPath id="pillC"><rect x={W / 2 - pw / 2} y={H / 2 - ph / 2} width={pw} height={ph} rx={Math.min(ph, pw) / 2} /></clipPath>
      </defs>
      {t < 8.95 && (
        <g mask={t > 8.15 ? 'url(#wipeM)' : undefined} fontFamily={SANS} fill="#0f1d1d">
          {LINE_BLOCKS.map((b) => {
            if (t < b.at) return null;
            const s = 0.03 + 0.97 * eo(t, b.at, 7.43 + (b.at - 7.1) * 0.6, 2.6);
            const xc = lineLeft + (b.c0 + Array.from(b.s).length / 2) * F1;
            const k = s * L;
            return <text key={b.s} x={W / 2 + (xc - W / 2) * k} y={H / 2} fontSize={F1 * k} textAnchor="middle" dominantBaseline="central">{b.s}</text>;
          })}
        </g>
      )}
      {showPill && (
        <>
          <rect x={W / 2 - pw / 2} y={H / 2 - ph / 2} width={pw} height={ph} rx={Math.min(ph, pw) / 2} fill="url(#pillG)" />
          <rect x={W / 2 - pw / 2} y={H / 2 - ph / 2} width={pw} height={ph} rx={Math.min(ph, pw) / 2} fill="url(#pillGlowL)" />
          <g clipPath="url(#pillC)" fontFamily={SANS}>
            {PILL_GROUPS.map((g, i) => {
              if (t < g.at) return null;
              const up = i === 0 ? 1 : eo(t, g.at, g.at + 0.1);
              const ink = i === 0 ? lin(t, g.at, g.at + 0.1) : lin(t, g.at, g.at + 0.12);
              const xc = pillLeft + (g.c0 + 1) * F_PILL;
              const op = i === 0 ? mix(0.6, 1, ink) : mix(0.4, 1, up);
              const v = mix(70, 14, ink);
              return <text key={g.s} x={W / 2 + (xc - W / 2) * ts} y={H / 2 + (1 - up) * 25} fontSize={fp} textAnchor="middle" dominantBaseline="central" fill={`rgb(${v - 6},${v + 10},${v + 12})`} opacity={op}>{g.s}</text>;
            })}
          </g>
        </>
      )}
    </svg>
  );
};

// ═════════════════════ 拍 4：星纹 + 隆重介绍 → 冲字缝 → 产品名升起 → 落版 ═════════════════════
const INTRO = '隆重介绍';
const F2 = 230, SP2 = 0.16;
const F3 = 290, SP3 = 0.04;
const STAR_HW: P = [[10.533, 96], [10.567, 403], [10.6, 528], [10.633, 768], [10.667, 950], [10.75, 1150], [12.3, 1725]];
const STAR_ROT: P = [[10.533, 0], [10.567, 15], [10.75, 25], [12.3, 44]];
const NAME_SHRINK: P = [[13.3, 1], [13.4, 0.982], [13.5, 0.956], [13.6, 0.911], [13.65, 0.874], [13.7, 0.817], [13.75, 0.729], [13.8, 0.6]];
const CUT = 13.8;

const introZoom = (t: number) => {
  const base = t < 11.05 ? 1 : 1 + 0.138 * lin(t, 11.05, 11.9);
  if (t <= 11.9) return base;
  const u = (t - 11.9) / 0.63;
  return 1.138 * Math.exp(3.75 * Math.pow(u, 3.4));
};

// 星纹（拍 4 的一部分，画在胶囊后面）：Logo 里的四角星做成平铺描边纹，比底色只暗一点
const LATTICE: [number, number][] = [];
for (let i = -3; i <= 3; i++) for (let j = -3; j <= 3; j++) if ((i + j) % 2 === 0) LATTICE.push([i, j]);
export const StarLayer: React.FC<{t: number}> = ({t}) => {
  if (t < 10.53 || t > 12.32) return null;
  const hw = trk(t, STAR_HW);
  const rot = trk(t, STAR_ROT);
  const starOp = lin(t, 10.52, 10.545) * (1 - lin(t, 12.18, 12.3));
  const showStar = true;
  const lattice = LATTICE;
  return (
    <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
      {showStar && (
        <g transform={`translate(${W / 2} ${H / 2}) rotate(${rot.toFixed(3)}) scale(${(hw / 24).toFixed(4)})`} opacity={starOp}>
          {lattice.map(([i, j]) => <path key={`${i}_${j}`} d={STAR} transform={`translate(${i * 27.5} ${j * 27.5})`} fill="none" stroke="#f5f5f7" strokeWidth={5.2} strokeLinejoin="round" />)}
        </g>
      )}
    </svg>
  );
};

export const NameBeat: React.FC<{t: number}> = ({t}) => {
  if (t < 10.53) return null;
  // 隆重介绍
  const Zi = introZoom(t);
  const showIntro = t >= 10.7 && t < 12.55;
  const step2 = F2 * (1 + SP2);
  // 产品名
  const nameChars = Array.from(BRAND_NAME);
  const N = nameChars.length;
  const step3 = F3 * (1 + SP3);
  const nameAt = (i: number) => 12.467 + i * 0.1;
  const showName = t >= 12.46 && t < CUT;
  const shrink = trk(t, NAME_SHRINK);
  const theta = (trk(t, [[12.55, -12], [13.75, 180], [13.8, 188]]) * Math.PI) / 180;
  const halfLen = (N * step3) / 2;
  // 落版
  const showLock = t >= CUT;
  const lk = trk(t, [[CUT, 1.4], [13.85, 1.2], [13.9, 1.07], [14.0, 1.0], [15.2, 1.045]]);
  const lockF = 128, markS = 172, gap = 46;
  const lockW = markS + gap + N * lockF * 1.02;
  return (
    <svg width={W} height={H} style={{position: 'absolute', inset: 0}} textRendering="geometricPrecision">
      <defs>
        <linearGradient id="nameG" gradientUnits="userSpaceOnUse" x1={-Math.cos(theta) * halfLen} y1={-Math.sin(theta) * halfLen} x2={Math.cos(theta) * halfLen} y2={Math.sin(theta) * halfLen}><GradStops /></linearGradient>
      </defs>
      {showIntro && (
        <g transform={`translate(${W / 2} ${H / 2}) scale(${Zi.toFixed(5)})`} fontFamily={SANS}>
          {Array.from(INTRO).map((c, i) => {
            const at = 10.7 + i * 0.0667;
            if (t < at) return null;
            const p = eo(t, at, at + 0.1);
            const v = mix(150, 10, p);
            return <text key={i} x={(i - 1.5) * step2} y={(1 - p) * H * 0.01} fontSize={F2} textAnchor="middle" dominantBaseline="central" fill={`rgb(${v},${v},${v + 2})`} opacity={mix(0.4, 1, p)}>{c}</text>;
          })}
        </g>
      )}
      {showName && (
        <g transform={`translate(${W / 2} ${H / 2}) scale(${shrink.toFixed(5)})`} fontFamily={SANS} fontWeight={700}>
          {nameChars.map((c, i) => {
            const at = nameAt(i);
            if (t < at) return null;
            const p = trk(t, [[at, 0], [at + 0.05, 0.52], [at + 0.1, 0.8], [at + 0.15, 0.94], [at + 0.2, 0.99], [at + 0.26, 1]]);
            const dy = (1 - p) * (H / 2 + F3 * 0.62);
            return <text key={i} x={(i - (N - 1) / 2) * step3} y={dy} fontSize={F3} textAnchor="middle" dominantBaseline="central" fill="url(#nameG)" opacity={mix(0.6, 1, p)}>{c}</text>;
          })}
        </g>
      )}
      {showLock && (
        <g transform={`translate(${W / 2} ${H / 2}) scale(${lk.toFixed(5)})`}>
          <MarkG x={-lockW / 2 + markS / 2} y={0} size={markS} />
          <text x={-lockW / 2 + markS + gap} y={4} fontFamily={SANS} fontWeight={700} fontSize={lockF} letterSpacing={lockF * 0.02} dominantBaseline="central" fill={INK}>{BRAND_NAME}</text>
        </g>
      )}
    </svg>
  );
};

// ═════════════════════ 主组件 ═════════════════════
// 整串画面：给定时间 t（秒）画一帧（主组件和单帧检查都用它）
export const PromptPagesPillRevealScene: React.FC<{t: number}> = ({t}) => (
  <AbsoluteFill style={{background: BG, overflow: 'hidden'}}>
    {/* 很淡的主光：左上偏亮，四周极轻压暗 */}
    <AbsoluteFill style={{background: 'radial-gradient(ellipse 70% 65% at 42% 38%, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 70%)'}} />
    <PromptBeat t={t} />
    <PagesBeat t={t} />
    <StarLayer t={t} />
    <PillBeat t={t} />
    <NameBeat t={t} />
    <Vignette strength={0.035} color="#2a2c36" inner={0.6} />
    <Grain opacity={0.03} blend="overlay" />
  </AbsoluteFill>
);

export const PromptPagesPillReveal: React.FC = () => {
  const f = useCurrentFrame();
  return <PromptPagesPillRevealScene t={f / 30} />;
};
