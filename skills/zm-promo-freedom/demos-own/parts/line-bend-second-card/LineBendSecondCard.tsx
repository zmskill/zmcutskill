// 小零件：线弯下去接到第二张卡（73 帧，2.4 秒）
// 只播 ActivityLineChain 的第 50–123 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/activity-line-chain/ActivityLineChain.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {ActivityLineChain as Source} from '../../groups/activity-line-chain/ActivityLineChain'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const LINE_BEND_SECOND_CARD_DURATION = 73;
export const LineBendSecondCard_RANGE = [50, 123] as const; // 在原镜头里的起止帧

export const LineBendSecondCard: React.FC = () => (
  <Sequence from={-50} durationInFrames={123} layout="none">
    <Source />
  </Sequence>
);
