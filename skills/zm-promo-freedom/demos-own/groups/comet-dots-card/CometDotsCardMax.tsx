// 上限文案验证用（build-own-shots 第 3.5 步）：每个文字字段写到合同上限、停留区拉满
import React from 'react';
import {CometInputs, CometDotsCardGroup, cometFrames, planComet, COMET_DOTS_CARD_CONTRACT} from './CometDotsCard';

export const COMET_MAX_INPUTS: CometInputs = {phrase: '全都安排 好了呀。'};
const C = COMET_DOTS_CARD_CONTRACT;
const FULL = C.sourceDuration + C.holds.reduce((a, h) => a + h.maxExtra, 0);
const EXTRAS = planComet(FULL);
export const COMET_DOTS_CARD_MAX_DURATION = cometFrames(EXTRAS);
export const CometDotsCardMax: React.FC = () => <CometDotsCardGroup inputs={COMET_MAX_INPUTS} extras={EXTRAS} />;
