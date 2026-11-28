// 【镜头组】photo-lens-cursor-type：满屏照片缩进一个大玻璃透镜、一路缩成一根白色光标 → 光标往左滑到头，一道蓝色彗星光从左边追上来 →
//   光标带着彗星往右冲，冲过的地方字一个个亮出来（先偏蓝再变白）→ 停住；最后四个角各压进来一个大圆，把画面收成一个内凹四角星（028-B 一拍，痛点）
// 学的动作（ArtemLysenko · DashSync 6.3–10.6s，30fps 逐帧量过，2026-11-21）：
//   6.33 满屏照片开始缩：6.4 框 (68,22)-(1863,1053) → 6.53 (140,65)-(1779,1007) → 6.67 (370,176)-(1547,896) → 6.8 (778,378)-(1139,694)，越缩越是裁切；
//       框后面是一个大玻璃透镜（圆心≈965,540，R 1150 → 6.67 880 → 850），透镜左右边各有一段亮边，亮的位置慢慢转（8.6 左亮 → 9.0 右亮）
//   6.93 缩成一团白光（宽 48）→ 7.4 收成一根细光标（宽 11、高 ≈96，在 x≈950）；7.4–7.87 光标往左滑到 x305（先慢后快再刹住）
//   7.87 一道蓝色彗星光从画面左边进来，追到光标后面；8.2–8.8 光标往右冲到 x1508（8.47 最快），彗星头跟在后面，彗星头扫过的地方字亮出来（偏蓝），
//   8.8–9.4 字变白变亮，9.15 光标没了；字最后在 x530–1508、y≈532，带一条横向的柔光
//   10.1–10.6 四个角各压进来一个大暗圆，中间收成一个内凹四角星（10.3 宽 ≈1836 → 10.6 宽 702），接 028-C
// 我们的内容：照片换成我们素材库里的夜间办公室照（photos/night/night01，Pexels），字是「你在亏钱」，接 028 数星整串。
import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {GroupContract, checkContract, checkInputs, outputDuration, planExtras, toSource} from '../../../assets/lib/helpers/groupClock';
import {SANS, clamp, eo, hash, kf} from '../_kit/blueArcKit';
import {GlowSpot} from '../_kit/light';

const FPS = 30;
const S0 = 6.3;
export const PHOTO_LENS_TYPE_CONTRACT: GroupContract = {
  sourceDuration: 129 / 30,
  fps: 30,
  motion: [[0, 3.15], [3.75, 129 / 30]],
  holds: [{at: 3.4, maxExtra: 2.5}],
  landmarks: {shrink: 0.03, cursor: 0.63, slide: 1.1, comet: 1.57, type: 1.9, done: 2.6, close: 3.8},
  sfx: [
    {at: 'shrink', type: '运镜', note: '收缩 whoosh', volume: 0.4},
    {at: 'cursor', type: '轻tick', note: '轻击 tick', volume: 0.3},
    {at: 'comet', type: '短甩', note: '光束 swoosh', volume: 0.4},
    {at: 'type', type: '键盘', note: '一串打字', tail: 0.7, volume: 0.35},
    {at: 'close', type: '吸入', note: '吸入 suck', volume: 0.4},
  ],
  inputs: {line: {maxChars: 6}},
};
export type PhotoLensInputs = {photo: string; line: string; note: string};
export const PHOTO_LENS_DEFAULT_INPUTS: PhotoLensInputs = {photo: 'library/photos/night/night01.jpg', line: '你在亏钱', note: '虚构 · 仅作演示'};
export const checkPhotoLensInputs = (x: PhotoLensInputs) => checkInputs(PHOTO_LENS_TYPE_CONTRACT, {line: x.line});
export const planPhotoLens = (sec: number) => planExtras(PHOTO_LENS_TYPE_CONTRACT, sec);
export const photoLensFrames = (extras: number[]) => Math.round(outputDuration(PHOTO_LENS_TYPE_CONTRACT, extras) * FPS);
export const PHOTO_LENS_TYPE_DURATION = 129;

