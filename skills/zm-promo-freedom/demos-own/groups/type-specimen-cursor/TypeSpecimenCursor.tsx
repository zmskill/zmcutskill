// 【镜头组】type-specimen-cursor：薄荷浅底从右边推进来，字体展示页：左上小标签「▶ 主字体」、右上字体名，下面两行大字跟着一根高高的方括号光标一会儿打一会儿删 →
//   整版往上滚换成第二套字体，同样打出来又删掉 → 左边一道深青色块推进来接下一段（014-E 一拍，讲字体 / 打字感）
// 学的动作（Abstudiobrand · Neutron 18.0–21.3s，按 30fps 逐帧量过，2026-11-21）：
//   17.95–18.35 浅色版面从右往左推满（边界 1575 → 18.15 621 → 0）；小标签 x≈390、y≈111，字体名右对齐到 x≈1860
//   第一行（字高 ≈255，深墨绿）18.0–18.5 逐字打满（x 456–1800），第二行（青色）18.5–18.75 打出；光标是一根比字还高的方括号
//   18.8–19.3 第一行一个个删回只剩一个字，整版往左挪（左沿 456 → 285）；19.4–19.7 整版往上滚走，第二套从下面上来（标签 y 918 → 150）
//   第二套 19.6–19.9 打第一行（y 345–585），19.8–20.3 打第二行（y 705–945，一串符号），20.35–20.7 第一行删回一个字，21.0 又开始打新字；21.2 左边深青色块推进来
// 我们的内容：主字体「Inter 常规」展示 AaCdEfG / 123，辅助字体「思源宋体」展示 永字八法 / 123#@%&?，右下角标"虚构 · 仅作演示"。
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {GroupContract, checkContract, checkInputs, outputDuration, planExtras, toSource} from '../../../assets/lib/helpers/groupClock';

