// 上限文案验证用（build-own-shots 第 3.5 步）：每个文字字段写到合同上限、停留区拉满
import React from 'react';
import {SmarterInputs, SmarterCardBoardTiltGroup, smarterFrames, planSmarter, SMARTER_CARD_BOARD_TILT_CONTRACT} from './SmarterCardBoardTilt';

export const SMARTER_MAX_INPUTS: SmarterInputs = {word: '更加聪明', line: ['到最后', '你终于', '能够', '看清楚'], cap1: ['你的眼睛', '其实还一样'], cap2: ['只是现在', '看得更清楚']};
const C = SMARTER_CARD_BOARD_TILT_CONTRACT;
const FULL = C.sourceDuration + C.holds.reduce((a, h) => a + h.maxExtra, 0);
const EXTRAS = planSmarter(FULL);
export const SMARTER_CARD_BOARD_TILT_MAX_DURATION = smarterFrames(EXTRAS);
export const SmarterCardBoardTiltMax: React.FC = () => <SmarterCardBoardTiltGroup inputs={SMARTER_MAX_INPUTS} extras={EXTRAS} />;
