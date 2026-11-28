// S11–S17：小球冒出串珠成环、光标挨个悬停选中 → 两行大字缩小上推 → 双标签画环吸进光团 → 爆亮 →
//          残弧拉直夹住"任务"胶囊 → 打字、头像球长出、3D 对话面板 → 光球绕字标越跑越小落成句点
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {
  EASE, mix, clamp, fx, X, Y, rp, kf, spl, path, pathV, lerpC, rgba, Orb, PAL, Pal, palAt, orbMotion, Cursor3D, SANS, P3, hash, rimConic,
} from './orb-kit';
import {AssistantCard, GlowFrame} from './scenes-b';
import {homCss} from '../../../assets/lib/helpers/plane';
import {S16_H} from './quads-s16';

// ════════════════ S11 20.55–26.10 串珠成环 ════════════════
const NAMES = ['细心', '高效', '幽默', '温柔', '耐心', '严谨', '直爽', '安静'];
// 悬停：[珠子序号, 开始变大, 开始缩回]；4:30 那颗（温柔）被选中
const HOVER: [number, number, number][] = [[0, 22.2, 23.45], [7, 23.33, 23.82], [6, 23.55, 24.02], [5, 23.78, 24.22], [4, 24.0, 24.42], [3, 24.25, 25.15]];
const BIRTH = (i: number) => 21.333 + (i - 1) * 0.1;
const HEAD = (t: number) => spl(t, [[21.3, 0], [21.4, 8], [21.5, 22], [21.6, 45], [21.7, 75], [21.8, 92], [21.9, 150], [22.0, 180], [22.1, 210], [22.2, 222]]);
const beadAngle = (i: number, t: number) => {
  if (i === 0) return 0;
  const b = BIRTH(i), next = i < 7 ? BIRTH(i + 1) : 22.1;
  if (t < next) return HEAD(t);
  const a0 = HEAD(next);
  return mix(a0, i * 45, EASE.out(clamp((t - next) / (22.75 - next))));
};
const GlassBead: React.FC<{x: number; y: number; d: number; hv: number; label: number; name: string; op?: number; press?: number}> = ({x, y, d, hv, label, name, op = 1, press = 0}) => {
  const D = d * (1 + 0.19 * hv) * (1 - press * 0.08);
  return (
    <div style={{position: 'absolute', left: x - D / 2, top: y - D / 2, width: D, height: D, borderRadius: '50%', opacity: op,
      background: `radial-gradient(circle at 35% 28%, rgba(220,235,255,${fx(0.18 + hv * 0.22, 3)}) 0%, rgba(220,235,255,0) 22%), radial-gradient(circle at 50% 50%, ${rgba(lerpC('#1a34c8', '#4a78ff', hv), mix(0.72, 0.85, hv))} 0%, ${rgba(lerpC('#2240d8', '#6a94ff', hv), mix(0.8, 0.9, hv))} 62%, ${rgba(lerpC('#5a7ef5', '#b8d4ff', hv), mix(0.92, 1, hv))} 100%)`,
      boxShadow: `0 0 ${fx(12 + hv * 14)}px ${rgba('#3a5cff', 0.35 + hv * 0.25)}`}}>
      {/* 菲涅尔亮边：原片珠子边缘亮、右下最亮 */}
      <div style={{position: 'absolute', inset: 0, borderRadius: '50%', padding: 2.5, background: rimConic(140, 110, mix(0.7, 1, hv), 0.25), WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)', WebkitMaskComposite: 'xor'} as React.CSSProperties} />
      {label > 0.01 && <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SANS, fontSize: 30, color: lerpC('#8a9ad8', '#e8f0ff', label), opacity: clamp(label * 2) * 0.85, fontWeight: 400}}>{name}</div>}
    </div>
  );
};
const CUR11: P3[] = [[22.15, 52.5, -6], [22.2, 52, 1], [22.3, 51, 15], [22.4, 51, 21.5], [23.0, 51, 22], [23.1, 49, 21], [23.2, 46, 19], [23.3, 42, 19.5], [23.4, 37.5, 23], [23.5, 31, 29], [23.6, 26.5, 40], [23.7, 24.5, 54], [23.8, 28, 71], [23.9, 34, 81], [24.0, 41, 90], [24.1, 49, 96], [24.2, 56, 95], [24.3, 61, 90], [24.4, 64.8, 84], [24.9, 65, 84.5], [25.1, 66, 85.5], [25.4, 66.5, 86]];
const S11_TEXT = (t: number): React.ReactNode => {
  if (t < 25.15) return <span style={{opacity: 1 - rp(t, 24.98, 0.15, EASE.linear)}}>选一个性格</span>;
  if (t < 25.25) return '';
  if (t < 25.35) return <span style={{color: '#fff'}}>温</span>;
  return <span><span style={{color: '#fff'}}>温</span><span style={{color: '#5a8aff'}}>柔</span></span>;
};
export const S11: React.FC<{t: number}> = ({t}) => {
  const R = spl(t, [[22.8, 430], [25.2, 432], [25.3, 470], [25.4, 500], [25.5, 520], [25.6, 540], [25.7, 550], [25.8, 480], [25.9, 300], [26.0, 220], [26.1, 170]]);
  const spin = kf(t, [[22.8, 0], [25.2, 2, EASE.linear], [25.3, 10], [25.6, 17], [26.1, 36]]);
  const cw = spl(t, [[20.55, 560], [25.2, 562], [25.3, 600], [25.4, 620], [25.6, 640], [25.7, 642], [25.8, 620], [25.9, 560], [26.0, 430], [26.1, 400]]);
  const collapse = rp(t, 25.75, 0.3, EASE.smooth);
  const cy = 540 - Math.sin(t * 1.1) * 4 - Math.sin(t * 0.7) * 6;
  // 括号形柔光弧：随链头方向依次出现（先右上、再右、再左），一直缓慢晃
  const rArc = rp(t, 21.75, 0.3, EASE.out), lArc = rp(t, 22.15, 0.3, EASE.out);
  const arcOut = kf(t, [[25.2, 0], [25.7, 90]]);
  const sway = Math.sin(t * 1.6) * 10;
  const arc = (side: number, k: number, r: number, a: number) => {
    if (k <= 0.01) return null;
    const start = side > 0 ? 15 : 195, span = 150 * k;
    const m = `conic-gradient(from ${start}deg at 50% 50%, black 0deg, black ${fx(span)}deg, transparent ${fx(span + 35)}deg)`;
    const rr = r + arcOut + sway * side;
    const c = rgba('#3a6ab0', a), c2 = rgba('#2a4aa0', a * 0.45);
    return <AbsoluteFill style={{background: `radial-gradient(ellipse ${fx(rr)}px ${fx(rr * 1.05)}px at 50% 50%, rgba(0,0,0,0) 62%, ${c2} 72%, ${c} 82%, ${c2} 92%, rgba(20,40,120,${fx(a * 0.25)}) 100%)`, WebkitMaskImage: m, maskImage: m, filter: 'blur(14px)'}} />;
  };
  const beads = Array.from({length: 8}, (_, i) => {
    if (i > 0 && t < BIRTH(i)) return null;
    const a = (beadAngle(i, t) + spin) * Math.PI / 180;
    const depth = hash(i, 4);
    const dd = 128 * mix(1, 0.3 + depth * 0.65, collapse);
    const rr = R * mix(1, 0.75 + depth * 0.4, collapse);
    const h = HOVER.find((hh) => hh[0] === i);
    const hv = h ? rp(t, h[1], 0.12, EASE.out) * (1 - rp(t, h[2], 0.2, EASE.smooth)) : 0;
    const label = h ? rp(t, h[1] + 0.04, 0.1, EASE.linear) * (1 - rp(t, h[2] - 0.25, 0.15, EASE.linear) * 0.6) * (1 - rp(t, h[2] - 0.05, 0.1, EASE.linear)) : 0;
    const press = i === 3 ? Math.sin(clamp((t - 24.7) / 0.3) * Math.PI) : 0;
    // 第 0 颗：从输入框冒出、升到 12 点
    const rise = i === 0 ? spl(t, [[20.55, 56], [20.6, 55.5], [20.7, 40], [20.8, 26], [20.9, 20], [21.0, 16], [21.1, 13], [21.2, 11.8], [21.3, 50 - 430 / 10.8]]) : 0;
    const x = 960 + Math.sin(a) * rr, y = i === 0 && t < 21.3 ? Y(rise) : cy - Math.cos(a) * rr;
    return <GlassBead key={i} x={x} y={y} d={dd} hv={hv} label={label * (1 - collapse)} name={NAMES[i]} press={press} op={1 - rp(t, 25.98, 0.1, EASE.linear)} />;
  });
  const cp = path(t, CUR11), cv = pathV(t, CUR11);
  const flip = kf(t, [[22.15, 1], [22.3, 0], [22.6, 0], [22.8, 0.3], [23.0, 0.1], [23.3, 0.95], [23.5, 1], [23.7, 1], [23.8, 0.8], [23.9, 0.5], [24.0, 0.05], [24.3, 0], [24.4, 0]]);
  const rot = kf(t, [[22.2, 25], [22.6, 25], [22.8, 45], [23.0, 0], [23.4, -10], [23.8, 40], [24.1, 25], [24.6, 22], [24.9, 30]]);
  const behind = collapse > 0.5;
  return (
    <AbsoluteFill style={{background: '#030310', overflow: 'hidden'}}>
      {arc(1, rArc, 980, 0.95)}
      {arc(-1, lArc, 980, 0.95)}
      {behind && beads}
      <AssistantCard t={t} w={cw} h={cw * 0.525} cy={cy} title="我的助手" titleDy={-80 * cw / 560} titleFs={46 * cw / 560} inputK={1} text={S11_TEXT(t)} bg="linear-gradient(180deg, #0a1a80 0%, #081478 75%, #06104a 100%)" glow={0} dim={rp(t, 25.9, 0.15, EASE.linear)} />
      {!behind && beads}
      {t >= 22.15 && <Cursor3D x={cp.x} y={cp.y} size={104} rot={rot} flip={flip} press={Math.sin(clamp((t - 24.7) / 0.3) * Math.PI)} opacity={rp(t, 22.15, 0.05, EASE.linear) * (1 - rp(t, 25.15, 0.25, EASE.linear))} vx={cv.vx * 0.5} vy={cv.vy * 0.5} />}
    </AbsoluteFill>
  );
};

