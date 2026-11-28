// 上限文案验证用（build-own-shots 第 3.5 步）：每个文字字段写到合同上限、停留区拉满
import React from 'react';
import {ScatterInputs, PillPairLogoScatterGroup, scatterFrames, planScatter, PILL_PAIR_LOGO_SCATTER_CONTRACT} from './PillPairLogoScatter';

export const SCATTER_MAX_INPUTS: ScatterInputs = {word1: '从今天', word2: '全家用', brand: '小周日程', cta: '立即免费试用'}; // 3 / 3 / 4 / 6
const C = PILL_PAIR_LOGO_SCATTER_CONTRACT;
const FULL = C.sourceDuration + C.holds.reduce((a, h) => a + h.maxExtra, 0);
const EXTRAS = planScatter(FULL);
export const PILL_PAIR_LOGO_SCATTER_MAX_DURATION = scatterFrames(EXTRAS);
export const PillPairLogoScatterMax: React.FC = () => <PillPairLogoScatterGroup inputs={SCATTER_MAX_INPUTS} extras={EXTRAS} />;
