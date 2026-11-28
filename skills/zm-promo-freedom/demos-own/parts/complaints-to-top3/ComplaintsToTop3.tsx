// 小零件：挑中的展开 · 收成"最痛的 3 条"（174 帧，5.8 秒）
// 只播 ComplaintWallPick 的第 158–332 帧，动画是原镜头的，这里不改。要换内容、读参数，去看原镜头：demos-own/ui-entrance/complaint-wall-pick/ComplaintWallPick.tsx
// 由 tools/shot-lab/build_parts.py 按 demos-own/parts/parts.py 生成，别手改。
import React from 'react';
import {Sequence} from 'remotion';
import {ComplaintWallPick as Source} from '../../ui-entrance/complaint-wall-pick/ComplaintWallPick'; // 起个别名：零件名和原镜头同名时不会自己套自己

export const COMPLAINTS_TO_TOP3_DURATION = 174;
export const ComplaintsToTop3_RANGE = [158, 332] as const; // 在原镜头里的起止帧

export const ComplaintsToTop3: React.FC = () => (
  <Sequence from={-158} durationInFrames={332} layout="none">
    <Source />
  </Sequence>
);
