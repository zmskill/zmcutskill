// 小零件：发光条伸出 · 灰条长出 · 对比图成形（128 帧，4.3 秒）
// 整个镜头就是这一个动作：GlowBarBenchmark 从头播到尾，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/glow-bar-benchmark/GlowBarBenchmark.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {GlowBarBenchmark as Source} from '../../groups/glow-bar-benchmark/GlowBarBenchmark'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const GLOW_BAR_BENCHMARK_DURATION = 128;
export const GlowBarBenchmark_RANGE = [0, 128] as const; // 在原镜头里的起止帧

export const GlowBarBenchmark: React.FC = () => (
  <Sequence from={-0} durationInFrames={128} layout="none">
    <Source />
  </Sequence>
);
