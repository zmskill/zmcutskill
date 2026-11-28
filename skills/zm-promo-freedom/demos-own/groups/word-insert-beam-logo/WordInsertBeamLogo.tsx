// 【镜头组】word-insert-beam-logo：一个小图标停在画面中间，句子从它左边一截截长出来（新词插在图标前、整句一直居中），最后一个词接在图标后面 →
//   图标并进句子，整句往左甩糊 → 黑底中间一个大图标，背后射出旋转的绿色光束 → 光束收掉，图标变白缩小，下面出产品名，停住（036-C 一拍，收尾）
// 学的动作（Varcyyyy · BLACKBOX 12.05–21.07s，30fps 逐帧量过）：
//   12.05 小图标（≈28px）在（960,522），暗绿底、右下一团青光；12.6 / 13.3 / 13.65 每次在图标前插进一截词（0.25s 淡入、前面的词往左让），14.0 图标后面接最后一个词
//   14.6 图标淡掉、句子合拢；15.0–15.3 整句往左甩、横向糊掉，底色压黑
//   15.35 中间出大图标（黑芯、绿色亮边），背后 8 道光束旋转着射出（15.45–17.4），四周有糊掉的代码字
//   16.85 图标变白、缩到 264px（960,540），17.1 下面产品名（40px，y780），17.6 光束收完，停到 21.07
// 我们的内容：「把问题 / 变成 / 可上线的 / [图标] / 代码。」；产品是虚构的「码匣 AI」。
import React from 'react';
import {GlowSpot} from '../_kit/light';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {GroupContract, checkContract, checkInputs, outputDuration, planExtras, toSource} from '../../../assets/lib/helpers/groupClock';
import {BoxLogo, GREEN, MONO, SANS, clamp, eio, eo, hash, kf, mix} from '../_kit/codeGlowKit';

const FPS = 30;
const S0 = 12.05;
export const WORD_INSERT_BEAM_CONTRACT: GroupContract = {
  sourceDuration: 270 / 30,
  fps: 30,
  motion: [[0, 2.45], [2.55, 5.9], [6.0, 270 / 30]],
  holds: [{at: 2.5, maxExtra: 1.5}, {at: 5.95, maxExtra: 2}],
  landmarks: {icon: 0, w1: 0.55, w2: 1.25, w3: 1.6, w4: 1.95, whip: 2.95, beam: 3.3, white: 4.8, name: 5.05},
  sfx: [
    {at: 'w1', type: '轻tick', note: '轻 tick', volume: 0.25},
    {at: 'w2', type: '轻tick', note: '轻 tick', volume: 0.25},
    {at: 'w3', type: '轻tick', note: '轻 tick', volume: 0.25},
    {at: 'whip', type: '短甩', note: '横甩 whoosh', volume: 0.45},
    {at: 'beam', type: '上扬铺垫', note: '光束 swell', tail: 1.8, volume: 0.45},
    {at: 'white', type: '落版重击', note: '落版 hit', volume: 0.5},
  ],
  inputs: {name: {maxChars: 6}},
};
export type BeamInputs = {parts: string[]; tail: string; name: string; note: string};
export const BEAM_DEFAULT_INPUTS: BeamInputs = {parts: ['把问题', '变成', '可上线的'], tail: '代码。', name: '码匣 AI', note: '虚构 · 仅作演示'};
export const checkBeamInputs = (x: BeamInputs) => checkInputs(WORD_INSERT_BEAM_CONTRACT, {name: x.name});
export const planBeam = (sec: number) => planExtras(WORD_INSERT_BEAM_CONTRACT, sec);
export const beamFrames = (extras: number[]) => Math.round(outputDuration(WORD_INSERT_BEAM_CONTRACT, extras) * FPS);
export const WORD_INSERT_BEAM_DURATION = 270;

