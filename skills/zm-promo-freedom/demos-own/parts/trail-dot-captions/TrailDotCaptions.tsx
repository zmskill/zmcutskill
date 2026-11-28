// 小零件：绿点拖虚线前进 · 带角标的字幕接力（130 帧，4.3 秒）
// 整个镜头就是这一个动作：TrailDotCaptions 从头播到尾，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/data/trail-dot-captions/TrailDotCaptions.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {TrailDotCaptions as Source} from '../../data/trail-dot-captions/TrailDotCaptions'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const TRAIL_DOT_CAPTIONS_DURATION = 130;
export const TrailDotCaptions_RANGE = [0, 130] as const; // 在原镜头里的起止帧

export const TrailDotCaptions: React.FC = () => (
  <Sequence from={-0} durationInFrames={130} layout="none">
    <Source />
  </Sequence>
);
