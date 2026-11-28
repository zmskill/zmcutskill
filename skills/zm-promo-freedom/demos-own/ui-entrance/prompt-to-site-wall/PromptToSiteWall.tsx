// 字卡失焦 → 输入框 → 打字特写追字 → 拉回点击 → 结果页斜入摆正 → 页内滚动 → 逐词字卡 → 卡片墙换稿 → 提交 + 黑边 → Logo 逐字长出 → 标语 → Logo 放大（007 B 段 10.5–27.69s）
// 学的动作（来自 @bohdanmotion × Bolt，25fps 逐帧看过）：
//   所有换场都是"3–4 帧失焦爬坡 → 硬切 → 新画面第一帧就虚、已经在动"；
//   输入框很虚地从中间长大 → 4 帧"啪"地推到左上角特写 → 打字越打越快、镜头越摇越快追字，最新 3 个字是浅色尾巴；
//   拉回起步极慢、0.55s 后才最快、长尾巴；鼠标带拖影 3 帧冲到发送键；点下去冒一团青光，停一拍；
//   结果页 rotateY≈14°（左近右远）+ 右上翘 + 放大 + 很虚地进来，0.32s 摆正，几何先到、清晰晚 2 帧；产品图先大马赛克 → 小马赛克 → 偏色 → 干净；
//   页面推近 1.4× 的同时页内滚到底再滚回（两程都是两头慢中间快、转折不停、回程更快），左侧聊天栏不跟滚；
//   逐词字卡（偏青、发虚、偏低、竖向拉伸 → 浮上来变白，高亮底块从左擦出）；
//   卡片墙从纵深退后到位，中心卡被三层斜边色块连换几版，四周空位从画面外错开滑入补满 3×3；
//   推近中心卡 + 四周景深虚化变暗 + 选中描边；"提交"胶囊：悬停 → 按下 → 已提交深蓝从左擦满；黑边和点击同一帧压入；
//   Logo 一帧一个字从左往右虚着长出 → 黑边撤、Logo 上移、标语逐词阶梯浮出、胶囊先字后底 → 静停 → 从下往上一层层收 → Logo 虚着落到中心再清楚 → 放大 1.6×。
// 我们的内容：输入"帮我做一个卖手工咖啡豆的小店网站"；结果页是虚构咖啡豆小店"慢焙"（第4轮起咖啡袋 / 豆子 / 烘焙用真照片）；
//   卡片墙是 9 个虚构网站（记账本、花店、唱片店、星空露营、摄影工作室、健身房、面包房、书店，中心卡"野营社"连换成音乐节海报）；
//   收尾 Logo 位放我们的产品"逐梦的剪辑 skills"，标语"一句话，做出你的作品"。
//
// 时间表（30fps，共 515f；t = 10.5 + f/30，下面写原片秒）
//   10.50–10.88  上一张字卡慢放大，10.64 起失焦 4 帧 → 硬切
//   10.88–11.52  输入框虚着长大（0.36s ease-out），模糊比尺寸晚收
//   11.52–12.08  4 帧推到左上角特写（11.56–11.72 完成 80%）+ 长尾；11.60 占位字消失、光标闪
//   11.92–12.70  逐字打（越来越快）+ 镜头追字（ease-in）；12.7–13.08 打完光标闪、镜头还在漂
//   13.08–14.00  拉回（慢起、13.64 最快、长尾）；13.68 发送键变亮蓝；13.76 鼠标拖影冲入
//   14.08–14.60  点击：变浅 → 青光外扩 → 散；停一拍（整体极慢缩小）
//   14.60–14.76  失焦爬坡 → 硬切；14.76–15.08 结果页斜入摆正，15.16 才完全清楚；14.92–15.12 马赛克
//   15.40–17.84  推近 1.4×；15.52–16.64 页内往下滚，16.68–17.72 滚回（不停顿）
//   17.84–18.00  缩小 + 失焦 → 硬切；18.00–19.56 逐词字卡；19.40–19.66 失焦
//   19.68–20.28  卡片墙退后到位；20.28–20.60 色块三层擦除；20.20–20.82 空位依次滑入
//   20.84–21.20  推近中心卡 + 景深；21.40–21.88 鼠标点"提交" → "已提交"；21.60 黑边压入
//   22.32–22.48  失焦 → 硬切；22.48–22.88 Logo 逐字长出；22.84–23.40 黑边撤 + 上移 + 标语 + 胶囊
//   23.44–25.00  静停；25.00–25.84 下沉 + 胶囊 → 标语 → Logo 依次虚掉；25.84–26.2 Logo 变清楚；26.6–27.2 放大
// 毛病清单（自查表通用项 + 本镜头独有）：
//   - 独有 1：推近只有 4 帧，拉回 0.9s 且起步极慢；做成对称就机械
//   - 独有 2：结果页几何先到位、清晰晚 2 帧；马赛克 → 偏色 → 干净三步
//   - 独有 3：页内滚动转折点不能停；左栏不跟滚
//   - 独有 4：黑边和点击同一帧开始；Logo 一帧一个字、左对齐往右长
import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {FONT, Grain, Vignette, mix} from '../../../assets/lib/helpers/polish';

export const PROMPT_TO_SITE_WALL_DURATION = 515;

const SANS = `"PingFang SC", "Noto Sans CJK SC", "Noto Sans SC", ${FONT.sans}`;
const SERIF = `"Songti SC", "STSong", "Noto Serif CJK SC", serif`;
const INK = '#16151c';
const ACCENT = '#5b5cf0';
const W = 1920, H = 1080;
const clamp = (x: number) => Math.max(0, Math.min(1, x));
const sm = (x: number) => { const c = clamp(x); return c * c * (3 - 2 * c); };
const rp = (t: number, a: number, b: number) => sm((t - a) / (b - a));
const eo = (t: number, a: number, b: number) => { const c = clamp((t - a) / (b - a)); return 1 - Math.pow(1 - c, 3); };
const bl = (px: number) => (px > 0.25 ? `blur(${px.toFixed(2)}px)` : undefined);

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
const hex = (c: string) => (c.startsWith('rgb') ? (c.match(/[\d.]+/g) as string[]).slice(0, 3).map(Number) : [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16)));
const mixc = (a: string, b: string, k: number) => { const A = hex(a), B = hex(b); return `rgb(${A.map((v, i) => Math.round(mix(v, B[i], clamp(k)))).join(',')})`; };

// ───────── 蓝色柔光背景（字卡 / 输入框 / Logo 通用） ─────────
const Backdrop: React.FC<{t: number; fog?: number}> = ({t, fog = 0}) => {
  const dx = Math.sin(t * 0.7) * 80 + (t - 18) * 32, dy = Math.cos(t * 0.55) * 50 - (t - 18) * 18;
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <AbsoluteFill style={{background: 'linear-gradient(168deg, #08027e 0%, #0b03b0 28%, #1007e0 55%, #1024ef 80%, #0f2df4 100%)'}} />
      <AbsoluteFill style={{background: `radial-gradient(ellipse 70% 55% at ${70 + dx / 30}% ${-8 + dy / 40}%, rgba(6,3,70,0.85) 0%, rgba(6,3,70,0) 100%)`}} />
      <AbsoluteFill style={{background: `radial-gradient(ellipse 40% 60% at ${104 - dx / 40}% ${72 + dy / 30}%, rgba(25,70,255,0.75) 0%, rgba(25,70,255,0) 100%)`}} />
      <AbsoluteFill style={{background: `radial-gradient(ellipse 64% 108% at ${-10 + dx / 40}% ${102 + dy / 50}%, rgba(236,246,252,1) 0%, rgba(160,218,248,1) 24%, rgba(40,185,245,0.85) 46%, rgba(30,120,240,0) 76%)`}} />
      <AbsoluteFill style={{backgroundImage: 'radial-gradient(rgba(255,255,255,0.55) 0.8px, transparent 1.2px)', backgroundSize: '8px 8px', opacity: 0.07}} />
      {fog > 0 && <AbsoluteFill style={{background: 'rgba(150,180,255,1)', opacity: fog}} />}
    </AbsoluteFill>
  );
};

