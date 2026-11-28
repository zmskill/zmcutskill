// 小零件：单卡急拉远成墙 · 慢推到下一张（102 帧，3.4 秒）
// 只播 InviteWallToChat 的第 0–102 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/ui-entrance/invite-wall-to-chat/InviteWallToChat.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {InviteWallToChat as Source} from '../../ui-entrance/invite-wall-to-chat/InviteWallToChat'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const WALL_PULLBACK_PUSHIN_DURATION = 102;
export const WallPullbackPushin_RANGE = [0, 102] as const; // 在原镜头里的起止帧

export const WallPullbackPushin: React.FC = () => (
  <Sequence from={-0} durationInFrames={102} layout="none">
    <Source />
  </Sequence>
);
