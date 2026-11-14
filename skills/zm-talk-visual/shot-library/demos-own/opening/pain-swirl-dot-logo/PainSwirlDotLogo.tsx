// 痛点换句 → 漩涡收走 + 转折句 → 蓝点吞屏 → 天空里长出 Logo（023-A，原片 0–9.2s 一整串）
// 学的动作（来自 baseTOP × Taskly 开场，60fps 逐帧看过，逐元素时间表见 shot-lab/refs/023-A/逐元素时间表.md）：
//   空的柔光底静 0.27s → 标题逐词"灰 + 虚 6px + 低 1.7%"升上来，4 帧变清楚，再慢慢变墨（最后一个词最慢，句尾一直"湿"着）；
//   8 张小卡按顺时针方位从四边带方向模糊滑进来（强 ease-out，多转 5–8° 再落回），落定后几乎不动（每张各走各的小椭圆，≈0.5%/秒）；
//   换句 = 整行重打：旧句整行先变灰 → 上飘 1% + 变虚 + 淡出（0.2s）；新句从第一个词开始逐词从下面虚着升上来，新旧叠 8 帧（首词双影）；
//   漩涡收走：每张卡顺时针自转到接近竖直、绕中心公转一点、被拉向中心、缩到 0.35×、变虚变淡（ease-in-out 0.5s，切向拖影）；标题原地缩小变灰变虚；
//   转折句（品牌蓝、斜）在碎卡还没走完时就逐词浮出 → 原片真停 0.32s → 句子正中心长出同色蓝点，每 1/30s 约 ×1.3 指数长大，0.42s 盖满；
//   纯蓝 2 帧里硬切到深蓝天空：第一帧中心就有细白圈 → 软光晕环 → Logo 方块边转边长出来（略过冲 3%）→ 白圈一圈圈往外推、在边缘堆成三道；
//   小星星闪 → Logo 往左一甩（ease-in-out、横向拖影、缩到 0.63×）→ 名字从 Logo 右侧逐字"抽"出来（每字 2 帧，无位移）→ 标语逐词浮现（后半句黄绿斜）；
//   云层慢漂的静看 → 横向拖影 + 刷白，0.17s 叠到浅色底。
// 我们的内容：中性日常的"信息太乱"痛点（每天消息太多 / 群聊太多 / 提醒太乱），四周 8 张生活工作琐碎小卡，转折句"到此为止。"；
//   Logo 位放我们的 Mark（墨色圆环 + 靛蓝四角星，装在白色厚玻璃圆角方块里），名字和标语集中在 BRAND 常量里方便换。
//   玻璃竖条天空 / 3D 厚玻璃 Logo 不硬画：天空 = 竖向渐变 + 模糊云团 + 极淡竖条纹；Logo = 圆角方块 + 屏幕空间叠层厚度。
//
// 拍表（30fps，共 276f；帧号 = 原片秒 × 30）
//   拍 1 痛点换词 PAIN 0–116：
//     0–8 空底静止；8 / 10 / 13 第一句三个词；13–57 八张卡依次进场（13,18,21,26,33,38,44,50）
//     50 换句 1（旧句变灰）→ 52 / 54 / 57 新句三词 → 65 全黑；66–88 静看（卡片微漂）
//     89 换句 2 → 91 / 93 / 96 三词 → 104 全黑；104–116 静看
//   拍 2 卡片收走 + 转折句 SWIRL 116–152：
//     116–131 漩涡收走（最快 ≈122），标题 117–125 缩小变虚；128 / 131 "到此 / 为止。"逐词，142 到实色；142–152 全静（原片真停）
//   拍 3 蓝点 → Logo 登场 LOGO 152–276：
//     152–164 蓝点指数长大；165–166 纯蓝；167 硬切天空（中心细白圈）；169 光晕环；170–176 Logo 自转长出；171/177/183 三圈出生
//     186–202 Logo 静、圈外推、星星闪；202–210 Logo 左甩；205–213 名字逐字；218/220/226/231 标语四词；238–267 静看（云漂）
//     267–272 横向拖影 + 刷白 → 272–276 浅色底
// 毛病清单（自查表通用项 + 本镜头独有）：
//   - 独有 1：换句必须整行重打（连没变的"每天"也重出），旧句先变灰再让位，新旧叠 8 帧；只换最后一个词会很平
//   - 独有 2：卡片落定后不能大幅飘（原片 ≈0.5%/秒），2.2–2.9s、3.5–3.8s 是读字时间，不要补动
//   - 独有 3：蓝点是指数增长、不缓出；硬切必须在纯蓝帧上，天空第一帧中心就要有小白圈把"点"接住
//   - 独有 4：名字字母只淡入、不位移、不打字光标；第一个字被 Logo 右缘盖住一半（名字在 Logo 下层）
//   - 独有 5：4.75–5.07s 真停 0.32s（静 → 爆），不要给它加慢推
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {EASE, FONT, Grain, SpeedBlur, Vignette, mix} from '../../../kit/polish';

export const PAIN_SWIRL_DOT_LOGO_DURATION = 276;

// ───────── 拍表（帧，30fps）─────────
export const PAIN_BEAT = {start: 0, end: 116};
export const SWIRL_BEAT = {start: 116, end: 152};
export const LOGO_BEAT = {start: 152, end: 276};

