// 上限文案验证用（build-own-shots 第 3.5 步）：每个文字字段写到合同上限、停留区拉满
import React from 'react';
import {FlipInputs, RowStatusFlipPanGroup, flipFrames, planFlip, ROW_STATUS_FLIP_PAN_CONTRACT} from './RowStatusFlipPan';

export const FLIP_MAX_INPUTS: FlipInputs = {stA: '等待开始', stB: '正在进行', stC: '全部完成', payA: '暂缓付款', payB: '已经付清', id: '任务编号#06868', by: '发起人 奶奶姑姑'};
const C = ROW_STATUS_FLIP_PAN_CONTRACT;
const FULL = C.sourceDuration + C.holds.reduce((a, h) => a + h.maxExtra, 0);
const EXTRAS = planFlip(FULL);
export const ROW_STATUS_FLIP_PAN_MAX_DURATION = flipFrames(EXTRAS);
export const RowStatusFlipPanMax: React.FC = () => <RowStatusFlipPanGroup inputs={FLIP_MAX_INPUTS} extras={EXTRAS} />;
