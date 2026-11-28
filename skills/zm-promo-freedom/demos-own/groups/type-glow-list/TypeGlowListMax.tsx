// 上限文案验证用（build-own-shots 第 3.5 步）：每个文字字段写到合同上限、停留区拉满
import React from 'react';
import {GlowListInputs, TypeGlowListGroup, glowListFrames, planGlowList, TYPE_GLOW_LIST_CONTRACT} from './TypeGlowList';

export const GLOW_LIST_MAX_INPUTS: GlowListInputs = {line1: '规划从此更省心', line2: '出行从此更尽兴', header: '根据你们家最近的出行', title1: '杭州 · 西湖边上', sub1: '适合散步、美食、博物馆夜游', title2: '青岛 · 八大关前', sub2: '适合海鲜、老街、看海和拍照'};
const C = TYPE_GLOW_LIST_CONTRACT;
const FULL = C.sourceDuration + C.holds.reduce((a, h) => a + h.maxExtra, 0);
const EXTRAS = planGlowList(FULL);
export const TYPE_GLOW_LIST_MAX_DURATION = glowListFrames(EXTRAS);
export const TypeGlowListMax: React.FC = () => <TypeGlowListGroup inputs={GLOW_LIST_MAX_INPUTS} extras={EXTRAS} />;
