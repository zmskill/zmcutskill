// 【镜头组】arc-sweep-wordmark：一道蓝色弧光从右上扫过去 → 顶上一条暗弧、底下一圈行星边缘的光 → 中间星标 + 名字从左往右由糊变清，定住（028-H 单个镜头，收尾）
// 学的动作（ArtemLysenko · DashSync 31.2–34.4s，30fps 逐帧量过）：
//   31.2 右上一大团斜着的亮光（≈1500,120）往左下扫、0.4s 淡掉，一道细光划过
//   31.5 顶部压一条暗弧，底部亮起行星边缘（圆心 960,2100，R1100）；31.5–32.0 星标（630,594，90px）+ 名字（110px，从 x720 起）逐字由糊变清
//   32.4 定住，底部光慢慢呼吸，停到 34.4
// 我们的内容：虚构产品「数星」，右下角标"虚构 · 仅作演示"。
import React from 'react';
import {Bloom, BloomOpts} from '../_kit/bloom';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {GroupContract, checkContract, checkInputs, outputDuration, planExtras, toSource} from '../../../assets/lib/helpers/groupClock';
import {Arc, NavyBg, SANS, Star4, clamp, eo, kf} from '../_kit/blueArcKit';
import {GlowSpot} from '../_kit/light';

const FPS = 30;
const S0 = 31.2;
export const ARC_SWEEP_WORDMARK_CONTRACT: GroupContract = {
  sourceDuration: 96 / 30,
  fps: 30,
  motion: [[0, 1.4], [1.5, 96 / 30]],
  holds: [{at: 1.45, maxExtra: 3}],
  landmarks: {sweep: 0, word: 0.3, lock: 1.2},
  sfx: [
    {at: 'sweep', type: '运镜', note: '光扫 whoosh', volume: 0.45},
    {at: 'word', type: '闪光', note: '亮相 shimmer', volume: 0.4},
    {at: 'lock', type: '提示音', note: '定格 chime', volume: 0.4},
  ],
  inputs: {name: {maxChars: 4}},
};
export type ArcWordInputs = {name: string; note: string};
export const ARC_WORD_DEFAULT_INPUTS: ArcWordInputs = {name: '数星', note: '虚构 · 仅作演示'};
export const checkArcWordInputs = (x: ArcWordInputs) => checkInputs(ARC_SWEEP_WORDMARK_CONTRACT, {name: x.name});
export const planArcWord = (sec: number) => planExtras(ARC_SWEEP_WORDMARK_CONTRACT, sec);
export const arcWordFrames = (extras: number[]) => Math.round(outputDuration(ARC_SWEEP_WORDMARK_CONTRACT, extras) * FPS);
export const ARC_SWEEP_WORDMARK_DURATION = 96;