// ───────── 通用：逐词进场（偏青 + 虚 + 偏低 + 竖向拉伸 → 浮上来变白） ─────────
type Wd = {t: string; at: number; hl?: 'pop' | 'wipe'; hlAt?: number};
const WordLine: React.FC<{t: number; words: Wd[]; size: number; cy: number; glass?: boolean; cyanHold?: number; gap?: number}> = ({t, words, size, cy, glass, cyanHold = 0, gap = 0.3}) => {
  const widths = words.map((w) => Array.from(w.t).length * size);
  const total = widths.reduce((a, b) => a + b, 0) + gap * size * (words.length - 1);
  let x = W / 2 - total / 2;
  return (
    <>
      {words.map((w, i) => {
        const left = x; x += widths[i] + gap * size;
        const age = t - w.at;
        if (age < 0) return null;
        const p = eo(age, 0, 0.16);
        const cyan = Math.max(1 - rp(age, 0.06, 0.24), cyanHold);
        const blur = (1 - eo(age, 0, 0.12)) * 9;
        const dy = (1 - p) * size * 0.3;
        const sy = mix(1.16, 1, p);
        const hlP = w.hl ? (w.hl === 'pop' ? eo(t, w.hlAt!, w.hlAt! + 0.08) : 1) : 0;
        const wipe = w.hl === 'wipe' ? trk(t, [[w.hlAt!, 0], [w.hlAt! + 0.04, 40], [w.hlAt! + 0.08, 80], [w.hlAt! + 0.12, 100]]) : 100;
        return (
          <React.Fragment key={i}>
            {w.hl && t >= w.hlAt! && (
              <div style={{position: 'absolute', left: left - size * 0.14, top: cy - size * 0.64, width: widths[i] + size * 0.28, height: size * 1.26, borderRadius: 8,
                background: 'rgba(205,220,255,0.38)', boxShadow: '0 0 24px rgba(160,200,255,0.35)', opacity: hlP,
                clipPath: `inset(0 ${(100 - wipe).toFixed(1)}% 0 0)`}} />
            )}
            <div style={{position: 'absolute', left, top: cy - size * 0.62, fontSize: size, lineHeight: `${size * 1.24}px`, fontWeight: 600, fontFamily: SANS, whiteSpace: 'pre',
              opacity: clamp(age / 0.05) * mix(0.7, 1, p), filter: bl(blur), transform: `translateY(${dy.toFixed(1)}px) scaleY(${sy.toFixed(3)})`, transformOrigin: '50% 80%',
              ...(glass
                ? {color: 'transparent', WebkitTextStroke: `${(size * 0.03).toFixed(2)}px ${mixc('#ffffff', '#7ff2fa', cyan)}`, backgroundImage: 'linear-gradient(172deg, rgba(255,255,255,0.95) 0%, rgba(225,238,255,0.7) 30%, rgba(170,185,255,0.45) 55%, rgba(205,225,255,0.6) 80%, rgba(255,255,255,0.85) 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text'}
                : {color: mixc('#fdfdfe', '#6cf0f8', cyan), textShadow: '0 0 18px rgba(170,220,255,0.35)'})}}>{w.t}</div>
          </React.Fragment>
        );
      })}
    </>
  );
};

// ───────── 鼠标箭头（大号，白底黑边；可带运动拖影） ─────────
const Arrow: React.FC<{x: number; y: number; size?: number; opacity?: number}> = ({x, y, size = 92, opacity = 1}) => (
  <svg width={size} height={size * 1.2} viewBox="0 0 22 26" style={{position: 'absolute', left: x - size * 0.09, top: y - size * 0.09, overflow: 'visible', filter: 'drop-shadow(2px 4px 4px rgba(0,0,0,0.35))', opacity}}>
    <path d="M2 2 L2 20 L7 15.5 L10.5 23 L13.5 21.6 L10 14.3 L17 14 Z" fill="#fff" stroke="#111" strokeWidth="1.4" strokeLinejoin="round" />
  </svg>
);
const Mouse: React.FC<{pos: (t: number) => [number, number]; t: number; opacity?: number}> = ({pos, t, opacity = 1}) => {
  const [x, y] = pos(t);
  const [px, py] = pos(t - 1 / 30);
  const v = Math.hypot(x - px, y - py);
  const n = v > 30 ? 16 : 0;
  return (
    <>
      {n > 0 && <div style={{position: 'absolute', inset: 0, filter: 'blur(4px)'}}>{Array.from({length: n}, (_, k) => { const q = (k + 1) / (n + 1); const [gx, gy] = [mix(x, px, q * 1.4), mix(y, py, q * 1.4)]; return <Arrow key={k} x={gx} y={gy} opacity={opacity * 0.3 * (1 - q * 0.7)} />; })}</div>}
      <div style={{filter: bl(Math.min(6, v / 40))}}><Arrow x={x} y={y} opacity={opacity} /></div>
    </>
  );
};

