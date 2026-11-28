// 小零件：光球变按钮再变卡片（59 帧，2.0 秒）
// 只播 OrbRelayExplainer 的第 558–617 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/opening/orb-relay-explainer/OrbRelayExplainer.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {OrbRelayExplainer as Source} from '../../opening/orb-relay-explainer/OrbRelayExplainer'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const ORB_TO_BUTTON_CARD_DURATION = 59;
export const OrbToButtonCard_RANGE = [558, 617] as const; // 在原镜头里的起止帧

export const OrbToButtonCard: React.FC = () => (
  <Sequence from={-558} durationInFrames={617} layout="none">
    <Source />
  </Sequence>
);
