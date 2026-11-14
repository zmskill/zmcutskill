// groupClock.ts — 镜头组的"合同时钟"（4.0 新增；思路学自阿杜 adu-motion-video 的"受保护动作窗 + 可停留区"，代码为本项目新写）
//
// 为什么要它：同一个镜头组，宣传片里按原长演，口播或长文案时要多停一会儿。
// 规则：动作区永远原速；多出来的时间只在声明过的停留点"停住"，最多停到 maxExtra 秒。
// 停住时信息元素不动（源时钟暂停），镜头的慢推慢漂用输出时钟 t 继续算，所以画面不会冻住（见 aesthetic-rules R7）。
//
// 用法（镜头组组件里）：
//   export const CARD_PICK_CONTRACT: GroupContract = { ... };            // 唯一事实源，卡上的数字从这里抄
//   const t = frame / fps;                                              // 输出秒
//   const s = toSource(t, CARD_PICK_CONTRACT, extras);                  // 源秒：所有动作按 s 算
//   const drift = 1 + 0.02 * t;                                         // 镜头慢推按 t 算
// 做片时：extras = planExtras(CARD_PICK_CONTRACT, 目标时长)；音效 = sfxCues(CARD_PICK_CONTRACT, extras)。
// 全部是纯函数，任意一帧可单独渲染，满足确定性渲染要求。

export type Hold = { at: number; maxExtra: number }; // at = 源秒（必须落在停留区里，不在动作区里）
export type Sfx = { at: string | number; offset?: number; type: string; file?: string; tail?: number; volume?: number };
export type InputSpec = { maxChars?: number; count?: number };

export type GroupContract = {
  sourceDuration: number; // 原长（秒）
  fps: number;
  motion: Array<[number, number]>; // 动作区（源秒），原速
  holds: Hold[]; // 停留点
  landmarks: Record<string, number>; // 落点（源秒）
  sfx?: Sfx[]; // 音效清单：at = 落点名或源秒
  inputs?: Record<string, InputSpec>; // 输入字段与上限（maxChars 仍需用真实字体实测）
};

const sorted = (c: GroupContract) => [...c.holds].sort((a, b) => a.at - b.at);

/** 检查合同本身：停留点不能落在动作区里，落点和音效要在原长以内。返回问题清单（空 = 通过）。 */
export function checkContract(c: GroupContract): string[] {
  const out: string[] = [];
  for (const h of c.holds) {
    if (h.maxExtra < 0) out.push(`停留点 ${h.at}s 的 maxExtra 不能为负`);
    for (const [a, b] of c.motion) if (h.at > a && h.at < b) out.push(`停留点 ${h.at}s 落在动作区 ${a}–${b}s 里`);
  }
  for (const [k, v] of Object.entries(c.landmarks)) if (v < 0 || v > c.sourceDuration) out.push(`落点 ${k}@${v}s 超出原长`);
  for (const s of c.sfx ?? []) if (typeof s.at === 'string' && !(s.at in c.landmarks)) out.push(`音效指向不存在的落点 ${s.at}`);
  return out;
}

/** extras[i] 对应按时间排序后的第 i 个停留点。超出上限直接报错（装不下就换组，不硬塞）。 */
export function checkExtras(c: GroupContract, extras: number[]): void {
  const hs = sorted(c);
  if (extras.length !== hs.length) throw new Error(`extras 数量 ${extras.length} ≠ 停留点数量 ${hs.length}`);
  extras.forEach((e, i) => {
    if (e < 0) throw new Error(`停留点 ${hs[i].at}s 的延长不能为负`);
    if (e > hs[i].maxExtra + 1e-9) throw new Error(`停留点 ${hs[i].at}s 延长 ${e}s 超过上限 ${hs[i].maxExtra}s`);
  });
}

export const outputDuration = (c: GroupContract, extras: number[]) =>
  c.sourceDuration + extras.reduce((a, b) => a + b, 0);

