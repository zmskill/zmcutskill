// plane.ts — 把一块平面（卡片 / 面板 / 截图）按"屏幕四角"贴到画面上：四角 → 单应矩阵 → CSS matrix3d
// 四角来自 tools/shot-lab/track_plane.py（原片逐帧量出来的），不要用 rotateX/Y + perspective 去凑。
// 用法：
//   const H = homFromQuad(quad, W, H);              // quad = [x0,y0, x1,y1, x2,y2, x3,y3]，对应本地 (0,0)(W,0)(W,H)(0,H)
//   <div style={{position:'absolute', left:0, top:0, width:W, height:H, transformOrigin:'0 0', transform: homCss(H)}}>…</div>
//   贴在平面上的东西（光标、标签）：homApply(H, u, v) 得到屏幕坐标
// 注意：这个 div 要放在屏幕坐标层里（不在世界 / 镜头变换里）；父层要有 zIndex，免得里面的 zIndex 压到光标上面。
export type Quad = number[];

export const homFromQuad = (q: Quad, W: number, Hh: number): number[] => {
  const [x0, y0, x1, y1, x2, y2, x3, y3] = q;
  const dx1 = x1 - x2, dx2 = x3 - x2, dy1 = y1 - y2, dy2 = y3 - y2, sx = x0 - x1 + x2 - x3, sy = y0 - y1 + y2 - y3;
  const den = dx1 * dy2 - dx2 * dy1;
  const g = (sx * dy2 - dx2 * sy) / den, h = (dx1 * sy - sx * dy1) / den;
  const a = x1 - x0 + g * x1, b = x3 - x0 + h * x3, d = y1 - y0 + g * y1, e = y3 - y0 + h * y3;
  return [a / W, b / Hh, x0, d / W, e / Hh, y0, g / W, h / Hh, 1];
};

export const homApply = (H: number[], u: number, v: number): [number, number] => {
  const w = H[6] * u + H[7] * v + H[8];
  return [(H[0] * u + H[1] * v + H[2]) / w, (H[3] * u + H[4] * v + H[5]) / w];
};

export const homCss = (H: number[]) =>
  `matrix3d(${[H[0], H[3], 0, H[6], H[1], H[4], 0, H[7], 0, 0, 1, 0, H[2], H[5], 0, H[8]].map((x) => x.toFixed(7)).join(',')})`;

// 关键帧四角插值（keys = [[t, x0,y0,...,x3,y3], ...]，t 秒；单调三次）
export const quadAt = (keys: number[][], t: number, mk: (t: number, K: number[][]) => number): Quad =>
  [1, 2, 3, 4, 5, 6, 7, 8].map((j) => mk(t, keys.map((r) => [r[0], r[j]])));
