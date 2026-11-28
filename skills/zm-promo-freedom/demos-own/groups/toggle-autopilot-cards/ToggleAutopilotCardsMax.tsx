// 上限文案验证用（build-own-shots 第 3.5 步）：每个文字字段写到合同上限、停留区拉满
import React from 'react';
import {AutopilotInputs, ToggleAutopilotCardsGroup, autopilotFrames, planAutopilot, TOGGLE_AUTOPILOT_CARDS_CONTRACT} from './ToggleAutopilotCards';

export const AUTOPILOT_MAX_INPUTS: AutopilotInputs = {
  label: '全自动排',
  cards: ['家庭账单助', '全家日程表', '放学接送提', '每周家务表', '超市购物单', '年度体检约', '亲友生日提', '孩子作业查', '快递物流追', '水电燃气缴', '周末出游计', '每日药品提', '宠物喂食表', '旅行打包单'],
  subs: ['本月已经缴了三笔账', '今天一共四件事情', '下午五点半接小雨', '这周轮到爸爸洗碗', '还差五样东西没买', '周六上午九点体检', '外婆生日六月二日', '数学作业已经检查', '两件快递今天送到', '电费已经自动缴好', '周末去郊外野餐吧', '每天晚上八点吃药', '早晚各喂一次猫粮', '行李清单已经备好'],
}; // 4 / 每张 5 字 / 每张 ≤10 字
const C = TOGGLE_AUTOPILOT_CARDS_CONTRACT;
const FULL = C.sourceDuration + C.holds.reduce((a, h) => a + h.maxExtra, 0);
const EXTRAS = planAutopilot(FULL);
export const TOGGLE_AUTOPILOT_CARDS_MAX_DURATION = autopilotFrames(EXTRAS);
export const ToggleAutopilotCardsMax: React.FC = () => <ToggleAutopilotCardsGroup inputs={AUTOPILOT_MAX_INPUTS} extras={EXTRAS} />;
