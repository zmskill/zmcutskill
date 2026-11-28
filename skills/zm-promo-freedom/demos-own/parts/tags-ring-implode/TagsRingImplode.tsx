// 小零件：两个标签画环 · 吸进光团爆亮（100 帧，3.3 秒）
// 只播 OrbRelayExplainer 的第 833–933 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/opening/orb-relay-explainer/OrbRelayExplainer.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {OrbRelayExplainer as Source} from '../../opening/orb-relay-explainer/OrbRelayExplainer'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const TAGS_RING_IMPLODE_DURATION = 100;
export const TagsRingImplode_RANGE = [833, 933] as const; // 在原镜头里的起止帧

export const TagsRingImplode: React.FC = () => (
  <Sequence from={-833} durationInFrames={933} layout="none">
    <Source />
  </Sequence>
);
