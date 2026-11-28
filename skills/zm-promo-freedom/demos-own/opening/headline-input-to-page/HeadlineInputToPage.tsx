// 巨字横摇后拉揭出整句 → 标题变玻璃字上移 → 玻璃长条升起、身后撑开面板 → 网页分层长满 → 网页缩小上移、失焦出（007 A 段 0–4.0s）
// 学的动作（来自 @bohdanmotion × Bolt 开场，25fps 逐帧看过）：
//   第 1 帧就在全速横摇（一帧走约 25% 画面宽），然后两段后拉（中间变慢不停），每段后拉开头新词从右边进来：先偏青、发虚、和前词空隙偏大，再变白收拢；
//   整句停 0.3s → 放大约 1.3 倍、实心发光字变玻璃字；背景翻深紫蓝 + 网点冲击波外扫 + 玻璃长条从底部升起（三件事同时）；
//   标题猛地上移到顶，面板在长条身后很虚地冒出来、上沿往上推；颜色三段：淡粉紫玻璃 → 饱和亮蓝 → 网页；长条 0.2s 变成白色输入框；
//   网页 0.04s 一个元素长满（标题两行、图标逐个浮起、副标题从左往右擦出）；之后整页慢慢缩小上移、标题反向下沉被越压越多；
//   最后 4 帧加速上移 + 模糊爬坡，镜头在最虚处结束（下一镜硬切）。
// 我们的内容：开场大字"致每一个 / 想把点子 / 做出来的人"；网页是虚构的"一句话建站"工具"随手站"首页（不放我们的 Logo）
//
// 时间表（30fps，共 120f；按原片秒直接换算，t = f/30，所有轨道用原片测量点做单调三次样条）
//   0–31    巨字横摇（0–12f）+ 第一段后拉（12–20f）+ 第二段后拉（24–30f）；w2 在 15f、w3 在 25f 从右边缘进来
//   31–42   整句静停（w3 空隙继续收拢）
//   38–48   放大 1.3×、实心 → 玻璃字；46–58 背景翻色、网点环外扫；43–52 玻璃长条升起
//   52–64   标题猛上移；53–60 面板身后冒出（最虚）；56–62 淡粉紫 → 61–64 亮蓝 → 64–72 网页；长条 56–61 变白
//   71–88   网页内容逐层长满（71 第一行、73 第二行、74–78 图标、77–84 副标题擦出、83–86 底行）
//   88–114  慢慢缩小 + 上移（≈4%/s），标题下沉；105 起加速
//   114–119 模糊爬坡（0 → 22px），在最虚处结束
// 毛病清单（自查表通用项 + 本镜头独有）：
//   - 独有 1：新词必须"偏青 + 虚 + 空隙偏大"进场，0.15–0.2s 后才白、才收拢；全白进场会很平
//   - 独有 2：面板颜色三段不能跳过亮蓝；撑开那几帧整画面一起虚
//   - 独有 3：输入框不是钉死的锚点（还在上浮、缩小）；标题始终在面板后面
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {FONT, Grain, Vignette, mix} from '../../../assets/lib/helpers/polish';

export const HEADLINE_INPUT_TO_PAGE_DURATION = 120;

const SANS = `"PingFang SC", "Noto Sans CJK SC", "Noto Sans SC", ${FONT.sans}`;
const SERIF = `"Songti SC", "STSong", "Noto Serif CJK SC", serif`;
const W = 1920, H = 1080;
const clamp = (x: number) => Math.max(0, Math.min(1, x));
const sm = (x: number) => { const c = clamp(x); return c * c * (3 - 2 * c); };
const rp = (t: number, a: number, b: number) => sm((t - a) / (b - a));
const eo = (t: number, a: number, b: number) => { const c = clamp((t - a) / (b - a)); return 1 - Math.pow(1 - c, 3); };

// 单调三次样条（Fritsch–Carlson）：pts = [时间秒, 值]，越界钳位
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
const hex = (c: string) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
const mixc = (a: string, b: string, k: number) => { const A = hex(a), B = hex(b); return `rgb(${A.map((v, i) => Math.round(mix(v, B[i], clamp(k)))).join(',')})`; };

