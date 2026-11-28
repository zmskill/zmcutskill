// 【镜头组】type-icons-orbit-input：大字逐字打出 → 猛拉远成一行小字 → 句子中间撑开、插进一排 AI 图标 →
//   镜头推近斜一下、硬切成输入框，图标飞过去绕着发送键转圈、边打字 → 图标收进发送键 → 硬切满屏大字多行反向横滚，部分字换成图标（039-A 一串，开场钩子）
// 学的动作（MdMizanurRahman · NotebookLM 0–6.43s，30fps 逐帧看过）：
//   拍 1 0–0.68 大字逐字蹦出（每字约 3 帧，带转角弹进），0.68–0.74 两帧猛拉远到小字；0.80–0.93 打出后半句
//   拍 2 1.5–1.9 前后半句往两边撑开，1.62–2.1 中间一个个弹出白色图标砖（中间那块最大、带光）；2.25 左边一个小图标掉到行下
//   拍 3 2.4–2.85 镜头推近、往左摇、斜 3°，前半句染紫、从左边出画；2.85 硬切：输入框斜着进、0.15s 摆正
//        2.92–3.15 图标从下面飞上来，绕发送键转圈（透视椭圆，越转越慢），3.0–4.35 逐字打字，关键词紫色；4.45–4.8 图标收进发送键
//   拍 4 4.8 硬切：四行大字（灰 / 黑 / 黑 / 灰斜体），相邻行反向横滚；黑行的关键词有蓝紫渐变扫过；5.85 起部分字换成白色圆形图标
// 我们的内容：AI 正在改变 / 每一天；输入"和 AI 聊聊我的学习计划"；满屏"这么多 AI / 模型到处都是"。图标是国内 AI 产品官方图标（library/brands）。
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Grain} from '../../../assets/lib/helpers/polish';
import {GroupContract, checkContract, checkInputs, outputDuration, planExtras, toSource} from '../../../assets/lib/helpers/groupClock';
import {Disc, INK, InputPill, PURPLE, SANS, SoftBg, Tile, clamp, eio, eo, back, kf, mix, rs} from '../_kit/softAiKit';

const FPS = 30;
export const TYPE_ICONS_ORBIT_INPUT_CONTRACT: GroupContract = {
  sourceDuration: 193 / 30,
  fps: 30,
  motion: [[0, 2.3], [2.4, 4.4], [4.5, 193 / 30]],
  holds: [{at: 2.35, maxExtra: 1.2}, {at: 4.45, maxExtra: 1.2}],
  landmarks: {type: 0, zoomOut: 0.68, split: 1.5, icons: 1.62, cut1: 2.85, orbit: 2.95, typed: 4.35, collapse: 4.5, cut2: 4.8, swap: 5.85},
  sfx: [
    {at: 'type', type: '键盘', note: '一串打字 tick', tail: 0.7, volume: 0.35},
    {at: 'zoomOut', type: '短甩', note: '短 whoosh（拉远）', volume: 0.4},
    {at: 'icons', type: '弹出', note: '一串轻 pop', tail: 0.5, volume: 0.35},
    {at: 'cut1', type: '短甩', note: '硬切 swish', volume: 0.4},
    {at: 'orbit', type: '闪光', note: '轻柔 shimmer（图标绕转）', tail: 1.4, volume: 0.25},
    {at: 'cut2', type: '落版重击', note: '低频 hit + 横滚 whoosh', tail: 1.2, volume: 0.5},
  ],
  inputs: {lineA: {maxChars: 7}, lineB: {maxChars: 4}, prompt: {maxChars: 14}, rowA: {maxChars: 6}, rowB: {maxChars: 7}},
};
export type OrbitInputs = {lineA: string; lineB: string; prompt: string; hot: string; rowA: string; rowB: string; rowAHot: string; rowBHot: string; icons: string[]};
export const ORBIT_DEFAULT_INPUTS: OrbitInputs = {
  lineA: 'AI 正在改变', lineB: '每一天', prompt: '和 AI 聊聊我的学习计划', hot: '学习计划',
  rowA: '这么多 AI', rowB: '模型到处都是', rowAHot: 'AI', rowBHot: '到处都是',
  icons: ['yuanbao', 'kimi', 'qianwen', 'deepseek', 'wenxin', 'doubao', 'jimeng'],
};
export const checkOrbitInputs = (x: OrbitInputs) => checkInputs(TYPE_ICONS_ORBIT_INPUT_CONTRACT, {lineA: x.lineA, lineB: x.lineB, prompt: x.prompt, rowA: x.rowA, rowB: x.rowB});
export const planOrbit = (sec: number) => planExtras(TYPE_ICONS_ORBIT_INPUT_CONTRACT, sec);
export const orbitFrames = (extras: number[]) => Math.round(outputDuration(TYPE_ICONS_ORBIT_INPUT_CONTRACT, extras) * FPS);
export const TYPE_ICONS_ORBIT_INPUT_DURATION = 193;

