// 【镜头组】condensed-lines-poster-card：黑底上一大团字符画（灰色字母拼的漩涡）→ 三行超窄超细的高字一行行打出来 →
//   名字光标框住第一行、一拉变成宽的细字 → 第二行变粗窄白字、第三行变超粗 → 推进一张蓝色海报卡，大字一行行打出来，每打完一行就被框选换成另一种字重（031-C 一拍，排版海报）
// 学的动作（stephenhaney · Paper 27.5–36.0s，原片 1080×1080，30fps 逐帧量过，按 x+420 放进 1920×1080，2026-11-21）：
//   三行高字：每行高 ≈290，横向只有正常字宽的 ≈15%（第一行 x 148–270，y 121–432；第二行 y 378–675；第三行 y 675–891）；28.0 / 28.5 / 29.1 起各打一行
//   29.7–29.9 第一行一拉变宽（x 148–918，高 243，细字），框住时两个名字光标在旁边；30.1–30.5 第二行变粗窄白字（y 391–621）
//   30.7–31.0 第三行前半变超粗白字（x 162–837，y 648–905，青色框），后半还是细字（橙色框）；31.75–32.0 推进（拖影）
//   32.0 蓝色海报卡（x 162–918，y 175–931，带细网格线，左上小标签）；第一行 32.0 打细字 → 32.5 框选（土黄底）→ 32.85 变超粗占满卡宽
//   第二行 33.1–33.6 打细字（y 418–567）；第三行 34.0 打出、34.2–34.4 框选变超粗（y 567–783）；第四行 34.5–35.3 每个字一种字体（y 783–931），一群名字光标围着
//   背景字符画：灰色等宽字母一行行铺满，被一个大的漩涡形状挡住一部分，一直在慢慢流
// 我们的内容：「说出口 / 就像你 / 当真。」→ 海报「一行 / 字。/ 100 / 种世界」，字体换成素材库艺术字体（思源黑 Black 加描边做超粗 + 思源黑发丝细，满版齐行，最后一行每字一种字体，第二轮），背景换成会转的 3D 字符画甜甜圈，名字光标是虚构的人名，右下角标"虚构 · 仅作演示"。
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {AsciiDonut} from '../_kit/asciiDonut';
import {LIB, useLibFonts} from '../_kit/libFonts';
import {GroupContract, checkContract, checkInputs, outputDuration, planExtras, toSource} from '../../../assets/lib/helpers/groupClock';

