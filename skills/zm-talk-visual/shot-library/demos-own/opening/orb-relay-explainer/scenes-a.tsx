// S1–S5：句中开关 + 句尾弹出光球 → 换词 + 暗色边光球公转 → 光晕胀满屏 → 助手面板透视摆动 → 逐词追加居中句
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {
  EASE, mix, clamp, fx, X, Y, rp, kf, spl, path, pathV, lerpC, rgba, Orb, PAL, Pal, mixPal, Cursor3D, wordStyle, SANS, P3,
} from './orb-kit';

// ════════════════ S1 0.00–2.70 句中嵌开关，句尾弹出光球 ════════════════
const FS1 = 96;
const S1_L1: {w?: string; at: number; toggle?: boolean}[] = [
  {w: '把你', at: 0.1}, {w: '每天的', at: 0.27}, {toggle: true, at: 0.4}, {w: '琐事，', at: 0.62},
];
const S1_L2: {w: string; at: number}[] = [{w: '交给', at: 0.8}, {w: '一个', at: 0.98}, {w: 'AI 助手', at: 1.2}];
const ORB1_D = 160;
// 光球从 0 长出：30→60→90→120→138（第 7 帧最大，过冲约 11%）→ 回落 124（按我们字号放大 1.29 倍）
const orb1D = (t: number) => {
  const f = t * 30;
  if (f < 41.5) return 0;
  return kf(f, [[41.5, 0], [42, 39, EASE.linear], [43, 77, EASE.linear], [44, 116, EASE.linear], [45, 152, EASE.linear], [46, 166, EASE.out], [47, 174, EASE.out], [48, 178, EASE.out], [57, ORB1_D, EASE.smooth]]);
};
// 开关：0 关 → 1 开（2.0–2.3s，缓出）
const S1_TOGGLE_W = 200, S1_TOGGLE_H = 74;
const Toggle: React.FC<{t: number; on: number; appear: number}> = ({on, appear}) => {
  const knob = S1_TOGGLE_H - 14;
  const kx = 7 + on * (S1_TOGGLE_W - knob - 14);
  return (
    <div style={{position: 'relative', width: S1_TOGGLE_W, height: S1_TOGGLE_H, borderRadius: 99, opacity: appear, background: '#06103a', boxShadow: `inset 0 0 0 1.5px ${rgba('#2a4ad8', 0.45 + on * 0.4)}, 0 0 ${fx(on * 26)}px ${rgba('#2a6bff', on * 0.55)}`, overflow: 'hidden', alignSelf: 'center'}}>
      <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: kx + knob / 2 + 4, borderRadius: 99, background: 'linear-gradient(90deg, #3b6cf0 0%, #2a50d8 60%, #1a2a90 100%)', opacity: clamp(on * 3)}} />
      <div style={{position: 'absolute', left: kx, top: 7, width: knob, height: knob, borderRadius: '50%', background: `radial-gradient(circle at 40% 35%, ${lerpC('#2a3a9a', '#e8f0ff', on)} 0%, ${lerpC('#101c6a', '#8fb0ff', on)} 100%)`, boxShadow: `0 0 ${fx(6 + on * 10)}px ${rgba('#6a9aff', 0.3 + on * 0.5)}`}} />
    </div>
  );
};
const CUR1: P3[] = [[1.1, 52, 93], [1.2, 56, 74], [1.3, 58.5, 66], [1.4, 58.5, 58], [1.5, 55, 52.5], [1.6, 42, 46.5], [1.72, 40.4, 45.6], [1.85, 40.2, 45.5], [1.95, 40.6, 46], [2.05, 41.8, 46.3], [2.15, 43.4, 46.6], [2.25, 45.2, 47.6], [2.33, 46.8, 50], [2.42, 49, 49.5], [2.5, 52.5, 47.5], [2.6, 61, 42], [2.7, 73, 34]];