/** 输出秒 → 源秒。停留期间返回停留点本身（信息元素停住）。 */
export function toSource(t: number, c: GroupContract, extras: number[]): number {
  checkExtras(c, extras);
  let acc = 0;
  const hs = sorted(c);
  for (let i = 0; i < hs.length; i++) {
    const start = hs[i].at + acc;
    if (t < start) return t - acc;
    if (t <= start + extras[i]) return hs[i].at;
    acc += extras[i];
  }
  return t - acc;
}

/** 源秒 → 输出秒（落点、音效用）。恰好在停留点上的事件算在停留开始时。 */
export function toOutput(s: number, c: GroupContract, extras: number[]): number {
  checkExtras(c, extras);
  let acc = 0;
  sorted(c).forEach((h, i) => { if (h.at < s) acc += extras[i]; });
  return s + acc;
}

export const landmarkAt = (name: string, c: GroupContract, extras: number[]) => {
  if (!(name in c.landmarks)) throw new Error(`没有落点 ${name}`);
  return toOutput(c.landmarks[name], c, extras);
};

/**
 * 把镜头组撑到目标时长：按各停留点上限的比例分配，结果取整到整帧（目标时长也按整帧算）。
 * 目标短于原长 → 报错（动作区不能压缩，换更短的组）；超过全部上限 → 报错（拆段或换组）。
 */
export function planExtras(c: GroupContract, target: number): number[] {
  const hs = sorted(c);
  const need = target - c.sourceDuration;
  if (need < -1e-9) throw new Error(`目标 ${target}s 短于原长 ${c.sourceDuration}s：动作区不能压缩，换更短的组`);
  const cap = hs.reduce((a, h) => a + h.maxExtra, 0);
  if (need > cap + 1e-9) throw new Error(`需要多停 ${need.toFixed(2)}s，超过全部停留上限 ${cap}s：拆段或换组`);
  if (need <= 0 || cap === 0) return hs.map(() => 0);
  // 按比例分，再取整到整帧（2026-11-10 实测：非整帧延长会让停留后的所有动作错开半帧，同一源时刻渲出的画面不一致）
  const fps = c.fps, needF = Math.round(need * fps);
  const raw = hs.map((h) => (needF * h.maxExtra) / cap);
  const capF = hs.map((h) => Math.floor(h.maxExtra * fps + 1e-6));
  const out = raw.map((r, i) => Math.min(capF[i], Math.floor(r + 1e-9)));
  let left = needF - out.reduce((x, y) => x + y, 0);
  const order = raw.map((r, i) => [r - Math.floor(r + 1e-9), i]).sort((x, y) => y[0] - x[0]).map((x) => x[1]);
  for (let k = 0; left > 0 && k < order.length * 2; k++) { const i = order[k % order.length]; if (out[i] < capF[i]) { out[i]++; left--; } }
  return out.map((f) => f / fps);
}

/** 音效清单换算成输出秒（跟着动作走）。 */
export function sfxCues(c: GroupContract, extras: number[]) {
  return (c.sfx ?? []).map((s) => {
    const src = typeof s.at === 'string' ? c.landmarks[s.at] : s.at;
    return { ...s, t: toOutput(src, c, extras) + (s.offset ?? 0) };
  });
}

/** 检查输入是否装得下（只数字数和项数；真实宽度仍要用最终字体渲染检查）。返回问题清单。 */
export function checkInputs(c: GroupContract, inputs: Record<string, string | string[]>): string[] {
  const out: string[] = [];
  for (const [k, spec] of Object.entries(c.inputs ?? {})) {
    const v = inputs[k];
    if (v === undefined) { out.push(`缺输入 ${k}`); continue; }
    const items = Array.isArray(v) ? v : [v];
    if (spec.count !== undefined && items.length !== spec.count) out.push(`${k} 需要正好 ${spec.count} 项，给了 ${items.length} 项：换组，不凑不删`);
    if (spec.maxChars !== undefined) items.forEach((x, i) => {
      if ([...x].length > spec.maxChars!) out.push(`${k}${items.length > 1 ? `[${i}]` : ''} "${x}" 超过 ${spec.maxChars} 字：先精简文案，不缩字号`);
    });
  }
  return out;
}
