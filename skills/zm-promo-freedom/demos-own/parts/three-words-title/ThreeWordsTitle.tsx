// 小零件：三词标题逐词浮现（50 帧，1.7 秒）
// 只播 SearchPickShortlist 的第 411–461 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/ui-entrance/search-pick-shortlist/SearchPickShortlist.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {SearchPickShortlist as Source} from '../../ui-entrance/search-pick-shortlist/SearchPickShortlist'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const THREE_WORDS_TITLE_DURATION = 50;
export const ThreeWordsTitle_RANGE = [411, 461] as const; // 在原镜头里的起止帧

export const ThreeWordsTitle: React.FC = () => (
  <Sequence from={-411} durationInFrames={461} layout="none">
    <Source />
  </Sequence>
);
