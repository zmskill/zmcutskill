// 上限文案验证用（build-own-shots 第 3.5 步）：每个文字字段写到合同上限、停留区拉满
import React from 'react';
import {WallInputs, InterfaceWallSyncGroup, wallFrames, planWall, INTERFACE_WALL_SYNC_CONTRACT} from './InterfaceWallSync';

export const WALL_MAX_INPUTS: WallInputs = {
  line1: ['电脑、', '手机、', '平板上，'], // 10 字
  line2: ['改一处', '处处同步'], // 8 字
  banner: '一个地方管好全家事', // 8 字以上会被拒；这里 9 字用于测拒绝，实际样片用下面的
};
export const WALL_MAX_RENDER: WallInputs = {...WALL_MAX_INPUTS, banner: '一处管好全家的事'}; // 8 字
const C = INTERFACE_WALL_SYNC_CONTRACT;
const FULL = C.sourceDuration + C.holds.reduce((a, h) => a + h.maxExtra, 0);
const EXTRAS = planWall(FULL);
export const INTERFACE_WALL_SYNC_MAX_DURATION = wallFrames(EXTRAS);
export const InterfaceWallSyncMax: React.FC = () => <InterfaceWallSyncGroup inputs={WALL_MAX_RENDER} extras={EXTRAS} />;
