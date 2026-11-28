// 小零件：三张卡飘进应用界面落位（76 帧，2.5 秒）
// 只播 InviteWallToChat 的第 400–476 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/ui-entrance/invite-wall-to-chat/InviteWallToChat.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {InviteWallToChat as Source} from '../../ui-entrance/invite-wall-to-chat/InviteWallToChat'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const CARDS_FLY_INTO_APP_DURATION = 76;
export const CardsFlyIntoApp_RANGE = [400, 476] as const; // 在原镜头里的起止帧

export const CardsFlyIntoApp: React.FC = () => (
  <Sequence from={-400} durationInFrames={476} layout="none">
    <Source />
  </Sequence>
);
