// 贴纸球选择器：输入框右边的笑脸按钮"长"成贴满小图标的 3D 球 → 拖转三次 → 打字筛选"咖啡" → ↓↑ 切结果球自己转 → 连点 3 下插入 → Esc 两次收回（002 整段）
// 学的动作（来自 @jh3yy 表情球录屏 0–19.63s，逐元素时间表见 shot-lab/refs/002/逐元素时间表.md）：
//   ①图标 → 3D 球是同一个东西变形：笑脸淡掉 1 帧后，半透明玻璃小球从按钮左上冒出，边自转边长大、沿弧线飞到输入框上方；收回反过来
//   ②真 3D 球面（自己做旋转矩阵 + 弱透视；每块贴在切面上，靠边自动压扁、变暗；背面不画，只有弹出/收回那几帧画成玻璃）
//   ③拖转三次（横转 / 反转 / 斜翻看到极点后停在歪 10° 的姿态），都是快起慢收的惯性曲线
//   ④弯曲的搜索胶囊沿球外圈、打字时沿弧变长；不匹配的变暗留在原位
//   ⑤结果驱动转球：计数先变、球滞后才转，把当前结果送到正中；蓝框贴在球面上一起变扁
//   ⑥点击"按下 → 猛弹 → 回位"连 3 下、插入瞬间完成；底部按键提示；首尾接上可循环
// 我们的内容：贴纸选择器，约 259 个自己画的彩色小图标块（笑脸 / 爱心 / 人物 / 动物字 / 食物字 / 天气 / 符号 / 咖啡），
//   搜索拼音 k → ka → kaf → 咖啡（58 → 21 → 13 → 12 个），结果都是咖啡杯类几何图标
//
// 时间表（30fps，共 589f = 原片 19.63s 按秒×30 一一对应）
//   A    0–21   箭头静止 0.4s，再缓入缓出移到按钮，21 变小手
//   B   22–33   按钮悬停圆底淡入，30 按下
//   C   33–50   33 笑脸图标淡掉；34 玻璃小球从按钮左上冒出，半径 38→225，自转 260° 减速，沿弧线飞到 (634,561)；38 起胶囊由糊变清，42 蓝描边
//   D   57–186  光标跳到球上，悬停放大 + 灰底；78–103 横转 −100°；107–121 反转回来；124–139 慢漂；141–166 斜翻（看到极点）停在歪 10°；166–186 停住
//   E  186–212  胶囊出光标；188 k / 193 ka / 196 kaf / 199 咖啡，不匹配的 4 帧内变暗到 12%，胶囊沿弧变长
//   F  212–225  球转动把第 1 个结果送到正中，蓝框跟着变正
//   G  234–327  ↓：237/241/246/249 计数 2→5（球只轻漂），252–273 一口气转到第 5 个；288 ↑：291–303 计数 4→1，306–327 转回第 1 个
//   H  336–378  小手移到结果上悬停放大 1.25；360/367/371 连点 3 下，每下 按下→弹 1.4→回位，输入框瞬间多一个
//   I  387–423  小手移到胶囊上变斜 I 形（跟胶囊同角度），411 点击蓝描边淡入，再回到结果旁
//   J  429–482  Esc：432 搜索清空、全部亮回；468 第 2 下 Esc：按钮 + 焦点环回来 → 胶囊失焦糊掉 → 球缩小变玻璃飞回按钮 → 480 笑脸图标重现
//   K  489–589  I 形点进输入框，⌘A 全选、⌫ 删掉，光标退到下方，最后回到第 0 帧的位置（可循环）
// 毛病清单（自查表通用项 + 本镜头独有）：
//   - 独有 1：弹出 / 收回必须是"按钮里长出来"，不能淡入淡出两层切换
//   - 独有 2：筛选只变暗不消失；计数先变球后转；蓝框只在结果到位时出现
//   - 独有 3：停住段只有光标 / 球极轻微的漂动，停顿时长按原片
//   - 独有 4：图标块排布规则，30fps 快转（>3.5°/帧）会"倒转"闪烁 → 快转帧补两层 1/3 帧前的淡影（相当于原片 60fps 的顺滑）
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {EASE, FONT, bezier, mix} from '../../../kit/polish';

export const STICKER_SPHERE_PICKER_DURATION = 589;

const SANS = `"PingFang SC", "Noto Sans CJK SC", "Noto Sans SC", ${FONT.sans}`;
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
const lin = EASE.linear;
const rampL = (f: number, s: number, d: number) => clamp((f - s) / d);
const DEG = Math.PI / 180;

// ───────── 3D 小数学：3×3 行主序 ─────────
type V3 = [number, number, number];
type M3 = number[];
const I3: M3 = [1, 0, 0, 0, 1, 0, 0, 0, 1];
const mmul = (A: M3, B: M3): M3 => {
  const o = new Array(9).fill(0);
  for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) o[r * 3 + c] = A[r * 3] * B[c] + A[r * 3 + 1] * B[3 + c] + A[r * 3 + 2] * B[6 + c];
  return o;
};
const mv = (A: M3, v: V3): V3 => [A[0] * v[0] + A[1] * v[1] + A[2] * v[2], A[3] * v[0] + A[4] * v[1] + A[5] * v[2], A[6] * v[0] + A[7] * v[1] + A[8] * v[2]];
const norm = (v: V3): V3 => { const l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l]; };
const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const rotAxis = (ax: V3, t: number): M3 => {
  const [x, y, z] = norm(ax), c = Math.cos(t), s = Math.sin(t), C = 1 - c;
  return [c + x * x * C, x * y * C - z * s, x * z * C + y * s, y * x * C + z * s, c + y * y * C, y * z * C - x * s, z * x * C - y * s, z * y * C + x * s, c + z * z * C];
};
const rotX = (t: number) => rotAxis([1, 0, 0], t);
const rotY = (t: number) => rotAxis([0, 1, 0], t);
const rotZ = (t: number) => rotAxis([0, 0, 1], t);

