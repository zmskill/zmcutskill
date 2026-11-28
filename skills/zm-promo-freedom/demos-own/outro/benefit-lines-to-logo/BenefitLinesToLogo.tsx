// 两句好处 → 换光 → Logo 收尾（003-S5，第二版）
// 学的动作（来自 @bohdanmotion · Polar 片尾 003-20，按每 0.1 秒一帧、960px 大图逐帧看过）：
//   白墙 + 很虚的大片叶影一直在慢慢晃；
//   第一句逐词出：每个词先是浅灰、带一点虚、从右边一点点滑进来，之后慢慢变黑（越早出的词越黑）；
//     整行一直保持居中——每多一个词，整行往左让一点；关键词最后出、品牌色
//   → 第一句整体变虚、变淡、略缩小退场
//   → 第二句：第一个词直接是黑的，后面的词从下面一点、稍大一点、虚着出来，再慢慢变黑
//   → 第二句往左带一道横向拖影退场，同一时刻背景换光（白墙 → 蓝天窗光，叶影变成一条条斜的百叶影，左下角露出一点虚的绿植）
//   → Logo 图形先出，名字一个字一个字由浅变深 → 整组往上让位，下面两行小字逐词出 → 停住，镜头极慢推进
// 我们的内容：两句是对比式的好处（不点产品名），收尾 Logo 位放产品（逐梦的剪辑 skills）
//
// 时间表（30fps，共 186f）
//   0–24    第一句逐词出（0 / 3 / 6 / 22 帧），每词 8 帧进场、18 帧变黑；整行随词数居中
//   46–54   第一句虚掉退场
//   54–66   第二句逐词出（54 / 59 / 63）；82–88 往左拖影退场；80–92 换光
//   86–100  Logo 图形 + 名字逐字出；104–114 整组上移；108 / 118 两行小字
//   120–186 停住（镜头极慢推进、叶影一直晃）
// 毛病清单（自查表通用项 + 本镜头独有）：
//   - 独有 1：整行要跟着词数重新居中（中文按字宽算），不能一开始就占好整行位置
//   - 独有 2：第二句退场和换光是同一时刻，中间不能空一拍
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {EASE, FONT, Grain, Vignette, mix, ramp} from '../../../assets/lib/helpers/polish';

export const BENEFIT_LINES_TO_LOGO_DURATION = 186;

const SANS = `"PingFang SC", "Noto Sans CJK SC", "Noto Sans SC", ${FONT.sans}`;
const ACCENT = '#5b5cf0';
const clamp = (x: number) => Math.max(0, Math.min(1, x));
const hash = (i: number, n: number) => { const x = Math.sin(i * 12.9898 + n * 78.233) * 43758.5453; return x - Math.floor(x); };
// 浅灰 → 墨色
const inkColor = (k: number) => `rgb(${Math.round(mix(178, 22, k))},${Math.round(mix(176, 21, k))},${Math.round(mix(186, 28, k))})`;

const Mark: React.FC<{size: number; star: number}> = ({size, star}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{display: 'block', overflow: 'visible'}}>
    <circle cx="50" cy="50" r="41" fill="none" stroke="#16151c" strokeWidth="8.5" />
    <g transform={`translate(50 50) scale(${star.toFixed(3)})`}><path d="M0 -24 C3 -6 6 -3 24 0 C6 3 3 6 0 24 C-3 6 -6 3 -24 0 C-6 -3 -3 -6 0 -24 Z" fill={ACCENT} /></g>
  </svg>
);

// ───────── 一行逐词：整行跟着已出现的词重新居中 ─────────
type W = {t: string; at: number; accent?: boolean; firstDark?: boolean};
const LineOfWords: React.FC<{f: number; words: W[]; size: number; from: 'right' | 'below'; inkDur: number}> = ({f, words, size, from, inkDur}) => {
  const em = size * 0.97; // 中文字宽（含 -0.03em 字距）
  const widths = words.map((w) => Array.from(w.t).length * em);
  // 每个词的"占位进度"：进场时宽度慢慢撑开，整行就自然往左让
  const occ = words.map((w) => ramp(f, w.at, 10, EASE.out));
  const total = widths.reduce((s, wd, i) => s + wd * occ[i], 0);
  let x = -total / 2;
  return (
    <div style={{position: 'absolute', left: 960, top: 540 - size * 0.62, height: size * 1.3, fontSize: size, fontWeight: 700, letterSpacing: '-0.03em', whiteSpace: 'pre'}}>
      {words.map((w, i) => {
        const p = ramp(f, w.at, 9, EASE.out);
        const ink = w.firstDark ? 1 : ramp(f, w.at + 2, inkDur, EASE.smooth);
        const left = x;
        x += widths[i] * occ[i];
        const dx = from === 'right' ? (1 - p) * 26 : 0;
        const dy = from === 'below' ? (1 - p) * 22 : 0;
        const sc = from === 'below' ? mix(1.12, 1, p) : 1;
        return (
          <span key={i} style={{position: 'absolute', left, top: 0, opacity: clamp(p * 1.4), color: w.accent ? `rgb(${Math.round(mix(160, 91, ink))},${Math.round(mix(162, 92, ink))},${Math.round(mix(230, 240, ink))})` : inkColor(ink), filter: p < 0.98 ? `blur(${((1 - p) * 9).toFixed(1)}px)` : undefined, transform: `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px) scale(${sc.toFixed(3)})`, transformOrigin: '0% 70%'}}>{w.t}</span>
        );
      })}
    </div>
  );
};

