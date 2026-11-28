// 小零件：四角星长出输入胶囊 · 打一句提问 · 出答案卡（141 帧，4.7 秒）
// 整个镜头就是这一个动作：StarPillAnswerCards 从头播到尾，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/star-pill-answer-cards/StarPillAnswerCards.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {StarPillAnswerCards as Source} from '../../groups/star-pill-answer-cards/StarPillAnswerCards'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const STAR_PILL_ANSWER_CARDS_DURATION = 141;
export const StarPillAnswerCards_RANGE = [0, 141] as const; // 在原镜头里的起止帧

export const StarPillAnswerCards: React.FC = () => (
  <Sequence from={-0} durationInFrames={141} layout="none">
    <Source />
  </Sequence>
);
