// 小零件：两颗胶囊滑进来 · 字逐个亮（42 帧，1.4 秒）
// 只播 PillPairLogoScatter 的第 0–42 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/pill-pair-logo-scatter/PillPairLogoScatter.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {PillPairLogoScatter as Source} from '../../groups/pill-pair-logo-scatter/PillPairLogoScatter'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const PILLS_SLIDE_WORDS_LIGHT_DURATION = 42;
export const PillsSlideWordsLight_RANGE = [0, 42] as const; // 在原镜头里的起止帧

export const PillsSlideWordsLight: React.FC = () => (
  <Sequence from={-0} durationInFrames={42} layout="none">
    <Source />
  </Sequence>
);
