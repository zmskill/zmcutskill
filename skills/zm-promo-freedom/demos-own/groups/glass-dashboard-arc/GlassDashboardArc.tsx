// 【镜头组】glass-dashboard-arc：一块空的玻璃面板浮起来、长高 → 下面升起一道蓝色弧光（行星边缘）→ 界面一层层显出来（顶栏、标题、AI 助手、柱状图、折线、环形图）→
//   镜头拉远、面板往后仰成梯形，上面出一行大标题，慢慢推近（028-D 一拍，界面登场核心）
// 学的动作（ArtemLysenko · DashSync 13.6–19.5s，30fps 逐帧量过）：
//   13.7 空面板（300..1650，y345..975）→ 14.0 往上长高 → 14.3 到 1366×1010（290..1656，y30..1040），顶栏和标题淡入
//   14.45–14.9 弧光从下面升起（圆心 y 2600→1598，半径 1138），14.6–15.0 卡片一张张显出（AI 助手的声波、输入框、四块小柱）
//   16.2–16.6 面板缩到 0.76、往后仰 25°（顶边 470..1510、y270；底边 420..1570、y1010），弧光变成圆心 (990,1900) R1280；
//   16.4 标题 100px 在 y110 由糊变清；之后慢推 1.04；19.35 左边亮起一颗星（交给下一拍）
// 我们的内容：虚构产品「数星」，界面全中文（分析 / 营销 / 数据、AI 助手、未来走势分析、市场营收、年龄分布），右下角标"虚构 · 仅作演示"。
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {GroupContract, checkContract, checkInputs, outputDuration, planExtras, toSource} from '../../../assets/lib/helpers/groupClock';
import {GlowSpot} from '../_kit/light';
import {Arc, NavyBg, SANS, Star4, clamp, eio, eo, hash, kf, mix} from '../_kit/blueArcKit';

const FPS = 30;
const S0 = 13.6;
export const GLASS_DASHBOARD_ARC_CONTRACT: GroupContract = {
  sourceDuration: 177 / 30,
  fps: 30,
  motion: [[0, 2.45], [2.55, 177 / 30]],
  holds: [{at: 2.5, maxExtra: 1.5}],
  landmarks: {panel: 0.1, arc: 0.85, fill: 1.0, pull: 2.6, title: 2.8, star: 5.75},
  sfx: [
    {at: 'panel', type: '上扬铺垫', note: '玻璃浮起 swell', volume: 0.35},
    {at: 'arc', type: '运镜', note: '弧光 whoom', volume: 0.45},
    {at: 'fill', type: '轻tick', note: '界面显出 ticks', tail: 0.5, volume: 0.25},
    {at: 'title', type: '落版重击', note: '标题 hit', volume: 0.4},
  ],
  inputs: {title: {maxChars: 12}, name: {maxChars: 4}},
};
export type DashInputs = {title: string; name: string; note: string};
export const DASH_DEFAULT_INPUTS: DashInputs = {title: 'AI 驱动的数据看板', name: '数星', note: '虚构 · 仅作演示'};
export const checkDashInputs = (x: DashInputs) => checkInputs(GLASS_DASHBOARD_ARC_CONTRACT, {title: x.title, name: x.name});
export const planDash = (sec: number) => planExtras(GLASS_DASHBOARD_ARC_CONTRACT, sec);
export const dashFrames = (extras: number[]) => Math.round(outputDuration(GLASS_DASHBOARD_ARC_CONTRACT, extras) * FPS);
export const GLASS_DASHBOARD_ARC_DURATION = 177;

