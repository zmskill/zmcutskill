// 【镜头组】connect-word-icon-reel：暗紫底，左边一个固定大词 + 下面一行小词轮换；右边一串紫色图标方块斜着排成转轮，
//   每次换词，整串沿斜线往左上转一格：下一个方块从右下角带着拖影长大到中间，当前这个缩小、压扁、淡进左上角（029-B 一拍，对象枚举）
// 学的动作（Rixlab · Nextel 8.2–13.2s，原片 1600×1200 带上下灰边，内容区 1600×900，按内容区量、放大到 1920×1080，2026-11-21）：
//   右下角还没转上来的那个方块很暗、看不清图标；方块位置是一条斜线上的“转轮位置”φ：φ=0 在中间（中心 1065,450，边长 370）；φ=-1 左上（770,120，256，只露下半、上沿淡掉）；φ=+1 右下（1385,740，256，只露上半、下沿淡掉）
//   中间几个点是 9.35–9.65 逐帧量的：φ -0.3 (982,355,304) / -0.6 (883,242,274) / -0.76 (833,195,266)；+0.14 (1125,510) / +0.24 (1151,540) / +0.4 (1202,597,356)
//   每次转一格 0.75s，先快后慢：0.1s 走 30%，0.2s 60%，0.3s 76%，0.4s 86%，0.55s 95%；转起来时两头的方块带拖影
//   转的时刻 8.15（开头已经在转）/ 9.25 / 10.55 / 11.75；12.82 起整串直着往上抬走（12.95 抬 45，13.05 抬 128，13.15 抬 225，逐帧量的星星方块上沿），右下那个跟着露出图标；小词在开转后 0.1–0.2s 换，新词先是灰的、0.3s 变白，同时从右边挪进来 24px
//   开头 8.2–8.6 整句从灰变白；13.2 切走
// 我们的内容：「连接」+ 家庭 / 企业 / 人与人 / 无限可能，图标自己画（人群、房子、公文包、人群、星星、省略号），右下角标"虚构 · 仅作演示"。
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {GroupContract, checkContract, checkInputs, outputDuration, planExtras, toSource} from '../../../assets/lib/helpers/groupClock';

const FPS = 30;
const S0 = 8.2;
const K = 1.2; // 内容区 1600×900 → 1920×1080
const SANS = '"Inter","PingFang SC","Noto Sans CJK SC","Noto Sans SC",sans-serif';
const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lin = (t: number, T: number[][], j: number) => {
  if (t <= T[0][0]) return T[0][j];
  for (let i = 1; i < T.length; i++) if (t <= T[i][0]) { const a = T[i - 1], b = T[i]; return a[j] + (b[j] - a[j]) * (t - a[0]) / (b[0] - a[0]); }
  return T[T.length - 1][j];
};
// φ → [x, y, 边长]（内容区坐标）
const PATH = [[-1.4, 690, 20, 230], [-1, 770, 120, 256], [-0.86, 805, 155, 262], [-0.76, 833, 195, 266], [-0.6, 883, 242, 274], [-0.3, 982, 355, 304], [0, 1065, 450, 370], [0.14, 1125, 510, 370], [0.24, 1151, 540, 370], [0.4, 1202, 597, 356], [0.7, 1300, 680, 332], [1, 1385, 740, 256], [1.4, 1470, 850, 220]];
const STEP = [[0, 0], [0.1, 0.3], [0.2, 0.6], [0.3, 0.76], [0.4, 0.86], [0.55, 0.95], [0.75, 1]];
const TS = [8.15, 9.25, 10.55, 11.75];
const liftOf = (s: number) => lin(s, [[12.82, 0], [12.85, 6], [12.9, 21], [12.95, 45], [13.0, 81], [13.05, 128], [13.1, 175], [13.15, 225], [13.2, 280]], 1); // 最后不是再转一格，是整串直着往上抬走（越抬越快）
const counter = (s: number) => TS.reduce((acc, t0) => acc + (s <= t0 ? 0 : lin(s - t0, STEP, 1)), 0); // 中间是第几个方块
const speed = (s: number) => (counter(s + 0.02) - counter(s - 0.02)) / 0.04;

