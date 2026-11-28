// 【镜头组】type-glow-list：画面从下往上滑上来一行正在打字的大黑字「规划更省心。」（蓝色光标）→ 字缩小、变灰、淡掉 →
//   「出行更尽兴。」一个字一个字糊着冒出来，渐变彩字（蓝紫 → 粉 → 橙慢慢流动）带一圈柔光，越来越小、淡掉 →
//   灰色小标题「根据你最近的出行」+ 两行推荐（圆形图标 + 地点 + 一句说明）从左往右"由糊变清"地显出来，整体轻轻上浮、最后加速往上滑走（021-J 一拍，口号 + 推荐）
// 学的动作（mnowakdesign · Roamly 25.767–30.867s，30fps 逐帧量过；时间表 （内部拆片记录，未随项目提供））：
//   25.77–26.33 打字：字高 64px 不变，整行从 (478, 底 727) 一路减速滑到 (399, 底 389)（上一镜甩上去的那一下的后半段）；26.57 打句号；
//   26.70–27.03 以 (640,356) 为中心缩到 0.65、由黑变灰、淡掉；27.1–27.53 第二句逐字糊入（每字约 1 帧，入场 6 帧：糊 8px、放大 1.25、下沉 12px）；
//   27.53–28.53 渐变彩字从 485px 宽缩到 365px，颜色整体往左流（蓝 → 紫 → 粉 → 橙），28.53–28.8 淡掉；
//   28.6 起清单逐行"由糊变清"（擦除前沿每帧 18px，前沿前 100px 是糊的半透明字）：标题 28.6、第一行 28.73 / 28.87、第二行 29.0 / 29.07；
//   图标圆 28.8 / 29.0 起从点长到半径 78；29.1–30.87 清单镜头逐帧 ECC（track.ts，以 30.0s 为准）：先错落上浮、再加速上滑、带一点转。
// 我们的内容：两句口号 + 小周家的两个推荐目的地。
//
// 拍表（源秒 = 原片秒 − 25.767，30fps，共 153 帧）
//   拍 1 打字上滑         0.00–0.85    （停留点 0.867：句号打完、光标还在）
//   拍 2 缩灰 + 彩字糊入  0.883–1.883  （停留点 1.90：彩字刚站稳）
//   拍 3 彩字缩淡 + 清单  1.917–4.083  （停留点 4.10：清单全部显出、上滑之前）
//   拍 4 上滑走           4.117–5.10
// 毛病清单：
//   - 通用：画面永远不停（停留时整体极慢推近）；--hq 渲染；确定性
//   - 独有 1：打字时整行在动（接上一镜的滑动），不是原地打字
//   - 独有 2：彩字是渐变在字里"流动"，外面有一圈同色柔光；清单是"由糊变清"的擦除，不是淡入
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {FONT, Grain} from '../../../assets/lib/helpers/polish';
import {GroupContract, checkContract, checkInputs, outputDuration, planExtras, toSource} from '../../../assets/lib/helpers/groupClock';
import {J_AFF, J_F0} from './track';

const FPS = 30;
const SANS = `"PingFang SC", "Noto Sans CJK SC", "Noto Sans SC", ${FONT.sans}`;
const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const mix = (a: number, b: number, k: number) => a + (b - a) * k;
const kfl = (t: number, K: number[][]) => { if (t <= K[0][0]) return K[0][1]; for (let i = 0; i < K.length - 1; i++) if (t <= K[i + 1][0]) return mix(K[i][1], K[i + 1][1], (t - K[i][0]) / (K[i + 1][0] - K[i][0])); return K[K.length - 1][1]; };
const easeOut = (x: number) => 1 - Math.pow(1 - clamp(x), 3);
const T0 = 773 / 30;