const W = 1920, H = 1080;
const cw = (ch: string, fs: number) => (/[⺀-￯]/.test(ch) ? fs : ch === ' ' ? fs * 0.22 : /[A-Z]/.test(ch) ? fs * 0.62 : fs * 0.56);
const width = (s: string, fs: number) => Array.from(s).reduce((a, c) => a + cw(c, fs), 0);

// ───────── 底部"棒棒糖"音柱：细线 + 顶上粉色小方块，高度按波动 ─────────
const Sticks: React.FC<{t: number; o: number}> = ({t, o}) => (
  <svg width={W} height={H} style={{position: 'absolute', inset: 0, opacity: o}}>
    {Array.from({length: 18}, (_, i) => {
      const x = 14 + i * 115;
      if (t < i * 0.07) return null; // 开头从左边一根根冒出来（原片 0–1.2s）
      const hgt = 170 + 70 * Math.sin(i * 0.55 - t * 2.6) + 40 * Math.sin(i * 1.3 + t * 1.7);
      const y0 = 940, y1 = y0 - hgt;
      return <g key={i}><line x1={x} y1={y1} x2={x} y2={y0} stroke="rgba(200,140,235,0.6)" strokeWidth={2.4} /><rect x={x - 12} y={y1 - 10} width={24} height={20} rx={3} fill="#e09cf4" stroke="#f4d2fb" strokeWidth={2} /></g>;
    })}
  </svg>
);

