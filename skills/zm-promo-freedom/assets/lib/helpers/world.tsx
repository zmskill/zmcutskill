// world.tsx — 3D 连续空间运镜与真实运动模糊（纯 CSS 3D，零额外依赖）。
// 用法见 references/motion-and-camera.md 第三节。
//
//   const KEYS: CamKey[] = [
//     {f: 0,           x: 0,    y: 0, z: 1200},            // 正对 A（A 在世界坐标 0,0）
//     {f: onF(8) - 6,  x: 0,    y: 0, z: 1000},            // 慢慢推近 A
//     {f: onF(9) + 4,  x: 2600, y: 0, z: 1200, ry: 0},     // 飞到 B（B 在 2600,0），中途不停
//   ];
//   <World keys={KEYS}>
//     <Stage x={0} y={0}>      <PartPlay from={...} to={...}><A/></PartPlay> </Stage>
//     <Stage x={2600} y={0} ry={-25} from={onF(8) - 10}> <PartPlay from={...} to={...}><B/></PartPlay> </Stage>
//   </World>
import React from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig} from 'remotion';

export type CamKey = {
  f: number;                 // 片子里的帧号（可以是小数：从拍号、实测重拍来）
  x: number; y: number;      // 镜头对着世界里的哪一点（像素；一块 1920×1080 的 Stage 中心就是它的 x,y）
  z?: number;                // 镜头离那一点多远。等于 PERSPECTIVE（默认 1200）时，一块 Stage 正好满屏；小 = 推近，大 = 拉远
  rx?: number; ry?: number; rz?: number;   // 镜头自己转多少度（俯仰、左右摇、歪头）
  ease?: 'through' | 'stop'; // 'through'（默认）= 带着速度穿过这一点；'stop' = 在这一点速度降到 0（只用在真正要停下来看的地方）
};
export type Cam = {x: number; y: number; z: number; rx: number; ry: number; rz: number};
export const PERSPECTIVE = 1200;
const DIMS = ['x', 'y', 'z', 'rx', 'ry', 'rz'] as const;
const val = (k: CamKey, d: (typeof DIMS)[number]) => (d === 'z' ? k.z ?? PERSPECTIVE : (k[d] ?? 0));

/** 镜头在第 f 帧的位置：过每个关键点的 Hermite 曲线，位置和速度都连续（不会急停急起）。首尾和 ease:'stop' 的点速度为 0。 */
export const camAt = (keys: CamKey[], f: number): Cam => {
  const K = [...keys].sort((a, b) => a.f - b.f); const n = K.length; const out: any = {};
  if (f <= K[0].f) { DIMS.forEach((d) => (out[d] = val(K[0], d))); return out; }
  if (f >= K[n - 1].f) { DIMS.forEach((d) => (out[d] = val(K[n - 1], d))); return out; }
  let i = 0; while (i < n - 2 && f >= K[i + 1].f) i++;
  const h = K[i + 1].f - K[i].f; const t = (f - K[i].f) / h;
  const h00 = 2 * t ** 3 - 3 * t ** 2 + 1, h10 = t ** 3 - 2 * t ** 2 + t, h01 = -2 * t ** 3 + 3 * t ** 2, h11 = t ** 3 - t ** 2;
  const slope = (j: number, d: (typeof DIMS)[number]) => {
    if (j === 0 || j === n - 1 || K[j].ease === 'stop') return 0;
    const a = (val(K[j], d) - val(K[j - 1], d)) / (K[j].f - K[j - 1].f), b = (val(K[j + 1], d) - val(K[j], d)) / (K[j + 1].f - K[j].f);
    return a * b <= 0 ? 0 : (a + b) / 2;   // 方向掉头的点不冲过头
  };
  DIMS.forEach((d) => { out[d] = h00 * val(K[i], d) + h10 * h * slope(i, d) + h01 * val(K[i + 1], d) + h11 * h * slope(i + 1, d); });
  return out;
};

/** 镜头这一帧在屏幕上大概挪了多少像素（用来决定要不要做运动模糊、音效给多大） */
export const camSpeed = (keys: CamKey[], f: number): number => {
  const a = camAt(keys, f), b = camAt(keys, f - 1);
  return Math.hypot(a.x - b.x, a.y - b.y) * (PERSPECTIVE / Math.max(200, a.z)) + Math.abs(a.z - b.z) * 0.8 + (Math.abs(a.ry - b.ry) + Math.abs(a.rx - b.rx) + Math.abs(a.rz - b.rz)) * 20;
};

