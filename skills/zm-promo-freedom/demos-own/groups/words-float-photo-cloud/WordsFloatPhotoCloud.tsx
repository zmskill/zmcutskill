// 【镜头组】words-float-photo-cloud：粉白渐变底，一句话的词高低错落、带着糊从下面浮上来（两行接力）→ 一张糊掉的白卡从镜头前擦过 →
//   一堆照片卡在纵深里散开，镜头往里穿、照片从身边擦过，最后又聚成一团（029-D 一拍，转场 / 使用场景）
// 学的动作（Rixlab · Nextel 17.5–22s，原片 1600×1200 带上下灰边，内容区 1600×900，按内容区量、放大到 1920×1080）：
//   17.6 第一行逐词浮上（每词 0.25s、错开 0.12s，由糊变清、从 +40px 升到位，最后一个词低半行再归位），字 95px 深藏蓝，居中 y528
//   18.5 第二行同样接上，19.3 整句缩到 0.9；19.7 一张糊掉的白卡从右往左擦过镜头
//   19.8–21.4 约 30 张照片卡（160–420 宽）在纵深里，镜头往里推（近的大、糊），21.4–21.9 往回退，照片聚成一团
// 我们的内容：「为你生活 / 和工作的方式 / 而设计。」；照片用素材库实拍（书桌、室内、咖啡馆、城市、人像）。
import React from 'react';
import {smoothKf} from '../_kit/smoothKey';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {GroupContract, checkContract, outputDuration, planExtras, toSource} from '../../../assets/lib/helpers/groupClock';

const FPS = 30;
const S0 = 17.5;
export const WORDS_FLOAT_PHOTO_CLOUD_CONTRACT: GroupContract = {
  sourceDuration: 135 / 30,
  fps: 30,
  motion: [[0, 1.75], [1.85, 135 / 30]],
  holds: [{at: 1.8, maxExtra: 1.5}],
  landmarks: {w1: 0.1, w2: 1.0, wipe: 2.2, cloud: 2.3, gather: 3.9},
  sfx: [
    {at: 'w1', type: '短甩', note: '轻 swoosh', tail: 0.6, volume: 0.3},
    {at: 'w2', type: '短甩', note: '轻 swoosh', tail: 0.6, volume: 0.3},
    {at: 'wipe', type: '运镜', note: '擦过 whoosh', volume: 0.45},
    {at: 'cloud', type: '上扬铺垫', note: '穿梭 swell', tail: 1.5, volume: 0.4},
  ],
  inputs: {},
};
export const planWordsFloat = (sec: number) => planExtras(WORDS_FLOAT_PHOTO_CLOUD_CONTRACT, sec);
export const wordsFloatFrames = (extras: number[]) => Math.round(outputDuration(WORDS_FLOAT_PHOTO_CLOUD_CONTRACT, extras) * FPS);
export const WORDS_FLOAT_PHOTO_CLOUD_DURATION = 135;

