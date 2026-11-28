// 【镜头组】photo-flash-bulge：按钮被拉成上下两道紫色光带 → 中间冒出一张小照片，背景铺开一片淡粉的像素格 →
//   旅行照片一张接一张飞快地换（每张 0.1 秒左右、边换边变大），颜色越来越霓虹（粉、蓝、加网点）→
//   最后一张像鱼眼一样四边往里凹、鼓起来撑满画面（021-H 一拍，结果 / 灵感）
// 学的动作（mnowakdesign · Roamly 21.60–23.367s，30fps 逐帧量过；时间表 （内部拆片记录，未随项目提供））：
//   照片外框逐帧量（720p）：309×173（21.73）→ 456×256（21.87）→ 换张缩回 → … → 686×343（22.93）→ 23.0 起四边内凹鼓起，23.2 撑满；
//   换张时刻 21.65 / 21.77 / 21.97 / 22.07 / 22.17 / 22.37 / 22.47 / 22.57 / 22.77 / 22.87 / 22.97 / 23.17 / 23.27；22.2 起逐渐霓虹化。
// 我们的内容：真旅行照片（第4轮起，library/photos/travel）：灯塔、小屋、海滩、湖山、港口……
//
// 拍表（源秒 = 原片秒 − 21.60，30fps，共 53 帧）
//   拍 1 光带 → 小照片   0.00–0.20
//   拍 2 快速换照片       0.17–1.37   （停留点 1.40：换张变慢的那一下）
//   拍 3 鼓起撑满         1.43–1.767
// 毛病清单：
//   - 通用：画面永远不停（停留时整体极慢推近）；--hq 渲染；确定性
//   - 独有 1：每张照片出现时比上一张略小、然后长大，像在"往前冲"
//   - 独有 2：鼓起是四边往里凹的鱼眼形状，不是普通放大
import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {Grain} from '../../../assets/lib/helpers/polish';
import {GroupContract, checkContract, checkInputs, outputDuration, planExtras, toSource} from '../../../assets/lib/helpers/groupClock';

const FPS = 30;
const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const mix = (a: number, b: number, k: number) => a + (b - a) * k;
const kfl = (t: number, K: number[][]) => { if (t <= K[0][0]) return K[0][1]; for (let i = 0; i < K.length - 1; i++) if (t <= K[i + 1][0]) return mix(K[i][1], K[i + 1][1], (t - K[i][0]) / (K[i + 1][0] - K[i][0])); return K[K.length - 1][1]; };
const T0 = 648 / 30;

export const PHOTO_FLASH_BULGE_CONTRACT: GroupContract = {
  sourceDuration: 53 / 30,
  fps: 30,
  motion: [[0, 1.37], [1.43, 53 / 30]],
  holds: [{at: 1.4, maxExtra: 0.8}],
  landmarks: {stripes: 0, first: 0.13, flick: 0.37, neon: 0.6, bulge: 1.4, fill: 1.6, exit: 53 / 30},
  sfx: [
    {at: 'first', type: '快门', note: '快门 click', volume: 0.3},
    {at: 'flick', type: '快门', note: '一串快门 / 翻页 tick（快速换照片）', tail: 1.0, volume: 0.3},
    {at: 'bulge', type: '上扬铺垫', note: '低频 swell + whoosh（鼓起撑满）', tail: 0.4, volume: 0.4},
    {at: 'bulge', type: '运镜', note: '低频 swell + whoosh（鼓起撑满）', tail: 0.4, volume: 0.4},
  ],
  inputs: {},
};
export const checkPhotoInputs = () => checkInputs(PHOTO_FLASH_BULGE_CONTRACT, {});
export const planPhoto = (sec: number) => planExtras(PHOTO_FLASH_BULGE_CONTRACT, sec);
export const photoFrames = (extras: number[]) => Math.round(outputDuration(PHOTO_FLASH_BULGE_CONTRACT, extras) * FPS);
export const PHOTO_FLASH_BULGE_DURATION = 53;

