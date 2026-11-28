// 小零件：大字拉远成输入框 · 点发送被吸进去（128 帧，4.3 秒）
// 只播 PromptPagesPillReveal 的第 0–128 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/opening/prompt-pages-pill-reveal/PromptPagesPillReveal.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {PromptPagesPillReveal as Source} from '../../opening/prompt-pages-pill-reveal/PromptPagesPillReveal'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const BIG_TYPE_ZOOMOUT_SEND_DURATION = 128;
export const BigTypeZoomoutSend_RANGE = [0, 128] as const; // 在原镜头里的起止帧

export const BigTypeZoomoutSend: React.FC = () => (
  <Sequence from={-0} durationInFrames={128} layout="none">
    <Source />
  </Sequence>
);
