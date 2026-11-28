// 上限文案验证用：本组没有文字字段（表单内容来自 021-C），只把停留区拉满
import React from 'react';
import {FormTiltRoadGroup, tiltRoadFrames, planTiltRoad, FORM_TILT_ROAD_CONTRACT} from './FormTiltRoad';
import {FORM_MAX_INPUTS} from '../form-card-build/FormCardBuildMax';

const C = FORM_TILT_ROAD_CONTRACT;
const FULL = C.sourceDuration + C.holds.reduce((a, h) => a + h.maxExtra, 0);
const EXTRAS = planTiltRoad(FULL);
export const FORM_TILT_ROAD_MAX_DURATION = tiltRoadFrames(EXTRAS);
export const FormTiltRoadMax: React.FC = () => <FormTiltRoadGroup inputs={FORM_MAX_INPUTS} extras={EXTRAS} />;
