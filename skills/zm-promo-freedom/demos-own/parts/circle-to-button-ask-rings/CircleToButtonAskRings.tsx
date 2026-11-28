// 小零件：圆缩成按钮 · 输入框打问题 · 点发送起涟漪（138 帧，4.6 秒）
// 只播 CircleTrainAskStudy 的第 72–210 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/circle-train-ask-study/CircleTrainAskStudy.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {CircleTrainAskStudy as Source} from '../../groups/circle-train-ask-study/CircleTrainAskStudy'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const CIRCLE_TO_BUTTON_ASK_RINGS_DURATION = 138;
export const CircleToButtonAskRings_RANGE = [72, 210] as const; // 在原镜头里的起止帧

export const CircleToButtonAskRings: React.FC = () => (
  <Sequence from={-72} durationInFrames={210} layout="none">
    <Source />
  </Sequence>
);
