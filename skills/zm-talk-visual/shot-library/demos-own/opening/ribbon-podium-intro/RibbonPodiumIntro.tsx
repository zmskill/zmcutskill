// 飘带开场 → 产品登场（003-S1 整段）
// 学的动作（来自 @bohdanmotion · Polar 0:00–0:07.5，按 20 张/秒逐帧看过）：
//   问句 + 卡片飘带一直流（前半段，直接用已入库的 message-ribbon-flow）
//   → 飘带中间亮起白球、整屏失焦过曝
//   → 新场景从"虚 + 过曝"里对焦出来，白球的位置正好变成产品 Logo（不是从天上掉下来）
//   → Logo 快速上移让位 → 两行字逐词"横滑一小段 + 由虚变实"，第二行晚一拍，关键词胶囊从下方升起
//   → 停住 1 秒多，镜头极慢平移，光影还在晃
// 原片后半段逐帧记录（以过曝最白处为 0）：0–0.05s 全白；0.05–0.55s 对焦（Logo 灰→黑）；
//   0.55–0.65s Logo 上移约 25% 画高；0.65–1.1s 逐词出（每词 ~0.15s，词间 ~0.08s）；之后停 1.5s，整体缓慢左移 ~1%。
// 我们自己的设计（不抄原片画面）：
//   - 产品：逐梦的剪辑 skills；Logo = 墨色圆环 + 靛蓝四角星（不是原片的双圆）
//   - 场景：原片是实拍书桌 + 植物；我们画不像实物（自查表第 10 条），改成暖白墙 + 斜射窗光的百叶影 + 晃动的叶影 + 石质圆台
//   - 前半段暗场（深夜蓝，信息过载）→ 过曝 → 后半段亮场（暖白，安静），用明暗反差讲"从乱到静"
// 正式版 = variant 2（用户选的）：Logo 从白球位置落到圆台上、回弹一次，冷色晨光
// variant 1 留作备选：Logo 悬在圆台上方再上移让位（照原片走法），暖白午后光
//
// 时间表（30fps，共 258f）
//   0–150  消息飘带（已入库镜头，原样）；146–150 纯白
//   146 起第二场（本地帧 s = f-146）：
//     s 0–6   白场停住（接住上一镜的白）
//     s 4–34  过曝退去 + 整场对焦（blur 22→0，对称缓入缓出）；Logo 由灰变墨
//     s 10–30 Logo 落到圆台（EASE.exit），s 30–42 回弹一次（26px）；variant 1 则是 s 34–50 上移让位
//     s 40–78 两行字逐词出；s 58 胶囊升起
//     s 78–112 停住（≥30f），镜头 1% 极缓推进 + 左移，叶影慢晃
//
// 毛病清单（自查表通用项 + 本镜头独有）：
//   - 独有 1：转场接缝——上一镜纯白必须和这一镜的过曝白是同一个色，否则 146f 会跳一下
//   - 独有 2：Logo 出现位置要和上一镜白球位置一致（960, 640 附近），观众才会读成"白球变成了 Logo"
import React from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame} from 'remotion';
import {EASE, FONT, Grain, Vignette, mix, ramp} from '../../../kit/polish';
import {MessageRibbonFlow, MESSAGE_RIBBON_FLOW_DURATION} from '../message-ribbon-flow/MessageRibbonFlow';

export const RIBBON_PODIUM_INTRO_DURATION = 258;

const CUT = 146; // 第二场从上一镜纯白的这一帧接入
const SANS = `"PingFang SC", "Noto Sans CJK SC", "Noto Sans SC", ${FONT.sans}`;
const WHITE = '#eef2ff'; // 和 message-ribbon-flow 的过曝白一致

type Variant = 1 | 2;
type Pal = {wallTop: string; wallMid: string; wallBot: string; table: string; tableFar: string; shadow: string; window: string; ink: string; ink2: string; accent: string; stone: [string, string, string]};
const PAL: Record<Variant, Pal> = {
  // 暖白午后：墙偏米白，阴影带一点暖灰，窗光偏金
  1: {wallTop: '#f7f3ec', wallMid: '#efe9df', wallBot: '#e6dfd3', table: '#ece6dc', tableFar: '#f4efe7', shadow: '#5a4a38', window: '#fff4dc', ink: '#1d1a16', ink2: '#57504a', accent: '#5b5cf0', stone: ['#f1ebe2', '#d9d0c3', '#b9ad9c']},
  // 冷色晨光：墙偏蓝白，阴影偏蓝灰，窗光偏冷
  2: {wallTop: '#f3f6fb', wallMid: '#e9eef6', wallBot: '#dfe5ee', table: '#e6ebf2', tableFar: '#f1f4f9', shadow: '#33415a', window: '#f2f7ff', ink: '#141a26', ink2: '#4b5468', accent: '#4f5df5', stone: ['#eef1f5', '#d3d9e2', '#aeb7c4']},
};