// ───────── 图标布局：按纬线一圈圈排 ─────────
type Cat = 'smile' | 'heart' | 'person' | 'animal' | 'food' | 'nature' | 'symbol' | 'coffee';
type Icon = {p: V3; e: V3; n: V3; lon: number; cat: Cat; v: number; level: number; res: number};
const STEP = 12.7;
const ICONS: Icon[] = [];
for (let j = -7; j <= 7; j++) {
  const lat = j * STEP;
  const cnt = Math.max(1, Math.round((360 * Math.cos(lat * DEG)) / STEP));
  for (let i = 0; i < cnt; i++) {
    let lon = (i / cnt) * 360 + (j % 2 ? 180 / cnt : 0);
    if (lon >= 180) lon -= 360;
    const L = lon * DEG, B = lat * DEG;
    const idx = ICONS.length;
    const jl = lon + (hash(idx, 3) - 0.5) * 14;
    const cat: Cat = Math.abs(jl) <= 65 ? 'smile' : jl > 65 && jl <= 105 ? 'heart' : jl > 105 && jl <= 165 ? 'person'
      : jl > 165 || jl < -155 ? 'animal' : jl < -122 ? 'food' : jl < -94 ? 'nature' : 'symbol';
    ICONS.push({
      p: [Math.cos(B) * Math.sin(L), Math.sin(B), Math.cos(B) * Math.cos(L)],
      e: [Math.cos(L), 0, -Math.sin(L)],
      n: [-Math.sin(B) * Math.sin(L), Math.cos(B), -Math.sin(B) * Math.cos(L)],
      lon, cat, v: Math.floor(hash(idx, 7) * 1000), level: 0, res: -1,
    });
  }
}
const TOTAL = ICONS.length;

// ───────── 球的姿态：分段旋转（每段 = 视图空间里的一个旋转 × 段起点姿态） ─────────
type Seg = {f0: number; f1: number; start: M3; delta: (e: number) => M3; ease: Ease};
const SEGS: Seg[] = [];
let CUR: M3 = I3;
const push = (f0: number, f1: number, delta: (e: number) => M3, ease: Ease) => { SEGS.push({f0, f1, start: CUR, delta, ease}); CUR = mmul(delta(1), CUR); };
const FRONT: V3 = [0, 0, 1];
const toFront = (M: M3, i: number) => {
  const p = mv(M, ICONS[i].p);
  return {axis: norm(cross(p, FRONT)), ang: Math.acos(clamp(dot(p, FRONT), -1, 1))};
};
const nearest = (M: M3, T: V3, skip: Set<number>, ok: (i: number) => boolean = () => true) => {
  let best = -1, bd = -2; const t = norm(T);
  ICONS.forEach((ic, i) => { if (skip.has(i) || ic.cat === 'symbol' || !ok(i)) return; const d = dot(mv(M, ic.p), t); if (d > bd) { bd = d; best = i; } });
  return best;
};

// C 弹出自转（结束时回到基准姿态）
push(34, 55, (e) => rotY(-275 * DEG * (1 - e)), bezier(0.05, 0.9, 0.2, 1));
// D 第 1 次横转（内容从右往左流）
push(78, 103, (e) => rotY(-112 * DEG * e), bezier(0.4, 0, 0.22, 1));
// 第 2 次反向转回（快）
push(107, 125, (e) => rotY(112 * DEG * e), bezier(0.4, 0, 0.25, 1));
// 慢漂
push(125, 139, (e) => rotY(14 * DEG * e), bezier(0.2, 0.3, 0.4, 1));
// 第 3 次斜翻：往上翻到能看见南极（偏左下），再回到接近水平但歪 10°
push(139, 168, (e) => {
  const pitch = kf(e, [[0, 0], [0.42, -62, bezier(0.5, 0, 0.45, 1)], [1, -9, bezier(0.3, 0, 0.2, 1)]]);
  return mmul(rotZ(-10 * DEG * bezier(0.4, 0, 0.2, 1)(e)), mmul(rotX(pitch * DEG), rotY(-46 * DEG * bezier(0.55, 0, 0.3, 1)(e))));
}, lin);

// 选结果：第 1 个在打字结束时躲在右边缘后面；第 5 个在左后方很远；其他散在背面
const R200 = CUR;
const used = new Set<number>();
const RES: number[] = new Array(12).fill(-1);
RES[0] = nearest(R200, [0.97, -0.04, -0.2], used); used.add(RES[0]);
{ const {axis, ang} = toFront(CUR, RES[0]); push(212, 225, (e) => rotAxis(axis, ang * e), bezier(0.35, 0, 0.15, 1)); }
const R238 = CUR;
const backAt200 = (i: number) => mv(R200, ICONS[i].p)[2] < -0.1;
RES[4] = nearest(R238, [-0.52, 0.06, -0.85], used, backAt200); used.add(RES[4]);
{ // 第 6 个紧挨第 5 个（转到第 5 个时旁边也亮着一个）
  let best = -1, bd = -2;
  ICONS.forEach((ic, i) => { if (used.has(i) || !backAt200(i)) return; const d = dot(ic.p, ICONS[RES[4]].p); if (d > bd && d < 0.995) { bd = d; best = i; } });
  RES[5] = best; used.add(best);
}
{
  const order = ICONS.map((_, i) => i).sort((a, b) => hash(a, 11) - hash(b, 11));
  const slots = [1, 2, 3, 6, 7, 8, 9, 10, 11];
  for (const i of order) {
    if (!slots.length) break;
    if (used.has(i) || ICONS[i].cat === 'symbol') continue;
    if (mv(R200, ICONS[i].p)[2] > -0.12) continue;
    if ([...used].some((u) => dot(ICONS[u].p, ICONS[i].p) > Math.cos(32 * DEG))) continue;
    RES[slots.shift()!] = i; used.add(i);
  }
}
RES.forEach((i, k) => { ICONS[i].cat = 'coffee'; ICONS[i].v = k; ICONS[i].res = k; ICONS[i].level = 4; });
{ // 拼音前缀命中数：k 58 / ka 21 / kaf 13 / 咖啡 12
  const rest = ICONS.map((_, i) => i).filter((i) => ICONS[i].res < 0).sort((a, b) => hash(a, 19) - hash(b, 19));
  rest.slice(0, 1).forEach((i) => (ICONS[i].level = 3));
  rest.slice(1, 9).forEach((i) => (ICONS[i].level = 2));
  rest.slice(9, 46).forEach((i) => (ICONS[i].level = 1));
}
// G ↓：先轻漂，松手后一口气转到第 5 个
{ const {axis} = toFront(CUR, RES[4]); push(238, 251, (e) => rotAxis(axis, 7 * DEG * e), lin); }
{ const {axis, ang} = toFront(CUR, RES[4]); push(252, 273, (e) => rotAxis(axis, ang * e), bezier(0.45, 0, 0.18, 1)); }
// ↑：轻漂，再转回第 1 个
{ const {axis} = toFront(CUR, RES[0]); push(291, 304, (e) => rotAxis(axis, 6 * DEG * e), lin); }
{ const {axis, ang} = toFront(CUR, RES[0]); push(306, 327, (e) => rotAxis(axis, ang * e), bezier(0.45, 0, 0.18, 1)); }
// J 收回：越转越快
push(470, 481, (e) => rotY(-190 * DEG * e), EASE.exit);

