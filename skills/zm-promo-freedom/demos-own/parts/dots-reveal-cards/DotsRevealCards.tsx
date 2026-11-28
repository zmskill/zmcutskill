// 小零件：点里显出卡片 · 函数名收走（96 帧，3.2 秒）
// 只播 DotMotionChapters 的第 444–540 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/dot-motion-chapters/DotMotionChapters.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {DotMotionChapters as Source} from '../../groups/dot-motion-chapters/DotMotionChapters'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const DOTS_REVEAL_CARDS_DURATION = 96;
export const DotsRevealCards_RANGE = [444, 540] as const; // 在原镜头里的起止帧

export const DotsRevealCards: React.FC = () => (
  <Sequence from={-444} durationInFrames={540} layout="none">
    <Source />
  </Sequence>
);
