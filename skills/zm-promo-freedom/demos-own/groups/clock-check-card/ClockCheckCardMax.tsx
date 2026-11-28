// 上限文案验证用（build-own-shots 第 3.5 步）：每个文字字段写到合同上限、停留区拉满
import React from 'react';
import {ClockInputs, ClockCheckCardGroup, clockFrames, planClock, CLOCK_CHECK_CARD_CONTRACT} from './ClockCheckCard';

export const CLOCK_MAX_INPUTS: ClockInputs = {title1: '奥林匹克园', next1: '国家植物', date1: '12月28日 周六', dur1: '12小时', title2: '古北水镇站', date2: '12月29日 周日', dur2: '10小时'};
const C = CLOCK_CHECK_CARD_CONTRACT;
const FULL = C.sourceDuration + C.holds.reduce((a, h) => a + h.maxExtra, 0);
const EXTRAS = planClock(FULL);
export const CLOCK_CHECK_CARD_MAX_DURATION = clockFrames(EXTRAS);
export const ClockCheckCardMax: React.FC = () => <ClockCheckCardGroup inputs={CLOCK_MAX_INPUTS} extras={EXTRAS} />;
