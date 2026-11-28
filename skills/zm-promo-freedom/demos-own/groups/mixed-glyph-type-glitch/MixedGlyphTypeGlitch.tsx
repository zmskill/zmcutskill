// 【镜头组】mixed-glyph-type-glitch：浅灰底 + 淡淡的字符画漩涡，一句话一个字一个字打出来、每个字都在不停换字体（花体 / 超粗 / 描边 / 键帽框 / 等宽）、框选着 →
//   硬切两行等宽字，打出来的字先在各国文字里乱跳再定住 → 硬切一个大词也在乱换字体（031-D 一拍，收束口号）
// 学的动作（stephenhaney · Paper 36.0–40.0s，原片 1080×1080，30fps 逐帧量过，按 x+420 放进 1920×1080，2026-11-21）：
//   第一句 36.05 起打，字在 y 432–648（中线 540），左沿 x≈108，外面一个浅蓝选框；每个字打出来后约每 0.1s 换一次字体，0.4s 后定住
//   37.0 起光标钉在右边、字往左挪；37.95 硬切：两行等宽字（左沿 108，行中线 520 / 600），每个字先在各国文字里乱跳 0.2–0.3s 再定住，第二行 38.4 起，39.2 全部定住
//   39.75 硬切：一个大词（字高 ≈300）每个字乱换字体，40.0 接下一段
// 我们的内容：「富文本 就在 纸页」→「设计也能 / 重新好玩起来」→「纸页」，「纸页」是虚构的产品名，右下角标"虚构 · 仅作演示"。
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {LIB, useLibFonts} from '../_kit/libFonts';
import {AsciiDonut} from '../_kit/asciiDonut';
import {GroupContract, checkContract, checkInputs, outputDuration, planExtras, toSource} from '../../../assets/lib/helpers/groupClock';

