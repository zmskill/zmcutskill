// 小零件：蓝色弧光扫过 · 星标和名字由糊变清（96 帧，3.2 秒）
// 整个镜头就是这一个动作：ArcSweepWordmark 从头播到尾，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/arc-sweep-wordmark/ArcSweepWordmark.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {ArcSweepWordmark as Source} from '../../groups/arc-sweep-wordmark/ArcSweepWordmark'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const ARC_SWEEP_WORDMARK_DURATION = 96;
export const ArcSweepWordmark_RANGE = [0, 96] as const; // 在原镜头里的起止帧

export const ArcSweepWordmark: React.FC = () => (
  <Sequence from={-0} durationInFrames={96} layout="none">
    <Source />
  </Sequence>
);
