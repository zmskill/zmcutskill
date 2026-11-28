// 【镜头组】icon-closeup-pill-word-roll：青色底，品牌图标的局部特写滑过（推近 / 拉远）→ 一个椭圆胶囊从小撑大，里面左边一个三角播放键、中间一个词，
//   上下一列淡淡的前后词；词一个个往下滚进胶囊（滚的时候胶囊压扁、叠出几道残影外框）→ 停在最后一个词 → 方块错位切到下一段（014-F 一拍，枚举 / 讲价值观）
// 学的动作（Abstudiobrand · Neutron 21.3–26.3s，按 30fps 逐帧量过，2026-11-21）：
//   21.3–23.1 图标特写：21.35 巨大局部（白描边 + 锚点），21.8 拉远到整个图标（中心 890,540，边长 ≈460），22.0–23.0 又推近横移
//   21.3–21.85 巨大局部慢慢拉远，22.0–22.3 拉成整个图标（宽 ≈860），22.38 缩成一点，22.5–23.35 从下面巨大推上来；23.42 胶囊出现：666×212（中心 959,538，细线很淡），23.5 撑到 1134×280；停稳时 1134×≈370；当前词字号 ≈100，播放键在 x≈480–588
//   词列：行距 ≈250，当前词在胶囊里最亮，上面是下一个、下面是上一个（越远越淡越小）；整列往下滚：23.85 / 24.25 / 24.6 / 24.85 / 25.0 / 25.2 / 25.33 / 25.55 各换一个，越换越快
//   每次换词 0.15s：胶囊压扁到 ≈280 高、叠出 3–4 道残影外框，字纵向发虚；26.0 / 26.12 往回滚两格，26.12–26.3 方块错位把画面切成三格（下一段）
// 我们的内容：「信号 / 系统 / 连贯 / 智能 / 对齐 / 延续 / 结构 / 专注 / 清晰」，图标用 014-D 里自己画的三瓣旋涡，右下角标"虚构 · 仅作演示"。
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {GroupContract, checkContract, checkInputs, outputDuration, planExtras, toSource} from '../../../assets/lib/helpers/groupClock';

const FPS = 30;
const S0 = 21.3;
const TEAL = '#0f8f8e';
const DARK = '#1c2e24';
const MINT = '#9effca';
const MONO = '"Noto Sans Mono CJK SC","DejaVu Sans Mono",monospace';
const SANS = '"Noto Sans CJK SC","PingFang SC",sans-serif';
const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const eo = (u: number) => 1 - Math.pow(1 - clamp(u), 3);
const eio = (u: number) => { const x = clamp(u); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
const lin = (t: number, K: number[][]) => {
  if (t <= K[0][0]) return K[0][1];
  for (let i = 1; i < K.length; i++) if (t <= K[i][0]) { const [a, va] = K[i - 1], [b, vb] = K[i]; return va + (vb - va) * (t - a) / (b - a); }
  return K[K.length - 1][1];
};
const ROLL = [23.85, 24.25, 24.6, 24.85, 25.0, 25.2, 25.33, 25.55];

export const PILL_ROLL_CONTRACT: GroupContract = {
  sourceDuration: 150 / 30,
  fps: 30,
  motion: [[0, 4.45], [4.6, 5.0]],
  holds: [{at: 4.52, maxExtra: 1.5}],
  landmarks: {closeup: 0, pill: 2.0, roll: 2.55, last: 4.3, out: 4.65},
  sfx: [
    {at: 'closeup', type: '运镜', note: '慢 whoosh', volume: 0.25},
    {at: 'pill', type: '弹出', note: '弹出 pop', volume: 0.3},
    {at: 'roll', type: '轻tick', note: '滚动 tick 一串', tail: 1.8, volume: 0.25},
    {at: 'out', type: '短甩', note: '切换 cut', volume: 0.3},
  ],
  inputs: {words: {count: 9, maxChars: 3}},
};
export type PillRollInputs = {words: string[]; note: string};
export const PILL_ROLL_DEFAULT_INPUTS: PillRollInputs = {words: ['信号', '系统', '连贯', '智能', '对齐', '延续', '结构', '专注', '清晰'], note: '虚构 · 仅作演示'};
export const checkPillRollInputs = (x: PillRollInputs) => checkInputs(PILL_ROLL_CONTRACT, {words: x.words});
export const planPillRoll = (sec: number) => planExtras(PILL_ROLL_CONTRACT, sec);
export const pillRollFrames = (extras: number[]) => Math.round(outputDuration(PILL_ROLL_CONTRACT, extras) * FPS);
export const PILL_ROLL_DURATION = 150;

const Icon: React.FC<{size: number}> = ({size}) => (
  <svg width={size} height={size} viewBox="-50 -50 100 100" style={{overflow: 'visible'}}>
    {[0, 120, 240].map((a) => <path key={a} transform={`rotate(${a})`} d="M0 -38 C 22 -38 34 -18 26 2 C 20 -10 8 -16 -6 -14 C -2 -24 -2 -32 0 -38 Z" fill={DARK} stroke="#fff" strokeWidth={0.5} />)}
    <path d="M18 -4 L 30 2 L 18 8 Z" fill={MINT} />
    {[[0, -38], [26, 2], [-6, -14]].map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r={1.2} fill={MINT} />)}
  </svg>
);