// ───────── 标题：三个词块，按字宽排版 ─────────
const F0 = 96; // 终态字号（S=1）
const WORDS = [
  {t: '致每一个', born: 0, extra: 0, dur: 0.3},
  {t: '想把点子', born: 0.5, extra: 1.0, dur: 0.34},
  {t: '做出来的人', born: 0.84, extra: 1.0, dur: 0.48},
];
const GAP = 0.42; // 词间距（em）
const HALF = ((4 + 4 + 5 + GAP * 2) * F0) / 2 / W * 100; // 终态半宽（画面 %）

const S_TRK: P = [[0, 3.3], [0.28, 3.35], [0.36, 3.3], [0.4, 3.2], [0.44, 3.1], [0.48, 3.0], [0.52, 2.6], [0.56, 2.3], [0.6, 2.2], [0.68, 2.1], [0.72, 2.05], [0.8, 1.9], [0.84, 1.7], [0.88, 1.45], [0.92, 1.2], [0.96, 1.07], [1.0, 1.01], [1.04, 1.0], [1.28, 1.006], [1.4, 1.07], [1.44, 1.13], [1.48, 1.21], [1.52, 1.26], [1.56, 1.285], [1.6, 1.3], [1.64, 1.285], [1.72, 1.28], [1.88, 1.3], [2.12, 1.33], [2.4, 1.335], [3.0, 1.325], [3.4, 1.305], [3.8, 1.26], [3.97, 1.24]];
const L_EARLY: P = [[0, 80.3], [0.04, 56.0], [0.08, 45.7], [0.12, 38.9], [0.16, 34.1], [0.2, 30.3], [0.24, 27.8], [0.28, 26.0], [0.32, 24.7], [0.36, 23.6], [0.4, 22.4], [0.44, 21.2], [0.48, 19.5], [0.52, 16.2], [0.56, 13.8], [0.6, 12.9], [0.64, 12.4], [0.72, 12.4], [0.76, 12.6], [0.8, 12.9], [0.84, 13.5], [0.88, 14.5], [0.92, 15.0], [0.96, 15.35], [1.0, 15.5], [1.04, 15.5]];
const CY_TRK: P = [[0, 51], [1.6, 51], [1.64, 50], [1.68, 47.5], [1.72, 46.3], [1.76, 46], [1.8, 42.5], [1.84, 40.5], [1.88, 34], [1.92, 25.5], [1.96, 22], [2.0, 20.6], [2.04, 18.6], [2.08, 17.4], [2.12, 16.3], [2.24, 15.2], [2.4, 14.6], [3.0, 14.8], [3.4, 15.5], [3.6, 16.2], [3.8, 16.9], [3.97, 17.4]];