/**
 * 一次"卡在拍上的移动"的进度（0→1）：速度曲线是一个鼓包，没有尖角——拍前 lead 帧加速，**最快的那一帧正好在 hit 上**，拍后 tail 帧减下来。
 * 减速要比加速长得多（默认 6 / 18，至少 2 倍）：起得快、落得软。不要用 ease-in-out 对称曲线，也不要 1–3 帧弹出来。
 */
export const ramp = (f: number, hit: number, lead = 6, tail = 18): number => {
  const p = (3 * lead) / (3 * lead + 2 * tail);          // 让加速段末尾和减速段开头的速度相等（速度连续）
  if (f <= hit - lead) return 0;
  if (f >= hit + tail) return 1;
  if (f < hit) { const t = (f - (hit - lead)) / lead; return p * t * t; }
  const u = (f - hit) / tail; return p + (1 - p) * (1 - Math.pow(1 - u, 3));
};

export type CamMove = {hit: number; to: Partial<Cam>; lead?: number; tail?: number};   // 镜头的移动默认 lead 8、tail 16
/**
 * 用一串"卡在拍上的移动"拼出镜头：每一次移动最快的那一帧落在 hit 上；两次移动之间镜头不停，按 drift（每帧走多少，默认每帧往前推 3）一直慢慢漂。
 * 每次移动的 to 是镜头到位时的位置；慢漂从到位那一刻重新起算，不会越漂越偏。
 *   const cam = camMoves({x: 0, y: 0, z: 1200}, [
 *     {hit: hitF(8),  to: {x: 2700, z: 1300, ry: -20}},           // 第 8 拍：飞到 B，最快的一刻在拍上
 *     {hit: hitF(12), to: {x: 2700, y: 1900, ry: 0}, lead: 10, tail: 18},
 *   ]);                                                           // 没在飞的时候默认每帧往前推 3（量片认得出"在动"，读字也不受影响）
 *   <World cam={cam}>…</World>
 * 相邻两次移动别重叠：下一次的 hit - lead 要晚于上一次的 hit + tail。
 */
export const camMoves = (start: Partial<Cam>, moves: CamMove[], drift: Partial<Cam> = {z: -3}) => (f: number): Cam => {
  const M = [...moves].sort((a, b) => a.hit - b.hit); const out: any = {};
  const R = (m: CamMove) => ramp(f, m.hit, m.lead ?? 8, m.tail ?? 16);
  DIMS.forEach((d) => {
    let v = (start as any)[d] ?? (d === 'z' ? PERSPECTIVE : 0);
    for (const m of M) { const to = (m.to as any)[d]; if (to === undefined) continue; v += (to - v) * R(m); }
    // 慢漂：每到一次移动就重新起算（上一段漂出去的量在这次移动里收回来），所以漂多久都不会越漂越偏
    const dr = (drift as any)[d] ?? 0; let off = 0;
    for (let k = 0; k <= M.length; k++) {
      const s0 = k === 0 ? 0 : M[k - 1].hit; if (f < s0) break;
      off += dr * (f - s0) * (k < M.length ? 1 - R(M[k]) : 1);
    }
    out[d] = v + off;
  });
  return out;
};

/**
 * 卡拍硬切时的"速度接力"（cut on peak velocity）：上一镜在拍前 lead 帧里朝一个方向越走越快，**切在最快的那一帧**；
 * 下一镜第一帧就带着同样的速度、同一个方向进来（它已经走到自己路程的后半段了，不是从静止起步），tail 帧里减下来停稳。
 * 两边都只挪一小段（默认上一镜 240px，约画面的 12%），不用整个飞出画面。返回两边各自该挪多少（out 从 0 变大，in 从大变 0）。
 *   const r = relay(f, onF(16));
 *   上一镜外层（f < 切点）：transform: `translateX(${-r.out}px)`
 *   下一镜外层（f ≥ 切点）：transform: `translateX(${r.in}px)`      // 同一根轴、同一个方向：都是往左
 * 做推进接力（Z 方向）：上一镜 scale(1 + r.out / 1200)，下一镜 scale(1 - r.in / 1200)——两边都是"在变大"，符号要一样。
 * 两边不加模糊、不淡入淡出。
 */
export const relay = (f: number, hit: number, dist = 240, lead = 9, tail = 15): {out: number; in: number; speed: number} => {
  const t = Math.max(0, Math.min(1, (f - (hit - lead)) / lead)); const u = Math.max(0, Math.min(1, (f - hit) / tail));
  const speed = (4 * dist) / lead;                        // 切的那一帧每帧走多少像素；下一镜的路程按它配，两边速度一样
  return {out: dist * Math.pow(t, 4), in: ((speed * tail) / 4) * Math.pow(1 - u, 4), speed};
};

