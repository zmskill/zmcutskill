// 小零件：手机冲到镜头前 · 抛起落下（30 帧，1.0 秒）
// 只播 CardRainPixelWord 的第 0–30 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/card-rain-pixel-word/CardRainPixelWord.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {CardRainPixelWord as Source} from '../../groups/card-rain-pixel-word/CardRainPixelWord'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const PHONE_RUSH_TOSS_DURATION = 30;
export const PhoneRushToss_RANGE = [0, 30] as const; // 在原镜头里的起止帧

export const PhoneRushToss: React.FC = () => (
  <Sequence from={-0} durationInFrames={30} layout="none">
    <Source />
  </Sequence>
);
