// 小零件：大圆缩成点 · 点阵迎面炸开聚成球（144 帧，4.8 秒）
// 整个镜头就是这一个动作：DotBurstSphere 从头播到尾，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/dot-burst-sphere/DotBurstSphere.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {DotBurstSphere as Source} from '../../groups/dot-burst-sphere/DotBurstSphere'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const DOT_BURST_SPHERE_DURATION = 144;
export const DotBurstSphere_RANGE = [0, 144] as const; // 在原镜头里的起止帧

export const DotBurstSphere: React.FC = () => (
  <Sequence from={-0} durationInFrames={144} layout="none">
    <Source />
  </Sequence>
);
