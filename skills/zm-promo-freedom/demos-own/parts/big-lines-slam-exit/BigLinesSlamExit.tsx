// 小零件：两行大字缩小落定 · 猛推出画（50 帧，1.7 秒）
// 只播 OrbRelayExplainer 的第 783–833 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/opening/orb-relay-explainer/OrbRelayExplainer.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {OrbRelayExplainer as Source} from '../../opening/orb-relay-explainer/OrbRelayExplainer'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const BIG_LINES_SLAM_EXIT_DURATION = 50;
export const BigLinesSlamExit_RANGE = [783, 833] as const; // 在原镜头里的起止帧

export const BigLinesSlamExit: React.FC = () => (
  <Sequence from={-783} durationInFrames={833} layout="none">
    <Source />
  </Sequence>
);