// ───────── 内容常量（换品牌 / 换文案只改这里）─────────
export const BRAND = {
  name: '逐梦的剪辑',
  taglineA: ['少一点', '杂乱，'],
  taglineB: ['多一点', '专注。'],
};
const PAIN_LINES = [
  ['每天', '消息', '太多。'],
  ['每天', '群聊', '太多。'],
  ['每天', '提醒', '太乱。'],
];
const TURN_LINE = ['到此', '为止。'];

const SANS = `"PingFang SC", "Noto Sans CJK SC", "Noto Sans SC", ${FONT.sans}`;
const W = 1920, H = 1080;
const BLUE = '#2D43EE';
const LIME = '#d2f259';
const INK = '#0b0e17';
const clamp = (x: number) => Math.max(0, Math.min(1, x));
const rs = (t: number, a: number, d: number, ease: (x: number) => number = EASE.out) => ease(clamp((t - a) / Math.max(1e-6, d)));
const hex = (c: string) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
const mixc = (a: string, b: string, k: number) => { const A = hex(a), B = hex(b); return `rgb(${A.map((v, i) => Math.round(mix(v, B[i], clamp(k)))).join(',')})`; };

// 单调三次样条（Fritsch–Carlson）：pts = [原片秒, 值]，越界钳位
type P = [number, number][];
const trk = (t: number, pts: P) => {
  const n = pts.length;
  if (t <= pts[0][0]) return pts[0][1];
  if (t >= pts[n - 1][0]) return pts[n - 1][1];
  const d: number[] = [];
  for (let k = 0; k < n - 1; k++) d.push((pts[k + 1][1] - pts[k][1]) / (pts[k + 1][0] - pts[k][0]));
  const m: number[] = [d[0]];
  for (let k = 1; k < n - 1; k++) m.push(d[k - 1] * d[k] <= 0 ? 0 : (d[k - 1] + d[k]) / 2);
  m.push(d[n - 2]);
  for (let k = 0; k < n - 1; k++) {
    if (d[k] === 0) { m[k] = 0; m[k + 1] = 0; continue; }
    const a = m[k] / d[k], b = m[k + 1] / d[k], s = a * a + b * b;
    if (s > 9) { const tau = 3 / Math.sqrt(s); m[k] = tau * a * d[k]; m[k + 1] = tau * b * d[k]; }
  }
  let i = 0;
  while (t > pts[i + 1][0]) i++;
  const [x0, y0] = pts[i], [x1, y1] = pts[i + 1];
  const h = x1 - x0, u = (t - x0) / h, u2 = u * u, u3 = u2 * u;
  return (2 * u3 - 3 * u2 + 1) * y0 + (u3 - 2 * u2 + u) * h * m[i] + (-2 * u3 + 3 * u2) * y1 + (u3 - u2) * h * m[i + 1];
};

// ───────── 我们的 Logo：墨色圆环 + 靛蓝四角星 ─────────
const Mark: React.FC<{size: number}> = ({size}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{display: 'block', overflow: 'visible'}}>
    <circle cx="50" cy="50" r="41" fill="none" stroke="#16151c" strokeWidth="8.5" />
    <path transform="translate(50 50)" d="M0 -24 C3 -6 6 -3 24 0 C6 3 3 6 0 24 C-3 6 -6 3 -24 0 C-6 -3 -3 -6 0 -24 Z" fill="#5b5cf0" />
  </svg>
);

// ───────── 一行逐词：预先按字宽居中排好，词只"显影" ─────────
type Wd = {s: string; at: number; ink: number};
const layout = (words: Wd[], size: number) => {
  const cw = size * 0.98;
  const ws = words.map((w) => Array.from(w.s).length * cw);
  let total = ws.reduce((a, b) => a + b, 0);
  if (/[。，！？]$/.test(words[words.length - 1].s)) total -= cw * 0.5; // 句号只占半个字的视觉宽度
  let x = W / 2 - total / 2;
  return ws.map((w) => { const l = x; x += w; return l; });
};
const WordLine: React.FC<{
  t: number; words: Wd[]; size: number; cy: number; from: string; to: string; weight?: number; skew?: number;
  exitAt?: number; gray?: number;
}> = ({t, words, size, cy, from, to, weight = 600, skew = 0, exitAt, gray = 0}) => {
  const lefts = layout(words, size);
  // 整行退场：先变灰（约 1 帧）→ 上飘 1% + 变虚 + 淡出（0.17s），整行同时
  const g = exitAt === undefined ? 0 : rs(t, exitAt, 0.035, EASE.linear);
  const e = exitAt === undefined ? 0 : rs(t, exitAt + 0.035, 0.17, EASE.linear);
  if (e >= 1) return null;
  return (
    <div style={{position: 'absolute', inset: 0, opacity: 1 - e, transform: `translateY(${(-11 * EASE.out(e)).toFixed(2)}px)`,
      filter: e > 0.01 ? `blur(${(5 * clamp(e * 1.7)).toFixed(2)}px)` : undefined}}>
      {words.map((w, i) => {
        if (t < w.at) return null;
        const p = rs(t, w.at, 0.1, EASE.out);
        const k = rs(t, w.at + 0.02, w.ink, EASE.out);
        const gk = Math.max(gray, g * 0.55 + e * 0.35);
        const A = hex(from), B = hex(to), G = hex('#9a9ca6');
        const col = `rgb(${A.map((v, j) => Math.round(mix(mix(v, B[j], k), G[j], clamp(gk)))).join(',')})`;
        return (
          <span key={i} style={{position: 'absolute', left: lefts[i], top: cy - size * 0.62, fontSize: size, lineHeight: `${size * 1.24}px`, fontWeight: weight,
            letterSpacing: '-0.02em', whiteSpace: 'pre', fontFamily: SANS, color: col, opacity: 0.15 + 0.85 * clamp(p * 1.4),
            filter: p < 0.98 ? `blur(${(6 * (1 - p)).toFixed(2)}px)` : undefined,
            transform: `translateY(${(size * 0.17 * (1 - p)).toFixed(2)}px)${skew ? ` skewX(${skew}deg)` : ''}`, transformOrigin: '50% 80%'}}>{w.s}</span>
        );
      })}
    </div>
  );
};

