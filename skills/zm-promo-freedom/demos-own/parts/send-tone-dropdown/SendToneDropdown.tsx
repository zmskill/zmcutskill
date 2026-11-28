// 小零件：全部发送 · 下拉选语气（40 帧，1.3 秒）
// 只播 InviteWallToChat 的第 243–283 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/ui-entrance/invite-wall-to-chat/InviteWallToChat.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {InviteWallToChat as Source} from '../../ui-entrance/invite-wall-to-chat/InviteWallToChat'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const SEND_TONE_DROPDOWN_DURATION = 40;
export const SendToneDropdown_RANGE = [243, 283] as const; // 在原镜头里的起止帧

export const SendToneDropdown: React.FC = () => (
  <Sequence from={-243} durationInFrames={283} layout="none">
    <Source />
  </Sequence>
);
