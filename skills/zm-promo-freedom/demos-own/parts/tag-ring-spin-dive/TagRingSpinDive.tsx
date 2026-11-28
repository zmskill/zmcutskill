// 小零件：3D 标签环狂转倒下 · 俯冲穿过（125 帧，4.2 秒）
// 只播 TagDecodeRingWave 的第 87–212 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/tag-decode-ring-wave/TagDecodeRingWave.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {TagDecodeRingWave as Source} from '../../groups/tag-decode-ring-wave/TagDecodeRingWave'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const TAG_RING_SPIN_DIVE_DURATION = 125;
export const TagRingSpinDive_RANGE = [87, 212] as const; // 在原镜头里的起止帧

export const TagRingSpinDive: React.FC = () => (
  <Sequence from={-87} durationInFrames={212} layout="none">
    <Source />
  </Sequence>
);
