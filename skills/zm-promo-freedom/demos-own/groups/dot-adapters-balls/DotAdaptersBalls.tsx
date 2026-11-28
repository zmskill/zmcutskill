// 【镜头组】dot-adapters-balls：点线卡片散成点云 → 聚成一大三小四颗转动的点阵球，球下面各有一个小图标 + 名字，左边一行大字；最后球又化成点云（033-C 一拍，枚举）
// 学的动作（dwhitedesign · cube 22.8–27s，60fps 逐帧量过）：
//   22.8 卡片 → 23.0 竖着的一团点 → 23.8 四颗球：中（1458,648）r108、左（972,684）r84、右（1782,636）r84、上（1350,276）r66
//   25.0 微调到：中（1346,676）r105、上（1384,296）r66、左（990,656）r76、右（1756,676）r76，一直慢慢转
//   24.2 球下面的小图标 + 名字淡入（字 26px），26.2 淡出；大字 110px 在 x=144，23.75 从下往上露出，26.45 往上收
//   27.0 化成三团点云（主团在 1095,690），交给下一拍
// 我们的内容：四种适配。React（中）/ 小程序（上）/ Vue（左）/ 鸿蒙（右）；名字是文字，图标是自己画的小几何图形，不用官方 logo。
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {GroupContract, checkContract, checkInputs, outputDuration, planExtras, toSource} from '../../../assets/lib/helpers/groupClock';
import {CardSpec, DotCanvas, Form, Key, ambient, balls, cards, clamp, cloud, mix, moveQuads, quadCards, springForm, timeline} from '../_kit/dotField';
import {BG, MaskLine, SANS_EN} from '../dot-burst-sphere/DotBurstSphere';

const FPS = 30;
const S0 = 22.8;
export const DOT_ADAPTERS_BALLS_CONTRACT: GroupContract = {
  sourceDuration: 126 / 30,
  fps: 30,
  motion: [[0, 2.6], [2.7, 126 / 30]],
  holds: [{at: 2.65, maxExtra: 2}],
  landmarks: {dissolve: 0, balls: 1.0, title: 0.95, labels: 1.4, out: 3.4, cloud: 4.0},
  sfx: [
    {at: 'dissolve', type: '环境', note: '沙沙散开', volume: 0.35},
    {at: 'balls', type: '闪光', note: '聚合 shimmer', volume: 0.35},
    {at: 'labels', type: '轻tick', note: '四下 tick', tail: 0.3, volume: 0.25},
  ],
  inputs: {title: {maxChars: 7}},
};
export type AdapterInputs = {title: string; names: [string, string, string, string]};
export const ADAPTER_DEFAULT_INPUTS: AdapterInputs = {title: '四种适配。', names: ['React', '小程序', 'Vue', '鸿蒙']};
export const checkAdapterInputs = (x: AdapterInputs) => checkInputs(DOT_ADAPTERS_BALLS_CONTRACT, {title: x.title});
export const planAdapters = (sec: number) => planExtras(DOT_ADAPTERS_BALLS_CONTRACT, sec);
export const adapterFrames = (extras: number[]) => Math.round(outputDuration(DOT_ADAPTERS_BALLS_CONTRACT, extras) * FPS);
export const DOT_ADAPTERS_BALLS_DURATION = 126;

const revealCards = (): CardSpec[] => [0, 1, 2, 3].map((i) => ({x: 800 + i * 15 - 40, y: -170 + i * 300 - 30, w: 1060, h: 240}));
const Glyph: React.FC<{i: number}> = ({i}) => (
  <svg width={30} height={30} viewBox="0 0 24 24">
    {i === 0 && <><ellipse cx={12} cy={12} rx={10} ry={4} fill="none" stroke="#a9a6ff" strokeWidth={1.6} /><ellipse cx={12} cy={12} rx={10} ry={4} fill="none" stroke="#a9a6ff" strokeWidth={1.6} transform="rotate(60 12 12)" /><ellipse cx={12} cy={12} rx={10} ry={4} fill="none" stroke="#a9a6ff" strokeWidth={1.6} transform="rotate(-60 12 12)" /><circle cx={12} cy={12} r={1.8} fill="#a9a6ff" /></>}
    {i === 1 && <><circle cx={8} cy={12} r={5} fill="none" stroke="#a9a6ff" strokeWidth={2} /><circle cx={16} cy={12} r={5} fill="none" stroke="#a9a6ff" strokeWidth={2} /></>}
    {i === 2 && <path d="M3 4h5l4 7 4-7h5L12 21z" fill="#a9a6ff" />}
    {i === 3 && <path d="M12 3c3 4 6 6 9 7-3 1-6 3-9 11C9 13 6 11 3 10c3-1 6-3 9-7z" fill="#a9a6ff" />}
  </svg>
);

