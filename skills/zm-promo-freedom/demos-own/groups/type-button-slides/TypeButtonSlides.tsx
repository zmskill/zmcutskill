// 【镜头组】type-button-slides：黑底超大字逐字打「直接看演示文稿」（镜头从一个字的特写一路拉远，刚打的字是紫色、过一会变白）→
//   字一抖，一个紫色圆滑进来 → 硬切软光底：圆形发送键被光标点下（变黑）→ 松开起涟漪、变紫 → 圆被拉成一张透视的紫色卡、拍平、四角伸出白色辅助线 →
//   卡里一页一页冒出演示文稿，斜着叠成一摞（039-G 一拍，核心镜头）
// 学的动作（MdMizanurRahman · NotebookLM 30.4–36.5s，30fps 逐帧量过）：
//   30.45 第一个字特写（≈6.5 倍），30.85 两个字（≈4.6 倍），31.0–31.2 一路拉到 1 倍（字 140px），后面的字 31.05–31.5 飞快打完；字总在画面正中
//   每个字刚出来是紫色（淡紫→品红），0.3s 后 0.15s 变白；32.0 字抖动变形，紫圆从右边缘滑进；32.25 硬切
//   32.35 半透明紫圆键（≈300px）+ 光标，32.5–32.95 按下变黑，33.0 松开：白底灰圈 + 背景一圈圈涟漪，33.25 变成带灰色粗圈的紫圆，33.5 只剩紫圆
//   33.75 圆被拉成上宽下窄的透视卡（宽≈1740），34.0 拍平成 900×440，四条边延长成全屏白线，34.35 缩到 840×460
//   34.55 第一页出来（卡退到后面），34.8 第二页在左上后方，35.05 第三页右下前方，35.55 封面最前；每页 640×360、错开≈(165,95)；35.9 起整摞缩到 0.85、微微转
// 我们的内容：一句"直接看演示文稿"；四页是我们自己排的班车方案演示文稿（真照片），不用原片的人像。
import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {Grain} from '../../../assets/lib/helpers/polish';
import {GroupContract, checkContract, checkInputs, outputDuration, planExtras, toSource} from '../../../assets/lib/helpers/groupClock';
import {SANS, clamp, eio, eo, kf, mix, rs} from '../_kit/softAiKit';
import {GradCursor} from '../folder-type-dock/FolderTypeDock';

const FPS = 30;
const S0 = 30.533; // 2026-11-19 按反馈切掉开头：30.4–30.53 只有一根光标（原片这几帧还是上一镜收进来的过渡），我们这一拍从第一个字前一帧开始
export const TYPE_BUTTON_SLIDES_CONTRACT: GroupContract = {
  sourceDuration: 179 / 30,
  fps: 30,
  motion: [[0, 1.367], [1.467, 4.767], [4.867, 179 / 30]],
  holds: [{at: 1.417, maxExtra: 1}, {at: 4.817, maxExtra: 1.5}],
  landmarks: {type: 0.03, pull: 0.467, glitch: 1.467, cut: 1.717, press: 1.967, release: 2.467, card: 3.217, flat: 3.467, s1: 4.017, s2: 4.267, s3: 4.517, s4: 5.017},
  sfx: [
    {at: 'type', type: '键盘', note: '重击打字', tail: 1.4, volume: 0.4},
    {at: 'glitch', type: '轻tick', note: '数字抖动', volume: 0.3},
    {at: 'press', type: '点击', note: '按下 click', volume: 0.45},
    {at: 'release', type: '运镜', note: '涟漪 whoom', volume: 0.4},
    {at: 'card', type: '运镜', note: '拉伸 whoosh', volume: 0.4},
    {at: 's1', type: '弹出', note: '出页 pop', volume: 0.3},
    {at: 's2', type: '弹出', note: '出页 pop', volume: 0.3},
    {at: 's3', type: '弹出', note: '出页 pop', volume: 0.3},
    {at: 's4', type: '弹出', note: '出页 pop', volume: 0.35},
  ],
  inputs: {line: {maxChars: 9}},
};
export type SlideSpec = {kind: 'dark' | 'diagram' | 'photos' | 'cover'; title: string; sub: string; photos: string[]};
export type TbsInputs = {line: string; slides: SlideSpec[]};
export const TBS_DEFAULT_INPUTS: TbsInputs = {
  line: '直接看演示文稿',
  slides: [
    {kind: 'diagram', title: '方案总览', sub: '从需求到上线的四步', photos: ['travel/travel05']},
    {kind: 'dark', title: '现状：每天 3 小时在路上', sub: '问卷 · 312 份', photos: ['city/city5']},
    {kind: 'photos', title: '路线与站点规划', sub: '6 条线路 · 24 个站点', photos: ['travel/travel05', 'city/city2', 'travel/travel12']},
    {kind: 'cover', title: '校园班车出行方案', sub: '让每一次通勤都更省心', photos: ['city/city3']},
  ],
};
export const checkTbsInputs = (x: TbsInputs) => checkInputs(TYPE_BUTTON_SLIDES_CONTRACT, {line: x.line});
export const planTbs = (sec: number) => planExtras(TYPE_BUTTON_SLIDES_CONTRACT, sec);
export const tbsFrames = (extras: number[]) => Math.round(outputDuration(TYPE_BUTTON_SLIDES_CONTRACT, extras) * FPS);
export const TYPE_BUTTON_SLIDES_DURATION = 179;

