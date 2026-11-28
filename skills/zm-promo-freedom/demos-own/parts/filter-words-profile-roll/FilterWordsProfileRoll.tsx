// 小零件：左边换筛选词 · 右边资料卡滚（66 帧，2.2 秒）
// 只播 SearchPickShortlist 的第 0–66 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/ui-entrance/search-pick-shortlist/SearchPickShortlist.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {SearchPickShortlist as Source} from '../../ui-entrance/search-pick-shortlist/SearchPickShortlist'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const FILTER_WORDS_PROFILE_ROLL_DURATION = 66;
export const FilterWordsProfileRoll_RANGE = [0, 66] as const; // 在原镜头里的起止帧

export const FilterWordsProfileRoll: React.FC = () => (
  <Sequence from={-0} durationInFrames={66} layout="none">
    <Source />
  </Sequence>
);