// 照片外框（720p）：时刻、左、右、上、下
const RECT = [[21.67, 600, 680, 515, 560], [21.733, 485, 794, 267, 440], [21.8, 442, 838, 245, 464], [21.867, 412, 868, 226, 482], [21.933, 486, 796, 251, 456], [22.0, 472, 808, 243, 466], [22.067, 414, 866, 228, 480], [22.133, 402, 878, 221, 487], [22.2, 359, 922, 198, 509], [22.267, 348, 932, 191, 516], [22.333, 368, 916, 258, 535], [22.4, 360, 924, 264, 540], [22.467, 326, 952, 276, 562], [22.533, 318, 960, 284, 568], [22.6, 328, 954, 255, 552], [22.667, 320, 962, 250, 554], [22.733, 352, 930, 240, 570], [22.8, 347, 935, 238, 574], [22.867, 304, 974, 240, 576], [22.933, 296, 982, 239, 582], [23.0, 234, 1046, 80, 622], [23.067, 214, 1064, 66, 636], [23.133, 42, 1238, 4, 694], [23.2, -40, 1320, -30, 750], [23.267, 102, 1174, -10, 730], [23.367, 40, 1100, -40, 760]];
const SWAP = [21.65, 21.77, 21.97, 22.07, 22.17, 22.37, 22.47, 22.57, 22.77, 22.87, 22.97, 23.17, 23.27];

// 2026-11-17 第4轮：原片是真旅行照片 → 换成真照片（library/photos/travel，Unsplash 免费授权）
//   顺序照原片：灯塔开头、林中小屋、海滩、湖山……最后鼓起撑满的是港口
export const TRAVEL = ['travel00', 'travel03', 'travel10', 'travel13', 'travel01', 'travel04', 'travel07', 'travel11', 'travel15', 'travel02', 'travel05', 'travel06', 'travel09'];
export const Scene: React.FC<{i: number; w: number; h: number}> = ({i, w, h}) => (
  <Img src={staticFile(`library/photos/travel/${TRAVEL[i % TRAVEL.length]}.jpg`)} style={{width: w, height: h, objectFit: 'cover', display: 'block'}} />
);

export const CELLS: [number, number, string][] = (() => {
  const out: [number, number, string][] = [];
  for (let gy = 0; gy < 30; gy++) for (let gx = 0; gx < 54; gx++) {
    const x = gx * 24 - 8, y = gy * 24 - 4;
    const dx = (x - 640) / 520, dy = (y - 360) / 330, r = Math.sqrt(dx * dx + dy * dy);
    const nz = Math.abs(Math.sin(gx * 12.9898 + gy * 78.233) * 43758.5453) % 1;
    const blob = Math.abs(Math.sin(Math.floor(gx / 3) * 3.1 + Math.floor(gy / 2) * 7.7) * 9341.7) % 1;
    if (r > 0.55 && nz < clamp((r - 0.55) * 1.6) && blob > 0.25) out.push([x, y, ['rgba(240,170,215,0.8)', 'rgba(170,180,250,0.8)', 'rgba(230,200,235,0.8)'][(gx + gy) % 3]]);
  }
  return out;
})();

