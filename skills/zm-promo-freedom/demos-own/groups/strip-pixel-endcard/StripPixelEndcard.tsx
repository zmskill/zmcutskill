// 【镜头组】strip-pixel-endcard：鲜艳渐变底 + 白色辅助线框住一张淡紫卡，卡里打一句话、卡跟着字变宽 → 一下变成横贯全屏的黑色长条，
//   上下两条马赛克渐变带（蓝→紫→淡），长条里换一句话，字边上冒出跳动的白色像素方块 → 长条收成圆角黑卡、里面亮一块紫色，字散成像素 →
//   硬切白底：马赛克图标慢慢变清晰、变小，名字出来，最后整体压暗到黑（039-H 一拍，结尾）
// 学的动作（MdMizanurRahman · NotebookLM 36.5–41.16s，30fps 逐帧量过）：
//   36.55 卡 ≈904×388（淡紫底、顶上 10px 黑边），字 80px 逐字打；卡宽 904→960→1064（37.25）→1464（37.45），37.6 变全屏长条
//   37.6 长条高 340（上下白细边），上下马赛克带：37.65 蓝、37.85 紫、38.05 起中间变淡米色；长条高慢慢涨到 440
//   37.95–38.9 字两边各一小撮白方块（10–40px）一跳一跳；38.15 补打后半句
//   38.4 长条左右收进成卡（38.65 边距 48、圆角 40、白边 8px；38.85 边距 160、高 584），里面亮紫色圆角块，字从两头散掉只剩一个字
//   39.0 硬切白底（上蓝下粉两团光），图标马赛克（≈280px）→ 39.25 清晰 140px → 39.55 左移、名字 80px 出现；40.2–41.1 压暗到黑
// 我们的内容：三句中文；结尾是主角 千问 的官方图标 + 名字（马赛克用 library/brands/<key>/pix_N.png，官方图标缩出来的）。
import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {Grain} from '../../../assets/lib/helpers/polish';
import {GroupContract, checkContract, checkInputs, outputDuration, planExtras, toSource} from '../../../assets/lib/helpers/groupClock';
import {SANS, brand, clamp, eio, eo, kf, mix, rs} from '../_kit/softAiKit';

const FPS = 30;
const S0 = 36.5;
export const STRIP_PIXEL_ENDCARD_CONTRACT: GroupContract = {
  sourceDuration: 140 / 30,
  fps: 30,
  motion: [[0, 1.35], [1.45, 3.35], [3.45, 140 / 30]],
  holds: [{at: 1.4, maxExtra: 1}, {at: 3.4, maxExtra: 2}],
  landmarks: {type: 0.1, strip: 1.1, pixels: 1.45, card: 1.9, logo: 2.5, name: 3.05, fade: 3.7},
  sfx: [
    {at: 'type', type: '键盘', note: '轻打字', tail: 0.6, volume: 0.3},
    {at: 'strip', type: '落版重击', note: '低频 thump', volume: 0.5},
    {at: 'pixels', type: '故障', note: '8-bit 闪烁', tail: 0.9, volume: 0.3},
    {at: 'logo', type: '提示音', note: '亮相 chime', volume: 0.45},
  ],
  inputs: {l1: {maxChars: 8}, l2: {maxChars: 4}, l3: {maxChars: 5}, name: {maxChars: 4}},
};
export type SpeInputs = {l1: string; l2: string; l3: string; last: string; brandKey: string; name: string};
export const SPE_DEFAULT_INPUTS: SpeInputs = {l1: '这些都是你做的', l2: '没错。', l3: '就是你。', last: '你', brandKey: 'qianwen', name: '千问'};
export const checkSpeInputs = (x: SpeInputs) => checkInputs(STRIP_PIXEL_ENDCARD_CONTRACT, {l1: x.l1, l2: x.l2, l3: x.l3, name: x.name});
export const planSpe = (sec: number) => planExtras(STRIP_PIXEL_ENDCARD_CONTRACT, sec);
export const speFrames = (extras: number[]) => Math.round(outputDuration(STRIP_PIXEL_ENDCARD_CONTRACT, extras) * FPS);
export const STRIP_PIXEL_ENDCARD_DURATION = 140;

const lin = (u: number) => u;
const hash = (n: number) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const mixRGB = (a: number[], b: number[], k: number) => `rgb(${a.map((v, i) => Math.round(mix(v, b[i], clamp(k)))).join(',')})`;