export const TYPE_GLOW_LIST_CONTRACT: GroupContract = {
  sourceDuration: 153 / 30,
  fps: 30,
  motion: [[0, 0.85], [0.883, 1.883], [1.917, 4.083], [4.117, 153 / 30]],
  holds: [{at: 0.867, maxExtra: 0.8}, {at: 1.9, maxExtra: 0.8}, {at: 4.1, maxExtra: 1.2}],
  landmarks: {type: 0, period: 0.8, shrink: 0.9, glow: 1.33, list: 2.83, row1: 2.97, row2: 3.23, scroll: 4.5, exit: 153 / 30},
  sfx: [
    {at: 'type', type: '键盘', note: '键盘 tick 一串', tail: 0.8, volume: 0.3},
    {at: 'glow', type: '闪光', note: '柔和 shimmer / 合成 pad 上扬', tail: 1.2, volume: 0.35},
    {at: 'list', type: '弹出', note: '轻 pop × 2（图标冒出）', tail: 0.5, volume: 0.3},
    {at: 'scroll', type: '短甩', note: 'swipe', tail: 0.4, volume: 0.3},
  ],
  inputs: {line1: {maxChars: 7}, line2: {maxChars: 7}, header: {maxChars: 10}, title1: {maxChars: 9}, sub1: {maxChars: 13}, title2: {maxChars: 9}, sub2: {maxChars: 13}},
};

export type GlowListInputs = {line1: string; line2: string; header: string; title1: string; sub1: string; title2: string; sub2: string};
export const GLOW_LIST_DEFAULT_INPUTS: GlowListInputs = {line1: '规划更省心。', line2: '出行更尽兴。', header: '根据你最近的出行', title1: '杭州 · 西湖', sub1: '适合散步、美食和博物馆', title2: '青岛 · 海边', sub2: '适合海鲜、老街和看海'};
export const checkGlowListInputs = (x: GlowListInputs) => checkInputs(TYPE_GLOW_LIST_CONTRACT, x);
export const planGlowList = (sec: number) => planExtras(TYPE_GLOW_LIST_CONTRACT, sec);
export const glowListFrames = (extras: number[]) => Math.round(outputDuration(TYPE_GLOW_LIST_CONTRACT, extras) * FPS);
export const TYPE_GLOW_LIST_DURATION = 153;

// ---- 拍 1：打字（帧号 → 行左边 x、基线 y）----
const TYPE_POS = [[773, 478, 727], [774, 467, 670], [775, 458, 629], [776, 450, 594], [777, 443, 563], [778, 437, 536], [779, 431, 513], [780, 426, 490], [781, 421, 471], [782, 416, 454], [783, 413, 438], [784, 409, 425], [785, 407, 415], [786, 404, 406], [787, 402, 400], [788, 401, 395], [789, 399, 392], [790, 399, 390], [791, 399, 389], [794, 402, 389], [800, 407, 388]];
// 原片 13 个字母的出现帧，按比例分给我们的字
const KEYS = [773, 775, 776, 777, 780, 781, 783, 784, 786, 787, 789, 791, 797];
// 缩小（以宽度量）：帧号 → 比例
const SHRINK1 = [[800, 1], [802, 0.973], [803, 0.948], [804, 0.919], [805, 0.883], [806, 0.844], [807, 0.804], [808, 0.758], [809, 0.727], [810, 0.688], [811, 0.65], [813, 0.6]];
const GRAY1 = [[805, 17], [806, 58], [807, 85], [808, 119], [809, 153], [810, 170], [811, 187], [813, 200]];
// ---- 拍 2：彩字（帧号 → 比例、中心 y、不透明度、颜色流动位置）----
const SHRINK2 = [[826, 1.02], [830, 1], [834, 0.963], [838, 0.926], [842, 0.901], [846, 0.868], [850, 0.831], [854, 0.781], [858, 0.72], [864, 0.62], [870, 0.55]];
const CY2 = [[826, 362], [830, 359], [840, 355], [850, 351], [864, 350]];
const OP2 = [[853, 1], [857, 0.8], [860, 0.52], [863, 0.27], [866, 0.1], [870, 0]];
const FLOW = [[812, 0], [826, 0.1], [838, 0.4], [846, 0.62], [858, 1], [864, 1.05]]; // 0 = 紫蓝青，1 = 橙粉紫

// ---- 拍 3：清单（帧 900 的排版坐标）----
const SPEED = 18; // 擦除前沿每帧 px

