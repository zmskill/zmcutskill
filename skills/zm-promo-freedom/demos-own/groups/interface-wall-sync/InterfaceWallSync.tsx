// 【镜头组】interface-wall-sync：一整面斜铺的产品界面墙从虚里浮出来、往左上滑、一路减速慢漂；上方两句好处逐词出现；最后整个画面猛地变虚过曝到白（023-H 一拍，接 logo-check-build-cta）
// 学的动作（baseTOP × Taskly 48.05–52.55s，60fps 逐帧看过；时间表 （内部拆片记录，未随项目提供））：
//   界面墙：约 15 块界面排成斜行，整面往右上倾、带一点俯视透视；虚 10px → 0、透明 0 → 1 的同时从右下往左上滑，0.25–1.4s 是主要滑动段，之后长尾慢漂、一直在减速；
//   大字逐词出现在最终位置（灰、虚、略低 → 黑、实）；第二行斜体品牌蓝；
//   出口：0.15s 内整个画面变虚 + 过曝，白到底（下一镜硬切品牌色）。
// 我们的内容：「小周」的各种界面（首页、看板、日历、手机待办、蓝色横幅"轻松管好每件事"）；大字"网页、手机、平板，/ 随时都同步。"
//
// 拍表（源秒，30fps）
//   拍 1 墙浮现 + 逐词  0.05–1.40   墙 0.05 起、第一行 0.25、第二行 0.55
//   拍 2 慢漂           1.40–4.30   （停留点 3.60：读字看墙）
//   拍 3 出口           4.20–4.50   变虚过曝到白
// 毛病清单：
//   - 通用：画面永远不停（墙按输出秒也在漂）；--hq 渲染；确定性
//   - 独有 1：墙的上沿淡进底色，不能有一条硬边压在字下面
//   - 独有 2：慢漂一直在减速但不停死；停留时墙按输出秒继续漂
//   - 独有 3：出口最后一帧是纯白，下一镜第一帧可以直接硬切
//   - 独有 4（2026-11-12 用户："角度不一样呀"）：墙的机位是 rotateX 50° + rotateZ −18°——行往右上抬约 12°，界面竖边往右下斜约 63°、被压扁约 1/3（按原片仪表盘和手机两块界面的四条边量出来的）；
//     这是从原片两条边的方向反算出来的（横边斜率 = tanZ·cosX，竖边斜率 = cosX / −tanZ），别凭感觉改
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {FONT, Grain, Vignette, mix} from '../../../assets/lib/helpers/polish';
import {GroupContract, checkContract, checkInputs, outputDuration, planExtras, toSource} from '../../../assets/lib/helpers/groupClock';
import {homCss} from '../../../assets/lib/helpers/plane';
import {WALL_G} from './wall-g';
// 源秒 s → 屏幕单应；停留（hd>0）时按最后的漂移速度继续慢漂，不停死
const wallG = (s: number, hd: number): number[] => {
  const Q = WALL_G, n = Q.length;
  const lerp = (a: number[], b: number[], k: number) => a.map((v, j) => v + (b[j] - v) * k);
  let H: number[];
  if (s <= Q[0][0]) H = Q[0].slice(1);
  else if (s >= Q[n - 1][0]) H = Q[n - 1].slice(1);
  else { let i = 0; while (Q[i + 1][0] < s) i++; H = lerp(Q[i].slice(1), Q[i + 1].slice(1), (s - Q[i][0]) / (Q[i + 1][0] - Q[i][0])); }
  if (hd > 0) { const a = Q[n - 8].slice(1), b = Q[n - 1].slice(1), dt = Q[n - 1][0] - Q[n - 8][0]; H = H.map((v, j) => v + (b[j] - a[j]) / dt * hd); }
  return H;
};