// 马赛克带：格子按到画面中心的距离取色（中心亮、四周蓝/紫），亮区随时间扩大
const MosaicBand: React.FC<{top: number; h: number; s: number}> = ({top, h, s}) => {
  const C = 40;
  const cols = Math.ceil(1920 / C), rows = Math.max(0, Math.ceil(h / C));
  const pk = clamp((s - 37.72) / 0.12);
  const edge = [mix(26, 150, pk), mix(78, 40, pk), mix(176, 214, pk)];
  const light = rs(s, 37.9, 0.75, eo);
  const center = [mix(250, 241, light), mix(250, 234, light), mix(255, 230, light)];
  const r0 = mix(0.35, 1.25, light);
  const out: React.ReactNode[] = [];
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const X = (c + 0.5) * C, Y = top + (r + 0.5) * C;
    const d = Math.sqrt(((X - 960) / 720) ** 2 + ((Y - 540) / 330) ** 2);
    const k = Math.pow(clamp((d - r0) / 1.1), mix(0.6, 1.2, light));
    const ex = clamp((Math.abs(X - 960) / 960 - 0.55) / 0.3); // 只有两侧显出马赛克格
    if (ex > 0.02) out.push(<div key={`${r}-${c}`} style={{position: 'absolute', left: c * C, top: r * C, width: C + 1, height: C + 1, background: mixRGB(center, edge, k), opacity: ex}} />);
  }
  // 中间是平滑的径向渐变（同一个取色公式）
  const cy = 540 - top;
  const stops = [0, 0.25, 0.5, 0.75, 1].map((q) => {
    const d = r0 + q * 1.1;
    return `${mixRGB(center, edge, Math.pow(q, mix(0.6, 1.2, light)))} ${(d / 1.45) * 100}%`;
  });
  return (
    <div style={{position: 'absolute', left: 0, top, width: 1920, height: h, overflow: 'hidden', background: `radial-gradient(${720 * 1.45}px ${330 * 1.45}px at 960px ${cy}px, ${mixRGB(center, edge, 0)} 0%, ${stops.join(', ')})`}}>{out}</div>
  );
};
// 字边的白色像素方块
const Pixels: React.FC<{cx: number; cy: number; half: number; s: number; amt: number}> = ({cx, cy, half, s, amt}) => {
  const f = Math.floor(s * 12);
  const sq: React.ReactNode[] = [];
  [-1, 1].forEach((side) => {
    for (let i = 0; i < 6; i++) {
      const h = hash(i * 13 + f * 7 + (side > 0 ? 100 : 0));
      if (h > 0.25 + (1 - amt) * 0.7) {
        const sz = [10, 14, 22, 30, 38][Math.floor(hash(i + f) * 5)];
        const x = cx + side * (half + 10 + hash(i * 3 + f) * 90);
        const y = cy - 70 + hash(i * 5 + f * 3) * 140;
        sq.push(<div key={`${side}-${i}`} style={{position: 'absolute', left: x - sz / 2, top: y - sz / 2, width: sz, height: sz, background: '#fff'}} />);
      }
    }
  });
  return <>{sq}</>;
};

