// 小零件：一句话换词四次 · 产品面板升起（138 帧，4.6 秒）
// 整个镜头就是这一个动作：HeadlineSwapDashboardRise 从头播到尾，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/headline-swap-dashboard-rise/HeadlineSwapDashboardRise.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {HeadlineSwapDashboardRise as Source} from '../../groups/headline-swap-dashboard-rise/HeadlineSwapDashboardRise'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const HEADLINE_SWAP_DASHBOARD_RISE_DURATION = 138;
export const HeadlineSwapDashboardRise_RANGE = [0, 138] as const; // 在原镜头里的起止帧

export const HeadlineSwapDashboardRise: React.FC = () => (
  <Sequence from={-0} durationInFrames={138} layout="none">
    <Source />
  </Sequence>
);
