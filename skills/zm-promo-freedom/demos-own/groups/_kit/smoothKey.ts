// 关键帧平滑插值（2026-11-18 第34批 修"一卡一卡"）
// 原来的 kf 每两个关键帧之间各自缓入缓出 → 镜头 / 位置在每个中间关键帧都会停一下，看起来像 PPT 一格格跳。
// 这里用的是动画行业的标准做法（AE 的"自动贝塞尔 / 连续贝塞尔"、Fritsch–Carlson 单调三次插值）：
// 中间关键帧速度连续、直接穿过去不停；只在第一个和最后一个关键帧缓入缓出；值相等的相邻帧（停住）不会冲过头。
export const smoothKf = (t: number, K: number[][]): number => {
  const n = K.length;
  if (t <= K[0][0]) return K[0][1];
  if (t >= K[n - 1][0]) return K[n - 1][1];
  const d: number[] = [];
  for (let i = 0; i < n - 1; i++) d.push((K[i + 1][1] - K[i][1]) / Math.max(1e-6, K[i + 1][0] - K[i][0]));
  const m: number[] = new Array(n).fill(0);
  for (let i = 1; i < n - 1; i++) {
    if (d[i - 1] * d[i] <= 0) m[i] = 0;
    else { const w1 = 2 * (K[i + 1][0] - K[i][0]) + (K[i][0] - K[i - 1][0]), w2 = (K[i + 1][0] - K[i][0]) + 2 * (K[i][0] - K[i - 1][0]); m[i] = (w1 + w2) / (w1 / d[i - 1] + w2 / d[i]); }
  }
  // 两端缓入缓出：端点斜率 0
  let i = 0; while (i < n - 2 && t > K[i + 1][0]) i++;
  const h = K[i + 1][0] - K[i][0], u = (t - K[i][0]) / h;
  const h00 = 2 * u * u * u - 3 * u * u + 1, h10 = u * u * u - 2 * u * u + u, h01 = -2 * u * u * u + 3 * u * u, h11 = u * u * u - u * u;
  return h00 * K[i][1] + h10 * h * m[i] + h01 * K[i + 1][1] + h11 * h * m[i + 1];
};