export const StripPixelEndcardGroup: React.FC<{inputs?: SpeInputs; extras?: number[]}> = ({inputs: x = SPE_DEFAULT_INPUTS, extras = [0, 0]}) => {
  const tt = useCurrentFrame() / FPS;
  const s = toSource(tt, STRIP_PIXEL_ENDCARD_CONTRACT, extras) + S0;
  const held = tt - (s - S0);
  // ───── H1：卡里打字 ─────
  if (s < 37.55) { // 原片逐帧：硬切在第 1127 帧（37.567s）
    const W = kf(s, [[36.5, 860], [36.65, 904], [36.85, 960], [37.05, 968], [37.25, 1064], [37.45, 1464], [37.6, 1920]], eo);
    const H = kf(s, [[36.5, 388], [37.25, 420], [37.45, 360], [37.6, 340]], eo);
    const L = Array.from(x.l1);
    const n = Math.floor(clamp((s - 36.58) / 0.62) * L.length + 0.001);
    const l = 960 - W / 2, t = 540 - H / 2;
    const morph = rs(s, 37.38, 0.12, lin);
    return (
      <AbsoluteFill style={{fontFamily: SANS, overflow: 'hidden', background: '#f2eaf8'}}>
        <AbsoluteFill style={{background: 'radial-gradient(ellipse 24% 40% at 30% 18%, rgba(110,160,255,0.95) 0%, rgba(140,180,255,0) 100%)'}} />
        <AbsoluteFill style={{background: 'radial-gradient(ellipse 30% 46% at 76% 20%, rgba(200,80,240,0.95) 0%, rgba(210,110,240,0) 100%)'}} />
        <AbsoluteFill style={{background: 'radial-gradient(ellipse 40% 40% at 30% 100%, rgba(200,80,240,0.95) 0%, rgba(210,110,240,0) 100%)'}} />
        <AbsoluteFill style={{background: 'radial-gradient(ellipse 26% 40% at 100% 80%, rgba(150,160,255,0.85) 0%, rgba(160,180,255,0) 100%)'}} />
        {[t, t + H].map((y, i) => <div key={i} style={{position: 'absolute', left: 0, right: 0, top: y, height: 2, background: 'rgba(255,255,255,0.75)'}} />)}
        {[l, l + W].map((xx, i) => <div key={i} style={{position: 'absolute', top: 0, bottom: 0, left: xx, width: 2, background: 'rgba(255,255,255,0.75)'}} />)}
        <div style={{position: 'absolute', left: l, top: t, width: W, height: H, background: '#f6eefc', borderTop: '10px solid #2a2a2e', boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div style={{fontSize: 96, fontWeight: 500, color: '#2a2830', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center'}}>
            {L.slice(0, n).map((c, i) => <span key={i} style={{fontWeight: i < 4 ? Math.round(mix(500, 800, morph * (i % 2))) : 500, display: 'inline-block', transform: morph > 0 && morph < 1 && i < 4 ? `scaleY(${1 + Math.sin(i + s * 40) * 0.08})` : undefined}}>{c}</span>)}
            <span style={{width: 4, height: 84, background: '#2a2830', marginLeft: 6, opacity: Math.floor(s * 4) % 2 || n < L.length ? 1 : 0}} />
          </div>
        </div>
        <Grain opacity={0.03} blend="multiply" />
      </AbsoluteFill>
    );
  }
  // ───── H2：黑长条 → 黑卡 ─────
  if (s < 38.933) { // 原片硬切在第 1168 帧（38.933s）
    const SH = kf(s, [[37.6, 340], [37.85, 400], [38.05, 424], [38.45, 440], [38.65, 480], [38.85, 584], [39.0, 600]], eo);
    const mX = kf(s, [[38.4, 0], [38.65, 48], [38.85, 160], [39.0, 170]], eo);
    const rad = kf(s, [[38.4, 0], [38.65, 40], [38.85, 56]], eo);
    const bord = rs(s, 38.55, 0.1, lin) * 11;
    const top = 540 - SH / 2;
    const text = s < 38.15 ? x.l2 : x.l2 + Array.from(x.l3).slice(0, Math.floor(clamp((s - 38.15) / 0.2) * Array.from(x.l3).length + 0.001)).join('');
    const full = Array.from(text);
    // 38.6 起从两头散掉，只剩 last
    const diss = rs(s, 38.6, 0.25, lin);
    const keepIdx = Math.max(0, full.indexOf(x.last));
    const shown = full.map((c, i) => ({c, o: diss <= 0 ? 1 : clamp(1 - diss * 2.2 + (i === keepIdx ? 9 : Math.abs(i - keepIdx) * -0.1))}));
    const txtW = full.length * 104;
    const pixAmt = clamp(rs(s, 37.95, 0.1, lin) - rs(s, 38.95, 0.05, lin));
    const inner = rs(s, 38.7, 0.15, lin);
    return (
      <AbsoluteFill style={{fontFamily: SANS, overflow: 'hidden', background: '#efe9e3'}}>
        {/* 上下留白 80px 在 37.68–37.8 平滑收掉（原来 37.75 一下跳没） */}
        <MosaicBand top={80 * (1 - rs(s, 37.68, 0.12, eio))} h={top - 80 * (1 - rs(s, 37.68, 0.12, eio))} s={s} />
        <MosaicBand top={top + SH} h={1080 - 80 * (1 - rs(s, 37.68, 0.12, eio)) - top - SH} s={s} />
        <div style={{position: 'absolute', left: mX, right: mX, top, height: SH, background: '#2a2a2e', borderRadius: rad, boxSizing: 'border-box', ...(bord ? {border: `${bord}px solid #fff`} : {borderTop: '2px solid rgba(255,255,255,0.8)', borderBottom: '2px solid rgba(255,255,255,0.8)'}), overflow: 'hidden'}}>
          {inner > 0 && <div style={{position: 'absolute', left: 208 * inner, right: 208 * inner, top: 52, bottom: 52, borderRadius: 48, background: 'radial-gradient(ellipse 60% 75% at 50% 50%, #2e2236 0%, #4a2670 65%, #6a2ca8 100%)', opacity: inner, boxShadow: 'inset 0 0 30px rgba(170,90,255,0.5)'}} />}
        </div>
        <div style={{position: 'absolute', left: 960, top: 540, transform: 'translate(-50%,-50%)', fontSize: 100, fontWeight: 500, color: '#fff', whiteSpace: 'nowrap', display: 'flex'}}>
          {(diss > 0.6 ? [{c: x.last, o: 1}] : shown).map((p, i) => <span key={i} style={{opacity: p.o, filter: p.o < 1 && p.o > 0 ? `blur(${(1 - p.o) * 4}px)` : undefined}}>{p.c}</span>)}
        </div>
        {pixAmt > 0 && <Pixels cx={960} cy={540} half={diss > 0.5 ? 60 : txtW / 2} s={s} amt={pixAmt} />}
        <Grain opacity={0.03} blend="multiply" />
      </AbsoluteFill>
    );
  }
  // ───── H3：Logo 结尾 ─────
  const pix = s < 39.3 ? [10, 16, 28, 64][Math.min(3, Math.floor((s - 38.933) / 0.075))] : 0;
  const isz = kf(s, [[38.933, 280], [39.25, 140], [39.45, 120], [39.6, 104]], eo);
  const NW = Array.from(x.name).length * 90;
  const slide = rs(s, 39.5, 0.12, eo);
  const gw = 104 + 40 + NW;
  const ix = mix(960 - isz / 2, 960 - gw / 2, slide);
  const word = rs(s, 39.55, 0.1, lin);
  const dark = rs(s, 40.15, 0.95, (u) => u * (2 - u)); // 原片压暗一开始就在走，不先停一下
  const push = 1 + 0.03 * clamp((s - 39.55) / 1.6) + held * 0.004; // 落版后极慢推近，不冻住
  const tile = rs(s, 39.2, 0.15, lin);
  return (
    <AbsoluteFill style={{fontFamily: SANS, overflow: 'hidden', background: '#fdfcfe', transform: `scale(${push})`}}>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 14% 22% at 62% 18%, rgba(120,170,255,0.75) 0%, rgba(140,180,255,0) 100%)'}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 18% 24% at 32% 82%, rgba(214,130,246,0.7) 0%, rgba(220,150,246,0) 100%)'}} />
      <div style={{position: 'absolute', left: ix, top: 540 - isz / 2, width: isz, height: isz, borderRadius: isz * 0.22, background: `rgba(255,255,255,${tile})`, boxShadow: tile ? `0 4px 14px rgba(90,70,140,${0.08 * tile})` : undefined, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        {pix > 0
          ? <Img src={staticFile(`library/brands/${x.brandKey}/pix_${pix}.png`)} style={{width: isz * 0.8, height: isz * 0.8, imageRendering: 'pixelated'}} />
          : <Img src={brand(x.brandKey)} style={{width: isz * 0.7, height: isz * 0.7, borderRadius: isz * 0.15}} />}
      </div>
      <div style={{position: 'absolute', left: 960 - gw / 2 + 144, top: 540, transform: 'translateY(-52%)', fontSize: 88, fontWeight: 500, color: '#1d1c22', opacity: word, filter: word < 1 ? `blur(${(1 - word) * 8}px)` : undefined, whiteSpace: 'nowrap', letterSpacing: '0.02em'}}>{x.name}</div>
      <AbsoluteFill style={{background: '#0b0b0d', opacity: dark * 0.97 + held * 0}} />
      <Grain opacity={0.03} blend="multiply" />
    </AbsoluteFill>
  );
};

if (checkContract(STRIP_PIXEL_ENDCARD_CONTRACT).length) throw new Error(checkContract(STRIP_PIXEL_ENDCARD_CONTRACT).join('；'));
export const StripPixelEndcard: React.FC = () => <StripPixelEndcardGroup />;
