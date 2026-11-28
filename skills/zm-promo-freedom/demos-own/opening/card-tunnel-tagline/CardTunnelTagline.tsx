// Logo 卡转正溶掉 → 渐变色块擦字 → 热成像卡片飞进方筒隧道 → 褪回原色 → 隧道一直慢退（011 B 段：原视频_01.mp4 0–6.9s）
// 学的动作：厚边 Logo 卡第 1 帧就在转正缩小下移，卡面溶掉、厚边从中间先断、两端最后消失；
//   一块粉-紫-青渐变色块从左往右走：上面把字标"染色再擦掉"，下面把标语"擦出来"（先浅棕带虚，色块过后才变黑），图标同时挪到居中；
//   热成像假彩色卡片从画外飞进（easeOut 0.4s、错开 0–0.25s，墙中间的先到、角上的后到），落在方筒四面内壁上
//   （左右墙的卡侧着朝中心、顶底的几乎平躺，中间 x 25–75% 留白）；先到的先褪回原色；第二行标语和褪色叠着擦出；
//   之后整个隧道匀速后退、四边不断冒新卡，从不静止。
// 我们的内容：开场 Logo 卡 = 产品"逐梦的剪辑 skills"（墨色圆环 + 靛蓝四角星 + "逐梦剪辑"字标）；
//   标语"把你拍下的每一段 / 都变成能看的片子"；卡片是代码画的场景缩略卡（和镜头 A 共用 ../../data/card-orbit-counter/sceneCards.tsx）
//
// 时间表（30fps，共 207f = 原片 6.9s 按秒×30）
//   0–21    Logo 卡：rotX 25°→3°、宽 1340→1150、中心 y 460→505，厚边 45→15px（第 0 帧就在动）
//   21–30   卡面变白透明，厚边细成一条线；27 起厚边从中间断开，两端黄红最后消失（42 没）
//   30–44   第 1 行色块：30 左端冒出淡青 → 34.5 拉满整行 → 后沿往右扫，43.5 消失；字先浅棕虚、色块过后变墨
//   32–40   字标逐字"黑 → 暗红 → 橙黄 → 透明"（从左往右）；35–41 图标往右挪到居中
//   36–57   卡片从画外飞入（每张 13f easeOutQuart，错开 0–8f），透明 20% → 实
//   49–63   卡片逐张褪回原色（先到先褪，每张 6f）
//   49.5–68 第 2 行色块 + 擦出第 2 行
//   66–90   信息条从 0 淡到 50%
//   50–207  隧道匀速后退（50–78 加速到 2.5 单位/帧，之后匀速），四边冒新卡；星标一直慢转
// 毛病清单（自查表通用项 + 本镜头独有）：
//   - 独有 1：卡体是"溶掉"的——卡面先透明、厚边从中间断开、两端最后没，不是整块淡出
//   - 独有 2：同一种色块做两件事（字标染色擦掉 / 标语擦出），方向都是从左往右，同时发生
//   - 独有 3：顶底的卡几乎平躺成扁条、左右的侧着朝中心；中心标语区永远空白
//   - 独有 4：3 秒后只剩慢退，但画面不能静止（活动曲线 ≥ 0.5）
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {EASE, FONT, Grain, mix} from '../../../assets/lib/helpers/polish';
import {SCENE_KINDS, SceneCard} from '../../data/card-orbit-counter/sceneCards';

export const CARD_TUNNEL_TAGLINE_DURATION = 207;

const SANS = `"PingFang SC", "Noto Sans CJK SC", "Noto Sans SC", ${FONT.sans}`;
const ACCENT = '#5b5cf0';
type Ease = (t: number) => number;
const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const hash = (i: number, n: number) => { const x = Math.sin(i * 12.9898 + n * 78.233) * 43758.5453; return x - Math.floor(x); };
const kf = (f: number, keys: [number, number, Ease?][]) => {
  if (f <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    const [f1, v1, e] = keys[i];
    const [f0, v0] = keys[i - 1];
    if (f <= f1) return mix(v0, v1, (e ?? EASE.smooth)(clamp((f - f0) / (f1 - f0))));
  }
  return keys[keys.length - 1][1];
};
const lin: Ease = (t) => t;
const outQuart: Ease = (t) => 1 - (1 - t) ** 4;
const rgbMix = (a: number[], b: number[], t: number) => `rgb(${Math.round(mix(a[0], b[0], t))},${Math.round(mix(a[1], b[1], t))},${Math.round(mix(a[2], b[2], t))})`;

