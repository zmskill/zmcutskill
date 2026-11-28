// 【镜头组】planet-glow-title-cut：暗底下一颗星球的上沿亮起来、越来越白越来越大地沉下去，标题逐词由糊变清（最后一个词先蓝后白）→
//   星球的光转成一片蓝雾、露出暗色星球 → 硬切网格底：左边一条竖着的星球边，「其实 很简单」弹出，左边的光越来越白（028-A 一拍，开场）
// 学的动作（ArtemLysenko · DashSync 0–3.9s，30fps 逐帧量过，2026-11-21）：
//   0.0 星球上沿亮线在 y809（圆心 x≈980，底边弦宽 430–1525），蓝色（33,94,220）；0.2–0.8 亮线由蓝变白、越来越亮，
//       往下沉（0.5 y853 → 1.0 y895 → 1.5 y964 → 1.8 y1056 → 1.9 出画），同时越来越大（底边弦 0.5 352–1565 → 1.0 255–1661 → 1.8 60–1874）
//   亮线外面的光晕往上长：光晕顶 0.4 y762 → 0.7 y579 → 1.0 y507 → 1.8 y480；亮线里面也是一大片白
//   1.9–2.2 整片白光转成蓝（2.0 (202,231,253) → 2.1 (118,170,252) → 2.2 (52,125,252)），2.3 起只剩一颗暗色星球（顶 y≈890）+ 上面一层淡蓝雾，雾慢慢暗
//   标题一行居中 y≈527、大写字高约 84px（中文按视觉大小放到 116px）：第 1 个词 0.4–0.6 由糊变清；第 2 个词 0.7–0.9 从下面一点糊着上来；
//       第 3 个词 1.3–1.8 是蓝色、从左往右带着糊边扫出来，1.9–2.1 变白；整行带一层白色柔光
//   2.7 硬切：黑底 + 淡网格（格距 96）；左边一条竖着的星球边（过 (197,0)、(391,540)、(176,1080)，R≈814），蓝色细亮线；
//       2.7「is」直接出，2.8「Great」大一号、糊着弹出，3.0 缩回清楚；2.9–3.9 左边星球里面从边往里越来越亮，3.6 起整片发白
// 我们的内容：「掌控 你的 增长」+「其实 很简单」，接 028 数星整串。
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {GroupContract, checkContract, checkInputs, outputDuration, planExtras, toSource} from '../../../assets/lib/helpers/groupClock';
import {SANS, clamp, eo, hash, kf} from '../_kit/blueArcKit';
import {GlowSpot} from '../_kit/light';

const FPS = 30;
export const PLANET_GLOW_TITLE_CONTRACT: GroupContract = {
  sourceDuration: 117 / 30,
  fps: 30,
  motion: [[0, 2.3], [2.6, 3.8]],
  holds: [{at: 2.45, maxExtra: 1.5}, {at: 3.85, maxExtra: 1.5}],
  landmarks: {rise: 0, w1: 0.4, w2: 0.7, w3: 1.3, cut: 2.7, pop: 2.8},
  sfx: [
    {at: 'rise', type: '上扬铺垫', note: '低频铺底 swell', tail: 2.0, volume: 0.4},
    {at: 'w3', type: '闪光', note: '光扫 shimmer', volume: 0.35},
    {at: 'cut', type: '落版重击', note: '重击 hit', volume: 0.5},
    {at: 'pop', type: '弹出', note: '弹出 pop', volume: 0.35},
  ],
  inputs: {words: {count: 3, maxChars: 3}, tail: {count: 2, maxChars: 4}},
};
export type PlanetTitleInputs = {words: string[]; tail: string[]; note: string};
export const PLANET_TITLE_DEFAULT_INPUTS: PlanetTitleInputs = {words: ['掌控', '你的', '增长'], tail: ['其实', '很简单'], note: '虚构 · 仅作演示'};
export const checkPlanetTitleInputs = (x: PlanetTitleInputs) => {
  const bad: string[] = [];
  if (x.words.length !== 3) bad.push('words 必须正好 3 个词');
  if (x.tail.length !== 2) bad.push('tail 必须正好 2 个词');
  [...x.words.map((w) => ['words', w]), ...x.tail.map((w) => ['tail', w])].forEach(([k, w]) => { const lim = k === 'words' ? 3 : 4; if (Array.from(w).length > lim) bad.push(`${k}「${w}」超过 ${lim} 字`); });
  return [...bad, ...checkInputs(PLANET_GLOW_TITLE_CONTRACT, {})];
};
export const planPlanetTitle = (sec: number) => planExtras(PLANET_GLOW_TITLE_CONTRACT, sec);
export const planetTitleFrames = (extras: number[]) => Math.round(outputDuration(PLANET_GLOW_TITLE_CONTRACT, extras) * FPS);
export const PLANET_GLOW_TITLE_DURATION = 117;

