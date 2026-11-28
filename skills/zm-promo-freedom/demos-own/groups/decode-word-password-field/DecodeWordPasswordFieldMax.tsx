// 上限文案验证用（build-own-shots 第 3.5 步）：每个文字字段写到合同上限、停留区拉满
import React from 'react';
import {DECODE_WORD_PASSWORD_FIELD_CONTRACT, DecodeWordPasswordFieldGroup, DwpfInputs, dwpfFrames, planDwpf} from './DecodeWordPasswordField';

export const DWPF_MAX_INPUTS: DwpfInputs = {lead1: '全部都在', lead2: '本机跑', local: '本地上', secure: '全加密', brand: 'Nimbo 2', mid: '绝不会让', ai: 'AI', field: '读取你保存的所有密码'.slice(0, 9)};
const C = DECODE_WORD_PASSWORD_FIELD_CONTRACT;
const FULL = C.sourceDuration + C.holds.reduce((a, h) => a + h.maxExtra, 0);
const EXTRAS = planDwpf(FULL);
export const DECODE_WORD_PASSWORD_FIELD_MAX_DURATION = dwpfFrames(EXTRAS);
export const DecodeWordPasswordFieldMax: React.FC = () => <DecodeWordPasswordFieldGroup inputs={DWPF_MAX_INPUTS} extras={EXTRAS} />;