// ───────── 拍 1–3：打字 + 插图标 ─────────
const LineScene: React.FC<{s: number; t: number; x: OrbitInputs}> = ({s, t, x}) => {
  const A = Array.from(x.lineA), B = Array.from(x.lineB);
  const zo = rs(s, 0.68, 0.07, eio); // 0 = 大字，1 = 小字
  const fsBig = 230, fsSmall = 92;
  // 打字：前半句 0–0.66，每字均匀；后半句 0.80–0.93
  const nA = A.length, nB = B.length;
  const tA = (i: number) => (i / nA) * 0.64, tB = (i: number) => 0.8 + (i / Math.max(1, nB)) * 0.13;
  const charStyle = (st: number): React.CSSProperties => {
    const p = clamp((s - st) / 0.1);
    return {display: 'inline-block', opacity: p > 0 ? 1 : 0, transform: `rotate(${(-38 * (1 - eo(p))).toFixed(1)}deg) scale(${(0.5 + 0.5 * back(p, 2.2)).toFixed(3)})`, transformOrigin: '50% 80%', filter: p < 1 ? `blur(${(4 * (1 - p)).toFixed(1)}px)` : undefined};
  };
  // 句子撑开：1.5–1.9 中间空位从一个空格长到图标行宽
  const ICON_SIZES = [60, 72, 150, 72, 60];
  const rowW = ICON_SIZES.reduce((a, b) => a + b, 0) + 4 * 26 + 80;
  const gap = mix(fsSmall * 0.32, rowW, rs(s, 1.5, 0.42, eio));
  const wA = width(x.lineA, fsSmall), wB = width(x.lineB, fsSmall);
  const total = wA + gap + wB;
  // 镜头：小字阶段慢慢下移；2.4–2.85 推近、左摇、斜
  const push = rs(s, 2.4, 0.45, (u) => u * u);
  const camS = mix(1, 1.32, push), camR = mix(0, -3.2, push), camX = mix(0, -260, push), camY = mix(0, 18, push);
  const lineY = mix(300, 335, clamp((s - 0.8) / 1.6));
  // 大字阶段：整行居中、往右长；小字阶段：整行居中
  const bigW = A.slice(0, Math.max(1, Math.ceil(clamp(s / 0.64) * nA))).reduce((a, c) => a + cw(c, fsBig), 0);
  const scale = mix(1, fsSmall / fsBig, zo);
  const leftBig = W / 2 - bigW / 2;
  const leftSmall = W / 2 - total / 2;
  const y = mix(335, lineY, zo);
  const tintA = rs(s, 2.55, 0.25);
  const exitMask = rs(s, 2.66, 0.2);
  const gx = leftSmall + wA; // 空位左边
  return (
    <AbsoluteFill style={{transform: `translate(${camX}px, ${camY}px) rotate(${camR}deg) scale(${camS})`, transformOrigin: '1150px 335px'}}>
      {/* 前半句 */}
      <div style={{position: 'absolute', left: mix(leftBig, leftSmall, zo), top: y, transform: `translateY(-50%) scale(${scale})`, transformOrigin: '0 50%', whiteSpace: 'pre', fontFamily: SANS, fontWeight: 500, fontSize: fsBig, lineHeight: 1, letterSpacing: '0.01em',
        color: tintA > 0 ? `rgb(${Math.round(mix(42, 190, tintA))},${Math.round(mix(40, 110, tintA))},${Math.round(mix(48, 230, tintA))})` : INK,
        WebkitMaskImage: exitMask > 0 ? `linear-gradient(90deg, transparent ${exitMask * 70}%, #000 ${exitMask * 70 + 25}%)` : undefined}}>
        {A.map((c, i) => <span key={i} style={{...charStyle(tA(i)), width: cw(c, fsBig)}}>{c}</span>)}
      </div>
      {/* 后半句 */}
      {s >= 0.78 && <div style={{position: 'absolute', left: gx + gap, top: lineY, transform: 'translateY(-50%)', whiteSpace: 'pre', fontFamily: SANS, fontWeight: 500, fontSize: fsSmall, lineHeight: 1, color: INK}}>
        {B.map((c, i) => <span key={i} style={{...charStyle(tB(i)), width: cw(c, fsSmall)}}>{c}</span>)}
      </div>}
      {/* 图标行 */}
      {s >= 1.6 && (() => {
        let xx = gx + 40;
        return ICON_SIZES.map((sz, i) => {
          const st = 1.66 + [0.06, 0, 0.12, 0.2, 0.27][i];
          const p = clamp((s - st) / 0.16);
          const el = <div key={i} style={{position: 'absolute', left: xx, top: lineY - sz / 2, transform: `scale(${back(p, 2.4).toFixed(3)})`, opacity: Math.min(1, p * 3)}}><Tile k={x.icons[i + 1]} size={sz} glow={i === 2 ? 1 : 0} /></div>;
          xx += sz + 26;
          return el;
        });
      })()}
      {/* 左边那个小图标：先弹在行里，2.25 掉到行下 */}
      {s >= 1.62 && (() => {
        const p = clamp((s - 1.62) / 0.14);
        const fall = rs(s, 2.22, 0.3, eio);
        return <div style={{position: 'absolute', left: gx + mix(-4, -32, fall), top: lineY - 18 + fall * 78, transform: `scale(${back(p, 2) * mix(1, 0.85, fall)}) rotate(${fall * -14}deg)`, opacity: Math.min(1, p * 3)}}><Tile k={x.icons[0]} size={40} /></div>;
      })()}
    </AbsoluteFill>
  );
};