export const DotAdaptersBallsGroup: React.FC<{inputs?: AdapterInputs; extras?: number[]}> = ({inputs: x = ADAPTER_DEFAULT_INPUTS, extras = [0]}) => {
  const tt = useCurrentFrame() / FPS;
  const s = toSource(tt, DOT_ADAPTERS_BALLS_CONTRACT, extras) + S0;
  const held = tt - (s - S0);
  const rot = s * 0.55 + held * 0.55;
  const B1 = [{x: 1458, y: 648, r: 108}, {x: 1350, y: 276, r: 66}, {x: 972, y: 684, r: 84}, {x: 1782, y: 636, r: 84}];
  const B2 = [{x: 1346, y: 676, r: 105}, {x: 1384, y: 296, r: 66}, {x: 990, y: 656, r: 76}, {x: 1756, y: 676, r: 76}];
  const B3 = [{x: 1302, y: 678, r: 105}, {x: 1410, y: 288, r: 66}, {x: 990, y: 648, r: 76}, {x: 1758, y: 678, r: 76}];
  const bk = clamp((s - 25.0) / 1.6);
  const BB = B2.map((b, i) => ({x: mix(b.x, B3[i].x, bk), y: mix(b.y, B3[i].y, bk), r: b.r}));
  // 2026-11-19 逐帧重排 + 弹簧跟随（同 033-B）：卡片 22.9 碎成一条斜着的点流（右上→左下），23.1–23.3 收成一团斜的椭圆往左下走，
  //   23.4 起一颗颗球冒出来；结尾 26.5 起球不是散成大片云，而是原地变成三团毛毛的球（主团 1250,650）
  const rotC = (F: Form, cx: number, cy: number, deg: number): Form => { const c = Math.cos(deg * Math.PI / 180), sn = Math.sin(deg * Math.PI / 180); return F.map((d) => ({...d, x: cx + (d.x - cx) * c - (d.y - cy) * sn, y: cy + (d.x - cx) * sn + (d.y - cy) * c})); };
  const BBt = (t: number) => { const k = clamp((t - 25.0) / 1.6); return B2.map((b, i) => ({x: mix(b.x, B3[i].x, k), y: mix(b.y, B3[i].y, k), r: b.r})); };
  const fuzz = (F: Form, t: number, amt: number): Form => F.map((d, k) => ({...d, x: d.x + Math.sin(k * 12.9 + t * 9) * amt * (0.4 + (k % 7) / 7), y: d.y + Math.cos(k * 7.3 + t * 8) * amt * (0.4 + (k % 5) / 5)}));
  const REVEAL33 = [[[775, -150], [1795, -297], [1810, -47], [781, 41]], [[797, 131], [1837, 44], [1837, 288], [829, 327]], [[850, 410], [1837, 385], [1837, 600], [884, 586]], [[896, 660], [1835, 688], [1835, 877], [926, 821]]];
  const KC = (t: number): Key[] => [
    // 接上一段结尾：同一摞透视卡片（上一段 22.8 已经转到 −11°、还在加速），22.8 一开场就在快速碎开（光流：原片开头就是 50+）
    [22.8, () => quadCards(moveQuads(REVEAL33, 60, -30, -11)), {stagger: 0.3, drift: 60, ease: (v) => 1 - Math.pow(1 - Math.min(1, Math.max(0, v)), 1.6)}],
    [22.95, () => rotC(cloud(1180, 500, 230, 560, t, 11), 1180, 500, 32), {stagger: 0.25, drift: 40}],
    [23.2, () => rotC(cloud(1010, 610, 150, 340, t, 11), 1010, 610, 38), {stagger: 0.2, drift: 30}],
    [23.4, () => balls([{x: 1288, y: 195, r: 88}, {x: 1823, y: 438, r: 194}, {x: 923, y: 700, r: 110, sx: 1.7, ang: 1.15, a: 0.7}, {x: 1600, y: 300, r: 40, a: 0}], t * 0.55), {stagger: 0.15, drift: 25}],
    [23.8, () => balls(B1, t * 0.55), {stagger: 0.12, drift: 15}],
    [24.4, () => balls(BBt(t), t * 0.55), {hold: 2.1, stagger: 0.4, drift: 40}],
    [27.0, () => fuzz(balls([{x: 1050, y: 680, r: 125}, {x: 1325, y: 300, r: 55}, {x: 1745, y: 700, r: 70}], t * 0.55), t, 26)],
  ];
  const dots: Form = ambient(springForm('033C', s, 22.8, (t) => timeline(t, KC(t)), {omega: 13, zeta: 0.85, spread: 0.25, lead: 0.1}), s, 2.0);
  const lab = clamp((s - 24.2) / 0.3) * (1 - clamp((s - 26.05) / 0.25));
  const L = [0, 1, 2, 3].map((i) => ({b: BB[i], name: x.names[i]}));
  return (
    <AbsoluteFill style={{background: BG, overflow: 'hidden'}}>
      <DotCanvas dots={dots} />
      {lab > 0 && L.map((l, i) => (
        <div key={i} style={{position: 'absolute', left: l.b.x - 100, top: l.b.y + l.b.r + 16, width: 200, textAlign: 'center', opacity: lab, transform: `translateY(${(1 - lab) * 10}px)`}}>
          <Glyph i={i} />
          <div style={{fontFamily: SANS_EN, fontSize: 26, color: '#f0f0f3', marginTop: 4}}>{l.name}</div>
        </div>
      ))}
      <MaskLine text={x.title} x={144} y={534} size={112} color="#f2f2f4" inAt={23.75} outAt={26.3} s={s} />
    </AbsoluteFill>
  );
};

if (checkContract(DOT_ADAPTERS_BALLS_CONTRACT).length) throw new Error(checkContract(DOT_ADAPTERS_BALLS_CONTRACT).join('；'));
export const DotAdaptersBalls: React.FC = () => <DotAdaptersBallsGroup />;