export const CONNECT_REEL_CONTRACT: GroupContract = {
  sourceDuration: 150 / 30,
  fps: 30,
  motion: [[0, 0.75], [1.05, 1.85], [2.35, 3.15], [3.55, 4.35], [4.62, 5.0]],
  holds: [{at: 0.9, maxExtra: 1}, {at: 2.2, maxExtra: 1}, {at: 3.4, maxExtra: 1}, {at: 4.5, maxExtra: 1.5}],
  landmarks: {w1: 0, w2: 1.05, w3: 2.35, w4: 3.55, out: 4.62},
  sfx: [
    {at: 'w2', type: '轻tick', note: '转轮 tick', volume: 0.3},
    {at: 'w3', type: '轻tick', note: '转轮 tick', volume: 0.3},
    {at: 'w4', type: '轻tick', note: '转轮 tick', volume: 0.3},
    {at: 'out', type: '短甩', note: '甩动 whoosh', volume: 0.3},
  ],
  inputs: {lead: {maxChars: 4}, words: {count: 4, maxChars: 5}},
};
export type ConnectReelInputs = {lead: string; words: string[]; icons: string[]; note: string};
// icons：第 0 个是开头正在转走的上一个，1–4 对应 words，5 是最后露头的下一个
export const CONNECT_REEL_DEFAULT_INPUTS: ConnectReelInputs = {lead: '连接', words: ['家庭', '企业', '人与人', '无限可能'], icons: ['people', 'home', 'case', 'people', 'star', 'dots'], note: '虚构 · 仅作演示'};
export const checkConnectReelInputs = (x: ConnectReelInputs) => checkInputs(CONNECT_REEL_CONTRACT, {lead: x.lead, words: x.words});
export const planConnectReel = (sec: number) => planExtras(CONNECT_REEL_CONTRACT, sec);
export const connectReelFrames = (extras: number[]) => Math.round(outputDuration(CONNECT_REEL_CONTRACT, extras) * FPS);
export const CONNECT_REEL_DURATION = 150;

const Icon: React.FC<{k: string}> = ({k}) => {
  const W = '#fff';
  if (k === 'home') return <svg viewBox="0 0 100 100" width="58%" height="58%"><path d="M50 8 L94 46 L84 46 L84 92 L60 92 L60 64 Q60 54 50 54 Q40 54 40 64 L40 92 L16 92 L16 46 L6 46 Z" fill={W} /><rect x="45" y="64" width="10" height="28" rx="2" fill="#a41fc4" /></svg>;
  if (k === 'case') return <svg viewBox="0 0 100 100" width="62%" height="62%"><path d="M36 22 Q36 14 44 14 L56 14 Q64 14 64 22 L64 28 L58 28 L58 21 L42 21 L42 28 L36 28 Z" fill={W} /><rect x="8" y="28" width="84" height="62" rx="4" fill={W} /><path d="M8 42 Q50 66 92 42" stroke="#a41fc4" strokeWidth="4" fill="none" /><rect x="44" y="48" width="12" height="12" rx="1" fill="none" stroke="#a41fc4" strokeWidth="4" /></svg>;
  if (k === 'star') return <svg viewBox="0 0 100 100" width="62%" height="62%"><path d="M50 6 L62 37 L95 38 L69 59 L78 92 L50 73 L22 92 L31 59 L5 38 L38 37 Z" fill={W} strokeLinejoin="round" stroke={W} strokeWidth="5" /></svg>;
  if (k === 'dots') return <svg viewBox="0 0 100 100" width="58%" height="58%">{[22, 50, 78].map((c) => <circle key={c} cx={c} cy={50} r={11} fill={W} />)}</svg>;
  return <svg viewBox="0 0 100 100" width="66%" height="66%"><circle cx="30" cy="34" r="11" fill={W} /><circle cx="70" cy="34" r="11" fill={W} /><circle cx="50" cy="30" r="13" fill={W} /><path d="M10 74 Q10 52 30 52 Q42 52 46 60 L54 60 Q58 52 70 52 Q90 52 90 74 L90 78 L10 78 Z" fill={W} /><path d="M28 80 Q28 50 50 50 Q72 50 72 80 Z" fill={W} stroke="#a41fc4" strokeWidth="3" /></svg>;
};

