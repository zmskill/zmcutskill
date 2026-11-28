// 上限文案验证用（build-own-shots 第 3.5 步）：每个文字字段写到合同上限、停留区拉满
import React from 'react';
import {IGWB_DEFAULT_INPUTS, INTRO_GENIE_WORDMARK_BROWSER_CONTRACT, IgwbInputs, IntroGenieWordmarkBrowserGroup, igwbFrames, planIgwb} from './IntroGenieWordmarkBrowser';

export const IGWB_MAX_INPUTS: IgwbInputs = {
  ...IGWB_DEFAULT_INPUTS,
  intro: '现在隆重介', name: 'Nimbus', lines: ['一个新浏览器', '能把复杂工作', '一件一件地', '全都做完了'], across: '它横跨',
  items: ['所有网站', '全部账号', '历史记录'],
};
const C = INTRO_GENIE_WORDMARK_BROWSER_CONTRACT;
const FULL = C.sourceDuration + C.holds.reduce((a, h) => a + h.maxExtra, 0);
const EXTRAS = planIgwb(FULL);
export const INTRO_GENIE_WORDMARK_BROWSER_MAX_DURATION = igwbFrames(EXTRAS);
export const IntroGenieWordmarkBrowserMax: React.FC = () => <IntroGenieWordmarkBrowserGroup inputs={IGWB_MAX_INPUTS} extras={EXTRAS} />;
