// 【镜头组】pills-out-progress-dashboard：上一拍的四条角色胶囊一条条往左甩出去 → 一张「项目进度」卡从右边滑到中间，清单一项项打勾、进度条往前涨 →
//   卡片缩回去变成整个项目页面里的一块（旁边浮出团队、动态、文件、反馈四块）→ 整页往上滑走（038-F 一拍，结果展示）
// 学的动作（NoorMalik · Teamflow 29.75–33.5s，30fps 逐帧量过，2026-11-21）：
//   29.8 / 29.93 / 30.06 / 30.2 四条胶囊依次往左甩出画（每条 0.3s）
//   30.15 进度卡从右边进来：30.25 左边 x856 → 30.5 x616（宽 834、高 505，中心 y≈570），之后慢慢放大到 1.1 倍（31.6）
//   清单：30.5–30.6 第一项打勾、30.9 第二项打勾；进度条 38% → 50% → 62%
//   32.0 整页（262–1650 × 68–991，白底圆角）淡淡出现，卡还比它在页里的位置大；32.0–32.3 卡缩进左上那一格（343–958 × 176–553），
//       其他三格：右上团队 + 最近动态、左下文件、右下团队反馈
//   33.1 起整页往上加速滑走，33.5 接 038-G
//   第二轮（用户：有卡顿）：逐帧量了四条胶囊左边缘（每 0.05s 一个点，见 PILL_X），原片是"一起慢慢起步、越走越快"，我们原来 0.26s 缓入缓出、一条条猛冲；
//   开头和 038-E 结尾的位置差（原片在 038-E 尾巴上已经开始动了）在前 0.12s 里慢慢吃掉；
//   进度卡是 30.05 从右边加速进来、30.2 起按 e^(−10.6t) 一路减速，不是 0.1s 冲到位；
//   缩进页面那一下集中在 31.75–32.25（速度峰 32.07），之前卡片是静止的；32.25 之后整页还有一点点放大收尾
// 我们的内容：中文项目页「重新设计新手引导」（清单、动态、文件、反馈都是中文），头像用素材库真人照片，右下角标"虚构 · 仅作演示"。
import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {GroupContract, checkContract, checkInputs, outputDuration, planExtras, toSource} from '../../../assets/lib/helpers/groupClock';

