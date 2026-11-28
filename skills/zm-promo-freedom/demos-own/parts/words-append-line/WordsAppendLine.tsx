// 小零件：逐词追加 · 整行一直居中（45 帧，1.5 秒）
// 只播 OrbRelayExplainer 的第 238–283 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/opening/orb-relay-explainer/OrbRelayExplainer.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {OrbRelayExplainer as Source} from '../../opening/orb-relay-explainer/OrbRelayExplainer'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const WORDS_APPEND_LINE_DURATION = 45;
export const WordsAppendLine_RANGE = [238, 283] as const; // 在原镜头里的起止帧

export const WordsAppendLine: React.FC = () => (
  <Sequence from={-238} durationInFrames={283} layout="none">
    <Source />
  </Sequence>
);
