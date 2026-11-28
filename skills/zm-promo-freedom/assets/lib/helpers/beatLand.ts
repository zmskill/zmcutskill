// beatLand.ts — 「拍前提前出发、拍上落定」（来自 AI 产品宣传片 2.0 的 motion.js，移植到 Remotion）
//
// 为什么要它：动作如果"在拍点上才开始"，眼睛看到的停顿会晚半拍，看起来总是慢一点。
// 参考片实测：动作在拍点前约 0.2 秒出发，到拍点时已经基本到位（≈95%），
// 眼睛看到"停"的那一下正好和鼓点重合，就觉得卡得准。
//
// 全部是纯函数（输入秒或帧，输出 0→1 的进度），任意一帧都能单独渲染，满足确定性渲染要求。
// 用法（Remotion 组件里）：
//   const t = frame / fps;                                               // 当前秒
//   const k = land(t, onF(12) / fps, 'settle');                          // 第 12 拍落定的进度 0→1
//   const x = trackOn(t, [[onF(4) / fps, 80], [onF(6) / fps, 320]], 'snap');  // 多次换目标，每次都在拍上落定
// 拍点帧号 onF(n) / hitF(n) 由 tools/zm_hits.py 生成（见 references/music-and-beats.md）。

export type SpringOpts = { f: number; z: number }; // f 频率 Hz，z 阻尼 0–1

// 动法分类：不同东西不同动法
export const KINDS = {
  snap: { f: 4.2, z: 0.92 }, // 小按钮、开关、勾选：利落，几乎不回弹
  settle: { f: 2.0, z: 0.62 }, // 面板、卡片：到位时有一点弹性
  bounce: { f: 2.4, z: 0.32 }, // 吉祥物、可爱元素：故意弹跳
  slam: { f: 5.0, z: 0.55 }, // 大字：砸下来，落定后停住
} as const satisfies Record<string, SpringOpts>;

export type Kind = keyof typeof KINDS | SpringOpts;

const opts = (kind: Kind): SpringOpts => (typeof kind === 'string' ? KINDS[kind] : kind);

/** 阻尼弹簧阶跃响应（闭式解）：t < t0 返回 0，之后趋于 1。单位：秒。 */
export function spring(t: number, t0: number, o: SpringOpts): number {
  const x = t - t0;
  if (x <= 0) return 0;
  const w = 2 * Math.PI * o.f;
  if (o.z >= 1) return 1 - Math.exp(-w * x) * (1 + w * x);
  const wd = w * Math.sqrt(1 - o.z * o.z);
  return 1 - Math.exp(-o.z * w * x) * (Math.cos(wd * x) + ((o.z * w) / wd) * Math.sin(wd * x));
}

const LEAD_CACHE = new Map<string, number>();

/** 这种动法需要提前多少秒出发（第一次进入终值 5% 以内所需的时间）。 */
export function lead(kind: Kind = 'settle'): number {
  const o = opts(kind);
  const key = `${o.f}/${o.z}`;
  const hit = LEAD_CACHE.get(key);
  if (hit !== undefined) return hit;
  let x = 0;
  while (x < 2 && Math.abs(1 - spring(x, 0, o)) > 0.05) x += 0.002;
  LEAD_CACHE.set(key, x);
  return x;
}

/** 在 beatSec 这一刻"落定"的进度 0→1：自动提前出发。 */
export const land = (t: number, beatSec: number, kind: Kind = 'settle'): number =>
  spring(t, beatSec - lead(kind), opts(kind));

/**
 * 一个值多次换目标，每次都在给定拍点落定。keys = [[拍点秒, 值], ...]，第一项是初始值。
 * 每次变化叠加一个弹簧，不依赖上一帧（第 812 帧不用先算前 811 帧）。
 */
export function trackOn(t: number, keys: Array<[number, number]>, kind: Kind = 'settle'): number {
  const o = opts(kind);
  const L = lead(kind);
  let v = keys[0][1];
  for (let i = 1; i < keys.length; i++) v += (keys[i][1] - keys[i - 1][1]) * spring(t, keys[i][0] - L, o);
  return v;
}
