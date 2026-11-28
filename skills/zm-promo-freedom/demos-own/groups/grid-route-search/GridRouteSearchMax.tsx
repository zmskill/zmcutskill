// 上限文案验证用（build-own-shots 第 3.5 步）：每个文字字段写到合同上限、停留区拉满
import React from 'react';
import {RouteInputs, GridRouteSearchGroup, routeFrames, planRoute, GRID_ROUTE_SEARCH_CONTRACT} from './GridRouteSearch';

export const ROUTE_MAX_INPUTS: RouteInputs = {home: '望京西园家', stop1: '奥林匹克园', stop2: '古北水镇站', search: '搜索想去的地方', other: ['颐和园东门', '七九八艺术', '后海酒吧街']};
const C = GRID_ROUTE_SEARCH_CONTRACT;
const FULL = C.sourceDuration + C.holds.reduce((a, h) => a + h.maxExtra, 0);
const EXTRAS = planRoute(FULL);
export const GRID_ROUTE_SEARCH_MAX_DURATION = routeFrames(EXTRAS);
export const GridRouteSearchMax: React.FC = () => <GridRouteSearchGroup inputs={ROUTE_MAX_INPUTS} extras={EXTRAS} />;
