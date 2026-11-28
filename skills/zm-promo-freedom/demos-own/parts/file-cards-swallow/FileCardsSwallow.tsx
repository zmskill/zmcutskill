// 小零件：文件卡升起被圆吞掉（80 帧，2.7 秒）
// 只播 OrbRelayExplainer 的第 283–363 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/opening/orb-relay-explainer/OrbRelayExplainer.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {OrbRelayExplainer as Source} from '../../opening/orb-relay-explainer/OrbRelayExplainer'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const FILE_CARDS_SWALLOW_DURATION = 80;
export const FileCardsSwallow_RANGE = [283, 363] as const; // 在原镜头里的起止帧

export const FileCardsSwallow: React.FC = () => (
  <Sequence from={-283} durationInFrames={363} layout="none">
    <Source />
  </Sequence>
);
