// 小零件：一个词往左一甩 · 黑色对话框滑进来打字（66 帧，2.2 秒）
// 只播 StopChatDragTrash 的第 0–66 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/stop-chat-drag-trash/StopChatDragTrash.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {StopChatDragTrash as Source} from '../../groups/stop-chat-drag-trash/StopChatDragTrash'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const WORD_WHIP_CHATBOX_TYPE_DURATION = 66;
export const WordWhipChatboxType_RANGE = [0, 66] as const; // 在原镜头里的起止帧

export const WordWhipChatboxType: React.FC = () => (
  <Sequence from={-0} durationInFrames={66} layout="none">
    <Source />
  </Sequence>
);
