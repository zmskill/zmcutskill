// 小零件：卡片化成点 · 再聚回来（69 帧，2.3 秒）
// 只播 DotMotionChapters 的第 120–189 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/dot-motion-chapters/DotMotionChapters.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {DotMotionChapters as Source} from '../../groups/dot-motion-chapters/DotMotionChapters'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const CARDS_DISSOLVE_TO_DOTS_BACK_DURATION = 69;
export const CardsDissolveToDotsBack_RANGE = [120, 189] as const; // 在原镜头里的起止帧

export const CardsDissolveToDotsBack: React.FC = () => (
  <Sequence from={-120} durationInFrames={189} layout="none">
    <Source />
  </Sequence>
);
