// 上限文案验证用（build-own-shots 第 3.5 步）：每个文字字段写到合同上限、停留区拉满
import React from 'react';
import {STDB_DEFAULT_INPUTS, SEARCH_TRASH_DOCK_BUTTONS_CONTRACT, SearchTrashDockButtonsGroup, StdbInputs, planStdb, stdbFrames} from './SearchTrashDockButtons';

export const STDB_MAX_INPUTS: StdbInputs = {
  ...STDB_DEFAULT_INPUTS,
  typed: '我们全都删掉', lineA1: '这些工具', lineA2: '说好要替我们干', lineA3: '把活全都干完',
  lineB1: '结果呢，它们', lineB2: '把你埋进一堆', button: '连接新应用', outro: '按钮按钮',
};
const C = SEARCH_TRASH_DOCK_BUTTONS_CONTRACT;
const FULL = C.sourceDuration + C.holds.reduce((a, h) => a + h.maxExtra, 0);
const EXTRAS = planStdb(FULL);
export const SEARCH_TRASH_DOCK_BUTTONS_MAX_DURATION = stdbFrames(EXTRAS);
export const SearchTrashDockButtonsMax: React.FC = () => <SearchTrashDockButtonsGroup inputs={STDB_MAX_INPUTS} extras={EXTRAS} />;