// ───────── Logo（同 BenefitLinesToLogo 的 Mark，多一个星标旋转角） ─────────
const Mark: React.FC<{size: number; star: number; rot?: number}> = ({size, star, rot = 0}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{display: 'block', overflow: 'visible'}}>
    <circle cx="50" cy="50" r="41" fill="none" stroke="#16151c" strokeWidth="8.5" />
    <g transform={`translate(50 50) rotate(${rot.toFixed(2)}) scale(${star.toFixed(3)})`}><path d="M0 -24 C3 -6 6 -3 24 0 C6 3 3 6 0 24 C-3 6 -6 3 -24 0 C-6 -3 -3 -6 0 -24 Z" fill={ACCENT} /></g>
  </svg>
);

// ───────── Logo 卡（卡面 + 厚边月牙，在同一个 3D 容器里转正） ─────────
const CW = 1340, CH = 490, CR = 84;
const NAME = Array.from('逐梦剪辑');
const NAME_SIZE = 118;
const Edge: React.FC<{T: number; gap: number; fade: number}> = ({T, gap, fade}) => {
  // 月牙 = 卡底边轮廓 和 往下平移 T 后的轮廓 之间的区域；gap = 中间断开的半宽（0–0.5）
  const H = CH, W = CW, R = CR;
  const top = `M0 ${H - R} A${R} ${R} 0 0 0 ${R} ${H} L${W - R} ${H} A${R} ${R} 0 0 0 ${W} ${H - R}`;
  const d = `${top} L${W} ${H - R + T} A${R} ${R} 0 0 1 ${W - R} ${H + T} L${R} ${H + T} A${R} ${R} 0 0 1 0 ${H - R + T} Z`;
  const g0 = clamp(0.5 - gap, 0, 0.5);
  return (
    <svg width={W} height={H + T + 4} viewBox={`0 0 ${W} ${H + T + 4}`} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: fade, filter: `drop-shadow(0 ${(T * 0.5 + 6).toFixed(1)}px ${(T * 0.6 + 10).toFixed(1)}px rgba(60,40,30,0.14))`}}>
      <defs>
        <linearGradient id="lg-edge" x1="0" y1="0" x2="1" y2="0">
          {[[0, '#f5f6e6'], [0.03, '#f7c900'], [0.12, '#f7c900'], [0.22, '#f59b6b'], [0.3, '#c82d09'], [0.42, '#3e3a38'], [0.58, '#3e3a38'], [0.7, '#c82d09'], [0.78, '#f59b6b'], [0.88, '#f7c900'], [0.97, '#f7c900'], [1, '#f5f6e6']].map(([o, c]) => <stop key={o} offset={o} stopColor={String(c)} />)}
        </linearGradient>
        <linearGradient id="lg-mask" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" /><stop offset={Math.max(0, g0 - 0.04)} stopColor="#fff" />
          <stop offset={g0} stopColor="#000" /><stop offset={1 - g0} stopColor="#000" />
          <stop offset={Math.min(1, 1 - g0 + 0.04)} stopColor="#fff" /><stop offset="1" stopColor="#fff" />
        </linearGradient>
        <mask id="m-edge"><rect x="-10" y="0" width={W + 20} height={H + T + 10} fill={gap > 0.001 ? 'url(#lg-mask)' : '#fff'} /></mask>
      </defs>
      <path d={d} fill="url(#lg-edge)" mask="url(#m-edge)" />
    </svg>
  );
};

