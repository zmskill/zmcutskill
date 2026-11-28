// 小零件：卡片绕大数字转 · 数字滚到终值（114 帧，3.8 秒）
// 整个镜头就是这一个动作：CardOrbitCounter 从头播到尾，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/data/card-orbit-counter/CardOrbitCounter.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {CardOrbitCounter as Source} from '../../data/card-orbit-counter/CardOrbitCounter'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const CARD_ORBIT_COUNTER_DURATION = 114;
export const CardOrbitCounter_RANGE = [0, 114] as const; // 在原镜头里的起止帧

export const CardOrbitCounter: React.FC = () => (
  <Sequence from={-0} durationInFrames={114} layout="none">
    <Source />
  </Sequence>
);
