// 上限文案验证用（build-own-shots 第 3.5 步）：每个文字字段写到合同上限、停留区拉满
import React from 'react';
import {TypeSwapInputs, TypeSwapHeadlineGroup, typeSwapFrames, planTypeSwap, TYPE_SWAP_HEADLINE_CONTRACT} from './TypeSwapHeadline';

export const TYPE_SWAP_MAX_INPUTS: TypeSwapInputs = {line1: '这个周末去哪儿', word2: '全都安排', word3: '好了呀。'};
const C = TYPE_SWAP_HEADLINE_CONTRACT;
const FULL = C.sourceDuration + C.holds.reduce((a, h) => a + h.maxExtra, 0);
const EXTRAS = planTypeSwap(FULL);
export const TYPE_SWAP_HEADLINE_MAX_DURATION = typeSwapFrames(EXTRAS);
export const TypeSwapHeadlineMax: React.FC = () => <TypeSwapHeadlineGroup inputs={TYPE_SWAP_MAX_INPUTS} extras={EXTRAS} />;