const FPS = 30;
const SANS = `"PingFang SC", "Noto Sans CJK SC", "Noto Sans SC", ${FONT.sans}`;
const INK = '#141826';
const LIME = '#d3f454';
const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const sm = (x: number) => { const c = clamp(x); return c * c * (3 - 2 * c); };
const rp = (t: number, a: number, b: number) => sm((t - a) / (b - a));
const eo = (t: number, a: number, b: number) => { const c = clamp((t - a) / (b - a)); return 1 - Math.pow(1 - c, 3); };
const hex = (c: string) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
const mixc = (a: string, b: string, k: number) => { const A = hex(a), B = hex(b); return `rgb(${A.map((v, i) => Math.round(mix(v, B[i], clamp(k)))).join(',')})`; };
type P = [number, number][];
const trk = (t: number, pts: P) => {
  const n = pts.length;
  if (t <= pts[0][0]) return pts[0][1];
  if (t >= pts[n - 1][0]) return pts[n - 1][1];
  const d: number[] = [];
  for (let k = 0; k < n - 1; k++) d.push((pts[k + 1][1] - pts[k][1]) / (pts[k + 1][0] - pts[k][0]));
  const m: number[] = [d[0]];
  for (let k = 1; k < n - 1; k++) m.push(d[k - 1] * d[k] <= 0 ? 0 : (d[k - 1] + d[k]) / 2);
  m.push(d[n - 2]);
  for (let k = 0; k < n - 1; k++) {
    if (d[k] === 0) { m[k] = 0; m[k + 1] = 0; continue; }
    const a = m[k] / d[k], b = m[k + 1] / d[k], s = a * a + b * b;
    if (s > 9) { const tau = 3 / Math.sqrt(s); m[k] = tau * a * d[k]; m[k + 1] = tau * b * d[k]; }
  }
  let i = 0;
  while (t > pts[i + 1][0]) i++;
  const [x0, y0] = pts[i], [x1, y1] = pts[i + 1];
  const h = x1 - x0, u = (t - x0) / h, u2 = u * u, u3 = u2 * u;
  return (2 * u3 - 3 * u2 + 1) * y0 + (u3 - 2 * u2 + u) * h * m[i] + (-2 * u3 + 3 * u2) * y1 + (u3 - u2) * h * m[i + 1];
};

// ═════════ 合同 ═════════
export const INTERFACE_WALL_SYNC_CONTRACT: GroupContract = {
  sourceDuration: 135 / 30, // 4.5s
  fps: 30,
  motion: [[0, 1.4], [4.15, 135 / 30]],
  holds: [{at: 3.6, maxExtra: 2.0}], // 读字、看墙（墙按输出秒继续漂）
  landmarks: {wall: 0.05, line1: 0.25, line2: 0.55, read: 0.9, flash: 4.2, white: 135 / 30},
  sfx: [
    {at: 'wall', type: '运镜', note: '柔和长 whoosh（墙浮现滑入）', tail: 1.2, volume: 0.35},
    {at: 'line1', type: '轻tick', note: '轻柔 tick 串（逐词）', tail: 0.6, volume: 0.2},
    {at: 'flash', offset: -0.1, type: '上扬铺垫', note: '上扬 riser + 白闪（切在最白处）', tail: 0.3, volume: 0.45},
  ],
  inputs: {
    line1: {maxChars: 10},
    line2: {maxChars: 8},
    banner: {maxChars: 8},
  },
};
export type WallInputs = {
  line1: string[]; // 第一行按词切（逐词出现），合计 ≤10 字
  line2: string[]; // 第二行按词切，合计 ≤8 字
  banner: string; // 墙上那块蓝色大横幅的标语
  brandColor?: string;
};
export const WALL_DEFAULT_INPUTS: WallInputs = {
  line1: ['网页、', '手机、', '平板，'],
  line2: ['随时', '都同步。'],
  banner: '轻松管好每件事',
};
export function checkWallInputs(x: WallInputs): string[] {
  return checkInputs(INTERFACE_WALL_SYNC_CONTRACT, {line1: x.line1.join(''), line2: x.line2.join(''), banner: x.banner});
}
export const planWall = (sec: number) => planExtras(INTERFACE_WALL_SYNC_CONTRACT, sec);
export const wallFrames = (extras: number[]) => Math.round(outputDuration(INTERFACE_WALL_SYNC_CONTRACT, extras) * FPS);
export const INTERFACE_WALL_SYNC_DURATION = 135;

