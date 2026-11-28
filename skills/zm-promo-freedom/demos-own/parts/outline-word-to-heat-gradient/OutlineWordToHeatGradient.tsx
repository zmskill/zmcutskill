// 小零件：描边大字 · 最后一个词热力渐变放大（94 帧，3.1 秒）
// 只播 WordFramesLimits 的第 98–192 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/word-frames-limits/WordFramesLimits.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {WordFramesLimits as Source} from '../../groups/word-frames-limits/WordFramesLimits'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const OUTLINE_WORD_TO_HEAT_GRADIENT_DURATION = 94;
export const OutlineWordToHeatGradient_RANGE = [98, 192] as const; // 在原镜头里的起止帧

export const OutlineWordToHeatGradient: React.FC = () => (
  <Sequence from={-98} durationInFrames={192} layout="none">
    <Source />
  </Sequence>
);
