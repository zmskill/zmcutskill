// 小零件：线拐上去接第三张卡 · 拉远擦掉（102 帧，3.4 秒）
// 只播 ActivityLineChain 的第 123–225 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/activity-line-chain/ActivityLineChain.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {ActivityLineChain as Source} from '../../groups/activity-line-chain/ActivityLineChain'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const LINE_TURN_THIRD_CARD_PULL_DURATION = 102;
export const LineTurnThirdCardPull_RANGE = [123, 225] as const; // 在原镜头里的起止帧

export const LineTurnThirdCardPull: React.FC = () => (
  <Sequence from={-123} durationInFrames={225} layout="none">
    <Source />
  </Sequence>
);