// ───────── 背景：白墙 + 很虚的大片叶影（一直晃）；k = 换光进度 ─────────
const FRONDS = Array.from({length: 9}, (_, i) => ({a: -40 + i * 13 + (hash(i, 1) - 0.5) * 8, len: 900 + hash(i, 2) * 500, w: 120 + hash(i, 3) * 90, ph: hash(i, 4) * 6.28}));
const Backdrop: React.FC<{f: number; k: number}> = ({f, k}) => {
  const sway = Math.sin(f / 38) * 4 + Math.sin(f / 15 + 1) * 1.2;
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      {/* 白墙（暖白，右上微冷）→ 蓝天窗光 */}
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 90% 80% at 40% 40%, #fdfbfa 0%, #f2eeee 60%, #e6e2e6 100%)'}} />
      <AbsoluteFill style={{background: 'linear-gradient(160deg, rgba(230,238,255,0.7) 0%, rgba(255,255,255,0) 30%)'}} />
      <AbsoluteFill style={{opacity: k, background: 'linear-gradient(165deg, #f7f9fd 0%, #e4ecfa 35%, #c7d8f4 70%, #b3c9ee 100%)'}} />
      {/* 白墙时：大片叶影（像一片棕榈叶的影子，从右上伸进来），很虚 */}
      <AbsoluteFill style={{opacity: (1 - k) * 0.16, filter: 'blur(34px)', transform: `rotate(${sway.toFixed(2)}deg) translate(${(sway * 6).toFixed(1)}px, 0)`, transformOrigin: '110% -10%'}}>
        {FRONDS.map((fr, i) => (
          <div key={i} style={{position: 'absolute', left: 1900, top: -120, width: fr.len, height: fr.w, marginLeft: -fr.len, borderRadius: '50%', background: '#3a3040', transformOrigin: '100% 50%', transform: `rotate(${(fr.a + Math.sin(f / 22 + fr.ph) * 2).toFixed(2)}deg)`}} />
        ))}
        <div style={{position: 'absolute', left: -200, top: 820, width: 900, height: 160, borderRadius: '50%', background: '#3a3040', transform: 'rotate(-6deg)'}} />
      </AbsoluteFill>
      {/* 换光后：一条条斜的百叶影（比叶影实一点）+ 左下角虚的绿植 + 几粒光斑 */}
      <AbsoluteFill style={{opacity: k * 0.5, filter: 'blur(14px)', transform: `translateX(${(f * 0.6 + sway * 4).toFixed(1)}px)`}}>
        <div style={{position: 'absolute', left: -800, top: -600, width: 3600, height: 2400, transform: 'rotate(-32deg)'}}>
          {Array.from({length: 22}, (_, i) => <div key={i} style={{position: 'absolute', left: i * 170 + (i % 3) * 30, top: 0, width: 60 + (i % 4) * 22, height: 2400, background: 'rgba(255,255,255,0.95)'}} />)}
        </div>
      </AbsoluteFill>
      <div style={{position: 'absolute', left: -140 + sway * 3, top: 760, width: 420, height: 520, opacity: k * 0.85, filter: 'blur(26px)'}}>
        {[[60, 60, 140, 300, -20], [150, 0, 120, 340, 15], [0, 160, 160, 260, -45]].map(([x, y, w, h, r], i) => <div key={i} style={{position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: '50%', background: i === 1 ? '#2f4d2a' : '#3d5b30', transform: `rotate(${r + Math.sin(f / 20 + i) * 3}deg)`}} />)}
      </div>
      {Array.from({length: 7}, (_, i) => <div key={i} style={{position: 'absolute', left: 1300 + hash(i, 7) * 560, top: 60 + hash(i, 8) * 400, width: 40 + hash(i, 9) * 30, height: 40 + hash(i, 9) * 30, borderRadius: '50%', background: 'rgba(255,255,255,0.8)', filter: 'blur(6px)', opacity: k * (0.4 + 0.4 * Math.sin(f / 9 + i))}} />)}
    </AbsoluteFill>
  );
};

