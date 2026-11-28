// 【镜头组】dot-motion-chapters：一串四个"动效函数"的演示，全程用同一群点变来变去（033-B 一串，核心）
//   点阵球被风吹散 → 几颗小球 → 点云 → 拼成三张斜放的点线卡片往上升（rise()）→ 卡片散成横向的点、飞出右边，又从右边拼回来再往下退场（leave()）
//   → 点拼成斜着的大字「动起来」、摆正，第一个字散开重组成「活」（染紫）（morph()）→ 散开 → 四张卡片从上往下一张张被点"扫出来"（reveal()）
//   左边是函数名（从左往右擦出）+ 一行灰色说明，换章节时往上收走
// 学的动作（dwhitedesign · cube 4.8–22.8s，60fps 逐帧量过）：
//   4.8 球 → 5.3 斜着的一道点流 → 5.8 三颗小球 → 6.3 四颗 → 6.8 点云（1320,540）
//   7.3 卡片成形（900×200、间距 235、每张右移 20、左近右远的透视）：7.3 低 140px、斜 −9° → 8.3 低 20、−4° → 8.8 到位 −3°
//   9.8 卡片拉平散成横向点 → 10.3 飞出右边 → 10.4–10.9 从右边飞回（x 930、−5°）→ 11.9–12.6 往下掉、淡出
//   13.3 一小团点 → 13.8 斜 −15° 的字 → 14.3 −10° → 14.8 摆正（字高≈300，1320,510）→ 15.15–16.6 第一个字散开重组成新字、染紫
//   18.3 收成一小团 → 18.8 散成大片 → 19.6–22.2 四张卡（1060×240）从上往下一张张扫出 → 22.3 整体再斜一点
//   标题 130px 在 x=144：rise() 7.2–9.4 / leave() 11.2–12.65 / morph() 14.2–17.85 / reveal() 19.7–22.65
// 我们的内容：函数名保留（是代码），说明改中文；大字「动起来」→「活起来」。
import React from 'react';
import {smoothKf} from '../_kit/smoothKey';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {GroupContract, checkContract, checkInputs, outputDuration, planExtras, toSource} from '../../../assets/lib/helpers/groupClock';
import {CardSpec, DotCanvas, Form, Key, ambient, away, balls, cards, clamp, cloud, hash, eio, eo, mix, moveQuads, quadCards, springForm, sphere, timeline, wordForm} from '../_kit/dotField';
import {BG, SANS_EN} from '../dot-burst-sphere/DotBurstSphere';

const FPS = 30;
const S0 = 4.8;
export const DOT_MOTION_CHAPTERS_CONTRACT: GroupContract = {
  sourceDuration: 540 / 30,
  fps: 30,
  motion: [[0, 3.9], [4.1, 6.2], [6.4, 11.8], [12.0, 540 / 30]],
  holds: [{at: 4.0, maxExtra: 1.5}, {at: 6.3, maxExtra: 1.5}, {at: 11.9, maxExtra: 1.5}],
  landmarks: {scatter: 0, rise: 2.4, dissolve: 5.0, back: 5.6, leave: 7.1, word: 9.0, morph: 10.35, gather: 13.5, reveal: 14.8},
  sfx: [
    {at: 'scatter', type: '运镜', note: '粒子吹散 whoosh', volume: 0.45},
    {at: 'rise', type: '上扬铺垫', note: '上升 swell', volume: 0.35},
    {at: 'dissolve', type: '环境', note: '沙沙散开', volume: 0.35},
    {at: 'back', type: '运镜', note: '回收 whoosh', volume: 0.35},
    {at: 'leave', type: '运镜', note: '下落 whoosh', volume: 0.35},
    {at: 'word', type: '闪光', note: '聚合 shimmer', volume: 0.35},
    {at: 'morph', type: '闪光', note: '换字 sparkle', volume: 0.4},
    {at: 'reveal', type: '轻tick', note: '扫描 tick tick', tail: 2.4, volume: 0.3},
  ],
  inputs: {w1: {maxChars: 3}, w2: {maxChars: 3}},
};
export type ChapterInputs = {titles: [string, string][]; w1: string; w2: string};
export const CHAPTER_DEFAULT_INPUTS: ChapterInputs = {
  titles: [['rise()', '轻松登场。'], ['leave()', '干净退场。'], ['morph()', '从一个状态，变到下一个。'], ['reveal()', '进入视野时出现。']],
  w1: '动起来', w2: '活起来',
};
export const checkChapterInputs = (x: ChapterInputs) => checkInputs(DOT_MOTION_CHAPTERS_CONTRACT, {w1: x.w1, w2: x.w2});
export const planChapters = (sec: number) => planExtras(DOT_MOTION_CHAPTERS_CONTRACT, sec);
export const chapterFrames = (extras: number[]) => Math.round(outputDuration(DOT_MOTION_CHAPTERS_CONTRACT, extras) * FPS);
export const DOT_MOTION_CHAPTERS_DURATION = 540;

