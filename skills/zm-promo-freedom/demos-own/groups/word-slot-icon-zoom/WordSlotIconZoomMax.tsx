// 上限文案验证用（build-own-shots 第 3.5 步）：每个文字字段写到合同上限、停留区拉满
import React from 'react';
import {WORD_SLOT_ICON_ZOOM_CONTRACT, WordSlotIconZoomGroup, WsizInputs, planWsiz, wsizFrames} from './WordSlotIconZoom';

export const WSIZ_MAX_INPUTS: WsizInputs = {
  brand: 'Nimbo 2', lead: '都能帮你',
  items: ['登录各网站', '收发新消息', '用内部工具', '在线付款', '播放视频', '写各种文档', '做数据表格', '做演示文稿'],
};
const C = WORD_SLOT_ICON_ZOOM_CONTRACT;
const FULL = C.sourceDuration + C.holds.reduce((a, h) => a + h.maxExtra, 0);
const EXTRAS = planWsiz(FULL);
export const WORD_SLOT_ICON_ZOOM_MAX_DURATION = wsizFrames(EXTRAS);
export const WordSlotIconZoomMax: React.FC = () => <WordSlotIconZoomGroup inputs={WSIZ_MAX_INPUTS} extras={EXTRAS} />;