export const WordInsertBeamGroup: React.FC<{inputs?: BeamInputs; extras?: number[]}> = ({inputs: x = BEAM_DEFAULT_INPUTS, extras = [0, 0]}) => {
  const tt = useCurrentFrame() / FPS;
  const s = toSource(tt, WORD_INSERT_BEAM_CONTRACT, extras) + S0;
  const held = tt - (s - S0);
  const FS = 66; // 原片这句是细长的一行小字，96 太大
  if (s < 15.11) {
    const T = [12.58, 13.19, 13.45]; // 2026-11-19 帧差量原片：12.60 / 13.21 / 13.47 / 13.94 各插进一个词
    const shown = x.parts.map((p, i) => ({p, k: eo(clamp((s - T[i]) / 0.25))}));
    const tailK = eo(clamp((s - 13.92) / 0.25));
    const iconGone = eio(clamp((s - 14.42) / 0.28));
    const whip = eio(clamp((s - 14.95) / 0.17)); // 原片 14.98 起整句只是糊掉、变暗（几乎不横移），15.12 硬切到光束
    const dark = clamp((s - 14.9) / 0.35);
    const ICON = 110;
    return (
      <AbsoluteFill style={{overflow: 'hidden', fontFamily: SANS, background: '#03110c'}}>
        {/* 2026-11-19 吸管量：原片中间和上方是暗的，亮的是左边缘一条绿光和右下角一团青光（像边缘打光），之前做反了 */}
        <AbsoluteFill style={{background: `radial-gradient(ellipse 32% 58% at ${-2 + (s - 12.05) * 1.5 + held}% 74%, rgba(26,110,62,0.95) 0%, rgba(14,60,34,0.5) 45%, rgba(3,17,12,0) 100%)`, opacity: 1 - dark}} />
        <AbsoluteFill style={{background: `radial-gradient(ellipse 30% 48% at 102% ${100 - (s - 12.05) * 2}%, rgba(22,118,98,0.95) 0%, rgba(12,64,52,0.5) 45%, rgba(3,17,12,0) 100%)`, opacity: 1 - dark}} />
        <AbsoluteFill style={{background: '#000', opacity: dark * 0.9}} />
        <div style={{position: 'absolute', left: 960, top: 522, transform: `translate(-50%,-50%) translateX(${-whip * 120}px) scaleX(${1 + whip * 0.25})`, filter: whip > 0 ? `blur(${whip * 14}px)` : undefined, opacity: 1 - whip * 0.55, display: 'flex', alignItems: 'center', whiteSpace: 'nowrap', fontSize: FS, color: '#f0f4f2', fontWeight: 500}}>
          {shown.map((w, i) => w.k > 0 && <span key={i} style={{opacity: w.k, maxWidth: w.k * Array.from(w.p).length * FS * 1.05, overflow: 'hidden', display: 'inline-block', filter: w.k < 1 ? `blur(${(1 - w.k) * 6}px)` : undefined}}>{w.p}</span>)}
          <span style={{display: 'inline-flex', width: (1 - iconGone) * (ICON + 30), justifyContent: 'center', opacity: 1 - iconGone, overflow: 'hidden'}}><span style={{width: ICON, height: ICON, borderRadius: 16, background: '#1d2524', boxShadow: '0 0 0 1.5px rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><BoxLogo size={ICON * 0.72} /></span></span>
          {tailK > 0 && <span style={{opacity: tailK, maxWidth: tailK * Array.from(x.tail).length * FS * 1.05, overflow: 'hidden', display: 'inline-block'}}>{x.tail}</span>}
        </div>
        {held > 0 && null}
      </AbsoluteFill>
    );
  }
  // 光束 + 落版
  const white = eio(clamp((s - 16.85) / 0.35));
  const beam = clamp((s - 15.11) / 0.3) * (1 - clamp((s - 16.6) / 0.6));
  const size = kf(s, [[15.35, 300], [16.15, 380], [16.85, 340], [17.2, 264]]);
  const ly = kf(s, [[15.35, 520], [16.15, 470], [17.2, 540]]);
  const name = mix(0.22, 1, eo(clamp((s - 16.6) / 0.4))) * clamp((s - 15.3) / 0.3); // 原片 15.5 品牌名就暗暗地在了，16.6 起才亮
  // 2026-11-18 对原片：大图标不是一出来就在正中——镜头从左往右摇过来（15.35 图标还在画面左外、光束从左边射进来，15.83 到 x≈780，16.1 到正中），
  //   而且图标是带厚度的六边形环、绕竖轴转着正过来（16.9 正对、变白）
  const lx = kf(s, [[15.35, 880], [15.75, 905], [16.1, 950], [16.4, 960]]); // 2026-11-19 重看：原片 15.5 六边形就在画面中间偏左一点（看到的是它被背光照亮的边），不是从画面左外摇进来
  const ry = kf(s, [[15.5, 70], [16.1, 42], [16.5, 24], [16.9, 0], [17.4, -6], [20.5, -14]]); // 落版后还在极慢地转（光流：原片 17–20s 一直有 10–20 的运动）
  const rot = (s - 15.35) * 50;
  return (
    <AbsoluteFill style={{overflow: 'hidden', fontFamily: SANS, background: '#000'}}>
      {/* 2026-11-18 原片 15.2–15.7 甩糊的那句话还在、慢慢暗掉，光束从左边射进来；之前这里黑了 0.2s */}
      {s < 16.1 && <div style={{position: 'absolute', left: 960, top: 522, transform: `translate(-50%,-50%) scale(${1 + (s - 15.2) * 0.03})`, filter: 'blur(1.5px)', opacity: 0.35 * clamp((s - 15.11) / 0.05) * (1 - clamp((s - 15.4) / 0.6)), fontSize: FS, color: '#f0f4f2', whiteSpace: 'nowrap'}}>{x.parts.join('')}{x.tail}</div>}
      {beam > 0 && (
        <AbsoluteFill style={{opacity: beam}}>
          {Array.from({length: 26}, (_, i) => { const zk = 1 + (s - 15.1) * (0.18 + hash(i * 9) * 0.2); const wx = 300 + hash(i) * 1320 + (lx - 960) * 0.6, wy = 160 + hash(i * 3) * 760; return <div key={i} style={{position: 'absolute', left: 960 + (wx - 960) * zk, top: 540 + (wy - 540) * zk, fontFamily: MONO, fontSize: 26 + hash(i * 5) * 30, color: GREEN, opacity: 0.25, filter: `blur(${2 + hash(i * 7) * 4}px)`}}>{['function', 'import', 'return', 'await', 'const', '{', 'if'][i % 7]}</div>; })}{/* 背景代码字一直在往外飘（镜头在往里推），原片这段画面从不静止 */}
          {(() => {
            // 2026-11-19 原片的光束不是 6 道一样粗一样亮的楔形：宽窄、亮度都不一样，靠近图标最亮、越远越淡，用「相加」叠出体积光的感觉
            const BEAMS = [[6, 44, 0.95], [62, 38, 0.75], [118, 52, 1.0], [200, 42, 0.7], [262, 48, 0.9]]; // 角度必须从小到大、都在 0–360 内（conic 色标不能回头） // 原片：四五道很宽的软光扇，从六边形后面透出来，中间是暗缝
            const stops = BEAMS.map(([a, w, al]) => `rgba(30,190,110,0) ${a}deg, rgba(34,200,118,${al * 0.32}) ${a + w * 0.15}deg, rgba(50,220,135,${al * 0.5}) ${a + w / 2}deg, rgba(34,200,118,${al * 0.32}) ${a + w * 0.85}deg, rgba(30,190,110,0) ${a + w}deg`).join(', '); // 原片光束是深绿、边缘比较利落，不是发白的薄荷色
            return <div style={{position: 'absolute', left: lx - 1400, top: ly - 1400, width: 2800, height: 2800, transform: `rotate(${rot}deg)`, background: `conic-gradient(from 0deg, ${stops}, rgba(70,240,160,0) 360deg)`, mixBlendMode: 'plus-lighter', WebkitMaskImage: 'radial-gradient(circle closest-side, rgba(0,0,0,1) 6%, rgba(0,0,0,0.92) 15%, rgba(0,0,0,0.62) 32%, rgba(0,0,0,0.3) 55%, rgba(0,0,0,0.08) 75%, rgba(0,0,0,0) 90%)', maskImage: 'radial-gradient(circle closest-side, rgba(0,0,0,1) 6%, rgba(0,0,0,0.92) 15%, rgba(0,0,0,0.62) 32%, rgba(0,0,0,0.3) 55%, rgba(0,0,0,0.08) 75%, rgba(0,0,0,0) 90%)', filter: 'blur(7px)'}} />;
          })()}
          <GlowSpot x={lx} y={ly} rx={420} ry={420} rgb="40,210,130" a={0.45} />
        </AbsoluteFill>
      )}
      <div style={{position: 'absolute', left: lx - size / 2, top: ly - size / 2, width: size, height: size, transform: `perspective(1000px) rotateY(${ry}deg) scale(${1 + Math.max(0, s - 17.2) * 0.008})`, filter: `drop-shadow(${ry * 0.25}px 0 0 rgba(10,60,40,0.9)) drop-shadow(0 0 ${8 * (1 - white) + 3}px rgba(80,255,170,0.45))`}}>
        {(() => { /* 2026-11-21 原片标志是一圈很粗的六边形描边，描边本身是渐变：左上白 → 中间浅青 → 右下青绿（随转动光在描边上走），中间是透明的；之前是暗色实心六边形 + 细边，再淡成纯白，看不出渐变 */
          const c = (a: number[], b: number[]) => `rgb(${a.map((v, k) => Math.round(v + (b[k] - v) * Math.max(white, clamp((s - 15.6) / 1.2)))).join(',')})`;
          return <svg width={size} height={size} viewBox="0 0 24 24" style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}><defs><linearGradient id="rim" x1="0.1" y1="0" x2="0.9" y2="1" gradientTransform={`rotate(${-30 + 25 * Math.sin(rot / 40)} 0.5 0.5)`}><stop offset="0" stopColor={c([30, 90, 60], [255, 255, 255])} /><stop offset="0.42" stopColor={c([25, 80, 55], [222, 255, 240])} /><stop offset="0.68" stopColor={c([14, 60, 40], [70, 200, 150])} /><stop offset="1" stopColor={c([8, 40, 26], [14, 92, 64])} /></linearGradient></defs><path d="M4 7.5 L12 3 L20 7.5 V16.5 L12 21 L4 16.5 Z" fill="none" stroke="url(#rim)" strokeWidth={2.6} strokeLinejoin="round" /><path d="M10.2 9 C9 9 9 9.6 9 10.6 C9 11.6 8.6 12 8 12 C8.6 12 9 12.4 9 13.4 C9 14.4 9 15 10.2 15 M13.8 9 C15 9 15 9.6 15 10.6 C15 11.6 15.4 12 16 12 C15.4 12 15 12.4 15 13.4 C15 14.4 15 15 13.8 15" fill="none" stroke="url(#rim)" strokeWidth={1.5} strokeLinecap="round" /></svg>; })()}
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 780 - 30, textAlign: 'center', fontSize: 52, fontWeight: 700, color: '#fff', letterSpacing: '0.04em', opacity: name, transform: `translateY(${(1 - name) * 14}px)`}}>{x.name}</div>
      <div style={{position: 'absolute', right: 36, bottom: 26, fontSize: 20, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.06em', opacity: name}}>{x.note}</div>
      <div style={{opacity: mix(0, 0, 0)}} />
    </AbsoluteFill>
  );
};

if (checkContract(WORD_INSERT_BEAM_CONTRACT).length) throw new Error(checkContract(WORD_INSERT_BEAM_CONTRACT).join('；'));
export const WordInsertBeamLogo: React.FC = () => <WordInsertBeamGroup />;
