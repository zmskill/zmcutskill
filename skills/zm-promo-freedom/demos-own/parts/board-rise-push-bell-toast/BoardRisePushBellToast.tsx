// 小零件：任务板升起 · 猛推到铃铛 · 红点变成通知卡（87 帧，2.9 秒）
// 只播 BoardBellToastDrawer 的第 0–87 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/board-bell-toast-drawer/BoardBellToastDrawer.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {BoardBellToastDrawer as Source} from '../../groups/board-bell-toast-drawer/BoardBellToastDrawer'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const BOARD_RISE_PUSH_BELL_TOAST_DURATION = 87;
export const BoardRisePushBellToast_RANGE = [0, 87] as const; // 在原镜头里的起止帧

export const BoardRisePushBellToast: React.FC = () => (
  <Sequence from={-0} durationInFrames={87} layout="none">
    <Source />
  </Sequence>
);
