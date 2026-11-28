// 小零件：收成同心圆 · 蓝色一句话逐词出（87 帧，2.9 秒）
// 只播 GiantWordLensEarLogo 的第 90–177 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/giant-word-lens-ear-logo/GiantWordLensEarLogo.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {GiantWordLensEarLogo as Source} from '../../groups/giant-word-lens-ear-logo/GiantWordLensEarLogo'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const RINGS_BLUE_LINE_URL_DURATION = 87;
export const RingsBlueLineUrl_RANGE = [90, 177] as const; // 在原镜头里的起止帧

export const RingsBlueLineUrl: React.FC = () => (
  <Sequence from={-90} durationInFrames={177} layout="none">
    <Source />
  </Sequence>
);