export const BenefitLinesToLogo: React.FC = () => {
  const f = useCurrentFrame();
  const L1: W[] = [{t: '更多', at: 0}, {t: '时间，', at: 3}, {t: '留给', at: 6}, {t: '创作', at: 22, accent: true}];
  const L2: W[] = [{t: '更少', at: 54, firstDark: true}, {t: '重复的', at: 59}, {t: '手工活', at: 63}];
  const out1 = ramp(f, 46, 9, EASE.smooth);
  const out2 = ramp(f, 82, 7, EASE.exit);
  const k = ramp(f, 80, 12, EASE.smooth);
  const cam = 1 + ramp(f, 0, 186, EASE.linear) * 0.03; // 全程极慢推进

  const NAME = Array.from('逐梦的剪辑 skills');
  const mark = ramp(f, 86, 10, EASE.out);
  const star = ramp(f, 90, 14, EASE.overshoot);
  const up = ramp(f, 104, 12, EASE.smooth);
  const T1 = ['口播、字幕、包装，', '一句话', '交给它。'];
  const T2 = ['现在', '就试试。'];

  return (
    <AbsoluteFill style={{fontFamily: SANS, overflow: 'hidden', background: '#f3efef'}}>
      <AbsoluteFill style={{transform: `scale(${(1 + (cam - 1) * 0.6).toFixed(4)})`}}><Backdrop f={f} k={k} /></AbsoluteFill>
      <AbsoluteFill style={{transform: `scale(${cam.toFixed(4)})`}}>
        {/* 第一句 */}
        {f < 56 && (
          <AbsoluteFill style={{opacity: 1 - out1, filter: out1 > 0.02 ? `blur(${(out1 * 12).toFixed(1)}px)` : undefined, transform: `scale(${mix(1, 0.95, out1).toFixed(4)})`}}>
            <LineOfWords f={f} words={L1} size={124} from="right" inkDur={20} />
          </AbsoluteFill>
        )}
        {/* 第二句：往左带横向拖影退场 */}
        {f >= 52 && f < 90 && (
          <AbsoluteFill style={{opacity: 1 - out2, transform: `translateX(${(-out2 * 70).toFixed(1)}px) scale(${mix(1, 0.9, out2).toFixed(4)})`, filter: out2 > 0.02 ? `url(#mb${Math.min(4, Math.ceil(out2 * 4))})` : undefined}}>
            <LineOfWords f={f} words={L2} size={124} from="below" inkDur={22} />
          </AbsoluteFill>
        )}
        {/* Logo + 两行小字 */}
        {f >= 86 && (
          <AbsoluteFill>
            <div style={{position: 'absolute', left: 0, right: 0, top: 540 - 66, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 30, transform: `translateY(${mix(0, -64, up).toFixed(1)}px)`}}>
              <div style={{opacity: mark, transform: `scale(${mix(0.55, 1, mark).toFixed(3)})`}}><Mark size={124} star={star} /></div>
              <div style={{fontSize: 112, fontWeight: 800, letterSpacing: '-0.03em', whiteSpace: 'pre', display: 'flex'}}>
                {NAME.map((c, i) => { const a = 90 + i * 2.2; const p = ramp(f, a, 6, EASE.out); return <span key={i} style={{opacity: p, color: inkColor(ramp(f, a, 14, EASE.smooth)), width: p < 0.01 ? 0 : undefined, overflow: 'hidden'}}>{c}</span>; })}
              </div>
            </div>
            {[T1, T2].map((line, li) => (
              <div key={li} style={{position: 'absolute', left: 0, right: 0, top: 540 + 42 + li * 60, textAlign: 'center', fontSize: 42, fontWeight: 500, whiteSpace: 'pre'}}>
                {line.map((w, i) => { const a = (li ? 120 : 108) + i * 4; const p = ramp(f, a, 8, EASE.out); return <span key={i} style={{display: 'inline-block', opacity: p, color: inkColor(mix(0, 0.85, ramp(f, a, 16, EASE.smooth))), filter: p < 0.98 ? `blur(${((1 - p) * 6).toFixed(1)}px)` : undefined, transform: `translateX(${((1 - p) * 14).toFixed(1)}px)`}}>{w}</span>; })}
              </div>
            ))}
          </AbsoluteFill>
        )}
      </AbsoluteFill>
      <svg width="0" height="0" style={{position: 'absolute'}}>
        {[1, 2, 3, 4].map((i) => <filter key={i} id={`mb${i}`} x="-30%" y="0" width="160%" height="100%"><feGaussianBlur stdDeviation={`${i * 7} ${i * 0.6}`} /></filter>)}
      </svg>
      <Vignette strength={0.1} color="#3a3a4a" inner={0.55} />
      <Grain opacity={0.04} blend="overlay" />
    </AbsoluteFill>
  );
};
