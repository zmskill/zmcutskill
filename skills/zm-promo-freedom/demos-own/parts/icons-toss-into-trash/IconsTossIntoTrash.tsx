// 小零件：图标被抛起 · 翻着掉进垃圾桶（66 帧，2.2 秒）
// 只播 SearchTrashDockButtons 的第 105–171 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/search-trash-dock-buttons/SearchTrashDockButtons.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {SearchTrashDockButtons as Source} from '../../groups/search-trash-dock-buttons/SearchTrashDockButtons'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const ICONS_TOSS_INTO_TRASH_DURATION = 66;
export const IconsTossIntoTrash_RANGE = [105, 171] as const; // 在原镜头里的起止帧

export const IconsTossIntoTrash: React.FC = () => (
  <Sequence from={-105} durationInFrames={171} layout="none">
    <Source />
  </Sequence>
);