// ───────── 拍 3：输入框 + 图标绕发送键 ─────────
const OrbitScene: React.FC<{s: number; x: OrbitInputs}> = ({s, x}) => {
  const e = rs(s, 2.85, 0.33, eo); // 2026-11-19 逐帧：3.0 还斜着、3.2 才摆正
  const BW = 1250, BH = 140, cx = 945, cy = 517;
  const P = Array.from(x.prompt);
  const n = Math.floor(clamp((s - 3.0) / 1.35) * P.length + 0.001);
  const hotStart = x.prompt.indexOf(x.hot);
  const text = P.slice(0, n).map((c, i) => <span key={i} style={{color: hotStart >= 0 && i >= hotStart && i < hotStart + x.hot.length ? PURPLE : INK}}>{c}</span>);
  const sendX = cx + BW / 2 - BH * 0.22 - BH * 0.25, sendY = cy;
  // 绕转：椭圆，中心在发送键左下，越转越慢；4.45–4.8 收进发送键
  const ocx = sendX - 220, ocy = sendY; // 原片 3.7s 量：圆心在发送键左边 220px，半径约 210
  const col = rs(s, 4.45, 0.33, eio);
  // 领头图标的角度（逐帧量：3.2s −0.4、3.7s −3.7、4.3s −5.4 rad；逆时针、先快后慢），后面的依次 +0.55
  const ang0 = kf(s, [[2.9, 1.3], [3.2, -0.4], [3.7, -3.7], [4.3, -5.4], [4.8, -6.1]]);
  const icons = x.icons;
  return (
    <AbsoluteFill>
      {/* 硬切进来时输入框是斜的（左边远、右边近、整体逆时针 8°），0.15s 摆正（原片 2.87–3.0s） */}
      <div style={{position: 'absolute', zIndex: 2, left: 0, top: 0, width: W, height: H, transform: `translate(${cx}px, ${mix(415, cy, e)}px) perspective(1400px) rotateY(${mix(-18, 0, e)}deg) rotate(${mix(-8, 0, e)}deg) scale(${mix(1.45, 1, e)}) translate(${-cx}px, ${-cy}px)`, filter: e < 0.6 ? `blur(${(1 - e) * 2.5}px)` : undefined}}>
        <InputPill w={BW} h={BH} text={text} caret={s < 4.6 && Math.floor(s * 3) % 2 === 0} model="快速" style={{left: cx - BW / 2, top: cy - BH / 2}} />
      </div>
      {icons.map((k, i) => {
        const fly = rs(s, 2.9 + i * 0.03, 0.26, eo);
        const a = ang0 + i * 0.55; // 领头的在最前（角度最小），后面的跟着
        const R = 210 * (1 - col);
        const ox = ocx + Math.cos(a) * R + (sendX - ocx) * col, oy = ocy + Math.sin(a) * R * 0.95 + (sendY - ocy) * col;
        const depth = 0.85 + 0.2 * Math.sin(a);
        // 从下面飞上来
        const sx = cx + (i - 3) * 60, sy = 1180;
        const px = mix(sx, ox, fly), py = mix(sy, oy, fly);
        const size = 135 * depth * mix(1, 0.45, col);
        const o = Math.min(1, fly * 2) * (1 - rs(s, 4.72, 0.06));
        return <div key={k} style={{position: 'absolute', left: px - size / 2, top: py - size / 2, opacity: o, zIndex: Math.cos(a) < -0.1 && Math.abs(py - cy) < BH * 0.7 ? 1 : 3}}><Disc k={k} size={size} /></div>;
      })}
    </AbsoluteFill>
  );
};