const LogoCard: React.FC<{f: number}> = ({f}) => {
  const rotX = kf(f, [[0, 25], [10, 13, lin], [21, 3, EASE.out], [30, 0, lin]]);
  const sc = kf(f, [[0, 1], [21, 0.86, lin], [32, 0.785, lin], [60, 0.772, EASE.out], [207, 0.76, lin]]);
  const cy = kf(f, [[0, 455], [21, 505, lin], [32, 515, lin], [60, 518, EASE.out], [207, 520, lin]]);
  const T = kf(f, [[0, 45], [21, 15, lin], [27, 5, lin], [30, 2.5, lin], [42, 1.5, lin]]);
  const face = 1 - clamp((f - 20) / 8);
  const gap = kf(f, [[26, 0], [34, 0.3, lin], [41, 0.5, EASE.exit]]);
  const edgeFade = 1 - clamp((f - 36) / 7);
  // 字标逐字：黑 → 暗红 → 橙 → 黄 → 透明
  const word = NAME.map((c, i) => {
    const t = f - (32.5 + i * 1.4);
    let col = 'rgb(20,18,24)', o = 1;
    if (t > 0) col = t < 1.5 ? rgbMix([20, 18, 24], [122, 32, 48], t / 1.5) : t < 3 ? rgbMix([122, 32, 48], [224, 128, 58], (t - 1.5) / 1.5) : rgbMix([224, 128, 58], [240, 200, 80], clamp((t - 3) / 1.5));
    if (t > 2.6) o = 1 - clamp((t - 2.6) / 2);
    return {c, col, o};
  });
  const markX = kf(f, [[35.5, -258], [45, 0, EASE.out]]);
  return (
    <div style={{position: 'absolute', left: 960 - CW / 2, top: cy - CH / 2, width: CW, height: CH, transform: `perspective(1600px) rotateX(${rotX.toFixed(3)}deg) scale(${sc.toFixed(4)})`, transformOrigin: '50% 50%'}}>
      {edgeFade > 0.001 && <Edge T={T} gap={gap} fade={edgeFade} />}
      {face > 0.001 && <div style={{position: 'absolute', inset: 0, borderRadius: CR, background: '#f7f7f7', opacity: face, boxShadow: 'inset 0 1.5px 0 rgba(255,255,255,0.9)'}} />}
      {/* Logo：图标 + 字标（卡溶掉以后留下来） */}
      <div style={{position: 'absolute', left: CW / 2 + markX - 75, top: CH * 0.37 - 75}}><Mark size={150} star={1} rot={f * 1.6} /></div>
      <div style={{position: 'absolute', left: CW / 2 - 147, top: CH * 0.37 - NAME_SIZE * 0.62, fontFamily: SANS, fontSize: NAME_SIZE, fontWeight: 700, letterSpacing: '0.02em', whiteSpace: 'pre', display: 'flex'}}>
        {word.map((w, i) => <span key={i} style={{color: w.col, opacity: w.o}}>{w.c}</span>)}
      </div>
    </div>
  );
};

// ───────── 渐变色块擦字 ─────────
// a0 = 色块左端冒出；a1 = 拉满整行；a2 = 后沿扫到尽头
type Wipe = {a0: number; a1: number; a2: number};
const WIPE_COLORS = ['#faf0e2', '#f6d2b6', '#e7c0c4', '#d6cfeb', '#d8e6ec'];
const WipeLine: React.FC<{f: number; text: string; y: number; w: Wipe; size: number}> = ({f, text, y, w, size}) => {
  const chars = Array.from(text);
  const lineW = chars.length * size;
  const x0 = 960 - lineW / 2 - 16, x1 = 960 + lineW / 2 + 16;
  const right = kf(f, [[w.a0, x0 + 40], [w.a1, x1, EASE.swift]]);
  const left = kf(f, [[w.a1 - 1, x0], [w.a2, x1, EASE.swift]]);
  const show = f >= w.a0 && f <= w.a2 + 1;
  const sat = clamp((f - w.a0) / (w.a1 - w.a0));
  const fadeOut = 1 - clamp((f - (w.a2 - 2)) / 3);
  return (
    <>
      {show && right - left > 2 && (
        <div style={{position: 'absolute', left, top: y - size * 0.62, width: right - left, height: size * 1.24, borderRadius: 10, overflow: 'hidden', opacity: 0.85 * fadeOut,
          WebkitMaskImage: 'linear-gradient(90deg, rgba(0,0,0,0.3), #000 14%, #000 84%, rgba(0,0,0,0.2))'}}>
          {/* 渐变固定在整行上，色块只是露出其中一段；刚冒出时只有淡青灰 */}
          <div style={{position: 'absolute', left: x0 - left, top: 0, width: x1 - x0, height: '100%', background: `linear-gradient(90deg, ${WIPE_COLORS.join(', ')})`, filter: `saturate(${mix(0.2, 1, sat).toFixed(2)})`}} />
          <div style={{position: 'absolute', inset: 0, background: '#d5e0e6', opacity: 1 - sat}} />
        </div>
      )}
      <div style={{position: 'absolute', left: 960 - lineW / 2, top: y - size * 0.62, width: lineW, height: size * 1.24, display: 'flex', fontFamily: SANS, fontSize: size, fontWeight: 500, lineHeight: `${size * 1.24}px`, whiteSpace: 'pre'}}>
        {chars.map((c, i) => {
          const cx = 960 - lineW / 2 + (i + 0.5) * size;
          const front = left + (right - left) * 0.55; // 字在色块中段之后才冒出来
          if (f < w.a0 || front < cx - size * 0.3) return <span key={i} style={{width: size, opacity: 0}}>{c}</span>;
          // 前沿过了：浅棕带虚；后沿过了：3 帧内变墨、变实
          const passedAt = w.a1 - 1 + (w.a2 - w.a1 + 1) * clamp((cx - x0) / (x1 - x0)) ** 1.2;
          const ink = f >= w.a2 + 6 ? 1 : clamp((f - passedAt) / 4);
          const appear = f > w.a2 ? 1 : clamp((front - (cx - size * 0.3)) / (size * 0.8));
          return <span key={i} style={{width: size, textAlign: 'center', opacity: appear, color: rgbMix([150, 118, 92], [22, 21, 28], ink), filter: ink < 0.98 ? `blur(${((1 - ink) * 2.4).toFixed(2)}px)` : undefined}}>{c}</span>;
        })}
      </div>
    </>
  );
};

