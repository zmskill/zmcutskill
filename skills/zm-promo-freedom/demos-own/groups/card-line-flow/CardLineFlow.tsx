// 【镜头组】card-line-flow：黑红底，红色图标砖和通知卡散开 → 镜头一甩，跟着一条弯曲白线从「方案卡」画到「策略卡」→ 再往右：协调人小卡、三个头像冒出来，
//   两条线汇到右边的角色卡 → 一条线连到项目卡，项目卡展开、进度从 0% 涨到 25%、卡片放大（038-D 一拍，功能演示核心）
// 学的动作（NoorMalik · Teamflow 18.2–25.5s，30fps 逐帧量过）：
//   世界坐标以 20.2s 的画面为准（2026-11-19 镜头 18.2–20.3 改成逐帧跟踪方案卡得到的路径，开场几张卡的位置按 18.9 那帧重量）；旧：镜头（左上角）18.3 (−1200,−760) → 18.7 (−1160,−724) → 19.3 (−1068,−548) → 19.6 (−120,−68) 一甩 → 20.3 (0,0)
//   → 21.1 (800,4) → 21.7 (1032,4) → 22.6 (1060,4) → 23.2 (1250,−60) → 23.5 (2290,−220) → 24.1 (2300,−232)
//   方案卡 (0,82) 730×414、策略卡 (1176,564) 732×412、协调卡 (1362,144) 584×124、角色卡 (2300,374) 390×450、项目卡 (3040,68) 610×470（23.5 起镜头 2440 一下甩过去，角色卡只露右边一截）
//   线：方案→策略 19.5–20.1 画出；协调→角色 21.0–22.5；策略→角色 21.4–22.5；角色→项目 22.9–23.5，线头带白点
//   三个头像 21.0–21.4 在策略卡右上角冒出，22.0–22.5 飞进角色卡；项目卡 23.4 先只有进度条，23.9 展开；0→1→5→18→25%；25.0–25.4 放大 1.43 倍
// 我们的内容：中文团队协作场景（方案 · 小雨 / 策略 · 阿杰 / 项目协调 / 官网改版），头像用素材库真人照片。
import React from 'react';
import {smoothKf} from '../_kit/smoothKey';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {GroupContract, checkContract, outputDuration, planExtras, toSource} from '../../../assets/lib/helpers/groupClock';

const FPS = 30;
const S0 = 18.2;
export const CARD_LINE_FLOW_CONTRACT: GroupContract = {
  sourceDuration: 219 / 30,
  fps: 30,
  motion: [[0, 3.3], [3.4, 219 / 30]],
  holds: [{at: 3.35, maxExtra: 1.5}],
  landmarks: {icons: 0.1, whip: 1.1, line1: 1.3, line2: 2.8, avatars: 2.8, roles: 4.1, line4: 4.7, project: 5.2, zoom: 6.8},
  sfx: [
    {at: 'icons', type: '弹出', note: '几下 pop', tail: 0.4, volume: 0.3},
    {at: 'whip', type: '短甩', note: '甩 whoosh', volume: 0.45},
    {at: 'line1', type: '短甩', note: '画线 swish', volume: 0.3},
    {at: 'avatars', type: '短甩', note: '三下 pop', tail: 0.4, volume: 0.3},
    {at: 'line4', type: '短甩', note: '画线 swish', volume: 0.3},
    {at: 'project', type: '上扬铺垫', note: '进度 riser', tail: 2.0, volume: 0.3},
  ],
  inputs: {},
};
export const planCardLine = (sec: number) => planExtras(CARD_LINE_FLOW_CONTRACT, sec);
export const cardLineFrames = (extras: number[]) => Math.round(outputDuration(CARD_LINE_FLOW_CONTRACT, extras) * FPS);
export const CARD_LINE_FLOW_DURATION = 219;

