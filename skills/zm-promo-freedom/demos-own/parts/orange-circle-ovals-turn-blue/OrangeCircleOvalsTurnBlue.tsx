// 小零件：橙圆里冒字 · 挤出椭圆串变蓝（72 帧，2.4 秒）
// 只播 CircleTrainAskStudy 的第 0–72 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/circle-train-ask-study/CircleTrainAskStudy.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {CircleTrainAskStudy as Source} from '../../groups/circle-train-ask-study/CircleTrainAskStudy'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const ORANGE_CIRCLE_OVALS_TURN_BLUE_DURATION = 72;
export const OrangeCircleOvalsTurnBlue_RANGE = [0, 72] as const; // 在原镜头里的起止帧

export const OrangeCircleOvalsTurnBlue: React.FC = () => (
  <Sequence from={-0} durationInFrames={72} layout="none">
    <Source />
  </Sequence>
);
