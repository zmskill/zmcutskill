// 小零件：滚词 · 侧卡滑入改一个值（62 帧，2.1 秒）
// 只播 TaskCardThreeVerbs 的第 234–296 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/ui-entrance/task-card-three-verbs/TaskCardThreeVerbs.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {TaskCardThreeVerbs as Source} from '../../ui-entrance/task-card-three-verbs/TaskCardThreeVerbs'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const WORD_ROLL_SIDE_CARD_EDIT_DURATION = 62;
export const WordRollSideCardEdit_RANGE = [234, 296] as const; // 在原镜头里的起止帧

export const WordRollSideCardEdit: React.FC = () => (
  <Sequence from={-234} durationInFrames={296} layout="none">
    <Source />
  </Sequence>
);
