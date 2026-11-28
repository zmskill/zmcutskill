// 小零件：斜着压近看一行 · 右边滑出详情（79 帧，2.6 秒）
// 只播 BoardBellToastDrawer 的第 143–222 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/board-bell-toast-drawer/BoardBellToastDrawer.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {BoardBellToastDrawer as Source} from '../../groups/board-bell-toast-drawer/BoardBellToastDrawer'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const TILT_ROW_DRAWER_OPEN_DURATION = 79;
export const TiltRowDrawerOpen_RANGE = [143, 222] as const; // 在原镜头里的起止帧

export const TiltRowDrawerOpen: React.FC = () => (
  <Sequence from={-143} durationInFrames={222} layout="none">
    <Source />
  </Sequence>
);
