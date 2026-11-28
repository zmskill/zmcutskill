// 小零件：卡片一张张消失 · 白块长成一个大字（89 帧，3.0 秒）
// 只播 CardRainPixelWord 的第 94–183 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/card-rain-pixel-word/CardRainPixelWord.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {CardRainPixelWord as Source} from '../../groups/card-rain-pixel-word/CardRainPixelWord'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const GLITCH_BLOCKS_GROW_WORD_DURATION = 89;
export const GlitchBlocksGrowWord_RANGE = [94, 183] as const; // 在原镜头里的起止帧

export const GlitchBlocksGrowWord: React.FC = () => (
  <Sequence from={-94} durationInFrames={183} layout="none">
    <Source />
  </Sequence>
);