const clamp = (x: number) => Math.max(0, Math.min(1, x));

// ───────── Logo：墨色圆环 + 靛蓝四角星 ─────────
const Mark: React.FC<{size: number; ink: string; accent: string; star: number}> = ({size, ink, accent, star}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{display: 'block', overflow: 'visible'}}>
    <circle cx="50" cy="50" r="41" fill="none" stroke={ink} strokeWidth="8.5" />
    <g transform={`translate(50 50) scale(${star.toFixed(3)})`}>
      <path d="M0 -24 C3 -6 6 -3 24 0 C6 3 3 6 0 24 C-3 6 -6 3 -24 0 C-6 -3 -3 -6 0 -24 Z" fill={accent} />
    </g>
  </svg>
);

// ───────── 逐词：横滑一小段 + 由虚变实（原片的词是从左边滑过来的） ─────────
const Word: React.FC<{text: string; start: number; dx: number; dy?: number; style?: React.CSSProperties; children?: React.ReactNode}> = ({text, start, dx, dy = 0, style, children}) => {
  const f = useCurrentFrame();
  const p = ramp(f, start, 15, EASE.out);
  return (
    <span style={{display: 'inline-block', whiteSpace: 'pre', opacity: clamp(p * 1.6), filter: p < 0.98 ? `blur(${((1 - p) * 10).toFixed(1)}px)` : undefined, transform: `translate(${((1 - p) * dx).toFixed(1)}px, ${((1 - p) * dy).toFixed(1)}px)`, ...style}}>
      {children ?? text}
    </span>
  );
};

