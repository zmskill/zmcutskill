// 小零件：逐词字卡 · 词浮上来变实（56 帧，1.9 秒）
// 只播 PromptToSiteWall 的第 220–276 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/ui-entrance/prompt-to-site-wall/PromptToSiteWall.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {PromptToSiteWall as Source} from '../../ui-entrance/prompt-to-site-wall/PromptToSiteWall'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const WORD_CARD_RISE_DURATION = 56;
export const WordCardRise_RANGE = [220, 276] as const; // 在原镜头里的起止帧

export const WordCardRise: React.FC = () => (
  <Sequence from={-220} durationInFrames={276} layout="none">
    <Source />
  </Sequence>
);
