// 小零件：搜索栏被点中 · 两下猛推打字 · 图标滑进来（105 帧，3.5 秒）
// 只播 SearchTrashDockButtons 的第 0–105 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/search-trash-dock-buttons/SearchTrashDockButtons.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {SearchTrashDockButtons as Source} from '../../groups/search-trash-dock-buttons/SearchTrashDockButtons'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const SEARCHBAR_PUNCH_TYPE_ICONS_DURATION = 105;
export const SearchbarPunchTypeIcons_RANGE = [0, 105] as const; // 在原镜头里的起止帧

export const SearchbarPunchTypeIcons: React.FC = () => (
  <Sequence from={-0} durationInFrames={105} layout="none">
    <Source />
  </Sequence>
);
