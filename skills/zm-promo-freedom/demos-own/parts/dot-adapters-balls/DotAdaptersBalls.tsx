// 小零件：点云聚成四颗点阵球 · 各带名字（126 帧，4.2 秒）
// 整个镜头就是这一个动作：DotAdaptersBalls 从头播到尾，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/dot-adapters-balls/DotAdaptersBalls.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {DotAdaptersBalls as Source} from '../../groups/dot-adapters-balls/DotAdaptersBalls'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const DOT_ADAPTERS_BALLS_DURATION = 126;
export const DotAdaptersBalls_RANGE = [0, 126] as const; // 在原镜头里的起止帧

export const DotAdaptersBalls: React.FC = () => (
  <Sequence from={-0} durationInFrames={126} layout="none">
    <Source />
  </Sequence>
);