// ───────── 浅色柔光底（0–5.53s 完全不动；刷白后也回到它）─────────
const LightBackdrop: React.FC<{variant?: 0 | 1}> = ({variant = 0}) => (
  <AbsoluteFill style={{background: '#eef3fb', overflow: 'hidden'}}>
    <AbsoluteFill style={{background: variant === 0
      ? 'radial-gradient(ellipse 48% 62% at 78% 8%, rgba(208,216,250,1) 0%, rgba(214,220,250,0.55) 45%, rgba(214,220,250,0) 78%), ' +
        'radial-gradient(ellipse 38% 55% at 10% 92%, rgba(232,243,211,1) 0%, rgba(236,244,220,0.6) 45%, rgba(236,244,220,0) 80%), ' +
        'radial-gradient(ellipse 34% 40% at 2% 2%, rgba(249,251,253,1) 0%, rgba(249,251,253,0) 75%), ' +
        'radial-gradient(ellipse 30% 40% at 98% 98%, rgba(249,251,253,1) 0%, rgba(249,251,253,0) 75%), ' +
        'linear-gradient(135deg, #f4f7fb 0%, #eaeffb 50%, #f0f4f8 100%)'
      : 'radial-gradient(ellipse 45% 60% at 88% 6%, rgba(208,216,250,1) 0%, rgba(214,220,250,0) 78%), ' +
        'radial-gradient(ellipse 40% 50% at 12% 4%, rgba(226,222,250,0.9) 0%, rgba(226,222,250,0) 75%), ' +
        'radial-gradient(ellipse 38% 55% at 10% 96%, rgba(234,244,214,0.9) 0%, rgba(236,244,220,0) 80%), ' +
        'linear-gradient(135deg, #f4f7fb 0%, #ebf0fb 50%, #f2f5f9 100%)'}} />
    <Vignette strength={0.06} color="#3a3f5a" inner={0.6} />
    <Grain opacity={0.035} step={100000} blend="overlay" />
  </AbsoluteFill>
);

// ───────── 拍 1 / 拍 2：标题三句 ─────────
const LINES: {words: Wd[]; exitAt?: number}[] = [
  {words: [{s: PAIN_LINES[0][0], at: 0.267, ink: 0.07}, {s: PAIN_LINES[0][1], at: 0.333, ink: 0.08}, {s: PAIN_LINES[0][2], at: 0.433, ink: 0.36}], exitAt: 1.65},
  {words: [{s: PAIN_LINES[1][0], at: 1.717, ink: 0.07}, {s: PAIN_LINES[1][1], at: 1.783, ink: 0.08}, {s: PAIN_LINES[1][2], at: 1.883, ink: 0.3}], exitAt: 2.95},
  {words: [{s: PAIN_LINES[2][0], at: 3.033, ink: 0.07}, {s: PAIN_LINES[2][1], at: 3.1, ink: 0.08}, {s: PAIN_LINES[2][2], at: 3.183, ink: 0.3}]},
];
const TITLE_SIZE = 104, TITLE_CY = 546;
const PainTitle: React.FC<{t: number}> = ({t}) => {
  // 第三句被漩涡收走：原地缩小、变灰、变虚（ease-in，3.88–4.19s）
  const s = trk(t, [[3.88, 1], [3.917, 0.985], [3.95, 0.96], [4.0, 0.92], [4.05, 0.85], [4.083, 0.74], [4.117, 0.6], [4.15, 0.45], [4.19, 0.3]]);
  const op = trk(t, [[4.0, 1], [4.1, 0.62], [4.15, 0.3], [4.19, 0]]);
  const bl = trk(t, [[3.95, 0], [4.017, 1.5], [4.05, 2.5], [4.117, 4], [4.15, 6]]);
  const gray = trk(t, [[3.95, 0], [4.017, 0.3], [4.117, 0.75]]);
  if (op <= 0.005) return null;
  return (
    <>
      {LINES.slice(0, 2).map((L, i) => t >= L.words[0].at && <WordLine key={i} t={t} words={L.words} size={TITLE_SIZE} cy={TITLE_CY} from="#9a9ca6" to={INK} exitAt={L.exitAt} />)}
      {t >= LINES[2].words[0].at && (
        <div style={{position: 'absolute', inset: 0, opacity: op, transform: `scale(${s.toFixed(4)})`, transformOrigin: `${W / 2}px ${TITLE_CY}px`,
          filter: bl > 0.05 ? `blur(${bl.toFixed(2)}px)` : undefined, willChange: 'transform'}}>
          <WordLine t={t} words={LINES[2].words} size={TITLE_SIZE} cy={TITLE_CY} from="#9a9ca6" to={INK} gray={gray} />
        </div>
      )}
    </>
  );
};

