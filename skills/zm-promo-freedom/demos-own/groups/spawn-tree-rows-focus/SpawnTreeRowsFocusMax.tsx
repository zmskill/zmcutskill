// 上限文案验证用（build-own-shots 第 3.5 步）：每个文字字段写到合同上限、停留区拉满
import React from 'react';
import {SPAWN_TREE_ROWS_FOCUS_CONTRACT, SpawnTreeRowsFocusGroup, STRF_DEFAULT_INPUTS, StrfInputs, planStrf, strfFrames} from './SpawnTreeRowsFocus';

export const STRF_MAX_INPUTS: StrfInputs = {
  ...STRF_DEFAULT_INPUTS,
  title: '同时并行派出几个子代理', agent: '已经派出代理',
  tasks: ['检查QQ音乐会员每月用量', '检查爱奇艺会员每月用量', '检查百度网盘会员每月用量'],
};
const C = SPAWN_TREE_ROWS_FOCUS_CONTRACT;
const FULL = C.sourceDuration + C.holds.reduce((a, h) => a + h.maxExtra, 0);
const EXTRAS = planStrf(FULL);
export const SPAWN_TREE_ROWS_FOCUS_MAX_DURATION = strfFrames(EXTRAS);
export const SpawnTreeRowsFocusMax: React.FC = () => <SpawnTreeRowsFocusGroup inputs={STRF_MAX_INPUTS} extras={EXTRAS} />;
