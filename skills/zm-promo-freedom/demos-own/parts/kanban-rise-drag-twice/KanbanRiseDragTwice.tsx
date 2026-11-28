// 小零件：看板浮上来 · 拖卡两次 · 绿勾（114 帧，3.8 秒）
// 只播 ProjectCardKanbanDrag 的第 57–171 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/project-card-kanban-drag/ProjectCardKanbanDrag.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {ProjectCardKanbanDrag as Source} from '../../groups/project-card-kanban-drag/ProjectCardKanbanDrag'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const KANBAN_RISE_DRAG_TWICE_DURATION = 114;
export const KanbanRiseDragTwice_RANGE = [57, 171] as const; // 在原镜头里的起止帧

export const KanbanRiseDragTwice: React.FC = () => (
  <Sequence from={-57} durationInFrames={171} layout="none">
    <Source />
  </Sequence>
);
