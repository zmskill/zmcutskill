// 小零件：上百张小卡从天而降 · 堆满整屏（64 帧，2.1 秒）
// 只播 CardRainPixelWord 的第 30–94 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/card-rain-pixel-word/CardRainPixelWord.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {CardRainPixelWord as Source} from '../../groups/card-rain-pixel-word/CardRainPixelWord'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const CARD_RAIN_PILE_UP_DURATION = 64;
export const CardRainPileUp_RANGE = [30, 94] as const; // 在原镜头里的起止帧

export const CardRainPileUp: React.FC = () => (
  <Sequence from={-30} durationInFrames={94} layout="none">
    <Source />
  </Sequence>
);
