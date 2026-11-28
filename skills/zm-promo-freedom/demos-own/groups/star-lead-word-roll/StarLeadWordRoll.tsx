// 【镜头组】star-lead-word-roll：小蓝星一边转一边往右靠、引导词往左靠，两者靠拢成一组 → 整组往左让位，右边一个词槽竖着滚：
//   词一个接一个从下面滚上来（旧词往上滚走）→ 最后一个词停住，星往左下掉出去，字一下没了，星重新出现在上方（028-E 一拍，枚举能力）
// 学的动作（ArtemLysenko · DashSync 19.6–24.5s，30fps 逐帧量过，2026-11-21）：
//   19.7 硬切：小星（≈81px，转着、有时鼓成圆角方块）在 (648,532)，「Control」在 x1013–1315 白色（字宽 ≈80px 字号）
//   19.7–20.2 星往右走到 745、字往左走到 837，靠成一组；20.2–21.0 整组往左让位（星 589 → 532，字 670 → 608），之后慢慢再往左漂（星 23.5 到 510）
//   20.4 起引导词变成蓝色渐变；词槽在引导词右边 56px：20.7 第一个词滚进来，之后 21.4 / 22.05 / 22.75 / 23.35 / 24.05 各换一次
//   换词：旧词 0.1s 往上滚出槽，新词从下面滚上来、减速到位（约 0.25s），槽外看不见；新词左白右蓝（渐变）
//   24.07–24.27 星往左下掉（508,532 → ≈470,650），24.27 字一下没了，星出现在 (575,455)、大一号，慢慢往右下漂到 24.5
// 我们的内容：「掌控」+ 区间 / 市场 / 图表分析 / 销售汇总 / 营收 / 受众（接 028 数星整串）。
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {GroupContract, checkContract, checkInputs, outputDuration, planExtras, toSource} from '../../../assets/lib/helpers/groupClock';
import {MorphStar, NavyBg, SANS, clamp, eo, kf} from '../_kit/blueArcKit';
import {GlowSpot} from '../_kit/light';

const FPS = 30;
const S0 = 19.6;
const SW = [20.7, 21.4, 22.05, 22.75, 23.35, 24.05]; // 换词时刻（原片时间）
export const STAR_LEAD_WORD_ROLL_CONTRACT: GroupContract = {
  sourceDuration: 147 / 30,
  fps: 30,
  motion: [[0, 1.4], [1.5, 2.1], [2.2, 2.75], [2.85, 3.4], [3.5, 4.05], [4.15, 147 / 30]],
  holds: [{at: 1.45, maxExtra: 1}, {at: 2.15, maxExtra: 1}, {at: 2.8, maxExtra: 1}, {at: 3.45, maxExtra: 1}, {at: 4.1, maxExtra: 1}],
  landmarks: {cut: 0.1, join: 0.6, w1: 1.1, w2: 1.8, w3: 2.45, w4: 3.15, w5: 3.75, w6: 4.45, drop: 4.47},
  sfx: [
    {at: 'cut', type: '轻tick', note: '轻击 tick', volume: 0.35},
    {at: 'w1', type: '翻页', note: '翻牌 flick', volume: 0.3}, {at: 'w2', type: '翻页', note: '翻牌 flick', volume: 0.3}, {at: 'w3', type: '翻页', note: '翻牌 flick', volume: 0.3},
    {at: 'w4', type: '翻页', note: '翻牌 flick', volume: 0.3}, {at: 'w5', type: '翻页', note: '翻牌 flick', volume: 0.3}, {at: 'w6', type: '翻页', note: '翻牌 flick', volume: 0.3},
    {at: 'drop', type: '运镜', note: '下坠 whoosh', volume: 0.35},
  ],
  inputs: {lead: {maxChars: 3}, words: {count: 6, maxChars: 5}},
};
export type WordRollInputs = {lead: string; words: string[]; note: string};
export const WORD_ROLL_DEFAULT_INPUTS: WordRollInputs = {lead: '掌控', words: ['区间', '市场', '图表分析', '销售汇总', '营收', '受众'], note: '虚构 · 仅作演示'};
export const checkWordRollInputs = (x: WordRollInputs) => {
  const bad: string[] = [];
  if (x.words.length !== 6) bad.push('words 必须正好 6 个');
  x.words.forEach((w) => { if (Array.from(w).length > 5) bad.push(`词「${w}」超过 5 字`); });
  return [...bad, ...checkInputs(STAR_LEAD_WORD_ROLL_CONTRACT, {lead: x.lead})];
};
export const planWordRoll = (sec: number) => planExtras(STAR_LEAD_WORD_ROLL_CONTRACT, sec);
export const wordRollFrames = (extras: number[]) => Math.round(outputDuration(STAR_LEAD_WORD_ROLL_CONTRACT, extras) * FPS);
export const STAR_LEAD_WORD_ROLL_DURATION = 147;