// ───────── 转折句（品牌蓝、斜）─────────
const TURN_SIZE = 124;
const TurnLine: React.FC<{t: number}> = ({t}) => (
  <WordLine t={t} words={[{s: TURN_LINE[0], at: 4.283, ink: 0.07}, {s: TURN_LINE[1], at: 4.383, ink: 0.34}]} size={TURN_SIZE} cy={TITLE_CY + 2}
    from="#9aa2ef" to={BLUE} weight={700} skew={-10} />
);

// ───────── 小卡片 ─────────
type Tone = 'red' | 'orange' | 'green' | 'blue' | 'purple';
const TONE: Record<Tone, [string, string]> = {
  red: ['#e64852', '#ffdedd'], orange: ['#e48b03', '#fdf0db'], green: ['#9dc13a', '#eef8d2'], blue: ['#3344ee', '#dae1ff'], purple: ['#895bf6', '#ecdcff'],
};
type CardDef = {main: string; sub: string; tone: Tone; x: number; y: number; rot: number; at: number; dur: number; dx: number; dy: number};
// x / y = 终位中心（画面 %）；dx / dy = 出发点相对终位（px，画面外）；按顺时针方位错开：左上 → 右上 → 右下 → 左下 → 上 → 左 → 右 → 下
const CARDS: CardDef[] = [
  {main: '家长群 99+', sub: '群聊 · 刚刚', tone: 'red', x: 15, y: 27, rot: -8, at: 0.43, dur: 0.52, dx: -470, dy: -330},
  {main: '报销单_最终版3.xlsx', sub: '已转发 3 次', tone: 'orange', x: 83, y: 28, rot: 6, at: 0.6, dur: 0.45, dx: 560, dy: -90},
  {main: '最新文件在哪？', sub: '聊天 · 12 条新消息', tone: 'blue', x: 81.5, y: 74.5, rot: -5, at: 0.7, dur: 0.45, dx: 520, dy: 260},
  {main: '3 个会撞在一起', sub: '日历 · 下午 3 点', tone: 'purple', x: 18, y: 74.5, rot: 6, at: 0.88, dur: 0.4, dx: -560, dy: 90},
  {main: '这件事谁在跟？', sub: '讨论 · 9 条回复', tone: 'green', x: 50.5, y: 15.5, rot: -3, at: 1.1, dur: 0.32, dx: 0, dy: -300},
  {main: '昨天就该交', sub: '表格 · 已逾期', tone: 'red', x: 13, y: 39, rot: 3, at: 1.28, dur: 0.3, dx: -480, dy: 0},
  {main: '周会改到几点？', sub: '通知 · 14 条未读', tone: 'blue', x: 86, y: 63.5, rot: -4, at: 1.45, dur: 0.3, dx: 480, dy: 0},
  {main: '便签：给小林回电话', sub: '桌面便签', tone: 'orange', x: 49.5, y: 89, rot: -2, at: 1.65, dur: 0.3, dx: 0, dy: 300},
];
const SW = {cx: W / 2, cy: 0.47 * H, start: 3.85, dur: 0.5};
type CS = {x: number; y: number; rot: number; s: number; blur: number; op: number};
const cardState = (i: number, t: number): CS => {
  const c = CARDS[i];
  const X = (c.x / 100) * W, Y = (c.y / 100) * H;
  const p = rs(t, c.at, c.dur, EASE.snappy);
  const sgn = c.rot >= 0 ? 1 : -1;
  // 落定后的小椭圆漂浮（每张周期 / 相位 / 方向不同，≈0.5%/秒）
  const ph = i * 1.7, per = 3.3 + (i % 4) * 0.35, w = (2 * Math.PI) / per;
  const ax = 5 + (i % 3) * 1.5, ay = 4 + ((i + 1) % 3) * 1.2;
  let x = X + c.dx * (1 - p) + ax * Math.sin(w * t + ph);
  let y = Y + c.dy * (1 - p) + ay * Math.cos(w * t + ph) * (i % 2 ? 1 : -1);
  let rot = c.rot + sgn * 7 * (1 - p) + 1.2 * Math.sin(w * 0.8 * t + ph * 1.3);
  let s = 1, blur = 0, op = clamp((t - c.at) / 0.06);
  // 漩涡收走：绕中心顺时针公转一点 + 拉向中心 + 自转到接近竖直 + 缩小变虚，后 40% 淡掉
  const q = clamp((t - SW.start - (i % 4) * 0.012) / SW.dur);
  if (q > 0) {
    const e = EASE.smooth(q);
    const vx = x - SW.cx, vy = y - SW.cy;
    const r0 = Math.hypot(vx, vy), th0 = Math.atan2(vy, vx);
    const r = r0 * (1 - 0.86 * e), th = th0 + (0.32 + r0 / 2400) * e;
    x = SW.cx + r * Math.cos(th);
    y = SW.cy + r * Math.sin(th);
    rot += (80 + Math.min(14, r0 / 60)) * e;
    s = 1 - 0.65 * e;
    blur = 6 * e;
    op *= 1 - EASE.smooth(clamp((q - 0.55) / 0.42));
  }
  return {x, y, rot, s, blur, op};
};
const Card: React.FC<{c: CardDef}> = ({c}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '13px 26px 13px 13px', background: '#ffffff', borderRadius: 17,
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,1), 0 1px 2px rgba(20,24,40,0.05), 0 9px 24px rgba(20,24,40,0.085)', whiteSpace: 'nowrap', fontFamily: SANS}}>
    <div style={{width: 42, height: 42, borderRadius: 12, background: TONE[c.tone][1], display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{width: 12, height: 12, borderRadius: 6, background: TONE[c.tone][0]}} />
    </div>
    <div>
      <div style={{fontSize: 24, fontWeight: 600, color: '#11131a', lineHeight: '30px', letterSpacing: '-0.01em'}}>{c.main}</div>
      <div style={{fontSize: 16, color: '#a8a9ae', lineHeight: '20px', marginTop: 1}}>{c.sub}</div>
    </div>
  </div>
);
const Cards: React.FC<{t: number}> = ({t}) => (
  <>
    {CARDS.map((c, i) => {
      if (t < c.at) return null;
      const st = cardState(i, t);
      if (st.op <= 0.003) return null;
      const a = cardState(i, t - 1 / 60), b = cardState(i, t + 1 / 60);
      return (
        <SpeedBlur key={i} vx={b.x - a.x} vy={b.y - a.y} amount={0.42} max={22}>
          <div style={{position: 'absolute', left: st.x, top: st.y, opacity: st.op, willChange: 'transform',
            transform: `translate(-50%, -50%) rotate(${st.rot.toFixed(3)}deg) scale(${st.s.toFixed(4)}) translateZ(0)`,
            filter: st.blur > 0.1 ? `blur(${st.blur.toFixed(2)}px)` : undefined}}>
            <Card c={c} />
          </div>
        </SpeedBlur>
      );
    })}
  </>
);

