// 小零件：圆环像窗一样打开 · 露出一团问题气泡（174 帧，5.8 秒）
// 整个镜头就是这一个动作：RingWindowQuestions 从头播到尾，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/ring-window-questions/RingWindowQuestions.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {RingWindowQuestions as Source} from '../../groups/ring-window-questions/RingWindowQuestions'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const RING_WINDOW_QUESTIONS_DURATION = 174;
export const RingWindowQuestions_RANGE = [0, 174] as const; // 在原镜头里的起止帧

export const RingWindowQuestions: React.FC = () => (
  <Sequence from={-0} durationInFrames={174} layout="none">
    <Source />
  </Sequence>
);