const kf = (t: number, K: number[][], e: (u: number) => number = eio) => { if (K.length > 2 && K.every((k, j) => j === 0 || k[0] > K[j - 1][0])) return smoothKf(t, K); if (t <= K[0][0]) return K[0][1]; for (let i = 0; i < K.length - 1; i++) if (t <= K[i + 1][0]) return mix(K[i][1], K[i + 1][1], e((t - K[i][0]) / (K[i + 1][0] - K[i][0]))); return K[K.length - 1][1]; };
const rotForm = (F: Form, cx: number, cy: number, deg: number): Form => { const c = Math.cos((deg * Math.PI) / 180), s = Math.sin((deg * Math.PI) / 180); return F.map((d) => ({...d, x: cx + (d.x - cx) * c - (d.y - cy) * s, y: cy + (d.x - cx) * s + (d.y - cy) * c})); };
const riseCards = (dy: number, x0 = 804): CardSpec[] => [0, 1, 2].map((i) => ({x: x0 + i * 40, y: 150 + i * 258 + dy, w: 900, h: 180}));
const leaveCards = (dy = 0): CardSpec[] => [0, 1, 2].map((i) => ({x: 930 + i * 15, y: 140 + i * 225 + dy * (1 + i * 0.3), w: 880, h: 190}));
const revealCards = (): CardSpec[] => [0, 1, 2, 3].map((i) => ({x: 800 + i * 15, y: -165 + i * 272, w: 1060, h: 200})); // 原片 22.4 量：卡高≈200、间距≈272

/** 章节标题（2026-11-19 按原片逐帧改）：不是整块从左往右擦出、整块往上收——而是一个字母一个字母从基线下面冒上来（每个错开 ≈0.07s，带一点转），
 *  收走时也是从左到右一个个往上缩进去（每个错开 ≈0.055s）；灰色说明晚 0.45s 才淡进来、比标题早 0.2s 淡掉 */
export const ChapterTitle: React.FC<{t: string; sub: string; inAt: number; outAt: number; s: number}> = ({t, sub, inAt, outAt, s}) => {
  const ch = Array.from(t);
  if (s < inAt || s > outAt + 0.25 + ch.length * 0.055) return null;
  const sa = eo(clamp((s - inAt - 0.45) / 0.3)) * (1 - clamp((s - outAt + 0.2) / 0.2));
  return (
    <>
      <div style={{position: 'absolute', left: 144, top: 528 - 110, height: 220, overflow: 'hidden', display: 'flex', fontFamily: SANS_EN, fontSize: 145, fontWeight: 500, color: '#f2f2f4', lineHeight: '220px', whiteSpace: 'pre', letterSpacing: '-0.015em'}}>
        {ch.map((c, i) => { const a = eo(clamp((s - inAt - 0.05 - i * 0.06) / 0.3)), b = eio(clamp((s - outAt - i * 0.055) / 0.2)); return <span key={i} style={{display: 'inline-block', transform: `translateY(${(1 - a) * 115 - b * 115}%) rotate(${(1 - a) * 8}deg)`, transformOrigin: '0% 100%'}}>{c}</span>; })}
      </div>
      <div style={{position: 'absolute', left: 148, top: 624, fontFamily: SANS_EN, fontSize: 34, color: '#a3a3aa', opacity: sa, whiteSpace: 'nowrap'}}>{sub}</div>
    </>
  );
};

