// 小零件：「生成」按钮特写按下 · 点阵波纹（87 帧，2.9 秒）
// 只播 CodeFlythroughGenerate 的第 123–210 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/code-flythrough-generate/CodeFlythroughGenerate.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {CodeFlythroughGenerate as Source} from '../../groups/code-flythrough-generate/CodeFlythroughGenerate'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const GENERATE_BUTTON_PRESS_DOT_WAVE_DURATION = 87;
export const GenerateButtonPressDotWave_RANGE = [123, 210] as const; // 在原镜头里的起止帧

export const GenerateButtonPressDotWave: React.FC = () => (
  <Sequence from={-123} durationInFrames={210} layout="none">
    <Source />
  </Sequence>
);