export const ConnectWordIconReelGroup: React.FC<{inputs?: ConnectReelInputs; extras?: number[]}> = ({inputs: x = CONNECT_REEL_DEFAULT_INPUTS, extras = [0, 0, 0, 0]}) => {
  const tt = useCurrentFrame() / FPS;
  const s = toSource(tt, CONNECT_REEL_CONTRACT, extras) + S0;
  const P = counter(s), v = speed(s), lift = liftOf(s), lk = clamp(lift / 250);
  // 小词：开转后 0.15s 换，灰 → 白，从右边挪进来
  let wi = 0, since = s - S0 + 1;
  const WD = [0.1, 0.2, 0.2]; // 原片每次换词比开转晚 0.1 / 0.2 / 0.2s
  TS.slice(1, 4).forEach((t0, i) => { if (s >= t0 + WD[i]) { wi = i + 1; since = s - (t0 + WD[i]); } });
  const intro = clamp((s - 8.2) / 0.4);
  const wk = Math.min(clamp(since / 0.3), wi === 0 ? intro : 1);
  const grey = (k: number) => `rgb(${Math.round(140 + 115 * k)},${Math.round(132 + 123 * k)},${Math.round(152 + 103 * k)})`;
  const tiles: React.ReactNode[] = [];
  x.icons.forEach((ic, i) => {
    const phi = i - P;
    if (phi < -1.4 || phi > 1.4) return;
    const cx = lin(phi, PATH, 1) * K, cy = (lin(phi, PATH, 2) - lift * (phi > 0.5 ? 0.6 : 1)) * K, w = lin(phi, PATH, 3) * K;
    const a = Math.min(1, Math.abs(phi));
    const h = w * (1 - 0.42 * Math.pow(a, 1.6)); // 转到两头被压扁
    const fade = clamp(a * 1.15) * (phi > 0 ? 1 - 0.6 * lk : 1);
    const iconO = phi > 0 ? Math.max(1 - clamp((phi - 0.5) * 2.5), lk * 0.8) : 1; // 右下角那个还没转上来的看不清图标
    const dim = phi > 0.55 ? 1 - 0.45 * clamp((phi - 0.55) / 0.45) * (1 - lk) : 1;
    const mask = phi < 0 ? `linear-gradient(0deg, #000 ${55 - 40 * fade}%, rgba(0,0,0,${1 - fade}) 100%)` : `linear-gradient(180deg, #000 ${55 - 40 * fade}%, rgba(0,0,0,${1 - fade}) 100%)`;
    const blur = Math.min(6, v * 1.2 * (0.15 + a)) + lk * 3;
    tiles.push(
      <div key={i} style={{position: 'absolute', left: cx - w / 2, top: cy - h / 2, width: w, height: h, borderRadius: w * 0.1, background: 'linear-gradient(160deg, #c845e2 0%, #a020c6 45%, #7c0ea8 100%)', boxShadow: `0 0 ${w * 0.25}px rgba(190,60,230,${0.55 * (1 - a * 0.6)}), inset 0 2px 0 rgba(255,255,255,0.25)`, WebkitMaskImage: mask, maskImage: mask, filter: blur > 0.4 ? `blur(${blur}px)` : undefined, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', opacity: dim}}>
        <div style={{position: 'absolute', inset: w * 0.045, borderRadius: w * 0.075, border: `${Math.max(1.5, w * 0.007)}px solid rgba(255,230,255,0.75)`}} />
        <div style={{width: w, height: w, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scaleY(${h / w})`, opacity: iconO}}><Icon k={ic} /></div>
      </div>,
    );
  });
  return (
    <AbsoluteFill style={{background: '#0f0d1c', overflow: 'hidden', fontFamily: SANS}}>
      <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 48% 62% at 50% 46%, rgba(130,34,160,0.85) 0%, rgba(80,20,105,0.55) 45%, rgba(15,13,28,0) 80%)'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 120, background: 'linear-gradient(180deg, rgba(110,30,140,0.35), rgba(0,0,0,0))'}} />
      {tiles}
      <div style={{position: 'absolute', left: 196 * K, top: 428 * K, transform: 'translateY(-50%)', fontSize: 140, fontWeight: 800, color: grey(intro), textShadow: '0 0 24px rgba(220,150,255,0.45)', whiteSpace: 'nowrap', lineHeight: 1}}>{x.lead}</div>
      <div style={{position: 'absolute', left: 200 * K + 24 * (1 - clamp(since / 0.35)) * (wi > 0 ? 1 : 0), top: 560 * K, transform: 'translateY(-50%)', fontSize: 90, fontWeight: 600, color: grey(wk), textShadow: '0 0 18px rgba(220,150,255,0.35)', whiteSpace: 'nowrap', lineHeight: 1}}>{x.words[wi]}</div>
      <div style={{position: 'absolute', right: 36, bottom: 26, fontSize: 20, color: 'rgba(220,200,240,0.4)', letterSpacing: '0.06em'}}>{x.note}</div>
    </AbsoluteFill>
  );
};

if (checkContract(CONNECT_REEL_CONTRACT).length) throw new Error(checkContract(CONNECT_REEL_CONTRACT).join('；'));
export const ConnectWordIconReel: React.FC = () => <ConnectWordIconReelGroup />;