// 由糊变清（照原片 28.6–29.6s 逐帧看）：前沿后面约 100px 是渐渐变清的过渡，前沿前面 ~170px 是很糊、很淡的字；
// 字刚出来是灰的，约 0.7 秒才变到最终颜色（标题从灰慢慢变黑）
const Reveal: React.FC<{x: number; top: number; fs: number; color: number[]; weight: number; text: string; front: number; age: number; ls?: number}> = ({x, top, fs, color, weight, text, front, age, ls = 0}) => {
  if (front <= -10) return null;
  const ck0 = clamp(age / 22), ck = ck0 * ck0 * (3 - 2 * ck0); // 约 0.7 秒从灰慢慢变到最终颜色
  const col = `rgb(${color.map((v) => Math.round(mix(168, v, ck))).join(',')})`;
  const st: React.CSSProperties = {position: 'absolute', left: x, top, fontSize: fs, lineHeight: 1, fontWeight: weight, color: col, whiteSpace: 'nowrap', letterSpacing: ls};
  const sharp = `linear-gradient(90deg, black 0px, black ${front - 110}px, transparent ${front - 10}px)`;
  const mid = `linear-gradient(90deg, transparent ${front - 120}px, black ${front - 50}px, black ${front - 10}px, transparent ${front + 50}px)`;
  const far = `linear-gradient(90deg, transparent ${front - 40}px, black ${front + 20}px, black ${front + 80}px, transparent ${front + 170}px)`;
  return (
    <>
      <div style={{...st, WebkitMaskImage: sharp, maskImage: sharp}}>{text}</div>
      <div style={{...st, filter: 'blur(2.5px)', opacity: 0.75, WebkitMaskImage: mid, maskImage: mid}}>{text}</div>
      <div style={{...st, filter: 'blur(7px)', opacity: 0.4, WebkitMaskImage: far, maskImage: far}}>{text}</div>
    </>
  );
};

const Museum: React.FC<{c: string}> = ({c}) => (
  <svg width={64} height={64} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3.5 9.2 12 4.5l8.5 4.7z" fill={c} fillOpacity={0.12} /><circle cx="12" cy="7.6" r="0.9" fill={c} stroke="none" />
    <path d="M4.5 9.5h15M6.5 11.5v6M10 11.5v6M14 11.5v6M17.5 11.5v6M4 19.5h16" />
  </svg>
);
const Dining: React.FC<{c: string}> = ({c}) => (
  <svg width={64} height={64} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx="8.2" cy="8" rx="3.2" ry="3.9" /><path d="M8.2 11.9v7.6" /><path d="M14 4.5v4.5a2.4 2.4 0 0 0 4.8 0V4.5M16.4 4.5v15" />
  </svg>
);

// 图标（照原片 28.8–29.6s）：先是几颗彩色小点往中间聚（0–6 帧）→ 圆底在半径 44 处淡出来、一路长到 78（4–26 帧）→ 图形由糊变清、跟着圆一起变大
const DOTS = [[-26, -8], [-12, -20], [10, -14], [22, 4], [-4, 14], [16, 18], [-20, 10]];
const IconBubble: React.FC<{cx: number; cy: number; a: number; fill: string; ring: string; c: string; children: React.ReactNode}> = ({cx, cy, a, fill, ring, c, children}) => {
  if (a <= 0) return null;
  const dotK = clamp(a / 6), dotOut = 1 - clamp((a - 5) / 4);
  const ca = a - 4;
  const r = ca > 0 ? mix(44, 78, easeOut(ca / 22)) : 0;
  const fillO = clamp(ca / 7), ringO = clamp((ca - 2) / 8);
  const gO = clamp((a - 5) / 7);
  const sc = ca > 0 ? r / 78 : 0.56;
  return (
    <>
      {ca > 0 && <div style={{position: 'absolute', left: cx - r, top: cy - r, width: 2 * r, height: 2 * r, borderRadius: r, background: fill, opacity: fillO, boxShadow: `inset 0 0 0 3.5px ${ring.replace('0.85', String(0.85 * ringO))}, 0 0 6px ${ring.replace('0.85', String(0.5 * ringO))}`}} />}
      {dotOut > 0 && DOTS.map(([dx, dy], i) => <div key={i} style={{position: 'absolute', left: cx + dx * mix(0.9, 0.45, dotK) - 3, top: cy + dy * mix(0.9, 0.45, dotK) - 1.2, width: 6, height: 2.6, borderRadius: 1.3, transform: `rotate(${(i * 47) % 90}deg)`, background: c, opacity: dotOut * clamp(a * 2)}} />)}
      {gO > 0 && <div style={{position: 'absolute', left: cx - 32, top: cy - 32, transform: `scale(${sc})`, opacity: gO, filter: gO < 0.95 ? `blur(${(1 - gO) * 3}px)` : undefined}}>{children}</div>}
    </>
  );
};