export const S1: React.FC<{t: number}> = ({t}) => {
  const beam = rp(t, -0.4, 2.4, EASE.smooth) + Math.sin(t * 3) * 0.04;
  const drift = kf(t, [[2.42, 0], [2.6, -38, EASE.exit], [2.7, -92, EASE.linear]]);
  const tg = rp(t, 1.97, 0.33, EASE.out);
  const d = orb1D(t);
  const palK = rp(t, 1.5, 0.35, EASE.smooth);
  const pal = mixPal(PAL.bright, PAL.cyan, palK);
  const cp = path(t, CUR1), cv = pathV(t, CUR1);
  const press = t > 1.88 && t < 2.02 ? Math.sin(((t - 1.88) / 0.14) * Math.PI) : 0;
  return (
    <AbsoluteFill style={{background: '#000005', overflow: 'hidden'}}>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 70% 55% at 50% 78%, #000337 0%, rgba(0,3,55,0) 100%)'}} />
      {/* 顶部两道竖向蓝光束，0–2s 慢慢变亮 */}
      <AbsoluteFill style={{background: `radial-gradient(ellipse 38% 105% at 8% -14%, ${rgba('#1a6af0', mix(0.55, 1, beam))} 0%, ${rgba('#1040b8', mix(0.3, 0.75, beam))} 40%, rgba(4,16,60,0) 100%), radial-gradient(ellipse 38% 110% at 88% -14%, ${rgba('#2a78ff', mix(0.45, 1, beam))} 0%, ${rgba('#1040b8', mix(0.25, 0.75, beam))} 40%, rgba(4,16,60,0) 100%)`}} />
      <div style={{position: 'absolute', left: X(13.6) + drift, top: 0, fontFamily: SANS, fontWeight: 300, fontSize: FS1, letterSpacing: '-0.01em', color: '#fff', whiteSpace: 'pre'}}>
        <div style={{position: 'absolute', top: 470 - FS1 * 0.68, display: 'flex', alignItems: 'center', height: FS1 * 1.36}}>
          {S1_L1.map((it, i) => it.toggle
            ? <div key={i} style={{margin: '0 30px', display: 'flex'}}><Toggle t={t} on={tg} appear={rp(t, it.at, 0.25, EASE.smooth)} /></div>
            : <span key={i} style={{display: 'inline-block', ...wordStyle(t, it.at, {dy: 15})}}>{it.w}</span>)}
        </div>
        <div style={{position: 'absolute', top: 612 - FS1 * 0.68, display: 'flex', alignItems: 'center', height: FS1 * 1.36}}>
          {S1_L2.map((it, i) => <span key={i} style={{display: 'inline-block', marginRight: i === 1 ? 22 : 0, ...wordStyle(t, it.at, {dy: i === 2 ? 15 : 8, from: i === 2 ? '#3a3d5a' : '#9a9cb0'})}}>{it.w}</span>)}
          {/* 句尾光球：压在文字层上面 */}
          <div style={{position: 'relative', width: ORB1_D + 40, height: ORB1_D}}>
            <Orb x={40 + ORB1_D / 2} y={ORB1_D / 2 + 4 + Math.sin(t * 2.4) * 2} d={d} pal={pal} glow={0.9} />
          </div>
        </div>
      </div>
      {t >= 1.1 && <Cursor3D x={cp.x} y={cp.y} size={92} rot={kf(t, [[1.1, 14], [1.45, 26], [1.6, 18], [1.9, 22], [2.3, 26], [2.7, 40]])} flip={kf(t, [[1.1, 0.75], [1.3, 0.35], [1.6, 0.1], [1.9, 0], [2.35, 0.1], [2.7, 0.5]])} press={press} opacity={rp(t, 1.1, 0.06, EASE.linear)} vx={cv.vx} vy={cv.vy} />}
    </AbsoluteFill>
  );
};