const FPS = 30;
const S0 = 29.75;
const SANS = '"PingFang SC","Noto Sans CJK SC","Noto Sans SC",sans-serif';
const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const eo = (u: number) => 1 - Math.pow(1 - clamp(u), 3);
const ei = (u: number) => Math.pow(clamp(u), 2.4);
const eio = (u: number) => { const x = clamp(u); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
const kf = (t: number, K: number[][], e: (u: number) => number = eio) => {
  if (t <= K[0][0]) return K[0][1];
  for (let i = 1; i < K.length; i++) if (t <= K[i][0]) { const [a, va] = K[i - 1], [b, vb] = K[i]; return va + (vb - va) * e((t - a) / (b - a)); }
  return K[K.length - 1][1];
};
export const PILLS_OUT_DASH_CONTRACT: GroupContract = {
  sourceDuration: 113 / 30,
  fps: 30,
  motion: [[0, 1.3], [1.4, 2.6], [3.35, 113 / 30]],
  holds: [{at: 1.35, maxExtra: 1.5}, {at: 3.0, maxExtra: 2.5}],
  landmarks: {out: 0.05, card: 0.4, tick1: 0.8, tick2: 1.15, page: 2.25, up: 3.35},
  sfx: [
    {at: 'out', type: '短甩', note: '甩出 whoosh', volume: 0.35},
    {at: 'card', type: '短甩', note: '卡片滑入 swish', volume: 0.35},
    {at: 'tick1', type: '轻tick', note: '打勾 tick', volume: 0.3}, {at: 'tick2', type: '轻tick', note: '打勾 tick', volume: 0.3},
    {at: 'page', type: '上扬铺垫', note: '拉远 swell', volume: 0.35},
  ],
  inputs: {title: {maxChars: 10}, tasks: {count: 4, maxChars: 7}},
};
export type DashInputs = {roles: string[]; faces: string[]; title: string; tasks: string[]; note: string};
export const PILLS_DASH_DEFAULT_INPUTS: DashInputs = {roles: ['UI/UX 设计师', '前端开发', '产品经理', '增长专家'], faces: ['f01', 'm06', 'f04', 'm15'], title: '重新设计新手引导', tasks: ['明确用户目标', '梳理用户流程', '设计关键页面', '前端开发'], note: '虚构 · 仅作演示'};
export const checkPillsDashInputs = (x: DashInputs) => checkInputs(PILLS_OUT_DASH_CONTRACT, {title: x.title});
export const planPillsDash = (sec: number) => planExtras(PILLS_OUT_DASH_CONTRACT, sec);
export const pillsDashFrames = (extras: number[]) => Math.round(outputDuration(PILLS_OUT_DASH_CONTRACT, extras) * FPS);
export const PILLS_OUT_DASH_DURATION = 113;

const Face: React.FC<{id: string; s: number}> = ({id, s}) => <div style={{width: s, height: s, borderRadius: '50%', overflow: 'hidden', flex: 'none', background: '#ddd'}}><Img src={staticFile(`library/faces/${id}.jpg`)} style={{width: '100%', height: '100%', objectFit: 'cover'}} /></div>;
const Tick: React.FC<{k: number; s: number}> = ({k, s}) => (
  <div style={{width: s, height: s, borderRadius: '50%', border: `${s * 0.09}px solid #2a2a30`, boxSizing: 'border-box', background: k > 0 ? `conic-gradient(#2a2a30 ${k * 360}deg, transparent 0deg)` : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: s * 0.6, fontWeight: 700, flex: 'none'}}>{k >= 1 ? '✓' : ''}</div>
);
/** 进度卡：834×505 的设计尺寸 */
const ProgressCard: React.FC<{s: number; x: DashInputs; faces: string[]}> = ({s, x, faces}) => {
  const bar = kf(s, [[30.2, 0.38], [30.6, 0.5], [31.0, 0.62]]);
  const ticks = [eo((s - 30.48) / 0.12), eo((s - 30.85) / 0.12), 0, 0];
  return (
    <div style={{width: 834, height: 505, borderRadius: 16, background: '#efeeef', position: 'relative', fontFamily: SANS, color: '#22232a', boxShadow: '0 12px 40px rgba(120,20,40,0.12)'}}>
      <div style={{position: 'absolute', left: 70, top: 46, fontSize: 26, color: '#555'}}>总览</div>
      <div style={{position: 'absolute', left: 70, top: 86, fontSize: 36, fontWeight: 600}}>项目进度</div>
      <div style={{position: 'absolute', left: 60, top: 162, width: 580, height: 16, borderRadius: 8, background: '#d8d6d8'}}><div style={{width: `${bar * 100}%`, height: '100%', borderRadius: 8, background: '#5fcf5f'}} /></div>
      {x.tasks.map((t, i) => (
        <div key={i} style={{position: 'absolute', left: 64, right: 64, top: 222 + i * 62, display: 'flex', alignItems: 'center', gap: 24, fontSize: 26}}>
          <Tick k={ticks[i]} s={46} /><span style={{flex: 1}}>{t}</span><Face id={faces[i]} s={44} />
        </div>
      ))}
    </div>
  );
};

// 原片四条胶囊左边缘 x（1920 画面），从 29.75 起每 0.05s 一个点
const PILL_X = [
  [200, 100, -330, -900],
  [612, 560, 370, 221, -300, -900],
  [480, 468, 443, 406, 347, 295, 111, -74, -600],
  [768, 775, 760, 738, 686, 664, 553, 480, 207, -37, -480, -950],
];
const cr = (t: number, arr: number[]) => { // Catmull-Rom，过了表尾按最后的速度继续走
  const u = (t - 29.75) / 0.05, n = arr.length;
  if (u <= 0) return arr[0];
  if (u >= n - 1) return arr[n - 1] + (arr[n - 1] - arr[n - 2]) * (u - n + 1);
  const i = Math.floor(u), f = u - i, P = (k: number) => arr[Math.max(0, Math.min(n - 1, k))];
  const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2);
  return 0.5 * (2 * p1 + (-p0 + p2) * f + (2 * p0 - 5 * p1 + 4 * p2 - p3) * f * f + (-p0 + 3 * p1 - 3 * p2 + p3) * f * f * f);
};
export const PillsOutProgressDashboardGroup: React.FC<{inputs?: DashInputs; extras?: number[]}> = ({inputs: x = PILLS_DASH_DEFAULT_INPUTS, extras = [0, 0]}) => {
  const tt = useCurrentFrame() / FPS;
  const s = toSource(tt, PILLS_OUT_DASH_CONTRACT, extras) + S0;
  const held = tt - (s - S0);
  const bg = 'linear-gradient(180deg, #ffffff 0%, #ffffff 30%, #fbd3d8 62%, #f4919b 100%)';
  const ROWY = [218, 421, 626, 834], ROWX = [510, 788, 510, 788];
  // 卡片：中心 + 缩放（30.15 从右边进来 → 中间 → 32.0–32.3 缩进页面左上那一格）
  const shr = eio((s - 31.75) / 0.5); // 缩进页面左上那一格
  const herm = (t: number, t0: number, t1: number, p0: number, p1: number, v0: number, v1: number) => { const h = t1 - t0, u = (t - t0) / h, u2 = u * u, u3 = u2 * u; return (2 * u3 - 3 * u2 + 1) * p0 + (u3 - 2 * u2 + u) * h * v0 + (-2 * u3 + 3 * u2) * p1 + (u3 - u2) * h * v1; };
  // 进度卡横向：30.05–30.2 先加速进来（Hermite），30.2 起按 e^(−10.6t) 减速（原片 30.2 / 30.3 / 30.4 / 30.5 中心 1562 / 1194 / 1082 / 1030）
  const cxIn = s < 30.05 ? 2400 : s < 30.2 ? herm(s, 30.05, 30.2, 2400, 1562, -5000, -5957) : 1000 + 562 * Math.exp(-10.6 * (s - 30.2));
  const ccx = cxIn * (1 - shr) + 650 * shr;
  const ccy = kf(s, [[30.1, 571], [30.6, 566], [31.0, 560], [31.7, 553]]) * (1 - shr) + 365 * shr;
  const csc = (kf(s, [[30.5, 1.0], [31.0, 1.02], [31.7, 1.1]]) * (1 - shr) + 0.737 * shr) * (1 + held * 0.004);
  const settle = 0.985 + 0.015 * eo((s - 32.2) / 0.5); // 缩完整页再轻轻放大一点收尾
  const page = clamp((s - 31.9) / 0.4);
  const up = -ei((s - 33.1) / 0.4) * 520 - Math.max(0, s - 33.5) * 1800;
  const faces5 = ['m15', 'f04', 'm06', 'f01', 'm02'];
  const MOD: React.CSSProperties = {position: 'absolute', borderRadius: 18, background: '#efeeef', fontFamily: SANS, color: '#22232a', boxSizing: 'border-box'};
  return (
    <AbsoluteFill style={{background: bg, overflow: 'hidden', fontFamily: SANS}}>
      {/* 胶囊往左甩出去 */}
      {s < 30.6 && x.roles.map((r, i) => {
        const catchUp = 1 - eo((s - 29.75) / 0.12);
        const dx = cr(s, PILL_X[i]) + (ROWX[i] - PILL_X[i][0]) * catchUp - ROWX[i];
        if (ROWX[i] + dx < -620) return null;
        const redLeft = i % 2 === 0;
        return (
          <div key={i} style={{position: 'absolute', left: ROWX[i] + dx, top: ROWY[i] - 65, width: 560, height: 130, borderRadius: 65, background: redLeft ? 'linear-gradient(90deg, #d0000f 0%, #8c0008 50%, #1f0003 100%)' : 'linear-gradient(90deg, #1f0003 0%, #8c0008 50%, #e0001a 100%)', boxShadow: '0 10px 26px rgba(120,0,10,0.25)'}}>
            <div style={{position: 'absolute', left: 11, top: 11, width: 108, height: 108, borderRadius: '50%', overflow: 'hidden', border: `4px solid ${redLeft ? '#e3101f' : '#2a0306'}`, boxSizing: 'border-box'}}><Img src={staticFile(`library/faces/${x.faces[i]}.jpg`)} style={{width: '100%', height: '100%', objectFit: 'cover'}} /></div>
            <div style={{position: 'absolute', left: 150, top: 0, height: 130, display: 'flex', alignItems: 'center', fontSize: 40, fontWeight: 500, color: '#fff', whiteSpace: 'nowrap'}}>{r}</div>
          </div>
        );
      })}
      <div style={{position: 'absolute', inset: 0, transform: `translateY(${up}px) scale(${s > 32.2 ? settle : 0.985})`}}>
        {/* 整页 */}
        {page > 0 && (
          <div style={{position: 'absolute', left: 262, top: 68, width: 1388, height: 923, borderRadius: 34, background: `rgba(255,255,255,${0.35 + 0.65 * page})`, boxShadow: `0 20px 60px rgba(160,40,60,${0.15 * page})`}}>
            <div style={{position: 'absolute', left: 84, top: 44, fontSize: 34, fontWeight: 600, color: `rgba(34,35,42,${0.3 + 0.7 * page})`}}>{x.title}</div>
            <div style={{opacity: clamp((s - 32.05) / 0.25)}}>
              <div style={{...MOD, left: 723, top: 113, width: 603, height: 367, padding: '28px 34px'}}>
                <div style={{fontSize: 20, color: '#555'}}>团队</div>
                <div style={{display: 'flex', gap: 6, marginTop: 12, alignItems: 'center'}}>{faces5.map((f, i) => <Face key={i} id={f} s={52} />)}<div style={{width: 52, height: 52, borderRadius: '50%', background: '#fff', fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>+5</div></div>
                <div style={{fontSize: 26, fontWeight: 600, marginTop: 18}}>最近动态</div>
                {['小雨 添加了一个新任务', '阿杰 分享了一个设计文件'].map((t, i) => <div key={i} style={{display: 'flex', alignItems: 'center', gap: 18, marginTop: 22, fontSize: 22}}><div style={{width: 30, height: 30, borderRadius: 6, background: '#d6d4d6'}} />{t}</div>)}
              </div>
              <div style={{...MOD, left: 97, top: 521, width: 605, height: 364, padding: '28px 34px'}}>
                <div style={{fontSize: 20, color: '#555'}}>文件</div>
                {['引导流程.fig', '产品文案.doc', '用户调研.pdf', '最终设计.fig'].map((t, i) => <div key={i} style={{display: 'flex', alignItems: 'center', gap: 22, marginTop: 24, fontSize: 22}}><div style={{width: 26, height: 32, borderRadius: 4, background: i % 3 === 0 ? '#ef5a3c' : '#2a2a30'}} /><span style={{flex: 1}}>{t}</span><span style={{fontSize: 26, letterSpacing: 2}}>•••</span></div>)}
              </div>
              <div style={{...MOD, left: 750, top: 531, width: 603, height: 365, padding: '28px 34px'}}>
                <div style={{fontSize: 20, color: '#555'}}>团队反馈</div>
                <div style={{position: 'absolute', left: 40, top: 70, width: 420, padding: '18px 22px', borderRadius: 12, background: '#fff', fontSize: 21, lineHeight: 1.5}}><b>小雨 · 产品设计</b><br />新流程清楚多了</div>
                <div style={{position: 'absolute', left: 140, top: 210, width: 420, padding: '18px 22px', borderRadius: 12, background: '#fff', fontSize: 21, lineHeight: 1.5}}><b>阿杰 · 产品经理</b><br />这一步能不能再简化？</div>
              </div>
            </div>
          </div>
        )}
        {s > 30.04 && <div style={{position: 'absolute', left: ccx - 417, top: ccy - 252, transform: `scale(${csc})`, transformOrigin: '50% 50%'}}><ProgressCard s={s} x={x} faces={['m15', 'f04', 'm06', 'f01']} /></div>}
      </div>
      <div style={{position: 'absolute', right: 36, bottom: 26, fontSize: 20, color: 'rgba(120,30,40,0.45)', letterSpacing: '0.06em'}}>{x.note}</div>
    </AbsoluteFill>
  );
};

if (checkContract(PILLS_OUT_DASH_CONTRACT).length) throw new Error(checkContract(PILLS_OUT_DASH_CONTRACT).join('；'));
export const PillsOutProgressDashboard: React.FC = () => <PillsOutProgressDashboardGroup />;
