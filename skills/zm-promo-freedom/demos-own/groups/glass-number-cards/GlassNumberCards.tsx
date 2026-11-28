// 【镜头组】glass-number-cards：三张玻璃数字卡（营收 / 时长 / 点击）在画面里漂，数字一格格往上滚着涨，节奏错开（028-G 一拍，数据证明核心）
// 学的动作（ArtemLysenko · DashSync 29–31.2s，30fps 逐帧量过）：
//   营收卡（646 宽，顶边在画面外）29.0 x1240 → 29.2 1158 → 29.6 882 → 30.0 840 停；数字 5K→7K→9K→10K（29.2/29.6/30.0/30.4 各翻一次）
//   时长卡（552 宽，y528 起）29.2 x318 → 29.6 −24 → 30.0 −72；2.4→3.4→4.4→4.9
//   点击卡（528 宽，y648 起）29.5 从右边滑进，29.6 x1350 → 30.0 1248；69.9→89.9→99.9（29.6/30.0/30.4）
//   数字 180px、标签 44px；每次翻数 0.14s 往上滚；中间一颗小蓝星慢慢漂
// 我们的内容：营收 / 时长 / 点击，数值照原片。
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {GroupContract, checkContract, outputDuration, planExtras, toSource} from '../../../assets/lib/helpers/groupClock';
import {GlassCard, MorphStar, NavyBg, RimLight, SANS, clamp, kf} from '../_kit/blueArcKit';

const FPS = 30;
const S0 = 29.2; // 2026-11-19 逐帧：29.167 还是上一镜（问答卡），29.2 硬切到数字卡
export const GLASS_NUMBER_CARDS_CONTRACT: GroupContract = {
  sourceDuration: 60 / 30,
  fps: 30,
  motion: [[0, 1.1], [1.25, 60 / 30]],
  holds: [{at: 1.18, maxExtra: 2}],
  landmarks: {in: 0, t1: 0.05, t2: 0.4, t3: 0.8, t4: 1.0},
  sfx: [
    {at: 't1', type: '轻tick', note: '数字滚动 tick', volume: 0.3},
    {at: 't2', type: '轻tick', note: '数字滚动 tick', volume: 0.3},
    {at: 't3', type: '轻tick', note: '数字滚动 tick', volume: 0.3},
    {at: 't4', type: '提示音', note: '定格 ding', volume: 0.4},
  ],
  inputs: {},
};
export type NumInputs = {labels: [string, string, string]; rev: string[]; time: string[]; clicks: string[]};
export const NUM_DEFAULT_INPUTS: NumInputs = {labels: ['营收', '时长', '点击'], rev: ['4K', '5K', '7K', '9K', '10K'], time: ['1.9', '2.4', '3.4', '4.4', '4.9'], clicks: ['49.9', '49.9', '69.9', '89.9', '99.9']};
export const planNum = (sec: number) => planExtras(GLASS_NUMBER_CARDS_CONTRACT, sec);
export const numFrames = (extras: number[]) => Math.round(outputDuration(GLASS_NUMBER_CARDS_CONTRACT, extras) * FPS);
export const GLASS_NUMBER_CARDS_DURATION = 60;

// 2026-11-18 对原片逐帧：数字不是"滚四下"，而是每 0.1s 跳一个数、一路连续往上数（营收 5K→10K、时长 2.4→4.9、点击 54.9→99.9），30.2 数到头停住
const Num: React.FC<{text: string; fs: number}> = ({text, fs}) => (
  <div style={{height: fs * 1.05, fontSize: fs, lineHeight: `${fs * 1.05}px`, fontWeight: 500, color: '#f2f5ff', letterSpacing: '-0.02em', whiteSpace: 'nowrap'}}>{text}</div>
);
const counts = (s: number) => {
  // 2026-11-19 逐帧：营收每 ≈0.18s 跳 1K；时长、点击是每帧都在涨（29.267 时长 2.6、点击 53.x，29.4 = 2.9 / 59.9），30.2 同时到头
  const rev = Math.min(10, Math.round(5 + 5 * clamp((s - 29.2) / 0.9)));
  const time = 2.4 + 2.5 * clamp((s - 29.2) / 1.0);
  const clk = 49.9 + 50 * clamp((s - 29.2) / 1.0);
  return {rev: `${rev}K`, time: time.toFixed(1).replace(/\.0$/, ''), clk: clk.toFixed(1)}; // 原片整数时显示「3」不是「3.0」
};

