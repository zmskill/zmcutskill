// 小零件：四角星收走上一句 · 转两下出字标（90 帧，3.0 秒）
// 整个镜头就是这一个动作：StarSpinWordmarkArcs 从头播到尾，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/star-spin-wordmark-arcs/StarSpinWordmarkArcs.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {StarSpinWordmarkArcs as Source} from '../../groups/star-spin-wordmark-arcs/StarSpinWordmarkArcs'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const STAR_SPIN_WORDMARK_ARCS_DURATION = 90;
export const StarSpinWordmarkArcs_RANGE = [0, 90] as const; // 在原镜头里的起止帧

export const StarSpinWordmarkArcs: React.FC = () => (
  <Sequence from={-0} durationInFrames={90} layout="none">
    <Source />
  </Sequence>
);
