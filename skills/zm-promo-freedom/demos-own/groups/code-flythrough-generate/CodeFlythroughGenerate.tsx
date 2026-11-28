// 【镜头组】code-flythrough-generate：镜头穿过漂浮的绿色代码关键词和霓虹四角星（有景深）→ 中间浮出深色玻璃输入条逐字打一句提问 →
//   镜头往后拉，关键词淡掉，露出输入条上面的产品名和一圈圈圆角描边 → 硬切大特写：输入条右端的发送键 + 打出「生成」，边缘蓝绿流光，背景点阵闪起来（036-A 一串，核心）
// 学的动作（Varcyyyy · BLACKBOX 0–7s，30fps 逐帧量过）：
//   0–1.5 镜头往前穿过关键词（近的大且糊、远的小且糊，焦点在中间那层），1.4 输入条在中间淡入（995×119，480..1475，y512..631）
//   1.95–3.0 逐字打字（字 43px），3.4–3.8 关键词变糊、淡出，镜头微微拉远；3.7 产品名出现在输入条上方（y450），三圈圆角描边（305–1622 / 160–1778 / 2–1920 宽）
//   5.0 硬切：输入条右端特写（高 360，右端 x≈1170），白色圆键 240px（1020,540）；5.1–5.5 左边打出 140px 的字；
//   5.0→7.0 镜头慢慢往左上带（圆键 1020,540 → 960,450）；边缘上蓝下绿发光；6.1 起右边浮出一片绿色点阵闪烁
// 我们的内容：提问「这段代码怎么优化？」，按钮字「生成」；产品是虚构的「码匣 AI」（图标自己画），画面右下角标"虚构 · 仅作演示"。
import React from 'react';
import {FilmGrain, GlowSpot} from '../_kit/light';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {GroupContract, checkContract, checkInputs, outputDuration, planExtras, toSource} from '../../../assets/lib/helpers/groupClock';
import {BoxLogo, CodeField, GlassPill, NeonStar, SANS, TealBg, clamp, eio, eo, hash, kf} from '../_kit/codeGlowKit';

const FPS = 30;
export const CODE_FLYTHROUGH_CONTRACT: GroupContract = {
  sourceDuration: 210 / 30,
  fps: 30,
  motion: [[0, 4.05], [4.15, 210 / 30]],
  holds: [{at: 4.1, maxExtra: 1.5}],
  landmarks: {fly: 0, pill: 1.4, type: 1.95, pull: 3.4, logo: 3.7, cut: 5.0, word: 5.1, dots: 6.1},
  sfx: [
    {at: 'fly', type: '运镜', note: '穿梭 whoosh', volume: 0.45},
    {at: 'type', type: '键盘', note: '一串打字', tail: 1.0, volume: 0.3},
    {at: 'pull', type: '上扬铺垫', note: '拉远 swell', volume: 0.35},
    {at: 'cut', type: '落版重击', note: '重击 hit', volume: 0.5},
    {at: 'dots', type: '闪光', note: '细碎 sparkle', volume: 0.25},
  ],
  inputs: {ask: {maxChars: 14}, btn: {maxChars: 4}, name: {maxChars: 6}},
};
export type FlyInputs = {ask: string; btn: string; name: string; note: string};
export const FLY_DEFAULT_INPUTS: FlyInputs = {ask: '这段代码怎么优化？', btn: '生成', name: '码匣 AI', note: '虚构 · 仅作演示'};
export const checkFlyInputs = (x: FlyInputs) => checkInputs(CODE_FLYTHROUGH_CONTRACT, {ask: x.ask, btn: x.btn, name: x.name});
export const planFly = (sec: number) => planExtras(CODE_FLYTHROUGH_CONTRACT, sec);
export const flyFrames = (extras: number[]) => Math.round(outputDuration(CODE_FLYTHROUGH_CONTRACT, extras) * FPS);
export const CODE_FLYTHROUGH_DURATION = 210;

