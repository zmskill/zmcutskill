// S6–S10：资料库卡 + 放入圆吞文件卡 → 圆被擀成进度条 → 长成文件列表关两个开关 → 果冻球绕标题挤开词缝 → 淡紫球升起变按钮 + 冲击光环
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {
  EASE, mix, clamp, fx, X, Y, rp, kf, spl, lerpC, rgba, Orb, PAL, palAt, orbMotion, SANS, P3, hash, RimStroke, rimInnerLight,
} from './orb-kit';

// 玻璃卡 + 有方向的边缘光（2026-11-17 重做）：ang = 亮段中心角（0°=正上，顺时针），按原片 rim_profile 量的值逐段设；
// 只有亮段发光；靠亮边那侧底色略亮。width / base 见 orb-kit RimStroke。
export const GlowFrame: React.FC<{w: number; h: number; r: number | string; ang: number; glow: number; stroke?: number; bright?: number; bg: string; width?: number; base?: number; children?: React.ReactNode; style?: React.CSSProperties}> = ({w, h, r, ang, glow, stroke = 2, bright = 0.6, bg, width = 75, base = 0.05, children, style}) => (
  <div style={{position: 'absolute', width: w, height: h, borderRadius: r, ...style}}>
    <div style={{position: 'absolute', inset: 0, borderRadius: r, background: `${rimInnerLight(ang, 0.12 + 0.06 * bright)}, ${bg}`, overflow: 'hidden'}}>{children}</div>
    <RimStroke r={r} ang={ang} width={width} peak={mix(0.8, 1, bright)} base={base} stroke={stroke} glow={glow} />
  </div>
);

// 背景：两侧竖向蓝光，慢慢变亮（S6–S8）
const SideLight: React.FC<{k: number; t: number}> = ({k, t}) => {
  const sway = Math.sin(t * 1.3) * 1.5;
  return (
    <AbsoluteFill style={{background: `radial-gradient(ellipse 16% 75% at ${fx(-3 + sway)}% 50%, ${rgba(lerpC('#0e2466', '#2a5ad0', k), mix(0.6, 0.95, k))} 0%, rgba(0,0,0,0) 100%), radial-gradient(ellipse 17% 80% at ${fx(103 - sway)}% 48%, ${rgba(lerpC('#1a3a8a', '#3a7ae8', k), mix(0.65, 1, k))} 0%, rgba(0,0,0,0) 100%)`}} />
  );
};

// ════════════════ S6 9.45–12.10 / S7 12.10–14.70 资料库卡 ════════════════
const CW = 600;
const cardScale = (t: number) => (t < 9.58 ? 1.5 + (t - 9.45) * 0.2 : spl(t, [[9.58, 0.983], [10.0, 1.133], [10.2, 1.19], [10.5, 1.24], [10.8, 1.283], [11.4, 1.317], [11.9, 1.35], [12.1, 1.367], [12.5, 1.5], [12.7, 1.65], [13.0, 1.75], [13.1, 1.8], [13.7, 1.883], [14.2, 1.92], [14.75, 1.95]]));
// 文件卡：[入场时间, 叠好后顶边（卡内坐标）, 叠好后的缩放, 被吞时间]
const FILES: [number, number, number, number][] = [[10.0, 218, 0.9, 11.45], [10.3, 240, 0.95, 11.65], [10.62, 262, 1, 11.88]];
const FileFace: React.FC<{kind: number}> = ({kind}) => (
  <div style={{position: 'absolute', inset: 0, borderRadius: 18, background: 'linear-gradient(180deg, rgba(46,90,235,0.88) 0%, rgba(20,45,160,0.62) 42%, rgba(4,8,40,0.5) 100%)', boxShadow: `inset 0 0 0 1.5px ${rgba('#6a8aff', 0.35)}`}}>
    {kind === 0 && <svg width="220" height="270" style={{position: 'absolute', inset: 0}}><path d="M26 200 C60 150 80 190 110 130 S170 90 196 70" stroke="#7ab8ff" strokeWidth="3" fill="none" /><path d="M26 220 L196 220" stroke={rgba('#6a8aff', 0.4)} strokeWidth="2" /></svg>}
    {kind === 1 && <div style={{position: 'absolute', left: 70, top: 110, width: 80, height: 80, borderRadius: '50%', boxShadow: `inset 0 0 0 3px #7ab8ff`}}><div style={{position: 'absolute', left: 32, top: 24, width: 0, height: 0, borderLeft: '24px solid #7ab8ff', borderTop: '16px solid transparent', borderBottom: '16px solid transparent'}} /></div>}
    {kind === 2 && [0, 1, 2, 3, 4, 5].map((i) => <div key={i} style={{position: 'absolute', left: 30, top: 100 + i * 22, width: i === 5 ? 90 : 160, height: 4, borderRadius: 2, background: rgba('#7ab8ff', 0.7)}} />)}
  </div>
);

