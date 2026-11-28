// 上限文案验证用（build-own-shots 第 3.5 步）：每个文字字段写到合同上限、停留区拉满
import React from 'react';
import {SlotInputs, CarouselTypeSlotsGroup, slotFrames, planSlots, CAROUSEL_TYPE_SLOTS_CONTRACT} from './CarouselTypeSlots';

export const SLOT_MAX_INPUTS: SlotInputs = {big1: '一目了然', small1: '全家人', small2: '大大事', big2: '小小事', brand: '小周日程'};
const C = CAROUSEL_TYPE_SLOTS_CONTRACT;
const FULL = C.sourceDuration + C.holds.reduce((a, h) => a + h.maxExtra, 0);
const EXTRAS = planSlots(FULL);
export const CAROUSEL_TYPE_SLOTS_MAX_DURATION = slotFrames(EXTRAS);
export const CarouselTypeSlotsMax: React.FC = () => <CarouselTypeSlotsGroup inputs={SLOT_MAX_INPUTS} extras={EXTRAS} />;