const FPS = 30;
const S0 = 27.5;
const OX = 420;
const SANS = '"Noto Sans CJK SC","PingFang SC",sans-serif';
const SERIF = '"Noto Serif CJK SC","Songti SC",serif';
const MONO = '"Noto Sans Mono CJK SC","DejaVu Sans Mono",monospace';
const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const eio = (u: number) => { const x = clamp(u); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
const eo = (u: number) => 1 - Math.pow(1 - clamp(u), 3);
const hash = (n: number) => { const v = Math.sin(n * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };
const WHO = [['小林', '#e0442c', '#fff'], ['阿杰', '#1f9d5a', '#fff'], ['思思', '#7a3fc4', '#fff'], ['老王', '#f2b51b', '#222'], ['豆豆', '#e8691d', '#fff'], ['浩然', '#4b45a8', '#fff'], ['东东', '#b5e05a', '#222'], ['小斯', '#d63d8f', '#fff'], ['雨果', '#12988c', '#fff'], ['乔', '#7fd6d0', '#123']];

export const POSTER_CARD_CONTRACT: GroupContract = {
  sourceDuration: 255 / 30,
  fps: 30,
  motion: [[0, 3.55], [3.7, 8.0]],
  holds: [{at: 3.62, maxExtra: 1}, {at: 8.2, maxExtra: 1.5}],
  landmarks: {l1: 0.5, l2: 1.0, l3: 1.6, widen: 2.2, bold: 2.6, heavy: 3.2, push: 4.25, card: 4.5, one: 5.35, line: 5.6, hundred: 6.5, worlds: 7.0},
  sfx: [
    {at: 'l1', type: '键盘', note: '一串打字', tail: 1.1, volume: 0.22},
    {at: 'widen', type: '运镜', note: '拉伸 stretch', volume: 0.35},
    {at: 'bold', type: '弹出', note: '换字体 pop', volume: 0.35},
    {at: 'heavy', type: '轻落定', note: '重击 thump', volume: 0.4},
    {at: 'push', type: '短甩', note: '甩动 whoosh', volume: 0.35},
    {at: 'one', type: '轻落定', note: '重击 thump', volume: 0.4},
    {at: 'hundred', type: '轻落定', note: '重击 thump', volume: 0.4},
  ],
  inputs: {lines: {count: 3, maxChars: 3}, poster: {count: 4, maxChars: 3}},
};
export type PosterCardInputs = {lines: string[]; label: string; poster: string[]; note: string};
export const POSTER_CARD_DEFAULT_INPUTS: PosterCardInputs = {lines: ['说出口', '就像你', '当真。'], label: '一行字', poster: ['一行', '字。', '100', '种世界'], note: '虚构 · 仅作演示'};
export const checkPosterCardInputs = (x: PosterCardInputs) => checkInputs(POSTER_CARD_CONTRACT, {lines: x.lines, poster: x.poster});
export const planPosterCard = (sec: number) => planExtras(POSTER_CARD_CONTRACT, sec);
export const posterCardFrames = (extras: number[]) => Math.round(outputDuration(POSTER_CARD_CONTRACT, extras) * FPS);
export const POSTER_CARD_DURATION = 255;

const NameTag: React.FC<{x: number; y: number; who: number; o?: number}> = ({x, y, who, o = 1}) => {
  const [n, c, tc] = WHO[who % WHO.length];
  return <div style={{position: 'absolute', left: x, top: y, opacity: o}}>
    <div style={{position: 'absolute', left: -7, top: -7, width: 14, height: 14, borderRadius: '50%', background: c}} />
    <div style={{position: 'absolute', left: 8, top: 8, padding: '3px 9px', borderRadius: 4, background: c, color: tc, fontFamily: SANS, fontSize: 18, fontWeight: 600, whiteSpace: 'nowrap'}}>{n}</div>
  </div>;
};
// 字符画背景：一行行等宽字母，被漩涡形状挡掉一部分
export const AsciiSwirl: React.FC<{s: number; color: string; o: number}> = ({s, color, o}) => {
  const rows = 64, W = 'paperomgpaper*+=-:omgpaperpaperpg';
  const lines = Array.from({length: rows}, (_, r) => {
    const sh = Math.floor(s * 6 + r * 3) % W.length;
    return (W.slice(sh) + W + W + W + W + W + W).slice(0, 140);
  });
  const mask = `radial-gradient(ellipse 34% 40% at ${46 + Math.sin(s * 0.5) * 2}% 46%, transparent 38%, #000 40%, #000 52%, transparent 58%, transparent 66%, #000 70%, #000 78%, transparent 84%)`;
  return <div style={{position: 'absolute', inset: 0, opacity: o, WebkitMaskImage: mask, maskImage: mask}}>
    {lines.map((l, r) => <div key={r} style={{position: 'absolute', left: -20, top: r * 17, fontFamily: MONO, fontSize: 15, lineHeight: 1, color, whiteSpace: 'pre', opacity: 0.55 + 0.45 * hash(r)}}>{l}</div>)}
  </div>;
};

export const CondensedLinesPosterCardGroup: React.FC<{inputs?: PosterCardInputs; extras?: number[]}> = ({inputs: x = POSTER_CARD_DEFAULT_INPUTS, extras = [0, 0]}) => {
  useLibFonts(['huangyou', 'cao', 'brush', 'serif', 'xing', 'kuaile', 'smiley']);
  const tt = useCurrentFrame() / FPS;
  const s = toSource(tt, POSTER_CARD_CONTRACT, extras) + S0;
  const els: React.ReactNode[] = [];
  const typedN = (str: string, t0: number, t1: number) => { const A = Array.from(str); return A.slice(0, Math.floor(clamp((s - t0) / (t1 - t0)) * A.length + (s >= t0 ? 1 : 0))).join(''); };
  const push = clamp((s - 31.75) / 0.25), pk = eio(push), blur = Math.sin(Math.PI * push) * 16;
  if (s < 32.0) {
    // 三行高字
    const L = x.lines;
    const sc = 1 + pk * 0.6;
    const wrap: React.CSSProperties = {position: 'absolute', inset: 0, transform: `scale(${sc})`, transformOrigin: `${540 + OX}px 520px`, filter: blur > 0.5 ? `blur(${blur}px)` : undefined, opacity: 1 - clamp((s - 31.92) / 0.08)};
    const widen = eio((s - 29.7) / 0.2), bold = eio((s - 30.1) / 0.4), heavy = eio((s - 30.7) / 0.3);
    const lineEl = (txt: string, y0: number, h: number, x0: number, wTarget: number, k: number, style: React.CSSProperties, key: string) => {
      const n = Math.max(1, Array.from(txt).length);
      const natural = h * 0.92 * n; // 正常字宽
      const narrow = 0.15 * 3 / n;
      const sx = narrow + (wTarget / natural - narrow) * k;
      return <div key={key} style={{position: 'absolute', left: x0 + OX, top: y0, height: h, display: 'flex', alignItems: 'center', transform: `scaleX(${sx})`, transformOrigin: '0 50%', whiteSpace: 'nowrap'}}><span style={{fontSize: h * 0.92, lineHeight: 1, color: '#f4f4f4', ...style}}>{txt}</span></div>;
    };
    const l1 = typedN(L[0], 28.0, 28.4), l2 = typedN(L[1], 28.5, 29.0), l3 = typedN(L[2], 29.1, 29.6);
    const lines: React.ReactNode[] = [];
    if (s >= 28.0) lines.push(lineEl(l1, 121 + widen * 14, 311 - widen * 68, 148, 770, widen, {fontFamily: SANS, fontWeight: widen > 0.5 ? 100 : 300}, 'a'));
    // 第二轮（2026-11-23 用户：31 是偏艺术的字体，要学内核）：原片三行是「满版齐行」——每一行都撑到同一个宽度（x 148–918），
    //   而且一行里粗细混排：LIKE 超粗窄 + YOU 发丝细高，MEAN 超粗撑满 + IT. 发丝细；以前第二行整行变粗、第三行没撑满。
    if (s >= 28.5) {
      const t2 = Array.from(l2), h2 = t2.slice(0, 2).join(''), r2 = t2.slice(2).join('');
      const y2 = 378 + bold * 13, hh2 = 297 - bold * 67;
      lines.push(lineEl(h2, y2, hh2, 189 - bold * 41, 520, bold, {fontFamily: SANS, fontWeight: bold > 0.5 ? 900 : 300, WebkitTextStroke: bold > 0.5 ? '6px #f4f4f4' : undefined}, 'b'));
      if (r2) lines.push(lineEl(r2, y2 - bold * 10, hh2 + bold * 20, 189 + (bold > 0 ? -41 + 530 * bold : 2 * hh2 * 0.15 * 1.5), 250, bold, {fontFamily: SANS, fontWeight: 100}, 'b2'));
    }
    if (s >= 29.1) {
      const t3 = Array.from(l3), head = t3.slice(0, 2).join(''), tail = t3.slice(2).join('');
      lines.push(lineEl(head, 675 - heavy * 27, 216 + heavy * 41, 148, 680, heavy, {fontFamily: SANS, fontWeight: heavy > 0.5 ? 900 : 300, WebkitTextStroke: heavy > 0.5 ? '8px #f4f4f4' : undefined}, 'c'));
      if (tail) lines.push(<div key="c2" style={{position: 'absolute', left: 148 + OX + (heavy > 0 ? 680 * heavy + 14 : 50), top: 675 - heavy * 27, height: 216 + heavy * 41, display: 'flex', alignItems: 'center', transform: `scaleX(${0.12 + 0.22 * heavy}) scaleY(${1 + 0.2 * heavy})`, transformOrigin: '0 50%'}}><span style={{fontFamily: SANS, fontWeight: 100, fontSize: 230, color: '#f4f4f4'}}>{tail}</span></div>);
    }
    // 光标
    const last = s < 28.5 ? [l1, 121, 311, 148] : s < 29.1 ? [l2, 378, 297, 189] : [l3, 675, 216, 162];
    if (s >= 27.95 && s < 29.75) lines.push(<div key="car" style={{position: 'absolute', left: (last[3] as number) + OX + Array.from(last[0] as string).length * (last[2] as number) * 0.08 + 6, top: (last[1] as number) + 20, width: 3, height: (last[2] as number) - 40, background: '#eee', opacity: Math.floor(s * 2.4) % 2 ? 1 : 0.2}} />);
    // 框和名字光标
    if (s > 29.75 && s < 30.3) { lines.push(<div key="b1" style={{position: 'absolute', left: 148 + OX - 6, top: 140, width: 520, height: 230, border: '3px solid #e8a33a'}} />); lines.push(<div key="b2" style={{position: 'absolute', left: 148 + OX + 540, top: 140, width: 240, height: 230, border: '3px solid #d63d8f'}} />); lines.push(<NameTag key="n1" x={148 + OX + 260} y={300} who={3} />); lines.push(<NameTag key="n2" x={148 + OX + 620} y={290} who={7} />); }
    if (s > 30.1 && s < 30.8) { lines.push(<div key="b3" style={{position: 'absolute', left: 156 + OX, top: 391, width: 660, height: 232, border: '3px solid #7fd67f'}} />); [8, 4, 5, 6, 3, 0, 1].forEach((w, i) => lines.push(<NameTag key={'g' + i} x={OX + 170 + i * 95} y={560 + (i % 2) * 18} who={w} o={clamp((s - 30.1 - i * 0.03) / 0.1)} />)); }
    if (s > 30.7) { lines.push(<div key="b4" style={{position: 'absolute', left: 162 + OX, top: 648, width: 610, height: 257, border: '3px solid #6fd8c8', opacity: 1 - clamp((s - 31.6) / 0.1)}} />); lines.push(<div key="b5" style={{position: 'absolute', left: 162 + OX + 625, top: 648, width: 70, height: 257, border: '3px solid #e8691d', opacity: 1 - clamp((s - 31.6) / 0.1)}} />); lines.push(<NameTag key="n3" x={OX + 330} y={860} who={9} />); lines.push(<NameTag key="n4" x={OX + 760} y={890} who={4} />); lines.push(<NameTag key="n5" x={OX + 380} y={540} who={0} />); lines.push(<NameTag key="n6" x={OX + 280} y={420} who={6} />); }
    els.push(<div key="lines" style={wrap}>{lines}</div>);
  } else {
    // 蓝色海报卡
    const P = x.poster, cardIn = eo((s - 32.0) / 0.2);
    const card: React.ReactNode[] = [];
    card.push(<div key="lab" style={{position: 'absolute', left: 162 + OX, top: 138, fontFamily: SANS, fontSize: 22, color: '#ddd'}}>{x.label}</div>);
    const gridLines = Array.from({length: 5}, (_, i) => <div key={'gl' + i} style={{position: 'absolute', left: 0, right: 0, top: 128 + i * 128, height: 1, background: 'rgba(30,40,80,0.18)'}} />);
    const gridCols = Array.from({length: 5}, (_, i) => <div key={'gc' + i} style={{position: 'absolute', top: 0, bottom: 0, left: 126 + i * 126, width: 1, background: 'rgba(30,40,80,0.14)'}} />);
    const row = (txt: string, cy: number, h: number, st: React.CSSProperties, key: string, fit = false) => <div key={key} style={{position: 'absolute', left: 6, right: 6, top: cy - h / 2, height: h, display: 'flex', alignItems: 'center', justifyContent: fit ? 'space-between' : 'flex-start', overflow: 'visible', whiteSpace: 'nowrap'}}><span style={{fontSize: h, lineHeight: 1, color: '#14161c', ...st}}>{txt}</span></div>;
    const one = s >= 32.85, hl1 = s >= 32.5 && s < 32.95;
    const inner: React.ReactNode[] = [...gridLines, ...gridCols];
    if (hl1) inner.push(<div key="h1" style={{position: 'absolute', left: 0, top: 18, width: 756, height: 200, background: 'rgba(150,120,40,0.85)'}} />);
    inner.push(row(typedN(P[0], 32.0, 32.25), 122, 250, one ? {fontFamily: SANS, fontWeight: 900, WebkitTextStroke: '7px #14161c', transform: `scaleX(${800 / (Array.from(P[0]).length * 250)})`, transformOrigin: '0 50%', display: 'inline-block'} : {fontFamily: SANS, fontWeight: 100}, 'r1'));
    if (s >= 33.1) {
      if (s > 33.8 && s < 34.0) inner.push(<div key="h2" style={{position: 'absolute', left: 0, top: 250, width: 430, height: 140, background: 'rgba(60,70,150,0.6)'}} />);
      inner.push(row(typedN(P[1], 33.1, 33.6), 322, 170, {fontFamily: SANS, fontWeight: 100, display: 'inline-block', transform: `scaleX(${744 / (Array.from(P[1]).length * 170)})`, transformOrigin: '0 50%'}, 'r2')); // 原片 LINE. 是发丝细的宽体、撑满卡宽
    }
    if (s >= 34.0) {
      const hv = s >= 34.4;
      if (s >= 34.2 && s < 34.5) inner.push(<div key="h3" style={{position: 'absolute', left: 0, top: 395, width: 756, height: 210, background: 'rgba(160,70,70,0.75)'}} />);
      inner.push(row(typedN(P[2], 34.0, 34.15), 505, 260, hv ? {fontFamily: SANS, fontWeight: 900, WebkitTextStroke: '6px #14161c', letterSpacing: '0.02em', transform: 'scaleX(1.6)', transformOrigin: '0 50%', display: 'inline-block'} : {fontFamily: SANS, fontWeight: 100}, 'r3'));
    }
    if (s >= 34.5) {
      const A = Array.from(P[3]);
      // 原片 WORLDS 每个字母一种字体、一直在换；我们用素材库里性格完全不同的字体轮着换，整行两端撑满
      const styles: React.CSSProperties[] = [{fontFamily: LIB.huangyou}, {fontFamily: LIB.cao, transform: 'scale(1.15)', display: 'inline-block'}, {fontFamily: LIB.huangyou, color: 'transparent', WebkitTextStroke: '3px #14161c'}, {fontFamily: LIB.brush}, {fontFamily: LIB.serif, fontWeight: 900}, {fontFamily: LIB.xing, transform: 'scale(1.1)', display: 'inline-block'}, {fontFamily: LIB.kuaile}, {fontFamily: LIB.smiley, transform: 'scaleX(0.7) scaleY(1.15)', display: 'inline-block'}];
      const shown = A.slice(0, Math.floor(clamp((s - 34.5) / 0.8) * A.length + 1));
      inner.push(<div key="r4" style={{position: 'absolute', left: 6, right: 6, top: 590, height: 200, display: 'flex', alignItems: 'center', justifyContent: shown.length === A.length ? 'space-between' : 'flex-start', gap: 20}}>{shown.map((c, i) => <span key={i} style={{fontSize: 190, lineHeight: 1, color: '#14161c', ...styles[(i * 3 + Math.floor(Math.max(0, s - 34.5 - i * 0.25) * 5)) % styles.length]}}>{c}</span>)}</div>);
    }
    card.push(<div key="card" style={{position: 'absolute', left: 162 + OX, top: 175, width: 756, height: 756, background: '#5d8ef0', overflow: 'hidden', transform: `scale(${0.6 + 0.4 * cardIn})`, opacity: cardIn}}>{inner}</div>);
    // 名字光标
    const tags = [[32.0, 32.9, 3, 175, 320], [32.5, 33.2, 3, 930, 380], [33.2, 34.2, 5, 260, 560], [34.0, 34.8, 0, 930, 560], [34.0, 34.8, 2, 400, 750], [34.5, 36.0, 8, 200, 930], [34.6, 36.0, 2, 380, 935], [34.7, 36.0, 7, 520, 935], [34.75, 36.0, 4, 600, 935], [34.8, 36.0, 6, 720, 935], [34.9, 36.0, 1, 860, 870], [35.0, 36.0, 9, 800, 935]];
    tags.forEach(([a, b, w, tx, ty], i) => { if (s > a && s < b) card.push(<NameTag key={'t' + i} x={tx + OX} y={ty + Math.sin(s * 3 + i) * 8} who={w} o={clamp((s - a) / 0.15) * clamp((b - s) / 0.15)} />); });
    els.push(...card);
  }
  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      <AsciiDonut cx={1010} cy={360} size={1250} a={0.9 + (s - 27.5) * 0.32} b={0.3 + (s - 27.5) * 0.18} color="#555" strong="#7c7c7c" o={0.85 * clamp((s - 27.55) / 0.3)} />
      {els}
      <div style={{position: 'absolute', right: 36, bottom: 26, fontFamily: SANS, fontSize: 20, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.06em'}}>{x.note}</div>
    </AbsoluteFill>
  );
};

if (checkContract(POSTER_CARD_CONTRACT).length) throw new Error(checkContract(POSTER_CARD_CONTRACT).join('；'));
export const CondensedLinesPosterCard: React.FC = () => <CondensedLinesPosterCardGroup />;
