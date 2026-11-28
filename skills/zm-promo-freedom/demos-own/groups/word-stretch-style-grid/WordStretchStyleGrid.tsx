// 【镜头组】word-stretch-style-grid：小字号接着打完一句（中间一个词像素乱跳再变渐变色）→ 镜头猛推到最后一个词、框选 →
//   一群名字光标围上来把其中一个字拖出好多个（整词宽度不变、越挤越窄）→ 中间裂开冒出小人 → 上下一行行冒出同一个词的各种字体（有的带选框）铺满屏，
//   镜头慢慢推近、行左右漂，一次横扫拖影 → 黑色像素团从左边吞掉画面（031-B 一串，高潮）
// 学的动作（stephenhaney · Paper 17.0–27.5s，原片 1080×1080，30fps 逐帧量过，按 x+420 放进 1920×1080，2026-11-21）：
//   17.0–19.6 小字号（≈77）打字，句子左沿 x≈95；中间的词 18.0–18.6 像素乱跳、18.8 变渐变；19.75–20.0 横移 + 猛推（带拖影）
//   20.0 大词（宽 ≈633）居中带框；20.4 起名字光标陆续凑过来，20.6–21.6 挤成一团；20.75 起每 0.15s 多拖出一个字，整词宽度不变、字被挤窄
//   21.75 中间裂开一道缝，22.0 缝里冒出两个跳舞小人；22.3 镜头拉远到整句（字号 ≈105）
//   22.8 起上下一行行冒出同一个词的不同字体（行距 175，格宽 ≈310，部分带浅蓝选框），±1 行 22.8、±2 行 23.2、±3 行 23.5、±4 行 23.7
//   之后镜头慢慢推近：行距 23.9 180 → 24.6 200 → 25.4 230 → 26.2 260 → 27.1 290；各行左右慢漂（奇数行往左、偶数行往右）
//   24.95–25.15 一次横扫（各行猛甩、拖影），之后中间下一行换成前面那句话；27.0 黑色像素团从左边吞进来，27.45 全黑
//   第三轮（2026-11-23 用户：跳舞小人做不好就一比一复刻）：换成 _kit/pixelDancers——一男一女手拉手的 1-bit 像素小人，5 个姿势照原片逐帧摆，每 5 帧换一个、不插值（原片就是定格），从缝里三帧长出来
// 我们的内容：「让智能体 尽情 撒野」，大词「撒野」，拖出好多个「野」；格子里是「撒野」× 十种性格不同的字体（黄油体 / 草书 + 小薇 / 得意黑窄长 / 镂空 / 像素 / 毛笔 / 小人 / 快乐体 + 行书 / 实心 + 镂空 / 细宋拉开，第二轮），名字光标是虚构的人名，右下角标"虚构 · 仅作演示"。
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {PixelDancers} from '../_kit/pixelDancers';
import {LIB, useLibFonts} from '../_kit/libFonts';
import {GroupContract, checkContract, checkInputs, outputDuration, planExtras, toSource} from '../../../assets/lib/helpers/groupClock';

