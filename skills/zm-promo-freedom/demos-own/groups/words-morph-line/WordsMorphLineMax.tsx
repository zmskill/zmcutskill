// 上限文案验证用（build-own-shots 第 3.5 步）：每个文字字段写到合同上限、停留区拉满
import React from 'react';
import {MorphInputs, WordsMorphLineGroup, morphFrames, planMorph, WORDS_MORPH_LINE_CONTRACT} from './WordsMorphLine';

export const MORPH_MAX_INPUTS: MorphInputs = {a1: '家里事', keep: '越来越', b1: '多了，', a2: '心里头', b2: '有底了', c: '呀'};
const C = WORDS_MORPH_LINE_CONTRACT;
const FULL = C.sourceDuration + C.holds.reduce((a, h) => a + h.maxExtra, 0);
const EXTRAS = planMorph(FULL);
export const WORDS_MORPH_LINE_MAX_DURATION = morphFrames(EXTRAS);
export const WordsMorphLineMax: React.FC = () => <WordsMorphLineGroup inputs={MORPH_MAX_INPUTS} extras={EXTRAS} />;
