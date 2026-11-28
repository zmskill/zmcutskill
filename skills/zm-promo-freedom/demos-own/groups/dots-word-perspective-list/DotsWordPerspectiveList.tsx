// 【镜头组】dots-word-perspective-list：黑底先出半句，后半句的字从四散的彩色小点飞过来拼上 → 整句往上让开 →
//   下面一列深色作品卡片斜着放（上面近、下面远）一路往上滚、越滚越近，最后转成正面（013-F 一拍，证据：作品很多）
// 学的动作（mnowakdesign · 音乐 App 23.9–28.2s，30fps 逐帧量过，2026-11-21）：
//   24.0 前半句出现在 y≈534（左沿 576）；24.4–25.4 后半句的字一个个由粉色小方点飞到位、变成字，25.5 整句停稳（x 510–1389，字高 ≈135）
//   25.9–26.2 整句往上滑走淡掉；26.1 卡片从下面进来：一列卡片透视斜放，26.4 上面那张宽 735、往下 645 / 576 / 510（上近下远）
//   27.0 最上面那张宽 990（y≈84），往下 909 / 819 / 735；27.6 宽 1140 左右、几乎拉平；28.05 正面，每张 1140×130，行距 ≈158，一直往上滚
//   卡片：深灰圆角，左边彩色小图标，标题白、副标题灰，右边时间 + ···
// 我们的内容：「各种 / 格式」，卡片是中文的作品列表（歌 / 图 / 音频），右下角标"虚构 · 仅作演示"。
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {GroupContract, checkContract, checkInputs, outputDuration, planExtras, toSource} from '../../../assets/lib/helpers/groupClock';

