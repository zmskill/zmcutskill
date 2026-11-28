// 小零件：大标志猛缩 · 名字逐字浮出（105 帧，3.5 秒）
// 整个镜头就是这一个动作：MarkShrinkWordmark 从头播到尾，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/outro/mark-shrink-wordmark/MarkShrinkWordmark.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {MarkShrinkWordmark as Source} from '../../outro/mark-shrink-wordmark/MarkShrinkWordmark'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const MARK_SHRINK_WORDMARK_DURATION = 105;
export const MarkShrinkWordmark_RANGE = [0, 105] as const; // 在原镜头里的起止帧

export const MarkShrinkWordmark: React.FC = () => (
  <Sequence from={-0} durationInFrames={105} layout="none">
    <Source />
  </Sequence>
);
