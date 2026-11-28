// 上限文案验证用（build-own-shots 第 3.5 步）：每个文字字段写到合同上限、停留区拉满
import React from 'react';
import {TiltInputs, PageTiltScrollGroup, tiltFrames, planTilt, PAGE_TILT_SCROLL_CONTRACT} from './PageTiltScroll';

export const TILT_MAX_INPUTS: TiltInputs = {big1: '正在进行', big2: '全部任务', title: '全家人的任务'};
const C = PAGE_TILT_SCROLL_CONTRACT;
const FULL = C.sourceDuration + C.holds.reduce((a, h) => a + h.maxExtra, 0);
const EXTRAS = planTilt(FULL);
export const PAGE_TILT_SCROLL_MAX_DURATION = tiltFrames(EXTRAS);
export const PageTiltScrollMax: React.FC = () => <PageTiltScrollGroup inputs={TILT_MAX_INPUTS} extras={EXTRAS} />;
