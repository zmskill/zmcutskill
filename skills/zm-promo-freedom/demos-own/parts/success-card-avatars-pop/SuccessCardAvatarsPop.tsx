// 小零件：成功卡 · 头像一个个弹出（45 帧，1.5 秒）
// 只播 InviteWallToChat 的第 283–328 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/ui-entrance/invite-wall-to-chat/InviteWallToChat.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {InviteWallToChat as Source} from '../../ui-entrance/invite-wall-to-chat/InviteWallToChat'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const SUCCESS_CARD_AVATARS_POP_DURATION = 45;
export const SuccessCardAvatarsPop_RANGE = [283, 328] as const; // 在原镜头里的起止帧

export const SuccessCardAvatarsPop: React.FC = () => (
  <Sequence from={-283} durationInFrames={328} layout="none">
    <Source />
  </Sequence>
);
