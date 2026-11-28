// 上限文案验证用（build-own-shots 第 3.5 步）：每个文字字段写到合同上限、停留区拉满
import React from 'react';
import {FormInputs, FormCardBuildGroup, formFrames, planForm, FORM_CARD_BUILD_CONTRACT} from './FormCardBuild';

export const FORM_MAX_INPUTS: FormInputs = {tabA: '自己开', tabB: '坐公交', from: '出发地', to: '目的地', date: '12月8日周六', people: '12人', cta: '开始规划吧'};
const C = FORM_CARD_BUILD_CONTRACT;
const FULL = C.sourceDuration + C.holds.reduce((a, h) => a + h.maxExtra, 0);
const EXTRAS = planForm(FULL);
export const FORM_CARD_BUILD_MAX_DURATION = formFrames(EXTRAS);
export const FormCardBuildMax: React.FC = () => <FormCardBuildGroup inputs={FORM_MAX_INPUTS} extras={EXTRAS} />;
