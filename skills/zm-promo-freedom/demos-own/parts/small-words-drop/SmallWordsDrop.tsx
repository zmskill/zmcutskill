// 小零件：一句小字一个词一个词落出来（41 帧，1.4 秒）
// 只播 RedBubbleStackPain 的第 0–41 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/red-bubble-stack-pain/RedBubbleStackPain.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {RedBubbleStackPain as Source} from '../../groups/red-bubble-stack-pain/RedBubbleStackPain'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const SMALL_WORDS_DROP_DURATION = 41;
export const SmallWordsDrop_RANGE = [0, 41] as const; // 在原镜头里的起止帧

export const SmallWordsDrop: React.FC = () => (
  <Sequence from={-0} durationInFrames={41} layout="none">
    <Source />
  </Sequence>
);