// ───────── 拍 3：蓝点（每 1/30s ≈×1.3，指数长大，不缓出）─────────
const DOT_R: Record<number, number> = {152: 5, 153: 11, 154: 19, 155: 33, 156: 55, 157: 86, 158: 118, 159: 158, 160: 207, 161: 268, 162: 345, 163: 450, 164: 640, 165: 1160, 166: 1160};
const DOT_C = {x: W / 2, y: 0.507 * H};
const BlueDot: React.FC<{f: number}> = ({f}) => {
  const r = DOT_R[f];
  if (!r) return null;
  const fe = Math.max(1.5, r * 0.025);
  return <AbsoluteFill style={{background: `radial-gradient(circle at ${DOT_C.x}px ${DOT_C.y}px, ${BLUE} ${(r - fe).toFixed(1)}px, rgba(45,67,238,0) ${r.toFixed(1)}px)`}} />;
};

// ───────── 天空（竖向渐变 + 模糊云团 + 极淡竖条纹；云慢漂 ≈2.9%/秒 + 天空极慢推 0.7%/秒，静看段靠它们保持 0.1 的活动值）─────────
const CLOUDS: [number, number, number, number, string, number][] = [
  // cx, cy, w, h, color, opacity
  [960, 1130, 2600, 480, '#e9edd7', 1],
  [470, 810, 760, 300, '#c6cde0', 0.7],
  [1240, 750, 980, 380, '#c2cae0', 0.62],
  [1700, 890, 760, 340, '#d5dcd6', 0.75],
  [160, 970, 820, 300, '#dfe5d6', 0.85],
  [860, 950, 900, 280, '#d3dad6', 0.7],
];
const LOGO_C = {x: W / 2, y: 0.45 * H};
const Sky: React.FC<{t: number}> = ({t}) => {
  const glow = trk(t, [[5.55, 0.62], [6.7, 0.34], [9.1, 0.3]]);
  const drift = (t - 5.55) * 55;
  return (
    <AbsoluteFill style={{overflow: 'hidden', transform: `scale(${(1 + (t - 5.55) * 0.007).toFixed(5)})`, background: 'linear-gradient(180deg, #00208a 0%, #1d35a0 11%, #3e50b7 22%, #6573c6 33%, #7c89d2 45%, #8a94d6 60%, #a9b2d9 75%, #cfd7d6 89%, #e9edd7 100%)'}}>
      <AbsoluteFill style={{background: `radial-gradient(ellipse 34% 46% at 50% 40%, rgba(178,188,240,${glow.toFixed(3)}) 0%, rgba(160,170,235,${(glow * 0.45).toFixed(3)}) 45%, rgba(150,160,230,0) 100%)`}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 40% 50% at 0% 0%, rgba(0,20,110,0.5) 0%, rgba(0,20,110,0) 100%), radial-gradient(ellipse 40% 50% at 100% 0%, rgba(0,20,110,0.5) 0%, rgba(0,20,110,0) 100%)'}} />
      <AbsoluteFill style={{transform: `translateX(${(-drift).toFixed(2)}px)`, filter: 'blur(24px)'}}>
        {CLOUDS.map(([cx, cy, w, h, col, op], i) => (
          <div key={i} style={{position: 'absolute', left: cx - w / 2, top: cy - h / 2, width: w, height: h, borderRadius: '50%', background: col, opacity: op}} />
        ))}
      </AbsoluteFill>
      {/* 玻璃竖条的暗示：静止的极淡竖条纹，下半更明显（云在后面漂 → 有一点折射视差） */}
      <AbsoluteFill style={{backgroundImage: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.07) 0px, rgba(255,255,255,0.07) 3px, rgba(40,50,150,0.035) 3px, rgba(40,50,150,0.035) 7px, rgba(255,255,255,0) 7px, rgba(255,255,255,0) 28px)',
        WebkitMaskImage: 'linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.35) 45%, rgba(0,0,0,1) 75%)', maskImage: 'linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.35) 45%, rgba(0,0,0,1) 75%)'}} />
      <Vignette strength={0.18} color="#000a40" inner={0.55} />
      <Grain opacity={0.05} step={100000} blend="soft-light" />
    </AbsoluteFill>
  );
};

