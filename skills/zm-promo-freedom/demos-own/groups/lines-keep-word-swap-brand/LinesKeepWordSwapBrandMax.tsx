// 上限文案验证用（build-own-shots 第 3.5 步）：每个文字字段写到合同上限、停留区拉满
import React from 'react';
import {LINES_KEEP_WORD_SWAP_BRAND_CONTRACT, LinesKeepWordSwapBrandGroup, LkwsInputs, lkwsFrames, planLkws} from './LinesKeepWordSwapBrand';

export const LKWS_MAX_INPUTS: LkwsInputs = {l1: '凡是你能够', l2: '亲手做到的事', l3pre: '只在', key: '浏览器里', brand: 'Nimbo 2', tagline: '现在都能替你做'};
const C = LINES_KEEP_WORD_SWAP_BRAND_CONTRACT;
const FULL = C.sourceDuration + C.holds.reduce((a, h) => a + h.maxExtra, 0);
const EXTRAS = planLkws(FULL);
export const LINES_KEEP_WORD_SWAP_BRAND_MAX_DURATION = lkwsFrames(EXTRAS);
export const LinesKeepWordSwapBrandMax: React.FC = () => <LinesKeepWordSwapBrandGroup inputs={LKWS_MAX_INPUTS} extras={EXTRAS} />;
