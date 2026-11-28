// 【镜头组】glow-bar-benchmark：白底上一个深色圆点猛地撑满全屏 → 一根发光的青色长条从左边伸出来、镜头一路贴着推近 →
//   推到最近时下面几根灰条依次长出来，镜头开始慢慢往后拉：条上冒出名字、右边的数字逐位打出、顶上打出标题和小字 → 拉成一张完整的对比图，镜头还在极慢地后退（040-G 一拍，数据证明）
// 学的动作（SkaleSolutions · Aside 52.90–57.15s，29.97fps；网格大图逐点量过，时间表 （内部拆片记录，未随项目提供））：
//   52.95–53.15 圆从 r≈80（中心 815,645）撑满；53.2–53.85 镜头缩放 0.35 → 1.32（以 834,464 为中心）、同时从左下往正中挪；青条 53.2–54.0 长满；
//   53.75 起灰条每 0.06s 一根长出；54.0 起名字、数字逐位、标题、小字依次打出；53.85 → 57.05 缩放 1.32 → 0.865 慢慢后退。
// 我们的内容：通用的"浏览智能体评测"，对手全部用虚构名称（Orbit / Kestrel / Fennel / Wavely），分数也是编的，图下备注「名称与数据均为虚构 · 仅作演示」。
//
// 拍表（源秒 = 原片秒 − 52.90，30fps，共 128 帧）
//   拍 1 圆点撑满 + 青条推近 + 灰条 + 文字   0.00–2.20   （停留点 2.25）
//   拍 2 慢慢后退                           2.30–4.15   （停留点 4.20）
// 毛病清单：
//   - 通用：画面永远不停（停留时整体极慢推近）；--hq 渲染；确定性
//   - 独有：先"推进去"再"拉出来"——青条长出来时镜头在推近，推到头才开始拉远；停留时后退不停（按输出时钟算）
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Grain} from '../../../assets/lib/helpers/polish';
import {GroupContract, checkContract, checkInputs, outputDuration, planExtras, toSource} from '../../../assets/lib/helpers/groupClock';
import {SANS, clamp, easeOut, mix, mk} from '../_kit/darkUiKit';

const FPS = 30;
const T0 = 52.9;

export const GLOW_BAR_BENCHMARK_CONTRACT: GroupContract = {
  sourceDuration: 4.25,
  fps: 30,
  motion: [[0, 2.2], [2.3, 4.15]],
  holds: [{at: 2.25, maxExtra: 1.5}, {at: 4.2, maxExtra: 1.0}],
  landmarks: {wipe: 0.05, bar: 0.3, peak: 0.95, rows: 0.85, labels: 1.1, title: 1.4, sub: 1.7},
  sfx: [
    {at: 'wipe', type: '运镜', note: '圆形扩散 whoosh', tail: 0.3, volume: 0.4},
    {at: 'bar', type: '上扬铺垫', note: '光条拉出 riser（亮）', tail: 0.6, volume: 0.45},
    {at: 'rows', type: '轻tick', note: '灰条 soft tick ×4', tail: 0.3, volume: 0.25},
    {at: 'labels', type: '轻tick', note: '数字 tick 连串', tail: 0.5, volume: 0.25},
  ],
  inputs: {title: {maxChars: 10}, sub: {maxChars: 26}, rows: {count: 5, maxChars: 12}},
};

