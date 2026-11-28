// 小零件：页面从一个点弹出 · 散成四页（97 帧，3.2 秒）
// 只播 PromptPagesPillReveal 的第 125–222 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/opening/prompt-pages-pill-reveal/PromptPagesPillReveal.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {PromptPagesPillReveal as Source} from '../../opening/prompt-pages-pill-reveal/PromptPagesPillReveal'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const PAGES_POP_FAN_OUT_DURATION = 97;
export const PagesPopFanOut_RANGE = [125, 222] as const; // 在原镜头里的起止帧

export const PagesPopFanOut: React.FC = () => (
  <Sequence from={-125} durationInFrames={222} layout="none">
    <Source />
  </Sequence>
);
