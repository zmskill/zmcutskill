// 小零件：流星线把点串起来 · 变成白卡片（53 帧，1.8 秒）
// 整个镜头就是这一个动作：CometDotsCard 从头播到尾，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/comet-dots-card/CometDotsCard.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {CometDotsCard as Source} from '../../groups/comet-dots-card/CometDotsCard'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const COMET_DOTS_CARD_DURATION = 53;
export const CometDotsCard_RANGE = [0, 53] as const; // 在原镜头里的起止帧

export const CometDotsCard: React.FC = () => (
  <Sequence from={-0} durationInFrames={53} layout="none">
    <Source />
  </Sequence>
);