// ════════════════ S2 2.70–5.00 换词 + 暗色边光球公转；S3 5.00–5.90 光晕胀满屏 ════════════════
const S2_WORDS: [number, string][] = [[2.7, '高效'], [3.5, '聪明'], [4.2, '贴心']];
const wordX = (t: number) => spl(t, [[2.7, 50], [2.8, 49.2], [2.9, 48.4], [3.2, 47.8], [3.49, 46.4], [3.5, 50.4], [4.19, 49.6], [4.2, 50.4], [4.4, 49.4], [4.6, 48.2], [4.7, 47.4], [4.8, 45.6], [4.9, 40], [5.0, 36], [5.1, 24], [5.2, 12]]);
const wordY = (t: number) => (t < 3.5 ? 52 : t < 4.2 ? 50 : 48);
const ORB_A: P3[] = [[2.7, 5, -5], [2.8, 8, -2], [2.9, 26, -5], [3.0, 40, -10], [3.1, 51, -8], [3.2, 63, 6], [3.3, 73, 12], [3.4, 79, 29], [3.5, 82, 33], [3.6, 82, 23], [3.7, 81, 27], [3.8, 78, 59], [3.9, 72, 60], [4.0, 70, 83], [4.1, 64, 90], [4.2, 41, 5], [4.3, 48, 3], [4.4, 56, 13], [4.5, 63, 14], [4.6, 68, 33], [4.7, 73, 34], [4.8, 74, 49], [4.9, 72, 63], [5.0, 65, 72], [5.1, 58, 66]];
const ORB_B: P3[] = [[2.7, 97, 92], [2.8, 77, 105], [2.9, 85, 104], [3.0, 58, 105], [3.1, 46, 103], [3.2, 34, 98], [3.3, 24, 88], [3.4, 20, 92], [3.5, 13, 62], [3.6, 18, 19], [3.7, 19, 13], [3.8, 21, 25], [3.9, 26, 22], [4.0, 29, 13], [4.1, 34, 13], [4.2, 57, 92], [4.3, 52, 93], [4.4, 44, 92], [4.5, 37, 84], [4.6, 31, 82], [4.7, 27, 66], [4.8, 25, 50], [4.9, 28, 37], [5.0, 35, 29], [5.1, 44, 36]];
// 原表里 4.1→4.2 球是"换位"（硬切同时换了一组球），这里分两段走，避免插值穿屏
const orbAt = (t: number, keys: P3[]) => {
  const k = t < 4.2 ? keys.filter((p) => p[0] <= 4.1) : keys.filter((p) => p[0] >= 4.2);
  return {...path(t, k), ...pathV(t, k)};
};
const darkD = (t: number) => kf(t, [[2.7, 600], [4.0, 590, EASE.linear], [4.1, 480], [4.2, 450], [4.4, 380, EASE.linear], [4.5, 340, EASE.linear], [4.6, 300, EASE.linear], [4.7, 250, EASE.linear], [4.8, 210, EASE.linear], [4.9, 180, EASE.linear], [5.0, 140, EASE.linear], [5.12, 90, EASE.linear]]);

const DarkOrb: React.FC<{x: number; y: number; d: number; tx: number; ty: number; lit: number; op?: number}> = ({x, y, d, tx, ty, lit, op = 1}) => {
  const dx = tx - x, dy = ty - y, L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L;
  const ang = Math.atan2(ux, -uy) * 180 / Math.PI; // CSS 渐变角：0 = 朝上
  const rim = Math.max(4, d * 0.014);
  const mask = (a: number, b: number) => `linear-gradient(${fx(ang)}deg, transparent ${a}%, black ${b}%)`;
  return (
    <div style={{position: 'absolute', left: x - d / 2, top: y - d / 2, width: d, height: d, opacity: op}}>
      {/* 被单词照亮那一侧的外辉光 */}
      <div style={{position: 'absolute', inset: -d * 0.08, borderRadius: '50%', boxShadow: `0 0 ${fx(d * 0.1)}px ${rgba('#2a4ad8', 0.5 + lit * 0.3)}`, WebkitMaskImage: mask(45, 100), maskImage: mask(45, 100)}} />
      {/* 球身：黑 → 后期变蓝紫半透明 */}
      <div style={{position: 'absolute', inset: 0, borderRadius: '50%', background: `radial-gradient(circle at ${fx(50 + ux * 28)}% ${fx(50 + uy * 28)}%, ${rgba(lerpC('#02030c', '#4a5ce0', lit), mix(1, 0.75, lit))} 0%, ${rgba(lerpC('#000000', '#2a36a8', lit), mix(1, 0.55, lit))} 65%, ${rgba(lerpC('#000000', '#1a2280', lit), mix(1, 0.5, lit))} 100%)`}} />
      {/* 内侧柔边渐暗的蓝光 + 一道亮边（只在朝单词那一侧） */}
      <div style={{position: 'absolute', inset: 0, borderRadius: '50%', boxShadow: `inset 0 0 ${fx(d * 0.09)}px ${rgba('#2a4ad8', 0.9)}`, WebkitMaskImage: mask(38, 92), maskImage: mask(38, 92)}} />
      <div style={{position: 'absolute', inset: 0, borderRadius: '50%', border: `${fx(rim)}px solid ${rgba('#5a7cff', 1)}`, filter: `blur(${fx(rim * 0.45)}px)`, WebkitMaskImage: mask(42, 85), maskImage: mask(42, 85)}} />
    </div>
  );
};

