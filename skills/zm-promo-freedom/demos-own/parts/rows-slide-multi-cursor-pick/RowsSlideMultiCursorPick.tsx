// 小零件：资料卡整排交错滑入 · 多个光标点选（99 帧，3.3 秒）
// 只播 SearchPickShortlist 的第 141–240 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/ui-entrance/search-pick-shortlist/SearchPickShortlist.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {SearchPickShortlist as Source} from '../../ui-entrance/search-pick-shortlist/SearchPickShortlist'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const ROWS_SLIDE_MULTI_CURSOR_PICK_DURATION = 99;
export const RowsSlideMultiCursorPick_RANGE = [141, 240] as const; // 在原镜头里的起止帧

export const RowsSlideMultiCursorPick: React.FC = () => (
  <Sequence from={-141} durationInFrames={240} layout="none">
    <Source />
  </Sequence>
);
