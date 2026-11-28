// 上限文案验证用（build-own-shots 第 3.5 步）：每个文字字段写到合同上限、停留区拉满
import React from 'react';
import {WORDS_SPLIT_LOCK_REPLACE_CONTRACT, WordsSplitLockReplaceGroup, WslrInputs, planWslr, wslrFrames} from './WordsSplitLockReplace';

export const WSLR_MAX_INPUTS: WslrInputs = {w1: '你的数据', w2: '全都', w3: '很私密', ctrl1: '由你', ctrl2: '来掌控', data1: '数据', data2: '永不离开', device: '你的电脑上'};
const C = WORDS_SPLIT_LOCK_REPLACE_CONTRACT;
const FULL = C.sourceDuration + C.holds.reduce((a, h) => a + h.maxExtra, 0);
const EXTRAS = planWslr(FULL);
export const WORDS_SPLIT_LOCK_REPLACE_MAX_DURATION = wslrFrames(EXTRAS);
export const WordsSplitLockReplaceMax: React.FC = () => <WordsSplitLockReplaceGroup inputs={WSLR_MAX_INPUTS} extras={EXTRAS} />;