const worldCss = (c: Cam, W: number, H: number) =>
  `translate3d(${W / 2}px, ${H / 2}px, ${PERSPECTIVE}px) rotateZ(${-c.rz}deg) rotateX(${-c.rx}deg) rotateY(${-c.ry}deg) translate3d(${-c.x}px, ${-c.y}px, ${-c.z}px)`;

/**
 * 一个连续的空间。里面放若干 <Stage>，镜头按 keys 在它们之间连续地飞。
 * 镜头给法二选一：keys（一串关键点，Hermite 连起来）或 cam（一个函数，通常用 camMoves 拼）。
 * blur：镜头每帧挪超过 6px 就自动做运动模糊（同一帧里把镜头走过的这一小段叠起来，相当于快门开 0.9 帧）。数字 = 最多叠几层，0 = 关（成片不许关）。
 * 没有运动模糊的中等速度移动会"频闪"（一格一格跳）；文字边缘对比越强越明显。
 */
export const World: React.FC<{keys?: CamKey[]; cam?: (f: number) => Cam; blur?: number; shutter?: number; background?: React.ReactNode; children: React.ReactNode}> = ({keys, cam, blur = 12, shutter = 0.9, background, children}) => {
  const f = useCurrentFrame(); const {width: W, height: H} = useVideoConfig();
  const at = (x: number): Cam => (cam ? cam(x) : camAt(keys ?? [{f: 0, x: 0, y: 0}], x));
  const a_ = at(f), b_ = at(f - 1);
  const sp = Math.hypot(a_.x - b_.x, a_.y - b_.y) * (PERSPECTIVE / Math.max(200, a_.z)) + Math.abs(a_.z - b_.z) * 0.8 + (Math.abs(a_.ry - b_.ry) + Math.abs(a_.rx - b_.rx) + Math.abs(a_.rz - b_.rz)) * 20; const n = blur > 0 && sp > 6 ? Math.min(blur, Math.max(2, Math.ceil((sp * shutter) / 7))) : 1;   // 每帧挪超过 6px 就开始叠；层与层之间不超过 7px，不然会看见重影
  const layer = (i: number) => (
    <AbsoluteFill key={i} style={{opacity: 1 / (i + 1), perspective: PERSPECTIVE, perspectiveOrigin: '50% 50%', overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: 0, height: 0, transformStyle: 'preserve-3d', transform: worldCss(at(f - (shutter * i) / n), W, H)}}>{children}</div>
    </AbsoluteFill>
  );
  return (
    <AbsoluteFill>
      {background}
      {Array.from({length: n}, (_, i) => layer(i))}
    </AbsoluteFill>
  );
};

/**
 * 空间里的一块"屏"：把一个镜头（零件、截图、任何 1920×1080 的内容）摆在世界里的某个位置。
 * from / to：只在这段帧里存在（省渲染时间；里面内容的第 0 帧 = from）。镜头飞到它之前就要已经在了，而且已经在动。
 */
export const Stage: React.FC<{x: number; y: number; z?: number; rx?: number; ry?: number; rz?: number; scale?: number; w?: number; h?: number; from?: number; to?: number; radius?: number; children: React.ReactNode}> = ({x, y, z = 0, rx = 0, ry = 0, rz = 0, scale = 1, w = 1920, h = 1080, from = 0, to = Infinity, radius = 0, children}) => {
  const f = useCurrentFrame();
  if (f < from || f >= to) return null;
  return (
    <div style={{position: 'absolute', left: -w / 2, top: -h / 2, width: w, height: h, overflow: 'hidden', borderRadius: radius, backfaceVisibility: 'hidden',
      transform: `translate3d(${x}px, ${y}px, ${z}px) rotateY(${ry}deg) rotateX(${rx}deg) rotateZ(${rz}deg) scale(${scale})`}}>
      <Sequence from={from} layout="none">{children}</Sequence>
    </div>
  );
};

/** 干净的冲击：提亮曝光（不是盖一层半透明白，那样会发灰）。at 那一帧最亮，之后 decay 帧内回落。用在外层容器的 style.filter 上。 */
export const punch = (frame: number, at: number, amount = 0.6, decay = 6): string => {
  const t = frame - at; const k = t < 0 || t > decay ? 0 : Math.pow(1 - t / decay, 2);
  return k === 0 ? 'none' : `brightness(${1 + amount * k}) contrast(${1 + 0.25 * k}) saturate(${1 + 0.3 * k})`;
};
