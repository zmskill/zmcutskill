// 小零件：三词标题 · 三张回复卡飞入（72 帧，2.4 秒）
// 只播 InviteWallToChat 的第 328–400 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/ui-entrance/invite-wall-to-chat/InviteWallToChat.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {InviteWallToChat as Source} from '../../ui-entrance/invite-wall-to-chat/InviteWallToChat'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const TITLE_REPLY_CARDS_FLY_DURATION = 72;
export const TitleReplyCardsFly_RANGE = [328, 400] as const; // 在原镜头里的起止帧

export const TitleReplyCardsFly: React.FC = () => (
  <Sequence from={-328} durationInFrames={400} layout="none">
    <Source />
  </Sequence>
);