const FPS = 30;
const S0 = 36.0;
const OX = 420;
const SANS = '"Noto Sans CJK SC","PingFang SC",sans-serif';
const SERIF = '"Noto Serif CJK SC","Songti SC",serif';
const MONO = '"Noto Sans Mono CJK SC","DejaVu Sans Mono",monospace';
const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const hash = (n: number) => { const v = Math.sin(n * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };
const GL = 'अकআ字テルдж한ψΔßÆ¥€§ทกعبजरत文ʃǂ∂ŋ';

export const MIXED_GLYPH_CONTRACT: GroupContract = {
  sourceDuration: 120 / 30,
  fps: 30,
  motion: [[0, 1.65], [1.95, 3.25], [3.75, 4.0]],
  holds: [{at: 1.8, maxExtra: 1}, {at: 3.5, maxExtra: 1.5}],
  landmarks: {line1: 0.05, pan: 1.0, mono: 1.95, line2: 2.4, settle: 3.2, big: 3.75},
  sfx: [
    {at: 'line1', type: '键盘', note: '一串打字', tail: 1.5, volume: 0.22},
    {at: 'mono', type: '故障', note: '数码乱跳 glitch', tail: 1.2, volume: 0.28},
    {at: 'big', type: '弹出', note: '换字体 pop', volume: 0.35},
  ],
  inputs: {line: {count: 3, maxChars: 3}, mono: {count: 2, maxChars: 6}, big: {maxChars: 2}},
};
export type MixedGlyphInputs = {line: string[]; mono: string[]; big: string; note: string};
export const MIXED_GLYPH_DEFAULT_INPUTS: MixedGlyphInputs = {line: ['富文本', '就在', '纸页'], mono: ['设计也能', '重新好玩起来'], big: '纸页', note: '虚构 · 仅作演示'};
export const checkMixedGlyphInputs = (x: MixedGlyphInputs) => checkInputs(MIXED_GLYPH_CONTRACT, {line: x.line, mono: x.mono, big: x.big});
export const planMixedGlyph = (sec: number) => planExtras(MIXED_GLYPH_CONTRACT, sec);
export const mixedGlyphFrames = (extras: number[]) => Math.round(outputDuration(MIXED_GLYPH_CONTRACT, extras) * FPS);
export const MIXED_GLYPH_DURATION = 120;

// 字符画背景：一行行等宽字母，被漩涡形状挡掉一部分
const AsciiSwirl: React.FC<{s: number; color: string; o: number}> = ({s, color, o}) => {
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

// 第二轮（2026-11-23 用户：31 字体偏艺术、要学内核）：每个字在九种性格完全不同的字体里跳（草书 / 黄油体 / 镂空 / 键帽 / 等宽 / 毛笔 / 行书 / 得意黑窄长 / 快乐体），
//   以前只有思源黑 / 宋换字重，跳来跳去看不出区别
const STY = (v: number, F: number): React.CSSProperties => {
  switch (v % 9) {
    case 0: return {fontFamily: LIB.cao, transform: 'scale(1.2)'};
    case 1: return {fontFamily: LIB.huangyou};
    case 2: return {fontFamily: LIB.huangyou, color: 'transparent', WebkitTextStroke: `${F * 0.018}px #1d1d1f`};
    case 3: return {fontFamily: SANS, fontWeight: 500, border: `${F * 0.03}px solid #1d1d1f`, borderRadius: F * 0.12, padding: `0 ${F * 0.06}px`, transform: 'scale(0.8)'};
    case 4: return {fontFamily: MONO, fontWeight: 400};
    case 5: return {fontFamily: LIB.brush, transform: 'scale(1.1)'};
    case 6: return {fontFamily: LIB.xing, transform: 'scale(1.12)'};
    case 7: return {fontFamily: LIB.smiley, transform: 'scaleX(0.7) scaleY(1.15)'};
    default: return {fontFamily: LIB.kuaile};
  }
};

export const MixedGlyphTypeGlitchGroup: React.FC<{inputs?: MixedGlyphInputs; extras?: number[]}> = ({inputs: x = MIXED_GLYPH_DEFAULT_INPUTS, extras = [0, 0]}) => {
  useLibFonts(['cao', 'huangyou', 'brush', 'xing', 'smiley', 'kuaile']);
  const tt = useCurrentFrame() / FPS;
  const s = toSource(tt, MIXED_GLYPH_CONTRACT, extras) + S0;
  const els: React.ReactNode[] = [];
  if (s < 37.95) {
    const F = 200;
    const chars: {c: string; t: number; final: number}[] = [];
    let t = 36.05;
    x.line.forEach((w, wi) => { Array.from(w).forEach((c, ci) => { chars.push({c, t, final: (wi * 4 + ci * 3 + 1) % 9}); t += 0.15; }); t += wi === 0 ? 0.35 : 0.15; chars.push({c: ' ', t: t - 0.1, final: 5}); });
    const shown = chars.filter((ch) => s >= ch.t);
    const caretW = shown.reduce((a, ch) => a + (ch.c === ' ' ? F * 0.35 : F * 1.05), 0);
    const panX = s < 37.0 ? 0 : Math.max(0, caretW - (1000 - 108)); // 37.0 起光标钉在右边
    const nodes = shown.map((ch, i) => {
      if (ch.c === ' ') return <span key={i} style={{display: 'inline-block', width: F * 0.35}} />;
      const age = s - ch.t, v = age < 0.4 ? Math.floor(hash(i * 7 + Math.floor(s * 10)) * 9) : ch.final;
      return <span key={i} style={{display: 'inline-flex', width: F * 1.05, justifyContent: 'center'}}><span style={{display: 'inline-block', fontSize: F, lineHeight: 1, color: '#1d1d1f', ...STY(v, F)}}>{ch.c}</span></span>;
    });
    els.push(<div key="l" style={{position: 'absolute', left: 108 + OX - panX, top: 540, transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', whiteSpace: 'nowrap'}}>{nodes}<span style={{width: 4, height: F * 1.1, background: '#222', marginLeft: 6, opacity: Math.floor(s * 2.4) % 2 ? 1 : 0.15}} /></div>);
    els.push(<div key="box" style={{position: 'absolute', left: 80 + OX - Math.min(panX, 0), top: 432, width: Math.min(caretW, 1000 - 60) + 56, height: 216, border: '2px solid #8fb1ef'}} />);
  } else if (s < 39.75) {
    const F = 130;
    const lines = x.mono.map((l, li) => {
      const t0 = li === 0 ? 37.98 : 38.4, t1 = li === 0 ? 38.6 : 39.2;
      const A = Array.from(l);
      return <div key={li} style={{position: 'absolute', left: 108 + OX, top: li === 0 ? 500 : 640, transform: 'translateY(-50%)', fontFamily: MONO, fontSize: F, lineHeight: 1, color: '#1d1d1f', whiteSpace: 'nowrap', display: 'flex'}}>
        {A.map((c, i) => {
          const tc = t0 + (t1 - t0) * (i / A.length) + 0.35; // 原片：整行先一下子满屏乱码（各国文字），再从左到右一个个定住
          if (s < 37.96 + 0.04 * (i / A.length)) return null;
          const settled = s >= tc;
          const ch = settled ? c : GL[Math.floor(hash(li * 31 + i * 7 + Math.floor(s * 20)) * GL.length)];
          return <span key={i} style={{display: 'inline-block', width: F * 1.05, textAlign: 'center', fontFamily: settled ? MONO : [LIB.cao, LIB.huangyou, LIB.brush, LIB.xing, LIB.kuaile][Math.floor(hash(i + Math.floor(s * 20)) * 5)], fontWeight: 400}}>{ch}</span>;
        })}
      </div>;
    });
    els.push(...lines);
    if (s < 38.95) els.push(<div key="box2" style={{position: 'absolute', left: 80 + OX, top: 415, width: 900, height: 310, border: '2px solid #8fb1ef'}} />);
  } else {
    const F = 300;
    els.push(<div key="big" style={{position: 'absolute', left: 108 + OX, top: 540, transform: 'translateY(-50%)', display: 'flex', alignItems: 'center'}}>{Array.from(x.big).map((c, i) => <span key={i} style={{display: 'inline-flex', width: F * 1.05, justifyContent: 'center'}}><span style={{display: 'inline-block', fontSize: F, lineHeight: 1, color: '#1d1d1f', ...STY(Math.floor(hash(i * 5 + Math.floor(s * 12)) * 9), F)}}>{c}</span></span>)}</div>);
    els.push(<div key="box3" style={{position: 'absolute', left: 80 + OX, top: 380, width: 700, height: 320, border: '2px solid #8fb1ef'}} />);
  }
  return (
    <AbsoluteFill style={{background: '#e6e6e6', overflow: 'hidden'}}>
      <AsciiDonut cx={1380} cy={420} size={1050} a={1.1 + (s - 36) * 0.32} b={0.5 + (s - 36) * 0.18} color="#a8a8a8" strong="#8a8a8a" o={0.5} />
      {els}
      <div style={{position: 'absolute', right: 36, bottom: 26, fontFamily: SANS, fontSize: 20, color: 'rgba(60,60,60,0.4)', letterSpacing: '0.06em'}}>{x.note}</div>
    </AbsoluteFill>
  );
};

if (checkContract(MIXED_GLYPH_CONTRACT).length) throw new Error(checkContract(MIXED_GLYPH_CONTRACT).join('；'));
export const MixedGlyphTypeGlitch: React.FC = () => <MixedGlyphTypeGlitchGroup />;
