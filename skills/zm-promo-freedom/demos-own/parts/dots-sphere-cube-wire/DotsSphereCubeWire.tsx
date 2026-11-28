// 小零件：点云 → 点阵球 → 立方体 → 线框（78 帧，2.6 秒）
// 只播 DotCubeLogo 的第 0–78 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/dot-cube-logo/DotCubeLogo.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {DotCubeLogo as Source} from '../../groups/dot-cube-logo/DotCubeLogo'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const DOTS_SPHERE_CUBE_WIRE_DURATION = 78;
export const DotsSphereCubeWire_RANGE = [0, 78] as const; // 在原镜头里的起止帧

export const DotsSphereCubeWire: React.FC = () => (
  <Sequence from={-0} durationInFrames={78} layout="none">
    <Source />
  </Sequence>
);