export const GlassNumberCardsGroup: React.FC<{inputs?: NumInputs; extras?: number[]}> = ({inputs: x = NUM_DEFAULT_INPUTS, extras = [0]}) => {
  const tt = useCurrentFrame() / FPS;
  const s = toSource(tt, GLASS_NUMBER_CARDS_CONTRACT, extras) + S0;
  const held = tt - (s - S0);
  const C = counts(s);
  // 2026-11-19 逐帧跟踪（elemtrack，三张卡各跟一个角）：切进来时三张卡带着很快的速度往左滑、0.9s 内指数减速停住（视差：点击卡最快、营收卡最慢），
  //   停住之后 x 完全不动；30.45 起整个画面向上加速移（下一镜的转场），之前我们一直往左慢漂是错的
  const fl = (i: number) => Math.sin(held * 1.3 + i * 2) * 6 * clamp(held);
  const camY = kf(s, [[30.45, 0], [30.6, -3], [30.7, -7], [30.8, -13], [30.9, -21], [31.0, -34], [31.1, -55], [31.2, -84]]) - held * 4;
  const revX = kf(s, [[29.2, 1158], [29.3, 1039], [29.4, 957], [29.5, 915], [29.6, 889], [29.7, 869], [29.8, 857], [29.9, 849], [30.0, 843], [30.1, 839], [30.2, 840], [31.2, 840]]);
  const timeX = kf(s, [[29.2, 262], [29.3, 169], [29.4, 69], [29.5, 19], [29.6, -13], [29.7, -35], [29.8, -49], [29.9, -59], [30.0, -67], [30.1, -71], [30.2, -73], [31.2, -73]]);
  const clkX = kf(s, [[29.2, 1990], [29.3, 1739], [29.4, 1537], [29.5, 1433], [29.6, 1369], [29.7, 1325], [29.8, 1295], [29.9, 1275], [30.0, 1261], [30.1, 1253], [30.2, 1249], [30.3, 1247], [31.2, 1247]]);
  const starY = kf(s, [[29.2, 260], [29.267, 329], [29.3, 352], [29.4, 404], [29.6, 461], [29.8, 507], [30.0, 525], [30.2, 530], [30.4, 540], [30.55, 552], [30.7, 590], [30.85, 660], [31.0, 774], [31.1, 865], [31.2, 965]]); // 2026-11-21 原片星 30.6 起往下加速掉（31.0 到 y774），卡片同时往上走
  const starX = kf(s, [[29.2, 865], [29.4, 888], [29.6, 900], [29.8, 905], [31.2, 905]]);
  // 星：一边转一边在 四角星 ⇄ 圆角方块 之间变（29.6–29.8 方、30.0 星、30.6 又方）
  const starM = kf(s, [[29.2, 0], [29.45, 0.3], [29.6, 0.8], [29.8, 1], [30.0, 0.2], [30.2, 0], [30.45, 0.4], [30.6, 0.9], [30.8, 0.2], [31.0, 0], [31.2, 0]]);
  // 边框走光：两团亮光沿边绕（原片点击卡 29.6 右 → 29.8 右上 → 29.9–30.2 左 → 30.3 右 → 30.4–30.7 左上 → 30.8–31.1 上 / 右上）
  const rim = (ph: number) => ({ang: 100 - (s - 29.6 + ph) * 65, a: 0.65 + 0.35 * Math.sin((s + ph) * 5.2), b: 0.65 + 0.35 * Math.cos((s + ph) * 5.2)});
  return (
    <AbsoluteFill style={{overflow: 'hidden', fontFamily: SANS}}>
      <NavyBg gx={30} gy={20} glow={0.4} side={0.55} drift={s} />{/* 吸管量：原片中间偏下是暗的，亮光都在卡片里（卡底透蓝光）和画面两侧 */}
      <div style={{position: 'absolute', inset: 0, transform: `translateY(${camY}px)`}}>
        {s < 31.1 && <div style={{opacity: 1 - clamp((s - 30.98) / 0.1)}}><MorphStar x={starX} y={starY + fl(3)} size={0.9} m={starM} rot={(s - 29.2) * 70} gid="gncStar" /></div>}{/* 原片星 31.05 前后消失 */}
        <div style={{position: 'absolute', left: revX, top: -40 + fl(0)}}>
          <GlassCard w={646} h={400} lit={0.7} edge={0.95}><div style={{position: 'absolute', left: 34, top: 66, fontSize: 44, color: '#e8eeff'}}>{x.labels[0]}</div><div style={{position: 'absolute', left: 26, top: 128}}><Num text={C.rev} fs={180} /></div></GlassCard>
          <RimLight w={646} h={400} {...rim(0.9)} />
        </div>
        <div style={{position: 'absolute', left: timeX, top: 528 + fl(1)}}>
          <GlassCard w={552} h={700} lit={0.62} edge={0.95}><div style={{position: 'absolute', right: 80, top: 82, fontSize: 44, color: '#e8eeff'}}>{x.labels[1]}</div><div style={{position: 'absolute', right: 80, top: 128, textAlign: 'right'}}><Num text={C.time} fs={180} /></div></GlassCard>
          <RimLight w={552} h={700} {...rim(0.35)} />
        </div>
        <div style={{position: 'absolute', left: clkX, top: 648 + fl(2)}}>
          <GlassCard w={528} h={600} lit={0.66} edge={0.95}><div style={{position: 'absolute', left: 50, top: 46, fontSize: 44, color: '#e8eeff'}}>{x.labels[2]}</div><div style={{position: 'absolute', left: 46, top: 96}}><Num text={C.clk} fs={180} /></div></GlassCard>
          <RimLight w={528} h={600} {...rim(0)} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

if (checkContract(GLASS_NUMBER_CARDS_CONTRACT).length) throw new Error(checkContract(GLASS_NUMBER_CARDS_CONTRACT).join('；'));
export const GlassNumberCards: React.FC = () => <GlassNumberCardsGroup />;