const FPS = 30;
const S0 = 23.9;
const SANS = '"Inter","PingFang SC","Noto Sans CJK SC","Noto Sans SC",sans-serif';
const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const eo = (u: number) => 1 - Math.pow(1 - clamp(u), 3);
const eio = (u: number) => { const x = clamp(u); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
const hash = (n: number) => { const v = Math.sin(n * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };
const lin = (t: number, K: number[][]) => {
  if (t <= K[0][0]) return K[0][1];
  for (let i = 1; i < K.length; i++) if (t <= K[i][0]) { const [a, va] = K[i - 1], [b, vb] = K[i]; return va + (vb - va) * (t - a) / (b - a); }
  return K[K.length - 1][1];
};
const ITEMS = [['访谈片段', '15:30 · 音频', '昨天', 1], ['字体规范', '文档', '3 周前', 2], ['音乐小憩', '4:20 · 音频', '明天', 1], ['古典专注', '15:20 · 歌单', '3 天前', 0], ['可点原型', '交互稿', '昨天', 2], ['挑战素材', '8:00 · 音频', '今天', 1], ['劲爆流行曲', '03:45 · 音乐', '今天', 0], ['配色方案', '色板 · 图片', '1 天前', 2], ['幕后花絮', '5:00 · 音频', '昨天', 1], ['近期活动', '3:15 · 音频', '明天', 1], ['合成器之旅', '04:12 · 音乐', '2 天前', 0], ['雨声氛围', '10:00 · 环境音', '昨天', 0], ['产品草图', '1024×1024 · 图片', '2 天前', 2], ['听众问答', '7:50 · 音频', '今天', 1], ['用户流程图', '1200×900 · 图片', '3 天前', 2], ['专家分析', '10:05 · 音频', '明天', 1], ['图标集', '512×512 · 图片', '4 天前', 2], ['访谈片段', '15:30 · 音频', '昨天', 1], ['字体规范', '文档', '3 周前', 2], ['音乐小憩', '4:20 · 音频', '明天', 1], ['古典专注', '15:20 · 歌单', '3 天前', 0]] as [string, string, string, number][];
const ICOL = ['#ff3d7a', '#9a6aff', '#ff7a3d'];
// 第二轮（2026-11-23 用户：13 系列质感没学到）：原片卡片左边是带渐变的线形小图标（音乐 / 声波 / 图片），以前是纯色方块
const GR2 = [['#ff5a8a', '#d63dc4'], ['#a07aff', '#5a5aff'], ['#ffb03d', '#ff5a3d']];
const ListIcon: React.FC<{k: number; id: string}> = ({k, id}) => (
  <svg width={64} height={64} viewBox="0 0 24 24"><defs><linearGradient id={id} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={GR2[k][0]} /><stop offset="1" stopColor={GR2[k][1]} /></linearGradient></defs>
    {k === 0 && <><path d="M9 17V6l10-2v11" stroke={`url(#${id})`} strokeWidth="2.2" fill="none" strokeLinecap="round" /><circle cx="6.5" cy="17" r="2.6" fill={`url(#${id})`} /><circle cx="16.5" cy="15" r="2.6" fill={`url(#${id})`} /></>}
    {k === 1 && [4, 8, 12, 16, 20].map((x0, i) => <rect key={i} x={x0 - 1.1} y={12 - [3, 7, 9, 5, 2.5][i]} width="2.2" height={[6, 14, 18, 10, 5][i]} rx="1.1" fill={`url(#${id})`} />)}
    {k === 2 && <><rect x="3" y="4.5" width="18" height="15" rx="3.5" stroke={`url(#${id})`} strokeWidth="2.2" fill="none" /><circle cx="9" cy="10" r="1.8" fill={`url(#${id})`} /><path d="M4.5 18l5.5-5 4 3.5 2.5-2 3.5 3" stroke={`url(#${id})`} strokeWidth="2" fill="none" strokeLinejoin="round" /></>}
  </svg>
);

export const DOTS_LIST_CONTRACT: GroupContract = {
  sourceDuration: 129 / 30,
  fps: 30,
  motion: [[0, 1.65], [1.95, 129 / 30]],
  holds: [{at: 1.8, maxExtra: 1.2}],
  landmarks: {lead: 0.1, dots: 0.5, word: 1.6, up: 2.0, list: 2.2, flat: 4.1},
  sfx: [
    {at: 'dots', type: '轻tick', note: '一串 tick', tail: 0.9, volume: 0.25},
    {at: 'up', type: '短甩', note: '轻 whoosh', volume: 0.3},
    {at: 'list', type: '环境', note: '滚动 rumble', tail: 2.0, volume: 0.25},
  ],
  inputs: {lead: {maxChars: 3}, word: {maxChars: 3}},
};
export type DotsListInputs = {lead: string; word: string; note: string};
export const DOTS_LIST_DEFAULT_INPUTS: DotsListInputs = {lead: '各种', word: '格式', note: '虚构 · 仅作演示'};
export const checkDotsListInputs = (x: DotsListInputs) => checkInputs(DOTS_LIST_CONTRACT, {lead: x.lead, word: x.word});
export const planDotsList = (sec: number) => planExtras(DOTS_LIST_CONTRACT, sec);
export const dotsListFrames = (extras: number[]) => Math.round(outputDuration(DOTS_LIST_CONTRACT, extras) * FPS);
export const DOTS_LIST_DURATION = 129;

export const DotsWordPerspectiveListGroup: React.FC<{inputs?: DotsListInputs; extras?: number[]}> = ({inputs: x = DOTS_LIST_DEFAULT_INPUTS, extras = [0]}) => {
  const tt = useCurrentFrame() / FPS;
  const s = toSource(tt, DOTS_LIST_CONTRACT, extras) + S0;
  const els: React.ReactNode[] = [];
  // 句子
  if (s < 26.25) {
    const F = 150, up = eio((s - 25.9) / 0.3);
    const A = Array.from(x.lead), B = Array.from(x.word);
    const total = (A.length + B.length) * F + F * 0.3;
    const left0 = 960 - total / 2, y = 534 - up * 260;
    const op = 1 - clamp((s - 26.0) / 0.2);
    els.push(<div key="lead" style={{position: 'absolute', left: left0, top: y, transform: 'translateY(-50%)', fontFamily: SANS, fontSize: F, fontWeight: 600, color: '#fff', lineHeight: 1, opacity: op * clamp((s - 23.95) / 0.1)}}>{x.lead}</div>);
    B.forEach((c, i) => {
      const t0 = 24.4 + i * 0.35, k = eo((s - t0) / 0.5);
      if (s < t0 - 0.3) return;
      const cx = left0 + A.length * F + F * 0.3 + i * F;
      // 小点从四散处飞过来
      for (let j = 0; j < 6; j++) {
        const a = hash(i * 9 + j) * Math.PI * 2, r = 380 + hash(j + i) * 300;
        const px = cx + F / 2 + Math.cos(a) * r * (1 - k), py = y + Math.sin(a) * r * 0.6 * (1 - k);
        const dsz = 14 + hash(j * 3 + i) * 10;
        els.push(<div key={`p${i}_${j}`} style={{position: 'absolute', left: px - dsz / 2, top: py - dsz / 2, width: dsz, height: dsz, background: j % 3 ? '#ff3d7a' : '#ff8ab0', opacity: clamp((s - t0 + 0.3) / 0.15) * (1 - clamp((k - 0.7) / 0.3)) * op}} />);
      }
      els.push(<div key={'w' + i} style={{position: 'absolute', left: cx, top: y, transform: `translateY(-50%) scale(${0.6 + 0.4 * k})`, fontFamily: SANS, fontSize: F, fontWeight: 600, color: '#fff', lineHeight: 1, opacity: clamp((k - 0.5) / 0.5) * op}}>{c}</div>);
    });
  }
  // 透视列表（按屏幕上量到的位置 / 宽度插值：上面近、下面远，越往后越平）
  if (s >= 26.05) {
    const slot = lin(s, [[26.05, -2.5], [26.4, 0], [27.0, 6], [27.6, 10], [28.05, 12.3], [28.3, 13.2]]);
    const yb = lin(s, [[26.4, 15], [27.0, 84], [27.6, 60], [28.05, 30]]);
    const pitch = lin(s, [[26.4, 262], [27.0, 249], [27.6, 240], [28.05, 235]]);
    const w0 = lin(s, [[26.4, 735], [27.0, 990], [27.6, 1140], [28.05, 1140]]);
    const sh = lin(s, [[26.4, 0.12], [27.0, 0.085], [27.6, 0.02], [28.05, 0]]);
    ITEMS.forEach((it, k) => {
      const p = k - slot, y = yb + p * pitch;
      if (y < -200 || y > 1280) return;
      const W = w0 * Math.max(0.3, 1 - sh * Math.max(0, p)), sc = W / 1140;
      els.push(<div key={'c' + k} style={{position: 'absolute', left: 960 - 570, top: y - 95, width: 1140, height: 190, borderRadius: 40, background: '#2a2a2f', fontFamily: SANS, color: '#f2f2f2', transform: `scale(${sc})`, transformOrigin: '50% 50%', boxShadow: '0 10px 30px rgba(0,0,0,0.4)', opacity: clamp((s - 26.05) / 0.15)}}>
        <div style={{position: 'absolute', left: 48, top: 63}}><ListIcon k={it[3] as number} id={`li${k}`} /></div>
        <div style={{position: 'absolute', left: 150, top: 38, fontSize: 48, fontWeight: 500}}>{it[0]}</div>
        <div style={{position: 'absolute', left: 150, top: 104, fontSize: 34, color: '#9a9aa2'}}>{it[1]}</div>
        <div style={{position: 'absolute', right: 50, top: 70, fontSize: 36, color: '#b8b8c0'}}>{it[2]}　···</div>
      </div>);
    });
  }
  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      {els}
      <div style={{position: 'absolute', right: 36, bottom: 26, fontFamily: SANS, fontSize: 20, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.06em'}}>{x.note}</div>
    </AbsoluteFill>
  );
};

if (checkContract(DOTS_LIST_CONTRACT).length) throw new Error(checkContract(DOTS_LIST_CONTRACT).join('；'));
export const DotsWordPerspectiveList: React.FC = () => <DotsWordPerspectiveListGroup />;
