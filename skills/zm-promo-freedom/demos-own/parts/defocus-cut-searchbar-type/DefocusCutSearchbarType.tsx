// 小零件：失焦硬切到搜索框 · 打字点发送（75 帧，2.5 秒）
// 只播 SearchPickShortlist 的第 66–141 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/ui-entrance/search-pick-shortlist/SearchPickShortlist.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {SearchPickShortlist as Source} from '../../ui-entrance/search-pick-shortlist/SearchPickShortlist'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const DEFOCUS_CUT_SEARCHBAR_TYPE_DURATION = 75;
export const DefocusCutSearchbarType_RANGE = [66, 141] as const; // 在原镜头里的起止帧

export const DefocusCutSearchbarType: React.FC = () => (
  <Sequence from={-66} durationInFrames={141} layout="none">
    <Source />
  </Sequence>
);
