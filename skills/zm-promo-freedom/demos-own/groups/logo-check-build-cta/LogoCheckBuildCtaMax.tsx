// 上限文案验证用（build-own-shots 第 3.5 步）：每个文字字段写到合同上限、停留区拉满
import React from 'react';
import {LogoCtaInputs, LogoCheckBuildCtaGroup, logoCtaFrames, planLogoCta, LOGO_CHECK_BUILD_CTA_CONTRACT} from './LogoCheckBuildCta';

export const LOGO_CTA_MAX_INPUTS: LogoCtaInputs = {name: '小周待办', tagA: '把每件事', tagB: '都做完。', button: '立即下载', url: 'www.xiaozhou.app'}; // 4 / 4 / 4 / 4 / 16 字
const C = LOGO_CHECK_BUILD_CTA_CONTRACT;
const FULL = C.sourceDuration + C.holds.reduce((a, h) => a + h.maxExtra, 0);
const EXTRAS = planLogoCta(FULL);
export const LOGO_CHECK_BUILD_CTA_MAX_DURATION = logoCtaFrames(EXTRAS);
export const LogoCheckBuildCtaMax: React.FC = () => <LogoCheckBuildCtaGroup inputs={LOGO_CTA_MAX_INPUTS} extras={EXTRAS} />;