const lin = (u: number) => u;
const mixC = (a: number[], b: number[], k: number) => a.map((v, i) => Math.round(v + (b[i] - v) * k));

/** 2026-11-21 按原片逐帧吸管量出的「离圆边多远是什么颜色」表来画：D = 到圆边的距离（正 = 圆外），P[t] = 每个距离上的颜色；时间之间线性插值 */
type Prof = {D: number[]; K: Array<[number, number[][]]>};
const profAt = (pr: Prof, s: number) => {
  const K = pr.K; let i = 0; while (i < K.length - 2 && s > K[i + 1][0]) i++;
  const [t0, c0] = K[i], [t1, c1] = K[Math.min(i + 1, K.length - 1)];
  const u = t1 > t0 ? clamp((s - t0) / (t1 - t0)) : 0;
  return c0.map((c, j) => c.map((v, k) => v + (c1[j][k] - v) * u));
};
const ProfRing: React.FC<{cx: number; cy: number; R: number; pr: Prof; s: number; dim?: number}> = ({cx, cy, R, pr, s, dim = 1}) => {
  const C = profAt(pr, s); const D = pr.D; const E = R + D[0] + 160;
  const bg = [5, 5, 8];
  const st = D.map((d, j) => { const c = C[j].map((v, k) => bg[k] + (v - bg[k]) * dim); return `rgb(${c.map((v) => Math.round(v)).join(',')}) ${(((R + d) / E) * 100).toFixed(3)}%`; }).reverse();
  return <div style={{position: 'absolute', left: cx - E, top: cy - E, width: E * 2, height: E * 2, borderRadius: '50%', background: `radial-gradient(circle closest-side, ${st.join(', ')}, rgba(5,5,8,0) 100%)`}} />;
};
const P1: Prof = {D: [320, 260, 200, 150, 100, 50, 0, -50, -100, -160, -240, -400], K: [
  [0, [[5, 5, 8], [5, 5, 8], [5, 5, 8], [5, 6, 12], [6, 10, 25], [8, 22, 62], [33, 94, 220], [8, 20, 60], [5, 12, 35], [4, 8, 22], [4, 6, 16], [4, 5, 12]]],
  [0.5, [[5, 5, 8], [5, 6, 10], [6, 10, 22], [10, 25, 60], [25, 60, 140], [90, 150, 240], [214, 230, 254], [40, 110, 235], [25, 75, 190], [15, 45, 130], [8, 25, 80], [5, 12, 40]]],
  [1.0, [[17, 30, 72], [17, 40, 92], [24, 70, 154], [63, 123, 217], [164, 204, 241], [211, 236, 253], [244, 250, 254], [192, 231, 254], [59, 133, 252], [35, 102, 233], [25, 80, 200], [15, 50, 150]]],
  [1.6, [[40, 60, 110], [80, 105, 150], [130, 152, 180], [159, 182, 209], [160, 194, 238], [121, 175, 250], [121, 181, 251], [220, 240, 254], [255, 255, 255], [255, 255, 255], [255, 255, 255], [250, 252, 255]]],
  [1.9, [[40, 55, 90], [90, 110, 140], [89, 118, 172], [66, 112, 206], [32, 91, 206], [26, 79, 201], [29, 83, 210], [51, 128, 250], [193, 228, 252], [234, 246, 253], [240, 248, 254], [245, 250, 255]]],
  [2.0, [[40, 55, 90], [75, 97, 136], [61, 98, 172], [37, 87, 190], [22, 71, 180], [15, 60, 166], [13, 48, 148], [34, 105, 235], [101, 165, 248], [196, 226, 250], [220, 238, 252], [230, 242, 254]]],
  [2.1, [[35, 50, 90], [51, 79, 132], [35, 75, 161], [21, 66, 162], [15, 54, 146], [12, 40, 125], [8, 20, 87], [21, 76, 208], [41, 114, 244], [105, 160, 248], [150, 190, 250], [170, 205, 252]]],
  [2.3, [[25, 45, 95], [20, 47, 111], [14, 42, 111], [11, 38, 106], [7, 30, 93], [4, 16, 63], [4, 6, 31], [10, 37, 116], [24, 76, 203], [32, 98, 227], [40, 110, 235], [45, 115, 240]]],
  [2.7, [[18, 32, 70], [14, 33, 80], [10, 30, 80], [8, 27, 76], [6, 21, 67], [4, 12, 46], [4, 6, 26], [8, 28, 90], [18, 58, 160], [25, 76, 180], [30, 85, 190], [34, 90, 195]]],
]};
const P2: Prof = {D: [400, 300, 250, 200, 150, 100, 50, 0, -50, -100, -150, -200, -250, -350], K: [
  [2.8, [[5, 4, 5], [5, 4, 5], [5, 4, 6], [4, 4, 12], [6, 10, 32], [11, 27, 68], [22, 52, 123], [42, 88, 197], [16, 39, 98], [7, 15, 45], [3, 7, 19], [4, 4, 9], [5, 5, 5], [5, 5, 5]]],
  [3.1, [[5, 8, 19], [5, 7, 17], [6, 6, 19], [7, 16, 41], [13, 33, 81], [30, 67, 153], [65, 114, 239], [226, 235, 253], [50, 100, 226], [29, 65, 148], [15, 39, 97], [9, 27, 69], [7, 18, 52], [4, 8, 30]]],
  [3.4, [[5, 9, 23], [5, 9, 23], [8, 18, 45], [17, 38, 88], [34, 73, 168], [118, 149, 232], [215, 224, 250], [254, 254, 254], [231, 237, 254], [76, 124, 254], [44, 93, 209], [33, 73, 169], [23, 54, 127], [15, 34, 83]]],
  [3.7, [[7, 15, 34], [21, 43, 98], [61, 88, 157], [141, 157, 201], [205, 212, 232], [238, 241, 249], [250, 250, 254], [255, 255, 255], [237, 241, 253], [207, 218, 253], [159, 184, 251], [75, 123, 250], [47, 97, 219], [39, 83, 191]]],
  [3.9, [[21, 27, 41], [75, 88, 122], [126, 137, 169], [181, 188, 211], [221, 225, 238], [212, 224, 250], [248, 248, 254], [255, 255, 255], [255, 254, 255], [246, 247, 254], [233, 238, 252], [217, 227, 254], [198, 214, 254], [180, 199, 252]]],
]};

