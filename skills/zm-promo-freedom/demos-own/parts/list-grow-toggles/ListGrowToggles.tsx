// 小零件：卡片长成列表 · 关掉两行开关（65 帧，2.2 秒）
// 只播 OrbRelayExplainer 的第 441–506 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/opening/orb-relay-explainer/OrbRelayExplainer.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {OrbRelayExplainer as Source} from '../../opening/orb-relay-explainer/OrbRelayExplainer'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const LIST_GROW_TOGGLES_DURATION = 65;
export const ListGrowToggles_RANGE = [441, 506] as const; // 在原镜头里的起止帧

export const ListGrowToggles: React.FC = () => (
  <Sequence from={-441} durationInFrames={506} layout="none">
    <Source />
  </Sequence>
);
