// 小零件：「生成中」大按钮 · 流光一呼一吸（81 帧，2.7 秒）
// 整个镜头就是这一个动作：GeneratingStudio 从头播到尾，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/generating-studio/GeneratingStudio.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {GeneratingStudio as Source} from '../../groups/generating-studio/GeneratingStudio'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const GENERATING_STUDIO_DURATION = 81;
export const GeneratingStudio_RANGE = [0, 81] as const; // 在原镜头里的起止帧

export const GeneratingStudio: React.FC = () => (
  <Sequence from={-0} durationInFrames={81} layout="none">
    <Source />
  </Sequence>
);
