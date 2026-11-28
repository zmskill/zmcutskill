// 小零件：小字接着打 · 一个词像素乱跳变渐变色（83 帧，2.8 秒）
// 只播 WordStretchStyleGrid 的第 0–83 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/word-stretch-style-grid/WordStretchStyleGrid.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {WordStretchStyleGrid as Source} from '../../groups/word-stretch-style-grid/WordStretchStyleGrid'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const SMALL_TYPE_PIXEL_WORD_GRADIENT_DURATION = 83;
export const SmallTypePixelWordGradient_RANGE = [0, 83] as const; // 在原镜头里的起止帧

export const SmallTypePixelWordGradient: React.FC = () => (
  <Sequence from={-0} durationInFrames={83} layout="none">
    <Source />
  </Sequence>
);
