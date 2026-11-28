// 小零件：打勾 · 彩纸 · "已完成"胶囊（74 帧，2.5 秒）
// 只播 TaskCardThreeVerbs 的第 296–370 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/ui-entrance/task-card-three-verbs/TaskCardThreeVerbs.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {TaskCardThreeVerbs as Source} from '../../ui-entrance/task-card-three-verbs/TaskCardThreeVerbs'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const CHECK_CONFETTI_DONE_DURATION = 74;
export const CheckConfettiDone_RANGE = [296, 370] as const; // 在原镜头里的起止帧

export const CheckConfettiDone: React.FC = () => (
  <Sequence from={-296} durationInFrames={370} layout="none">
    <Source />
  </Sequence>
);