// ───────── 隧道 ─────────
const P = 1000; // perspective
const WX = 1344, WY = 760; // 方筒半宽 / 半高
type Wall = 'L' | 'R' | 'T' | 'B';
type TCard = {wall: Wall; u: number; z: number; w: number; kind: number; tilt: number; delay: number};
const mk = (wall: Wall, n: number, seed: number, zMin: number, zMax: number, wMin: number, wMax: number): TCard[] =>
  Array.from({length: n}, (_, i) => {
    const u = -0.92 + ((i + 0.5) / n) * 1.84 + (hash(i, seed) - 0.5) * 0.18;
    const z = mix(zMin, zMax, (((i * 0.618) + hash(i, seed + 1) * 0.3) % 1));
    // 墙中间的先到、角上的后到
    const delay = Math.abs(u) * 6.5 + hash(i, seed + 2) * 1.6;
    return {wall, u, z, w: mix(wMin, wMax, hash(i, seed + 3)), kind: Math.floor(hash(i, seed + 4) * SCENE_KINDS.length), tilt: (hash(i, seed + 5) - 0.5) * 10, delay};
  });
// 2026-11-17 第4轮返工（用户：卡片角度不对）：照原片 4.0s 逐张量过——卡片是贴在方筒内壁上的，
//   左右墙的卡竖边保持竖直、上下边朝灭点收（= 卡面就在墙面里，rotateY ±90°）；顶底的卡横边水平、两侧边朝灭点收（rotateX ∓90°）；
//   没有额外歪斜。量到的位置：左右墙卡屏幕 x 偏离中心 510–960px（k 0.38–0.71），顶底卡 y 偏离 360–480px。
const TCARDS: TCard[] = [
  ...mk('L', 9, 11, -1750, 300, 360, 440),
  ...mk('R', 9, 23, -1750, 300, 360, 440),
  ...mk('T', 9, 37, -1200, 250, 480, 600),
  ...mk('B', 9, 51, -1200, 250, 480, 600),
];
// 隧道后退：66–90 起步，之后匀速 1.45 单位/帧
const DV = 2.5, D0 = 50, D1 = 78;
const dollyZ = (f: number) => {
  if (f < D0) return 0;
  if (f < D1) { const t = f - D0; return -(DV * t * t) / (2 * (D1 - D0)); }
  return -(DV * (D1 - D0)) / 2 - DV * (f - D1);
};
const FLY0 = 36;

