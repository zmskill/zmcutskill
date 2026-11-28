// 【镜头组】word-ring-tools：画面中间一个状态词在打字（思考中··· → 连接中··· → 分析中···，旧词从头往后删掉、新词打出来），
//   一圈彩色功能卡绕着它慢慢逆时针转；开头卡片是空白的紫色渐变板飞进来、再"显影"出内容；
//   最后镜头推近，卡片收成一堆、放大、互相叠着转，光标点中「演示文稿」，那张卡被提起来翻面（039-E 一拍，核心镜头）
// 学的动作（MdMizanurRahman · NotebookLM 22.9–27.7s，30fps 逐帧量过）：
//   22.9–23.3 空白渐变板（上紫下透明）从四周大尺寸飞进，镜头 1.35→1.0（到 23.8）；23.2–23.6 板子淡出、露出卡片内容
//   一圈 8 张卡排在椭圆上（rx≈570、ry≈450，中心 ≈960,520），整圈约 −0.7 rad/s 逆时针转；卡 600×210、字 44px
//   状态词 60px：Thinking 22.95 起打、23.75 从头删，Connecting 23.95 起打（开头字距大、慢慢收紧），Analysing 25.0 起打；后面三个点轮流跳
//   25.8–26.05 整圈收成一堆（半径缩到 0.38、卡放大 1.45），继续转着互相叠；26.45 光标进来停在「演示文稿」上，27.1 按下，
//   27.3 卡被拖向左上，27.45–27.7 绕竖轴翻面（字变镜像），27.7 硬切
// 我们的内容：九个功能全中文（音频概览/视频概览/思维导图/报告/闪卡/测验/信息图/演示文稿/数据表），"测试版"小黑标；图标自己画。
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Grain} from '../../../assets/lib/helpers/polish';
import {GroupContract, checkContract, checkInputs, outputDuration, planExtras, toSource} from '../../../assets/lib/helpers/groupClock';
import {INK, SANS, clamp, eio, eo, kf, mix, rs} from '../_kit/softAiKit';
import {GradCursor} from '../folder-type-dock/FolderTypeDock';

const FPS = 30;
const S0 = 22.9;
export const WORD_RING_TOOLS_CONTRACT: GroupContract = {
  sourceDuration: 144 / 30,
  fps: 30,
  motion: [[0, 1.55], [1.65, 2.55], [2.65, 144 / 30]],
  holds: [{at: 1.6, maxExtra: 1.5}, {at: 2.6, maxExtra: 1.5}],
  landmarks: {fly: 0, reveal: 0.3, w2: 1.05, w3: 2.1, pile: 2.9, cursor: 3.55, press: 4.2, flip: 4.55},
  sfx: [
    {at: 'fly', type: '运镜', note: '一群 whoosh', volume: 0.45},
    {at: 'w2', type: '键盘', note: '轻打字', tail: 0.4, volume: 0.25},
    {at: 'w3', type: '键盘', note: '轻打字', tail: 0.4, volume: 0.25},
    {at: 'pile', type: '运镜', note: '收拢 whoosh', volume: 0.4},
    {at: 'press', type: '轻tick', note: '点击 tick', volume: 0.45},
    {at: 'flip', type: '翻页', note: '翻卡 flip', volume: 0.4},
  ],
  inputs: {w1: {maxChars: 4}, w2: {maxChars: 4}, w3: {maxChars: 4}},
};
export type ToolCard = {k: string; label: string; bg: string; fg: string; beta?: boolean};
export type RingInputs = {words: [string, string, string]; tools: ToolCard[]; extra: ToolCard; pick: number};
export const RING_DEFAULT_INPUTS: RingInputs = {
  words: ['思考中', '连接中', '分析中'],
  tools: [
    {k: 'audio', label: '音频概览', bg: '#aab0f6', fg: '#33339a'},
    {k: 'slides', label: '演示文稿', bg: '#eeece3', fg: '#34342c', beta: true},
    {k: 'video', label: '视频概览', bg: '#dbefdf', fg: '#245636'},
    {k: 'mind', label: '思维导图', bg: '#f1e4eb', fg: '#7a2862'},
    {k: 'report', label: '报告', bg: '#efe9dc', fg: '#6a5828'},
    {k: 'flash', label: '闪卡', bg: '#f6dfe2', fg: '#7a1f30'},
    {k: 'quiz', label: '测验', bg: '#d8ecf6', fg: '#1d4f6a'},
    {k: 'info', label: '信息图', bg: '#e2dcef', fg: '#45377a', beta: true},
  ],
  extra: {k: 'table', label: '数据表', bg: '#e4e6f6', fg: '#283a7a'},
  pick: 1,
};
export const checkRingInputs = (x: RingInputs) => checkInputs(WORD_RING_TOOLS_CONTRACT, {w1: x.words[0], w2: x.words[1], w3: x.words[2]});
export const planRing = (sec: number) => planExtras(WORD_RING_TOOLS_CONTRACT, sec);
export const ringFrames = (extras: number[]) => Math.round(outputDuration(WORD_RING_TOOLS_CONTRACT, extras) * FPS);
export const WORD_RING_TOOLS_DURATION = 144;

