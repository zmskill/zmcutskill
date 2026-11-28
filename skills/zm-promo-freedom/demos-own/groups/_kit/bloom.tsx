// 辉光 + 调色层（2026-11-19）
// 为什么要有：原片里的「光」是 白热的芯 + 有颜色的内光晕 + 很大一圈外光晕 叠出来的（合成里叫 bloom / 辉光，AE 的 Deep Glow、
//   游戏引擎的后期 bloom 都是这个做法：先把画面里亮的部分挑出来 → 用几种不同半径模糊 → 用「相加」叠回去），
//   再加一层整体调色（曝光 / 饱和度 / 对比）。我们以前每个发光元素只画一条细线 + 一点点 box-shadow，所以光感出不来、整体偏暗偏灰。
// 用法：把整组画面包起来  <Bloom threshold={0.55} radii={[6, 24, 80]} strength={[0.9, 0.7, 0.5]} grade={{exposure: 1.2, saturate: 1.3}}>…</Bloom>
//   threshold：多亮的地方才发光（0–1）；radii：几层光晕的模糊半径（px）；strength：每层强度；tint：光晕染色（可选）
//   参数按「同帧对比」工具量出来的原片亮度 / 饱和度去校准。
import React from 'react';
import {AbsoluteFill} from 'remotion';

export type GradeOpts = {exposure?: number; saturate?: number; contrast?: number; hue?: number};
export type BloomOpts = {threshold?: number; radii?: number[]; strength?: number[]; tint?: string; grade?: GradeOpts; off?: boolean};

const gradeFilter = (g?: GradeOpts) => {
  if (!g) return undefined;
  const f: string[] = [];
  if (g.exposure !== undefined && g.exposure !== 1) f.push(`brightness(${g.exposure})`);
  if (g.contrast !== undefined && g.contrast !== 1) f.push(`contrast(${g.contrast})`);
  if (g.saturate !== undefined && g.saturate !== 1) f.push(`saturate(${g.saturate})`);
  if (g.hue) f.push(`hue-rotate(${g.hue}deg)`);
  return f.length ? f.join(' ') : undefined;
};

/** 用 brightness + contrast 做「阈值」：亮度低于 threshold 的压成黑，高于的保留（这样只有亮的地方会发光） */
const thresholdFilter = (t: number) => {
  const c = 4;
  const b = (0.5 - 0.5 / c) / Math.max(0.05, t);
  return `brightness(${b.toFixed(3)}) contrast(${c})`;
};

export const Bloom: React.FC<React.PropsWithChildren<BloomOpts>> = ({children, threshold = 0.55, radii = [6, 24, 80], strength = [0.8, 0.6, 0.45], tint, grade, off}) => {
  if (off) return <AbsoluteFill style={{filter: gradeFilter(grade)}}>{children}</AbsoluteFill>;
  return (
    <AbsoluteFill style={{filter: gradeFilter(grade), isolation: 'isolate', overflow: 'hidden'}}>
      {children}
      {radii.map((r, i) => (
        <AbsoluteFill key={i} style={{mixBlendMode: 'plus-lighter', opacity: strength[i] ?? strength[strength.length - 1], pointerEvents: 'none'}}>
          <AbsoluteFill style={{filter: `${thresholdFilter(threshold)} blur(${r}px)`}}>{children}</AbsoluteFill>
          {tint && <AbsoluteFill style={{background: tint, mixBlendMode: 'multiply'}} />}
        </AbsoluteFill>
      ))}
    </AbsoluteFill>
  );
};
