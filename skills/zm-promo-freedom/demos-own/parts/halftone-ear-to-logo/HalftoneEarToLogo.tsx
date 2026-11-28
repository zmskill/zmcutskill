// 小零件：网点耳朵变成标志 · 落定（93 帧，3.1 秒）
// 只播 GiantWordLensEarLogo 的第 177–270 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/giant-word-lens-ear-logo/GiantWordLensEarLogo.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {GiantWordLensEarLogo as Source} from '../../groups/giant-word-lens-ear-logo/GiantWordLensEarLogo'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const HALFTONE_EAR_TO_LOGO_DURATION = 93;
export const HalftoneEarToLogo_RANGE = [177, 270] as const; // 在原镜头里的起止帧

export const HalftoneEarToLogo: React.FC = () => (
  <Sequence from={-177} durationInFrames={270} layout="none">
    <Source />
  </Sequence>
);