// ═════════ 背景（和 023-B / C / D 同一张底）═════════
const Backdrop: React.FC<{t: number}> = ({t}) => {
  const dr = t * 0.32;
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: 'linear-gradient(180deg, #e8ebfb 0%, #eef0fb 38%, #f2f4fa 68%, #f6f8f4 100%)'}}>
      <AbsoluteFill style={{background: `radial-gradient(ellipse 34% 46% at ${78 - dr}% 6%, rgba(190,198,250,0.85) 0%, rgba(197,204,251,0) 100%)`}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 40% 42% at 8% 96%, rgba(226,243,190,0.9) 0%, rgba(233,244,205,0) 100%)'}} />
      <Vignette strength={0.08} color="#3a3f6a" inner={0.55} />
      <Grain opacity={0.035} />
    </AbsoluteFill>
  );
};

// ═════════ 大字（逐词，出现在最终位置）═════════
const HF = 96;
const textW = (s: string) => Array.from(s).reduce((a, c) => a + (/[\u0000-ÿ]/.test(c) ? 0.56 : 1) * HF, 0);
const WordLine: React.FC<{s: number; words: string[]; t0: number; step: number; cy: number; col: string; italic?: boolean}> = ({s, words, t0, step, cy, col, italic}) => {
  const ws = words.map(textW);
  let acc = 960 - ws.reduce((a, b) => a + b, 0) / 2;
  return (
    <>
      {words.map((w, i) => {
        const left = acc; acc += ws[i];
        const ti = t0 + i * step;
        if (s < ti) return null;
        const k = eo(s, ti, ti + 0.11), ink = rp(s, ti + 0.02, ti + 0.14);
        return (
          <span key={i} style={{position: 'absolute', left, top: cy - HF * 0.66, fontSize: HF, lineHeight: `${HF * 1.32}px`, fontWeight: 600, fontFamily: SANS, whiteSpace: 'pre',
            color: mixc(italic ? '#c4c7f6' : '#9ea2b4', col, ink), opacity: 0.2 + 0.8 * clamp(k * 1.3), filter: k < 0.98 ? `blur(${(5 * (1 - k)).toFixed(2)}px)` : undefined,
            transform: `translateY(${(5 * (1 - k)).toFixed(2)}px)${italic ? ' skewX(-9deg)' : ''}`}}>{w}</span>
        );
      })}
    </>
  );
};

