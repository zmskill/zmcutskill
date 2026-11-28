// 小零件：彗星线沿格子地图冲进来 · 拐到第一站（71 帧，2.4 秒）
// 只播 GridRouteSearch 的第 0–71 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/grid-route-search/GridRouteSearch.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {GridRouteSearch as Source} from '../../groups/grid-route-search/GridRouteSearch'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const COMET_ROUTE_GRID_DURATION = 71;
export const CometRouteGrid_RANGE = [0, 71] as const; // 在原镜头里的起止帧

export const CometRouteGrid: React.FC = () => (
  <Sequence from={-0} durationInFrames={71} layout="none">
    <Source />
  </Sequence>
);
