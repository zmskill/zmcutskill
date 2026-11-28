// 小零件：圆点滑过 · 一句话浮出 · 圆点绕着字跑（60 帧，2.0 秒）
// 只播 DotArcCardStair 的第 0–60 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/dot-arc-card-stair/DotArcCardStair.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {DotArcCardStair as Source} from '../../groups/dot-arc-card-stair/DotArcCardStair'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const DOT_ORBIT_SENTENCE_DURATION = 60;
export const DotOrbitSentence_RANGE = [0, 60] as const; // 在原镜头里的起止帧

export const DotOrbitSentence: React.FC = () => (
  <Sequence from={-0} durationInFrames={60} layout="none">
    <Source />
  </Sequence>
);