// ═════════ 界面墙 ═════════
const Line: React.FC<{x: number; y: number; w: number; c?: string; h?: number}> = ({x, y, w, c = '#e6e8f0', h = 7}) => <div style={{position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: h, background: c}} />;
const Chip: React.FC<{x: number; y: number; c: string}> = ({x, y, c}) => <div style={{position: 'absolute', left: x, top: y, width: 9, height: 9, borderRadius: 9, background: c}} />;
const T: React.FC<{x: number; y: number; s: number; c?: string; w?: number; children: React.ReactNode}> = ({x, y, s, c = INK, w = 600, children}) => (
  <div style={{position: 'absolute', left: x, top: y, fontSize: s, fontWeight: w, color: c, whiteSpace: 'pre', fontFamily: SANS}}>{children}</div>
);
type Kind = 'dash' | 'team' | 'task' | 'board' | 'cal' | 'phone' | 'banner' | 'list' | 'dark';
const Screen: React.FC<{kind: Kind; w: number; h: number; blue: string; banner: string; seed: number}> = ({kind, w, h, blue, banner, seed}) => {
  const base: React.CSSProperties = {position: 'relative', width: w, height: h, borderRadius: kind === 'phone' ? 34 : 18, overflow: 'hidden',
    background: kind === 'banner' ? `linear-gradient(135deg, ${blue} 0%, #4d5cf5 55%, #8fa0ff 100%)` : kind === 'dark' ? '#15171f' : '#fff',
    boxShadow: '0 2px 4px rgba(40,50,120,0.05), 0 24px 50px rgba(50,60,150,0.12)', border: kind === 'phone' ? '6px solid #1a1c24' : '1px solid #eceef5'};
  const rows = (x0: number, y0: number, n: number, ww: number) => Array.from({length: n}, (_, i) => (
    <React.Fragment key={i}>
      <div style={{position: 'absolute', left: x0, top: y0 + i * 30, width: 12, height: 12, borderRadius: 12, border: '2px solid #c9ccd8'}} />
      <Line x={x0 + 22} y={y0 + i * 30 + 3} w={ww * (0.45 + 0.25 * ((seed + i) % 3) / 2)} c="#d9dce7" />
      <Chip x={x0 + ww * 0.8} y={y0 + i * 30 + 2} c={['#835ff4', blue, '#9dc031', '#f39a3c'][(seed + i) % 4]} />
    </React.Fragment>
  ));
  if (kind === 'banner') return (
    <div style={base}>
      <div style={{position: 'absolute', left: 26, top: 24, display: 'flex', alignItems: 'center', gap: 8}}><div style={{width: 22, height: 22, borderRadius: 6, background: 'rgba(255,255,255,0.9)'}} /><T x={30} y={-1} s={15} c="#fff" w={600}>小周</T></div>
      <div style={{position: 'absolute', left: '50%', top: 22, marginLeft: -150, width: 300, height: 30, borderRadius: 30, background: 'rgba(10,14,60,0.35)', display: 'flex', justifyContent: 'space-around', alignItems: 'center', fontFamily: SANS, fontSize: 12, color: 'rgba(255,255,255,0.85)'}}>
        <span style={{background: '#15171f', padding: '4px 10px', borderRadius: 20}}>首页</span><span>功能</span><span>价格</span><span>关于</span>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 120, textAlign: 'center', fontFamily: SANS, fontSize: 60, fontWeight: 700, color: '#fff', whiteSpace: 'pre', letterSpacing: '-0.02em'}}>{banner}</div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 210, textAlign: 'center', fontFamily: SANS, fontSize: 18, color: 'rgba(255,255,255,0.75)'}}>一个地方，记下、排好、做完每件事</div>
      <div style={{position: 'absolute', left: '50%', top: 262, marginLeft: -170, display: 'flex', gap: 14}}>
        <div style={{width: 160, height: 46, borderRadius: 46, background: '#15171f', color: '#fff', fontFamily: SANS, fontSize: 16, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>免费试用 →</div>
        <div style={{width: 160, height: 46, borderRadius: 46, background: '#fff', color: '#15171f', fontFamily: SANS, fontSize: 16, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>▶ 看 30 秒演示</div>
      </div>
      <div style={{position: 'absolute', left: -60, right: -60, bottom: -120, height: 320, borderRadius: '50%', background: 'radial-gradient(ellipse at center, rgba(211,244,84,0.55) 0%, rgba(160,200,120,0.25) 45%, rgba(211,244,84,0) 72%)'}} />
    </div>
  );
  if (kind === 'team') {
    const people = [['林夏', '负责人', 0.82], ['周宁', '成员', 0.64], ['陈一', '成员', 0.9], ['王可', '成员', 0.4], ['李木', '访客', 0.7], ['赵晴', '成员', 0.3], ['孙越', '成员', 0.55]] as const;
    const st = [['进行中', '#e9f7ef', '#2f9a5c'], ['进行中', '#e9f7ef', '#2f9a5c'], ['请假', '#fff4e5', '#c57a12'], ['进行中', '#e9f7ef', '#2f9a5c'], ['已邀请', '#eef0ff', blue]] as const;
    return (
      <div style={base}>
        <div style={{position: 'absolute', left: 0, top: 0, width: 150, height: h, background: '#f7f8fc', borderRight: '1px solid #eceef5'}}>
          <div style={{position: 'absolute', left: 16, top: 18, width: 20, height: 20, borderRadius: 6, background: blue}} /><T x={42} y={18} s={14}>小周</T>
          {['首页', '待办', '项目', '日历', '团队', '设置'].map((n, i) => <T key={n} x={18} y={64 + i * 26} s={12} c={i === 4 ? INK : '#7b7f92'} w={i === 4 ? 700 : 400}>{n}</T>)}
          <div style={{position: 'absolute', left: 12, right: 12, bottom: 16, height: 86, borderRadius: 10, background: '#15171f'}}><div style={{position: 'absolute', left: 10, top: 10, width: 18, height: 18, borderRadius: 5, background: LIME}} /><T x={10} y={36} s={11} c="#fff">升级专业版</T><div style={{position: 'absolute', left: 10, right: 10, bottom: 10, height: 16, borderRadius: 16, background: LIME}} /></div>
        </div>
        <T x={170} y={18} s={22} w={700}>团队</T><T x={170} y={48} s={11} c="#8b8e9a" w={400}>7 位成员 · 2 个待接受邀请</T>
        {[['成员', '7'], ['本周完成', '142'], ['准时率', '93%']].map(([l, v], i) => (
          <div key={l} style={{position: 'absolute', left: 170 + i * 140, top: 74, width: 128, height: 54, borderRadius: 10, background: '#f6f7fb'}}><T x={10} y={8} s={10} c="#8b8e9a" w={400}>{l}</T><T x={10} y={24} s={20} w={700}>{v}</T></div>
        ))}
        {people.map(([n, r, pr], i) => (
          <React.Fragment key={n}>
            <div style={{position: 'absolute', left: 170, top: 148 + i * 52, width: 26, height: 26, borderRadius: 26, background: ['#e5e8ff', '#eef7d4', '#fde8f1', '#fff1e3'][i % 4], fontFamily: SANS, fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', color: INK}}>{n[0]}</div>
            <T x={204} y={146 + i * 52} s={13}>{n}</T><T x={204} y={164 + i * 52} s={10} c="#a3a6b5" w={400}>{r}</T>
            <div style={{position: 'absolute', left: w * 0.5, top: 152 + i * 52, display: 'flex', gap: 4}}>{[0, 1, 2].slice(0, 1 + (i % 3)).map((k) => <div key={k} style={{width: 14, height: 14, borderRadius: 4, background: ['#835ff4', blue, '#9dc031', '#f39a3c'][(i + k) % 4]}} />)}</div>
            <div style={{position: 'absolute', left: w * 0.66, top: 158 + i * 52, width: w * 0.16, height: 5, borderRadius: 5, background: '#eef0f6'}}><div style={{width: `${pr * 100}%`, height: '100%', borderRadius: 5, background: ['#f39a3c', blue, '#e2545c', blue][i % 4]}} /></div>
            <div style={{position: 'absolute', left: w * 0.86, top: 150 + i * 52, padding: '3px 8px', borderRadius: 10, background: st[i % 5][1], color: st[i % 5][2], fontFamily: SANS, fontSize: 10}}>{st[i % 5][0]}</div>
          </React.Fragment>
        ))}
      </div>
    );
  }
  if (kind === 'task') return (
    <div style={base}>
      <div style={{position: 'absolute', left: '50%', top: 10, width: 70, height: 20, marginLeft: -35, borderRadius: 20, background: '#1a1c24'}} />
      <T x={18} y={44} s={10} c={blue} w={600}>● 进行中</T>
      <T x={18} y={64} s={19} w={700}>整理旧家具</T>
      {[['项目', '搬家准备'], ['负责人', '林夏'], ['截止', '周六 10:00'], ['优先级', '紧急']].map(([l, v], i) => (
        <React.Fragment key={l}><T x={18} y={102 + i * 24} s={11} c="#a3a6b5" w={400}>{l}</T><T x={w - 120} y={102 + i * 24} s={11} c={i === 2 ? '#e2545c' : INK} w={500}>{v}</T></React.Fragment>
      ))}
      <T x={18} y={206} s={10} c="#a3a6b5" w={500}>说明</T>
      <Line x={18} y={226} w={w - 40} c="#d9dce7" h={6} /><Line x={18} y={240} w={w - 60} c="#d9dce7" h={6} /><Line x={18} y={254} w={w - 90} c="#d9dce7" h={6} />
      <T x={18} y={278} s={12}>子任务 2 / 4</T>
      <div style={{position: 'absolute', left: 18, top: 300, width: w - 40, height: 5, borderRadius: 5, background: '#eef0f6'}}><div style={{width: '50%', height: '100%', borderRadius: 5, background: blue}} /></div>
      {['旧沙发挂二手', '书桌送朋友', '衣柜拆开', '床垫约回收'].map((n, i) => (
        <React.Fragment key={n}><div style={{position: 'absolute', left: 18, top: 318 + i * 26, width: 14, height: 14, borderRadius: 14, background: i < 2 ? blue : 'transparent', border: i < 2 ? 'none' : '2px solid #c9ccd8'}} /><T x={40} y={315 + i * 26} s={12} c={i < 2 ? '#a3a6b5' : INK} w={400}>{n}</T></React.Fragment>
      ))}
      <div style={{position: 'absolute', left: 18, right: 60, bottom: 24, height: 40, borderRadius: 40, background: LIME, fontFamily: SANS, fontSize: 14, fontWeight: 700, color: '#1d2405', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>✓ 完成</div>
    </div>
  );
  if (kind === 'dark') return (
    <div style={base}>
      <div style={{position: 'absolute', left: 22, top: 22, width: 34, height: 34, borderRadius: 10, background: LIME}} />
      <T x={22} y={70} s={18} c="#fff">升级专业版</T>
      <Line x={22} y={104} w={w * 0.6} c="#3a3d48" />
      <div style={{position: 'absolute', left: 22, right: 22, bottom: 22, height: 34, borderRadius: 34, background: LIME}} />
    </div>
  );
  if (kind === 'phone') return (
    <div style={base}>
      <div style={{position: 'absolute', left: '50%', top: 10, width: 70, height: 20, marginLeft: -35, borderRadius: 20, background: '#1a1c24'}} />
      <T x={20} y={46} s={18}>早上好，林夏</T>
      <div style={{position: 'absolute', left: 16, right: 16, top: 84, height: 86, borderRadius: 14, background: blue}}>
        <T x={14} y={12} s={12} c="rgba(255,255,255,0.8)" w={500}>本周目标</T>
        <T x={14} y={32} s={28} c="#fff" w={700}>86%</T>
        <div style={{position: 'absolute', left: 14, right: 14, bottom: 14, height: 5, borderRadius: 5, background: 'rgba(255,255,255,0.25)'}}><div style={{width: '86%', height: '100%', borderRadius: 5, background: LIME}} /></div>
      </div>
      <T x={20} y={190} s={14}>今天</T>
      {rows(20, 220, 5, w - 60)}
      <div style={{position: 'absolute', left: '50%', bottom: 22, width: 44, height: 44, marginLeft: -22, borderRadius: 44, background: blue}} />
    </div>
  );
  if (kind === 'board') return (
    <div style={base}>
      <T x={26} y={22} s={20}>搬家准备</T>
      <Line x={26} y={58} w={w * 0.5} c={blue} />
      {[0, 1, 2].map((c) => (
        <div key={c} style={{position: 'absolute', left: 22 + c * ((w - 44) / 3), top: 84, width: (w - 44) / 3 - 12, height: h - 104, borderRadius: 12, background: '#f3f4f9'}}>
          <T x={12} y={10} s={13}>{['待办', '进行中', '已完成'][c]}</T>
          {Array.from({length: 3 - (c === 1 ? 1 : 0)}, (_, i) => (
            <div key={i} style={{position: 'absolute', left: 8, right: 8, top: 38 + i * 56, height: 46, borderRadius: 9, background: '#fff', boxShadow: '0 1px 2px rgba(40,50,120,0.06)'}}>
              <div style={{position: 'absolute', left: 9, top: 10, width: 3, height: 26, borderRadius: 3, background: ['#835ff4', blue, '#9dc031'][(i + c) % 3]}} />
              <Line x={20} y={13} w={60 + ((seed + i + c) % 3) * 14} c="#cfd2de" />
              {c === 2 && <div style={{position: 'absolute', right: 10, top: 14, width: 16, height: 16, borderRadius: 16, background: '#2fb36b'}} />}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
  if (kind === 'cal') return (
    <div style={base}>
      <T x={26} y={22} s={20}>11 月</T>
      {Array.from({length: 28}, (_, i) => (
        <div key={i} style={{position: 'absolute', left: 26 + (i % 7) * ((w - 52) / 7), top: 70 + Math.floor(i / 7) * ((h - 96) / 4), width: (w - 52) / 7 - 8, height: (h - 96) / 4 - 8, borderRadius: 8,
          background: i === 11 ? blue : (i * 7 + seed) % 5 === 0 ? '#eef0ff' : '#f6f7fb', color: i === 11 ? '#fff' : '#9a9db0', fontFamily: SANS, fontSize: 12, padding: 6}}>{i + 1}</div>
      ))}
    </div>
  );
  if (kind === 'list') return (
    <div style={base}>
      <T x={26} y={22} s={20}>今天 · 4</T>
      {rows(26, 70, Math.floor((h - 90) / 30), w - 60)}
    </div>
  );
  // dash
  return (
    <div style={base}>
      <div style={{position: 'absolute', left: 0, top: 0, width: 120, height: h, background: '#f7f8fc', borderRight: '1px solid #eceef5'}}>
        <div style={{position: 'absolute', left: 16, top: 18, width: 20, height: 20, borderRadius: 6, background: blue}} />
        {Array.from({length: 7}, (_, i) => <Line key={i} x={16} y={62 + i * 24} w={60 + (i % 2) * 20} c={i === 0 ? '#c9cdf7' : '#e3e5ee'} />)}
      </div>
      <T x={140} y={18} s={18}>早上好，林夏</T>
      {[0, 1, 2, 3].map((i) => (
        <div key={i} style={{position: 'absolute', left: 140 + i * ((w - 160) / 4), top: 56, width: (w - 160) / 4 - 10, height: 70, borderRadius: 10, background: i === 3 ? blue : '#f6f7fb'}}>
          <T x={10} y={22} s={22} c={i === 3 ? '#fff' : INK} w={700}>{['3', '24', '9', '86%'][i]}</T>
        </div>
      ))}
      {rows(140, 146, Math.floor((h - 160) / 30), (w - 180) * 0.62)}
      {Array.from({length: 7}, (_, i) => {
        const bh = [0.55, 0.72, 0.48, 0.9, 0.62, 0.22, 0.14][i] * 90;
        return <div key={i} style={{position: 'absolute', left: w - 190 + i * 24, top: h - 30 - bh, width: 14, height: bh, borderRadius: 4, background: i === 2 ? LIME : blue}} />;
      })}
    </div>
  );
};

// 墙面布局（墙平面坐标，单位 px；墙中心在 (0,0)）
type Item = {kind: Kind; x: number; y: number; w: number; h: number};
// 2026-11-12 用户："跟他一样就好"——墙的构图照原片 51.0s 那一帧：在原片大图上量每块界面的角点，
// 按本组的机位（rotateX 50° + rotateZ −18°、透视 4000、原点 (960, 600)）反算回墙平面坐标（脚本见 （内部拆片记录，未随项目提供） 末尾）；
// 原片画面比 16:9 窄，左右两边超出原片的部分按同样的 50px 缝补齐。
const WALL: Item[] = [
  // 上排（被遮罩淡掉一大半）
  {kind: 'dash', x: -1290, y: -880, w: 720, h: 560}, {kind: 'phone', x: -520, y: -860, w: 240, h: 530}, {kind: 'dash', x: -230, y: -900, w: 760, h: 560}, {kind: 'phone', x: 580, y: -920, w: 240, h: 530}, {kind: 'dash', x: 870, y: -940, w: 720, h: 560},
  // 中排：左边看板面板、手机任务详情、大仪表盘、右边手机项目列表、再右一块网页
  {kind: 'phone', x: -1400, y: -190, w: 240, h: 530}, {kind: 'board', x: -1110, y: -200, w: 508, h: 560}, {kind: 'task', x: -552, y: -229, w: 238, h: 526}, {kind: 'team', x: -267, y: -264, w: 758, h: 561},
  {kind: 'phone', x: 541, y: -300, w: 250, h: 540}, {kind: 'cal', x: 841, y: -330, w: 720, h: 560},
  // 下排：设置页、手机团队页、蓝色大横幅、横幅后面一块网页
  {kind: 'list', x: -979, y: 330, w: 760, h: 560}, {kind: 'phone', x: -169, y: 354, w: 225, h: 500}, {kind: 'banner', x: 99, y: 363, w: 760, h: 560}, {kind: 'dash', x: 909, y: 330, w: 720, h: 560},
  {kind: 'dark', x: -1260, y: 360, w: 230, h: 210},
];
// 滑动：剩余位移比例（1 → 0），主段 0.25–1.4s，之后长尾
const slideLeft = (s: number) => trk(s, [[0.05, 1], [0.25, 0.92], [0.45, 0.74], [0.7, 0.52], [0.95, 0.37], [1.4, 0.21], [2.0, 0.1], [2.8, 0.04], [4.3, 0]]);
const Wall: React.FC<{s: number; t: number; hd: number; x: WallInputs; blue: string}> = ({s, t, hd, x, blue}) => {
  // 2026-11-17 重做：墙的运动直接用原片逐帧量的单应（wall-g.ts）。墙先摆在原片 51.0s（源秒 2.95）的机位，
  // 再整体乘"模板帧 → 当前帧"的屏幕单应：原片其实是"往上滑 ~320px + 从 1.26 倍缩到 1 倍"，不是往左上斜滑。
  const k0 = slideLeft(2.95);
  const dx = 300 * k0 - 2 * 2.95, dy = 190 * k0 - 1.2 * 2.95;
  const G = wallG(s, hd);
  const op = rp(s, 0.05, 0.7); // 原片 0.4s 墙还很虚、很淡，0.8s 才清楚
  const blur = 10 * (1 - eo(s, 0.05, 0.9));
  return (
    <div style={{position: 'absolute', inset: 0, opacity: op, filter: blur > 0.2 ? `blur(${blur.toFixed(2)}px)` : undefined,
      WebkitMaskImage: 'linear-gradient(180deg, rgba(0,0,0,0) 30%, rgba(0,0,0,0.6) 42%, #000 56%)', maskImage: 'linear-gradient(180deg, rgba(0,0,0,0) 30%, rgba(0,0,0,0.6) 42%, #000 56%)'}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transformOrigin: '0 0', transform: homCss(G)}}>
      <div style={{position: 'absolute', left: 948 + dx, top: 592 + dy, width: 0, height: 0, perspective: 4000}}>
        <div style={{position: 'absolute', left: 0, top: 0, transform: 'rotateX(50deg) rotateZ(-18deg)', transformStyle: 'preserve-3d'}}>
          {WALL.map((it, i) => (
            <div key={i} style={{position: 'absolute', left: it.x, top: it.y}}>
              <Screen kind={it.kind} w={it.w} h={it.h} blue={blue} banner={x.banner} seed={i} />
            </div>
          ))}
        </div>
      </div>
      </div>
    </div>
  );
};

// ═════════ 整组 ═════════
export type WallProps = {inputs?: WallInputs; extras?: number[]};
export const InterfaceWallSyncGroup: React.FC<WallProps> = ({inputs = WALL_DEFAULT_INPUTS, extras = [0]}) => {
  const C = INTERFACE_WALL_SYNC_CONTRACT;
  const t = useCurrentFrame() / FPS;
  const s = toSource(t, C, extras);
  const hd = Math.max(0, t - s);
  const blue = inputs.brandColor ?? '#2a42f4';
  // 出口：变虚 + 过曝到白
  const fb = Math.pow(clamp((s - 4.2) / 0.28), 2); // 虚和白都越到最后越猛
  const white = Math.pow(clamp((s - 4.26) / 0.24), 2); // 越到最后越白（ease-in），最后一帧纯白
  const push = 1 + 0.004 * t + 0.012 * hd;
  return (
    <AbsoluteFill style={{overflow: 'hidden', fontFamily: SANS}}>
      <AbsoluteFill style={{filter: fb > 0.01 ? `blur(${(28 * fb).toFixed(2)}px) brightness(${(1 + 0.6 * fb).toFixed(3)})` : undefined}}>
        <Backdrop t={t} />
        <Wall s={s} t={t} hd={hd} x={inputs} blue={blue} />
        <AbsoluteFill style={{transform: `scale(${push.toFixed(5)})`, transformOrigin: '960px 230px'}}>
          <WordLine s={s} words={inputs.line1} t0={0.25} step={0.08} cy={162} col={INK} />
          <WordLine s={s} words={inputs.line2} t0={0.55} step={0.12} cy={278} col={blue} italic />
        </AbsoluteFill>
      </AbsoluteFill>
      {white > 0.003 && <AbsoluteFill style={{background: '#fff', opacity: white}} />}
    </AbsoluteFill>
  );
};
export const InterfaceWallSync: React.FC = () => <InterfaceWallSyncGroup />;

if (checkContract(INTERFACE_WALL_SYNC_CONTRACT).length) throw new Error(checkContract(INTERFACE_WALL_SYNC_CONTRACT).join('; '));
