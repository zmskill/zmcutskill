// 【镜头组】icon-word-tint：白底上打出一个短词 → 换成一整句、光标逐字打完，四周四个线条小图标（伞、博物馆、小旗、餐具）一个个弹出来 →
//   句子前半截往左甩走、变虚，只留最后一个词，挪到正中变大 → 图标一个接一个飞进这个词，每飞进一个，词就换成那个图标的颜色 → 淡出（021-F 一拍，枚举收束）
// 学的动作（mnowakdesign · Roamly 16.133–19.80s，30fps 逐帧量过；时间表 （内部拆片记录，未随项目提供））：
//   第一个词 16.27–16.73 逐字打（左沿 482）；16.87 新句从 x=352 开始打，旧词往右淡掉；新句 18.13 打完（352–889，字号约 60）；
//   图标 17.2 / 17.33 / 17.73 / 17.93 依次弹出（先虚后实、带一点转，各自斜着）；16.13–18.33 字所在平面逐帧 ECC（track.ts）：起手斜 -7°、从下面滑上来、慢慢摆正；18.47 起前半句往左甩出、越甩越虚（左沿 332 → 280 → 177 → 0）；
//   19.0 最后一个词居中放大，18.93 / 19.12 / 19.25 / 19.37 图标飞进去（起飞前 0.2s 才往中间靠、变大）、词依次变 蓝 / 红 / 绿 / 紫；19.6–19.8 变浅淡出。
// 我们的内容："一个地方" → "安排每一次出行。"，最后留下"出行。"
//
// 拍表（源秒 = 原片秒 − 16.133，30fps，共 110 帧）
//   拍 1 第一个词     0.00–0.65   （停留点 0.68）
//   拍 2 整句 + 图标  0.73–2.10   （停留点 2.20）
//   拍 3 收成一个词   2.33–3.67   前半句甩走、图标飞进、变色、淡出
// 毛病清单：
//   - 通用：画面永远不停（停留时整体极慢推近）；--hq 渲染；确定性
//   - 独有 1：图标是"飞进字里"并把字染色，不是图标消失、字自己变色
//   - 独有 2：前半句是被甩走（横向位移 + 横向模糊），不是淡出
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {FONT, Grain} from '../../../assets/lib/helpers/polish';
import {GroupContract, checkContract, checkInputs, outputDuration, planExtras, toSource} from '../../../assets/lib/helpers/groupClock';
import {F_AFF, F_F0} from './track';

const FPS = 30;
const SANS = `"PingFang SC", "Noto Sans CJK SC", "Noto Sans SC", ${FONT.sans}`;
const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const mix = (a: number, b: number, k: number) => a + (b - a) * k;
const kfl = (t: number, K: number[][]) => { if (t <= K[0][0]) return K[0][1]; for (let i = 0; i < K.length - 1; i++) if (t <= K[i + 1][0]) return mix(K[i][1], K[i + 1][1], (t - K[i][0]) / (K[i + 1][0] - K[i][0])); return K[K.length - 1][1]; };
const eo = (t: number, a: number, b: number) => { const c = clamp((t - a) / (b - a)); return 1 - Math.pow(1 - c, 3); };
const T0 = 484 / 30;

export const ICON_WORD_TINT_CONTRACT: GroupContract = {
  sourceDuration: 110 / 30,
  fps: 30,
  motion: [[0, 0.65], [0.73, 2.1], [2.33, 110 / 30]],
  holds: [{at: 0.68, maxExtra: 1.0}, {at: 2.2, maxExtra: 1.5}],
  landmarks: {word: 0.13, line: 0.73, icon1: 1.07, icon4: 1.8, done: 2.0, sweep: 2.33, tint1: 2.87, tint4: 3.4, exit: 110 / 30},
  sfx: [
    {at: 'word', type: '键盘', note: '打字 tick', tail: 0.5, volume: 0.25},
    {at: 'line', type: '键盘', note: '打字 tick（一串）', tail: 1.2, volume: 0.25},
    {at: 'icon1', type: '弹出', note: '轻 pop × 4（图标弹出）', tail: 0.8, volume: 0.3},
    {at: 'sweep', type: '短甩', note: '快速 whoosh（前半句甩走）', volume: 0.3},
    {at: 'tint1', type: '弹出', note: '一串清脆 blip（图标飞进、变色）', tail: 0.6, volume: 0.3},
  ],
  inputs: {word: {maxChars: 4}, lead: {maxChars: 6}, last: {maxChars: 3}},
};

export type TintInputs = {word: string; lead: string; last: string};
export const TINT_DEFAULT_INPUTS: TintInputs = {word: '一个地方', lead: '安排每一次', last: '出行。'};
export const checkTintInputs = (x: TintInputs) => checkInputs(ICON_WORD_TINT_CONTRACT, x);
export const planTint = (sec: number) => planExtras(ICON_WORD_TINT_CONTRACT, sec);
export const tintFrames = (extras: number[]) => Math.round(outputDuration(ICON_WORD_TINT_CONTRACT, extras) * FPS);
export const ICON_WORD_TINT_DURATION = 110;

