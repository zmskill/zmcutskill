// 小零件：斜面上打一句话 · 四条彩色虚线汇过来（66 帧，2.2 秒）
// 只播 RouteHubLogo 的第 0–66 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/route-hub-logo/RouteHubLogo.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {RouteHubLogo as Source} from '../../groups/route-hub-logo/RouteHubLogo'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const TYPE_LINES_CONVERGE_DURATION = 66;
export const TypeLinesConverge_RANGE = [0, 66] as const; // 在原镜头里的起止帧

export const TypeLinesConverge: React.FC = () => (
  <Sequence from={-0} durationInFrames={66} layout="none">
    <Source />
  </Sequence>
);
