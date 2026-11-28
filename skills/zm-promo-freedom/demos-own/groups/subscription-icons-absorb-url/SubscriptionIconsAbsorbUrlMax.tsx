// 上限文案验证用（build-own-shots 第 3.5 步）：每个文字字段写到合同上限、停留区拉满
import React from 'react';
import {SIAU_DEFAULT_INPUTS, SUBSCRIPTION_ICONS_ABSORB_URL_CONTRACT, SiauInputs, SubscriptionIconsAbsorbUrlGroup, planSiau, siauFrames} from './SubscriptionIconsAbsorbUrl';

export const SIAU_MAX_INPUTS: SiauInputs = {...SIAU_DEFAULT_INPUTS, l1: ['带上你', '自己的', '那份'], sub: '会员制', brand: 'Nimbo 2', tag: '新的浏览器', does: '它能', you: '替你', work: '干活', url: 'nimbo.example'};
const C = SUBSCRIPTION_ICONS_ABSORB_URL_CONTRACT;
const FULL = C.sourceDuration + C.holds.reduce((a, h) => a + h.maxExtra, 0);
const EXTRAS = planSiau(FULL);
export const SUBSCRIPTION_ICONS_ABSORB_URL_MAX_DURATION = siauFrames(EXTRAS);
export const SubscriptionIconsAbsorbUrlMax: React.FC = () => <SubscriptionIconsAbsorbUrlGroup inputs={SIAU_MAX_INPUTS} extras={EXTRAS} />;
