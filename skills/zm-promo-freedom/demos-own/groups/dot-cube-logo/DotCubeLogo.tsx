// 【镜头组】dot-cube-logo：点云 → 点阵球 → 点阵立方体 → 白色线框立方体转到"顶点朝前" → 一个浅色圆从中心撑开、底色反转（线变蓝）→
//   立方体缩小上移，下面大字标从下往上露出，再出网址和一行安装命令（033-D 一拍，收尾核心）
// 学的动作（dwhitedesign · cube 27–35s，60fps 逐帧量过）：
//   27.0 三团点云 → 27.4 一大团（1140,540）→ 27.8 球（972,510）r348 → 28.2（960,540）r345 → 28.6 点阵立方体（930,570）
//   29.0 换成白色线框（边长≈470），29.0–29.4 转到顶点朝前（绕竖轴 45°、前倾 35°），中心（960,570）
//   29.6–30.1 浅色圆（#f2f1ee）从中心撑满，圆里的线变蓝（#5b6fe0），背面的边变成淡蓝细线
//   30.2 边长≈480 → 30.6 缩到 340、上移到 y390 → 31.0 290、y330 → 31.4 y300
//   30.9 大字标（220px）从下往上露出（y630），31.7 网址（34px，y798），32.4 安装命令逐字打出（28px 蓝，y906），停到 35
// 我们的内容：虚构的点阵动效库「点动」，网址用保留的示例域名 dianmo.example，右下角标"虚构 · 仅作演示"。
import React from 'react';
import {smoothKf} from '../_kit/smoothKey';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {GroupContract, checkContract, checkInputs, outputDuration, planExtras, toSource} from '../../../assets/lib/helpers/groupClock';
import {CUBE_EDGES, DotCanvas, Form, balls, clamp, cloud, cubeForm, cubeVerts, eio, hash, eo, mix, sphere, timeline} from '../_kit/dotField';
import {BG, SANS_EN} from '../dot-burst-sphere/DotBurstSphere';

const FPS = 30;
const S0 = 27;
export const DOT_CUBE_LOGO_CONTRACT: GroupContract = {
  sourceDuration: 240 / 30,
  fps: 30,
  motion: [[0, 5.95], [6.05, 240 / 30]],
  holds: [{at: 6.0, maxExtra: 3}],
  landmarks: {sphere: 0.8, cube: 1.6, wire: 2.0, flip: 2.6, shrink: 3.2, word: 3.9, url: 4.7, cmd: 5.4},
  sfx: [
    {at: 'sphere', type: '闪光', note: '聚合 shimmer', volume: 0.35},
    {at: 'wire', type: '点击', note: '线框 click', volume: 0.35},
    {at: 'flip', type: '落版重击', note: '底色反转 whoom', volume: 0.5},
    {at: 'word', type: '提示音', note: '落版 chime', volume: 0.45},
    {at: 'cmd', type: '键盘', note: '打字', tail: 0.5, volume: 0.25},
  ],
  inputs: {name: {maxChars: 4}, url: {maxChars: 20}, cmd: {maxChars: 20}},
};
export type CubeInputs = {name: string; url: string; cmd: string; note: string};
export const CUBE_DEFAULT_INPUTS: CubeInputs = {name: '点动', url: 'dianmo.example', cmd: 'npm i dianmo', note: '虚构 · 仅作演示'};
export const checkCubeInputs = (x: CubeInputs) => checkInputs(DOT_CUBE_LOGO_CONTRACT, {name: x.name, url: x.url, cmd: x.cmd});
export const planCube = (sec: number) => planExtras(DOT_CUBE_LOGO_CONTRACT, sec);
export const cubeFrames = (extras: number[]) => Math.round(outputDuration(DOT_CUBE_LOGO_CONTRACT, extras) * FPS);
export const DOT_CUBE_LOGO_DURATION = 240;

const kf = (t: number, K: number[][], e: (u: number) => number = eio) => { if (K.length > 2 && K.every((k, j) => j === 0 || k[0] > K[j - 1][0])) return smoothKf(t, K); if (t <= K[0][0]) return K[0][1]; for (let i = 0; i < K.length - 1; i++) if (t <= K[i + 1][0]) return mix(K[i][1], K[i + 1][1], e((t - K[i][0]) / (K[i + 1][0] - K[i][0]))); return K[K.length - 1][1]; };
const Wire: React.FC<{V: {x: number; y: number; z: number}[]; color: string; back?: string; w?: number}> = ({V, color, back, w = 2.5}) => (
  <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
    {CUBE_EDGES.map(([a, b], i) => {
      const isBack = back && (V[a].z + V[b].z) / 2 < -0.3;
      return <line key={i} x1={V[a].x} y1={V[a].y} x2={V[b].x} y2={V[b].y} stroke={isBack ? back : color} strokeWidth={isBack ? 1.4 : w} strokeDasharray={isBack ? '6 6' : undefined} strokeLinecap="round" />;
    })}
  </svg>
);

