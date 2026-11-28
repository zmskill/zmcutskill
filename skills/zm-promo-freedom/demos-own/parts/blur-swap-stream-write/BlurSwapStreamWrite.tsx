// 小零件：虚化换场 · 流式写出一段话（80 帧，2.7 秒）
// 只播 InviteWallToChat 的第 166–246 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/ui-entrance/invite-wall-to-chat/InviteWallToChat.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {InviteWallToChat as Source} from '../../ui-entrance/invite-wall-to-chat/InviteWallToChat'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const BLUR_SWAP_STREAM_WRITE_DURATION = 80;
export const BlurSwapStreamWrite_RANGE = [166, 246] as const; // 在原镜头里的起止帧

export const BlurSwapStreamWrite: React.FC = () => (
  <Sequence from={-166} durationInFrames={246} layout="none">
    <Source />
  </Sequence>
);