// ════════════════ S12 26.10–27.75 两行大字缩小落定 → 上推出画 ════════════════
export const S12: React.FC<{t: number}> = ({t}) => {
  const s = spl(t, [[26.1, 1.417], [26.2, 1.175], [26.3, 1.092], [26.4, 1.05], [26.5, 1.033], [26.6, 1.025], [27.0, 1.0], [27.5, 0.967], [27.75, 0.955]]);
  const cy = kf(t, [[26.1, 540], [27.5, 551], [27.58, 552], [27.7, 240, EASE.exit], [27.78, -260, EASE.linear]]);
  return (
    <AbsoluteFill style={{background: '#030310', overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: cy, transform: `translateY(-50%) scale(${fx(s, 4)})`, textAlign: 'center', fontFamily: SANS, fontWeight: 300, fontSize: 150, lineHeight: '190px', color: '#fff', letterSpacing: '-0.01em', filter: t > 27.6 ? `blur(${fx(rp(t, 27.6, 0.1) * 4)}px)` : undefined}}>
        然后把琐事<br />放心交给它
      </div>
    </AbsoluteFill>
  );
};

// ════════════════ S13 27.78–30.40 双标签画环；S14 30.40–31.10 光团爆亮；S15 31.00–32.40 残弧拉直夹住胶囊 ════════════════
const RC = 460;
const Tag: React.FC<{x: number; y: number; w: number; label: string; s: number; side: number; txt: number; op: number}> = ({x, y, w, label, s, side, txt, op}) => (
  <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, perspective: 1200, perspectiveOrigin: `${fx(x)}px ${fx(y)}px`, opacity: op}}>
    <div style={{position: 'absolute', left: x - w / 2, top: y - 65, width: w, height: 130, transform: `rotateY(${fx(side * 24)}deg) rotateZ(${fx(-side * 2)}deg) scale(${fx(s, 3)})`}}>
      <GlowFrame w={w} h={130} r={65} ang={x < 960 ? 283 : 101} width={80} glow={0.6} stroke={1.6} bg="linear-gradient(180deg, #061270, #0a1c88)">
        <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SANS, fontSize: 56, fontWeight: 300, color: '#fff', opacity: txt, letterSpacing: '0.08em'}}>{label}</div>
      </GlowFrame>
    </div>
  </div>
);
export const S13S15: React.FC<{t: number}> = ({t}) => {
  const ax = spl(t, [[27.78, 30], [28.0, 30], [29.1, 29.9], [29.35, 29.5], [29.6, 28.9], [29.7, 27], [29.8, 23], [29.9, 21], [30.0, 20], [30.1, 23], [30.2, 32], [30.3, 44], [30.38, 49]]);
  const bx = spl(t, [[27.78, 69], [28.0, 69], [29.1, 69.1], [29.35, 69.5], [29.6, 70.1], [29.7, 71.5], [29.8, 74], [29.9, 77], [30.0, 79], [30.1, 75], [30.2, 73], [30.3, 66], [30.4, 56]]);
  const ay = spl(t, [[27.78, 78], [27.9, 46], [28.0, 45], [29.7, 45], [30.0, 44], [30.1, 45], [30.2, 49], [30.3, 50]]);
  const byy = spl(t, [[27.78, 80], [27.9, 48], [28.0, 44], [29.7, 45], [30.0, 44], [30.1, 45], [30.2, 49], [30.3, 50]]);
  const ts = spl(t, [[27.78, 0.8], [28.0, 1], [29.1, 1], [29.6, 1.05], [29.8, 1.1], [29.9, 1.15], [30.0, 1.15], [30.1, 1.05], [30.2, 0.8], [30.3, 0.45], [30.4, 0.2]]);
  const txt = 1 - rp(t, 30.12, 0.15, EASE.linear);
  const tsB = spl(t, [[27.78, 0.8], [28.0, 1], [29.1, 1], [29.6, 1.05], [29.8, 1.1], [29.9, 1.15], [30.0, 1.15], [30.1, 1.08], [30.2, 1.0], [30.3, 0.6], [30.4, 0.2]]);
  const txtB = 1 - rp(t, 30.22, 0.12, EASE.linear);
  const tagOpB = (t < 27.79 ? 0.8 : 1) * (1 - rp(t, 30.34, 0.07, EASE.linear));
  const tagOp = (t < 27.79 ? 0.8 : 1) * (1 - rp(t, 30.3, 0.1, EASE.linear));
  // 中心光团 → 爆亮满屏
  const gr = Math.sin(t * 3.1) * 12 + kf(t, [[27.78, 200], [27.9, 260], [29.0, 290], [29.9, 320], [30.3, 350], [30.4, 450, EASE.linear], [30.5, 500, EASE.linear], [30.6, 560, EASE.linear], [30.7, 720], [30.8, 1100], [30.9, 1500], [31.0, 1400], [31.2, 900]]);
  const white = kf(t, [[29.9, 0], [30.2, 0.3], [30.4, 0.75], [30.6, 1], [30.85, 1], [31.0, 0.45], [31.1, 0.15], [31.3, 0]]);
  const gc = lerpC(kf(t, [[27.78, 0], [29.0, 0.4], [29.9, 1]]) > 0.5 ? '#8aa0e8' : '#5e7bc9', '#fbfbfd', white);
  const blueField = kf(t, [[30.75, 0], [30.92, 0.85], [31.0, 1], [31.2, 0.55], [31.45, 0]]);
  const gOp = (kf(t, [[27.78, 0.5], [28.0, 0.8], [29.0, 0.9], [30.0, 1]]) - Math.sin(t * 5) * 0.08) * (1 - rp(t, 31.05, 0.4, EASE.smooth));
  // 圆环：上半圈虚线（右 → 左画），下半圈实线（左 → 右画，亮头流光）
  const up = rp(t, 27.8, 0.5, EASE.swift), low = rp(t, 28.5, 0.5, EASE.swift);
  const flow = t < 29.2 ? low : rp(t, 29.62, 0.4, EASE.smooth);
  const flowOp = t < 29.0 ? 1 : t < 29.5 ? 1 - rp(t, 29.0, 0.45) : rp(t, 29.6, 0.05) * (1 - rp(t, 30.0, 0.2));
  const ringOp = 1 - rp(t, 30.55, 0.25, EASE.linear);
  const breakK = rp(t, 30.25, 0.2, EASE.out); // 9 点、3 点附近断开
  const L = Math.PI * RC;
  // 胶囊 + 残弧拉直
  const capOp = rp(t, 30.85, 0.3, EASE.smooth);
  const capDeep = rp(t, 31.05, 0.35, EASE.smooth);
  const hook = kf(t, [[30.9, 150], [31.4, 0, EASE.out]]);
  const lineLen = kf(t, [[30.9, 60], [31.4, 260, EASE.out], [31.75, 300], [31.9, 260], [32.0, 210], [32.1, 140], [32.2, 70], [32.3, 15], [32.38, 0]]);
  const capW = 400, capL = 960 - capW / 2, capR = 960 + capW / 2;
  const lineOp = rp(t, 30.88, 0.15, EASE.linear) * (1 - rp(t, 32.3, 0.1, EASE.linear));
  const bands = rp(t, 31.1, 0.4, EASE.smooth);
  const bandY = kf(t, [[31.2, 12], [31.5, 18], [32.4, 19]]);
  const ang = kf(t, [[31.4, 80], [32.4, 95]]); // 原片 32.6 实测亮段在右端 92°
  return (
    <AbsoluteFill style={{background: '#030310', overflow: 'hidden'}}>
      {bands > 0 && <Bands k={bands} y={bandY} t={t} />}
      <AbsoluteFill style={{background: `radial-gradient(circle ${fx(gr)}px at 50% 50%, ${rgba(gc, gOp)} 0%, ${rgba(lerpC('#3a5ab0', '#3a6aff', white), gOp * 0.8)} 40%, ${rgba('#2a4ab0', gOp * 0.35)} 70%, rgba(20,30,90,0) 100%)`}} />
      {blueField > 0 && <AbsoluteFill style={{background: `radial-gradient(ellipse 75% 75% at 50% 50%, ${rgba('#c8d4ff', blueField * white)} 0%, ${rgba('#2a5ae0', blueField)} 45%, ${rgba('#1a3ab0', blueField * 0.85)} 80%, ${rgba('#081040', blueField * 0.7)} 100%)`}} />}
      {t < 30.85 && (
        <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, opacity: ringOp}}>
          <defs>
            <linearGradient id="rU" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stopColor="#c0e0ff" /><stop offset="1" stopColor="#1a3ab0" /></linearGradient>
            <linearGradient id="rL" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stopColor="#1a3ab0" /><stop offset="1" stopColor="#5a9aff" /></linearGradient>
            <mask id="mU"><path d={`M ${960 + RC} 540 A ${RC} ${RC} 0 0 0 ${960 - RC} 540`} stroke="#fff" strokeWidth={10} fill="none" strokeDasharray={`${fx(up * L)} ${L}`} /></mask>
          </defs>
          <g mask="url(#mU)" opacity={1 - breakK * 0.9}>
            <path d={`M ${960 + RC} 540 A ${RC} ${RC} 0 0 0 ${960 - RC} 540`} stroke="url(#rU)" strokeWidth={2.2} fill="none" strokeDasharray="8 6" />
          </g>
          {breakK > 0 && <path d={`M ${960 - RC} 540 A ${RC} ${RC} 0 0 1 ${960 - RC * 0.7} ${540 - RC * 0.714}`} stroke="#c0e0ff" strokeWidth={2.2} fill="none" strokeDasharray="8 6" opacity={breakK} />}
          <path d={`M ${960 - RC} 540 A ${RC} ${RC} 0 0 0 ${960 + RC} 540`} stroke="url(#rL)" strokeWidth={2.6} fill="none" pathLength={1} strokeDasharray={`${fx(low, 4)} 2`} opacity={1 - breakK * 0.6} />
          {/* 亮头流光 */}
          <path d={`M ${960 - RC} 540 A ${RC} ${RC} 0 0 0 ${960 + RC} 540`} stroke="#a0e0ff" strokeWidth={3} fill="none" pathLength={1} strokeDasharray="0.24 2" strokeDashoffset={fx(-(flow - 0.24), 4)} opacity={flowOp * (t < 28.5 ? 0 : 1)} style={{filter: 'drop-shadow(0 0 6px #6ac8ff)'}} strokeLinecap="round" />
        </svg>
      )}
      <Tag x={X(ax)} y={Y(ay) + Math.sin(t * 2.2) * 5} w={400} label="日程" s={ts} side={1} txt={txt} op={tagOp} />
      <Tag x={X(bx)} y={Y(byy) + Math.sin(t * 2.2 + 1.7) * 5} w={360} label="提醒" s={tsB} side={-1} txt={txtB} op={tagOpB} />
      {/* 残弧：9 点的虚线、3 点的实线，末端拐成水平线夹住胶囊 */}
      {lineOp > 0.01 && (
        <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, opacity: lineOp}}>
          <path d={`M ${960 - RC} ${540 - hook} Q ${960 - RC} 540 ${960 - RC + Math.min(hook, 60)} 540 L ${capL - 10} 540`} stroke="#9ad0ff" strokeWidth={2.4} fill="none" strokeDasharray="9 7" style={{clipPath: `inset(0 0 0 ${fx(Math.max(0, capL - 10 - lineLen - (960 - RC)))}px)`}} transform={`translate(${fx(Math.max(0, capL - 10 - lineLen - (960 - RC)))} 0)`} />
          <path d={`M ${960 + RC} ${540 + hook} Q ${960 + RC} 540 ${960 + RC - Math.min(hook, 60)} 540 L ${capR + 10} 540`} stroke="#9ad0ff" strokeWidth={2.4} fill="none" strokeDasharray="9 7" transform={`translate(${fx(-Math.max(0, (960 + RC) - (capR + 10) - lineLen))} 0)`} />
        </svg>
      )}
      {capOp > 0.01 && (
        <div style={{position: 'absolute', left: capL, top: 540 - 65, opacity: capOp}}>
          <GlowFrame w={capW} h={130} r={65} ang={ang} glow={kf(t, [[31.4, 0.3], [32.2, 0.9], [32.4, 1.2]])} bright={rp(t, 31.55, 0.3)} stroke={1.6} bg={lerpC('#7a88e8', '#031497', capDeep)}>
            <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SANS, fontSize: 44, color: lerpC('#c8d0ff', '#1a2ad0', capDeep)}}>任务</div>
          </GlowFrame>
        </div>
      )}
    </AbsoluteFill>
  );
};

