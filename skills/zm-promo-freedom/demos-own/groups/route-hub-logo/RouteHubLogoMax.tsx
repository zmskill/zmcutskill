// 上限文案验证用（build-own-shots 第 3.5 步）：每个文字字段写到合同上限、停留区拉满
import React from 'react';
import {HubInputs, RouteHubLogoGroup, hubFrames, planHub, ROUTE_HUB_LOGO_CONTRACT} from './RouteHubLogo';

export const HUB_MAX_INPUTS: HubInputs = {line: '一个应用串起每一段路', brand: '小周出行'};
const C = ROUTE_HUB_LOGO_CONTRACT;
const FULL = C.sourceDuration + C.holds.reduce((a, h) => a + h.maxExtra, 0);
const EXTRAS = planHub(FULL);
export const ROUTE_HUB_LOGO_MAX_DURATION = hubFrames(EXTRAS);
export const RouteHubLogoMax: React.FC = () => <RouteHubLogoGroup inputs={HUB_MAX_INPUTS} extras={EXTRAS} />;
