// 小零件：卡缩成小条落进名单（72 帧，2.4 秒）
// 只播 SearchPickShortlist 的第 339–411 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/ui-entrance/search-pick-shortlist/SearchPickShortlist.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {SearchPickShortlist as Source} from '../../ui-entrance/search-pick-shortlist/SearchPickShortlist'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const CARDS_TO_SHORTLIST_TABLE_DURATION = 72;
export const CardsToShortlistTable_RANGE = [339, 411] as const; // 在原镜头里的起止帧

export const CardsToShortlistTable: React.FC = () => (
  <Sequence from={-339} durationInFrames={411} layout="none">
    <Source />
  </Sequence>
);
