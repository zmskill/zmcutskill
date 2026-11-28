// 小零件：动态卡吊在细线上展开（50 帧，1.7 秒）
// 只播 ActivityLineChain 的第 0–50 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/activity-line-chain/ActivityLineChain.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {ActivityLineChain as Source} from '../../groups/activity-line-chain/ActivityLineChain'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const CARD_HANG_LINE_UNFOLD_DURATION = 50;
export const CardHangLineUnfold_RANGE = [0, 50] as const; // 在原镜头里的起止帧

export const CardHangLineUnfold: React.FC = () => (
  <Sequence from={-0} durationInFrames={50} layout="none">
    <Source />
  </Sequence>
);
