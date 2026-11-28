// 小零件：玻璃面板浮起 · 弧光升起 · 界面一层层显出（177 帧，5.9 秒）
// 整个镜头就是这一个动作：GlassDashboardArc 从头播到尾，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/glass-dashboard-arc/GlassDashboardArc.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {GlassDashboardArc as Source} from '../../groups/glass-dashboard-arc/GlassDashboardArc'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const GLASS_DASHBOARD_ARC_DURATION = 177;
export const GlassDashboardArc_RANGE = [0, 177] as const; // 在原镜头里的起止帧

export const GlassDashboardArc: React.FC = () => (
  <Sequence from={-0} durationInFrames={177} layout="none">
    <Source />
  </Sequence>
);
