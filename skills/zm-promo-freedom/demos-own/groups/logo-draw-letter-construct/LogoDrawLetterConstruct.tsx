// 【镜头组】logo-draw-letter-construct：墨绿底，品牌图标用一根粗丝带线“画”出来（边画边转）→ 顶上冒出一个构造圆 + 左边一个小三角标记、交叠处染成青色 →
//   右半边青色面板推进来，图标同时往左让位；面板里画出一个大字，角上一个细线构造圆、圆里那块字染深 → 字压扁收掉、换成第二个字（构造圆挪到底部）→ 浅色块切走（014-H 一拍，讲 logo / 字形构造）
// 学的动作（Abstudiobrand · Neutron 32.3–37.4s，源 60fps，按时间逐帧量过，2026-11-22）：
//   32.37–33.2 丝带线逐段画出整个图标（边画边转 ≈40°），33.2–33.45 回正；图标中心 (960,640)，宽 ≈680、高 ≈670，线宽 ≈46，颜色 #7cc79c
//   33.5 顶上构造圆从一个点长到 r≈140（中心 962,256，青色描边 8），33.5 左边小三角 (750,256)；圆和图标重叠的那块染青
//   34.15–34.6 右边青色面板推进（左沿 1920 → 1404 → 1116 → 1008 → 962），图标同时左移到中心 x≈534，构造圆变细线 r≈162
//   34.45 大字逐笔画出（x 1260–1754，y 264–904，笔画 ≈76，#6fb88c），34.65 角上细线圆 (1342,304) r≈160 长出，圆里那块字染深 #173a2a，圆上方一个深色小三角朝下
//   36.05–36.25 第一个字压扁收进圆里；36.3–36.6 第二个字从底下长出来（x 1276–1700，y 276–744），构造圆在底部 (1490,696) r≈155，三角在下面朝上
//   37.2–37.4 浅色窄条从中间往两边慢慢撑开（接下一段）
// 我们的内容：自己画的三瓣丝带图标；字是「中」→「子」（虚构品牌“中子科技”的两个字），右下角标"虚构 · 仅作演示"。
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {GroupContract, checkContract, checkInputs, outputDuration, planExtras, toSource} from '../../../assets/lib/helpers/groupClock';