export const S2S3: React.FC<{t: number; panel: React.ReactNode}> = ({t, panel}) => {
  const word = [...S2_WORDS].reverse().find((w) => t >= w[0])![1];
  const wx = X(wordX(t)), wy = Y(wordY(t));
  // 单词光晕：S2 半径 200→450；S3 中心移到画面中间、变浅蓝白、胀满屏，再退光显影面板
  const hr = kf(t, [[2.7, 200], [3.5, 230], [4.2, 300], [4.8, 380], [5.0, 430], [5.1, 440, EASE.out], [5.2, 780, EASE.out], [5.3, 1250, EASE.out], [5.42, 1500, EASE.out], [5.6, 1560, EASE.linear], [5.74, 1250, EASE.smooth], [5.9, 900, EASE.smooth]]);
  const hcx = t < 4.95 ? wx : mix(wx, X(50), rp(t, 4.95, 0.15, EASE.smooth));
  const hcy = t < 4.95 ? wy : mix(wy, Y(t > 5.35 ? 45 : 48), rp(t, 4.95, 0.45, EASE.smooth));
  const light = kf(t, [[4.95, 0], [5.1, 0.55, EASE.out], [5.2, 0.8], [5.3, 0.95], [5.6, 1, EASE.linear], [5.67, 0.85], [5.76, 0.55], [5.85, 0.25], [5.93, 0]]);
  const center = lerpC(lerpC('#1944a8', '#2550c0', rp(t, 4.6, 0.4)), '#c4e8ff', light);
  const ring = lerpC('#0c2160', '#5d8fd8', light);
  const bg = lerpC('#000000', '#152a66', kf(t, [[5.0, 0], [5.1, 0.0], [5.2, 0.25], [5.3, 0.7], [5.4, 0.9], [5.6, 1, EASE.linear], [5.72, 0.9], [5.83, 0.45], [5.9, 0.05]]));
  const hOp = kf(t, [[2.7, 0.75], [3.0, 0.9], [4.8, 1]]);
  const A = orbAt(t, ORB_A), B = orbAt(t, ORB_B);
  const dD = darkD(t);
  const lit = rp(t, 4.45, 0.5, EASE.smooth);
  const orbOp = 1 - rp(t, 5.02, 0.12, EASE.linear);
  const wordOp = 1 - rp(t, 5.1, 0.1, EASE.linear);
  return (
    <AbsoluteFill style={{background: bg, overflow: 'hidden'}}>
      <AbsoluteFill style={{background: `radial-gradient(circle ${fx(hr)}px at ${fx(hcx)}px ${fx(hcy)}px, ${rgba(center, hOp)} 0%, ${rgba(lerpC(center, ring, 0.55), hOp * 0.8)} 38%, ${rgba(ring, hOp * mix(0.2, 0.9, light * light))} 70%, ${rgba(ring, 0)} 100%)`}} />
      {t >= 5.0 && <AbsoluteFill style={{background: `radial-gradient(ellipse 120% 110% at 50% 46%, rgba(0,0,0,0) 55%, ${rgba('#06123a', 0.55 * light)} 100%)`}} />}
      {panel}
      {t < 5.2 && (
        <div style={{position: 'absolute', left: wx, top: wy, transform: 'translate(-50%, -50%)', fontFamily: SANS, fontWeight: 300, fontSize: 196, letterSpacing: '-0.02em', color: '#ffffff', opacity: wordOp, whiteSpace: 'pre', textShadow: `0 0 40px ${rgba('#2a5aff', 0.35)}`}}>{word}</div>
      )}
      {t < 5.15 && <DarkOrb x={A.x} y={A.y} d={dD} tx={wx} ty={wy} lit={lit} op={orbOp} />}
      {t < 5.15 && <DarkOrb x={B.x} y={B.y} d={dD} tx={wx} ty={wy} lit={lit} op={orbOp} />}
    </AbsoluteFill>
  );
};

