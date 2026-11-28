// 小零件：小球分成三个功能图标 · 再合成一个应用（129 帧，4.3 秒）
// 整个镜头就是这一个动作：OrbSplitThreeOneApp 从头播到尾，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/orb-split-three-one-app/OrbSplitThreeOneApp.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {OrbSplitThreeOneApp as Source} from '../../groups/orb-split-three-one-app/OrbSplitThreeOneApp'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const ORB_SPLIT_THREE_ONE_APP_DURATION = 129;
export const OrbSplitThreeOneApp_RANGE = [0, 129] as const; // 在原镜头里的起止帧

export const OrbSplitThreeOneApp: React.FC = () => (
  <Sequence from={-0} durationInFrames={129} layout="none">
    <Source />
  </Sequence>
);
