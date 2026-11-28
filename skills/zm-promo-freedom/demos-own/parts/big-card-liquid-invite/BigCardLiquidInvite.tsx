// 小零件：大卡信息逐行变实 · 点"邀请"出光泡（66 帧，2.2 秒）
// 只播 InviteWallToChat 的第 102–168 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/ui-entrance/invite-wall-to-chat/InviteWallToChat.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {InviteWallToChat as Source} from '../../ui-entrance/invite-wall-to-chat/InviteWallToChat'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const BIG_CARD_LIQUID_INVITE_DURATION = 66;
export const BigCardLiquidInvite_RANGE = [102, 168] as const; // 在原镜头里的起止帧

export const BigCardLiquidInvite: React.FC = () => (
  <Sequence from={-102} durationInFrames={168} layout="none">
    <Source />
  </Sequence>
);