export const SANS = '"Poppins","PingFang SC","Noto Sans CJK SC","Noto Sans SC",sans-serif';
export const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
export const mix = (a: number, b: number, k: number) => a + (b - a) * k;
export const eo = (u: number) => 1 - Math.pow(1 - clamp(u), 3);
export const eio = (u: number) => { const x = clamp(u); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
export const back = (u: number, k = 1.6) => { const x = clamp(u) - 1; return 1 + (k + 1) * x * x * x + k * x * x; };
export const kf = (t: number, K: number[][], e: (u: number) => number = eio) => { if (K.length > 2 && K.every((k, j) => j === 0 || k[0] > K[j - 1][0])) return smoothKf(t, K); if (t <= K[0][0]) return K[0][1]; for (let i = 0; i < K.length - 1; i++) if (t <= K[i + 1][0]) return mix(K[i][1], K[i + 1][1], e((t - K[i][0]) / (K[i + 1][0] - K[i][0]))); return K[K.length - 1][1]; };
export const face = (k: string) => staticFile(`library/faces/${k}.jpg`);
export const RED = 'linear-gradient(135deg, #4a0006 0%, #8a000c 55%, #c3000f 100%)';
export const Av: React.FC<{k: string; size: number; style?: React.CSSProperties}> = ({k, size, style}) => (
  <div style={{width: size, height: size, borderRadius: '50%', overflow: 'hidden', boxShadow: '0 0 0 3px rgba(255,255,255,0.9)', flex: 'none', ...style}}><Img src={face(k)} style={{width: '100%', height: '100%', objectFit: 'cover'}} /></div>
);
export const RedBox: React.FC<{w: number; h: number; children?: React.ReactNode; style?: React.CSSProperties; r?: number}> = ({w, h, children, style, r = 14}) => (
  <div style={{position: 'relative', width: w, height: h, borderRadius: r, background: RED, boxShadow: '0 0 0 1.5px rgba(255,90,90,0.35), 0 20px 50px rgba(0,0,0,0.5)', fontFamily: SANS, color: '#fff', overflow: 'hidden', ...style}}>{children}</div>
);
/** 画到一半的线 + 线头白点 */
export const DrawPath: React.FC<{d: string; k: number; len?: number; stroke?: string; dot?: boolean; w?: number}> = ({d, k, len = 1400, stroke = '#fff', dot = true, w = 4}) => {
  if (k <= 0) return null;
  // 2026-11-19 原片线头一直带着一个圆点往前走（画的时候就有），不是画完才出现：用 CSS offset-path 让圆点沿同一条路径走
  return (<>
    {dot && k < 1 && <div style={{position: 'absolute', left: 0, top: 0, width: w * 6, height: w * 6, marginLeft: -w * 3, marginTop: -w * 3, borderRadius: '50%', background: stroke, offsetPath: `path('${d}')`, offsetDistance: `${(clamp(k) * 100).toFixed(2)}%`, offsetRotate: '0deg', offsetAnchor: '50% 50%'} as React.CSSProperties} />}
    <svg width={8000} height={4000} viewBox="-3000 -1500 8000 4000" style={{position: 'absolute', left: -3000, top: -1500, overflow: 'visible'}}>
      <path d={d} fill="none" stroke={stroke} strokeWidth={w} strokeLinecap="round" pathLength={1} style={{strokeDasharray: 1, strokeDashoffset: 1 - clamp(k)}} />
      {dot && k >= 1 && (() => { const m = d.match(/(-?[\d.]+)[ ,](-?[\d.]+)\s*$/); return m ? <circle cx={+m[1]} cy={+m[2]} r={w * 3} fill={stroke} /> : null; })()}
    </svg>
  </>);
};

export const CardLineFlowGroup: React.FC<{extras?: number[]}> = ({extras = [0]}) => {
  const tt = useCurrentFrame() / FPS;
  const s = toSource(tt, CARD_LINE_FLOW_CONTRACT, extras) + S0;
  const held = tt - (s - S0);
  // 2026-11-19 镜头按原片逐帧跟踪（camtrack.py）重排：两次横甩都是「先慢后猛」的加速甩（20.75 才起步、21.15 已走完 82%），之前我们提前 0.4s 起步、匀速走，看起来一顿一顿
  const camX = kf(s, [[18.2, -1222], [18.9, -1218], [18.967, -1224], [19.033, -1222], [19.1, -1208], [19.167, -1182], [19.233, -1138], [19.3, -1064], [19.367, -928], [19.433, -616], [19.5, -310], [19.567, -176], [19.633, -104], [19.7, -58], [19.767, -32], [19.833, -16], [19.9, -8], [20.0, -6], [20.3, 0], [20.55, 3], [20.75, 36], [20.95, 196], [21.15, 846], [21.35, 998], [21.54, 1032], [21.74, 1037], [22.14, 1045], [22.54, 1053], [22.8, 1062], [23.0, 1091], [23.2, 1255], [23.34, 1741], [23.4, 2111], [23.54, 2353], [23.74, 2450], [23.94, 2470], [25.5, 2480]]) + held * 3;
  const camY = kf(s, [[18.2, -668], [18.9, -650], [18.967, -638], [19.033, -628], [19.1, -618], [19.167, -604], [19.233, -582], [19.3, -544], [19.367, -474], [19.433, -312], [19.5, -154], [19.567, -86], [19.633, -48], [19.7, -26], [19.767, -12], [19.833, -4], [19.9, -2], [20.3, 0], [21.1, 4], [22.8, 4], [23.0, 0], [23.2, -24], [23.34, -105], [23.4, -161], [23.54, -199], [23.74, -213], [23.94, -232], [25.5, -235]]);
  // 第一次横甩的同时整幅退远 3.5%（21.0–21.35），之后一直保持；结尾是一个越来越快的推镜（以项目卡上的 (840,577) 为中心，25.35 已经 1.68 倍）
  const zz = kf(s, [[20.95, 1], [21.14, 0.989], [21.34, 0.966], [25.5, 0.968]]);
  const zEnd = kf(s, [[25.05, 1], [25.17, 1.13], [25.23, 1.22], [25.3, 1.43], [25.37, 3.2], [25.43, 4.5], [25.5, 5.6]]); // 2026-11-19 逐帧：结尾推镜越来越猛，25.37 已经 3 倍多、卡片铺满画面，同时卡片变成浅灰→粉（接下一镜的白底）
  const pop = (t0: number) => back(clamp((s - t0) / 0.25));
  // 2026-11-19 多元素跟踪拟合（multitrack.py，6 个元素，残差 < 10px）：开场不是一个个弹出来，而是整团卡片已经在、绕画面中心「甩」进来——
  //   每张卡沿圆弧转到位（卡片本身保持正立），转角按文档砖逐帧位置反算：18.41 53° → 18.54 26° → 18.67 12° → 18.81 5° → 19.0 0°（指数衰减）
  const orbA = (s < 19.3 ? kf(s, [[18.2, 80], [18.34, 69], [18.407, 53], [18.473, 36.6], [18.54, 25.7], [18.607, 17.8], [18.673, 12.1], [18.74, 7.9], [18.807, 4.8], [18.873, 2.5], [18.94, 0.9], [19.007, 0], [19.3, 0]]) : 0) * Math.PI / 180;
  const orb = (wx: number, wy: number) => { const px = wx - camX - 960, py = wy - camY - 540; const c = Math.cos(orbA), sn = Math.sin(orbA); return `translate(${(c * px - sn * py - px).toFixed(1)}px, ${(sn * px + c * py - py).toFixed(1)}px)`; };
  const T = (t: string, fs: number, st?: React.CSSProperties) => <div style={{fontSize: fs, whiteSpace: 'nowrap', ...st}}>{t}</div>;
  // 头像位置：策略卡右上角 → 角色卡
  // 2026-11-19 头像按原片逐帧位置重做：21.0 起在策略卡上沿右边排成一排（右边那个先出），21.6 起一起往右上飘、22.0 到线交叉的地方，22.4 到角色卡左边，22.7 落进三行
  const avs = [{k: 'f03', at: 21.13, X: [[21.55, 1671], [21.8, 1790], [22.0, 1917], [22.4, 2220], [22.7, 2370]], Y: [[21.55, 561], [21.8, 440], [22.0, 345], [22.4, 339], [22.7, 454]]}, {k: 'f01', at: 21.07, X: [[21.55, 1755], [21.8, 1870], [22.0, 1995], [22.4, 2310], [22.7, 2376]], Y: [[21.55, 561], [21.8, 425], [22.0, 315], [22.4, 471], [22.7, 616]]}, {k: 'm02', at: 21.0, X: [[21.55, 1836], [21.8, 1950], [22.0, 2076], [22.4, 2370], [22.7, 2376]], Y: [[21.55, 561], [21.8, 425], [22.0, 315], [22.4, 705], [22.7, 726]]}];
  const pct = Math.round(kf(s, [[23.6, 0], [24.1, 1], [24.4, 5], [25.0, 18], [25.3, 25], [25.37, 28], [25.43, 30], [25.5, 31]], (u) => u));
  const full = eio(clamp((s - 23.72) / 0.22)); // 2026-11-19 逐帧：23.72 起暗卡往下长成红卡、23.94 长完（之前 23.85 才开始、用 eo 第一帧冲得太快，测出一帧跳变）
  const fullC = clamp((s - 23.88) / 0.2);
  const zoom = 0; // 2026-11-19 结尾推镜改成整幅一起推（见 zEnd），不再只放大项目卡
  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden', fontFamily: SANS}}>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 70% 80% at 55% 45%, rgba(120,0,10,0.75) 0%, rgba(40,0,4,0.6) 50%, rgba(0,0,0,0) 100%)'}} />
      <div style={{position: 'absolute', inset: 0, transformOrigin: '740px 545px', transform: `scale(${zEnd})`}}><div style={{position: 'absolute', inset: 0, transformOrigin: '960px 540px', transform: `scale(${zz})`}}>
      <div style={{position: 'absolute', left: -camX, top: -camY}}>
        {/* 图标砖 + 通知卡 */}
        {[{x: -894, y: -440, sz: 130, ic: '💡', t: 18.3}, {x: -749, y: -296, sz: 192, ic: 'bar', t: 18.25}, {x: -878, y: 79, sz: 192, ic: 'doc', t: 18.2}].map((b, i) => (
          <div key={i} style={{position: 'absolute', left: b.x, top: b.y, width: b.sz, height: b.sz, borderRadius: 10, background: 'linear-gradient(180deg,#c3000f,#7a0008)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: orb(b.x + b.sz / 2, b.y + b.sz / 2)}}>
            <svg width={b.sz * 0.42} height={b.sz * 0.42} viewBox="0 0 24 24">{b.ic === 'bar' ? <path d="M4 20h16M6 17V11M10 17V6M14 17V9M18 17V4" stroke="#fff" strokeWidth={2.6} strokeLinecap="round" /> : b.ic === 'doc' ? <><rect x={5} y={3} width={14} height={18} rx={2} fill="#fff" /><path d="M8 8h8M8 11h8M8 14h5M14 17l1.5 1.5L18 16" stroke="#8a000c" strokeWidth={1.6} fill="none" strokeLinecap="round" /></> : <path d="M12 3a6 6 0 0 0-3.5 10.9V17h7v-3.1A6 6 0 0 0 12 3zM9.5 20h5" fill="#fff" stroke="#fff" strokeWidth={1.4} />}</svg>
          </div>
        ))}
        {[{x: -563, y: -479, w: 416, h: 120, t: '通知', sub: '3 条更新等了 2 小时', ic: '●', at: 18.4}, {x: -52, y: -328, w: 426, h: 144, t: '团队聊天', sub: '阿亮：“文档可以看了”', ic: '…', at: 18.5}].map((c, i) => (
          <div key={i} style={{position: 'absolute', left: c.x, top: c.y, transform: orb(c.x + c.w / 2, c.y + c.h / 2)}}>
            <RedBox w={c.w} h={c.h} r={8}><div style={{position: 'absolute', left: 24, top: c.h / 2 - 32, width: 64, height: 64, borderRadius: 32, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, color: '#d0000f', fontWeight: 700}}>{c.ic}</div><div style={{position: 'absolute', left: 110, top: c.h / 2 - 28}}>{T(c.t, 22, {fontWeight: 500})}{T(c.sub, 15, {opacity: 0.85, marginTop: 4})}</div></RedBox>
          </div>
        ))}
        {/* 方案卡 */}
        <div style={{position: 'absolute', left: 0, top: 82, transform: orb(365, 82 + 207)}}>
          <RedBox w={730} h={414}><Av k="f01" size={76} style={{position: 'absolute', left: 34, top: 28}} /><div style={{position: 'absolute', left: 150, top: 46}}>{T('方案 · 小雨', 32)}</div>
            <div style={{position: 'absolute', left: 52, top: 150}}>{T('重做新用户引导', 32, {fontWeight: 600})}{T('让新用户更快看懂产品、更快上手。', 28, {marginTop: 22, opacity: 0.92})}</div>
            <div style={{position: 'absolute', right: 40, bottom: 34}}>{T('12 票 · 4 条评论', 18, {opacity: 0.8})}</div></RedBox>
        </div>
        <DrawPath d="M730 280 C900 280, 1000 300, 1000 520 S1100 800, 1170 800" k={eo(clamp((s - 19.27) / 0.17))} />{/* 2026-11-19 逐帧：原片线 19.3 起画、19.42 已经画到头（之前晚 0.25s、画得也慢） */}
        {/* 策略卡 */}
        {/* 2026-11-19 逐帧（提亮看）：策略卡不是弹出来的——19.4 起这个位置就有一张没内容的暗卡（跟着镜头进来），20.03–20.15 红底和文字淡进来 */}
        {s > 19.3 && <div style={{position: 'absolute', left: 1176, top: 564, width: 732, height: 412, borderRadius: 12, background: 'rgba(22,2,5,0.85)', boxShadow: '0 0 0 1px rgba(255,90,90,0.07), 0 20px 50px rgba(0,0,0,0.5)', opacity: 1 - clamp((s - 20.15) / 0.1)}} />}
        {s > 20.0 && (
          <div style={{position: 'absolute', left: 1176, top: 564, opacity: eo(clamp((s - 20.03) / 0.12))}}>
            <RedBox w={732} h={412}><Av k="m02" size={76} style={{position: 'absolute', left: 38, top: 28}} /><div style={{position: 'absolute', left: 160, top: 46}}>{T('策略 · 阿杰', 30)}</div>
              <div style={{position: 'absolute', left: 70, top: 160, lineHeight: 1.75}}>{T('重点：简单。', 24, {fontWeight: 600, marginBottom: 8})}{T('目标：减少阻力', 28)}{T('优先级：高', 28)}{T('下一步：做一个更简单的首次流程', 28)}</div></RedBox>
          </div>
        )}
        {/* 协调卡 */}
        {s > 20.85 && <div style={{position: 'absolute', left: 1362, top: 144, transform: `translateX(${(1 - eo(clamp((s - 20.85) / 0.3))) * 80}px)`, opacity: clamp((s - 20.85) / 0.15)}}><RedBox w={584} h={124} r={8}><Av k="f03" size={74} style={{position: 'absolute', left: 26, top: 25}} /><div style={{position: 'absolute', left: 130, top: 38}}>{T('项目协调', 32, {fontWeight: 500})}</div></RedBox></div>}
        <DrawPath d="M1946 206 C2040 206, 2070 260, 2072 420 C2074 560, 2160 634, 2292 634" k={eio(clamp((s - 21.15) / 1.05))} />{/* 2026-11-19 原片两条线是交叉的：协调卡的线往下接角色卡第二行、策略卡的线往上接第一行 */}
        <DrawPath d="M1908 904 C2010 904, 2060 880, 2070 760 C2080 600, 2170 474, 2296 474" k={eio(clamp((s - 21.35) / 0.85))} />
        {/* 角色卡 */}
        {s > 21.1 && (
          <div style={{position: 'absolute', left: 2300, top: 374, opacity: clamp((s - 21.1) / 0.3)}}>
            <RedBox w={390} h={450} style={{background: s < 22.3 ? 'rgba(60,0,8,0.45)' : RED, boxShadow: s < 22.3 ? '0 0 0 1px rgba(255,80,80,0.15)' : undefined}}>
              {s > 22.3 && <><div style={{position: 'absolute', left: 0, right: 0, top: 168, height: 2, background: 'rgba(255,255,255,0.3)'}} />
                {[['项目负责人', 80, 22.72], ['设计师', 242, 22.4], ['策略', 352, 22.4]].map(([t, y, at], i) => <div key={i} style={{position: 'absolute', left: 150, top: (y as number) - 18, opacity: clamp((s - (at as number)) / 0.2)}}>{T(t as string, 30)}</div>)}</>}
            </RedBox>
          </div>
        )}
        {avs.map((a, i) => { if (s < a.at) return null; const k = pop(a.at); const x = kf(s, a.X), y = kf(s, a.Y); return <Av key={i} k={a.k} size={84} style={{position: 'absolute', left: x - 42, top: y - 42, transform: `scale(${k})`, zIndex: 5}} />; })}
        <DrawPath d="M2690 680 C2840 680, 2900 600, 2900 450 S2980 316, 3038 316" k={clamp((s - 22.9) / 0.6)} />
        {/* 项目卡 */}
        {s > 23.35 && (
          <div style={{position: 'absolute', left: 3040, top: 68, transformOrigin: '0 0', transform: `translate(${-130 * zoom}px, ${-90 * zoom}px) scale(${1 + 0.43 * zoom})`, opacity: clamp((s - 23.35) / 0.15)}}>
            <RedBox w={610} h={mix(240, 470, full)} style={{top: mix(110, 0, full), background: `linear-gradient(180deg, rgba(42,10,14,${mix(0.7, 1, full)}) 0%, rgba(106,0,16,${full}) 60%, rgba(168,0,15,${full}) 100%)`}}>{/* 展开前是一张没内容的暗卡（原片 23.5 就这样），里面只有进度条那一行 */}
              <div style={{opacity: fullC}}>
                <div style={{position: 'absolute', left: 36, top: 36, width: 70, height: 70, borderRadius: 10, background: '#8a1a24', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, color: '#fff'}}>↗</div>
                <div style={{position: 'absolute', left: 136, top: 30}}>{T('项目', 22, {opacity: 0.9})}{T('官网改版', 36, {fontWeight: 500})}<div style={{marginTop: 8, display: 'inline-block', padding: '4px 16px', borderRadius: 14, background: '#c9f2c9', color: '#2a7a2a', fontSize: 16}}>● 进行中</div></div>
                {['调研', '设计', '开发', '评审'].map((t, i) => <div key={t} style={{position: 'absolute', left: 36 + i * 168, top: 290, width: 60, textAlign: 'center'}}><div style={{width: 40, height: 40, margin: '0 auto', borderRadius: 20, boxShadow: '0 0 0 2px rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20}}>{i === 0 && pct > 10 ? '✓' : ''}</div>{T(t, 15, {marginTop: 8, opacity: 0.85})}</div>)}
                <div style={{position: 'absolute', left: 50, top: 392, width: 236, height: 64, borderRadius: 8, background: 'rgba(0,0,0,0.25)', display: 'flex', alignItems: 'center', gap: 14, paddingLeft: 18, boxSizing: 'border-box'}}><div style={{width: 40, height: 40, borderRadius: 20, background: '#fff'}} /><div>{T('任务', 13, {opacity: 0.8})}{T('3/8 已完成', 20)}</div></div>
                <div style={{position: 'absolute', left: 320, top: 392, width: 236, height: 64, borderRadius: 8, background: 'rgba(0,0,0,0.25)', display: 'flex', alignItems: 'center', gap: 14, paddingLeft: 18, boxSizing: 'border-box'}}><div style={{width: 40, height: 40, borderRadius: 20, background: '#fff'}} /><div>{T('下个里程碑', 13, {opacity: 0.8})}{T('客户评审', 18, {fontWeight: 600})}</div></div>
              </div>
              <div style={{position: 'absolute', left: 28, top: mix(28, 160, full)}}>{T(`${pct} %`, 30, {fontWeight: 600})}{T('完成', 18, {opacity: 0.9})}</div>
              <div style={{position: 'absolute', left: 130, top: mix(48, 176, full), width: 440, height: 22, borderRadius: 11, background: 'rgba(255,255,255,0.85)'}}><div style={{width: `${pct}%`, height: '100%', borderRadius: 11, background: 'linear-gradient(90deg,#3ad16a,#7be38f)'}} /></div>
              <div style={{position: 'absolute', inset: 0, borderRadius: 12, mixBlendMode: 'screen', background: 'linear-gradient(180deg, #d2d2d2 0%, #c6c6c6 55%, rgba(210,70,90,0.25) 100%)', opacity: clamp((s - 25.25) / 0.14)}} />
            </RedBox>
          </div>
        )}
      </div>
      </div></div>
      {/* 2026-11-19 删掉之前加的「前景失焦暗卡」：提亮逐帧看，那其实是策略卡 / 角色卡出现之前的空暗卡，已经做在卡片本身上 */}
    </AbsoluteFill>
  );
};

if (checkContract(CARD_LINE_FLOW_CONTRACT).length) throw new Error(checkContract(CARD_LINE_FLOW_CONTRACT).join('；'));
export const CardLineFlow: React.FC = () => <CardLineFlowGroup />;
