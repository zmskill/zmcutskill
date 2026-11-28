// 小零件：按钮点下 · 光环 · 白勾写出（69 帧，2.3 秒）
// 整个镜头就是这一个动作：BookmarkTap 从头播到尾，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/itinerary-scroll-bookmark/ItineraryScrollBookmark.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {BookmarkTap as Source} from '../../groups/itinerary-scroll-bookmark/ItineraryScrollBookmark'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const BOOKMARK_TAP_CHECK_DURATION = 69;
export const BookmarkTapCheck_RANGE = [0, 69] as const; // 在原镜头里的起止帧

export const BookmarkTapCheck: React.FC = () => (
  <Sequence from={-0} durationInFrames={69} layout="none">
    <Source />
  </Sequence>
);
