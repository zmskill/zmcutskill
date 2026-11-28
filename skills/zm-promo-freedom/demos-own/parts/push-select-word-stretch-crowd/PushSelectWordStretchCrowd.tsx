// 小零件：猛推到一个词框选 · 字被拖出好多个 · 冒出像素小人（91 帧，3.0 秒）
// 只播 WordStretchStyleGrid 的第 83–174 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/word-stretch-style-grid/WordStretchStyleGrid.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {WordStretchStyleGrid as Source} from '../../groups/word-stretch-style-grid/WordStretchStyleGrid'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const PUSH_SELECT_WORD_STRETCH_CROWD_DURATION = 91;
export const PushSelectWordStretchCrowd_RANGE = [83, 174] as const; // 在原镜头里的起止帧

export const PushSelectWordStretchCrowd: React.FC = () => (
  <Sequence from={-83} durationInFrames={174} layout="none">
    <Source />
  </Sequence>
);
