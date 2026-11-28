// 小零件：扑向圆圈越转越快 · 变成图标 · 擦出品牌字（131 帧，4.4 秒）
// 只播 RouteHubLogo 的第 66–197 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/route-hub-logo/RouteHubLogo.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {RouteHubLogo as Source} from '../../groups/route-hub-logo/RouteHubLogo'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const DIVE_SPIN_ICON_WORDMARK_DURATION = 131;
export const DiveSpinIconWordmark_RANGE = [66, 197] as const; // 在原镜头里的起止帧

export const DiveSpinIconWordmark: React.FC = () => (
  <Sequence from={-66} durationInFrames={197} layout="none">
    <Source />
  </Sequence>
);
