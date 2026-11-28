// 小零件：大字打出一个问题 · 原地改写成回答（88 帧，2.9 秒）
// 整个镜头就是这一个动作：TypeSwapHeadline 从头播到尾，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/type-swap-headline/TypeSwapHeadline.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {TypeSwapHeadline as Source} from '../../groups/type-swap-headline/TypeSwapHeadline'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const TYPE_SWAP_HEADLINE_DURATION = 88;
export const TypeSwapHeadline_RANGE = [0, 88] as const; // 在原镜头里的起止帧

export const TypeSwapHeadline: React.FC = () => (
  <Sequence from={-0} durationInFrames={88} layout="none">
    <Source />
  </Sequence>
);
