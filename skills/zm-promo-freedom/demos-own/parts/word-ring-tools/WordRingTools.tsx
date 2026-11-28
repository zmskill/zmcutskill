// 小零件：状态词删了重打 · 工具图标围成环（144 帧，4.8 秒）
// 整个镜头就是这一个动作：WordRingTools 从头播到尾，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/word-ring-tools/WordRingTools.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {WordRingTools as Source} from '../../groups/word-ring-tools/WordRingTools'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const WORD_RING_TOOLS_DURATION = 144;
export const WordRingTools_RANGE = [0, 144] as const; // 在原镜头里的起止帧

export const WordRingTools: React.FC = () => (
  <Sequence from={-0} durationInFrames={144} layout="none">
    <Source />
  </Sequence>
);