export const DotCubeLogoGroup: React.FC<{inputs?: CubeInputs; extras?: number[]}> = ({inputs: x = CUBE_DEFAULT_INPUTS, extras = [0]}) => {
  const tt = useCurrentFrame() / FPS;
  const s = toSource(tt, DOT_CUBE_LOGO_CONTRACT, extras) + S0;
  const rot = s * 0.55;
  const ry = kf(s, [[28.4, 0.3], [28.8, 0.62], [29.1, Math.PI / 4]]); // 原片 29.1 前棱就已经正对镜头
  const rx = kf(s, [[28.4, -0.25], [28.8, -0.5], [29.1, -0.6155]]);
  // 2026-11-18 原片方块从 29.8 就开始一路缩、一路往上走，不是停到 30.2 再一下缩
  const S = kf(s, [[28.6, 480], [29.0, 455], [29.4, 455], [29.8, 453], [29.97, 430], [30.1, 403], [30.23, 365], [30.37, 323], [30.6, 290], [31.0, 240], [31.4, 226]]);
  const cy = kf(s, [[28.6, 570], [29.4, 570], [29.7, 568], [29.97, 544], [30.1, 524], [30.23, 488], [30.37, 450], [30.6, 390], [31.0, 330], [31.4, 300]]);
  const cx = kf(s, [[28.6, 930], [29.4, 960]]);
  const dots: Form = timeline(s, [
    [27.0, (t) => balls([{x: 1050, y: 680, r: 125}, {x: 1325, y: 300, r: 55}, {x: 1745, y: 700, r: 70}], t * 0.55).map((d, k) => ({...d, x: d.x + Math.sin(k * 12.9 + t * 9) * 26 * (0.4 + (k % 7) / 7), y: d.y + Math.cos(k * 7.3 + t * 8) * 26 * (0.4 + (k % 5) / 5)})), {stagger: 0.3, drift: 60}], // 2026-11-19 接上一段结尾的三团毛毛球（之前是三团散云，两段接不上）
    [27.45, () => sphere(995, 520, 380, rot).map((d, k) => ({...d, x: d.x + (hash(k * 2.3) - 0.5) * 110, y: d.y + (hash(k * 4.1) - 0.5) * 110, a: d.a * 0.7})), {stagger: 0.15, drift: 20}], // 原片 27.6 已经看得出是一颗带抖动的点阵球
    [27.8, () => sphere(972, 510, 348, rot), {stagger: 0.1, drift: 0}],
    [28.2, () => sphere(960, 540, 345, rot), {stagger: 0.4, drift: 40}],
    [28.65, () => cubeForm(cx, cy, S, ry, rx)],
  ]);
  const dotA = 1 - clamp((s - 28.9) / 0.2);
  const wireA = clamp((s - 28.85) / 0.2);
  const V = cubeVerts(cx, cy, S, ry, rx);
  const R = kf(s, [[29.5, 0], [29.8, 900], [30.05, 1300]], eo);
  const word = eo(clamp((s - 30.9) / 0.4));
  const url = eo(clamp((s - 31.7) / 0.35));
  const cmdN = Math.floor(clamp((s - 32.4) / 0.5) * x.cmd.length + 0.001);
  return (
    <AbsoluteFill style={{background: BG, overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, opacity: dotA}}><DotCanvas dots={dots} /></div>
      {wireA > 0 && <div style={{position: 'absolute', inset: 0, opacity: wireA, filter: 'drop-shadow(0 0 2px rgba(170,160,255,0.6)) drop-shadow(0 0 7px rgba(130,110,255,0.25))'}}><Wire V={V} color="#f4f2ff" w={3.2} /></div>} {/* 原片线条带一层紫色辉光 */}
      {R > 0 && (
        <div style={{position: 'absolute', inset: 0, clipPath: `circle(${R}px at 960px 560px)`, background: '#f2f1ee'}}>
          <Wire V={V} color="#5b6fe0" back="rgba(91,111,224,0.4)" w={3.4} />
          {word > 0 && (
            <div style={{position: 'absolute', left: 0, right: 0, top: 630 - 150, height: 300, overflow: 'hidden', textAlign: 'center'}}>
              <div style={{fontFamily: SANS_EN, fontSize: 220, fontWeight: 700, color: '#1c1c1e', lineHeight: '300px', transform: `translateY(${(1 - word) * 260}px)`, letterSpacing: '-0.02em'}}>{x.name}</div>
            </div>
          )}
          <div style={{position: 'absolute', left: 0, right: 0, top: 778, textAlign: 'center', fontFamily: SANS_EN, fontSize: 34, color: '#454548', opacity: url, transform: `translateY(${(1 - url) * 16}px)`}}>{x.url}</div>
          {cmdN > 0 && <div style={{position: 'absolute', left: 0, right: 0, top: 890, textAlign: 'center', fontFamily: '"JetBrains Mono","SF Mono",Menlo,monospace', fontSize: 28, color: '#5b6fe0'}}>{x.cmd.slice(0, cmdN)}</div>}
          <div style={{position: 'absolute', right: 40, bottom: 30, fontFamily: SANS_EN, fontSize: 20, color: 'rgba(60,60,70,0.5)', letterSpacing: '0.06em', opacity: url}}>{x.note}</div>
        </div>
      )}
    </AbsoluteFill>
  );
};

if (checkContract(DOT_CUBE_LOGO_CONTRACT).length) throw new Error(checkContract(DOT_CUBE_LOGO_CONTRACT).join('；'));
export const DotCubeLogo: React.FC = () => <DotCubeLogoGroup />;