export type GbbRow = {name: string; note: string; value: string; width: number}; // width：条长占满格的比例
export type GbbInputs = {title: string; sub: string; rows: [GbbRow, GbbRow, GbbRow, GbbRow, GbbRow]; disclaimer?: string}; // disclaimer：图下面的小字备注（名称 / 数据虚构要写明，空字符串 = 不显示）
export const GBB_DEFAULT_INPUTS: GbbInputs = {
  title: '浏览智能体评测', sub: '在线网页任务 · 300 项 · 含不可能完成的任务',
  rows: [
    // 2026-11-17 用户定：对手用像真的虚构名（不用真名配编的分数），图下备注「名称与数据均为虚构」
    {name: 'Nimbo', note: '智能体', value: '99%', width: 1},
    {name: 'Orbit', note: '浏览助手', value: '97%', width: 0.914},
    {name: 'Kestrel', note: '电脑操作', value: '92%', width: 0.773},
    {name: 'Fennel', note: 'Pro', value: '86%', width: 0.562},
    {name: 'Wavely', note: 'AI 浏览器', value: '70%', width: 0.136},
  ],
  disclaimer: '名称与数据均为虚构 · 仅作演示',
};
export const checkGbbInputs = (x: GbbInputs) => checkInputs(GLOW_BAR_BENCHMARK_CONTRACT, {title: x.title, sub: x.sub, rows: x.rows.map((r) => r.name + r.note)});
export const planGbb = (sec: number) => planExtras(GLOW_BAR_BENCHMARK_CONTRACT, sec);
export const gbbFrames = (extras: number[]) => Math.round(outputDuration(GLOW_BAR_BENCHMARK_CONTRACT, extras) * FPS);
export const GLOW_BAR_BENCHMARK_DURATION = 128;

// 世界坐标 = 55.0 那一帧（缩放 1）
const X0 = 176, W = 1412, ROW0 = 376, PITCH = 118, BH = 88;
const ZOOM = [[53.2, 0.35], [53.3, 0.41], [53.55, 0.91], [53.85, 1.32], [54.1, 1.228], [54.35, 1.126], [54.6, 1.054], [55.0, 1.0]];
const DX = [[53.2, -700], [53.3, -564], [53.55, -235], [53.85, 0]];
const DY = [[53.2, 90], [53.3, 72], [53.55, 46], [53.85, 0]];
const CX = 834, CY = 464;
const BAR0 = [[53.2, 0], [53.3, 0.32], [53.55, 0.72], [53.85, 0.93], [54.0, 1]];

