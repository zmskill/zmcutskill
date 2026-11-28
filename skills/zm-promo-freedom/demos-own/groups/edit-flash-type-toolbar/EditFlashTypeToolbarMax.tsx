// 上限文案验证用（build-own-shots 第 3.5 步）：每个文字字段写到合同上限、停留区拉满
import React from 'react';
import {EditInputs, EditFlashTypeToolbarGroup, editFrames, planEdit, EDIT_FLASH_TYPE_TOOLBAR_CONTRACT} from './EditFlashTypeToolbar';

export const EDIT_MAX_INPUTS: EditInputs = {
  line1: ['每一个页面', '都能改'], flash: '马上生效', typed: '直接留下评论', pageTitle: '这周家庭菜单',
  cards: ['妈妈拿手糖醋里脊', '周日红烧小排骨', '十五分钟家常小炒'], comments: ['周六这道我来做，记得买里脊', '排骨记得提前焯水，少放点糖'],
}; // 8 / 4 / 6 / 6 / 各 ≤8 / 各 ≤14
const C = EDIT_FLASH_TYPE_TOOLBAR_CONTRACT;
const FULL = C.sourceDuration + C.holds.reduce((a, h) => a + h.maxExtra, 0);
const EXTRAS = planEdit(FULL);
export const EDIT_FLASH_TYPE_TOOLBAR_MAX_DURATION = editFrames(EXTRAS);
export const EditFlashTypeToolbarMax: React.FC = () => <EditFlashTypeToolbarGroup inputs={EDIT_MAX_INPUTS} extras={EXTRAS} />;
