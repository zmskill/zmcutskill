// 小零件："隆重介绍" · 冲进字缝 · 产品名升起（140 帧，4.7 秒）
// 只播 PromptPagesPillReveal 的第 316–456 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/opening/prompt-pages-pill-reveal/PromptPagesPillReveal.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {PromptPagesPillReveal as Source} from '../../opening/prompt-pages-pill-reveal/PromptPagesPillReveal'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const STAR_INTRO_NAME_LOCKUP_DURATION = 140;
export const StarIntroNameLockup_RANGE = [316, 456] as const; // 在原镜头里的起止帧

export const StarIntroNameLockup: React.FC = () => (
  <Sequence from={-316} durationInFrames={456} layout="none">
    <Source />
  </Sequence>
);
