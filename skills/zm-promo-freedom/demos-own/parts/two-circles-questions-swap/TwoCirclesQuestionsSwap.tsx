// 小零件：两个蓝圆并排 · 里面的问题换两次（60 帧，2.0 秒）
// 只播 CircleTrainAskStudy 的第 210–270 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/circle-train-ask-study/CircleTrainAskStudy.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {CircleTrainAskStudy as Source} from '../../groups/circle-train-ask-study/CircleTrainAskStudy'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const TWO_CIRCLES_QUESTIONS_SWAP_DURATION = 60;
export const TwoCirclesQuestionsSwap_RANGE = [210, 270] as const; // 在原镜头里的起止帧

export const TwoCirclesQuestionsSwap: React.FC = () => (
  <Sequence from={-210} durationInFrames={270} layout="none">
    <Source />
  </Sequence>
);
