// 上限文案验证用（build-own-shots 第 3.5 步）：每个文字字段写到合同上限、停留区拉满
import React from 'react';
import {SCDT_DEFAULT_INPUTS, STOP_CHAT_DRAG_TRASH_CONTRACT, ScdtInputs, StopChatDragTrashGroup, planScdt, scdtFrames} from './StopChatDragTrash';

export const SCDT_MAX_INPUTS: ScdtInputs = {
  ...SCDT_DEFAULT_INPUTS,
  lead: '最后', line1: ['一到真正', '要紧时'], line2: ['它们全', '都停了'],
  placeholder: '问点什么吧…', ask: '你为什么又停下了',
  replies: ['这件事我做不了的', '请你先批准此操作', '我没办法登录网站', '敏感的操作做不了'],
};
const C = STOP_CHAT_DRAG_TRASH_CONTRACT;
const FULL = C.sourceDuration + C.holds.reduce((a, h) => a + h.maxExtra, 0);
const EXTRAS = planScdt(FULL);
export const STOP_CHAT_DRAG_TRASH_MAX_DURATION = scdtFrames(EXTRAS);
export const StopChatDragTrashMax: React.FC = () => <StopChatDragTrashGroup inputs={SCDT_MAX_INPUTS} extras={EXTRAS} />;
