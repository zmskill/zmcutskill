// 小零件：大黑字打出 · 缩小变灰 · 彩字糊入（57 帧，1.9 秒）
// 只播 TypeGlowList 的第 0–57 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/type-glow-list/TypeGlowList.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {TypeGlowList as Source} from '../../groups/type-glow-list/TypeGlowList'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const TYPE_SHRINK_GLOW_LINE_DURATION = 57;
export const TypeShrinkGlowLine_RANGE = [0, 57] as const; // 在原镜头里的起止帧

export const TypeShrinkGlowLine: React.FC = () => (
  <Sequence from={-0} durationInFrames={57} layout="none">
    <Source />
  </Sequence>
);