// 上下两条横向亮蓝光带（中间黑带），慢慢流动（S15–S16）
const Bands: React.FC<{k: number; y: number; t: number}> = ({k, y, t}) => {
  const fl = Math.sin(t * 1.4) * 12;
  return (
    <AbsoluteFill style={{opacity: k, background: `radial-gradient(ellipse 85% 22% at ${fx(45 + fl)}% ${fx(y - 8)}%, ${rgba('#2a3aa8', 0.95)} 0%, ${rgba('#1a2a90', 0.6)} 45%, rgba(10,20,80,0) 100%), radial-gradient(ellipse 85% 22% at ${fx(55 - fl)}% ${fx(100 - y + 10)}%, ${rgba('#2a46c0', 0.95)} 0%, ${rgba('#1a2a90', 0.6)} 45%, rgba(10,20,80,0) 100%)`}} />
  );
};

// ════════════════ S16 32.50–36.33 打字 → 头像球长出 → 3D 对话面板 → 上滑出画 ════════════════
const MSG1 = '你好，今天想安排点什么？';
// 34.0 起面板按原片逐帧单应贴（quads-s16.ts）；36.2 后出画那几帧按最后的速度继续往上
const s16H = (t: number): number[] => {
  const Q = S16_H, n = Q.length;
  if (t >= Q[n - 1][0]) {
    const a = Q[n - 2], b = Q[n - 1], v = (b[6] - a[6]) / (b[0] - a[0]);
    const H = b.slice(1); H[5] += v * (t - b[0]); return H;
  }
  let i = 0; while (i < n - 2 && Q[i + 1][0] < t) i++;
  const k = clamp((t - Q[i][0]) / (Q[i + 1][0] - Q[i][0]));
  return Q[i].slice(1).map((x, j) => mix(x, Q[i + 1][j + 1], k));
};
const AVATAR_PAL: Pal = {top: '#2a5aff', body: '#5a80ff', bottom: '#9ab0fd', core: '#2a4ae0', glow: '#3a6aff', rim: '#d0dcff'};
export const S16: React.FC<{t: number}> = ({t}) => {
  const n = t < 32.58 ? 0 : Math.min(MSG1.length, Math.floor((t - 32.58) / 0.1) + 1);
  const w = spl(t, [[32.75, 400], [32.8, 480], [32.9, 690], [33.0, 840], [33.1, 940], [33.2, 990], [33.3, 1030], [33.4, 1040], [34.0, 1040], [34.1, 1000], [35.0, 990], [35.2, 970]]);
  const h = spl(t, [[34.0, 130], [34.1, 220], [34.2, 300], [34.3, 380], [34.8, 420], [35.0, 470], [35.1, 560], [35.2, 640], [35.3, 650]]);
  const cx = 960 + kf(t, [[32.75, 0], [32.95, 60], [33.4, 0]]);
  const cy = kf(t, [[34.0, 540], [34.3, 535], [35.35, 535], [35.9, 340, EASE.linear], [36.05, 220, EASE.linear], [36.15, 60, EASE.exit], [36.25, -120, EASE.linear], [36.34, -240, EASE.linear]]);
  const rx = spl(t, [[33.85, 0], [34.0, 6], [34.1, 16], [34.5, 14], [34.9, 15], [35.1, 0], [35.2, -12], [35.3, -14], [36.33, -14]]);
  const ry = spl(t, [[33.85, 0], [34.0, 10], [34.1, 16], [34.3, 18], [34.5, 6], [34.7, 16], [34.9, 12], [35.1, -2], [35.2, -14], [35.3, -18], [36.33, -19]]);
  const rz = spl(t, [[33.85, 0], [34.1, -4], [34.3, -6], [34.5, -2], [34.7, -6], [34.9, -4], [35.1, 4], [35.2, 11], [35.3, 14], [36.33, 15]]);
  const rad = kf(t, [[34.0, 65], [34.15, 34]]);
  const avD = kf(t, [[33.18, 0], [33.2, 12, EASE.linear], [33.3, 56, EASE.linear], [33.38, 82, EASE.out], [33.5, 76]]);
  const txtShift = kf(t, [[33.15, 0], [33.32, 96, EASE.out]]);
  const ang = t < 35.08 ? kf(t, [[32.4, 92], [33.9, 285], [34.6, 296], [35.05, 300]]) : kf(t, [[35.08, 110], [35.7, 105], [36.3, 100]]); // 原片 rim_profile 实测
  const m2 = rp(t, 34.17, 0.15, EASE.out), m3 = rp(t, 35.08, 0.15, EASE.out);
  return (
    <AbsoluteFill style={{background: '#030310', overflow: 'hidden'}}>
      <Bands k={1} y={kf(t, [[32.4, 19], [34.0, 22], [35.2, 16]])} t={t} />
      {/* 35.1 起一道斜向光带扫过（面板换方向时） */}
      <AbsoluteFill style={{opacity: rp(t, 35.0, 0.4, EASE.smooth), background: `linear-gradient(160deg, rgba(0,0,0,0) ${fx(kf(t, [[35.0, 20], [36.33, 52, EASE.linear]]))}%, ${rgba('#2a4ad0', 0.75)} ${fx(kf(t, [[35.0, 30], [36.33, 64, EASE.linear]]))}%, rgba(0,0,0,0) ${fx(kf(t, [[35.0, 42], [36.33, 78, EASE.linear]]))}%)`}} />
      <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, perspective: 1700, perspectiveOrigin: `${fx(cx)}px ${fx(cy)}px`}}>
        <div style={t < 34.0
          ? {position: 'absolute', left: cx - w / 2, top: cy - h / 2, width: w, height: h, transform: `rotateX(${fx(rx)}deg) rotateY(${fx(ry)}deg) rotateZ(${fx(rz)}deg)`}
          : {position: 'absolute', left: 0, top: 0, width: w, height: h, transformOrigin: '0 0', transform: homCss(s16H(t))}}>
          <GlowFrame w={w} h={h} r={rad} ang={ang} glow={kf(t, [[32.4, 1.2], [33.0, 1.2], [34.2, 1.2]])} bright={1} stroke={1.6} bg="linear-gradient(170deg, #000f66 0%, #00137a 60%, #021a8e 100%)">
            <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 130, fontFamily: SANS}}>
              <div style={{position: 'absolute', left: 48, top: 65 - 22, fontSize: 44, color: '#1a2ad0', opacity: 1 - rp(t, 32.48, 0.1, EASE.linear)}}>任务</div>
              <div style={{position: 'absolute', left: 44 + txtShift, top: 65 - 29, fontSize: 50, color: '#fff', whiteSpace: 'pre', fontWeight: 300}}>{MSG1.slice(0, n)}</div>
              <Orb x={84} y={65} d={avD} pal={AVATAR_PAL} soft={0.3} glow={0.7} />
            </div>
            {m2 > 0 && (
              <div style={{position: 'absolute', right: 40, top: 160 + (1 - m2) * 30, opacity: m2, fontFamily: SANS, fontSize: 50, fontWeight: 300, fontStyle: 'normal', color: '#fff', textAlign: 'right', lineHeight: '62px', paddingRight: 84}}>
                帮我记一下：周六上午<br />带妈妈去体检
                <div style={{position: 'absolute', right: 0, top: 6, width: 60, height: 60, borderRadius: '50%', boxShadow: 'inset 0 0 0 2.5px #9ab8ff'}}>
                  <div style={{position: 'absolute', left: 21, top: 12, width: 18, height: 18, borderRadius: '50%', boxShadow: 'inset 0 0 0 2.5px #9ab8ff'}} />
                  <div style={{position: 'absolute', left: 14, top: 33, width: 32, height: 16, borderRadius: '16px 16px 4px 4px', boxShadow: 'inset 0 0 0 2.5px #9ab8ff'}} />
                </div>
              </div>
            )}
            {m3 > 0 && (
              <div style={{position: 'absolute', left: 44, top: 330 + (1 - m3) * 40, opacity: m3, fontFamily: SANS, fontSize: 54, fontWeight: 300, color: '#fff', lineHeight: '68px', paddingLeft: 96}}>
                <Orb x={40} y={34} d={kf(t, [[35.08, 10], [35.2, 64, EASE.out]])} pal={AVATAR_PAL} soft={0.3} glow={0.7} />
                好的，已经加进日程，<br />周五晚上 8 点提醒你。
              </div>
            )}
          </GlowFrame>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ════════════════ S17 36.33–40.04 光球绕字标、越跑越小，落成句点 ════════════════
