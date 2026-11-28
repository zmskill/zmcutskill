// 【镜头组】ray-burst-counter：米白底中间一个蓝圆，两边小字说明 → 蓝圆缩小、外面围一圈点（几颗是人脸）→ 点连成放射线、炸开成一圈长短不一的线，右边数字 340→363→380 跳 →
//   收回 → 中间换词、一圈小点转着 → 洞察卡片从下面错开飞上来叠成三列 → 收成一个小空心圆（041-D 一拍，数据证明核心）
// 学的动作（SkaleSolutions · ListenLabs 32–37.9s，30fps 逐帧量过）：
//   32.0 蓝圆 d396（960,540），两边三行小字（40px，x330 / x1590）；32.4 圆缩到 216、外面 30 个点（r270，d42，右上几颗是人脸），两边换一句
//   32.8 点变小、圆心连出细线；33.1 炸开：40 条线长短不一（r 240–480），线头小点，慢慢转；中心圆 d120；左边只剩一个词
//   34.0 / 34.3 / 34.6 右边数字 340 → 363 → 380（130px 蓝，下面一行小字）；35.2 线收回到 r240
//   35.5 中间一个词（60px）→ 35.8 换词 + 一圈小点在转（r100）→ 36.4–37.0 卡片从下面飞上来，叠成三列（x300 / 750 / 1200，宽 420）→ 37.3 往上带
//   37.6 只剩一个小空心圆（d120）
// 我们的内容：两边说明「AI 主持访谈 / 分析每一场对话」，左词「分析」，数字下「份有效回答」，中间「洞察 / 只要几秒」；卡片是中文图表和引述。
import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {GroupContract, checkContract, outputDuration, planExtras, toSource} from '../../../assets/lib/helpers/groupClock';
import {BLUE, CREAM, FACES, SANS, clamp, eio, eo, kf, mix} from '../circle-morph-listen/CircleMorphListen';

const FPS = 30;
const S0 = 32.0;
export const RAY_BURST_COUNTER_CONTRACT: GroupContract = {
  sourceDuration: 177 / 30,
  fps: 30,
  motion: [[0, 2.55], [2.65, 177 / 30]],
  holds: [{at: 2.6, maxExtra: 1.5}],
  landmarks: {dots: 0.4, rays: 0.8, burst: 1.1, n1: 2.0, n2: 2.3, n3: 2.6, word: 3.4, cards: 4.2, ring: 5.6},
  sfx: [
    {at: 'dots', type: '弹出', note: '一圈 pop', volume: 0.3},
    {at: 'burst', type: '运镜', note: '放射 whoosh', volume: 0.45},
    {at: 'n1', type: '轻tick', note: '数字 tick', volume: 0.3},
    {at: 'n2', type: '轻tick', note: '数字 tick', volume: 0.3},
    {at: 'n3', type: '提示音', note: '数字 ding', volume: 0.4},
    {at: 'cards', type: '短甩', note: '卡片飞入 swish', tail: 0.6, volume: 0.35},
  ],
  inputs: {},
};
export const planRay = (sec: number) => planExtras(RAY_BURST_COUNTER_CONTRACT, sec);
export const rayFrames = (extras: number[]) => Math.round(outputDuration(RAY_BURST_COUNTER_CONTRACT, extras) * FPS);
export const RAY_BURST_COUNTER_DURATION = 177;