// ════════════════ S4 5.90–7.95 助手面板：斜 → 正 → 反方向斜，5 颗助手球依次亮起 ════════════════
type Pose = {cx: number; cy: number; ry: number; rx: number; s: number};
const PANEL_W = 1460, PANEL_H = 870;
const CARD_PALS: {name: string; desc: string; pal: Pal; at: number}[] = [
  {name: '记账助手', desc: '每笔开销记清楚', pal: {top: '#5a6aff', body: '#b8c4ff', bottom: '#c8d0ff', core: '#7f8cff', glow: '#6a7aff', rim: '#e8ecff'}, at: 6.2},
  {name: '日程助手', desc: '提醒你别忘事', pal: {top: '#1a2ad0', body: '#2a7ae8', bottom: '#3ac0f0', core: '#1a2ad0', glow: '#2a8aff', rim: '#9ae0ff'}, at: 6.3},
  {name: '读书助手', desc: '帮你划重点', pal: {top: '#3a8aff', body: '#2a7aff', bottom: '#1a50e0', core: '#1a40c0', glow: '#2a7aff', rim: '#a0c8ff'}, at: 6.4},
  {name: '菜谱助手', desc: '今晚吃什么', pal: {top: '#36c0ff', body: '#2a90ff', bottom: '#2a6bff', core: '#1a4ad0', glow: '#2a8aff', rim: '#b0e8ff'}, at: 6.6},
  {name: '资料库助手', desc: '你的东西都在这', pal: {top: '#2a2aa8', body: '#7a86e8', bottom: '#2a2ab0', core: '#1a1a80', glow: '#3a3ad0', rim: '#a0a8ff'}, at: 6.85},
];
const DARK_PAL: Pal = {top: '#161c6a', body: '#1a2280', bottom: '#20288e', core: '#0c1050', glow: '#1a2280', rim: '#3a48c0'};

