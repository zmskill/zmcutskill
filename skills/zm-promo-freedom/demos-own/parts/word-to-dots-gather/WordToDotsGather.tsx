// 小零件：大字散成点 · 点重新聚拢（87 帧，2.9 秒）
// 只播 DotMotionChapters 的第 357–444 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/dot-motion-chapters/DotMotionChapters.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {DotMotionChapters as Source} from '../../groups/dot-motion-chapters/DotMotionChapters'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const WORD_TO_DOTS_GATHER_DURATION = 87;
export const WordToDotsGather_RANGE = [357, 444] as const; // 在原镜头里的起止帧

export const WordToDotsGather: React.FC = () => (
  <Sequence from={-357} durationInFrames={444} layout="none">
    <Source />
  </Sequence>
);
