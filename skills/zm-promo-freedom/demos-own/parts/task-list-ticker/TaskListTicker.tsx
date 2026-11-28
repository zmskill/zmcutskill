// 小零件：任务短句转盘（64 帧，2.1 秒）
// 整个镜头就是这一个动作：TaskListTicker 从头播到尾，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/typography/task-list-ticker/TaskListTicker.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {TaskListTicker as Source} from '../../typography/task-list-ticker/TaskListTicker'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const TASK_LIST_TICKER_DURATION = 64;
export const TaskListTicker_RANGE = [0, 64] as const; // 在原镜头里的起止帧

export const TaskListTicker: React.FC = () => (
  <Sequence from={-0} durationInFrames={64} layout="none">
    <Source />
  </Sequence>
);
