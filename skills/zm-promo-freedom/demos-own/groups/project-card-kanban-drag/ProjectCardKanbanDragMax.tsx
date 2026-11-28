// 上限文案验证用（build-own-shots 第 3.5 步）：每个文字字段写到合同上限、停留区拉满
import React from 'react';
import {KanbanInputs, ProjectCardKanbanDragGroup, kanbanFrames, planKanban, PROJECT_CARD_KANBAN_DRAG_CONTRACT} from './ProjectCardKanbanDrag';

export const KANBAN_MAX_INPUTS: KanbanInputs = {
  line1: '每一个大小项目，', line2: '都安排得清清楚楚', // 8 / 8 字
  button: '新建项目', // 4 字
  project: '新家搬家准备', meta: '18/25 件 · 本周六前务必全部完成', // 6 / 20 字
  columns: ['还没开始', '正在进行', '全部完成'], // 各 4 字
  todo: [{title: '联系搬家公司比比价', sub: '搬家 · 周六上午'}, {title: '打包书柜和衣柜衣服', sub: '搬家 · 4 个箱子'}], // 各 9 字
  doing: [{title: '把旧家具挂二手平台', sub: '家里 · 送人或卖掉'}],
  done: [{title: '看房签约交好押金了', sub: '搬家 · 已完成'}, {title: '买纸箱胶带和记号笔', sub: '采购 · 已完成'}],
  progressTo: 100,
};
const C = PROJECT_CARD_KANBAN_DRAG_CONTRACT;
const FULL = C.sourceDuration + C.holds.reduce((a, h) => a + h.maxExtra, 0);
const EXTRAS = planKanban(FULL);
export const PROJECT_CARD_KANBAN_DRAG_MAX_DURATION = kanbanFrames(EXTRAS);
export const ProjectCardKanbanDragMax: React.FC = () => <ProjectCardKanbanDragGroup inputs={KANBAN_MAX_INPUTS} extras={EXTRAS} />;
