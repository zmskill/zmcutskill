// 上限文案验证用（build-own-shots 第 3.5 步）：每个文字字段写到合同上限、停留区拉满
import React from 'react';
import {TintInputs, IconWordTintGroup, tintFrames, planTint, ICON_WORD_TINT_CONTRACT} from './IconWordTint';

export const TINT_MAX_INPUTS: TintInputs = {word: '一站搞定', lead: '帮你安排每一', last: '次出行'};
const C = ICON_WORD_TINT_CONTRACT;
const FULL = C.sourceDuration + C.holds.reduce((a, h) => a + h.maxExtra, 0);
const EXTRAS = planTint(FULL);
export const ICON_WORD_TINT_MAX_DURATION = tintFrames(EXTRAS);
export const IconWordTintMax: React.FC = () => <IconWordTintGroup inputs={TINT_MAX_INPUTS} extras={EXTRAS} />;
