// 小零件：卡里打字变宽 · 变成横贯全屏的黑条（140 帧，4.7 秒）
// 整个镜头就是这一个动作：StripPixelEndcard 从头播到尾，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/strip-pixel-endcard/StripPixelEndcard.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {StripPixelEndcard as Source} from '../../groups/strip-pixel-endcard/StripPixelEndcard'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const STRIP_PIXEL_ENDCARD_DURATION = 140;
export const StripPixelEndcard_RANGE = [0, 140] as const; // 在原镜头里的起止帧

export const StripPixelEndcard: React.FC = () => (
  <Sequence from={-0} durationInFrames={140} layout="none">
    <Source />
  </Sequence>
);
