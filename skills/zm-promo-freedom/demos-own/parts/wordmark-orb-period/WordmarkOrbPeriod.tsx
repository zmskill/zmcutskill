// 小零件：光球绕字标落成句点（111 帧，3.7 秒）
// 只播 OrbRelayExplainer 的第 1090–1201 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/opening/orb-relay-explainer/OrbRelayExplainer.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {OrbRelayExplainer as Source} from '../../opening/orb-relay-explainer/OrbRelayExplainer'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const WORDMARK_ORB_PERIOD_DURATION = 111;
export const WordmarkOrbPeriod_RANGE = [1090, 1201] as const; // 在原镜头里的起止帧

export const WordmarkOrbPeriod: React.FC = () => (
  <Sequence from={-1090} durationInFrames={1201} layout="none">
    <Source />
  </Sequence>
);