export const PhotoFlashBulgeGroup: React.FC<{extras?: number[]}> = ({extras = [0]}) => {
  const t = useCurrentFrame() / FPS;
  const s = toSource(t, PHOTO_FLASH_BULGE_CONTRACT, extras) + T0;
  const lag = t - (s - T0);
  const cam = 1 + 0.004 * lag;
  const [L, R, T0r, B0r] = [1, 2, 3, 4].map((j) => kfl(s, RECT.map((r) => [r[0], r[j]])));
  // 22.97 之前照片比例固定（宽 : 高 ≈ 1 : 0.62，中心 y≈352），之后用量出来的鼓起外框
  const hh = (R - L) * 0.62, kb = clamp((s - 22.93) / 0.07);
  const T = mix(352 - hh / 2, T0r, kb), B = mix(352 + hh / 2, B0r, kb);
  let idx = 0; for (let i = 0; i < SWAP.length; i++) if (s >= SWAP[i]) idx = i;
  const neon = clamp((s - 21.9) / 0.7);
  const bulge = clamp((s - 22.97) / 0.2); // 四边内凹程度
  const w = R - L, h = B - T;
  const cv = bulge * 0.16; // 凹进去的比例
  const clip = `path('M 0 0 Q ${w / 2} ${h * cv} ${w} 0 Q ${w * (1 - cv)} ${h / 2} ${w} ${h} Q ${w / 2} ${h * (1 - cv)} 0 ${h} Q ${w * cv} ${h / 2} 0 0 Z')`;
  const stripes = s < 21.75 ? 1 - clamp((s - 21.65) / 0.1) : 0;
  const stripeY = mix(80, 30, clamp((s - 21.6) / 0.1));
  const grid = clamp((s - 21.75) / 0.1);

  return (
    <AbsoluteFill style={{background: '#fff', overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, transform: `scale(${cam})`, transformOrigin: '960px 540px'}}>
        <div style={{position: 'absolute', left: 0, top: 0, width: 1280, height: 720, transform: 'scale(1.5)', transformOrigin: '0 0'}}>
          {/* 像素格：一格 24px、方块 16px，离中心越远越密，随机缺块；带一点粉 / 蓝描边（照原片 22.2s） */}
          <svg width={1280} height={720} style={{position: 'absolute', left: 0, top: 0, opacity: grid * 0.75, filter: 'blur(1.6px)', transform: `scale(${1 + 0.18 * clamp((s - 21.75) / 1.5)})`, transformOrigin: '640px 360px'}}>
            {CELLS.map(([x, y, c], i) => <rect key={i} x={x} y={y} width={16} height={16} rx={2} fill="rgba(228,230,246,0.9)" stroke={c} strokeWidth={1} />)}
          </svg>
          {/* 按钮拉成的两道光带 */}
          {stripes > 0 && [0, 1].map((j) => <div key={j} style={{position: 'absolute', left: -20, right: -20, top: j ? 360 + stripeY * 2.6 : 360 - stripeY * 2.6 - 24, height: 24, background: 'linear-gradient(180deg, rgba(200,120,240,0.2), #c88af0 40%, #b06ae8 60%, rgba(200,120,240,0.2))', opacity: stripes, filter: 'blur(1.5px)'}} />)}
          {/* 照片 */}
          {s >= 21.66 && (
            <div style={{position: 'absolute', left: L, top: T, width: w, height: h, clipPath: clip, boxShadow: bulge < 0.1 ? '0 0 0 2px rgba(240,120,90,0.7)' : undefined}}>
              <div style={{position: 'absolute', inset: 0, filter: `blur(0.6px) saturate(${1 + neon * 1.6}) contrast(${1 + neon * 0.35}) hue-rotate(${neon * -25}deg)`}}><Scene i={idx} w={w} h={h} /></div>
              {/* 霓虹：原片每张照片被整片染成 品红→红 或 蓝→品红（双色调），越往后越重 */}
              <div style={{position: 'absolute', inset: 0, background: idx % 2 && idx < 11 ? 'linear-gradient(135deg, #ff2d95, #ff3b2f 70%, #ffb03a)' : 'linear-gradient(135deg, #3a4dff, #7a3cff 55%, #ff2d95)', mixBlendMode: 'color', opacity: 0.12 + 0.55 * neon}} />
              <div style={{position: 'absolute', inset: 0, background: `linear-gradient(135deg, rgba(255,30,150,${0.35 * neon}), rgba(50,80,255,${0.35 * neon}))`, mixBlendMode: 'screen'}} />
              {/* LED 屏一样的细格（原片照片上一格约 4px 的暗线网） */}
              <div style={{position: 'absolute', inset: 0, opacity: 0.3 + 0.35 * neon, backgroundImage: 'repeating-linear-gradient(90deg, rgba(0,0,0,0.5) 0 1px, transparent 1px 4px), repeating-linear-gradient(0deg, rgba(0,0,0,0.5) 0 1px, transparent 1px 4px)', mixBlendMode: 'multiply'}} />
              {bulge > 0 && <div style={{position: 'absolute', inset: 0, boxShadow: `inset 0 0 ${40 * bulge}px rgba(255,255,255,${0.6 * bulge})`}} />}
            </div>
          )}
        </div>
      </div>
      <Grain opacity={0.03} blend="multiply" />
    </AbsoluteFill>
  );
};

if (checkContract(PHOTO_FLASH_BULGE_CONTRACT).length) throw new Error(checkContract(PHOTO_FLASH_BULGE_CONTRACT).join('；'));
export const PhotoFlashBulge: React.FC = () => <PhotoFlashBulgeGroup />;