// 同心圆：每圈 3px 白线 + 圈内淡亮雾，强 ease-out 外扩，最后在边缘挤成三道
const RING_TRACKS: P[] = [
  [[5.633, 40], [5.667, 72], [5.7, 130], [5.733, 189], [5.767, 234], [5.8, 259], [5.833, 297], [5.867, 324], [5.9, 340], [5.967, 378], [6.0, 400], [6.1, 445], [6.2, 483], [6.3, 510], [6.7, 578], [7.4, 600]],
  [[5.9, 150], [5.967, 225], [6.0, 279], [6.1, 354], [6.2, 430], [6.3, 470], [6.7, 560], [7.4, 584]],
  [[6.1, 175], [6.2, 290], [6.3, 346], [6.5, 450], [6.7, 540], [7.4, 568]],
];
const Rings: React.FC<{t: number}> = ({t}) => {
  const fade = trk(t, [[6.7, 1], [6.9, 0.6], [7.3, 0.15], [7.4, 0]]);
  if (fade <= 0) return null;
  return (
    <>
      {/* 天空第一帧就在的细白圈（接住蓝点） */}
      {t < 5.75 && (() => {
        const o = 0.7 * (1 - rs(t, 5.68, 0.06, EASE.linear));
        return <div style={{position: 'absolute', left: LOGO_C.x - 28, top: LOGO_C.y - 28, width: 56, height: 56, borderRadius: '50%', border: `2px solid rgba(255,255,255,${o.toFixed(3)})`, boxShadow: `0 0 10px rgba(255,255,255,${(o * 0.4).toFixed(3)})`}} />;
      })()}
      {RING_TRACKS.map((tr, i) => {
        if (t < tr[0][0]) return null;
        const r = trk(t, tr);
        const soft = i === 0 ? 1 - rs(t, 5.633, 0.07, EASE.linear) : 1 - rs(t, tr[0][0], 0.05, EASE.linear); // 出生时是软光晕环
        const born = rs(t, tr[0][0], 0.04, EASE.linear);
        const a = 0.78 * fade * mix(0.45, 1, 1 - soft) * born;
        const bw = mix(4, 10, soft);
        return (
          <div key={i} style={{position: 'absolute', left: LOGO_C.x - r, top: LOGO_C.y - r, width: r * 2, height: r * 2, borderRadius: '50%',
            border: `${bw.toFixed(1)}px solid rgba(255,255,255,${a.toFixed(3)})`, boxSizing: 'border-box',
            filter: soft > 0.05 ? `blur(${(soft * 3).toFixed(2)}px)` : undefined,
            background: `radial-gradient(circle, rgba(255,255,255,0) 55%, rgba(255,255,255,${(0.12 * fade * born).toFixed(3)}) 100%)`,
            boxShadow: `0 0 8px rgba(255,255,255,${(a * 0.35).toFixed(3)})`}} />
        );
      })}
    </>
  );
};

// 四角星闪：scale 0→1→0，峰值附近微转
const Star: React.FC<{t: number; at: number; life: number; x: number; y: number; size: number; color: string}> = ({t, at, life, x, y, size, color}) => {
  const q = (t - at) / life;
  if (q <= 0 || q >= 1) return null;
  const s = Math.sin(Math.PI * q);
  return (
    <svg width={size} height={size} viewBox="-12 -12 24 24" style={{position: 'absolute', left: x - size / 2, top: y - size / 2, overflow: 'visible',
      transform: `scale(${s.toFixed(3)}) rotate(${(q * 40).toFixed(1)}deg)`, filter: `drop-shadow(0 0 4px ${color})`}}>
      <path d="M0 -12 C1.2 -3 3 -1.2 12 0 C3 1.2 1.2 3 0 12 C-1.2 3 -3 1.2 -12 0 C-3 -1.2 -1.2 -3 0 -12 Z" fill={color} />
    </svg>
  );
};

