// 小零件：蓝圆炸成放射线 · 数字跳三次（177 帧，5.9 秒）
// 整个镜头就是这一个动作：RayBurstCounter 从头播到尾，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/ray-burst-counter/RayBurstCounter.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {RayBurstCounter as Source} from '../../groups/ray-burst-counter/RayBurstCounter'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const RAY_BURST_COUNTER_DURATION = 177;
export const RayBurstCounter_RANGE = [0, 177] as const; // 在原镜头里的起止帧

export const RayBurstCounter: React.FC = () => (
  <Sequence from={-0} durationInFrames={177} layout="none">
    <Source />
  </Sequence>
);