const FS = 68;
const CW = (s: string, fs = FS) => Array.from(s).reduce((a, c) => a + (/[\x00-\x7f]/.test(c) ? 0.56 : 1) * fs, 0);
// 图标：位置（720p）、弹出时刻、颜色、飞进时刻
const ICONS = [
  // tf：原片图标是斜着、带一点错切的（像贴在各自转了一下的小卡片上），逐个量的大致角度
  {k: 'umbrella', x: 137, y: 230, t: 17.2, c: '#1f6bff', fly: 18.83, tf: 'rotate(-28deg) skewX(-8deg)'},
  {k: 'museum', x: 457, y: 152, t: 17.33, c: '#e8431c', fly: 19.02, tf: 'rotate(-14deg) skewX(-16deg)'},
  {k: 'flag', x: 1030, y: 160, t: 17.73, c: '#18a85f', fly: 19.15, tf: 'rotate(10deg) skewX(12deg)'},
  {k: 'food', x: 1010, y: 555, t: 17.93, c: '#7a1fe0', fly: 19.27, tf: 'rotate(-16deg) skewX(6deg)'},
];
const Icon: React.FC<{k: string; c: string; s: number}> = ({k, c, s}) => {
  const p: Record<string, React.ReactNode> = {
    umbrella: <><path d="M4 12a8 8 0 0 1 16 0z" /><path d="M12 12v7a2 2 0 0 1-4 0" /><path d="M9 21h8" /></>,
    museum: <><path d="M3 9l9-5 9 5z" /><path d="M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 20h18" /></>,
    flag: <><path d="M6 21V4" /><path d="M6 4h11l-3 4 3 4H6" /><path d="M3 21l6-6 4 3 4-5 4 8z" /></>,
    food: <><path d="M6 4v7a2 2 0 0 0 4 0V4M8 11v9" /><path d="M16 4c-2 2-2 6 0 8v8" /><path d="M14 4a6 6 0 0 1 6 6" /></>,
  };
  return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={2.7} strokeLinecap="round" strokeLinejoin="round">{p[k]}</svg>;
};

