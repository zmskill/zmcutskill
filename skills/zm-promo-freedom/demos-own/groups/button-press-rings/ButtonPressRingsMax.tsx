// 上限文案验证用（build-own-shots 第 3.5 步）：每个文字字段写到合同上限、停留区拉满
import React from 'react';
import {PressInputs, ButtonPressRingsGroup, pressFrames, planPress, BUTTON_PRESS_RINGS_CONTRACT} from './ButtonPressRings';

export const PRESS_MAX_INPUTS: PressInputs = {cta: '开始规划吧', fade: '次出行'};
const C = BUTTON_PRESS_RINGS_CONTRACT;
const FULL = C.sourceDuration + C.holds.reduce((a, h) => a + h.maxExtra, 0);
const EXTRAS = planPress(FULL);
export const BUTTON_PRESS_RINGS_MAX_DURATION = pressFrames(EXTRAS);
export const ButtonPressRingsMax: React.FC = () => <ButtonPressRingsGroup inputs={PRESS_MAX_INPUTS} extras={EXTRAS} />;
