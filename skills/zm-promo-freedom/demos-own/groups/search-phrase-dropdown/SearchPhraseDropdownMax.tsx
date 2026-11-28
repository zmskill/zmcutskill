// 上限文案验证用（build-own-shots 第 3.5 步）：每个文字字段写到合同上限、停留区拉满
import React from 'react';
import {SEARCH_PHRASE_DROPDOWN_CONTRACT, SearchPhraseDropdownGroup, SpdInputs, planSpd, spdFrames} from './SearchPhraseDropdown';

export const SPD_MAX_INPUTS: SpdInputs = {
  words: ['正在', '浏览记录', '和书签里', '翻找'], title: '我的信用卡',
  rows: [
    {name: '卡片概览 | 北辰银行', note: 'bank.ex', right: '3 天前'},
    {name: '记忆.md', note: '用户的开户行和信用卡都开在北辰银行里', right: '8 天前'},
    {name: '我的北辰银行卡', note: '通行密钥', right: '密码'},
  ],
  disclaimer: '北辰银行、bank.ex 均为虚构 · 仅作演示',
};
const C = SEARCH_PHRASE_DROPDOWN_CONTRACT;
const FULL = C.sourceDuration + C.holds.reduce((a, h) => a + h.maxExtra, 0);
const EXTRAS = planSpd(FULL);
export const SEARCH_PHRASE_DROPDOWN_MAX_DURATION = spdFrames(EXTRAS);
export const SearchPhraseDropdownMax: React.FC = () => <SearchPhraseDropdownGroup inputs={SPD_MAX_INPUTS} extras={EXTRAS} />;