export const S6S7: React.FC<{t: number}> = ({t}) => {
  const s = cardScale(t);
  const ch = kf(t, [[12.2, 400], [12.75, 290, EASE.out]]);
  const cx = t < 9.58 ? X(65) - (t - 9.45) * 120 : 960, cy = t < 9.58 ? Y(46) : kf(t, [[9.58, Y(49)], [12.6, Y(50)]]);
  const rx = kf(t, [[12.15, 0], [12.5, 14, EASE.out], [12.95, 9], [13.2, 7]]);
  const ry = kf(t, [[12.95, 0], [13.15, -6], [13.45, 5], [13.75, -4], [14.1, 0], [14.6, 5], [14.7, 3]]);
  const rz = kf(t, [[14.05, 0], [14.2, -5, EASE.linear], [14.3, -10, EASE.out], [14.4, -12], [14.5, -12], [14.6, -4], [14.7, 3]]);
  const glow = kf(t, [[12.25, 0.6], [12.5, 1.2], [14.7, 1.3]]); // 原片外发光峰值：9.8→29、12.4→43、13.2→52（rim_profile）
  // 亮段中心角，原片实测（rim_profile）：9.8→307 10.6→17 11.6→9 12.4→318 13.2→78 14.3→285（写成连续角度）
  const ang = kf(t, [[9.45, 307], [9.8, 307], [10.6, 377], [11.6, 369], [12.4, 318], [13.2, 438], [14.3, 645], [14.7, 660]]);
  // 放入圆 → 透镜 → 胖胶囊 → 细条（高度先缩、宽度后涨）
  const dropD = kf(t, [[9.45, 165], [11.9, 182], [12.1, 197]]);
  const bw = t < 12.1 ? dropD : spl(t, [[12.1, 197], [12.2, 205], [12.3, 225], [12.4, 265], [12.5, 375], [12.6, 420], [14.7, 420]]);
  const bh = t < 12.1 ? dropD : spl(t, [[12.1, 197], [12.2, 160], [12.3, 138], [12.4, 112], [12.5, 47], [12.6, 24], [14.7, 24]]);
  const by = kf(t, [[12.1, 235], [12.6, 172, EASE.out]]);
  const capK = rp(t, 12.15, 0.3, EASE.smooth);
  const rad = `${fx(mix(bw / 2, bh / 2, capK))}px / ${fx(bh / 2)}px`;
  const barK = rp(t, 12.35, 0.15, EASE.smooth); // 球身颜色 → 进度条颜色
  const prog = t < 12.58 ? 1 : spl(t, [[12.58, 0], [12.7, 0.05], [12.8, 0.17], [12.9, 0.24], [13.0, 0.32], [13.1, 0.4], [13.2, 0.49], [13.3, 0.55], [13.4, 0.62], [13.5, 0.68], [13.6, 0.72], [13.7, 0.79], [13.8, 0.84], [13.9, 0.88], [14.0, 0.93], [14.1, 0.97], [14.2, 1], [14.7, 1]]);
  const barOp = 1 - rp(t, 14.5, 0.18, EASE.linear);
  const arrowOp = 1 - rp(t, 12.1, 0.1, EASE.linear);
  return (
    <AbsoluteFill style={{background: '#02030c', overflow: 'hidden'}}>
      <SideLight k={rp(t, 9.45, 5, EASE.linear)} t={t} />
      <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, perspective: 1600, perspectiveOrigin: `${cx}px ${cy}px`}}>
        <div style={{position: 'absolute', left: cx - CW / 2, top: cy - ch / 2, width: CW, height: ch, transform: `rotateX(${fx(rx)}deg) rotateY(${fx(ry)}deg) rotateZ(${fx(rz)}deg) scale(${fx(s, 4)})`}}>
          <GlowFrame w={CW} h={ch} r={30} ang={ang} glow={glow} stroke={1.6} bg="linear-gradient(175deg, #02073e 0%, #030c4c 55%, #0a1c70 100%)">
            <div style={{position: 'absolute', left: 0, right: 0, top: 44, textAlign: 'center', fontFamily: SANS, fontWeight: 300, fontSize: 40, color: '#fff', letterSpacing: '0.04em'}}>资料库</div>
          </GlowFrame>
          {/* 放入圆 / 进度条（同一个东西） */}
          {barOp > 0.01 && (
            <div style={{position: 'absolute', left: 300 - bw / 2, top: by - bh / 2, width: bw, height: bh, borderRadius: rad, overflow: 'hidden', opacity: barOp,
              boxShadow: `0 0 ${fx(10 + barK * 18)}px ${rgba('#2a4aff', 0.5 + barK * 0.3)}`}}>
              <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(circle at 26% 38%, rgba(110,160,255,0.75) 0%, rgba(110,160,255,0) 38%), radial-gradient(circle at 72% 78%, #3a5aff 0%, #1a3ae0 45%, #0e22b0 80%)', opacity: 1 - barK}} />
              <div style={{position: 'absolute', inset: 0, background: '#06104a', opacity: barK}} />
              <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${fx(Math.max(bh / bw, prog) * 100)}%`, borderRadius: bh / 2, background: 'linear-gradient(90deg, #7ab8f0 0%, #4a8aff 55%, #4a5aff 100%)', opacity: barK, boxShadow: `0 0 12px ${rgba('#7ab8f0', 0.6)}`}} />
              {arrowOp > 0.01 && (
                <div style={{position: 'absolute', inset: 0, opacity: arrowOp, fontFamily: SANS}}>
                  <svg width={bw} height={bh} viewBox="0 0 100 100" style={{position: 'absolute', inset: 0}}><path d="M50 26 L50 52 M40 43 L50 53 L60 43" stroke="#3a8aff" strokeWidth="3.2" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  <div style={{position: 'absolute', left: 0, right: 0, top: '60%', textAlign: 'center', fontSize: bw * 0.13, color: '#3a8aff'}}>放入</div>
                </div>
              )}
            </div>
          )}
          {/* 文件卡：从下面升起、顶端渐隐，盖在放入圆前面（用户 2026-11-05：卡片图层应该在上面，原片也是卡在圆前、卡顶渐隐透出圆） */}
          {t < 12.15 && FILES.map(([at, top, sc, eat], i) => {
            if (t < at) return null;
            const rise = rp(t, at, 0.42, EASE.out);
            const settle = rp(t, at + 0.35, 0.5, EASE.smooth);
            const lift = Math.max(0, t - 10.8) * 50; // 整摞慢慢往上缩进圆里
            const eatK = rp(t, eat - 0.3, 0.42, EASE.swift);
            let topY = mix(700, top - 8, rise) + settle * 8 - lift;
            let scl = mix(1.05, sc, settle);
            if (i < 2) { topY = mix(topY, 150, eatK); scl *= mix(1, 0.7, eatK); }
            else { scl *= kf(t, [[11.6, 1], [11.9, 0.81], [12.0, 0.69], [12.1, 0.44], [12.14, 0.2]]); topY = mix(topY, by - 60, rp(t, 11.75, 0.35, EASE.smooth)); }
            const op = i < 2 ? 1 - rp(t, eat + 0.05, 0.08, EASE.linear) : 1;
            return (
              <div key={i} style={{position: 'absolute', left: 300 - 110, top: topY, width: 220, height: 270, transform: `scale(${fx(scl, 3)})`, transformOrigin: '50% 0%', opacity: op, WebkitMaskImage: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.3) 22%, black 55%)', maskImage: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.3) 22%, black 55%)'}}>
                <FileFace kind={i} />
              </div>
            );
          })}
          {/* 走满后末端冒出的小光点 */}
          {t > 14.22 && t < 14.65 && [0, 1, 2, 3, 4].map((i) => {
            const p = rp(t, 14.22 + i * 0.02, 0.4, EASE.out);
            const a = -20 - hash(i, 3) * 70, L = 20 + p * (50 + hash(i, 5) * 60);
            return <div key={i} style={{position: 'absolute', left: 510 + Math.cos(a * Math.PI / 180) * L - 3, top: by + Math.sin(a * Math.PI / 180) * L - 3, width: 6, height: 6, borderRadius: '50%', background: '#9ae6ff', boxShadow: '0 0 8px #5ac8ff', opacity: (1 - rp(t, 14.45, 0.2, EASE.linear))}} />;
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ════════════════ S8 14.70–16.87 卡片长成文件列表（手风琴压紧），关掉第 3、5 行 ════════════════
const ROWS = ['菜谱.pdf', '旅行计划.docx', '水电账单.xlsx', '体检报告.pdf', '读书笔记.md', '家庭相册.zip', '购物清单.txt'];
const OFF: Record<number, number> = {2: 15.8, 4: 16.0};
export const S8: React.FC<{t: number}> = ({t}) => {
  const w = kf(t, [[14.7, 1160], [14.86, 880, EASE.out]]);
  const titleY = spl(t, [[14.7, 424], [14.8, 440], [15.0, 356], [15.1, 318], [15.6, 282], [16.3, 260], [16.7, 230], [16.9, 214]]);
  const fs = kf(t, [[14.7, 76], [14.86, 68, EASE.out]]);
  const rz = kf(t, [[14.7, 3], [14.8, 4], [15.05, 0, EASE.out]]);
  const rx = kf(t, [[14.7, 8], [14.9, 16], [16.6, 17], [16.87, 21]]);
  const top = titleY - 70;
  let acc = 0;
  return (
    <AbsoluteFill style={{background: '#02030c', overflow: 'hidden'}}>
      <SideLight k={1} t={t} />
      <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, perspective: 1500, perspectiveOrigin: `960px ${fx(top)}px`}}>
        <div style={{position: 'absolute', left: 960 - w / 2, top, width: w, height: 1500, transform: `rotateX(${fx(rx)}deg) rotateZ(${fx(rz)}deg)`, transformOrigin: '50% 0%'}}>
          <GlowFrame w={w} h={1500} r={34} ang={335} glow={1.6} width={70} bright={1} /* 卡高 1500、中心在画面下面很远：实测亮在顶边 + 左上（顶 .72 左 .64），对应这里 335° */ stroke={1.6} bg="linear-gradient(180deg, #00053d 0%, #030d4e 55%, #12388a 100%)">
            <div style={{position: 'absolute', left: 0, right: 0, top: 70 - fs * 0.62, textAlign: 'center', fontFamily: SANS, fontWeight: 300, fontSize: fs, color: '#fff', letterSpacing: '0.04em'}}>资料库</div>
            {ROWS.map((name, i) => {
              const at = 14.8 + i * 0.1;
              if (t < at - 0.02) return null;
              const y = 150 + acc;
              acc += mix(225, 94, rp(t, 15.08 + i * 0.07, 0.28, EASE.out));
              const p = rp(t, at, 0.16, EASE.out);
              const offAt = OFF[i];
              const off = offAt ? rp(t, offAt, 0.12 + (i === 4 ? 0.1 : 0), EASE.out) : 0;
              return (
                <div key={i} style={{position: 'absolute', left: 70, right: 70, top: y + (1 - p) * 40, height: 60, opacity: p, fontFamily: SANS}}>
                  <div style={{position: 'absolute', left: 0, top: 6, fontSize: 40, fontWeight: 300, color: '#fff'}}>{name}</div>
                  <div style={{position: 'absolute', right: 0, top: 4, width: 150, height: 50, borderRadius: 25, overflow: 'hidden', background: '#06104a', boxShadow: `inset 0 0 0 1.5px ${rgba('#3a7af0', 0.6)}`}}>
                    <div style={{position: 'absolute', inset: 0, borderRadius: 25, background: 'linear-gradient(90deg, #7ad0f0 0%, #3a7aff 70%, #2a4aff 100%)', opacity: 1 - off}} />
                    <div style={{position: 'absolute', top: 6, left: mix(150 - 44, 6, off), width: 38, height: 38, borderRadius: '50%', background: lerpC('#0a1a80', '#1a2a90', off), boxShadow: `0 0 0 1.5px ${rgba('#9ad0ff', 0.5)}`}} />
                  </div>
                </div>
              );
            })}
          </GlowFrame>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ════════════════ S9 16.88–18.57 "创建一个专属助手"：果冻球入场、绕标题、挤开词缝冲出顶部 ════════════════
const FS9 = 118;
const ORB9: P3[] = [[16.85, 50, 118], [16.917, 50, 99], [16.95, 50, 92], [16.983, 50, 82], [17.017, 50, 74], [17.05, 50, 66], [17.083, 50, 59], [17.117, 50, 55], [17.15, 50.3, 51], [17.183, 50.8, 48], [17.2, 51.2, 44], [17.3, 53, 33], [17.4, 58, 26], [17.5, 64, 21], [17.6, 73, 20], [17.7, 86, 27], [17.8, 98, 52], [17.85, 104, 70], [17.9, 88, 81], [18.0, 75, 87], [18.1, 62, 85], [18.2, 57, 80], [18.3, 52, 75], [18.333, 51, 72], [18.367, 50.4, 66], [18.4, 50.2, 59], [18.433, 50, 49], [18.467, 49.8, 33], [18.5, 49.6, 19], [18.533, 49.4, 3], [18.57, 49.2, -14]];
const ORB9_PAL: [number, typeof PAL.cyan][] = [[17.0, PAL.cyan], [17.7, PAL.cyan], [18.0, PAL.cyanDeep], [18.3, PAL.cyanDeep], [18.45, PAL.deep]];
export const S9: React.FC<{t: number}> = ({t}) => {
  if (t >= 18.555) return <AbsoluteFill style={{background: '#000'}} />; // 一整帧全黑
  const ty = spl(t, [[16.88, 59], [16.95, 56], [17.05, 54], [17.15, 53], [17.3, 52], [17.6, 50], [18.0, 48], [18.35, 48], [18.433, 52], [18.467, 55], [18.5, 58], [18.533, 60]]);
  const gap = kf(t, [[18.34, 0], [18.367, 15, EASE.linear], [18.4, 50, EASE.linear], [18.433, 90, EASE.linear], [18.467, 170, EASE.linear], [18.5, 250, EASE.linear], [18.533, 330, EASE.linear], [18.56, 420, EASE.linear]]);
  const m = orbMotion(t, ORB9, 0.1);
  const pal = palAt(t, ORB9_PAL);
  const half = 4 * FS9 * 0.98;
  return (
    <AbsoluteFill style={{background: '#030310', overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 0, top: Y(ty) - FS9 * 0.66, width: 1920, fontFamily: SANS, fontWeight: 300, fontSize: FS9, color: '#fff', letterSpacing: '-0.02em', whiteSpace: 'pre'}}>
        <div style={{position: 'absolute', left: 960 - half - gap * 0.42 - 6, top: 0}}>创建一个</div>
        <div style={{position: 'absolute', left: 960 + gap * 0.58 + 6, top: 0}}>专属助手</div>
      </div>
      <Orb x={m.x} y={m.y} d={182} pal={pal} vx={m.vx} vy={m.vy} cvx={m.cvx} cvy={m.cvy} soft={0.9} glow={0.8} />
    </AbsoluteFill>
  );
};

// ════════════════ S10 18.60–20.55 淡紫玻璃球升起 → 圆角方块 → "我的助手"按钮 + 冲击光环 → 长出输入框 ════════════════
export const AssistantCard: React.FC<{t: number; w: number; h: number; cy?: number; title: string; titleDy: number; titleFs: number; inputK: number; text: React.ReactNode; bg: string; glow: number; textClip?: boolean; dim?: number}> = ({t, w, h, cy = 540, title, titleDy, titleFs, inputK, text, bg, glow, dim = 0}) => (
  <div style={{position: 'absolute', left: 960 - w / 2, top: cy - h / 2, width: w, height: h, borderRadius: Math.min(h / 2, kf(w, [[290, 90], [575, 50], [700, 44]], ) ), overflow: 'hidden', background: bg, boxShadow: glow > 0.02 ? `0 0 ${fx(18 + glow * 20)}px ${rgba('#2a4aff', glow * 0.6)}` : undefined, fontFamily: SANS, filter: dim > 0 ? `brightness(${fx(1 - dim * 0.5)})` : undefined}}>
    <RimStroke r={Math.min(h / 2, kf(w, [[290, 90], [575, 50], [700, 44]]))} ang={221} width={70} peak={mix(0.35, 0.9, glow)} base={mix(0.03, 0.55, glow)} stroke={1.6} glow={mix(0.3, 1, glow)} />
    <div style={{position: 'absolute', left: '50%', top: h / 2 + titleDy, transform: 'translate(-50%, -50%)', whiteSpace: 'pre', fontSize: titleFs, fontWeight: 400, color: lerpC('#b8e8ff', '#ffffff', 1 - glow), letterSpacing: '0.02em'}}>{title}</div>
    {inputK > 0.001 && (
      <div style={{position: 'absolute', left: (w - 400) / 2, top: h - 22 - 92 * inputK, width: 400, height: 92, borderRadius: 18, background: `${rimInnerLight(kf(t, [[22.0, 125], [25.5, 90]]), 0.2)}, linear-gradient(180deg, #0a1a80, #06104a)`}}>
        {/* 输入框亮边：原片 22.5 亮在右下、25.5 亮在右边（rim_profile 实测 90°），白亮 + 只在亮段发光 */}
        <RimStroke r={18} ang={kf(t, [[22.0, 125], [25.5, 90]])} width={70} peak={1} base={0.04} stroke={2} glow={1.1} col={{hi: [215, 240, 255], mid: [110, 170, 245], lo: [40, 70, 200]}} />
        <div style={{position: 'absolute', left: 28, top: 26, fontSize: 30, color: '#9ad8ff', whiteSpace: 'pre'}}>{text}</div>
      </div>
    )}
  </div>
);

const ORB10: P3[] = [[18.567, 50, 112], [18.6, 50, 99], [18.633, 50, 82], [18.667, 50, 70], [18.7, 50, 63], [18.8, 50, 49], [18.9, 50, 44.2], [19.05, 50, 44]];
const S10_TEXT = (t: number) => { const s = '选一个性格'; const n = t < 20.28 ? 0 : t < 20.4 ? 1 : t < 20.5 ? 2 : t < 20.62 ? 3 : t < 20.76 ? 4 : 5; return s.slice(0, n); };
export const S10: React.FC<{t: number}> = ({t}) => {
  const m = orbMotion(t, ORB10, 0.08);
  const d = spl(t, [[18.6, 140], [18.633, 150], [18.667, 160], [18.7, 168], [18.8, 188], [18.9, 196], [18.95, 200], [19.017, 205], [19.05, 208]]);
  const shadowK = rp(t, 18.97, 0.08, EASE.out);
  // 冲击光环：外径 380 → 出画；环内贴着球是近黑
  const ro = kf(t, [[19.04, 300], [19.05, 380, EASE.linear], [19.083, 560, EASE.linear], [19.117, 720, EASE.linear], [19.15, 870, EASE.linear], [19.183, 1000, EASE.linear], [19.217, 1150, EASE.linear], [19.25, 1300, EASE.linear], [19.3, 1500, EASE.linear], [19.4, 1900, EASE.out], [19.55, 2300, EASE.out]]);
  const ringOp = t < 19.045 ? 0 : kf(t, [[19.045, 0.6], [19.1, 1], [19.3, 0.85], [19.45, 0.55], [19.57, 0.4], [19.6, 0, EASE.linear]]);
  const fog = t < 19.6 ? kf(t, [[19.3, 0], [19.45, 0.5], [19.55, 0.55]]) * (1 - rp(t, 19.53, 0.07, EASE.linear) * 0.5) : 0;
  const isBtn = t >= 19.085;
  const bw = spl(t, [[19.085, 215], [19.117, 290], [19.15, 360], [19.183, 420], [19.217, 460], [19.25, 510], [19.3, 575], [19.4, 640], [19.5, 675], [19.6, 700], [19.8, 700], [19.9, 645], [20.0, 614], [20.1, 595], [20.2, 580], [20.3, 575], [20.4, 566], [20.55, 560]]);
  const bh = spl(t, [[19.085, 200], [19.117, 230], [19.15, 235], [19.183, 260], [19.217, 285], [19.25, 305], [19.3, 330], [19.4, 350], [19.5, 365], [19.6, 370], [19.8, 370], [19.9, 340], [20.0, 320], [20.1, 310], [20.2, 305], [20.3, 300], [20.4, 296], [20.55, 294]]);
  const cool = rp(t, 19.3, 0.3, EASE.smooth);
  const bg = `linear-gradient(180deg, ${lerpC('#0b2f8e', '#0a1a80', cool)} 0%, ${lerpC('#0a3398', '#0a1a80', cool)} 35%, ${lerpC('#2f58b4', '#081478', cool)} 75%, ${lerpC('#4a6cb8', '#06104a', cool)} 100%)`;
  const cardK = rp(t, 19.85, 0.25, EASE.out);
  const by = Y(44) + (540 - Y(44)) * rp(t, 19.1, 0.6, EASE.smooth) - (Math.sin(t * 1.1) * 4 + Math.sin(t * 0.7) * 6) * rp(t, 19.1, 0.6, EASE.smooth);
  return (
    <AbsoluteFill style={{background: '#030310', overflow: 'hidden'}}>
      {fog > 0 && <AbsoluteFill style={{background: `radial-gradient(ellipse 45% 55% at 50% 50%, ${rgba('#0a1424', fog)} 0%, ${rgba('#1a2a6a', fog)} 60%, ${rgba('#2a4ad8', fog)} 100%)`}} />}
      {ringOp > 0 && <AbsoluteFill style={{background: `radial-gradient(circle ${fx(ro / 2)}px at 960px ${fx(by)}px, rgba(3,3,16,${fx(0.9 * ringOp)}) 0%, rgba(3,3,16,${fx(0.6 * ringOp)}) ${fx(clamp(125 / (ro / 2)) * 100)}%, ${rgba('#2a5aff', ringOp)} ${fx(mix(62, 72, clamp((ro - 380) / 1500)))}%, ${rgba('#081098', ringOp * 0.7)} 88%, rgba(8,16,152,0) 100%)`}} />}
      {/* 投影光晕 */}
      {shadowK > 0 && !isBtn && <div style={{position: 'absolute', left: 960 - 150, top: m.y + 50, width: 300, height: 110, borderRadius: '50%', background: `radial-gradient(ellipse, ${rgba('#2a5aff', 0.5 * shadowK)} 0%, rgba(42,90,255,0) 70%)`}} />}
      {!isBtn && <Orb x={m.x} y={m.y} d={d} pal={PAL.lilac} vx={m.vx * 0.35} vy={m.vy * 0.35} cvx={0} cvy={0} soft={0.3} sx={kf(t, [[19.05, 1], [19.085, 1.04]])} sy={kf(t, [[19.05, 1], [19.085, 0.96]])} glow={0.8} />}
      {isBtn && (
        <AssistantCard t={t} w={bw} h={bh} cy={by} title="我的助手" titleDy={kf(t, [[19.8, -18], [20.0, -78, EASE.out], [20.55, -80]])} titleFs={kf(t, [[19.85, 84], [20.05, 46, EASE.out]])} inputK={cardK} text={S10_TEXT(t)} bg={bg} glow={1 - cool} />
      )}
      {/* 按钮两侧冒出的小光点 */}
      {t > 19.38 && t < 19.85 && Array.from({length: 12}, (_, i) => {
        const side = i < 6 ? -1 : 1, j = i % 6;
        const p = rp(t, 19.38 + j * 0.015, 0.42, EASE.out);
        const x = 960 + side * (bw / 2 + 30 + p * (80 + hash(i, 2) * 90));
        const y = by + (hash(i, 7) - 0.5) * 120 + (hash(i, 9) - 0.5) * 60 * p;
        const sz = mix(6, 2, p);
        return <div key={i} style={{position: 'absolute', left: x - sz / 2, top: y - sz / 2, width: sz, height: sz, borderRadius: '50%', background: '#8ae0ff', boxShadow: '0 0 6px #5ac8ff', opacity: 1 - rp(t, 19.6, 0.22, EASE.linear)}} />;
      })}
    </AbsoluteFill>
  );
};
