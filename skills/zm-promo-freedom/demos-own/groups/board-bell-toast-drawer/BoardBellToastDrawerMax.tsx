// 上限文案验证用（build-own-shots 第 3.5 步）：每个文字字段写到合同上限、停留区拉满
import React from 'react';
import {BellInputs, BoardBellToastDrawerGroup, bellFrames, planBell, BOARD_BELL_TOAST_DRAWER_CONTRACT} from './BoardBellToastDrawer';

export const BELL_MAX_INPUTS: BellInputs = {toastTitle: '奶奶刚加了新任务', toastSub: '奶奶·接送任务 #06868'};
const C = BOARD_BELL_TOAST_DRAWER_CONTRACT;
const FULL = C.sourceDuration + C.holds.reduce((a, h) => a + h.maxExtra, 0);
const EXTRAS = planBell(FULL);
export const BOARD_BELL_TOAST_DRAWER_MAX_DURATION = bellFrames(EXTRAS);
export const BoardBellToastDrawerMax: React.FC = () => <BoardBellToastDrawerGroup inputs={BELL_MAX_INPUTS} extras={EXTRAS} />;