const lin = (u: number) => u;
const ToolIcon: React.FC<{k: string; c: string; size: number}> = ({k, c, size}) => {
  const p: Record<string, React.ReactNode> = {
    audio: <>{[4, 8, 12, 16, 20].map((x, i) => <rect key={i} x={x - 1} y={12 - [3, 6, 9, 5, 3][i]} width={2} height={[3, 6, 9, 5, 3][i] * 2} rx={1} fill={c} />)}<path d="M20 2l.6 1.4 1.4.6-1.4.6-.6 1.4-.6-1.4-1.4-.6 1.4-.6z" fill={c} /></>,
    slides: <><rect x={2} y={5} width={20} height={14} rx={1.5} fill="none" stroke={c} strokeWidth={1.8} /><path d="M7 5v14M17 5v14" stroke={c} strokeWidth={1.8} /></>,
    video: <><rect x={3} y={6} width={18} height={14} rx={2} fill="none" stroke={c} strokeWidth={1.8} /><path d="M5 3h14" stroke={c} strokeWidth={1.8} /><path d="M10 10l5 3-5 3z" fill={c} /></>,
    mind: <><rect x={2} y={4} width={7} height={5} rx={1} fill="none" stroke={c} strokeWidth={1.8} /><rect x={15} y={2} width={7} height={5} rx={1} fill="none" stroke={c} strokeWidth={1.8} /><rect x={15} y={13} width={7} height={5} rx={1} fill="none" stroke={c} strokeWidth={1.8} /><path d="M9 6.5h3v-2h3M12 6.5v9h3" fill="none" stroke={c} strokeWidth={1.8} /></>,
    report: <><path d="M4 6h10v14H4z" fill="none" stroke={c} strokeWidth={1.8} /><path d="M8 3h10v14" fill="none" stroke={c} strokeWidth={1.8} /><path d="M7 11l2 2 4-4" fill="none" stroke={c} strokeWidth={1.6} /></>,
    flash: <><rect x={3} y={7} width={14} height={14} rx={1.5} fill="none" stroke={c} strokeWidth={1.8} /><path d="M7 4h13v13" fill="none" stroke={c} strokeWidth={1.8} /><path d="M10 11v6M7 14h6" stroke={c} strokeWidth={1.8} /></>,
    quiz: <><rect x={4} y={3} width={16} height={18} rx={2} fill="none" stroke={c} strokeWidth={1.8} /><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .8-1 1.5V14" fill="none" stroke={c} strokeWidth={1.7} strokeLinecap="round" /><circle cx={12} cy={17} r={1.1} fill={c} /></>,
    info: <>{[[5, 8], [10, 14], [15, 5]].map(([x, h], i) => <rect key={i} x={x} y={20 - h} width={3} height={h} rx={1} fill={c} />)}</>,
    table: <><rect x={3} y={3} width={18} height={18} rx={1.5} fill="none" stroke={c} strokeWidth={1.8} /><path d="M3 9h18M3 15h18M9 3v18" stroke={c} strokeWidth={1.6} /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24">{p[k]}</svg>;
};
// 功能卡（1 倍 = 600×210）
export const Tool: React.FC<{t: ToolCard; slab?: number; flip?: number}> = ({t, slab = 0, flip = 0}) => (
  <div style={{position: 'relative', width: 600, height: 210, borderRadius: 30, background: t.bg, boxShadow: '0 10px 30px rgba(90,60,140,0.10)', fontFamily: SANS, color: t.fg, overflow: 'hidden', transform: flip ? `scaleX(${flip > 0.5 ? -1 : 1})` : undefined}}>
    <div style={{position: 'absolute', left: 40, top: 34, display: 'flex', alignItems: 'center', gap: 22}}>
      <ToolIcon k={t.k} c={t.fg} size={46} />
      {t.beta && <div style={{background: '#1c1b20', color: '#fff', fontSize: 26, padding: '6px 14px', borderRadius: 10, fontWeight: 600}}>测试版</div>}
    </div>
    <div style={{position: 'absolute', left: 40, top: 106, fontSize: 52, fontWeight: 500, whiteSpace: 'nowrap'}}>{t.label}</div>
    <svg width={40} height={40} viewBox="0 0 24 24" style={{position: 'absolute', right: 40, top: 85}}><path d="M9 5l7 7-7 7" fill="none" stroke={t.fg} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" /></svg>
    {slab > 0 && <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #8f84f2 0%, #a9a0f4 45%, rgba(220,190,246,0.9) 100%)', opacity: slab}} />}
  </div>
);

export const WordRingToolsGroup: React.FC<{inputs?: RingInputs; extras?: number[]}> = ({inputs: x = RING_DEFAULT_INPUTS, extras = [0, 0]}) => {
  const tt = useCurrentFrame() / FPS;
  const s = toSource(tt, WORD_RING_TOOLS_CONTRACT, extras) + S0;
  const held = tt - (s - S0);
  const cam = s < 25.85 ? kf(s, [[22.9, 1.45], [23.05, 1.35], [23.8, 1.0], [25.85, 0.96]]) : kf(s, [[25.85, 1.12], [26.4, 1.0]], eo);
  // 2026-11-18 逐帧对原片：25.83→25.86 是硬切，不是整圈慢慢收拢。切过去是更近的一镜：卡片（1.55 倍）一张接一张从左下飞进来、每帧来一张，
  //   整堆先快转再慢下来（25.86–26.3 快、之后慢慢漂），所以看着是"甩进来"的，不是 PPT 式的缩放。
  const CX = 960, CY = 520;
  const CUT = 25.85;
  const pile = s >= CUT ? 1 : 0;
  const after = Math.max(0, s - CUT);
  // 切过去后（量过）：卡 ≈1.5 倍，整堆是一圈斜着摆的环（往右下倾 40°），屏幕上顺时针转：先快（0.5s 转半圈）再慢下来，整堆往右下漂
  const spin = 3.0 * (1 - Math.exp(-after / 0.18)) + after * 0.25 + held * 0.05;
  const base = pile ? Math.PI - (3 * 2 * Math.PI) / 9 + spin : 3.1 - 0.72 * (s - 23.8) - held * 0.05;
  const rx = mix(570, 540, pile), ry = mix(450, 390, pile);
  const sc = mix(1, 1.5, pile);
  const PC = {x: 790 + after * 80, y: 500 + after * 68 + Math.pow(Math.max(0, s - 27.1), 2) * 1000}, PHI = (40 * Math.PI) / 180;
  const slab = 1 - rs(s, 23.2, 0.4, lin);
  // 状态词
  const word = (() => {
    const W = x.words.map((w) => Array.from(w));
    const typeIn = (w: string[], t0: number, d: number) => w.slice(0, Math.floor(clamp((s - t0) / d) * w.length + 0.001)).join('');
    const delFront = (w: string[], t0: number, d: number) => w.slice(Math.floor(clamp((s - t0) / d) * w.length + 0.001)).join('');
    if (s < 23.75) return {t: typeIn(W[0], 22.95, 0.3), dots: s > 23.25, sp: 0};
    if (s < 23.95) return {t: delFront(W[0], 23.75, 0.18), dots: true, sp: 0};
    if (s < 24.85) return {t: typeIn(W[1], 23.95, 0.3), dots: s > 24.25, sp: 0.5 * (1 - rs(s, 23.95, 0.4, eo))};
    if (s < 25.0) return {t: delFront(W[1], 24.85, 0.14), dots: true, sp: 0};
    return {t: typeIn(W[2], 25.0, 0.12), dots: s > 25.12, sp: 0};
  })();
  const dotN = 1 + (Math.floor(s * 5) % 3);
  // 被点的卡
  const pick = x.pick;
  const lift = rs(s, 26.4, 0.2, eo);
  const drag = rs(s, 27.05, 0.25, eio);
  const flip = rs(s, 27.4, 0.25, eio);
  const all = pile ? [...x.tools, x.extra] : x.tools;
  const NN = all.length;
  // 切过去之后的到达顺序（原片：思维导图 → 数据表 → 音频 → 视频 → 演示文稿 → 信息图 → 其余），每 0.035s 来一张
  const ORDER = [3, 8, 0, 2, 1, 7, 6, 5, 4];
  // 落位（中心 x, y, 前后层级）：按原片 26.9 量。0 音频 1 演示文稿 2 视频 3 思维导图 4 报告 5 闪卡 6 测验 7 信息图 8 数据表
  const SLOTS: Record<number, [number, number, number]> = {4: [-160, 500, 1], 7: [790, 270, 2], 6: [640, 572, 3], 5: [400, 815, 4], 2: [1245, 478, 5], 0: [1340, 640, 6], 8: [1530, 815, 7], 3: [1745, 900, 8], 1: [1053, 155, 9]};
  const cards = all.map((t, i) => {
    const a = base + (i * 2 * Math.PI) / NN;
    const u0 = rx * Math.cos(a), v0 = ry * Math.sin(a);
    let px = pile ? PC.x + u0 * Math.cos(PHI) - v0 * Math.sin(PHI) : CX + u0, py = pile ? PC.y + u0 * Math.sin(PHI) + v0 * Math.cos(PHI) : CY + v0, z = pile ? py / 1000 : Math.sin(a), rot = 0, ry3 = 0;
    if (!pile) {
      // 开头：从外面大尺寸飞进
      const fly = rs(s, 22.9 + (i % 4) * 0.03, 0.32, eo);
      px = mix(CX + (px - CX) * 2.4, px, fly); py = mix(CY + (py - CY) * 2.4, py, fly);
    } else {
      const k = ORDER.indexOf(i);
      const fly = rs(s, CUT - 0.05 + k * 0.035, 0.3, eo);
      px = mix(px - 1200, px, fly); py = mix(py + 900, py, fly);
      // 2026-11-19 对原片 26.6–27.2 逐帧量的落位：转到 26.15 后整堆慢下来、每张卡滑进自己的位置（两斜排、互相压着），之后只极慢地往右下漂
      const slot = SLOTS[i];
      if (slot) {
        const settle = eio(clamp((s - 26.15) / 0.45));
        const dr = Math.max(0, s - 26.6);
        px = mix(px, slot[0] + dr * 25, settle); py = mix(py, slot[1] + dr * 20, settle); z = mix(z, slot[2], settle);
      }
    }
    if (i === pick && s > 26.4) {
      z = 20;
      px = mix(px, 1080, drag); py = mix(py, py + 40, drag); rot = drag * -3;
      px = mix(px, 1300, flip); py = mix(py, 330, flip); ry3 = flip * 180;
    }
    return {t, px, py, z, rot, ry3, i};
  }).sort((p, q) => p.z - q.z);
  const cur = s > 26.45 ? {x: kf(s, [[26.45, 445], [26.65, 890], [26.85, 1080], [27.05, 1080], [27.3, 1026]]), y: kf(s, [[26.45, 567], [26.65, 338], [26.85, 277], [27.05, 277], [27.3, 270]])} : null;
  return (
    <AbsoluteFill style={{fontFamily: SANS, overflow: 'hidden', background: '#f7f3f8'}}>
      <AbsoluteFill style={{background: `radial-gradient(ellipse 24% 36% at ${30 + (s - 22.9) * 3}% 52%, rgba(120,170,255,0.9) 0%, rgba(150,190,255,0) 100%)`}} />
      <AbsoluteFill style={{background: `radial-gradient(ellipse 30% 34% at ${62 - (s - 22.9) * 2}% 18%, rgba(214,130,246,0.85) 0%, rgba(220,150,246,0) 100%)`}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 30% 30% at 12% 90%, rgba(214,140,246,0.7) 0%, rgba(220,150,246,0) 100%)'}} />
      <AbsoluteFill style={{background: `radial-gradient(ellipse 26% 32% at 88% ${66 - (s - 22.9) * 3}%, rgba(214,140,246,0.7) 0%, rgba(220,150,246,0) 100%)`}} />
      <AbsoluteFill style={{transformOrigin: `${CX}px ${CY}px`, transform: `scale(${cam})`}}>
        {/* 状态词（在卡片后面） */}
        <div style={{position: 'absolute', left: CX, top: CY, transform: 'translate(-50%,-50%)', fontSize: 68, color: '#1d1c22', whiteSpace: 'nowrap', letterSpacing: `${word.sp}em`, opacity: 1 - pile, display: 'flex', alignItems: 'baseline'}}>
          <span>{word.t}</span><span style={{width: 70, letterSpacing: 4, marginLeft: 6}}>{word.dots ? '·'.repeat(dotN) : ''}</span>
        </div>
        {cards.map((c) => (
          <div key={c.i} style={{position: 'absolute', left: c.px - 300, top: c.py - 105, transform: `perspective(1600px) rotateY(${c.ry3}deg) rotate(${c.rot}deg) scale(${sc * (c.i === pick ? 1 + lift * 0.06 : 1)})`, transformOrigin: '50% 50%'}}>
            <Tool t={c.t} slab={slab} flip={0} />
          </div>
        ))}
        {cur && <GradCursor x={cur.x} y={cur.y} s={s > 26.95 && s < 27.05 ? 0.85 : 1} o={1 - rs(s, 27.3, 0.1, lin)} />}
      </AbsoluteFill>
      <Grain opacity={0.025} blend="multiply" />
    </AbsoluteFill>
  );
};

if (checkContract(WORD_RING_TOOLS_CONTRACT).length) throw new Error(checkContract(WORD_RING_TOOLS_CONTRACT).join('；'));
export const WordRingTools: React.FC = () => <WordRingToolsGroup />;
export const _u = INK;
