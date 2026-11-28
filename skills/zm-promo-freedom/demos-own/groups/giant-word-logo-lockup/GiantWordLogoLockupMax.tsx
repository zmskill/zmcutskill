// 上限文案验证用（build-own-shots 第 3.5 步）：每个文字字段写到合同上限、停留区拉满
import React from 'react';
import {LockupInputs, GiantWordLogoLockupGroup, lockupFrames, planLockup, GIANT_WORD_LOGO_LOCKUP_CONTRACT} from './GiantWordLogoLockup';

export const LOCKUP_MAX_INPUTS: LockupInputs = {hook: '来认识下', tail: '全新一代', name: '小周家', sub: '全家待办清单', swap: '全家人一起用的清单', turn: '不过呢'};
// 4 / 4 / 3 / 6 / 9 / 3 字
const C = GIANT_WORD_LOGO_LOCKUP_CONTRACT;
const FULL = C.sourceDuration + C.holds.reduce((a, h) => a + h.maxExtra, 0);
const EXTRAS = planLockup(FULL);
export const GIANT_WORD_LOGO_LOCKUP_MAX_DURATION = lockupFrames(EXTRAS);
export const GiantWordLogoLockupMax: React.FC = () => <GiantWordLogoLockupGroup inputs={LOCKUP_MAX_INPUTS} extras={EXTRAS} />;