const lin = (u: number) => u;
const P = (p: string) => staticFile(`library/photos/${p}.jpg`);
// 一页演示文稿（640×360）
export const SlidePage: React.FC<{sp: SlideSpec}> = ({sp}) => {
  const base: React.CSSProperties = {position: 'relative', width: 640, height: 360, borderRadius: 10, overflow: 'hidden', fontFamily: SANS, boxShadow: '0 12px 30px rgba(70,40,120,0.22), 0 0 0 6px rgba(255,255,255,0.55)'};
  if (sp.kind === 'dark') return (
    <div style={{...base, background: '#1b1a1f'}}>
      <Img src={P(sp.photos[0])} style={{position: 'absolute', right: 0, top: 0, width: '46%', height: '100%', objectFit: 'cover', opacity: 0.55}} />
      <div style={{position: 'absolute', left: 36, top: 40, width: 360, fontSize: 40, fontWeight: 800, color: '#fff', lineHeight: 1.15}}>{sp.title}</div>
      <div style={{position: 'absolute', left: 36, bottom: 36, fontSize: 18, color: '#c8b8ff'}}>{sp.sub}</div>
    </div>
  );
  if (sp.kind === 'diagram') return (
    <div style={{...base, background: '#fff'}}>
      <div style={{position: 'absolute', left: 30, top: 26, fontSize: 34, fontWeight: 800, color: '#1d1c22'}}>{sp.title}</div>
      <div style={{position: 'absolute', left: 30, top: 74, fontSize: 16, color: '#777'}}>{sp.sub}</div>
      {['调研', '路线', '试运行', '上线'].map((t, i) => (
        <React.Fragment key={t}>
          <div style={{position: 'absolute', left: 50 + i * 140, top: 230 - i * 34, width: 100, height: 40, borderRadius: 6, border: '1.5px solid #333', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#222', background: i === 3 ? '#efe6ff' : '#fff'}}>{t}</div>
          {i < 3 && <div style={{position: 'absolute', left: 150 + i * 140, top: 250 - i * 34, width: 40, height: 2, background: '#999'}} />}
        </React.Fragment>
      ))}
      <Img src={P(sp.photos[0])} style={{position: 'absolute', right: 26, top: 120, width: 110, height: 72, objectFit: 'cover', borderRadius: 4}} />
      <div style={{position: 'absolute', left: 30, bottom: 22, fontSize: 18, fontWeight: 700, color: '#1d1c22'}}>好的方案，先从一张路线草图开始。</div>
    </div>
  );
  if (sp.kind === 'photos') return (
    <div style={{...base, background: '#fff'}}>
      <div style={{position: 'absolute', left: 30, top: 24, fontSize: 30, fontWeight: 800, color: '#1d1c22'}}>{sp.title}</div>
      <div style={{position: 'absolute', left: 30, top: 66, fontSize: 16, color: '#8a6ad0'}}>{sp.sub}</div>
      {['早高峰', '午间', '晚高峰', '周末'].map((t, i) => <div key={t} style={{position: 'absolute', left: 30, top: 120 + i * 28, fontSize: 14, color: '#555'}}>· {t}</div>)}
      {sp.photos.map((p, i) => <Img key={p} src={P(p)} style={{position: 'absolute', left: 170 + i * 150, top: 120 + (i % 2) * 20, width: 140, height: 170, objectFit: 'cover', borderRadius: 6, filter: 'grayscale(0.35)'}} />)}
    </div>
  );
  return (
    <div style={{...base, background: '#efe9e0'}}>
      <Img src={P(sp.photos[0])} style={{position: 'absolute', right: 0, top: 0, width: '52%', height: '100%', objectFit: 'cover'}} />
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(90deg, #efe9e0 40%, rgba(239,233,224,0) 70%)'}} />
      <div style={{position: 'absolute', left: 32, top: 40, fontSize: 18, color: '#e0703a', fontStyle: 'italic'}}>演示文稿 · 2026</div>
      <div style={{position: 'absolute', left: 32, top: 74, width: 320, fontSize: 52, fontWeight: 900, color: '#2c2a33', lineHeight: 1.05}}>{sp.title}</div>
      <div style={{position: 'absolute', left: 32, bottom: 40, fontSize: 18, color: '#555'}}>{sp.sub}</div>
    </div>
  );
};
const Glow: React.FC<{s: number}> = ({s}) => (
  <AbsoluteFill style={{background: '#f3e3fc', overflow: 'hidden'}}>{/* 2026-11-20 吸管对比：原片底色是淡紫粉（≈244,225,253），中下部也透着粉紫，蓝带偏紫蓝；之前底色是灰白、整体发灰 */}
    <AbsoluteFill style={{background: `radial-gradient(ellipse 22% 42% at ${16 + (s - 32.25) * 2}% 40%, rgba(118,142,252,0.95) 0%, rgba(150,170,255,0) 100%)`}} />
    <AbsoluteFill style={{background: `radial-gradient(ellipse 24% 30% at ${30 + (s - 32.25) * 1.5}% 84%, rgba(214,128,246,0.78) 0%, rgba(220,150,246,0) 100%)`}} />
    <AbsoluteFill style={{background: `radial-gradient(ellipse 20% 22% at ${64 - (s - 32.25)}% 64%, rgba(236,180,252,0.6) 0%, rgba(236,190,252,0) 100%)`}} />
    <AbsoluteFill style={{background: `radial-gradient(ellipse 30% 40% at ${78 - (s - 32.25) * 2}% 20%, rgba(214,120,246,0.85) 0%, rgba(220,150,246,0) 100%)`}} />
    <AbsoluteFill style={{background: 'radial-gradient(ellipse 34% 30% at 20% 96%, rgba(214,130,246,0.8) 0%, rgba(220,150,246,0) 100%)'}} />
    <AbsoluteFill style={{background: 'radial-gradient(ellipse 24% 34% at 96% 80%, rgba(196,160,252,0.62) 0%, rgba(200,170,255,0) 100%)'}} />
  </AbsoluteFill>
);

export const TypeButtonSlidesGroup: React.FC<{inputs?: TbsInputs; extras?: number[]}> = ({inputs: x = TBS_DEFAULT_INPUTS, extras = [0, 0]}) => {
  const tt = useCurrentFrame() / FPS;
  const s = toSource(tt, TYPE_BUTTON_SLIDES_CONTRACT, extras) + S0;
  const held = tt - (s - S0);
  // ───── G1：黑底打字 ─────
  if (s < 32.25) {
    const L = Array.from(x.line);
    // 2026-11-18 逐帧：30.4–30.57 只有一根大光标；第一个字 30.58、第二个 30.75；特写倍数 6.6→5 慢慢退（不是一路拉远），31.03 一下跳回 1 倍，后面的字 31.05–31.5 飞快打完
    const tAt = (i: number) => (i === 0 ? 30.58 : i === 1 ? 30.75 : 31.05 + ((i - 2) / Math.max(1, L.length - 2)) * 0.45);
    const n = L.filter((_, i) => s >= tAt(i)).length;
    const cam = s < 31.05 ? kf(s, [[30.4, 5.9], [30.6, 5.6], [31.05, 4.25]]) : kf(s, [[31.05, 1.04], [31.4, 1.0], [32.25, 0.98]]);
    // 32.0 起：一块软光底带着圆角从右边甩进来（不是硬切），上面一颗被拉长的紫色发送键跟着冲到 820；字往左让、抖
    const wipeL = kf(s, [[32.07, 1960], [32.15, 1600], [32.2, 540], [32.25, 0]]); // 2026-11-20 光流：原片甩进来晚 ≈0.07s
    const pillX = kf(s, [[32.0, 2060], [32.15, 1610], [32.2, 1270], [32.25, 830]]), pillW = kf(s, [[32.0, 240], [32.15, 580], [32.2, 700], [32.25, 300]]), pillH = kf(s, [[32.0, 280], [32.25, 300]]);
    const shove = kf(s, [[32.07, 0], [32.25, -160]], eio);
    const glitch = s > 32.0 ? 1 : 0;
    return (
      <AbsoluteFill style={{background: '#1c1b1f', fontFamily: SANS, overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: 960, top: 540, transform: `translate(calc(-50% + ${shove}px),-50%) scale(${cam})`, display: 'flex', alignItems: 'center', opacity: 1 - rs(s, 32.12, 0.08, lin), fontSize: 170, fontWeight: 500, whiteSpace: 'nowrap', lineHeight: 1}}>
          {L.slice(0, n).map((c, i) => {
            const age = s - tAt(i);
            const w = clamp((age - 0.3) / 0.15);
            const col = `rgb(${Math.round(mix(196, 255, w))},${Math.round(mix(130 + i * 6, 255, w))},${Math.round(mix(250, 255, w))})`;
            return <span key={i} style={{color: col, display: 'inline-block', transform: glitch ? `skewX(${Math.sin(s * 80 + i * 3) * 7}deg) translateY(${Math.sin(s * 60 + i) * 3}px)` : undefined}}>{c}</span>;
          })}
          {s < 31.9 && <span style={{width: 12, height: 180, background: '#f2f0f6', marginLeft: 10, opacity: Math.floor(s * 4) % 2 || s < 31.55 ? 1 : 0}} />}
        </div>
        {wipeL < 1960 && <div style={{position: 'absolute', left: wipeL, top: -40, width: 1920 + 600, height: 1160, borderRadius: '560px 0 0 560px', overflow: 'hidden', WebkitMaskImage: 'linear-gradient(90deg, transparent 0px, #000 160px)'}}><div style={{position: 'absolute', left: -wipeL, top: 40, width: 1920, height: 1080}}><Glow s={s} /></div></div>}
        {pillX < 2060 && <div style={{position: 'absolute', left: pillX - pillW / 2, top: 540 - pillH / 2, width: pillW, height: pillH, borderRadius: pillH / 2, background: 'linear-gradient(90deg, #a9a6f6 0%, #c6a4f4 70%, #d58cf0 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><svg width={pillH * 0.42} height={pillH * 0.42} viewBox="0 0 24 24"><path d="M12 20V4M5 11l7-7 7 7" fill="none" stroke="#fff" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" /></svg></div>}
        {s > 32.13 && <GradCursor x={kf(s, [[32.13, 170], [32.25, 600]], (u) => u)} y={kf(s, [[32.13, 925], [32.25, 840]], (u) => u)} />}
        <Grain opacity={0.04} blend="screen" />
      </AbsoluteFill>
    );
  }
  // ───── G2：发送键 ─────
  const cur = s < 33.82 ? {x: kf(s, [[32.25, 600], [32.35, 780], [32.47, 920], [33.3, 962], [33.6, 1360], [34.1, 1380]]), y: kf(s, [[32.25, 840], [32.35, 740], [32.47, 594], [33.3, 580], [33.6, 880], [34.1, 900]])} : null;
  if (s < 33.82) {
    const bx = kf(s, [[32.25, 820], [32.35, 832], [32.6, 928], [32.85, 960], [33.35, 952], [33.6, 960]], eo);
    const by = kf(s, [[32.25, 540], [33.35, 532], [33.6, 520]], eo);
    const D = kf(s, [[32.25, 300], [33.2, 300], [33.35, 320], [33.6, 280]], eo);
    const st = s < 32.38 ? 0 : s < 32.85 ? 1 : s < 33.22 ? 2 : s < 33.48 ? 3 : 4;
    const fill = ['rgba(196,168,246,0.85)', '#0d0d10', 'radial-gradient(circle closest-side, #f6eefe 0%, #dcc6f8 100%)', '#8f7ef0', '#9888f2'][st];
    const ring = st === 1 ? '0 0 0 3px rgba(255,255,255,0.7)' : st === 2 ? '0 0 0 6px #8b8a94' : st === 3 ? '0 0 0 22px rgba(176,176,186,0.9)' : '0 8px 20px rgba(110,80,200,0.2)';
    const rip = rs(s, 32.87, 0.6, lin);
    return (
      <AbsoluteFill style={{fontFamily: SANS, overflow: 'hidden'}}>
        <Glow s={s} />
        {rip > 0 && rip < 1 && <AbsoluteFill style={{background: `repeating-radial-gradient(circle at ${bx}px ${by}px, rgba(255,255,255,0) 0px, rgba(255,255,255,${0.35 * (1 - rip)}) ${40 + rip * 60}px, rgba(255,255,255,0) ${90 + rip * 120}px)`}} />}
        <div style={{position: 'absolute', left: bx - D / 2, top: by - D / 2, width: D, height: D, borderRadius: '50%', background: fill, boxShadow: ring, transform: `perspective(900px) rotateX(${rs(s, 33.7, 0.12, eio) * 32}deg)`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <svg width={D * 0.42} height={D * 0.42} viewBox="0 0 24 24"><path d="M12 20V4M5 11l7-7 7 7" fill="none" stroke={st === 2 ? '#fff' : '#fff'} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" style={{filter: st === 2 ? 'drop-shadow(0 0 2px rgba(120,90,200,0.6))' : undefined}} /></svg>
        </div>
        {cur && <GradCursor x={cur.x} y={cur.y} s={st === 1 ? 0.88 : 1} />}
        <Grain opacity={0.025} blend="multiply" />
      </AbsoluteFill>
    );
  }
  // ───── G3：拉成卡 → 出页 ─────
  // 2026-11-18 逐帧重量：圆在 33.7–33.82 像硬币一样往后倒，33.84 直接变成宽≈1760 的倒梯形卡，然后一路缩、一路摆正（34.07 宽 900、基本平了），光标一直按在卡中间拖着
  const stretch = 1, flat = rs(s, 34.07, 0.08, eio);
  const shrink = rs(s, 34.1, 0.25, eio);
  const cw = kf(s, [[33.82, 1560], [33.87, 1300], [33.94, 1060], [34.0, 970], [34.07, 860], [34.3, 850]]) - shrink * 10; // 透视会把上沿放大，所以底数比量到的外框小一点
  const ch = 450 + shrink * 10;
  const ccx = 950 - shrink * 10, ccy = kf(s, [[33.82, 690], [33.87, 660], [33.94, 616], [34.04, 588], [34.3, 572]]);
  const tilt = -kf(s, [[33.82, 38], [33.94, 26], [34.0, 16], [34.07, 4], [34.15, 0]]);
  const lines = clamp(rs(s, 33.95, 0.06, lin) - rs(s, 34.28, 0.12, lin));
  const pageIn = (t0: number) => rs(s, t0, 0.2, (u) => eo(u));
  const T0 = [34.6, 34.5, 34.98, 35.38]; // 2026-11-19 帧差量原片：34.6 / 35.0 / 35.4 各进一页；最后面那页就是紫卡本身变的（34.42 起内容在紫卡上浮出来）
  const OFF = [[0, 0], [-160, -100], [180, 100], [340, 180]];
  // 2026-11-19 对原片 35.6–36.45 逐帧：最后整摞往一起收——页与页的错位从 ≈(165,95) 收到 ≈(50,28)，整摞缩到 0.82，封面落在 (1058,594)
  const collapse = eio(clamp((s - 36.12) / 0.38)) + held * 0;
  const spread = mix(1, 0.3, collapse);
  const stackScale = 1 - 0.18 * collapse - held * 0.004;
  const stackRY = -8 * collapse;
  const stackX = kf(s, [[34.55, -180], [35.6, -94], [36.12, -82], [36.5, 17]]);
  const stackY = kf(s, [[34.55, -100], [35.6, -49], [36.12, -42], [36.5, 12]]);
  const cardBack = rs(s, 34.38, 0.22, eio);
  const order = [1, 0, 2, 3]; // 绘制顺序：后→前
  return (
    <AbsoluteFill style={{fontFamily: SANS, overflow: 'hidden'}}>
      <Glow s={s} />
      {lines > 0 && (
        <>
          {[ccy - ch / 2, ccy + ch / 2].map((y, i) => <div key={i} style={{position: 'absolute', left: 0, right: 0, top: y, height: 2, background: `rgba(255,255,255,${0.75 * lines})`}} />)}
          {[ccx - cw / 2, ccx + cw / 2].map((xx, i) => <div key={i} style={{position: 'absolute', top: 0, bottom: 0, left: xx, width: 2, background: `rgba(255,255,255,${0.75 * lines})`}} />)}
        </>
      )}
      {/* 紫卡（出页后退到后面变成第一摞的底） */}
      <div style={{position: 'absolute', left: ccx - cw / 2 + cardBack * -210, top: ccy - ch / 2 + cardBack * -150, width: cw, height: ch, borderRadius: 26, transformOrigin: '50% 50%',
        transform: `perspective(1400px) rotateX(${tilt}deg) scale(${mix(1, 0.83, cardBack)})`,
        background: 'linear-gradient(180deg, #8d86f2 0%, #a59cf4 55%, #e2d2f8 100%)', overflow: 'hidden',
        border: '6px solid rgba(255,255,255,0.55)', boxSizing: 'border-box', boxShadow: '0 20px 50px rgba(110,80,200,0.18)', opacity: (1 - 0.4 * rs(s, 34.45, 0.12, lin)) * (1 - rs(s, 35.1, 0.3, lin))}}>
        {/* 2026-11-19 渐变上下翻转改成 0.2s 交叉淡（之前 34.2 一下换，测出来一帧跳变，原片是连续的） */}
        <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #e6d4f8 0%, #b8a8f4 60%, #8f88f2 100%)', opacity: rs(s, 34.1, 0.2, lin)}} />
      </div>
      {/* 页面 */}
      <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transformOrigin: '960px 540px', transform: `translate(${stackX}px, ${stackY}px) perspective(2000px) rotateY(${stackRY}deg) scale(${stackScale})`}}>
        {order.map((i) => {
          const k = pageIn(T0[i]);
          if (k <= 0) return null;
          const ox = OFF[i][0] * spread, oy = OFF[i][1] * spread;
          if (i === 1) { // 最后面这页是紫卡本身变的：紫色慢慢褪掉、页面内容透出来（原片 34.77 还是淡紫色，35.6 才完全是页面）
            const v = rs(s, 34.5, 1.0, eio);
            return <div key={i} style={{position: 'absolute', left: 960 - 320 + ox, top: 540 - 180 + oy, transform: 'scale(1.12)'}}><div style={{opacity: clamp(v * 1.4)}}><SlidePage sp={x.slides[i]} /></div><div style={{position: 'absolute', inset: 0, borderRadius: 18, background: 'linear-gradient(180deg, #e6d4f8 0%, #b8a8f4 60%, #8f88f2 100%)', opacity: 0.85 * (1 - v)}} /></div>;
          }
          return <div key={i} style={{position: 'absolute', left: 960 - 320 + ox, top: 540 - 180 + oy, opacity: clamp(k * 1.6), transform: `translate(${(1 - k) * -30}px, ${(1 - k) * -20}px) scale(${mix(0.9, 1, k) * 1.12})`}}><SlidePage sp={x.slides[i]} /></div>;
        })}
      </div>
      {cur && <GradCursor x={cur.x} y={cur.y} />}
      {s >= 33.82 && s < 35.15 && <GradCursor x={kf(s, [[33.82, 1040], [34.07, 940], [34.6, 1000], [34.85, 1060], [35.1, 1100]])} y={kf(s, [[33.82, 660], [34.07, 580], [34.6, 500], [34.85, 560], [35.1, 600]])} o={1 - rs(s, 35.0, 0.12, lin)} />}
      <Grain opacity={0.025} blend="multiply" />
    </AbsoluteFill>
  );
};

if (checkContract(TYPE_BUTTON_SLIDES_CONTRACT).length) throw new Error(checkContract(TYPE_BUTTON_SLIDES_CONTRACT).join('；'));
export const TypeButtonSlides: React.FC = () => <TypeButtonSlidesGroup />;
