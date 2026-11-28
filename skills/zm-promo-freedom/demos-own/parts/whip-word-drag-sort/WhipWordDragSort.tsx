// 小零件：甩糊换词 · 拖一行到顶（61 帧，2.0 秒）
// 只播 TaskCardThreeVerbs 的第 173–234 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/ui-entrance/task-card-three-verbs/TaskCardThreeVerbs.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {TaskCardThreeVerbs as Source} from '../../ui-entrance/task-card-three-verbs/TaskCardThreeVerbs'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const WHIP_WORD_DRAG_SORT_DURATION = 61;
export const WhipWordDragSort_RANGE = [173, 234] as const; // 在原镜头里的起止帧

export const WhipWordDragSort: React.FC = () => (
  <Sequence from={-173} durationInFrames={234} layout="none">
    <Source />
  </Sequence>
);
