// 小零件：胶囊一条条甩出去 · 进度卡清单打勾（113 帧，3.8 秒）
// 整个镜头就是这一个动作：PillsOutProgressDashboard 从头播到尾，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/pills-out-progress-dashboard/PillsOutProgressDashboard.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {PillsOutProgressDashboard as Source} from '../../groups/pills-out-progress-dashboard/PillsOutProgressDashboard'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const PILLS_OUT_PROGRESS_DASHBOARD_DURATION = 113;
export const PillsOutProgressDashboard_RANGE = [0, 113] as const; // 在原镜头里的起止帧

export const PillsOutProgressDashboard: React.FC = () => (
  <Sequence from={-0} durationInFrames={113} layout="none">
    <Source />
  </Sequence>
);
