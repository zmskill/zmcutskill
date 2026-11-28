// 小零件：详情收回 · 表格横滑出场（51 帧，1.7 秒）
// 只播 BoardBellToastDrawer 的第 222–273 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/board-bell-toast-drawer/BoardBellToastDrawer.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {BoardBellToastDrawer as Source} from '../../groups/board-bell-toast-drawer/BoardBellToastDrawer'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const DRAWER_CLOSE_TABLE_SLIDE_DURATION = 51;
export const DrawerCloseTableSlide_RANGE = [222, 273] as const; // 在原镜头里的起止帧

export const DrawerCloseTableSlide: React.FC = () => (
  <Sequence from={-222} durationInFrames={273} layout="none">
    <Source />
  </Sequence>
);