// ═════════ B1 上一张字卡 ═════════
const Card1: React.FC<{t: number}> = ({t}) => {
  const blur = trk(t, [[10.62, 0], [10.66, 1.5], [10.7, 4], [10.74, 7.5], [10.78, 11], [10.82, 15], [10.88, 20]]);
  const s = mix(1.0, 1.03, clamp((t - 10.5) / 0.38));
  const op = mix(1, 0.6, rp(t, 10.7, 10.86));
  return (
    <AbsoluteFill>
      <Backdrop t={t} fog={0.14 * rp(t, 10.64, 10.84)} />
      <AbsoluteFill style={{transform: `scale(${s.toFixed(4)})`, filter: bl(blur), opacity: op}}>
        <WordLine t={t} size={100} cy={486} words={[{t: '说出你想要的', at: 9}]} />
        <WordLine t={t} size={100} cy={608} words={[{t: '剩下的', at: 9}, {t: '交给它', at: 9, hl: 'pop', hlAt: 9}]} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ═════════ B2–B7 输入框 ═════════
const BX = 355, BY = 350, BW = 1210, BH = 380, RIM = 18;
const PROMPT = Array.from('帮我做一个卖手工咖啡豆的小店网站');
const charAt = (i: number) => 11.92 + 0.78 * Math.pow(i / (PROMPT.length - 1), 0.6);
const OX = 380, OY = 377;
const zz = (t: number) => 1 + (trk(t, Z_TRK) - 1) * 0.56;
const G_TRK: P = [[10.88, 0.635], [10.92, 0.79], [10.96, 0.857], [11.0, 0.897], [11.08, 0.952], [11.16, 0.984], [11.24, 1.0]];
const Z_TRK: P = [[11.24, 1.0], [11.32, 1.005], [11.4, 1.02], [11.48, 1.05], [11.52, 1.08], [11.56, 1.14], [11.6, 1.24], [11.64, 1.7], [11.68, 2.15], [11.72, 2.4], [11.8, 2.52], [11.92, 2.62], [12.08, 2.74], [12.3, 2.82], [13.08, 2.9], [13.2, 2.86], [13.36, 2.72], [13.48, 2.5], [13.56, 2.25], [13.6, 2.05], [13.64, 1.62], [13.68, 1.35], [13.72, 1.2], [13.76, 1.13], [13.8, 1.1], [13.88, 1.07], [14.0, 1.045]];
const PAN_TRK: P = [[11.92, 0], [12.2, 0.8], [12.3, 1.8], [12.4, 4], [12.5, 9], [12.6, 19], [12.7, 31], [12.8, 36], [13.08, 40], [13.2, 39.5], [13.36, 37], [13.48, 31], [13.56, 22], [13.64, 8], [13.72, 2], [13.8, 0]];
const S2_TRK: P = [[14.0, 1.0], [14.56, 0.972], [14.64, 0.955], [14.72, 0.885], [14.77, 0.84]];
const inMap = (t: number, x: number, y: number): [number, number] => {
  const g = trk(t, G_TRK), Z = zz(t), pan = trk(t, PAN_TRK) / 100 * W, s2 = trk(t, S2_TRK);
  const cx = BX + BW / 2, cy = BY + BH / 2;
  let X = cx + (x - cx) * g, Y = cy + (y - cy) * g;
  X = OX + (X - OX) * Z; Y = OY + (Y - OY) * Z;
  X -= pan;
  X = 960 + (X - 960) * s2; Y = 540 + (Y - 540) * s2;
  return [X, Y];
};
const SEND = {x: BX + BW - RIM - 26 - 33, y: BY + BH - RIM - 24 - 33};

const InputScene: React.FC<{t: number}> = ({t}) => {
  const g = trk(t, G_TRK), Z = zz(t), pan = trk(t, PAN_TRK) / 100 * W, s2 = trk(t, S2_TRK);
  const blur = Math.max(trk(t, [[10.88, 17], [10.96, 14], [11.0, 12], [11.08, 8], [11.16, 4], [11.24, 1.6], [11.32, 0]]), trk(t, [[14.58, 0], [14.62, 2.5], [14.66, 7], [14.7, 12], [14.75, 19]]));
  const cx = BX + BW / 2, cy = BY + BH / 2;
  const tf = `translate(960px,540px) scale(${s2.toFixed(5)}) translate(-960px,-540px) translateX(${(-pan).toFixed(2)}px) translate(${OX}px,${OY}px) scale(${Z.toFixed(5)}) translate(${-OX}px,${-OY}px) translate(${cx}px,${cy}px) scale(${g.toFixed(5)}) translate(${-cx}px,${-cy}px)`;
  const n = PROMPT.filter((_, i) => t >= charAt(i)).length;
  const typing = t >= 11.9 && t < 12.72;
  const cursorOn = t >= 11.6 && (typing || (t < 11.88) || (t >= 12.72 && ((t - 12.72) % 0.5) < 0.3));
  const active = rp(t, 13.66, 13.7);
  const press = rp(t, 14.06, 14.1);
  const glow = t >= 14.1 ? eo(t, 14.1, 14.4) : 0;
  const glowOp = t >= 14.1 ? (1 - rp(t, 14.2, 14.5)) * rp(t, 14.1, 14.14) : 0;
  const after = rp(t, 14.1, 14.4);
  const btnCol = after > 0 ? mixc('#2b9ff0', '#cfe6f8', Math.max(press, after)) : mixc(mixc('#bcdcf4', '#2b9ff0', active), '#9fe6f6', press);
  const textX = BX + RIM + 38, textY = BY + RIM + 30;
  // 鼠标：在输入框局部坐标里走，跟着镜头一起变换
  const mousePos = (tt: number): [number, number] => {
    const lx = SEND.x + 20 + trk(tt, [[13.74, 340], [13.76, 300], [13.8, 170], [13.84, 60], [13.88, 12], [13.92, 2], [14.0, 0]]);
    const ly = SEND.y + 20 + trk(tt, [[13.74, 135], [13.76, 120], [13.8, 80], [13.84, 30], [13.88, 6], [13.92, 1], [14.0, 0]]);
    return inMap(tt, lx, ly);
  };
  return (
    <AbsoluteFill>
      <Backdrop t={t} />
      <AbsoluteFill style={{filter: bl(blur)}}>
        <div style={{position: 'absolute', left: 0, top: 0, width: W, height: H, transform: tf, transformOrigin: '0 0'}}>
          <div style={{position: 'absolute', left: BX, top: BY, width: BW, height: BH, borderRadius: 64, background: 'linear-gradient(180deg, rgba(205,218,250,0.62), rgba(180,196,245,0.5))', boxShadow: '0 30px 80px rgba(5,10,80,0.35), inset 0 1px 0 rgba(255,255,255,0.7)'}} />
          <div style={{position: 'absolute', left: BX + RIM, top: BY + RIM, width: BW - RIM * 2, height: BH - RIM * 2, borderRadius: 48, background: '#fdfdfd', overflow: 'hidden', fontFamily: SANS}}>
            <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(100deg, rgba(225,236,244,0) 40%, rgba(200,236,246,0.6) 100%)', opacity: after * 0.8}} />
          </div>
          {t < 11.6 && <div style={{position: 'absolute', left: textX, top: textY, fontSize: 46, lineHeight: '60px', color: '#a8aab6', fontFamily: SANS}}>我们来做个网站……</div>}
          <div style={{position: 'absolute', left: textX, top: textY, fontSize: 46, lineHeight: '60px', fontFamily: SANS, whiteSpace: 'pre', display: 'flex', alignItems: 'center'}}>
            {PROMPT.slice(0, n).map((c, i) => { const k = rp(t - charAt(i), 0, 0.13); return <span key={i} style={{color: mixc('#a9b6d6', '#2a2a2e', k), opacity: mix(0.55, 1, k)}}>{c}</span>; })}
            <span style={{display: 'inline-block', width: 3, height: 54, marginLeft: 2, background: '#1a1a1e', opacity: cursorOn ? 1 : 0}} />
          </div>
          {/* 底部工具条 */}
          <div style={{position: 'absolute', left: BX + RIM + 24, top: BY + BH - RIM - 24 - 64, height: 64, display: 'flex', alignItems: 'center', gap: 38, fontFamily: SANS, fontSize: 34, color: '#8b8e9a'}}>
            <div style={{width: 64, height: 64, borderRadius: 32, border: '2px solid #6f7280', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, color: '#3a3d4a'}}>+</div>
            <span>标准 ⌃⌄</span>
            <span>🎨 ⌃⌄</span>
          </div>
          <div style={{position: 'absolute', right: W - (BX + BW - RIM - 26), top: BY + BH - RIM - 24 - 66, height: 66, display: 'flex', alignItems: 'center', gap: 34, fontFamily: SANS, fontSize: 34, color: '#8b8e9a'}}>
            <span>💡 规划</span><span>🎙</span>
            <div style={{position: 'relative', width: 66, height: 66}}>
              {glowOp > 0.01 && <div style={{position: 'absolute', left: 33 - 66 * (1.1 + glow), top: 33 - 66 * (1.1 + glow), width: 132 * (1.1 + glow), height: 132 * (1.1 + glow), borderRadius: '50%', background: 'radial-gradient(circle, rgba(200,250,255,0.95) 0%, rgba(126,232,248,0.8) 30%, rgba(126,232,248,0) 70%)', opacity: glowOp}} />}
              <div style={{position: 'absolute', inset: 0, borderRadius: 33, background: btnCol, transform: `scale(${(1 - press * 0.08 + after * 0.08).toFixed(3)})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 32, fontWeight: 700}}>
                <span style={{opacity: 1 - rp(t, 14.08, 14.12)}}>↑</span>
              </div>
            </div>
          </div>
        </div>
        {t >= 13.74 && <Mouse pos={mousePos} t={t} />}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ═════════ B7–B9 结果页：咖啡豆小店 ═════════
const WW = 1229, WH = 744, CHAT = 300, BAR = 40, VIEW = WH - BAR;
const BROWN = '#2b1a12', CREAM = '#f3e7d3';
const Bean: React.FC<{x: number; y: number; r: number; rot: number}> = ({x, y, r, rot}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`}>
    <ellipse rx={r} ry={r * 0.72} fill="#5a3320" />
    <ellipse rx={r * 0.8} ry={r * 0.55} fill="#6d4029" />
    <path d={`M${-r * 0.75} 0 C ${-r * 0.3} ${-r * 0.25}, ${r * 0.3} ${r * 0.25}, ${r * 0.75} 0`} stroke="#2e170c" strokeWidth={r * 0.14} fill="none" strokeLinecap="round" />
  </g>
);
const Bag: React.FC<{w: number; label: string; sub: string; tone?: string}> = ({w, label, sub, tone = '#b9844f'}) => (
  <svg width={w} height={w * 1.3} viewBox="0 0 200 260" textRendering="geometricPrecision" shapeRendering="geometricPrecision" style={{overflow: 'visible'}}>
    <defs>
      <linearGradient id={`bag${tone.slice(1)}`} x1="0" x2="1"><stop offset="0" stopColor={tone} /><stop offset="0.55" stopColor="#d2a271" /><stop offset="1" stopColor="#9c6b3c" /></linearGradient>
    </defs>
    <path d="M38 40 L162 40 L176 248 Q100 262 24 248 Z" fill={`url(#bag${tone.slice(1)})`} />
    <path d="M34 18 L166 18 L162 44 L38 44 Z" fill="#8a5a30" />
    <path d="M40 30 L160 30" stroke="#6b4322" strokeWidth="3" strokeDasharray="6 5" />
    <rect x="52" y="96" width="96" height="104" rx="6" fill="#fbf4e6" />
    <text x="100" y="140" textAnchor="middle" fontFamily={SANS} fontWeight="800" fontSize="30" fill={BROWN}>{label}</text>
    <text x="100" y="172" textAnchor="middle" fontFamily={SANS} fontSize="15" fill="#7a5a44">{sub}</text>
    <circle cx="100" cy="74" r="7" fill="#6b4322" />
  </svg>
);
// 2026-11-17 第4轮：原片网页 / 卡片墙里是真产品照片 → 换成真照片（library/photos，Unsplash 免费授权）
const Ph: React.FC<{src: string; style?: React.CSSProperties}> = ({src, style}) => <Img src={staticFile(`library/photos/${src}.jpg`)} style={{position: 'absolute', objectFit: 'cover', display: 'block', ...style}} />;
const CHAT_LINES = ['用时 3 分 12 秒', '你的咖啡豆小店做好了：', '· 首页大图和本周新烘', '· 按产地筛选咖啡豆', '· 烘焙度标签', '· 购物车与结账', '· 每月订阅新豆', '· 门店地址与营业时间'];
const Site: React.FC<{t: number}> = ({t}) => {
  const sway = rp(t, 15.1, 15.7);
  const turn = Math.sin(sway * Math.PI);
  const pix = t < 14.94 ? 'url(#pix24)' : t < 14.99 ? 'url(#pix12)' : t < 15.09 ? 'url(#pix6)' : undefined;
  const tint = 1 - rp(t, 14.98, 15.14);
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: WW - CHAT, height: 1460, background: CREAM, fontFamily: SANS, color: BROWN}}>
      {/* 导航 */}
      <div style={{position: 'absolute', left: 28, top: 16, fontSize: 22, fontWeight: 800, letterSpacing: '0.02em'}}>慢焙 <span style={{fontSize: 13, fontWeight: 600, letterSpacing: '0.2em'}}>SLOW ROAST</span></div>
      <div style={{position: 'absolute', right: 28, top: 20, display: 'flex', gap: 26, fontSize: 15, color: '#5c4434'}}><span>咖啡豆</span><span>订阅</span><span>门店</span><span>关于</span><span>🛒</span></div>
      {/* 首屏 */}
      <div style={{position: 'absolute', left: 300, top: 70, fontSize: 250, fontWeight: 900, color: 'transparent', WebkitTextStroke: '2px rgba(43,26,18,0.35)', letterSpacing: '-0.02em', fontFamily: FONT.sans}}>BEANS</div>
      <div style={{position: 'absolute', left: 36, top: 120, fontSize: 56, fontWeight: 800, lineHeight: '70px', letterSpacing: '-0.02em'}}>一杯好咖啡，<br />从一颗豆子<br />开始。</div>
      <div style={{position: 'absolute', left: 38, top: 352, fontSize: 17, color: '#6b5242', lineHeight: '28px'}}>每周小批量烘焙，<br />七天内送到你手上。</div>
      <div style={{position: 'absolute', left: 40, top: 432, width: 104, height: 104, borderRadius: 52, background: BROWN, color: CREAM, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontSize: 16, fontWeight: 700, lineHeight: '22px'}}>选购<br />新豆 →</div>
      <div style={{position: 'absolute', left: 400, top: 96, width: 440, height: 450, filter: pix}}>
        <div style={{position: 'absolute', left: 0, top: 0, width: 440, height: 450, borderRadius: 18, overflow: 'hidden'}}>
          <Ph src="coffee/coffee00" style={{left: -20, top: -10, width: 480, height: 470, transform: `scale(${(1.04 + turn * 0.03).toFixed(4)}) rotate(${(turn * -1.5).toFixed(2)}deg)`}} />
        </div>
        <div style={{position: 'absolute', inset: 0, background: '#e4d35a', mixBlendMode: 'multiply', opacity: tint * 0.55}} />
      </div>
      <div style={{position: 'absolute', left: 36, top: 612, fontSize: 40, fontWeight: 800}}>本周新烘</div>
      <div style={{position: 'absolute', right: 36, top: 630, fontSize: 15, color: '#6b5242'}}>查看全部 →</div>
      {/* 新品卡片 */}
      {[['云南保山', '中烘 · ¥58', '#e9d3b5'], ['曼特宁', '深烘 · ¥62', '#d9e4cf'], ['哥伦比亚', '中烘 · ¥64', '#f0c9b5']].map(([a, b, c], i) => (
        <div key={a} style={{position: 'absolute', left: 36 + i * 290, top: 680, width: 270, height: 210, borderRadius: 12, background: c, overflow: 'hidden'}}>
          <Ph src={['coffee/coffee03', 'coffee/coffee01', 'coffee/coffee04'][i]} style={{left: 0, top: 0, width: 270, height: 160}} />
          <div style={{position: 'absolute', left: 16, bottom: 14, fontSize: 18, fontWeight: 700}}>{a}<span style={{fontSize: 14, fontWeight: 400, marginLeft: 10, color: '#6b5242'}}>{b}</span></div>
        </div>
      ))}
      {/* 深色区块 */}
      <div style={{position: 'absolute', left: 0, top: 930, width: WW - CHAT, height: 230, background: BROWN, color: CREAM}}>
        <div style={{position: 'absolute', left: 36, top: 50, fontSize: 62, fontWeight: 900, letterSpacing: '-0.02em'}}>小批量 · 每周烘焙</div>
        <div style={{position: 'absolute', left: 38, top: 140, fontSize: 17, color: '#cdb9a0'}}>每一批不超过 20 公斤，烘好的豆子 48 小时内寄出。</div>
        <Ph src="coffee/coffee05" style={{right: 0, top: 0, width: 420, height: 230}} />
        <div style={{position: 'absolute', right: 300, top: 0, width: 120, height: 230, background: `linear-gradient(90deg, ${BROWN}, rgba(0,0,0,0))`}} />
      </div>
      {/* 特性 */}
      {[['🌱', '产地直采'], ['🔥', '48 小时内烘焙'], ['📦', '顺丰到家']].map(([a, b], i) => (
        <div key={b} style={{position: 'absolute', left: 36 + i * 290, top: 1192, display: 'flex', alignItems: 'center', gap: 14, fontSize: 20, fontWeight: 600}}>
          <div style={{width: 54, height: 54, borderRadius: 27, background: '#e8d6bb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26}}>{a}</div>{b}
        </div>
      ))}
      <div style={{position: 'absolute', left: 30, top: 1262, fontSize: 170, fontWeight: 900, letterSpacing: '-0.03em', lineHeight: '190px'}}>慢焙</div>
      <div style={{position: 'absolute', right: 36, top: 1360, fontSize: 15, color: '#6b5242', textAlign: 'right', lineHeight: '26px'}}>门店地址（虚构）<br />每天 9:00–20:00</div>
    </div>
  );
};
const SCROLL: P = [[15.4, 0], [15.52, 0.012], [15.6, 0.04], [15.68, 0.1], [15.76, 0.22], [15.84, 0.39], [15.92, 0.54], [16.0, 0.65], [16.12, 0.77], [16.24, 0.85], [16.4, 0.93], [16.52, 0.975], [16.64, 1.0], [16.68, 0.997], [16.8, 0.965], [16.88, 0.905], [16.96, 0.8], [17.04, 0.6], [17.12, 0.43], [17.24, 0.27], [17.4, 0.13], [17.56, 0.05], [17.72, 0.012], [17.84, 0]];
const SMAX = 1460 - VIEW;
const PageScene: React.FC<{t: number}> = ({t}) => {
  const ry = trk(t, [[14.76, 14], [14.8, 9], [14.84, 5.5], [14.88, 3.5], [14.92, 2.3], [14.96, 1.4], [15.0, 0.8], [15.04, 0.35], [15.08, 0]]);
  const rz = -ry * 0.18;
  const s = trk(t, [[14.76, 1.32], [14.8, 1.17], [14.84, 1.09], [14.88, 1.05], [14.92, 1.03], [15.0, 1.01], [15.08, 1.0], [15.36, 1.0], [15.4, 1.004], [15.52, 1.06], [15.6, 1.1], [15.68, 1.155], [15.76, 1.2], [15.84, 1.225], [15.92, 1.25], [16.0, 1.27], [16.24, 1.31], [16.52, 1.355], [16.64, 1.365], [17.0, 1.4], [17.56, 1.375], [17.72, 1.355], [17.84, 1.3], [17.88, 1.26], [17.92, 1.2], [17.96, 1.06], [18.0, 0.95]]);
  const dx = trk(t, [[14.76, -60], [14.84, -20], [14.92, -6], [15.08, 0], [17.86, 0], [17.92, -60], [18.0, -240]]);
  const dy = trk(t, [[17.86, 0], [17.92, 15], [18.0, 70]]);
  const blur = Math.max(trk(t, [[14.76, 20], [14.8, 15], [14.84, 12.5], [14.88, 11], [14.92, 8], [14.96, 5], [15.0, 3], [15.04, 1.8], [15.08, 1.0], [15.12, 0.4], [15.16, 0]]), trk(t, [[17.84, 0], [17.88, 2.5], [17.92, 7], [17.96, 14], [18.0, 22]]));
  const sc = trk(t, SCROLL) * SMAX;
  const v = Math.abs(trk(t + 1 / 60, SCROLL) - trk(t - 1 / 60, SCROLL)) * SMAX * s;
  const vb = Math.min(8, v * 0.17);
  const chatN = CHAT_LINES.filter((_, i) => t >= 15.2 + i * 0.065).length;
  return (
    <AbsoluteFill>
      <Backdrop t={t} />
      <svg width="0" height="0" style={{position: 'absolute'}}>
        {[24, 12, 6].map((N) => (
          <filter key={N} id={`pix${N}`} x="0" y="0" width="1" height="1">
            <feFlood x={N / 2 - 1} y={N / 2 - 1} height="2" width="2" />
            <feComposite width={N} height={N} />
            <feTile result="a" />
            <feComposite in="SourceGraphic" in2="a" operator="in" />
            <feMorphology operator="dilate" radius={N / 2} />
          </filter>
        ))}
        <filter id="vblur" x="-5%" y="-20%" width="110%" height="140%"><feGaussianBlur stdDeviation={`0 ${vb.toFixed(2)}`} /></filter>
      </svg>
      <AbsoluteFill style={{filter: bl(blur)}}>
        <div style={{position: 'absolute', left: 0, top: 0, width: WW, height: WH, transformOrigin: '0 0',
          transform: `translate(${958 + dx}px, ${538 + dy}px) perspective(1700px) rotateY(${ry.toFixed(3)}deg) rotateZ(${rz.toFixed(3)}deg) scale(${s.toFixed(5)}) translate(${-WW / 2}px, ${-WH / 2}px)`}}>
          <div style={{position: 'absolute', inset: -6, borderRadius: 16, background: 'rgba(255,255,255,0.5)', boxShadow: '0 0 60px rgba(170,200,255,0.55), 0 40px 90px rgba(5,10,60,0.4)'}} />
          <div style={{position: 'absolute', inset: 0, borderRadius: 12, overflow: 'hidden', background: '#fff', fontFamily: SANS}}>
            {/* 工具栏 */}
            <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: BAR, background: '#f3f4f7', borderBottom: '1px solid #e3e4ea', display: 'flex', alignItems: 'center', padding: '0 16px', gap: 14, fontSize: 13, color: '#5c5f6c'}}>
              <b style={{fontStyle: 'italic', color: '#16151c'}}>随手站</b><span>慢焙咖啡豆小店</span>
              <span style={{marginLeft: 120, padding: '3px 12px', borderRadius: 12, background: '#dfe9fb', color: '#2f6fe0'}}>预览</span><span>代码</span>
              <span style={{marginLeft: 'auto'}}>分享</span><span style={{padding: '4px 14px', borderRadius: 8, background: '#2f7ff0', color: '#fff', fontWeight: 600}}>发布</span>
            </div>
            {/* 左侧聊天栏：不跟滚 */}
            <div style={{position: 'absolute', left: 0, top: BAR, width: CHAT, height: VIEW, background: '#fff', borderRight: '1px solid #ececf0', fontSize: 14, color: '#3a3d4a'}}>
              <div style={{position: 'absolute', right: 14, top: 16, maxWidth: 250, padding: '8px 12px', borderRadius: 14, background: '#eef0f4', fontSize: 13, lineHeight: '19px'}}>帮我做一个卖手工咖啡豆的小店网站</div>
              {CHAT_LINES.slice(0, chatN).map((l, i) => (
                <div key={i} style={{position: 'absolute', left: 18, top: 86 + i * 30 + (i > 1 ? 8 : 0), fontSize: i === 0 ? 12 : 14, color: i === 0 ? '#9a9cab' : '#3a3d4a', fontWeight: i === 1 ? 600 : 400, opacity: rp(t, 15.2 + i * 0.065, 15.28 + i * 0.065)}}>{l}</div>
              ))}
              <div style={{position: 'absolute', left: 12, right: 12, bottom: 12, height: 86, borderRadius: 14, border: '1px solid #e3e4ea', padding: 12, fontSize: 13, color: '#a2a4b0'}}>还想改点什么？</div>
            </div>
            {/* 主区：网站，往下滚再滚回 */}
            <div style={{position: 'absolute', left: CHAT, top: BAR, width: WW - CHAT, height: VIEW, overflow: 'hidden'}}>
              <div style={{position: 'absolute', left: 0, top: 0, width: WW - CHAT, height: 1460, transform: `translateY(${(-sc).toFixed(2)}px)`, filter: vb > 0.3 ? 'url(#vblur)' : undefined}}>
                <Site t={t} />
              </div>
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ═════════ B10 逐词字卡 ═════════
const WordsScene: React.FC<{t: number}> = ({t}) => {
  const blurIn = trk(t, [[18.0, 16], [18.04, 9], [18.1, 4], [18.16, 1], [18.22, 0]]);
  const blurOut = trk(t, [[19.38, 0], [19.44, 2.5], [19.5, 5], [19.56, 9], [19.62, 14], [19.68, 20]]);
  const s = mix(1, 1.04, clamp((t - 18.0) / 1.5)) - 0.02 * rp(t, 19.4, 19.68);
  const hold = 0.35 * (1 - rp(t, 18.6, 19.4));
  return (
    <AbsoluteFill>
      <Backdrop t={t} />
      <AbsoluteFill style={{transform: `scale(${s.toFixed(4)})`, filter: bl(Math.max(blurIn, blurOut))}}>
        <WordLine t={t} size={96} cy={492} words={[{t: '新点子', at: 17.98, hl: 'pop', hlAt: 18.2}, {t: '和', at: 18.04}, {t: '旧想法', at: 18.14, hl: 'wipe', hlAt: 18.34}]} />
        <WordLine t={t} size={96} cy={612} cyanHold={hold} words={[{t: '都值得', at: 18.24}, {t: '做出来', at: 18.32}]} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ═════════ B11–B15 卡片墙 ═════════
const CW = 480, CH = 282;
const COLS = [307, 960, 1613], ROWS = [151, 508, 875];
const Frame: React.FC<{bg: string; children?: React.ReactNode}> = ({bg, children}) => (
  <div style={{position: 'absolute', inset: 0, background: bg, overflow: 'hidden', fontFamily: SANS}}>{children}</div>
);
const CardLedger = () => (
  <Frame bg="#f4f5f8">
    <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 70, background: '#eceef3'}} />
    <div style={{position: 'absolute', left: 90, top: 22, fontSize: 15, color: '#6b6e7c'}}>本月支出</div>
    <div style={{position: 'absolute', left: 90, top: 42, fontSize: 34, fontWeight: 800, color: '#22242e'}}>¥ 3,420</div>
    <svg width="250" height="120" style={{position: 'absolute', left: 86, top: 120}}><polyline points="0,100 30,90 60,95 90,70 120,76 150,50 180,58 210,30 245,20" fill="none" stroke="#5b8cf0" strokeWidth="3" /><polyline points="0,100 30,90 60,95 90,70 120,76 150,50 180,58 210,30 245,20 245,120 0,120" fill="rgba(91,140,240,0.12)" /></svg>
    <div style={{position: 'absolute', right: 40, top: 60, width: 110, height: 110, borderRadius: '50%', background: 'conic-gradient(#5b8cf0 0 42%, #f2b04a 42% 66%, #4fc49a 66% 84%, #e86a8a 84% 100%)'}}><div style={{position: 'absolute', inset: 24, borderRadius: '50%', background: '#f4f5f8'}} /></div>
    {[0, 1, 2].map((i) => <div key={i} style={{position: 'absolute', right: 30, top: 200 + i * 22, width: 130, height: 10, borderRadius: 5, background: '#e2e4ea'}} />)}
  </Frame>
);
const CardFlower = () => (
  <Frame bg="#fbf7f2">
    <div style={{position: 'absolute', left: 0, right: 0, top: 18, textAlign: 'center', fontSize: 13, letterSpacing: '0.3em', color: '#7d7468'}}>花间 FLORA</div>
    <div style={{position: 'absolute', left: 0, right: 0, top: 40, textAlign: 'center', fontSize: 24, fontFamily: SERIF, color: '#3b332b'}}>带一束花回家</div>
    {['desk/desk03', 'desk/desk02', 'desk/desk04', 'desk/desk00'].map((ph, i) => <Ph key={ph} src={ph} style={{left: 22 + i * 112, top: 90, width: 100, height: 170, borderRadius: 6}} />)}
    {[].map((c, i) => (
      <svg key={i} width="100" height="170" style={{position: 'absolute', left: 22 + i * 112, top: 90}}>
        <path d="M50 60 L50 120" stroke="#5f8f4e" strokeWidth="4" /><ellipse cx="38" cy="100" rx="12" ry="6" fill="#7aa866" transform="rotate(-30 38 100)" />
        {[0, 72, 144, 216, 288].map((a) => <ellipse key={a} cx="50" cy="40" rx="11" ry="22" fill={c} transform={`rotate(${a + i * 9} 50 52)`} />)}<circle cx="50" cy="52" r="9" fill="#f7e3a1" />
        <path d="M26 120 L74 120 L68 166 L32 166 Z" fill={['#e9ded0', '#d8c7b4', '#efe6dc', '#cfbfae'][i]} />
      </svg>
    ))}
  </Frame>
);
const CardVinyl = () => (
  <Frame bg="#1b1030">
    <Ph src="concert/concert01" style={{left: 0, top: 0, width: '100%', height: '100%', opacity: 0.85}} />
    <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(27,16,48,0.85), rgba(27,16,48,0.2))'}} />
    <div style={{position: 'absolute', left: 24, top: 28, fontSize: 30, fontWeight: 900, color: '#fff', lineHeight: '38px'}}>找到你的<br /><span style={{color: '#c6ff3d'}}>下一张唱片</span></div>
    {[0, 1, 2].map((i) => (
      <div key={i} style={{position: 'absolute', left: 30 + i * 145, top: 140, width: 120, height: 120, borderRadius: 8, background: ['#c6ff3d', '#2b1650', '#f2f2f2'][i], display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{width: 86, height: 86, borderRadius: '50%', background: 'repeating-radial-gradient(#111 0 3px, #222 3px 5px)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><div style={{width: 26, height: 26, borderRadius: '50%', background: ['#ff5fa2', '#c6ff3d', '#7a3cff'][i]}} /></div>
      </div>
    ))}
  </Frame>
);
const CardStars = () => (
  <Frame bg="radial-gradient(ellipse at 70% 40%, #1b2350 0%, #070a1e 70%)">
    {Array.from({length: 40}, (_, i) => <div key={i} style={{position: 'absolute', left: (i * 97) % 480, top: (i * 53) % 282, width: 2, height: 2, borderRadius: 1, background: '#fff', opacity: 0.4 + (i % 3) * 0.2}} />)}
    <div style={{position: 'absolute', left: 250, top: 40, width: 190, height: 190, borderRadius: '50%', background: 'radial-gradient(circle at 35% 30%, #f1dcc0 0%, #b8916a 55%, #4d3626 100%)'}} />
    <div style={{position: 'absolute', left: 190, top: 118, width: 310, height: 44, borderRadius: '50%', border: '6px solid rgba(230,205,170,0.75)', transform: 'rotate(-14deg)'}} />
    <div style={{position: 'absolute', left: 24, top: 70, fontSize: 26, color: '#fff', fontWeight: 700, lineHeight: '36px'}}>去更远的地方<br />看星星</div>
    <div style={{position: 'absolute', left: 24, top: 160, padding: '6px 16px', borderRadius: 14, background: '#f07a3a', color: '#fff', fontSize: 14}}>预约营位</div>
  </Frame>
);
const CardPhoto = () => (
  <Frame bg="linear-gradient(180deg, #9fe0ee 0%, #5cc0d8 45%, #1d7fa6 70%, #0f5a7e 100%)">
    <Ph src="travel/travel11" style={{left: 0, top: 0, width: '100%', height: '100%'}} />
    <div style={{position: 'absolute', left: 0, right: 0, top: 150, height: 50, background: 'linear-gradient(180deg, rgba(255,255,255,0.35), rgba(255,255,255,0))'}} />
    <div style={{position: 'absolute', left: 26, top: 46, fontSize: 34, fontFamily: SERIF, color: '#fff', lineHeight: '44px'}}>把光<br />留下来</div>
    {['travel/travel00', 'travel/travel13', 'travel/travel07', 'travel/travel04'].map((ph, i) => <Ph key={ph} src={ph} style={{left: 26 + i * 112, top: 214, width: 100, height: 52, borderRadius: 6, border: '2px solid #fff'}} />)}
  </Frame>
);
const CardGym = () => (
  <Frame bg="#d7f24a">
    <div style={{position: 'absolute', right: -20, top: -40, fontSize: 330, fontWeight: 900, color: 'transparent', WebkitTextStroke: '3px #1a1a1a', lineHeight: '340px'}}>燃</div>
    <div style={{position: 'absolute', left: 24, top: 30, fontSize: 40, fontWeight: 900, color: '#111', lineHeight: '46px'}}>今天<br />动起来</div>
    <svg width="220" height="80" style={{position: 'absolute', left: 30, top: 170}}><rect x="20" y="34" width="180" height="12" rx="6" fill="#222" /><rect x="10" y="10" width="22" height="60" rx="5" fill="#222" /><rect x="188" y="10" width="22" height="60" rx="5" fill="#222" /><rect x="34" y="18" width="14" height="44" rx="4" fill="#444" /><rect x="172" y="18" width="14" height="44" rx="4" fill="#444" /></svg>
  </Frame>
);
const CardBakery = () => (
  <Frame bg="#fff6ea">
    <div style={{position: 'absolute', left: 22, top: 14, fontSize: 11, letterSpacing: '0.25em', color: '#7a5a44'}}>晨光面包房</div>
    <div style={{position: 'absolute', left: 22, top: 40, fontSize: 30, fontFamily: SERIF, fontWeight: 700, color: '#3a2416', lineHeight: '40px'}}>早安，<br />面包刚出炉</div>
    <div style={{position: 'absolute', left: 190, top: 40, width: 56, height: 56, borderRadius: '50%', background: '#f07a3a', color: '#fff', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}>每日<br />现烤</div>
    <Ph src="food/food13" style={{left: 260, top: 0, width: 220, height: 200}} />
    <svg width="230" height="190" style={{position: 'absolute', left: 250, top: 20, display: 'none'}}>
      <ellipse cx="110" cy="120" rx="90" ry="42" fill="#c97b36" /><ellipse cx="110" cy="112" rx="84" ry="34" fill="#dc9648" />
      {[60, 95, 130, 165].map((x) => <path key={x} d={`M${x - 12} 98 Q ${x} 118 ${x + 10} 100`} stroke="#a85d22" strokeWidth="5" fill="none" />)}
      <circle cx="40" cy="60" r="22" fill="#e2a85a" /><circle cx="190" cy="50" r="18" fill="#d48f45" />
    </svg>
    {[0, 1, 2].map((i) => <div key={i} style={{position: 'absolute', left: 22 + i * 150, top: 212, width: 136, height: 52, borderRadius: 8, background: '#f4e6d2'}}><div style={{margin: 10, width: 32, height: 32, borderRadius: 8, background: ['#dc9648', '#b9844f', '#e2c27a'][i]}} /></div>)}
  </Frame>
);
const CardBooks = () => (
  <Frame bg="#efe6d6">
    <div style={{position: 'absolute', left: 24, top: 26, fontSize: 28, fontFamily: SERIF, color: '#2f2a24', fontWeight: 700}}>慢慢读书店</div>
    <div style={{position: 'absolute', left: 24, top: 70, fontSize: 14, color: '#6f6656'}}>每周三晚 · 读书会</div>
    {Array.from({length: 11}, (_, i) => <div key={i} style={{position: 'absolute', left: 30 + i * 38, bottom: 0, width: 32, height: 110 + ((i * 37) % 60), background: ['#c4543c', '#2f4a6a', '#e0b44c', '#6b8a5c', '#8c5a8c', '#d9cdb8', '#3a3a3a'][i % 7], borderRadius: '3px 3px 0 0'}} />)}
  </Frame>
);

// 中心卡：野营社 → 黄 / 深蓝 / 红 斜边擦除 → 音乐节海报（拼贴一直在长）
const COLLAGE: {at: number; el: React.ReactNode}[] = [
  {at: 20.8, el: <div style={{position: 'absolute', left: 340, top: 30, width: 96, height: 96, borderRadius: '50%', background: '#f6d63a'}} />},
  {at: 20.84, el: <div style={{position: 'absolute', left: 270, top: 70, width: 70, height: 130, background: 'repeating-linear-gradient(90deg, #111 0 8px, #f4f0e6 8px 16px)'}} />},
  {at: 20.88, el: <div style={{position: 'absolute', left: 300, top: 110, width: 80, height: 130, borderRadius: '40px 40px 0 0', background: '#1c3cd8'}} />},
  {at: 20.92, el: <svg width="120" height="100" style={{position: 'absolute', left: 250, top: 170}}><path d="M0 100 L0 80 L24 80 L24 60 L48 60 L48 40 L72 40 L72 20 L96 20 L96 0 L120 0 L120 100 Z" fill="#f6d63a" /></svg>},
  {at: 20.96, el: <div style={{position: 'absolute', left: 390, top: 140, width: 60, height: 60, background: '#efebdf', transform: 'rotate(12deg)'}} />},
  {at: 21.0, el: <div style={{position: 'absolute', left: 360, top: 210, width: 0, height: 0, borderLeft: '36px solid transparent', borderRight: '36px solid transparent', borderBottom: '60px solid #111'}} />},
  {at: 21.04, el: <div style={{position: 'absolute', left: 230, top: 30, fontSize: 30, fontWeight: 900, color: '#1c3cd8', fontStyle: 'italic'}}>~</div>},
  {at: 21.08, el: <div style={{position: 'absolute', left: 420, top: 70, width: 40, height: 120, border: '5px solid #efebdf'}} />},
  {at: 21.12, el: <div style={{position: 'absolute', left: 316, top: 150, width: 46, height: 90, borderRadius: '23px 23px 0 0', background: '#d21b22', border: '4px solid #efebdf'}} />},
  {at: 21.16, el: <div style={{position: 'absolute', left: 430, top: 20, padding: '2px 8px', background: '#111', color: '#f6d63a', fontSize: 14, fontWeight: 800}}>LIVE</div>},
  {at: 21.2, el: <div style={{position: 'absolute', left: 392, top: 238, padding: '2px 8px', background: '#f6d63a', color: '#111', fontSize: 14, fontWeight: 800, transform: 'rotate(-8deg)'}}>6.13</div>},
  {at: 21.24, el: <div style={{position: 'absolute', left: 445, top: 200, color: '#f6d63a', fontSize: 28}}>★</div>},
  {at: 21.3, el: <div style={{position: 'absolute', left: 255, top: 0, width: 60, height: 40, background: '#1c3cd8', transform: 'skewX(-15deg)'}} />},
  {at: 21.36, el: <div style={{position: 'absolute', left: 210, top: 120, width: 30, height: 30, borderRadius: '50%', border: '4px solid #111'}} />},
];
const CenterCard: React.FC<{t: number}> = ({t}) => {
  const slide = t < 20.28 ? 0 : (eo(t, 20.28, 20.38) * 320);
  const wipe = (a: number) => trk(t, [[a, -12], [a + 0.06, 48], [a + 0.1, 86], [a + 0.14, 116]]);
  const layer = (a: number, c: string) => {
    if (t < a) return null;
    const e = wipe(a);
    return <div style={{position: 'absolute', inset: 0, background: c, clipPath: `polygon(0 0, ${(e + 7).toFixed(1)}% 0, ${e.toFixed(1)}% 100%, 0 100%)`}} />;
  };
  const scrollUp = eo(t, 21.86, 22.0) * 34;
  return (
    <Frame bg="#efebdf">
      <div style={{position: 'absolute', inset: 0, transform: `translateX(${slide.toFixed(1)}px)`}}>
        <div style={{position: 'absolute', left: 20, top: 14, fontSize: 12, color: '#55534c', letterSpacing: '0.2em'}}>野营社 · 周末出发</div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 86, display: 'flex', justifyContent: 'center', fontSize: 92, fontWeight: 900, color: '#1a1a1a', letterSpacing: '0.02em'}}>
          {Array.from('野营社').map((c, i) => <span key={i} style={{display: 'inline-block', transform: `translateY(${(trk(t, [[19.68, 0], [19.74, -24 + i * 22], [19.82, 18 - i * 10], [19.9, 0]]) * (t < 19.95 ? 1 : 0)).toFixed(1)}px)`}}>{c}</span>)}
        </div>
      </div>
      {layer(20.3, '#e0cf28')}
      {layer(20.4, '#0d1f9f')}
      {layer(20.48, '#d21b22')}
      {t >= 20.5 && (
        <div style={{position: 'absolute', inset: 0, transform: `translateY(${(-scrollUp).toFixed(1)}px)`}}>
          {t >= 21.42 && <div style={{position: 'absolute', left: 14, right: 14, top: 10, display: 'flex', alignItems: 'center', gap: 16, fontSize: 11, color: '#efebdf', opacity: rp(t, 21.42, 21.5)}}><b style={{fontSize: 13}}>野营社</b><span>阵容</span><span>门票</span><span>场地</span><span style={{marginLeft: 'auto', padding: '2px 8px', background: '#f6d63a', color: '#111', borderRadius: 8}}>购票</span></div>}
          <div style={{position: 'absolute', left: 20, top: 32, fontSize: 70, fontWeight: 900, color: '#0d1f9f', lineHeight: '74px', transform: `scale(${mix(0.6, 1, eo(t, 20.52, 20.58)).toFixed(3)})`, transformOrigin: '0 50%', opacity: rp(t, 20.52, 20.55)}}>今晚</div>
          {t >= 20.64 && <div style={{position: 'absolute', left: 26, top: 112, padding: '0 10px', background: '#efebdf', fontSize: 56, fontWeight: 900, color: '#111', lineHeight: '66px', transform: `perspective(400px) rotateX(${((1 - eo(t, 20.64, 20.72)) * 85).toFixed(1)}deg) rotate(-3deg)`, transformOrigin: '50% 0%'}}>一起</div>}
          <div style={{position: 'absolute', left: 20, top: 180, height: 80, overflow: 'hidden'}}>
            <div style={{fontSize: 62, fontWeight: 900, color: '#0d1f9f', lineHeight: '78px', transform: `translateY(${((1 - eo(t, 20.72, 20.8)) * 80).toFixed(1)}px)`}}>大声唱</div>
          </div>
          {COLLAGE.map((c, i) => { if (t < c.at) return null; const p = eo(t, c.at, c.at + 0.08); return <div key={i} style={{position: 'absolute', inset: 0, transform: `scale(${mix(0.5, 1, p).toFixed(3)})`, transformOrigin: '75% 50%', opacity: clamp(p * 2)}}>{c.el}</div>; })}
          {['6.12 周五', '6.13 周六', '6.14 周日'].map((d, i) => (
            <div key={d} style={{position: 'absolute', left: 14 + i * 152, top: 270, width: 144, height: 44, background: '#efebdf', borderRadius: 4, display: 'flex', alignItems: 'center', gap: 8, padding: '0 8px', fontSize: 14, fontWeight: 700, color: '#111', opacity: rp(t, 21.92 + i * 0.05, 21.98 + i * 0.05)}}>
              <div style={{width: 28, height: 28, background: ['#f6d63a', '#1c3cd8', '#d21b22'][i]}} />{d}
            </div>
          ))}
        </div>
      )}
    </Frame>
  );
};

type Slot = {id: string; c: number; r: number; comp: React.FC; from: [number, number, number, number]};
// from: [起始时间, 起始偏移 x, 起始偏移 y, 时长]
const SLOTS: Slot[] = [
  {id: 'TL', c: 0, r: 0, comp: CardLedger, from: [19.96, -190, -110, 0.32]},
  {id: 'TC', c: 1, r: 0, comp: CardFlower, from: [20.32, 0, -440, 0.1]},
  {id: 'ML', c: 0, r: 1, comp: CardStars, from: [19.7, -40, -30, 0.26]},
  {id: 'MR', c: 2, r: 1, comp: CardPhoto, from: [20.52, 580, 0, 0.1]},
  {id: 'BL', c: 0, r: 2, comp: CardGym, from: [20.44, -460, 320, 0.1]},
  {id: 'BC', c: 1, r: 2, comp: CardBakery, from: [19.72, 0, 40, 0.24]},
  {id: 'BR', c: 2, r: 2, comp: CardBooks, from: [20.72, 230, 140, 0.1]},
];
const WallScene: React.FC<{t: number}> = ({t}) => {
  const s = trk(t, [[19.68, 1.46], [19.72, 1.3], [19.76, 1.18], [19.8, 1.1], [19.84, 1.055], [19.88, 1.03], [19.92, 1.018], [20.28, 1.0], [20.84, 0.985], [20.88, 1.15], [20.92, 1.27], [20.96, 1.34], [21.0, 1.38], [21.2, 1.42], [22.2, 1.445], [22.48, 1.45]]);
  const camX = trk(t, [[19.68, 0], [20.84, 8], [21.2, 0], [22.48, 0]]);
  const camY = trk(t, [[19.68, -20], [19.92, 0], [20.84, 6], [21.2, 0], [22.48, 14]]);
  const ax = 960, ay = mix(540, 508, rp(t, 20.82, 20.9));
  const entryBlur = trk(t, [[19.68, 20], [19.72, 18], [19.76, 15], [19.8, 12], [19.84, 7], [19.88, 4], [19.92, 1.5], [19.98, 0]]);
  const exitBlur = trk(t, [[22.3, 0], [22.34, 2.5], [22.38, 3.5], [22.42, 8], [22.46, 14], [22.49, 18]]);
  const dof = rp(t, 20.84, 21.02) * 8;
  const dark = rp(t, 20.86, 21.02);
  const mapW = (x: number, y: number): [number, number] => [ax + (x - ax) * s + camX, ay + (y - ay) * s + camY];
  // 中心卡自己从上面落下来 + 顺时针歪一下
  const cdy = trk(t, [[19.68, -330], [19.76, -312], [19.8, -290], [19.84, -110], [19.88, -30], [19.92, 0]]);
  const crot = trk(t, [[19.68, 2], [19.76, 5], [19.84, 3], [19.88, 0.8], [19.92, 0]]);
  const ctilt = trk(t, [[20.84, 0], [20.88, 5], [20.96, 1.5], [21.04, 0]]);
  const sel = rp(t, 20.9, 20.96);
  // 紫色唱片卡：先在右中，20.20 往上滑到右上
  const vinylY = mix(ROWS[1], ROWS[0], eo(t, 20.2, 20.3));
  const card = (key: string, cx: number, cy: number, el: React.ReactNode, opts: {rot?: number; blur?: number; dim?: number} = {}) => (
    <div key={key} style={{position: 'absolute', left: cx - CW / 2, top: cy - CH / 2, width: CW, height: CH, borderRadius: 8, overflow: 'hidden', boxShadow: '0 18px 40px rgba(5,10,60,0.35)',
      transform: opts.rot ? `rotate(${opts.rot.toFixed(2)}deg)` : undefined, filter: [bl(opts.blur ?? 0), opts.dim ? `brightness(${(1 - opts.dim * 0.18).toFixed(3)}) saturate(${(1 - opts.dim * 0.15).toFixed(3)})` : ''].filter(Boolean).join(' ') || undefined}}>
      {el}
      {opts.dim ? <div style={{position: 'absolute', inset: 0, background: 'rgba(40,60,150,1)', opacity: opts.dim * 0.16}} /> : null}
    </div>
  );
  const subW = CW * mix(0.7, 0.95, eo(t, 20.84, 20.9));
  const st = {hover: rp(t, 21.54, 21.58), deep: rp(t, 21.58, 21.62), press: rp(t, 21.62, 21.66), done: t >= 21.68};
  const narrow = t < 21.66 ? 1 : t < 21.86 ? 0.86 : mix(0.86, 1, eo(t, 21.86, 21.94));
  const fill = trk(t, [[21.68, 0], [21.72, 50], [21.76, 62], [21.84, 82], [21.88, 100]]);
  const subBg = st.press > 0 ? mixc('#a9c4f5', '#5b8ff0', st.press) : st.deep > 0 ? mixc('#c4d6f8', '#a9c4f5', st.deep) : mixc('#fdfdfd', '#c4d6f8', st.hover);
  const subY = ROWS[1] + CH / 2 + 26;
  const mouse = (tt: number): [number, number] => {
    const [bx, by] = mapW(960 + 40, subY + 40);
    const ex = trk(tt, [[21.4, 24], [21.44, 8], [21.48, 0], [22.08, 0], [22.28, 4], [22.32, 10], [22.4, 30]]);
    const ey = trk(tt, [[21.4, 260], [21.44, 110], [21.48, 20], [21.52, 0], [22.08, 0], [22.28, 18], [22.32, 120], [22.4, 380]]);
    return [bx + ex, by + ey];
  };
  return (
    <AbsoluteFill>
      <Backdrop t={t} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 60% 55% at 50% 48%, rgba(144,206,243,0.85) 0%, rgba(90,180,240,0.4) 40%, rgba(144,206,243,0) 75%)'}} />
      <AbsoluteFill style={{filter: bl(Math.max(entryBlur, exitBlur))}}>
        <div style={{position: 'absolute', left: 0, top: 0, width: W, height: H, transformOrigin: '0 0', transform: `translate(${camX}px, ${camY}px) translate(${ax}px, ${ay}px) scale(${s.toFixed(5)}) translate(${-ax}px, ${-ay}px)`}}>
          {SLOTS.map((sl) => {
            const [a, fx, fy, d] = sl.from;
            const p = eo(t, a, a + d);
            if (t < 19.68 && a > 19.7) return null;
            const show = sl.id === 'TL' || sl.id === 'ML' || sl.id === 'BC' || sl.id === 'BR' || t >= a - 0.01;
            if (!show) return null;
            const C = sl.comp;
            return card(sl.id, COLS[sl.c] + fx * (1 - p), ROWS[sl.r] + fy * (1 - p), <C />, {blur: dof, dim: dark});
          })}
          {card('TR', COLS[2], vinylY, <CardVinyl />, {blur: dof, dim: dark})}
          <div style={{position: 'absolute', left: COLS[1] - CW / 2, top: ROWS[1] + cdy - CH / 2, width: CW, height: CH, transform: `rotate(${crot.toFixed(2)}deg) perspective(900px) rotateX(${(ctilt * 0.6).toFixed(2)}deg) rotateY(${(-ctilt).toFixed(2)}deg)`}}>
            <div style={{position: 'absolute', inset: 0, borderRadius: 8, overflow: 'hidden', boxShadow: `0 20px 50px rgba(5,10,60,0.4), 0 0 0 ${(3 * sel).toFixed(1)}px rgba(170,210,255,${sel.toFixed(2)}), 0 0 ${(26 * sel).toFixed(0)}px rgba(140,200,255,${(0.7 * sel).toFixed(2)})`}}>
              <CenterCard t={t} />
            </div>
          </div>
          {t >= 20.84 && (
            <div style={{position: 'absolute', left: COLS[1] - subW * narrow / 2, top: subY, width: subW * narrow, height: 48, borderRadius: 24, background: subBg, overflow: 'hidden', opacity: rp(t, 20.84, 20.88), boxShadow: '0 8px 22px rgba(5,10,60,0.3)', fontFamily: SANS}}>
              {st.done && <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(90deg, #3861df, #3861df)', clipPath: `inset(0 ${(100 - fill).toFixed(1)}% 0 0)`}} />}
              <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 600, color: st.done ? '#fff' : '#2f6fe0', opacity: st.done ? 1 : 1 - st.press * 0.6}}>{st.done ? '已提交' : '提交'}</div>
            </div>
          )}
        </div>
        <Vignette strength={0.45} color="#04062a" inner={0.5} />
        {t >= 21.38 && <Mouse pos={mouse} t={t} />}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ═════════ B16–B20 Logo 收尾 ═════════
const Mark: React.FC<{size: number; star: number}> = ({size, star}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{display: 'block', overflow: 'visible'}}>
    <circle cx="50" cy="50" r="47" fill="#fdfdff" />
    <circle cx="50" cy="50" r="36" fill="none" stroke={INK} strokeWidth="8" />
    <g transform={`translate(50 50) scale(${star.toFixed(3)})`}><path d="M0 -22 C3 -6 6 -3 22 0 C6 3 3 6 0 22 C-3 6 -6 3 -22 0 C-6 -3 -3 -6 0 -22 Z" fill={ACCENT} /></g>
  </svg>
);
const NAME = Array.from('逐梦的剪辑 skills');
const LogoScene: React.FC<{t: number}> = ({t}) => {
  const cy = trk(t, [[22.48, 49.6], [22.88, 49.4], [22.92, 48.2], [23.0, 46.2], [23.04, 44.4], [23.08, 41.2], [23.12, 37.9], [23.16, 36.0], [23.2, 35.0], [23.24, 34.0], [23.32, 33.0], [23.4, 32.6], [25.0, 31.4], [25.4, 33.8], [25.44, 34.2], [25.52, 35.2], [25.6, 37.4], [25.68, 40.6], [25.76, 44.2], [25.84, 47.3], [26.0, 49.0], [26.2, 49.8], [26.6, 50.2], [27.67, 50.4]]) / 100 * H;
  const gBlur = Math.max(trk(t, [[22.48, 2], [22.84, 1], [22.92, 0]]), trk(t, [[25.56, 0], [25.6, 2.5], [25.64, 6], [25.68, 9], [25.76, 11], [25.84, 10], [26.0, 5.5], [26.12, 2], [26.24, 0]]));
  const sc = (t < 25.6 ? 1 + 0.012 * clamp((t - 23.3) / 2.3) : 1) * trk(t, [[25.6, 1.012], [25.84, 0.97], [26.2, 0.98], [26.4, 1.0], [26.6, 1.05], [26.68, 1.18], [26.76, 1.34], [26.84, 1.44], [27.0, 1.52], [27.2, 1.57], [27.67, 1.62]]);
  const sink = trk(t, [[25.0, 0], [25.4, 19], [25.7, 40]]);
  const drift = Math.sin(t * 0.8) * 6 + (t - 23.4) * 5;
  const FS = 54, MS = 70;
  const widths = NAME.map((c) => (c === ' ' ? FS * 0.3 : /[a-z]/.test(c) ? FS * (c === 'i' || c === 'l' ? 0.3 : c === 'k' ? 0.56 : 0.54) : FS));
  const total = MS + 18 + widths.reduce((a, b) => a + b, 0);
  const x0 = 960 - total / 2 - 24;
  const charT = (i: number) => 22.48 + (i + 1) / 30;
  const tagOp = 1 - rp(t, 25.58, 25.7);
  const capT = 1 - rp(t, 25.48, 25.57);
  return (
    <AbsoluteFill>
      <Backdrop t={t} />
      {/* Logo：左对齐往右长 */}
      <div style={{position: 'absolute', left: 0, top: 0, width: W, height: H, filter: bl(gBlur), transform: `translate(960px, ${cy.toFixed(2)}px) scale(${sc.toFixed(4)}) translate(-960px, 0px)`, transformOrigin: '0 0'}}>
        <div style={{position: 'absolute', left: x0 + drift, top: -MS / 2, height: MS, display: 'flex', alignItems: 'center', gap: 18, filter: 'drop-shadow(0 0 14px rgba(200,225,255,0.45))'}}>
          <div style={{filter: bl((1 - rp(t, 22.48, 22.6)) * 6)}}><Mark size={MS} star={mix(0.7, 1, eo(t, 22.5, 22.7))} /></div>
          <div style={{display: 'flex', alignItems: 'center', fontFamily: SANS, fontSize: FS, fontWeight: 800, color: '#fff', whiteSpace: 'pre', lineHeight: 1}}>
            {NAME.map((c, i) => t < charT(i) ? null : <span key={i} style={{display: 'inline-block', width: widths[i], filter: bl((1 - rp(t, charT(i), charT(i) + 0.1)) * 6), fontWeight: /[a-z]/.test(c) ? 700 : 800}}>{c}</span>)}
          </div>
        </div>
      </div>
      {/* 标语：逐词阶梯浮出，玻璃字 */}
      {tagOp > 0.01 && t >= 23.06 && (
        <div style={{position: 'absolute', inset: 0, transform: `translateY(${(sink - (Math.min(t, 25.0) - 23.4) * 6 + (25.56 < t ? (t - 25.56) * 300 : 0)).toFixed(1)}px)`, opacity: tagOp, filter: bl(trk(t, [[25.54, 0], [25.6, 6], [25.66, 12]]))}}>
          <WordLine t={t} size={100} cy={0.455 * H} glass gap={0.12} words={[{t: '一句话，', at: 23.08}, {t: '做出', at: 23.15}, {t: '你的作品', at: 23.2}]} />
        </div>
      )}
      {capT > 0.01 && t >= 23.3 && (
        <div style={{position: 'absolute', left: 960 - 180, top: 0.775 * H - 32 + sink, width: 360, height: 64, borderRadius: 18, opacity: capT, fontFamily: SANS}}>
          <div style={{position: 'absolute', inset: 0, borderRadius: 18, background: 'rgba(150,188,244,0.78)', opacity: rp(t, 23.38, 23.44)}} />
          <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 34, color: '#fff', opacity: rp(t, 23.3, 23.36)}}>今天就开始</div>
        </div>
      )}
    </AbsoluteFill>
  );
};

export const PromptToSiteWall: React.FC = () => {
  const f = useCurrentFrame();
  const t = 10.5 + f / 30;
  const bar = trk(t, [[21.58, 0], [21.6, 4], [21.64, 13], [21.68, 45], [21.72, 77], [21.76, 85], [21.84, 89], [21.88, 93], [22.08, 98], [22.84, 98], [22.92, 92], [23.0, 77], [23.04, 66], [23.08, 45], [23.12, 21], [23.16, 11], [23.2, 4], [23.24, 0]]);
  let scene: React.ReactNode;
  if (t < 10.88) scene = <Card1 t={t} />;
  else if (t < 14.76) scene = <InputScene t={t} />;
  else if (t < 18.0) scene = <PageScene t={t} />;
  else if (t < 19.68) scene = <WordsScene t={t} />;
  else if (t < 22.48) scene = <WallScene t={t} />;
  else scene = <LogoScene t={t} />;
  return (
    <AbsoluteFill style={{background: '#0a0660', overflow: 'hidden'}}>
      {scene}
      {bar > 0.3 && (<>
        <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: bar, background: '#000'}} />
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: bar, background: '#000'}} />
      </>)}
      <Vignette strength={0.18} color="#04052a" inner={0.55} />
      {/* 网页和卡片墙里的店名 / 网站都是编的，角落标注（和第2轮的 urlNote 一个做法） */}
      {t >= 14.76 && t < 22.48 && <div style={{position: 'absolute', right: 34, bottom: 26 + bar, fontFamily: SANS, fontSize: 20, color: 'rgba(255,255,255,0.72)', letterSpacing: '0.04em', textShadow: '0 1px 4px rgba(0,0,0,0.4)'}}>店铺与网站均为虚构 · 仅作演示</div>}
      <Grain opacity={0.045} blend="soft-light" />
    </AbsoluteFill>
  );
};
