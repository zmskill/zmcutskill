// 小零件：大字飞来 · 柔边擦掉 · 胶囊撑开一句话（108 帧，3.6 秒）
// 只播 PromptPagesPillReveal 的第 213–321 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/opening/prompt-pages-pill-reveal/PromptPagesPillReveal.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {PromptPagesPillReveal as Source} from '../../opening/prompt-pages-pill-reveal/PromptPagesPillReveal'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const WORDS_FLY_PILL_OPEN_DURATION = 108;
export const WordsFlyPillOpen_RANGE = [213, 321] as const; // 在原镜头里的起止帧

export const WordsFlyPillOpen: React.FC = () => (
  <Sequence from={-213} durationInFrames={321} layout="none">
    <Source />
  </Sequence>
);
