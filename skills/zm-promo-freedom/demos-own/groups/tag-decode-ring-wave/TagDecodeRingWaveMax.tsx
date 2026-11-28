// 上限文案验证用（build-own-shots 第 3.5 步）：每个文字字段写到合同上限、停留区拉满
import React from 'react';
import {TagRingInputs, TagDecodeRingWaveGroup, tagRingFrames, planTagRing, TAG_DECODE_RING_WAVE_CONTRACT} from './TagDecodeRingWave';

export const TAG_RING_MAX_INPUTS: TagRingInputs = {
  heroFront: '会议纪要', // 4 字
  heroBack: '随手灵感', // 4 字
  tags: ['周会记录', '待办清单', '灵感速记', '提醒事项', '买菜清单', '读书摘抄'], // 各 4 字
};
const C = TAG_DECODE_RING_WAVE_CONTRACT;
const FULL = C.sourceDuration + C.holds.reduce((a, h) => a + h.maxExtra, 0);
const EXTRAS = planTagRing(FULL);
export const TAG_DECODE_RING_WAVE_MAX_DURATION = tagRingFrames(EXTRAS);
export const TagDecodeRingWaveMax: React.FC = () => <TagDecodeRingWaveGroup inputs={TAG_RING_MAX_INPUTS} extras={EXTRAS} />;
