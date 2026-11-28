// 小零件：撑满屏的大字滑过 · 第二个词两行挤进来（144 帧，4.8 秒）
// 整个镜头就是这一个动作：GiantWordStackFaces 从头播到尾，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/giant-word-stack-faces/GiantWordStackFaces.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {GiantWordStackFaces as Source} from '../../groups/giant-word-stack-faces/GiantWordStackFaces'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const GIANT_WORD_STACK_FACES_DURATION = 144;
export const GiantWordStackFaces_RANGE = [0, 144] as const; // 在原镜头里的起止帧

export const GiantWordStackFaces: React.FC = () => (
  <Sequence from={-0} durationInFrames={144} layout="none">
    <Source />
  </Sequence>
);