const ArcSweepWordmarkGroupInner: React.FC<{inputs?: ArcWordInputs; extras?: number[]}> = ({inputs: x = ARC_WORD_DEFAULT_INPUTS, extras = [0]}) => {
  const tt = useCurrentFrame() / FPS;
  const s = toSource(tt, ARC_SWEEP_WORDMARK_CONTRACT, extras) + S0;
  const held = tt - (s - S0);
  // 2026-11-19 逐帧量（原片 31.2–34.4）：
  //   31.2 顶上那团大亮光其实是整个画面在往下摇——亮光往上走、31.45 出画；同时底下星球边缘从画外升上来（中心亮线 31.5 y1012 → 31.8 952），
  //   32.0 起又慢慢沉下去（33.3 出画），但底下的大气光越来越亮（底部亮度 66 → 33.3 的 134），之后再暗下去；左边比右边亮
  //   名字：31.4 第一个字母就出来了（星 31.5 才出），字从 y690 跟着镜头升到 540 停（32.0）
  const sweep = clamp((s - 31.2) / 0.45);
  const topGY = kf(s, [[31.2, 230], [31.3, 120], [31.4, 10], [31.5, -110], [31.6, -220]]);
  const scene = eo(clamp((s - 31.4) / 0.3));
  const rimY = kf(s, [[31.4, 1110], [31.5, 1012], [31.6, 976], [31.7, 960], [31.8, 952], [32.0, 952], [32.3, 964], [32.6, 980], [33.0, 1024], [33.3, 1075], [33.6, 1100], [34.4, 1112]]);
  const g = kf(s, [[31.45, 0.4], [31.6, 0.55], [32.0, 0.62], [32.3, 0.78], [32.6, 0.98], [33.0, 1.3], [33.3, 1.38], [33.6, 1.22], [34.0, 0.95], [34.4, 0.75]]) * (1 + 0.04 * Math.sin(held * 2));
  const ty = kf(s, [[31.4, 150], [31.6, 69], [31.7, 39], [31.9, 23], [32.0, 5], [32.5, 0]]), tx = kf(s, [[31.5, -25], [32.4, 0]]);
  const N = Array.from(x.name);
  const starK = eo(clamp((s - 31.5) / 0.18));
  const R = 2500;
  return (
    <AbsoluteFill style={{overflow: 'hidden', fontFamily: SANS, transform: `scale(${1 + 0.03 * clamp((s - 31.6) / 1.8) + held * 0.004})`}}>
      <NavyBg gx={20} gy={22} glow={0.56} side={0.5} drift={s} /><GlowSpot x={700} y={560} rx={1300} ry={760} rgb='24,70,185' a={0.22} /><GlowSpot x={1650} y={420} rx={1000} ry={600} rgb='18,52,150' a={0.22} />{/* 原片左上一大片亮钴蓝 */}
      {s < 31.65 && <div style={{position: 'absolute', left: 1400 - 1050, top: topGY - 300, width: 2100, height: 640, borderRadius: '50%', background: 'radial-gradient(ellipse closest-side, rgba(175,205,255,0.92) 0%, rgba(90,140,255,0.78) 32%, rgba(50,100,255,0.4) 60%, rgba(40,80,255,0) 100%)', transform: 'rotate(-9deg)', filter: 'blur(18px)'}} />}
      {sweep < 0.6 && <div style={{position: 'absolute', left: 420 + sweep * 80, top: 560 + sweep * 90, width: 4, height: 90, background: 'linear-gradient(180deg, rgba(160,190,255,0), #a8c0ff)', transform: 'rotate(-28deg)', opacity: 1 - sweep / 0.6}} />}
      <div style={{opacity: scene}}>
        <div style={{position: 'absolute', left: 1200 - 3130, top: -3000 - 3130, width: 6260, height: 6260, borderRadius: '50%', boxShadow: '0 0 70px 26px rgba(1,4,24,0.72)'}} />{/* 吸管量：原片顶上只是一条细的暗弧（左低右高，840,156 → 1870,12），弧上下都还是亮蓝 */}
        <GlowSpot x={240} y={60} rx={1300} ry={520} rgb='38,96,210' a={0.25 * scene} /><GlowSpot x={760} y={-10} rx={1050} ry={150} rgb='55,115,255' a={0.62 * scene} />{/* 2026-11-21 原片顶上一直有一条亮蓝光带（左中最亮），暗弧压在它下面 */}
        <div style={{opacity: 0.72}}><Arc cx={960} cy={rimY + R} R={R} w={18} hair={0.35} /></div><GlowSpot x={900} y={rimY + 70} rx={1350} ry={200 + 60 * g} rgb='40,95,255' a={0.66 * g} /><GlowSpot x={560} y={rimY + 40} rx={700} ry={120 + 30 * g} rgb='120,150,255' a={0.55 * g} />{/* 原片底边最亮的一段偏左（x≈0.2–0.5） */}<div>{/* 光斑放在透明度组外面直接加到背景上：放在 0.72 透明度组里面，蓝色最高只能到 ≈190（量出来原片到 250） */}{/* 加光的颜色少放绿：蓝通道先加满后再加会偏青（之前底边发青绿） */}</div>{/* 原片底部一整条很亮的浅天蓝大气带，几乎横跨全宽 */}
      </div>
      <div style={{position: 'absolute', left: 624 - 55 + tx, top: 540 - 55 + ty, opacity: starK, transform: `scale(${0.6 + 0.4 * starK})`}}><Star4 size={110} glow={2.2} fat /></div>
      <div style={{position: 'absolute', left: 720 + tx, top: 540 + ty, transform: 'translateY(-55%)', display: 'flex', fontSize: 130, fontWeight: 500, color: '#eef2ff', letterSpacing: '0.02em', textShadow: '0 0 18px rgba(120,160,255,0.55), 0 0 50px rgba(60,110,255,0.35)'}}>
        {N.map((c, i) => { const k = eo(clamp((s - 31.32 - i * (0.42 / Math.max(1, N.length - 1))) / 0.22)); /* 原片名字逐字打到 32.2，字少也要铺满这段时间 */ return <span key={i} style={{opacity: k, filter: k < 1 ? `blur(${(1 - k) * 12}px)` : undefined, textShadow: '0 0 8px rgba(170,195,255,0.8), 0 0 26px rgba(90,130,255,0.75), 0 0 60px rgba(60,100,255,0.45)'}}>{c}</span>; })}
      </div>
      <div style={{position: 'absolute', right: 36, bottom: 26, fontSize: 20, color: 'rgba(200,210,255,0.45)', letterSpacing: '0.06em', opacity: scene}}>{x.note}</div>
    </AbsoluteFill>
  );
};

export const ARCSWEEPWORDMARK_LOOK: BloomOpts = {"off": true}; // 辉光 + 调色：参数按同帧对比工具量出来的原片亮度 / 饱和度校准
export const ArcSweepWordmarkGroup: React.FC<{inputs?: ArcWordInputs; extras?: number[]}> = (p) => <Bloom {...ARCSWEEPWORDMARK_LOOK}><ArcSweepWordmarkGroupInner {...p} /></Bloom>;

if (checkContract(ARC_SWEEP_WORDMARK_CONTRACT).length) throw new Error(checkContract(ARC_SWEEP_WORDMARK_CONTRACT).join('；'));
export const ArcSweepWordmark: React.FC = () => <ArcSweepWordmarkGroup />;
