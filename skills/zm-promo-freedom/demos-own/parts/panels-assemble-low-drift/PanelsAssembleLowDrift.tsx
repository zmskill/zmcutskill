// 小零件：散开的面板拼回一整面 · 硬切低角度慢漂（94 帧，3.1 秒）
// 只播 TiltedDashboardPanLogo 的第 0–94 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/camera/tilted-dashboard-pan-logo/TiltedDashboardPanLogo.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {TiltedDashboardPanLogo as Source} from '../../camera/tilted-dashboard-pan-logo/TiltedDashboardPanLogo'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const PANELS_ASSEMBLE_LOW_DRIFT_DURATION = 94;
export const PanelsAssembleLowDrift_RANGE = [0, 94] as const; // 在原镜头里的起止帧

export const PanelsAssembleLowDrift: React.FC = () => (
  <Sequence from={-0} durationInFrames={94} layout="none">
    <Source />
  </Sequence>
);