const lin = (u: number) => u;
const STAR_SVG = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='-70 -70 140 140'><path d='M0 -70 Q6.4 -6.4 70 0 Q6.4 6.4 0 70 Q-6.4 6.4 -70 0 Q-6.4 -6.4 0 -70 Z'/></svg>")`;

export const PhotoLensCursorTypeGroup: React.FC<{inputs?: PhotoLensInputs; extras?: number[]}> = ({inputs: x = PHOTO_LENS_DEFAULT_INPUTS, extras = [0]}) => {
  const tt = useCurrentFrame() / FPS;
  const s = toSource(tt, PHOTO_LENS_TYPE_CONTRACT, extras) + S0;
  const held = tt - (s - S0);
  // 透镜
  const LR = kf(s, [[6.33, 1150], [6.5, 960], [6.67, 880], [7.2, 860], [9.0, 816], [10.1, 830]]) + held * 0.5;
  const LX = kf(s, [[6.33, 975], [6.67, 985], [8.6, 972], [9.0, 962], [10.1, 915]], lin);
  const rimA = kf(s, [[6.4, 240], [8.6, 250], [9.0, 70], [10.1, 40]], lin) + held * 6; // 亮边所在角度（0 = 上）
  // 照片框
  const box = (k: number) => kf(s, [[6.33, [0, 0, 1920, 1080][k]], [6.4, [68, 22, 1863, 1053][k]], [6.53, [140, 65, 1779, 1007][k]], [6.67, [370, 176, 1547, 896][k]], [6.8, [778, 378, 1139, 694][k]], [6.87, [930, 470, 990, 610][k]]], lin);
  const [bx0, by0, bx1, by1] = [box(0), box(1), box(2), box(3)];
  const imgSc = kf(s, [[6.33, 1.02], [6.53, 0.86], [6.67, 0.9], [6.87, 1.0]], lin);
  // 光标
  const cx = kf(s, [[6.93, 959], [7.33, 957], [7.4, 946], [7.47, 926], [7.53, 887], [7.6, 809], [7.67, 616], [7.73, 423], [7.8, 346], [7.87, 308], [7.93, 289], [8.0, 300], [8.07, 305], [8.13, 314], [8.2, 337], [8.27, 382], [8.33, 462], [8.4, 616], [8.47, 968], [8.53, 1288], [8.6, 1408], [8.67, 1465], [8.73, 1490], [8.8, 1505], [8.93, 1508]], lin);
  const cw = kf(s, [[6.9, 60], [6.93, 48], [7.0, 31], [7.13, 21], [7.33, 16], [7.4, 11]], lin);
  const cOn = s > 6.88 && s < 9.15;
  // 彗星头
  const head = kf(s, [[7.84, -60], [7.87, 121], [8.0, 101], [8.13, 120], [8.2, 146], [8.27, 189], [8.33, 373], [8.4, 506], [8.47, 791], [8.53, 1000], [8.6, 1200], [8.73, 1450], [8.85, 1560]], lin);
  const cometA = clamp((s - 7.84) / 0.06) * (1 - clamp((s - 8.72) / 0.22));
  // 字
  const L = Array.from(x.line), FS = 140, TW = L.length * FS * 1.02, TX = 1019 - TW / 2;
  const white = clamp((s - 8.7) / 0.35);
  const tsc = 1 + 0.025 * clamp((s - 9.0) / 1.1) + held * 0.004;
  // 收星
  const starW = kf(s, [[10.12, 4200], [10.2, 2700], [10.3, 1836], [10.45, 1100], [10.6, 702]], lin);
  const closing = s > 10.1;
  const lens = (
    <>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 70% 80% at 50% 60%, #0b1a4a 0%, #071030 55%, #04081a 100%)'}} />
      <div style={{position: 'absolute', left: LX - LR, top: 540 - LR, width: LR * 2, height: LR * 2, borderRadius: '50%', background: 'radial-gradient(circle closest-side, rgba(10,22,66,0.97) 0%, rgba(10,22,68,0.97) 75%, rgba(20,42,125,0.95) 94%, rgba(8,16,50,1) 100%)', boxShadow: '0 0 80px 20px rgba(6,12,40,0.8)' /* 原片透镜里面是暗的，只有边是亮的 */}} />
      <div style={{position: 'absolute', left: LX - LR, top: 540 - LR, width: LR * 2, height: LR * 2, borderRadius: '50%', background: 'linear-gradient(180deg, rgba(0,0,8,0.6) 0%, rgba(0,0,10,0.15) 45%, rgba(40,80,220,0.16) 100%)'}} />
      {/* 透镜里的淡网格 */}
      <div style={{position: 'absolute', left: LX - LR, top: 540 - LR, width: LR * 2, height: LR * 2, borderRadius: '50%', backgroundImage: 'linear-gradient(rgba(120,150,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(120,150,255,0.06) 1px, transparent 1px)', backgroundSize: '96px 96px'}} />
      {/* 亮边：两段亮光沿着圆边转（模糊套在遮罩外面） */}
      {[[14, 6], [5, 1.5]].map(([pad, bl], i) => (
        <div key={i} style={{position: 'absolute', inset: 0, filter: `blur(${bl}px)`}}>
          <div style={{position: 'absolute', left: LX - LR - pad, top: 540 - LR - pad, width: (LR + pad) * 2, height: (LR + pad) * 2, borderRadius: '50%', padding: pad, boxSizing: 'border-box',
            background: `conic-gradient(from ${rimA - 40}deg, rgba(200,220,255,1) 0deg, rgba(110,150,255,0.75) 30deg, rgba(50,85,220,0.4) 70deg, rgba(50,85,220,0.4) 140deg, rgba(150,180,255,0.95) 180deg, rgba(80,120,250,0.55) 215deg, rgba(50,85,220,0.4) 260deg, rgba(50,85,220,0.4) 320deg, rgba(200,220,255,1) 360deg)`,
            WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude', opacity: i === 0 ? 0.7 : 1} as React.CSSProperties} />
        </div>
      ))}
    </>
  );
  const content = (
    <>
      {s < 6.88 && (
        <div style={{position: 'absolute', left: bx0, top: by0, width: bx1 - bx0, height: by1 - by0, overflow: 'hidden', boxShadow: s > 6.36 ? '0 0 0 6px rgba(4,8,26,0.9)' : undefined, background: '#0a1430'}}>
          <Img src={staticFile(x.photo)} style={{position: 'absolute', left: (bx1 - bx0) / 2 - 960 * imgSc - ((bx0 + bx1) / 2 - 960) * 0.25, top: (by1 - by0) / 2 - 540 * imgSc, width: 1920 * imgSc, height: 1080 * imgSc, filter: 'saturate(0.85) brightness(0.92) hue-rotate(-6deg)'}} />
          {s > 6.8 && <div style={{position: 'absolute', inset: 0, background: `rgba(255,255,255,${clamp((s - 6.8) / 0.07)})`}} />}
        </div>
      )}
      {cometA > 0 && <>
        <div style={{position: 'absolute', inset: 0, filter: 'blur(22px)', opacity: cometA}}><div style={{position: 'absolute', left: Math.min(head, 2000) - 560, top: 532 - 130, width: 560, height: 260, background: 'linear-gradient(90deg, rgba(40,80,255,0) 0%, rgba(50,95,255,0.5) 50%, rgba(80,125,255,0.95) 90%, rgba(150,180,255,1) 100%)', clipPath: 'polygon(0% 46%, 100% 18%, 100% 82%, 0% 54%)'}} /></div>{/* 原片彗星是一大团很软的蓝光锥，不是一把尖刀 */}
        <GlowSpot x={head - 20} y={532} rx={90} ry={50} rgb="90,130,255" a={0.7 * cometA} />
      </>}
      <div style={{position: 'absolute', left: TX, top: 532, transform: `translateY(-52%) scale(${tsc})`, transformOrigin: '50% 50%', display: 'flex', fontSize: FS, fontWeight: 500, whiteSpace: 'nowrap', textShadow: '0 0 14px rgba(160,180,255,0.55), 0 0 40px rgba(80,120,255,0.35)'}}>
        {L.map((c, i) => {
          const cx0 = TX + (i + 0.5) * FS * 1.02;
          const k = clamp((head - cx0) / 160) * (s > 7.9 ? 1 : 0);
          const w = Math.max(white, 0);
          const col = `rgb(${Math.round(150 + 95 * w)},${Math.round(165 + 82 * w)},255)`;
          return <span key={i} style={{opacity: k, color: col, filter: k < 1 ? `blur(${(1 - k) * 8}px)` : undefined}}>{c}</span>;
        })}
      </div>
      {s > 8.6 && <GlowSpot x={1019} y={560} rx={TW * 0.75} ry={60} rgb="70,110,255" a={0.35 * clamp((s - 8.6) / 0.5)} />}{/* 字下面一条横向的蓝色柔光（透镜放大带） */}
      {cOn && <div style={{position: 'absolute', left: cx - cw / 2, top: 532 - 48 * kf(s, [[8.85, 1], [9.1, 0.12]]), width: cw, height: 96 * kf(s, [[8.85, 1], [9.1, 0.12]]), /* 收尾光标缩成一个点 */ borderRadius: cw > 20 ? 18 : 3, background: '#f4f6ff', opacity: s > 8.95 ? clamp((9.15 - s) / 0.2) : 1, boxShadow: '0 0 12px rgba(200,215,255,0.8)', filter: s < 7.1 ? `blur(${(7.1 - s) * 30}px)` : undefined}} />}
    </>
  );
  return (
    <AbsoluteFill style={{overflow: 'hidden', fontFamily: SANS, background: '#04081a'}}>
      {lens}
      {content}
      {closing && (
        // 四个角的大暗圆压进来：用「整片暗色 − 中间四角星」画，星里面保留透镜和字
        <AbsoluteFill style={{background: 'radial-gradient(ellipse 80% 90% at 70% 100%, #1d3fa8 0%, #0d1f5c 45%, #060b24 100%)', WebkitMaskImage: `${STAR_SVG}, linear-gradient(#000 0 0)`, maskImage: `${STAR_SVG}, linear-gradient(#000 0 0)`, WebkitMaskSize: `${starW}px ${starW}px, 100% 100%`, maskSize: `${starW}px ${starW}px, 100% 100%`, WebkitMaskPosition: `${960 - starW / 2 - 30 * clamp((s - 10.1) / 0.5)}px ${540 - starW / 2}px, 0 0`, maskPosition: `${960 - starW / 2 - 30 * clamp((s - 10.1) / 0.5)}px ${540 - starW / 2}px, 0 0`, WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat', WebkitMaskComposite: 'xor', maskComposite: 'exclude'} as React.CSSProperties}>
          {Array.from({length: 30}, (_, i) => <div key={i} style={{position: 'absolute', left: hash(i) * 1920, top: hash(i * 3.3) * 1080, width: 3, height: 3, borderRadius: 2, background: '#9fb6ff', opacity: 0.2 + hash(i * 7) * 0.5}} />)}
        </AbsoluteFill>
      )}
      <div style={{position: 'absolute', right: 36, bottom: 26, fontSize: 20, color: 'rgba(200,210,255,0.45)', letterSpacing: '0.06em'}}>{x.note}</div>
    </AbsoluteFill>
  );
};

if (checkContract(PHOTO_LENS_TYPE_CONTRACT).length) throw new Error(checkContract(PHOTO_LENS_TYPE_CONTRACT).join('；'));
export const PhotoLensCursorType: React.FC = () => <PhotoLensCursorTypeGroup />;