const FS17 = 168;
const W_CN = 4 * FS17 * 1.0; // "逐梦剪辑"
const W_EN = 455; // "skills"（粗体，按字宽估）
const DOT = 34, GAP0 = 14, GAP1 = 22;
const ORB17: P3[] = [[36.33, 31, 104], [36.4, 29, 90], [36.5, 22, 67], [36.6, 24.5, 44], [36.7, 33, 27], [36.8, 43, 19], [36.9, 55, 18], [37.0, 66, 25], [37.1, 75, 33], [37.2, 79.5, 38], [37.3, 82, 50], [37.4, 82.5, 63], [37.5, 80, 74], [37.6, 72, 79.5], [37.65, 66, 79], [37.7, 62, 77], [37.75, 58.5, 73], [37.8, 56.6, 68.5], [37.85, 56, 65.5], [37.883, 55.8, 61], [37.917, 55.8, 56.6], [37.95, 55.8, 54.3], [38.0, 55.8, 54], [40.1, 55.8, 54]];
const ORB17_PAL: [number, Pal][] = [[36.4, PAL.lilac], [36.7, PAL.bright], [37.1, PAL.cyan], [37.6, PAL.cyan], [37.9, {...PAL.bright, top: '#2668fc', body: '#2668fc', bottom: '#2668fc', core: '#2668fc'}]];
export const S17: React.FC<{t: number}> = ({t}) => {
  const push = rp(t, 37.9, 0.12, EASE.out);
  const total = W_CN + W_EN + mix(GAP0, GAP1 * 2 + DOT, push);
  const breathe = 1 + Math.max(0, t - 38.6) * 0.003;
  const left = 960 - total / 2;
  const dotX = left + W_CN + mix(GAP0 / 2, GAP1 + DOT / 2, push);
  const base = 540 + FS17 * 0.36; // 字的底线
  const m = orbMotion(t, ORB17, 0.1);
  const d = spl(t, [[36.33, 128], [36.5, 132], [36.8, 142], [37.0, 136], [37.2, 124], [37.3, 118], [37.4, 112], [37.5, 116], [37.6, 112], [37.65, 100], [37.7, 84], [37.75, 62], [37.8, 48], [37.85, 38], [37.883, 32], [37.917, 30], [37.95, 32], [38.0, DOT]]);
  const sq = rp(t, 37.9, 0.1, EASE.out);
  const sx = kf(t, [[37.5, 1], [37.6, 1.06], [37.68, 1.06], [37.75, 0.97], [37.85, 0.95], [37.95, 1]]);
  const sy = kf(t, [[37.5, 1], [37.6, 0.94], [37.68, 0.92], [37.75, 1.04], [37.85, 1.06], [37.95, 1]]);
  // 落点之后：方形句点固定在字缝里
  const settled = t >= 37.95;
  const ox = settled ? dotX : mix(m.x, dotX, rp(t, 37.85, 0.1, EASE.out));
  const oy = settled ? base - DOT / 2 : m.y;
  // 扫光：从落点往左（右 → 左），约 0.7s 扫完、褪回白色
  const B = kf(t, [[37.9, W_CN + 80], [38.6, -380, EASE.swift]]);
  const sweep = rp(t, 37.9, 0.04, EASE.linear) * (1 - rp(t, 38.4, 0.25, EASE.smooth));
  const grad = (offset: number) => sweep > 0.001
    ? `linear-gradient(90deg, #ffffff ${fx(B - 220 - offset)}px, ${lerpC('#ffffff', '#1a2ad8', sweep)} ${fx(B - 60 - offset)}px, ${lerpC('#ffffff', '#3a7aff', sweep)} ${fx(B + 60 - offset)}px, ${lerpC('#ffffff', '#b8b0ff', sweep)} ${fx(B + 220 - offset)}px, ${lerpC('#ffffff', '#d8d8ff', sweep * 0.6)} ${fx(B + 420 - offset)}px, #ffffff ${fx(B + 640 - offset)}px)`
    : 'linear-gradient(90deg, #ffffff, #ffffff)';
  const enX = W_CN + mix(GAP0, GAP1 * 2 + DOT, push);
  const txt = (s: string, x: number, w: number, fam: string, fw: number, ls: string): React.ReactNode => (
    <div style={{position: 'absolute', left: x, top: 0, width: w + 40, fontFamily: fam, fontWeight: fw, fontSize: FS17, lineHeight: `${FS17 * 1.2}px`, letterSpacing: ls, whiteSpace: 'pre', backgroundImage: grad(x), WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent', color: 'transparent'}}>{s}</div>
  );
  const dim = rp(t, 39.8, 0.24, EASE.linear);
  return (
    <AbsoluteFill style={{background: '#000005', overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transform: `scale(${fx(breathe, 4)})`, filter: dim > 0 ? `brightness(${fx(1 - dim * 0.12)})` : undefined}}>
        <div style={{position: 'absolute', left, top: 540 - FS17 * 0.6, height: FS17 * 1.2, width: total}}>
          {txt('逐梦剪辑', 0, W_CN, SANS, 600, '0em')}
          {txt('skills', enX, W_EN, `"Avenir Next", "Helvetica Neue", ${SANS}`, 700, '-0.02em')}
        </div>
        {!settled
          ? <Orb x={ox} y={oy} d={d} pal={palAt(t, ORB17_PAL)} vx={m.vx} vy={m.vy} cvx={m.cvx} cvy={m.cvy} sx={sx} sy={sy} sgain={kf(t, [[37.6, 0.6], [37.8, 0.3]])} soft={0.8} glow={0.8} radius={sq > 0.5 ? '30%' : '50%'} />
          : <div style={{position: 'absolute', left: ox - DOT / 2, top: oy - DOT / 2, width: DOT, height: DOT, borderRadius: 3, background: '#2668fc', boxShadow: `0 0 ${fx(18 * (1 - rp(t, 38.0, 0.8)) + 6)}px ${rgba('#2668fc', 0.6)}`}} />}
      </div>
    </AbsoluteFill>
  );
};
