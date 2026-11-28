// 小零件：两个标签框乱码解码 · 相机绕着转（87 帧，2.9 秒）
// 只播 TagDecodeRingWave 的第 0–87 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/tag-decode-ring-wave/TagDecodeRingWave.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {TagDecodeRingWave as Source} from '../../groups/tag-decode-ring-wave/TagDecodeRingWave'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const TAGS_DECODE_ORBIT_DURATION = 87;
export const TagsDecodeOrbit_RANGE = [0, 87] as const; // 在原镜头里的起止帧

export const TagsDecodeOrbit: React.FC = () => (
  <Sequence from={-0} durationInFrames={87} layout="none">
    <Source />
  </Sequence>
);
