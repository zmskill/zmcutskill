// 小零件：超大字 · 小词轮换 · 点阵环炸开成人脸（111 帧，3.7 秒）
// 只播 CircleMorphListen 的第 87–198 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/circle-morph-listen/CircleMorphListen.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {CircleMorphListen as Source} from '../../groups/circle-morph-listen/CircleMorphListen'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const GIANT_WORD_DOT_RINGS_FACES_DURATION = 111;
export const GiantWordDotRingsFaces_RANGE = [87, 198] as const; // 在原镜头里的起止帧

export const GiantWordDotRingsFaces: React.FC = () => (
  <Sequence from={-87} durationInFrames={198} layout="none">
    <Source />
  </Sequence>
);