export const DotMotionChaptersGroup: React.FC<{inputs?: ChapterInputs; extras?: number[]}> = ({inputs: x = CHAPTER_DEFAULT_INPUTS, extras = [0, 0, 0]}) => {
  const tt = useCurrentFrame() / FPS;
  const s = toSource(tt, DOT_MOTION_CHAPTERS_CONTRACT, extras) + S0;
  const held = tt - (s - S0);
  const rot = s * 0.55;
  const W1 = Array.from(x.w1), W2 = Array.from(x.w2);
  const changed = W1.map((c, i) => (c !== W2[i] ? 1 : 0));
  // 2026-11-19 卡片改成按原片量到的四个角摆（透视四边形：左高右矮、左右边是斜的；之前是矩形转个角、而且太扁，你说的「不是长方形」）
  //   RISE 量自 8.6s、LEAVE 量自 11.5s、REVEAL 量自 22.4s（原片 1920×1080 坐标）
  const RISE = [[[806, 188], [1700, 131], [1713, 325], [838, 415]], [[848, 493], [1720, 391], [1731, 578], [878, 712]], [[889, 790], [1737, 645], [1750, 824], [916, 997]]];
  const LEAVE = [[[922, 245], [1731, 78], [1758, 306], [950, 425]], [[960, 486], [1766, 384], [1791, 606], [988, 661]], [[996, 721], [1800, 681], [1822, 897], [1022, 892]]];
  const REVEAL = [[[775, -150], [1795, -297], [1810, -47], [781, 41]], [[797, 131], [1837, 44], [1837, 288], [829, 327]], [[850, 410], [1837, 385], [1837, 600], [884, 586]], [[896, 660], [1835, 688], [1835, 877], [926, 821]]];
  const revT = [[20.3, 21.0], [19.6, 20.0], [20.4, 21.2], [21.2, 22.0]]; // 原片是第 2 张（最上面完整的那张）先出来
  // 所有随时间变的量都写成 t 的函数：点阵用弹簧跟随（springForm），要能在任意时刻取目标造型
  const riseQ = (t: number) => moveQuads(RISE, 0, kf(t, [[7.3, 140], [8.3, 20], [8.8, 0]]), kf(t, [[7.3, -6], [8.3, -1], [8.8, 0]]));
  const leaveQ = (t: number) => { const dy = kf(t, [[11.95, 0], [12.4, 160]], (u) => u * u); return LEAVE.map((Q, i) => Q.map(([px, py]) => [px, py + dy * (1 + i * 0.3)])); };
  const revQ = (t: number) => moveQuads(REVEAL, kf(t, [[22.3, 0], [22.8, 60]], (u) => u * u), kf(t, [[22.3, 0], [22.8, -30]], (u) => u * u), kf(t, [[22.3, 0], [22.8, -11]], (u) => u * u)); // 原片结尾整摞越转越快（光流 22.4 起一路往上升）
  const flatQ = (dx: number) => moveQuads(RISE, dx, 0, 4); // 拉平（转正 4°）
  const riseA = (t: number) => kf(t, [[7.3, 0.4], [7.8, 0.82], [8.3, 1]]);
  const K = (t: number): Key[] => [
    [4.8, () => sphere(1300, 540, 345, t * 0.55), {stagger: 0.15, drift: 40}],
    [5.45, () => balls([{x: 583, y: 897, r: 195, sx: 1.25, ang: -0.5}, {x: 972, y: 420, r: 150, sx: 2.0, ang: 0.25, a: 0.55}, {x: 1523, y: 573, r: 178, sx: 1.2, ang: 0.3}, {x: 778, y: 217, r: 120, sx: 1.5, ang: 0.6, a: 0.5}], t * 0.55), {stagger: 0.12, drift: 30}],
    [6.0, () => balls([{x: 535, y: 774, r: 97, a: 0.8}, {x: 1328, y: 564, r: 97, a: 0.45}, {x: 1215, y: 612, r: 130}, {x: 810, y: 256, r: 81, a: 0.55}], t * 0.55), {stagger: 0.1, drift: 20}],
    [6.5, () => balls([{x: 502, y: 781, r: 113, a: 0.45}, {x: 1380, y: 560, r: 70, a: 0.25}, {x: 1296, y: 603, r: 146}, {x: 849, y: 214, r: 81, a: 0.35}], t * 0.55), {stagger: 0.15, drift: 30}],
    // 2026-11-19 逐帧：小球原地淡掉，大球散成一团「紧凑的暗点云」留在中间（6.8），7.0 起卡片在各自位置上一点点显出来、很暗，7.8 才亮起来
    [6.8, () => cloud(1290, 560, 330, 280, t, 3).map((d) => ({...d, a: d.a * 0.55})), {stagger: 0.3, drift: 40}],
    [7.15, () => quadCards(riseQ(t), [0.7, 0.35, 0.15], t).map((d) => ({...d, a: d.a * 0.35})), {stagger: 0.35, drift: 30}],
    [7.5, () => quadCards(riseQ(t)).map((d) => ({...d, a: d.a * riseA(t)})), {hold: 2.05, stagger: 0.4, drift: 20}],
    // 9.6 卡片原地碎成一横横跳动的点 → 9.9 一整块点 → 10.05 起整块往右加速滑出画面、变淡 → 10.4 点从右边飞回来 → 10.6 成块 → 10.72 拼成 leave 的卡片
    [9.9, () => quadCards(flatQ(20), [0.82, 0.82, 0.82], t), {stagger: 0.3, drift: 20}],
    [10.05, () => quadCards(flatQ(120), [0.82, 0.82, 0.82], t).map((d) => ({...d, a: d.a * 0.8})), {stagger: 0.1, drift: 0}],
    [10.3, () => quadCards(flatQ(1400), [0.82, 0.82, 0.82], t).map((d) => ({...d, a: 0})), {stagger: 0.1, drift: 0, stop: true}],
    [10.38, () => away(1100, 80, quadCards(leaveQ(10.8))).map((d) => ({...d, a: 0.5})), {stagger: 0.25, drift: 30}],
    [10.6, () => quadCards(leaveQ(t), [0.8, 0.8, 0.8], t), {stagger: 0.2, drift: 10}],
    [10.75, () => quadCards(leaveQ(t)), {hold: 1.15, stagger: 0.2, drift: 10}],
    // 2026-11-19 逐帧：leave 的卡片 11.95 起一边往下沉一边变暗，12.4 就没了（不是碎成亮点往下砸）；之后空 0.5s，12.95 才浮出很淡的一大片散点
    [12.4, () => quadCards(leaveQ(12.4)).map((d) => ({...d, a: 0})), {stagger: 0.1, drift: 0, stop: true}],
    [12.85, () => cloud(1320, 590, 460, 400, t, 5).map((d) => ({...d, a: 0})), {stagger: 0.1, drift: 0}],
    [13.05, () => cloud(1250, 640, 470, 390, t, 5).map((d) => ({...d, a: d.a * 0.4})), {stagger: 0.25, drift: 40}],
    [13.25, () => cloud(980, 720, 380, 300, t, 5).map((d) => ({...d, a: d.a * 0.35})), {stagger: 0.3, drift: 40}],
    // 2026-11-19 逐帧：散点原地淡没（13.35），右上角另起一小团亮点（13.45 在 1770,380）→ 13.6 飞到 (1590,505) → 13.75 成一块 → 13.9 拼成斜字
    [13.38, () => cloud(980, 720, 380, 300, t, 5).map((d) => ({...d, a: 0})), {stagger: 0.1, drift: 0, stop: true}],
    [13.42, () => cloud(1770, 380, 90, 80, t, 11).map((d) => ({...d, a: 0})), {stagger: 0.1, drift: 0}],
    [13.48, () => cloud(1760, 390, 110, 95, t, 11), {stagger: 0.15, drift: 20}],
    [13.62, () => cloud(1590, 505, 170, 130, t, 11), {stagger: 0.15, drift: 20}],
    [13.77, () => cloud(1300, 545, 330, 120, t, 11), {stagger: 0.2, drift: 20}],
    [13.92, () => wordForm(W1, 1300, 560, 300, -15, 16).map((d) => ({...d, s: 6.5})), {stagger: 0.1, drift: 0}],
    [14.5, () => wordForm(W1, 1290, 540, 300, -10, 16).map((d) => ({...d, s: 6.5})), {stagger: 0.1, drift: 0}],
    [14.8, () => wordForm(W1, 1320, 510, 300, 0, 16).map((d) => ({...d, s: 6.5})), {hold: 0.15, stagger: 0.35, drift: 280}],
    [16.6, () => wordForm(W2, 1320 - Math.max(0, t - 17.5) * 70, 510 + Math.max(0, t - 17.5) * 12, 300, 0, 16, changed).map((d) => ({...d, s: 6.5})), {hold: 1.55, stagger: 0.35, drift: 60}],
    // 2026-11-19 逐帧：字 18.2 碎开带紫 → 18.35 收成一条斜的亮点团 → 18.5 一小团飞到左上 → 18.62 原地没了 → 18.95 起底下冒出很淡的一大片散点 → 19.4 往右上聚，开始扫卡片
    [18.35, () => cloud(980, 500, 210, 85, t, 7).map((d) => ({...d, c: 0.6})), {stagger: 0.25, drift: 60}],
    [18.5, () => cloud(560, 330, 75, 70, t, 7).map((d) => ({...d, c: 0.3, a: d.a * 0.9})), {stagger: 0.2, drift: 30}],
    [18.62, () => cloud(560, 330, 75, 70, t, 7).map((d) => ({...d, a: 0})), {stagger: 0.1, drift: 0, stop: true}],
    [18.75, () => cloud(1100, 760, 900, 480, t, 9).map((d) => ({...d, a: 0})), {stagger: 0.1, drift: 0}],
    [19.05, () => cloud(1150, 680, 900, 500, t, 9).map((d) => ({...d, a: d.a * 0.35})), {stagger: 0.3, drift: 30}],
    [19.38, () => cloud(1450, 330, 650, 300, t, 9).map((d) => ({...d, a: d.a * 0.5})), {stagger: 0.3, drift: 30}],
    [19.55, () => quadCards(revQ(t), revT.map(([a, b]) => clamp((t - a) / (b - a))), t, 6, [880, 700, 1880, 1060]), {hold: 2.75, stagger: 0.2, drift: 20}],
    [22.8, () => quadCards(revQ(t), [1, 1, 1, 1])],
  ];
  // 弹簧跟随 + 极轻的环境微动：速度永远连续、到点自然减速、从不完全静止
  //   （光流对比：原片速度曲线是一个个平滑的大鼓包、从不归零；我们以前是一根根尖刺、中间是零——这就是「一卡一卡、不丝滑」）
  const dots: Form = ambient(springForm('033B', s, 4.8, (t) => timeline(t, K(t)), {omega: 13, zeta: 0.85, spread: 0.25, lead: 0.1}), s, 2.4);
  const T = x.titles;
  return (
    <AbsoluteFill style={{background: BG, overflow: 'hidden'}}>
      <DotCanvas dots={dots} />
      <ChapterTitle t={T[0][0]} sub={T[0][1]} inAt={7.2} outAt={9.25} s={s} />
      <ChapterTitle t={T[1][0]} sub={T[1][1]} inAt={11.0} outAt={12.45} s={s} />
      <ChapterTitle t={T[2][0]} sub={T[2][1]} inAt={14.02} outAt={17.65} s={s} />
      <ChapterTitle t={T[3][0]} sub={T[3][1]} inAt={19.33} outAt={22.38} s={s} />
      {held > 0 && null}
    </AbsoluteFill>
  );
};

if (checkContract(DOT_MOTION_CHAPTERS_CONTRACT).length) throw new Error(checkContract(DOT_MOTION_CHAPTERS_CONTRACT).join('；'));
export const DotMotionChapters: React.FC = () => <DotMotionChaptersGroup />;