const FPS = 30;
const S0 = 17.95;
const PAPER = '#d5ffed';
const INK = '#1f3627';
const TEAL = '#0f8f8e';
const INTER = '"Inter","Noto Sans CJK SC",sans-serif';
const SERIF = '"Noto Serif CJK SC","Songti SC",serif';
const SANS = '"Noto Sans CJK SC","PingFang SC",sans-serif';
const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const eio = (u: number) => { const x = clamp(u); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
const lin = (t: number, K: number[][]) => {
  if (t <= K[0][0]) return K[0][1];
  for (let i = 1; i < K.length; i++) if (t <= K[i][0]) { const [a, va] = K[i - 1], [b, vb] = K[i]; return va + (vb - va) * (t - a) / (b - a); }
  return K[K.length - 1][1];
};
// 打字 / 删字：返回当前显示的字数
const typed = (s: number, n: number, steps: number[][]) => Math.round(clamp(lin(s, steps), 0, n));

export const TYPE_SPECIMEN_CONTRACT: GroupContract = {
  sourceDuration: 100 / 30,
  fps: 30,
  motion: [[0, 100 / 30]],
  holds: [],
  landmarks: {wipe: 0, type1: 0.05, del1: 0.85, scroll: 1.45, type2: 1.65, del2: 2.4, next: 3.25},
  sfx: [
    {at: 'type1', type: '键盘', note: '一串打字', tail: 0.75, volume: 0.25},
    {at: 'del1', type: '键盘', note: '一串删字', tail: 0.5, volume: 0.2},
    {at: 'scroll', type: '短甩', note: '轻 whoosh', volume: 0.3},
    {at: 'type2', type: '键盘', note: '一串打字', tail: 0.7, volume: 0.25},
  ],
  inputs: {label1: {maxChars: 6}, label2: {maxChars: 6}},
};
export type TypeSpecimenInputs = {label1: string; font1: string; a1: string; b1: string; label2: string; font2: string; a2: string; b2: string; note: string};
export const TYPE_SPECIMEN_DEFAULT_INPUTS: TypeSpecimenInputs = {label1: '主字体', font1: 'Inter 常规', a1: 'AaCdEfG', b1: '123', label2: '辅助字体', font2: '思源宋体', a2: '永字八法', b2: '123#@%&?', note: '虚构 · 仅作演示'};
export const checkTypeSpecimenInputs = (x: TypeSpecimenInputs) => checkInputs(TYPE_SPECIMEN_CONTRACT, {label1: x.label1, label2: x.label2});
export const planTypeSpecimen = (sec: number) => planExtras(TYPE_SPECIMEN_CONTRACT, sec);
export const typeSpecimenFrames = (extras: number[]) => Math.round(outputDuration(TYPE_SPECIMEN_CONTRACT, extras) * FPS);
export const TYPE_SPECIMEN_DURATION = 100;

const Caret: React.FC<{h: number; color: string}> = ({h, color}) => (
  <span style={{display: 'inline-block', width: h * 0.16, height: h * 1.25, marginLeft: h * 0.04, borderTop: `${h * 0.03}px solid ${color}`, borderBottom: `${h * 0.03}px solid ${color}`, position: 'relative', verticalAlign: 'middle', boxSizing: 'border-box'}}><span style={{position: 'absolute', left: '50%', top: 0, bottom: 0, width: h * 0.03, marginLeft: -h * 0.015, background: color}} /></span>
);

export const TypeSpecimenCursorGroup: React.FC<{inputs?: TypeSpecimenInputs; extras?: number[]}> = ({inputs: x = TYPE_SPECIMEN_DEFAULT_INPUTS, extras = []}) => {
  const tt = useCurrentFrame() / FPS;
  const s = toSource(tt, TYPE_SPECIMEN_CONTRACT, extras) + S0;
  const wipeX = lin(s, [[17.95, 1575], [18.15, 621], [18.35, 0]]);
  const scroll = eio((s - 19.4) / 0.3) * 1040;
  const A1 = Array.from(x.a1), B1 = Array.from(x.b1), A2 = Array.from(x.a2), B2 = Array.from(x.b2);
  const n1 = typed(s, A1.length, [[18.0, 0], [18.5, A1.length], [18.75, A1.length], [19.1, 1]]);
  const m1 = typed(s, B1.length, [[18.48, 0], [18.75, B1.length]]);
  const n2 = typed(s, A2.length, [[19.6, 0], [19.9, A2.length], [20.35, A2.length], [20.7, 1], [21.0, 1], [21.3, 3]]);
  const m2 = typed(s, B2.length, [[19.8, 0], [20.3, B2.length]]);
  const left1 = lin(s, [[18.8, 456], [19.3, 285]]);
  const F = 300, F2 = 290;
  const blk = (y0: number, label: string, font: string, a: React.ReactNode, b: React.ReactNode, key: string) => (
    <div key={key} style={{position: 'absolute', left: 0, top: y0, width: 1920, height: 1080}}>
      <div style={{position: 'absolute', left: 390, top: 92, fontFamily: SANS, fontSize: 46, color: INK, display: 'flex', alignItems: 'center', gap: 18}}><span style={{fontSize: 30}}>▶</span>{label}</div>
      <div style={{position: 'absolute', right: 60, top: 92, fontFamily: SANS, fontSize: 46, color: INK}}>{font}</div>
      {a}{b}
    </div>
  );
  const line = (txt: string, left: number, top: number, fs: number, color: string, family: string, caret: boolean, key: string) => <div key={key} style={{position: 'absolute', left, top, fontFamily: family, fontSize: fs, lineHeight: 1, color, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center'}}>{txt}{caret && <Caret h={fs * 0.75} color={color} />}</div>;
  const cur1 = s < 18.5 || (s > 18.78 && s < 19.4);
  const blocks = [
    blk(-scroll, x.label1, x.font1, line(A1.slice(0, n1).join(''), left1, 230, F, INK, INTER, cur1 || s < 18.5, 'a1'), line(B1.slice(0, m1).join(''), left1 - 20, 640, F2, TEAL, INTER, s >= 18.48 && s < 18.8, 'b1'), 'k1'),
    blk(1100 - scroll, x.label2, x.font2, line(A2.slice(0, n2).join(''), 285, 330, F * 0.78, INK, SERIF, s < 19.9 || s > 20.3, 'a2'), line(B2.slice(0, m2).join(''), 270, 700, F2 * 0.85, TEAL, INTER, s >= 19.8 && s < 20.35, 'b2'), 'k2'),
  ];
  const tealW = lin(s, [[21.18, 0], [21.3, 320]]);
  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: wipeX, top: 0, right: 0, bottom: 0, background: PAPER, overflow: 'hidden', backgroundImage: 'linear-gradient(rgba(15,143,142,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(15,143,142,0.08) 1px, transparent 1px)', backgroundSize: '50px 50px'}}>
        <div style={{position: 'absolute', left: -wipeX, top: 0, width: 1920, height: 1080}}>{blocks}</div>
      </div>
      {tealW > 0 && <div style={{position: 'absolute', left: 0, top: 0, width: tealW, height: 1080, background: TEAL}} />}
      <div style={{position: 'absolute', right: 36, bottom: 26, fontFamily: SANS, fontSize: 20, color: 'rgba(30,60,50,0.45)', letterSpacing: '0.06em'}}>{x.note}</div>
    </AbsoluteFill>
  );
};

if (checkContract(TYPE_SPECIMEN_CONTRACT).length) throw new Error(checkContract(TYPE_SPECIMEN_CONTRACT).join('；'));
export const TypeSpecimenCursor: React.FC = () => <TypeSpecimenCursorGroup />;