const tunnelCard = (c: TCard, i: number, f: number) => {
  const s0 = FLY0 + c.delay;
  if (f < s0) return null;
  const p = outQuart(clamp((f - s0) / 13));
  const z = c.z + 900 * (1 - p) + dollyZ(f);
  if (P - z < 160) return null;
  const k = P / (P - z);
  let x = 0, y = 0, rx = 0, ry = 0;
  if (c.wall === 'L' || c.wall === 'R') {
    x = c.wall === 'L' ? -WX : WX; y = c.u * WY * 1.12;
    ry = c.wall === 'L' ? 90 : -90;
  } else {
    y = c.wall === 'T' ? -WY : WY; x = c.u * WX * 0.78;
    rx = c.wall === 'T' ? -90 : 90;
  }
  // 卡面在墙里：沿深度方向的长度 = 左右墙取卡宽、顶底取卡高；近沿 / 远沿各自按透视算
  const side = c.wall === 'L' || c.wall === 'R';
  const depth = side ? c.w : (c.w * 9) / 16;
  const zFar = z - depth / 2, zNear = z + depth / 2;
  if (P - zNear < 60) return null;
  const kFar = P / (P - zFar);
  const kNear = P / (P - zNear);
  // 画外的不画（远沿都在画外 = 整张在画外）
  const farOff = side ? WX * kFar : WY * kFar;
  const across = side ? Math.abs(y) * kNear - (c.w * 9) / 32 * kNear : Math.abs(x) * kNear - (c.w / 2) * kNear;
  if (farOff > (side ? 1000 : 580) || across > (side ? 600 : 1000)) return null;
  const arrive = s0 + 11;
  const thermal = 1 - clamp((f - arrive - hash(i, 9) * 2) / 6);
  // 退到中心标语区附近的卡慢慢淡掉（原片左右卡最里到 x≈450 / 1470，顶底卡最里到 y≈170 / 900）
  const inner = side ? (farOff - 470) / 30 : (farOff - 350) / 30;
  const op = clamp(0.2 + (f - s0) / 7) * clamp(inner);
  if (op < 0.01) return null;
  return (
    <div key={i} style={{position: 'absolute', left: -c.w / 2, top: (-c.w * 9) / 32, transform: `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, ${z.toFixed(2)}px) rotateY(${ry.toFixed(2)}deg) rotateX(${rx.toFixed(2)}deg) rotateZ(0deg)`, backfaceVisibility: 'hidden', opacity: op}}>
      <SceneCard kind={SCENE_KINDS[c.kind]} uid={`t${i}`} w={c.w} variant={i} thermal={thermal} radius={c.w * 0.08} />
    </div>
  );
};

// ───────── 信息条 ─────────
const Icon: React.FC<{k: number}> = ({k}) => (
  <svg width="44" height="44" viewBox="0 0 44 44"><circle cx="22" cy="22" r="21" fill="#f1f1f3" />
    {k === 0 && <><rect x="12" y="16" width="14" height="12" rx="2" fill="none" stroke="#8a8a90" strokeWidth="1.6" /><path d="M26 20 L32 17 V27 L26 24" fill="none" stroke="#8a8a90" strokeWidth="1.6" strokeLinejoin="round" /></>}
    {k === 1 && <><circle cx="22" cy="18" r="5" fill="none" stroke="#8a8a90" strokeWidth="1.6" /><path d="M13 31 q9 -10 18 0" fill="none" stroke="#8a8a90" strokeWidth="1.6" /></>}
    {k === 2 && <><rect x="13" y="14" width="18" height="17" rx="3" fill="none" stroke="#8a8a90" strokeWidth="1.6" /><path d="M13 20 H31 M18 11 V16 M26 11 V16" stroke="#8a8a90" strokeWidth="1.6" /></>}
  </svg>
);
const INFO = [['开场片', '类型'], ['逐梦剪辑', '出品'], ['2026 年 11 月', '完成时间']];

export const CardTunnelTagline: React.FC = () => {
  const f = useCurrentFrame();
  const info = 0.5 * EASE.smooth(clamp((f - 66) / 24));
  return (
    <AbsoluteFill style={{background: '#fefefe', overflow: 'hidden'}}>
      {/* 隧道 */}
      <div style={{position: 'absolute', inset: 0, perspective: P, perspectiveOrigin: '50% 50%'}}>
        <div style={{position: 'absolute', left: 960, top: 540, width: 0, height: 0, transformStyle: 'preserve-3d'}}>
          {TCARDS.map((c, i) => tunnelCard(c, i, f))}
        </div>
      </div>
      <LogoCard f={f} />
      <WipeLine f={f} text="把你拍下的每一段" y={634} size={84} w={{a0: 29, a1: 34, a2: 43.5}} />
      <WipeLine f={f} text="都变成能看的片子" y={736} size={84} w={{a0: 49.5, a1: 57, a2: 67.5}} />
      {info > 0.003 && (
        <div style={{position: 'absolute', left: 560, width: 800, top: 822, display: 'flex', justifyContent: 'space-between', opacity: info, fontFamily: SANS}}>
          {INFO.map(([a, b], i) => (
            <div key={i} style={{display: 'flex', alignItems: 'center', gap: 14, paddingRight: 20, borderRight: i < 2 ? '1px solid #eee' : undefined}}>
              <Icon k={i} />
              <div><div style={{fontSize: 26, color: '#6b6b6b'}}>{a}</div><div style={{fontSize: 21, color: '#9a9a9a', marginTop: 2}}>{b}</div></div>
            </div>
          ))}
        </div>
      )}
      <Grain opacity={0.02} />
    </AbsoluteFill>
  );
};
