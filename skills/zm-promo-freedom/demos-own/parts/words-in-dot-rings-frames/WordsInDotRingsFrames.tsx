// 小零件：一个词换一种外框：点阵环、虚线圆（98 帧，3.3 秒）
// 只播 WordFramesLimits 的第 0–98 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/word-frames-limits/WordFramesLimits.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {WordFramesLimits as Source} from '../../groups/word-frames-limits/WordFramesLimits'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const WORDS_IN_DOT_RINGS_FRAMES_DURATION = 98;
export const WordsInDotRingsFrames_RANGE = [0, 98] as const; // 在原镜头里的起止帧

export const WordsInDotRingsFrames: React.FC = () => (
  <Sequence from={-0} durationInFrames={98} layout="none">
    <Source />
  </Sequence>
);