const orient = (f: number): M3 => {
  let R = I3;
  for (const s of SEGS) {
    if (f < s.f0) break;
    if (f < s.f1) { R = mmul(s.delta(s.ease((f - s.f0) / (s.f1 - s.f0))), s.start); break; }
    R = mmul(s.delta(1), s.start);
  }
  // 停住时肉眼几乎看不出的微转
  return mmul(mmul(rotX(0.35 * DEG * Math.sin((f / 150) * 2 * Math.PI)), rotY(0.4 * DEG * Math.sin((f / 190) * 2 * Math.PI))), R);
};

// ───────── 时间线小函数 ─────────
const sphereR = (f: number) => f < 300
  ? kf(f, [[33, 0, lin], [34, 38, lin], [35, 64, lin], [36, 92, lin], [37, 120, lin], [38, 141, lin], [39, 163, lin], [40, 181, lin], [41, 195, lin], [42, 203, lin], [43, 211, lin], [44, 216, lin], [45, 220, lin], [46, 223, lin], [53, 225, EASE.out]])
  : kf(f, [[469, 225, lin], [470, 222, lin], [471, 212, lin], [472, 200, lin], [473, 186, lin], [474, 170, lin], [475, 155, lin], [476, 137, lin], [477, 112, lin], [478, 88, lin], [479, 55, lin], [480, 0, lin]]);
const sphereC = (f: number): [number, number] => f < 300
  ? [kf(f, [[34, 862, lin], [36, 764, EASE.linear], [39, 684, lin], [42, 647, lin], [46, 634, EASE.out]]), kf(f, [[34, 878, lin], [36, 736, lin], [39, 634, lin], [42, 578, lin], [46, 561, EASE.out]])]
  : [kf(f, [[470, 634, lin], [472, 640, lin], [474, 660, lin], [476, 694, lin], [478, 769, lin], [479, 801, lin], [480, 840, lin]]), kf(f, [[470, 561, lin], [472, 568, lin], [474, 585, lin], [476, 605, lin], [478, 686, lin], [479, 727, lin], [480, 800, lin]])];
const glassAmt = (f: number) => (f < 300 ? kf(f, [[34, 1, lin], [37, 0.55, lin], [40, 0, lin]]) : kf(f, [[472, 0, lin], [475, 0.7, lin], [477, 1, lin]]));
const lumAmt = (f: number) => (f < 300 ? kf(f, [[34, 0.3, lin], [37, 0.8, lin], [40, 1, lin]]) : kf(f, [[473, 1, lin], [476, 0.55, lin], [480, 0.25, lin]]));
const STAGE_F = [188, 193, 196, 199];
const QUERY = ['k', 'ka', 'kaf', '咖啡'];
const COUNTS = [58, 21, 13, 12];
const stageAt = (f: number) => (f >= 432 ? 0 : STAGE_F.filter((s) => f >= s).length);
const curIdx = (f: number) => (f < 237 ? 1 : f < 241 ? 2 : f < 246 ? 3 : f < 249 ? 4 : f < 291 ? 5 : f < 295 ? 4 : f < 300 ? 3 : f < 303 ? 2 : 1);
const frameOn = (f: number) =>
  f >= 215 && f < 237 ? rampL(f, 215, 2) : f >= 267 && f < 291 ? rampL(f, 267, 2) : f >= 321 && f < 432 ? rampL(f, 321, 2) : 0;
const selScale = (f: number) => f < 349 ? 1 : f < 387
  ? kf(f, [[349, 1, lin], [352, 1.25, EASE.out], [359, 1.25], [360, 1.0, lin], [362, 1.0], [363, 1.4, lin], [364, 1.45, lin], [365, 1.2, lin], [366, 1.08, lin], [367, 0.98, lin], [368, 1.0], [369, 1.3, lin], [370, 1.12, lin], [371, 1.0, lin], [372, 1.32, lin], [373, 1.18, lin], [375, 1.06, lin], [378, 1.22, EASE.out]])
  : kf(f, [[387, 1.22], [391, 1.0, EASE.out]]);
const inserted = (f: number) => (f < 362 ? 0 : f < 368 ? 1 : f < 371 ? 2 : f < 534 ? 3 : 0);
const capFocus = (f: number) => (f < 41 ? 0 : f < 363 ? rampL(f, 41, 3) : f < 411 ? 0 : f < 469 ? rampL(f, 411, 3) : 0);
const capVis = (f: number) => (f < 300 ? rampL(f, 38, 5) : 1 - rampL(f, 470, 4));