export const IconWordTintGroup: React.FC<{inputs?: TintInputs; extras?: number[]}> = ({inputs = TINT_DEFAULT_INPUTS, extras = [0, 0]}) => {
  const t = useCurrentFrame() / FPS;
  const s = toSource(t, ICON_WORD_TINT_CONTRACT, extras) + T0;
  const lag = t - (s - T0);
  const cam = 1 + 0.004 * lag;
  const base = 393;
  // 镜头：字所在的平面（= 原片 18.33s 的画面）逐帧 ECC 仿射，起手斜 -7°、从下面滑上来，18.33 摆正（track.ts）
  const fi = clamp(s * 30 - F_F0, 0, F_AFF.length - 1), f0i = Math.floor(fi), f1i = Math.min(F_AFF.length - 1, f0i + 1);
  const A = F_AFF[f0i].map((v, j) => mix(v, F_AFF[f1i][j], fi - f0i));
  // 第一个词
  const w1 = Array.from(inputs.word);
  const n1 = s < 16.27 ? 0 : Math.min(w1.length, Math.floor(((s - 16.27) / 0.46) * w1.length) + 1);
  const word1Op = 1 - clamp((s - 16.87) / 0.26);
  const word1X = 482 + 40 * eo(s, 16.87, 17.13);
  // 整句
  const full = inputs.lead + inputs.last;
  const fch = Array.from(full);
  const nf = s < 16.87 ? 0 : Math.min(fch.length, Math.floor(((s - 16.87) / 1.26) * fch.length) + 1);
  const W = CW(full), X0 = 620 - W / 2; // 原片句子中心 620
  const leadW = CW(inputs.lead);
  const sweep = clamp((s - 18.47) / 0.5); // 前半句往左甩
  const sweepX = -Math.pow(sweep, 2.2) * 700;
  const lastStartX = X0 + leadW;
  // 最后一个词：19.0 起挪到正中、放大
  const cen = eo(s, 18.75, 19.0);
  const lastW = CW(inputs.last);
  const sc = mix(1, 1.25, cen) * (1 + 0.15 * clamp((s - 19.15) / 0.4));
  const lastX = mix(lastStartX, 640 - (lastW * sc) / 2, cen);
  let tint = '#111';
  for (const ic of ICONS) if (s >= ic.fly + 0.1) tint = ic.c;
  const fade = clamp((s - 19.6) / 0.2);
  const cursorX = s < 16.87 ? word1X + CW(w1.slice(0, n1).join('')) + 6 : X0 + CW(fch.slice(0, nf).join('')) + 6;
  const cursorOn = s > 16.27 && s < 18.3 && (Math.floor(s * 4) % 2 === 0 || (s > 16.27 && s < 16.75) || (s > 16.87 && s < 18.13));

  return (
    <AbsoluteFill style={{background: '#fff', overflow: 'hidden', fontFamily: SANS}}>
      <div style={{position: 'absolute', inset: 0, transform: `scale(${cam})`, transformOrigin: '960px 540px'}}>
        <div style={{position: 'absolute', left: 0, top: 0, width: 1280, height: 720, transform: 'scale(1.5)', transformOrigin: '0 0'}}>
          <div style={{position: 'absolute', left: 0, top: 0, width: 1280, height: 720, transformOrigin: '0 0', transform: `matrix(${A.join(',')})`}}>
          {/* 字所在平面上的淡辅助线（平面坐标：横线 y 314 / 402，竖线在两行字的左边） */}
          <svg width={1280} height={720} style={{position: 'absolute', overflow: 'visible', opacity: 0.85 * (1 - clamp((s - 18.2) / 0.4))}}>
            <g stroke="#e4e4ea" strokeWidth={1.2} strokeDasharray="5 3"><line x1={-400} y1={314} x2={1700} y2={314} /><line x1={-400} y1={402} x2={1700} y2={402} /><line x1={X0 - 4} y1={-300} x2={X0 - 4} y2={1000} /><line x1={478} y1={-300} x2={478} y2={1000} opacity={1 - clamp((s - 17.0) / 0.3)} /></g>
          </svg>
          {word1Op > 0 && <div style={{position: 'absolute', left: word1X, top: base - FS * 0.88, fontSize: FS, fontWeight: 600, letterSpacing: -1, color: '#111', whiteSpace: 'nowrap', opacity: word1Op, lineHeight: 1}}>{w1.slice(0, n1).join('')}</div>}
          {/* 前半句 */}
          {nf > 0 && sweep < 1 && (
            <div style={{position: 'absolute', left: X0 + sweepX, top: base - FS * 0.88, fontSize: FS, fontWeight: 600, letterSpacing: -1, color: '#111', whiteSpace: 'nowrap', lineHeight: 1, filter: sweep > 0.05 ? `blur(${sweep * 10}px)` : undefined, opacity: 1 - sweep * 0.6}}>{fch.slice(0, Math.min(nf, Array.from(inputs.lead).length)).join('')}</div>
          )}
          {/* 最后一个词 */}
          {nf > Array.from(inputs.lead).length && (
            <div style={{position: 'absolute', left: lastX, top: base - FS * sc * 0.88, fontSize: FS * sc, fontWeight: 600, letterSpacing: -1, color: tint, whiteSpace: 'nowrap', lineHeight: 1, opacity: 1 - fade * 0.9, filter: fade > 0.05 ? `blur(${fade * 4}px)` : undefined}}>{fch.slice(Array.from(inputs.lead).length, nf).join('')}</div>
          )}
          {cursorOn && <div style={{position: 'absolute', left: cursorX, top: base - FS * 0.95, width: 4, height: FS * 1.15, background: '#1a10ee'}} />}
          {/* 图标：弹出 → 飘 → 飞进最后一个词 */}
          {ICONS.map((ic, i) => {
            if (s < ic.t) return null;
            const pop = eo(s, ic.t, ic.t + 0.25);
            const fly = clamp((s - ic.fly) / 0.17);
            if (fly >= 1) return null;
            const tx = 640, ty = base - 30;
            const inward = eo(s, ic.fly - 0.2, ic.fly) * 0.35; // 原片每个图标起飞前 0.2s 才开始往中间靠、变大，之前一直待在原处
            const fx = mix(ic.x, 640, inward) + Math.sin(s * 1.6 + i) * 4, fy = mix(ic.y, base - 30, inward) + Math.cos(s * 1.3 + i * 2) * 4;
            const x = mix(fx, tx, fly * fly), y = mix(fy, ty, fly * fly);
            const sz = 84 * (0.6 + 0.4 * pop) * (1 + 0.6 * eo(s, ic.fly - 0.2, ic.fly) + 0.6 * fly);
            return <div key={i} style={{position: 'absolute', left: x - sz / 2, top: y - sz / 2, opacity: pop * (1 - fly * 0.3), transform: `rotate(${(1 - pop) * -40}deg) ${ic.tf}`, filter: pop < 0.95 || fly > 0.05 ? `blur(${(1 - pop) * 4 + fly * 5}px)` : undefined}}><Icon k={ic.k} c={ic.c} s={sz} /></div>;
          })}
          </div>
        </div>
      </div>
      <Grain opacity={0.02} blend="multiply" />
    </AbsoluteFill>
  );
};

if (checkContract(ICON_WORD_TINT_CONTRACT).length) throw new Error(checkContract(ICON_WORD_TINT_CONTRACT).join('；'));
export const IconWordTint: React.FC = () => <IconWordTintGroup />;
