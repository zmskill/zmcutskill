// 小零件：第二条线走到第二站 · 线头变成搜索框打字（136 帧，4.5 秒）
// 只播 GridRouteSearch 的第 71–207 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/grid-route-search/GridRouteSearch.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {GridRouteSearch as Source} from '../../groups/grid-route-search/GridRouteSearch'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const ROUTE_TO_SEARCH_BOX_DURATION = 136;
export const RouteToSearchBox_RANGE = [71, 207] as const; // 在原镜头里的起止帧

export const RouteToSearchBox: React.FC = () => (
  <Sequence from={-71} durationInFrames={207} layout="none">
    <Source />
  </Sequence>
);
