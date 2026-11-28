// 上限文案验证用（build-own-shots 第 3.5 步）：每个文字字段写到合同上限、停留区拉满
import React from 'react';
import {OrbitInputs, LogoOrbitFeaturesGroup, orbitFrames, planOrbit, LOGO_ORBIT_FEATURES_CONTRACT} from './LogoOrbitFeatures';

export const ORBIT_MAX_INPUTS: OrbitInputs = {line1: ['全家人', '每天的事，'], line2: '都放在一个地方', items: ['每日待办', '家庭项目', '共享日历', '家人分工', '月度目标', '手机同步']}; // 8 / 8 / 各 4 字
const C = LOGO_ORBIT_FEATURES_CONTRACT;
const FULL = C.sourceDuration + C.holds.reduce((a, h) => a + h.maxExtra, 0);
const EXTRAS = planOrbit(FULL);
export const LOGO_ORBIT_FEATURES_MAX_DURATION = orbitFrames(EXTRAS);
export const LogoOrbitFeaturesMax: React.FC = () => <LogoOrbitFeaturesGroup inputs={ORBIT_MAX_INPUTS} extras={EXTRAS} />;
