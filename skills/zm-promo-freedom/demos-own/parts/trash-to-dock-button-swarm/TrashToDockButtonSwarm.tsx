// 小零件：桶长成程序坞 · 点一下变按钮 · 按钮满屏飞（126 帧，4.2 秒）
// 只播 SearchTrashDockButtons 的第 171–297 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/search-trash-dock-buttons/SearchTrashDockButtons.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {SearchTrashDockButtons as Source} from '../../groups/search-trash-dock-buttons/SearchTrashDockButtons'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const TRASH_TO_DOCK_BUTTON_SWARM_DURATION = 126;
export const TrashToDockButtonSwarm_RANGE = [171, 297] as const; // 在原镜头里的起止帧

export const TrashToDockButtonSwarm: React.FC = () => (
  <Sequence from={-171} durationInFrames={297} layout="none">
    <Source />
  </Sequence>
);