// ───────── 拍 4：满屏大字横滚 ─────────
const Row: React.FC<{s: number; y: number; text: string; hot: string; dir: number; grey?: boolean; italic?: boolean; fs: number; sweep?: number; icons?: [number, string][]; seed: number}> = ({s, y, text, hot, dir, grey, italic, fs, sweep = -1, icons = [], seed}) => {
  const unit = text + '  ';
  const uw = width(unit, fs);
  const v = 1350; // px / 秒
  const off = ((dir * v * (s - 4.8) + seed) % uw + uw) % uw;
  const chars = Array.from(unit);
  const hs = text.indexOf(hot);
  return (
    <div style={{position: 'absolute', left: -uw + off - uw, top: y - fs * 0.55, whiteSpace: 'pre', fontFamily: SANS, fontWeight: 500, fontSize: fs, lineHeight: 1, transform: italic ? 'skewX(-12deg)' : undefined, display: 'flex'}}>
      {[0, 1, 2, 3, 4].map((rep) => chars.map((c, i) => {
        const appear = clamp((s - 4.76 - ((i * 7 + rep * 3 + seed) % 11) * 0.008) / 0.05); // 切过来第一帧就要有字（原来这里空一帧）
        const isHot = !grey && hs >= 0 && i >= hs && i < hs + hot.length;
        const ic = icons.find(([idx]) => idx === i && rep % 2 === 1);
        if (ic && s >= ic[1].length * 0 + 5.85 + (i % 3) * 0.08) return <span key={rep + '-' + i} style={{display: 'inline-flex', width: cw(c, fs), justifyContent: 'center', alignItems: 'center'}}><Disc k={ic[1]} size={fs * 0.8} /></span>;
        const g = isHot && sweep >= 0 ? sweep : -1;
        const col = grey ? '#7c7880' : INK;
        const st: React.CSSProperties = {display: 'inline-block', width: cw(c, fs), opacity: appear};
        if (g >= 0) Object.assign(st, {backgroundImage: `linear-gradient(90deg, #3a7be8 ${mix(-60, 40, g)}%, #b46cf0 ${mix(-20, 80, g)}%, ${col} ${mix(10, 120, g)}%)`, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', backgroundSize: `${width(hot, fs)}px 100%`, backgroundPosition: `${-width(text.slice(hs, i), fs)}px 0`});
        else st.color = col;
        return <span key={rep + '-' + i} style={st}>{c}</span>;
      }))}
    </div>
  );
};
const BigRows: React.FC<{s: number; x: OrbitInputs}> = ({s, x}) => {
  const fs = 250;
  const sw = (a: number) => (s < a ? 0 : s < a + 0.9 ? (s - a) / 0.9 : clamp(1 - (s - a - 0.9) / 0.5));
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <Row s={s} y={70} text={x.rowA} hot={x.rowAHot} dir={1} grey fs={fs} seed={300} />
      <Row s={s} y={385} text={x.rowB} hot={x.rowBHot} dir={-1} fs={fs} sweep={sw(4.9)} seed={0} icons={[[1, x.icons[0]], [3, x.icons[5]]]} />
      <Row s={s} y={700} text={x.rowA} hot={x.rowAHot} dir={1} fs={fs} sweep={sw(5.0)} seed={700} icons={[[1, x.icons[3]], [2, x.icons[2]]]} />
      <Row s={s} y={1015} text={x.rowB} hot={x.rowBHot} dir={-1} grey italic fs={fs} seed={500} />
    </AbsoluteFill>
  );
};

export const TypeIconsOrbitInputGroup: React.FC<{inputs?: OrbitInputs; extras?: number[]}> = ({inputs = ORBIT_DEFAULT_INPUTS, extras = [0, 0]}) => {
  const t = useCurrentFrame() / FPS;
  const s = toSource(t, TYPE_ICONS_ORBIT_INPUT_CONTRACT, extras);
  const held = t - s;
  // 背景两团光：位置跟拍子走
  const blue = {x: kf(s, [[0, 75], [1.0, 62], [2.4, 50], [2.85, 47], [4.8, 30]]), y: kf(s, [[0, 15], [2.4, 18], [2.85, 8], [4.8, 6]]), r: 30, c: 'rgba(135,185,255,1)'};
  const pink = {x: kf(s, [[0, 16], [1.0, 26], [2.4, 40], [2.85, 50], [4.1, 52], [4.8, 62]]), y: kf(s, [[0, 72], [2.4, 68], [2.85, 72], [4.8, 76]]), r: s < 2.85 ? 26 : 31, /* 2026-11-19 吸管：输入框下面是一大团圆的粉紫光（中心 y≈72%），不是贴底的一条 */ c: 'rgba(222,140,244,0.85)'};
  const big = s >= 4.8;
  return (
    <AbsoluteFill style={{background: '#f1eeeb', overflow: 'hidden'}}>
      <SoftBg blue={big ? {...blue, a: 0} : blue} pink={big ? {...pink, a: 0} : pink} haze={s < 2.85 ? 1 : 0} />
      {s < 2.85 && <Sticks t={t} o={1} />}
      <div style={{position: 'absolute', inset: 0, transform: `scale(${1 + 0.006 * held})`}}>
        {s < 2.85 && <LineScene s={s} t={t} x={inputs} />}
        {s >= 2.85 && s < 4.8 && <OrbitScene s={s} x={inputs} />}
        {big && <BigRows s={s} x={inputs} />}
      </div>
      <Grain opacity={0.03} blend="multiply" />
    </AbsoluteFill>
  );
};

if (checkContract(TYPE_ICONS_ORBIT_INPUT_CONTRACT).length) throw new Error(checkContract(TYPE_ICONS_ORBIT_INPUT_CONTRACT).join('；'));
export const TypeIconsOrbitInput: React.FC = () => <TypeIconsOrbitInputGroup />;
