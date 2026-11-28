// 上限文案验证用（build-own-shots 第 3.5 步）：每个文字字段写到合同上限、停留区拉满
import React from 'react';
import {PromptPagesInputs, PromptPagesPillRevealGroup, promptPagesFrames, planPromptPages, PROMPT_PAGES_PILL_REVEAL_CONTRACT} from './PromptPagesPillReveal';

export const PROMPT_PAGES_MAX_INPUTS: PromptPagesInputs = {
  line1: '帮我做个周末社区市集的活动网站，', line2: '要有首页、摊位、地图、报名和留言',
  see: ['看清', '每一个', '页面'], pill: ['一次', '全都', '看完'], intro: '隆重介绍', brand: '逐梦剪辑台',
};
const C = PROMPT_PAGES_PILL_REVEAL_CONTRACT;
const EXTRAS = planPromptPages(C.sourceDuration + C.holds.reduce((a, h) => a + h.maxExtra, 0));
export const PROMPT_PAGES_PILL_REVEAL_MAX_DURATION = promptPagesFrames(EXTRAS);
export const PromptPagesPillRevealMax: React.FC = () => <PromptPagesPillRevealGroup inputs={PROMPT_PAGES_MAX_INPUTS} extras={EXTRAS} />;