export const SANS = '"Inter","PingFang SC","Noto Sans CJK SC","Noto Sans SC",sans-serif';
export const NAVY = '#1f2f6e';
export const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
export const mix = (a: number, b: number, k: number) => a + (b - a) * k;
export const eo = (u: number) => 1 - Math.pow(1 - clamp(u), 3);
export const eio = (u: number) => { const x = clamp(u); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
export const hash = (n: number) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
export const kf = (t: number, K: number[][], e: (u: number) => number = eio) => { if (K.length > 2 && K.every((k, j) => j === 0 || k[0] > K[j - 1][0])) return smoothKf(t, K); if (t <= K[0][0]) return K[0][1]; for (let i = 0; i < K.length - 1; i++) if (t <= K[i + 1][0]) return mix(K[i][1], K[i + 1][1], e((t - K[i][0]) / (K[i + 1][0] - K[i][0]))); return K[K.length - 1][1]; };
export const PHOTOS = ['desk/desk00', 'desk/desk04', 'interior/interior01', 'interior/interior02', 'interior/interior03', 'cafe/in1', 'cafe/in3', 'cafe/out2', 'coffee/coffee03', 'city/city1', 'city/city4', 'city/city6', 'shortvideo/sv02', 'shortvideo/sv05', 'shortvideo/sv09', 'shortvideo/sv11', 'hz/hz02', 'hz/hz07', 'travel/travel03', 'market/market02'];
// 029-D 照片云：工作 + 生活场景（书桌、厨房、咖啡馆、朋友、通勤）
const CLOUD = ['work/work01', 'work/work22', 'work/work08', 'work/work15', 'work/work19', 'work/work04', 'work/work13', 'work/work26', 'work/work10', 'work/work02', 'work/work17', 'work/work21', 'work/work07', 'work/work25', 'work/work14', 'work/work05', 'work/work20', 'work/work11', 'work/work27', 'work/work09', 'work/work16', 'work/work06', 'work/work23', 'work/work12', 'work/work18']; // 2026-11-21 换成原片那种「人在工作 / 生活」的明亮横图（Pexels，见素材库 README）；之前是竖的人像和咖啡店 // 2026-11-19 去掉几张纯白空桌面（远看像空白卡），换成有人的生活 / 工作照
/** 粉白渐变底 */
export const PinkBg: React.FC<{variant?: 'corners' | 'right'}> = ({variant = 'corners'}) => variant === 'right' ? (
  // 029-E 吸管量：左边、左下发白（#fcf7fd），右半边和右上一大片粉紫（#ecb5f6），中间斜着过渡
  <AbsoluteFill style={{background: 'linear-gradient(105deg, #fdf9fd 0%, #fbf1fc 30%, #f2d2f8 58%, #ecb6f6 85%, #eab0f5 100%)'}}>
    <AbsoluteFill style={{background: 'radial-gradient(ellipse 40% 55% at 8% 88%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0) 100%)'}} />
    <AbsoluteFill style={{background: 'radial-gradient(ellipse 35% 35% at 18% 8%, rgba(240,200,248,0.6) 0%, rgba(240,200,248,0) 100%)'}} />
  </AbsoluteFill>
) : (
  <AbsoluteFill style={{background: '#fbf3fb'}}>
    <AbsoluteFill style={{background: 'radial-gradient(ellipse 45% 50% at 12% 85%, rgba(226,140,246,0.85) 0%, rgba(240,190,250,0) 100%)'}} />
    <AbsoluteFill style={{background: 'radial-gradient(ellipse 40% 55% at 92% 70%, rgba(232,160,246,0.7) 0%, rgba(240,190,250,0) 100%)'}} />
    <AbsoluteFill style={{background: 'radial-gradient(ellipse 50% 40% at 40% 10%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 100%)'}} />
  </AbsoluteFill>
);
/** 逐词浮上的一行 */
export const FloatLine: React.FC<{words: string[]; t0: number; s: number; y: number; fs?: number; color?: string}> = ({words, t0, s, y, fs = 95, color = NAVY}) => (
  <div style={{position: 'absolute', left: 0, right: 0, top: y, transform: 'translateY(-50%)', display: 'flex', justifyContent: 'center', gap: fs * 0.08, fontFamily: SANS, fontSize: fs, fontWeight: 600, color, whiteSpace: 'nowrap'}}>
    {words.map((w, i) => { const k = eo(clamp((s - t0 - i * 0.12) / 0.28)); const low = i === words.length - 1 ? 0.35 * (1 - eo(clamp((s - t0 - i * 0.12 - 0.15) / 0.3))) : 0; return <span key={i} style={{opacity: k, filter: k < 1 ? `blur(${(1 - k) * 10}px)` : undefined, transform: `translateY(${(1 - k) * 40 + low * fs}px) scale(${1 - low * 0.3})`, display: 'inline-block'}}>{w}</span>; })}
  </div>
);

export const WordsFloatPhotoCloudGroup: React.FC<{extras?: number[]}> = ({extras = [0]}) => {
  const tt = useCurrentFrame() / FPS;
  const s = toSource(tt, WORDS_FLOAT_PHOTO_CLOUD_CONTRACT, extras) + S0;
  const held = tt - (s - S0);
  const els: React.ReactNode[] = [];
  if (s < 19.9) {
    // 2026-11-19 逐帧：19.45 起整句跟着镜头往后退（19.65 缩到 ≈0.63、19.75 ≈0.55），被飞过来的照片挡住
    const sc = kf(s, [[19.0, 1], [19.4, 0.9], [19.65, 0.63], [19.75, 0.55], [19.9, 0.5]]);
    const l1Out = clamp((s - 18.3) / 0.3); // 原片第一行 18.3 起边淡边往上走
    els.push(<div key="t" style={{position: 'absolute', inset: 0, transform: `scale(${sc})`, opacity: 1 - clamp((s - 19.78) / 0.1)}}>
      <div style={{opacity: 1 - l1Out, transform: `translateY(${-l1Out * 60 + kf(s, [[17.42, 260], [17.55, 200], [17.7, 55], [17.85, 0]])}px)`, filter: l1Out > 0 ? `blur(${l1Out * 6}px)` : undefined}}><FloatLine words={['专为', '你的', '生活']} t0={17.47} s={s} y={528} fs={140} /></div>{/* 2026-11-21 原片第一行是从画面下方（低 ≈250px）一边升上来一边逐词出现，17.85 才到中线；之前固定在中线 */}
      <FloatLine words={['和', '工作', '而设计。']} t0={18.5} s={s} y={528} fs={140} />
    </div>);
  }
  // 原片 19.45–19.6：一张暗色糊照片贴着镜头擦过去，盖满全屏（只有这一张；后面那些"擦过去的"其实是从镜头前往远处飞的近处照片）
  // 2026-11-20 光流 + 逐帧：19.467 第一张照片是贴着镜头整屏盖住（很糊），然后往右后方退远（19.6 在右半边），不是从右往左擦过去——原来那张擦过去的暗卡删掉，改成第 0 张卡从镜头前退出去
  if (s > 19.45) {
    // 2026-11-19 第二次逐帧（camtrack 量整团卡的缩放）：19.95 → 20.95 画面里的卡整体缩到 0.26、21.15 → 21.95 又缩到 0.42——
    //   镜头是一直往后退着穿过一片卡（卡从镜头身后冒出来，先大、糊，再往远处飞），从头到尾没有往里推。之前我们 20.0 后改成往里推，方向反了，所以"运镜不对"
    //   退的速度：19.55–19.95 最快，20–21 ≈3.5 单位/秒，21–22 慢下来 ≈2；21.1 有一张卡贴着镜头冒出来盖满画面
    const p = kf(s, [[19.55, 0], [19.95, 1.6], [20.35, 3.0], [20.95, 5.0], [21.35, 6.0], [21.75, 6.8], [22.0, 7.2]]) + held * 0.5;
    const N = 30;
    const cards = Array.from({length: N}, (_, i) => {
      const z = i === 0 ? 0.55 : i === 1 ? -5.0 : i === 2 ? -0.5 : 3.0 - (i / N) * 8.0 + (hash(i * 5.3) - 0.5) * 0.4; // 最后一张在 21.2 前冒出来（原片 21.2 之后没有新卡贴脸，只剩远处一团）；第 2 张 = 19.8 贴着镜头的大糊卡 // 卡在纵深里铺开，后面的在镜头身后，等镜头退过它才出现
      const X = i === 0 ? kf(s, [[19.46, 0.06], [19.533, 0.18], [19.6, 0.38], [19.75, 0.46], [20.2, 0.5]]) : i === 1 ? 0.08 : i === 2 ? 0.1 : (hash(i) - 0.5) * 2.1 + (i % 4 === 0 ? (hash(i * 7.7) - 0.5) * 0.5 : 0);
      const ti = i === 0 ? 19.57 : 19.6 + hash(i * 4.1) * 0.36;
      const u = i >= 1 && z > 0.2 ? eo(clamp((s - ti) / 0.45)) : 1; // 一开始就在镜头前的几张：从近处飞出去
      return {X, Y: i === 0 ? 0.04 : i === 1 ? -0.1 : i === 2 ? 0.05 : (hash(i * 2.7) - 0.5) * 1.0, w: i === 0 ? 520 : i === 1 ? 460 : i === 2 ? 560 : 200 + hash(i * 9.1) * 180, ar: 0.58 + hash(i * 3.3) * 0.1, p: CLOUD[i % CLOUD.length], on: i === 0 ? s > 19.455 : s > (z > 0.2 ? ti : 19.6), d: i === 0 ? mix(0.2, 0.55, eo(clamp((s - 19.46) / 0.3))) + p : z + p - (1 - u) * Math.max(0, z + p - 0.5), fly: 0, near: i === 0};
    }).filter((c) => c.on && (c.near ? c.d > 0.12 : c.d > 0.3)).sort((a, b) => b.d - a.d);
    cards.forEach((c, i) => {
      const f = 1.4 / c.d;
      const W = c.w * f, H = W * c.ar;
      const x = 700 + c.X * 900 * f, y = 470 + c.Y * 900 * f; // 原片整团偏左（中心 ≈0.37 宽） // 原片整团往远处收的中心 ≈ (900,500)
      const blur = (c.d < 1 ? (1 - c.d) * 18 : c.d > 6 ? Math.min(3, (c.d - 6) * 1.5) : 0) + c.fly * 6;
      els.push(<Img key={i} src={staticFile(`library/photos/${c.p}.jpg`)} style={{position: 'absolute', left: x - W / 2, top: y - H / 2, width: W, height: H, objectFit: 'cover', objectPosition: '50% 32%', borderRadius: 12 * f, boxShadow: '0 10px 30px rgba(80,40,120,0.16)', filter: blur > 0.3 ? `blur(${blur}px)` : undefined, opacity: (c.near ? 1 : clamp((c.d - 0.3) / 0.25)) * clamp((9.5 - c.d) / 1.5)}} />);
    });
  }
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <PinkBg />
      {els}
    </AbsoluteFill>
  );
};

if (checkContract(WORDS_FLOAT_PHOTO_CLOUD_CONTRACT).length) throw new Error(checkContract(WORDS_FLOAT_PHOTO_CLOUD_CONTRACT).join('；'));
export const WordsFloatPhotoCloud: React.FC = () => <WordsFloatPhotoCloudGroup />;