const Small: React.FC<{x: number; t: string; o: number}> = ({x, t, o}) => <div style={{position: 'absolute', left: x - 200, width: 400, top: 540, transform: 'translateY(-50%)', textAlign: 'center', fontFamily: SANS, fontSize: 38, lineHeight: 1.25, color: '#111', opacity: o, whiteSpace: 'pre-line'}}>{t}</div>;
const ChartCard: React.FC = () => (
  <div style={{width: 432, height: 456, borderRadius: 16, background: '#fbf8f2', boxShadow: '0 0 0 2px #d8d2c6', padding: 30, boxSizing: 'border-box', fontFamily: SANS}}>
    <div style={{fontSize: 16, textAlign: 'center', marginBottom: 14, color: '#333'}}>过去一个月用过的 AI 工具</div>
    {[['豆包', 0.86], ['DeepSeek', 0.72], ['Kimi', 0.55], ['通义', 0.48], ['元宝', 0.36], ['其他', 0.22]].map(([t, v]) => <div key={t as string} style={{marginBottom: 20}}><div style={{display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#444'}}><span>{t as string}</span><span>{Math.round((v as number) * 100)}%</span></div><div style={{height: 8, borderRadius: 4, background: '#e8e2d6'}}><div style={{width: `${(v as number) * 100}%`, height: '100%', borderRadius: 4, background: '#111'}} /></div></div>)}
  </div>
);
const QuoteCard: React.FC<{q: string}> = ({q}) => (
  <div style={{width: 432, height: 456, borderRadius: 16, background: '#fbf8f2', boxShadow: '0 0 0 2px #d8d2c6', padding: 30, boxSizing: 'border-box', fontFamily: SANS, display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
    <div style={{fontSize: 13, color: '#888', lineHeight: 1.5}}>想想你最近一次用 AI 是在什么场景？你当时想做什么？</div>
    <div style={{fontSize: 24, color: '#111', lineHeight: 1.35}}>{q}</div>
  </div>
);

export const RayBurstCounterGroup: React.FC<{extras?: number[]}> = ({extras = [0]}) => {
  const tt = useCurrentFrame() / FPS;
  const s = toSource(tt, RAY_BURST_COUNTER_CONTRACT, extras) + S0;
  const held = tt - (s - S0);
  const els: React.ReactNode[] = [];
  if (s < 35.36) {
    const d = kf(s, [[32.0, 396], [32.35, 396], [32.5, 216], [32.8, 150], [33.1, 120], [34.7, 116], [35.0, 92], [35.33, 24]]);
    const dotsK = clamp((s - 32.4) / 0.12);
    const rays = eo(clamp((s - 32.75) / 0.35));
    const burst = eo(clamp((s - 33.0) / 0.35)) * (1 - Math.pow(clamp((s - 34.72) / 0.64), 2.2)); // 2026-11-19 逐帧：34.7 数字停住后放射线就开始慢慢往回收（34.9 / 35.0 / 35.1 一点点变短），35.32 收成一小团——之前 35.0 才收、0.28s 一下收完，看着像跳
    const rot = (kf(s, [[32.8, -45], [33.3, -25.5], [34.1, 3.6], [34.3, 10.4], [34.5, 21.3], [34.7, 36.6], [34.9, 56.4], [35.1, 80], [35.35, 108]]) * Math.PI) / 180 + held * 0.3; // 2026-11-20 camtrack 量：放射线一直顺时针转（≈36°/s），34.5 起边收边越转越快（≈100°/s），像漩涡收进去；之前只有 7°/s
    const N = 40;
    els.push(
      <svg key="r" width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
        {Array.from({length: N}, (_, i) => {
          const a = (i / N) * Math.PI * 2 + rot + Math.sin(i * 2.3) * 0.06;
          const len = mix(s > 34.0 ? d / 2 + 6 : 270, (150 + Math.abs(Math.sin(i * 1.7)) * 230 + (i % 5) * 14) * (1 - 0.12 * clamp((s - 33.4) / 1.3)), burst); // 原片线长 ≈150–400，收的时候是收进中心圆，不是收回到外面那圈
          const show = i % 4 !== 3 || burst > 0.3;
          if (!show || dotsK <= 0) return null;
          const x2 = 960 + Math.cos(a) * len, y2 = 540 + Math.sin(a) * len;
          const x1 = 960 + Math.cos(a) * mix(len, d / 2, rays), y1 = 540 + Math.sin(a) * mix(len, d / 2, rays);
          return <g key={i} opacity={dotsK}><line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#3a4be0" strokeWidth={1.6} opacity={rays} /><circle cx={x2} cy={y2} r={mix(21, 5, rays)} fill={BLUE} /></g>;
        })}
      </svg>,
    );
    // 右上几颗人脸点（还没炸开时）
    if (dotsK > 0 && rays < 0.6) [3, 4, 5, 6, 7].forEach((j) => { const a = (j / N) * Math.PI * 2 + rot - Math.PI / 2 + 0.6; const x = 960 + Math.cos(a) * 270, y = 540 + Math.sin(a) * 270; els.push(<div key={`f${j}`} style={{position: 'absolute', left: x - 21, top: y - 21, width: 42, height: 42, borderRadius: 21, overflow: 'hidden', opacity: dotsK * (1 - rays / 0.6)}}><Img src={staticFile(`library/faces/${FACES[j * 3]}.jpg`)} style={{width: '100%', height: '100%', objectFit: 'cover'}} /></div>); });
    els.push(<div key="c" style={{position: 'absolute', left: 960 - d / 2, top: 540 - d / 2, width: d, height: d, borderRadius: '50%', background: BLUE}} />);
    const t1 = s < 32.4 ? 'AI 主持\n访谈' : '分析每一场\n对话';
    if (s < 33.3) { els.push(<Small key="l" x={330} t={t1} o={1} />, <Small key="rr" x={1590} t={t1} o={1} />); }
    else els.push(<Small key="l2" x={330} t="分析" o={1} />);
    const num = s < 34.0 ? null : String(Math.round(340 + 40 * clamp((s - 34.0) / 0.52))); // 原片数字是一路往上数的（34.15 = 352、34.3 = 363、34.5 = 379），不是跳三下
    if (num) els.push(<div key="n" style={{position: 'absolute', left: 1596 - 200, width: 400, top: 540, transform: 'translateY(-60%)', textAlign: 'center', fontFamily: SANS, color: BLUE}}><div style={{fontSize: 130, lineHeight: 1, fontWeight: 500}}>{num}</div>{s > 34.1 && <div style={{fontSize: 24, marginTop: 6}}>份有效回答</div>}</div>);
  } else if (s < 37.55) {
    // 2026-11-19 逐帧：35.4「洞察」→ 35.6「只要」→ 35.75「几秒」，同时一圈钟面数字 01–12 从顶上顺时针一个个冒出来（36.05 一圈齐），慢慢转；
    //   卡片不是一张张转着淡入，而是整摞三列从画面下面推上来（中间列领头，左右两列低 ≈230），盖住还在的字和钟面；先快后慢、37.0 后又加速冲出画面
    if (s < 36.75) {
      const word = s < 35.58 ? '洞察' : s < 35.73 ? '只要' : '几秒';
      els.push(<div key="w" style={{position: 'absolute', left: 0, right: 0, top: 540, transform: 'translateY(-50%)', textAlign: 'center', fontFamily: SANS, fontSize: 60, color: '#111'}}>{word}</div>);
      if (s > 35.73) {
        const fade = 1 - 0.65 * clamp((s - 36.12) / 0.3);
        Array.from({length: 12}, (_, i) => {
          const k = clamp((s - 35.75 - i * 0.026) / 0.08);
          if (k <= 0) return;
          const a = ((i / 12) * 360 - 60 + (s - 35.75) * 38) * Math.PI / 180;
          els.push(<div key={`n${i}`} style={{position: 'absolute', left: 960 + Math.cos(a) * 150 - 20, top: 540 + Math.sin(a) * 150 - 10, width: 40, textAlign: 'center', fontFamily: SANS, fontSize: 15, color: '#333', opacity: k * fade}}>{String(i + 1).padStart(2, '0')}</div>);
        });
      }
    }
    const yMid = kf(s, [[36.2, 1100], [36.3, 800], [36.4, 640], [36.5, 532], [36.6, 452], [36.8, 344], [37.0, 220], [37.2, 8], [37.4, -364], [37.55, -800]]);
    const cols = [{x: 288, off: 240, kinds: ['q', 'c', 'q', 'c']}, {x: 748, off: 0, kinds: ['c', 'c', 'c', 'q']}, {x: 1200, off: 200, kinds: ['q', 'q', 'c', 'q']}];
    const quotes = ['“我想找几本和刚看完那本一样好看的书。”', '“我在问蘸料和指甲油哪个对身体更好一点。”', '“想让它帮我把周报改得像人话一点。”'];
    cols.forEach((c, ci) => c.kinds.forEach((k, ri) => {
      const conv = ci === 1 ? 0 : -30 * clamp((s - 36.5) / 0.5); // 左右两列慢慢追上一点
      const y = yMid + ri * 496 + c.off + conv;
      if (y > 1100 || y < -480) return;
      els.push(<div key={`${ci}${ri}`} style={{position: 'absolute', left: c.x, top: y}}>{k === 'c' ? <ChartCard /> : <QuoteCard q={quotes[(ci + ri) % 3]} />}</div>);
    }));
  } else {
    els.push(<div key="o" style={{position: 'absolute', left: 960 - 60, top: 540 - 60, width: 120, height: 120, borderRadius: 60, boxShadow: '0 0 0 2px #333', transform: `scale(${eo(clamp((s - 37.55) / 0.15))})`}} />);
  }
  return (
    <AbsoluteFill style={{background: CREAM, overflow: 'hidden'}}>
      {els}
      <div style={{position: 'absolute', left: 950, top: 50, width: 20, height: 2, background: '#bbb'}} />
    </AbsoluteFill>
  );
};

if (checkContract(RAY_BURST_COUNTER_CONTRACT).length) throw new Error(checkContract(RAY_BURST_COUNTER_CONTRACT).join('；'));
export const RayBurstCounter: React.FC = () => <RayBurstCounterGroup />;