export const IconCloseupPillWordRollGroup: React.FC<{inputs?: PillRollInputs; extras?: number[]}> = ({inputs: x = PILL_ROLL_DEFAULT_INPUTS, extras = [0]}) => {
  const tt = useCurrentFrame() / FPS;
  const s = toSource(tt, PILL_ROLL_CONTRACT, extras) + S0;
  const els: React.ReactNode[] = [];
  if (s < 23.4) {
    // 图标特写：慢慢拉远 → 22.0–22.3 拉成整个图标（宽 ≈860） → 22.38 缩成一点 → 22.5 从下面巨大地推上来 → 23.38 消失
    const size = lin(s, [[21.3, 2600], [21.85, 2000], [22.0, 1150], [22.3, 1100], [22.38, 40], [22.44, 40], [22.5, 1500], [23.35, 2300]]);
    const cx = lin(s, [[21.3, 300], [21.85, 600], [22.0, 960], [23.35, 900]]);
    const cy = lin(s, [[21.3, 300], [21.85, 360], [22.0, 540], [22.44, 540], [22.46, 1500], [22.6, 1350], [23.35, 900]]);
    if (s < 23.38) els.push(<div key="ic" style={{position: 'absolute', left: cx - size / 2, top: cy - size / 2, transform: `rotate(${(s - 21.3) * 12}deg)`}}><Icon size={size} /></div>);
    if (s < 21.6) els.push(<div key="mint" style={{position: 'absolute', left: lin(s, [[21.3, 1160], [21.6, 1920]]), top: 0, right: 0, bottom: 0, background: '#d5ffed'}} />);
  } else {
    // 连续“滚了几格” pos：每次往前滚 0.15s；26.0 / 26.12 往回滚两格（量过）
    const ev = [...ROLL.map((t) => [t, 1]), [26.0, -1], [26.12, -1]];
    let pos = 0, squash = 0;
    ev.forEach(([t0, d]) => { const u = (s - t0) / 0.15; pos += d * eio(u); if (u > 0 && u < 1) squash = Math.max(squash, Math.sin(Math.PI * u)); });
    const cur = Math.round(pos);
    const intro = eo((s - 23.45) / 0.2);
    const w = lin(s, [[23.42, 666], [23.62, 1134]]);
    const h = lin(s, [[23.42, 212], [23.62, 340]]) * (1 - 0.3 * squash);
    const pillO = clamp((s - 23.42) / 0.06);
    els.push(<svg key="pill" width={1920} height={1080} style={{position: 'absolute', inset: 0, opacity: pillO}}>
      <ellipse cx={959} cy={538} rx={w / 2} ry={h / 2} fill="none" stroke="#e8fff4" strokeOpacity={0.45 + 0.55 * intro} strokeWidth={3} />
      {squash > 0.05 && [-1, 1, -2, 2].map((k) => <ellipse key={k} cx={959} cy={538 + k * 6 * squash} rx={w / 2} ry={h / 2 - Math.abs(k) * 14 * squash} fill="none" stroke="#e8fff4" strokeOpacity={0.5} strokeWidth={1.5} />)}
      <path d={`M ${959 - w / 2 + 92} ${508} L ${959 - w / 2 + 148} ${538} L ${959 - w / 2 + 92} ${568} Q ${959 - w / 2 + 102} 538 ${959 - w / 2 + 92} 508 Z`} fill={MINT} opacity={intro} />
    </svg>);
    // 词列：下一个在上面，往下滚进胶囊
    x.words.forEach((wd, i) => {
      const rel = i - pos;
      const y = 538 - rel * 250;
      if (y < -120 || y > 1200) return;
      const isCur = i === cur;
      const d = Math.abs(rel);
      const fs = isCur ? lin(s, [[23.42, 60], [23.62, 104]]) : 62;
      const o = isCur ? 1 : d < 1.5 ? 0.72 : Math.max(0, 0.72 - (d - 1.5) * 0.9);
      els.push(<div key={'w' + i} style={{position: 'absolute', left: 0, right: 0, top: y, transform: `translateY(-50%) scaleY(${isCur ? 1 + 0.25 * squash : 1})`, textAlign: 'center', fontFamily: MONO, fontSize: fs, letterSpacing: '0.12em', color: isCur ? MINT : '#cfe9e0', opacity: o * pillO, filter: squash > 0.2 ? `blur(${squash * 2}px)` : undefined}}>{wd}</div>);
    });
    // 方块错位切到下一段
    if (s > 26.12) {
      const k = eio((s - 26.12) / 0.18);
      [[0, '#9effca'], [640, DARK], [1280, '#9effca']].forEach(([x0, c], i) => els.push(<div key={'b' + i} style={{position: 'absolute', left: x0 as number, top: i % 2 ? 1080 - 1080 * k : -1080 + 1080 * k, width: 641, height: 1080, background: c as string}} />));
    }
  }
  return (
    <AbsoluteFill style={{background: TEAL, overflow: 'hidden', backgroundImage: 'linear-gradient(rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.06) 1px, transparent 1px)', backgroundSize: '48px 48px'}}>
      {els}
      <div style={{position: 'absolute', right: 36, bottom: 26, fontFamily: SANS, fontSize: 20, color: 'rgba(230,255,245,0.45)', letterSpacing: '0.06em'}}>{x.note}</div>
    </AbsoluteFill>
  );
};

if (checkContract(PILL_ROLL_CONTRACT).length) throw new Error(checkContract(PILL_ROLL_CONTRACT).join('；'));
export const IconCloseupPillWordRoll: React.FC = () => <IconCloseupPillWordRollGroup />;
