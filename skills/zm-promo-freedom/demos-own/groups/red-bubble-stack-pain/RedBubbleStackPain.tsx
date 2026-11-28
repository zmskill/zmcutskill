// 【镜头组】red-bubble-stack-pain：黑底暗红光，一句小字一个词一个词落出来 → 一串红色聊天气泡左右交错地一个个弹出来、带着未读数，
//   然后整串猛地往上甩、慢慢刹住，大字一句句压在气泡上面（逐词出、逐词收）→ 气泡往下甩出画 → 最后一句大字单独留在黑底上（038-A 一串，痛点铺垫）
// 学的动作（NoorMalik · Teamflow 2.8–11.15s，30fps 逐帧量过，2026-11-21）：
//   2.7「but」→ 2.9「too」→ 2.9–3.1「often」从右下灰着进来，3.1 排成一行（y≈513，字号 ≈80），4.1 收掉
//   4.2 第一个气泡在右边 (1012,553)-(1493,675) 弹出来，右上带一个未读数「0+」（后面跳成「6+」、带个心形），之后每 0.12s 往下左右交错再弹一个
//       （右排 x≈964–1544，左排 x≈505–1069，行距 ≈240，气泡是左暗中亮右暗的红色渐变、里面两条白线，尾巴朝下）
//   5.25–6.2 整串往上猛甩（相位相关量到每帧 200px 以上）→ 6.2 停住；6.65–7.65 再往上慢慢走 ≈320px、刹住；7.7–8.3 微微往下漂；
//   8.3 起往下加速、9.1 起甩出画、9.4 没了
//   大字压在气泡上面：5.7「beyond / the / conversation」灰着逐词出、6.1 变白（y≈580，字号 ≈110），7.0 逐词收；
//   7.3「buried in / chats」（y≈513），9.4 逐词收；9.6「scattered / across / documents」一个比一个低地出来再排成一行，留到 11.15（接 038-B 的像素闪）
//   第二轮（用户：不如原片丝滑、过渡）：光流对比后改成"快起步、长尾巴刹车"的不对称甩动（5.05 起步、5.6 速度峰、拖到 6.9 才停），慢走一段接上去不断档；
//   往下甩是越甩越快、最后三帧整串飞出画（9.4 只剩最底一个），不再淡出；甩动时加一点只往纵向糊的运动模糊；大字逐词"从右下滑进来、0.5s 长缓出"（原片的出字方式）
//   第三轮（用户：原片像鼠标滚轮一样滚，非常丝滑）：整串的速度改成连续曲线积分（猛甩 → 慢慢减速但不停 → 慢慢反向往下 → 越滚越快甩出），中途不再停死；
//   原片整块列表略往后仰（下面的气泡比上面的稍宽），加 rotateX 7°；去掉运动模糊
// 我们的内容：「但很多时候」→「游离在对话之外」→「淹没在聊天里」→「散落在各种文档里」，右下角标"虚构 · 仅作演示"。
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {GroupContract, checkContract, checkInputs, outputDuration, planExtras, toSource} from '../../../assets/lib/helpers/groupClock';
import {GlowSpot} from '../_kit/light';