const FPS = 30;
const S0 = 32.3;
const DARK = '#1c2e24';
const TEAL = '#0f8f8e';
const RIB = '#7cc79c';
const LET = '#6fb88c';
const DEEP = '#173a2a';
const SANS = '"Noto Sans CJK SC","PingFang SC",sans-serif';
const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const eo = (u: number) => 1 - Math.pow(1 - clamp(u), 3);
const eio = (u: number) => { const x = clamp(u); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
const lin = (t: number, K: number[][]) => {
  if (t <= K[0][0]) return K[0][1];
  for (let i = 1; i < K.length; i++) if (t <= K[i][0]) { const [a, va] = K[i - 1], [b, vb] = K[i]; return va + (vb - va) * (t - a) / (b - a); }
  return K[K.length - 1][1];
};

export const LOGO_LETTER_CONTRACT: GroupContract = {
  sourceDuration: 153 / 30,
  fps: 30,
  motion: [[0, 4.15], [4.85, 5.1]],
  holds: [{at: 4.5, maxExtra: 2}],
  landmarks: {draw: 0.07, ring: 1.2, panel: 1.85, letter: 2.15, swap: 3.5, out: 4.9},
  sfx: [
    {at: 'draw', type: '短甩', note: '画线 swoosh', tail: 0.8, volume: 0.25},
    {at: 'ring', type: '轻tick', note: '轻 tick', volume: 0.25},
    {at: 'panel', type: '运镜', note: '推入 whoosh', volume: 0.3},
    {at: 'swap', type: '弹出', note: '压扁 pop', volume: 0.3},
    {at: 'out', type: '短甩', note: '切换 cut', volume: 0.3},
  ],
  inputs: {char1: {maxChars: 1}, char2: {maxChars: 1}},
};
export type LogoLetterInputs = {char1: string; char2: string; note: string};
export const LOGO_LETTER_DEFAULT_INPUTS: LogoLetterInputs = {char1: '中', char2: '子', note: '虚构 · 仅作演示'};
export const checkLogoLetterInputs = (x: LogoLetterInputs) => checkInputs(LOGO_LETTER_CONTRACT, {char1: x.char1, char2: x.char2});
export const planLogoLetter = (sec: number) => planExtras(LOGO_LETTER_CONTRACT, sec);
export const logoLetterFrames = (extras: number[]) => Math.round(outputDuration(LOGO_LETTER_CONTRACT, extras) * FPS);
export const LOGO_LETTER_DURATION = 153;

// 三瓣丝带图标（自己画）：三个水滴形环，转 0/120/240；viewBox -100..100
const PETAL = 'M0 -92 C 46 -92 70 -30 40 8 C 18 36 -18 36 -40 8 C -70 -30 -46 -92 0 -92 Z';
const PETAL_LEN = 520;
// 字形（粗笔画路径，viewBox 0..500 x 0..640）
const ZHONG = ['M40 170 L40 470', 'M40 170 L460 170 L460 470', 'M40 470 L460 470', 'M250 30 L250 640'];
const ZI = ['M80 60 L400 60 Q 420 60 400 80 L 260 200', 'M250 200 L250 560 Q 250 620 180 610', 'M40 330 L460 330'];

const Letter: React.FC<{strokes: string[]; prog: number; color: string}> = ({strokes, prog, color}) => (
  <g>{strokes.map((d, i) => { const p = clamp(prog * strokes.length - i); return <path key={i} d={d} stroke={color} strokeWidth={76} fill="none" strokeLinecap="square" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />; })}</g>
);

export const LogoDrawLetterConstructGroup: React.FC<{inputs?: LogoLetterInputs; extras?: number[]}> = ({inputs: x = LOGO_LETTER_DEFAULT_INPUTS, extras = [0]}) => {
  const tt = useCurrentFrame() / FPS;
  const s = toSource(tt, LOGO_LETTER_CONTRACT, extras) + S0;
  // 图标
  const draw = eio((s - 32.37) / 0.75);
  const rot = lin(s, [[32.37, -40], [33.2, 6], [33.45, 0]]);
  const lx = lin(s, [[34.15, 960], [34.3, 912], [34.45, 768], [34.6, 606], [34.8, 558], [34.95, 540], [35.3, 534]]);
  const scale = 680 / 165;
  // 顶上构造圆
  const ringR = lin(s, [[33.5, 4], [33.72, 140], [34.15, 140], [34.6, 162]]);
  const ringW = lin(s, [[34.15, 8], [34.6, 2]]);
  const ringO = clamp((s - 33.48) / 0.05);
  const ringCy = lin(s, [[34.15, 256], [34.6, 248]]);
  // 面板
  const panelX = lin(s, [[34.15, 1920], [34.3, 1404], [34.45, 1116], [34.6, 1008], [34.8, 962]]);
  // 字
  const p1 = clamp((s - 34.45) / 0.45);
  const squash1 = 1 - eio((s - 36.05) / 0.2);
  const grow2 = eo((s - 36.3) / 0.3);
  const c1R = lin(s, [[34.62, 0], [34.8, 160], [36.05, 160], [36.25, 60]]);
  const c2R = lin(s, [[36.25, 60], [36.6, 155]]);
  const showSecond = s >= 36.25;
  const cX = showSecond ? lin(s, [[36.25, 1505], [36.6, 1490]]) : 1505;
  const cY = showSecond ? lin(s, [[36.25, 330], [36.6, 696]]) : 330;
  const cR = showSecond ? c2R : c1R;
  // 字在画面里的框：x 1260–1754 → viewBox 0..500 映射
  const LX = 1255, LY = 264, LS = 1.0;
  const out = s > 37.2 ? eio((s - 37.2) / 0.6) * 0.5 : 0;
  return (
    <AbsoluteFill style={{background: DARK, overflow: 'hidden'}}>
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <defs>
          <clipPath id="llc-ring"><circle cx={lx + 2} cy={ringCy} r={ringR} /></clipPath>
          <clipPath id="llc-c"><circle cx={cX} cy={cY} r={Math.max(0.1, cR)} /></clipPath>
          <clipPath id="llc-panel"><rect x={panelX} y={0} width={1920} height={1080} /></clipPath>
        </defs>
        {/* 丝带图标 */}
        <g transform={`translate(${lx} 640) rotate(${rot}) scale(${scale})`}>
          {[0, 120, 240].map((a, i) => <path key={a} transform={`rotate(${a})`} d={PETAL} fill="none" stroke={RIB} strokeWidth={46 / scale} strokeLinecap="round" strokeDasharray={PETAL_LEN} strokeDashoffset={PETAL_LEN * (1 - clamp(draw * 3 - i))} />)}
        </g>
        {/* 交叠处染青 */}
        {s > 33.5 && <g clipPath="url(#llc-ring)" opacity={ringO}><g transform={`translate(${lx} 640) rotate(${rot}) scale(${scale})`}>{[0, 120, 240].map((a) => <path key={a} transform={`rotate(${a})`} d={PETAL} fill="none" stroke={TEAL} strokeWidth={48 / scale} />)}</g></g>}
        {s > 33.48 && <circle cx={lx + 2} cy={ringCy} r={ringR} fill="none" stroke={TEAL} strokeWidth={ringW} opacity={ringO} />}
        {s > 33.5 && <path d={`M ${lx - 210} ${ringCy - 26} L ${lx - 172} ${ringCy} L ${lx - 210} ${ringCy + 26} Q ${lx - 200} ${ringCy} ${lx - 210} ${ringCy - 26} Z`} fill={TEAL} opacity={eo((s - 33.5) / 0.15)} />}
        {/* 面板 */}
        <g clipPath="url(#llc-panel)">
          <rect x={panelX} y={0} width={1920} height={1080} fill={TEAL} />
          {s < 36.25 && p1 > 0 && <g transform={`translate(${LX} ${LY + 640 * (1 - squash1) * 0.5}) scale(${LS} ${LS * Math.max(0.02, squash1)})`}><Letter strokes={ZHONG} prog={p1} color={LET} /></g>}
          {showSecond && <g transform={`translate(${LX + 20} ${276 + 468 * (1 - grow2)}) scale(0.95 ${0.73 * Math.max(0.02, grow2)})`}><Letter strokes={ZI} prog={1} color={LET} /></g>}
          {/* 构造圆里那块字染深：同一字形再画一遍，裁到圆里 */}
          <g clipPath="url(#llc-c)">
            {s < 36.25 && p1 > 0 && <g transform={`translate(${LX} ${LY + 640 * (1 - squash1) * 0.5}) scale(${LS} ${LS * Math.max(0.02, squash1)})`}><Letter strokes={ZHONG} prog={p1} color={DEEP} /></g>}
            {showSecond && <g transform={`translate(${LX + 20} ${276 + 468 * (1 - grow2)}) scale(0.95 ${0.73 * Math.max(0.02, grow2)})`}><Letter strokes={ZI} prog={1} color={DEEP} /></g>}
          </g>
          {cR > 1 && <circle cx={cX} cy={cY} r={cR} fill="none" stroke={DEEP} strokeWidth={2} />}
          {s > 34.62 && (showSecond
            ? <path d={`M ${cX - 26} ${cY + cR + 66} L ${cX} ${cY + cR + 30} L ${cX + 26} ${cY + cR + 66} Z`} fill={DEEP} opacity={eo((s - 36.4) / 0.12)} />
            : <path d={`M ${cX - 26} ${cY - cR - 66} L ${cX} ${cY - cR - 30} L ${cX + 26} ${cY - cR - 66} Z`} fill={DEEP} opacity={eo((s - 34.7) / 0.12) * squash1} />)}
        </g>
      </svg>
      {out > 0 && <div style={{position: 'absolute', left: 960 - 960 * out, top: 0, width: 1920 * out, height: 1080, background: '#d5ffed'}} />}
      <div style={{position: 'absolute', right: 36, bottom: 26, fontFamily: SANS, fontSize: 20, color: 'rgba(150,200,175,0.5)', letterSpacing: '0.06em'}}>{x.note}</div>
    </AbsoluteFill>
  );
};

if (checkContract(LOGO_LETTER_CONTRACT).length) throw new Error(checkContract(LOGO_LETTER_CONTRACT).join('；'));
export const LogoDrawLetterConstruct: React.FC = () => <LogoDrawLetterConstructGroup />;