export const CodeFlythroughGroup: React.FC<{inputs?: FlyInputs; extras?: number[]}> = ({inputs: x = FLY_DEFAULT_INPUTS, extras = [0]}) => {
  const tt = useCurrentFrame() / FPS;
  const s = toSource(tt, CODE_FLYTHROUGH_CONTRACT, extras);
  const held = tt - s;
  if (s < 4.85) { // 原片逐帧：硬切在 4.867s（之前 5.0 晚了 4 帧）
    const camZ = kf(s, [[0, 0], [3.6, 0.1], [5.0, 0.12]], (u) => u) + held * 0.02; /* 2026-11-21 跟踪原片：几乎不往前推（缩放≈1），之前推了 6 倍 */
    const panY = 0.68 * kf(s, [[0, 0], [0.6, 215], [1.2, 444], [1.8, 634], [2.4, 795], [3.0, 881], [3.6, 946], [4.2, 949], [4.85, 961]], (u) => u) + held * 4; /* 原片整片字往下漂（跟踪出来的 ty） */
    const panX = 0.17 * kf(s, [[0, 0], [1.2, -31], [2.4, -64], [3.0, -148], [3.6, -242], [4.85, -349]], (u) => u);
    const roll = 0.69 * kf(s, [[0, 0], [0.6, 1.76], [1.2, 5.2], [1.8, 8.47], [2.4, 8.8], [3.0, 14.3], [3.6, 20.25], [4.85, 20.4]], (u) => u); /* 字自身的视差会多带出一些转动，跟踪对比后乘 0.69 才和原片的 20° 对上 */ /* 顺时针转约 20° */
    const fade = 1 - eio(clamp((s - 3.4) / 0.4));
    const pill = eo(clamp((s - 1.22) / 0.35)); // 原片 1.3 远处已经看得到小小的输入条
    const A = Array.from(x.ask);
    const n = Math.floor(clamp((s - 1.95) / 1.05) * A.length + 0.001);
    const logo = eo(clamp((s - 3.45) / 0.2)); /* 2026-11-21 逐帧：原片产品名 3.43 起翻进来、3.6 已经立正（之前 3.65 才淡入，晚了 0.2s） */
    const rings = eio(clamp((s - 3.5) / 0.4));
    const sc = kf(s, [[3.4, 1.0], [3.9, 0.98], [5.0, 0.96]]);
    const pan = kf(s, [[3.8, 0], [4.867, -70]], (u) => u) - held * 8; // 原片切之前整条往左慢慢漂，不是停住
    return (
      <AbsoluteFill style={{overflow: 'hidden', fontFamily: SANS}}>
        {/* 原片穿字段是几乎全黑的墨绿底；拉远露出圆角描边后，下半部一团青绿光、上面偏蓝青（吸管量） */}
        <AbsoluteFill style={{background: '#030f0a'}} />
        <GlowSpot x={1150} y={380} rx={950} ry={620} rgb="20,90,60" a={0.45 * (1 - rings)} />
        <GlowSpot x={960} y={740} rx={1350} ry={520} rgb="35,125,95" a={0.55 * rings} />
        <GlowSpot x={900} y={200} rx={1250} ry={520} rgb="28,92,112" a={0.45 * rings} />
        <CodeField camZ={camZ} fade={fade} focus={3.2} n={115} sizeK={0.72} panX={panX} panY={panY} roll={roll} t={s} stars={false} dim />
        {/* 2026-11-21 原片一直有两三颗大的 3D 霓虹星守在输入条附近慢慢翻转（逐帧量的位置），不是随机飘过；之前星是跟着字随机撒的，经常看不到 */}
        {[[[0, 520, 330], [2.0, 540, 700], [3.0, 520, 680], [4.85, 470, 660]], [[0, 1260, 560], [2.0, 1290, 720], [3.0, 1340, 330], [4.85, 1360, 300]], [[0, 1380, 120], [2.0, 1360, 340], [3.0, 1300, 740], [4.85, 1280, 760]]].map((P, k) => {
          const px = kf(s, P.map(([t, xx]) => [t, xx]), (u) => u), py = kf(s, P.map(([t, , yy]) => [t, yy]), (u) => u);
          return <div key={k} style={{position: 'absolute', left: px, top: py, transform: 'translate(-50%,-50%)', opacity: fade}}><NeonStar size={[230, 150, 130][k]} rot={k * 120 + s * [60, -75, 90][k]} o={1} blur={k === 0 ? 0 : 1.2} /></div>;
        })}
        <AbsoluteFill style={{transform: `translateX(${pan}px) scale(${sc})`, transformOrigin: '960px 570px'}}>
          {rings > 0 && [[305, 384, 1317, 372], [160, 263, 1618, 612], [2, 158, 1916, 825]].map(([l, t, w, h], i) => (
            <div key={i} style={{position: 'absolute', left: l, top: t, width: w, height: h, borderRadius: h / 2, border: '2px solid rgba(120,220,190,0.16)', opacity: rings, transform: `scale(${0.92 + rings * 0.08})`}} />
          ))}
          {rings > 0 && <div style={{position: 'absolute', left: 560, top: 560, width: 800, height: 220, borderRadius: '50%', background: 'radial-gradient(ellipse closest-side, rgba(60,200,140,0.35), rgba(60,200,140,0))', opacity: rings}} />}
          {logo > 0 && <div style={{position: 'absolute', left: 0, right: 0, top: 450 - 26, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 14, opacity: clamp(logo * 1.6), transform: `perspective(700px) translateY(${(1 - logo) * 24}px) rotateX(${(1 - logo) * 65}deg) rotate(${(1 - logo) * -7}deg)`, filter: logo < 1 ? `blur(${(1 - logo) * 5}px)` : undefined}}>{/* 原片名字是带透视翻起来、由糊变清的，不是平着淡入 */}<BoxLogo size={64} /><span style={{fontSize: 54, color: '#f2f6f6', fontWeight: 600, letterSpacing: '0.02em'}}>{x.name}</span></div>}
          {pill > 0 && (
            <div style={{position: 'absolute', left: 480, top: 512, opacity: pill, filter: pill < 1 ? `blur(${(1 - pill) * 10}px)` : undefined, transform: `scale(${0.96 + pill * 0.04})`}}>
              <GlassPill w={995} h={119} text={<>{A.slice(0, n).join('')}{s < 3.6 && <span style={{width: 3, height: 46, background: '#e9eeee', marginLeft: 3, opacity: Math.floor(s * 4) % 2 || n < A.length ? 1 : 0}} />}</>} />
            </div>
          )}
        </AbsoluteFill>
        {logo > 0 && <div style={{position: 'absolute', right: 36, bottom: 26, fontSize: 20, color: 'rgba(200,230,220,0.45)', letterSpacing: '0.06em'}}>{x.note}</div>}
      </AbsoluteFill>
    );
  }
  // 特写
  const bx = kf(s, [[4.867, 1100], [5.0, 1020], [5.25, 990], [5.75, 972], [6.0, 960], [7.0, 960]], (u) => u) - held * 3;
  const by = kf(s, [[4.867, 545], [5.0, 540], [6.5, 520], [6.75, 510], [7.0, 450]], (u) => u);
  const B = Array.from(x.btn);
  const nb = Math.floor(clamp((s - 5.08) / 0.44) * B.length + 0.001);
  const dots = clamp((s - 6.0) / 0.3);
  const D = 240, H = 360;
  const mix = (a: number, b: number, k: number) => a + (b - a) * k;
  const right = bx + 150;
  return (
    <AbsoluteFill style={{overflow: 'hidden', fontFamily: SANS}}>
      {/* 2026-11-19 吸管量的原片光场：输入条上方一大片亮蓝青、下方一大片绿青，右半边暗绿；不是暗底中间一团 */}
      <AbsoluteFill style={{background: 'linear-gradient(90deg, #0d2c30 0%, #0b2428 45%, #081a14 70%, #06140e 100%)'}} />
      <GlowSpot x={420} y={by - 260} rx={1000} ry={430} rgb="45,135,160" a={0.5 + 0.2 * kf(s, [[6.0, 0], [6.27, 1], [6.55, 0.85], [6.95, 0.1]])} />{/* 2026-11-21 量原片左上角：平时比我们暗（蓝 80 vs 112），按下后 6.0–6.27 亮起来一下（→105），6.9 又暗回去——是按钮那一下的余光 */}
      <GlowSpot x={460} y={by + 250} rx={1000} ry={420} rgb="40,145,105" a={0.62} />
      <GlowSpot x={bx - 60} y={by} rx={520} ry={300} rgb="60,140,170" a={0.35} />
      {/* 2026-11-21 用户：按完之后旁边有光扩散，像雨滴落到海面的波纹。逐帧量原片（以按钮为圆心、一圈圈量亮度）：
          5.93 按下的同时，从输入条边缘往外推出一圈「点阵被点亮」的波，约 1600px/s；6.25、6.55 又各推一圈，一圈比一圈弱；
          波扫过的地方点阵留着微亮，没扫到的地方是黑的；同时输入条周围那团青光越来越亮（亮度 82→97）。之前点阵是 6.0 整片一起淡入，没有波 */}
      <GlowSpot x={bx - 40} y={by} rx={700 + 260 * clamp((s - 5.95) / 0.9)} ry={380 + 120 * clamp((s - 5.95) / 0.9)} rgb="60,190,170" a={0.3 + 0.4 * clamp((s - 5.95) / 0.9)} />
      {s > 5.93 && (
        <AbsoluteFill>
          {Array.from({length: 440}, (_, i) => { const c = i % 20, r = Math.floor(i / 20); const xx = c * 108 + (r % 2) * 54, yy = r * 54; /* 原片是菱形格：横距约 108、竖距 54、隔行错半格 */
            const d = Math.max(0, Math.hypot(xx - bx, yy - by) - 180); /* 2026-11-21 再对原片：波纹是从按钮往外一圈圈扩的（输入条上方左边要到 6.3 才被扫到），不是从整条输入条的边缘同时往外推 */
            const tw = 0.6 + 0.4 * Math.sin(s * 6 + i * 1.7);
            let w = 0; [[5.93, 1], [6.25, 0.7], [6.55, 0.45]].forEach(([t0, amp]) => { const f = (s - t0) * 1600; if (f > 0) w += amp * Math.exp(-Math.pow((d - f) / 85, 2)) * clamp(1 - f / 2600); });
            const reveal = clamp(((s - 5.93) * 1600 - d) / 120); /* 波扫过才留微亮 */
            const fall = clamp(1.15 - d / 1100); const near = clamp((d - 170) / 220); /* 原片按钮周围那团亮光里没有点，点只在外面暗的地方 */
            const o = near * Math.min(1, (0.22 * tw * reveal * fall + 1.8 * w) * (0.5 + hash(i) * 0.5)); const sz = 4 + 8 * clamp(d / 650) + 3 * w; /* 原片离输入条越远点越大 */
            if (o < 0.02) return null;
            return <div key={i} style={{position: 'absolute', left: xx, top: yy, width: sz, height: sz, marginLeft: -sz / 2, marginTop: -sz / 2, borderRadius: 1, transform: 'rotate(45deg)', background: w > 0.3 ? '#9dffc8' : '#4bf59a', opacity: o, boxShadow: `0 0 ${5 + 12 * w}px rgba(90,255,180,${0.6 + 0.4 * w})`}} />; })}
        </AbsoluteFill>
      )}
      {/* 输入条右端 */}
      <div style={{position: 'absolute', left: right - 2400, top: by - H / 2, width: 2400, height: H, borderRadius: H / 2, background: 'linear-gradient(180deg, rgba(22,50,52,0.94) 0%, rgba(14,36,38,0.94) 100%)', boxShadow: `inset 0 3px 0 rgba(110,150,255,0.22), inset 0 10px 18px rgba(90,130,255,0.12), inset 0 -3px 0 rgba(80,245,160,0.3), inset 0 -12px 18px rgba(70,235,150,0.12), 0 -14px 60px rgba(70,110,255,0.22), 0 18px 80px rgba(60,230,150,0.3), 0 0 0 2px rgba(255,255,255,0.05)` /* 2026-11-19 原片输入条是半透明的深青色、描边平时是暗的（亮的只有绕着走的那两道光）；之前整圈都是死亮的蓝/绿线 */}} />
      <div style={{position: 'absolute', left: right - 2400, top: by - H / 2, width: 2400, height: H, borderRadius: H / 2, background: 'linear-gradient(90deg, rgba(80,120,255,0) 60%, rgba(80,120,255,0.12) 80%, rgba(70,235,150,0.18) 100%)'}} />
      {/* 2026-11-19 逐帧（放大看）：描边上有两道光一直在绕——绿光从右端顺时针转到底边、再沿底边往左走（4.95 右 → 5.4 键下面 → 6.6 底边偏左），
          蓝光从上沿转到右端（6.6 右端整圈发蓝）；6.4 起底边外面还有一条越来越亮的绿色光带。之前描边是死的、一直一样亮 */}
      {(() => { const g = kf(s, [[4.87, 85], [5.15, 130], [5.4, 175], [5.8, 205], [6.2, 218], [7.1, 224]]); /* 再往左就是底边的长直线了，交给下面那条绿光带（锥形渐变在左边会把上沿也照绿） */ const bl = kf(s, [[4.87, -40], [5.4, 0], [5.8, 40], [6.6, 88], [7.1, 100]]);
        const ring = `conic-gradient(from 0deg at ${D / 2 + 150}px ${H / 2}px, rgba(90,130,255,0.1) 0deg, rgba(100,140,255,0.15) ${bl - 45}deg, rgba(120,160,255,0.95) ${bl - 10}deg, rgba(160,190,255,1) ${bl}deg, rgba(90,130,255,0.15) ${bl + 35}deg, rgba(60,200,160,0.12) ${g - 50}deg, rgba(90,255,170,0.95) ${g - 10}deg, rgba(210,255,225,1) ${g}deg, rgba(90,255,170,0.9) ${g + 12}deg, rgba(70,160,200,0.12) ${g + 55}deg, rgba(90,130,255,0.1) 360deg)`;
        const box = {position: 'absolute' as const, left: right - 2400 - 6, top: by - H / 2 - 6, width: 2412, height: H + 12, borderRadius: H / 2 + 6, padding: 6, boxSizing: 'border-box' as const, background: ring.replace(`at ${D / 2 + 150}px ${H / 2}px`, `at 2256px ${H / 2 + 6}px`), WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude'} as React.CSSProperties;
        return <><div style={{position: 'absolute', inset: 0, filter: 'blur(26px)', opacity: 1}}><div style={{...box, padding: 22}} /></div><div style={{position: 'absolute', inset: 0, filter: 'blur(7px)'}}><div style={{...box, padding: 9}} /></div><div style={{...box, padding: 4, filter: 'blur(1px)'}} /></>; /* 模糊要套在遮罩外面一层，不然光晕会被遮罩切掉、出不了边 */ })()}
      {s > 6.3 && <div style={{position: 'absolute', left: right - 1800, top: by + H / 2 + 4, width: 1500, height: 16, borderRadius: 8, background: 'linear-gradient(90deg, rgba(80,255,170,0) 0%, rgba(110,255,180,0.95) 45%, rgba(80,255,170,0.6) 80%, rgba(80,255,170,0) 100%)', filter: 'blur(5px)', opacity: clamp((s - 6.3) / 0.5), transform: `translateX(${-(s - 6.3) * 260}px)`}} />}
      <div style={{position: 'absolute', left: right - 2400, top: by - H / 2, width: 2400, height: H, borderRadius: H / 2, padding: 38, boxSizing: 'border-box', background: 'linear-gradient(90deg, rgba(30,62,160,0) 84%, rgba(34,70,175,0.7) 92%, rgba(28,58,150,0.92) 98%), linear-gradient(180deg, rgba(90,140,240,0.14), rgba(30,60,160,0) 25%, rgba(30,60,160,0) 75%, rgba(90,140,240,0.12))', WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude', filter: 'blur(3px)', opacity: 0.6 * clamp((s - 5.85) / 0.45)} as React.CSSProperties} />{/* 2026-11-21 输入条右端那圈宽蓝边带（原片 5.9 起才慢慢变蓝，之前是细边 + 绕键转的绿光）（原片键外面一圈 ≈40px 的蓝，顺着胶囊轮廓往上下边收细） */}
      <div style={{position: 'absolute', left: bx - D / 2, top: by - D / 2, width: D, height: D, borderRadius: '50%', background: 'radial-gradient(circle at 38% 32%, #ffffff 0%, #f6f8f8 50%, #e2e7e7 80%, #c9cfcf 100%)', transform: `scale(${kf(s, [[5.9, 1], [5.96, 0.95], [6.01, 0.84], [6.04, 0.84], [6.1, 0.9], [6.17, 0.955], [6.27, 0.99], [6.4, 1.012], [6.85, 1.01], [6.95, 0.97], [7.05, 0.95]])})`, filter: `blur(${0.6 + 1.2 * kf(s, [[5.92, 0], [6.0, 1], [6.2, 0.15], [6.8, 0], [6.92, 1], [7.06, 1]])}px)`, /* 2026-11-21 用户截图 + 逐帧量键的大小：原片 5.93 开始按下，6.03 缩到 84%（半径 56.5→47.3），再弹回来，6.4 略大一点（101%）停住。之前我们把 6.8 镜头拉走时的变小误当成按下 */ /* 原片发送键是有体积的白色圆珠（右下暗一点、边缘软），嵌在输入条右端的一个暗色凹槽里 */ boxShadow: (() => { /* 2026-11-21 逐帧放大：原片键四周没有暗色凹槽和细圈，是直接坐在输入条右端那圈很宽的蓝色边带里；6.8–7.0 被按下：顶边一道白高光、底部一弯灰色"陷进去"的阴影、左边映出青绿光，键整体糊一点、缩一点 */
          const press = kf(s, [[5.92, 0], [6.01, 1], [6.1, 0.75], [6.4, 0.1], [6.8, 0.1], [6.92, 0.6], [7.06, 0.6]]);
          /* 2026-11-21 用户：第 5 秒按钮没有点击效果。逐帧放大原片 4.9–5.8：键周围有一团很亮的绿光贴着键边绕着转（4.93 右 → 5.14 下 → 5.47 左下 → 5.8 左），这时候还没有蓝边带；5.9 起才慢慢变蓝 */
          const ga = kf(s, [[4.88, 80], [5.0, 100], [5.07, 135], [5.14, 165], [5.27, 192], [5.47, 228], [5.6, 255], [5.8, 272], [6.2, 290]]) * Math.PI / 180;
          const gi = kf(s, [[4.86, 0.6], [4.95, 1], [5.6, 1], [5.9, 0.6], [6.3, 0.15], [7.1, 0.1]]);
          const gx = Math.sin(ga), gy = -Math.cos(ga);
          return `${gx * 9}px ${gy * 9}px 4px 1px rgba(190,255,215,${0.6 * gi}), ${gx * 15}px ${gy * 15}px 14px 2px rgba(110,255,170,${Math.min(1, 0.95 * gi)}), ${gx * 24}px ${gy * 24}px 34px 2px rgba(70,240,150,${0.75 * gi}), ${gx * 36}px ${gy * 36}px 70px 4px rgba(60,220,140,${0.4 * gi}), ${-gx * 3}px ${-gy * 3}px 3px rgba(8,26,34,${0.55 * gi}), inset ${-10 + 10 * press}px ${-12 - 8 * press}px ${22}px rgba(0,30,30,${0.18 + 0.22 * press}), 5px 7px 2px rgba(8,24,34,0.5), inset 0 ${7 * press}px 9px rgba(255,255,255,${0.95 * press}), ${-14 - 4 * press}px 2px ${26 + 6 * press}px 2px rgba(90,255,190,${0.16 + 0.28 * press}), 14px 0 30px 4px rgba(90,140,255,${0.35 + 0.2 * clamp((s - 6.2) / 0.4)}), 0 ${12 - 6 * press}px ${26 - 8 * press}px rgba(0,0,0,0.45)`; })(), display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <svg width={92} height={92} viewBox="0 0 24 24"><path d="M12 19V5M6 11l6-6 6 6" fill="none" stroke="#111" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" /></svg>
      </div>
      <div style={{position: 'absolute', left: bx - 960 + 60, top: by, transform: 'translateY(-52%)', fontSize: 150, color: '#c9d2d2', fontWeight: 400, whiteSpace: 'nowrap', letterSpacing: '0.02em', display: 'flex'}}>{B.map((c, i) => { const k = clamp((s - 5.08 - (i / B.length) * 0.44) / 0.18); return <span key={i} style={{opacity: k, filter: k < 1 ? `blur(${(1 - k) * 12}px)` : undefined}}>{c}</span>; })}</div>{/* 原片字是一个个糊着出来再变清（不是一下蹦出来） */}
      <div style={{position: 'absolute', right: 36, bottom: 26, fontSize: 20, color: 'rgba(200,230,220,0.45)', letterSpacing: '0.06em'}}>{x.note}</div>
    </AbsoluteFill>
  );
};

if (checkContract(CODE_FLYTHROUGH_CONTRACT).length) throw new Error(checkContract(CODE_FLYTHROUGH_CONTRACT).join('；'));
export const CodeFlythroughGenerate: React.FC = () => <CodeFlythroughGroup />;
