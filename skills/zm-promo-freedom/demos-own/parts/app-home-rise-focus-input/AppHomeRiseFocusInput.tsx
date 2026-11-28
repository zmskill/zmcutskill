// 小零件：App 首页一层层升起 · 只留输入框（55 帧，1.8 秒）
// 只播 PromptSendRingsCard 的第 0–55 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/prompt-send-rings-card/PromptSendRingsCard.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {PromptSendRingsCard as Source} from '../../groups/prompt-send-rings-card/PromptSendRingsCard'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const APP_HOME_RISE_FOCUS_INPUT_DURATION = 55;
export const AppHomeRiseFocusInput_RANGE = [0, 55] as const; // 在原镜头里的起止帧

export const AppHomeRiseFocusInput: React.FC = () => (
  <Sequence from={-0} durationInFrames={55} layout="none">
    <Source />
  </Sequence>
);