export const Panel: React.FC<{t: number; pose: Pose; wash?: number; opacity?: number}> = ({t, pose, wash = 0, opacity = 1}) => (
  <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, perspective: 2000, perspectiveOrigin: `${fx(pose.cx)}px ${fx(pose.cy)}px`, opacity}}>
    <div style={{position: 'absolute', left: pose.cx - PANEL_W / 2, top: pose.cy - PANEL_H / 2, width: PANEL_W, height: PANEL_H, transform: `rotateX(${fx(pose.rx)}deg) rotateY(${fx(pose.ry)}deg) scale(${fx(pose.s, 4)})`, borderRadius: 40, overflow: 'hidden', fontFamily: SANS,
      background: 'linear-gradient(165deg, #00073f 0%, #000a43 55%, #03125a 100%)', boxShadow: `inset 0 0 0 2px ${rgba('#2a4ad8', 0.95)}, inset 0 0 40px ${rgba('#1a3ad8', 0.35)}, 0 0 28px ${rgba('#2a4ad8', 0.55)}`, filter: wash > 0.01 ? `brightness(${fx(1 + wash * 1.6)}) saturate(${fx(1 - wash * 0.4)})` : undefined}}>
      {/* 左侧图标栏 */}
      <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 112, borderRight: `1.5px solid ${rgba('#2a4ad8', 0.45)}`, background: rgba('#000530', 0.5)}}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={{position: 'absolute', left: 32, top: 70 + i * 92, width: 48, height: 48, borderRadius: 14, boxShadow: `inset 0 0 0 2px ${rgba(i === 0 ? '#6a8aff' : '#2a4ad8', i === 0 ? 0.95 : 0.6)}`, background: i === 0 ? rgba('#2a4ad8', 0.35) : 'transparent'}}>
            <div style={{position: 'absolute', left: 14, top: 14, width: 20, height: 20, borderRadius: i % 2 ? 10 : 4, boxShadow: `inset 0 0 0 2px ${rgba('#8aa4ff', 0.8)}`}} />
          </div>
        ))}
        <div style={{position: 'absolute', left: 30, top: 760, width: 52, height: 52, borderRadius: '50%', background: 'linear-gradient(180deg, #3a5cff, #1a2a90)', boxShadow: `inset 0 0 0 2px ${rgba('#8aa4ff', 0.6)}`}} />
      </div>
      <div style={{position: 'absolute', left: 156, top: 52, fontSize: 50, color: '#fff', fontWeight: 400, letterSpacing: '0.01em'}}>你的助手们</div>
      <div style={{position: 'absolute', left: 158, top: 130, fontSize: 28, color: '#3a5cff', fontWeight: 500}}>助手 · 5 个</div>
      <div style={{position: 'absolute', left: 1040, top: 58, width: 380, height: 56, borderRadius: 28, boxShadow: `inset 0 0 0 1.5px ${rgba('#2a4ad8', 0.55)}`, background: rgba('#0a1a90', 0.3)}}>
        <div style={{position: 'absolute', left: 26, top: 12, fontSize: 24, color: rgba('#8aa4ff', 0.6)}}>搜索助手…</div>
      </div>
      {CARD_PALS.map((c, i) => {
        const col = i % 3, row = Math.floor(i / 3);
        const on = rp(t, c.at, i === 4 ? 0.3 : 0.12, EASE.smooth);
        const par = (1 - rp(t, 6.0, 0.55 + row * 0.18, EASE.out)) * (40 + row * 30); // 上排先到位
        const pal = mixPal(DARK_PAL, c.pal, on);
        const band = Math.sin(t * 3.2 + i * 1.3) * 5;
        return (
          <div key={i} style={{position: 'absolute', left: 156 + col * 360, top: 190 + row * 345 + par, width: 325, height: 315, borderRadius: 20, overflow: 'hidden',
            background: `linear-gradient(180deg, ${rgba(lerpC('#04104e', '#1a3ad0', on), mix(0.55, 0.5, on))} 0%, ${rgba(lerpC('#030a40', '#2a4ae0', on), mix(0.5, 0.75, on))} 100%)`, boxShadow: `inset 0 0 0 1.5px ${rgba('#3a5cff', mix(0.35, 0.7, on))}`}}>
            <div style={{position: 'absolute', left: 26, top: 22, fontSize: 24, lineHeight: '32px', color: rgba('#ffffff', mix(0.55, 0.9, on))}}>{c.name}<br /><span style={{color: rgba('#aab8ff', mix(0.4, 0.75, on)), fontSize: 20}}>{c.desc}</span></div>
            <Orb x={162} y={192 + band * 0.2} d={136} pal={pal} glow={on} soft={0.4} cvx={0} cvy={band * 0.8} />
          </div>
        );
      })}
      <div style={{position: 'absolute', left: 1236, top: 560, width: 100, height: 100, borderRadius: 20, boxShadow: `inset 0 0 0 1.5px ${rgba('#3a5cff', 0.25)}`}} />
    </div>
  </div>
);

