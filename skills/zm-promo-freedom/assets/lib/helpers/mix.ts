// mix.ts（references/sound-and-sfx.md）— 让音乐给同步点重音让路。
// 大声（重击、落版、魔法瞬间）出来的那一下，音乐压下去几分贝，半秒内回来；不与重音效挤在一起。
// 用法：<Audio src={bgm} volume={(f) => BGM_VOL * duck(f, HITS)} />      HITS = [{at: hitF(16), db: 6}, …]
export type Duck = {at: number; db?: number; pre?: number; hold?: number; release?: number};
// at：大声的峰值帧；db：压几分贝（默认 6）；pre：提前几帧开始压（默认 2）；hold：压住几帧（默认 5）；release：几帧回来（默认 12）
export const duck = (frame: number, hits: Duck[]): number => {
  let g = 1;
  for (const h of hits) {
    const db = h.db ?? 6, pre = h.pre ?? 2, hold = h.hold ?? 5, rel = h.release ?? 12;
    const x = frame - h.at; let k = 0; // k：压下去的程度 0→1
    if (x >= -pre && x < 0) k = (x + pre) / pre;
    else if (x >= 0 && x <= hold) k = 1;
    else if (x > hold && x < hold + rel) k = 1 - (x - hold) / rel;
    g = Math.min(g, Math.pow(10, (-db * k) / 20));
  }
  return g;
};
/** 整段静音（"屏住一拍"）：from–to 帧之间音乐没有，两头各 fade 帧过渡。 */
export const gap = (frame: number, from: number, to: number, fade = 2): number =>
  frame <= from - fade || frame >= to + fade ? 1 : frame < from ? (from - frame) / fade : frame > to ? (frame - to) / fade : 0;
/** 分贝 → 音量系数 */
export const dbToGain = (db: number) => Math.pow(10, db / 20);