// 光标（原片 1280 坐标）
type CurKind = 'arrow' | 'hand' | 'ibeam';
const cursorAt = (f: number): {x: number; y: number; kind: CurKind; rot: number} => {
  const w = 2 * Math.PI / 589;
  const dx = 0.8 * Math.sin(w * 7 * f), dy = 0.6 * Math.sin(w * 11 * f + 1);
  let x: number, y: number, kind: CurKind = 'arrow', rot = 0;
  if (f < 57) {
    x = kf(f, [[12, 999], [15, 951, EASE.exit], [18, 932, lin], [21, 916, EASE.out]]);
    y = kf(f, [[12, 1070], [15, 1023, EASE.exit], [18, 985, lin], [21, 954, EASE.out]]);
    kind = f >= 21 ? 'hand' : 'arrow';
  } else if (f < 336) {
    x = kf(f, [[57, 916], [61, 647, lin], [66, 557, EASE.out]]);
    y = kf(f, [[57, 954], [61, 766, lin], [66, 612, EASE.out]]);
    kind = f < 59 || f >= 225 ? 'hand' : 'arrow';
  } else if (f < 387) {
    x = kf(f, [[336, 557], [348, 646]]); y = kf(f, [[336, 612], [348, 578]]); kind = 'hand';
  } else if (f < 417) {
    x = kf(f, [[387, 646], [397, 474]]); y = kf(f, [[387, 578], [397, 372]]);
    kind = f >= 396 ? 'ibeam' : 'hand'; rot = f >= 396 ? -40 : 0;
  } else if (f < 489) {
    x = kf(f, [[417, 474], [424, 606, EASE.out]]); y = kf(f, [[417, 372], [424, 536, EASE.out]]);
  } else if (f < 546) {
    x = kf(f, [[489, 606], [501, 572]]); y = kf(f, [[489, 536], [501, 910]]); kind = f >= 501 ? 'ibeam' : 'arrow';
  } else {
    x = kf(f, [[546, 572], [552, 605, EASE.out], [583, 605], [588, 999, bezier(0.45, 0, 0.3, 1)]]);
    y = kf(f, [[546, 910], [552, 1012, EASE.out], [583, 1012], [588, 1070, bezier(0.45, 0, 0.3, 1)]]);
  }
  return {x: x + dx, y: y + dy, kind, rot};
};

