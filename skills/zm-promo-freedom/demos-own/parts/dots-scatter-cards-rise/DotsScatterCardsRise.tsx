// 小零件：点阵球散开 · 卡片从点里升起（120 帧，4.0 秒）
// 只播 DotMotionChapters 的第 0–120 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/dot-motion-chapters/DotMotionChapters.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {DotMotionChapters as Source} from '../../groups/dot-motion-chapters/DotMotionChapters'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const DOTS_SCATTER_CARDS_RISE_DURATION = 120;
export const DotsScatterCardsRise_RANGE = [0, 120] as const; // 在原镜头里的起止帧

export const DotsScatterCardsRise: React.FC = () => (
  <Sequence from={-0} durationInFrames={120} layout="none">
    <Source />
  </Sequence>
);
