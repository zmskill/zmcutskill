// 小零件：圆被擀成进度条（78 帧，2.6 秒）
// 只播 OrbRelayExplainer 的第 363–441 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/opening/orb-relay-explainer/OrbRelayExplainer.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {OrbRelayExplainer as Source} from '../../opening/orb-relay-explainer/OrbRelayExplainer'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const CIRCLE_TO_PROGRESS_BAR_DURATION = 78;
export const CircleToProgressBar_RANGE = [363, 441] as const; // 在原镜头里的起止帧

export const CircleToProgressBar: React.FC = () => (
  <Sequence from={-363} durationInFrames={441} layout="none">
    <Source />
  </Sequence>
);