// ───────── 图标画法（24×24） ─────────
const TILE_COL: Record<Cat, string[]> = {
  smile: ['#F6C744', '#F4BC32', '#F8D15A'],
  heart: ['#EE4D6A', '#F06292', '#D9467A', '#E8505B'],
  person: ['#F2994A', '#E07B39', '#D9A066', '#C98458'],
  animal: ['#3DBE84', '#2FA77A', '#55C98F'],
  food: ['#FF8A3D', '#F26B3A', '#F5A13A'],
  nature: ['#4A8FF0', '#3C7BE0', '#5AB0F5'],
  symbol: ['#8A6CF2', '#6E5BE6', '#A07BF0'],
  coffee: ['#8B5A32', '#6F4526', '#A06A3C'],
};
const ANIMAL = '猫狗兔熊鸟鱼牛羊猪虎龙马鹿鸭蛙蜂';
const FOOD = '饭面包果蛋糕粥饺汤米肉桃梨瓜糖饼';
const HEART = 'M12 20.2C5 15.2 3 11.6 3 8.7 3 6.1 5 4.2 7.4 4.2c1.8 0 3.5 1.1 4.6 2.8 1.1-1.7 2.8-2.8 4.6-2.8 2.4 0 4.4 1.9 4.4 4.5 0 2.9-2 6.5-9 11.5z';
const Glyph: React.FC<{cat: Cat; v: number}> = ({cat, v}) => {
  const W = '#FFFFFF';
  if (cat === 'smile') {
    const ink = '#5B3A00', e = v % 4, m = Math.floor(v / 4) % 4;
    return (
      <g stroke={ink} strokeWidth={2} strokeLinecap="round" fill="none">
        {e === 0 && <><circle cx={8.5} cy={9.5} r={1.5} fill={ink} stroke="none" /><circle cx={15.5} cy={9.5} r={1.5} fill={ink} stroke="none" /></>}
        {e === 1 && <path d="M6.6 10.3q1.9-2.6 3.8 0M13.6 10.3q1.9-2.6 3.8 0" />}
        {e === 2 && <><circle cx={8.5} cy={9.5} r={1.5} fill={ink} stroke="none" /><path d="M13.8 9.6h3.4" /></>}
        {e === 3 && <><ellipse cx={8.6} cy={9.4} rx={1.2} ry={2} fill={ink} stroke="none" /><ellipse cx={15.4} cy={9.4} rx={1.2} ry={2} fill={ink} stroke="none" /></>}
        {m === 0 && <path d="M7.5 14q4.5 4.6 9 0" />}
        {m === 1 && <path d="M7 13.6h10q0 5.4-5 5.4t-5-5.4z" fill={ink} />}
        {m === 2 && <path d="M8.6 15.6h6.8" />}
        {m === 3 && <circle cx={12} cy={15.8} r={2} />}
      </g>
    );
  }
  if (cat === 'heart') {
    const k = v % 4;
    if (k === 1) return <path d={HEART} fill="none" stroke={W} strokeWidth={2} />;
    if (k === 2) return <g fill={W}><path d={HEART} transform="translate(1 4) scale(.62)" /><path d={HEART} transform="translate(8.5 1.5) scale(.62)" opacity={0.8} /></g>;
    if (k === 3) return <g fill={W}><path d={HEART} transform="translate(2 3) scale(.8)" /><path d="M19 3.5l.8 1.9 1.9.8-1.9.8-.8 1.9-.8-1.9-1.9-.8 1.9-.8z" /></g>;
    return <path d={HEART} fill={W} />;
  }
  if (cat === 'person') {
    const k = v % 4;
    if (k === 3) return <g fill={W}><circle cx={8} cy={9} r={2.8} /><path d="M2.6 20c0-3.6 2.4-5.4 5.4-5.4s5.4 1.8 5.4 5.4z" /><circle cx={16.4} cy={9.6} r={2.4} opacity={0.85} /><path d="M12 20c0-3.2 2-4.8 4.4-4.8s4.6 1.6 4.6 4.8z" opacity={0.85} /></g>;
    return (
      <g fill={W}>
        <circle cx={12} cy={9} r={3.6} />
        <path d="M5 20.4c0-4.4 3-6.6 7-6.6s7 2.2 7 6.6z" />
        {k === 1 && <rect x={8.2} y={3.2} width={7.6} height={2.4} rx={1.2} fill="#5B3A00" opacity={0.55} />}
        {k === 2 && <path d="M8.2 8.6q3.8-5 7.6 0" fill="none" stroke="#5B3A00" strokeOpacity={0.5} strokeWidth={1.6} />}
      </g>
    );
  }
  if (cat === 'animal' || cat === 'food') {
    const s = cat === 'animal' ? ANIMAL : FOOD;
    return <text x={12} y={12.6} textAnchor="middle" dominantBaseline="central" fontSize={14.5} fontWeight={700} fill={W} fontFamily={SANS}>{s[v % s.length]}</text>;
  }
  if (cat === 'nature') {
    const k = v % 6;
    return (
      <g fill={W} stroke={W} strokeLinecap="round">
        {k === 0 && <><circle cx={12} cy={12} r={4} stroke="none" /><path d="M12 3.5v2M12 18.5v2M3.5 12h2M18.5 12h2M6 6l1.4 1.4M16.6 16.6L18 18M6 18l1.4-1.4M16.6 7.4L18 6" strokeWidth={1.8} fill="none" /></>}
        {k === 1 && <path d="M7 18h10.5a3.5 3.5 0 0 0 .4-7 5 5 0 0 0-9.6-1.2A4 4 0 0 0 7 18z" stroke="none" />}
        {k === 2 && <path d="M15.5 4.5a7.5 7.5 0 1 0 4 12.8 6 6 0 0 1-4-12.8z" stroke="none" />}
        {k === 3 && <path d="M12 3.5l2.5 5.4 5.8.6-4.3 3.9 1.2 5.8-5.2-3-5.2 3 1.2-5.8-4.3-3.9 5.8-.6z" stroke="none" />}
        {k === 4 && <path d="M12 3.8c3.5 4.6 5.4 7.6 5.4 10.2a5.4 5.4 0 0 1-10.8 0c0-2.6 1.9-5.6 5.4-10.2z" stroke="none" />}
        {k === 5 && <path d="M12 3.5v17M4.6 7.8l14.8 8.4M4.6 16.2l14.8-8.4" strokeWidth={2} fill="none" />}
      </g>
    );
  }
  if (cat === 'symbol') {
    const k = v % 6;
    return (
      <g fill={W} stroke={W} strokeLinecap="round" strokeLinejoin="round">
        {k === 0 && <path d="M12 4.5l8 14h-16z" stroke="none" />}
        {k === 1 && <circle cx={12} cy={12} r={6} fill="none" strokeWidth={2.6} />}
        {k === 2 && <path d="M13.5 3l-7 10h5l-1.5 8 7-10.5h-5z" stroke="none" />}
        {k === 3 && <><path d="M10 17V5.5l8-1.8V15" fill="none" strokeWidth={2} /><circle cx={8} cy={17} r={2.4} stroke="none" /><circle cx={16} cy={15} r={2.4} stroke="none" /></>}
        {k === 4 && <path d="M5.5 12.5l4.2 4.2 8.8-9" fill="none" strokeWidth={2.6} />}
        {k === 5 && <path d="M12 5v14M5 12h14" fill="none" strokeWidth={2.8} />}
      </g>
    );
  }
  // 咖啡：12 种杯子 / 壶 / 豆
  const C = '#FFE6C7', D = '#6F4526';
  const k = v % 12;
  const steam = <path d="M9 3.4q-1.1 1.5 0 3M12.6 3.4q-1.1 1.5 0 3" fill="none" stroke={C} strokeWidth={1.4} strokeLinecap="round" />;
  return (
    <g fill={C} stroke="none">
      {k === 0 && <>{steam}<path d="M5 9.5h11v4.3c0 3.4-2.3 5.2-5.5 5.2S5 17.2 5 13.8z" /><path d="M16 11.2h1.4c1.6 0 2.4 1.1 2.4 2.2s-.9 2.3-2.5 2.3H16" fill="none" stroke={C} strokeWidth={1.6} /></>}
      {k === 1 && <><rect x={6.2} y={5.2} width={11.6} height={2.6} rx={1.2} /><path d="M7.2 8.6h9.6l-1.2 11.4H8.4z" /><rect x={7.6} y={12} width={8.8} height={3} fill={D} /></>}
      {k === 2 && <><path d="M15.5 2.8l-2 6.2" stroke={C} strokeWidth={1.4} strokeLinecap="round" /><path d="M7 8.5h10l-1.2 11.5H8.2z" opacity={0.55} /><rect x={9} y={11.5} width={2.6} height={2.6} rx={0.5} fill={D} /><rect x={12.2} y={14.2} width={2.6} height={2.6} rx={0.5} fill={D} /></>}
      {k === 3 && <><path d="M4.5 8h12.5v7.5c0 2.6-1.8 4.5-4.5 4.5H9c-2.7 0-4.5-1.9-4.5-4.5z" /><path d="M17 10h1c1.8 0 2.6 1.2 2.6 2.4S19.8 15 18 15h-1" fill="none" stroke={C} strokeWidth={1.7} /><rect x={6.5} y={10.5} width={8.5} height={1.4} rx={0.7} fill={D} /></>}
      {k === 4 && <><ellipse cx={12} cy={12} rx={5.6} ry={7.6} transform="rotate(35 12 12)" /><path d="M9.2 7.4c3 1.6 2.6 7.6 5.6 9.2" fill="none" stroke={D} strokeWidth={1.5} strokeLinecap="round" /></>}
      {k === 5 && <>{steam}<path d="M7 9.5h9v3.2c0 2.6-1.9 4-4.5 4S7 15.3 7 12.7z" /><ellipse cx={11.5} cy={18.6} rx={7.5} ry={1.8} /></>}
      {k === 6 && <><circle cx={12} cy={12} r={8} /><circle cx={12} cy={12} r={5.8} fill={D} /><path d={HEART} transform="translate(8.4 8.6) scale(.3)" fill={C} /></>}
      {k === 7 && <><path d="M8 3.5h8l-1.2 7h-5.6z" /><path d="M9.4 10.5h5.2l2.6 9.5H6.8z" /><rect x={6.4} y={9.6} width={11.2} height={1.8} rx={0.9} fill={D} /></>}
      {k === 8 && <><path d="M6.5 9h9l1.2 10.5H5.3z" /><path d="M15.4 11.5l4.5-4.2" stroke={C} strokeWidth={1.8} strokeLinecap="round" /><path d="M8.8 6.4h4.4" stroke={C} strokeWidth={2} strokeLinecap="round" /></>}
      {k === 9 && <text x={12} y={12.6} textAnchor="middle" dominantBaseline="central" fontSize={14.5} fontWeight={700} fill={C} fontFamily={SANS}>咖</text>}
      {k === 10 && <><path d={HEART} transform="translate(7.6 1.2) scale(.36)" /><path d="M5 9.5h11v4.3c0 3.4-2.3 5.2-5.5 5.2S5 17.2 5 13.8z" /><path d="M16 11.2h1.4c1.6 0 2.4 1.1 2.4 2.2s-.9 2.3-2.5 2.3H16" fill="none" stroke={C} strokeWidth={1.6} /></>}
      {k === 11 && <><path d="M12 2.8v6" stroke={C} strokeWidth={1.6} strokeLinecap="round" /><rect x={9} y={2.4} width={6} height={1.6} rx={0.8} /><rect x={6.8} y={8} width={10.4} height={12} rx={1.4} opacity={0.6} /><rect x={6.8} y={13.5} width={10.4} height={6.5} rx={1.4} /></>}
    </g>
  );
};
const Tile: React.FC<{cat: Cat; v: number; size: number; style?: React.CSSProperties}> = ({cat, v, size, style}) => {
  const cols = TILE_COL[cat];
  return (
    <div style={{width: size, height: size, borderRadius: size * 0.3, background: cols[cat === 'coffee' ? v % cols.length : Math.floor(v / 16) % cols.length], ...style}}>
      <svg width={size} height={size} viewBox="0 0 24 24" style={{display: 'block'}}><Glyph cat={cat} v={v} /></svg>
    </div>
  );
};

