// 小零件：射线图 · 面板推进来 · 声波柱流动 · 频闪（111 帧，3.7 秒）
// 只播 TagDecodeRingWave 的第 212–323 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/tag-decode-ring-wave/TagDecodeRingWave.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {TagDecodeRingWave as Source} from '../../groups/tag-decode-ring-wave/TagDecodeRingWave'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const RAYS_PANEL_WAVE_STROBE_DURATION = 111;
export const RaysPanelWaveStrobe_RANGE = [212, 323] as const; // 在原镜头里的起止帧

export const RaysPanelWaveStrobe: React.FC = () => (
  <Sequence from={-212} durationInFrames={323} layout="none">
    <Source />
  </Sequence>
);
