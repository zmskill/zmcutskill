// 小零件：原地换词三次 · 光球绕字（69 帧，2.3 秒）
// 只播 OrbRelayExplainer 的第 81–150 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/opening/orb-relay-explainer/OrbRelayExplainer.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {OrbRelayExplainer as Source} from '../../opening/orb-relay-explainer/OrbRelayExplainer'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const WORD_SWAP_ORBIT_DURATION = 69;
export const WordSwapOrbit_RANGE = [81, 150] as const; // 在原镜头里的起止帧

export const WordSwapOrbit: React.FC = () => (
  <Sequence from={-81} durationInFrames={150} layout="none">
    <Source />
  </Sequence>
);