export const GlowBarBenchmarkGroup: React.FC<{inputs?: GbbInputs; extras?: number[]}> = ({inputs = GBB_DEFAULT_INPUTS, extras = [0, 0]}) => {
  const t = useCurrentFrame() / FPS;
  const s = toSource(t, GLOW_BAR_BENCHMARK_CONTRACT, extras);
  const T = s + T0;
  const Tout = t + T0; // 镜头后退按输出时钟走（停留时也不停）
  const z = Tout < 55.0 ? mk(T, ZOOM) : 1 - 0.066 * (Tout - 55.0);
  const dx = mk(T, DX), dy = mk(T, DY);

  // 圆点撑满
  const wipeR = T < 53.18 ? mix(80, 2300, Math.pow(clamp((T - 52.93) / 0.22), 2.3)) : 3000;

  const rows = inputs.rows.map((r, i) => {
    const y = ROW0 + i * PITCH;
    const grow = i === 0 ? mk(T, BAR0) : easeOut((T - 53.72 - i * 0.06) / 0.32);
    if (grow <= 0) return null;
    const w = W * r.width * grow;
    const lab = clamp((T - 54.0 - i * 0.05) / 0.15);
    const noteK = clamp((T - 54.2 - i * 0.07) / 0.25);
    const vchars = [...r.value];
    const vn = Math.floor(clamp((T - 54.05 - i * 0.05) / 0.45) * vchars.length + (T >= 54.05 + i * 0.05 ? 1 : 0));
    return (
      <React.Fragment key={i}>
        {i === 0 ? (
          <div style={{position: 'absolute', left: X0, top: y, width: Math.max(BH * 0.5, w), height: BH, borderRadius: 16, background: 'linear-gradient(90deg, #2fb2ea, #36d6f2)', boxShadow: '0 0 40px rgba(54,200,240,0.55), 0 0 120px rgba(54,190,240,0.25), inset 0 2px 0 rgba(255,255,255,0.35)'}} />
        ) : (
          <div style={{position: 'absolute', left: X0, top: y, width: Math.max(BH * 0.6, w), height: BH - 2, borderRadius: 14, background: 'rgba(66,67,70,0.75)', boxShadow: 'inset 0 1.5px 0 rgba(255,255,255,0.06)'}} />
        )}
        <div style={{position: 'absolute', left: X0 + 38, top: y + BH / 2 - 28, fontSize: 44, lineHeight: '56px', whiteSpace: 'pre', opacity: lab}}>
          <span style={{color: '#fff', fontWeight: 600}}>{r.name}</span>
          {r.note && <span style={{color: i === 0 ? 'rgba(255,255,255,0.55)' : '#8b8e93', opacity: noteK}}> {r.note}</span>}
        </div>
        <div style={{position: 'absolute', left: X0 + W + 60, top: y + BH / 2 - 28, fontSize: 46, lineHeight: '56px', color: i === 0 ? '#3cc7f0' : '#f2f2f2', fontWeight: 500, whiteSpace: 'pre'}}>{vchars.slice(0, Math.max(0, vn)).join('')}</div>
      </React.Fragment>
    );
  });
  const title = [...inputs.title], sub = [...inputs.sub];
  const tn = Math.floor(clamp((T - 54.28) / 0.35) * title.length + (T >= 54.28 ? 1 : 0));
  const sn = Math.floor(clamp((T - 54.55) / 0.45) * sub.length + (T >= 54.55 ? 1 : 0));

  return (
    <AbsoluteFill style={{background: '#fff', overflow: 'hidden', fontFamily: SANS}}>
      <div style={{position: 'absolute', left: 815 - wipeR, top: 645 - wipeR, width: wipeR * 2, height: wipeR * 2, borderRadius: '50%', background: '#252628', overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: wipeR - 815, top: wipeR - 645, width: 1920, height: 1080}}>
          {/* 条后面一团很淡的青光 */}
          <div style={{position: 'absolute', inset: 0, background: `radial-gradient(ellipse 60% 45% at 45% 42%, rgba(60,150,190,${T > 53.2 ? 0.14 : 0}), rgba(0,0,0,0))`}} />
          <div style={{position: 'absolute', left: 0, top: 0, width: 1, height: 1, transformOrigin: '0 0', transform: `translate(${CX + dx}px,${CY + dy}px) scale(${z}) translate(${-CX}px,${-CY}px)`}}>
            <div style={{position: 'absolute', left: X0 - 2, top: 224 - 42, fontSize: 46, lineHeight: '56px', color: '#f0f0f0', fontWeight: 500, whiteSpace: 'pre'}}>{title.slice(0, Math.max(0, tn)).join('')}</div>
            <div style={{position: 'absolute', left: X0 - 2, top: 280 - 42, fontSize: 42, lineHeight: '54px', color: '#8b8e93', whiteSpace: 'pre'}}>{sub.slice(0, Math.max(0, sn)).join('')}</div>
            {rows}
            {(() => {
              const note = inputs.disclaimer ?? GBB_DEFAULT_INPUTS.disclaimer;
              const nk = easeOut((T - 54.9) / 0.25);
              if (!note || nk <= 0) return null;
              return <div style={{position: 'absolute', left: X0 - 2, top: ROW0 + 5 * PITCH + 24 + 10 * (1 - nk), fontSize: 32, lineHeight: '44px', color: '#7a7d82', letterSpacing: 1, opacity: nk, whiteSpace: 'pre'}}>{note}</div>;
            })()}
          </div>
        </div>
      </div>
      <Grain opacity={0.025} />
    </AbsoluteFill>
  );
};

if (checkContract(GLOW_BAR_BENCHMARK_CONTRACT).length) throw new Error(checkContract(GLOW_BAR_BENCHMARK_CONTRACT).join('；'));
export const GlowBarBenchmark: React.FC = () => <GlowBarBenchmarkGroup />;
