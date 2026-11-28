// 小零件：最后一句大字 · 像素块闪掉（57 帧，1.9 秒）
// 只播 RedBubbleStackPain 的第 193–250 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/red-bubble-stack-pain/RedBubbleStackPain.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {RedBubbleStackPain as Source} from '../../groups/red-bubble-stack-pain/RedBubbleStackPain'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const BIG_LINE_PIXEL_DROP_OUT_DURATION = 57;
export const BigLinePixelDropOut_RANGE = [193, 250] as const; // 在原镜头里的起止帧

export const BigLinePixelDropOut: React.FC = () => (
  <Sequence from={-193} durationInFrames={250} layout="none">
    <Source />
  </Sequence>
);