const lin = (u: number) => u;
export const StarLeadWordRollGroup: React.FC<{inputs?: WordRollInputs; extras?: number[]}> = ({inputs: x = WORD_ROLL_DEFAULT_INPUTS, extras = [0, 0, 0, 0, 0]}) => {
  const tt = useCurrentFrame() / FPS;
  const s = toSource(tt, STAR_LEAD_WORD_ROLL_CONTRACT, extras) + S0;
  const held = tt - (s - S0);
  const FS = 96, LH = 124;
  const leadW = Array.from(x.lead).length * FS * 1.02;
  // 星和引导词（原片量的位置）
  const sx = kf(s, [[19.7, 648], [20.2, 745], [20.6, 589], [21.0, 540], [21.5, 532], [22.6, 513], [23.55, 510], [24.07, 508], [24.27, 470]], lin) - held * 3;
  const sy = kf(s, [[19.7, 532], [24.07, 532], [24.27, 650]], lin);
  const lx = kf(s, [[19.7, 1013], [20.2, 837], [20.6, 670], [21.0, 616], [21.5, 608], [22.6, 597], [23.55, 591]], lin) - held * 3;
  const slotX = lx + leadW + 56;
  const ssz = 1.3 * kf(s, [[19.7, 81], [20.2, 108], [21.0, 100], [24.0, 100]]);
  const rot = (s - 19.6) * 95, m = 0.5 + 0.5 * Math.sin((s - 19.6) * 7.5);
  const after = s >= 24.27;
  const blue = clamp((s - 20.3) / 0.3);
  // 词槽：当前词序号 + 滚动进度
  let k = -1; for (let i = 0; i < SW.length; i++) if (s >= SW[i] - 0.07) k = i;
  const roll = (i: number) => clamp((s - (SW[i] - 0.07)) / 0.28); // 0 → 1
  return (
    <AbsoluteFill style={{overflow: 'hidden', fontFamily: SANS}}>
      <NavyBg gx={14} gy={18} glow={0.36} side={0.3} drift={s} />
      <GlowSpot x={300} y={160} rx={900} ry={520} rgb="30,70,190" a={0.12} />
      {!after ? (
        <>
          <MorphStar x={sx} y={sy} size={ssz / 140} m={m * 0.7} rot={rot} gid="slw" />
          <GlowSpot x={sx} y={sy} rx={ssz * 1.2} rgb="60,95,255" a={0.25} />
          <div style={{position: 'absolute', left: lx, top: 540, transform: 'translateY(-50%)', fontSize: FS, fontWeight: 500, whiteSpace: 'nowrap', display: 'flex', textShadow: '0 0 10px rgba(140,165,255,0.45)'}}>
            {Array.from(x.lead).map((c, i, a) => { const u = a.length > 1 ? i / (a.length - 1) : 0; /* 引导词变蓝：左边深蓝、右边浅蓝 */ const r = Math.round(242 - blue * (160 - 100 * u)), g = Math.round(244 - blue * (120 - 80 * u)); return <span key={i} style={{color: `rgb(${r},${g},255)`}}>{c}</span>; })}
          </div>
          <div style={{position: 'absolute', left: slotX, top: 540 - LH / 2, height: LH, width: 800, overflow: 'hidden'}}>
            {x.words.map((w, i) => {
              if (i < k - 1 || i > k) return null;
              const r = i === k ? roll(i) : 1; // 当前词：滚进来；上一个词：跟着当前词的进度滚出去
              const y = i === k ? (1 - eo(r)) * LH : -eo(clamp(roll(k) * 1.6)) * LH; /* 原片换词中间那帧上下两个词各露一半 */
              if (i < k && roll(k) >= 0.65) return null;
              return <div key={i} style={{position: 'absolute', left: 0, top: y, height: LH, display: 'flex', alignItems: 'center', fontSize: FS, fontWeight: 500, whiteSpace: 'nowrap',
                background: 'linear-gradient(90deg, #f4f6ff 0px, #eef1ff 150px, #8aa2ff 300px, #5d7dff 420px)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent', filter: 'drop-shadow(0 0 10px rgba(140,165,255,0.45))'}}>{w}</div>;
            })}
          </div>
        </>
      ) : (
        <>
          <MorphStar x={575 + (s - 24.27) * 25 + held * 6} y={455 + (s - 24.27) * 140} size={120 / 140} m={0.3} rot={rot} gid="slw2" />
          <GlowSpot x={575} y={460} rx={150} rgb="60,95,255" a={0.3} />
        </>
      )}
      <div style={{position: 'absolute', right: 36, bottom: 26, fontSize: 20, color: 'rgba(200,210,255,0.45)', letterSpacing: '0.06em'}}>{x.note}</div>
    </AbsoluteFill>
  );
};

if (checkContract(STAR_LEAD_WORD_ROLL_CONTRACT).length) throw new Error(checkContract(STAR_LEAD_WORD_ROLL_CONTRACT).join('；'));
export const StarLeadWordRoll: React.FC = () => <StarLeadWordRollGroup />;
