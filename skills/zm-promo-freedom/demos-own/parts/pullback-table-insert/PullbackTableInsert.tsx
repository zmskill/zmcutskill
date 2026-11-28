// 小零件：拉回 · 表格里插进新的一组（56 帧，1.9 秒）
// 只播 BoardBellToastDrawer 的第 87–143 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/board-bell-toast-drawer/BoardBellToastDrawer.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {BoardBellToastDrawer as Source} from '../../groups/board-bell-toast-drawer/BoardBellToastDrawer'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const PULLBACK_TABLE_INSERT_DURATION = 56;
export const PullbackTableInsert_RANGE = [87, 143] as const; // 在原镜头里的起止帧

export const PullbackTableInsert: React.FC = () => (
  <Sequence from={-87} durationInFrames={143} layout="none">
    <Source />
  </Sequence>
);
