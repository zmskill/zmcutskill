// 小零件：照片缩成时钟 · 一晃变对勾 · 卡片甩走（72 帧，2.4 秒）
// 整个镜头就是这一个动作：ClockCheckCard 从头播到尾，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/clock-check-card/ClockCheckCard.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {ClockCheckCard as Source} from '../../groups/clock-check-card/ClockCheckCard'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const CLOCK_CHECK_CARD_DURATION = 72;
export const ClockCheckCard_RANGE = [0, 72] as const; // 在原镜头里的起止帧

export const ClockCheckCard: React.FC = () => (
  <Sequence from={-0} durationInFrames={72} layout="none">
    <Source />
  </Sequence>
);