const FPS = 30;
const S0 = 17.0;
const OX = 420;
const BG = '#e6e6e6';
const SANS = '"Noto Sans CJK SC","PingFang SC",sans-serif';
const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const eio = (u: number) => { const x = clamp(u); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
const eo = (u: number) => 1 - Math.pow(1 - clamp(u), 3);
const hash = (n: number) => { const v = Math.sin(n * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };
const lin = (t: number, K: number[][]) => {
  if (t <= K[0][0]) return K[0][1];
  for (let i = 1; i < K.length; i++) if (t <= K[i][0]) { const [a, va] = K[i - 1], [b, vb] = K[i]; return va + (vb - va) * (t - a) / (b - a); }
  return K[K.length - 1][1];
};
const WHO = [['小林', '#e0442c', '#fff'], ['阿杰', '#1f9d5a', '#fff'], ['思思', '#7a3fc4', '#fff'], ['老王', '#f2b51b', '#222'], ['豆豆', '#e8691d', '#fff'], ['浩然', '#4b45a8', '#fff'], ['东东', '#b5e05a', '#222'], ['小斯', '#d63d8f', '#fff'], ['雨果', '#12988c', '#fff'], ['乔', '#7fd6d0', '#123']];
const POOL = '码字像素点阵格方块乱跳数据';
const GRAD = ['#3d6ff0', '#6e5be6', '#a04ad8'];

export const WORD_GRID_CONTRACT: GroupContract = {
  sourceDuration: 315 / 30,
  fps: 30,
  motion: [[0, 10.5]],
  holds: [],
  landmarks: {type: 0, pixel: 1.0, push: 2.75, crowd: 3.4, stretch: 3.75, split: 4.75, out: 5.3, rows: 5.8, sweep: 7.95, blob: 10.0},
  sfx: [
    {at: 'type', type: '键盘', note: '一串打字', tail: 2.4, volume: 0.22},
    {at: 'push', type: '短甩', note: '甩动 whoosh', volume: 0.35},
    {at: 'stretch', type: '运镜', note: '拉伸 stretch 一串', tail: 0.9, volume: 0.3},
    {at: 'split', type: '弹出', note: '弹出 pop', volume: 0.35},
    {at: 'rows', type: '轻tick', note: '一串 tick', tail: 1.0, volume: 0.25},
    {at: 'sweep', type: '短甩', note: '甩动 whoosh', volume: 0.4},
    {at: 'blob', type: '上扬铺垫', note: '吞没 swell', volume: 0.45},
  ],
  inputs: {lead: {maxChars: 4}, mid: {maxChars: 3}, word: {maxChars: 2}},
};
export type WordGridInputs = {lead: string; mid: string; word: string; note: string};
export const WORD_GRID_DEFAULT_INPUTS: WordGridInputs = {lead: '让', mid: '智能体', word: '撒野', note: '虚构 · 仅作演示'};
export const checkWordGridInputs = (x: WordGridInputs) => checkInputs(WORD_GRID_CONTRACT, {lead: x.lead, mid: x.mid, word: x.word});
export const planWordGrid = (sec: number) => planExtras(WORD_GRID_CONTRACT, sec);
export const wordGridFrames = (extras: number[]) => Math.round(outputDuration(WORD_GRID_CONTRACT, extras) * FPS);
export const WORD_GRID_DURATION = 315;

const NameTag: React.FC<{x: number; y: number; who: number; o?: number}> = ({x, y, who, o = 1}) => {
  const [n, c, tc] = WHO[who % WHO.length];
  return <div style={{position: 'absolute', left: x, top: y, opacity: o}}>
    <div style={{position: 'absolute', left: -7, top: -7, width: 14, height: 14, borderRadius: '50%', background: c}} />
    <div style={{position: 'absolute', left: 8, top: 8, padding: '3px 9px', borderRadius: 4, background: c, color: tc, fontFamily: SANS, fontSize: 18, fontWeight: 600, whiteSpace: 'nowrap'}}>{n}</div>
  </div>;
};
// 格子里「撒野」的各种写法
const Variant: React.FC<{v: number; fs: number; word: string; s: number}> = ({v, fs, word, s}) => {
  const base: React.CSSProperties = {fontSize: fs, lineHeight: 1, whiteSpace: 'nowrap', color: '#151515', display: 'inline-block'};
  const chars = Array.from(word);
  // 第二轮（2026-11-23 用户："31 的字体是偏艺术的……要学习内核"）：原片这一格一格是「同一个词 × 十几种性格完全不同的字体」，
  //   而且常常一个词里两个字用两种字（花体首字母 + 无衬线、粗黑 + 镂空）；以前只有思源黑 / 宋换字重，十格看起来都差不多。
  const two = (f0: React.CSSProperties, f1: React.CSSProperties) => <span style={base}><span style={{display: 'inline-block', ...f0}}>{chars[0]}</span><span style={{display: 'inline-block', ...f1}}>{chars.slice(1).join('')}</span></span>;
  switch (v % 10) {
    case 0: return <span style={{...base, fontFamily: LIB.huangyou, transform: 'skewX(-8deg)'}}>{word}</span>;
    case 1: return two({fontFamily: LIB.cao, transform: 'scale(1.4) translateY(-4%)', marginRight: fs * 0.08}, {fontFamily: LIB.xiaowei});
    case 2: return <span style={{...base, fontFamily: LIB.smiley, transform: 'scaleX(0.68) scaleY(1.2)', WebkitTextStroke: `${fs * 0.02}px #151515`}}>{word}</span>;
    case 3: return <span style={{...base, fontFamily: LIB.huangyou, color: 'transparent', WebkitTextStroke: `${fs * 0.018}px #151515`}}>{word}</span>;
    case 4: { const d = fs * 0.075; return <span style={{...base, fontFamily: SANS, fontWeight: 900, WebkitMaskImage: 'radial-gradient(circle, #000 52%, transparent 58%)', WebkitMaskSize: `${d}px ${d}px`, maskImage: 'radial-gradient(circle, #000 52%, transparent 58%)', maskSize: `${d}px ${d}px`}}>{word}</span>; }
    case 5: return <span style={{...base, fontFamily: LIB.brush, transform: 'scale(1.12)'}}>{word}</span>;
    case 6: return <span style={{...base, fontFamily: LIB.serif, fontWeight: 900}}>{chars[0]}<PixelDancers h={fs * 0.62} t={s} phase={v} />{chars.slice(1).join('')}</span>;
    case 7: return two({fontFamily: LIB.kuaile}, {fontFamily: LIB.xing, transform: 'scale(1.15)'});
    case 8: return two({fontFamily: LIB.huangyou}, {fontFamily: LIB.huangyou, color: 'transparent', WebkitTextStroke: `${fs * 0.018}px #151515`});
    default: return <span style={{...base, fontFamily: LIB.serif, fontWeight: 200, letterSpacing: '0.35em'}}>{word}</span>;
  }
};

export const WordStretchStyleGridGroup: React.FC<{inputs?: WordGridInputs; extras?: number[]}> = ({inputs: x = WORD_GRID_DEFAULT_INPUTS, extras = []}) => {
  useLibFonts(['huangyou', 'cao', 'xiaowei', 'smiley', 'brush', 'serif', 'kuaile', 'xing']);
  const tt = useCurrentFrame() / FPS;
  const s = toSource(tt, WORD_GRID_CONTRACT, extras) + S0;
  const els: React.ReactNode[] = [];
  const W2 = Array.from(x.word);
  // 1) 小字号打完一句
  if (s < 20.0) {
    const push = clamp((s - 19.75) / 0.25), k = eio(push);
    const F = 77 * (1 + k * 2.2), blur = Math.sin(Math.PI * push) * 14;
    const toks: {t: string; t0: number; t1: number; kind?: string; gap?: number}[] = [
      {t: x.lead, t0: 17.15, t1: 17.4}, {t: x.mid, t0: 18.0, t1: 18.3, kind: 'pix', gap: 0.15}, {t: '尽情', t0: 18.85, t1: 19.1, gap: 0.3}, {t: x.word, t0: 19.35, t1: 19.6, kind: 'word', gap: 0.3},
    ];
    let cx = 0; const parts: React.ReactNode[] = []; let caret = 0; let wordX = 0;
    toks.forEach((tk, ti) => {
      cx += (tk.gap ?? 0) * 100; if (tk.kind === 'word') wordX = cx;
      Array.from(tk.t).forEach((c, i, arr) => {
        const tc = tk.t0 + (tk.t1 - tk.t0) * (i / Math.max(1, arr.length - 1));
        if (s < tc) return;
        let ch = c, col = '#1d1d1f';
        if (tk.kind === 'pix') { if (s < 18.6) ch = POOL[Math.floor(hash(i * 7 + Math.floor(s * 15)) * POOL.length)]; col = s > 18.8 ? GRAD[i % 3] : '#86aaf0'; }
        parts.push(<span key={`${ti}_${i}`} style={{position: 'absolute', left: cx, width: 100, textAlign: 'center', color: col, fontWeight: tk.kind === 'word' ? 300 : 400, fontFamily: tk.kind === 'word' ? (i === 0 ? LIB.cao : SANS) : SANS}}>{ch}</span>);
        cx += 100; caret = cx;
      });
    });
    // 推近时以大词中心为锚
    const anchorB = wordX + 100, anchorScr = 95 + OX + (anchorB) * 0.77;
    const tx = anchorScr + (960 - anchorScr) * k;
    els.push(<div key="line" style={{position: 'absolute', left: tx, top: 540, transform: `scale(${F / 100})`, transformOrigin: '0 0', filter: blur > 0.5 ? `blur(${blur / (F / 100)}px)` : undefined}}>
      <div style={{position: 'absolute', left: -anchorB, top: -50, fontFamily: SANS, fontSize: 100, lineHeight: 1, height: 100}}>{parts}
        {s > 17.0 && <div style={{position: 'absolute', left: caret + 4, top: -6, width: 3, height: 112, background: '#222', opacity: s - 19.6 > 0.2 && Math.floor(s * 2.2) % 2 ? 0 : 1}} />}
        {s > 17.95 && s < 19.0 && <div style={{position: 'absolute', left: 115 - 10, top: -18, width: 320, height: 136, border: '3px solid #8fb1ef'}} />}
      </div>
    </div>);
  } else if (s < 22.75) {
    // 2) 大词：框选、名字光标围上来、拖出好多个「野」
    const zoomOut = eio((s - 22.25) / 0.35);
    const scl = 1 - zoomOut * 0.57; // 245 → 105
    const n = Math.min(6, Math.max(0, Math.floor((s - 20.75) / 0.15) + 1)) * (s > 20.75 ? 1 : 0);
    const split = eo((s - 21.75) / 0.25);
    const boxW = 633 * scl, F = 245 * scl;
    const chars = [W2[0], ...Array(n + 1).fill(W2[1])];
    const squeeze = 2 / chars.length;
    const gapW = split * F * 1.4; // 缝要装下一对像素小人（28×14 格）
    const left = 960 - (boxW + gapW) / 2;
    const cw = (boxW / chars.length);
    const nodes: React.ReactNode[] = [];
    chars.forEach((c, i) => {
      const extra = i >= chars.length - 1 && split > 0 ? gapW : 0;
      nodes.push(<div key={i} style={{position: 'absolute', left: left + i * cw + extra, top: 540 - F * 0.55, width: cw, height: F * 1.1, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><span style={{fontFamily: i === 0 ? LIB.cao : SANS, fontWeight: i === 0 ? 400 : 300, fontSize: i === 0 ? F * 1.25 : F, lineHeight: 1, transform: `scaleX(${i === 0 ? 1 : Math.max(0.28, squeeze * 1.15)})`, display: 'inline-block', color: '#151515'}}>{c}</span></div>);
    });
    if (s >= 22.2) nodes.push(<div key="dn" style={{position: 'absolute', left: left + (chars.length - 1) * cw + gapW * 0.04, top: 540 - F * 0.36}}><PixelDancers h={F * 0.62} t={s} born={22.2} /></div>);
    // 前面的「尽情」露在左边
    nodes.push(<div key="pre" style={{position: 'absolute', right: 1920 - left + F * 0.25, top: 540, transform: 'translateY(-50%)', fontFamily: SANS, fontSize: F, lineHeight: 1, color: '#1d1d1f', whiteSpace: 'nowrap'}}><span style={{color: GRAD[2]}}>{x.mid.slice(-1)}</span> 尽情</div>);
    els.push(...nodes);
    if (s < 21.9) els.push(<div key="box" style={{position: 'absolute', left: left - 20, top: 540 - F * 0.66, width: boxW + gapW + 40, height: F * 1.32, border: '3px solid #7fa6ee'}} />);
    // 名字光标：20.4 起陆续凑过来，21.6 挤成一团，21.8 散开
    WHO.forEach((_, i) => {
      const tIn = 20.4 + i * 0.12;
      if (s < tIn || s > 22.3) return;
      const ang = hash(i * 3) * Math.PI * 2, r0 = 520, r1 = 220 + hash(i) * 120, r2 = 60 + hash(i + 9) * 70;
      const k1 = eo((s - tIn) / 0.4), k2 = eio((s - 21.1) / 0.5), k3 = eo((s - 21.8) / 0.4);
      const r = r0 + (r1 - r0) * k1 + (r2 - r1) * k2 + (360 - r2) * k3;
      const cxp = 960 + boxW * 0.22 + Math.cos(ang) * r * 1.4, cyp = 540 + Math.sin(ang) * r * 0.55;
      els.push(<NameTag key={'w' + i} x={cxp} y={cyp} who={i} o={clamp((s - tIn) / 0.15) * (1 - clamp((s - 22.0) / 0.3))} />);
    });
  }
  // 3) 满屏一行行「撒野」的各种写法
  if (s >= 22.6) {
    const P = lin(s, [[22.6, 175], [23.9, 180], [24.6, 200], [25.4, 230], [26.2, 260], [27.1, 290], [27.5, 300]]);
    const CW = P * 1.95, FS = P * 0.74;
    const APPEAR = [0, 22.8, 23.2, 23.5, 23.7, 23.85];
    const sweep = clamp((s - 24.95) / 0.2), sw = eio(sweep), swBlur = Math.sin(Math.PI * sweep) * 14;
    for (let r = -5; r <= 5; r++) {
      const y = 540 + r * P;
      if (y < -P || y > 1080 + P) continue;
      if (r === 0 && s < 23.95) {
        // 中间那行还是那句话：尽情 撒野野野野(小人)野
        const F = Math.max(105, FS), k = clamp((s - 22.6) / 0.15);
        els.push(<div key="r0" style={{position: 'absolute', left: 960 - F * 4.5, top: y, transform: 'translateY(-50%)', whiteSpace: 'nowrap', fontSize: F, lineHeight: 1, opacity: k, display: 'flex', alignItems: 'center'}}>
          <span style={{fontFamily: SANS, color: '#1d1d1f', marginRight: F * 0.3}}>尽情</span>
          <span style={{display: 'inline-block', transform: 'scaleX(0.55)', transformOrigin: '0 50%', width: F * 4.2}}><span style={{fontFamily: LIB.cao, fontSize: F}}>{W2[0]}</span><span style={{fontFamily: SANS, fontWeight: 300}}>{W2[1].repeat(5)}</span></span>
          <PixelDancers h={F * 0.62} t={s} /><span style={{fontFamily: SANS, fontWeight: 300, marginLeft: F * 0.2}}>{W2[1]}</span>
        </div>);
        continue;
      }
      const ra = APPEAR[Math.min(5, Math.abs(r))];
      if (r !== 0 && s < ra) continue;
      const ao = r === 0 ? 1 : clamp((s - ra) / 0.12);
      const dir = Math.abs(r) % 2 ? -1 : 1;
      const off = hash(r * 13) * CW + dir * (s - 22.6) * 40 + (r % 2 ? 1 : -1) * sw * 1600 * (r === 1 ? 0.6 : 1);
      if (r === 1 && s > 25.15) {
        // 横扫之后这一行换成前面那句话
        const L = 'repeat';
        const seg = (k: number) => <span key={k} style={{marginRight: FS * 0.6, display: 'inline-flex', gap: FS * 0.1}}><span>{x.lead}</span>{Array.from(x.mid).map((c, i) => <span key={i} style={{color: GRAD[i % 3]}}>{c}</span>)}<span>尽情</span></span>;
        els.push(<div key={'r' + r + L} style={{position: 'absolute', left: -((s * 60) % (FS * 6.5)) - FS * 3, top: y, transform: 'translateY(-50%)', fontFamily: SANS, fontSize: FS * 1.05, lineHeight: 1, whiteSpace: 'nowrap', color: '#1d1d1f', filter: swBlur > 0.5 ? `blur(${swBlur}px)` : undefined}}>{[0, 1, 2, 3, 4, 5].map(seg)}</div>);
        continue;
      }
      const cells: React.ReactNode[] = [];
      for (let c = -2; c < Math.ceil(1920 / CW) + 3; c++) {
        const cx = ((off % CW) + CW) % CW + (c - 1) * CW;
        const v = Math.floor(hash(r * 31 + c * 7 + Math.floor(off / CW) * 3) * 8);
        const boxed = hash(r * 5 + c * 11) > 0.55;
        cells.push(<div key={c} style={{position: 'absolute', left: cx, top: -P * 0.36, width: CW * 0.86, height: P * 0.72, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: boxed ? 'inset 0 0 0 2px #8fb1ef' : undefined}}><Variant v={v} fs={FS} word={x.word} s={s} /></div>);
      }
      els.push(<div key={'r' + r} style={{position: 'absolute', left: 0, top: y, width: 1920, opacity: ao, filter: swBlur > 0.5 ? `blur(${swBlur}px)` : undefined}}>{cells}</div>);
    }
    // 几个名字光标在格子里晃
    [[23.4, 26.8, 1, 0.42, 0.33], [24.2, 26.6, 2, 0.62, 0.62], [25.6, 27.2, 7, 0.36, 0.55]].forEach(([a, b, w, fx, fy], i) => { if (s > a && s < b) els.push(<NameTag key={'g' + i} x={fx * 1920 + Math.sin(s * 2 + i) * 30} y={fy * 1080 + Math.cos(s * 1.7 + i) * 20} who={w} o={clamp((s - a) / 0.2) * clamp((b - s) / 0.2)} />); });
  }
  // 4) 黑色像素团从左边吞进来
  if (s >= 27.0) {
    const R = lin(s, [[27.0, 260], [27.15, 600], [27.3, 1250], [27.45, 2400]]);
    const cxB = -120, cyB = 650, G = 40, cellsB: React.ReactNode[] = [];
    for (let gy = 0; gy < 1080; gy += G) for (let gx = 0; gx < 1920; gx += G) {
      const d = Math.hypot(gx + G / 2 - cxB, (gy + G / 2 - cyB) * 1.2) + (hash(gx * 3 + gy) - 0.5) * 80;
      if (d < R) cellsB.push(<div key={gx + '_' + gy} style={{position: 'absolute', left: gx, top: gy, width: G + 1, height: G + 1, background: d > R - 70 ? '#444' : '#000'}} />);
    }
    els.push(<div key="blob">{cellsB}</div>);
  }
  return (
    <AbsoluteFill style={{background: BG, overflow: 'hidden'}}>
      {els}
      <div style={{position: 'absolute', right: 36, bottom: 26, fontFamily: SANS, fontSize: 20, color: s > 27.3 ? 'rgba(255,255,255,0.4)' : 'rgba(60,60,60,0.4)', letterSpacing: '0.06em'}}>{x.note}</div>
    </AbsoluteFill>
  );
};

if (checkContract(WORD_GRID_CONTRACT).length) throw new Error(checkContract(WORD_GRID_CONTRACT).join('；'));
export const WordStretchStyleGrid: React.FC = () => <WordStretchStyleGridGroup />;
