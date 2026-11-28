// 小零件：三行超窄高字打出 · 选中换粗细（108 帧，3.6 秒）
// 只播 CondensedLinesPosterCard 的第 0–108 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/condensed-lines-poster-card/CondensedLinesPosterCard.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {CondensedLinesPosterCard as Source} from '../../groups/condensed-lines-poster-card/CondensedLinesPosterCard'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const CONDENSED_TALL_LINES_REWEIGHT_DURATION = 108;
export const CondensedTallLinesReweight_RANGE = [0, 108] as const; // 在原镜头里的起止帧

export const CondensedTallLinesReweight: React.FC = () => (
  <Sequence from={-0} durationInFrames={108} layout="none">
    <Source />
  </Sequence>
);
