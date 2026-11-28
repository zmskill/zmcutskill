// 上限文案验证用（build-own-shots 第 3.5 步）：每句问题写到合同上限 9 字、停留区拉满
import React from 'react';
import {RingWindowInputs, RingWindowQuestionsGroup, ringWindowFrames, planRingWindow, RING_WINDOW_QUESTIONS_CONTRACT} from './RingWindowQuestions';

export const RING_WINDOW_MAX_INPUTS: RingWindowInputs = {
  questions: ['下午谁去接孩子呀？', '这月水电费交了吗？', '这周轮到谁做晚饭？', '外婆的降压药买了？', '周六上午几点体检？', '门口快递谁去取呀？', '今年物业费交了吗？',
    '下周家长会几点开？', '家里猫粮还够几天？', '车险是不是快到期？', '数学作业谁来检查？', '这个周末谁来打扫？', '妈妈生日礼物买了？', '冰箱里的菜够吃吗？'],
}; // 14 句，每句 9 字（含问号）
const C = RING_WINDOW_QUESTIONS_CONTRACT;
const FULL = C.sourceDuration + C.holds.reduce((a, h) => a + h.maxExtra, 0);
const EXTRAS = planRingWindow(FULL);
export const RING_WINDOW_QUESTIONS_MAX_DURATION = ringWindowFrames(EXTRAS);
export const RingWindowQuestionsMax: React.FC = () => <RingWindowQuestionsGroup inputs={RING_WINDOW_MAX_INPUTS} extras={EXTRAS} />;
