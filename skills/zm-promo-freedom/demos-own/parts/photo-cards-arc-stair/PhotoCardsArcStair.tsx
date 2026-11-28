// 小零件：照片卡沿弧线一张张排成台阶（147 帧，4.9 秒）
// 只播 DotArcCardStair 的第 60–207 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/dot-arc-card-stair/DotArcCardStair.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {DotArcCardStair as Source} from '../../groups/dot-arc-card-stair/DotArcCardStair'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const PHOTO_CARDS_ARC_STAIR_DURATION = 147;
export const PhotoCardsArcStair_RANGE = [60, 207] as const; // 在原镜头里的起止帧

export const PhotoCardsArcStair: React.FC = () => (
  <Sequence from={-60} durationInFrames={207} layout="none">
    <Source />
  </Sequence>
);
