// 小零件：线扫过标题 · 分出三行子任务 · 推近第一行（138 帧，4.6 秒）
// 整个镜头就是这一个动作：SpawnTreeRowsFocus 从头播到尾，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/spawn-tree-rows-focus/SpawnTreeRowsFocus.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {SpawnTreeRowsFocus as Source} from '../../groups/spawn-tree-rows-focus/SpawnTreeRowsFocus'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const SPAWN_TREE_ROWS_FOCUS_DURATION = 138;
export const SpawnTreeRowsFocus_RANGE = [0, 138] as const; // 在原镜头里的起止帧

export const SpawnTreeRowsFocus: React.FC = () => (
  <Sequence from={-0} durationInFrames={138} layout="none">
    <Source />
  </Sequence>
);
