// 小零件：卡片离开 · 点聚成大字 · 字变形（168 帧，5.6 秒）
// 只播 DotMotionChapters 的第 189–357 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/dot-motion-chapters/DotMotionChapters.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {DotMotionChapters as Source} from '../../groups/dot-motion-chapters/DotMotionChapters'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const CARDS_LEAVE_DOTS_FORM_WORD_DURATION = 168;
export const CardsLeaveDotsFormWord_RANGE = [189, 357] as const; // 在原镜头里的起止帧

export const CardsLeaveDotsFormWord: React.FC = () => (
  <Sequence from={-189} durationInFrames={357} layout="none">
    <Source />
  </Sequence>
);
