// 小零件：推近输入框 · 发光打字 · 点发送（95 帧，3.2 秒）
// 只播 PromptSendRingsCard 的第 55–150 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/prompt-send-rings-card/PromptSendRingsCard.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {PromptSendRingsCard as Source} from '../../groups/prompt-send-rings-card/PromptSendRingsCard'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const INPUT_GLOW_TYPE_SEND_DURATION = 95;
export const InputGlowTypeSend_RANGE = [55, 150] as const; // 在原镜头里的起止帧

export const InputGlowTypeSend: React.FC = () => (
  <Sequence from={-55} durationInFrames={150} layout="none">
    <Source />
  </Sequence>
);
