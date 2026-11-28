// 小零件：金句 · 新搜索框冲上来再打一句（114 帧，3.8 秒）
// 只播 SearchPickShortlist 的第 461–575 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/ui-entrance/search-pick-shortlist/SearchPickShortlist.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {SearchPickShortlist as Source} from '../../ui-entrance/search-pick-shortlist/SearchPickShortlist'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const QUOTE_NEW_SEARCH_PUSH_DURATION = 114;
export const QuoteNewSearchPush_RANGE = [461, 575] as const; // 在原镜头里的起止帧

export const QuoteNewSearchPush: React.FC = () => (
  <Sequence from={-461} durationInFrames={575} layout="none">
    <Source />
  </Sequence>
);
