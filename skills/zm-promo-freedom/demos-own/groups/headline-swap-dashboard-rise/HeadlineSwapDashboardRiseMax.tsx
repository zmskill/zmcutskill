// 上限文案验证用（build-own-shots 第 3.5 步）：每个文字字段写到合同上限、停留区拉满
import React from 'react';
import {DashRiseInputs, HeadlineSwapDashboardRiseGroup, dashRiseFrames, planDashRise, HEADLINE_SWAP_DASHBOARD_RISE_CONTRACT} from './HeadlineSwapDashboardRise';

export const DASH_RISE_MAX_INPUTS: DashRiseInputs = {
  lead: ['一个', '应用，', '管好', '全家的'], // 10 字
  words: ['全部待办。', '家庭日程。', '每周家务。', '整整一周。'], // 各 5 字
  appName: '小周待办', // 4 字
  userName: '林小夏', // 3 字
  button: '新建任务', // 4 字
  toast: '这件事已完成', // 6 字
  goalLabel: '本周目标', goalValue: '100%', goalNote: '还差最后4件', // 4 / 4 / 6 字
  today: ['给房东转这个月的房租', '下班路上买一大袋猫粮', '周六上午取干洗的衣服', '准备周会PPT第二版'], // 各 10 字
};
const C = HEADLINE_SWAP_DASHBOARD_RISE_CONTRACT;
const FULL = C.sourceDuration + C.holds.reduce((a, h) => a + h.maxExtra, 0);
const EXTRAS = planDashRise(FULL);
export const HEADLINE_SWAP_DASHBOARD_RISE_MAX_DURATION = dashRiseFrames(EXTRAS);
export const HeadlineSwapDashboardRiseMax: React.FC = () => <HeadlineSwapDashboardRiseGroup inputs={DASH_RISE_MAX_INPUTS} extras={EXTRAS} />;