// 品牌方块：白色厚玻璃圆角方块（屏幕空间叠层出厚度：右下侧面）+ Mark
const TILE = 220;
const BrandTile: React.FC<{x: number; y: number; size: number; angle: number; blur: number}> = ({x, y, size, angle, blur}) => {
  if (size < 1) return null;
  const rad = size * 0.24;
  const layers = 7, k = size / TILE;
  const box = (dx: number, dy: number): React.CSSProperties => ({position: 'absolute', left: x - size / 2 + dx, top: y - size / 2 + dy, width: size, height: size, borderRadius: rad,
    transform: `rotate(${angle.toFixed(3)}deg)`});
  return (
    <div style={{position: 'absolute', inset: 0, filter: blur > 0.15 ? `blur(${blur.toFixed(2)}px)` : undefined}}>
      <div style={{...box(10 * k, 26 * k), background: 'rgba(0,16,90,0.32)', filter: `blur(${(18 * k).toFixed(1)}px)`}} />
      {Array.from({length: layers}, (_, j) => {
        const i = layers - j;
        return <div key={i} style={{...box(i * 1.25 * k, i * 1.7 * k), background: mixc('#5866cc', '#9aa6ec', j / layers), boxShadow: j === layers - 1 ? 'inset 0 0 0 1px rgba(255,255,255,0.35)' : undefined}} />;
      })}
      <div style={{...box(0, 0), overflow: 'hidden',
        background: 'linear-gradient(155deg, #ffffff 0%, #f3f5ff 42%, #dfe5fd 100%)',
        boxShadow: `inset ${(2 * k).toFixed(1)}px ${(2.5 * k).toFixed(1)}px 0 rgba(255,255,255,1), inset 0 ${(-6 * k).toFixed(1)}px ${(14 * k).toFixed(1)}px rgba(110,125,220,0.25)`}}>
        <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(120deg, rgba(255,255,255,0) 30%, rgba(255,255,255,0.75) 42%, rgba(255,255,255,0) 54%)'}} />
        <div style={{position: 'absolute', left: size * 0.2, top: size * 0.2}}><Mark size={size * 0.6} /></div>
      </div>
    </div>
  );
};

// 名字 / 标语排版（Logo + 名字整体居中）
const NAME_SIZE = 120;
const NAME_W = Array.from(BRAND.name).length * NAME_SIZE * 0.98;
const END_SCALE = 0.63, GAP = 64;
const GROUP_W = TILE * END_SCALE + 10 + GAP + NAME_W;
const GROUP_L = W / 2 - GROUP_W / 2;
const LOGO_END_X = GROUP_L + (TILE * END_SCALE) / 2;
const NAME_L = GROUP_L + TILE * END_SCALE + 10 + GAP;
const SWING = LOGO_C.x - LOGO_END_X;
const logoX = (t: number) => trk(t, [[6.75, LOGO_C.x], [6.8, LOGO_C.x - 0.13 * SWING], [6.85, LOGO_C.x - 0.49 * SWING], [6.9, LOGO_C.x - 0.76 * SWING], [6.95, LOGO_C.x - 0.92 * SWING], [7.0, LOGO_END_X]]);
const logoScale = (t: number) => trk(t, [[5.667, 0.04], [5.7, 0.36], [5.733, 0.78], [5.767, 0.97], [5.8, 1.02], [5.833, 1.03], [5.867, 1.0], [6.75, 1.0], [6.8, 0.91], [6.85, 0.78], [6.9, 0.68], [7.0, END_SCALE]]);
// 方块 + 四角星都是 90° 对称：单向自转 −40° → 80°（看起来停在 −10° 斜放）
const logoAngle = (t: number) => trk(t, [[5.667, -40], [5.7, 20], [5.733, 36], [5.767, 50], [5.8, 64], [5.833, 73], [5.867, 77.5], [5.95, 80], [6.75, 80], [6.8, 74], [6.85, 72], [6.93, 76], [7.0, 79], [7.1, 80], [8.9, 80], [9.07, 70]]);

