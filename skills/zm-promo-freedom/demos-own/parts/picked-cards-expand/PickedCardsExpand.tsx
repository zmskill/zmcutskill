// 小零件：没选中的退成虚影 · 选中的展开详情（102 帧，3.4 秒）
// 只播 SearchPickShortlist 的第 237–339 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/ui-entrance/search-pick-shortlist/SearchPickShortlist.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {SearchPickShortlist as Source} from '../../ui-entrance/search-pick-shortlist/SearchPickShortlist'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const PICKED_CARDS_EXPAND_DURATION = 102;
export const PickedCardsExpand_RANGE = [237, 339] as const; // 在原镜头里的起止帧

export const PickedCardsExpand: React.FC = () => (
  <Sequence from={-237} durationInFrames={339} layout="none">
    <Source />
  </Sequence>
);