// ───────── 小部件 ─────────
const SmileLine: React.FC<{size: number; color: string; sw?: number}> = ({size, color, sw = 1.8}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round">
    <circle cx={12} cy={12} r={9} />
    <path d="M8.2 14.2q3.8 3.8 7.6 0" />
    <circle cx={9} cy={9.8} r={0.6} fill={color} />
    <circle cx={15} cy={9.8} r={0.6} fill={color} />
  </svg>
);
const Cursor: React.FC<{x: number; y: number; kind: CurKind; rot: number}> = ({x, y, kind, rot}) => {
  const s = 1.85;
  if (kind === 'ibeam') {
    const d = 'M3 0.5h2.2q1 0 1.5.9.5-.9 1.5-.9H10.4M6.7 1.4v19.2M3 21.5h2.2q1 0 1.5-.9.5.9 1.5.9h2.2';
    return (
      <svg width={14 * s} height={22 * s} viewBox="0 0 14 22" style={{position: 'absolute', left: x - 6.7 * s, top: y - 11 * s, transform: `rotate(${rot}deg)`, overflow: 'visible'}}>
        <path d={d} stroke="#fff" strokeWidth={3.2} fill="none" strokeLinecap="round" />
        <path d={d} stroke="#000" strokeWidth={1.3} fill="none" strokeLinecap="round" />
      </svg>
    );
  }
  if (kind === 'hand') {
    return (
      <svg width={22 * s} height={23 * s} viewBox="0 0 22 23" style={{position: 'absolute', left: x - 8.4 * s, top: y - 0.5 * s, overflow: 'visible'}}>
        <path d="M7 1.6a1.4 1.4 0 0 1 2.8 0V9a1.4 1.4 0 0 1 2.8 0v.6a1.4 1.4 0 0 1 2.8 0v.8a1.3 1.3 0 0 1 2.6 0V15.4c0 3.4-1.8 6.2-5.2 6.2h-2.4c-2 0-3.2-1-4.3-2.4L2.3 14.1c-.7-.9-.5-2 .3-2.5.8-.5 1.8-.3 2.4.4L7 14.2z" fill="#fff" stroke="#000" strokeWidth={1.1} strokeLinejoin="round" />
        <path d="M9.8 9v4.4M12.6 9.6v3.8M15.4 10.4v3" stroke="#000" strokeWidth={0.9} strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg width={14 * s} height={21 * s} viewBox="0 0 14 21" style={{position: 'absolute', left: x - 0.6 * s, top: y - 0.6 * s, overflow: 'visible'}}>
      <path d="M1 1v16.2l4-3.8 2.9 6.6 2.6-1.1-2.8-6.4h5.5z" fill="#fff" stroke="#000" strokeWidth={1.1} strokeLinejoin="round" />
    </svg>
  );
};
const KeyHint: React.FC<{f: number}> = ({f}) => {
  // [起, 止, 字, 宽, 淡入?, 淡出?]：换键时直接换字（不淡），最后一个键松开后淡出
  const keys: [number, number, string, number, boolean, boolean][] = [
    [234, 288, '↓', 85, true, false], [288, 348, '↑', 85, false, true], [429, 513, 'Esc', 125, true, true],
    [525, 531, '⌘ A', 135, true, false], [531, 579, '⌫', 85, false, true],
  ];
  const k = keys.find(([a, b, , , , fo]) => f >= a && f < b + (fo ? 3 : 0));
  if (!k) return null;
  const [a, b, label, w, fi, fo] = k;
  const o = (fi ? rampL(f, a, 3) : 1) * (fo ? 1 - rampL(f, b, 3) : 1);
  return (
    <div style={{position: 'absolute', left: 640 - w / 2, top: 1148, width: w, height: 66, borderRadius: 12, background: '#000', border: '1.5px solid #3A3A3A', boxSizing: 'border-box',
      display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: SANS, fontWeight: 600, fontSize: label === '⌫' ? 36 : 30, opacity: o}}>{label}</div>
  );
};

// ───────── 主组件 ─────────
const TS = 33; // 球正中处图标块边长（原片 1280 坐标）
const DPERSP = 5;
export const StickerSpherePicker: React.FC = () => {
  const f = useCurrentFrame();
  const r = sphereR(f);
  const [cx, cy] = sphereC(f);
  const cur = cursorAt(f);
  const sphereOn = r > 0.5 && f >= 34 && f < 480;
  const glass = sphereOn ? glassAmt(f) : 0;
  const lum = sphereOn ? lumAmt(f) : 0;
  const stage = stageAt(f);
  const ci = curIdx(f);
  const fo = frameOn(f);
  const selI = RES[ci - 1];

  // ── 球面投影 ──
  type P = {i: number; x: number; y: number; z: number; m: number[]};
  const proj = (R: M3, i: number): P => {
    const ic = ICONS[i];
    const p = mv(R, ic.p), e = mv(R, ic.e), n = mv(R, ic.n);
    const k = DPERSP / (DPERSP - p[2]);
    const s = (r / 225) * k;
    return {i, x: cx + r * k * p[0], y: cy - r * k * p[1], z: p[2], m: [s * e[0], -s * e[1], -s * n[0], s * n[1]]};
  };
  const items: P[] = [];
  let hover = -1, hoverAmt = 0;
  if (sphereOn) {
    const R = orient(f);
    for (let i = 0; i < TOTAL; i++) {
      const p = proj(R, i);
      if (p.z > 0.02 || (glass > 0.01 && p.z > -1)) items.push(p);
    }
    // 悬停：光标下最近的那块，转得快时不显示
    if (f >= 66 && f < 188) {
      let bd = 1e9;
      for (const p of items) { if (p.z < 0.3) continue; const d = Math.hypot(p.x - cur.x, p.y - cur.y); if (d < bd) { bd = d; hover = p.i; } }
      if (bd > 30) hover = -1;
      if (hover >= 0) {
        const p0 = proj(orient(f - 1), hover), p1 = items.find((q) => q.i === hover)!;
        const sp = Math.hypot(p1.x - p0.x, p1.y - p0.y);
        hoverAmt = clamp((5 - sp) / 3.5) * clamp((f - 66) / 3);
      }
    }
    items.sort((a, b) => a.z - b.z);
  }
  const dimOf = (i: number) => {
    const lv = ICONS[i].level;
    if (lv >= 4) return 0;
    const t0 = STAGE_F[lv];
    return rampL(f, t0, 4) * (1 - rampL(f, 432, 3));
  };

  // 快转时补两层 1/3 帧前的淡影（模拟原片 60fps 的顺滑，避免规则排布的图标块在 30fps 下"倒转"闪烁）
  const ghosts: React.ReactNode[] = [];
  if (sphereOn) {
    const A = orient(f), B = orient(f - 1);
    const Q = mmul(A, [B[0], B[3], B[6], B[1], B[4], B[7], B[2], B[5], B[8]]);
    const ang = Math.acos(clamp((Q[0] + Q[4] + Q[8] - 1) / 2, -1, 1)) / DEG;
    const g = clamp((ang - 3.5) / 3);
    if (g > 0) {
      [[1 / 3, 0.3], [2 / 3, 0.14]].forEach(([dt, w]) => {
        const Rg = orient(f - dt);
        for (let i = 0; i < TOTAL; i++) {
          const p = proj(Rg, i);
          if (p.z <= 0.05) continue;
          const op = Math.pow(clamp(p.z / 0.92), 1.25) * lum * (1 - 0.88 * dimOf(i)) * w * g;
          if (op < 0.02) continue;
          const [a, b, c, d] = p.m, h = TS / 2;
          ghosts.push(<Tile key={`g${dt}-${i}`} cat={ICONS[i].cat} v={ICONS[i].v} size={TS} style={{position: 'absolute', left: 0, top: 0, transformOrigin: '0 0', transform: `matrix(${a},${b},${c},${d},${p.x - (a * h + c * h)},${p.y - (b * h + d * h)})`, opacity: op}} />);
        }
      });
    }
  }
  const tiles = items.map((p) => {
    const ic = ICONS[p.i];
    const back = p.z <= 0.02;
    let op: number;
    if (back) op = 0.28 * glass * clamp(-p.z * 1.4 + 0.3);
    else op = Math.pow(clamp(p.z / 0.92), 1.25) * lum * (1 - 0.88 * dimOf(p.i));
    const isSel = p.i === selI && fo > 0;
    const isHov = p.i === hover && hoverAmt > 0;
    let sc = 1;
    if (isHov) sc = 1 + 0.3 * hoverAmt;
    if (isSel) sc = mix(1, 1.3, fo) * (f >= 349 && f < 392 ? selScale(f) : 1);
    const [a, b, c, d] = p.m.map((v) => v * sc);
    const half = TS / 2;
    const tf = (h: number) => `matrix(${a},${b},${c},${d},${p.x - (a * h + c * h)},${p.y - (b * h + d * h)})`;
    return (
      <React.Fragment key={p.i}>
        {isHov && <div style={{position: 'absolute', left: 0, top: 0, width: TS * 1.36, height: TS * 1.36, borderRadius: 11, background: '#2A2A2A', transformOrigin: '0 0', transform: tf(TS * 0.68), opacity: hoverAmt * op}} />}
        {isSel && (
          <div style={{position: 'absolute', left: 0, top: 0, width: TS * 1.42, height: TS * 1.42, borderRadius: 10, background: '#1C2740', boxSizing: 'border-box',
            border: `${sc > 1.45 ? 2.6 : 2.1}px solid #5B8DEF`, transformOrigin: '0 0', transform: tf(TS * 0.71), opacity: fo * clamp(p.z / 0.4)}} />
        )}
        <Tile cat={ic.cat} v={ic.v} size={TS} style={{position: 'absolute', left: 0, top: 0, transformOrigin: '0 0', transform: tf(half), opacity: isSel ? Math.max(op, clamp(p.z / 0.4)) : op}} />
      </React.Fragment>
    );
  });

  // ── 搜索胶囊（沿球外圈的弧） ──
  const sc = r / 225;
  const rc = r + 36 * sc;
  const th0 = -147 * DEG;
  const query = stage > 0 ? QUERY[stage - 1] : '';
  const qW = (s: string) => Array.from(s).reduce((w, ch) => w + (/[一-鿿]/.test(ch) ? 26 : 14.5), 0);
  const countStr = stage > 0 ? `${ci} / ${COUNTS[stage - 1]}` : '';
  const countW = countStr.length * 10.5;
  const textU = 21;
  const contentEnd = query ? textU + qW(query) + 10 + countW : textU + 4 * 25;
  const uEnd = contentEnd - 12;
  const th1 = th0 + (uEnd * sc) / rc;
  const P = (t: number, rad: number) => [cx + rad * Math.cos(t), cy + rad * Math.sin(t)];
  const arc = (a: number, b: number, rad: number) => { const [x0, y0] = P(a, rad), [x1, y1] = P(b, rad); return `M${x0} ${y0}A${rad} ${rad} 0 0 1 ${x1} ${y1}`; };
  const extA = 0.25;
  const textArc = arc(th0 - extA, th0 + 2.4, rc);
  const uOff = (u: number) => extA * rc + u * sc;
  const cv = sphereOn ? capVis(f) : 0;
  const cblur = f < 300 ? 9 * (1 - rampL(f, 38, 5)) : 9 * rampL(f, 470, 4);
  const focus = capFocus(f);
  const caretOn = ((f >= 186 && f < 363) || (f >= 414 && f < 469)) && Math.floor(f / 15) % 2 === 0;
  const caretU = query ? textU + qW(query) + 1.5 : textU - 2;
  const caretT = th0 + (caretU * sc) / rc;
  const [mx, my] = P(th0 + (1.5 * sc) / rc, rc);

  // ── 输入框 / 按钮 ──
  const nIns = inserted(f);
  const selAll = f >= 528 && f < 534;
  const btnBg = f < 300
    ? (f < 22 ? 0 : f < 61 ? rampL(f, 22, 3) : 1 - rampL(f, 61, 3))
    : (f < 468 ? 0 : f < 513 ? 1 : 1 - rampL(f, 513, 4));
  const btnRing = f >= 468 && f < 513;
  const iconOp = f < 300 ? 1 - rampL(f, 33, 2) : rampL(f, 480, 2);
  const iconCol = f >= 22 && f < 33 ? '#D2D2D2' : '#9A9A9A';
  const pressDark = f >= 30 && f < 33 ? 0.82 : 1;
  const inCaret = f >= 513 && f < 579 && Math.floor((f - 513) / 15) % 2 === 0;

  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      {/* 淡格子背景，往下渐隐 */}
      <AbsoluteFill style={{
        backgroundImage: 'linear-gradient(#111 1px, transparent 1px), linear-gradient(90deg, #111 1px, transparent 1px)',
        backgroundSize: '82px 82px', backgroundPosition: '4px 0px',
        WebkitMaskImage: 'linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.75) 35%, rgba(0,0,0,0) 78%)',
      }} />
      <div style={{position: 'absolute', left: 420, top: 0, width: 1280, height: 1280, transform: 'scale(0.84375)', transformOrigin: '0 0'}}>
        {/* 输入框 */}
        <div style={{position: 'absolute', left: 340, top: 856, width: 600, height: 96, borderRadius: 48, background: '#1F1F1F'}}>
          {nIns === 0 && <div style={{position: 'absolute', left: 34, top: 0, height: 96, lineHeight: '96px', fontFamily: SANS, fontSize: 31, color: '#757575'}}>发消息…</div>}
          {selAll && <div style={{position: 'absolute', left: 28, top: 30, width: 3 * 31 + 4, height: 36, borderRadius: 5, background: 'rgba(55,105,215,0.75)'}} />}
          {Array.from({length: nIns}).map((_, k) => (
            <Tile key={k} cat="coffee" v={0} size={26} style={{position: 'absolute', left: 34 + k * 31, top: 35}} />
          ))}
          {inCaret && <div style={{position: 'absolute', left: nIns ? 34 + nIns * 31 + 1 : 31, top: 32, width: 2.5, height: 32, background: '#5B8DEF', borderRadius: 1}} />}
        </div>
        {/* 表情按钮 */}
        <div style={{position: 'absolute', left: 851, top: 864, width: 80, height: 80, borderRadius: 40, background: `rgba(58,58,58,${btnBg * pressDark})`,
          boxShadow: btnRing ? '0 0 0 2.5px #A9BDE6' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div style={{opacity: iconOp}}><SmileLine size={36} color={iconCol} /></div>
        </div>
        {/* 球 */}
        {sphereOn && (
          <>
            {ghosts}
            {tiles}
            {glass > 0.01 && (
              <>
                <div style={{position: 'absolute', left: cx - r, top: cy - r, width: 2 * r, height: 2 * r, borderRadius: '50%', boxShadow: `inset 0 0 0 ${1.2}px rgba(255,255,255,${0.45 * glass}), inset 0 0 ${r * 0.35}px rgba(255,255,255,${0.08 * glass})`}} />
                <div style={{position: 'absolute', left: cx - r * 0.55, top: cy - r * 0.55, opacity: 0.35 * glass}}><SmileLine size={r * 1.1} color="#fff" sw={1.2} /></div>
              </>
            )}
          </>
        )}
        {/* 搜索胶囊 */}
        {cv > 0.01 && (
          <svg width={1280} height={1280} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: cv, filter: cblur > 0.2 ? `blur(${cblur}px)` : undefined}}>
            <defs><path id="ssp-arc" d={textArc} /></defs>
            <path d={arc(th0, th1, rc)} stroke="#4B6EAA" strokeOpacity={focus} strokeWidth={56 * sc + 5} strokeLinecap="round" fill="none" />
            <path d={arc(th0, th1, rc)} stroke="#262626" strokeWidth={56 * sc} strokeLinecap="round" fill="none" />
            <g transform={`translate(${mx} ${my}) rotate(${(th0 * 180) / Math.PI + 90}) scale(${sc * 1.2})`} stroke="#8F8F8F" strokeWidth={2} fill="none" strokeLinecap="round">
              <circle cx={-1.5} cy={-1.5} r={5.5} /><path d="M2.6 2.6l4 4" />
            </g>
            <text fontFamily={SANS} dominantBaseline="central" style={{fontSize: 25 * sc}}>
              <textPath href="#ssp-arc" startOffset={uOff(textU)}>
                {query ? (
                  <>
                    <tspan fill="#fff" fontWeight={600}>{query}</tspan>
                    <tspan fill="#8A8A8A" dx={10 * sc} style={{fontSize: 19 * sc}}>{countStr}</tspan>
                  </>
                ) : <tspan fill="#7C7C7C">搜索贴纸</tspan>}
              </textPath>
            </text>
            {caretOn && (() => { const [x, y] = P(caretT, rc); return <rect x={-1.2} y={-14} width={2.6} height={28} fill="#5B8DEF" transform={`translate(${x} ${y}) rotate(${(caretT * 180) / Math.PI + 90})`} />; })()}
          </svg>
        )}
        <KeyHint f={f} />
        <Cursor x={cur.x} y={cur.y} kind={cur.kind} rot={cur.rot} />
      </div>
    </AbsoluteFill>
  );
};