const FPS = 30;
const S0 = 2.8;
const SANS = '"PingFang SC","Noto Sans CJK SC","Noto Sans SC",sans-serif';
const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const eo = (u: number) => 1 - Math.pow(1 - clamp(u), 3);
const eo5 = (u: number) => 1 - Math.pow(1 - clamp(u), 5);
const eio = (u: number) => { const x = clamp(u); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
const kf = (t: number, K: number[][], e: (u: number) => number = eio) => {
  if (t <= K[0][0]) return K[0][1];
  for (let i = 1; i < K.length; i++) if (t <= K[i][0]) { const [a, va] = K[i - 1], [b, vb] = K[i]; return va + (vb - va) * e((t - a) / (b - a)); }
  return K[K.length - 1][1];
};
// 第三轮：整串像鼠标滚轮那样一直在滚——速度连续变化、中途不停死（原片 5.2–9.4 光流一直不归零）。
// 速度关键帧（px/s，负数往上），相邻两点用 smoothstep 过渡，位置是速度的积分
const VK = [[5.0, 0], [5.6, -6100], [5.9, -5500], [6.1, -3500], [6.3, -1500], [6.6, -700], [7.0, -400], [7.4, -300], [7.7, -120], [8.0, 40], [8.6, 60], [9.0, 900], [9.13, 4000], [9.39, 36000]]; // 原片光流：高速段一直持续到 6.1，6.5 才慢下来
const vAt = (t: number) => {
  if (t <= VK[0][0]) return 0;
  for (let i = 1; i < VK.length; i++) if (t <= VK[i][0]) { const [a, va] = VK[i - 1], [b, vb] = VK[i]; let u = (t - a) / (b - a); u = u * u * (3 - 2 * u); return va + (vb - va) * u; }
  return VK[VK.length - 1][1];
};
const scrollPos = (t: number) => { let x = 0; const dt = 1 / 600; for (let q = 5.0; q < t; q += dt) x += vAt(q) * Math.min(dt, t - q); return x; };
export const RED_BUBBLE_STACK_CONTRACT: GroupContract = {
  sourceDuration: 250 / 30,
  fps: 30,
  motion: [[0, 1.3], [1.4, 6.35], [6.5, 250 / 30]],
  holds: [{at: 1.35, maxExtra: 1.5}, {at: 6.42, maxExtra: 1.5}],
  landmarks: {small: 0, bubbles: 1.4, whip: 2.45, l1: 2.9, l2: 4.5, drop: 5.5, l3: 6.8, pixel: 8.27},
  sfx: [
    {at: 'small', type: '轻tick', note: '轻字 tick', volume: 0.25},
    {at: 'bubbles', type: '提示音', note: '消息提示音 一串', tail: 1.0, volume: 0.35},
    {at: 'whip', type: '短甩', note: '甩动 whoosh', volume: 0.45},
    {at: 'drop', type: '短甩', note: '甩动 whoosh', volume: 0.4},
    {at: 'pixel', type: '故障', note: '数码故障 glitch', volume: 0.4},
  ],
  inputs: {lines: {count: 4, maxChars: 9}},
};
export type RedBubbleInputs = {lines: string[][]; note: string};
export const RED_BUBBLE_DEFAULT_INPUTS: RedBubbleInputs = {lines: [['但', '很多', '时候'], ['游离在', '对话', '之外'], ['淹没在', '聊天里'], ['散落在', '各种', '文档里']], note: '虚构 · 仅作演示'};
export const checkRedBubbleInputs = (x: RedBubbleInputs) => checkInputs(RED_BUBBLE_STACK_CONTRACT, {});
export const planRedBubble = (sec: number) => planExtras(RED_BUBBLE_STACK_CONTRACT, sec);
export const redBubbleFrames = (extras: number[]) => Math.round(outputDuration(RED_BUBBLE_STACK_CONTRACT, extras) * FPS);
export const RED_BUBBLE_STACK_DURATION = 250;

const Bubble: React.FC<{right: boolean; badge?: string; heart?: boolean}> = ({right, badge, heart}) => (
  <div style={{position: 'relative', width: 570, height: 140}}>
    <div style={{position: 'absolute', inset: 0, borderRadius: 18, background: 'linear-gradient(90deg, #7a0008 0%, #d4000f 30%, #ff1a24 55%, #c8000e 80%, #6e0006 100%)', boxShadow: 'inset 0 2px 0 rgba(255,140,140,0.35), 0 10px 30px rgba(0,0,0,0.5)'}} />
    <div style={{position: 'absolute', left: right ? 60 : 430, top: 130, width: 0, height: 0, borderLeft: '22px solid transparent', borderRight: '22px solid transparent', borderTop: '30px solid #b8000c'}} />
    <div style={{position: 'absolute', left: 40, top: 40, width: 420, height: 14, borderRadius: 7, background: 'rgba(255,255,255,0.92)'}} />
    <div style={{position: 'absolute', left: 40, top: 80, width: 260, height: 14, borderRadius: 7, background: 'rgba(255,255,255,0.85)'}} />
    {badge && <div style={{position: 'absolute', right: -70, top: -18, display: 'flex', alignItems: 'center', gap: 8, fontFamily: SANS, fontSize: 30, color: '#fff'}}>{heart && <div style={{width: 40, height: 40, borderRadius: '50%', background: '#fff', color: '#c00', fontSize: 26, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>♥</div>}{badge}</div>}
  </div>
);

export const RedBubbleStackPainGroup: React.FC<{inputs?: RedBubbleInputs; extras?: number[]}> = ({inputs: x = RED_BUBBLE_DEFAULT_INPUTS, extras = [0, 0]}) => {
  const tt = useCurrentFrame() / FPS;
  const s = toSource(tt, RED_BUBBLE_STACK_CONTRACT, extras) + S0;
  const held = tt - (s - S0);
  const f = Math.round(tt * FPS);
  const hash = (n: number) => { const v = Math.sin(n * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };
  // 气泡整串的纵向位移（第二轮按光流重量：甩动是"快起步、长刹车"——0.42s 加速到每帧 ≈200px，再用 1.3s 拖着长尾巴慢慢刹住；9.0 起往下越甩越快，最后三帧整串飞出画，不是对称的缓入缓出）
  const off = scrollPos(s) - held * 8;
  const vel = 0;
  const blurV = 0; // 第三轮：原片是清楚的，不加运动模糊
  void vel;
  const badgeN = Math.min(9, Math.max(0, Math.floor((s - 4.3) * 6)));
  // 大字：一行行
  const L = x.lines;
  const line = (words: string[], t0: number, t1: number, y: number, fs: number, grey: boolean, stagger: number) => (
    <div style={{position: 'absolute', left: 0, right: 0, top: y, transform: 'translateY(-50%)', display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: fs * 0.22, fontFamily: SANS, fontSize: fs, fontWeight: 500, whiteSpace: 'nowrap', textShadow: '0 4px 24px rgba(0,0,0,0.6)'}}>
      {words.map((w, i) => {
        const a = eo5((s - t0 - i * 0.07) / 0.5), out = eo((s - t1 - i * 0.06) / 0.14);
        const c = grey ? Math.round(110 + 145 * clamp((s - t0 - 0.3) / 0.25)) : 255;
        return <span key={i} style={{display: 'inline-block', opacity: clamp(a * 2.2) * (1 - out), color: `rgb(${c},${c},${c})`, transform: `translate(${(1 - a) * fs * 0.5 * (i + 1)}px, ${(1 - a) * stagger * 1.6 * (i + 1) - out * 30}px)`, filter: a < 0.7 ? `blur(${(0.7 - a) * 8}px)` : undefined}}>{w}</span>;
      })}
    </div>
  );
  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      <svg width={0} height={0} style={{position: 'absolute'}}><defs><filter id="rbVBlur" x="-5%" y="-30%" width="110%" height="160%"><feGaussianBlur stdDeviation={`0 ${blurV.toFixed(1)}`} /></filter></defs></svg>
      <GlowSpot x={560} y={140} rx={900} ry={560} rgb="120,0,0" a={0.55} />
      <GlowSpot x={1500} y={900} rx={700} ry={420} rgb="70,0,0" a={0.25} />
      {s > 4.15 && (
        <div style={{position: 'absolute', inset: 0, transform: 'perspective(2200px) rotateX(7deg)', transformOrigin: '960px 540px', filter: blurV > 0.5 ? 'url(#rbVBlur)' : undefined}}>
          {Array.from({length: 30}, (_, i) => {
            const right = i % 2 === 0;
            const y = 553 + i * 240 + off;
            if (y < -300 || y > 1300) return null;
            const appear = i < 5 ? 4.2 + i * 0.18 : 0;
            const k = eo((s - appear) / 0.18);
            if (k <= 0) return null;
            const cx = right ? 1254 : 787;
            return <div key={i} style={{position: 'absolute', left: cx - 285, top: y, opacity: clamp(k * 2), transform: `scale(${0.7 + 0.3 * k}) translateX(${(1 - k) * (right ? 60 : -60)}px)`, transformOrigin: right ? '0% 100%' : '100% 100%'}}><Bubble right={right} badge={i === 0 ? `${badgeN}+` : undefined} heart={i === 0 && s > 4.8} /></div>;
          })}
        </div>
      )}
      {s < 4.15 && line(L[0], 2.7, 4.0, 513, 96, true, 26)}
      {s > 5.6 && s < 7.4 && line(L[1], 5.7, 6.95, 580, 140, true, 22)}
      {s > 7.15 && s < 9.7 && line(L[2], 7.2, 9.38, 513, 140, false, 22)}
      {s > 9.5 && line(L[3], 9.6, 99, 567, 124, false, 30)}
      {s > 11.05 && Array.from({length: 36}, (_, i) => {
        const on = hash(i * 5.3 + f * 1.9) > 0.55;
        return on ? <div key={i} style={{position: 'absolute', left: (i % 6) * 320, top: Math.floor(i / 6) * 180, width: 320, height: 180, background: ['#e8102a', '#ef4b5e', '#f58a98', '#f7c3ca', '#c9c4c6'][Math.floor(hash(i * 2.7 + f * 3.3) * 5)], opacity: 0.9}} /> : null;
      })}
      <div style={{position: 'absolute', right: 36, bottom: 26, fontFamily: SANS, fontSize: 20, color: 'rgba(255,220,220,0.4)', letterSpacing: '0.06em'}}>{x.note}</div>
    </AbsoluteFill>
  );
};

if (checkContract(RED_BUBBLE_STACK_CONTRACT).length) throw new Error(checkContract(RED_BUBBLE_STACK_CONTRACT).join('；'));
export const RedBubbleStackPain: React.FC = () => <RedBubbleStackPainGroup />;
