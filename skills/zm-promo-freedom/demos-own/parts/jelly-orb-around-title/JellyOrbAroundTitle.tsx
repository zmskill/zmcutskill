// 小零件：果冻球绕标题一圈冲出去（52 帧，1.7 秒）
// 只播 OrbRelayExplainer 的第 506–558 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/opening/orb-relay-explainer/OrbRelayExplainer.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {OrbRelayExplainer as Source} from '../../opening/orb-relay-explainer/OrbRelayExplainer'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const JELLY_ORB_AROUND_TITLE_DURATION = 52;
export const JellyOrbAroundTitle_RANGE = [506, 558] as const; // 在原镜头里的起止帧

export const JellyOrbAroundTitle: React.FC = () => (
  <Sequence from={-506} durationInFrames={558} layout="none">
    <Source />
  </Sequence>
);