const Grain: React.FC<{o: number; id: string; seed?: number}> = ({o, id, seed = 0}) => ( /* 原片颗粒每帧都在变（光流在整片画面上都量到细碎运动），所以 seed 跟帧走 */
  <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, opacity: o, mixBlendMode: 'overlay', pointerEvents: 'none'}}>
    <filter id={id}><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={seed} stitchTiles="stitch" /><feColorMatrix type="saturate" values="0" /></filter>
    <rect width="1920" height="1080" filter={`url(#${id})`} />
  </svg>
);

const Stars: React.FC<{n?: number; seed?: number}> = ({n = 40, seed = 0}) => <>{Array.from({length: n}, (_, i) => <div key={i} style={{position: 'absolute', left: hash(i + seed) * 1920, top: hash(i * 3.3 + seed) * 1080, width: 2 + hash(i * 5) * 2, height: 2 + hash(i * 5) * 2, borderRadius: 2, background: '#b8c8f0', opacity: 0.12 + hash(i * 7 + seed) * 0.3}} />)}</>;

export const PlanetGlowTitleGroup: React.FC<{inputs?: PlanetTitleInputs; extras?: number[]}> = ({inputs: x = PLANET_TITLE_DEFAULT_INPUTS, extras = [0, 0]}) => {
  const tt = useCurrentFrame() / FPS;
  const s = toSource(tt, PLANET_GLOW_TITLE_CONTRACT, extras);
  const held = tt - s;
  const TXT = {fontFamily: SANS, fontSize: 116, fontWeight: 500, color: '#f4f6ff', letterSpacing: '0.01em', whiteSpace: 'nowrap' as const};

  if (s < 2.7) {
    // —— 第一景：星球上沿 ——
    const rimTop = kf(s, [[0, 809], [0.2, 812], [0.3, 817], [0.4, 829], [0.5, 853], [0.7, 865], [1.0, 900], [1.6, 902], [1.9, 908], [2.7, 912]], lin); /* 2026-11-21 再量：圆边只从 809 沉到 ≈905 就停了，后面往下走的是边里面那片白光（之前误当成圆边一路沉出画） */
    const R = kf(s, [[0, 704], [0.5, 740], [1.0, 790], [1.6, 860], [2.3, 920], [2.7, 930]], lin);
    // 标题
    const W = x.words;
    const k1 = eo(clamp((s - 0.45) / 0.3)), k2 = eo(clamp((s - 0.7) / 0.3)), /* 逐帧放大看：词是从下面带着竖向拖影、偏蓝地升上来，0.3s 到位变白 */ sweep = clamp((s - 1.3) / 0.5), white = clamp((s - 1.9) / 0.22);
    return (
      <AbsoluteFill style={{background: '#04050a', overflow: 'hidden', transform: `scale(${1 + held * 0.004})`}}>
        <Stars />
        <AbsoluteFill style={{WebkitMaskImage: `radial-gradient(ellipse 1150px 900px at 980px ${rimTop + 120}px, #000 45%, rgba(0,0,0,0.35) 80%, rgba(0,0,0,0.12) 100%)`, maskImage: `radial-gradient(ellipse 1150px 900px at 980px ${rimTop + 120}px, #000 45%, rgba(0,0,0,0.35) 80%, rgba(0,0,0,0.12) 100%)`}}><ProfRing cx={980} cy={rimTop + R} R={R} pr={P1} s={s} dim={1 + 0.03 * Math.sin(held * 2)} /></AbsoluteFill>{/* 原片光只集中在圆顶中间，往两边越来越暗 */}
        <GlowSpot x={1330} y={500} rx={300} ry={160} rgb="200,205,225" a={0.28 * clamp((s - 1.9) / 0.4)} />{/* 最后一个词变白后右上冒一团白光 */}
        <GlowSpot x={960} y={527} rx={560} ry={110} rgb="150,160,190" a={0.16 * clamp((s - 0.5) / 0.6)} />{/* 原片整行字后面有一团灰白柔光 */}
        <Grain o={0.16} id="pg1" seed={Math.round(tt * FPS)} />
        <div style={{position: 'absolute', left: 0, right: 0, top: 527, transform: 'translateY(-50%)', display: 'flex', justifyContent: 'center', gap: 34, ...TXT, textShadow: '0 0 18px rgba(255,255,255,0.35), 0 0 60px rgba(160,190,255,0.25)'}}>
          {[k1, k2].map((k, i) => <span key={i} style={{display: 'inline-block', opacity: clamp(k * 2.2), color: `rgb(${mixC([90, 125, 255], [244, 246, 255], clamp(k * 1.3 - 0.2)).join(',')})`, filter: k < 1 ? `blur(${(1 - k) * 9}px)` : undefined, transform: `translateY(${(1 - k) * 80}px) scaleY(${1 + (1 - k) * 0.45})`}}>{W[i]}</span>)}
          <span style={{position: 'relative', color: `rgb(${mixC([70, 110, 255], [244, 246, 255], white).join(',')})`, WebkitMaskImage: `linear-gradient(90deg, #000 ${sweep * 130 - 30}%, transparent ${sweep * 130}%)`, maskImage: `linear-gradient(90deg, #000 ${sweep * 130 - 30}%, transparent ${sweep * 130}%)`, filter: sweep < 1 ? `blur(${(1 - sweep) * 3}px)` : undefined, textShadow: `0 0 ${14 + 20 * white}px rgba(${white > 0.5 ? '255,255,255' : '80,120,255'},0.55)`}}>{W[2]}</span>
        </div>
      </AbsoluteFill>
    );
  }

  // —— 第二景：网格底 + 左边竖着的星球边 ——
  const R2 = 814, cx2 = 345 - R2; /* 左边星球边固定在 x≈345（过 (197,0)、(391,540)、(176,1080)） */
  const is = clamp((s - 2.7) / 0.06), g = eo(clamp((s - 2.78) / 0.3));
  const T = x.tail;
  return (
    <AbsoluteFill style={{background: '#05060b', overflow: 'hidden', transform: `scale(${1 + held * 0.004})`}}>
      <AbsoluteFill style={{backgroundImage: 'linear-gradient(rgba(255,255,255,0.085) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.085) 1px, transparent 1px)', backgroundSize: '96px 96px', backgroundPosition: '30px 12px'}} />
      <Stars n={26} seed={9} />
      <ProfRing cx={cx2} cy={540} R={R2} pr={P2} s={s + held * 0.05} />
      <Grain o={0.16} id="pg2" seed={Math.round(tt * FPS)} />
      <GlowSpot x={985} y={530} rx={360} ry={150} rgb="170,170,185" a={0.42 * is} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 528, transform: 'translateY(-50%)', display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: 22, ...TXT, textShadow: '0 0 16px rgba(255,255,255,0.45), 0 0 50px rgba(255,255,255,0.18)'}}>
        <span style={{opacity: is}}>{T[0]}</span>
        <span style={{opacity: clamp(g * 3), display: 'inline-block', transform: `translateY(${(1 - g) * -46}px) scale(${1.12 - 0.12 * g}, ${1.12 + 0.2 * (1 - g) - 0.12 * g})`, transformOrigin: '0% 70%', fontWeight: g < 1 ? 600 : 500, filter: g < 1 ? `blur(${(1 - g) * 6}px)` : undefined}} /* 原片「Great」是从上面一点、大一号带拖影落下来 */>{T[1]}</span>
      </div>
      <div style={{position: 'absolute', right: 36, bottom: 26, fontSize: 20, color: 'rgba(200,210,255,0.45)', letterSpacing: '0.06em', fontFamily: SANS}}>{x.note}</div>
    </AbsoluteFill>
  );
};

if (checkContract(PLANET_GLOW_TITLE_CONTRACT).length) throw new Error(checkContract(PLANET_GLOW_TITLE_CONTRACT).join('；'));
export const PlanetGlowTitleCut: React.FC = () => <PlanetGlowTitleGroup />;