const Headline: React.FC<{t: number; blur: number}> = ({t, blur}) => {
  const S = trk(t, S_TRK);
  const F = F0 * S;
  const Lpct = t <= 1.04 ? trk(t, L_EARLY) : 50 - HALF * S;
  const cy = trk(t, CY_TRK) / 100 * H;
  const solid = 1 - rp(t, 1.4, 1.58);
  const glass = rp(t, 1.42, 1.6);
  // 词的位置：前一个词 + 宽 + 间距 + 还没收拢的空隙
  let x = (Lpct / 100) * W;
  const items = WORDS.map((w, i) => {
    if (i > 0) {
      const ex = w.extra * (1 - eo(t, w.born, w.born + w.dur));
      x += (GAP + ex) * F;
    }
    const left = x;
    x += Array.from(w.t).length * F;
    const age = t - w.born;
    const cyan = i === 0 ? 0 : 1 - rp(age, 0.08, i === 1 ? 0.24 : 0.24);
    const bl = i === 0 ? 0 : 4.5 * (1 - rp(age, 0.0, 0.14));
    const op = i === 0 ? 1 : mix(0.78, 1, rp(age, 0.02, 0.16));
    return {w, left, cyan, bl, op};
  });
  const common: React.CSSProperties = {position: 'absolute', top: cy - F * 0.62, fontSize: F, lineHeight: `${F * 1.24}px`, fontWeight: 600, fontFamily: SANS, whiteSpace: 'pre', letterSpacing: 0};
  return (
    <div style={{position: 'absolute', inset: 0, filter: blur > 0.2 ? `blur(${blur.toFixed(2)}px)` : undefined}}>
      {solid > 0.01 && items.map(({w, left, cyan, bl, op}, i) => (
        <div key={`s${i}`} style={{...common, left, opacity: solid * op, color: mixc('#fdfdfe', '#6cf0f8', cyan),
          textShadow: `0 0 ${(F * 0.05).toFixed(1)}px rgba(255,255,255,0.75), 0 0 ${(F * 0.16).toFixed(1)}px rgba(150,225,255,${(0.55 + cyan * 0.3).toFixed(2)})`,
          filter: bl > 0.2 ? `blur(${bl.toFixed(2)}px)` : undefined}}>{w.t}</div>
      ))}
      {glass > 0.01 && (
        <div style={{position: 'absolute', inset: 0, opacity: glass, filter: `drop-shadow(0 0 ${(F * 0.05).toFixed(1)}px rgba(200,230,255,0.55))`}}>
          {items.map(({w, left}, i) => (
            <React.Fragment key={`g${i}`}>
              <div style={{...common, left, color: 'transparent', WebkitTextStroke: `${(F * 0.032).toFixed(2)}px rgba(255,255,255,0.82)`,
                backgroundImage: 'linear-gradient(172deg, rgba(255,255,255,0.8) 0%, rgba(215,232,255,0.42) 26%, rgba(150,165,255,0.2) 52%, rgba(185,210,255,0.36) 78%, rgba(255,255,255,0.66) 100%)',
                WebkitBackgroundClip: 'text', backgroundClip: 'text'}}>{w.t}</div>
              <div style={{...common, left: left + F * 0.012, top: (common.top as number) + F * 0.016, color: 'transparent', WebkitTextStroke: `${(F * 0.012).toFixed(2)}px rgba(150,215,255,0.55)`, filter: `blur(${(F * 0.008).toFixed(2)}px)`}}>{w.t}</div>
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};

// ───────── 背景：两套多团柔光（亮青蓝 → 深紫蓝）+ 细点阵 + 网点冲击波 ─────────
const Backdrop: React.FC<{t: number}> = ({t}) => {
  const k = rp(t, 1.5, 1.76); // 翻深色
  const dk = clamp(t / 1.1); // 0–1.1s 右上深色扩大、左下变亮
  const dx = Math.sin(t * 0.9) * 30, dy = Math.cos(t * 0.7) * 20;
  const ringR = trk(t, [[1.56, -350], [1.64, 150], [1.72, 620], [1.8, 1000], [1.9, 1350], [1.98, 1600]]);
  const ringOp = rp(t, 1.56, 1.62) * (1 - rp(t, 1.84, 1.98));
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <AbsoluteFill style={{background: 'linear-gradient(162deg, #1a8ddc 0%, #1f9be6 38%, #45b1ea 68%, #84cbf0 100%)'}} />
      <AbsoluteFill style={{background: `radial-gradient(ellipse ${mix(45, 70, dk)}% ${mix(55, 85, dk)}% at ${88 + dx / 40}% ${-6 + dy / 40}%, rgba(${Math.round(mix(17, 4, dk))},${Math.round(mix(41, 3, dk))},${Math.round(mix(190, 60, dk))},0.95) 0%, rgba(17,41,190,0.55) 45%, rgba(17,41,190,0) 100%)`}} />
      <AbsoluteFill style={{background: `radial-gradient(ellipse 60% 50% at ${8 + dx / 50}% ${-10}%, rgba(4,3,117,${(0.15 + dk * 0.6).toFixed(2)}) 0%, rgba(4,3,117,0) 100%)`}} />
      <AbsoluteFill style={{background: `radial-gradient(ellipse 55% 60% at ${6 - dx / 60}% ${104}%, rgba(223,240,249,${(0.5 + dk * 0.45).toFixed(2)}) 0%, rgba(223,240,249,0) 75%)`}} />
      {/* 深紫蓝 */}
      <AbsoluteFill style={{opacity: k}}>
        <AbsoluteFill style={{background: 'linear-gradient(175deg, #0c067a 0%, #1711c6 40%, #1a14d8 70%, #1712c0 100%)'}} />
        <AbsoluteFill style={{background: `radial-gradient(ellipse 50% 60% at ${96 + dx / 50}% 55%, rgba(15,16,235,0.95) 0%, rgba(15,16,235,0) 100%)`}} />
        <AbsoluteFill style={{background: `radial-gradient(ellipse 45% 40% at 50% ${48 + dy / 30}%, rgba(81,78,242,0.55) 0%, rgba(81,78,242,0) 100%)`}} />
        <AbsoluteFill style={{background: `radial-gradient(ellipse 60% 50% at 60% -12%, rgba(7,1,90,0.9) 0%, rgba(7,1,90,0) 100%)`}} />
        <AbsoluteFill style={{background: `radial-gradient(ellipse 30% 55% at ${-3 + dx / 60}% ${80 - t * 2}%, rgba(170,220,250,1) 0%, rgba(90,170,240,0.6) 45%, rgba(80,160,240,0) 100%)`}} />
      </AbsoluteFill>
      {/* 细点阵 */}
      <AbsoluteFill style={{backgroundImage: 'radial-gradient(rgba(255,255,255,0.5) 0.8px, transparent 1.2px)', backgroundSize: '8px 8px', opacity: 0.09}} />
      {/* 网点冲击波：小斜箭头半调纹，环形遮罩往外扩 */}
      {ringOp > 0.01 && (
        <AbsoluteFill style={{opacity: ringOp,
          WebkitMaskImage: `radial-gradient(circle at 50% 46%, transparent ${Math.max(0, ringR).toFixed(0)}px, black ${(ringR + 170).toFixed(0)}px, rgba(0,0,0,0.85) ${(ringR + 520).toFixed(0)}px, transparent ${(ringR + 900).toFixed(0)}px)`,
          maskImage: `radial-gradient(circle at 50% 46%, transparent ${Math.max(0, ringR).toFixed(0)}px, black ${(ringR + 170).toFixed(0)}px, rgba(0,0,0,0.85) ${(ringR + 520).toFixed(0)}px, transparent ${(ringR + 900).toFixed(0)}px)`}}>
          <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
            <defs>
              <pattern id="arw" width="17" height="17" patternUnits="userSpaceOnUse">
                <path d="M3.5 13 L12.5 4 M7 4 L12.5 4 L12.5 9.5" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </pattern>
            </defs>
            <rect width={W} height={H} fill="url(#arw)" />
          </svg>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

// ───────── 网页（面板本地坐标 1501×938，终态 2.4s 时 1:1） ─────────
const PW = 1501, PH = 938, SIDE = 285;
const Icon: React.FC<{k: number}> = ({k}) => {
  const st = {fill: 'none', stroke: '#3a3d4d', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const};
  return (
    <svg width="26" height="26" viewBox="0 0 24 24">
      {k === 0 && <><circle cx="12" cy="12" r="8.5" {...st} /><path d="M3.5 12h17M12 3.5c2.6 2.4 2.6 14.6 0 17M12 3.5c-2.6 2.4-2.6 14.6 0 17" {...st} /></>}
      {k === 1 && <><rect x="3.5" y="4.5" width="17" height="11.5" rx="1.5" {...st} /><path d="M12 16v4M8.5 20h7M7 12.5l3-3 2.5 2 4-4" {...st} /></>}
      {k === 2 && <><rect x="3" y="5" width="13" height="10" rx="1.5" {...st} /><rect x="13.5" y="9" width="7.5" height="11" rx="1.5" {...st} /></>}
      {k === 3 && <path d="M9.5 3.5h5M10.5 3.5v6L5 19a1 1 0 0 0 .9 1.5h12.2A1 1 0 0 0 19 19l-5.5-9.5v-6M7.5 15h9" {...st} />}
    </svg>
  );
};
const SIDE_ITEMS = ['主页', '项目', '收藏', '最近浏览', '与我共享'];
const SIDE_ITEMS2 = ['帮助中心', '更新日志', '运行状态'];
const NAV = ['方案 ˅', '资源 ˅', '加入我们', '价格'];
const ICONS = ['网站', '幻灯片', '应用', '原型'];

const Page: React.FC<{t: number}> = ({t}) => {
  const glassA = 1 - rp(t, 1.86, 1.93);
  const pink = rp(t, 1.83, 1.9) * (1 - rp(t, 1.97, 2.04));
  const blue = rp(t, 1.97, 2.03) * (1 - rp(t, 2.2, 2.4) * 0.999);
  const web = rp(t, 2.13, 2.24);
  const sideTxt = rp(t, 2.15, 2.3);
  const sideWhite = rp(t, 2.26, 2.42);
  const mainDark = rp(t, 2.23, 2.37);
  const nav = rp(t, 2.3, 2.36);
  const l1 = rp(t, 2.35, 2.42), l2 = rp(t, 2.43, 2.5), l1up = eo(t, 2.43, 2.55);
  const MX = SIDE + (PW - SIDE) / 2; // 主区中心
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: PW, height: PH, borderRadius: 24, overflow: 'hidden', fontFamily: SANS}}>
      {/* 第一段：和背景差不多的淡蓝玻璃 */}
      <div style={{position: 'absolute', inset: 0, opacity: glassA, background: 'linear-gradient(140deg, rgba(84,132,240,0.96) 0%, rgba(70,112,246,0.95) 50%, rgba(110,130,248,0.92) 100%)'}} />
      {/* 第二段：淡粉紫玻璃 + 对角亮粉高光带 */}
      <div style={{position: 'absolute', inset: 0, opacity: pink, background: 'linear-gradient(135deg, #c6b0f8 0%, #dbb6fc 40%, #a9a6f8 62%, #7491f3 100%)'}}>
        <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(120deg, rgba(255,210,250,0) 25%, rgba(255,215,252,0.55) 40%, rgba(255,210,250,0) 55%)'}} />
      </div>
      {/* 第三段：饱和亮蓝 */}
      <div style={{position: 'absolute', inset: 0, opacity: blue, background: 'linear-gradient(135deg, #3568ee 0%, #2049eb 40%, #3b6ef0 75%, #4582f2 100%)'}} />
      {/* 第四段：网页 */}
      <div style={{position: 'absolute', inset: 0, opacity: web}}>
        <div style={{position: 'absolute', inset: 0, background: '#8c96ec'}} />
        <div style={{position: 'absolute', inset: 0, background: '#edebf0', opacity: sideWhite}} />
        {/* 侧栏 */}
        <div style={{position: 'absolute', left: 0, top: 0, width: SIDE, height: PH, opacity: sideTxt, color: '#2c2f3c'}}>
          <div style={{position: 'absolute', left: 22, top: 22, fontSize: 30, fontWeight: 800, fontStyle: 'italic', letterSpacing: '-0.02em'}}>随手站</div>
          <div style={{position: 'absolute', right: 20, top: 32, fontSize: 15, color: '#80838f'}}>搜索 ⌘K</div>
          <div style={{position: 'absolute', left: 18, top: 78, width: SIDE - 36, height: 36, display: 'flex', alignItems: 'center', gap: 10, fontSize: 18, fontWeight: 600}}>
            <div style={{width: 26, height: 26, borderRadius: 6, background: '#16151c', color: '#fff', fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>满</div>
            小满工作室<span style={{marginLeft: 'auto', fontSize: 14, color: '#80838f', fontWeight: 400}}>团队 ˅</span>
          </div>
          <div style={{position: 'absolute', left: 12, top: 128, width: SIDE - 24, height: 36, borderRadius: 8, background: 'rgba(30,30,60,0.08)'}} />
          {SIDE_ITEMS.map((s, i) => (
            <div key={s} style={{position: 'absolute', left: 28, top: 134 + i * 38, fontSize: 19, color: i === 0 ? '#2c2f3c' : '#5b5e6c', display: 'flex', gap: 12, alignItems: 'center'}}>
              <span style={{width: 16, height: 16, borderRadius: 4, border: '1.6px solid #6d7080', display: 'inline-block'}} />{s}
            </div>
          ))}
          <div style={{position: 'absolute', left: 18, right: 18, top: 330, height: 1, background: 'rgba(40,40,60,0.12)'}} />
          {SIDE_ITEMS2.map((s, i) => (
            <div key={s} style={{position: 'absolute', left: 28, top: 348 + i * 38, fontSize: 19, color: '#5b5e6c', display: 'flex', gap: 12, alignItems: 'center'}}>
              <span style={{width: 16, height: 16, borderRadius: 8, border: '1.6px solid #6d7080', display: 'inline-block'}} />{s}
            </div>
          ))}
        </div>
        {/* 主区 */}
        <div style={{position: 'absolute', left: SIDE + 6, top: 10, right: 10, bottom: 10, borderRadius: 16, overflow: 'hidden', background: 'linear-gradient(180deg, #7183ee 0%, #8796f0 60%, #b9c4f6 100%)'}}>
          <div style={{position: 'absolute', inset: 0, opacity: mainDark, background: 'linear-gradient(180deg, #03052e 0%, #070a6a 16%, #0a00b3 34%, #1c3ada 50%, #8fa6f2 64%, #dfe5fa 76%, #f4f4f6 88%)'}}>
            <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(118deg, rgba(110,220,255,0) 4%, rgba(110,220,255,0.55) 14%, rgba(150,230,255,0.15) 24%, rgba(110,220,255,0) 32%)'}} />
          </div>
        </div>
        <div style={{position: 'absolute', left: SIDE, right: 0, top: 30, display: 'flex', justifyContent: 'center', gap: 44, fontSize: 18, color: '#fff', opacity: nav * 0.92}}>
          {NAV.map((n) => <span key={n}>{n}</span>)}
        </div>
        {/* 主标题两行 */}
        <div style={{position: 'absolute', left: MX - 500, width: 1000, top: mix(288, 256, l1up) - 40, textAlign: 'center', fontFamily: SERIF, fontStyle: 'italic', fontSize: 64, lineHeight: '80px', color: '#fff', opacity: l1, filter: l1 < 0.95 ? `blur(${((1 - l1) * 5).toFixed(1)}px)` : undefined}}>说出你的想法。</div>
        <div style={{position: 'absolute', left: MX - 500, width: 1000, top: 352 - 42, textAlign: 'center', fontSize: 68, fontWeight: 700, lineHeight: '84px', letterSpacing: '-0.02em', color: '#fff', opacity: l2, transform: `translateY(${((1 - l2) * 14).toFixed(1)}px)`, filter: l2 < 0.95 ? `blur(${((1 - l2) * 5).toFixed(1)}px)` : undefined}}>随手站把它做出来。</div>
        {/* 副标题：两行从左往右擦出 */}
        {['用自己的话描述想法，就能得到一个今天就能发布的网站或应用。', '不用写代码，不用找开发，也不用等外包报价。'].map((s, i) => {
          const a = i === 0 ? 2.56 : 2.68;
          const p = trk(t, [[a, -25], [a + 0.13, 125]]);
          const m = `linear-gradient(90deg, black ${(p - 25).toFixed(1)}%, transparent ${p.toFixed(1)}%)`;
          return <div key={i} style={{position: 'absolute', left: MX - 450, width: 900, top: 392 + i * 36, textAlign: 'center', fontSize: 23, lineHeight: '34px', color: '#cbd6e7', WebkitMaskImage: m, maskImage: m}}>{s}</div>;
        })}
        {/* 图标：0.04s 一个从下浮起 */}
        {ICONS.map((s, i) => {
          const p = eo(t, 2.47 + i * 0.04, 2.6 + i * 0.04);
          const lab = rp(t, 2.63, 2.72);
          const x = MX + (i - 1.5) * 86;
          return (
            <React.Fragment key={s}>
              <div style={{position: 'absolute', left: x - 28, top: 705 + (1 - p) * 22, width: 56, height: 56, borderRadius: 14, background: '#fff', boxShadow: '0 2px 8px rgba(30,40,90,0.12), 0 0 0 1px rgba(30,40,90,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: p}}>
                <Icon k={i} />
                {i === 1 && <div style={{position: 'absolute', top: -11, left: 14, padding: '1px 7px', borderRadius: 8, background: '#3b8cf0', color: '#fff', fontSize: 12, fontWeight: 600}}>新</div>}
              </div>
              <div style={{position: 'absolute', left: x - 40, width: 80, top: 768, textAlign: 'center', fontSize: 15, color: '#8a8d99', opacity: lab}}>{s}</div>
            </React.Fragment>
          );
        })}
        <div style={{position: 'absolute', left: MX - 340, width: 680, top: 826, textAlign: 'center', fontSize: 15, color: '#8a8d99', opacity: rp(t, 2.76, 2.88), display: 'flex', justifyContent: 'center', gap: 18}}>
          <span>或者从这里开始</span><span>◆ 设计稿</span><span>◎ 代码仓库</span><span>▣ 团队模板</span>
        </div>
      </div>
      {/* 玻璃边 */}
      <div style={{position: 'absolute', inset: 0, borderRadius: 24, boxShadow: 'inset 0 0 0 1.5px rgba(255,255,255,0.35), inset 0 2px 0 rgba(255,255,255,0.4)'}} />
    </div>
  );
};

// 面板：中心 x、宽（画面 %）、上沿（画面 %）
const PANEL_W: P = [[1.74, 92], [1.76, 90], [1.8, 86], [1.84, 82], [1.88, 80.2], [1.92, 80.4], [1.96, 80], [2.0, 79.5], [2.2, 78.6], [2.4, 78.2], [3.0, 77.3], [3.4, 76.0], [3.6, 75.3], [3.72, 74.4], [3.8, 73.9], [3.88, 72.4], [3.92, 70.8], [3.97, 68.4]];
const PANEL_T: P = [[1.72, 50], [1.76, 43], [1.8, 38], [1.84, 35.8], [1.88, 33.6], [1.92, 31.4], [1.96, 28.3], [2.0, 26.8], [2.04, 25], [2.08, 23.3], [2.12, 22.2], [2.24, 21], [2.4, 20.3], [3.0, 20.0], [3.4, 19.6], [3.6, 18.6], [3.72, 16.6], [3.8, 15.0], [3.84, 14.3], [3.88, 13.4], [3.92, 12.2], [3.97, 11.0]];
const PANEL_BLUR: P = [[1.74, 26], [1.8, 20], [1.84, 22], [1.88, 13], [1.92, 7], [1.96, 3.5], [2.0, 1.2], [2.05, 0]];

// 输入框（长条）：左右上下（画面 %）
const IN: [number, number, number, number, number][] = [
  [1.42, 27, 85, 84, 105], [1.48, 29, 85, 79, 100], [1.56, 31, 84.5, 76, 97], [1.6, 32, 84.3, 75, 96], [1.68, 34, 84, 75, 96], [1.72, 34, 82, 73, 94], [1.76, 34, 81, 73, 94],
  [1.8, 35, 80, 73, 93], [1.84, 35.2, 79.8, 72.2, 92], [1.88, 36, 79, 72, 91], [1.92, 37, 78, 71.5, 89.6], [1.96, 37.2, 77.8, 70, 87], [2.0, 37.6, 77, 69, 85], [2.04, 38, 76.6, 68, 83.9],
  [2.08, 38.3, 76.3, 67.7, 82.6], [2.12, 38.5, 76.1, 67.5, 82.1], [2.4, 38.8, 75.9, 66.9, 81.7], [3.0, 39.0, 75.6, 66.7, 81.3], [3.4, 39.4, 75.2, 66.1, 80.7], [3.6, 39.6, 75.0, 64.6, 78.5],
  [3.72, 39.9, 74.8, 62.4, 76.6], [3.8, 40.0, 74.6, 60.2, 74.2], [3.84, 40.1, 74.5, 58.7, 72.6], [3.88, 40.3, 74.3, 57.3, 70.7], [3.92, 40.8, 73.8, 55.4, 68.3], [3.97, 41.3, 73.3, 52.8, 65.4],
];
const inTrk = (t: number, k: number) => trk(t, IN.map((r) => [r[0], r[k]] as [number, number]));
const IN_BLUR: P = [[1.42, 12], [1.48, 9], [1.56, 5.5], [1.64, 2.5], [1.72, 0], [1.76, 1.5], [1.8, 3], [1.84, 4], [1.88, 3], [1.92, 1.5], [2.0, 0]];

const Input: React.FC<{t: number}> = ({t}) => {
  const l = inTrk(t, 1) / 100 * W, r = inTrk(t, 2) / 100 * W, tp = inTrk(t, 3) / 100 * H, bt = inTrk(t, 4) / 100 * H;
  const w = r - l, h = bt - tp, s = w / 712;
  const op = rp(t, 1.42, 1.5) * 0.65 + rp(t, 1.5, 1.68) * 0.35;
  const reveal = trk(t, [[1.44, 10], [1.56, 45], [1.64, 78], [1.72, 140]]);
  const white = trk(t, [[1.82, 0], [1.84, 0.12], [1.92, 0.45], [1.96, 0.68], [2.0, 0.85], [2.04, 1]]);
  const ui = rp(t, 1.87, 2.04);
  const bl = trk(t, IN_BLUR);
  const m = `linear-gradient(90deg, black ${(reveal - 40).toFixed(1)}%, transparent ${reveal.toFixed(1)}%)`;
  if (op < 0.01) return null;
  return (
    <div style={{position: 'absolute', left: l, top: tp, width: w, height: h, opacity: op, filter: bl > 0.2 ? `blur(${bl.toFixed(2)}px)` : undefined, WebkitMaskImage: reveal < 139 ? m : undefined, maskImage: reveal < 139 ? m : undefined}}>
      <div style={{position: 'absolute', inset: 0, borderRadius: h * 0.12, boxShadow: `0 ${(10 * s).toFixed(1)}px ${(40 * s).toFixed(1)}px rgba(20,20,90,${(0.15 + white * 0.15).toFixed(2)}), 0 0 ${(30 * s).toFixed(1)}px rgba(220,200,255,${(0.35 * (1 - white)).toFixed(2)})`, overflow: 'hidden'}}>
        <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(216,184,248,0.92) 0%, rgba(231,209,251,0.85) 38%, rgba(170,200,250,0.72) 75%, rgba(150,200,250,0.55) 100%)'}} />
        <div style={{position: 'absolute', inset: 0, background: '#fcfcfc', opacity: white}} />
        <div style={{position: 'absolute', inset: 0, borderRadius: h * 0.12, boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8), inset 0 0 0 1px rgba(255,255,255,0.45)'}} />
      </div>
      <div style={{position: 'absolute', inset: 0, opacity: ui, fontFamily: SANS}}>
        <div style={{position: 'absolute', left: 22 * s, top: 18 * s, fontSize: 19 * s, color: '#a3a6b2'}}>我们来做个原型……</div>
        <div style={{position: 'absolute', left: 18 * s, bottom: 16 * s, display: 'flex', alignItems: 'center', gap: 14 * s, fontSize: 16 * s, color: '#6d7080'}}>
          <span style={{fontSize: 24 * s, color: '#3a3d4d', lineHeight: 1}}>+</span><span>标准 ⌃⌄</span>
        </div>
        <div style={{position: 'absolute', right: 16 * s, bottom: 14 * s, display: 'flex', alignItems: 'center', gap: 14 * s, fontSize: 16 * s, color: '#6d7080'}}>
          <span>💡 规划</span>
          <div style={{width: 32 * s, height: 32 * s, borderRadius: '50%', background: '#53b2e8', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 * s, fontWeight: 700}}>↑</div>
        </div>
      </div>
    </div>
  );
};

export const HeadlineInputToPage: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / 30;
  const outBlur = trk(t, [[3.83, 0], [3.867, 3], [3.9, 6.5], [3.933, 13], [3.967, 22]]);
  const pw = trk(t, PANEL_W) / 100 * W;
  const pt = trk(t, PANEL_T) / 100 * H;
  const ps = pw / PW;
  const pBlur = Math.max(trk(t, PANEL_BLUR), outBlur);
  const pOp = rp(t, 1.71, 1.79);
  return (
    <AbsoluteFill style={{background: '#0a0a3a', overflow: 'hidden'}}>
      <Backdrop t={t} />
      <Headline t={t} blur={outBlur * 0.8} />
      {t >= 1.72 && (
        <div style={{position: 'absolute', left: W * 0.4995 - pw / 2, top: pt, width: PW, height: PH, transform: `scale(${ps.toFixed(5)})`, transformOrigin: '0 0', opacity: pOp, filter: pBlur > 0.2 ? `blur(${(pBlur / ps).toFixed(2)}px)` : undefined}}>
          <div style={{position: 'absolute', inset: 0, borderRadius: 24, boxShadow: '0 30px 90px rgba(10,5,80,0.35)'}} />
          <Page t={t} />
        </div>
      )}
      <div style={{position: 'absolute', inset: 0, filter: outBlur > 0.2 ? `blur(${outBlur.toFixed(2)}px)` : undefined}}>
        <Input t={t} />
      </div>
      <Vignette strength={mix(0.1, 0.24, rp(t, 1.5, 1.8))} color={t < 1.6 ? '#0a2a8a' : '#05031f'} inner={0.55} />
      <Grain opacity={0.05} blend="soft-light" />
    </AbsoluteFill>
  );
};
