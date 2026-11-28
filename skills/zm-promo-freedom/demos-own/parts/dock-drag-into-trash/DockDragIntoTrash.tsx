// 小零件：程序坞升起 · 把图标连对话一起拖进垃圾桶（84 帧，2.8 秒）
// 只播 StopChatDragTrash 的第 152–236 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/stop-chat-drag-trash/StopChatDragTrash.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {StopChatDragTrash as Source} from '../../groups/stop-chat-drag-trash/StopChatDragTrash'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const DOCK_DRAG_INTO_TRASH_DURATION = 84;
export const DockDragIntoTrash_RANGE = [152, 236] as const; // 在原镜头里的起止帧

export const DockDragIntoTrash: React.FC = () => (
  <Sequence from={-152} durationInFrames={236} layout="none">
    <Source />
  </Sequence>
);