export const TypeGlowListGroup: React.FC<{inputs?: GlowListInputs; extras?: number[]}> = ({inputs = GLOW_LIST_DEFAULT_INPUTS, extras = [0, 0, 0]}) => {
  const t = useCurrentFrame() / FPS;
  const s = toSource(t, TYPE_GLOW_LIST_CONTRACT, extras) + T0;
  const lag = t - (s - T0);
  const f = s * 30;
  const cam = 1 + 0.004 * lag;

  // 拍 1
  const chars1 = Array.from(inputs.line1);
  const nKeys = chars1.length;
  const shown1 = chars1.filter((_, i) => f >= KEYS[Math.round((i * (KEYS.length - 1)) / Math.max(1, nKeys - 1))]).length;
  const x1 = kfl(f, TYPE_POS.map((p) => [p[0], p[1]])), b1 = kfl(f, TYPE_POS.map((p) => [p[0], p[2]]));
  const sc1 = kfl(f, SHRINK1), g1 = kfl(f, GRAY1);
  const op1 = 1 - clamp((f - 811) / 2);
  const W1 = 80 * nKeys;
  const cx1 = x1 + W1 / 2;

  // 拍 2
  const chars2 = Array.from(inputs.line2);
  const sc2 = kfl(f, SHRINK2), cy2 = kfl(f, CY2), op2 = kfl(f, OP2), flow = kfl(f, FLOW);
  const W2 = 82 * chars2.length;
  // 渐变图宽 = 字宽 × 1.8，从左到右 橙 → 粉 → 品红 → 淡紫 → 青 → 蓝；flow 0 露出右边一段（品红 → 蓝，原片 27.5s），0.5 露出中间（粉 → 青），1 露出左边（橙 → 紫，原片 28.5s）
  const grad = `linear-gradient(90deg, #ff982c 0%, #ff6a9c 25%, #d46cf0 45%, #a8a8f6 62%, #3fd2f2 80%, #5a62ef 100%)`;

  // 拍 3 镜头
  const ai = clamp(f - J_F0, 0, J_AFF.length - 1), a0 = Math.floor(ai), a1 = Math.min(J_AFF.length - 1, a0 + 1);
  const A = J_AFF[a0].map((v, j) => mix(v, J_AFF[a1][j], ai - a0));
  // 900 之前：清单错落上浮（逐帧量的第一行 / 第二行标题位置；ECC 在显现阶段低估了位移）
  const early = f < 900;
  const R1 = kfl(f, [[858, 140], [866, 115], [873, 90], [879, 69], [885, 51], [891, 33], [897, 12], [900, 0]]);
  const K1 = kfl(f, [[858, 0.12], [873, 0.09], [882, 0.066], [888, 0.04], [894, 0.016], [900, 0]]);
  const stagger = A[3] - A[0];
  const listOn = f >= 857;
  const front = (start: number) => SPEED * (f - start);
  const row = (y: number) => ({transform: `translateY(${early ? R1 + K1 * (y - 270) : stagger * y}px)`});

  return (
    <AbsoluteFill style={{background: '#fff', overflow: 'hidden', fontFamily: SANS}}>
      <div style={{position: 'absolute', inset: 0, transform: `scale(${cam})`, transformOrigin: '960px 540px'}}>
        <div style={{position: 'absolute', left: 0, top: 0, width: 1280, height: 720, transform: 'scale(1.5)', transformOrigin: '0 0'}}>
          {/* 拍 1：打字 */}
          {op1 > 0 && (
            <div style={{position: 'absolute', left: 0, top: 0, width: 1280, height: 720, transform: `scale(${sc1})`, transformOrigin: `${cx1}px ${b1 - 32}px`, opacity: op1}}>
              <div style={{position: 'absolute', left: x1, top: b1 - 75, fontSize: 80, lineHeight: 1, fontWeight: 700, letterSpacing: -1, color: `rgb(${g1},${g1},${g1 + 2})`, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center'}}>
                <span>{chars1.slice(0, shown1).join('')}</span>
                <span style={{display: 'inline-block', width: 9, height: 105, marginLeft: 12, background: '#2a17ee', opacity: f < 805.5 ? 1 : 0.25 * (1 - clamp(f - 806)), transform: 'translateY(4px)'}} />
              </div>
            </div>
          )}
          {/* 拍 2：彩字 + 柔光 */}
          {f >= 812 && op2 > 0 && (
            <div style={{position: 'absolute', left: 0, top: 0, width: 1280, height: 720, transform: `scale(${sc2})`, transformOrigin: `640px ${cy2}px`, opacity: op2}}>
              <div style={{position: 'absolute', left: 640 - 460, top: cy2 - 170, width: 920, height: 340, borderRadius: '50%', background: 'radial-gradient(ellipse at center, rgba(150,150,235,0.16), rgba(170,170,240,0.07) 45%, rgba(255,255,255,0) 72%)'}} />
              <div style={{position: 'absolute', left: 640 - W2 / 2, top: cy2 - 41, fontSize: 82, lineHeight: 1, fontWeight: 700, letterSpacing: -1, whiteSpace: 'nowrap', display: 'flex'}}>
                {chars2.map((ch, i) => {
                  const st = 813 + i * (13 / Math.max(1, chars2.length - 1));
                  const k = clamp((f - st) / 6);
                  if (k <= 0) return <span key={i} style={{width: 82}} />;
                  const e = easeOut(k);
                  const g: React.CSSProperties = {backgroundImage: grad, backgroundSize: `${W2 * 1.8}px 100%`, backgroundPosition: `${-i * 82 + mix(-W2 * 0.8, 0, flow)}px 0`, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent'};
                  return (
                    <span key={i} style={{position: 'relative', display: 'inline-block', width: 82, transform: `translateY(${12 * (1 - e)}px) scale(${mix(1.25, 1, e)})`, filter: `blur(${8 * (1 - e) + 0.6}px)`, opacity: mix(0.2, 1, e)}}>
                      <span style={{...g, position: 'absolute', left: 0, top: 0, filter: 'blur(22px)', opacity: 0.95, transform: 'scale(1.15)'}}>{ch}</span>
                      <span style={{...g, position: 'relative'}}>{ch}</span>
                    </span>
                  );
                })}
              </div>
            </div>
          )}
          {/* 彩字退场后留下的一大团淡灰紫雾，原片一直拖到清单显完（28.5–29.9s） */}
          {f > 850 && f < 898 && <div style={{position: 'absolute', left: 620 - 380, top: 400 - 190, width: 760, height: 380, borderRadius: '50%', background: 'radial-gradient(ellipse at center, rgba(160,160,200,0.10), rgba(175,175,215,0.05) 45%, rgba(255,255,255,0) 72%)', opacity: kfl(f, [[850, 0], [858, 1], [872, 0.8], [886, 0.4], [898, 0]])}} />}
          {/* 拍 3：清单 */}
          {listOn && (
            <div style={{position: 'absolute', left: 0, top: 0, width: 1280, height: 720, transformOrigin: '0 0', transform: early ? `translate(${A[4]}px, 0px)` : `matrix(${A[0]},${A[1]},${A[2]},${A[0]},${A[4]},${A[5]})`}}>
              <div style={row(80)}><Reveal x={125} top={60} fs={40} weight={500} color={[140, 141, 153]} text={inputs.header} front={front(858)} age={f - 858} /></div>
              <div style={row(270)}>
                <IconBubble cx={204} cy={270} a={f - 864} fill="#fff2ec" ring="rgba(245,175,135,0.85)" c="#e5401c"><Museum c="#e5401c" /></IconBubble>
                <Reveal x={332} top={200} fs={52} weight={600} color={[18, 19, 24]} text={inputs.title1} front={front(862)} age={f - 862} />
                <Reveal x={332} top={293} fs={44} weight={500} color={[143, 144, 156]} text={inputs.sub1} front={front(866)} age={f - 866} />
              </div>
              <div style={row(528)}>
                <IconBubble cx={204} cy={528} a={f - 870} fill="#f6edfe" ring="rgba(215,160,245,0.85)" c="#8a1fe0"><Dining c="#8a1fe0" /></IconBubble>
                <Reveal x={332} top={458} fs={52} weight={600} color={[18, 19, 24]} text={inputs.title2} front={front(870)} age={f - 870} />
                <Reveal x={332} top={551} fs={44} weight={500} color={[143, 144, 156]} text={inputs.sub2} front={front(872)} age={f - 872} />
              </div>
            </div>
          )}
        </div>
      </div>
      <Grain opacity={0.02} blend="multiply" />
    </AbsoluteFill>
  );
};

if (checkContract(TYPE_GLOW_LIST_CONTRACT).length) throw new Error(checkContract(TYPE_GLOW_LIST_CONTRACT).join('；'));
export const TypeGlowList: React.FC = () => <TypeGlowListGroup />;
