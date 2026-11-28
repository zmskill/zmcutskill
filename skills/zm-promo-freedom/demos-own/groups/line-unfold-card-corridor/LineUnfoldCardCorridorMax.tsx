// 上限文案验证用（build-own-shots 第 3.5 步）：每个文字字段写到合同上限、停留区拉满
import React from 'react';
import {CorridorInputs, LineUnfoldCardCorridorGroup, corridorFrames, planCorridor, LINE_UNFOLD_CARD_CORRIDOR_CONTRACT} from './LineUnfoldCardCorridor';

export const CORRIDOR_MAX_INPUTS: CorridorInputs = {items: ['待办事', '共享历', '全家人', '月目标', '提醒我', '购物单']}; // 每张 3 字
const C = LINE_UNFOLD_CARD_CORRIDOR_CONTRACT;
const FULL = C.sourceDuration + C.holds.reduce((a, h) => a + h.maxExtra, 0);
const EXTRAS = planCorridor(FULL);
export const LINE_UNFOLD_CARD_CORRIDOR_MAX_DURATION = corridorFrames(EXTRAS);
export const LineUnfoldCardCorridorMax: React.FC = () => <LineUnfoldCardCorridorGroup inputs={CORRIDOR_MAX_INPUTS} extras={EXTRAS} />;
