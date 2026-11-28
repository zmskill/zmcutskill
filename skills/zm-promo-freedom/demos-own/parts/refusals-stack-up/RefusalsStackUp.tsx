// 小零件：问一句 · 拒绝回复一条条越堆越高（86 帧，2.9 秒）
// 只播 StopChatDragTrash 的第 66–152 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/stop-chat-drag-trash/StopChatDragTrash.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {StopChatDragTrash as Source} from '../../groups/stop-chat-drag-trash/StopChatDragTrash'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const REFUSALS_STACK_UP_DURATION = 86;
export const RefusalsStackUp_RANGE = [66, 152] as const; // 在原镜头里的起止帧

export const RefusalsStackUp: React.FC = () => (
  <Sequence from={-66} durationInFrames={152} layout="none">
    <Source />
  </Sequence>
);
