// 固定种子的伪随机数：同一个种子永远得到同一串数（0–1），渲染哪一帧、渲几次结果都一样。不要用 Math.random()。
// 算法是公开的 mulberry32。
export const mulberry32 = (seed: number) => {
  let state = seed | 0;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let x = Math.imul(state ^ (state >>> 15), 1 | state);
    x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x;
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
};
