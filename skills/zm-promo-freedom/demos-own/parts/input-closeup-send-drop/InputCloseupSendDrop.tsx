// 小零件：输入框特写 · 打字 · 横冲点发送（58 帧，1.9 秒）
// 只播 AgentBrowseMatch 的第 38–96 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/ui-entrance/agent-browse-match/AgentBrowseMatch.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {AgentBrowseMatch as Source} from '../../ui-entrance/agent-browse-match/AgentBrowseMatch'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const INPUT_CLOSEUP_SEND_DROP_DURATION = 58;
export const InputCloseupSendDrop_RANGE = [38, 96] as const; // 在原镜头里的起止帧

export const InputCloseupSendDrop: React.FC = () => (
  <Sequence from={-38} durationInFrames={96} layout="none">
    <Source />
  </Sequence>
);