// ───────── 墙上的光影：窗框斜影 + 斑驳叶影（都是柔边，像窗外投进来的） ─────────
// 用遮罩让光影只落在左上大半面墙、往右下渐隐——真窗光是一块投影，不是满墙条纹
const LEAF_SPOTS = Array.from({length: 30}, (_, i) => {
  const h = (n: number) => { const x = Math.sin(i * 12.9898 + n * 78.233) * 43758.5453; return x - Math.floor(x); };
  const cluster = i % 3; // 三簇：左上、上中、右上角
  const cx = [260, 820, 1640][cluster], cy = [150, 60, 170][cluster];
  return {x: cx + (h(1) - 0.5) * 420, y: cy + (h(2) - 0.5) * 220, w: 60 + h(3) * 110, hgt: 30 + h(4) * 50, r: h(5) * 180, ph: h(6) * 6.28};
});
const WallLight: React.FC<{pal: Pal; s: number}> = ({pal, s}) => {
  const sway = Math.sin(s / 34) * 10 + Math.sin(s / 13 + 1) * 3; // 叶影慢晃（两层正弦，不规则）
  // 窗框投影：宽窄不一（两扇窗 + 中间窗棂），不是等距条纹
  const bars: [number, number][] = [[640, 150], [930, 46], [1080, 150], [1420, 46]];
  const mask = 'radial-gradient(ellipse 75% 85% at 30% 20%, #000 30%, rgba(0,0,0,0.35) 65%, transparent 90%)';
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      {/* 窗光主光斑：左上进来 */}
      <AbsoluteFill style={{background: `radial-gradient(ellipse 60% 70% at 26% 18%, ${pal.window} 0%, rgba(255,255,255,0) 70%)`, opacity: 0.9}} />
      <AbsoluteFill style={{WebkitMaskImage: mask, maskImage: mask}}>
        {/* 窗框斜影 */}
        <div style={{position: 'absolute', left: -700, top: -600, width: 3200, height: 2300, transform: `rotate(-36deg) translateX(${(sway * 0.3).toFixed(1)}px)`, filter: 'blur(26px)', opacity: 0.13}}>
          {bars.map(([x, w], i) => (
            <div key={i} style={{position: 'absolute', left: x, top: 0, width: w, height: 2300, background: pal.shadow}} />
          ))}
        </div>
        {/* 斑驳叶影：一簇簇小碎斑，跟着慢晃，每片还各自轻轻抖 */}
        <div style={{position: 'absolute', inset: 0, filter: 'blur(16px)', opacity: 0.1, transform: `translate(${sway.toFixed(1)}px, ${(sway * 0.35).toFixed(1)}px)`}}>
          {LEAF_SPOTS.map((l, i) => (
            <div key={i} style={{position: 'absolute', left: l.x, top: l.y, width: l.w, height: l.hgt, borderRadius: '50%', background: pal.shadow, transform: `rotate(${(l.r + Math.sin(s / 17 + l.ph) * 6).toFixed(1)}deg)`}} />
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ───────── 石质圆台 ─────────
const Podium: React.FC<{pal: Pal; contact: number}> = ({pal, contact}) => {
  const [hi, mid, lo] = pal.stone;
  const W = 720, TOP = 72, H = 86;
  return (
    <div style={{position: 'absolute', left: 960 - W / 2, top: 800, width: W, height: TOP + H}}>
      {/* 落在台面上的软阴影 */}
      <div style={{position: 'absolute', left: -60, right: -60, top: H + 4, height: 70, borderRadius: '50%', background: `radial-gradient(ellipse at 50% 40%, rgba(40,30,20,0.28), rgba(40,30,20,0) 70%)`, filter: 'blur(10px)'}} />
      {/* 侧面：左亮右暗（光从左上来） */}
      <div style={{position: 'absolute', left: 0, right: 0, top: TOP / 2, height: H, borderRadius: `0 0 ${W / 2}px ${W / 2}px / 0 0 ${TOP / 2}px ${TOP / 2}px`, background: `linear-gradient(90deg, ${hi} 0%, ${mid} 55%, ${lo} 100%)`}} />
      {/* 顶面 */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: TOP, borderRadius: '50%', background: `radial-gradient(ellipse 80% 90% at 35% 30%, #ffffff 0%, ${hi} 45%, ${mid} 100%)`, boxShadow: 'inset 0 -2px 3px rgba(0,0,0,0.06), inset 0 2px 1px rgba(255,255,255,0.9)'}} />
      {/* V2：Logo 落上去的接触阴影 */}
      {contact > 0 && <div style={{position: 'absolute', left: W / 2 - 90, width: 180, top: TOP / 2 - 12, height: 24, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(20,20,30,0.35), rgba(20,20,30,0) 70%)', opacity: contact, filter: 'blur(4px)'}} />}
      {/* 彩虹光：窗玻璃折射到圆台右侧的一小条（只给这一处） */}
      <div style={{position: 'absolute', left: W - 210, top: TOP / 2 + 6, width: 18, height: H - 10, background: 'linear-gradient(180deg, rgba(255,120,120,0), rgba(255,170,90,0.55), rgba(255,240,120,0.5), rgba(120,230,160,0.5), rgba(110,170,255,0.55), rgba(180,120,255,0))', filter: 'blur(5px)', opacity: 0.5, mixBlendMode: 'screen', transform: 'skewX(-8deg)'}} />
    </div>
  );
};

// ───────── 第二场：对焦 → Logo → 字 ─────────
export const PodiumScene: React.FC<{variant: Variant}> = ({variant}) => {
  const s = useCurrentFrame();
  const pal = PAL[variant];

  // 对焦 + 过曝退去（对称缓入缓出，丝滑，不突然）
  const focus = ramp(s, 4, 30, EASE.smooth);
  const sceneBlur = mix(22, 0, focus);
  const flash = 1 - ramp(s, 2, 24, EASE.out);

  // Logo：V1 悬浮上移让位；V2 落到圆台上回弹一次，再和字一起站住
  let logoY: number;
  let logoScale: number;
  let contact = 0;
  if (variant === 1) {
    const up = ramp(s, 34, 16, EASE.swift);
    logoY = mix(640, 330, up);
    logoScale = mix(1.18, 1, ramp(s, 37, 16, EASE.swift)); // 缩放晚 3 帧收敛
  } else {
    // 落下：s 10–30 缓入下落（像重力），s 30 触台，回弹一次（≤1 次可见回弹）
    const fall = ramp(s, 10, 20, EASE.exit);
    const bounce = s > 30 ? Math.sin(clamp((s - 30) / 12) * Math.PI) * 26 * (1 - clamp((s - 30) / 12)) : 0;
    logoY = mix(640, 752, fall) - bounce;
    logoScale = 1;
    contact = ramp(s, 22, 10, EASE.linear) * (1 - bounce / 40);
  }
  const logoFocus = ramp(s, 6, 26, EASE.smooth);
  const star = ramp(s, 18, 18, EASE.overshoot);
  const LOGO = variant === 1 ? 150 : 140;

  // 镜头：停住段 1% 极缓推进 + 左移（原片实测整体左移 ~1%），前后景视差
  const cam = ramp(s, 30, 82, EASE.linear);
  const camX = -cam * 22;
  const push = 1 + cam * 0.012;

  // 文字
  const t0 = variant === 1 ? 40 : 38;
  const textTop = variant === 1 ? 450 : 300;

  return (
    <AbsoluteFill style={{fontFamily: SANS, overflow: 'hidden', background: `linear-gradient(180deg, ${pal.wallTop} 0%, ${pal.wallMid} 55%, ${pal.wallBot} 74%)`}}>
      <AbsoluteFill style={{filter: sceneBlur > 0.3 ? `blur(${sceneBlur.toFixed(1)}px)` : undefined, transform: `scale(${push.toFixed(4)})`}}>
        {/* 远景：墙 + 光影（视差最慢） */}
        <AbsoluteFill style={{transform: `translateX(${(camX * 0.4).toFixed(1)}px)`}}>
          <WallLight pal={pal} s={s} />
        </AbsoluteFill>
        {/* 台面：后亮前暗，带一条窗光反射 */}
        <div style={{position: 'absolute', left: -100, right: -100, top: 790, bottom: 0, background: `linear-gradient(180deg, ${pal.tableFar} 0%, ${pal.table} 40%, ${pal.wallBot} 100%)`, transform: `translateX(${(camX * 0.8).toFixed(1)}px)`}}>
          <div style={{position: 'absolute', left: '20%', width: '45%', top: 0, height: 120, background: 'radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.7), rgba(255,255,255,0) 70%)'}} />
          <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 2, background: 'rgba(255,255,255,0.8)'}} />
        </div>
        {/* 中景：圆台 */}
        <AbsoluteFill style={{transform: `translateX(${(camX * 0.8).toFixed(1)}px)`}}>
          <Podium pal={pal} contact={contact} />
        </AbsoluteFill>

        {/* Logo（白球变成 Logo：位置接上一镜的白球） */}
        <div style={{position: 'absolute', left: 960 - LOGO / 2 + camX * 0.8, top: logoY - LOGO / 2, width: LOGO, height: LOGO, transform: `scale(${logoScale.toFixed(4)})`, filter: logoFocus < 0.98 ? `blur(${((1 - logoFocus) * 10).toFixed(1)}px)` : undefined, opacity: mix(0.35, 1, logoFocus)}}>
          {/* 刚对焦时背后还留一点白球的光，慢慢散掉 */}
          <div style={{position: 'absolute', left: -LOGO * 0.6, top: -LOGO * 0.6, width: LOGO * 2.2, height: LOGO * 2.2, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.95), rgba(255,255,255,0) 62%)', opacity: 1 - logoFocus}} />
          <div style={{position: 'relative', filter: `drop-shadow(0 ${variant === 1 ? 26 : 8}px ${variant === 1 ? 30 : 10}px rgba(30,25,20,${variant === 1 ? 0.16 : 0.22}))`}}>
            <Mark size={LOGO} ink={pal.ink} accent={pal.accent} star={star} />
          </div>
        </div>

        {/* 两行字：第一行从左滑来，第二行晚一拍、滑得更远；关键词胶囊从下面升起 */}
        <div style={{position: 'absolute', left: 0, right: 0, top: textTop, textAlign: 'center', transform: `translateX(${(camX * 0.6).toFixed(1)}px)`}}>
          <div style={{fontSize: 124, fontWeight: 700, color: pal.ink, letterSpacing: '-0.02em', lineHeight: 1.15}}>
            <Word text="认识" start={t0} dx={-46} />
            <Word text="逐梦的" start={t0 + 5} dx={-46} />
            <Word text="剪辑 skills" start={t0 + 10} dx={-46} />
          </div>
          <div style={{marginTop: 26, fontSize: 64, fontWeight: 500, color: pal.ink2, letterSpacing: '-0.01em', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16}}>
            <Word text="你的 AI" start={t0 + 16} dx={-80} />
            <Word text="" start={t0 + 21} dx={0} dy={40}>
              <span style={{display: 'inline-flex', alignItems: 'center', gap: 10, padding: '8px 22px 8px 18px', borderRadius: 999, background: pal.accent, color: '#fff', fontWeight: 700, boxShadow: `0 10px 24px rgba(79,93,245,0.28), inset 0 1px 0 rgba(255,255,255,0.35)`}}>
                <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round"><circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><path d="M20 4 8.12 15.88M14.47 14.48 20 20M8.12 8.12 12 12" /></svg>
                剪辑
              </span>
            </Word>
            <Word text="搭子" start={t0 + 26} dx={-40} />
          </div>
        </div>
      </AbsoluteFill>
      <Vignette strength={0.14} color={pal.shadow} inner={0.5} />
      <Grain opacity={0.05} blend="overlay" />
      {/* 过曝白：接住上一镜 */}
      <AbsoluteFill style={{background: WHITE, opacity: flash}} />
    </AbsoluteFill>
  );
};

export const RibbonPodiumIntroBase: React.FC<{variant: Variant}> = ({variant}) => (
  <AbsoluteFill style={{background: WHITE}}>
    <Sequence durationInFrames={MESSAGE_RIBBON_FLOW_DURATION}>
      <MessageRibbonFlow />
    </Sequence>
    <Sequence from={CUT}>
      <PodiumScene variant={variant} />
    </Sequence>
  </AbsoluteFill>
);

export const RibbonPodiumIntro: React.FC = () => <RibbonPodiumIntroBase variant={2} />;
