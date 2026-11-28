// 小零件：超大字滑过线描透镜 · 两边挤出椭圆（90 帧，3.0 秒）
// 只播 GiantWordLensEarLogo 的第 0–90 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/giant-word-lens-ear-logo/GiantWordLensEarLogo.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {GiantWordLensEarLogo as Source} from '../../groups/giant-word-lens-ear-logo/GiantWordLensEarLogo'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const GIANT_WORD_LENS_OVALS_DURATION = 90;
export const GiantWordLensOvals_RANGE = [0, 90] as const; // 在原镜头里的起止帧

export const GiantWordLensOvals: React.FC = () => (
  <Sequence from={-0} durationInFrames={90} layout="none">
    <Source />
  </Sequence>
);
