// partPlay.tsx — 从原镜头中裁取一个小零件的帧段并按原速一口气播完（references/visual-and-parts.md）。
//
// 原则：零件按原速流畅播放，不冻帧、不停留、不慢放；对拍靠挪起点帧（onF）、镜头运动（camMoves）和速度接力切点（relay）。
//
// 用法：
//   <Sequence from={startFrame} durationInFrames={partPlayLength(783, 833)}>
//     <PartPlay from={783} to={833}><OriginalShot /></PartPlay>
//   </Sequence>
import React from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame} from 'remotion';

/** 零件原始长度（帧） */
export const partPlayLength = (from: number, to: number) => Math.max(0, to - from);

/** 片内第 f 帧（零件局部 0 起）对应原镜头的帧号，播完后停在末帧（由外层镜头慢推延续阅读时间） */
export const partSourceFrame = (f: number, from: number, to: number) => ({
  frame: Math.min(to - 1, from + Math.max(0, f)),
  held: 0,
});

export const PartPlay: React.FC<{
  from: number; // 原镜头起帧
  to: number; // 原镜头止帧（不含）
  children: React.ReactNode; // 原镜头组件
}> = ({from, to, children}) => {
  const f = useCurrentFrame();
  const {frame} = partSourceFrame(f, from, to);
  return (
    <AbsoluteFill>
      {/* 平移时间轴让原镜头精确落在第 frame 帧，播完后保持在末帧，避免使用 <Freeze> 裁切靠后段落 */}
      <Sequence from={f - frame} durationInFrames={to} layout="none">
        {children}
      </Sequence>
    </AbsoluteFill>
  );
};
