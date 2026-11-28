// 上限文案验证用（build-own-shots 第 3.5 步）：每个文字字段写到合同上限、停留区拉满
import React from 'react';
import {TaskVerbsInputs, TaskCardThreeVerbsGroup, taskVerbsFrames, planTaskVerbs, TASK_CARD_THREE_VERBS_CONTRACT} from './TaskCardThreeVerbs';

export const TASK_VERBS_MAX_INPUTS: TaskVerbsInputs = {
  line1: '只要随口说句话，', line2: '几秒钟就建好一件事。', verbs: ['排一排序', '改一改它', '勾选完成'],
  input: '下周六上午10点去取干洗的大衣', tagTime: '下周六10:00', tagList: '家务事', tagLevel: '很重要',
  task: '取回干洗的大衣服', others: ['给房东转这月房租', '去超市买一袋猫粮'], newTime: '下周六11:30',
};
const C = TASK_CARD_THREE_VERBS_CONTRACT;
const EXTRAS = planTaskVerbs(C.sourceDuration + C.holds.reduce((a, h) => a + h.maxExtra, 0));
export const TASK_CARD_THREE_VERBS_MAX_DURATION = taskVerbsFrames(EXTRAS);
export const TaskCardThreeVerbsMax: React.FC = () => <TaskCardThreeVerbsGroup inputs={TASK_VERBS_MAX_INPUTS} extras={EXTRAS} />;
