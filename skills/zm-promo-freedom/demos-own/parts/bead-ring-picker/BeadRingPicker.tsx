// 小零件：串珠成环 · 光标挨个悬停选一个（166 帧，5.5 秒）
// 只播 OrbRelayExplainer 的第 617–783 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/opening/orb-relay-explainer/OrbRelayExplainer.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {OrbRelayExplainer as Source} from '../../opening/orb-relay-explainer/OrbRelayExplainer'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const BEAD_RING_PICKER_DURATION = 166;
export const BeadRingPicker_RANGE = [617, 783] as const; // 在原镜头里的起止帧

export const BeadRingPicker: React.FC = () => (
  <Sequence from={-617} durationInFrames={783} layout="none">
    <Source />
  </Sequence>
);
