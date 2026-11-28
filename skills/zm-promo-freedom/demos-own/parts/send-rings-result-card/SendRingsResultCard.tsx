// 小零件：发送键圆环扩散 · 出成品卡（63 帧，2.1 秒）
// 只播 PromptSendRingsCard 的第 150–213 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/prompt-send-rings-card/PromptSendRingsCard.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {PromptSendRingsCard as Source} from '../../groups/prompt-send-rings-card/PromptSendRingsCard'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const SEND_RINGS_RESULT_CARD_DURATION = 63;
export const SendRingsResultCard_RANGE = [150, 213] as const; // 在原镜头里的起止帧

export const SendRingsResultCard: React.FC = () => (
  <Sequence from={-150} durationInFrames={213} layout="none">
    <Source />
  </Sequence>
);