const BrandGroup: React.FC<{t: number}> = ({t}) => {
  if (t < 5.66) return null;
  const sc = logoScale(t), ang = logoAngle(t), x = logoX(t);
  const vx = logoX(t + 1 / 60) - logoX(t - 1 / 60);
  const w = Math.abs(logoAngle(t + 1 / 60) - logoAngle(t - 1 / 60));
  const rotBlur = Math.min(4, w * 0.07) * Math.min(1, sc);
  const NAME = Array.from(BRAND.name);
  const tagWords: {s: string; at: number; lime: boolean}[] = [
    {s: BRAND.taglineA[0], at: 7.25, lime: false}, {s: BRAND.taglineA[1], at: 7.35, lime: false},
    {s: BRAND.taglineB[0], at: 7.55, lime: true}, {s: BRAND.taglineB[1], at: 7.7, lime: true},
  ];
  const TS = 46;
  const tagW = tagWords.reduce((a, w2) => a + Array.from(w2.s).length * TS, 0) - TS * 0.5;
  let tx = W / 2 - tagW / 2;
  return (
    <>
      {/* 名字在 Logo 下层：第一个字被 Logo 右缘盖住一半，像从 Logo 后面抽出来 */}
      <div style={{position: 'absolute', left: NAME_L, top: LOGO_C.y - NAME_SIZE * 0.62, fontSize: NAME_SIZE, lineHeight: `${NAME_SIZE * 1.24}px`, fontWeight: 700,
        letterSpacing: '-0.02em', color: '#fdfdfd', fontFamily: SANS, whiteSpace: 'pre', textShadow: '0 2px 18px rgba(10,20,90,0.28)'}}>
        {NAME.map((c, i) => {
          const a = 6.833 + i * 0.0667;
          const p = rs(t, a, 0.07, EASE.linear);
          return <span key={i} style={{opacity: p, filter: p < 0.6 ? `blur(${((0.6 - p) * 4).toFixed(2)}px)` : undefined}}>{c}</span>;
        })}
      </div>
      <SpeedBlur vx={vx} amount={0.5} max={20}>
        <BrandTile x={x} y={LOGO_C.y} size={TILE * sc} angle={ang} blur={rotBlur} />
      </SpeedBlur>
      {/* 标语逐词：白 + 后半句黄绿斜 */}
      <div style={{position: 'absolute', inset: 0}}>
        {tagWords.map((w2, i) => {
          const left = tx; tx += Array.from(w2.s).length * TS;
          if (t < w2.at) return null;
          const p = rs(t, w2.at, 0.2, EASE.out);
          return (
            <span key={i} style={{position: 'absolute', left, top: 660 - TS * 0.62, fontSize: TS, lineHeight: `${TS * 1.24}px`, fontWeight: w2.lime ? 600 : 500,
              color: w2.lime ? LIME : '#fdfdfd', fontFamily: SANS, textShadow: '0 1px 12px rgba(16,26,110,0.4)', whiteSpace: 'pre', opacity: p, filter: p < 0.98 ? `blur(${(4 * (1 - p)).toFixed(2)}px)` : undefined,
              transform: `translateY(${(9 * (1 - p)).toFixed(2)}px)${w2.lime ? ' skewX(-10deg)' : ''}`}}>{w2.s}</span>
          );
        })}
      </div>
      <Star t={t} at={6.2} life={0.45} x={LOGO_C.x - 140} y={LOGO_C.y - 130} size={26} color={LIME} />
      <Star t={t} at={6.4} life={0.36} x={LOGO_C.x - 50} y={LOGO_C.y - 142} size={18} color="#ffffff" />
      <Star t={t} at={6.5} life={0.45} x={LOGO_C.x - 165} y={LOGO_C.y + 76} size={15} color="#ffffff" />
      <Star t={t} at={7.3} life={0.4} x={NAME_L + NAME_W + 22} y={LOGO_C.y - 70} size={24} color={LIME} />
      <Star t={t} at={7.36} life={0.4} x={NAME_L + NAME_W - 40} y={LOGO_C.y + 72} size={15} color="#ffffff" />
    </>
  );
};

// ═════════ 三拍（每拍是完整画面，可单独拿出来用：传全片帧号 f）═════════

// 拍 1：痛点换词（0–116）：浅底 + 三句整行重打 + 八张卡进场、微漂
export const PainBeat: React.FC<{f: number}> = ({f}) => {
  const t = f / 30;
  return (
    <AbsoluteFill>
      <LightBackdrop />
      <Cards t={t} />
      <PainTitle t={t} />
    </AbsoluteFill>
  );
};

// 拍 2：卡片漩涡收走 + 转折句（116–152），142 起全静
export const SwirlBeat: React.FC<{f: number}> = ({f}) => {
  const t = f / 30;
  return (
    <AbsoluteFill>
      <LightBackdrop />
      <Cards t={t} />
      <PainTitle t={t} />
      <TurnLine t={t} />
    </AbsoluteFill>
  );
};

// 拍 3：蓝点吞屏 → 硬切天空 → Logo 长出、名字抽出、标语 → 刷白（152–276）
export const LogoBeat: React.FC<{f: number}> = ({f}) => {
  const t = f / 30;
  if (f < 167) {
    return (
      <AbsoluteFill>
        <LightBackdrop />
        <TurnLine t={t} />
        <BlueDot f={f} />
      </AbsoluteFill>
    );
  }
  const o = rs(t, 8.9, 0.17, EASE.smooth); // 刷白
  const ob = rs(t, 8.9, 0.13, EASE.exit);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{filter: o > 0.01 ? `brightness(${(1 + o * 0.7).toFixed(3)})` : undefined}}>
        <Sky t={t} />
        <Rings t={t} />
      </AbsoluteFill>
      {o < 0.995 && (
        <AbsoluteFill style={{opacity: 1 - ob * 0.6, transform: `translateX(${(o * 46).toFixed(2)}px)`}}>
          <SpeedBlur vx={o > 0.01 ? 8 + o * 60 : 0} amount={0.45} max={30}>
            <BrandGroup t={t} />
          </SpeedBlur>
        </AbsoluteFill>
      )}
      {o > 0.003 && <AbsoluteFill style={{opacity: o}}><LightBackdrop variant={1} /></AbsoluteFill>}
    </AbsoluteFill>
  );
};

export const PainSwirlDotLogo: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: '#eef3fb', overflow: 'hidden', fontFamily: SANS}}>
      {f < PAIN_BEAT.end ? <PainBeat f={f} /> : f < SWIRL_BEAT.end ? <SwirlBeat f={f} /> : <LogoBeat f={f} />}
    </AbsoluteFill>
  );
};
