// 小零件：小蓝星引着引导词 · 右边词槽竖着滚（147 帧，4.9 秒）
// 整个镜头就是这一个动作：StarLeadWordRoll 从头播到尾，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/groups/star-lead-word-roll/StarLeadWordRoll.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {StarLeadWordRoll as Source} from '../../groups/star-lead-word-roll/StarLeadWordRoll'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const STAR_LEAD_WORD_ROLL_DURATION = 147;
export const StarLeadWordRoll_RANGE = [0, 147] as const; // 在原镜头里的起止帧

export const StarLeadWordRoll: React.FC = () => (
  <Sequence from={-0} durationInFrames={147} layout="none">
    <Source />
  </Sequence>
);