const T: React.FC<{x: number; y: number; fs: number; c?: string; w?: number; children: React.ReactNode; o?: number}> = ({x, y, fs, c = '#e8eeff', w = 500, children, o = 1}) => (
  <div style={{position: 'absolute', left: x, top: y - fs * 0.6, fontSize: fs, fontWeight: w, color: c, whiteSpace: 'nowrap', lineHeight: 1.2, opacity: o}}>{children}</div>
);
const Card: React.FC<{x: number; y: number; w: number; h: number; o: number}> = ({x, y, w, h, o}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: 22, background: 'linear-gradient(170deg, rgba(44,66,170,0.24), rgba(10,16,62,0.36))', boxShadow: '0 0 0 1.5px rgba(140,170,255,0.2), inset 0 1.5px 0 rgba(200,215,255,0.16)', opacity: o, transform: `translateY(${(1 - o) * 14}px)`}} />
);
/** 仪表盘内容（本地坐标 1366×1010），k 0–1 控制各层出现 */
export const DashboardUI: React.FC<{k: number; name: string; s: number}> = ({k, name, s}) => {
  // 2026-11-21 逐帧：原片内容是一样一样亮起来的——14.1 先出第一个页签 → 14.25 面包屑 + 雪花图标 → 14.42 名字 + 左栏图标（一个个往下）→ 14.6 起右上圆钮一个个亮、日期 → 14.85 导出；
  //   卡片里的内容（声波、柱子、曲线）14.6–14.95 先出，卡片的玻璃底和边框 15.0–15.2 才出来（之前卡片底和内容一起淡入）
  const A = (t0: number, d = 0.15) => clamp((s - t0) / d) * (k > 0 ? 1 : 0);
  const head = A(14.42), cards = [A(15.0, 0.22), A(15.04, 0.22), A(15.08, 0.22), A(15.12, 0.22)], inner = [A(14.6, 0.2), A(14.8), A(14.86), A(14.95)];
  const bars = [110, 96, 70, 120, 64, 108, 150, 92, 82, 100, 78, 60];
  const wave = Array.from({length: 40}, (_, i) => 6 + Math.abs(Math.sin(i * 0.9 + s * 6)) * 26 * (0.5 + 0.5 * Math.sin(i * 0.37)));
  return (
    <div style={{position: 'absolute', inset: 0, fontFamily: SANS}}>
      {/* 左栏 */}
      {[120, 240, 330, 392, 454, 514, 576, 904].map((y, i) => <div key={i} style={{position: 'absolute', left: 96 - 22, top: y - 22, width: 44, height: 44, borderRadius: 22, background: i === 2 ? '#2b5bff' : 'rgba(255,255,255,0.08)', opacity: A(i === 0 ? 14.1 : 14.42 + i * 0.05), boxShadow: i === 2 ? '0 0 16px #2b5bff' : undefined}} />)}
      {/* 顶栏 */}
      <div style={{position: 'absolute', left: 220, top: 94, height: 44, display: 'flex', gap: 6, alignItems: 'center'}}>
        {['分析', '营销', '数据'].map((t, i) => <div key={t} style={{opacity: A(14.1 + (i ? 0.12 + i * 0.04 : 0)), height: 40, padding: '0 22px', borderRadius: 20, background: i === 0 ? '#fff' : 'transparent', color: i === 0 ? '#14183a' : '#c8d2ff', fontSize: 17, display: 'flex', alignItems: 'center'}}>{t}</div>)}
      </div>
      {[0, 1, 2, 3, 4, 5].map((i) => <div key={i} style={{position: 'absolute', left: 970 + i * 56, top: 94, width: 44, height: 44, borderRadius: 22, background: i === 2 ? '#2b5bff' : i === 5 ? 'linear-gradient(135deg,#d8c8b8,#7a6a5e)' : 'rgba(255,255,255,0.08)', boxShadow: '0 0 0 1.5px rgba(160,180,255,0.3)', opacity: A(14.6 + i * 0.06)}} />)}
      <T x={174} y={190} fs={15} c="#9aa8e8" o={A(14.25)}>分析 → 活跃度</T>
      <T x={174} y={246} fs={46} o={head}>{name}</T>
      <div style={{position: 'absolute', left: 560, top: 200, fontSize: 70, color: 'rgba(120,150,255,0.4)', opacity: A(14.25)}}>✳</div>
      <div style={{position: 'absolute', left: 760, top: 224, display: 'flex', gap: 14, opacity: A(14.65)}}>
        {['11月1日 – 12月1日 ⌄', '近一年 ⌄'].map((t) => <div key={t} style={{height: 38, padding: '0 16px', borderRadius: 19, boxShadow: '0 0 0 1.5px rgba(160,180,255,0.3)', color: '#c8d2ff', fontSize: 15, display: 'flex', alignItems: 'center'}}>{t}</div>)}
        <div style={{height: 38, padding: '0 20px', borderRadius: 19, background: '#fff', color: '#14183a', fontSize: 15, display: 'flex', alignItems: 'center'}}>导出 ⇪</div>
      </div>
      {/* AI 助手 —— 2026-11-19 逐帧：原片这张玻璃卡是「浮」在面板上的，16.9 起往左上浮起来一点（17.6 偏 −16,−14）、再往右下落回（18.2 +16,+6），
          还一直带着一点视差晃动；之前它是死贴在格子里的 */}
      {(() => { const fx = kf(s, [[16.9, 0], [17.3, -4], [17.6, -5], [18.0, 1], [19.6, 0]]), fy = kf(s, [[16.9, 0], [17.3, -9], [17.6, -10], [18.0, 0], [19.6, 0]]); const lift = kf(s, [[16.95, 0], [17.3, 1], [17.6, 1], [17.95, 0]]); /* 2026-11-21 再对一遍：原片这张卡不是左右晃，而是 17.0–17.6 整张「亮起来」（变成浅蓝磨砂、亮边、声波变白发光）同时往上浮一点，17.95 落回 */
        return <div style={{position: 'absolute', inset: 0, transform: `translate(${fx}px, ${fy}px) scale(${1 + 0.025 * lift})`, transformOrigin: '400px 618px', filter: lift > 0.02 ? `drop-shadow(0 ${18 * lift}px ${30 * lift}px rgba(0,0,30,0.5))` : undefined}}>
      <Card x={174} y={306} w={452} h={624} o={cards[0]} />
      {lift > 0.01 && <div style={{position: 'absolute', left: 174, top: 306, width: 452, height: 624, borderRadius: 22, background: `linear-gradient(170deg, rgba(130,170,255,${0.36 * lift}), rgba(70,110,255,${0.2 * lift}))`, boxShadow: `0 0 0 2px rgba(180,205,255,${0.65 * lift}), 0 0 46px rgba(90,140,255,${0.5 * lift}), inset 0 0 40px rgba(170,200,255,${0.3 * lift})`}} />}
      <div style={{opacity: inner[0]}}><GlowSpot x={400} y={560} rx={330} ry={300} rgb='90,140,255' a={0.32} /><GlowSpot x={420} y={430} rx={220} ry={90} rgb='140,175,255' a={0.35} /></div>{/* 原片 AI 助手这块被后面星球的光透亮，声波周围一片浅蓝亮雾 */}
      <div style={{opacity: inner[0]}}>
        <T x={200} y={350} fs={24}>AI 助手</T><T x={580} y={350} fs={22} c="#c8d2ff">✕</T>
        <div style={{position: 'absolute', left: 250, top: 400, height: 60, display: 'flex', alignItems: 'center', gap: 3}}>{wave.map((h, i) => <div key={i} style={{width: 4, height: h, borderRadius: 2, background: lift > 0.01 ? `rgb(${169 + 80 * lift},${188 + 62 * lift},255)` : '#a9bcff', boxShadow: `0 0 ${4 + 6 * lift}px #dfe6ff, 0 0 ${12 + 16 * lift}px #5d7dff`}} />)}</div>
        <div style={{position: 'absolute', left: 196, top: 512, width: 414, height: 60, borderRadius: 16, background: 'rgba(255,255,255,0.08)', boxShadow: 'inset 0 0 0 1.5px rgba(170,190,255,0.25)', display: 'flex', alignItems: 'center', paddingLeft: 18, fontSize: 15, color: '#dfe6ff'}}>帮我分析近 4 个月的产品销量…<div style={{position: 'absolute', right: 10, width: 42, height: 42, borderRadius: 21, background: '#fff'}} /></div>
        <div style={{position: 'absolute', left: 200, top: 600, width: 40, height: 40, borderRadius: 20, boxShadow: '0 0 0 1.5px rgba(170,190,255,0.4)'}} />
        <T x={252} y={612} fs={17}>销售概览</T><T x={252} y={636} fs={12} c="#9aa8e8">近 4 个月增长与销量</T><T x={500} y={622} fs={28} w={600}>+247%</T>
        {[['+45%', '#f4f6ff', 108], ['+59%', '#151c5a', 168], ['+56%', '#3a2fd8', 78], ['+140%', '#2f5bff', 152]].map(([t, c, h], i) => (
          <React.Fragment key={i}>
            <T x={206 + i * 100} y={678} fs={13} c="#6ff0a8">{t as string}</T>
            <div style={{position: 'absolute', left: 204 + i * 100, top: 700, width: 92, height: h as number, borderRadius: 10, background: c as string, boxShadow: i === 3 ? '0 0 20px rgba(47,91,255,0.7)' : undefined}} />
            <T x={214 + i * 100} y={898} fs={13} c="#9aa8e8">{['8月', '9月', '10月', '11月'][i]}</T>
          </React.Fragment>
        ))}
      </div>
        </div>; })()}
      {/* 未来走势 */}
      <Card x={646} y={306} w={634} h={294} o={cards[1]} />
      <div style={{opacity: inner[1]}}>
        <T x={690} y={340} fs={17}>未来走势分析</T>
        {bars.map((h, i) => <div key={i} style={{position: 'absolute', left: 668 + i * 50, top: 560 - h, width: 38, height: h, borderRadius: 10, background: i === 6 ? 'linear-gradient(180deg,#5b82ff,#2244d8)' : 'rgba(20,28,90,0.9)', boxShadow: i === 6 ? '0 0 18px rgba(80,120,255,0.8)' : '0 0 0 1px rgba(120,150,255,0.15)'}} />)}
        <T x={970} y={418} fs={12} c="#fff">¥502</T>
        {Array.from({length: 12}, (_, i) => <T key={i} x={672 + i * 50} y={582} fs={11} c="#8a98d8">{i + 1}月</T>)}
      </div>
      {/* 市场营收 */}
      <Card x={646} y={616} w={344} h={314} o={cards[2]} />
      <div style={{opacity: inner[2]}}>
        <T x={690} y={652} fs={17}>市场营收</T>
        <svg width={300} height={110} style={{position: 'absolute', left: 668, top: 700}}><path d="M0 70 C40 40 70 90 110 60 S170 20 200 45 S260 70 300 40" fill="none" stroke="#7f9cff" strokeWidth={3} /><circle cx={200} cy={45} r={7} fill="#fff" /></svg>
        <T x={690} y={860} fs={14} c="#c8d2ff">▶ +248% 增长</T>
      </div>
      {/* 年龄分布 */}
      <Card x={1010} y={616} w={270} h={314} o={cards[3]} />
      <div style={{opacity: inner[3]}}>
        <T x={1050} y={652} fs={17}>年龄分布</T>
        <div style={{position: 'absolute', left: 1050, top: 712, width: 120, height: 120, borderRadius: 60, background: '#1d3ad8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, color: '#fff'}}>50%</div>
        <div style={{position: 'absolute', left: 1150, top: 760, width: 90, height: 90, borderRadius: 45, background: '#2a1f9e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: '#fff'}}>30%</div>
        <div style={{position: 'absolute', left: 1140, top: 700, width: 56, height: 56, borderRadius: 28, background: '#0f1660', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: '#fff'}}>20%</div>
        <T x={1040} y={904} fs={12} c="#9aa8e8">18–30　30–55　55–70</T>
      </div>
      <div style={{opacity: hash(1) * 0}} />
    </div>
  );
};

const titleWords = (t: string) => { const m = t.match(/^(\S+\s*)(.*)$/); if (!m) return [t]; const rest = Array.from(m[2]); const h = Math.floor(rest.length / 2); return [m[1], rest.slice(0, h).join(''), rest.slice(h).join('')].filter(Boolean); };
export const GlassDashboardArcGroup: React.FC<{inputs?: DashInputs; extras?: number[]}> = ({inputs: x = DASH_DEFAULT_INPUTS, extras = [0]}) => {
  const tt = useCurrentFrame() / FPS;
  const s = toSource(tt, GLASS_DASHBOARD_ARC_CONTRACT, extras) + S0;
  const held = tt - (s - S0);
  const pull = eio(clamp((s - 16.2) / 0.4));
  const push = 1 + 0.04 * clamp((s - 16.7) / 2.8) + held * 0.004;
  // 面板尺寸（未拉远时）
  const pTop = kf(s, [[13.6, 520], [13.65, 484], [13.75, 342], [13.9, 151], [14.1, 79], [14.3, 53], [14.45, 49]]); // 2026-11-21 逐帧量四边
  const pBot = kf(s, [[13.6, 890], [13.65, 912], [13.75, 978], [13.9, 1008], [14.1, 1024], [14.3, 1040], [14.45, 1052]]);
  const pL = kf(s, [[13.6, 300], [14.45, 296]]);
  const pR = kf(s, [[13.6, 1645], [14.45, 1650]]);
  const appear = clamp((s - 13.62) / 0.12);
  const content = clamp((s - 14.05) / 1.0);
  // 2026-11-19 逐帧：星球边缘不是从底下升上来——14.47 直接在顶点 y≈500 处淡出来（先是顶上一道竖光），之后极慢地上移到 y≈440（15.2）；
  //   之前从画外 0.5s 冲上来，光流量出来一帧 275px 的大跳。面板在内容出来之前是近乎黑的空框
  const arcCy = mix(kf(s, [[14.45, 1672], [14.8, 1630], [15.2, 1611], [16.2, 1611]]), 1900, pull), arcR = mix(1171, 1280, pull), arcCx = mix(960, 990, pull);
  const arcO = clamp((s - 14.47) / 0.28);
  const dark = 0; // 原片面板是透明的暗玻璃，后面的星球弧光能透过来；暗是因为背景本身暗，不靠加黑罩
  const titleK = eo(clamp((s - 16.4) / 0.35));
  const W = pR - pL, H = pBot - pTop;
  return (
    <AbsoluteFill style={{overflow: 'hidden', fontFamily: SANS}}>
      <NavyBg gx={mix(6, 8, pull)} gy={mix(6, 12, pull)} glow={mix(0.5 + 0.2 * clamp((s - 14.5) / 0.6), 1.15, pull)} side={mix(0.12, 0.55, pull)} drift={s} />{/* 2026-11-21 原片开场只有左上角一点蓝雾，其余近乎全黑；之前光在底部中间 */}{/* 原片：拉远前光从下面星球透上来，拉远后光从左上大片打进来（吸管量） */}
      <AbsoluteFill style={{transform: `scale(${push})`, transformOrigin: '960px 640px'}}>
        {arcO > 0 && <Arc cx={arcCx} cy={arcCy} R={arcR} w={mix(5, 6, pull)} o={arcO * mix(0.55, 1, pull)} />}
        {arcO > 0 && <div style={{position: 'absolute', left: arcCx - 330, top: arcCy - arcR - 60, width: 660, height: 120, borderRadius: '50%', background: 'radial-gradient(ellipse closest-side, rgba(190,215,255,0.85), rgba(90,140,255,0.45) 45%, rgba(60,100,255,0) 100%)', filter: 'blur(4px)', opacity: arcO * kf(s, [[14.5, 0.4], [14.65, 1], [15.0, 0.85], [15.6, 0.55], [16.2, 0.4]]) * (1 - pull), mixBlendMode: 'screen'}} />}{/* 2026-11-21 crest sunrise glow: brightest 14.65, spreads along the arc, then fades */}
        {arcO > 0 && s < 15.6 && <div style={{position: 'absolute', left: arcCx - 160, top: arcCy - arcR - 10, width: 320, height: 240, borderRadius: '50%', background: 'radial-gradient(ellipse 50% 50% at 50% 30%, rgba(80,130,255,0.6), rgba(50,90,240,0.25) 50%, rgba(40,70,220,0) 100%)', filter: 'blur(8px)', opacity: kf(s, [[14.48, 0], [14.62, 1], [14.85, 0.7], [15.6, 0]]), mixBlendMode: 'screen'}} />}{/* light spilling down from the crest into the panel */}
        {s > 14.44 && s < 15.0 && <div style={{position: 'absolute', left: arcCx - 40, top: arcCy - arcR - 150, width: 80, height: 170, background: 'radial-gradient(ellipse 50% 50% at 50% 100%, rgba(170,200,255,0.85), rgba(80,130,255,0.3) 55%, rgba(60,100,255,0) 100%)', filter: 'blur(6px)', opacity: clamp((s - 14.44) / 0.08) * (1 - clamp((s - 14.7) / 0.3))}} />}{/* 顶点那道竖光 */}
        <div style={{position: 'absolute', left: pL, top: pTop, width: W, height: H, transformOrigin: '50% 100%', opacity: appear,
          transform: `translate(${pull * 12}px, ${pull * -30}px) perspective(1800px) rotateX(${pull * 16}deg) scale(${mix(1, 0.9, pull) * (1 - 0.04 * clamp((s - 15.3) / 0.9))})`}}>{/* 原片拉远之前面板就在极慢地往后退，不是停住 */}
          <div style={{position: 'absolute', inset: -26, borderRadius: 96, boxShadow: `0 0 0 1.5px rgba(150,175,255,${0.12 * pull})`}} />
          <div style={{position: 'absolute', inset: 0, borderRadius: 74, background: 'linear-gradient(180deg, rgba(6,10,40,0.3), rgba(10,18,70,0.2))', backdropFilter: 'blur(3px)', WebkitBackdropFilter: 'blur(3px)', /* 原片是磨砂玻璃：后面的星球光透进来、被磨糊，成一片亮雾 */ boxShadow: '0 0 0 2px rgba(105,120,165,0.5), inset 0 0 40px rgba(40,70,200,0.12)'}} />
          {dark > 0 && <div style={{position: 'absolute', inset: 0, borderRadius: 74, background: `rgba(2,4,14,${0.86 * dark})`}} />}
          {content > 0 && <div style={{position: 'absolute', left: 0, top: 0, width: 1366, height: 1010, transform: `scale(${W / 1366}, ${H / 1010})`, transformOrigin: '0 0'}}><DashboardUI k={content} name={x.name} s={s} /></div>}
        </div>
        {s > 16.1 && <div style={{position: 'absolute', left: 0, right: 0, top: 110 - 62, textAlign: 'center', fontSize: 100, fontWeight: 600, color: '#fff', letterSpacing: '-0.01em', transform: `translate(15px, ${kf(s, [[16.15, -70], [16.35, -48], [16.6, -16], [16.9, 0]])}px)`, whiteSpace: 'pre'}}>{/* 标题跟着镜头往下落进来 */}{/* 原片标题一个词一个词由糊变清（16.2 第一个词已清楚，16.4 最后一个词还糊着） */}{titleWords(x.title).map((w, i) => { const k = eo(clamp((s - 16.12 - i * 0.12) / 0.28)); return <span key={i} style={{display: 'inline-block', opacity: k, filter: k < 1 ? `blur(${(1 - k) * 14}px)` : undefined, transform: `scale(${1.08 - 0.08 * k})`}}>{w}</span>; })}</div>}
      </AbsoluteFill>
      {s > 19.3 && <div style={{position: 'absolute', left: 120 - 50, top: 528 - 50, opacity: clamp((s - 19.33) / 0.12)}}><Star4 size={100} /></div>}
      <div style={{position: 'absolute', right: 36, bottom: 26, fontSize: 20, color: 'rgba(200,210,255,0.45)', letterSpacing: '0.06em'}}>{x.note}</div>
    </AbsoluteFill>
  );
};

if (checkContract(GLASS_DASHBOARD_ARC_CONTRACT).length) throw new Error(checkContract(GLASS_DASHBOARD_ARC_CONTRACT).join('；'));
export const GlassDashboardArc: React.FC = () => <GlassDashboardArcGroup />;