const POSE_KEYS: {t: number; p: Pose}[] = [
  {t: 5.55, p: {cx: 1180, cy: 560, ry: 30, rx: 35, s: 0.95}},
  {t: 5.95, p: {cx: 1180, cy: 592, ry: 29, rx: 34, s: 0.95}},
];
const POSE2: [number, number, number, number, number][] = [
  // t, cx, cy, ry, rx
  [6.0, 1380, 820, 24, 20], [6.1, 1356, 786, 21, 17], [6.2, 1300, 748, 17, 14], [6.3, 1230, 712, 13, 11], [6.4, 1170, 680, 9, 7.5],
  [6.5, 1124, 652, 5.5, 4.5], [6.6, 1070, 618, 2.5, 2], [6.7, 1040, 598, 0.6, 0.4], [6.9, 1008, 572, 0, 0], [7.1, 992, 540, 0, 0], [7.25, 990, 552, 0, 0],
  [7.4, 1022, 562, -3, 1], [7.5, 1052, 560, -10, 2], [7.6, 1090, 556, -20, 3], [7.7, 1140, 550, -30, 4], [7.8, 1215, 544, -40, 5], [7.9, 1285, 540, -50, 6], [7.97, 1335, 538, -57, 6.5],
];
export const poseAt = (t: number): Pose => {
  if (t < 6.0) {
    const k = rp(t, POSE_KEYS[0].t, POSE_KEYS[1].t - POSE_KEYS[0].t, EASE.out);
    const a = POSE_KEYS[0].p, b = POSE_KEYS[1].p;
    return {cx: mix(a.cx, b.cx, k), cy: mix(a.cy, b.cy, k), ry: mix(a.ry, b.ry, k), rx: mix(a.rx, b.rx, k), s: 0.95};
  }
  const g = (j: number) => spl(t, POSE2.map((r) => [r[0], r[j]] as [number, number]));
  return {cx: g(1), cy: g(2), ry: g(3), rx: g(4), s: 1};
};

export const S4: React.FC<{t: number}> = ({t}) => (
  <AbsoluteFill style={{background: '#00031a', overflow: 'hidden'}}>
    <AbsoluteFill style={{background: `radial-gradient(ellipse 60% 70% at 55% 55%, ${rgba('#0a1a6a', 0.55)} 0%, rgba(0,0,0,0) 100%)`}} />
    <Panel t={t} pose={poseAt(t)} />
  </AbsoluteFill>
);

// ════════════════ S5 7.95–9.45 逐词追加，整行一直居中 ════════════════
const FS5 = 132;
const S5_WORDS: {w: string; at: number; from: string; gap: number}[] = [
  {w: '它们', at: 7.97, from: '#8a8c98', gap: 0}, {w: '做事', at: 8.38, from: '#555865', gap: 40}, {w: '全靠', at: 8.6, from: '#2a2c38', gap: 80}, {w: '你的', at: 8.88, from: '#9a9ca8', gap: 30},
];
const W5 = (w: string) => Array.from(w).length * FS5 * 0.98;
const S5_GAP = 14;
export const S5: React.FC<{t: number}> = ({t}) => {
  const occ = S5_WORDS.map((w) => rp(t, w.at, 0.18, EASE.out));
  const widths = S5_WORDS.map((w) => W5(w.w));
  const total = widths.reduce((s, wd, i) => s + (wd + (i ? S5_GAP : 0)) * occ[i], 0);
  const lead = kf(t, [[7.95, 170], [8.35, 20, EASE.swift], [9.0, 0]]);
  const slide = kf(t, [[9.08, 0], [9.42, -205, EASE.exit], [9.47, -250, EASE.linear]]);
  let x = 960 - total / 2 + lead + slide;
  return (
    <AbsoluteFill style={{background: '#030310', overflow: 'hidden'}}>
      <AbsoluteFill style={{background: `radial-gradient(ellipse 50% 40% at 50% 52%, ${rgba('#0a1450', 0.35)} 0%, rgba(0,0,0,0) 100%)`}} />
      {S5_WORDS.map((w, i) => {
        if (t < w.at) return null;
        const left = x + (i ? S5_GAP : 0) + (1 - occ[i]) * w.gap;
        x += (widths[i] + (i ? S5_GAP : 0)) * occ[i];
        const k = rp(t, w.at, 0.22, EASE.smooth);
        return <div key={i} style={{position: 'absolute', left, top: 540 - FS5 * 0.66, fontFamily: SANS, fontWeight: 300, fontSize: FS5, letterSpacing: '-0.02em', color: lerpC(w.from, '#ffffff', k), whiteSpace: 'pre'}}>{w.w}</div>;
      })}
    </AbsoluteFill>
  );
};
